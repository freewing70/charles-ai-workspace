---
id: "cursor-windsurf-rules-engineering-2026"
title: "AI IDE 系統規則工程（.cursorrules 與 AGENTS.md）：如何為中大型專案建立「零幻覺」自動化開發憲法"
type: "tutorial"
category: "Vibe Coding"
summary: "為什麼專案超過十個檔案後，AI 寫代碼就開始架構飄移、偷裝套件、破壞原有功能？深入拆解從單檔 .cursorrules 演進至分域 .cursor/rules/*.mdc、AGENTS.md 與 CLAUDE.md 的規則工程學，建立完整的五層零幻覺開發憲法與跨 IDE 實戰範本。"
created: "2026-11-10"
updated: "2026-11-10"
version: "1.0"
status: "active"
visibility: "public"
tags: ["Vibe Coding", "Cursor", "Windsurf", "Claude Code", "Antigravity", "AGENTS.md", ".cursorrules", "規則工程", "軟體架構"]
tools: ["Cursor", "Windsurf", "Claude Code", "Antigravity", "AGENTS.md", "CLAUDE.md", "TypeScript"]
cover: "/assets/covers/cursor-windsurf-rules-engineering-2026.png"
featured: true
---

## 導言：為什麼專案一變大，AI 就開始「集體失憶與放飛」？

許多開發者在剛接觸 Cursor、Windsurf 或 Claude Code 的第一週都會感到驚豔：開一個全新的待辦清單（Todo App）或單頁展示網站，AI 幾乎十秒內就能交出漂亮成品。

然而，只要專案檔案超過 **15 至 30 個**，進入中大型專案的日常維護階段，噩夢就會準時報到：
1. **技術棧幻覺與混用**：專案明明是用 Next.js App Router 搭配 Drizzle ORM，AI 卻在某個新頁面默默寫出 Pages Router 舊寫法，甚至自己偷偷引進 Prisma。
2. **上下文稀釋（Context Dilution）**：你昨天在對話框裡千叮嚀萬交代的「全域狀態只能用 Zustand」、「色碼一律套用 Design Tokens」，只要對話拉長或開一個新分頁，AI 立刻忘得一乾二淨。
3. **過度熱心的破壞性重構**：你只叫它修一個結帳按鈕的間距，它卻「順便」把旁邊運作正常的 API 工具函式重寫了一遍，結果把登入驗證搞掛。

這些問題的根源不在於模型不夠聰明，而在於你**把「系統架構憲法」當成「臨時對話氣泡」在管理**。在專業 AI 工程團隊中，解決這個問題的標準答案叫做 **系統規則工程（System Rules Engineering）**。

---

## 一、規則的演進史：從單檔 `.cursorrules` 到分域與跨工具標準

早期的 AI IDE 玩法非常粗暴：在專案根目錄塞進一個名為 `.cursorrules` 的純文字檔，把所有想得到的要求——從程式碼風格、API 規範、UI 色票到 Git 提交格式——全部寫在裡面，動輒上千行。

這很快撞上了大型語言模型的物理極限——**規則疲勞（Rule Fatigue）與注意力稀釋（Lost in the Middle）**。當系統提示詞塞滿了兩千行規則，其中一半跟當前正在改的檔案毫無關係時（例如你在改 CSS 按鈕，系統卻強迫 AI 閱讀 PostgreSQL 索引守則），模型真正遵守關鍵指令的機率會大幅滑落。

因此，2025 至 2026 年的 AI IDE 規則體系完成了三次關鍵演進：

1. **第一代（單體式）**：單一 `.cursorrules` 或 `.windsurfrules`，全局無差別注入，適合 10 個檔案以內的原型專案。
2. **第二代（路徑分域式）**：以 Cursor `.cursor/rules/*.mdc` 為代表，透過 YAML Frontmatter 的 `globs` 欄位綁定檔案路徑，實現**「改哪個資料夾，才動態載入哪套規矩」**。
3. **第三代（跨 Agent 開放標準）**：以 **`AGENTS.md`**（及 Anthropic 的 **`CLAUDE.md`**）為核心的開放慣例。無論團隊成員使用的是 Cursor、Windsurf、Claude Code、Codex CLI 還是 Antigravity，大家共用同一份根目錄憲法，徹底消除不同工具間規則不同步的維護債。

