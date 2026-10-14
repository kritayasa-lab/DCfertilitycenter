import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { deliverInquiry, isInquiryDeliveryConfigured } from "@/lib/inquiry/delivery";
import { validateInquiry } from "@/lib/inquiry/schema";

const valid = {
  name: "Test Person",
  phone: "+66 81 234 5678",
  email: "",
  preferredLanguage: "th",
  service: "",
  contactMethod: "phone",
  callbackTime: "any",
  privacyConsent: "on",
  website: "",
};

describe("inquiry validation", () => {
  it("accepts the minimum valid inquiry", () => {
    expect(validateInquiry(valid).success).toBe(true);
  });

  it("returns field-level error keys", () => {
    const result = validateInquiry({ ...valid, name: " ", phone: "12", privacyConsent: "" });
    expect(result.success).toBe(false);
    expect(result.errors).toMatchObject({ name: "required", phone: "phone", privacyConsent: "consent" });
  });

  it("requires an email when email is the chosen contact method", () => {
    expect(validateInquiry({ ...valid, contactMethod: "email" }).errors).toMatchObject({ email: "emailRequiredForMethod" });
    expect(validateInquiry({ ...valid, email: "not-an-email" }).errors).toMatchObject({ email: "email" });
  });

  it("flags honeypot submissions", () => {
    expect(validateInquiry({ ...valid, website: "spam" }).errors).toMatchObject({ website: "spam" });
  });
});

describe("Google Apps Script delivery adapter", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("is not configured by default and never reports delivery", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect(isInquiryDeliveryConfigured()).toBe(false);
    const { website: _w, ...inquiry } = validateInquiry(valid).data!;
    await expect(deliverInquiry(inquiry, "th")).resolves.toEqual({ status: "not_configured" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("stays disconnected unless explicitly enabled, and only allows script.google.com over HTTPS", () => {
    vi.stubEnv("GOOGLE_APPS_SCRIPT_URL", "https://script.google.com/macros/s/abc/exec");
    expect(isInquiryDeliveryConfigured()).toBe(false);
    vi.stubEnv("INQUIRY_DELIVERY_ENABLED", "true");
    expect(isInquiryDeliveryConfigured()).toBe(true);
    vi.stubEnv("GOOGLE_APPS_SCRIPT_URL", "https://evil.example/exec");
    expect(isInquiryDeliveryConfigured()).toBe(false);
    vi.stubEnv("GOOGLE_APPS_SCRIPT_URL", "http://script.google.com/macros/s/abc/exec");
    expect(isInquiryDeliveryConfigured()).toBe(false);
  });

  it("reports delivered only when the endpoint explicitly confirms", async () => {
    vi.stubEnv("GOOGLE_APPS_SCRIPT_URL", "https://script.google.com/macros/s/abc/exec");
    vi.stubEnv("INQUIRY_DELIVERY_ENABLED", "true");
    const { website: _w, ...inquiry } = validateInquiry(valid).data!;

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }))));
    await expect(deliverInquiry(inquiry, "th")).resolves.toEqual({ status: "delivered" });

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>login</html>")));
    await expect(deliverInquiry(inquiry, "th")).resolves.toEqual({ status: "failed" });

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 500 })));
    await expect(deliverInquiry(inquiry, "th")).resolves.toEqual({ status: "failed" });

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    await expect(deliverInquiry(inquiry, "th")).resolves.toEqual({ status: "failed" });
  });
});
