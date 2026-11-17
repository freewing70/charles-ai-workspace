---
id: "ai-video-consistency-character-world-state"
title: "AI 影視長片「連戲與角色鎖定」實戰工程：跨鏡頭光影、服裝狀態與空間方位（GEO Blocking）控制方法論"
type: "tutorial"
category: "AI Cinematography"
summary: "為什麼大多數 AI 短片過了第 3 顆鏡頭就換臉、傷口消失、人物左右瞬間跳轉越軸？本文提出工業級 AI 影視連戲工程方法論：將「不可變角色錨點」與「動態 World State JSON」徹底分離，結合 GEO Blocking、180 度軸線與 180-Degree Shutter Rule 電影攝影規範，並完整拆解 Kling、Runway Gen-3/4、Sora 與開源 Wan 2.1 的 Last-Frame-to-First-Frame 跨鏡頭工作流與 Shot Compiler Prompt 錦囊。"
created: "2026-11-14"
updated: "2026-11-14"
version: "1.0"
status: "active"
visibility: "public"
tags: ["AI影視", "角色一致性", "連戲工程", "GEO Blocking", "World State", "Kling", "Runway", "Wan 2.1"]
tools: ["Kling 2.x", "Runway Gen-3 / Gen-4", "Sora", "Wan 2.1 (ComfyUI)", "Flux / Midjourney", "ChatGPT / Claude Shot Compiler"]
cover: "/assets/covers/ai-video-consistency-character-world-state.png"
featured: true
---

## 導言：為什麼 90% 的 AI 短片過了第 3 顆鏡頭就徹底「崩盤」？

這兩年 AI 影片生成模型的畫質突飛猛進，單看任何一段 5 秒的 Demo 都像好萊塢大片。但只要你嘗試把 15 顆鏡頭剪成一部 90 秒的敘事短片，觀眾通常撐不過第 15 秒就會出戲——問題永遠出在**「連戲災難（Continuity Collapse）」**：

1. **跨鏡頭換臉與服裝漂移（Identity Drift）**：Shot 1 主角穿著深藍毛呢大衣、留著齊眉劉海；到了 Shot 3 轉側面特寫，臉型變成另一個人，毛呢大衣變成了防水衝鋒衣，鈕扣數量也不一樣。
2. **動態狀態失憶（State Amnesia）**：Shot 2 主角左臉頰被玻璃劃傷、淋了大雨、右手拿著一把銀色打火機；到了 Shot 4 推遠景，臉上的血痕憑空消失、大衣瞬間乾爽、打火機換到了左手甚至變成手電筒。
3. **空間方位與軸線錯亂（180-Degree Axis Violation）**：A 與 B 對話時，上一顆鏡頭 A 在畫面左側看向右邊，下一顆反打鏡頭（Reverse Shot）A 突然跑到了畫面右側，觀眾大腦瞬間失去空間座標，以為兩個人在對著空氣說話。

會發生這些問題，是因為大多數創作者把 AI 影片當成「每次獨立抽卡」的文字遊戲。如果沒有一套類似軟體工程「狀態管理（State Management）」與傳統電影工業「場記與走位（Script Supervisor & Blocking）」的混合架構，AI 永遠只能產出無邏輯的 MV 混剪。

這篇文章將為你建立一套可直接落地執行的 **AI 影視連戲工程系統**。

---

## 🧠 核心架構心法：將「不可變角色錨點」與「動態 World State」徹底分離

在軟體架構中，我們絕不會把「使用者的靜態身分證」跟「他當下的購物車狀態」混寫在同一個硬編碼字串裡；拍 AI 長片也是如此。

傳統失敗的 Prompt 寫法是把所有形容詞混成一鍋粥：
> *「一個三十歲台灣男偵探，穿濕透的黑色風衣，左臉有刀傷，拿著打火機，在霓虹雨夜街頭奔跑……」*

一旦鏡頭切換到室內、或傷口癒合、或脫掉風衣，整段 Prompt 必須重寫，模型對「角色長相」的權重就會被天氣與動作詞彙稀釋，立刻換臉！

正確的工業級做法，是把資料拆成兩層：**Immutable Character Identity（不可變角色錨點）** 與 **Mutable Dynamic World State（可變動態世界狀態）**。

![AI 影視連戲工程架構：角色錨點 × 動態 World State × 尾幀接首幀管線](/assets/diagrams/ai-video-consistency-character-world-state-arch.svg)

