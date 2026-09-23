# Charles AI Workspace

> 無傳統主機、可持續擴充的個人 AI 工作、知識與作品管理中心。

[![Build and Deploy](https://github.com/charles/charles-ai-workspace/actions/workflows/ci-deploy.yml/badge.svg)](.github/workflows/ci-deploy.yml)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro%205-FF5D01.svg)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC.svg)](https://tailwindcss.com)

---

## 🌟 核心特色

1. **靜態優先 (Static-First)**：以 Astro 5 + Tailwind CSS v4 驅動，全站 100% 預渲染，載入時間低於 100ms，免除伺服器與資料庫負擔。
2. **Metadata 驅動**：所有內容具備嚴格的 Zod Schema 驗證，支援依標籤、分類、工具、日期交叉檢索。
3. **Build-time 隱私隔離**：私有資料（`visibility: private`）在編譯期實體過濾，絕不外洩至公開 HTML、Sitemap 或搜尋索引。
4. **八大內容模組**：
   - 🏠 **Home**：精選作品、最近更新、快速分類與即時檢索
   - ⚡ **Skills**：AI 提示詞技能模組（收錄 Living Watercolor RPG v1.1 示範）
   - 📚 **Tutorials**：操作手冊與系列教學
   - 📽️ **Presentations**：HTML5 線上投影片播放與全螢幕模式
   - 💼 **Projects**：AI 專案歷程、成果與技術鏈結
   - 📝 **Notes**：實驗筆記與模型實測評鑑
   - ⏱️ **Timeline**：依年/月歸納的完整發布軌跡
   - 🔍 **Search**：基於 Fuse.js 的毫秒級模糊檢索與分類篩選
5. **資產抽換適配器**：透過 `getAssetUrl` 抽象層，隨時無痛串接 Cloudflare R2 / AWS S3 物件儲存。

---

## 🚀 快速上手 (本地開發)

### 1. 環境需求
- Node.js `>= 22.12.0`
- pnpm `>= 10.0.0`

### 2. 安裝與啟動
```bash
# 安裝依賴套件
pnpm install

# 啟動本機開發伺服器
pnpm dev
```
瀏覽器開啟 `http://localhost:4321` 即可瀏覽網站。

### 3. 建置與驗證
```bash
# 完整建置 (包含 Schema 驗證、容量審計、搜尋索引生成與 HTML 打包)
pnpm build

# 本機預覽建置成果
pnpm preview
```

---

## ✍️ 新增內容

使用內建的 CLI 精靈快速新增各類內容項目：

```bash
pnpm add-content
```

---

## 📚 專案架構文件

- 📐 [架構設計說明書 (Architecture)](docs/ARCHITECTURE.md)
- 📝 [內容維護與撰寫指南 (Content Guide)](docs/CONTENT_GUIDE.md)
- 🚀 [部署與自訂網域指南 (Deployment)](docs/DEPLOYMENT.md)
- 🔒 [隱私安全隔離準則 (Privacy)](docs/PRIVACY.md)
- 🗺️ [未來架構遷移路徑 (Migration)](docs/MIGRATION.md)

---

## 📄 License
MIT License
