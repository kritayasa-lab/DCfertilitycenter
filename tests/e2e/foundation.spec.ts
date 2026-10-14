import { expect, test } from "@playwright/test";

const locales = [
  { locale: "th", heading: /DC Fertility Center/ },
  { locale: "en", heading: /DC Fertility Center/ },
  { locale: "zh-CN", heading: /DC Fertility Center/ },
] as const;

test("root redirects to the Thai default locale", async ({ page }) => {
  const response = await page.goto("/");
  expect(new URL(page.url()).pathname).toBe("/th");
  expect(response?.status()).toBe(200);
});

for (const { locale, heading } of locales) {
  test(`/${locale} renders in its own language`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    // Pre-launch: the page must not be indexable.
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator(`link[rel="alternate"][hreflang="${locale}"]`)).toHaveCount(1);
  });
}

test("language switcher keeps the visitor on the equivalent page", async ({ page }) => {
  await page.goto("/en/styleguide");
  // The switcher is a client component: wait for hydration before using it.
  await page.waitForLoadState("networkidle");
  await page.getByRole("main").getByRole("combobox", { name: "Language" }).selectOption("zh-CN");
  await expect(page).toHaveURL(/\/zh-CN\/styleguide$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");

  await page.waitForLoadState("networkidle");
  await page.getByRole("main").getByRole("combobox", { name: "语言" }).selectOption("th");
  await expect(page).toHaveURL(/\/th\/styleguide$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
});

test("locale is preserved when following internal links", async ({ page }) => {
  await page.goto("/zh-CN");
  await page.getByRole("main").getByRole("link", { name: "服务项目", exact: true }).first().click();
  await expect(page).toHaveURL(/\/zh-CN\/services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
});

test("unknown paths under a locale show the localized 404", async ({ page }) => {
  const response = await page.goto("/en/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
});

test("unsupplied clinic details are labelled, not presented as fact", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("note").first()).toContainText("has not been verified");
  const footer = page.getByRole("contentinfo");
  for (const network of ["Instagram", "TikTok", "Facebook"]) {
    await expect(footer.getByText(network)).toBeVisible();
    await expect(footer.getByRole("link", { name: network })).toHaveCount(0);
  }
  await expect(footer.getByText("official link pending").first()).toBeVisible();
});

test("skip link is the first focusable element and targets main", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard navigation is checked on desktop");
  await page.goto("/en");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute("href", "#main-content");
  await expect(page.locator("main#main-content")).toHaveCount(1);
});

test("security headers are present", async ({ request }) => {
  const response = await request.get("/th");
  const headers = response.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("robots.txt disallows crawling before launch", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toMatch(/Disallow: \//);
});
