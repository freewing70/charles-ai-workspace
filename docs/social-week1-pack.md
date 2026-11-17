# FreewingBiz Week 1 社群增長內容包（FB + Threads 7 日實戰矩陣）

> **發布鐵則（Meta 演算法防限流規範）**
> 1. **主文零網址**：Threads【主串 1/3】【留言 2/3】與 Facebook【FB 主文】嚴禁出現任何外部網址或網域連結，避免被 Meta 判定導流而大幅限流。
> 2. **一樓放 UTM**：所有導流連結統一放置於 Threads【留言 3/3（一樓導流）】與 Facebook【FB 一樓留言】，並夾帶完整 `utm_source`、`utm_medium=social`、`utm_campaign=week1` 參數以利 GA4 成效歸因。
> 3. **圖文必配**：請依每日指定路徑夾帶官方高解析封面圖（建議優先使用 `.png` / `.jpg` 直接上傳社群平台）。

---

## 總覽排程表（Week 1：Day 1 ～ Day 7）

| 天數 | 主題資產 | 目標受眾 | 核心鉤子 | 配圖路徑 |
| :--- | :--- | :--- | :--- | :--- |
| **Day 1** | AI 電影運鏡工程模擬器 | AI 短影音／網劇創作者 | 別再盲目抽卡燒算力！用 3D 雙視角把運鏡當工程來寫 | `public/assets/covers/camera-controls.png` |
| **Day 2** | Vibe Coding 不翻車指南（上） | 非工程師創作者／PM／設計師 | 為什麼 AI 寫程式第 3 天像神，第 2 週直接變違章危樓？ | `public/assets/covers/vibe-coding-defense-guide-part-1.png` |
| **Day 3** | AI Film Director 開源系統 | AI 影視導演／ComfyUI 玩家 | 拆解《HELL GRIND》115,581 筆生成紀錄：連戲靠的不是 Prompt | `public/assets/covers/ai-film-director.png` |
| **Day 4** | Vibe Coding 進階心法（上） | Cursor / Claude 重度創作者 | 比 Prompt 更重要：把 AI 野馬套上韁繩的 Harness 束具工程 | `public/assets/covers/vibe-coding-harness-engineering-part-1.png` |
| **Day 5** | 企業級 RAG 知識庫架構指南 | 技術架構師／AI 導入團隊 | 為什麼你家的企業知識庫總是「已讀亂回」？Naive RAG 的三大死穴 | `public/assets/covers/enterprise-rag-architecture-guide.png` |
| **Day 6** | 本地 LLM 部署實戰：vLLM vs. Ollama | 後端工程師／AI Infra 團隊 | 單機跑很順，10 人同時問就炸？從顯存碎片揭開吞吐量 5 倍差距 | `public/assets/covers/local-llm-deployment-vllm-ollama.png` |
| **Day 7** | 水墨武俠風 Prompt 規範 Skill | 遊戲概念美術／AI 插畫創作者 | 拒絕西式霓虹光劍！用「墨分五色、飛白留白」奪回東方武俠靈魂 | `public/assets/covers/ink-wuxia-fantasy.jpg` |

---

## Day 1：AI 電影運鏡工程模擬器（40 款標準鏡頭 × 3D 雙視角）

- **配圖檔案路徑 (Image Asset to Attach)**：`public/assets/covers/camera-controls.png`
- **目標頁面**：`/skills/camera-controls`

### Threads 三段式串文 (Threads 3-Part Thread)

**【主串 1/3】**
做 AI 影片最心痛的瞬間，不是畫面崩壞，而是你花了 500 點算力抽卡，才發現「cinematic camera movement」根本只是在開盲盒。

真正的電影導演，從來不靠形容詞碰運氣。
運鏡不是玄學，是精密的「三維空間物理坐標」。

我把 40 款好萊塢標準鏡頭語言做成了一個純前端 3D 雙視角模擬器——左邊看觀景窗構圖，右邊看實體機位軌跡，按一下直接幫你編譯出各大模型專用提示詞。

想告別抽卡地獄的，往下看拆解，工具連結放最後一樓 👇

