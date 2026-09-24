# FreewingBiz — Complete Website Visual Redesign Package

## Mission
Redesign the existing FreewingBiz website into a coherent personal AI workspace brand for Charles. Complete the work end-to-end in the existing project: inspect, plan, implement, test, refine, and leave the site production-ready. Do not stop after producing a proposal, mockup, checklist, or partial homepage.

Website identity:
- Brand: FREEWINGBIZ
- Secondary identity: CHARLES AI WORKSPACE
- Core idea: AI × Knowledge × Creation × A Better Tomorrow
- Experience words: Explore · Learn · Create · Share
- Site role: Personal AI Workspace + Knowledge Base + Project Portfolio + Creative Lab

## Master Visual Reference
Use `references/freewing-hero-reference.png` as the MASTER VISUAL REFERENCE and visual DNA for the entire site.

Do not treat it as merely a banner and do not blindly reproduce pixels. Translate its visual language into a maintainable responsive web design system:
- atmospheric blue sky
- sunrise lighting
- distant mountains and cloud sea
- royal/sky blue gradients
- restrained warm-gold sunlight accents
- generous whitespace
- elegant, calm typography
- freedom, exploration, possibility and growth
- clean premium editorial composition
- human-centered AI rather than sci-fi AI

The test for every UI decision is: “Would this component naturally belong underneath the FreewingBiz hero reference?” If not, redesign it.

## Non-negotiable constraints
1. Preserve all existing useful content, URLs, data and functionality unless a change is necessary to repair the experience.
2. Do not turn the site into a generic AI SaaS template.
3. Avoid cyberpunk, neon overload, robots, circuit-board clichés, particle fields, excessive glassmorphism, gaming UI, giant glowing blobs and distracting motion.
4. Do not scatter mountain photos across every section. The hero may use the atmospheric landscape strongly; the rest of the site should inherit the feeling primarily through color, space, light, typography, gradients and composition.
5. Do not simply place the complete reference PNG as a fixed hero if the source assets/design can be reconstructed responsively. If only the composite reference is available, it may be used temporarily as the hero visual, but protect its composition with responsive art direction and progressively separate/rebuild layers where practical.
6. Never fabricate existing project content or silently delete content.
7. Keep accessibility, performance and responsive behavior first-class requirements.
8. Work with the framework and architecture already in the repository unless there is a compelling technical reason not to.

## Phase 1 — Inspect before editing
Inspect the entire existing project and determine:
- framework/build system
- routes/pages
- global CSS/theme system
- reusable components
- content/data sources
- image/assets organization
- current navbar/footer/search behavior
- deployment configuration
- responsive breakpoints
- accessibility/performance problems

Then create/update `docs/BRAND_GUIDE.md` and `docs/UI_DESIGN_SYSTEM.md` based on this package. Do not wait for user approval between phases; continue through implementation.

## Brand mark and logo handling
The reference establishes the desired logo direction: an abstract W formed as wings, expressing Free Wing / Workspace / freedom / exploration / growth.

Required brand lockups:
- symbol-only Wing-W
- horizontal/standard lockup
- light version
- dark version
- monochrome-safe version
- favicon/app-icon form

Use existing official vector assets if present. If no official vector exists, create a clean original SVG interpretation based on the visual concept rather than tracing raster noise. Keep geometry simple, scalable and recognizable at favicon size. Do not embed the entire reference image as the logo.

Brand text:
FREEWINGBIZ
CHARLES AI WORKSPACE

## Color system
Create semantic design tokens rather than hard-coded page colors. Starting palette:
- Deep Navy: #07172D
- Dark Navy/Text: #0B1B32
- Royal Blue: #155EEF
- Sky Blue: #27A8FF
- Ice Blue: #B9DCFF
- Cloud White: #F7F9FC
- Pure White: #FFFFFF
- Secondary Gray: #64748B
- Sunrise Gold: #E8B85C — accent only, never dominant

Derive accessible hover/active/border/muted variants as needed. Verify contrast. Prefer CSS variables/theme tokens.

