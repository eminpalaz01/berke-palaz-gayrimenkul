import NodeCache from 'node-cache';
import { prisma } from '@/lib/db';

// Cache with 5 minute TTL (300 seconds)
const configCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const CONFIG_CACHE_KEY = 'app_config';

/**
 * Default fallback config - used when database is empty
 */
const DEFAULT_CONFIG = {
  "company": {
    "name": {
      "tr": "Berke Palaz Gayrimenkul Danışmanı",
      "en": "Berke Palaz Real Estate Agent"
    },
    "officeName": {
      "tr": "Örnek Banker Eagle",
      "en": "Örnek Banker Eagle"
    },
    "description": {
      "tr": "Berke Palaz Gayrimenkul Danışmanı, size en uygun gayrimenkulü bulmanızda yardımcı olur. Geniş portföyümüzle, her bütçeye ve zevke uygun seçenekler sunuyoruz.",
      "en": "Berke Palaz Real Estate Agent helps you find the most suitable property. With our wide portfolio, we offer options for every budget and taste."
    },
    "email": "berke@berkepalaz.com",
    "officeEmail": "örnek@cb.com.tr",
    "phone": "+90 555 123 45 67",
    "officePhone": "+90 555 444 33 22",
    "address": {
      "tr": {
        "street": "Örnek Mahallesi, Emlak Caddesi No:12",
        "city": "İstanbul",
        "postalCode": "34710",
        "country": "Türkiye",
        "full": "Örnek Mahallesi, Emlak Caddesi No:12, 34710 Kadıköy, İstanbul"
      },
      "en": {
        "street": "Örnek Mahallesi, Emlak Caddesi No:12",
        "city": "Istanbul",
        "postalCode": "34710",
        "country": "Turkey",
        "full": "Örnek Mahallesi, Emlak Caddesi No:12, 34710 Kadıköy, Istanbul"
      }
    },
    "coordinates": {
      "latitude": 40.9936,
      "longitude": 29.0218
    },
    "personalWorkingHours": {
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "officeWorkingHours": {
      "weekdays": {
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "saturday": {
        "days": ["Saturday"],
        "opens": "10:00",
        "closes": "16:00"
      },
      "sunday": {
        "days": ["Sunday"],
        "opens": "Closed",
        "closes": "Closed"
      }
    },
    "offices": {
      "main": {
        "name": {
          "tr": "Ana Ofis",
          "en": "Main Office"
        },
        "title": {
          "tr": "Berke Palaz Gayrimenkul Danışmanı Ana Ofis",
          "en": "Berke Palaz Real Estate Agent Main Office"
        },
        "address": {
          "tr": {
            "street": "Örnek Mahallesi, Emlak Caddesi No:12",
            "city": "İstanbul",
            "postalCode": "34710",
            "country": "Türkiye",
            "full": "Örnek Mahallesi, Emlak Caddesi No:12, 34710 Kadıköy, İstanbul"
          },
          "en": {
            "street": "Örnek Mahallesi, Emlak Caddesi No:12",
            "city": "Istanbul",
            "postalCode": "34710",
            "country": "Turkey",
            "full": "Örnek Mahallesi, Emlak Caddesi No:12, 34710 Kadıköy, Istanbul"
          }
        },
        "coordinates": {
          "latitude": 40.9936,
          "longitude": 29.0218
        }
      }
    }
  },
  "workingHours": {
    "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "09:00",
    "closes": "18:00"
  },
  "social": {
    "instagramUrl": "https://instagram.com/me",
    "youtubeUrl": "https://youtube.com/@me",
    "facebookUrl": "https://facebook.com/me",
    "twitterUrl": "https://twitter.com/me",
    "linkedinUrl": "https://linkedin.com/in/me",
    "whatsappNumber": "+905551234567"
  },
  "maps": {
    "googleMapsUrl": "https://maps.google.com/?q=40.9936,29.0218",
    "yandexMapsUrl": "https://yandex.com.tr/maps/?ll=29.0218,40.9936&z=15"
  },
  "business": {
    "type": "Real Estate",
    "classification": "Real Estate Agency",
    "priceRange": "",
    "category": "Property Sales & Rental",
    "services": ["Residential Sales", "Residential Rentals", "Commercial Properties", "Investment Consulting", "Property Valuation", "Property Management"],
    "areas": ["İstanbul", "İzmir", "Ankara", "Bursa"],
    "established": "2015",
    "licenseNumber": "TR-GAY-2015-001"
  },
  "stats": {
    "yearsOfExperience": 10,
    "happyClients": 100
  },
  "features": {
    "multiLanguage": true,
    "darkMode": true,
    "newsletter": true,
    "blog": true,
    "contactForm": true,
    "propertySearch": true,
    "virtualTours": false,
    "mortgageCalculator": true
  },
  "analytics": {
    "googleAnalytics": "",
    "facebookPixel": "",
    "hotjar": ""
  },
  "seo": {
    "keywords": ["gayrimenkul", "emlak", "ev satışı", "ev kiralama", "İstanbul emlak", "berke palaz", "gayrimenkul danışmanı"],
    "author": "Berke Palaz",
    "robots": "index, follow",
    "twitterHandle": "@berkepalaz",
    "googleVerification": "your-google-verification-code"
  },
  "location": {
    "region": "TR-10",
    "placename": "Balıkesir",
    "position": "39.6484, 27.8826",
    "icbm": "39.6484, 27.8826"
  }
};


/**
 * Flatten nested object into dot notation keys
 * Example: { site: { url: 'test' } } => { 'site.url': 'test' }
 */
function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, string> {
  const flattened: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = JSON.stringify(value);
    }
  }
  
  return flattened;
}