**【留言 2/3】**
這套免費線上模擬器幫你解決 3 個最大痛點：
1️⃣ **40 款物理與光學運鏡全收錄**：從基礎三軸（Pan / Tilt / Dolly）、光學變焦（Dolly Zoom 眩暈推拉）到 FPV 俯衝、子彈時間，全部有實體坐標與焦段（24mm / 35mm / 50mm / 85mm）即時預覽。
2️⃣ **5 大爆款短劇連貫分鏡模板**：內建「爽劇主角登場」、「懸疑真相崩潰」、「極限追逐戰鬥」等 9 秒三鏡接力組合包，直接看透爆款節奏。
3️⃣ **7 大模型提示詞一鍵轉譯**：選好運鏡與速度，自動輸出 Kling 可靈、Runway、Luma、OpenAI Sora、Wan / ComfyUI、Seedance、MiniMax H3 專用格式，複製就能生。

**【留言 3/3（一樓導流）】**
免註冊、打開瀏覽器就能直接玩（建議用電腦版開雙視角體驗最爽）🎬
👉 立即啟動《AI 電影運鏡工程模擬器》：
https://freewingbiz.com/skills/camera-controls?utm_source=threads&utm_medium=social&utm_campaign=week1

---

### Facebook 深度乾貨貼文 (FB Post)

**【FB 主文】**
做 AI 短影音時，你算過自己有多少算力是浪費在「鏡頭亂飄」上的嗎？

前陣子幫一位拍 AI 短劇的朋友看分鏡，他為了生出「主角霸氣登場、低角度推近再半環繞」的 5 秒鏡頭，在可靈跟 Runway 來回抽了快 30 次卡。不是人物臉變形，就是攝影機直接穿牆飛走。

問題出在我們習慣用「文學形容詞」跟 AI 溝通，卻忘了 AI 影片模型吃的是「攝影物理參數」。寫「震撼的電影感鏡頭」，模型根本不知道你要 24mm 低仰拍，還是 85mm 淺景深滑軌推近。

為了告別抽卡玄學，我在 FreewingBiz 打造了一台免費、免安裝的線上工作站——**《AI 電影運鏡工程模擬器》**，把運鏡拉回精確的空間工程：

✅ **雙視角 3D 即時預覽**：左側 4K 觀景窗（含九宮格構圖線），右側真實三維機位軌跡，先看懂攝影機怎麼飛再花算力。
✅ **40 款標準運鏡 × 5 大短劇分鏡包**：收錄 FPV 俯衝、荷蘭傾斜角、子彈時間等 40 種鏡頭，並內建「爽劇打臉」、「懸疑反轉」、「生死追逐」9 秒三鏡連貫模板。
✅ **7 大模型一鍵編譯**：支援可靈 Kling、Runway、Luma、Sora、Wan / ComfyUI、Seedance 與 MiniMax H3，選好焦段與速度即可複製語法。

先把鏡頭語言對齊，算力自然省一半。完整線上工具連結我放在留言區一樓 👇

**【FB 一樓留言】**
《AI 電影運鏡工程模擬器》完全免費、免登入，打開網頁即可直接互動模擬與一鍵複製 7 大平台提示詞 🎥👇
https://freewingbiz.com/skills/camera-controls?utm_source=facebook&utm_medium=social&utm_campaign=week1

---

## Day 2：Vibe Coding 不翻車指南（上）：防禦性指揮心法

- **配圖檔案路徑 (Image Asset to Attach)**：`public/assets/covers/vibe-coding-defense-guide-part-1.png`
  - *(可選加附輪播配圖：`public/assets/diagrams/vibe-coding-tower-metaphor.svg` 轉 PNG)*
- **目標頁面**：`/tutorials/vibe-coding-defense-guide-part-1`

### Threads 三段式串文 (Threads 3-Part Thread)

**【主串 1/3】**
用 Cursor 或 Claude 寫程式，是不是每次都「前 3 天覺得自己是神，第 2 週想把電腦砸了」？

你只是請它「把結帳按鈕改成綠色」，結果會員登入莫名其妙掛掉；接著 AI 開始無限道歉：「非常抱歉我忽略了邏輯……」越改越爛。

這不是 AI 變笨，是 LLM 天生的「打補丁慣性」，正在把你的心血蓋成一座隨時會垮的違章危樓。

整理了非工程師必學的 4 大防禦心法，救回你快失控的專案 👇