<div class="vibe-grid-2">
  <div class="vibe-box-danger">
    <span class="badge">❌ 傳統混寫 Prompt 抽卡流</span>
    <p><strong>每顆鏡頭重頭描述角色、環境與動作：</strong></p>
    <ul>
      <li>角色特徵與濕度、傷痕、光影詞彙互相搶佔 Attention 權重。</li>
      <li>沒有狀態記憶表，第 5 顆鏡頭一定忘記第 2 顆鏡頭撿起的道具。</li>
      <li>單靠文字描述「左邊走去右邊」，無法控制真實 3D 空間座標。</li>
    </ul>
  </div>
  <div class="vibe-box-success">
    <span class="badge">✅ 身份與狀態分離 + 鏡頭編譯器</span>
    <p><strong>基準錨點圖卡 + JSON 狀態機自動編譯每顆鏡頭：</strong></p>
    <ul>
      <li>Character Anchor Sheet 鎖死五官骨相與基礎輪廓，跨場景 100% 認得出來。</li>
      <li>World State JSON 像「電子場記單」精準追蹤濕度、傷痕、道具與主光源。</li>
      <li>透過 Shot Compiler 自動把 JSON 轉譯為各影片模型的物理運鏡指令。</li>
    </ul>
  </div>
</div>

---

## 🔒 支柱一：Immutable Character Anchor Sheet（不可變角色基準錨點）

在開拍任何一顆動態鏡頭前，必須先為每位主要角色製作一張 **「純淨無干擾的 3 視角基準設定表（Turnaround Anchor Sheet）」**。

### 製作基準錨點的 4 個鐵則
1. **平光無戲劇陰影（Neutral Studio Lighting）**：在 5600K 柔和均勻棚燈、純灰或純白背景下生成角色的 **正面（Front）、90 度正側面（Profile）、45 度半側面（Three-Quarter View）**。千萬不要在賽博龐克強紅藍霓虹光下做角色設定圖，否則這組霓虹色偏會黏死在角色臉上，之後進白天場景一定破功。
2. **分離「永久特徵」與「可變配件」**：眼鏡、帽子、外套或傷痕如果會在劇情中脫穿或變化，基準圖請先做「素體基礎造型（Base Outfit）」，確保臉部骨相、髮際線、眉型與瞳色被 100% 鎖定。
3. **高反差可辨識輪廓（Silhouette Anchor）**：AI 影片模型在中遠景極容易丟失五官細節，因此給角色設計 1–2 個強烈視覺錨點（例如領口一道金色滾邊、左耳一枚銀色耳骨夾、特殊剪裁的翻領）能大幅提升跨鏡頭連戲感。
4. **多角度參考餵圖（Multi-Ref Subject Consistency）**：使用 Kling Elements、Runway References 或 ComfyUI IP-Adapter / Wan 2.1 Reference-to-Video 時，根據鏡頭朝向選擇對應角度的錨點圖（側面鏡頭餵 Profile 圖，正面特寫餵 Front 圖），能降低模型「腦補另一半臉」造成的顏值崩壞。

---

## 🔄 支柱二：Dynamic World State JSON（動態世界狀態場記機）

當角色從雨夜巷弄走進昏暗酒吧，發生了打鬥與道具交換，你需要一個結構化的 **World State JSON** 擔任「AI 劇組場記」。每拍完一顆鏡頭，只針對「發生變化的欄位」進行增量更新（Patch Update）。

以下是一份標準的企業級 AI 影視 `WorldState` 狀態結構設計：

```json
{
  "scene_id": "SC04_ALLEY_CONFRONTATION",
  "shot_id": "S04_C03",
  "time_and_weather": {
    "time_of_day": "night_0200",
    "weather": "heavy_rain",
    "surface_reflection": "wet_asphalt_specular"
  },
  "lighting_rig": {
    "key_light_direction": "back_left_45deg",
    "key_light_color": "cold_cyan_neon_5800K",
    "fill_light": "warm_amber_streetlamp_3200K_right_rim",
    "contrast_ratio": "high_noir_4_to_1"
  },
  "characters": {
    "detective_chen": {
      "anchor_ref": "char_chen_turnaround_v3.png",
      "wardrobe_state": "trench_coat_75pct_rain_soaked_collar_up",
      "injury_state": "fresh_2cm_cut_on_left_cheekbone_minor_blood",
      "hair_state": "wet_strands_clinging_to_forehead",
      "held_prop_left": "none",
      "held_prop_right": "brushed_silver_lighter_lit_flame",
      "screen_position": "screen_left_foreground",
      "gaze_direction": "facing_screen_right_towards_target"
    }
  },
  "continuity_locks": {
    "action_axis_180": "camera_stays_south_of_AB_line",
    "focal_length_mm": 50,
    "shutter_spec": "24fps_180deg_shutter_natural_motion_blur"
  }
}
```

