---
id: "mcp-server-architecture-practical-guide"
title: "Model Context Protocol (MCP) 實戰全攻略：從零打造讓 Claude 與 Cursor 自由調用本地資料庫的標準協議伺服器"
type: "tutorial"
category: "Agent Engineering"
summary: "深入解析 AI 時代的 USB-C 標準——Model Context Protocol (MCP)。從 Host / Client / Server 三層架構、Resources / Prompts / Tools 三大原語，到 stdio 與 Streamable HTTP 傳輸比較，手把手帶你用 TypeScript 與 @modelcontextprotocol/sdk 打造具備唯讀防注入與路徑邊界防護的本地資料庫 MCP Server。"
created: "2026-11-09"
updated: "2026-11-09"
version: "1.0"
status: "active"
visibility: "public"
tags: ["MCP", "Model Context Protocol", "Agent Engineering", "TypeScript", "Claude", "Cursor", "SQLite", "PostgreSQL", "JSON-RPC"]
tools: ["TypeScript", "Node.js", "@modelcontextprotocol/sdk", "Claude Desktop", "Cursor", "SQLite", "PostgreSQL", "Zod"]
cover: "/assets/covers/mcp-server-architecture-practical-guide.png"
featured: true
---

## 導言：為什麼我們需要「AI 界的 USB-C」？

在 2024 年底之前，只要你想讓 AI 助手讀取公司內部的 SQLite 報表、查詢 PostgreSQL 訂單庫，或搜尋 Notion 與 Slack 訊息，工程團隊就必須面對一個令人絕望的 **N x M 碎片化整合地獄**：

- OpenAI 的 Function Calling 有自己的一套 JSON Schema 格式；
- Anthropic Claude 的 Tool Use 有自己的訊息結構；
- Google Gemini、Cursor、Windsurf 與各家開源 Agent 框架又各自定義一套外掛介面。

如果你有 **5 個 AI 客戶端** 與 **10 個內部資料來源**，理論上你得維護 `5 x 10 = 50` 份幾乎重複卻又細微不同的膠水程式碼（Glue Code）。只要其中一個工具或模型改版，整條整合管線就跟著報錯。

**Model Context Protocol (MCP)** 正是為了解決這個結構性痛點而誕生的開放標準協議。它就像硬體世界的 **USB-C 接頭**：無論你的主機是 Claude Desktop、Cursor、Windsurf 還是自研的企業 Agent，只要遵循 MCP 標準，所有資料來源（資料庫、檔案系統、API、監控系統）都只需實作一次 **MCP Server**，就能即插即用地服務所有支援 MCP 的 **MCP Host**——將整合複雜度從 `N x M` 徹底降維成 `N + M`。

---

## 一、深入拆解 MCP 三層架構：Host、Client 與 Server

許多初學者容易把「MCP Client」和「Claude / Cursor 本體」混為一談，導致在除錯傳輸錯誤或權限問題時無從下手。在官方協議規範中，MCP 是一個明確分層的 **JSON-RPC 2.0** 客戶端-伺服器架構：

![MCP Host、Client 與 Server 三層架構與安全邊界架構](/assets/diagrams/mcp-server-architecture-practical-guide-arch.svg)

### 1. MCP Host（宿主環境）
Host 是使用者直接操作的主應用程式，例如 **Claude Desktop、Cursor IDE、Windsurf、Claude Code** 或你用 LangGraph 寫的 Agent Runtime。Host 的核心職責是：
- 管理生命週期：根據設定檔（如 `.cursor/mcp.json`）拉起或連接多個 MCP Server。
- 彙整能力列表：把各個 Server 提供的工具說明注入 LLM 的 System Context。
- **安全把關（Human-in-the-Loop）**：在模型提出敏感操作時彈出確認視窗，由使用者批准後才放行執行。

### 2. MCP Client（1 對 1 協議客戶端）
Client 是運行在 Host 內部的通訊模組。**關鍵細節在於：一個 Host 內部會為每一個連上的 MCP Server 實例化一個專屬的 MCP Client**（維持嚴格的 `1:1` 有狀態 Session）。Client 負責：
- 在連線初期發送 `initialize` 握手請求，協商彼此支援的協議版本與能力（Capabilities）。
- 將 LLM 的結構化呼叫轉譯成標準 JSON-RPC 2.0 封包傳給 Server，並把結果封裝回對話上下文。