**【留言 2/3】**
給非資工創作者的 Vibe Coding 防翻車 4 鐵則：
1️⃣ **拒絕打補丁，先動手術**：天花板漏水，AI 會拿塑膠桶接水（隨手加 `if !== undefined` 掩蓋報錯）。一定要逼它追查資料流根因，禁止表面敷衍。
2️⃣ **單一真實來源（SSOT）**：全台灣只有戶政事務所有權威戶籍。別讓 AI 在首頁存 LocalStorage、結帳頁又自己算一次，資料會徹底打架。
3️⃣ **套件斷捨離**：AI 最愛叫你 `npm install` 裝一堆肥大函式庫。記住原生 JS（如 `fetch`、`Intl`）幾行就能解決，別為了吃一顆蘋果搬回整座果園。
4️⃣ **兩次道歉即回滾**：同個 Bug 修兩次還錯，代表上下文已被垃圾補丁污染，立刻 Discard 回滾並開新視窗！

**【留言 3/3（一樓導流）】**
我在文章裡附了 4 套可直接複製貼給 Cursor / Claude 的「防禦性指揮 Prompt 錦囊」（含根因手術指令與重啟對話模板）🛠️
👉 完整圖解教學與 Prompt 免費取用：
https://freewingbiz.com/tutorials/vibe-coding-defense-guide-part-1?utm_source=threads&utm_medium=social&utm_campaign=week1

---

### Facebook 深度乾貨貼文 (FB Post)

**【FB 主文】**
「前三天我以為不用學寫程式也能做出 App，到了第二週，改一個按鈕顏色就讓整個網站白畫面。」

這是位設計師朋友上週的哀號。很多非工程背景創作者打開 Cursor 或 Claude，靠自然語言幾天內就能生出酷炫原型；但蜜月期總在第 2 到第 3 週結束——檔案暴增到七八十個，改 A 壞 B，AI 陷入「非常抱歉我重改」的道歉死循環。

這背後的元兇，是 **LLM 的「貪婪打補丁本能」**。

就像天花板漏水，專業師傅會上頂樓修防水層；AI 為了最快讓眼前不報錯，只在下方貼膠帶、放水桶接水，然後笑著告訴你修好了。底層邏輯繼續腐爛，直到系統全面坍塌。

在**《Vibe Coding 不翻車指南（上）》**中，我整理了非工程師也能直接套用的四大防禦心法：

🔹 **先動手術、拒絕表面補丁**：用「架構審查指令」逼 AI 交出資料流根因，禁止用空 `try-catch` 硬蓋錯誤。
🔹 **戶政事務所原則（單一真實來源）**：寫跨頁功能前先定義權威資料放哪，杜絕首頁與結帳頁各算各的。
🔹 **拒絕幽靈依賴**：AI 動不動叫你裝套件？教你用原生 Web APIs 取代肥大函式庫，網站才不會慢如牛。
🔹 **兩次道歉黃金煞車**：同個錯修兩次還失敗，果斷回滾存檔、開乾淨對話重來，絕不讓它試第三次。

你的角色不是打字機，而是手握藍圖的總指揮官。完整萬字講義與 4 套可複製 Prompt 錦囊連結我放在留言區一樓 👇

**【FB 一樓留言】**
《Vibe Coding 不翻車指南（上）：別讓 AI 害你寫出「違章危樓」》完整文章＋4 套可直接貼給 Cursor / Claude 的防禦性 Prompt 模板，點擊閱讀並收藏 🛠️👇
https://freewingbiz.com/tutorials/vibe-coding-defense-guide-part-1?utm_source=facebook&utm_medium=social&utm_campaign=week1

---

## Day 3：AI Film Director｜拆解《HELL GRIND》115,581 筆生成紀錄

- **配圖檔案路徑 (Image Asset to Attach)**：`public/assets/covers/ai-film-director.png`
- **目標頁面**：`/skills/ai-film-director`

### Threads 三段式串文 (Threads 3-Part Thread)

**【主串 1/3】**
想靠「寫出一段完美 Prompt」拍出會連戲的 AI 電影？
我們逆向研究了 Higgsfield Studio 長片《HELL GRIND》超過 **115,581 筆**真實生成紀錄，結果超反直覺：

在這 11 萬多支生成任務裡，純靠 Text-to-Video（純文字生成）的鏡頭，**不到 3%**！

真正專業的 AI 電影導演，管理的根本不是 Prompt，而是「World State（世界狀態）」。

這套已經開源的 **AI Film Director** 製作管線怎麼運作？往下看 👇

