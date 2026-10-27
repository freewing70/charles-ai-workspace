---
id: "local-llm-deployment-vllm-ollama"
title: "2026 本地開源大模型部署與顯存優化實戰指南：從 Ollama 到 vLLM 高併發推理"
type: "tutorial"
category: "LLM Infrastructure"
summary: "深入剖析本地開源大語言模型部署架構，詳細對比 Ollama 輕量級場景與 vLLM 高併發生產架構。涵蓋 PagedAttention 顯存管理、AWQ/GPTQ/GGUF 量化精度損耗評估、多 GPU 張量並行配置與端到端 API 整合。"
created: "2026-10-21"
updated: "2026-10-21"
version: "1.0"
status: "active"
visibility: "public"
tags: ["本地大模型", "vLLM", "Ollama", "PagedAttention", "模型量化", "顯存優化", "高併發推理", "張量並行"]
tools: ["vLLM", "Ollama", "Docker", "FastAPI", "HuggingFace", "Python", "CUDA"]
cover: "/assets/covers/local-llm-deployment-vllm-ollama.svg"
featured: false
---

## 為什麼需要自建本地開源大模型基礎設施？

在 2026 年的企業 AI 落地浪潮中，商業封閉 API（如 OpenAI、Anthropic、Google Gemini）無疑具備頂級的通用智慧與零維運優勢。然而，隨著企業應用逐步邁入核心業務流程，純商業 API 面臨以下三大瓶頸：

1. **數據合規與隱私安全（Data Sovereignty）**：醫療紀錄、金融交易歷史、半導體製程專利等敏感資訊嚴格禁止傳輸至外部第三方伺服器。
2. **高吞吐推論成本失控**：當業務規模擴張至每日數百萬次調用（如客服日誌分析、代碼靜態掃描、自動化批次處理），按 Token 計費的商業 API 月帳單呈指數級飆升，而專用硬體伺服器的攤提成本在達到臨界點後具備壓倒性的經濟效益。
3. **極致低延遲與確定性 SLA**：公有雲 API 在尖峰時段常因全球流量排隊而出現延遲抖動（Latency Spike），而本地專屬集群可保證 P99 延遲的穩定可控。

本實戰指南將帶領技術架構師與後端工程師，從底層顯存機制出發，逐步搭建具備高可用、高併發能力的本地大模型推理引擎。

---

## 一、顯存（VRAM）計算與量化精度天梯

要成功部署開源模型（如 Llama 3.1、Qwen 2.5、Mistral），第一步是精確計算顯存佔用，避免因 CUDA Out of Memory (OOM) 導致服務崩潰。

### 1. 顯存佔用公式

運行大模型時的總顯存消耗包含三大部分：

$$\text{總顯存} = \text{模型權重顯存} + \text{KV Cache 顯存} + \text{CUDA 運行時與暫存開銷}$$

- **模型權重顯存**：
  $$\text{權重顯存 (GB)} \approx \frac{\text{參數量 (Billion)} \times \text{每個參數位元組數 (Bytes)}}{10^9}$$
  - FP16 / BF16：每個參數佔用 2 Bytes（70B 模型約需 $70 \times 2 = 140\text{ GB}$ 顯存）。
  - INT8：每個參數佔用 1 Byte（70B 模型約需 $70\text{ GB}$ 顯存）。
  - INT4 (AWQ / GPTQ / Q4_K_M)：每個參數佔用約 0.55 Bytes（含量化縮放係數，70B 模型約需 $38\text{ GB}$ 至 $42\text{ GB}$ 顯存）。
- **KV Cache 顯存**：隨併發請求數（Batch Size）與上下文長度（Sequence Length）線性增加。在 8K 或 32K 上下文下，未經優化的 KV Cache 顯存往往會超越模型權重本身。

### 2. 主流量化技術對比天梯

