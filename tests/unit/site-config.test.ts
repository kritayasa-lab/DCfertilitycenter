import { describe, expect, it } from "vitest";
import { displayValue, siteConfig, verifiedValue, type ConfigValue } from "@/config/site";

describe("site configuration", () => {
  it("does not present any clinic contact detail as verified yet", () => {
    for (const entry of Object.values(siteConfig.contact)) {
      expect(verifiedValue(entry)).toBeNull();
    }
    for (const entry of Object.values(siteConfig.social)) {
      expect(verifiedValue(entry)).toBeNull();
    }
  });

  it("treats the working clinic name as provisional, not verified", () => {
    expect(siteConfig.name.status).toBe("provisional");
    expect(verifiedValue(siteConfig.name)).toBeNull();
    expect(displayValue(siteConfig.name)).toBe("DC Fertility Center Hatyai");
  });

  it("only exposes values according to their verification status", () => {
    const verified: ConfigValue<string> = { value: "x", status: "verified" };
    const provisional: ConfigValue<string> = { value: "y", status: "provisional" };
    const pending: ConfigValue<string> = { value: "z", status: "pending" };
    expect(verifiedValue(verified)).toBe("x");
    expect(verifiedValue(provisional)).toBeNull();
    expect(displayValue(provisional)).toBe("y");
    expect(displayValue(pending)).toBeNull();
  });
});