> [!TIP]
> **為什麼 `held_prop_left` 與 `held_prop_right` 要強制分開寫？**  
> 擴散模型對「左右手」的空間概念非常薄弱。如果在 Prompt 裡只寫「拿著打火機」，下一秒它就會換手；更保險的做法是同時鎖定 `held_prop_right` 與鏡頭內的畫面構圖位置（`screen_left_foreground`），並在首幀參考圖中讓道具位置一目了然。

---

## 📐 支柱三：GEO Blocking 與雙重 180 度法則

即使臉跟衣服都連上了，如果鏡頭的幾何空間關係（Geometric Blocking）錯亂，剪輯時依然完全接不起來。在 AI 影視指令工程中，你必須顯式控制以下兩個「180 度物理規則」：

### 1. 空間幾何走位與「180 度軸線法則」（The 180-Degree Axis Rule）
假設角色 A（站在畫面左側）與角色 B（站在畫面右側）面對面站立，兩人之間連成一條無形的**動作軸線（Action Line）**：
- **合法機位區**：攝影機只能移動在這條軸線的**同一側半圓內**。這樣無論切成全景、過肩鏡頭（OTS）還是特寫，**A 永遠面向右邊（facing screen-right），B 永遠面向左邊（facing screen-left）**。
- **Prompt 明確鎖定字眼**：在每一顆對話或對峙鏡頭中，務必透過 GEO Blocking 欄位明確宣告：
  - `A positioned on screen-left, three-quarter view facing screen-right`
  - `Over-the-shoulder shot from behind A (left foreground blur) looking at B (center-right, facing screen-left)`
  - 絕對避免只寫「兩個人的對話特寫」，那會讓模型隨機翻轉人物朝向。

### 2. 攝影機物理與「180 度快門法則」（The 180-Degree Shutter Rule）
許多 AI 影片一眼看過去有濃厚的「塑膠 CG 感」或「高幀率電玩鬼影感」，往往是因為缺少了電影攝影機的動態模糊（Motion Blur）物理參數。

在傳統電影攝影中（24 fps），標準快門開角為 180 度，對應的快門速度公式非常單純：

```text
180-Degree Shutter Rule 物理換算：
Shutter Speed = 1 / (2 * Frame Rate)
若影片為 24 fps  -> 快門速度 = 1 / 48 秒（實務標記為 1/48s 或 1/50s）
若影片為 30 fps  -> 快門速度 = 1 / 60 秒
```

在生成基礎首幀（Keyframe）與動態影片 Prompt 中加入光學與快門錨點，例如 `shot on 35mm anamorphic lens, 24fps, 180-degree shutter natural motion blur, shallow depth of field f/2.0`，能有效抑制 AI 在人物快速揮手、轉頭或下雨粒子運動時產生的果凍變形與閃爍雜訊（Temporal Flickering）。

---

## 🎞️ 支柱四：跨引擎 Last-Frame-to-First-Frame（尾幀接首幀）串流工作流

要把 5 秒的單一短片串成長鏡頭或連續敘事，業界目前最核心的技術是 **Last-Frame-to-First-Frame（Img2Vid Chaining）**，但直接無腦把「上一顆的最後一幀」丟進下一顆生成，到了第 3 顆就會出現嚴重的「壓縮糊化與色偏雪崩（Generation Loss）」。

我們必須先掌握四大主流引擎的特性差異，再套用「尾幀校正閘門」：

| 影片生成引擎 | 連戲控制強項 | 首尾幀 / 參考圖工作流特性 | 最常見連戲風險與對策 |
| :--- | :--- | :--- | :--- |
| **Kling（可靈）** | 首尾幀插值（Start-End Frame）與 Elements 多圖參考極強 | 支援同時鎖定第一幀與最後一幀（Keyframe-to-Keyframe），路徑可控性最高 | 動作幅度過大時人物關節偶爾加速；對策是縮短單段物理位移，兩幀間動作跨度不超過 1.5 秒常態速度。 |
| **Runway Gen-3 / Gen-4** | Gen-4 Subject/World References 與運鏡筆刷精準 | 支援指定 Camera Control（Pan/Tilt/Zoom/Truck）與首幀錨定 | 多輪尾幀接續容易出現暗部色階壓縮；建議每 2 顆鏡頭做一次局部色彩與銳利度還原。 |
| **OpenAI Sora** | 物理世界邏輯、長時段連貫性與光影反射極自然 | 支援 Storyboard 時間軸分段與 Remix 局部微調 | 過度依賴純文字時細節易隨機漂移；務必配合明確的 Start Image 與精簡確定的動作動詞。 |
| **Wan 2.1（本地 ComfyUI）** | 開源生態自由度最高，可掛載 LoRA、ControlNet Depth/Pose 與 VACE | 支援 First-Last Frame、參考圖與深度/骨架精確控制 | VRAM 需求較高、參數調校門檻高；但能透過固定 Seed + 角色 LoRA 達成最高工業級一致性。 |

