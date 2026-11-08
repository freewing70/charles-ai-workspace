---
id: "vibe-coding-harness-engineering-part-1"
title: "Vibe Coding 進階心法（上）：學會 Harness Engineering —— 把 AI 野馬套上韁繩的「鷹架施工法」"
type: "tutorial"
category: "AI Engineering"
summary: "專為非工程師與一人創作者打造的進階架構實戰！解密頂級工程師如何用「Harness Engineering（束具與鷹架工程）」駕馭隨機的 AI Agent。從「水泥灌漿模板」與「野馬韁繩」的直覺隱喻出發，傳授規格防護罩（Spec-Driven Development）與專案家規防護繩（Rule Harness），並附贈 4 套可直接複製至專案的規格模板與 .cursorrules 實戰憲法！"
created: "2026-11-08"
updated: "2026-11-08"
version: "1.0"
status: "active"
visibility: "public"
tags: ["Vibe Coding", "Harness Engineering", "AI編程", "Cursor", "Claude", "系統架構", "非工程師", "規格驅動開發", "Prompt錦囊"]
tools: ["Cursor", "Claude 3.5 Sonnet", "Windsurf", "ChatGPT", "v0", "Astro"]
cover: "/assets/covers/vibe-coding-harness-engineering-part-1.png"
featured: true
---

## 導言：為什麼頂級工程師對 AI 說一句話就搞定，而你聊了兩小時卻得到違章建築？

在看完先前的《Vibe Coding 不翻車指南》三部曲後，許多朋友紛紛在後台反饋：
> 「心法我懂了，但每次要開始一個新專案或新功能時，我還是只能像跟神仙通靈一樣，開個空白視窗對 AI 說：『幫我做個會員後台』。然後 AI 一陣狂噴五百行代碼，我又開始心驚膽顫……有沒有可能在**第一行程式碼敲下去之前**，就先把 AI 框在正確的軌道上？」

答案是：**當然有，而且這正是頂級軟體工程師與普通使用者的分水嶺！**

矽谷高階工程圈目前最火熱、被視為駕馭 AI Agent 最關鍵的學問，叫做 **「Harness Engineering（束具與鷹架工程）」**。

聽起來像是航太工程或高深黑魔法？其實它的核心原理，比你想像的還要簡單直覺。今天這篇進階篇（上），我們就用最接地氣的日常隱喻，徹底為你拆解這套強大手法！

---

## 🏗️ 什麼是 Harness？建築學的降維對比

在日常英文中，**Harness** 的意思是「馬匹的韁繩挽具」、「高空作業的安全束帶」或是「汽車賽道的防撞導軌」。

如果把它借用到軟體開發與 Vibe Coding 中，最佳的類比就是**「建築工地的鋼筋與水泥板模」**：

![建築學的降維對比：液態水泥直接傾倒 vs 鋼筋板模預先鎖定](/assets/diagrams/harness-concrete-mold-metaphor.svg)

<div class="vibe-grid-2">
  <div class="vibe-box-danger">
    <span class="badge">❌ 沒有 Harness 的隨興 Vibe Coding</span>
    <p><strong>就像直接把一大車「液態水泥」倒在泥地上：</strong></p>
    <ul>
      <li>AI 就像精力充沛的水泥灌漿機，你一按開始，它就瘋狂噴出數百行未經約束的代碼。</li>
      <li>水泥在地上到處流淌、溢出邊界、凝固成毫無規律的形狀。</li>
      <li>下次你想在旁邊加個小窗戶，發現必須拿電鑽把整塊水泥地砸爛，越修越像廢墟。</li>
    </ul>
  </div>
  <div class="vibe-box-success">
    <span class="badge">✅ 擁有 Harness 的專業 Vibe Coding</span>
    <p><strong>在倒水泥前，先用鋼筋與木板釘好「極致堅固的板模」：</strong></p>
    <ul>
      <li>你在專案四周預先立好規格限制、家規邊界與驗收卡片（Harness）。</li>
      <li>AI 灌進來的水泥再狂野，也只能嚴格順著板模的形狀填滿。</li>
      <li>凝固之後，你得到的是一根筆直堅挺、承重力驚人且完全符合預期的標準大樑！</li>
    </ul>
  </div>
</div>

> [!TIP]
> **一句話記住 Harness Engineering 的靈魂**：  
> **頂級的指揮官從不盯著工人的每一鏟泥土（不用逐行檢查代碼），而是專注於把板模釘得無懈可擊！**

---

## 📋 支柱一：規格防護罩（Spec-Driven Development）

非工程師在用 AI 時最常見的致命傷，是**「把思考過程直接當成指令」**。

當你跟 AI 說：「我想在首頁加一個會員優惠券功能，最好酷炫一點，輸入代碼可以打折」，AI 的大腦裡會瞬間產生 50 種不同的實作方式：
- 它可能會隨意改動你的資料庫架構。
- 它可能會順手改寫你全站的登入權限機制。
- 它甚至可能自作主張裝了 3 個龐大的第三方套件。