**【留言 2/3】**
拆解《HELL GRIND》115,581 筆數據背後的三大工程真相：
1️⃣ **97% 高度依賴狀態鎖定**：幾乎所有鏡頭都綁定了 Character LoRA、Face ID、深度圖或上一鏡尾幀，絕對不讓模型重新憑空想像。
2️⃣ **拆解「身分」與「瞬時狀態」**：角色長相是不可變的 Identity；但衣服濕度（0.85）、左臉瘀青、右手握著生鏽鐵鑰匙，必須寫進 `World State` 帳本，跨鏡繼承！
3️⃣ **Prompt 只是編譯結果**：把空間走位（GEO）、可觀察生理表演（Acting，例如「瞳孔微縮」而非「感到恐懼」）與運鏡規格（Camera）模組化後，再由 Prompt Compiler 針對 Kling / Veo / Seedance / WAN 自動編譯輸出。

**【留言 3/3（一樓導流）】**
我把這套四階段製作系統＋標準化 JSON Schema＋5 項連戲 QC 檢核機制全部開源打包了，直接下載就能套進你的 Claude / Gemini / Codex 工作流 🎬
👉 完整架構拆解與開源 ZIP 下載：
https://freewingbiz.com/skills/ai-film-director?utm_source=threads&utm_medium=social&utm_campaign=week1

---

### Facebook 深度乾貨貼文 (FB Post)

**【FB 主文】**
為什麼多數 AI 影片只能停在「帥氣的 5 秒 MV 混剪」，卻拍不出有劇情的長片？

一旦超過 10 個鏡頭，每鏡重寫 Prompt 的做法就會崩潰——上一秒主角右手拿鑰匙、左臉瘀青、全身濕透；下一鏡換個機位，鑰匙沒了、傷口癒合、衣服還自動烘乾。

為了解決這個「連戲災難」，我們逆向研究了 Higgsfield Studio 公開長片《HELL GRIND》高達 **115,581 筆**生成紀錄，發現一個震撼事實：**超過 97% 的鏡頭都綁定了固定參考資產與尾幀傳遞，純文字抽卡的鏡頭不到 3%。**

基於這項研究，我整理並開源了 **《AI Film Director》** 製作系統。核心哲學只有一句：**不要每一鏡重新描述世界；維護 World State，然後編譯鏡頭。**

這套開源工作流分成四個嚴謹階段：
🎬 **1. 穩定 ID 規劃**：每個場景與鏡頭配賦唯一識別碼（如 `SC02_SH02`）與精準秒數預算。
🎬 **2. 世界狀態帳本**：將「不變的角色長相」與「瞬時物理狀態」（如濕度 0.85、瘀青、手持鐵鑰匙）分離管理，跨鏡繼承。
🎬 **3. Prompt Compiler**：把空間走位（GEO）、可觀察生理表演（如瞳孔微縮，而非抽象情緒詞）與運鏡（Camera），自動編譯成 Kling、Veo、Seedance、WAN 專用格式。
🎬 **4. 五大連戲 QC 回寫**：檢查道具守恆與光影方向，通過後自動把尾幀狀態回寫帳本。

想把 AI 生片升級成工業管線？完整規格書與開源包下載連結我放在留言區一樓 👇

**【FB 一樓留言】**
《AI Film Director》完整研究拆解、JSON Schema 範例與開源整合包（支援 Claude / Gemini / Codex 等 Agent）全部免費取用 🎬👇
https://freewingbiz.com/skills/ai-film-director?utm_source=facebook&utm_medium=social&utm_campaign=week1

---

## Day 4：Vibe Coding 進階心法（上）：什麼是 Harness 束具工程？

- **配圖檔案路徑 (Image Asset to Attach)**：`public/assets/covers/vibe-coding-harness-engineering-part-1.png`
  - *(可選加附輪播配圖：`public/assets/diagrams/harness-concrete-mold-metaphor.svg` 轉 PNG)*
- **目標頁面**：`/tutorials/vibe-coding-harness-engineering-part-1`

### Threads 三段式串文 (Threads 3-Part Thread)

**【主串 1/3】**
還在研究怎麼把 Prompt 寫得像咒語一樣長？
矽谷頂級工程師早就不再比誰會「寫 Prompt」，他們現在都在卷的是 **Harness Engineering（束具與鷹架工程）**。

沒有 Harness 的 Vibe Coding，就像把一整車「液態水泥」直接倒在泥地上——AI 狂噴 500 行代碼，最後凝固成一攤無法修改的廢墟。

真正的高手在敲第一行代碼前，會先釘好鋼筋板模。

3 個步驟，教你替失控的 AI 野馬套上韁繩 👇

