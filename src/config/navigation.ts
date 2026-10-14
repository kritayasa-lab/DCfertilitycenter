/**
 * Public navigation. Labels are keys in the `Nav` / `Legal` message namespaces.
 * The six primary items are fixed by the approved redesign brief. Patient login
 * lives in the utility bar; admin access is never linked from public pages.
 */
export const mainNav = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "packagesPromotions", href: "/packages" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

export type MainNavKey = (typeof mainNav)[number]["key"];

/** Secondary pages kept reachable from the footer. */
export const footerNav = [
  ...mainNav.filter((item) => item.key !== "home"),
  { key: "doctors", href: "/doctors" },
  { key: "facilities", href: "/facilities" },
  { key: "articles", href: "/articles" },
] as const;

export const legalNav = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "medicalDisclaimer", href: "/medical-disclaimer" },
  { key: "cookies", href: "/cookies" },
] as const;

/** Locale-less paths of all static public pages (used by the sitemap). */
export const staticPublicPaths = [
  "",
  ...footerNav.map((item) => item.href),
  ...legalNav.map((item) => item.href),
] as const;

/** Patient portal entry point. Staff access is separate (/<locale>/admin). */
export const patientLoginHref = "/portal/login";
