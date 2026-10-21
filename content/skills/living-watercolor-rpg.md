---
id: living-watercolor-rpg
title: Living Watercolor RPG｜JRPG 動態水彩視覺風格系統與提示詞工程指南
type: skill
category: Image Generation
summary: 專為獨立遊戲開發者與數位概念美術師調校的 JRPG 動態水彩提示詞技能庫。透過嚴謹的顏料沉澱、水漬邊緣、手繪線稿與色彩疊層指令，消除數位 AI 生成圖的塑膠油膩感，穩定產出高一致性、具備手工呼吸感的日系奇幻美術資產。
created: "2026-09-23"
updated: "2026-10-21"
version: "1.2"
status: active
visibility: public
tags: ["watercolor", "JRPG", "character", "environment", "PromptEngineering", "Midjourney", "Flux", "GameArt"]
tools: ["Midjourney v6", "Flux.1", "Stable Diffusion XL", "DALL-E 3"]
cover: /assets/covers/living-watercolor-rpg.jpg
contentPath: skills/living-watercolor-rpg/SKILL.md
repositoryUrl: https://github.com/freewing70/charles-ai-workspace
downloadUrl: /assets/examples/watercolor-presets.json
featured: true
relatedPresentations: ["ai-compute-demand-evidence-2026"]
---

## 概述：為什麼現代生成式 AI 需要「動態水彩」專屬規範？

在目前的 AI 圖像生成模型（如 Midjourney v6、Flux.1-Dev、SDXL）中，當使用者直接輸入 `watercolor painting` 時，往往會得到極度失真的畫面：要不是過度數位的超高反光 3D 渲染，就是色彩過飽和、缺少物理顏料滲透特性的「偽水彩濾鏡」。

在經典日系角色扮演遊戲（JRPG，如《Final Fantasy》天野喜孝概念稿、《聖劍傳說》、《八方旅人》或吉卜力工作室的手繪背景）中，水彩的核心魅力在於：
1. **水漬沉澱邊緣（Hard Edge / Pigment Sedimentation）**：水滴乾涸時在邊緣聚集的深色色粉礦物沉積。
2. **通透的疊色層次（Glazing Transparency）**：底層線稿與底色在多層塗抹後依然保持澄澈，而非厚塗油畫的混濁覆蓋。
3. **呼吸感與枯筆留白（Negative Space & Dry Brush）**：紙張纖維底紋的自然露白，賦予角色與空間靈動的輕盈感。

**Living Watercolor RPG** 是一套模組化的 Prompt Engineering 規範體系，旨在透過系統化的指令約束，讓 AI 穩定輸出兼具「工業級可用性」與「純粹手繪溫度」的 JRPG 視覺概念資產。

---

## 核心提示詞架構模型 (Modular Prompt Architecture)

為了確保在不同生圖模型中的泛化能力，建議採用六層語意堆疊結構：

```
[主題主體 Subject & Action]
+ [角色特徵錨點 Character Anchor]
+ [水彩物理質地媒介 Watercolor Medium Dynamics]
+ [筆觸與線稿風格 Inking & Linework]
+ [環境色彩與光影氛圍 Color Palette & Lighting]
+ [相機視角與構圖 Framing & Composition]
--no [負向約束 Negative Anchors]
```

### 1. 關鍵質地描述詞表 (Texture & Medium Descriptors)
* **`wet-on-wet watercolor bleeding`**：控制大面積漸層晕染，適用於天空、斗篷、魔法氣場。
* **`granulating watercolor pigment`**：引導模型產生礦物顆粒沉澱效果，消除數位平滑塑膠感。
* **`rough cold-press paper grain texture`**：強制保留粗糙冷壓水彩紙的纖維紋理。
* **`subtle ink pen hatching and contour lines`**：搭配細緻的沾水筆墨線，穩固角色輪廓，防止肢體變形。
* **`translucent watercolor washes with controlled splatter`**：輕透薄塗加上邊緣細微水漬飛濺，營造動態空氣感。

---

## 角色特徵一致性維護策略 (Character Consistency)

在遊戲開發中，單張驚艷的圖片無法直接使用，美術團隊最需要的是**同一個角色在不同姿勢、場景下的長相與服裝一致性**。本規範建議採取以下三大錨定法：

### 步驟 1：建立核心錨定關鍵詞串 (Feature Anchor Chain)
定義 3~5 個不可妥協的獨特特徵詞，並在每次生成時嚴格保持順序一致：
> 範例：`young female spellcaster, silver asymmetric bob haircut, emerald feather earring on left ear, navy travel cloak with brass star clasps, ivory linen tunic`

### 步驟 2：固定種子與提示詞權重比例
* 在 Stable Diffusion / Flux 中，保持固定種子（Fixed Seed）測試微調。
* 在 Midjourney 中使用 `--cref`（Character Reference）搭配 `--cw 20`（僅參考面容）或 `--cw 80`（參考面容與全身服裝）。

### 步驟 3：三面圖與動作拆解生成
先生成中立站姿的角色三視圖（Character Design Turnaround Sheet），再以此作為圖像參考（Image Prompt）擴展至戰鬥施法與對話情境。

