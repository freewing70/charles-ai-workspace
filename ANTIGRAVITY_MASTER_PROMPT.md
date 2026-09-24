# FREEWINGBIZ — FINAL END-TO-END BRAND + WEBSITE IMPLEMENTATION

Execute this entire task in the existing FreewingBiz repository. Do not stop after analysis, a plan, a mockup, or the homepage. Inspect, implement, run, visually inspect, repair, and finish the complete site.

## 0. Source-of-truth files
Read these before editing:

- `references/freewingbiz-brand-identity.png` — APPROVED BRAND IDENTITY REFERENCE.
- `references/freewingbiz-hero-composition-reference.png` — HERO COMPOSITION / MOOD REFERENCE ONLY.
- `references/rejected-old-simplified-logo.png` — REJECTED LOGO. NEVER USE IT.
- `docs/BRAND_SPEC.md` — written brand constraints.

The two approved reference images are specification/mood boards, NOT production website assets. NEVER place either complete reference image into the live page, hero, card, background, `<img>`, CSS background, or pseudo-element.

## 1. Critical correction from the previous implementation
The previous implementation made two serious mistakes:

1. It used a composite reference image containing baked-in logo/text as a hero background, then overlaid HTML logo/text, creating duplicates.
2. It simplified the Wing-W symbol into a flower/bud/lotus-like icon.

Both must be fully corrected. Do not preserve these mistakes for compatibility.

## 2. Inspect before editing
Inspect the repository and identify framework/build system, routes, page structure, global styles/theme, reusable components, content/data sources, asset organization, navbar/footer/search, responsive behavior, deployment config, accessibility issues and performance issues.

Preserve existing useful content, URLs, data, search behavior and functionality. Work with the existing architecture unless a change is technically necessary.

Then continue immediately into implementation. Do not wait for approval between phases.

## 3. Approved brand identity
Primary brand: `FREEWINGBIZ`
Secondary identity: `CHARLES AI WORKSPACE`
Core idea: `AI × Knowledge × Creation × A Better Tomorrow`
Experience words: `Explore · Learn · Create · Share`

The site is a personal AI workspace, knowledge base, project portfolio and creative lab. It must not look like a generic AI SaaS landing page.

## 4. Logo — non-negotiable geometry
The approved symbol is the large, wide **W + Wings** mark in `references/freewingbiz-brand-identity.png`.

The defining silhouette is:
- two large wings extending clearly outward and upward;
- a central angular construction that unmistakably forms a W;
- wide/open proportions rather than narrow/upright proportions;
- strong recognition even as a one-color silhouette.

It must NOT resemble a flower, lotus, bud, heart, leaves, bird head, shield, AI brain, circuit icon, or generic app icon.

`references/rejected-old-simplified-logo.png` is a negative example. Remove that mark everywhere. Never trace, reuse, recolor, or evolve it.

Do not use an icon library, emoji, stock logo, or arbitrary generated substitute.

If the repository already contains a correct official Wing-W vector matching the approved reference, use it. Otherwise create a carefully reconstructed SVG implementation guided by the approved reference. Prioritize silhouette fidelity and scalability over decorative micro-detail. Validate it in solid monochrome: if it no longer reads as W + Wings, the geometry is wrong and must be fixed.

Once approved geometry is reconstructed in the project, treat the permanent SVG assets as the only runtime source of truth. Do not create separate alternate logo geometries for navbar, hero, favicon, or dark mode.

Create/maintain framework-equivalent public assets:
- `brand/freewing-symbol.svg`
- `brand/freewing-symbol-dark.svg`
- `brand/freewing-symbol-mono.svg`
- `brand/freewing-logo-horizontal.svg`
- `brand/freewing-logo-stacked.svg`
- `brand/favicon.svg`

Raster fallbacks may be generated only if technically required. At tiny favicon sizes, internal decorative detail may be reduced, but the OUTER W + Wings silhouette must remain unchanged.

## 5. Logo color and lockups
Use controlled blue gradients inspired by the approved identity. Blue remains dominant. Sunrise Gold may appear only as a restrained reflection/accent.

