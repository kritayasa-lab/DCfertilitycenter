import type { Service, ServiceContent, ServiceIcon, TranslationMeta } from "../types";

// Service names supplied by the clinic (Thai). English and Chinese titles are
// development translations (status "draft") that need medical/native review.
// All descriptive copy is pending approved text from the clinic.
type Titles = { th: string; en: string; "zh-CN": string };

const pendingContent = (title: string): ServiceContent & TranslationMeta => ({
  status: "draft",
  title,
  summary: null,
  introduction: null,
  suitability: null,
  processSteps: null,
  preparation: null,
  faqs: [],
});

const service = (slug: string, sortOrder: number, icon: ServiceIcon, titles: Titles): Service => ({
  slug,
  published: true,
  placeholder: false,
  sortOrder,
  icon,
  translations: {
    th: pendingContent(titles.th),
    en: pendingContent(titles.en),
    "zh-CN": pendingContent(titles["zh-CN"]),
  },
});

export const services: Service[] = [
  service("fertility-consultation", 1, "consultation", {
    th: "ให้คำปรึกษา หาสาเหตุภาวะมีบุตรยาก",
    en: "Fertility consultation and assessment",
    "zh-CN": "不孕不育咨询与病因检查",
  }),
  service("iui", 2, "iui", {
    th: "การฉีดน้ำเชื้ออสุจิเข้าสู่โพรงมดลูก (IUI)",
    en: "Intrauterine insemination (IUI)",
    "zh-CN": "宫腔内人工授精（IUI）",
  }),
  service("ivf", 3, "ivf", {
    th: "การทำเด็กหลอดแก้ว (IVF)",
    en: "In vitro fertilisation (IVF)",
    "zh-CN": "体外受精（IVF，试管婴儿）",
  }),
  service("pesa-tese", 4, "sperm-retrieval", {
    th: "การเก็บอสุจิโดยตรงจากอัณฑะ (PESA/TESE)",
    en: "Surgical sperm retrieval (PESA/TESE)",
    "zh-CN": "睾丸/附睾取精术（PESA/TESE）",
  }),
  service("pgt", 5, "pgt", {
    th: "การตรวจคัดเลือกพันธุกรรมก่อนการฝังตัว (PGT)",
    en: "Preimplantation genetic testing (PGT)",
    "zh-CN": "胚胎植入前遗传学检测（PGT）",
  }),
  service("obstetrics-gynaecology", 6, "obgyn", {
    th: "บริการด้านอื่น ๆ ทางสูติศาสตร์และนรีเวช",
    en: "Other obstetric and gynaecological services",
    "zh-CN": "其他妇产科服务",
  }),
];
