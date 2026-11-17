---
id: "automated-e2e-testing-playwright-ai-agents"
title: "給 Vibe Coder 的自動化驗收神盾：用 Playwright MCP 讓 AI 寫完網頁自己開瀏覽器跑完 E2E 視覺測試"
type: "tutorial"
category: "Vibe Coding"
summary: "受夠 AI 寫完前端就自信宣布「Done!」，結果你自己點開瀏覽器卻發現滿屏 Console Error、按鈕按了沒反應、手機版破版嗎？本文教你把 Playwright MCP 與 Chrome DevTools MCP 接進 AI 編程迴圈，打造「5 步驟前端自動驗收與自癒閉環」：背景啟動伺服器、Console/Network 錯誤捕手、Accessibility Tree 語意樹定位、375px/1440px 雙視口視覺檢測與自動修復，附上完整 playwright.config.ts、冒煙測試腳本與 E2E 驗收指令錦囊！"
created: "2026-11-17"
updated: "2026-11-17"
version: "1.0"
status: "active"
visibility: "public"
tags: ["Vibe Coding", "Playwright", "MCP", "自動化測試", "E2E 測試", "Chrome DevTools", "前端驗收", "AI Agent"]
tools: ["Playwright", "Playwright MCP", "Chrome DevTools MCP", "TypeScript", "Cursor", "Claude Code"]
cover: "/assets/covers/automated-e2e-testing-playwright-ai-agents.png"
featured: true
---

## 導言：為什麼 AI 總是自信喊「Done!」，你點開網頁卻當場傻眼？

每位用過 Cursor、Windsurf 或 Claude Code 做 Vibe Coding 的創作者，一定都經歷過這個讓人血壓飆高的瞬間：

你請 AI 幫忙做一個「支援篩選與彈窗結帳的產品列表頁」。AI 飛快改了 6 個檔案、跑了一下 `npm run build` 顯示沒有語法錯誤，接著就在對話框自信滿滿地宣告：
> 「✅ 任務完成！所有功能與響應式設計都已實作完畢，您可以直接預覽！」

結果你滿懷期待打開 `localhost:4321`，現實卻狠狠賞你三個巴掌：
1. **白屏或按鈕點了沒反應**：打開 F12 開發者工具，Console 裡躺著兩條血紅色的 `TypeError: Cannot read properties of undefined` 或 React Hydration Mismatch 錯誤。
2. **幽靈破版（手機端災難）**：電腦版看起來勉勉強強，一換成 iPhone 視口（375px），側邊欄直接把主內容擠出螢幕右側，出現醜陋的水平捲軸。
3. **你被迫成為 AI 的「人肉測試員」**：你截圖、貼回對話框、告訴它哪裡壞了，來來回回折騰十幾輪，這根本不是 AI 幫你寫程式，而是你幫 AI 擦屁股！

這背後的根本原因只有一個：**大多數 AI Coding Agent 是「瞎子」——它們只看得到靜態原始碼，從來沒有自己打開真實瀏覽器看過網頁一眼！**

解決這個痛點的終極解方，就是把 **Playwright MCP**（或 **Chrome DevTools MCP**）接進 AI 的執行迴圈裡，賦予它「雙眼」與「雙手」，建立一套 **在宣布完工前，AI 自己開瀏覽器跑完 E2E 與視覺驗收的自動化神盾**。

---

## 🧠 觀念翻轉：靜態編譯通過 ≠ 網頁真的能用

在接上瀏覽器閉環之前，先看看「只跑 Build 檢查」與「Playwright MCP 實機閉環」的巨大落差：