Palette:
- Deep Navy `#07172D`
- Dark Navy/Text `#0B1B32`
- Royal Blue `#155EEF`
- Sky Blue `#27A8FF`
- Ice Blue `#B9DCFF`
- Sunrise Gold `#E8B85C`
- Cloud White `#F7F9FC`
- Pure White `#FFFFFF`

Wordmark:
- `FREEWING` in Deep Navy on light surfaces;
- `BIZ` in Royal/Sky Blue;
- `CHARLES AI WORKSPACE` below with restrained size and generous tracking.

Dark surfaces may use white/light wordmark with Sky Blue BIZ. Monochrome must preserve the same geometry.

## 6. Design tokens
Create/update semantic global design tokens instead of scattering arbitrary colors. Use framework conventions. Include color, typography, spacing, radius, shadow, container widths, breakpoints and transitions.

Equivalent color variables should map to the approved palette. Do not invent unrelated brand colors.

Preferred typography: Inter or Plus Jakarta Sans, using existing project font infrastructure when practical. Avoid futuristic sci-fi fonts and excessive weights.

## 7. Navbar
The current general navigation structure is retained:
Home / Skills / Tutorials / Presentations / Projects / Notes / Timeline, plus existing search behavior.

Left side uses the official horizontal lockup:
`[Wing-W] FREEWINGBIZ`
`         CHARLES AI WORKSPACE`

Desktop Wing-W symbol should be roughly 44–54px wide and must retain recognizable W proportions. Do not compress it vertically. Keep navbar elegant and light, roughly 82–96px tall unless the existing layout requires a nearby value. Active state may use a restrained pale-blue treatment.

## 8. Homepage hero — rebuild correctly
The homepage hero must be reconstructed as real responsive web layers. NEVER use the complete reference PNG as the background.

Required conceptual order:
1. clean atmospheric background only;
2. official Wing-W SVG;
3. FREEWINGBIZ;
4. CHARLES AI WORKSPACE;
5. subtle short Sunrise Gold divider;
6. EXPLORE · LEARN · CREATE · SHARE;
7. existing search component.

The production background may use a clean existing scenic asset, a newly available clean landscape asset, or a refined CSS/graphic treatment. It must evoke blue sky, sunrise, cloud sea, distant mountains and soft golden horizon. It MUST contain NO baked-in logo, text, FREEWINGBIZ, CHARLES AI WORKSPACE, decorative copy, or lettering.

Do not reproduce the moodboard's auxiliary copy such as `IDEAS · PEOPLE · AI · CREATION` or `讓想像 展翼更遠 / IDEAS FLY FURTHER` in the central hero. Those are concept-board elements, not required website content.

Hero desktop target:
- Wing-W approximately 140–190px wide;
- FREEWINGBIZ approximately 64–80px, responsive rather than hard-coded where appropriate;
- CHARLES AI WORKSPACE approximately 18–24px;
- experience line approximately 13–16px;
- search max-width roughly 650–760px;
- total hero roughly 650–760px depending on viewport/content.

The search bar should be visually subordinate: white/translucent surface, subtle border/shadow, controlled blue CTA. Do not let it compete with the brand.

There must be exactly ONE visible Hero Wing-W, ONE visible FREEWINGBIZ, ONE visible CHARLES AI WORKSPACE and ONE experience line.

Mobile must be intentionally recomposed, not merely compressed desktop. Prioritize symbol, brand, secondary identity, experience line and search readability.

## 9. Global UI visual language
Translate the approved identity into the entire UI through:
- Cloud White / white / very pale blue surfaces;
- Deep Navy typography;
- Royal/Sky Blue accents;
- extremely restrained Sunrise Gold details;
- generous whitespace;
- clean editorial hierarchy;
- thin separators;
- subtle blue-gray borders and shadows;
- restrained atmospheric gradients;
- refined, reusable cards;
- calm motion.

Avoid cyberpunk, neon overload, robots, circuits, gaming UI, giant glowing blobs, excessive glassmorphism, constant moving backgrounds, spinning AI graphics and particle fields.

Do not place mountain photography everywhere. The atmosphere should continue mostly through color, spacing, typography, light, borders, icons and composition.

