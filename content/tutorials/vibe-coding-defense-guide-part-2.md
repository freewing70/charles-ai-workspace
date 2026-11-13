---
id: "vibe-coding-defense-guide-part-2"
title: "Vibe Coding 不翻車指南（中）：拒絕「慢如牛」的半成品——如何指揮 AI 打造瘦身又快速的輕量級架構"
type: "tutorial"
category: "AI Engineering"
summary: "專為非工程師與全職創作者打造的 Vibe Coding 避坑心法（中篇：架構瘦身與效能暗礁）。破解「五筆假資料」的甜蜜幻覺，詳解為什麼代碼在自己電腦順暢、上線給用戶卻卡死發燙。傳授「骨肉分離三層架構」與「水龍頭記憶體體檢」，附贈 4 套可直接複製貼給 Cursor / Claude 的極致效能優化 Prompt 錦囊。"
created: "2026-10-30"
updated: "2026-10-30"
version: "1.0"
status: "active"
visibility: "public"
tags: ["Vibe Coding", "效能優化", "軟體架構", "非工程師", "Cursor", "Claude", "記憶體洩漏", "骨肉分離", "瘦身減肥"]
tools: ["Cursor", "Claude 3.5 Sonnet", "Windsurf", "ChatGPT", "v0", "Astro"]
cover: "/assets/covers/vibe-coding-defense-guide-part-2.png"
featured: false
---

## 導言：為什麼自己電腦跑超順，一給別人看就大翻車？

> [!TIP]
> 💡 **溫習前作**：如果你還沒讀過 [《Vibe Coding 不翻車指南（上）：別讓 AI 害你寫出「違章危樓」》](/tutorials/vibe-coding-defense-guide-part-1/)，強烈建議先掌握核心防禦心法與單一真實來源（SSOT）架構！

很多剛踏入 Vibe Coding 的非工程師創作者，都有過一段無比自信的時刻：

你在頂級的 Mac 或高階桌機上，指揮 AI 做完了一個看起來超級炫酷的產品。裡面放了 3 個測試商品、2 個假帳號，點擊流暢、動畫絲滑，你興高采烈地把網址傳給朋友或潛在客戶。

結果下一秒，現實無情地給了你一記響亮的耳光：
- **手機打開白畫面轉了 8 秒**：在 4G 手機網路上，載入條像蝸牛一樣爬，對方等了 3 秒直接把分頁滑掉。
- **手機滑動發燙卡頓**：好不容易打開了，列表才滑動兩下，手機開始發燙，掉幀掉到像看逐格動畫。
- **後台伺服器直接崩潰**：朋友在購物車隨手點了兩次結帳，你的伺服器直接噴出 `Error 500`，資料庫連線數被全部吃光！

<div class="vibe-grid-2">
  <div class="vibe-box-danger">
    <span class="badge">❌ 初學者的直覺誤區</span>
    <p>「一定是對方的爛手機太慢！」</p>
    <p>「應該要花錢把伺服器規格買到最高級的頂規主機！」</p>
    <p><strong>真相：這完全是在花冤枉錢！</strong> 90% 的卡頓不是硬體不夠好，而是 AI 留下的「效能暗礁」在吞噬資源。</p>
  </div>
  <div class="vibe-box-success">
    <span class="badge">✅ 優秀架構師的洞察</span>
    <p>「程式碼裡藏著平方級的笨蛋運算！」</p>
    <p>「介面與資料攪成一鍋粥，打個字引發全域重算！」</p>
    <p><strong>真相：只要懂得指揮 AI 做架構瘦身</strong>，即使是用最便宜的免費伺服器，也能跑出 0.2 秒瞬間秒開的絲滑體驗。</p>
  </div>
</div>

本篇（中篇）將為你揭開 Vibe Coding 最隱蔽的四大「效能黑洞」，教你用直白的比喻與防禦性指令，指揮 AI 打造瘦身 90%、速度翻倍的輕量級架構！

---

## 一、核心心法一：破解「五筆假資料的甜蜜幻覺」——千筆壓測震撼教育

### 1. 為什麼 5 筆假資料會徹底欺騙你？

