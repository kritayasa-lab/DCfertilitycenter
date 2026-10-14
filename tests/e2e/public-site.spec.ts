import { expect, test, type Page } from "@playwright/test";

/** Uses the header language switcher (inside the menu on mobile). */
async function switchLanguage(page: Page, isMobile: boolean, locale: string) {
  const header = page.getByRole("banner");
  if (isMobile) await header.getByRole("button", { expanded: false }).click();
  await header.getByRole("combobox").first().selectOption(locale);
}

const locales = ["th", "en", "zh-CN"] as const;
const staticPaths = [
  "",
  "/about",
  "/services",
  "/services/example-service-1",
  "/doctors",
  "/doctors/doctor-profile-1",
  "/facilities",
  "/packages",
  "/packages/example-package",
  "/articles",
  "/articles/example-article-1",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/medical-disclaimer",
  "/cookies",
  "/portal/login",
];

test.describe("every public route renders in every locale", () => {
  for (const locale of locales) {
    test(`${locale}`, async ({ request }) => {
      for (const path of staticPaths) {
        const response = await request.get(`/${locale}${path}`);
        expect(response.status(), `/${locale}${path}`).toBe(200);
        const html = await response.text();
        expect(html, `/${locale}${path} lang`).toContain(`<html lang="${locale}"`);
        expect(html, `/${locale}${path} h1`).toMatch(/<h1[\s>]/);
      }
    });
  }
});

