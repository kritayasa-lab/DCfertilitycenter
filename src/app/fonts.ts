import { Noto_Sans_Thai } from "next/font/google";

/*
 * The site uses a system-first font stack (see `--font-sans` in globals.css).
 * Noto Sans Thai (SIL OFL) is self-hosted as the Thai fallback for devices
 * without a Thai UI font. No proprietary system fonts are bundled.
 */
export const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-sans-thai",
  display: "swap",
  // Latin text uses the system font; only preload Thai glyphs where needed.
  preload: true,
});

export const fontVariables = notoSansThai.variable;