### 3. MCP Server（輕量級能力暴露伺服器）
Server 是你親手撰寫的小型服務程式（通常是幾百行的 TypeScript 或 Python 腳本），只專注做一件事：**把特定領域的資料或動作，安全地暴露給協議層**。它不需要知道前端是哪個模型（Claude 還是 GPT），也不需要處理 Prompt Engineering 的對話記憶。

---

## 二、MCP 三大核心原語：Resources、Prompts 與 Tools

MCP 之所以比傳統 Function Calling 強大，在於它將 AI 與外部世界的互動拆解為三種權責分明的原語（Primitives），分別對應不同的控制主體：

| 核心原語 | 控制權歸屬 | HTTP 類比 | 核心用途與典型案例 | 安全風險等級 |
| :--- | :--- | :--- | :--- | :--- |
| **Resources（資源）** | **Application-controlled**<br>（由宿主應用或使用者決定何時掛載） | `GET`（唯讀資料載入） | 暴露靜態或動態唯讀內容，例如 `db://schema/orders` 資料表結構、日誌檔、API 規格文件。 | 低（僅提供背景上下文，不執行變更） |
| **Prompts（提示範本）** | **User-controlled**<br>（由使用者在 UI 主動點選觸發） | 預設工作流巨集 | 將團隊最佳實踐封裝成 Slash Command（如 `/analyze-slow-queries`），自動填入固定參數與查詢指引。 | 低至中（由人主動觸發） |
| **Tools（工具）** | **Model-controlled**<br>（由 LLM 自主決定何時呼叫與傳參） | `POST` / 執行函式 | 執行計算、資料庫查詢、API 呼叫或檔案操作，例如 `query_readonly_sql`、`describe_table`。 | **高（必須嚴格校驗參數與權限邊界）** |

<div class="vibe-box-concept">
  <span class="badge">💡 架構師實戰心得：別把所有東西都塞進 Tools！</span>
  <p>新手最常犯的錯，是把「查詢有哪些資料表」、「取得資料表欄位定義」和「執行 SQL 查詢」全部寫成需要模型一來一回猜測的 Tools。這會大幅浪費 Token 與推理時間。正確做法是將靜態或半靜態的 <strong>Schema 結構暴露為 Resource</strong>，讓 IDE 或 Host 直接作為上下文附加上去，只把真正需要動態參數運算的動作留給 <strong>Tool</strong>。</p>
</div>

---

## 三、傳輸層抉擇：stdio vs Streamable HTTP / SSE

在設計 MCP Server 之前，必須先決定 Client 與 Server 之間如何傳遞 JSON-RPC 訊息。MCP 規範將傳輸層（Transport）與邏輯層徹底解耦，目前生產環境主要有兩條路線：

| 比較維度 | `stdio`（標準輸入輸出管線） | `Streamable HTTP`（含 SSE 串流） |
| :--- | :--- | :--- |
| **部署拓撲** | **本機子行程模式**：由 Host（如 Cursor / Claude Desktop）直接在你電腦上啟動 Server 行程。 | **遠端微服務模式**：Server 獨立部署在 Docker / Kubernetes 或內網主機，透過 HTTP URL 連線。 |
| **通訊通道** | `stdin` 接收請求、`stdout` 回傳 JSON-RPC、`stderr` 輸出除錯日誌。 | HTTP `POST` 傳送請求，伺服器可依需求回傳單一 JSON 或開啟 SSE 事件串流推送進度。 |
| **延遲與開銷** | 極低（微秒級 IPC 管線），無網路序列化與 TLS 握手成本。 | 中等（受限於內網 RTT 與 HTTP 標頭開銷）。 |
| **身份驗證與多租戶** | 繼承本機作業系統使用者權限，無需 OAuth / JWT，適合單機開發者。 | 必須自行實作 Bearer Token / OAuth 2.1 與租戶隔離，適合團隊共享知識庫與雲端 Agent。 |
| **最常見致命地雷** | **污染 `stdout`**：任何 `console.log()` 都會破壞 JSON-RPC 封包格式導致斷線。 | 忘記處理 CORS、連線逾時或斷線重連的 Session ID 管理。 |