## 10. Content architecture and page families
Preserve the actual navigation names and existing content. You may use these subtle conceptual labels as secondary cues only:
- Skills → LEARN
- Tutorials → EXPLORE
- Presentations → SHARE
- Projects → CREATE
- Notes → THINK
- Timeline → JOURNEY

Create/refine reusable components appropriate to the project, such as SkillCard, TutorialCard, PresentationCard, ProjectCard, NoteCard and TimelineItem. They should share the same design system while allowing content-type distinctions.

Cards: near-white surfaces, subtle blue-gray border, soft shadow, generous spacing, strong media hierarchy, clean typography. Hover may translate only about 2–4px, slightly strengthen shadow/edge and scale images no more than ~1.03.

Do not make every section look like an isolated floating card. Maintain page rhythm and breathing room.

## 11. Buttons, footer and motion
Primary CTA: controlled Royal Blue → Sky Blue treatment.
Secondary CTA: white/transparent with blue border and dark navy text. Avoid excessive pill UI.

Footer: Deep Navy, official Wing-W lockup, FREEWINGBIZ, CHARLES AI WORKSPACE, simple navigation and optionally `AI × Knowledge × Creation × A Better Tomorrow`.

Motion must be restrained: fade, slight translate, subtle logo glow if appropriate, tiny image scale, card elevation, smooth navigation transitions. Respect reduced-motion preferences.

## 12. Documentation
Create/update:
- `docs/BRAND_GUIDE.md`
- `docs/UI_DESIGN_SYSTEM.md`

Document the final logo asset paths, geometry constraints, prohibited logo interpretations, colors, typography, spacing, hero, navbar, footer, favicon, light/dark/mono use, responsive behavior and UI principles.

Include this explicit rule in BRAND_GUIDE.md:

> AI agents must not redesign, simplify, reinterpret, or replace the FreewingBiz Wing-W logo. Runtime interfaces must use the permanent approved brand assets.

## 13. Accessibility, performance and behavior
Preserve functional navigation, search, content links and routes. Check keyboard/focus behavior, text/background contrast, semantic structure, responsive overflow, image loading and layout stability. Do not introduce avoidable CLS or huge unoptimized assets.

## 14. Mandatory visual QA — build success is not enough
After implementation, RUN the actual site and inspect the rendered UI in a browser. Use the available browser/screenshot capability. Do not report completion based only on compilation/tests.

Inspect at minimum:
- desktop around 1920px;
- desktop around 1440px;
- tablet;
- mobile.

Explicitly verify and fix until all are true:
- [ ] Approved wide W + Wings mark is used.
- [ ] Rejected flower/bud/lotus mark is completely gone.
- [ ] Logo still reads as W + Wings in monochrome.
- [ ] Navbar uses the official brand asset and correct proportions.
- [ ] Hero contains exactly one Wing-W.
- [ ] Hero contains exactly one FREEWINGBIZ.
- [ ] Hero contains exactly one CHARLES AI WORKSPACE.
- [ ] Hero background contains no baked-in text/logo.
- [ ] No reference board/composite image is rendered on the live site.
- [ ] Search is functional and visually subordinate.
- [ ] No overlaps, clipping or horizontal overflow.
- [ ] Mobile is intentionally composed.
- [ ] Existing routes/content remain accessible.
- [ ] Colors and typography follow the brand system.
- [ ] The first screen looks like a real premium website, not a poster pasted into a page.
- [ ] The rest of the site feels related to the hero without repeating mountain photos everywhere.

If any check fails, fix it before finishing.

## 15. Definition of done
The task is complete only when:
1. the repository has a coherent permanent FreewingBiz brand asset system;
2. the rejected simplified mark is no longer used;
3. the homepage hero is correctly rebuilt without baked-in reference-board content;
4. the navbar, footer and all major page families inherit the same design system;
5. existing useful content/functionality is preserved;
6. responsive/accessibility/performance basics are validated;
7. the rendered site has been visually inspected and visible defects repaired;
8. BRAND_GUIDE.md and UI_DESIGN_SYSTEM.md document the implemented system.

Final target: a calm, open, premium, intelligent, exploratory, human and optimistic digital environment unmistakably belonging to FREEWINGBIZ / CHARLES AI WORKSPACE.
