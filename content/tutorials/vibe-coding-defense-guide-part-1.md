---
id: "vibe-coding-defense-guide-part-1"
title: "Vibe Coding 不翻車指南（上）：別讓 AI 害你寫出「違章危樓」——非工程師必學的架構心法與防禦性指令"
type: "tutorial"
category: "AI Engineering"
summary: "專為非工程師與全職創作者打造的 Vibe Coding 避坑心法（上篇）。深入拆解 AI Agent 的「打補丁本能」如何導致技術債雪崩。提供「先動手術、拒絕違章硬塞」、「單一真相來源」等兩大核心軟體架構思維，並附贈 4 套可直接複製貼給 Cursor 或 Claude 的防禦性指揮 Prompt 錦囊。"
created: "2026-10-30"
updated: "2026-10-30"
version: "1.0"
status: "active"
visibility: "public"
tags: ["Vibe Coding", "AI編程", "Cursor", "Claude", "技術債", "非工程師", "軟體工程心法", "架構設計", "Prompt技巧"]
tools: ["Cursor", "Claude 3.5 Sonnet", "Windsurf", "ChatGPT", "v0", "Astro"]
cover: "/assets/covers/vibe-coding-defense-guide-part-1.png"
featured: true
---

## 導言：從「3 天神級工程師」到「第 2 週徹底暴斃」

2026 年，前 Tesla AI 總監 Andrej Karpathy 提出的 **Vibe Coding（憑感覺寫代碼）** 已經席捲了整個科技與創作圈。

無數完全沒有寫過程式的產品經理、設計師、行銷專家與獨立創作者，紛紛打開 Cursor、Windsurf、Claude 或 v0，只要動動嘴巴用自然語言描述需求，AI 就能在幾秒鐘內產出漂亮的介面與互動功能。

在剛開始的 3 天裡，每個人的體驗都如夢似幻——*「我不需要學十幾年軟體工程，我也能自己做出一個 App！」*

然而，**「蜜月期」通常在專案進入第 2 到第 3 週時迎來毀滅性的崩潰**。幾乎所有剛接觸 Vibe Coding 的初學者，都會毫無例外地撞上以下這堵絕望的高牆：

<div class="vibe-grid-2">
  <div class="vibe-box-danger">
    <span class="badge">❌ 症狀 1：改 A 壞 B 的連鎖反應</span>
    <p><strong>你只是請 AI「把購物車結帳按鈕改成綠色」，結果會員登入功能莫名其妙崩潰了。</strong></p>
    <p>因為 AI 為了改樣式，隨手更動了全域包裹層，連帶洗掉了登入 Token 的監聽器。</p>
  </div>
  <div class="vibe-box-danger">
    <span class="badge">❌ 症狀 2：AI 的「道歉死循環」</span>
    <p><strong>AI 開始反覆說：「非常抱歉！我剛才忽略了某個邏輯，請換成這段代碼……」</strong></p>
    <p>你貼上後發現依然報錯，越改越糟，連續試了 10 次，原本能動的功能徹底癱瘓。</p>
  </div>
</div>

<div class="vibe-box-danger">
  <span class="badge">❌ 症狀 3：無人敢碰的「代碼違章危樓」</span>
  <p><strong>專案檔案從最初的 3 個暴增到 80 個，裡面塞滿了幾萬行連你自己都看不懂的程式碼。</strong></p>
  <p>你完全不敢碰它，因為動任何一行，就像在一座搖搖欲墜的積木危樓底層抽掉一塊積木，整座系統立刻坍塌。</p>
</div>

![違章危樓 vs 穩固架構對比圖](/assets/diagrams/vibe-coding-tower-metaphor.svg)

> [!CAUTION]
> **這不是你的問題，也不是 AI「變笨了」**
> 這背後的殘酷真相是：**「軟體架構的物理定律」正在懲罰缺乏防禦性指揮的開發方式。**
> 寫代碼的門檻被 AI 降為零了，但**維護系統的難度卻因為 AI 的胡亂堆疊而翻了十倍**！

