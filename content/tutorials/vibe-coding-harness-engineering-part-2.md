---
id: "vibe-coding-harness-engineering-part-2"
title: "Vibe Coding 進階心法（下）：打造閉環自癒的「自動試車台」—— 不用看懂程式碼，讓 AI 自己改考卷修到好"
type: "tutorial"
category: "AI Engineering"
summary: "專為非工程師與一人創作者打造的進階架構實戰完結篇！深入拆解 Harness Engineering 的核心武器「自動試車台（Evaluation & Verification Harness）」。藉由 F1 賽車室內測功機的直覺隱喻，傳授如何為專案建立「一鍵冒煙檢測」與「閉環自癒反饋系統（Self-Healing Closed Loop）」，讓 AI 在背景自主修復 Bug 直到全站綠燈，徹底告別手忙腳亂的人工肉眼測試！"
created: "2026-11-08"
updated: "2026-11-08"
version: "1.0"
status: "active"
visibility: "public"
tags: ["Vibe Coding", "Harness Engineering", "AI編程", "自動化測試", "自癒系統", "Cursor", "Claude", "非工程師", "Prompt錦囊"]
tools: ["Cursor", "Claude 3.5 Sonnet", "Windsurf", "ChatGPT", "v0", "Astro"]
cover: "/assets/covers/vibe-coding-harness-engineering-part-2.png"
featured: true
---

## 導言：別再當 AI 的「人工改考卷老師」！

在上一篇中，我們學會了用「規格防護罩（SDD）」和「專案憲法（.cursorrules）」把 AI 框在精準的板模裡。

但很多創作者在功能寫好後，依然會卡在一個極度痛苦的環節：
> 「AI 說它寫好了，我只能自己打開瀏覽器，像無頭蒼蠅一樣每個按鈕點一遍。點了半天發現點按鈕沒反應，我複製錯誤訊息給 AI，AI 說『抱歉我漏看了一行』，又改了一段……我再去點，發現另一個原本好的頁面又爆了！整整一個下午，我都像個陪讀老師一樣在幫 AI 改考卷，改得心力交瘁！」

這就是沒有建立 **「驗證試車台（Evaluation Harness）」** 的代價。

真正的專業軟體總指揮官，**從來不靠肉眼在瀏覽器裡盲測**。今天這篇完結篇，我們就要帶你把專案升級為**「閉環自癒系統」**——建立一套像 F1 賽車工廠一樣的自動試車台，讓 AI 寫完代碼後自己去跑考卷，發現錯誤自己在背景改好，只有當「全部綠燈通過」時，才准來敲你的門！

---

## 🏎️ 工程學的隱喻：直接上高速公路 vs 室內測功試車台

為什麼頂級車廠製造一台超跑時，絕不會在剛裝好引擎的第一秒，就直接開上高速公路狂飆？

![工程學的試車台隱喻：直接開上路拋錨 vs 室內測功機自動除錯](/assets/diagrams/harness-dyno-test-rig-metaphor.svg)

<div class="vibe-grid-2">
  <div class="vibe-box-danger">
    <span class="badge">❌ 沒有試車台的肉眼盲測</span>
    <p><strong>組裝完直接開上國道，結果在快車道拋錨爆炸：</strong></p>
    <ul>
      <li>你完全不知道剛才加上的那段程式碼，有沒有暗中撞壞其他頁面的邏輯。</li>
      <li>只要有一行語法寫錯，線上網站直接整站白屏，訪客與客戶瞬間看到 404 或報錯。</li>
      <li>你成為人肉救火隊，手忙腳亂到處複製 Console Log 給 AI，焦慮感爆表。</li>
    </ul>
  </div>
  <div class="vibe-box-success">
    <span class="badge">✅ 擁有自動試車台的自癒架構</span>
    <p><strong>把引擎鎖在工廠裡的固定試車台上，自動高轉速瘋狂測試：</strong></p>
    <ul>
      <li>在程式碼發布前，試車台（Harness）用 3 秒鐘自動模擬數千次訪問與語法掃描。</li>
      <li>哪裡漏油、哪條線路鬆脫，試車台精確報警，並把具體位置直接回傳給維修技師。</li>
      <li>技師在室內把所有螺絲鎖緊、綠燈全亮之後，這輛車才以 100% 完美的狀態出廠！</li>
    </ul>
  </div>
</div>

> [!IMPORTANT]
> **指揮官的思維躍遷**：  
> **不要用你的寶貴時間去幫 AI 找 Bug。寫一個「最笨的試車腳本」，把改考卷這件苦差事，100% 丟回給機器處理！**

---

## 🚦 支柱一：一鍵冒煙試車台（Smoke Test Harness）

