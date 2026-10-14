import type { Faq } from "../types";

// Website/process FAQs only. These describe how this website currently works
// (inquiry-first, contact form not yet connected). No medical answers.
export const faqs: Faq[] = [
  {
    slug: "how-to-contact",
    published: true,
    placeholder: false,
    sortOrder: 1,
    topic: "contact",
    translations: {
      th: {
        status: "draft",
        question: "ฉันจะติดต่อคลินิกได้อย่างไร",
        answer: "ช่องทางการติดต่อของคลินิกจะเผยแพร่บนเว็บไซต์นี้เมื่อได้รับการยืนยันแล้ว ขณะนี้แบบฟอร์มติดต่อยังไม่เปิดใช้งาน",
      },
      en: {
        status: "draft",
        question: "How can I contact the clinic?",
        answer: "The clinic's contact details will be published on this website once they have been verified. The contact form is not yet connected.",
      },
      "zh-CN": {
        status: "draft",
        question: "如何联系诊所？",
        answer: "诊所的联系方式经核实后将在本网站公布。联系表单目前尚未开通。",
      },
    },
  },
  {
    slug: "inquiry-is-not-booking",
    published: true,
    placeholder: false,
    sortOrder: 2,
    topic: "contact",
    translations: {
      th: {
        status: "draft",
        question: "การส่งแบบฟอร์มสอบถามถือเป็นการนัดหมายหรือไม่",
        answer: "ไม่ใช่ การส่งแบบฟอร์มสอบถามไม่ใช่การยืนยันนัดหมาย ทีมงานของคลินิกจะติดต่อกลับเพื่อพูดคุยและนัดหมายเวลาที่เหมาะสม",
      },
      en: {
        status: "draft",
        question: "Does submitting an inquiry book an appointment?",
        answer: "No. Submitting an inquiry does not confirm an appointment. The clinic team will contact you to discuss your inquiry and arrange a suitable time.",
      },
      "zh-CN": {
        status: "draft",
        question: "提交咨询是否等于预约成功？",
        answer: "不是。提交咨询并不代表预约已确认。诊所团队会与您联系，沟通您的需求并安排合适的时间。",
      },
    },
  },
  {
    slug: "services-placeholder",
    published: true,
    placeholder: true,
    sortOrder: 3,
    topic: "services",
    translations: {
      th: { status: "draft", question: "[คำถามเกี่ยวกับบริการ – รอเนื้อหาจากคลินิก]", answer: null },
      en: { status: "draft", question: "[Service question – pending clinic content]", answer: null },
      "zh-CN": { status: "draft", question: "[服务相关问题——待诊所提供内容]", answer: null },
    },
  },
];
