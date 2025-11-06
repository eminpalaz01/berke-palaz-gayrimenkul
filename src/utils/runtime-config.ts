'use client';

import React from 'react';

// Localized content interface
interface LocalizedContent {
  tr: string;
  en: string;
  [key: string]: string;
}

// Address interface with localization
interface LocalizedAddress {
  tr: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    full: string;
  };
  en: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    full: string;
  };
  [key: string]: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    full: string;
  };
}

// Office interface
interface Office {
  name: LocalizedContent;
  title: LocalizedContent;
  address: LocalizedAddress;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Runtime configuration types
export interface RuntimeConfig {
  site: {
    url: string;
    domain: string;
  };
  locales: {
    supported: string[];
    default: string;
  };
  company: {
    name: LocalizedContent;
    officeName?: LocalizedContent;
    description: LocalizedContent;
    email: string;
    officeEmail?: string;
    phone: string;
    officePhone?: string;
    address: LocalizedAddress;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    workingHours: {
      days: string[];
      opens: string;
      closes: string;
    };
    offices: {
      [key: string]: Office;
    };
  };
  social: {
    instagramUrl?: string;
    youtubeUrl?: string;
    facebookUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    whatsappNumber?: string;
  };
  maps: {
    googleMapsUrl: string;
    yandexMapsUrl: string;
  };
  media?: {
    heroVideoId: string;
    concretePlants: {
      [key: string]: {
        googleMapsUrl: string;
        yandexMapsUrl: string;
      };
    };
    contactMaps: {
      [key: string]: {
        embedUrl: string;
        directUrl: string;
      };
    };
  };
}

// Cache for loaded config
let configCache: RuntimeConfig | null = null;
let configPromise: Promise<RuntimeConfig> | null = null;

/**
 * Determine which config file to load based on environment or company
 */
function getConfigPath(): string {
  // Priority 1: Direct config path from environment variable
  if (process.env.NEXT_PUBLIC_CONFIG_PATH) {
    const configPath = process.env.NEXT_PUBLIC_CONFIG_PATH;
    // Ensure path starts with /configs/ and ends with config.json
    if (configPath.startsWith('/')) {
      return configPath;
    } else {
      return `/configs/${configPath}/config.json`;
    }
  }
  // Default to generic config
  return '/configs/config.json';
}

/**
 * Load runtime configuration from JSON file
 * Uses caching to avoid multiple requests
 */
export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  // Return cached config if available
  if (configCache) {
    return configCache;
  }

  // Return existing promise if already loading
  if (configPromise) {
    return configPromise;
  }

