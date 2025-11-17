// Static configuration for server-side usage
// This file provides build-time configuration that loads from config file or falls back to defaults

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
    officeWorkingHours: {
      weekdays: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      },
      saturday: {
        days: ['Saturday'],
        opens: '10:00',
        closes: '16:00'
      }
    }
  },
  workingHours: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00'
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

/**
 * Check if we're in a Node.js server environment (not Edge Runtime)
 */
function isNodeServerEnvironment(): boolean {
  return (
    typeof window === 'undefined' && 
    typeof process !== 'undefined' &&
    typeof process.cwd === 'function'
  );
}

// Cache for loaded configuration (shared across all environments)
let cachedConfig: typeof DEFAULT_CONFIG | null = null;

/**
 * Load configuration from file or return defaults
 * This function loads config once at build/start time and caches it for all environments
 */
function loadConfig(): typeof DEFAULT_CONFIG {
  // Return cached config if already loaded
  if (cachedConfig !== null) {
    return cachedConfig;
  }

  // Only load config file in Node.js server environment (not Edge Runtime)
  if (isNodeServerEnvironment()) {
    try {
      // Dynamic import for server-side only
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs');
      
      // Determine config file path relative to public directory
      let configFilePath: string;
      if (process.env.NEXT_PUBLIC_CONFIG_PATH) {
        const envPath = process.env.NEXT_PUBLIC_CONFIG_PATH;
        if (envPath.startsWith('/configs/')) {
          // Path like: /configs/berkepalaz/config.json
          configFilePath = `./public${envPath}`;
        } else if (envPath.startsWith('/')) {
          // Path like: /config.json
          configFilePath = `./public${envPath}`;
        } else {
          // Path like: berkepalaz
          configFilePath = `./public/configs/${envPath}/config.json`;
        }
      } else {
        configFilePath = './public/configs/config.json';
      }
      
      // Check if config file exists
      if (fs.existsSync(configFilePath)) {
        console.log('Loading config from:', configFilePath);
        const configFile = fs.readFileSync(configFilePath, 'utf8');
        const loadedConfig = JSON.parse(configFile);
        
        // Merge loaded config with defaults to ensure all required fields exist
        cachedConfig = {
          ...DEFAULT_CONFIG,
          ...loadedConfig,
          locales: {
            ...DEFAULT_CONFIG.locales,
            ...(loadedConfig.locales || {}),
            supported: (loadedConfig.locales?.supported || DEFAULT_CONFIG.locales.supported) as readonly string[],
            default: (loadedConfig.locales?.default || DEFAULT_CONFIG.locales.default) as string
          },
          company: {
            ...DEFAULT_CONFIG.company,
            ...(loadedConfig.company || {})
          },
          site: {
            ...DEFAULT_CONFIG.site,
            ...(loadedConfig.site || {})
          },
          social: {
            ...DEFAULT_CONFIG.social,
            ...(loadedConfig.social || {})
          },
          maps: {
            ...DEFAULT_CONFIG.maps,
            ...(loadedConfig.maps || {})
          },
          workingHours: {
            ...DEFAULT_CONFIG.workingHours,
            ...(loadedConfig.workingHours || {})
          }
        };
        
        console.log('Config loaded and cached successfully');
        return cachedConfig;
      } else {
        console.warn('Config file not found at:', configFilePath);
        console.warn('Using default configuration - this may not reflect your actual settings');
        cachedConfig = DEFAULT_CONFIG;
        return cachedConfig;
      }
    } catch (error) {
      console.error('Failed to load config file:', error);
      console.warn('Using default configuration - this may not reflect your actual settings');
      cachedConfig = DEFAULT_CONFIG;
      return cachedConfig;
    }
  }
  
  // For client-side or edge runtime, use cached config if available
  // This ensures that config loaded during build/server-start is used everywhere
  if (cachedConfig !== null) {
    return cachedConfig;
  }
  
  // Fallback to defaults only if no cache exists (shouldn't happen in normal flow)
  console.warn('No cached config available, using defaults');
  cachedConfig = DEFAULT_CONFIG;
  return cachedConfig;
}

// Load configuration at module initialization (happens once at build/start time)
const loadedConfig = loadConfig();
export const APP_CONFIG: typeof DEFAULT_CONFIG = loadedConfig;
export type SupportedLocale = typeof APP_CONFIG.locales.supported[number];
export const COMPANY_INFO = APP_CONFIG.company;
export const SOCIAL_CONFIG = APP_CONFIG.social;
export const SITE_URL = APP_CONFIG.site.url;
export const DEFAULT_LOCALE = APP_CONFIG.locales.default;
