# FreewingBiz UI 設計系統規範 (UI Design System)

本文件定義 FreewingBiz 網站核心 UI 設計系統、元件庫、響應式規則與動畫標準。

---

## 1. 設計代幣 (Design Tokens)

### 1.1 CSS 變數規格
在 `src/styles/global.css` 中統一定義：
- **品牌色彩**：
  - `--brand-navy: #07172D`
  - `--brand-navy-dark: #0B1B32`
  - `--brand-blue: #155EEF`
  - `--brand-sky: #27A8FF`
  - `--brand-ice: #B9DCFF`
  - `--brand-gold: #E8B85C`
- **頁面表面**：`--bg-primary (#FFFFFF)`, `--bg-secondary (#F7F9FC)`, `--surface (#FFFFFF)`
- **陰影體系**：`--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow`
- **圓角體系**：`--radius-md (0.5rem)`, `--radius-xl (1rem)`, `--radius-2xl (1.5rem)`

---

## 2. 核心元件系統規範 (Component System)

### 2.1 主導覽列 (MainLayout Header)
- **桌面版**：高度 88px (`h-20 sm:h-[88px]`)，白透霧面玻璃 (`backdrop-blur-md bg-white/95`)，懸浮在天際雲海背景之上。
- **品牌識別區**：官方 WingLogo 標誌寬度 48px，左右對齊 `FREEWINGBIZ` 與 `CHARLES AI WORKSPACE` 品牌字樣。
- **右側**：即時檢索按鈕（支援快捷鍵 `/`）與手機漢堡選單。

### 2.2 首頁天際英雄區 (Hero.astro)
- **背景規格**：純淨風景晨光大氣背景 (`/assets/freewing-hero-clean-bg.jpg`)，**嚴禁任何烘焙文字或預先印製的商標**。
- **元素排列（由上至下）**：
  1. 官方 Wing-W SVG 徽章（桌面寬度約 160px，按比例縮放）；
  2. `FREEWINGBIZ` 主標題（約 68px 大字）；
  3. `CHARLES AI WORKSPACE` 副標題（大寫寬距 tracking）；
  4. 金黃色晨曦細緻分隔線；
  5. `EXPLORE · LEARN · CREATE · SHARE` 體驗動詞行；
  6. 視覺次級的即時搜尋列。

### 2.3 內容卡片體系 (ContentCard.astro)
- **視覺**：純白底色、1px 微灰藍邊框、16:9 圓角縮圖。
- **分類眉頭 (Eyebrows)**：
  - `LEARN` &bull; Skill (皇家藍)
  - `EXPLORE` &bull; Tutorial (天藍)
  - `SHARE` &bull; Presentation (暖琥珀)
  - `CREATE` &bull; Project (靛藍)
  - `THINK` &bull; Note (石板灰)
  - `JOURNEY` &bull; Timeline (深海藍)
- **Hover 動態**：向上微浮 3px (`translateY(-3px)`)、柔和藍色光暈邊框、圖片縮放上限 1.02 倍。嚴格支援 `prefers-reduced-motion`。

### 2.4 深海錨定頁尾 (Footer)
- 採用 **Deep Navy (`#07172D`)** 建立穩固的視覺沉積，內含官方 WingLogo、品牌理念、單元導航與版權宣告。

---

## 3. 響應式斷點與適配 (Responsive Breakpoints)
- **行動裝置 (< 640px)**：標誌自動適應縮放，保持 WingLogo 與主副標題視覺衝擊，搜尋列與卡片以單欄呈現。
- **平板裝置 (768px - 1024px)**：雙欄卡片佈局，導覽列平滑過渡。
- **桌面大螢幕 (> 1024px)**：完整展現天際雲海寬幅與三欄網格佈局。