本系列專題就是為所有非工程背景的創作者而寫。我們不需要你背誦枯燥的語法，而是要教你掌握**「高級系統架構師的指揮思維」**，用生活化比喻與實戰指令，逼 AI 替你蓋出一棟結構穩固、能長期擴展的長青軟體。

---

## 一、核心心法一：破解 AI 的「打補丁慣性」——先動手術，拒絕違章硬塞

### 1. 為什麼 AI 特別喜歡「亂打補丁」？

大語言模型（LLM）的推理本質是**貪婪演算法（Greedy Approach）**。它的目標是用最快速度、消耗最少 Token 解決眼前被報錯的這一瞬間。

<div class="vibe-box-concept">
  <span class="badge">💡 生活化比喻 · 天花板漏水理論</span>
  <p>想像一下：你家客廳天花板漏水了。</p>
  <p><strong>優秀的土木師傅</strong>：會爬上頂樓檢查防水層裂縫、重新灌漿（<strong>根因手術</strong>）。</p>
  <p><strong>AI 的慣性作法</strong>：他在天花板漏水處下方拿膠帶貼一塊鐵皮，再拿塑膠桶接著，笑著告訴你：「看！客廳地板現在沒有水了，任務完成！」</p>
</div>

當你的網頁跳出 `TypeError: Cannot read properties of undefined`（找不到某個資料）時，如果你直接把錯誤訊息貼給 AI，請看看以下兩種改法的巨大差異：

<div class="vibe-grid-2">
  <div class="vibe-box-danger">
    <span class="badge">❌ 傳統打補丁（硬塞掩蓋）</span>
    <p><code>if (user !== undefined && user !== null) { ... }</code></p>
    <p>AI 直接在最外層加一層判斷，錯誤訊息確實消失了，但它<strong>完全不管為什麼 user 會變成空的</strong>。底層邏輯繼續腐爛，等到下次執行結帳時直接炸開。</p>
  </div>
  <div class="vibe-box-success">
    <span class="badge">✅ 架構師手術（追查根因）</span>
    <p><code>// 檢查登入生命週期與非同步順序</code></p>
    <p>直接追查源頭：是因為資料庫回傳太慢？還是登入狀態過期？<strong>直接在資料產生的源頭修好型別與生命週期</strong>，後續所有頁面永遠不再報錯！</p>
  </div>
</div>

### 2. 實戰指揮術：強制要求 AI 先動手術

從今天起，面對任何錯誤或新需求，**絕對不准讓 AI「就地打補丁」**。在把錯誤餵給 AI 時，強制要求它交代「根因」與「重構方案」。

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">PROMPT TEMPLATE 01 · 根因手術指令</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">我遇到了以下錯誤：
[貼上錯誤訊息與相關畫面截圖說明]

請嚴格遵守以下「架構審查三原則」，禁止提供敷衍性的表面補丁：
1. 【追查根因】：請先用白話文解釋，這個錯誤的底層根本原因是什麼？是資料流順序不對、型別不匹配，還是狀態生命週期混亂？
2. 【拒絕硬套】：禁止直接在外面加隨意的 if (x !== undefined) 或空 try-catch 來掩蓋錯誤。
3. 【手術級重構】：如果要徹底解決這個問題，我們應該如何調整底層邏輯或資料結構？請給出優雅、精簡且不會給未來埋坑的完整改法，並告訴我修改了哪幾個核心檔案。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Windsurf / Claude / ChatGPT</span>
    <span class="copy-hint">📋 點擊全選複製這段指令發送給 AI</span>
  </div>
</div>

---

## 二、核心心法二：單一真實來源（Single Source of Truth）——別讓資料在不同頁面各說各話

### 1. 什麼是「狀態混亂（State Chaos）」？

非軟體背景創作者最容易踩爆的第二顆地雷，叫做**「資料多頭馬車」**。

<div class="vibe-box-concept">
  <span class="badge">💡 生活化比喻 · 戶政事務所原則</span>
  <p>如果每家便利商店、每間診所、每所學校都自己印一本「國民身分戶籍名冊」，而且各自私下幫民眾改地址，會發生什麼事？</p>
  <p><strong>結果一定是天下大亂！</strong> 你去郵局寄信是舊地址，去銀行開戶是新地址，公家機關系統直接打架。</p>
  <p>真實世界怎麼解決？<strong>全台灣只有戶政事務所那本電腦資料庫是唯一權威（Single Source of Truth）</strong>。其他地方要看資料，必須即時連線查詢，嚴禁自己印一份私藏！</p>
