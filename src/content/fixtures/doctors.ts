import type { Doctor } from "../types";

// PLACEHOLDERS ONLY. No names, credentials or registration numbers are
// invented. Replace with verified profiles and authorized photographs.
const placeholderDoctor = (n: number): Doctor => ({
  slug: `doctor-profile-${n}`,
  published: true,
  placeholder: true,
  sortOrder: n,
  photo: null,
  translations: {
    th: {
      status: "draft",
      name: `[ข้อมูลแพทย์ท่านที่ ${n} – รอการยืนยัน]`,
      role: null,
      qualifications: null,
      expertise: null,
      biography: null,
    },
    en: {
      status: "draft",
      name: `[Doctor Profile ${n} – Pending Verification]`,
      role: null,
      qualifications: null,
      expertise: null,
      biography: null,
    },
    "zh-CN": {
      status: "draft",
      name: `[医生简介 ${n}——待核实]`,
      role: null,
      qualifications: null,
      expertise: null,
      biography: null,
    },
  },
});

export const doctors: Doctor[] = [1, 2].map(placeholderDoctor);
