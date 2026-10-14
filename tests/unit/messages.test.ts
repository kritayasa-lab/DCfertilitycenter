import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import th from "../../messages/th.json";
import zhCN from "../../messages/zh-CN.json";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") acc[path] = value;
    else Object.assign(acc, flatten(value, path));
    return acc;
  }, {});
}

const catalogs = { th, en, "zh-CN": zhCN } as Record<string, Tree>;
const reference = Object.keys(flatten(catalogs.en)).sort();

describe("message catalogs", () => {
  it.each(Object.keys(catalogs))("%s has exactly the same keys as en", (locale) => {
    expect(Object.keys(flatten(catalogs[locale])).sort()).toEqual(reference);
  });

  it.each(Object.keys(catalogs))("%s has no empty strings", (locale) => {
    const empty = Object.entries(flatten(catalogs[locale])).filter(
      ([, value]) => value.trim() === "",
    );
    expect(empty).toEqual([]);
  });

  it("Thai catalog contains Thai script and Chinese catalog contains Han script", () => {
    const thText = Object.values(flatten(catalogs.th)).join(" ");
    const zhText = Object.values(flatten(catalogs["zh-CN"])).join(" ");
    expect(thText).toMatch(/\p{Script=Thai}/u);
    expect(zhText).toMatch(/\p{Script=Han}/u);
  });
});
