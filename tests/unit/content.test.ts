import { describe, expect, it, vi } from "vitest";

// `next/cache` APIs only work inside the Next.js runtime.
vi.mock("next/cache", () => ({ cacheLife: () => {} }));

import { articles } from "@/content/fixtures/articles";
import { doctors } from "@/content/fixtures/doctors";
import { packages } from "@/content/fixtures/packages";
import { services } from "@/content/fixtures/services";
import { availableLocales, clinicToday, isPackageActive, localize, publishedIn } from "@/content/localize";
import { listArticles } from "@/content/queries";
import type { Package } from "@/content/types";

describe("localize", () => {
  it("returns content only in the requested locale, never another language", () => {
    const article = articles.find((a) => a.slug === "example-article-2")!;
    expect(localize(article, "zh-CN")).toBeNull();
    expect(localize(article, "en")?.title).toMatch(/Example article 2/);
    expect(availableLocales(article)).toEqual(["th", "en"]);
  });

  it("publishedIn excludes unpublished and untranslated records", () => {
    const records = [
      { ...services[0], slug: "a", sortOrder: 2 },
      { ...services[0], slug: "b", sortOrder: 1 },
      { ...services[0], slug: "c", published: false },
    ];
    expect(publishedIn(records, "en").map((r) => r.slug)).toEqual(["b", "a"]);
    expect(publishedIn(articles, "zh-CN").map((a) => a.slug)).not.toContain("example-article-2");
  });
});

describe("package validity", () => {
  const base: Package = { ...packages[0], validFrom: "2026-10-01", validUntil: "2026-10-31" };

  it("is active only inside the inclusive validity window", () => {
    expect(isPackageActive(base, "2026-09-30")).toBe(false);
    expect(isPackageActive(base, "2026-10-01")).toBe(true);
    expect(isPackageActive(base, "2026-10-31")).toBe(true);
    expect(isPackageActive(base, "2026-11-01")).toBe(false);
  });

  it("treats missing bounds as open-ended and respects the published flag", () => {
    expect(isPackageActive({ ...base, validFrom: null, validUntil: null }, "2030-01-01")).toBe(true);
    expect(isPackageActive({ ...base, published: false }, "2026-10-15")).toBe(false);
  });

  it("does not show the expired example promotion", () => {
    const expired = packages.find((p) => p.slug === "expired-example-promotion")!;
    expect(isPackageActive(expired, "2026-10-14")).toBe(false);
  });

  it("computes 'today' in the clinic time zone (UTC+7)", () => {
    // 2026-10-14 18:30 UTC is already 2026-10-15 in Bangkok.
    expect(clinicToday(new Date("2026-10-14T18:30:00Z"))).toBe("2026-10-15");
    expect(clinicToday(new Date("2026-10-14T16:30:00Z"))).toBe("2026-10-14");
  });
});

describe("listArticles", () => {
  it("filters by category and search query", async () => {
    expect((await listArticles("en", { category: "clinic-news" })).map((a) => a.slug)).toEqual([
      "example-clinic-news",
    ]);
    expect(await listArticles("en", { query: "does-not-match-anything" })).toEqual([]);
    expect((await listArticles("en", { query: "ARTICLE 1" })).map((a) => a.slug)).toEqual([
      "example-article-1",
    ]);
  });

  it("sorts newest first", async () => {
    const dates = (await listArticles("en")).map((a) => a.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });
});

describe("placeholder fixtures", () => {
  it("never publish invented prices, photos or credentials", () => {
    for (const p of packages) expect(p.price).toBeNull();
    for (const d of doctors) {
      expect(d.photo).toBeNull();
      for (const t of Object.values(d.translations)) {
        expect(t!.qualifications).toBeNull();
        expect(t!.biography).toBeNull();
      }
    }
  });

  it("marks every placeholder record and every translation as draft", () => {
    for (const record of [...services, ...doctors, ...packages, ...articles]) {
      expect(record.placeholder).toBe(true);
      for (const t of Object.values(record.translations)) expect(t!.status).toBe("draft");
    }
  });

  it("requires medical review for medical articles and none is marked reviewed", () => {
    for (const a of articles) {
      if (a.category !== "clinic-news") expect(a.medicalReview.required).toBe(true);
      expect(a.medicalReview.status).toBe("pending");
    }
  });
});
