import fs from 'fs';
import path from 'path';
import { RuntimeConfig } from '@/utils/runtime-config';

function getConfigPath(): string {
  if (process.env.NEXT_PUBLIC_CONFIG_PATH) {
    const configPath = process.env.NEXT_PUBLIC_CONFIG_PATH;
    if (configPath.startsWith('/')) {
      return path.join(process.cwd(), 'public', configPath);
    }
    return path.join(process.cwd(), 'public', 'configs', configPath, 'config.json');
  }
  return path.join(process.cwd(), 'public', 'configs', 'config.json');
}

export function loadServerRuntimeConfig(): RuntimeConfig {
  try {
    const configPath = getConfigPath();
    if (fs.existsSync(configPath)) {
      const configFile = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configFile) as RuntimeConfig;
    }
    throw new Error(`Configuration file not found at ${configPath}`);
  } catch (error) {
    console.error('Failed to load server runtime config:', error);
    // Provide a sensible fallback configuration
    return {
      site: { url: 'http://localhost:3000', domain: 'localhost' },
      locales: { supported: ['tr', 'en'], default: 'tr' },
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
  }
}