在剛開始開發時，我們身邊通常只有幾筆隨手打的假資料（例如：*「測試商品 1」、「測試商品 2」*）。

這時，AI 寫代碼是極其隨性的。它經常會在清單裡面寫出**「多重巢狀迴圈（Nested Loops / O(N²) 演算法）」**——也就是說，每當它要顯示一筆商品，它就傻傻地去把整個資料庫從頭到尾翻找一遍。

<div class="vibe-box-concept">
  <span class="badge">💡 生活化比喻 · 客廳騎車 vs 高速公路大塞車</span>
  <p><strong>5 筆假資料</strong>：就像在自家寬敞的客廳裡騎腳踏車，就算你閉著眼睛亂騎，也不會撞到任何東西，感覺順暢無比。</p>
  <p><strong>500 筆真實資料</strong>：就像連假時湧入雪山隧道的高速公路車潮！只要收費站入口設計不良，整條高速公路瞬間回堵 20 公里，所有車輛全部熄火動彈不得！</p>
</div>

![五筆假資料的甜蜜幻覺 vs 五百筆真實資料的慘劇](/assets/diagrams/vibe-coding-five-mock-data-trap.svg)

看看上面這張圖的數學現實：
- 當資料只有 **5 筆** 時，雙重迴圈的計算次數是 `5 × 5 = 25` 次。現代電腦一毫秒就算完了，你完全看不出破綻。
- 當資料長大到 **500 筆** 時，計算次數瞬間暴衝到 `500 × 500 = 250,000` 次！手機 CPU 直接滿載 100%，畫面當然凍結卡死！

### 2. 實戰指揮術：用「1,000 筆假資料」給 AI 一場震撼教育

從今天起，每當你讓 AI 做任何帶有列表、表格、搜尋或篩選的功能時，**在驗收的第一秒，立刻命令它生成 1,000 筆假資料塞進去壓測**！

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">PROMPT TEMPLATE 05 · 千筆假資料極限壓測指令</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">我們剛做好的 [功能名稱，例如：商品管理列表 / 用戶訂單清單]。

請不要只用 3 筆資料測試！現在請替我寫一個臨時的資料產生腳本：
1. 【千筆壓測】：生成 1,000 筆具有真實隨機內容的 Mock Data（包含長文字、不同狀態、不同日期）。
2. 【效能審查】：當這 1,000 筆資料加載到當前頁面時，請檢查代碼中是否存在任何 O(N²) 的巢狀迴圈、重複遍歷或未做分頁的低效運算？
3. 【極速優化】：如果列表很長，請告訴我應該採取「虛擬列表（Virtual List）」還是「輕量分頁（Pagination）」來保證手機端滑動依然維持在 60 FPS 滿格流暢？

請將分析結果與優化後的代碼輸出給我。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Windsurf / Claude / ChatGPT</span>
    <span class="copy-hint">📋 點擊全選複製這段指令發送給 AI</span>
  </div>
</div>

---

## 二、核心心法二：骨肉分離三層法——換衣服永遠不要動手術

### 1. 非工程師最容易踩的雷：巨石神廟（Monolithic Blob）

當你一直跟 AI 對話：「幫我加這個」、「幫我算那個」，如果沒有適當叫停，AI 最習慣把所有東西寫在同一個檔案裡。

你打開那個檔，發現它有整整 1,500 行：
- 第 1 到 100 行：在抓網路資料（API Fetch）
- 第 101 到 300 行：在算打折公式、滿額免運、VIP 積分
- 第 301 到 800 行：在畫按鈕、彈出視窗、換背景顏色
- 第 801 到 1500 行：又在處理表單輸入檢查

這種把「衣服（UI 畫面）」跟「內臟（商業計算）」縫死在一起的做法，叫做**「巨石泥球架構」**。
後果就是：**你只是想把按鈕從左邊移到右邊，結果整套 VIP 打折公式被 AI 莫名其妙改壞了！**

![骨肉分離三層法架構圖](/assets/diagrams/separation-of-concerns-layers.svg)

### 2. 白話三層結構：衣服、肌肉、骨架分家

在正規軟體架構中，這叫做 **Separation of Concerns（關注點分離）**。記住以下這三層比喻，你就能像資深技術總監一樣指揮 AI：