### 防崩壞關鍵：三步「尾幀校正閘門（De-Drift Gate）」
千萬不要把 `Shot01_last_frame.png` 原封不動直接餵給 Shot 02，請在中間安插一個極輕量的校正閘門：
1. **抽取與檢驗（Extract & Inspect）**：用 `ffmpeg` 精確擷取上一顆影片的最後一幀（或動作最穩定的倒數第 3 幀，避開動態模糊過重的最後 1 幀）。
2. **局部重繪與狀態補丁（Inpaint & State Patch）**：如果這顆鏡頭剛好發生了劇情狀態改變（例如角色多了一道傷口、或原本模糊的臉在壓縮後變糊），用 Flux / Photoshop / ComfyUI Inpaint **僅針對臉部或道具進行無損重繪修復**，同時對照 Character Anchor Sheet 拉回五官細節。
3. **跨切鏡替代方案（Cutaway Reset）**：若連續跑了 3 顆連續動作鏡頭，畫面不可避免出現微幅色偏時，剪輯師可主動插入一顆**「環境特寫 / 道具插鏡（Insert Shot）」或「反打鏡頭（Reverse Shot）」**，改由乾淨的 Keyframe 重新起算，就能立刻把畫質重置回 100% 巔峰狀態！

```bash
# 實務指令：抽取上一顆鏡頭倒數第 2 幀作為乾淨無模糊的接續首幀候選
ffmpeg -sseof -0.1 -i shot_01_output.mp4 -frames:v 1 -q:v 1 shot_01_clean_tail.png
```

---

## 🧰 實戰錦囊：World State JSON 與 Shot Compiler 提示詞模板

在實際製作長片時，你可以把 LLM（Claude / Gemini / ChatGPT）當成你的「AI 攝影指導與場記編譯器（Shot Compiler）」。只要把這兩張卡片存進工作區，就能自動產出 100% 連戲的每顆鏡頭指令。

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Template 01 · AI 劇組場記：Dynamic World State JSON 狀態機模板</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">{
  "project": "CyberNoir_ShortFilm",
  "scene_id": "SC02_RAIN_STREET",
  "shot_id": "S02_C01",
  "environment": {
    "location": "narrow_taipei_back_alley_neon_signs",
    "time_weather": "midnight_heavy_rain_puddles",
    "atmosphere": "thin_steam_rising_from_drain"
  },
  "lighting_lock": {
    "key_light": "overhead_cold_cyan_5600K_from_top_left",
    "rim_light": "warm_amber_3200K_shop_sign_from_back_right",
    "forbidden_lights": ["bright_daylight", "flat_front_flash"]
  },
  "characters": [
    {
      "id": "lin_detect",
      "immutable_anchor_file": "anchors/lin_turnaround_clean.png",
      "wardrobe_state": "dark_navy_wool_coat_shoulders_soaked_70pct",
      "injury_state": "bandaid_above_right_eyebrow",
      "props": { "left_hand": "empty", "right_hand": "transparent_umbrella" },
      "geo_blocking": {
        "frame_zone": "screen_left_third",
        "body_facing": "three_quarter_towards_screen_right",
        "gaze": "looking_offscreen_right"
      }
    }
  ],
  "camera_spec": {
    "shot_size": "medium_close_up",
    "lens_mm": 50,
    "movement": "slow_dolly_in_10pct",
    "axis_rule": "stay_south_of_action_axis",
    "shutter": "24fps_180deg_shutter_natural_motion_blur"
  }
}</div>
  <div class="terminal-footer">
    <span>適用工具：AI 影視分鏡腳本系統 / JSON 狀態追蹤檔</span>
    <span class="copy-hint">📋 點擊全選複製並隨每顆鏡頭增量更新欄位</span>
  </div>
</div>

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 02 · Shot Compiler 連戲鏡頭編譯器（LLM 自動轉譯）</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">你是好萊塢級 AI 影視製作的【連戲總監與 Shot Compiler】。你的任務是根據我提供的「角色基準設定描述」與「當前鏡頭的 World State JSON」，編譯出可直接輸入影像/影片生成模型的高精度英文指令，並嚴格確保跨鏡頭連戲零穿幫。

