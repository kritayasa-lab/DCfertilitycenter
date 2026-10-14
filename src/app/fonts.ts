import {
  Cormorant_Garamond,
  Noto_Sans,
  Noto_Sans_Thai,
  Noto_Serif_Thai,
} from "next/font/google";

// Latin body text.
export const notoSans = Noto_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-noto-sans",
  display: "swap",
});

// Thai body text (Latin glyphs fall back to Noto Sans first).
export const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

// Latin display headings.
export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

// Thai display headings.
export const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai"],
  variable: "--font-noto-serif-thai",
  display: "swap",
});

export const fontVariables = [
  notoSans.variable,
  notoSansThai.variable,
  cormorant.variable,
  notoSerifThai.variable,
].join(" ");
