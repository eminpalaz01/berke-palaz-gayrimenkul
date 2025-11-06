export interface RouteConfig {
  en: string;
  tr: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const routes: Record<string, RouteConfig> = {
      // Top-level routes
      '': { 
        en: '', 
        tr: '', 
        changefreq: 'weekly', 
        priority: 1.0 
      },
      '/about': { 
        en: '/about', 
        tr: '/hakkimizda', 
        changefreq: 'monthly', 
        priority: 0.8 
      },
      '/contact': { 
        en: '/contact', 
        tr: '/iletisim', 
        changefreq: 'monthly', 
        priority: 0.8 
      },
      '/blog': { 
        en: '/blog', 
        tr: '/blog', 
        changefreq: 'weekly', 
        priority: 0.7 
      },
      '/listings': { 
        en: '/listings', 
        tr: '/ilanlar', 
        changefreq: 'daily', 
        priority: 0.9 
      },

      // Legal pages
      '/privacy-policy': { 
        en: '/privacy-policy', 
        tr: '/gizlilik-politikasi', 
        changefreq: 'yearly', 
        priority: 0.3 
      },
      '/terms-of-service': { 
        en: '/terms-of-service', 
        tr: '/kullanim-kosullari', 
        changefreq: 'yearly', 
        priority: 0.3 
      },
      '/cookie-policy': { 
        en: '/cookie-policy', 
        tr: '/cerez-politikasi', 
        changefreq: 'yearly', 
        priority: 0.3 
      }
};

// Pathnames for next-intl middleware (without SEO metadata)
export const pathnames: Record<string, { en: string; tr: string }> = {
  '': { en: '', tr: '' },
  '/about': { en: '/about', tr: '/hakkimizda' },
  '/contact': { en: '/contact', tr: '/iletisim' },
  '/blog': { en: '/blog', tr: '/blog' },
  '/listings': { en: '/listings', tr: '/ilanlar' },
  '/privacy-policy': { en: '/privacy-policy', tr: '/gizlilik-politikasi' },
  '/terms-of-service': { en: '/terms-of-service', tr: '/kullanim-kosullari' },
  '/cookie-policy': { en: '/cookie-policy', tr: '/cerez-politikasi' }
};

export const noLocaleRoutes = [
    '', // Home page
    '/about',
    '/contact',
    '/blog',
    '/listings',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy',
  ];

// Normalize path to English canonical form
export function normalizePathToEnglish(path: string): string {
  // Remove locale prefix (tr/en)
  const withoutLocale = path.replace(/^\/(tr|en)/, '')
  
  // Remove trailing slash
  const withoutTrailingSlash = withoutLocale.replace(/\/$/, '') || '/'
  
  // Check if path exists in pathnames mapping
  const pathEntry = Object.entries(pathnames).find(([_, locales]) => 
    locales.tr === withoutTrailingSlash || locales.en === withoutTrailingSlash
  )
  
  // Return English version if found, otherwise return the path as-is
  return pathEntry ? pathEntry[1].en : withoutTrailingSlash
}
