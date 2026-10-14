import "server-only";
import type { InquiryInput } from "./schema";

/**
 * Google Apps Script delivery adapter (prepared, NOT connected).
 *
 * Delivery happens only when BOTH are set on the server:
 *   GOOGLE_APPS_SCRIPT_URL      https://script.google.com/macros/s/.../exec
 *   INQUIRY_DELIVERY_ENABLED    "true"
 * Enabling requires the Phase 6 review (anti-spam/rate limiting, privacy
 * notice, retention). Until then every submission reports "not_configured"
 * and nothing leaves the browser (see InquiryForm).
 *
 * Never log inquiry contents.
 */
export type DeliveryResult = { status: "delivered" } | { status: "not_configured" } | { status: "failed" };

const ALLOWED_HOST = "script.google.com";

function endpoint(): URL | null {
  if (process.env.INQUIRY_DELIVERY_ENABLED !== "true") return null;
  const raw = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && url.hostname === ALLOWED_HOST ? url : null;
  } catch {
    return null;
  }
}

export function isInquiryDeliveryConfigured(): boolean {
  return endpoint() !== null;
}

export async function deliverInquiry(
  inquiry: Omit<InquiryInput, "website">,
  submittedLocale: string,
): Promise<DeliveryResult> {
  const url = endpoint();
  if (!url) return { status: "not_configured" };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...inquiry, submittedLocale, submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
      redirect: "follow",
      cache: "no-store",
    });
    if (!response.ok) return { status: "failed" };
    // The script must explicitly confirm receipt; anything else is a failure.
    const body = (await response.json().catch(() => null)) as { ok?: unknown } | null;
    return body?.ok === true ? { status: "delivered" } : { status: "failed" };
  } catch {
    return { status: "failed" };
  }
}