<div class="vibe-grid-2">
  <div class="vibe-box-danger">
    <span class="badge">❌ 盲人摸象式 Vibe Coding</span>
    <p><strong>AI 只檢查 TypeScript 與 Build 編譯：</strong></p>
    <ul>
      <li><code>tsc --noEmit</code> 通過，但執行期資料為空時元件直接崩潰白屏。</li>
      <li>CSS class 名稱都存在，但 <code>z-index</code> 被遮罩擋住導致按鈕根本點不到。</li>
      <li>AI 永遠靠「猜測」修改排版，修好電腦版就弄壞手機版。</li>
    </ul>
  </div>
  <div class="vibe-box-success">
    <span class="badge">✅ Playwright MCP 自癒閉環</span>
    <p><strong>AI 寫完扣後，親自打開無頭瀏覽器驗收：</strong></p>
    <ul>
      <li>自動啟動 Dev Server 並導航至指定路由，零容忍捕捉所有 Console 與網路錯誤。</li>
      <li>透過 <strong>Accessibility Tree（無障礙語意樹）</strong> 精準模擬真實使用者點擊與輸入。</li>
      <li>同時擷取 375px 手機與 1440px 桌機截圖，自己檢查破版並修到通過為止！</li>
    </ul>
  </div>
</div>

---

## 🔄 核心架構：5 步驟前端自動驗收與自癒閉環（Self-Verifying Loop）

要讓 AI 真正做到「修到綠燈才回報」，我們必須在工作流裡植入標準化的 **5-Step Self-Verifying Frontend Loop**：

![Vibe Coding 自動化驗收閉環：讓 AI 寫完網頁自己開瀏覽器跑完 E2E 測試](/assets/diagrams/automated-e2e-testing-playwright-ai-agents-arch.svg)

### Step 1：背景啟動伺服器與健康檢查（Start Dev Server & Healthcheck）
AI 修改完程式碼後，不准直接宣告結束，第一步是確保開發伺服器或預覽伺服器已穩定啟動（例如監聽 `http://localhost:4321` 或 `3000`），並等待 HTTP 200 回應。若使用獨立 Playwright Test Runner，可直接交由 `playwright.config.ts` 的 `webServer` 欄位全自動生命週期管理。

### Step 2：無頭瀏覽導航與錯誤捕手（Console & Network Error Trap）
AI 透過 Playwright MCP 的 `browser_navigate` 開啟目標頁面，並立即掛載兩個核心監聽器（在腳本與 MCP 工具中皆適用）：
- **`console` 與 `pageerror` 監聽**：只要頁面出現任何未捕獲的 JavaScript 執行期例外、React/Vue Hydration 警告或資源 404 錯誤，立刻標記為 **FAIL**。
- **Network 5xx / 4xx 攔截**：確保所有關鍵 API 請求都正常回傳預期狀態碼，而非靜默失敗。

### Step 3：讀取語意無障礙樹（Accessibility Tree Snapshot）
這正是 **Playwright MCP** 比傳統「靠圖片猜座標」或「寫死脆弱 CSS Selector」強大十倍的秘密武器！
- AI 呼叫 `browser_snapshot` 取得頁面的 **Accessibility Tree（YAML 結構化語意樹）**，裡面清清楚楚列出了每個按鈕的 `role`、`name`、`ref` 編號以及是否處於 `disabled` / `expanded` 狀態。
- AI 不僅能極度精準地執行 `browser_click` 與 `browser_type` 完成整個「搜尋 → 點開彈窗 → 填寫表單 → 送出」的互動流程，還能順便驗證網站的 **無障礙（A11y）標籤是否完整**（如果某個圖示按鈕沒有文字或 `aria-label`，AI 在語意樹裡就會立刻發現它難以辨識並主動補上）。

### Step 4：雙視口視覺截圖與溢出檢查（Mobile & Desktop Viewport Check）
功能點擊都通過後，AI 依序將瀏覽器視口切換為：
- **手機端標準視口**：`375 x 812`
- **桌面端標準視口**：`1440 x 900`

