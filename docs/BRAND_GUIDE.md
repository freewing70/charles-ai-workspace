# FreewingBiz 品牌視覺規範指引 (Brand Guide)

## 0. 強制性 AI 規範 (Mandatory AI Rule)

> **AI agents must not redesign, simplify, reinterpret, or replace the FreewingBiz Wing-W logo. Runtime interfaces must use the permanent approved brand assets.**

---

## 1. 品牌核心定位與理念
- **品牌名稱 (Primary Brand)**：`FREEWINGBIZ`
- **副標識別 (Secondary Identity)**：`CHARLES AI WORKSPACE`
- **核心哲學 (Core Philosophy)**：`AI × Knowledge × Creation × A Better Tomorrow`
- **四大體驗動詞 (Experience Words)**：`Explore · Learn · Create · Share`
- **站點定位**：個人 AI 工作資產中心 + 知識庫 + 專案作品集 + 創意實驗室。堅決避免設計成俗套的 AI SaaS 商業宣傳模板。

---

## 2. 標誌非協商性幾何造型 (Logo Geometry)
- **唯一核可之標誌**：參考 `references/freewingbiz-brand-identity.png` 中寬幅展開的 **W + Wings** 標誌。
- **標誌外廓特性**：
  - 兩片開闊羽翼向外並向上延伸，呈現展翼飛翔之態；
  - 中央交疊相扣之結構明確呈現出「W」字樣；
  - 具有寬闊敞開的長寬比 (~1.8:1)，而非狹窄直立比例；
  - 即使轉換為單色剪影（Monochrome），亦能清晰識別為「W + Wings」。
- **嚴格禁忌**：
  - 絕不可簡化成花朵、花苞、蓮花、愛心、葉片、鳥頭、盾牌、大腦神經網絡或通用 App 圖示。
  - `references/rejected-old-simplified-logo.png` 為永久淘汰之負面範例，全站嚴禁復辟或衍生。
  - 禁止使用任何通用圖標庫、Emoji 或隨機生成的替代圖案。

---

## 3. 官方品牌向量與資產路徑 (Brand Assets)

所有線上與編譯環境必須統一引用位於 `public/brand/` 的官方資產：

| 檔案路徑 | 格式 | 用途說明 |
| :--- | :--- | :--- |
| `public/brand/freewing-symbol.svg` | SVG | 官方彩標（標準淺色背景、Hero 主視覺） |
| `public/brand/freewing-symbol-dark.svg` | SVG | 深色底專用彩標（深色卡片或底層） |
| `public/brand/freewing-symbol-mono.svg` | SVG | 單色印製 / 高對比單色標誌 |
| `public/brand/freewing-logo-horizontal.svg` | SVG | 橫式完整品牌 Lockup（導覽列 Header、文書） |
| `public/brand/freewing-logo-stacked.svg` | SVG | 直式完整品牌 Lockup（次要展示、開場） |
| `public/brand/favicon.svg` | SVG | 瀏覽器頁籤 Favicon（同步覆蓋 `public/favicon.svg`） |
| `public/brand/freewing-symbol-hd.png` | PNG | 高解析度透明備援標誌資產 |

---

## 4. 色彩系統 (Color Palette)

| 色彩名稱 | Hex 色值 | 用途說明 |
| :--- | :--- | :--- |
| **Deep Navy** | `#07172D` | 主站頁尾 (Footer)、深色底座、重點文字 |
| **Dark Navy/Text** | `#0B1B32` | 主要標題、高對比度文字、主要文字排版 |
| **Royal Blue** | `#155EEF` | 品牌主色、主行動按鈕 (Primary CTA)、連結懸停 |
| **Sky Blue** | `#27A8FF` | 輔助亮藍、次級文字裝飾、Logo 羽翼亮部 |
| **Ice Blue** | `#B9DCFF` | 輕柔選取背景、高亮強調區塊 |
| **Cloud White** | `#F7F9FC` | 柔和頁面背景、卡片底層大氣微光 |
| **Pure White** | `#FFFFFF` | 卡片表面 (Surface)、容器背景 |
| **Sunrise Gold** | `#E8B85C` | 晨曦暖金 **(僅限點綴與徽章強調，不可濫用)** |

---

## 5. 字體與文字排版 (Typography)
- **品牌英文 (Brand Title)**：`FREEWINGBIZ`
  - 規範：`letter-spacing: 0.14em ~ 0.16em`，加粗 800/900，前綴 FREEWING 採用 Deep Navy (`#07172D`)，後綴 BIZ 採用 Royal Blue (`#155EEF`) 或 Sky Blue (`#27A8FF`)。
- **副標 (Secondary Identity)**：`CHARLES AI WORKSPACE`
  - 規範：`letter-spacing: 0.28em ~ 0.32em`，大寫次級灰調，高雅從容。
- **體驗標語 (Experience Words)**：`EXPLORE · LEARN · CREATE · SHARE`
  - 規範：`letter-spacing: 0.24em ~ 0.28em`，字級約 13–16px，大寫字母搭配微小中圓點分隔。

---

## 6. Homepage Hero 建構核心準則
1. **背景**：純淨風景大氣背景（天藍、晨光雲海、遠山地平線），**嚴禁包含任何烘焙文字、標誌或宣傳字樣**。
2. **唯一性原則**：
   - 剛好 **1 個** Wing-W 標誌（桌面約 140–190px 寬，按比例縮放）；
   - 剛好 **1 個** `FREEWINGBIZ` 主標題；
   - 剛好 **1 個** `CHARLES AI WORKSPACE` 副標題；
   - 剛好 **1 個** `EXPLORE · LEARN · CREATE · SHARE` 體驗動詞行；
   - 剛好 **1 個** 視覺次級的搜尋框。
3. **氛圍延伸**：全站其他頁面應透過色彩、空白與細節延續大氣感，**禁止在所有子頁面濫發風景照片**。
