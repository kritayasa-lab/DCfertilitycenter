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

## Placeholder fixtures (`src/content/fixtures`)

| Fixture | Records | Notes |
|---|---|---|
| services | `example-service-1..4` | Not confirmed as offered; all detail sections pending |
| doctors | `doctor-profile-1..2` | No names, credentials, registration numbers or photos |
| facilities | `facility-1..3` | Pending verification |
| packages | `example-package`, `expired-example-promotion` | No prices; the expired one exists to test expiry filtering |
| articles | `example-article-1..2`, `example-clinic-news` | Bodies pending medical review; `example-article-2` has no zh-CN translation (tests the explicit missing-translation state) |
| faqs | 3 | Two describe the website's inquiry process; one is a placeholder |

Every fixture translation is `status: "draft"`. Replace fixtures with clinic-approved content (or,
from Phase 4, CMS records). Delete the example records before launch.

Intentionally **not** built until genuine content exists: patient stories and testimonials, success
rates, accreditation badges, structured data.

## Draft legal pages

Privacy notice, terms of use, medical disclaimer and cookie information are templates with section
headings only (plus draft disclaimer and cookie wording). Each is marked **Draft** and states it has not
been reviewed by legal counsel. PDPA-specific content (data controller, legal bases, retention,
cross-border transfers, data subject rights) must come from the clinic's counsel.

## Contact form

The inquiry form on `/contact` is a **non-functional layout**. All controls are disabled, it has no
action, and a notice says nothing is sent or stored and that an inquiry does not confirm an appointment.
It collects only initial-contact fields (no medical details, ID numbers or uploads). Phase 6 connects it.

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
