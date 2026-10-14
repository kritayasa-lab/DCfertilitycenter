# Content status and assumptions

Nothing on the site is verified clinic information yet. This file tracks what is a placeholder.

## Clinic facts (`src/config/site.ts`)

| Item | Status | Notes |
|---|---|---|
| Clinic name "DC Fertility Center Hatyai" | **Provisional** | Approved as a working name only; shown with a "provisional" badge |
| Logo | Pending | Text placeholder; favicon is a neutral shape |
| Address, map, opening hours | Pending | Rendered as `[Address]` etc. with "pending verification" |
| Phone, email, LINE | Pending | Not rendered as links until verified |
| Social links | Pending | |
| Doctors, qualifications | Pending | Must not be invented (Phase 2 uses explicit placeholders) |
| Services offered | Pending | Only services the clinic confirms will be published |
| Prices, packages, promotions | Pending | Never invented |
| Success rates, testimonials, certifications | Pending | Not published without evidence and authorization |
| Legal pages (privacy, terms, disclaimer, cookies) | Pending | Will be marked as drafts that need legal review |

## Translations

- `messages/*.json` hold **UI strings only** (navigation, labels, notices). They were written during
  development and **need native-speaker review** (Thai and Simplified Chinese in particular) before
  launch.
- No medical copy exists yet. Medical content will require clinical review and approval per locale;
  machine translation is never treated as approved medical copy.

## Site-wide safeguards

- A development banner on every page states that clinic information is a placeholder.
- The home page contact CTA is a visibly disabled "available in a later phase" element.
- Pages are `noindex` and `robots.txt` disallows crawling until launch is approved.
