import type { Doctor, DoctorContent, TranslationMeta } from "../types";

// Names and licence numbers exactly as supplied by the clinic owner (Thai).
// They are not transliterated or translated; all other profile fields are
// pending approved content. No individual portrait is available yet (the
// supplied photographs show both doctors together).
const doctorNames = ["รศ.นพ.ชัยณรงค์ โชคสุชาติ ว.23473", "พญ.ธนพร ประทีปชัยกูร ว.51688"] as const;

const content = (name: string): DoctorContent & TranslationMeta => ({
  status: "draft",
  name,
  role: null,
  qualifications: null,
  expertise: null,
  biography: null,
});

export const doctors: Doctor[] = doctorNames.map((name, index) => ({
  slug: `doctor-profile-${index + 1}`,
  published: true,
  placeholder: false,
  sortOrder: index + 1,
  photo: null,
  translations: { th: content(name), en: content(name), "zh-CN": content(name) },
}));

/** Shared specialty lines supplied by the clinic owner (Thai, exact). */
export const doctorSpecialties = [
  "แพทย์เฉพาะทางด้านสูตินรีแพทย์",
  "ด้านรักษาผู้มีบุตรยากและผ่าตัดผ่านกล้อง",
] as const;
