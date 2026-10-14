# Architecture

Status: **Phase 1 (foundation)**. Later sections describe the approved plan and are marked as such.

## Phases

| Phase | Scope | Status |
|---|---|---|
| 0 | Repository audit, architecture proposal | Done |
| 1 | Foundation: Next.js, design tokens, i18n routing, UI primitives, tests, CI | **This phase** |
| 2 | Public website pages, Header/Footer, SEO | Planned |
| 3 | Supabase Auth/Postgres, roles, RLS, DB policy tests | Planned (needs approved Supabase project) |
| 4 | Admin dashboard and CMS | Planned |
| 5 | Patient portal (account, profile, own inquiries only) | Planned |
| 6 | Inquiry workflow, anti-spam, optional notifications | Planned |
| 7 | QA, security review, documentation | Planned |
| 8 | GitHub PR + Vercel Preview | Planned (needs Vercel project) |
| 9 | Production release | Requires explicit approval |

Out of scope for this release: medical records, lab results, embryology/IVF cycle records,
prescriptions, document uploads, clinical chat, online payments, automated treatment
recommendations, automated appointment confirmation.

## Rendering and routing (Next.js 16)

- **App Router with Cache Components** (`cacheComponents: true`, `partialPrefetching: true`).
  Pages render statically by default; dynamic data will be streamed or cached explicitly with
  `"use cache"`.
- **Root layout is `src/app/[locale]/layout.tsx`.** `locale` is a *root param*, read with
  `next/root-params` (`import { locale } from "next/root-params"`) in Server Components.
  `generateStaticParams` returns the three locales; any other value hits `notFound()`.
  Note: `dynamicParams` segment config is incompatible with Cache Components, so the layout
  validates the locale itself.
- **Root params are unavailable in Server Actions and Route Handlers.** There, pass the locale
  explicitly (e.g. `getTranslations({ locale, namespace })`); `src/i18n/request.ts` gives an
  explicit locale precedence.
- **404 handling**
  - `src/app/[locale]/[...rest]/page.tsx` → localized `not-found.tsx` for unknown paths under a locale.
  - `src/app/global-not-found.tsx` (experimental `globalNotFound`) → trilingual 404 for URLs that
    match no route.
- **Proxy** (`src/proxy.ts`, Next.js 16's rename of middleware) runs next-intl's middleware:
  `/` → `/th` (locale detection disabled by decision), and unprefixed paths get a `/th` prefix.
  In Phase 3 it will also refresh Supabase sessions.

## Internationalization

- Locales: `th` (default), `en`, `zh-CN`. Always prefixed (`localePrefix: "always"`).
- UI strings: `messages/<locale>.json`, typed from `en.json` (`src/i18n/global.d.ts`).
  A unit test enforces identical key sets and no empty strings across locales.
- Language switching (`src/components/LanguageSwitcher.tsx`) keeps the current locale-less path.
- **Missing translations are never silently substituted.** UI catalogs are complete by test.
  For CMS content (Phase 2/4), a page without a *published* translation in the requested locale
  renders an explicit "not available in this language" state, and its `hreflang` alternates list
  only the locales that are actually published (`localeAlternates(locale, path, availableLocales)`).
- Fonts: Noto Sans (Latin body), Noto Sans Thai (Thai body), Cormorant Garamond (Latin display),
  Noto Serif Thai (Thai display), all self-hosted via `next/font`. Simplified Chinese uses
  system fonts (PingFang SC / Microsoft YaHei / Noto Sans SC) to avoid multi-MB CJK downloads.
  Thai and Chinese get a taller line height.

## Clinic facts

`src/config/site.ts` is the single source of clinic facts. Each value has a status:
`verified` | `provisional` | `pending`. Use `verifiedValue()` for anything presented as fact
(links, structured data) and `<PendingValue>` for display: it shows a "pending verification"
placeholder or a "provisional" badge. In Phase 4 these values move to a CMS `site_settings` table.

## Security baseline (Phase 1)

- Headers on all routes: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`;
  `X-Powered-By` disabled. A Content-Security-Policy is planned once third-party origins
  (Supabase, Turnstile) are known.
- Pre-launch: every page sends `robots: noindex, nofollow` and `robots.txt` disallows all,
  unless `NEXT_PUBLIC_ALLOW_INDEXING=true` (to be set only at approved launch).
- No secrets are used in Phase 1. `.env*` files are git-ignored except `.env.example`.
- `/[locale]/styleguide` is an internal reference page (always `noindex`). It must be removed or
  protected before production.

## Planned: data and auth (Phase 3+, approved in principle)

- Supabase Auth via `@supabase/ssr` cookie sessions; RLS on every exposed table; service-role key
  only in server-only modules; pgTAP tests for allowed and denied access.
- Roles: `admin`, `staff` (explicit permission flags), `patient`. No public staff registration;
  the first admin is bootstrapped by a CLI script that reads environment variables (no hardcoded
  credentials).
- Inquiry ownership: an inquiry is linked to a patient account only when submitted while signed in
  with a verified account, or by an audited staff action after identity confirmation. Never by
  email matching.
- Real patient data may not enter development or preview systems until the clinic approves the
  privacy, hosting (Singapore region is provisional) and data-processing arrangements.
