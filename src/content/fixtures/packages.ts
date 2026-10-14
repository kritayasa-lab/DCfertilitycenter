import type { Package } from "../types";

// PLACEHOLDERS ONLY. No prices are invented (`price: null`).
// The second entry is deliberately expired to exercise expiry filtering.
export const packages: Package[] = [
  {
    slug: "example-package",
    published: true,
    placeholder: true,
    sortOrder: 1,
    price: null,
    validFrom: null,
    validUntil: null,
    translations: {
      th: {
        status: "draft",
        title: "[แพ็กเกจตัวอย่าง – รอการยืนยันจากคลินิก]",
        description: null,
        inclusions: null,
        exclusions: null,
        terms: null,
      },
      en: {
        status: "draft",
        title: "[Example package – pending clinic confirmation]",
        description: null,
        inclusions: null,
        exclusions: null,
        terms: null,
      },
      "zh-CN": {
        status: "draft",
        title: "[示例套餐——待诊所确认]",
        description: null,
        inclusions: null,
        exclusions: null,
        terms: null,
      },
    },
  },
  {
    slug: "expired-example-promotion",
    published: true,
    placeholder: true,
    sortOrder: 2,
    price: null,
    validFrom: "2025-01-01",
    validUntil: "2025-01-31",
    translations: {
      th: { status: "draft", title: "[โปรโมชันที่หมดอายุแล้ว]", description: null, inclusions: null, exclusions: null, terms: null },
      en: { status: "draft", title: "[Expired promotion]", description: null, inclusions: null, exclusions: null, terms: null },
      "zh-CN": { status: "draft", title: "[已过期的优惠]", description: null, inclusions: null, exclusions: null, terms: null },
    },
  },
];