**【留言 2/3】**
非工程師也能直接落地的 Harness 三大支柱：
1️⃣ **寫扣前先簽「3 張白話規格卡」**：在 AI 動工前，逼它先產出「邊界圍欄卡（做什麼＆絕對不碰什麼）」、「資料契約卡」與「小學生都能測的驗收卡」。禁止它直接寫扣！
2️⃣ **把家規刻在門框上（`.cursorrules` / `CLAUDE.md`）**：AI 是沒有長期記憶的臨時工，對話聊長就會忘記規矩。把「禁止亂裝套件、只做最小手術修改、兩次報錯即回滾」寫進根目錄憲法，每次開工自動強制載入。
3️⃣ **邊界鎖定發布術**：規格確認後，帶著規格卡與家規雙重鎖定下令施工，讓 AI 只能在板模裡灌漿，產出筆直穩固的功能大樑。

**【留言 3/3（一樓導流）】**
我把可直接複製使用的「規格驅動探勘器 Prompt」跟「非工程師專用 `.cursorrules` 專案憲法範本」全部整理進這篇教學了 🏗️
👉 立即領取實戰憲法與模板：
https://freewingbiz.com/tutorials/vibe-coding-harness-engineering-part-1?utm_source=threads&utm_medium=social&utm_campaign=week1

---

### Facebook 深度乾貨貼文 (FB Post)

**【FB 主文】**
很多讀者看完防翻車指南後問我：「每次要開新功能，我還是只能對著空白視窗跟 AI 許願，然後看著它狂噴 500 行代碼心驚膽顫……能不能在第一行程式碼敲下去之前，就先把 AI 框在軌道上？」

這正是普通玩家與矽谷頂尖指揮官的分水嶺：**Harness Engineering（束具與鷹架工程）**。

Harness 原意是馬匹的韁繩或賽道護欄。在 AI 開發裡，最好的比喻是「建築灌漿」：沒釘好板模就直接把液態水泥車開進來狂倒，代碼一定溢出邊界、凝固成一攤廢墟。

頂級指揮官從不盯著工人每一鏟泥土（不用自己看懂程式碼），而是專注在**開工前把板模釘得無懈可擊**！

這篇進階指南拆解了非工程師就能上手的三大鷹架支柱：
🏗️ **支柱一｜規格防護罩**：逼 AI 寫扣前先簽署「邊界圍欄卡（明文規定禁碰檔案）」、「資料契約卡」與「小學生都能測的驗收清單」，終結範圍膨脹。
📜 **支柱二｜專案家規憲法**：別再口頭交代規矩！在根目錄建立 `.cursorrules` 或 `CLAUDE.md`，把「零套件膨脹、手術刀修改、兩次報錯自動喊停」寫成門禁守則。
🔒 **支柱三｜邊界鎖定發布**：帶著規格與憲法雙重鎖定下達施工令，完工後逐條對照驗收清單自檢回報。

從「被動幫 AI 擦屁股」升級成「主動立規矩」，這就是 Harness 的威力。完整萬字講義與可複製憲法範本連結我放在留言區一樓 👇

**【FB 一樓留言】**
《Vibe Coding 進階心法（上）：學會 Harness Engineering》完整圖解＋可直接複製放進專案的 `.cursorrules` 憲法範本與規格啟動 Prompt 🏗️👇
https://freewingbiz.com/tutorials/vibe-coding-harness-engineering-part-1?utm_source=facebook&utm_medium=social&utm_campaign=week1

---

## Day 5：企業級 RAG 知識庫架構指南：為什麼總是答非所問？

- **配圖檔案路徑 (Image Asset to Attach)**：`public/assets/covers/enterprise-rag-architecture-guide.png`
- **目標頁面**：`/tutorials/enterprise-rag-architecture-guide`

### Threads 三段式串文 (Threads 3-Part Thread)

**【主串 1/3】**
公司花大錢把幾千份 PDF 塞進向量資料庫，結果員工一問規格，AI 還是自信滿滿地「已讀亂回」？

別再怪大模型太笨了！90% 的企業 RAG 翻車，都是因為用了玩具等級的 **Naive RAG（固定 500 字暴力切塊＋純餘弦向量檢索）**。

當你的合約條款或零件型號被從中間攔腰斬斷，神仙也救不了檢索準確率。

如何把企業問答準確率從 65% 拉升到 92% 以上？這 4 層架構升級必看 👇

