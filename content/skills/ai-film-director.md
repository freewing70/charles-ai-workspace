---
id: ai-film-director
title: AI Film Director｜Higgsfield Studio《HELL GRIND》研究與 AI 電影製作系統
type: skill
category: AI 電影製作
summary: 從 Higgsfield《HELL GRIND》115,581 筆生成紀錄研究出發的開源 AI 電影製作系統，整合角色一致性、Asset Library、World State、GEO、Acting、Camera、Prompt Compiler、生成 QC 與連戲管理。
created: "2026-10-04"
updated: "2026-10-21"
version: "1.0"
status: active
visibility: public
tags: ["AI Film Director", "Higgsfield Studio", "Higgsfield", "HELL GRIND", "AI電影", "World State", "角色一致性", "Prompt Compiler"]
tools: ["Codex", "Claude", "Gemini", "Seedance", "Veo", "Kling", "WAN", "LTX"]
cover: /assets/covers/ai-film-director.png
repositoryUrl: https://github.com/freewing70/charles-ai-workspace
downloadUrl: /assets/downloads/AI_FILM_DIRECTOR_1.0.zip
featured: true
---

## 核心哲學：不要每一鏡重新描述世界，維護世界，編譯鏡頭

在傳統的 AI 影片生成流程中，創作者通常面臨著「抽卡地獄」：每一次點擊生成，都要在提示詞（Prompt）中塞入大量關於角色長相、服裝細節、環境光線與鏡頭運動的重複文字。然而，一旦影片需要跨越 5 個、20 個甚至 50 個鏡頭，這種方法便會迅速崩潰——角色的臉部特徵隨機漂移、上一秒受傷流血的手臂下一秒完好如初、背景中的建築物門窗位置隨意變換。

**AI Film Director** 是一套專為解決 AI 影視敘事連戲難題而設計的開源製作工作流。其核心思想源自於對 Higgsfield Studio 公開長片專案《HELL GRIND》超過 115,581 筆生成任務紀錄的深入逆向研究：**真正的 AI 電影導演管理的不是「Prompt」，而是「World State」（世界狀態）**。Prompt 不過是根據當前製作狀態自動「編譯（Compile）」出來的臨時執行碼。

---

## 一、《HELL GRIND》115,581 筆生成數據研究啟示

在剖析《HELL GRIND》的底層工作流中，我們挖掘出幾項關鍵數據事實：

1. **Reference 依賴度高達 97%**：在 115,581 個 video generation jobs 中，超過 97% 均綁定了固定的 Character LoRA、Face ID、Depth Map 或上一鏡頭的尾幀（Tail Frame）。純 Text-to-Video 的鏡頭不足 3%。
2. **Prompt 結構高度模組化**：115,444 條有效 Prompt 中，核心敘事主體與動作描述具有極高的模板化特徵，變動的僅僅是相機運動軌跡（Camera Vector）與瞬時表情變化。
3. **分鏡狀態傳遞機制**：成功維持跨場景連貫性的關鍵，在於鏡頭之間存在明確的「狀態繼承鏈」——從 Shot A 到 Shot B，繼承的不僅是視覺風格，還包含角色的物理狀態（如雨水浸濕度、衣物破損、持有道具的位置）。

---

## 二、系統架構：四階段管線（The 4-Stage Pipeline）

```
[ 階段 1：前期規劃 ]
Story Beats ──> Scene Breakdown ──> Shot List & Timing ──> Stable Shot IDs
      │
      ▼
[ 階段 2：製作狀態 ]
Asset Library ──> Character Base & Wardrobe ──> Environment Maps ──> World State Ledger
      │
      ▼
[ 階段 3：鏡頭編譯 ]
GEO (空間走位) ──> Acting (可觀察表演) ──> Camera (運鏡與焦距) ──> Prompt Compiler
      │
      ▼
[ 階段 4：生成與連戲 ]
Model Adapters (Kling/Veo/WAN) ──> Generation Ledger ──> QC 檢核 ──> Continuity Pass
```

### 1. 前期規劃（Story → Scenes / Shots）
- **穩定 ID 體系**：為每個場景（Scene）與鏡頭（Shot）編配全域唯一的識別碼（如 `SC01_SH03`）。
- **時長預算**：設定每個鏡頭的時間長度（如 3.5s、5.0s）與節奏韻律，避免無意義的長鏡頭浪費算力。

### 2. 製作狀態管理（Assets → World State）
- **Character Ledger**：區分「身分（Identity）」與「外觀狀態（State）」。
  - 身分：骨骼結構、面部特徵、基本年齡與體型（不可變）。
  - 狀態：當前服裝（Wardrobe）、濕度（Wetness）、傷口（Injury）、持有道具（Carried Props）。
- **Environment Ledger**：定義空間的三維坐標參考系、固定地標（如「南門入口」、「鐵梯」）、主光源方向與環境天氣。

