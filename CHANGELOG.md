# Changelog

All notable changes to the Charles AI Workspace project will be documented in this file.

## [1.0.0] - 2026-09-23

### Added
- **Core Architecture**:
  - Implemented Static-First architecture powered by Astro 5 and Tailwind CSS v4.
  - Zod-based Metadata Schema validation for all content entities (`skill`, `tutorial`, `presentation`, `project`, `note`).
  - Strict build-time physical privacy isolation ensuring `private` entries never enter public artifacts.
  - Asset URL abstraction adapter (`getAssetUrl`) for future zero-downtime Object Storage (Cloudflare R2 / AWS S3) migration.
- **Pages & Modules**:
  - `Home`: Hero showcase, fast search bar, category navigation, featured assets, and recent updates.
  - `Skills`: Filterable grid, detail pages with Markdown rendering, Prompt copy templates, and cross-reference links.
  - `Tutorials`: Systematic guides and curriculum entries.
  - `Presentations`: In-browser HTML5 presentation viewer with full-screen presentation mode and keyboard shortcuts.
  - `Projects`: Milestone logs, linked skills, and technical portfolios.
  - `Notes`: Experimental logs, model test reviews, and workflow thoughts.
  - `Timeline`: Monthly/Yearly historical milestones.
  - `Search`: Millisecond client-side fuzzy search powered by Fuse.js with real-time category filtering.
  - `404`: Styled fallback error page.
- **Initial Contents**:
  - Packaged **Living Watercolor RPG Skill v1.1** with `SKILL.md`, Chinese instructions, modular prompt recipes, and preset downloadables.
  - Interactive HTML presentation sample (`demo-presentation`).
  - Sample game concept project (`jrpg-concept-art-pipeline`).
  - Security benchmark note (`private-research-secret-note`) confirming physical exclusion.
- **Automation & CI/CD**:
  - Interactive CLI wizard `pnpm add-content` for standardized content onboarding.
  - Automated pre-build scripts: `pnpm validate`, `pnpm check-size`, `pnpm build:index`.
  - GitHub Actions automated deployment workflow (`.github/workflows/ci-deploy.yml`).
- **Documentation**:
  - Complete architecture, content guide, deployment, privacy, and migration docs in `docs/`.