**【留言 2/3】**
企業級進階 RAG 落地的 4 個關鍵工程升級：
1️⃣ **AST 語義階層切分**：放棄固定字數切塊！先把 PDF 轉 Markdown，依 `# / ## / ###` 標題層級切分並把章節路徑寫入 Metadata，保留完整上下文與表格結構。
2️⃣ **混合檢索（Dense + BM25）**：純向量對產品代號（如 `RTX-4090-D`、`ISO-9001 條款 7.1.5`）匹配度極差。務必搭配 BM25 稀疏檢索，再用 RRF（倒數排名融合）合併分數。
3️⃣ **Cross-Encoder 重排序（Reranker）**：先大範圍召回 30～50 筆候選片段，再用 `bge-reranker-large` 精準重排，只把 Top 3～5 筆送進 LLM，徹底消除「迷失在中間」的噪音幻覺。
4️⃣ **Ragas 量化回歸測試**：別靠人工肉眼抽查 5 題！用忠實度、相關度與召回率四大指標建立黃金測試集，每次調整切分策略都能量化驗證。

**【留言 3/3（一樓導流）】**
我把整套架構圖、Python 實戰程式碼（LangChain MarkdownSplitter、RRF 融合公式與 BGE-Reranker 調用）都整理進這份指南了 📚
👉 完整企業級 RAG 工程指南：
https://freewingbiz.com/tutorials/enterprise-rag-architecture-guide?utm_source=threads&utm_medium=social&utm_campaign=week1

---

### Facebook 深度乾貨貼文 (FB Post)

**【FB 主文】**
「公司把十年來的 SOP、合約跟產品手冊全塞進 RAG 系統了，為什麼問特定型號的保固條款，AI 還是給我亂編？」

幫企業做 AI 健檢時，這幾乎是每組團隊都會撞上的牆。多數人照入門教學搭了「樸素 RAG（Naive RAG）」：PDF 上傳 ➔ 固定 500 字元硬切 ➔ 轉向量存入資料庫 ➔ Top-K 丟給 LLM。Demo 時看似很神，一上線立刻原形畢露。

原因很現實，傳統做法有三個致命死穴：
❌ **語義斷裂**：固定字數把跨頁表格與條件條文從中間硬生生斬斷。
❌ **專有名詞失真**：純向量擅長抓同義詞，碰到 `ISO-9001:2015 條款 7.1.5` 或精確零件料號反而容易失準。
❌ **噪音淹沒**：塞太多似是而非的片段進 Context，誘發 LLM「迷失在中間」的幻覺。

在**《企業級 RAG 檢索增強生成架構實戰》**指南中，我們拆解了將準確率從 65% 拉升至 92% 以上的閉環架構：
✅ **Markdown AST 階層切分**：保留章節路徑至 Metadata，片段永遠自帶背景脈絡。
✅ **混合檢索＋RRF 融合**：語義向量與 BM25 精確關鍵詞雙軌並進，聽得懂人話也找對料號。
✅ **Cross-Encoder 重排序**：粗篩 30～50 筆候選後，交由 `bge-reranker-large` 精選 Top 3～5 筆送進模型。
✅ **Ragas 量化評估**：建立黃金測試集，用忠實度與召回率數據控管幻覺。

完整架構圖與 Python 實作代碼連結我放在留言區一樓 👇

**【FB 一樓留言】**
《企業級 RAG 檢索增強生成架構實戰》完整文章含架構流程圖、Python AST 切分、RRF 融合與 BGE-Reranker 範例代碼，歡迎工程團隊收藏實作 📚👇
https://freewingbiz.com/tutorials/enterprise-rag-architecture-guide?utm_source=facebook&utm_medium=social&utm_campaign=week1

---

## Day 6：本地 LLM 部署終極對決：vLLM vs. Ollama 吞吐量與架構實測

- **配圖檔案路徑 (Image Asset to Attach)**：`public/assets/covers/local-llm-deployment-vllm-ollama.png`
- **目標頁面**：`/tutorials/local-llm-deployment-vllm-ollama`

### Threads 三段式串文 (Threads 3-Part Thread)

**【主串 1/3】**
公司想自建本地大模型保護機密資料，工程師用 Ollama 五分鐘就跑起來了，結果一開放給部門 20 人同時用，整個伺服器直接卡死 OOM？

先說結論：**Ollama 是神級的個人開發工具，但絕對不是高併發生產引擎！**

當多用戶同時發送請求，靜態批處理會造成高達 **60%～80% 的顯存碎片浪費**。

