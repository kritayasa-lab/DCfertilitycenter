import type { MetadataRoute } from "next";
import { allowIndexing, siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    // Pre-launch: keep development and preview sites out of search engines.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
