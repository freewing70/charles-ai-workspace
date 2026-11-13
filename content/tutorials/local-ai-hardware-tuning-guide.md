---
id: "local-ai-hardware-tuning-guide"
title: "你的電腦能跑什麼 AI？16GB 到 128GB 本地 AI 硬體與調校實戰手冊"
type: "tutorial"
category: "Local AI & Infrastructure"
summary: "本地端 AI 硬體與調校互動式教學手冊：內建「我的電腦能跑什麼 AI」記憶體與 Context 診斷計算機，教你用 4-bit 黃金公式估算記憶體、16GB~128GB 模型選型、Ollama 與 LM Studio 64k Context 設定，以及新手最常踩的五個坑與黃金七法則。"
created: "2026-11-08"
updated: "2026-11-08"
version: "1.0"
status: "active"
visibility: "public"
tags: ["Local LLM", "Ollama", "LM Studio", "llama.cpp", "VRAM估算", "MoE模型", "AI Agent", "硬體選型"]
tools: ["Ollama", "LM Studio", "llama.cpp", "Apple MLX", "Q4_K_M"]
cover: "/assets/covers/local-ai-hardware-tuning-guide.png"
featured: true
---

## 你的電腦能跑什麼 AI？16GB 到 128GB 一次講完

很多人興沖沖下載了 Ollama 或 LM Studio，接上 Agent 卻發現 AI 像個智障、瘋狂失憶或卡成打字機。**其實你的本地 AI 不笨，往往是設定錯了！**本手冊帶你從記憶體黃金估算公式出發，一次搞懂 16GB～128GB 選型、MoE 加速秘訣、64k Context 設定，以及新手最常踩的 5 個大坑。

### 為什麼你應該先看這篇再升級硬體？
Ollama 在 VRAM 小於 24GB 的電腦上，預設 Context（上下文）只有 `4,096 tokens (4k)`！而現代 AI Agent（如 OpenClaw、Cline、Roo Code 等）動輒需要 `64k` 以上的空間。沒改設定就直接跑，再強的模型也會瞬間失憶。

---

### CHAPTER 01：核心規則 — 你的電腦到底「放不放得下」？

要在本地端順暢執行開源大語言模型（Local LLM），第一件事不是看 CPU 有幾核心，而是算清楚**「模型權重 + Context（KV Cache）能不能完整塞進你的高速記憶體（VRAM 或 Mac 統一記憶體）」**。

- **法則 A：4-bit 模型大小估算公式**
  - `模型大小 (GB) ≈ 參數量 (B) × 0.6 + Context 預留空間`
  - 主流本地模型最推薦使用 **4-bit 量化（如 Q4_K_M）**，例如 `27B` 模型本體約佔 `27 × 0.6 ≈ 16.2 GB`，還要額外預留 4 GB ～ 12 GB 給長對話與 Agent 的 Context。
- **法則 B：Mac 統一記憶體安全法則**
  - `Mac 可用 AI 記憶體 ≈ 總記憶體 × 3 / 4 (75%)`
  - Apple Silicon (M1/M2/M3/M4) 採用統一記憶體架構，macOS 系統與背景程式本身需要保留約 1/4 空間。例如 32GB 的 Mac，安全分給 AI 模型的上限約為 `24 GB`。

---

### CHAPTER 02：16GB 到 128GB 各級距硬體到底能跑什麼？

1. **16 GB（入門甜點級：跑小模型）**：主力參數量 `7B / 8B ～ 14B (4-bit)`，適合日常翻譯、信件潤飾、單篇短文摘要、輕量本機問答。
2. **32 GB（高 CP 值主力門檻：跑 27B ~ 32B 等級）**：主力參數量 `27B ～ 32B (4-bit) / 30B MoE`，權重約 16~18GB，剩下的空間剛好能開啟 32k～64k Context 接上 Agent。
3. **64 GB（長文本工作站：完整展開長 Context）**：主力參數量 `27B~32B (全開長 Context) 或 70B`，能把 Context 徹底展開到 64k～128k，適合重度 AI Agent 自動化與大型 Codebase 分析。
4. **128 GB（旗艦重裝級：真正換上超大模型）**：主力參數量 `70B ～ 120B+ / 大型 MoE 模型`，適合高複雜度推理與企業內部完全離線私有部署。

---

### CHAPTER 03：為什麼有的大模型反而比較快？MoE 架構與軟體選擇

- **Dense (稠密) vs. MoE (混合專家)**：30B MoE 模型（如 30B-A3B）記憶體看總參數（約 18GB），但速度看激活參數（每次只喚醒 3B 專家），跑起來像 3B 小模型一樣飛快！
- **三大主流軟體**：
  - **LM Studio**：視覺化首選、調參最直覺、內建 Mac MLX 引擎支援。
  - **Ollama**：串接 Agent 首選、生態系最廣，務必手動拉高 Context。
  - **llama.cpp**：極致效能、底層玩家首選。

---

### CHAPTER 04：實戰調校 — 把 Ollama 與 LM Studio 的 Context 拉到 64k

```bash
# 1. 確保 Ollama 只聽本機 (防止公網裸奔被盜用算力)
export OLLAMA_HOST="127.0.0.1:11434"

# 2. 開啟 Flash Attention 與 KV Cache 8-bit 量化 (省記憶體神器)
export OLLAMA_FLASH_ATTENTION="1"
export OLLAMA_KV_CACHE_TYPE="q8_0"

# 3. 設定預設全域 Context 長度為 64k (65536 tokens)
export OLLAMA_CONTEXT_LENGTH=65536
```

---

### CHAPTER 05：新手最常踩的 5 個大坑 ＆ 「七句照做」黃金法則

1. **要接 Agent，先把 Context 拉到 64k 以上**
2. **4-bit 模型 ≈ 參數量 × 0.6 GB，再多留空間給 Context**
3. **用 Mac 的話，先照記憶體的四分之三 (3/4) 來算**
4. **16GB 跑小模型；32GB 跑 27B 等級；64GB 開長 Context；128GB 才換到大模型**
5. **想要快，先試 MoE 模型，再試著換一個軟體**
6. **難的交給雲端，私密的、重複的留在本地**
7. **Ollama 保持只聽本機 (localhost)，Agent 的資料夾裡不要放密碼**
