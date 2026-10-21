---
id: ink-wuxia-fantasy
title: 水墨武俠風 Skill｜東方國風寫意與墨氣劍意視覺提示詞架構規範
type: skill
category: Prompt Engineering
summary: 專為遊戲概念美術師、數位插畫家與 AI 影視創作者打造的東方水墨 Prompt 模組。系統化規範俠客劍意、巨龍破雲、潑墨飛白與生宣留白意境，徹底解決 AI 生成國風時常見的西式奇幻霓虹感，穩定輸出極具張力與文化底蘊的東方武俠視覺資產。
created: "2026-09-30"
updated: "2026-10-21"
version: "1.2"
status: active
visibility: public
tags: ["ink-wash", "wuxia", "dragon", "PromptEngineering", "water-ink", "ChineseArt", "Midjourney", "Flux"]
tools: ["Midjourney v6", "Flux.1", "Stable Diffusion XL", "DALL-E 3"]
cover: /assets/covers/ink-wuxia-fantasy.jpg
contentPath: skills/ink-wuxia-fantasy-skill/SKILL.md
downloadUrl: /assets/downloads/ink-wuxia-fantasy-skill.zip
featured: true
---

## 概述：東方水墨武俠的視覺哲學與 AI 生成困境

在西方主導的生成式 AI 模型中，「東方水墨（Chinese Ink-Wash / Sumi-e）」常被簡化為灰階素描、或是混入過多西式魔幻的彩色螢光特效。真正的國風寫意武俠，講究的是**「以形寫神、氣韻生動」**，其美學精髓建立在千年書法與傳統國畫的物理媒介規律之上。

當創作者試圖透過 AI 描繪「俠客於竹林揮劍，劍氣破空」時，常見的失敗模式包括：
1. **西式光劍化**：劍氣被生成為類似《星際大戰》的霓虹發光雷射，喪失內力無形的空靈感。
2. **背景死黑死灰**：模型不理解「計白當黑」的留白哲學，將空白處填滿雜亂噪點。
3. **缺少筆力動態**：線條如電腦向量描邊般死板，缺乏書法「起承轉合、提按頓挫」的墨汁飛白。

**水墨武俠風 Skill** 是一套專門矯正上述偏差的提示詞工程規範，提煉了宣紙滲透、墨分五色與動態劍氣的指令結構，協助團隊精準掌控高階東方視覺成果。

---

## 東方水墨四大核心美學法則 (The Four Principles)

在撰寫 Prompt 時，必須將傳統畫論轉化為模型能理解的幾何與光學指令：

### 1. 墨分五色 (Five Shades of Ink)
* **指令關鍵詞**：`five shades of traditional Chinese black ink, from pale grey wash to deep pitch charcoal black`
* **工程作用**：強制模型建立由淡墨（焦、濃、重、淡、清）構成的深度層次，而非只有純黑與純白的二元對比。

### 2. 飛白與枯筆 (Feibai & Dry Brush Technique)
* **指令關鍵詞**：`flying white dry brush strokes, raw calligraphic brush dragging texture`
* **工程作用**：在高速揮劍或疾風動作中，使筆鋒拉出絲縷狀的留白線條，模擬毛筆在生宣上快速掠過的物理速度感。

### 3. 大道留白 (Negative Space / Qi Flow)
* **指令關鍵詞**：`deliberate vast negative space, misty atmospheric void, minimalist composition`
* **工程作用**：壓制模型填滿畫面的本能衝動，留出超過 40% 的呼吸空間，呈現「此處無物勝有物」的江湖孤高境地。

### 4. 點睛硃砂 (Focal Vermilion Accent)
* **指令關鍵詞**：`monochromatic black and white ink with a single strategic splash of vermilion red`
* **工程作用**：在黑白主調中，僅允許劍穗、酒葫蘆封口、或是俠客斗笠紅繩出現一抹純粹硃砂紅，建立無可動搖的視覺視覺聚焦點。

---

## 提示詞模組化語法架構 (Modular Prompt Syntax)

```
[核心主體與動態 Subject & Martial Action]
+ [書法筆觸與墨性 Calligraphic Brushwork & Ink Bleed]
+ [宣紙質地與留白 Raw Xuan Paper Medium & Negative Space]
+ [國風意境元素 Traditional Zen & Taoist Elements]
+ [色彩焦點約束 Monochromatic Palette with Vermilion Accent]
+ [構圖與視角 Traditional Hanging Scroll Framing]
--no [西式元素排除 Negative Constraints]
```

---

## 經典實戰 Prompt 模板庫 (Master Recipes)

