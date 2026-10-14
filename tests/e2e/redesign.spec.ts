import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const navLabels = {
  th: ["หน้าหลัก", "เกี่ยวกับเรา", "บริการ", "แพ็คเกจและโปรโมชั่น", "คำถามที่พบบ่อย", "ติดต่อเรา"],
  en: ["Home", "About Us", "Services", "Packages & Promotions", "FAQ", "Contact Us"],
  "zh-CN": ["首页", "关于我们", "服务项目", "套餐与优惠", "常见问题", "联系我们"],
} as const;

test.describe("header navigation", () => {
  for (const [locale, labels] of Object.entries(navLabels)) {
    test(`${locale}: exactly the six approved items, in order`, async ({ page, isMobile }) => {
      test.skip(isMobile, "desktop navigation");
      await page.goto(`/${locale}`);
      const items = page.getByRole("navigation", { name: /./ }).first().locator(":scope > ul > li");
      await expect(items).toHaveCount(6);
      const labelsShown = await items.evaluateAll((lis) =>
        lis.map((li) => li.querySelector("a, button")!.textContent!.trim()),
      );
      expect(labelsShown).toEqual([...labels]);
      // No login entries in the primary navigation; admin is never linked.
      await expect(page.getByRole("navigation").first().getByText(/login|เข้าสู่ระบบ|登录/i)).toHaveCount(0);
      await expect(page.locator('a[href*="/admin"]')).toHaveCount(0);
    });
  }
});

test.describe("homepage structure", () => {
  test("sections appear in the approved order and the old section is gone", async ({ page }) => {
    await page.goto("/th");
    const ids = await page
      .locator("main > section")
      .evaluateAll((sections) => sections.map((s) => s.getAttribute("aria-labelledby")));
    expect(ids).toEqual([
      "hero-heading",
      "services-heading",
      "packages-heading",
      "stories-heading",
      "why-heading",
      "qa-heading",
      "contact-heading",
    ]);
    await expect(page.getByText("แนวทางการดูแลของเรา")).toHaveCount(0);
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("hero shows the doctors' names and specialties exactly as supplied", async ({ page }) => {
    for (const locale of ["th", "en", "zh-CN"]) {
      await page.goto(`/${locale}`);
      const hero = page.locator("section[aria-labelledby=hero-heading]");
      for (const text of [
        "รศ.นพ.ชัยณรงค์ โชคสุชาติ ว.23473",
        "พญ.ธนพร ประทีปชัยกูร ว.51688",
        "แพทย์เฉพาะทางด้านสูตินรีแพทย์",
        "ด้านรักษาผู้มีบุตรยากและผ่าตัดผ่านกล้อง",
      ]) {
        await expect(hero.getByText(text, { exact: true })).toBeVisible();
      }
    }
  });

  test("exactly six service cards, linking to existing pages", async ({ page, request }) => {
    await page.goto("/th");
    const cards = page.locator("section[aria-labelledby=services-heading] [data-service-card]");
    await expect(cards).toHaveCount(6);
    await expect(cards.locator("h3")).toHaveText([
      "ให้คำปรึกษา หาสาเหตุภาวะมีบุตรยาก",
      "การฉีดน้ำเชื้ออสุจิเข้าสู่โพรงมดลูก (IUI)",
      "การทำเด็กหลอดแก้ว (IVF)",
      "การเก็บอสุจิโดยตรงจากอัณฑะ (PESA/TESE)",
      "การตรวจคัดเลือกพันธุกรรมก่อนการฝังตัว (PGT)",
      "บริการด้านอื่น ๆ ทางสูติศาสตร์และนรีเวช",
    ]);
    const hrefs = await cards.locator("a").evaluateAll((a) => a.map((x) => x.getAttribute("href")!));
    expect(hrefs).toEqual([
      "/th/services/fertility-consultation",
      "/th/services/iui",
      "/th/services/ivf",
      "/th/services/pesa-tese",
      "/th/services/pgt",
      "/th/services/obstetrics-gynaecology",
    ]);
    for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200);
  });

  test("Q&A shows exactly two article cards and an all-articles link", async ({ page }) => {
    await page.goto("/th");
    const qa = page.locator("section[aria-labelledby=qa-heading]");
    await expect(qa.locator("li article")).toHaveCount(2);
    await expect(qa.getByRole("link", { name: "บทความทั้งหมด" })).toHaveAttribute("href", "/th/articles");
  });

  test("why-choose buttons lead to real pages; success rates is an honest draft", async ({ page }) => {
    await page.goto("/th");
    const why = page.locator("section[aria-labelledby=why-heading]");
    await expect(why.getByText("คำอธิบายคลินิก — รอเนื้อหาที่ได้รับการอนุมัติ")).toBeVisible();
    await why.getByRole("link", { name: "อัตราความสำเร็จ" }).click();
    await expect(page).toHaveURL(/\/th\/success-rates$/);
    await expect(page.getByRole("note").filter({ hasText: "ยังไม่มีการเผยแพร่ข้อมูลอัตราความสำเร็จ" })).toBeVisible();
    await expect(page.getByText(/\d+\s*%/)).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

    await page.goto("/th");
    await page.locator("section[aria-labelledby=why-heading]").getByRole("link", { name: "สิ่งอำนวยความสะดวก" }).click();
    await expect(page).toHaveURL(/\/th\/facilities$/);
  });
});

test.describe("vision words", () => {
  test("hover/focus enlarges a word; click toggles an announced state", async ({ page, isMobile }) => {
    await page.goto("/en");
    const hero = page.locator("section[aria-labelledby=hero-heading]");
    const hope = hero.getByRole("button", { name: "HOPE" });
    // Rendered width relative to layout width (Tailwind v4 uses the CSS `scale` property).
    const scale = () => hope.evaluate((el) => el.getBoundingClientRect().width / (el as HTMLElement).offsetWidth);

    expect(await scale()).toBeCloseTo(1, 2);
    if (!isMobile) {
      await hope.hover();
      await expect.poll(scale).toBeGreaterThan(1.05);
      await page.mouse.move(0, 0);
    }
    await hope.focus();
    await expect.poll(scale).toBeGreaterThan(1.05);

    await expect(hope).toHaveAttribute("aria-pressed", "false");
    await hope.click();
    await expect(hope).toHaveAttribute("aria-pressed", "true");
    await expect(hero.getByText("· Hope")).toBeVisible();
    await hope.click();
    await expect(hope).toHaveAttribute("aria-pressed", "false");
  });

  test("respects prefers-reduced-motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/th");
    const durations = await page.locator("section[aria-labelledby=hero-heading]").evaluate((section) =>
      [...section.querySelectorAll("*")].map((el) => {
        const style = getComputedStyle(el);
        return parseFloat(style.animationDuration) + parseFloat(style.transitionDuration);
      }),
    );
    expect(Math.max(...durations)).toBeLessThan(0.01);
    await context.close();
  });
});

