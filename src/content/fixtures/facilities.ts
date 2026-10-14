import type { Facility } from "../types";

// PLACEHOLDERS ONLY. Facilities and equipment must be confirmed by the clinic.
const placeholderFacility = (n: number): Facility => ({
  slug: `facility-${n}`,
  published: true,
  placeholder: true,
  sortOrder: n,
  translations: {
    th: { status: "draft", title: `[สิ่งอำนวยความสะดวก ${n} – รอการยืนยัน]`, description: null },
    en: { status: "draft", title: `[Facility ${n} – pending verification]`, description: null },
    "zh-CN": { status: "draft", title: `[设施 ${n}——待核实]`, description: null },
  },
});

export const facilities: Facility[] = [1, 2, 3].map(placeholderFacility);