</div>

![單一真實來源資料流對比圖](/assets/diagrams/single-source-of-truth-flow.svg)

當缺乏這個觀念時，AI 在寫不同頁面時最容易犯的低級錯誤：
- 在「首頁儀表板」，AI 隨手把餘額存進瀏覽器的 `localStorage`。
- 在「個人設定頁」，AI 卻自己從網址參數 `?balance=500` 撈資料。
- 在「結帳購物車」，AI 又在網頁記憶體（Component State）裡面自作主張算了一次。

結果用戶新增了一筆 500 元花費：
首頁的餘額變少了，但切到個人頁卻沒變，重新整理後餘額又突然跳回 1000 元！

### 2. 架構師的防禦性指揮術

在指揮 AI 新增任何跨頁面資料前，先要求 AI 指出「這項資料的唯一戶政事務所在哪裡」。

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">PROMPT TEMPLATE 02 · 資料流收攏指令</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">我們現在要實作 [新增的功能名稱，例如：會員積分更新 / 購物車狀態]。

在動手寫代碼之前，請先替我進行「資料流架構審查」：
1. 【定義權威源】：這項資料的「單一真相來源（Single Source of Truth）」應該放在哪裡？（例如：是後端資料庫、全域 Store，還是特定的狀態模組？）
2. 【盤點讀寫路徑】：請列出系統中所有需要「讀取」與「修改」這項資料的頁面或元件。
3. 【嚴禁私藏副本】：請確保所有元件都透過統一的介面取得同一份數據，嚴禁在多個 component 或 LocalStorage 裡各自維護不同版本的 state。

請先向我確認架構規劃，得到我的許可後再輸出具體代碼。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Windsurf / Claude / ChatGPT</span>
    <span class="copy-hint">📋 點擊全選複製這段指令發送給 AI</span>
  </div>
</div>

---

## 三、核心心法三：拒絕「幽靈依賴」——別為了吃一口蘋果，把整座果園搬回家

### 1. AI 解決問題最愛的捷徑：叫你「裝套件」

很多時候，你問 AI：*「我希望這個表格有搜尋排序功能」* 或 *「我希望這個日期能顯示成 2026 年 10 月 30 日」*。

AI 最不動腦筋的做法，就是叫你敲終端指令：
`npm install react-table lodash moment framer-motion axios ...`

幾輪需求做下來，你的專案莫名其妙安裝了幾十個函式庫，`node_modules` 資料夾膨脹到 800MB。

<div class="vibe-grid-2">
  <div class="vibe-box-danger">
    <span class="badge">❌ 濫裝套件的悲慘後果</span>
    <p>• <strong>載入速度慢如牛</strong>：原本只是一個簡單的宣傳網頁，手機打開要下載十幾 MB 的 JavaScript，白畫面轉了 8 秒才出來。</p>
    <p>• <strong>套件打架報錯</strong>：下個月當某個套件發布小更新，整個專案編譯失敗（Build Error），你根本無從查起。</p>
  </div>
  <div class="vibe-box-success">
    <span class="badge">✅ 現代原生的超強能力</span>
    <p>• <strong>格式化日期</strong>：原生 <code>Intl.DateTimeFormat</code> 3 行搞定，零體積！</p>
    <p>• <strong>網路請求</strong>：原生 <code>fetch()</code> 乾淨俐落，完全不用裝 <code>axios</code>！</p>
    <p>• <strong>平滑動畫</strong>：現代原生 CSS Keyframes 與 View Transitions 效能極高！</p>
  </div>
</div>

### 2. 實戰指揮術：堅持「零套件、純原生優先」

每當 AI 建議你 `npm install` 或 `pip install` 任何新套件時，先用這段指令擋下它：

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">PROMPT TEMPLATE 03 · 套件斷捨離指令</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">你剛才建議我安裝 [套件名稱，例如：moment / lodash / xxx]。