test.describe("carousels", () => {
  for (const id of ["packages-heading", "stories-heading"]) {
    test(`${id}: controls and dots stay in sync`, async ({ page, isMobile }) => {
      await page.goto("/en");
      const carousel = page.locator(`section[aria-labelledby=${id}] section[aria-roledescription=carousel]`);
      await carousel.scrollIntoViewIfNeeded();
      const dots = carousel.getByRole("button", { name: /Go to page/ });
      const prev = carousel.getByRole("button", { name: "Previous" });
      const next = carousel.getByRole("button", { name: "Next" });
      // 4 slots: 2 per view on desktop, 1 on mobile.
      await expect(dots).toHaveCount(isMobile ? 4 : 2);
      await expect(dots.first()).toHaveAttribute("aria-current", "true");
      await expect(prev).toBeDisabled();

      await next.click();
      await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
      await expect(prev).toBeEnabled();

      await dots.first().click();
      await expect(dots.first()).toHaveAttribute("aria-current", "true");

      await carousel.locator("[tabindex='0']").first().focus();
      await page.keyboard.press("ArrowRight");
      await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");

      // Slides are labelled for assistive tech.
      await expect(carousel.locator("[aria-roledescription=slide]").first()).toHaveAttribute("aria-label", "1 of 4");
    });
  }

  test("no fabricated offers, prices or stories", async ({ page }) => {
    await page.goto("/en");
    for (const id of ["packages-heading", "stories-heading"]) {
      const section = page.locator(`section[aria-labelledby=${id}]`);
      await expect(section.getByText("Placeholder").first()).toBeVisible();
      await expect(section.getByText(/฿|THB|\d+\s*%|baht/i)).toHaveCount(0);
      await expect(section.locator("iframe, video")).toHaveCount(0);
    }
  });
});

