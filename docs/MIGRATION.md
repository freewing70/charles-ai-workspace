# 未來架構遷移路徑 (Migration Path)

本文件紀錄 Charles AI Workspace 從 v1.0 靜態優先架構升級至 v2.0 動態架構的平滑過渡方案。

---

## 1. 資料存儲遷移：從 JSON / Markdown 至 資料庫
- **現況 (v1.0)**：採用本機 Markdown 檔案 + `data/items.json`，透過 Zod Schema 驗證。
- **目標 (v2.0)**：Cloudflare D1 (Serverless SQLite) 或 Supabase (PostgreSQL)。
- **遷移步驟**：
  1. Zod Schema 定義已經在 `src/lib/schema.ts` 規格化，可直接轉換為 Drizzle ORM 或 Prisma 欄位 Schema。
  2. 編寫批次腳本將所有 Markdown Frontmatter 匯入至資料庫表格中。
  3. 保留 `src/lib/content.ts` 抽象介面，將 `getAllItems()` 改為查詢資料庫，不改動上層頁面 API。

---

## 2. 物件儲存遷移：從 Git 靜態資產至 Cloudflare R2 / S3
- **現況 (v1.0)**：微型預覽圖存放於 `public/assets/`。
- **目標 (v2.0)**：高解析度圖片、影片、簡報附件託管於 Cloudflare R2。
- **遷移步驟**：
  1. 在部署環境設定 `PUBLIC_CDN_BASE_URL=https://assets.yourdomain.com`。
  2. `src/lib/assets.ts` 中的 `getAssetUrl` 函式將自動為所有資產加上 CDN 網域名稱。
  3. 頁面代碼無需進行任何重構。

---

## 3. 搜尋引擎升級：從 Fuse.js 至 語意向量搜尋 (Vector / Semantic Search)
- **現況 (v1.0)**：Build-time 靜態索引 + Client-side Fuse.js 模糊檢索。
- **目標 (v2.0)**：Cloudflare Vectorize / OpenAI Embeddings / Workers AI。
- **遷移步驟**：
  1. 新增 API 路由 `/api/search`。
  2. 將搜尋頁面 `src/pages/search/index.astro` 的 fetch 目標改為 `/api/search?q=...`。
  3. 支援自然語言語意提問（例如：「找出我去年做過所有關於水彩和奇幻風格的 prompt」）。
