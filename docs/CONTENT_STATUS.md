# Content status and assumptions

Nothing on the site is verified clinic information yet. This file tracks what is a placeholder.

## Clinic facts (`src/config/site.ts`)

| Item | Status | Notes |
|---|---|---|
| Clinic name: TH "คลินิกหมอชัยณรงค์", EN/ZH "DC Fertility Center" | **Provisional** | Approved for the redesign; final sign-off pending |
| Footer name as supplied: "คลินิกหมอหมอชัยณรงค์" | **Needs confirmation** | Duplicated "หมอ"; the site uses "คลินิกหมอชัยณรงค์" per the branding decision |
| Logo (`Untitled Design - 1.PNG`) | Provided | Used unmodified; a tightly cropped/SVG export would display sharper |
| ICSI 3D artwork (`การปฏิสนธิไข่ด้วยเทคนิค ICSI.png` → `/images/hero/icsi-hero.png`) | Provided | Kept in the asset registry (hash-checked) but not currently displayed: the hero now shows the doctors' photograph |
| Service card images | Pending | Neutral labelled placeholders ("Image pending") in the services carousel |
| Doctor photographs (`IMG_7370.JPG`, `IMG_7371.JPG`) | Provided, publication consent confirmed by owner | `IMG_7370` contains a baked-in marketing caption; no cutout (see below) |
| Doctors: รศ.นพ.ชัยณรงค์ โชคสุชาติ ว.23473; พญ.ธนพร ประทีปชัยกูร ว.51688 | Provided (Thai, exact) | Not translated/transliterated; EN/ZH versions need approval |
| Specialty lines (2) | Provided (Thai, exact) | |
| Address: 97/12 ถนนราษฎร์ยินดี อำเภอหาดใหญ่ จังหวัดสงขลา 90110 | Provided (Thai) | Shown in Thai in all locales |
| Phones: 097-3470648, 074-225-223 | Provided | `tel:` links (+66) |
| Google Maps link | Provided | Opened directly; map embed uses the address as query, no coordinates |
| Email, LINE, opening hours | Pending | Not shown |
| Instagram, TikTok, Facebook | Pending | Shown as "official link pending" without links |
| Services (six names, Thai) | Provided | EN/ZH titles are draft translations; all descriptions pending |
| Packages, prices, promotions | Pending | Homepage carousel shows labelled blank slots |
| Success stories / videos | Pending | Placeholder slots; consent + review required |
| "Why choose" description | Pending | Labelled placeholder; no invented mission statement |
| Success rates | Pending | `/success-rates` is a draft page (noindex) with no figures |

### Hero photo cutout

A non-generative background removal was evaluated and **not applied**: the white coats and the
light background in `IMG_7370.JPG` have near-identical colours (≈RGB 233–254), so colour-based
masking would cut into the subjects, and no segmentation tooling was available offline. The original
photograph is displayed unchanged with CSS sizing only.

## Placeholder fixtures (`src/content/fixtures`)

| Fixture | Records | Notes |
|---|---|---|
| services | 6 clinic-supplied services | Names supplied; all detail sections pending |
| doctors | `doctor-profile-1..2` | Names + licence numbers as supplied; other fields pending |
| home | `promo-slot-1..4`, `story-slot-1..4` | Blank labelled carousel slots |
| facilities | `facility-1..3` | Pending verification |
| packages | `example-package`, `expired-example-promotion` | No prices; the expired one exists to test expiry filtering |
| articles | `example-article-1..2`, `example-clinic-news` | Bodies pending medical review; `example-article-2` has no zh-CN translation (tests the explicit missing-translation state) |
| faqs | 3 | Two describe the website's inquiry process; one is a placeholder |

Every fixture translation is `status: "draft"`. Replace fixtures with clinic-approved content (or,
from Phase 4, CMS records, see `docs/ADMIN_CMS_REQUIREMENTS.md`). Delete the example records before launch.

Intentionally **not** built until genuine content exists: patient stories and testimonials, success
rates, accreditation badges, structured data.

## Draft legal pages

Privacy notice, terms of use, medical disclaimer and cookie information are templates with section
headings only (plus draft disclaimer and cookie wording). Each is marked **Draft** and states it has not
been reviewed by legal counsel. PDPA-specific content (data controller, legal bases, retention,
cross-border transfers, data subject rights) must come from the clinic's counsel.

## Contact form

The inquiry form (homepage section 7 and `/contact`) validates input with localized messages. Delivery
is **not connected**: valid input is checked in the browser only, **nothing is transmitted**, and the
visitor sees "your details have NOT been sent — please call …". A Google Apps Script adapter is
prepared (`src/lib/inquiry/delivery.ts`) but stays off unless both `GOOGLE_APPS_SCRIPT_URL` and
`INQUIRY_DELIVERY_ENABLED=true` are set, which requires the Phase 6 review. It reports success only
when the endpoint confirms receipt.

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
