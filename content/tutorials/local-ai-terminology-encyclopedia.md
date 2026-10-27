---
id: "local-ai-terminology-encyclopedia"
title: "本地 AI 模型名詞百科：視覺化互動簡報"
type: "tutorial"
category: "Local AI"
summary: "全方位的邊緣運算與本地開源大模型名詞百科，圖像化拆解 Dense vs MoE 架構、精度量化階級天梯、GGUF 與 Safetensors 生態差異。"
created: "2026-09-24"
updated: "2026-09-24"
version: "1.0"
status: "active"
visibility: "public"
tags: ["本地AI", "開源模型", "GGUF", "量化技術", "MoE", "技術百科"]
tools: ["HTML5", "Ollama", "Llama.cpp", "Transformers"]
cover: "/assets/covers/local-ai-terminology-encyclopedia.png"
playUrl: "/presentations/local-ai-terminology-encyclopedia/slides.html"
featured: false
---

## 本地 AI 模型名詞百科｜開源與邊緣運算核心概念速查

針對開源模型愛好者、自建本地隱私 AI 團隊與邊緣運算工程師打造的名詞百科。本指南全面梳理從模型命名、神經網路架構、權重精度量化到部署檔案格式的所有關鍵概念，協助您在挑選模型與配置硬體時做出最精準的決策。

---

### 核心知識模組深度解析

#### 1. 模型命名學（Decoding Model Names）
* **基礎結構**：`[架構名稱]-[參數總量]-[微調版本]-[精度量化]`（如 `Qwen2.5-7B-Instruct-Q4_K_M.gguf`）。
* **參數規模（Parameters）**：
  * **7B / 8B**：適合單張消費級顯示卡（RTX 4060 / 3060 12GB）流暢運行的輕量模型。
  * **14B / 32B**：在推理精準度與硬體門檻間取得絕佳平衡的中型主力模型。
  * **70B+**：接近甚至匹敵雲端頂級模型的旗艦開源權重，需要雙卡或高階 Mac 統一記憶體支援。
* **版本代碼**：`Base`（基礎預訓練底座，擅長續寫）、`Instruct / Chat`（經指令微調與對齊，適合直接問答）。

#### 2. 架構全景：Dense vs. MoE
* **Dense（稠密架構）**：每個 Token 的生成都啟動神經網路的 100% 參數；優點是結構單純穩定，缺點是記憶體頻寬負擔重。
* **MoE（Mixture of Experts，混合專家架構）**：將模型切分為數十個專家子模組（如 8x7B 或 DeepSeek MoE 架構），每次推論僅動態啟動 2 個或少數活躍專家；在具備數百億龐大參數知識庫的同時，能維持小模型的超高生成速度。

#### 3. 精度與量化階梯（Quantization Hierarchy）
* **FP16 / BF16（全精度 16-bit）**：模型原始出廠狀態，保留完整權重細節，但每 1B 參數約佔用 2GB 顯示記憶體（VRAM）。
* **Q8（8-bit 量化）**：近乎零損失的精度壓縮，節省約 50% 記憶體。
* **Q4_K_M（4-bit 主流量化首選）**：目前開源社群性價比最高的量化甜點點，品質損失在 1% 以內，能將 7B 模型壓至 4.5GB，讓普羅大眾電腦輕鬆運行。
* **Q2 / 2-bit 極限量化**：透過進階技術將權重壓至極小，適合記憶體嚴重受限的極限邊緣設備。

#### 4. 檔案格式與生態系選型
* **GGUF**：由 llama.cpp 專案創立的單檔二進位格式，專為 CPU + GPU 混合推論設計，廣受 Ollama、LM Studio 等在地工具支援。
* **Safetensors**：由 Hugging Face 推出的原生防程式碼注入格式，專為 GPU 叢集與高速權重載入設計，是雲端微調與原生推論標準。
