# Dependency security findings

Last reviewed: **2026-10-14** (Phase 2 preflight). Re-check at every phase checkpoint.

## Summary

| Scope | Result |
|---|---|
| Production dependencies (`npm audit --omit=dev`) | **0 vulnerabilities** (enforced in CI at `--audit-level=high`) |
| Next.js `16.4.0` against the npm advisory database | **0 advisories** (control: `16.3.0` matches 9, see below) |
| Development toolchain | **1 advisory** (reported by npm as 5 "high" packages on one path); see Finding 1 |

## Finding 1: `braces` uncontrolled recursion (dev-only, unresolved upstream)

- **Advisory:** [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) / CVE-2026-93687, CWE-674.
  CVSS 4.0 8.7 (High), `AV:N/AC:L/PR:N/UI:N/VA:H`. Published 2026-09-18.
- **Affected:** `braces <= 3.0.3`. **Patched version: none.** 3.0.3 is the latest release.
- **Impact:** a deeply nested brace pattern exhausts the call stack and crashes the Node.js process
  (denial of service only; no confidentiality or integrity impact).
- **Path in this repo** (npm audit counts each package on the path as a separate "high"):
  `eslint-config-next@16.4.0 → @next/eslint-plugin-next@16.4.0 → fast-glob@3.3.1 → micromatch@4.0.8 → braces@3.0.3`
- **Reachability:** `braces` is reached only from `@next/eslint-plugin-next`'s `getRootDirs()` (rule
  `no-html-link-for-pages`), which globs `settings.next.rootDir` from the ESLint config. This project
  does not set `rootDir`, and the input can only come from a committed config file. It runs during
  linting (developer machines, CI), never in the deployed application or on visitor input.
- **Fix options investigated:**
  - `npm audit fix --force` would install `eslint-config-next@14.2.35`, a breaking downgrade incompatible
    with Next.js 16. **Rejected** (per project rules).
  - Upgrading `fast-glob` / `micromatch`: their latest releases (3.3.3 / 4.0.8) still depend on `braces@^3.0.3`. **No fix.**
  - `eslint-config-next` / `@next/eslint-plugin-next` `16.5.0-canary.10` still pin `fast-glob@3.3.1`. **No fix.**
  - `overrides` to an unofficial fork of `braces`: **Rejected** (supply-chain risk, unreviewed code).
  - Removing `eslint-config-next`: loses Next.js-specific lint rules, and the plugin itself still carries the path. **Not recommended.**
- **Mitigations in place:**
  - CI fails on any high/critical advisory in production dependencies (`npm audit --omit=dev --audit-level=high`).
  - Dependabot (`.github/dependabot.yml`) opens update PRs weekly so an upstream patch lands promptly.
  - No `settings.next.rootDir` is configured. Changes to `eslint.config.mjs` go through PR review.
- **Residual risk:** someone able to commit a malicious ESLint config could crash a lint run. Such a
  person could already run arbitrary code in CI, so the vulnerability adds no meaningful exposure.
- **Recommended decision:** *accept temporarily (dev-only, not reachable from the application)*, and
  re-evaluate when `braces`, `micromatch`, `fast-glob` or `@next/eslint-plugin-next` publishes a fix.
  **Requires owner sign-off.**

## Next.js security releases

- September 2026 security release (published 2026-09-30): 7 advisories fixed in **16.3.8** / 15.5.27.
  The earlier out-of-band release on 2026-09-22 (GHSA-vcvr-r3jv-pc5j, next/og RCE) was fixed in 16.3.6.
  The installed **16.4.0** (released 2026-10-06) is outside every published affected range. Verified via the
  npm bulk advisory endpoint: `next@16.3.0` matches 9 advisories, `next@16.4.0` matches 0.
- **Announced out-of-band update, 2026-10-14** ("Upcoming Next.js Security Update for Upstream
  Vulnerabilities"): three upstream-dependency vulnerabilities (2 Critical, 1 High), with details to
  be published at release time. **As of the last check, the advisories and patched release were not
  yet published** (npm `latest` = 16.4.0, no newer non-canary release; no 2026-10-14 entries on the
  Next.js GitHub advisory page). The affected packages are not yet named. **Action:** upgrade to the
  patched 16.x release as soon as it is published, then re-run the full check suite.
  (The nextjs.org blog was not directly reachable from the build environment; its status was
  confirmed through search results, the GitHub advisory list and the npm registry.)
