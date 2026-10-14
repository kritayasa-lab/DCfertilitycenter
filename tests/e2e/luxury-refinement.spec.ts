import { expect, test } from "@playwright/test";

test.describe("logo display", () => {
  test("original logo shows with no background, card, filter or shadow from the site CSS", async ({ page }) => {
    await page.goto("/th");
    const link = page.getByRole("banner").getByRole("link", { name: /หน้าแรก/ }).first();
    const img = link.locator("img");
    await expect(img).toHaveAttribute("src", /brand%2Fdc-fertility-center-logo\.png/);
    const styles = await img.evaluate((el) => {
      const chain: Element[] = [];
      for (let node: Element | null = el; node && node.tagName !== "A"; node = node.parentElement) chain.push(node);
      chain.push(el.closest("a")!);
      return chain.map((node) => {
        const s = getComputedStyle(node);
        return { bg: s.backgroundColor, bgImage: s.backgroundImage, filter: s.filter, blend: s.mixBlendMode, shadow: s.boxShadow };
      });
    });
    for (const s of styles) {
      expect(s.bg).toBe("rgba(0, 0, 0, 0)");
      expect(s.bgImage).toBe("none");
      expect(s.filter).toBe("none");
      expect(s.blend).toBe("normal");
      expect(s.shadow).toBe("none");
    }
    // Intrinsic aspect ratio is preserved (rendered box ratio equals the file's 1593:1609).
    const ratio = await img.evaluate((el) => el.getBoundingClientRect().width / el.getBoundingClientRect().height);
    expect(ratio).toBeCloseTo(1593 / 1609, 2);
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  });

  test("footer no longer wraps the logo in a card", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("contentinfo").locator("img")).toHaveCount(0);
    await expect(page.getByRole("contentinfo").getByText("DC Fertility Center", { exact: true }).first()).toBeVisible();
  });
});

test.describe("champagne-gold CTA", () => {
  test("only primary contact CTAs use the gold treatment", async ({ page, isMobile }) => {
    await page.goto("/en");
    const hero = page.locator("section[aria-labelledby=hero-heading]");
    await expect(hero.getByRole("link", { name: "Contact us" })).toHaveClass(/btn-gold/);
    await expect(hero.getByRole("link", { name: /Our services/ })).not.toHaveClass(/btn-gold/);
    if (!isMobile) {
      await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Contact Us" })).toHaveClass(/btn-gold/);
    }
    // Other sections keep their existing buttons.
    await expect(page.locator("section[aria-labelledby=why-heading] .btn-gold")).toHaveCount(0);
    await expect(page.locator("section[aria-labelledby=contact-heading] .btn-gold")).toHaveCount(0);
  });

  test("hover/focus sweeps a sheen and keyboard focus is clearly visible", async ({ page, isMobile }) => {
    test.skip(isMobile, "hover is a pointer interaction");
    await page.goto("/en");
    const cta = page.locator("section[aria-labelledby=hero-heading]").getByRole("link", { name: "Contact us" });
    const sheen = () => cta.evaluate((el) => new DOMMatrix(getComputedStyle(el, "::after").transform).m41);
    expect(await sheen()).toBeLessThan(0);
    await cta.hover();
    await expect.poll(sheen).toBeGreaterThan(0);
    await page.mouse.move(0, 0);
    await cta.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    const outline = await cta.evaluate((el) => getComputedStyle(el).outlineStyle + " " + getComputedStyle(el).outlineWidth);
    expect(outline).toBe("solid 3px");
    const height = await cta.evaluate((el) => el.getBoundingClientRect().height);
    expect(height).toBeGreaterThanOrEqual(44);
  });

  test("reduced motion removes the sheen", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/en");
    const cta = page.locator("section[aria-labelledby=hero-heading]").getByRole("link", { name: "Contact us" });
    expect(await cta.evaluate((el) => getComputedStyle(el, "::after").display)).toBe("none");
    await context.close();
  });
});

