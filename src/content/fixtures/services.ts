import type { Service } from "../types";

// PLACEHOLDERS ONLY. No service listed here is confirmed as offered by the
// clinic. Replace with clinic-confirmed services and approved copy.
const placeholderService = (n: number): Service => ({
  slug: `example-service-${n}`,
  published: true,
  placeholder: true,
  sortOrder: n,
  translations: {
    th: {
      status: "draft",
      title: `[บริการที่ ${n} – รอการยืนยันจากคลินิก]`,
      summary: null,
      introduction: null,
      suitability: null,
      processSteps: null,
      preparation: null,
      faqs: [],
    },
    en: {
      status: "draft",
      title: `[Service ${n} – pending clinic confirmation]`,
      summary: null,
      introduction: null,
      suitability: null,
      processSteps: null,
      preparation: null,
      faqs: [],
    },
    "zh-CN": {
      status: "draft",
      title: `[服务项目 ${n}——待诊所确认]`,
      summary: null,
      introduction: null,
      suitability: null,
      processSteps: null,
      preparation: null,
      faqs: [],
    },
  },
});

export const services: Service[] = [1, 2, 3, 4].map(placeholderService);
