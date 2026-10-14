# Design system (provisional)

The visual direction was approved as an **initial proposal**, not as the clinic's official brand.
All styling flows from tokens in `src/app/globals.css` (Tailwind v4 `@theme`), so re-branding
means editing the palette scales without touching components.

## Direction

Warm ivory/sand base · deep teal-green primary · soft blush accent · serif display headings with a
clean sans-serif body · generous spacing · subtle shadows · minimal motion (respects
`prefers-reduced-motion`).

## Tokens

| Group | Tokens |
|---|---|
| Palette scales | `ivory-*`, `sand-*`, `teal-*`, `blush-*`, `ink-*` |
| Semantic colours | `background`, `surface`, `surface-muted`, `surface-accent`, `foreground`, `muted`, `border`, `border-strong`, `primary`, `primary-hover`, `primary-soft`, `on-primary`, `accent`, `accent-soft`, `accent-strong`, `focus`, `danger(-soft)`, `success(-soft)`, `warning(-soft)` |
| Fonts | `font-sans`, `font-display` (per-script fallbacks for Thai and Chinese) |
| Radius | `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-pill` |
| Shadows | `shadow-soft`, `shadow-card`, `shadow-raised` |
| Widths | `max-w-content` (72rem), `max-w-prose` (42rem) |

Components must use **semantic** tokens (e.g. `bg-primary`, `text-muted`), not palette scales,
except where a component deliberately needs a specific shade.

## Contrast (WCAG 2.2 AA, measured)

| Pair | Ratio |
|---|---|
| foreground / background | 14.83 |
| muted / background | 6.83 |
| muted / surface-muted | 6.07 |
| on-primary / primary | 8.29 |
| primary / background | 8.02 |
| accent-strong / accent-soft | 4.84 |
| warning / warning-soft | 5.37 |
| danger / danger-soft | 5.79 |
| success / success-soft | 5.68 |
| focus ring / background (non-text, ≥ 3:1) | 4.47 |

Re-check these whenever the palette changes.

## Components (Phase 1)

`Button` / `ButtonLink` (primary, secondary, ghost; md, lg; 44px+ touch targets) · `Container` ·
`Section` (tones) · `Card` · `Badge` · `Notice` · `PendingValue` · `SkipLink` ·
`DevelopmentBanner` · `LanguageSwitcher`. A live reference is at `/<locale>/styleguide`
(internal, `noindex`).

## Assets

No third-party or reference-site assets are used. The favicon (`src/app/icon.svg`) is a neutral
geometric placeholder, not a logo. Photography and the clinic logo must be clinic-owned or
licensed before they are added.
