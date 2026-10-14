import { z } from "zod";
import { locales } from "@/i18n/routing";

/**
 * Inquiry form contract, shared by the client (instant feedback) and the
 * server action (authoritative). Collects only what is needed for a first
 * contact: no diagnosis, medical history, ID numbers or files.
 *
 * Error messages are message keys under `Contact.errors.*`.
 */
export const contactMethods = ["phone", "line", "email"] as const;
export const callbackTimes = ["any", "morning", "afternoon", "evening"] as const;

const phonePattern = /^\+?[0-9][0-9\s-]{7,18}[0-9]$/;

export const inquirySchema = z
  .object({
    name: z.string().trim().min(1, "required").max(100, "tooLong"),
    phone: z
      .string()
      .trim()
      .min(1, "required")
      .refine((v) => phonePattern.test(v) && v.replace(/\D/g, "").length >= 9 && v.replace(/\D/g, "").length <= 15, "phone"),
    email: z
      .string()
      .trim()
      .max(254, "tooLong")
      .refine((v) => v === "" || z.email().safeParse(v).success, "email"),
    preferredLanguage: z.enum(locales, { error: "required" }),
    service: z.string().trim().max(64, "tooLong"),
    contactMethod: z.enum(contactMethods, { error: "required" }),
    callbackTime: z.enum(callbackTimes, { error: "required" }),
    privacyConsent: z.literal("on", { error: "consent" }),
    // Honeypot: must stay empty (hidden from people, filled by naive bots).
    website: z.string().max(0, "spam").optional(),
  })
  .refine((data) => data.contactMethod !== "email" || data.email !== "", {
    path: ["email"],
    message: "emailRequiredForMethod",
  });

export type InquiryInput = z.infer<typeof inquirySchema>;
export type InquiryField = keyof InquiryInput;

/** Reads the form into a plain object (unknown fields are ignored). */
export function inquiryFromFormData(data: FormData): Record<string, string> {
  const fields = [
    "name",
    "phone",
    "email",
    "preferredLanguage",
    "service",
    "contactMethod",
    "callbackTime",
    "privacyConsent",
    "website",
  ];
  return Object.fromEntries(fields.map((f) => [f, String(data.get(f) ?? "")]));
}

/** Validates and returns field-level error keys (first error per field). */
export function validateInquiry(raw: Record<string, string>) {
  const result = inquirySchema.safeParse(raw);
  if (result.success) return { success: true as const, data: result.data, errors: {} };
  const errors: Partial<Record<InquiryField, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as InquiryField;
    errors[field] ??= issue.message;
  }
  return { success: false as const, errors };
}