---

## 實戰即用型 Prompt 模板庫 (Production-Ready Templates)

### 模板 1：JRPG 主角戰鬥動態姿態（女刺客疾行斬擊）
```text
Dynamic action shot of a nimble rogue with windblown amber braids, wearing weathered leather armor and dual obsidian daggers, leaping across ancient temple ruins, dynamic motion blur, wet-on-wet watercolor bleeding, rough cold-press paper texture, visible pen-and-ink contour linework, translucent turquoise and russet pigment washes, dramatic low-angle perspective, Japanese fantasy RPG concept art style, masterpiece quality --ar 16:9 --stylize 250 --v 6.1
```
* **風格重點**：透過 `dynamic motion blur` 與 `visible pen-and-ink contour linework` 鎖定肢體力道，背景以水漬大面積留白突顯前景角色。

### 模板 2：奇幻世界觀環境概念圖（浮空群島與水上古城）
```text
Panoramic fantasy landscape concept art of floating mossy islands connected by ancient rope bridges, crystal waterfalls plunging into a sunlit cloud sea below, a distant spired citadel, soft morning mist, delicate watercolor wash, granulating pigment sedimentation, subtle gouache highlights, golden hour ethereal lighting, classic JRPG world map aesthetic, Studio Ghibli inspired color harmony, highly detailed linework --ar 21:9 --stylize 200 --v 6.1
```
* **風格重點**：運用冷暖色調對比（金色朝陽 vs 灰藍雲海），顆粒沉澱質感營造古老空靈的世界觀氛圍。

### 模板 3：角色對話頭像立繪（年邁賢者肖像）
```text
Intimate waist-up character portrait of a wise elderly celestial scholar, long silver beard braided with runic beads, deep thoughtful hazel eyes, wearing midnight blue velvet robes with golden celestial embroidery, warm parchment background, loose watercolor splash, hard water-stain edges, expressive Sumi-e brushwork details, emotional storytelling lighting, official JRPG dialogue bust asset --ar 3:4 --v 6.1
```
* **風格重點**：臉部細節保留高對比度墨線，外圍衣物則以水份充沛的大筆刷暈染淡出，完美契合對話框立繪需求。

---

## 各生圖引擎參數配置推薦表

| 引擎版本 | 推薦語意權重 (Weight) | 參數設置 (Parameters) | 核心避坑技巧 |
| :--- | :--- | :--- | :--- |
| **Midjourney v6 / v6.1** | 將 `watercolor texture` 放在前 20 字 | `--stylize 180~300 --ar 16:9` | 勿設超過 `--stylize 500`，否則會轉成過度光滑的 CGI 渲染風格 |
| **Flux.1 (Dev / Schnell)** | 使用自然語言長句描述顏料物理滲透 | `Guidance Scale: 3.0 ~ 3.8` | 提示詞加入 `illustration on cold-press paper with visible water ringlets` |
| **Stable Diffusion XL** | 搭配專用水彩 LoRA（權重 0.6~0.8） | `Steps: 30, Sampler: DPM++ 2M Karras, CFG: 6.5` | 必須在 Negative 加入 `photorealistic, 3d render, plastic, shiny, oily skin` |
| **DALL-E 3 (ChatGPT)** | 在開頭嚴格宣告媒介限制 | 無直接參數，需透過 Prompt 強制宣告 | 開頭加註：「請以傳統日系水彩畫風呈現，嚴禁使用任何 3D 渲染或擬真照片光影」 |

---

## 常見生成缺陷與負向提示詞調校 (Troubleshooting)

在實際產出中，最常遇到的三大瑕疵與調解方針：

1. **畫面出現「油膩反光 / 塑膠皮膚」**：
   * **原因**：AI 模型的預設訓練權重偏好 3D CG 現代遊戲建模風格。
   * **對策**：負向提示詞（Negative Prompt）務必填寫：`3d render, octane render, cgi, glossy, smooth digital airbrush, photorealistic, plastic skin, neon glow`。
2. **顏色過於濁黑、缺乏通透感**：
   * **原因**：深色陰影直接使用了黑色或深灰色疊加。
   * **對策**：正向提示詞中加入透明覆色指令：`transparent indigo shadows, luminous color palette, clean watercolor transparency`。
3. **線稿與色塊完全剝離（像小朋友填色本）**：
   * **原因**：墨線權重過重，與水彩暈染層沒有物理互動。
   * **對策**：使用 `ink lines melting into watercolor edges, soft bleeding lines` 代替純粹的 `thick black outline`。

---

## 資源下載與工程集成

本專案提供預先封裝好的設定檔與提示詞種子資產：
* 📥 **預設配置檔**：[`/assets/examples/watercolor-presets.json`](/assets/examples/watercolor-presets.json)（內含 20 組各場景與職業的 JSON 提示詞配置，可直接載入各開源 WebUI 或自動化腳本）。
* 📂 **開源工作庫**：本規範已納入 [FreewingBiz 官方開源工作區](https://github.com/freewing70/charles-ai-workspace)，歡迎自由 Fork、提交 PR 或整合至您的遊戲開發管線中。
