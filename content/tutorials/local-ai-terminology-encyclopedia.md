---
id: "local-ai-terminology-encyclopedia"
title: "本地 AI 模型名詞百科：視覺化互動簡報"
type: "tutorial"
category: "Local AI"
summary: "全方位的邊緣運算與本地開源大模型名詞百科，圖像化拆解 Dense vs MoE 架構、精度量化階級天梯、GGUF 與 Safetensors 生態差異，以及 VRAM 硬體配置速查。"
created: "2026-09-24"
updated: "2026-10-25"
version: "1.2"
status: "active"
visibility: "public"
tags: ["本地AI", "開源模型", "GGUF", "量化技術", "MoE", "技術百科"]
tools: ["HTML5", "Ollama", "Llama.cpp", "Transformers"]
cover: "/assets/covers/local-ai-terminology-encyclopedia.png"
playUrl: "/presentations/local-ai-terminology-encyclopedia/slides.html"
featured: false
---

## 本地 AI 模型名詞百科｜開源與邊緣運算核心概念全書

本指南專為開源模型愛好者、自建本地隱私 AI 團隊與邊緣運算工程師打造。當你第一次踏入 Hugging Face、Ollama 或 LM Studio 的世界時，往往會被滿屏的神秘縮寫（如 `Q4_K_M`、`BF16`、`MoE`、`GGUF`、`AWQ`、`KV Cache`）搞得頭昏腦脹。

本篇實戰百科結合上方**全螢幕視覺化互動簡報**與下方**深度技術速查講義**，全面梳理從模型命名規則、神經網路架構、權重精度量化、部署檔案格式到硬體顯示記憶體（VRAM）計算公式的所有關鍵概念，協助你在挑選模型與採購硬體時做出最精準的決策。

---

## 第一章：模型命名密碼學（Decoding Model Filenames）

當你在 Hugging Face 或 Ollama 看到一個典型的開源模型檔案名稱：
> **`Qwen2.5-Coder-32B-Instruct-Q4_K_M.gguf`**

它其實是一組高度標準化的「模型身分證」，由左至右依序代表 6 個關鍵維度：

1. **`Qwen2.5`（模型家族與世代）**：代表研發機構與世代版本（如 Meta 的 `Llama-3.3`、阿里雲的 `Qwen2.5`、DeepSeek 的 `DeepSeek-R1`、Google 的 `Gemma-2`）。
2. **`Coder`（領域特化分支）**：若無標註代表通用模型；標註 `Coder` 代表針對程式碼訓練、標註 `VL / Vision` 代表支援視覺圖片輸入、標註 `Math` 代表數學推理強化。
3. **`32B`（參數規模 Parameters）**：`B` 代表十億（Billion）。`32B` 即擁有 320 億個神經網路權重參數。參數越大，模型的知識儲備與複雜邏輯推理上限通常越高，但所需的顯示記憶體（VRAM）也呈正比增加。
4. **`Instruct`（訓練階段與用途）**：
   - **`Base`（基底模型）**：僅完成海量文本預訓練（Pre-training），只懂得「接龍續寫文字」，不適合直接對話，主要供工程師進行二次微調（Fine-tuning）。
   - **`Instruct / Chat`（指令微調模型）**：經過監督式微調（SFT）與人類偏好對齊（RLHF / DPO），能聽懂人類指令、遵循格式要求並安全回答問題，是日常部署與 Agent 串接的首選。
5. **`Q4_K_M`（量化壓縮等級）**：代表將原始 16 位元權重壓縮為 4 位元 K-quant 中等混合精度（詳見第三章）。
6. **`.gguf`（推論引擎封裝格式）**：代表適用於 `llama.cpp` 與 `Ollama` 的單一二進位執行檔格式。

---

## 第二章：模型架構全景 —— Dense（稠密）vs. MoE（混合專家）

為什麼有些模型標示 `47B` 或 `236B`，跑起來卻比 `32B` 的模型還要快？關鍵就在於底層神經網路架構的差異：

| 架構類型 | 運作原理比喻 | 推論算力特性 | 記憶體（VRAM）特性 | 代表模型案例 |
| :--- | :--- | :--- | :--- | :--- |
| **Dense（稠密架構）** | **一位全科通才博士**：不管你問簡單加減法還是量子物理，他都動用 100% 的腦細胞思考。 | 每個 Token 生成都必須計算全部參數，大參數模型生成速度較慢。 | 參數全部載入 VRAM，空間利用率最紮實。 | Llama-3.3-70B、Qwen2.5-32B |
| **MoE（混合專家架構）** | **由 8 位專科醫師組成的會診室**：總共擁有龐大知識庫，但每次提問只由門診護理師（Router）指派最相關的 2 位專家出面回答。 | **極速推論**：總參數雖大（如 47B），但每次僅激活少數參數（如 13B），生成速度飛快！ | **吃記憶體大戶**：雖然每次只算少數專家，但所有專家的權重仍必須事先載入記憶體待命。 | Mixtral-8x7B、DeepSeek-V3/R1 |

> [!TIP]
> **選型黃金法則**：如果你的電腦屬於「記憶體容量很大（例如 Mac Studio M2/M3 Ultra 64GB–192GB 統一記憶體），但單一 GPU 算力有限」，**MoE 架構模型**會給你帶來宛如閃電般的超高速體驗！反之，如果你只有一張 12GB 或 16GB 的獨立顯卡，選擇精煉的 **Dense 模型（如 7B–14B）** 才能把每一分 VRAM 花在刀口上。

---

