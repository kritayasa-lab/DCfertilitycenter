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
It is shown with `object-fit: contain` at its intrinsic ratio; the frame is sized to the artwork's
bounding box so the transparent margin falls outside (CSS only, `LogoImage`). No background,
card, filter, blend mode or shadow is applied. The footer shows the clinic name as text, because
the logo's dark-teal wordmark has only 2.3:1 contrast on the dark footer.

### Champagne gold (primary CTAs only)

`gold-50 #FBF6EA` · `gold-100 #F6EBD2` · `gold-200 #ECDAB2` · `gold-300 #E0C690` (`cta-gold`) ·
`gold-400 #D0AE73` (`cta-gold-deep`) · `gold-600 #9C7A3E` (`cta-gold-edge`). Text: Black Forest
(`on-cta-gold`, ≥ 7:1 on every stop). Use `<ButtonLink variant="gold">` for contact/appointment
CTAs only (header "Contact us", hero primary, CTA band). Soft vertical gradient, fine inner
highlight, single sheen sweep on hover/focus, 3px Black Forest focus ring; the sheen and lift are
disabled under reduced motion. Secondary actions stay `secondary`/`ghost`.

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

The hero ICSI artwork floats very slowly (`animate-float`, 8px over 12s, `motion-safe:` only).
Vision words enlarge slightly (1.06) with a champagne underline on hover/focus/selected state.
The services arc moves cards with CSS transforms (700 ms ease-out). A global
`prefers-reduced-motion` rule disables animations and transitions (tested).

## Components

- **UI primitives:** Button/ButtonLink, Container, Section, Card, Badge, Notice, PendingValue.
- **Homepage:** VisionWords (`stage` / `compact`), ServiceArc (curved overlapping services
  carousel: arrows, ←/→, drag/swipe, focus-to-centre), Carousel (scroll-snap, dots, arrows, keyboard), ServiceIcon,
  MapEmbed (click-to-load), InquiryForm, VideoFacade, SectionHeading.
- **Layout:** Header (six primary items), SiteLogo (original PNG; CSS framing only), Footer.

## Assets

Approved originals live in `public/images/` (uploads) with byte-identical named copies in
`public/images/{brand,doctors,clinic}/` registered in `src/config/assets.ts` and hash-checked in
tests. Reference screenshots (palette, layout inspiration) are not part of the repository or public
site. The favicon (`src/app/icon.svg`) is a neutral palette shape, not the logo.