test.describe("contact section", () => {
  test("map loads only on request and links to the supplied Maps URL", async ({ page }) => {
    const googleRequests: string[] = [];
    page.on("request", (r) => {
      if (/google\.com|googleapis|gstatic/.test(r.url())) googleRequests.push(r.url());
    });
    await page.goto("/th");
    const contact = page.locator("section[aria-labelledby=contact-heading]");
    await contact.scrollIntoViewIfNeeded();
    await expect(contact.locator("iframe")).toHaveCount(0);
    expect(googleRequests).toEqual([]);
    await expect(contact.getByRole("link", { name: /เปิดใน Google Maps/ })).toHaveAttribute(
      "href",
      "https://maps.app.goo.gl/63SiK2gmrM4EtzH49",
    );
    await contact.getByRole("button", { name: "แสดงแผนที่" }).click();
    const src = await contact.locator("iframe").getAttribute("src");
    expect(src).toContain("https://www.google.com/maps?q=");
    expect(decodeURIComponent(src!)).toContain("97/12 ถนนราษฎร์ยินดี อำเภอหาดใหญ่ จังหวัดสงขลา 90110");
  });

  test("validation errors are shown and announced", async ({ page }) => {
    await page.goto("/en/contact");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/Please check \d+ field/)).toBeVisible();
    await expect(page.getByLabel(/Full name/)).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel(/Full name/)).toBeFocused();
    await page.getByLabel(/Phone number/).fill("12");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Please enter a valid phone number (9–15 digits).")).toBeVisible();
  });

  test("a valid inquiry is NOT reported as sent and nothing is transmitted", async ({ page }) => {
    const posts: string[] = [];
    page.on("request", (r) => {
      if (r.method() === "POST") posts.push(r.url());
    });
    await page.goto("/th/contact");
    await expect(page.getByRole("note").filter({ hasText: "ยังไม่ได้เชื่อมต่อระบบ" })).toBeVisible();
    await page.getByLabel(/ชื่อ-นามสกุล/).fill("ผู้ทดสอบ ระบบ");
    await page.getByLabel(/หมายเลขโทรศัพท์/).fill("081-234-5678");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "ส่งข้อความ" }).click();
    const result = page.getByTestId("inquiry-not-connected");
    await expect(result).toBeVisible();
    await expect(result).toContainText("ยังไม่ได้ส่งข้อมูลของคุณ");
    await expect(result).toContainText("097-3470648");
    await expect(page.getByText("คลินิกได้รับข้อความของคุณแล้ว")).toHaveCount(0);
    expect(posts).toEqual([]);
  });
});

test.describe("footer", () => {
  test("shows the supplied clinic details from central config", async ({ page }) => {
    await page.goto("/en");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByText("คลินิกหมอชัยณรงค์", { exact: true })).toBeVisible();
    await expect(footer.getByText("97/12 ถนนราษฎร์ยินดี อำเภอหาดใหญ่ จังหวัดสงขลา 90110")).toBeVisible();
    await expect(footer.locator('a[href="tel:+66973470648"]')).toBeVisible();
    await expect(footer.locator('a[href="tel:+6674225223"]')).toBeVisible();
    await expect(footer.getByRole("link", { name: /Google Maps/ })).toHaveAttribute(
      "href",
      "https://maps.app.goo.gl/63SiK2gmrM4EtzH49",
    );
  });
});

test.describe("original assets", () => {
  const publicDir = join(__dirname, "../../public");
  const hash = (buf: Buffer) => createHash("sha256").update(buf).digest("hex");

  test("logo and photos are served byte-identical to the uploads", async ({ request }) => {
    for (const [served, original] of [
      ["/images/brand/dc-fertility-center-logo.png", "images/Untitled Design - 1.PNG"],
      ["/images/doctors/hero-doctors.jpg", "images/IMG_7370.JPG"],
      ["/images/clinic/why-choose-doctors.jpg", "images/IMG_7371.JPG"],
      ["/images/hero/icsi-hero.png", "images/การปฏิสนธิไข่ด้วยเทคนิค ICSI.png"],
    ]) {
      const response = await request.get(served);
      expect(response.status()).toBe(200);
      expect(hash(await response.body())).toBe(hash(readFileSync(join(publicDir, original))));
    }
  });

  test("header, hero and why-choose render the approved files with preserved aspect ratio", async ({ page }) => {
    await page.goto("/th");
    const logo = page.getByRole("banner").locator("img").first();
    await expect(logo).toHaveAttribute("src", /brand%2Fdc-fertility-center-logo\.png/);
    const fit = await logo.evaluate((img) => getComputedStyle(img).objectFit);
    expect(fit).toBe("contain"); // intrinsic aspect ratio; never stretched or cropped into

    const heroImg = page.locator("section[aria-labelledby=hero-heading] figure img");
    await expect(heroImg).toHaveAttribute("src", /doctors%2Fhero-doctors\.jpg/);
    const doctorsImg = page.locator("section[aria-labelledby=hero-heading] img[src*='hero-doctors']");
    await expect(doctorsImg).toHaveCount(1);
    const why = page.locator("section[aria-labelledby=why-heading] img");
    await why.scrollIntoViewIfNeeded();
    await expect(why).toHaveAttribute("src", /clinic%2Fwhy-choose-doctors\.jpg/);
    for (const img of [logo, heroImg, doctorsImg, why]) {
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
  });
});

test.describe("no dead links", () => {
  test("every internal link on the homepage resolves, in all locales", async ({ page, request }) => {
    const seen = new Set<string>();
    for (const locale of ["th", "en", "zh-CN"]) {
      await page.goto(`/${locale}`);
      const hrefs = await page.locator("a[href^='/']").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
      for (const href of hrefs) {
        const path = href.split("#")[0];
        if (seen.has(path)) continue;
        seen.add(path);
        const response = await request.get(path);
        expect(response.status(), path).toBe(200);
      }
    }
    expect(seen.size).toBeGreaterThan(20);
  });
});
