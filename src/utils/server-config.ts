import { RuntimeConfig } from '@/utils/runtime-config';
import { loadConfigFromDB } from '@/lib/config-service';

/**
 * Fallback configuration for when database is unavailable
 */
const fallbackConfig: RuntimeConfig = {
  company: {
    name: { tr: 'Şirket Adı', en: 'Company Name' },
    description: { tr: '', en: '' },
    email: 'info@company.com',
    phone: '+90 XXX XXX XX XX',
    address: {
      tr: { street: 'Adres', city: 'Şehir', postalCode: '00000', country: 'Türkiye', full: 'Adres, 00000 Şehir/Türkiye' },
      en: { street: 'Address', city: 'City', postalCode: '00000', country: 'Turkey', full: 'Address, 00000 City/Turkey' }
    },
    coordinates: { latitude: 39.6484, longitude: 27.8826 },
    officeWorkingHours: {
      weekdays: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
      saturday: { days: ['Saturday'], opens: '10:00', closes: '16:00' }
    },
    offices: {}
  },
  workingHours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '18:00' },
  social: { instagramUrl: 'https://instagram.com', youtubeUrl: 'https://youtube.com' },
  maps: { googleMapsUrl: 'https://maps.google.com', yandexMapsUrl: 'https://yandex.com.tr/maps' }
};

/**
 * Load runtime configuration from database with caching
 * Falls back to default config if database is unavailable
 */
export async function loadServerRuntimeConfig(): Promise<RuntimeConfig> {
  try {
    const config = await loadConfigFromDB();
    return config as RuntimeConfig;
  } catch (error) {
    console.error('Failed to load server runtime config from database, using fallback:', error);
    return fallbackConfig;
  }
}
