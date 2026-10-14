import { describe, expect, it } from "vitest";
import {
  clinicName,
  displayValue,
  siteConfig,
  telHref,
  verifiedValue,
  type ConfigValue,
} from "@/config/site";

describe("site configuration", () => {
  it("publishes only the contact details supplied by the clinic", () => {
    expect(verifiedValue(siteConfig.contact.phones)).toEqual(["097-3470648", "074-225-223"]);
    expect(verifiedValue(siteConfig.contact.address)).toBe(
      "97/12 ถนนราษฎร์ยินดี อำเภอหาดใหญ่ จังหวัดสงขลา 90110",
    );
    expect(verifiedValue(siteConfig.contact.mapUrl)).toBe("https://maps.app.goo.gl/63SiK2gmrM4EtzH49");
    // Not supplied: must stay unpublished, never invented.
    expect(verifiedValue(siteConfig.contact.email)).toBeNull();
    expect(verifiedValue(siteConfig.contact.lineId)).toBeNull();
    expect(verifiedValue(siteConfig.contact.openingHours)).toBeNull();
    for (const entry of Object.values(siteConfig.social)) {
      expect(entry.status).toBe("pending");
      expect(verifiedValue(entry)).toBeNull();
    }
  });

  it("uses the provisional per-locale clinic names", () => {
    expect(siteConfig.name.status).toBe("provisional");
    expect(clinicName("th")).toBe("คลินิกหมอชัยณรงค์");
    expect(clinicName("en")).toBe("DC Fertility Center");
    expect(clinicName("zh-CN")).toBe("DC Fertility Center");
  });

  it("only exposes values according to their verification status", () => {
    const verified: ConfigValue<string> = { value: "x", status: "verified" };
    const provided: ConfigValue<string> = { value: "p", status: "provided" };
    const provisional: ConfigValue<string> = { value: "y", status: "provisional" };
    const pending: ConfigValue<string> = { value: "z", status: "pending" };
    expect(verifiedValue(verified)).toBe("x");
    expect(verifiedValue(provided)).toBe("p");
    expect(verifiedValue(provisional)).toBeNull();
    expect(displayValue(provisional)).toBe("y");
    expect(displayValue(pending)).toBeNull();
  });

  it("builds international tel: links from Thai display numbers", () => {
    expect(telHref("097-3470648")).toBe("tel:+66973470648");
    expect(telHref("074-225-223")).toBe("tel:+6674225223");
  });
});