### 範例 1：竹林深處，劍氣破竹（俠客瞬間拔劍）
```text
Masterpiece Chinese ink-wash painting of a solitary wandering swordsman in worn hemp robes and conical bamboo hat, caught in mid-air slashing a single clean sword strike, bamboo stalks splitting with flying white dry brush texture, ink splashes exploding outward like shattered calligraphy, dense misty bamboo forest fading into soft ink wash in the background, raw textured Xuan paper with natural fiber blemishes, monochromatic black, charcoal and mist grey with a tiny crimson vermilion sword tassel accent, dynamic diagonal composition, cinematic tension --ar 16:9 --stylize 280 --v 6.1
```
* **視覺特徵**：竹林隨景深模糊成水漬淡墨，前景劍氣以極致枯筆撕裂畫面，硃砂劍穗提供視覺錨點。

### 範例 2：九霄雷動，墨龍破雲（神魔仙俠概念）
```text
Traditional Eastern mythical ink painting of a colossal serpentine dragon coiling through stormy thunderclouds, razor-sharp ink-bleed dragon claws piercing the mist, fierce calligraphic whiskers and glowing wise eyes, dramatic ink splashing and wet-on-wet watercolor bleeding over mountains below, grand monumental scale, traditional Chinese hanging scroll aesthetic, textured mulberry paper, sublime spiritual presence, minimalist void background --ar 9:16 --stylize 320 --v 6.1
```
* **視覺特徵**：直幅掛軸構圖（9:16），巨龍的身軀在濃墨與淡霧之間穿梭翻騰，展現無上的東方威嚴。

### 範例 3：孤舟蓑笠，寒江獨釣（禪意意境空靈）
```text
Ultra-minimalist Zen ink painting of an ancient solitary fisherman in a straw raincoat sitting quietly on a wooden skiff, vast calm winter lake disappearing into boundless white mist, distant faint mountain ridges rendered in single pale brushstrokes, expansive negative space, delicate water ripples rendered in ultra-fine ink lines, philosophical tranquility, Song dynasty artistic spirit, raw rice paper grain texture --ar 21:9 --stylize 180 --v 6.1
```
* **視覺特徵**：寬螢幕比例（21:9），全圖留白面積高達 70%，極簡的淡墨筆觸傳遞天人合一的禪宗境界。

---

## 各生圖模型微調配置指南

| 模型名稱 | 最佳提示風格 | 推薦參數 | 避坑重點 |
| :--- | :--- | :--- | :--- |
| **Midjourney v6.1** | 強調書法名詞與傳統宣紙名詞 | `--stylize 250~350 --ar 16:9` | 必須明確宣告 `monochromatic`，否則高 stylize 會擅自加入金色粉塵與藍色霓虹 |
| **Flux.1-Dev** | 自然語言描述水墨擴散過程 | `Guidance: 3.5, Steps: 28` | 在 Prompt 中加入 `painted by a master calligrapher on unmounted wet rice paper` |
| **Stable Diffusion XL** | 搭配國風 LoRA（如 guofeng / sumi-e） | `CFG: 6.0, Steps: 32` | 負向提示詞填寫非常關鍵，必須徹底封殺西方奇幻高光 |
| **DALL-E 3** | 強調歷史朝代風格（如宋代院體畫） | 自然語言提示 | 強調「不要任何 3D 渲染光影、不要現代動漫粗線條」 |

---

## 嚴格負向提示詞矩陣 (Negative Prompt Constraints)

為了確保產出絕不偏向「西式魔幻」或「劣質網遊特效」，在 SD/Flux 或支援 `--no` 的環境中，務必加入以下約束詞庫：

```text
--no western fantasy, 3d render, octane render, cgi, photorealistic, neon glow, lightsaber, lens flare, glossy reflections, plastic skin, saturated rainbow colors, modern anime lineart, messy digital airbrush, geometric borders
```

### 為什麼這套負向約束如此重要？
* **剔除 `neon glow` 與 `lightsaber`**：防止 AI 把劍氣當作發光二極體。
* **剔除 `3d render` 與 `glossy`**：保證畫布始終是啞光宣紙吸收墨汁的狀態，而非亮面壓克力或 3D 建模。
* **剔除 `saturated rainbow colors`**：維持國風水墨的高雅克制與精神純粹性。

---

## 資產封裝與使用方式

* 📦 **技能完整資源包**：可直接於上方動作欄下載 [`ink-wuxia-fantasy-skill.zip`](/assets/downloads/ink-wuxia-fantasy-skill.zip)，內含完整中英文關鍵字字典、各模型對照 JSON 設定檔與 30+ 測試範例圖。
* 🛠️ **工作流集成**：本規格書與 Prompt 模板遵循 MIT 開源協議，可自由整合至 ComfyUI 工作節點、Midjourney 自動化腳本或遊戲美術預製管線中。