> [!IMPORTANT]
> **鐵律警告（開發 `stdio` MCP Server 必記）**：  
> 當你使用 `stdio` 傳輸層時，**標準輸出（`stdout`）是專屬於 JSON-RPC 協議封包的聖域**！絕對禁止在程式碼任何地方（包含第三方套件）呼叫 `console.log()`，否則 Host 解析 JSON 會立刻崩潰報錯 `Unexpected token ... is not valid JSON`。所有除錯訊息一律必須使用 `console.error()` 或 `process.stderr.write()`！

---

## 四、實戰演練：從零打造唯讀安全的 SQLite / PostgreSQL MCP Server

接下來我們使用官方最新的 `@modelcontextprotocol/sdk`（TypeScript），打造一個可讓 Claude 與 Cursor 安全查詢本地 SQLite（並附帶 PostgreSQL 連線切換介面）的標準 MCP Server。

### 1. 專案初始化與依賴安裝

建立專案目錄並安裝核心套件（使用 `better-sqlite3` 作為本地資料庫驅動，`zod` 進行嚴格參數驗證）：

```bash
mkdir mcp-readonly-db
cd mcp-readonly-db
npm init -y
npm install @modelcontextprotocol/sdk zod better-sqlite3
npm install -D typescript @types/node @types/better-sqlite3 tsx
npx tsc --init
```

在 `tsconfig.json` 中確保使用現代 Node ESM 設定：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

### 2. 建立多層防禦 SQL 安全守門員（`src/security.ts`）

即使資料庫驅動層設定了唯讀模式，企業級實作依然必須在應用層加入「縱深防禦（Defense-in-Depth）」，防堵路徑穿越（Path Traversal）、多語句堆疊注入（Stacked Queries）以及全表掃描造成的上下文爆炸：

```typescript
import path from "node:path";
import fs from "node:fs";

// 允許存取的資料庫根目錄白名單（從環境變數注入，預設為當前工作目錄下的 data 資料夾）
const ALLOWED_BASE_DIR = path.resolve(
  process.env.MCP_DB_BASE_DIR || path.join(process.cwd(), "data")
);

/**
 * 路徑安全驗證：防止 ../../../etc/passwd 類型的目錄穿越攻擊
 */
export function resolveSafeDbPath(inputPath: string): string {
  const resolved = path.resolve(ALLOWED_BASE_DIR, inputPath);
  const relative = path.relative(ALLOWED_BASE_DIR, resolved);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(
      `安全攔截：禁止存取白名單目錄之外的路徑 (${inputPath})`
    );
  }

  if (!fs.existsSync(resolved)) {
    throw new Error(`資料庫檔案不存在：${path.basename(resolved)}`);
  }

  return resolved;
}

// 高風險關鍵字黑名單（即使在唯讀連線下，也禁止試探性系統指令與寫入語法）
const FORBIDDEN_SQL_PATTERN =
  /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|REPLACE|TRUNCATE|ATTACH|DETACH|PRAGMA|VACUUM|REINDEX|EXEC|EXECUTE|INTO\s+OUTFILE)\b/i;

/**
 * SQL 靜態語法安全檢查：強制單一唯讀 SELECT / WITH 查詢並自動加上 LIMIT 防呆
 */
export function sanitizeReadOnlySql(rawSql: string, maxRows = 100): string {
  // 1. 移除 SQL 註解避免繞過檢查
  const withoutComments = rawSql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();

  if (!withoutComments) {
    throw new Error("SQL 查詢字串不可為空。");
  }

  // 2. 禁止分號堆疊多條語句（僅允許結尾單一分號）
  const strippedTrailingSemi = withoutComments.replace(/;+\s*$/, "");
  if (strippedTrailingSemi.includes(";")) {
    throw new Error("安全攔截：禁止在單次呼叫中執行多條分號分隔的 SQL 語句。");
  }

  // 3. 必須以 SELECT 或 WITH (CTE) 開頭
  if (!/^(SELECT|WITH)\b/i.test(strippedTrailingSemi)) {
    throw new Error("安全攔截：僅允許執行 SELECT 或 WITH 唯讀查詢語句。");
  }

  // 4. 阻斷危險關鍵字
  const forbiddenMatch = strippedTrailingSemi.match(FORBIDDEN_SQL_PATTERN);
  if (forbiddenMatch) {
    throw new Error(
      `安全攔截：偵測到禁止使用的 SQL 關鍵字「${forbiddenMatch[0].toUpperCase()}」。`
    );
  }

  // 5. 若未指定 LIMIT，強制包覆外層限制筆數以保護 LLM Context Window
  if (!/\bLIMIT\s+\d+/i.test(strippedTrailingSemi)) {
    return `SELECT * FROM (${strippedTrailingSemi}) AS _mcp_safe_sub LIMIT ${maxRows}`;
  }

  return strippedTrailingSemi;
}
```

