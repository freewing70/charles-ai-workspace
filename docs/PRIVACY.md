# 隱私安全與資料隔離架構 (Privacy & Security)

在 Charles AI Workspace 中，資料安全與隱私防護遵循嚴格的架構原則。

---

## 1. 核心安全準則

> [!CAUTION]
> 前端 CSS 隱藏（例如 `display: none`）絕非隱私保護！所有打包進 HTML、JS 或 JSON 的內容，均可被訪客輕鬆檢視。

因此，Charles AI Workspace 採取 **編譯期實體隔離（Build-time Physical Isolation）**：
1. **Public**：公開內容，正常渲染為 HTML、收錄進 `search-index.json` 與公開 Sitemap。
2. **Unlisted**：不公開列出，會產生 HTML 頁面，但不列入首頁列表、分類目錄與全站搜尋索引中。
3. **Private**：私有內容，**完全自公開建置流程中剔除**，絕不生成 HTML，絕不收錄至搜尋索引，從根本杜絕外洩風險。

---

## 2. 敏感資料與密鑰規範
- **禁止將真實 Secret 提交至 Git**：API Key、存取 Token、伺服器密碼嚴格透過 `.env` 或雲端部署平台（如 Cloudflare Pages Environment Variables / GitHub Secrets）管理。
- 專案已建立 `.env.example` 作為環境變數參考範本。