接著執行兩項關鍵檢查：
1. **水平溢出掃描（Horizontal Overflow Check）**：在頁面執行 `document.documentElement.scrollWidth <= window.innerWidth`，確保不會出現破版橫向捲軸。
2. **實機截圖視覺審查（Screenshot Inspection）**：呼叫 `browser_take_screenshot` 產出 PNG 截圖（支援多模態視覺的模型如 Claude / GPT-4o / Gemini 可直接讀取截圖），肉眼核對文字是否重疊、按鈕是否超出卡片邊界、深色模式對比度是否清晰。

### Step 5：帶著證據自動修復與回歸重測（Auto-Fix & Re-test）
一旦 Step 2~4 任何一關報錯，AI **不需要來問你**，而是直接把「Console Error 堆疊 + 失敗時的 DOM Snapshot + 破版截圖」當作診斷依據，修改對應元件後自動重跑 Step 2~4。
> **安全煞車規範**：為避免陷入無限改錯迴圈，建議在規則中設定「連續自癒最多重試 3 次」，若第 3 次仍失敗則立即停手並附上完整錯誤證據向人類開發者回報。

---

## 🔌 環境配置：把 Playwright MCP 與 Chrome DevTools MCP 接上你的工具

只需要一段極簡的 JSON 設定，就能讓 Cursor、Claude Desktop 或支援 MCP 的 AI Coding Agent 擁有操控真實瀏覽器的能力。

### 1. 設定 `.cursor/mcp.json`（或 Claude `mcp_config.json`）

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest",
        "--headless"
      ]
    },
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest"
      ]
    }
  }
}
```

> [!TIP]
> **Playwright MCP vs. Chrome DevTools MCP 怎麼選？**
> - **Playwright MCP**：極度擅長「跨頁互動測試、Accessibility Tree 快照、多視口切換、表單填寫與表層功能驗證」，是日常 Vibe Coding 驗收的主力。
> - **Chrome DevTools MCP**：更專精於「深度效能分析（Core Web Vitals / LCP 診斷）、Memory Leak 排查、Cookie 與 Network 標頭細節偵錯」。兩者可同時掛載，分工合作！

---

## 💻 進階防線：把 AI 驗收過的流程固化成永久 `playwright.config.ts` 與冒煙測試

MCP 適合在「開發與探索期」讓 AI 即時開瀏覽器試跑；但當一個核心功能（如會員登入、結帳、文章排版）完成後，**一定要讓 AI 把它寫成可重複執行的 `.spec.ts` 腳本**，納入專案的 CI/CD 與本地預檢命令中。

### 1. 生產級 `playwright.config.ts` 範本（含自動起停 Server 與多裝置設定）

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  // 在 CI 環境禁止遺留 test.only，且允許失敗重試 1 次避免網路抖動
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "http://localhost:4321",
    // 失敗時自動保留 Trace、截圖與錄影，讓 AI 事後診斷有憑有據
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  // 同時驗證桌機與手機兩大關鍵視口
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile-safari-size",
      use: { ...devices["iPhone 13"], viewport: { width: 375, height: 812 } },
    },
  ],

  // 自動啟動開發或預覽伺服器，測完自動關閉，不留殭屍程序
  webServer: {
    command: "npm run preview -- --port 4321",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000,
  },
});
```

### 2. 全站通用冒煙測試腳本（`tests/e2e/smoke-and-layout.spec.ts`）

這支腳本是所有前端專案最值得標配的「神盾守門員」——它能一口氣掃描關鍵路由，確保**零 Console Error、零 404/500 請求、零手機版水平溢出破版**，並驗證核心互動元件運作正常：