### 3. 實作 MCP Server 核心邏輯（`src/index.ts`）

這裡我們同時註冊了 **Resource**（自動暴露資料表清單與結構定義）、**Tool**（執行參數化安全 SQL 查詢與單表描述）以及 **Prompt**（團隊標準化資料異常排查範本）：

```typescript
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import Database from "better-sqlite3";
import { z } from "zod";
import { resolveSafeDbPath, sanitizeReadOnlySql } from "./security.js";

// 啟動時驗證目標資料庫路徑並以嚴格唯讀模式開啟
const TARGET_DB_FILE = process.env.MCP_DB_FILE || "app.db";
const dbPath = resolveSafeDbPath(TARGET_DB_FILE);
const db = new Database(dbPath, {
  readonly: true,
  fileMustExist: true,
  timeout: 5000,
});

// 初始化 MCP Server 實例
const server = new McpServer({
  name: "freewing-readonly-db-mcp",
  version: "1.0.0",
});

/**
 * 原語一：Resources — 暴露資料庫所有表格結構（Application-controlled）
 */
server.resource(
  "database-schema",
  new ResourceTemplate("db://schema/{tableName}", {
    list: async () => {
      const tables = db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
        )
        .all() as Array<{ name: string }>;

      return {
        resources: tables.map((t) => ({
          uri: `db://schema/${t.name}`,
          name: `資料表結構：${t.name}`,
          mimeType: "application/json",
          description: `取得 ${t.name} 資料表的欄位名稱、型別與建立語法`,
        })),
      };
    },
  }),
  async (uri, { tableName }) => {
    const safeName = String(tableName).replace(/[^a-zA-Z0-9_]/g, "");
    const row = db
      .prepare(
        "SELECT sql FROM sqlite_master WHERE type='table' AND name = ?"
      )
      .get(safeName) as { sql?: string } | undefined;

    if (!row?.sql) {
      throw new Error(`找不到資料表：${safeName}`);
    }

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "text/plain",
          text: row.sql,
        },
      ],
    };
  }
);

/**
 * 原語二：Tools — 列出資料表與執行安全唯讀查詢（Model-controlled）
 */
server.tool(
  "list_tables",
  "列出目前資料庫中所有可用的業務資料表與預估筆數。",
  {},
  async () => {
    const tables = db
      .prepare(
        "SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
      )
      .all() as Array<{ name: string; sql: string }>;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(tables, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "query_readonly_sql",
  "對本地資料庫執行嚴格唯讀的 SELECT 查詢。支援具名或位置參數綁定，單次最多回傳 100 筆資料，嚴禁任何寫入或 DDL 操作。",
  {
    sql: z
      .string()
      .min(6)
      .describe("欲執行的 SQL SELECT 語句，建議搭配 ? 佔位符避免字串拼接"),
    params: z
      .array(z.union([z.string(), z.number(), z.boolean(), z.null()]))
      .optional()
      .default([])
      .describe("對應 SQL 中 ? 佔位符的參數陣列"),
    maxRows: z
      .number()
      .int()
      .min(1)
      .max(200)
      .optional()
      .default(100)
      .describe("最大回傳筆數上限，預設 100"),
  },
  async ({ sql, params, maxRows }) => {
    try {
      const safeSql = sanitizeReadOnlySql(sql, maxRows);
      const stmt = db.prepare(safeSql);
      const rows = stmt.all(...params);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                rowCount: rows.length,
                executedSql: safeSql,
                rows,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `查詢執行失敗：${message}`,
          },
        ],
      };
    }
  }
);

/**
 * 原語三：Prompts — 團隊標準分析範本（User-controlled）
 */
server.prompt(
  "audit-table-anomalies",
  "一鍵引導 AI 針對指定資料表執行空值率、重複值與異常極端值盤點",
  {
    tableName: z.string().describe("要進行健康檢查的資料表名稱"),
  },
  ({ tableName }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `請先透過 list_tables 或讀取 db://schema/${tableName} 確認「${tableName}」的欄位結構，接著使用 query_readonly_sql 分別檢查：1) 總筆數與最近一週新增趨勢；2) 關鍵欄位的 NULL 缺失比例；3) 是否有異常負數或重複主鍵，最後產出一份繁體中文資料健檢摘要。`,
        },
      },
    ],
  })
);

