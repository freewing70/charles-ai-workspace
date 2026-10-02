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

## Project Conventions & SEO Best Practices

1. **Canonical Domain Enforcement**:
   - The primary official domain MUST strictly be `https://freewingbiz.com`.
   - Never use `freewing.biz` in `astro.config.mjs`, `robots.txt`, `rss.xml.js`, canonical tags, OG tags, or JSON-LD schema.

2. **Asset Paths & Search Index Maintenance**:
   - Store cover images in `/public/assets/covers/` and reference them as `/assets/covers/filename.ext`.
   - Whenever adding or updating content items, run `pnpm build:index` (or `npx tsx scripts/build-search-index.ts`) so `public/search-index.json` remains synchronized.

3. **SEO & Structured Data (JSON-LD)**:
   - When introducing new pages with `<MainLayout>`, pass explicit `title`, `description`, `type="article"`, `contentType` (`newspaper` | `tutorial` | `skill` | `presentation` | `project` | `note`), `publishedDate`, and `modifiedDate`.
   - Utility pages (`/search`, `/404`) MUST pass `noindex={true}` to prevent indexing low-value pages.

4. **WCAG AA Accessibility & Performance**:
   - Ensure text-to-background contrast ratio meets 4.5:1 (e.g. use `text-[#0369A1]` or `text-sky-800` for badges on light backgrounds).
   - Always supply explicit `width` and `height` attributes for `<img>` elements to eliminate Cumulative Layout Shift (CLS).
