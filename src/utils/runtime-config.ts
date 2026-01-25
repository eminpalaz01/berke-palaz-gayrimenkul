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
    officeWorkingHours: {
      weekdays: {
        days: string[];
        opens: string;
        closes: string;
      };
      saturday: {
        days: string[];
        opens: string;
        closes: string;
      };
      sunday?: {
        days: string[];
        opens: string;
        closes: string;
      };
    };
    offices: {
      [key: string]: Office;
    };
  };
  workingHours: {
    days: string[];
    opens: string;
    closes: string;
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
  stats?: {
    yearsOfExperience: number;
    happyClients: number;
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
  location?: {
    region?: string;
    placename?: string;
    position?: string;
    icbm?: string;
  };
  seo?: {
    keywords?: string[];
    author?: string;
    robots?: string;
    twitterHandle?: string;
    googleVerification?: string;
  };
  business?: {
    type?: string;
    classification?: string;
    priceRange?: string;
    category?: string;
    services?: string[];
    areas?: string[];
    established?: string;
    licenseNumber?: string;
  };
}

// Cache for loaded config
let configCache: RuntimeConfig | null = null;
let configPromise: Promise<RuntimeConfig> | null = null;

/**
 * Load runtime configuration from API endpoint (which reads from database)
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
      // Load config from API endpoint that reads from database
      const response = await fetch('/api/config');
      if (!response.ok) {
        throw new Error(`Failed to load config from API`);
      }

      const config: RuntimeConfig = await response.json();
      
      // Cache the loaded config
      configCache = config;
      
      return config;
    } catch (error) {
      console.error('Failed to load runtime config from API:', error);
      
      // Return fallback config
      const fallbackConfig: RuntimeConfig = {
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
        workingHours: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '18:00'
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
    workingHours: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00'
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