// 啟動 stdio 傳輸層
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // 切記：日誌一律走 stderr，絕對不可用 console.log()！
  console.error(`[MCP] Readonly DB Server 已啟動，掛載資料庫：${dbPath}`);
}

main().catch((error) => {
  console.error("[MCP] 伺服器啟動失敗：", error);
  process.exit(1);
});
```

### 4. 若企業使用 PostgreSQL：關鍵防禦升級重點

若你的資料庫不是單機 SQLite，而是團隊共用的 PostgreSQL，除了將驅動替換為 `pg`（`node-postgres`）連線池外，還必須在資料庫層與連線層加上三道鎖：
1. **資料庫帳號最小權限**：建立專屬帳號 `mcp_reader`，只授予 `USAGE` 與指定 Schema 的 `SELECT` 權限，徹底隔離高機密表格（如 `users_password_hash` 或金流密鑰表）。
2. **強制唯讀交易與逾時設定**：每次查詢外層固定包覆交易鎖死：
   ```sql
   BEGIN TRANSACTION READ ONLY;
   SET LOCAL statement_timeout = '5000ms';
   -- 執行參數化查詢 ($1, $2)
   COMMIT;
   ```
3. **敏感欄位自動遮罩（PII Redaction）**：在回傳 JSON 給 LLM 前，於 TypeScript 層過濾 `email`、`phone`、`token` 等欄位，避免將客戶隱私送往雲端模型端點。

---

## 五、接上 Claude Desktop 與 Cursor，並用 Inspector 除錯

編譯專案：`npx tsc`。接著將設定寫入你慣用的 AI 客戶端設定檔：

### 1. Cursor 設定檔（專案根目錄 `.cursor/mcp.json`）

```json
{
  "mcpServers": {
    "local-readonly-db": {
      "command": "node",
      "args": ["C:/Projects/mcp-readonly-db/dist/index.js"],
      "env": {
        "MCP_DB_BASE_DIR": "C:/Projects/my-app/data",
        "MCP_DB_FILE": "production_snapshot.db"
      }
    }
  }
}
```

### 2. Claude Desktop 設定檔
- macOS：`~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows：`%APPDATA%\Claude\claude_desktop_config.json`

內容結構與上方完全一致。存檔並重新啟動客戶端後，就能在對話框看到小鎚子（Tools）與附加資源（Resources）圖示。

### 3. 上線前必跑的除錯神器：MCP Inspector

不要每次改一行程式碼就重開一次 Cursor 或 Claude Desktop！官方提供了互動式網頁除錯台 **MCP Inspector**：

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

啟動後瀏覽器會打開 `http://localhost:5173`，你可以直接在網頁介面測試 `Resources`、`Tools` 的輸入與輸出、檢查 `stderr` 即時報錯，並驗證注入字串（例如故意傳入 `SELECT * FROM users; DROP TABLE users;`）是否被 `sanitizeReadOnlySql` 確實攔截。

---

## 六、常見故障排除清單（Troubleshooting Playbook）

<div class="vibe-grid-2">
  <div class="vibe-box-danger">
    <span class="badge">❌ 常見地雷與症狀</span>
    <ul>
      <li><strong>症狀 1：連線秒斷，出現 Unexpected token ... is not valid JSON</strong><br>某處程式碼或套件在 <code>stdout</code> 印出了文字（如 <code>console.log</code> 或資料庫橫幅），破壞了 JSON-RPC 封包。</li>
      <li><strong>症狀 2：Windows 上設定 npx 找不到指令（ENOENT）</strong><br>GUI 應用程式不會自動讀取終端機的 nvm/fnm 環境路徑，導致拉不起 <code>node</code> 或 <code>npx</code>。</li>
      <li><strong>症狀 3：AI 頻繁猜錯欄位名稱，重複試錯 5 次才成功</strong><br>只提供了 <code>query</code> Tool，卻沒有暴露資料表 Schema 給模型參考。</li>
    </ul>
  </div>
  <div class="vibe-box-success">
    <span class="badge">✅ 工程師標準解法</span>
    <ul>
      <li><strong>解法 1：全面改用 stderr 並封裝 Logger</strong><br>統一宣告 <code>const log = (...args) =&gt; console.error('[MCP]', ...args)</code>，確保 <code>stdout</code> 保持 100% 純淨。</li>
      <li><strong>解法 2：一律填寫絕對路徑</strong><br>在設定檔中將 <code>command</code> 指到絕對路徑（如 <code>C:\Program Files\nodejs\node.exe</code>），<code>args</code> 也使用編譯後 <code>dist/index.js</code> 絕對路徑。</li>
      <li><strong>解法 3：Schema 前置注入 + 錯誤訊息引導</strong><br>透過 <code>Resource</code> 暴露 DDL，並在 SQL 報錯時於回傳文字提示模型：「請先呼叫 <code>list_tables</code> 確認正確欄位」。</li>
    </ul>
  </div>