Suggested semantic variables include:
`--brand-navy`, `--brand-blue`, `--brand-sky`, `--brand-ice`, `--brand-gold`, `--bg-primary`, `--bg-secondary`, `--surface`, `--text-primary`, `--text-secondary`, `--border-subtle`, `--shadow-sm`, `--shadow-md`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--container-max`, and transition tokens.

## Typography
Use the site's existing high-quality font stack if suitable; otherwise choose a clean web-safe or already-available sans-serif stack. Do not introduce fragile external font dependencies unnecessarily. Establish a clear type scale for display, H1-H4, body, metadata and labels.

FREEWINGBIZ should feel spacious and premium, with restrained letter spacing. CHARLES AI WORKSPACE and small editorial labels may use wider tracking. Body copy must remain highly readable.

## Global layout
Build a coherent responsive system:
- generous but controlled whitespace
- consistent max-width containers
- clear vertical rhythm
- subtle section transitions
- mostly white/cloud-white surfaces
- occasional very pale blue atmospheric gradients
- rare Deep Navy sections for visual anchoring
- fine separators instead of excessive boxed panels

Avoid making every section a floating card.

## Homepage hero — highest priority
The top of the homepage should visually embody the supplied reference.

Desired composition:
- atmospheric mountain/cloud/sunrise background
- transparent navigation over the hero when appropriate
- Wing-W mark
- FREEWINGBIZ
- CHARLES AI WORKSPACE
- Explore · Learn · Create · Share
- optional concise brand statement/CTA if existing content supports it

Hero feeling: cinematic, spacious, optimistic, quiet and premium — not loud.

If using the supplied composite reference as an image, implement correct responsive `object-position`, overlays, sizing and art direction so text/logo are not cropped awkwardly. Prefer semantic HTML text for important brand copy rather than relying only on text baked into an image.

Desktop: spacious cinematic composition.
Tablet: preserve hierarchy while reducing dead space.
Mobile: prioritize mark, FREEWINGBIZ, CHARLES AI WORKSPACE and primary message. Do not squeeze the desktop layout into a narrow screen.

## Navigation
Preserve the current information architecture:
- Home
- Skills
- Tutorials
- Presentations
- Projects
- Notes
- Timeline

Keep Search if it currently exists.

Design direction:
- over hero: transparent or very subtle translucent navigation
- after scroll / inner pages: white or softly frosted surface with strong readability
- compact Wing-W + brand lockup on left
- navigation on center/right as architecture allows
- clean responsive mobile menu
- obvious keyboard focus states
- no excessive pill styling

## Content taxonomy and secondary concepts
Keep actual navigation/page names unchanged. Secondary editorial concepts may be used subtly:
- Skills → LEARN
- Tutorials → EXPLORE
- Presentations → SHARE
- Projects → CREATE
- Notes → THINK
- Timeline → JOURNEY

These are supporting visual labels only, not route replacements.

## Component system
Create/rework reusable components appropriate to the existing stack, including equivalents of:
- SiteHeader / Navigation
- Hero
- SectionHeader
- SkillCard
- TutorialCard
- PresentationCard
- ProjectCard
- NoteCard
- TimelineItem
- Tag/Metadata treatment
- PrimaryButton / SecondaryButton
- EmptyState if needed
- SiteFooter

Cards should share the same design DNA while retaining useful distinctions by content type.

Card direction:
- white/near-white surface
- subtle blue-gray border
- restrained shadow
- strong image hierarchy
- clean typography
- generous internal spacing
- consistent image ratios where appropriate
- no giant rounded “bubble UI” everywhere

Hover (pointer devices only):
- translateY approximately -2px to -4px
- modest shadow increase
- optional subtle blue edge/glow
- image scale no more than ~1.03
- respect `prefers-reduced-motion`

## Buttons and controls
Primary CTA: Royal Blue → Sky Blue gradient or strong Royal Blue treatment.
Secondary CTA: white/transparent surface, subtle blue border, navy text.

Keep controls refined and functional. Avoid excessive rounded pills and gratuitous gradients.

## Imagery
Use imagery selectively. Hero may strongly use the mountain/cloud/sunrise theme. Elsewhere, prioritize actual project/tutorial/skill imagery and preserve content authenticity.

When atmospheric backgrounds are used, ensure text contrast with overlays/scrims rather than sacrificing readability.

## Motion
Motion must be quiet and purposeful:
- short fade
- slight translate
- subtle image zoom
- card elevation
- smooth nav/background transition
- very subtle logo glow only if it improves polish

Avoid continuous background animation, flying particles, spinning graphics and heavy parallax. Honor `prefers-reduced-motion`.

## Inner pages
Apply the same visual system to every existing route, not only the homepage. Inner pages should feel like chapters of the same workspace.

Use a restrained page-header system with optional pale atmospheric gradient, editorial eyebrow, title and concise description. Keep content browsing fast and legible.

Do not duplicate the huge homepage hero on every page.

## Footer
Create a Deep Navy footer containing, as appropriate:
- Wing-W mark
- FREEWINGBIZ
- CHARLES AI WORKSPACE
- concise navigation
- existing copyright/contact information
- optional brand statement: AI × Knowledge × Creation × A Better Tomorrow

Keep it understated and spacious.

## Responsive requirements
Explicitly verify at representative widths around:
- 360–390px mobile
- 768px tablet
- 1024–1440px desktop
- wide desktop if supported

Check:
- no horizontal overflow
- hero focal point survives cropping
- nav works with touch and keyboard
- cards reflow correctly
- type does not become too small/large
- images do not distort
- long titles wrap gracefully
- touch targets are usable

## Accessibility
Meet sensible WCAG-oriented practices:
- semantic landmarks/headings
- keyboard navigation
- visible focus
- sufficient contrast
- meaningful alt text for content images
- decorative imagery marked appropriately
- reduced-motion support
- buttons/links have accessible names
- do not encode meaning by color alone

## Performance
Do not sacrifice speed for decoration.
- optimize images and responsive image loading
- lazy-load below-the-fold media where appropriate
- avoid huge JS animation libraries unless already justified
- avoid layout shift
- preserve or improve Core Web Vitals
- avoid shipping the reference PNG at unnecessarily huge dimensions if an optimized derivative is appropriate

## SEO / metadata
Preserve existing SEO behavior. Ensure homepage title/description and social metadata remain coherent with FreewingBiz / Charles AI Workspace. Do not break canonical URLs, sitemap, robots or structured metadata if present.

## Content preservation
This is primarily a visual redesign and design-system refactor. Preserve existing content and functionality. Text may be lightly edited only when needed for hierarchy, readability, navigation or CTA clarity. Do not rewrite the entire site's substance.

## Required project documentation
Create or update:
- `docs/BRAND_GUIDE.md`: brand meaning, logo usage, colors, typography, imagery, voice and do/don't examples.
- `docs/UI_DESIGN_SYSTEM.md`: tokens, spacing, components, responsive rules, motion, accessibility and implementation notes.

Also add concise comments only where the implementation is non-obvious; do not clutter code.

## Execution order
Execute continuously without requesting approval after each step:
1. Inspect repository and run current site/tests/build.
2. Back up or use version control appropriately; do not destroy working content.
3. Establish brand/design tokens and documentation.
4. Implement/refine logo assets if needed.
5. Redesign global navigation and footer.
6. Redesign homepage hero and homepage sections.
7. Apply the system to Skills, Tutorials, Presentations, Projects, Notes and Timeline.
8. Standardize reusable components and remove obsolete duplicate styling when safe.
9. Test responsive layouts, interactions, search/navigation and all existing routes.
10. Run lint/typecheck/tests/build available in the project.
11. Fix all regressions caused by this work.
12. Perform a final visual consistency pass against the master reference.
13. Leave a concise completion report documenting changed files, validation performed, any assumptions and any items that truly could not be completed.

## Definition of done
The task is not complete until:
- the site builds successfully (where the existing project provides a build)
- all existing primary routes still work
- homepage hero strongly reflects the reference visual identity
- all major pages share one coherent design system
- mobile/tablet/desktop layouts have been checked
- navigation/footer are consistent
- no obvious overflow/broken assets/unreadable text remain
- accessibility basics are intact
- `BRAND_GUIDE.md` and `UI_DESIGN_SYSTEM.md` exist
- no temporary placeholder UI remains unless the original project lacks the required content/assets, in which case document the limitation

## Final design objective
A visitor should immediately feel that FreewingBiz is Charles's mature personal AI workspace — a coherent home for Knowledge × Skills × Projects × Creativity × AI.

It must feel personal and distinctive, not like a stock AI startup template. The supplied FreewingBiz hero reference is the visual north star for the entire implementation.