---

## 二、五大主流 AI IDE / Agent 規則機制橫向對比

在團隊協作中，不同工程師可能偏好不同的 AI 工具。理解各家載入規則的檔名、優先順序與支援特性，是設計通用憲法的第一步：

| 平台 / 工具 | 專案根目錄全域憲法 | 分域 / 條件式載入機制 | 跨目錄繼承與層級支援 | 實務最佳搭配策略 |
| :--- | :--- | :--- | :--- | :--- |
| **Cursor** | `.cursor/rules/*.mdc`（官方推薦取代舊版 `.cursorrules`）與 `AGENTS.md` | 支援 `.mdc` 檔頭設定 `alwaysApply`、`globs`（路徑匹配）與 `description`（語意觸發） | 原生支援多檔分域，自動依目前開啟或編輯的檔案載入 | 全域規範放 `AGENTS.md`，前端/後端/測試細則拆進 `.cursor/rules/*.mdc` |
| **Windsurf (Cascade)** | `.windsurfrules` 與 `.windsurf/rules/*.md` | 支援 `.windsurf/rules/` 內設定觸發模式（Always On / Glob / Model Decision） | 支援工作區規則與全域 `global_rules.md` 疊加 | 將輕量化核心守則放 `.windsurf/rules/core.md`，避免超過字元上限遭截斷 |
| **Claude Code (CLI)** | `CLAUDE.md`（可搭配 `CLAUDE.local.md` 放個人偏好） | 支援 `.claude/rules/*.md` 並可使用 `paths` frontmatter 指定目錄生效 | **原生支援階層讀取**：從當前工作目錄往上層父目錄一路合併讀取 | 根目錄 `CLAUDE.md` 放測試指令與總覽，子模組（如 `packages/api/CLAUDE.md`）放局部細節 |
| **Antigravity / Open Agents** | `AGENTS.md` 與 `.agent/rules/` / `.agents/skills/` | 支援模組化 `SKILL.md` 按任務意圖觸發載入工作流規範 | 原生相容根目錄 `AGENTS.md` 與專案規則夾疊加 | 以 `AGENTS.md` 作為單一真實入口，複雜流程封裝為獨立 Skill |

> [!TIP]
> **跨工具團隊的「黃金不重複原則」**：  
> 如果你的團隊同時有人用 Cursor、有人用 Claude Code，千萬不要手動同步兩份一模一樣的長篇文字！最佳實踐是把核心憲法統一寫在 **`AGENTS.md`**，然後在 `CLAUDE.md` 或 `.cursor/rules/00-core.mdc` 中用一句簡短指令引用它（或透過符號連結 / 輕量摘要對齊），做到**「單一真相來源（Single Source of Truth）」**。

---

## 三、中大型專案的「五層零幻覺開發憲法」架構

一套真正能在生產環境防呆、讓 AI 寫出可維護程式碼的規則體系，不該是零散的抱怨清單，而必須是一座結構嚴密的**五層防禦架構**：

![中大型專案 AI IDE 五層開發憲法與分域載入架構](/assets/diagrams/cursor-windsurf-rules-engineering-2026-arch.svg)

### 第一層：技術棧與依賴鎖定（Tech Stack Lock）
AI 最擅長「自作主張引入熟悉但錯誤的套件」。第一層必須用白紙黑字鎖死：
- **語言、框架與確切大版本**：例如 `Next.js 15 (App Router only)`、`React 19`、`TypeScript strict mode`、`Tailwind CSS v4`。
- **套件管理器鎖定**：明定只能使用 `pnpm`（嚴禁混用 `npm install` 產生衝突的 lockfile）。
- **Zero Bloat 依賴紅線**：未經開發者明文確認，**嚴禁擅自安裝任何新的第三方套件**。

