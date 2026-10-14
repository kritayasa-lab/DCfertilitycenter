import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on everything except API routes, Next.js internals and files with an
  // extension (static assets, icons, robots.txt, sitemap.xml, ...).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
