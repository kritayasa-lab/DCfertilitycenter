# Design system

All styling flows from tokens in `src/app/globals.css` (Tailwind v4 `@theme`). Components use
**semantic** tokens only, so re-branding means editing the palette scales.

## Palette: "Olive Garden Feast" (approved for the redesign)

| Name | Hex | Token | Use |
|---|---|---|---|
| Olive Leaf | `#606C38` | `olive-600` → `primary` | Key buttons, interactive states |
| Black Forest | `#283618` | `forest-900` → `foreground`, `primary-hover`, `surface-inverse` | Primary text, footer |
| Cornsilk | `#FEFAE0` | `cornsilk-100` → `surface-muted`, `on-primary` | Section backgrounds, text on olive |
| Light Caramel | `#DDA15E` | `caramel-400` → `accent` | Decorative shapes and surfaces only (fails as text) |
| Copper | `#BC6C25` | `copper-500` → `accent-vivid`, `focus` | Large text (vision words), icons, focus ring |

Derived (same hues, for accessible text): warm white `#FFFDF6` (`background`), deep olive `#4B5530`
(`muted` text), dark copper `#8F4E14` (`accent-strong` small accent text), caramel tint `#F8ECCF`
(`surface-accent`), olive tint `#EFF0D8` (`primary-soft`).

**The clinic logo keeps its original teal colours** and is never themed, recoloured or redrawn.

## Contrast (enforced by `tests/unit/contrast.test.ts`)

Text pairs ≥ 4.5:1 (e.g. foreground/background 12.6, muted/background 7.8, on-primary/primary 5.4,
accent-strong/background 6.3, on-inverse/surface-inverse 12.2, caramel/forest 5.7). Large text and
non-text UI ≥ 3:1 (copper on cornsilk 3.8). axe WCAG 2.2 AA scans run in Playwright.

## Typography

System-first stack (no proprietary fonts bundled):
`-apple-system, BlinkMacSystemFont, "SF Pro Text"/"SF Pro Display", "Segoe UI", "Helvetica Neue",
Noto Sans Thai (self-hosted via next/font, SIL OFL), "Sukhumvit Set", "Thonburi", "PingFang SC",
"Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", Arial, sans-serif`.

- Headings: weight 650, tight tracking for Latin; Thai line-height 1.4, Chinese 1.35.
- Body: line-height 1.6 (Latin), 1.75 (Thai/Chinese).
- Thai text is never letter-spaced (a global rule resets `tracking-*` for `:lang(th)`).

## Motion

Hero decoration uses a slow `drift` keyframe (`animate-drift`) applied only with `motion-safe:`.
Vision words enlarge with a CSS transform on hover/focus/selected state. A global
`prefers-reduced-motion` rule disables animations and transitions (tested).

## Components

- **UI primitives:** Button/ButtonLink, Container, Section, Card, Badge, Notice, PendingValue.
- **Homepage:** VisionWords, Carousel (scroll-snap, dots, arrows, keyboard), ServiceIcon,
  MapEmbed (click-to-load), InquiryForm, VideoFacade, SectionHeading.
- **Layout:** Header (six primary items), SiteLogo (original PNG; CSS framing only), Footer.

## Assets

Approved originals live in `public/images/` (uploads) with byte-identical named copies in
`public/images/{brand,doctors,clinic}/` registered in `src/config/assets.ts` and hash-checked in
tests. Reference screenshots (palette, layout inspiration) are not part of the repository or public
site. The favicon (`src/app/icon.svg`) is a neutral palette shape, not the logo.
