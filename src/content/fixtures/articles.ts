import type { Article } from "../types";

// PLACEHOLDERS ONLY. No medical information is included; bodies are pending
// clinically reviewed copy. `example-article-2` intentionally has no zh-CN
// translation to exercise the "not available in this language" state.
export const articles: Article[] = [
  {
    slug: "example-article-1",
    published: true,
    placeholder: true,
    sortOrder: 1,
    category: "fertility-basics",
    publishedAt: "2026-10-01",
    medicalReview: { required: true, status: "pending", reviewedAt: null },
    translations: {
      th: { status: "draft", title: "[บทความตัวอย่าง 1 – รอเนื้อหาที่ผ่านการตรวจสอบทางการแพทย์]", excerpt: null, body: null },
      en: { status: "draft", title: "[Example article 1 – pending medically reviewed copy]", excerpt: null, body: null },
      "zh-CN": { status: "draft", title: "[示例文章 1——待医学审核内容]", excerpt: null, body: null },
    },
  },
  {
    slug: "example-article-2",
    published: true,
    placeholder: true,
    sortOrder: 2,
    category: "treatment-journey",
    publishedAt: "2026-10-02",
    medicalReview: { required: true, status: "pending", reviewedAt: null },
    translations: {
      th: { status: "draft", title: "[บทความตัวอย่าง 2 – รอเนื้อหาที่ผ่านการตรวจสอบทางการแพทย์]", excerpt: null, body: null },
      en: { status: "draft", title: "[Example article 2 – pending medically reviewed copy]", excerpt: null, body: null },
    },
  },
  {
    slug: "example-clinic-news",
    published: true,
    placeholder: true,
    sortOrder: 3,
    category: "clinic-news",
    publishedAt: "2026-10-03",
    medicalReview: { required: false, status: "pending", reviewedAt: null },
    translations: {
      th: { status: "draft", title: "[ข่าวสารคลินิกตัวอย่าง]", excerpt: null, body: null },
      en: { status: "draft", title: "[Example clinic news]", excerpt: null, body: null },
      "zh-CN": { status: "draft", title: "[示例诊所新闻]", excerpt: null, body: null },
    },
  },
];