這就是著名的**「範圍膨脹（Scope Creep）惡夢」**。

要破解這點，你必須在讓 AI 動工前，強制它簽署以下 **3 張白話規格卡片**：

![非工程師的「規格防護罩」：動工前的 3 張驗收卡片](/assets/diagrams/spec-driven-three-cards.svg)

### 卡片 1：邊界圍欄卡（Scope & Anti-Scope）
- **只做什麼**：精確定義本次任務的核心交件目標（例如：僅在購物車右側新增輸入框）。
- **絕對不做什麼（反向邊界）**：明文禁令！（例如：嚴禁修改全站結帳核心、嚴禁更動使用者帳號模組、嚴禁重構現有樣式）。

### 卡片 2：資料契約卡（Contract & Schema）
- 不用寫艱深代碼，只要規定**「進來的資料長怎樣、吐出去的資料叫什麼名字」**。
- 一旦契約簽訂，元件內部怎麼運算，都不會影響到其他頁面。

### 卡片 3：驗收清單卡（Definition of Done, DoD）
- 列出 3 條**「小學生也能肉眼驗證」**的測試條件。
- AI 完成任務時，必須逐條對照勾選，全都打勾才算完工！

---

### 🧰 實戰錦囊 1：【規格驅動探勘器】Prompt

當你有一個新點子時，**千萬別叫 AI 直接寫代碼**！先把這段 Prompt 複製給它，讓它反過來幫你出規格書：

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 01 · 規格驅動探勘器（寫扣前必跑）</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">你現在是極度嚴謹的軟體架構總監。我有一個新功能想法想要實作，但在我們敲下任何一行程式碼之前，我需要你依照「Harness 規格防護原則」，幫我產出 3 張規格卡片。

我的新功能想法是：
[在此用白話描述你的想法，例如：我想在結帳頁面新增一個優惠券輸入框，輸入代碼後自動扣抵總金額]

請嚴格依照以下格式輸出，且【絕對不要】提供任何程式代碼：

### 📋 卡片一：邊界圍欄卡 (Scope & Anti-Scope)
- ✅ 本次唯一目標：(簡明扼要說明要做什麼)
- ⛔ 明文禁止事項：(列出 3 條嚴禁觸碰、重構或安裝的無關檔案或套件)

### 📋 卡片二：資料契約卡 (Data Contract)
- 輸入資料規範：(這項功能需要接收哪些資訊？格式為何？)
- 輸出結果規範：(完成後應該產出什麼數據結構？)

### 📋 卡片三：驗收標準清單 (Definition of Done)
- 條件 1：(正常情況下應該發生的具體行為)
- 條件 2：(異常或錯誤輸入時應該出現的提示)
- 條件 3：(原本既有功能未受任何破壞的驗證指標)

請先產出這份規格書，等待我的確認與微調。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Windsurf / Claude / ChatGPT</span>
    <span class="copy-hint">📋 點擊全選複製這段指令發送給 AI</span>
  </div>
</div>

---

## 📜 支柱二：專案家規防護繩（Context & Rule Harness）

你知道為什麼很多人抱怨：**「昨天跟 AI 講好的規矩，今天開個新視窗它全忘光了」**嗎？

因為 AI 是沒有長期記憶的「臨時工」。如果你把規範隨口說在對話框裡，只要對話變長或開新視窗，它就會隨風而逝。

真正的高手，會把專案的底線與品味，**白紙黑字寫進專案的「門禁系統」裡**！

在 Cursor 中叫 `.cursorrules`，在 Claude / Agent 架構中叫 `CLAUDE.md` 或 `AGENTS.md`。它就像是貼在公司門口的**「員工入職守則」**，AI 每次開工產出任何一行代碼，都會在後台先被這道守門員自動審查：

![專案憲法攔截機制：.cursorrules 如何在後台守死每行代碼？](/assets/diagrams/project-rules-guardrails-flow.svg)

---

### 🧰 實戰錦囊 2：非工程師的【專案憲法範本】

在你的專案最根目錄（最外層資料夾），新建一個名為 `.cursorrules` 的檔案（如果使用 Claude 則命名為 `CLAUDE.md`），然後把這段「量身訂做給非工程師專案」的內容直接貼進去：

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Template 01 · 專案家規憲法（.cursorrules 實戰版）</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">【專案家規憲法 (Project Constitution)】
本專案由「非工程背景創作者」主持。你是本專案的高級協同工程師，你在產生或修改任何代碼時，必須百分之百嚴格遵守以下防禦性鐵則：

### 1. 依賴與套件紅線 (Zero Bloat Policy)
- 嚴格禁止未經使用者明文授權，擅自執行 npm install / pnpm add 安裝任何第三方套件。
- 凡是能用 HTML、CSS、原生 SVG 或原生 Web API 解決的問題，絕對不准引入重量級 JS 函式庫。

