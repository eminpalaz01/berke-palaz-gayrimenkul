import { MetadataRoute } from "next";
import { SITE_URL } from "@/config";

// Bu satır static export için eklenmeli:
export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/search?q=", "/admin/"]
    },
    sitemap: [sitemapUrl]
  };
}