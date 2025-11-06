// Static configuration for server-side usage
// This file provides build-time configuration that doesn't require runtime loading

const DEFAULT_CONFIG = {
  site: {
    url: process.env.NODE_ENV === 'production' ? 'https://yoursite.com' : 'http://localhost:3000',
    domain: process.env.NODE_ENV === 'production' ? 'yoursite.com' : 'localhost:3000'
  },
  locales: {
    supported: ['tr'] as const,
    default: 'tr' as const
  },
  company: {
    name: {
      tr: 'Berke Palaz Gayrimenkul'
    },
    email: 'info@berkepalaz.com',
    phone: '+90 555 123 45 67',
    address: {
      tr: {
        street: 'Örnek Mahallesi, Gayrimenkul Sokak No:1',
        city: 'İstanbul',
        postalCode: '34000',
        country: 'Türkiye',
        full: 'Örnek Mahallesi, Gayrimenkul Sokak No:1, 34000 İstanbul/Türkiye'
      }
    },
    coordinates: {
      latitude: 39.6484,
      longitude: 27.8826
    },
    workingHours: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00'
    }
  },
  social: {
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com',
    twitter: '@yourcompany'
  },
  maps: {
    googleMapsUrl: 'https://maps.google.com',
    yandexMapsUrl: 'https://yandex.com.tr/maps'
  },
  business: {
    category: 'business',
    classification: 'business',
    priceRange: '$$'
  },
  location: {
    region: '',
    placename: '',
    position: '',
    icbm: ''
  },
  seo: {
    googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
    twitterHandle: '@yourcompany'
  },
  env: {
    googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
    output: process.env.NEXT_PUBLIC_OUTPUT || '',
    configPath: process.env.NEXT_PUBLIC_CONFIG_PATH || '',
    company: process.env.NEXT_PUBLIC_COMPANY || ''
  }
};

export const APP_CONFIG = DEFAULT_CONFIG;
export type SupportedLocale = typeof APP_CONFIG.locales.supported[number];
export const COMPANY_INFO = APP_CONFIG.company;
export const SOCIAL_CONFIG = APP_CONFIG.social;
export const SITE_URL = APP_CONFIG.site.url;
export const DEFAULT_LOCALE = APP_CONFIG.locales.default;