### 2. 單一真相來源 (Single Source of Truth)
- 嚴禁在元件（Component）或頁面模板中硬編碼（Hardcode）重複的 Mock 資料或業務常數。
- 所有資料必須來自統一指定的資料夾（如 /src/data 或 /content），保持資料與視覺徹底分離。

### 3. 手術刀原則 (Surgical Editing)
- 每次修改程式碼，只針對與當前任務直接相關的最少行數進行變更。
- 嚴禁擅自「順便重構」其他運作正常的檔案，嚴禁擅自更換全局架構風格。

### 4. 樣式與視覺一致性
- 所有的顏色、字體大小、間距，必須嚴格引用全站既有的 Design Tokens 或 Tailwind 既有類別，嚴禁隨意在行內手寫隨機十六進位色碼（如 #3a7bd5）。

### 5. 出錯煞車機制 (Two-Strikes Rule)
- 如果一個 Bug 連續修復兩次依然報錯，立即停止任何修補動作！向使用者承認方向可能有誤，主動提議回滾（Rollback）並重新分析底層根因。</div>
  <div class="terminal-footer">
    <span>存放位置：專案根目錄 /.cursorrules 或 /CLAUDE.md</span>
    <span class="copy-hint">📋 存檔後 AI 每次對話將自動載入守則</span>
  </div>
</div>

---

## 🔒 支柱三：邊界鎖定與防禦性發布

當你有了「規格卡片」和「專案家規」之後，你該如何正式下達寫扣指令？

答案就是：**「邊界鎖定發布術」**。

把剛才確認好的規格卡片，連同以下這套 Prompt 交付給 AI。這會讓 AI 在敲鍵盤前，先在腦袋裡把防護欄拉滿：

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 02 · 邊界鎖定實作啟動器</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">我們已經確認好剛才的規格藍圖。現在請開始實作此功能，但在你動工前，請嚴格遵守以下邊界鎖定協議：

【任務規格】
- 目標範圍：[貼上剛才確認的卡片一]
- 資料契約：[貼上剛才確認的卡片二]
- 驗收清單：[貼上剛才確認的卡片三]

【施工規範】
1. 嚴格遵守根目錄 .cursorrules 的所有家規。
2. 僅允許修改或建立與此規格直接關聯的檔案，其他任何現存檔案一律不准更動。
3. 代碼完成後，請主動按照「卡片三的驗收清單」，逐條向我回報你的自檢驗證結果。

請開始執行，並保持代碼極致精簡乾淨！</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Windsurf / Claude 3.5 Sonnet</span>
    <span class="copy-hint">📋 點擊全選複製這段指令發送給 AI</span>
  </div>
</div>

---

## 🎯 總結：從「被動擦屁股」到「主動立規矩」

回顧一下今天你所學會的頂級架構思維：

<div class="vibe-box-concept">
  <span class="badge">💡 Harness Engineering（上篇）核心心法複習</span>
  <ul>
    <li><strong>不要水泥狂噴</strong>：液態水泥倒在地上只會變成廢墟；先釘好「鋼筋板模」，才能灌出頂天立地的承重柱。</li>
    <li><strong>三張卡片防護罩</strong>：寫扣前先簽字！邊界圍欄卡、資料契約卡、驗收清單卡，缺一不可。</li>
    <li><strong>把家規刻在門框上</strong>：透過 <code>.cursorrules</code> 建立專案憲法，讓 AI 在後台每次產出都自動受制於紅線，不再隨機放飛。</li>
  </ul>
</div>

當你掌握了**規格防護罩**與**家規防護繩**，你就已經完成了 Harness Engineering 的上半場！

在下一篇**《進階篇（下）：打造閉環自癒的「自動試車台」》**中，我們將更進一步：
**教你如何連瀏覽器都不用開，讓專案建立起一套專屬的自動試車軌道，一旦有 Bug 出現，AI 自己在背景修到綠燈通過為止，完全不來浪費你的寶貴時間！**

---

### 📚 系列文章導讀
- [Vibe Coding 不翻車指南（上）：別讓 AI 害你寫出「違章危樓」](/tutorials/vibe-coding-defense-guide-part-1/)
- [Vibe Coding 不翻車指南（中）：拒絕「慢如牛」的半成品架構瘦身術](/tutorials/vibe-coding-defense-guide-part-2/)
- [Vibe Coding 不翻車指南（下）：告別「動一行崩全家」的長治久安 SOP](/tutorials/vibe-coding-defense-guide-part-3/)
- 本文：**Vibe Coding 進階心法（上）：學會 Harness Engineering —— 把 AI 野馬套上韁繩的「鷹架施工法」**
- [Vibe Coding 進階心法（下）：打造閉環自癒的「自動試車台」—— 不用看懂程式碼，讓 AI 自己改考卷修到好](/tutorials/vibe-coding-harness-engineering-part-2/)
