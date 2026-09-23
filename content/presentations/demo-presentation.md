---
id: demo-presentation
title: Charles AI Workspace 架構與自動化簡報
type: presentation
category: Architecture
summary: 介紹 Charles AI Workspace 的靜態優先架構、內容模組規劃與自動化 CI/CD 流水線。
created: "2026-09-23"
updated: "2026-09-23"
version: "1.0"
status: active
visibility: public
tags: ["Architecture", "Presentation", "StaticSite", "Codex"]
tools: ["Astro", "TailwindCSS", "HTML5"]
cover: /assets/placeholder.svg
playUrl: /presentations/demo-presentation/slides.html
featured: false
relatedSkills: ["living-watercolor-rpg"]
relatedProjects: ["jrpg-concept-art-pipeline"]
---

# 簡報內容說明

這是一份原生的 HTML 互動簡報，支援鍵盤左右方向鍵（`←` / `→`）翻頁與空白鍵切換。

## 演講要點
1. **為什麼選擇 Static-First**：不需要任何資料庫連線維護，載入時間在 100ms 內，且天生免除常見的 SQL Injection 風險。
2. **安全隔離原則**：私人草稿或敏感筆記不直接以前端樣式隱藏，而是透過編譯期徹底剝離。
3. **長期擴展路徑**：保留 Asset Adapter 與 SearchProvider，未來隨時接入 Cloudflare R2 物件儲存與 D1/Supabase 向量搜尋。