```typescript
import { test, expect } from "@playwright/test";

const CRITICAL_ROUTES = ["/", "/tutorials", "/about"];

test.describe("核心頁面健康檢查與雙視口佈局驗證", () => {
  for (const route of CRITICAL_ROUTES) {
    test(`路由 ${route} 應無 Console Error、無失敗請求且無水平溢出`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      const failedRequests: string[] = [];

      // 1. 掛載 Console 與未捕獲例外監聽器
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });
      page.on("pageerror", (err) => {
        pageErrors.push(err.message);
      });

      // 2. 攔截所有 HTTP 4xx / 5xx 失敗資源或 API
      page.on("response", (res) => {
        if (res.status() >= 400 && !res.url().includes("favicon.ico")) {
          failedRequests.push(`${res.status()} ${res.url()}`);
        }
      });

      // 3. 導航並等待網路與渲染穩定
      await page.goto(route, { waitUntil: "networkidle" });

      // 4. 驗證主標題與核心內容確實渲染（非白屏）
      const bodyText = await page.locator("body").innerText();
      expect(bodyText.trim().length).toBeGreaterThan(50);

      // 5. 檢查是否存在破版導致的水平捲軸溢出 (Allow 1px tolerance for subpixel)
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 1;
      });
      expect(
        hasHorizontalOverflow,
        `偵測到頁面 ${route} 在當前視口發生水平破版溢出！`
      ).toBe(false);

      // 6. 斷言零錯誤
      expect(consoleErrors, `發現 Console Errors:\n${consoleErrors.join("\n")}`).toEqual([]);
      expect(pageErrors, `發現未捕獲 JS 例外:\n${pageErrors.join("\n")}`).toEqual([]);
      expect(failedRequests, `發現失敗的網路請求:\n${failedRequests.join("\n")}`).toEqual([]);
    });
  }

  test("互動流程驗證：點擊搜尋或導航選單應正常反應", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // 使用語意化 Role 定位器（與 Accessibility Tree 一致，極難損壞）
    const primaryLink = page.getByRole("link").first();
    await expect(primaryLink).toBeVisible();

    // 確認所有圖片都成功載入（naturalWidth > 0）
    const brokenImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("img"))
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.getAttribute("src") || "unknown");
    });
    expect(brokenImages, `發現破圖:\n${brokenImages.join("\n")}`).toEqual([]);
  });
});
```

---

## 🧰 實戰錦囊：Vibe Coder 必備的 E2E 驗收指令與家規範本

光安裝好 Playwright MCP 還不夠，你必須在專案家規（`.cursorrules` / `CLAUDE.md`）或每次開發任務結尾，明確要求 AI **「不跑完實機驗收，不准喊完工」**！

### 範本 1：寫入 `.cursorrules` / `CLAUDE.md` 的強制 E2E 驗收憲法

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Rule 01 · 前端任務強制瀏覽器自檢憲法（加入 .cursorrules）</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">【Frontend Self-Verification Gate (前端瀏覽器強制驗收鐵則)】
凡涉及 UI 元件、頁面排版、互動表單或前端路由的任何修改，在你向使用者回報「完成」之前，必須嚴格執行以下 Playwright 實機驗收流程：

1. 啟動本地預覽或開發伺服器，確認頁面可正常連線回應 HTTP 200。
2. 優先透過 Playwright MCP (或執行 npx playwright test) 開啟目標頁面。
3. 零錯誤檢查：讀取 Console Messages 與 Network Requests，必須確認「0 個 Console Error」、「0 個未捕獲 PageError」與「0 個 4xx/5xx 靜態資源破圖」。
4. 語意樹與互動驗證：使用 browser_snapshot 檢查 Accessibility Tree，並親自模擬點擊本次新增或修改的核心按鈕、彈窗與表單提交流程，確認狀態變化符合預期。
5. 雙視口破版檢查：分別在 Desktop (1440x900) 與 Mobile (375x812) 視口檢查 scrollWidth &lt;= innerWidth，並截圖確認無文字重疊或溢位。
6. 若上述任一項失敗，必須主動根據錯誤訊息與截圖自行修復並重測（最多重試 3 輪），嚴禁在未驗證成功前向使用者宣告「Done」。
7. 回報格式：完工時必須簡要列出已通過的測試視口、互動路徑與「0 Console Errors」驗證結果。</div>
  <div class="terminal-footer">
    <span>存放位置：專案根目錄 /.cursorrules 或 /CLAUDE.md</span>
    <span class="copy-hint">📋 讓 AI 每次改完前端都自動開瀏覽器自己改考卷</span>
  </div>