  // Create new promise to load config
  configPromise = (async () => {
    try {
      // Determine which config file to load
      const configPath = getConfigPath();
      console.log('Loading config from:', configPath);
      
      const response = await fetch(configPath);
      if (!response.ok) {
        throw new Error(`Failed to load config from ${configPath}`);
      }

      const config: RuntimeConfig = await response.json();
      
      // Cache the loaded config
      configCache = config;
      
      return config;
    } catch (error) {
      console.error('Failed to load runtime config:', error);
      
      // Return fallback config
      const fallbackConfig: RuntimeConfig = {
        site: {
          url: 'http://localhost:3000',
          domain: 'localhost'
        },
        locales: {
          supported: ['tr', 'en'],
          default: 'tr'
        },
        company: {
          name: {
            tr: 'Şirket Adı',
            en: 'Company Name'
          },
          description: {
            tr: 'Şirket açıklaması ve hizmetleri hakkında bilgi.',
            en: 'Information about company description and services.'
          },
          email: 'info@company.com',
          officeEmail: 'info@office.com',
          phone: '+90 XXX XXX XX XX',
          address: {
            tr: {
              street: 'Adres',
              city: 'Şehir',
              postalCode: '00000',
              country: 'Türkiye',
              full: 'Adres, 00000 Şehir/Türkiye'
            },
            en: {
              street: 'Address',
              city: 'City',
              postalCode: '00000',
              country: 'Turkey',
              full: 'Address, 00000 City/Turkey'
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
          },
          offices: {
            balikesir: {
              name: {
                tr: 'Balıkesir Ofisi',
                en: 'Balıkesir Office'
              },
              title: {
                tr: 'Şirket Balıkesir',
                en: 'Company Balıkesir'
              },
              address: {
                tr: {
                  street: 'Adres',
                  city: 'Balıkesir',
                  postalCode: '00000',
                  country: 'Türkiye',
                  full: 'Adres, 00000 Balıkesir/Türkiye'
                },
                en: {
                  street: 'Address',
                  city: 'Balıkesir',
                  postalCode: '00000',
                  country: 'Turkey',
                  full: 'Address, 00000 Balıkesir/Turkey'
                }
              },
              coordinates: {
                latitude: 39.6484,
                longitude: 27.8826
              }
            },
            bursa: {
              name: {
                tr: 'Bursa Ofisi',
                en: 'Bursa Office'
              },
              title: {
                tr: 'Şirket Bursa',
                en: 'Company Bursa'
              },
              address: {
                tr: {
                  street: 'Adres',
                  city: 'Bursa',
                  postalCode: '00000',
                  country: 'Türkiye',
                  full: 'Adres, 00000 Bursa/Türkiye'
                },
                en: {
                  street: 'Address',
                  city: 'Bursa',
                  postalCode: '00000',
                  country: 'Turkey',
                  full: 'Address, 00000 Bursa/Turkey'
                }
              },
              coordinates: {
                latitude: 40.2669,
                longitude: 28.9784
              }
            }
          }
        },
        social: {
          instagramUrl: 'https://instagram.com',
          youtubeUrl: 'https://youtube.com'
        },
        maps: {
          googleMapsUrl: 'https://maps.google.com',
          yandexMapsUrl: 'https://yandex.com.tr/maps'
        },
        media: {
          heroVideoId: 'dQw4w9WgXcQ',
          concretePlants: {
            atatepe: {
              googleMapsUrl: 'https://maps.google.com',
              yandexMapsUrl: 'https://yandex.com.tr/maps'
            },
            ucpinar: {
              googleMapsUrl: 'https://maps.google.com',
              yandexMapsUrl: 'https://yandex.com.tr/maps'
            },
            bursa: {
              googleMapsUrl: 'https://maps.google.com',
              yandexMapsUrl: 'https://yandex.com.tr/maps'
            }
          },
          contactMaps: {
            balikesir: {
              embedUrl: 'https://www.google.com/maps/embed',
              directUrl: 'https://maps.google.com'
            },
            bursa: {
              embedUrl: 'https://www.google.com/maps/embed',
              directUrl: 'https://maps.google.com'
            }
          }
        }
      };
      
      configCache = fallbackConfig;
      return fallbackConfig;
    } finally {
      // Clear the promise so future calls can retry if needed
      configPromise = null;
    }
  })();

  return configPromise;
}

/**
 * Get cached config synchronously (returns null if not loaded yet)
 */
export function getCachedConfig(): RuntimeConfig | null {
  return configCache;
}

/**
 * Clear config cache (useful for testing or when config changes)
 */
export function clearConfigCache(): void {
  configCache = null;
  configPromise = null;
}

/**
 * Get runtime configuration synchronously (for build-time usage)
 * This function attempts to load config synchronously and falls back to default if not available
 */
export function getRuntimeConfig(): RuntimeConfig {
  // If we have cached config, return it
  if (configCache) {
    return configCache;
  }

  // For build-time usage, we need to provide a default config
  // This will be replaced at runtime when the actual config is loaded
  const defaultConfig: RuntimeConfig = {
    site: {
      url: process.env.NODE_ENV === 'production' ? 'https://yoursite.com' : 'http://localhost:3000',
      domain: process.env.NODE_ENV === 'production' ? 'yoursite.com' : 'localhost:3000'
    },
    locales: {
      supported: ['tr', 'en'],
      default: 'tr'
    },
    company: {
      name: {
        tr: 'Şirket Adı',
        en: 'Company Name'
      },
      description: {
        tr: 'Şirket açıklaması ve hizmetleri hakkında bilgi.',
        en: 'Information about company description and services.'
      },
      email: 'info@company.com',
      phone: '+90 XXX XXX XX XX',
      address: {
        tr: {
          street: 'Adres',
          city: 'Şehir',
          postalCode: '00000',
          country: 'Türkiye',
          full: 'Adres, 00000 Şehir/Türkiye'
        },
        en: {
          street: 'Address',
          city: 'City',
          postalCode: '00000',
          country: 'Turkey',
          full: 'Address, 00000 City/Turkey'
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
      },
      offices: {
        main: {
          name: {
            tr: 'Ana Ofis',
            en: 'Main Office'
          },
          title: {
            tr: 'Şirket Ana Ofis',
            en: 'Company Main Office'
          },
          address: {
            tr: {
              street: 'Adres',
              city: 'Şehir',
              postalCode: '00000',
              country: 'Türkiye',
              full: 'Adres, 00000 Şehir/Türkiye'
            },
            en: {
              street: 'Address',
              city: 'City',
              postalCode: '00000',
              country: 'Turkey',
              full: 'Address, 00000 City/Turkey'
            }
          },
          coordinates: {
            latitude: 39.6484,
            longitude: 27.8826
          }
        }
      }
    },
    social: {
      instagramUrl: 'https://instagram.com',
      youtubeUrl: 'https://youtube.com'
    },
    maps: {
      googleMapsUrl: 'https://maps.google.com',
      yandexMapsUrl: 'https://yandex.com.tr/maps'
    },
    media: {
      heroVideoId: 'dQw4w9WgXcQ',
      concretePlants: {
        main: {
          googleMapsUrl: 'https://maps.google.com',
          yandexMapsUrl: 'https://yandex.com.tr/maps'
        }
      },
      contactMaps: {
        main: {
          embedUrl: 'https://www.google.com/maps/embed',
          directUrl: 'https://maps.google.com'
        }
      }
    }
  };

  return defaultConfig;
}

/**
 * Hook for using runtime config in React components
 */
export function useRuntimeConfig() {
  const [config, setConfig] = React.useState<RuntimeConfig | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    loadRuntimeConfig()
      .then(setConfig)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { config, loading, error };
}