### 3. 鏡頭編譯器（Prompt Compiler）
Prompt Compiler 負責將離散的「世界狀態」與「導演意圖」轉換為特定模型能理解的提示詞：
- **GEO（地理與走位）**：指明主體在空間中的相對位置（如「距離門口 2 米，背對攝影機 45 度」）。
- **Acting（表演）**：將抽象的情緒指令（如「感到恐懼」）轉化為物理上可被 AI 視覺模型描繪的可觀察動作（如「瞳孔微縮、雙唇微張、右肩向後微縮、急促胸膛起伏」）。
- **Camera（攝影語彙）**：嚴格規範鏡頭焦距（28mm / 50mm / 85mm）、機位高度（Low-angle / Eye-level）與運動軌跡（Dolly-in / Tracking / Pan）。

---

## 三、Production State 實戰結構示例

以下為 AI Film Director 標準化的 JSON-Schema 定義範例，展示如何跨鏡頭延續連戲狀態：

```json
{
  "production_id": "HELL_GRIND_SAMPLE",
  "current_scene": "SC02_WAREHOUSE_EXT",
  "world_state": {
    "weather": "heavy_rain",
    "ambient_light": "sodium_streetlamp_overhead_0.4_blue_fill",
    "time_of_day": "night_0230"
  },
  "active_characters": {
    "LIN": {
      "identity_ref": "/assets/characters/lin_master_ref.png",
      "wardrobe": "navy_waterproof_jacket_soaked",
      "physical_condition": {
        "facial_bruise_left_cheek": true,
        "wetness_level": 0.85
      },
      "carried_items": {
        "right_hand": "rusty_iron_key",
        "left_hand": "empty"
      }
    }
  },
  "shot_specification": {
    "shot_id": "SC02_SH02",
    "parent_shot_id": "SC02_SH01",
    "geo": "outside_south_gate_facing_entrance_distance_1.5m",
    "camera": {
      "focal_length": "50mm_anamorphic",
      "movement": "slow_dolly_forward_subtle_handheld_shake",
      "framing": "over_the_shoulder_medium_close_up"
    },
    "acting": "stops_movement, breath_condensing_in_cold_air, sharp_turn_look_behind",
    "continuity_checklist": [
      "Key must remain in right hand",
      "Rain runoff dripping from jacket hood",
      "Left cheek bruise visible under sodium light"
    ]
  }
}
```

---

## 四、跨模型適配層（Model Adapters）

AI Film Director 本身獨立於特定 AI 視頻模型（Model-Agnostic）。透過內建的適配層，將標準的鏡頭規格編譯為各主流模型的專用格式：

| 模型 | 適配重點 | 提示詞編譯策略 |
| :--- | :--- | :--- |
| **Kling AI (可靈)** | 動作物理規律與鏡頭軌跡控制 | 強調 `Camera Movement: [Down 2, Zoom 1]` 參數，嚴格拆分主體與環境 |
| **Google Veo** | 電影級構圖、光影色調與材質細節 | 強調焦段規格（如 `35mm Arri Alexa 65`）與精準的環境光照描寫 |
| **ByteDance Seedance** | 連戲關鍵幀過渡與姿態保真度 | 以首尾關鍵幀（First/Last Frame Conditioning）為核心，縮短單鏡頭變異度 |
| **WAN / LTX Video** | 本地端或開源算力部署 | 著重於 LoRA 權重組合與清晰的 Negative Prompts 消除多餘肢體偽影 |

---

## 五、品質審核（QC）與連戲回寫機制

在生成過程中，並非每次輸出都能完美契合連戲需求。AI Film Director 建立了 5 項嚴格的 QC 檢驗標準：

1. **特徵保真度（Identity Consistency）**：面部幾何特徵在旋轉或表情變化時是否變異小於閾值。
2. **道具守恆律（Prop Conservation）**：右手持有的鑰匙是否在無放下動作的情況下憑空消失或移交至左手。
3. **光影空間一致性（Spatial Lighting Vector）**：主光源（如鈉燈）的陰影方向是否與上一鏡頭保持一致。
4. **動作向量銜接（Action Vector Alignment）**：若上一鏡頭以「向右轉身」結束，接續鏡頭不可呈現靜止或反向旋轉。
5. **材質瞬態物理（Transient Physics）**：雨水浸濕的衣物紋理與反光率是否隨時間遞增或維持，而非突然乾燥。

經 QC 驗收通過的鏡頭，其最終幀的狀態將被自動回寫至 `World State Ledger`，成為下一個鏡頭編譯的初始條件。

---

## 六、開源資源與快速開始

本系統完全開源於 GitHub，提供完整的規格範本、Prompt 編譯腳本與工作流程指引：

- **官方程式庫**：[charles-ai-workspace on GitHub](https://github.com/freewing70/charles-ai-workspace)
- **直接下載封裝**：[AI_FILM_DIRECTOR_1.0.zip](/assets/downloads/AI_FILM_DIRECTOR_1.0.zip)
- **相容 Agent 架構**：適用於 Claude 3.5 Sonnet、Gemini 1.5 Pro、OpenAI Codex 等支援 Tool Use 與 System Prompt 的 AI Agent。