請問：
1. 我們真的非得安裝這個第三方套件不可嗎？它的體積有多大？會不會給未來的依賴管理帶來風險？
2. 如果使用現代瀏覽器原生的 Web APIs（例如原生 CSS 動畫、Intl 國際化、原生 fetch、原生 Array 函數），我們能否用不超過 20 行乾淨的代碼自己實現這個功能？

請優先提供「零外部依賴、純原生實現」的解決方案。只有在原生完全無法做到時，才說明為什麼非裝套件不可。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Windsurf / Claude / ChatGPT</span>
    <span class="copy-hint">📋 點擊全選複製這段指令發送給 AI</span>
  </div>
</div>

---

## 四、核心心法四：建立你的「安全回滾時光機」——不用背指令的 Git 存檔大法

### 1. 為什麼「一直改一直爽」最後會變成災難？

很多非工程師使用 Cursor 或 Claude 時，習慣在對話框裡一輪接著一輪聊下去：
「幫我加這個」→「這裡改一下」→「顏色換一下」→「這裡報錯了修一下」……
到了第 20 輪，專案整個崩了。這時你連「最後一次能正常跑是在什麼時候」都記不得。

![兩次道歉黃金煞車時光機流程圖](/assets/diagrams/two-strikes-rollback-machine.svg)

### 2. 極簡存檔原則：兩次道歉，立刻煞車

你不需要成為 Git 命令列大師，但你必須學會**在安全的時候按下存檔（Commit）**：

<div class="vibe-box-concept">
  <span class="badge">🛑 黃金煞車法則 · 兩次道歉立刻回滾</span>
  <p><strong>當 AI 針對同一個錯誤連續修了兩次都修不好、開始重複說「對不起我弄錯了」的時候，請絕對不要讓它改第三次！</strong></p>
  <p>這代表當前的代碼上下文已經被大量互相衝突的垃圾補丁污染了。這時最明智的動作，是<strong>直接按 Discard（捨棄修改）回滾到上一個能動的存檔點</strong>，重開一個全新的乾淨對話窗口重新出發！</p>
</div>

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">PROMPT TEMPLATE 04 · 重啟乾淨對話指令</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">我們目前已經回到穩定的存檔點。剛才在嘗試 [目標功能] 時失敗了，因為代碼走進了打補丁的死胡同。

現在請忘記剛才所有的修改方案，讓我們重新思考：
1. 當前穩定版本中，與這個功能相關的代碼邏輯是如何運行的？
2. 我們不要採取「縫補式」的修改，請告訴我一條最乾淨、最符合現有專案架構的正確實作路徑。
3. 我們分步驟進行，你先只給出第一步的規劃，不要一次改動太多檔案。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Windsurf / Claude / ChatGPT</span>
    <span class="copy-hint">📋 點擊全選複製這段指令發送給 AI</span>
  </div>
</div>

---

## 本篇總結：你的角色是「總指揮官」，不是「打字機」

Vibe Coding 絕不是把大腦交給 AI。相反地，**非工程師的最大優勢，在於你對真實世界需求、商業場景與使用者體驗有最直覺的洞察**。

只要你用這四大防禦心法：
1. 🏗️ **拒絕就地打補丁**（先動手術查根因）
2. 🎯 **鎖死單一真實來源**（一項資料只有一本權威帳簿）
3. ⚡ **堅持原生優先**（不輕易引進肥大套件）
4. 🛑 **堅持兩次道歉即回滾**（善用版本控制保護心血）

你指揮出來的代碼，就會比許多盲目堆砌代碼的工程師更加乾淨、輕量且健壯！

---

### 🚀 下期預告（中篇）
在下一篇文章中，我們將進入更刺激的**【架構瘦身篇】**：
- **「五筆假資料的幻覺」**：為什麼在自己電腦跑很順，上傳給真實用戶立刻卡死？
- **骨肉分離法**：教你用最白話的方式，指揮 AI 將「介面畫面」與「業務資料」徹底解耦。
- **記憶體與迴圈暗礁**：如何一眼看出 AI 寫出了「吃光手機記憶體」的笨蛋運算？

敬請期待！
