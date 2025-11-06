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
      '/projects': { 
        en: '/projects', 
        tr: '/projeler', 
        changefreq: 'weekly', 
        priority: 0.9 
      },
      '/contact': { 
        en: '/contact', 
        tr: '/iletisim', 
        changefreq: 'monthly', 
        priority: 0.7 
      },
      '/concrete-plant': { 
        en: '/concrete-plant', 
        tr: '/beton-santrali', 
        changefreq: 'monthly', 
        priority: 0.8 
      },

      // Nested routes for Services
      '/services/ready-mix-concrete': { 
        en: '/services/ready-mix-concrete', 
        tr: '/hizmetler/hazir-beton', 
        changefreq: 'monthly', 
        priority: 0.9 
      },
      '/services/construction': { 
        en: '/services/construction', 
        tr: '/hizmetler/insaat', 
        changefreq: 'monthly', 
        priority: 0.9 
      },
      '/services/quarry': { 
        en: '/services/quarry', 
        tr: '/hizmetler/tas-ocagi', 
        changefreq: 'monthly', 
        priority: 0.9 
      },
      '/services/construction-materials': { 
        en: '/services/construction-materials', 
        tr: '/hizmetler/yapi-malzemeleri', 
        changefreq: 'monthly', 
        priority: 0.9 
      },
      '/services/brands-we-represent': { 
        en: '/services/brands-we-represent', 
        tr: '/hizmetler/bayisi-oldugumuz-markalar', 
        changefreq: 'monthly', 
        priority: 0.8 
      },

      // Nested routes for Human Resources
      '/human-resources/first-step': { 
        en: '/human-resources/first-step', 
        tr: '/insan-kaynaklari/ilk-adim', 
        changefreq: 'monthly', 
        priority: 0.6 
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
  '/projects': { en: '/projects', tr: '/projeler' },
  '/contact': { en: '/contact', tr: '/iletisim' },
  '/concrete-plant': { en: '/concrete-plant', tr: '/beton-santrali' },
  '/services/ready-mix-concrete': { en: '/services/ready-mix-concrete', tr: '/hizmetler/hazir-beton' },
  '/services/construction': { en: '/services/construction', tr: '/hizmetler/insaat' },
  '/services/quarry': { en: '/services/quarry', tr: '/hizmetler/tas-ocagi' },
  '/services/construction-materials': { en: '/services/construction-materials', tr: '/hizmetler/yapi-malzemeleri' },
  '/services/brands-we-represent': { en: '/services/brands-we-represent', tr: '/hizmetler/bayisi-oldugumuz-markalar' },
  '/human-resources/first-step': { en: '/human-resources/first-step', tr: '/insan-kaynaklari/ilk-adim' },
  '/privacy-policy': { en: '/privacy-policy', tr: '/gizlilik-politikasi' },
  '/terms-of-service': { en: '/terms-of-service', tr: '/kullanim-kosullari' },
  '/cookie-policy': { en: '/cookie-policy', tr: '/cerez-politikasi' }
};

export const noLocaleRoutes = [
    '', // Home page
    '/about',
    '/projects',
    '/concrete-plant',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy',
    // Service sub-routes
    '/services/construction-materials',
    '/services/construction',
    '/services/ready-mix-concrete',
    '/services/quarry',
    '/services/brands-we-represent',
    '/human-resources/first-step'
  ];
