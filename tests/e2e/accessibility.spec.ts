import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/th",
  "/en",
  "/zh-CN",
  "/en/about",
  "/th/services",
  "/en/services/ivf",
  "/th/success-rates",
  "/zh-CN/doctors",
  "/en/doctors/doctor-profile-1",
  "/en/facilities",
  "/th/packages",
  "/en/packages/example-package",
  "/zh-CN/articles",
  "/en/articles/example-article-1",
  "/zh-CN/articles/example-article-2",
  "/th/faq",
  "/en/contact",
  "/th/contact",
  "/en/privacy",
  "/zh-CN/medical-disclaimer",
];

for (const path of pages) {
  test(`no WCAG 2.2 A/AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const summary = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
    }));
    expect(summary).toEqual([]);
  });
}

test("services dropdown open state has no violations", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop navigation");
  await page.goto("/en");
  await page.getByRole("navigation", { name: "Main" }).getByRole("button", { name: "Services" }).click();
  const results = await new AxeBuilder({ page }).include("header").analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test("mobile menu open state has no violations", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile navigation");
  await page.goto("/en");
  await page.getByRole("button", { name: "Open menu" }).click();
  const results = await new AxeBuilder({ page }).include("header").analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test("no horizontal overflow at mobile width", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile layout");
  for (const path of ["/th", "/zh-CN/contact", "/en/articles", "/th/services/pesa-tese", "/en", "/zh-CN"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
