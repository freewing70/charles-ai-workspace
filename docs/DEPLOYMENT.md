# 部署與自訂網域指南 (Deployment Guide)

本專案為純靜態網站（Static SSG），可零成本部署於任何現代化靜態託管平台。

---

## 1. 部署平台選項

### 選項 A：Cloudflare Pages（強烈推薦）
1. 登入 Cloudflare Dashboard，進入 **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Pages**。
2. 綁定存放本專案的 GitHub Repository。
3. 建置設定：
   - **Framework Preset**: `Astro`
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - **Node.js Version**: `22`（環境變數設定 `NODE_VERSION=22`）
4. 點選 **Save and Deploy** 即可完成全球邊緣部署。

#### 綁定自訂網域 (Custom Domain)
1. 在 Cloudflare Pages 專案設定中進入 **Custom domains**。
2. 點擊 **Set up a custom domain** 並輸入您的網域名稱（例如 `ai.yourdomain.com`）。
3. Cloudflare 會自動配置 DNS CNAME 與免費的 SSL/TLS 憑證（通常 1~2 分鐘內生效）。

---

### 選項 B：GitHub Pages（已內建 CI/CD Workflow）
本專案已包含 [.github/workflows/ci-deploy.yml](file:///c:/Users/Charles/Documents/CharlesAIWorkspace/.github/workflows/ci-deploy.yml)。
1. 前往 GitHub Repository 的 **Settings** $\rightarrow$ **Pages**。
2. 在 **Build and deployment** 下方的 **Source** 選擇 **GitHub Actions**。
3. 推送至 `main` 分支時，GitHub Actions 會自動執行驗證、建置並發布至 GitHub Pages。