很多非專業創作者一聽到「寫測試」，就被嚇退了三步，以為要去學難懂的單元測試框架（Jest、Cypress、Playwright）。

**完全不需要！**

在實戰中，非工程師只需要一個**「全站冒煙檢測（Smoke Check）」**。就像火災警報器一樣，它的目的不是測出哪顆灰塵有問題，而是只要確認三件最致命的大事：
1. **編譯過不過（Build OK?）**：有沒有寫出致命語法錯誤導致整站無法打包？
2. **死鏈有沒有（Links OK?）**：剛才改的代碼有沒有把其他頁面的連結搞丟成 404？
3. **規格守不守（Rule OK?）**：有沒有違規硬塞肥大依賴？

---

### 🧰 實戰工具：打造你的【一鍵冒煙試車指令】

只要在你的專案 `package.json` 的 `scripts` 區塊，加入或串聯一行簡單的驗證指令（例如在 Astro / Next.js 專案）：

```json
{
  "scripts": {
    "test:smoke": "astro check && astro build"
  }
}
```

當你（或 AI）在終端機輸入 `pnpm test:smoke` 時：
- 如果終端機噴出紅色錯誤，代表「試車不及格，嚴禁交件」。
- 如果終端機噴出藍綠色的 `Complete!`，代表「試車通過，100% 安全健康」。

這行短短的指令，就是你整個專案最高規格的**「全自動試車台」**！

---

## 🔄 支柱二：閉環自癒反饋（Self-Healing Closed Loop）

有了試車台之後，最神奇的魔法來了：**我們該如何讓 AI 「自己改考卷」？**

傳統的做法是：你跑指令 ➔ 看到報錯 ➔ 複製錯誤訊息 ➔ 貼回對話框問 AI ➔ AI 修復 ➔ 你再去跑……這樣一來一往，你依舊是那個疲憊的傳話筒。

**自癒閉環（Self-Healing Loop）** 的做法則是：直接命令 AI 自己在終端機執行試車台，只要看到紅色報錯，**直接由 AI 自己解讀 Log 並在背景動手術，直到全站綠燈通過為止！**

![閉環自癒機制：讓 AI 在背景自己改考卷修到綠燈！](/assets/diagrams/self-healing-feedback-loop.svg)

---

### 🧰 實戰錦囊 1：【閉環自癒實施】Prompt

當你把任務交代給 Cursor 或支援終端操作的 AI Agent 時，**千萬不要只說「幫我寫好」**，而是貼上這段防禦自癒協議：

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 01 · 閉環自癒實施指令（禁止半成品打擾）</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">請依據我們確認好的規格卡片開始實作此功能。

【自癒閉環執行協議 (Self-Healing Loop)】
1. 代碼撰寫完成後，請【嚴禁】直接通知我驗收。
2. 你必須在終端機自行執行專案試車指令：`pnpm test:smoke`（或 `pnpm build`）。
3. 觀察執行結果：
   - 🔴 若有任何報錯：請自行閱讀錯誤 Log，精準定位受損檔案進行微調修復，並「再次重新執行試車指令」。此自癒循環上限為 3 次。
   - 🟢 若連續出現 0 Error、100% 成功編譯：方可停止循環。
4. 只有在試車台全數亮起綠燈時，你才能在對話框回覆我：「報告指揮官，代碼已通過自動試車台檢驗，所有指標均為 PASS，請確認。」

請開始執行閉環施工！</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor Agent / Windsurf Cascade / Claude Desktop</span>
    <span class="copy-hint">📋 點擊全選複製這段指令發送給 AI</span>
  </div>
</div>

> [!TIP]
> **為什麼設定「上限 3 次」？**  
> 這是為了防止 AI 陷入無窮迴圈（Overfitting）。如果連續自修 3 次還沒過，代表當初的規格卡片設計有矛盾，此時 AI 會主動踩煞車，讓你介入微調方向，精準又省 Token！

---

## 🛡️ 支柱三：虛擬沙盒試車房（Git Branch Playground）

許多非工程師對 Git 的「分支（Branch）」感到恐懼，覺得打指令很危險。

其實分支的生活隱喻極其溫柔：**「拿一張影印本在上面隨便塗鴉」**。

<div class="vibe-grid-2">
  <div class="vibe-box-danger">
    <span class="badge">❌ 永遠在 main 分支寫扣</span>
    <p>就像直接在唯一的「房地契正本」上拿彩色筆畫草稿：一旦 AI 改壞了洗不掉，全家人只能一起哭。</p>
  </div>
  <div class="vibe-box-success">
    <span class="badge">✅ 在 feature 分支試車</span>
    <p>先拿影印本隨便 AI 怎麼折騰、怎麼改，在試車台上狂跑自檢。等確認完美無瑕了，再花一秒鐘蓋印章合併回正本！</p>
  </div>