test.describe("header", () => {
  test("logo is a refined 150–180px on desktop and smaller on phones", async ({ page, isMobile }) => {
    await page.goto("/th");
    const img = page.getByRole("banner").getByRole("link", { name: /หน้าแรก/ }).first().locator("img");
    const frame = img.locator("..");
    const width = await frame.evaluate((el) => el.getBoundingClientRect().width);
    if (isMobile) expect(width).toBeLessThanOrEqual(152);
    else {
      expect(width).toBeGreaterThanOrEqual(150);
      expect(width).toBeLessThanOrEqual(180);
    }
  });
});

test.describe("hero composition", () => {
  test("split layout: vision group left, doctors' photo right with credentials beneath", async ({ page, isMobile }) => {
    await page.goto("/en");
    const hero = page.locator("section[aria-labelledby=hero-heading]");
    // The visible clinic-name caption is gone (the name is in the logo); the h1 stays for assistive tech.
    await expect(hero.locator("h1")).toHaveClass(/sr-only/);
    await expect(hero.locator(".rounded-full.blur-3xl, svg circle")).toHaveCount(0);

    const words = hero.getByRole("button", { name: /^(HOPE|TRUST|MIRACLE)$/ });
    await expect(words).toHaveText(["HOPE", "TRUST", "MIRACLE"]);
    const [hope, trust, miracle] = await Promise.all((await words.all()).map(async (w) => (await w.boundingBox())!));
    // MIRACLE is the strongest statement, below HOPE/TRUST and centred under them.
    expect(miracle.height).toBeGreaterThan(hope.height * 1.6);
    expect(miracle.y).toBeGreaterThan(hope.y);
    const groupCentre = (hope.x + trust.x + trust.width) / 2;
    expect(Math.abs(miracle.x + miracle.width / 2 - groupCentre)).toBeLessThan(40);

    const photo = (await hero.locator("figure img").boundingBox())!;
    const credentials = (await hero.getByText("รศ.นพ.ชัยณรงค์ โชคสุชาติ ว.23473", { exact: true }).boundingBox())!;
    expect(credentials.y).toBeGreaterThan(photo.y + photo.height); // directly below the photo

    if (!isMobile) {
      // All three words are inside the initial desktop viewport (1280×720).
      const viewport = page.viewportSize()!;
      for (const box of [hope, trust, miracle]) expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
      // Words on the left; MIRACLE overlaps the photo's left edge slightly, below the faces.
      expect(hope.x).toBeLessThan(photo.x);
      expect(miracle.x + miracle.width).toBeGreaterThan(photo.x);
      expect(miracle.x + miracle.width - photo.x).toBeLessThan(photo.width * 0.25);
      expect(miracle.y).toBeGreaterThan(photo.y + photo.height * 0.4);
    } else {
      // Stacked: words, then photo, then credentials; no overlap on phones.
      expect(photo.y).toBeGreaterThan(miracle.y + miracle.height);
    }
  });

  test("registration numbers stay on the same line as the surname", async ({ page }) => {
    for (const width of [390, 820, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/th");
      const pairs = page.locator("section[aria-labelledby=hero-heading] li span.whitespace-nowrap");
      await expect(pairs).toHaveText(["โชคสุชาติ ว.23473", "ประทีปชัยกูร ว.51688"]);
      for (const pair of await pairs.all()) {
        const lines = await pair.evaluate((el) => el.getClientRects().length);
        expect(lines, `width ${width}`).toBe(1);
      }
    }
  });
});

test("Thai text is never letter-spaced, even inside tracked labels", async ({ page }) => {
  await page.goto("/th");
  const heading = page.getByRole("contentinfo").locator("h2").first();
  expect(await heading.evaluate((el) => getComputedStyle(el).letterSpacing)).toMatch(/^(normal|0px)$/);
  await page.goto("/en");
  expect(await heading.evaluate((el) => getComputedStyle(el).letterSpacing)).not.toMatch(/^(normal|0px)$/);
});

test.describe("services arc carousel", () => {
  const activeTitle = (page: import("@playwright/test").Page) =>
    page.locator("section[aria-labelledby=services-heading] [data-service-card][aria-current=true] h3");

  test("arrows move the active card along the arc and wrap around", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    const section = page.locator("section[aria-labelledby=services-heading]");
    await section.scrollIntoViewIfNeeded();
    await expect(activeTitle(page)).toHaveText("Fertility consultation and assessment");
    await expect(section.locator("[data-service-card][aria-current=true]")).toContainText("Showing");

    await section.getByRole("button", { name: "Next service" }).click();
    await expect(activeTitle(page)).toHaveText("Intrauterine insemination (IUI)");
    await section.getByRole("button", { name: "Previous service" }).click();
    await section.getByRole("button", { name: "Previous service" }).click();
    await expect(activeTitle(page)).toHaveText("Other obstetric and gynaecological services");
  });

  test("keyboard: arrow keys rotate; tabbing to a card brings it to the centre", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    const section = page.locator("section[aria-labelledby=services-heading]");
    const stage = section.getByRole("group", { name: /arrows/ });
    await stage.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(activeTitle(page)).toHaveText("In vitro fertilisation (IVF)");
    await page.keyboard.press("ArrowLeft");
    await expect(activeTitle(page)).toHaveText("Intrauterine insemination (IUI)");

    await section.getByRole("link", { name: "View details: Preimplantation genetic testing (PGT)" }).focus();
    await expect(activeTitle(page)).toHaveText("Preimplantation genetic testing (PGT)");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/en\/services\/pgt$/);
  });

  test("pagination dots match the Packages carousel and jump to a service", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    const section = page.locator("section[aria-labelledby=services-heading]");
    const dots = section.getByRole("button", { name: /Go to service/ });
    await expect(dots).toHaveCount(6);
    await expect(dots.first()).toHaveAttribute("aria-current", "true");
    await dots.nth(3).click();
    await expect(activeTitle(page)).toHaveText("Surgical sperm retrieval (PESA/TESE)");
    await expect(dots.nth(3)).toHaveAttribute("aria-current", "true");
    await section.getByRole("button", { name: "Next service" }).click();
    await expect(dots.nth(4)).toHaveAttribute("aria-current", "true");
  });

  test("clicking a side card centres it first instead of navigating", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    const section = page.locator("section[aria-labelledby=services-heading]");
    await section.scrollIntoViewIfNeeded();
    const iui = section.locator("[data-service-card]").nth(1);
    await iui.locator("h3").click();
    await expect(activeTitle(page)).toHaveText("Intrauterine insemination (IUI)");
    await expect(page).toHaveURL(/\/en$/);
    await iui.getByRole("link").click();
    await expect(page).toHaveURL(/\/en\/services\/iui$/);
  });

  test("drag/swipe moves the carousel", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    const section = page.locator("section[aria-labelledby=services-heading]");
    await section.scrollIntoViewIfNeeded();
    const box = (await section.getByRole("group", { name: /arrows/ }).boundingBox())!;
    const y = box.y + 60;
    await page.mouse.move(box.x + box.width / 2 + 80, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 - 40, y, { steps: 6 });
    await page.mouse.up();
    await expect(activeTitle(page)).toHaveText("Intrauterine insemination (IUI)");
  });

  test("active card is distinguished by more than colour", async ({ page }) => {
    await page.goto("/th");
    const cards = page.locator("section[aria-labelledby=services-heading] [data-service-card]");
    const active = cards.nth(0);
    const side = cards.nth(1);
    await expect(active).toHaveAttribute("aria-current", "true");
    await expect(active).toContainText("กำลังแสดง");
    await expect(side).not.toContainText("กำลังแสดง");
    const scale = (el: import("@playwright/test").Locator) => el.evaluate((n) => new DOMMatrix(getComputedStyle(n).transform).a);
    expect(await scale(active)).toBeGreaterThan(await scale(side));
  });

  test("no horizontal page overflow at tablet and phone widths", async ({ page }) => {
    for (const width of [390, 820, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/th");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `width ${width}`).toBeLessThanOrEqual(0);
    }
  });
});