想讓企業內網的雙卡伺服器流暢撐起上百人同時推論？你必須搞懂 Ollama 與 vLLM 的本質差異 👇

**【留言 2/3】**
本地 LLM 從個人玩具走向企業生產級部署的 4 個關鍵指標：
1️⃣ **顯存估算先算對**：`總顯存 = 權重 + KV Cache + CUDA 開銷`。32K 長上下文時，KV Cache 甚至會吃掉比模型權重還多的 VRAM！
2️⃣ **量化天梯別選錯**：桌面／Mac 混跑首選 `GGUF (Q4/Q5)` 搭配 Ollama；但只要上了 NVIDIA 資料中心 GPU（A10G / L40S / H100），生產端首選精度損耗 <1% 且吃滿 Tensor Core 的 **AWQ 4-bit**。
3️⃣ **PagedAttention 消除顯存浪費**：vLLM 借鑑作業系統虛擬記憶體分頁機制，把 KV Cache 顯存浪費從 60%～80% 直接壓低到 **4% 以下**。
4️⃣ **Continuous Batching 吞吐翻 3～5 倍**：不用等整批請求全部生成完才放行下一批，每個 Token 解碼步都能動態插隊，併發效能徹底拉開差距。

**【留言 3/3（一樓導流）】**
文章內直接附上顯存計算公式、Ollama Modelfile 實例、vLLM 雙卡 Tensor Parallelism Docker Compose 配置與 `benchmark_serving.py` 壓測指令 ⚙️
👉 完整本地大模型部署與顯存優化指南：
https://freewingbiz.com/tutorials/local-llm-deployment-vllm-ollama?utm_source=threads&utm_medium=social&utm_campaign=week1

---

### Facebook 深度乾貨貼文 (FB Post)

**【FB 主文】**
今年越來越多企業面臨共同抉擇：商業閉源 API 雖然方便，但醫療紀錄、金融交易與製程專利不能出內網；加上批次調用量放大後，按 Token 計費的月帳單更像無底洞。

於是團隊買了 GPU 伺服器，用大家最熟的 Ollama 一鍵拉起 Qwen，單機測試飛快無比——沒想到正式開放給 20 位同事同時調用，顯存瞬間爆滿（OOM），大家排隊等一個字等半天。

這不是模型太重，而是**「開發引擎」與「生產引擎」的架構錯配**！

Ollama 基於 `llama.cpp`，對單機低併發與 Mac 混合卸載極度友善；但在高併發場景下，傳統靜態批處理會為預留連續空間而浪費高達 **60%～80% 的顯存碎片**。

在**《2026 本地開源大模型部署與顯存優化實戰指南》**中，我整理了從單機升級到高併發集群的關鍵路徑：
⚙️ **VRAM 精算與量化天梯**：長上下文下 KV Cache 會吃掉比權重更多的顯存！上 NVIDIA 生產機建議選精度損耗 <1% 的 **AWQ 4-bit**，而非桌機用的 GGUF。
⚙️ **vLLM 兩大核心技術**：**PagedAttention** 借鑑虛擬記憶體分頁，把顯存浪費壓到 4% 以下；**Continuous Batching** 讓每個解碼步都能動態插隊，吞吐量翻 3～5 倍。
⚙️ **雙卡實戰範本**：直接附上 `Qwen2.5-32B-AWQ` 雙卡張量並行的 Docker Compose 與 `TTFT / TPOT` 壓測指令。

用對推理引擎，標準雙卡伺服器就能扛起整間公司的 AI 工作流。完整實戰教程連結我放在留言區一樓 👇

**【FB 一樓留言】**
《2026 本地開源大模型部署與顯存優化實戰指南：從 Ollama 到 vLLM 高併發推理》完整架構對比、Docker Compose 配置與壓測腳本都在這裡 ⚙️👇
https://freewingbiz.com/tutorials/local-llm-deployment-vllm-ollama?utm_source=facebook&utm_medium=social&utm_campaign=week1

---

## Day 7：水墨武俠風 Skill｜拒絕西式霓虹光劍！東方美學 Prompt 規範

- **配圖檔案路徑 (Image Asset to Attach)**：`public/assets/covers/ink-wuxia-fantasy.jpg`
- **目標頁面**：`/skills/ink-wuxia-fantasy`

### Threads 三段式串文 (Threads 3-Part Thread)

