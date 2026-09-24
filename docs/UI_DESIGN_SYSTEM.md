# FreewingBiz UI 設計系統規範 (UI Design System)

本文件定義 FreewingBiz 網站改版之核心 UI 設計系統、元件庫、響應式規則與動畫標準。

---

## 1. 設計代幣 (Design Tokens)

### 1.1 CSS 變數規格
在 `src/styles/global.css` 中統一定義：
- 品牌色彩：`--brand-navy`, `--brand-blue`, `--brand-sky`, `--brand-ice`, `--brand-gold`
- 頁面表面：`--bg-primary (#FFFFFF)`, `--bg-secondary (#F7F9FC)`, `--surface (#FFFFFF)`
- 陰影體系：`--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow`
- 圓角體系：`--radius-md (0.5rem)`, `--radius-xl (1rem)`, `--radius-2xl (1.5rem)`

---

## 2. 元件系統規範 (Component System)

### 2.1 主導覽列 (MainLayout Header)
- **桌面版**：高度 80px，白透霧面玻璃 (`backdrop-blur-md bg-white/95`)，懸浮在天際雲海背景之上。
- **左側**：SVG 向量 WingLogo + `FREEWINGBIZ` 與 `CHARLES AI WORKSPACE` 雙行品牌標誌。
- **右側**：即時檢索按鈕（支援快捷鍵 `/`）與手機漢堡選單。

### 2.2 首頁天際英雄區 (Hero.astro)
- **背景**：以 `references/freewing-hero-reference.png` 為母版視覺，搭配中央晨曦暖金與天藍微光疊加，底層平滑淡出至 Cloud White。
- **元素**：居中 WingLogo 徽章、`FREEWINGBIZ` (大寫加粗)、`CHARLES AI WORKSPACE`、金黃色細緻分隔線、`EXPLORE · LEARN · CREATE · SHARE`、即時搜尋列。

### 2.3 內容卡片體系 (ContentCard.astro)
- **視覺**：純白底色、1px 微灰藍邊框、16:9 圓角縮圖。
- **分類眉頭 (Eyebrows)**：
  - `LEARN` &bull; Skill (皇家藍)
  - `EXPLORE` &bull; Tutorial (天藍)
  - `SHARE` &bull; Presentation (暖琥珀)
  - `CREATE` &bull; Project (靛藍)
  - `THINK` &bull; Note (石板灰)
- **Hover 動態**：向上微浮 3px (`translateY(-3px)`)、柔和藍色光暈邊框、圖片微微放大 1.02 倍。嚴格支援 `prefers-reduced-motion`。

### 2.4 深海錨定頁尾 (Footer)
- 採用 **Deep Navy (`#07172D`)** 建立穩固的視覺沉積，內含 WingLogo、品牌宣言、各單元導航與版權宣告。

---

## 3. 響應式斷點與適配 (Responsive Breakpoints)
- **行動裝置 (< 640px)**：收攏頂部過長文字，保持 WingLogo 與主副標題視覺衝擊，搜尋列與卡片以單欄呈現。
- **平板裝置 (768px - 1024px)**：雙欄卡片佈局，導覽列平滑過渡。
- **桌面大螢幕 (> 1024px)**：完整展現天際雲海寬幅與三欄網格佈局。
