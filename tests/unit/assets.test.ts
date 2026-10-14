import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { clinicAssets } from "@/config/assets";

const publicDir = join(__dirname, "../../public");
const sha256 = (path: string) =>
  createHash("sha256").update(readFileSync(join(publicDir, decodeURI(path)))).digest("hex");

describe("approved clinic assets are unmodified", () => {
  for (const [name, asset] of Object.entries(clinicAssets)) {
    it(`${name}: published copy and original upload match the approved hash`, () => {
      expect(sha256(asset.src)).toBe(asset.sha256);
      expect(sha256(asset.original)).toBe(asset.sha256);
    });
  }
});
