import { describe, expect, it } from "vitest";
import { defaultLocale, isLocale, locales, routing } from "@/i18n/routing";
import { localeAlternates } from "@/lib/metadata";

describe("locale routing", () => {
  it("supports exactly th, en and zh-CN with th as default", () => {
    expect(locales).toEqual(["th", "en", "zh-CN"]);
    expect(defaultLocale).toBe("th");
    expect(routing.localePrefix).toBe("always");
  });

  it("validates locale values", () => {
    expect(isLocale("th")).toBe(true);
    expect(isLocale("zh-CN")).toBe(true);
    expect(isLocale("zh")).toBe(false);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

describe("localeAlternates", () => {
  it("builds canonical and hreflang links for every locale", () => {
    expect(localeAlternates("en", "/about")).toEqual({
      canonical: "/en/about",
      languages: {
        th: "/th/about",
        en: "/en/about",
        "zh-CN": "/zh-CN/about",
        "x-default": "/th/about",
      },
    });
  });

  it("omits locales without a published translation", () => {
    const result = localeAlternates("en", "/articles/x", ["en"]);
    expect(result?.languages).toEqual({ en: "/en/articles/x" });
  });
});