</div>

---

## 七、實戰錦囊：讓 AI 幫你生成並驗證專屬 MCP Server

當你需要為公司的內部 API、Redis 或其他資料源快速搭建 MCP Server 時，可直接複製以下兩組實戰 Prompt 卡片交給 Cursor 或 Claude Code 執行：

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 01 · MCP Server 安全骨架產生器</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">請扮演資深 Agent 基礎設施工程師，使用 TypeScript 與最新版 @modelcontextprotocol/sdk，為我建立一個遵循 MCP 規範的唯讀資料庫查詢伺服器。

【目標資料源】
- 類型：[SQLite / PostgreSQL]
- 連線方式：[從環境變數讀取連線字串或允許目錄白名單]

【強制架構與安全規範】
1. 嚴格區分 MCP 原語：將資料表 DDL 暴露為 Resource (db://schema/{table})，查詢動作封裝為 Tool，並附帶 1 個團隊常用排查 Prompt。
2. 所有 Tool 參數必須使用 Zod 嚴格定義型別與 .describe() 中文說明，方便 LLM 精準填參。
3. 實作縱深防禦：禁止多語句分號堆疊、阻斷任何寫入/DDL/系統關鍵字、強制預設 LIMIT 100 筆與 5 秒查詢逾時。
4. 由於採用 StdioServerTransport，嚴禁在任何模組呼叫 console.log()，所有執行日誌必須導向 console.error() (stderr)。
5. 完成後同時產出對應的 .cursor/mcp.json 設定範例與安全測試案例清單。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Claude Code / Windsurf</span>
    <span class="copy-hint">📋 點擊全選複製並替換目標資料源後發送</span>
  </div>
</div>

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 02 · MCP 安全滲透與邊界自檢指令</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">請針對目前專案中的 MCP Server 程式碼進行上線前安全審查與邊界測試（Security Audit），逐項驗證以下紅線並撰寫自動化單元測試：

1. 【stdout 純淨度檢查】：全文掃描是否存在任何 console.log 或 process.stdout.write 污染 JSON-RPC 管線。
2. 【SQL 注入與繞過測試】：驗證輸入以下惡意字串時是否 100% 被攔截拋錯：
   - "SELECT 1; DROP TABLE users;"
   - "/* comment */ DELETE FROM orders WHERE 1=1"
   - "SELECT * FROM users UNION SELECT sqlite_version()"
   - "ATTACH DATABASE '/tmp/hack.db' AS hack"
3. 【路徑穿越測試】：若支援檔案路徑參數，驗證 "../../../etc/passwd" 與符號連結是否被 path.resolve 白名單阻擋。
4. 【Context 爆炸測試】：確認未帶 LIMIT 的大表查詢會被自動限流，且錯誤訊息不會洩漏系統絕對路徑或資料庫密碼。

請列出發現的漏洞並直接修復，最後執行測試指令回報全數通過結果。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Claude Code（上線前必跑）</span>
    <span class="copy-hint">📋 點擊全選複製發送給 AI 執行安全自檢</span>
  </div>
</div>

---

## 總結：從「外掛拼裝工」進化為「協議架構師」

掌握 **Model Context Protocol (MCP)** 後，你不再需要每次換一個 AI 工具或升級模型，就把整套資料庫整合重新寫一遍。透過 **Host / Client / Server 三層解耦**、**Resources / Prompts / Tools 的權責劃分**，以及 **Zod 驗證 + 唯讀沙盒 + stderr 日誌隔離** 的防禦設計，你就能為自己與團隊打造出一次開發、全工具鏈通用的企業級 AI 資料連接器。