| 量化格式 | 運算硬體相容性 | 速度與吞吐表現 | 困惑度（Perplexity）精度損耗 | 典型適用場景 |
| :--- | :--- | :--- | :--- | :--- |
| **BF16 / FP16** | 現代 NVIDIA GPU 原生 | 基準速度（需充足顯存） | 0%（無損原版） | 精度極度敏感的程式碼生成、數學證明 |
| **AWQ (4-bit)** | 現代 GPU (Ampere/Hopper/Blackwell) | 極快（利用 Tensor Core 核心加速） | 極小（< 1% 精度損耗） | **生產端 GPU 部署首選**（vLLM、TGI 完美支援） |
| **GPTQ (4-bit)** | 跨世代 GPU 廣泛相容 | 快 | 極小（約 1-2% 精度損耗） | 普及率高、現成 HuggingFace 權重豐富 |
| **GGUF (Q4/Q5/Q8)** | CPU、Apple Silicon (Metal)、混合顯存 | CPU / 混合推論表現最佳 | 視 Quant 量級（Q5_K_M 損耗極小） | **桌面端、邊緣設備與個人開發首選**（Ollama / Llama.cpp） |

---

## 二、部署選型：Ollama 輕量開發 vs. vLLM 生產架構

在技術選型上，開發者常糾結於「應該用 Ollama 還是 vLLM？」。兩者的定位有著本質差異：

```
[ 開發 / 邊緣場景 ]                          [ 企業級高併發生產架構 ]
  個人開發者 / 筆電 / 邊緣主機                  GPU 伺服器叢集 (A100 / H100 / L40S)
         │                                               │
         ▼                                               ▼
  ┌──────────────┐                              ┌─────────────────┐
  │    Ollama    │                              │      vLLM       │
  │ (Llama.cpp)  │                              │ (PagedAttention)│
  └──────────────┘                              └─────────────────┘
         │                                               │
  • 單用戶或低併發 (Concurrency 1-4)               • 高吞吐連續批次處理 (Continuous Batching)
  • CPU + GPU 記憶體統一卸載 (Unified Memory)      • 多 GPU 張量並行 (Tensor Parallelism)
  • 一鍵拉取、極簡維運                            • OpenAI 相容 API、Prometheus 監控
```

### 1. Ollama：單機開發與輕量內網首選
Ollama 基於 `llama.cpp`，將模型管理簡化為如同 Docker 鏡像一般的體驗。

#### 快速啟動與自定義 Modelfile
```bash
# 下載並啟動 Qwen 2.5 14B 指令微調版
ollama run qwen2.5:14b

# 透過自定義 Modelfile 設定系統角色與 Context Window
cat << 'EOF' > Modelfile
FROM qwen2.5:14b
PARAMETER num_ctx 16384
PARAMETER temperature 0.2
PARAMETER top_p 0.9
SYSTEM """你是一位資深的企業架構師，專精於高併發系統設計。請用繁體中文給出嚴謹、具備程式碼範例的技術回答。"""
EOF

ollama create architect-qwen -f Modelfile
ollama run architect-qwen
```

### 2. vLLM：高併發企業級生產推理引擎
當面對多用戶、API 服務與即時排隊請求時，Ollama 的靜態批處理機制會導致顯存碎片化與 GPU 利用率低落。vLLM 引入了兩大革命性核心技術：

1. **PagedAttention**：借鑑作業系統虛擬記憶體分頁機制，將連續的 KV Cache 切割為不連續的實體記憶體分塊（Physical Memory Blocks），徹底消除內部顯存碎片，將顯存浪費從 60%-80% 降至 4% 以下。
2. **Continuous Batching（連續批次處理）**：不等待整個批次所有請求全部生成結束，而是每個解碼步驟（Iteration-level）即時將已結束的請求移出、新到的請求動態插入，將 GPU 計算單元吞吐量提高 3 至 5 倍。

---

## 三、vLLM 生產級多 GPU 部署實戰

以下展示如何使用 Docker 在包含 2 張 NVIDIA A10G/L40S（每張 24GB VRAM）的伺服器上，部署 **Qwen2.5-32B-Instruct-AWQ** 或 **Llama-3.1-70B-Instruct-AWQ**。

### 1. Docker Compose 生產配置

