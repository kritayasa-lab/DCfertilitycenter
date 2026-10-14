/** Public navigation. Labels are keys in the `Nav` / `Legal` message namespaces. */
export const mainNav = [
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "doctors", href: "/doctors" },
  { key: "facilities", href: "/facilities" },
  { key: "packages", href: "/packages" },
  { key: "articles", href: "/articles" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

export type MainNavKey = (typeof mainNav)[number]["key"];

export const legalNav = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "medicalDisclaimer", href: "/medical-disclaimer" },
  { key: "cookies", href: "/cookies" },
] as const;

/** Locale-less paths of all static public pages (used by the sitemap). */
export const staticPublicPaths = [
  "",
  ...mainNav.map((item) => item.href),
  ...legalNav.map((item) => item.href),
] as const;

/** Patient portal entry point. Staff access is separate (/<locale>/admin). */
export const patientLoginHref = "/portal/login";
