# Charles AI Workspace 內容維護指南 (Content Guide)

本指南說明如何在 Charles AI Workspace 中新增、編輯與分類管理 AI 資產。

---

## 1. 快速新增內容 (CLI 精靈)

我們提供了互動式命令列工具，協助您自動建立符合規範的 Markdown 文件與 Metadata：

```bash
pnpm add-content
```

精靈將引導您填寫：
1. **標題 (Title)**
2. **類型 (Type)**：`skill` | `tutorial` | `presentation` | `project` | `note`
3. **識別碼 (ID / Slug)**：預設依標題轉換為小寫連字號
4. **分類 (Category)**
5. **摘要 (Summary)**
6. **標籤 (Tags)**
7. **工具 (Tools)**
8. **可見度 (Visibility)**：`public` | `private` | `unlisted`

---

## 2. 目錄規範

| 內容類別 | 檔案存放路徑 | 說明 |
| :--- | :--- | :--- |
| **Skills** | `content/skills/<id>.md` 或 `skills/<id>/SKILL.md` | AI 技能、Prompt 模組與參數定義 |
| **Tutorials** | `content/tutorials/<id>.md` | 深入教學與實戰操作手冊 |
| **Presentations** | `content/presentations/<id>.md` + `public/presentations/<id>/slides.html` | 在線簡報與 HTML5 投影片 |
| **Projects** | `content/projects/<id>.md` | 專案歷程、成果與工具鏈關聯 |
| **Notes** | `content/notes/<id>.md` | 實驗心得、模型評測與工作筆記 |

---

## 3. Metadata 規格定義

每個 Markdown 頂部必須包含 Frontmatter：

```yaml
---
id: "living-watercolor-rpg"
title: "Living Watercolor RPG"
type: "skill"
category: "Image Generation"
summary: "專為 JRPG 風格角色與環境概念圖打造的動態水彩提示詞模組。"
created: "2026-09-23"
updated: "2026-09-23"
version: "1.1"
status: "active"          # active | draft | archived | deprecated
visibility: "public"      # public | private | unlisted
tags: ["watercolor", "JRPG", "character", "environment"]
tools: ["Codex", "GPT Image"]
cover: "/assets/placeholder.svg"
featured: true
relatedSkills: ["living-watercolor-rpg"]
relatedProjects: ["jrpg-concept-art-pipeline"]
---
```

---

## 4. 驗證與檢查

在提交程式碼或建置前，請執行本機檢驗：

```bash
# 驗證所有檔案的 Metadata Schema 是否正確且無重複 ID
pnpm validate

# 檢查是否有超過 Git 門檻的大檔案
pnpm check-size
```
