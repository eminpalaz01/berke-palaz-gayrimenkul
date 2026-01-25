import { NextRequest, NextResponse } from 'next/server';
import { loadConfigFromDB } from '@/lib/config-service';
import { withApiSecurity, SecurityPresets } from '@/lib/api-security';

/**
 * GET /api/config
 * Public endpoint to retrieve application configuration from database
 * Cached for 5 minutes via config-service
 */
async function handler(request: NextRequest) {
  try {
    const config = await loadConfigFromDB();
    
    return NextResponse.json(config, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Failed to load config:', error);
    
    // Return fallback config on error
    return NextResponse.json(
      {
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
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}

export const GET = withApiSecurity(handler, SecurityPresets.PUBLIC_READ_ONLY)
