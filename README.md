# DC Fertility Center Hatyai — Website (working name)

> **Provisional name.** "DC Fertility Center Hatyai" is a working name only. Clinic name, logo,
> address, contact details, doctors, services, prices and medical claims are **not yet verified**
> and appear on the site only as clearly labelled placeholders. See
> [`docs/CONTENT_STATUS.md`](docs/CONTENT_STATUS.md).

Multilingual (Thai / English / Simplified Chinese) fertility clinic website, with a protected
admin CMS planned for a later phase (the patient portal has been removed from scope). The project is built in gated
phases; see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components) + React 19 + TypeScript (strict)
- Tailwind CSS v4 with centralized design tokens (`src/app/globals.css`)
- next-intl 4 with `next/root-params` for locale-prefixed routes (`/th`, `/en`, `/zh-CN`)
- Vitest (unit) and Playwright (end-to-end)
- Planned: Supabase Auth + PostgreSQL with Row Level Security (Phase 3), Zod validation

## Getting started

Requirements: Node.js ≥ 20.9 (CI uses Node 22) and npm.

```bash
npm ci                       # install from the lockfile
cp .env.example .env.local   # optional in Phase 1; never commit .env files
npm run dev                  # http://localhost:3000 → redirects to /th
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types and run `tsc --noEmit` |
| `npm test` | Vitest unit tests (`tests/unit`) |
| `npm run test:e2e` | Playwright tests incl. axe accessibility scans, against the production build (run `npm run build` first) |
| `npm run check` | lint + typecheck + unit tests |

Playwright downloads its own Chromium with `npx playwright install chromium`. In environments with a
preinstalled Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chrome` instead.

### Adding dependencies

npm 10.9 crashes (`Cannot read properties of null (reading 'edgesOut')`) when resolving
vitest 4.1's optional peer dependencies. `npm ci` with the committed lockfile is unaffected. To
**add or upgrade** packages, use npm 11: `npx npm@11 install <pkg>`.

## Project layout

```
messages/            UI strings per locale (th, en, zh-CN) — keys must match across files
src/app/[locale]/    All public routes (root layout lives here)
src/app/globals.css  Design tokens (palette, semantic colours, fonts, radius, shadows)
src/components/ui/   Shared UI primitives (Button, Card, Badge, Notice, Section, ...)
src/components/layout/  Header, Footer, navigation (dropdown, mobile menu)
src/components/content/ Page building blocks (PageHeader, EntryCard, FaqList, LegalPage, ...)
src/content/         Content types, placeholder fixtures and query functions
src/config/site.ts   Single source of clinic facts with verification status
src/i18n/            Locale routing, request config, locale-aware navigation
src/proxy.ts         Locale redirect (Next.js 16 "proxy", formerly middleware)
tests/               unit/ (Vitest) and e2e/ (Playwright)
docs/                Architecture, design system, content status
```

## Branching and deployment

- `main` is the production branch. Work happens on feature branches and is merged via reviewed
  pull requests. No direct pushes to `main`.
- CI (`.github/workflows/ci.yml`) runs lint, typecheck, unit tests, build and Playwright on every PR.
- Vercel is **not yet connected**. Preview deployments will be set up in Phase 8; production
  deployment requires explicit approval.
- The site sends `noindex` and disallows crawling unless `NEXT_PUBLIC_ALLOW_INDEXING=true`.