```yaml
version: '3.8'

services:
  vllm-engine:
    image: vllm/vllm-openai:v0.6.3
    container_name: vllm-qwen-service
    runtime: nvidia
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - HUGGING_FACE_HUB_TOKEN=${HF_TOKEN}
      - NCCL_DEBUG=INFO
    volumes:
      - /data/huggingface/hub:/root/.cache/huggingface/hub
    command: >
      --model Qwen/Qwen2.5-32B-Instruct-AWQ
      --quantization awq
      --tensor-parallel-size 2
      --max-model-len 16384
      --gpu-memory-utilization 0.92
      --swap-space 4
      --disable-log-requests
      --host 0.0.0.0
      --port 8000
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 2
              capabilities: [gpu]
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 2. 核心參數調優解析

- `--tensor-parallel-size 2`：啟用雙卡張量並行（Tensor Parallelism），將注意力矩陣權重橫向切分至 2 張 GPU，顯著降低單卡記憶體上限。
- `--gpu-memory-utilization 0.92`：預留 8% 顯存給 CUDA 上下文，剩餘 92% 顯存全部預先分配給 PagedAttention 的 KV Cache 記憶體池。
- `--max-model-len 16384`：限制最大上下文長度。設定過大會預佔過多 KV Cache 區塊，降低同時服務的併發用戶數。
- `--swap-space 4`：配置 4GB 系統主記憶體（RAM）作為顯存溢出時的二級緩衝交換區。

---

## 四、Python 生產端調用與負載測試

vLLM 原生提供完全相容於 OpenAI 的 API 端點，企業現有程式庫無需做任何重構即可無縫切換。

### 1. 非同步串流調用範例

```python
import asyncio
from openai import AsyncOpenAI

# 指向本地 vLLM 實例
client = AsyncOpenAI(
    base_url="http://localhost:8000/v1",
    api_key="EMPTY"  # vLLM 默認免金鑰，生產環境可透過 Nginx 加掛 Bearer 驗證
)

async def generate_response(prompt: str):
    response = await client.chat.completions.create(
        model="Qwen/Qwen2.5-32B-Instruct-AWQ",
        messages=[
            {"role": "system", "content": "你是一位專業的技術顧問，請條理分明地回答問題。"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=1024,
        stream=True
    )
    
    print("AI 回應: ", end="", flush=True)
    async for chunk in response:
        delta = chunk.choices[0].delta.content
        if delta:
            print(delta, end="", flush=True)
    print("\n")

if __name__ == "__main__":
    asyncio.run(generate_response("請解釋在分布式訓練中，Data Parallelism 與 Tensor Parallelism 的核心差異。"))
```

### 2. 吞吐量壓測指標監控

在生產環境上線前，應使用官方 `benchmark_serving.py` 進行階梯式壓測：

```bash
# 測試 20 個並發用戶在 1000 條隨機長度請求下的處理吞吐
python3 vllm/benchmarks/benchmark_serving.py \
    --backend vllm \
    --model Qwen/Qwen2.5-32B-Instruct-AWQ \
    --dataset-name sharegpt \
    --dataset-path ./ShareGPT_V3_unfiltered_cleaned_split.json \
    --num-prompts 1000 \
    --request-rate 20
```

**關鍵關注指標**：
1. **Time To First Token (TTFT)**：首字延遲，反映 Prefill 階段的計算效能（通常目標為 < 250ms）。
2. **Time Per Output Token (TPOT)**：後續每個 Token 的解碼時間（Decode 階段，目標為 > 30-50 tokens/sec/user）。
3. **Total Throughput**：系統總生成吞吐量（每秒總 Token 產出量）。

---

## 五、企業落地總結架構圖

```
                    ┌─────────────────────────┐
                    │    用戶與業務前端請求   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Nginx 負載均衡 / 認證  │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       ┌──────────────────┐            ┌──────────────────┐
       │   vLLM 節點 01   │            │   vLLM 節點 02   │
       │ (GPU 0, 1 / AWQ) │            │ (GPU 2, 3 / AWQ) │
       └─────────┬────────┘            └─────────┬────────┘
                 │                               │
                 └───────────────┬───────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │ Prometheus + Grafana    │
                    │ 監控：KV Cache 使用率、  │
                    │ 請求排隊長度、GPU 溫度  │
                    └─────────────────────────┘
```

本地部署開源大模型已不再是高不可攀的學術實驗，而是能夠切實為企業節省巨額雲端支出、保障數據絕對安全並實現高吞吐推理的成熟工程方案。透過合理的顯存規劃、AWQ 量化以及 vLLM 的 PagedAttention 機制，一組標準雙卡伺服器即可穩定支撐企業數百位員工的日常 AI 工作流。