### 第二層：目錄邊界與單一真相來源（Directory Boundaries）
告訴 AI「什麼東西該放哪裡」以及「哪裡絕對不准碰」：
- **權責分層地圖**：Schema 定義集中於 `src/schemas/`、共用工具放 `src/lib/`、UI 元件放 `src/components/`。
- **高壓紅線禁區（No-Touch Zones）**：明文標註如 `src/core/auth/`、`prisma/migrations/`、`.env*` 等敏感核心目錄，任何未授權的功能開發都不得改動這些檔案。

### 第三層：反模式黑名單與手術刀原則（Anti-Patterns）
列出 AI 最容易犯的壞習慣，直接封殺：
- 嚴禁使用 `any` 或 `@ts-ignore` 逃避型別報錯。
- 嚴禁寫空的 `catch (e) {}` 靜默吞掉錯誤，所有錯誤必須留下結構化日誌或正確向上拋出。
- **手術刀原則（Surgical Editing）**：只修改與任務直接相關的最小程式碼區塊，禁止順便「美化」或重構無關檔案的排版。
- **Two-Strikes 停損機制**：同一個錯誤連續修復兩次失敗，立刻停手並分析根本原因，禁止無止盡猜測亂改。

### 第四層：自動化驗證指令（Verification Commands）
光靠口頭規則只能攔截 70% 的幻覺；加上「自動試車指令」才能逼近 99%！
在憲法中明確寫出專案的驗證命令（例如 `pnpm typecheck`、`pnpm lint`、`pnpm test:unit`），並規定：**AI 在宣稱任務完成前，必須自行執行驗證指令並確認 Exit Code 為 0**。

### 第五層：Git 與發布守門員（Git & Release Gatekeeper）
防止具備終端機權限的 Coding Agent 在興奮之餘做出毀滅性版本控制操作：
- 強制採用 `feat:` / `fix:` / `chore:` 等 Conventional Commits 格式。
- **絕對禁令**：嚴禁執行 `git push --force`、`git reset --hard`、跳過檢查的 `--no-verify`，或未經確認直接刪除資料庫欄位。

---

## 四、實戰範本：可直接複製落地的生產級規則檔

以下提供三套經過中大型專案驗證的規則範本。你可以直接複製到專案對應路徑中，並依你的技術棧微調括號內容。

### 範本 1：跨工具通用根目錄憲法（`AGENTS.md` / `CLAUDE.md`）

請注意這份範本刻意控制在 **100 行以內**——這正是確保所有主流模型能保持最高注意力遵從度的「黃金甜蜜點」：

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Template 01 · 根目錄通用開發憲法（AGENTS.md / CLAUDE.md）</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body"># Project Constitution (AGENTS.md)

## 1. Tech Stack Lock
- Runtime &amp; Language: Node.js 22+, TypeScript 5.x (strict: true)
- Framework: Next.js 15 (App Router ONLY; NEVER use Pages Router patterns)
- Styling: Tailwind CSS v4 + existing Design Tokens in `src/styles/tokens.css`
- Database: PostgreSQL + Drizzle ORM (`src/db/schema.ts`)
- Package Manager: `pnpm` ONLY.
- Zero Bloat Policy: NEVER run `pnpm add` or install any new dependency without explicit user approval first.

## 2. Directory Boundaries &amp; Single Source of Truth
- `src/app/` — Routing &amp; Server Components only (NO direct raw SQL inside components)
- `src/services/` — Pure business logic &amp; database queries
- `src/schemas/` — Zod validation schemas (Single Source of Truth for API &amp; Forms)
- RESTRICTED ZONES (Ask before editing): `src/core/auth/`, `drizzle/`, `.env*`, `package.json`