【輸入 1：不可變角色基準描述】：
[貼上角色固定長相、髮型、基礎服裝輪廓]

【輸入 2：本顆鏡頭 World State JSON】：
[貼上上方更新後的 JSON]

【輸入 3：本顆鏡頭劇情動作（5 秒內）】：
[例如：林偵探聽到身後腳步聲，緩慢轉頭看向鏡頭右側，右手握緊雨傘柄]

請嚴格輸出以下三段結果：
1. 【Keyframe 首幀生圖 Prompt (英文)】：必須明確寫入 `geo_blocking` 方位（screen-left/right, gaze direction）、`lighting_lock` 主副光方向與色溫、`wardrobe_state` 濕度/傷痕細節與鏡頭焦段。
2. 【Img2Vid 動態運鏡 Prompt (英文)】：專注描述 5 秒內的「物理動作變化、表情微動與攝影機運鏡（例如 slow push-in, 24fps, 180-degree shutter motion blur）」，禁止重複塞入會干擾動態模型的靜態贅詞。
3. 【連戲防呆檢查表 (中文)】：列出剪輯這顆鏡頭時必須肉眼核對的 3 個連戲指標（道具左右手、光影方向、視線軸線）。</div>
  <div class="terminal-footer">
    <span>適用工具：Claude / ChatGPT / Gemini + Kling / Runway / Sora / Wan 2.1</span>
    <span class="copy-hint">📋 點擊全選複製並貼入你的分鏡工作流</span>
  </div>
</div>

---

## 🛠️ AI 影視連戲疑難排解手冊（Troubleshooting Playbook）

在實戰剪輯與生成過程中，遇到以下 4 種高頻連戲崩壞時，請立刻對照查表修復：

| 現場翻車現象 | 背後技術成因 | 立即修復手法 |
| :--- | :--- | :--- |
| **同一角色切到特寫後突然變年輕或換臉** | 全身遠景時臉部只佔幾十個像素，Img2Vid 模型依據低解析臉部特徵自由發揮重建五官。 | 遠景接特寫時，**絕對不要用遠景裁切放大直接生影片**；改用 `Front / 45° Anchor Sheet` 重新生成高解析特寫首幀，再做 Img2Vid。 |
| **連續接了 3 顆尾幀後，畫面變暗、對比過高且邊緣糊化** | 典型多代編碼損失（Generation Loss）與 VAE 重編碼誤差累積。 | 觸發 **De-Drift Gate**：對尾幀進行一次高頻細節重繪修復（或僅在臉部做微調 Inpaint），或利用反應鏡頭（Reaction Shot）切換回原始高清 Keyframe。 |
| **角色原本往右走，下一顆鏡頭突然變往左走** | 違反 180 度動作軸線，或 Prompt 中同時出現 `from left` 與 `looking left` 造成方向語義衝突。 | 統一採用 **Screen-Space 座標寫法**（固定寫 `moving towards screen-right`、`facing screen-left`），絕不使用模稜兩可的「他的左邊 / 攝影機右邊」。 |
| **雨滴、火焰或閃爍霓虹燈在影片中像靜止貼圖或鬼影抽搐** | 模型未理解正確時間維度動態，或首幀靜態影像裡把雨滴畫成過於清晰的白色靜態線條。 | 首幀圖保持環境濕潤與地面積水反光即可，把「動態飄落雨絲、微風吹動濕髮」留到 Video Prompt 的運動描述中生成，並加上 `24fps, natural motion blur`。 |

---

## 🎯 總結：從「抽卡祈禱者」成為「AI 影視攝影指導」

當別人還在用一段段抽卡碰運氣、剪出角色每三秒換一張臉的 AI 短片時，真正能產出商業級長片與品牌廣告的團隊，靠的是嚴謹的工程紀律：

1. **資料結構分離**：用 **Turnaround Anchor Sheet** 鎖死「他是誰」，用 **World State JSON** 精確紀錄「他現在身上有什麼傷、穿幾分濕的衣服、拿在哪隻手」。
2. **空間與光學紀律**：用 **GEO Blocking + 180 度軸線** 讓剪輯師接得起來，用 **180-Degree Shutter Rule** 消除塑膠感。
3. **跨幀無損串接**：結合 **Last-Frame-to-First-Frame** 與定期 **De-Drift 校正閘門**，讓 Kling、Runway、Sora 與 Wan 2.1 真正成為聽你指揮的虛擬攝影棚。
