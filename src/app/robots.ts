import { MetadataRoute } from "next";
import { SITE_URL } from "@/config";
import { routes } from "@/routes";
import { locales } from "@/i18n";

// Bu satır static export için eklenmeli:
// export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;

  // Dinamik olarak excludeFromRobots flag'i olan route'ları topla
  const excludedPaths: string[] = [];
  
  Object.entries(routes).forEach(([_, config]) => {
    if (config.excludeFromRobots) {
      // Her locale için path'leri ekle
      locales.forEach((locale) => {
        const localizedPath = config[locale as 'en' | 'tr'];
        if (localizedPath) {
          excludedPaths.push(`/${locale}${localizedPath}`);
        }
      });
    }
  });

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [
        "/search?q=",
        "/admin/",
        ...excludedPaths
      ]
    },
    sitemap: [sitemapUrl]
  };
}
