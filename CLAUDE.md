## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

---

## Project Conventions & Zero-Tolerance Production Rules (嚴格禁止犯錯清單)

All developers and AI agents must strictly follow these rules to safeguard user experience, Google AdSense compliance, and SEO rankings:

### 1. Canonical Domain & URL Consistency
- The primary official canonical domain MUST strictly be `https://freewingbiz.com`.
- **NEVER** use `freewing.biz` (or any staging/localhost domain) in `astro.config.mjs`, `robots.txt`, `rss.xml.js`, canonical tags, OG tags, JSON-LD schemas, or markdown content.

### 2. Google AdSense Full-Coverage Mandate
- Official Publisher ID: `ca-pub-8717561016919983`.
- `src/layouts/MainLayout.astro` loads this script for all standard pages.
- **CRITICAL STANDALONE RULE**: If a page is implemented as standalone raw HTML (such as `src/content/ai-film-director.html`) bypassing `<MainLayout>`, the AdSense script tag MUST be explicitly included in its `<head>`:
  ```html
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8717561016919983" crossorigin="anonymous"></script>
  ```
- Never release any public, indexable page without the AdSense tracking snippet.

### 3. Iframe Child Pages & Naked URL Defense
- Raw HTML files intended for `<iframe>` embedding (e.g. `public/newspapers/*.html` and `public/presentations/*/slides.html`) MUST include:
  ```html
  <link rel="canonical" href="https://freewingbiz.com/{parent-route}/" />
  <meta name="robots" content="noindex, follow" />
  ```
- **Reason**: Crawlers must NEVER index naked iframe pages as standalone entries. This prevents Google from penalizing the site for "Thin Content" or "Duplicate Content".

### 4. Interactive Components & Combobox/Filter Integrity
- **Isolate Search Queries**: In search/combobox components (e.g. `camera-controls.astro`), NEVER pass an existing item's display label or description as a filter keyword when clicking category chips (e.g., "全部", "物理", "視角"). Only user-typed input should filter options.
- **No Duplicate Icons**: When an input has a dedicated leading icon slot (e.g. `<div id="leading-icon">`), do NOT concatenate the icon emoji into the `<input value="...">` string.
- **Dropdown Usability**: Dropdowns must have adequate viewing height (`max-h-72` or 288px+) and automatically scroll (`scrollIntoView({ block: 'nearest' })`) to the active selection upon opening.

### 5. Script Initialization & Zero Console Errors
- When refactoring JavaScript functions, verify all callers throughout `<script>`. Never leave an undefined reference (e.g., `renderChips()`).
- All 50+ DOM elements queried via `document.getElementById` must exist in HTML with appropriate null guards.
- Dynamic 3D viewports (`requestAnimationFrame`) and live prompt compilers MUST initialize and render on initial page load (`selectMovement(currentMovement)`).

### 6. Asset Paths, CLS & Search Index Maintenance
- Store cover images in `/public/assets/covers/` and reference them as `/assets/covers/filename.ext`.
- Always supply explicit `width` and `height` attributes on all `<img>` tags to completely eliminate Cumulative Layout Shift (CLS).
- Whenever adding or updating content items, run `pnpm build:index` so `public/search-index.json` remains synchronized.

### 7. SEO, Sitemap & Thin-Content Protection
- Utility pages (`/search`, `/404`) and empty/draft sections (`/notes`, `/projects`) MUST pass `noindex={true}`.
- Exclude empty/utility pages in `astro.config.mjs` sitemap filter:
  ```js
  filter: (page) => !page.includes('/search') && !page.includes('/projects') && !page.includes('/notes')
  ```
- Every `<MainLayout>` invocation MUST provide explicit `title`, `description`, `type="article"`, `contentType` (`newspaper` | `tutorial` | `skill` | `presentation` | `project` | `note`), `publishedDate`, and `modifiedDate`.
- Maintain 0 broken internal links (always verify with `python scripts/audit-404.py`).
- Run `python scripts/deep-audit.py` to ensure zero placeholder words (`TODO`, `TBD`, `undefined`, `NaN`).

### 8. Clean Workspace & Build Hygiene
- Always remove temporary debug/migration scripts before committing.
- Clean `dist/` before building (`node -e "require('fs').rmSync('dist', { recursive: true, force: true })"`) to avoid stale HTML files from older formats.
- Windows Git operations must use `BypassSandbox: true`.