test.describe("header navigation", () => {
  test("desktop nav links work and mark the current section", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop navigation");
    await page.goto("/en");
    const nav = page.getByRole("navigation", { name: "Main" });
    await nav.getByRole("link", { name: "Doctors" }).click();
    await expect(page).toHaveURL(/\/en\/doctors$/);
    await expect(nav.getByRole("link", { name: "Doctors" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Doctors and specialists");
  });

  test("services dropdown opens, is keyboard operable and closes on Escape", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop navigation");
    await page.goto("/en");
    const nav = page.getByRole("navigation", { name: "Main" });
    const toggle = nav.getByRole("button", { name: "Services" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(nav.getByRole("link", { name: "All services" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();

    await toggle.click();
    await nav.getByRole("link", { name: /Service 2/ }).click();
    await expect(page).toHaveURL(/\/en\/services\/example-service-2$/);
  });

  test("mobile menu opens, navigates and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile navigation");
    await page.goto("/th");
    const menuButton = page.getByRole("button", { name: "เปิดเมนู" });
    await menuButton.click();
    await expect(page.getByRole("button", { name: "ปิดเมนู" })).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("link", { name: "คำถามที่พบบ่อย" }).first().click();
    await expect(page).toHaveURL(/\/th\/faq$/);
    await expect(page.getByRole("button", { name: "เปิดเมนู" })).toHaveAttribute("aria-expanded", "false");
  });

  test("patient login is separate from staff access and clearly unavailable", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop header link");
    await page.goto("/en");
    await page.getByRole("banner").getByRole("link", { name: "Patient login" }).click();
    await expect(page).toHaveURL(/\/en\/portal\/login$/);
    await expect(page.getByRole("note").filter({ hasText: "not available yet" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});

test.describe("localization", () => {
  test("switching language on a detail page keeps the equivalent page", async ({ page, isMobile }) => {
    await page.goto("/en/services/example-service-3");
    await switchLanguage(page, isMobile, "th");
    await expect(page).toHaveURL(/\/th\/services\/example-service-3$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("บริการที่ 3");
  });

  test("missing translations show an explicit state, not another language", async ({ page }) => {
    await page.goto("/zh-CN/articles/example-article-2");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("本页面暂无简体中文版本");
    await expect(page.getByText("Example article 2")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await page.getByRole("main").getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/articles\/example-article-2$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Example article 2");
  });

  test("untranslated articles are excluded from that locale's listing and hreflang", async ({ page, request }) => {
    await page.goto("/zh-CN/articles");
    await expect(page.getByRole("main").getByRole("link", { name: /示例文章 1/ })).toBeVisible();
    await expect(page.locator('a[href$="/articles/example-article-2"]')).toHaveCount(0);

    const html = await (await request.get("/en/articles/example-article-2")).text();
    const alternates = [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)"/g)].map((m) => m[1]);
    expect(alternates.sort()).toEqual(["en", "th", "x-default"]);
  });

  test("detail page metadata is localized", async ({ page }) => {
    await page.goto("/th/doctors/doctor-profile-2");
    await expect(page).toHaveTitle(/ข้อมูลแพทย์ท่านที่ 2/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/th\/doctors\/doctor-profile-2$/);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "th_TH");
  });
});

test.describe("content rules", () => {
  test("expired promotions are not shown or reachable", async ({ page, request }) => {
    await page.goto("/en/packages");
    await expect(page.getByText("Expired promotion")).toHaveCount(0);
    await expect(page.getByRole("main").getByRole("link", { name: /Example package/ })).toBeVisible();
    expect((await request.get("/en/packages/expired-example-promotion")).status()).toBe(404);
  });

  test("no price is invented for packages", async ({ page }) => {
    await page.goto("/en/packages/example-package");
    await expect(page.getByText("Price not published")).toBeVisible();
    await expect(page.getByText(/฿|THB/)).toHaveCount(0);
  });

  test("placeholders are labelled as such", async ({ page }) => {
    await page.goto("/en/services/example-service-1");
    await expect(page.getByRole("main").getByText("Placeholder").first()).toBeVisible();
    await expect(page.getByText("Approved content pending").first()).toBeVisible();
    await expect(page.getByRole("note").filter({ hasText: "does not replace individual medical advice" })).toBeVisible();
  });

  test("legal pages are marked as drafts", async ({ page }) => {
    for (const path of ["/privacy", "/terms", "/medical-disclaimer", "/cookies"]) {
      await page.goto(`/en${path}`);
      await expect(page.getByRole("note").filter({ hasText: "Draft template" })).toBeVisible();
    }
  });

  test("article search and category filter work without JavaScript state", async ({ page }) => {
    await page.goto("/en/articles?category=clinic-news");
    await expect(page.getByRole("status")).toHaveText("1 article");
    await page.goto("/en/articles?q=zzz-no-match");
    await expect(page.getByText("No articles match your search.")).toBeVisible();

    await page.goto("/en/articles");
    await page.getByLabel("Search articles").fill("article 1");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/q=article\+1/);
    await expect(page.getByRole("status")).toHaveText("1 article");
  });
});

test.describe("contact form is not connected", () => {
  test("form is disabled, clearly labelled and never implies a booking", async ({ page }) => {
    await page.goto("/en/contact");
    await expect(page.getByRole("note").filter({ hasText: "not connected yet" })).toBeVisible();
    await expect(page.getByText("will not confirm an appointment")).toBeVisible();
    await expect(page.getByLabel("Full name")).toBeDisabled();
    await expect(page.getByLabel("Phone number")).toBeDisabled();
    await expect(page.getByRole("button", { name: "Sending is not available yet" })).toBeDisabled();
    // No action/endpoint is wired up.
    await expect(page.locator("main form")).not.toHaveAttribute("action", /.+/);
    // Data minimisation: no medical free-text or file upload fields.
    await expect(page.locator('main form textarea, main form input[type="file"]')).toHaveCount(0);
  });

  test("contact details are placeholders, not invented values", async ({ page }) => {
    await page.goto("/en/contact");
    await expect(page.locator('a[href^="tel:"], a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.getByRole("main").getByText("Pending verification").first()).toBeVisible();
  });
});

test.describe("SEO", () => {
  test("sitemap lists localized public pages and excludes unavailable content", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const locale of locales) {
      expect(xml).toContain(`/${locale}/about</loc>`);
      expect(xml).toContain(`/${locale}/services/example-service-1</loc>`);
    }
    expect(xml).not.toContain("expired-example-promotion");
    expect(xml).not.toContain("/zh-CN/articles/example-article-2<");
    expect(xml).not.toContain("styleguide");
    expect(xml).not.toContain("portal");
  });

  test("each page has exactly one h1 and a localized description", async ({ page }) => {
    await page.goto("/th/about");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /คลินิก/);
  });
});
