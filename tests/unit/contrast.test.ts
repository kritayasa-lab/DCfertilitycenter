import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Reads the design tokens from globals.css and checks WCAG 2.2 contrast.
const css = readFileSync(join(__dirname, "../../src/app/globals.css"), "utf8");
const raw = Object.fromEntries([...css.matchAll(/--color-([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));

function resolve(name: string): string {
  let value = raw[name];
  for (let i = 0; i < 5 && value?.startsWith("var("); i++) value = raw[value.slice(12, -1)];
  if (!value || !/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`Unresolvable token ${name}: ${value}`);
  return value;
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: string, b: string) {
  const [x, y] = [luminance(resolve(a)), luminance(resolve(b))].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

describe("Olive Garden Feast palette is present", () => {
  it.each([
    ["olive-600", "#606c38"],
    ["forest-900", "#283618"],
    ["cornsilk-100", "#fefae0"],
    ["caramel-400", "#dda15e"],
    ["copper-500", "#bc6c25"],
  ])("%s = %s", (token, hex) => expect(resolve(token).toLowerCase()).toBe(hex));
});

describe("text colour pairs meet WCAG AA (4.5:1)", () => {
  it.each([
    ["foreground", "background"],
    ["foreground", "surface-muted"],
    ["foreground", "surface-accent"],
    ["muted", "background"],
    ["muted", "surface-muted"],
    ["muted", "surface"],
    ["on-primary", "primary"],
    ["on-primary", "primary-hover"],
    ["primary", "background"],
    ["primary", "surface"],
    ["primary", "primary-soft"],
    ["accent-strong", "background"],
    ["accent-strong", "accent-soft"],
    ["on-inverse", "surface-inverse"],
    ["accent", "surface-inverse"],
    ["warning", "warning-soft"],
    ["danger", "danger-soft"],
    ["danger", "surface"],
    ["success", "success-soft"],
  ])("%s on %s", (fg, bg) => expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5));
});

describe("large text and non-text UI meet 3:1", () => {
  it.each([
    ["accent-vivid", "background"],
    ["accent-vivid", "surface-muted"],
    ["focus", "background"],
    ["focus", "surface-muted"],
  ])("%s on %s", (fg, bg) => expect(ratio(fg, bg)).toBeGreaterThanOrEqual(3));
});
