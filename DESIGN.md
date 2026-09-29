# DESIGN.md — FreewingBiz Visual System Truth

## Design Tokens & Palette

### Color System
- **Deep Navy** (`#07172D`): Footer background, primary text anchors, deep structural framing.
- **Dark Navy / Text** (`#0B1B32`): Heading typography, high-contrast text.
- **Royal Blue** (`#155EEF`): Primary CTA button, active navigation states, brand highlight.
- **Sky Blue** (`#27A8FF`): Brand accent, logo wing highlight, subtle glow effects.
- **Ice Blue** (`#B9DCFF`): Selection highlight, pale blue badges.
- **Sunrise Gold** (`#E8B85C`): Restrained sunlight accents, golden dividers, featured badge borders.
- **Cloud White** (`#F7F9FC`): Background surfaces, soft atmospheric light gradients.
- **Pure White** (`#FFFFFF`): Card containers, interactive inputs, crisp surface overlays.

### Typography
- **Primary Sans**: System Sans / Inter / Plus Jakarta Sans (`font-sans`).
- **Brand Title**: `FREEWING` (`#07172D`) + `BIZ` (`#155EEF` / `#27A8FF`), tracking `0.14em` – `0.16em`, font-weight 800/900.
- **Secondary Identity**: `CHARLES AI WORKSPACE`, uppercase, tracking `0.28em` – `0.32em`, font-weight 600, muted navy.
- **Experience Verbs**: `EXPLORE · LEARN · CREATE · SHARE`, tracking `0.18em` – `0.28em`, text size 13–16px (responsive single-line on mobile).

### Spacing & Surface Geometry
- **Container Max-Widths**: `7xl` (1280px) for general pages, `4xl` (896px) for Hero content, `xl` (576px) for Hero search bar.
- **Header Height**: `h-20 sm:h-[88px]` with `backdrop-blur-md bg-white/95`.
- **Card Geometry**: 1px subtle border (`border-slate-200`), `rounded-2xl` / `rounded-xl`, soft shadow (`shadow-xs` / `shadow-sm`), hover translation `-3px` with soft sky blue glow (`box-shadow: 0 10px 15px -3px rgba(7, 23, 45, 0.08)`).
- **Footer Geometry**: Deep Navy (`#07172D`) surface, top border `#0B254A`, 4-column responsive grid.

## Anti-Patterns & Ban Rules
1. **No AI Slop / Generic Tells**:
   - No purple-to-pink gradients.
   - No dark cyberpunk neon, circuit lines, or glowing robot heads.
   - No floating cards nested inside cards.
   - No gray text on colored badge backgrounds with poor contrast.
   - No italic serif headlines on SaaS marketing blocks.
2. **Atmosphere Discipline**:
   - Mountain cloud sea background is reserved exclusively for the Homepage Hero.
   - Inner pages continue the atmosphere through whitespace, subtle blue sky gradients, typography, and crisp card borders.