## 3. Coding Anti-Patterns &amp; Surgical Editing
- NEVER use `any`, `@ts-ignore`, or `@ts-expect-error`. Use explicit types or Zod inference.
- NEVER write empty `catch (err) {}` blocks. Log structured context or rethrow typed errors.
- NEVER hardcode secrets, API keys, or duplicate mock arrays inside UI components.
- Surgical Editing: Modify ONLY files strictly required for the current task. Do NOT refactor unrelated legacy code.
- Two-Strikes Rule: If a bug fix fails twice in a row, STOP editing, summarize the root cause hypotheses, and ask the user before attempting a third change.

## 4. Mandatory Verification Commands
Before reporting any task as complete, you MUST run and pass:
1. `pnpm typecheck` (Zero TypeScript errors)
2. `pnpm lint` (Zero ESLint errors)
3. `pnpm test` (Relevant unit/integration tests pass)
If a command cannot be executed in your current environment, explicitly state that verification is pending.

## 5. Git &amp; Release Guardrails
- Commit format: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`).
- FORBIDDEN commands: `git push --force`, `git reset --hard`, `git commit --no-verify`, `DROP TABLE`.</div>
  <div class="terminal-footer">
    <span>存放位置：專案根目錄 /AGENTS.md（或 /CLAUDE.md）</span>
    <span class="copy-hint">📋 點擊全選複製建立專案憲法</span>
  </div>
</div>

### 範本 2：Cursor 路徑分域規則（`.cursor/rules/api-backend.mdc`）

當專案既有前端 React 又有後端 API 時，千萬不要把後端規則塞進全域檔。在 `.cursor/rules/` 下建立分域 `.mdc` 檔案，利用 `globs` 讓規則只在觸及後端檔案時精準生效：

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Template 02 · Cursor 後端 API 分域規則（.cursor/rules/api-backend.mdc）</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">---
description: 後端 API 路由、商業邏輯與資料庫存取安全規範
globs: ["src/app/api/**/*.ts", "src/services/**/*.ts"]
alwaysApply: false
---

# Backend &amp; API Engineering Rules

1. **Input Validation First**:
   - Every API Route Handler MUST validate `request.json()` and query params using a Zod schema imported from `src/schemas/`.
   - Return HTTP 400 with structured field errors on validation failure; NEVER trust client-supplied `userId` or `role` fields—always extract identity from the verified session context.

2. **Database Query Safety**:
   - All multi-step write operations MUST be wrapped in `db.transaction(async (tx) =&gt; { ... })`.
   - NEVER build SQL via string interpolation; use parameterized Drizzle query builders.
   - Always enforce pagination (`limit` capped at 100) on list endpoints.

3. **Error Handling &amp; Response Contract**:
   - Never expose raw stack traces, SQL error messages, or internal file paths in HTTP 500 responses.
   - Use unified response helper `apiSuccess(data)` / `apiError(code, message, status)`.</div>
  <div class="terminal-footer">
    <span>存放位置：/.cursor/rules/api-backend.mdc</span>
    <span class="copy-hint">📋 僅在編輯 API 與 Service 時自動載入，零上下文浪費</span>
  </div>
</div>

### 範本 3：Windsurf / Antigravity 前端設計系統鎖定規則（`.windsurf/rules/ui-design-system.md`）

針對前端頁面開發，將 Design Tokens 與元件複用守則獨立封裝，防止 AI 每次生成卡片都隨意手寫不同色碼與間距：

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Template 03 · 前端 UI 設計系統防走樣規則（ui-design-system.md）</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">---
trigger: glob
globs: src/components/**/*.tsx, src/app/**/*.tsx
---

# UI &amp; Design System Guardrails

1. **Token &amp; Component Reuse**:
   - Check `src/components/ui/` before creating any new Button, Modal, Badge, or Input component. Reuse existing primitives.
   - NEVER hardcode random hex colors (e.g., `#3b82f6`) or arbitrary pixel spacing when semantic Tailwind / CSS variables exist.

2. **Server vs Client Boundary**:
   - Keep pages and layout components as React Server Components by default.
   - Add `"use client"` ONLY at the lowest interactive leaf component level.