/**
 * Unflatten dot notation keys into nested object
 * Example: { 'site.url': 'test' } => { site: { url: 'test' } }
 */
function unflattenObject(flattened: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(flattened)) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k]) {
        current[k] = {};
      }
      current = current[k];
    }
    
    const lastKey = keys[keys.length - 1];
    try {
      current[lastKey] = JSON.parse(value);
    } catch {
      current[lastKey] = value;
    }
  }
  
  return result;
}

/**
 * Get category from key
 * Example: 'site.url' => 'site', 'company.name.tr' => 'company'
 */
function getCategoryFromKey(key: string): string {
  return key.split('.')[0];
}

/**
 * Load all configs from database and cache them
 */
export async function loadConfigFromDB(): Promise<Record<string, any>> {
  try {
    // Check cache first
    const cached = configCache.get<Record<string, any>>(CONFIG_CACHE_KEY);
    if (cached) {
      return cached;
    }

    // Load from database
    const configs = await prisma.config.findMany();
    
    // If no configs in database, return default config
    if (configs.length === 0) {
      console.warn('No configs found in database, using default config');
      configCache.set(CONFIG_CACHE_KEY, DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }
    
    const flattenedConfig: Record<string, string> = {};
    for (const config of configs) {
      flattenedConfig[config.key] = config.value;
    }
    
    const unflattened = unflattenObject(flattenedConfig);
    
    // Cache the result
    configCache.set(CONFIG_CACHE_KEY, unflattened);
    
    return unflattened;
  } catch (error) {
    console.error('Failed to load config from database, using default config:', error);
    configCache.set(CONFIG_CACHE_KEY, DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
}

/**
 * Save config to database (flattens nested structure)
 */
export async function saveConfigToDB(config: Record<string, any>): Promise<void> {
  try {
    const flattened = flattenObject(config);
    
    // Use transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      for (const [key, value] of Object.entries(flattened)) {
        const category = getCategoryFromKey(key);
        
        await tx.config.upsert({
          where: { key },
          update: { value, category, updatedAt: new Date() },
          create: { key, value, category }
        });
      }
    });
    
    // Clear cache to force reload
    configCache.del(CONFIG_CACHE_KEY);
  } catch (error) {
    console.error('Failed to save config to database:', error);
    throw error;
  }
}

/**
 * Get a specific config value by key
 */
export async function getConfigValue(key: string): Promise<any> {
  const config = await loadConfigFromDB();
  const keys = key.split('.');
  let current = config;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return undefined;
    }
  }
  
  return current;
}

/**
 * Update a specific config value by key
 */
export async function updateConfigValue(key: string, value: any): Promise<void> {
  try {
    const category = getCategoryFromKey(key);
    const jsonValue = JSON.stringify(value);
    
    await prisma.config.upsert({
      where: { key },
      update: { value: jsonValue, category, updatedAt: new Date() },
      create: { key, value: jsonValue, category }
    });
    
    // Clear cache to force reload
    configCache.del(CONFIG_CACHE_KEY);
  } catch (error) {
    console.error('Failed to update config value:', error);
    throw error;
  }
}

/**
 * Clear all config caches (useful for testing or manual refresh)
 */
export function clearConfigCache(): void {
  configCache.flushAll();
}

/**
 * Get cache statistics
 */
export function getConfigCacheStats() {
  return configCache.getStats();
}