</div>

---

### 🧰 實戰錦囊 2：【一鍵開闢沙盒房】Prompt

當你要進行任何可能影響多個檔案的中大型改動前，先複製這段給 AI：

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 02 · 虛擬沙盒安全建立器</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">我們即將進行一項新功能的開發。為了確保主線（main）絕對安全，請幫我執行以下防禦動作：

1. 檢查當前 Git 狀態是否乾淨。
2. 開闢一個名為 `feature/[你的功能英文字，例如 feature/coupon-system]` 的全新獨立沙盒分支。
3. 切換至該分支後，向我回報：「沙盒房已就緒，可以在此放心施工，隨時可一鍵捨棄或合併！」</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Windsurf / 任何終端整合工具</span>
    <span class="copy-hint">📋 點擊全選複製這段指令發送給 AI</span>
  </div>
</div>

---

## 🏆 終極里程碑：非工程師的進化天梯

恭喜你！從《不翻車指南》到這兩篇《Harness Engineering 進階心法》，你已經完成了軟體創作認知的究極進化：

![非工程師的進化天梯：從「AI 實習生打字機」到「系統總指揮官」](/assets/diagrams/creator-to-architect-evolution.svg)

1. **LEVEL 01 · 盲目通靈聊天**：隨心所欲打字，AI 噴代碼碰運氣，三天後迎來技術債雪崩。
2. **LEVEL 02 · 遇錯防禦修補**：學會單一真相來源（SSOT）、兩次道歉立即回滾、程式碼依賴斷捨離。
3. **LEVEL 03 · 鷹架與規格鎖定**：寫第一行扣前先立 3 張規格卡片，把 `.cursorrules` 專案家規刻在門框上。
4. **TOP LEVEL · 自癒系統指揮官**：建立全自動試車台，下達閉環自癒指令，讓 AI 自己在背景改考卷修到全綠燈！

---

## 🎁 完工交付禮包：全站最後防線【總體檢錦囊】

每次準備上線前，把這段最終稽核 Prompt 丟給 AI，為你的心血結晶做最後一次無死角的全身電腦斷層掃描：

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 03 · 最終交付全身電腦斷層掃描</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">我們即將準備將本次改動交付發布。請你以「資深首席架構師」的身份，針對當前專案執行最終的全身安全掃描：

【四大查核向度】
1. 依賴純淨度：檢查 package.json 是否有未經同意安裝的冗餘套件？
2. 契約完整性：檢查所有新元件是否嚴格遵循 SSOT 原則，有無任何殘留的寫死假資料？
3. 死鏈與資安：掃描全站是否有任何 404 斷鏈、是否有任何 API Key 暴露在外？
4. 試車台終審：執行全站構建指令，並回報最終打包體積與編譯狀態。

請以清晰條列方式輸出這份【健康報告書】，若有發現任何隱憂，請直接列出建議修復方案。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Windsurf / Claude 3.5 Sonnet</span>
    <span class="copy-hint">📋 每次發布上線前的最後一道防線</span>
  </div>
</div>

---

## 結語：在 AI 時代，你才是真正的總工程師

很多人以為，在 AI 浪潮下，程式設計師會失業，非工程師只要會聊天就能征服世界。

但真實的真相是：**隨意聊天的人只會製造出更多無法維護的垃圾代碼；而真正能把點子變成千萬級產品的人，是懂得以「架構與 Harness」駕馭 AI 的系統總指揮官。**

你不需要去背幾千個程式語言的冷僻語法，但你現在已經擁有了全球頂級軟體工程師最核心的智慧——**「先立板模、刻好家規、放進試車台、閉環自癒」**。

握緊你手中的韁繩，未來的每一隻 AI 野馬，都將由你駕馭，伴隨你在數位世界開疆闢土，打造出真正穩固長青的偉大作品！

---

### 📚 系列完整閱讀目錄
- [基礎篇（上）：別讓 AI 害你寫出「違章危樓」—— 觀念心法與防禦指令](/tutorials/vibe-coding-defense-guide-part-1/)
- [基礎篇（中）：拒絕「慢如牛」的半成品架構瘦身術 —— 抽屜分離與斷捨離](/tutorials/vibe-coding-defense-guide-part-2/)
- [基礎篇（下）：告別「動一行崩全家」的長治久安 SOP —— 安全金庫與自動守門員](/tutorials/vibe-coding-defense-guide-part-3/)
- [進階篇（上）：學會 Harness Engineering —— 把 AI 野馬套上韁繩的「鷹架施工法」](/tutorials/vibe-coding-harness-engineering-part-1/)
- 本文：**進階篇（下）：打造閉環自癒的「自動試車台」—— 不用看懂程式碼，讓 AI 自己改考卷修到好**
