"use server";

import { isLocale } from "@/i18n/routing";
import { deliverInquiry } from "./delivery";
import { inquiryFromFormData, validateInquiry } from "./schema";

export type InquiryActionState =
  | { status: "idle" }
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "not_configured" }
  | { status: "delivered" }
  | { status: "failed" };

/**
 * Server action for the inquiry form. Validates on the server, drops honeypot
 * submissions silently, and only reports "delivered" when the configured
 * endpoint confirmed receipt. No inquiry data is logged or stored here.
 */
export async function submitInquiry(
  _previous: InquiryActionState,
  formData: FormData,
): Promise<InquiryActionState> {
  const raw = inquiryFromFormData(formData);
  const result = validateInquiry(raw);
  if (!result.success) {
    if (result.errors.website) return { status: "failed" };
    return { status: "invalid", errors: result.errors };
  }
  const locale = String(formData.get("locale") ?? "");
  const { website: _honeypot, ...inquiry } = result.data;
  return deliverInquiry(inquiry, isLocale(locale) ? locale : "th");
}