**【主串 1/3】**
叫 AI 畫「竹林俠客揮劍，劍氣破空」，結果十次有九次生出拿著《星際大戰》藍色發光雷射劍的現代動漫人物？

這不是你詞窮，是西方訓練主導的生圖模型根本不懂什麼叫「計白當黑」與「氣韻生動」。
只要沒寫對物理媒介與負向約束，Midjourney 跟 Flux 就會自動把武俠畫成廉價西式網遊特效。

我整理了一套專治「國風塑膠霓虹感」的**《水墨武俠風 Skill》**，用傳統畫論的四大物理法則直接鎖死模型審美。

4 個核心英文關鍵詞，馬上讓你的水墨出圖質感翻倍 👇

**【留言 2/3】**
寫出高級東方水墨武俠，必須掌握這 4 個工程級關鍵詞模組：
1️⃣ **墨分五色（拒絕死黑灰階）**：加上 `five shades of traditional Chinese black ink, from pale grey wash to deep pitch charcoal black`，逼模型做出焦濃重淡清的層次。
2️⃣ **飛白與枯筆（拉出劍氣速度）**：用 `flying white dry brush strokes, raw calligraphic brush dragging texture`，模擬毛筆高速掠過生宣的絲縷留白，取代發光特效。
3️⃣ **大道留白（壓制填滿本能）**：宣告 `deliberate vast negative space, misty atmospheric void`，硬生生留出 40%～70% 的呼吸空間。
4️⃣ **點睛硃砂＋嚴格封殺**：全域黑白調中只許 `a single strategic splash of vermilion red`（例如劍穗或斗笠紅繩），並用 `--no lightsaber, neon glow, 3d render, glossy` 徹底封殺 3D 塑膠感！

**【留言 3/3（一樓導流）】**
我把完整的模組化語法架構、Midjourney v6.1 / Flux.1 / SDXL 參數對照表、3 大經典武俠實戰 Prompt 配方與完整 Skill ZIP 包都放好在站上了 🖌️
👉 領取《水墨武俠風 Skill》完整規範與資源包：
https://freewingbiz.com/skills/ink-wuxia-fantasy?utm_source=threads&utm_medium=social&utm_campaign=week1

---

### Facebook 深度乾貨貼文 (FB Post)

**【FB 主文】**
每次想用 AI 生一張「東方水墨武俠」，是不是常常氣到想關掉生圖軟體？

腦海裡想的是胡金銓電影裡竹林搖曳的肅殺意境、生宣紙上豪邁奔放的毛筆枯筆；結果 AI 吐出來的卻是拿著藍色霓虹光劍的俠客、背景塞滿雜亂噪點，皮膚還帶著一股 3D 塑膠反光。

原因很簡單：主流生圖模型（Midjourney、Flux、SDXL）多在西方審美語料下訓練。當你只寫「Chinese ink painting」，模型只會將它簡化成「黑白素描＋西式奇幻特效」。

要讓 AI 真正畫出千年書法的「氣韻」，必須把東方畫論翻譯成模型聽得懂的**物理媒介與光學指令**。這也是我封裝開源**《水墨武俠風 Skill》**的原因，核心鎖死四大法則：

🖌️ **1. 墨分五色**：強制建立從淡墨水漬到焦炭濃墨的五層灰階深度，告別死板黑白對比。
🖌️ **2. 飛白與枯筆**：用毛筆高速掠過宣紙的乾燥飛白紋理，取代廉價雷射發光，呈現內力破空的速度感。
🖌️ **3. 計白當黑（大道留白）**：壓制 AI 填滿畫面的本能，刻意保留 40% 以上呼吸空間與生宣纖維質感。
🖌️ **4. 點睛硃砂＋負向封殺**：只在劍穗或酒葫蘆留下一抹硃砂紅做視覺焦點，並用負向指令徹底封殺 `lightsaber`、`neon glow`、`octane render` 與 `glossy`。

文內附上「竹林劍氣」、「墨龍破雲」、「寒江獨釣」三大即用配方與各模型參數表。完整規範與免費下載連結我放在留言區一樓 👇

**【FB 一樓留言】**
《水墨武俠風 Skill》完整 Prompt 模組架構、Midjourney / Flux / SDXL 參數對照與開源資源包（`ink-wuxia-fantasy-skill.zip`）下載連結 🖌️👇
https://freewingbiz.com/skills/ink-wuxia-fantasy?utm_source=facebook&utm_medium=social&utm_campaign=week1