1. 👔 **衣服層（UI View 元件）**：
   - 負責「長相」。只管按鈕排版、字體大小、顏色樣式。
   - **鐵律**：嚴禁在裡面寫複雜的資料庫運算或公式計算！
2. 💪 **肌肉層（Business Logic 模組）**：
   - 負責「出力」。打折計算、運費規則、權限檢查全部寫在這裡。
   - **鐵律**：它完全不知道畫面長怎樣！它只負責「輸入數字 A，產出結果 B」，獨立且極易測試。
3. 🦴 **骨架層（Data Schema 模型）**：
   - 負責「身體骨骼」。規定一個商品必須有哪些欄位（價格不能是負數、標題不能為空）。
   - **鐵律**：骨頭一固定，全系統所有模組都必須遵守這份契約。

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">PROMPT TEMPLATE 06 · 骨肉分離重構指令</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">請審查目前的 [檔案名稱，例如：CheckoutPage.jsx / Cart.astro]：

這個檔案目前過於臃腫，請替我進行「骨肉分離三層重構」：
1. 【剝離邏輯 (肌肉層)】：把所有關於「計算折扣、驗證資料、格式轉換」的運算邏輯，提取到獨立的 utils/ 或 services/ 純函數檔案中。
2. 【純化介面 (衣服層)】：讓 UI 元件變成單純的展示層，只負責接收 props 並呈現畫面，不再包含任何髒亂的商業邏輯。
3. 【固化結構 (骨架層)】：確保資料的型別定義（TypeScript Type 或 Schema）集中管理。

重構後請向我說明拆分出了哪些乾淨的小檔案，並確保現有功能完全不受影響。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Windsurf / Claude / ChatGPT</span>
    <span class="copy-hint">📋 點擊全選複製這段指令發送給 AI</span>
  </div>
</div>

---

## 三、核心心法三：水龍頭理論——揪出記憶體漏水與死循環請求

### 1. 什麼是記憶體漏水（Memory Leak）？

你一定遇過這種情況：
剛打開網頁時很順，但如果你開著分頁去泡杯咖啡，15 分鐘後回來，電腦風扇開始像飛機起飛一樣狂轉，瀏覽器卡死，甚至跳出「記憶體不足」的崩潰提示。

<div class="vibe-box-concept">
  <span class="badge">💡 生活化比喻 · 洗手台水龍頭忘了關</span>
  <p>AI 在寫程式時，常常會打開一個「監聽器」（例如：監聽使用者有沒有滾動視窗、或者每隔 1 秒檢查一次新訊息）。</p>
  <p><strong>這就像它打開了洗手台的水龍頭</strong>。</p>
  <p>但當使用者切換到其他頁面時，<strong>AI 常常忘了「隨手把水龍頭關掉」！</strong></p>
  <p>於是水一直在流，每切換一次頁面就多開一個水龍頭。10 分鐘後，水溢滿整個房間，整個瀏覽器的記憶體直接被淹死崩潰！</p>
</div>

### 2. 無效全域重繪（Unnecessary Re-render）

另一個常見的隱形殺手是：**「牽一髮動全身的無腦重畫」**。

舉例來說：你的畫面上有一張包含 50 個欄位的龐大表單。
當使用者在最後一個「備註」欄位打下一個英文字母時，因為 AI 的狀態管理不當，整個網頁從標題、輪播圖、下拉選單到所有按鈕，**整整 50 個元件全部被銷毀重新渲染了一次！**
使用者打字打得越快，畫面就越卡，打字延遲達到 0.5 秒，體驗極其折磨。

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">PROMPT TEMPLATE 07 · 記憶體漏水與重繪體檢指令</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">請對當前專案的 [特定頁面或主要元件] 進行深度的「效能與記憶體安全排查」：

請重點檢查以下三個最常見的暗礁：
1. 【未關閉的監聽器】：是否有任何 addEventListener、setInterval、setTimeout 或 WebSocket 連線在元件銷毀（unmount / cleanup）時沒有被正確清理？
2. 【死循環請求】：是否有任何 useEffect 或生命週期鉤子因為依賴陣列（dependencies）設置錯誤，導致每秒鐘都在無休止地向伺服器發送重複的 API 請求？
3. 【過度重繪 (Re-render)】：是否有局部的輸入狀態（如打字輸入框）意外觸發了整個大頁面的全域重新渲染？如何將狀態局部化（State Colocation）來提升流暢度？

