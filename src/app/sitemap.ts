import { MetadataRoute } from 'next';
import { SITE_URL, DEFAULT_LOCALE } from '@/config';
import { routes, noLocaleRoutes, RouteConfig } from '@/routes';
import { locales } from '@/i18n';

// Bu satır static export için eklenmeli:
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {  
  // Static export kontrolü
  const isStaticExport = process.env.NEXT_PUBLIC_OUTPUT === 'export';

  // Map canonical routes to localized pathnames with SEO metadata
  const pathnames: Record<string, RouteConfig> = routes;

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate sitemap entries for each route and locale
  noLocaleRoutes.forEach((route) => {
    const routeConfig = pathnames[route];
    
    if (!routeConfig) {
      console.warn(`Route config not found for: ${route}`);
      return;
    }

    locales.forEach((locale) => {
      // Static export için URL yapısını düzenle
      let localizedPath: string;
      
      if (isStaticExport) {
        // Static export'ta her zaman canonical route kullan (örn: /tr/about)
        localizedPath = route;
      } else {
        // Normal build'de localized path kullan (örn: /tr/hakkimizda)
        localizedPath = routeConfig[locale as 'en' | 'tr'] || route;
      }
      
      // Build the full URL with locale prefix
      const fullPath = localizedPath ? `/${locale}${localizedPath}` : `/${locale}`;
      
      // Tüm diller için alternates oluştur (dinamik)
      const languages: Record<string, string> = {};
      
      locales.forEach((altLocale) => {
        const altLocalizedPath = isStaticExport ? 
          route : 
          routeConfig[altLocale as 'en' | 'tr'] || route;
        
        languages[altLocale] = `${SITE_URL}/${altLocale}${altLocalizedPath}`;
      });
      
      // x-default için config'dan gelen default locale'i kullan
      const defaultLocalizedPath = isStaticExport ? 
        route : 
        routeConfig[DEFAULT_LOCALE as 'en' | 'tr'] || route;
      
      languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${defaultLocalizedPath}`;
      
      // Create sitemap entry with SEO metadata
      const sitemapEntry: MetadataRoute.Sitemap[0] = {
        url: `${SITE_URL}${fullPath}`,
        lastModified: new Date(),
        changeFrequency: routeConfig.changefreq,
        priority: routeConfig.priority,
        alternates: {
          languages,
        },
      };

      sitemapEntries.push(sitemapEntry);
    });
  });

  // Sort entries by priority (highest first) and then by URL for consistency
  sitemapEntries.sort((a, b) => {
    if (a.priority !== b.priority) {
      return (b.priority || 0) - (a.priority || 0);
    }
    return a.url.localeCompare(b.url);
  });

  return sitemapEntries;
}