## 第三章：精度與量化階梯（Quantization Hierarchy）

「量化（Quantization）」是本地 AI 得以普及的最大功臣。它的原理就像把一張單眼相機拍出來的 50MB RAW 無損照片，轉存成 3MB 的高品質 JPG——肉眼幾乎看不出畫質差異，但檔案體積直接縮小了 75%！

以下為從最高精度到極限壓縮的天梯對照表：

1. **FP32 / FP16 / BF16（16-bit 全精度原始權重）**
   - **每 1B 參數佔用約 2 GB VRAM**（例如 7B 模型需 14GB VRAM，70B 模型需 140GB VRAM）。
   - **適用場景**：企業級多卡伺服器、模型微調訓練（Fine-tuning）或對精準度要求極端嚴苛的科研計算。
2. **Q8_0（8-bit 近乎無損量化）**
   - **每 1B 參數佔用約 1.05 GB VRAM**（節省近 50% 空間）。
   - **品質表現**：與 FP16 的困惑度（Perplexity）差距極微小，幾乎完全無法察覺智商下降。適合 VRAM 充裕時追求極致品質。
3. **Q6_K / Q5_K_M（5–6 bit 黃金高畫質區間）**
   - **每 1B 參數佔用約 0.70–0.82 GB VRAM**。
   - **品質表現**：在程式碼生成、嚴謹邏輯推理與格式化 JSON 輸出上，能保留 99% 以上的原始實力。
4. **Q4_K_M（4-bit 全球開源社群最佳甜點位 ⭐）**
   - **每 1B 參數佔用約 0.60 GB VRAM**（7B 模型僅需約 4.8GB VRAM，14B 模型僅需約 9GB VRAM）。
   - **核心秘密（K-Quants 技術）**：它並不是把所有神經層無腦砍成 4-bit，而是自動識別模型中最關鍵的注意力層（Attention Layers）保留為 6-bit，次要層壓為 4-bit。**用最小的體積換取 98% 的模型智商，是所有本地玩家預設的第一首選！**
5. **Q3_K / Q2_K / IQ2（2–3 bit 極限生存壓縮）**
   - **品質表現**：模型開始出現明顯的記憶模糊、鬼打牆或語法錯亂。僅建議在記憶體極度受限、且用來測試超大模型（如 70B 塞進 24GB 顯卡）時嚐鮮使用。

---

## 第四章：模型封裝格式大對決（GGUF vs. Safetensors vs. AWQ）

不同推論引擎需要對應不同的模型包裝格式，選錯格式將無法載入：

* **GGUF（GPT-Generated Unified Format）**：
  - **生態霸主**：由 `llama.cpp` 創始人 Georgi Gerganov 設計，是 **Ollama、LM Studio、Jan、AnythingLLM** 的標準格式。
  - **最大優勢**：單一檔案即包含所有權重與 Tokenizer 設定，且原生支援 **「CPU + GPU 混合卸載（Layer Offloading）」**——當顯卡 VRAM 不夠塞下整個模型時，可以把剩餘層數分攤給系統記憶體（RAM）與 CPU 接力運算。
* **Safetensors**：
  - **安全與雲端標準**：由 Hugging Face 推出，取代舊版容易夾帶惡意木馬的 Python `.bin (Pickle)` 格式。
  - **最大優勢**：支援零拷貝（Zero-copy）極速載入，是微調框架（Unsloth、LLaMA-Factory）與企業推論引擎 **vLLM** 的標準輸入格式。
* **AWQ（Activation-aware Weight Quantization）& GPTQ**：
  - **純 GPU 高併發專用量化**：不同於 GGUF 偏向個人電腦與 Apple Silicon，AWQ 專為 NVIDIA GPU 伺服器設計。在 **vLLM** 引擎下運行 AWQ 4-bit 模型，其多用戶併發吞吐量（Tokens/sec）遠高於 GGUF。

---

## 第五章：一秒算懂你的硬體能跑多大模型（VRAM 實戰速算公式）

在本地運行大模型時，顯示記憶體（VRAM）主要被兩大區塊瓜分：**「模型靜態權重」** 與 **「上下文動態記憶（KV Cache）」**。

> **實用估算公式（以最常用的 Q4_K_M 量化為例）**：  
> $$\text{所需總 VRAM (GB)} \approx (\text{參數 B 數量} \times 0.6) + \text{KV Cache 預留 (1.5 \sim 3 GB)}$$

### 常見硬體配置與推薦模型對照表（2026 實戰版）

| 你的硬體等級 | 可用 VRAM / 統一記憶體 | 完美流暢運行規模（Q4_K_M） | 實戰推薦模型清單 |
| :--- | :--- | :--- | :--- |
| **入門電競筆電 / 桌機** | 8 GB VRAM (RTX 4060) | **7B – 8B 模型** | Llama-3.1-8B、Qwen2.5-7B、Gemma-2-9B |
| **主流創作者顯卡** | 12 GB – 16 GB VRAM (RTX 4070Ti / 4080) | **14B 模型（甜點位）** | Qwen2.5-14B-Instruct、Phi-4-14B、DeepSeek-R1-Distill-14B |
| **單卡旗艦工作站** | 24 GB VRAM (RTX 3090 / 4090) | **32B 模型** | Qwen2.5-Coder-32B、DeepSeek-R1-Distill-32B |
| **雙卡工作站 / Mac Pro 級** | 48 GB – 64 GB+ (雙 3090 / Mac M3 Max) | **70B 模型 + 32K 長文本** | Llama-3.3-70B-Instruct、Qwen2.5-72B-Instruct |