</div>

### 範本 2：新功能專屬 E2E 驗收 Prompt（隨時觸發深度巡檢）

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 02 · Playwright MCP 視覺與互動實機驗收啟動器</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">請不要只看原始碼就下結論！現在請你呼叫 Playwright MCP 工具，對本地運行中的頁面執行完整的實機 E2E 驗收：

【驗收目標網址】：http://localhost:4321/[目標路徑]
【核心互動路徑】：[例如：點選分類篩選器 -> 輸入搜尋關鍵字 -> 點擊第一張卡片進入詳情頁]

請依序執行並回報以下 5 項檢查結果：
1. 開啟頁面後，列出所有 Console Error、PageError 與失敗的 Network 請求（目標必須全部為 0）。
2. 擷取 Accessibility Tree Snapshot，確認核心互動按鈕皆具備明確可點擊的語意標籤。
3. 親自操作執行上述【核心互動路徑】，驗證 DOM 與畫面結果是否真的發生預期改變。
4. 切換視口至 375x812 (Mobile) 與 1440x900 (Desktop) 分別截圖並檢視，確認無水平捲軸破版、元素重疊或破圖。
5. 若發現任何問題，請直接修復程式碼並重新跑完第 1~4 步，最後再幫我將這次的關鍵驗收路徑補充寫進 tests/e2e/ 測試檔中。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Claude Code / Windsurf（已掛載 Playwright MCP）</span>
    <span class="copy-hint">📋 貼上即可叫 AI 現場跑完測試並補上回歸腳本</span>
  </div>
</div>

---

## 🛠️ 常見卡關排查：Playwright MCP 實戰 Troubleshooting

1. **問題：AI 一直卡在等待伺服器啟動，或找不到本地網頁？**
   - **解法**：在提示詞中明確要求 AI 使用背景啟動或先檢查目標 Port（如 `4321`、`3000`）是否已監聽；更穩妥的做法是直接在 `playwright.config.ts` 設定 `webServer`，讓 Playwright 自己管理起停。
2. **問題：AI 用 CSS Selector 點擊按鈕一直超時（Timeout）？**
   - **解法**：禁止 AI 手寫複雜的 `div > div:nth-child(3) > button`，強制要求先跑 `browser_snapshot` 取得 Accessibility Tree 裡的 `ref` 或使用 `page.getByRole("button", { name: "..." })`。這不僅測試成功率暴增，還會逼出程式碼中漏寫的無障礙標籤！
3. **問題：測試跑完發現文字沒有變，原來是動畫還沒跑完就截圖？**
   - **解法**：在 `playwright.config.ts` 或測試腳本中等待特定狀態元素 `await expect(locator).toBeVisible()`，並在進行視覺比對截圖時設定 `animations: "disabled"`，排除 CSS 過渡動畫造成的假警報。

---

## 🎯 總結：把「人肉 QA」外包給 AI 自己的閉環系統

<div class="vibe-box-concept">
  <span class="badge">💡 Vibe Coding 驗收閉環核心心法</span>
  <ul>
    <li><strong>從盲猜變實測</strong>：沒有瀏覽器工具的 Coding Agent 就像閉著眼睛畫畫；接上 Playwright MCP 才算真正睜開雙眼。</li>
    <li><strong>語意樹優先於像素猜測</strong>：善用 Accessibility Tree 進行互動定位，穩定度遠勝過脆弱的 CSS 路徑。</li>
    <li><strong>一次探索，永久固化</strong>：開發當下用 MCP 即時除錯，驗收通過後立刻存成 <code>.spec.ts</code> 冒煙測試，讓過去修過的 Bug 這輩子再也不會復發。</li>
  </ul>
</div>