3. **Accessibility &amp; States**:
   - Every async action button MUST display a loading/disabled state to prevent double submission.
   - All interactive icons without visible text MUST include `aria-label`.</div>
  <div class="terminal-footer">
    <span>存放位置：/.windsurf/rules/ui-design-system.md（或轉為 .cursor/rules/ui.mdc）</span>
    <span class="copy-hint">📋 鎖定全站 UI 一致性，終結五花八門的 AI 審美漂移</span>
  </div>
</div>

---

## 五、規則衛生學（Rule Hygiene）：避免「寫越多、AI 越笨」的三個黃金習慣

建立好憲法之後，隨著專案演進，規則檔很容易再次膨脹失控。資深工程團隊會嚴守以下三項「規則衛生」習慣：

1. **嚴格控管常駐規則長度（150 行上限原則）**：永遠保持根目錄 `AGENTS.md` / `CLAUDE.md` 精煉如軍規條列。只要發現某段規範超過 20 行且只針對特定模組（例如 Stripe 付款回調或 ComfyUI 腳本），立刻把它抽離成**分域規則（Glob Rule）**或 **Skill**。
2. **用「反例 + 正例」取代空泛形容詞**：不要寫「請寫出高品質、好維護的潔淨程式碼」，這種空話對 LLM 毫無約束力。要寫成具體可驗證的條件：「禁止超過 40 行的 React Component」、「禁止使用 `any`」、「所有 API 回傳必須經過 `apiSuccess()` 包裝」。
3. **把每次 AI 翻車事故轉化為永久疫苗**：每當 AI 在專案中犯了一個低級錯誤（例如又在某個頁面忘了處理時區或又裝了重複套件），修完 Bug 後順手補進一條規則：*「不要把規則留在對話紀錄裡，要把它刻進團隊的憲法檔案裡。」*

---

## 六、實戰錦囊：讓 AI 盤點你的舊專案並自動生成憲法

如果你手邊已經有一個開發到一半、卻還沒建立任何規則檔的中大型專案，不需要從零手寫。直接把下面這組 Prompt 發送給 Cursor 或 Claude Code，讓它先掃描 `package.json` 與目錄結構，為你量身起草五層憲法：

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 01 · 既有專案「規則憲法逆向工程師」</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">請扮演首席軟體架構師，掃描目前專案的目錄結構、package.json（或 pyproject.toml）、tsconfig.json 與設定檔，為我建立一套「五層零幻覺系統規則工程」。

請嚴格遵守以下產出規範：
1. 先分析並列出目前專案實際使用的技術棧、套件管理器、測試工具與目錄權責邊界。
2. 產出一份控制在 100 行以內的根目錄 `AGENTS.md`，包含：技術棧鎖定、目錄禁區、反模式紅線（含 Two-Strikes 停損）、強制驗證指令與 Git 守則。
3. 針對本專案的目錄結構，另外設計 2 份路徑分域規則（`.cursor/rules/*.mdc`），分別鎖定後端/資料層與前端/UI 層，並附上精確的 `globs` 設定。
4. 嚴禁編造專案中不存在的腳本名稱或資料夾路徑；所有驗證指令必須以設定檔中實際存在的 scripts 為準。

請先向我展示你的架構盤點摘要與規則草案，經我確認後再寫入檔案。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Windsurf / Claude Code / Antigravity</span>
    <span class="copy-hint">📋 點擊全選複製發送，3 分鐘幫舊專案補齊開發憲法</span>
  </div>
</div>

---

## 總結：規則工程才是 Vibe Coding 規模化的真正護城河

寫給人類工程師看的文件，就算沒寫清楚，老鳥憑經驗也能猜出八成；但寫給 AI Agent 看的規則，**模糊一分，產出就偏離十分**。透過 **分域 Glob 載入** 解決注意力稀釋，並以 **五層憲法（技術鎖定、目錄邊界、反模式、自動驗證、Git 守門）** 鎖死開發下限，你就能讓團隊的每一個 AI 工具從「不可預測的隨機抽卡機」，正式蛻變為嚴守紀律的自動化工程部隊。