請列出所有發現的效能隱患，並提供修復後的代碼。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Windsurf / Claude / ChatGPT</span>
    <span class="copy-hint">📋 點擊全選複製這段指令發送給 AI</span>
  </div>
</div>

---

## 四、核心心法四：軟體瘦身大作戰——告別 85MB 臃腫巨怪

### 1. 你的網站到底被塞了多少贅肉？

很多非工程師在做網站時，完全沒有「檔案體積」的概念。

AI 為了省事，常常會做出極其誇張的舉動：
- **拿 5MB 的原圖當按鈕圖示**：你隨手丟給 AI 一張用手機拍的 4000x3000 高解析度照片，AI 就直接把它當成網頁右上角 40x40 像素的小頭像。使用者每打開一次網頁，就在背景默默下載 5MB 的肥大圖檔！
- **重複引入多套字型庫與圖示庫**：為了用一個愛心圖標，裝了一整套 FontAwesome；為了用一個購物車圖標，又裝了一整套 Lucide。

![軟體瘦身前後對照圖](/assets/diagrams/dependency-diet-comparison.svg)

看看上面這張圖的驚人對比：
- 經過 AI 胡亂堆疊的未優化網站，打包出來高達 **85 MB**，在 4G 手機上打開要乾等 6.8 秒。
- 經過架構瘦身後的現代網站，體積可以壓到 **180 KB**（縮小了 99.7%），打開速度只要 0.2 秒！

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">PROMPT TEMPLATE 08 · 依賴大掃除與資源極限瘦身指令</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">請審查我們專案的 package.json 與靜態資源目錄（public/ 或 assets/）：

我們現在要進行「極致效能瘦身大作戰」：
1. 【清除幽靈依賴】：檢查是否有已經沒在用、或者只被引用了一次的肥大第三方套件？請列出清單，並用原生的 Web API 取代它們。
2. 【圖片與資源最佳化】：是否有任何超過 200KB 的未壓縮圖片？請提供壓縮建議，或教我如何將圖示全面替換為輕量級的向量 SVG 或 WebP 格式。
3. 【打包體積分析】：如果我們執行 build 編譯，目前最大的 JavaScript 檔案是哪一個？我們應該如何進行代碼分割（Code Splitting）或延遲載入（Lazy Loading）？

請給出明確的執行步驟，目標是將首頁載入體積縮小至 500KB 以內！</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Windsurf / Claude / ChatGPT</span>
    <span class="copy-hint">📋 點擊全選複製這段指令發送給 AI</span>
  </div>
</div>

---

## 本篇總結：輕盈，才是軟體的最高境界

在傳統建築學裡，有一句名言：**「多餘的裝飾，是結構脆弱的遮羞布。」**

在 Vibe Coding 的世界裡更是如此：
- 一個需要塞滿幾十個套件、動不動就卡死當機的系統，哪怕外觀再漂亮，本質上依然是一個弱不禁風的玩具。
- 一個懂得**「千筆假資料壓測」**、**「骨肉分離三層解耦」**、**「水龍頭隨手關閉」**的系統，才能禁得起真實使用者的考驗，為你的業務創造長久的商業價值！

---

### 🚀 繼續閱讀系列完結篇（下篇）
系列大完結篇已正式上線！歡迎點擊閱讀：  
👉 [**《Vibe Coding 不翻車指南（下）：告別「動一行崩全家」的長治久安 SOP——非工程師的自動化守門與全身健檢法》**](/tutorials/vibe-coding-defense-guide-part-3/)
- **金鑰保險箱法則**：徹底杜絕 API Key 外洩遭盜刷破產的地雷。
- **三道極簡自動化守門員**：0 測試代碼門檻，在發布前自動攔截 404 死連結與肥大資源。
- **專案長大後的「AI 全身健康體檢」SOP**：一套可以直接貼給 AI 的定期健檢手冊。
