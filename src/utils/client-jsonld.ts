'use client';

import { validateLocale } from '@/hooks/locale-utils';
import { RuntimeConfig } from '@/utils/runtime-config';
import { SITE_URL } from '@/config';

// JSON-LD Types
export type JsonLdType = 'Organization' | 'Organization:RealEstateAgent' | 'LocalBusiness' | 'WebSite' | 'BreadcrumbList';

type BreadcrumbItem = {
  name: string;
  url: string;
};

/**
 * Get country code based on locale
 * Uses the address information from runtime config to determine country
 */
function getCountryCode(locale: string, runtimeConfig: RuntimeConfig): string {
  const addressKey = locale as keyof typeof runtimeConfig.company.address;
  const address = runtimeConfig.company.address[addressKey] || runtimeConfig.company.address.tr;
  
  // Map country names to ISO codes
  // For companies operating in specific countries, both language versions should map to the same country code
  const countryNameToCode: Record<string, string> = {
    // Turkey (Şelale Beton operates in Turkey)
    'Türkiye': 'TR',
    'Turkey': 'TR',
    
    // Other countries for future expansion
    'Deutschland': 'DE',
    'Germany': 'DE',
    'France': 'FR',
    'España': 'ES',
    'Spain': 'ES',
    'Italia': 'IT',
    'Italy': 'IT',
    'Portugal': 'PT',
    'Россия': 'RU',
    'Russia': 'RU',
    '日本': 'JP',
    'Japan': 'JP',
    '한국': 'KR',
    'Korea': 'KR',
    '中国': 'CN',
    'China': 'CN',
    'السعودية': 'SA',
    'Saudi Arabia': 'SA',
    'भारत': 'IN',
    'India': 'IN',
    'Nederland': 'NL',
    'Netherlands': 'NL',
    'België': 'BE',
    'Belgium': 'BE',
    'Österreich': 'AT',
    'Austria': 'AT',
    'Schweiz': 'CH',
    'Switzerland': 'CH'
  };
  
  return countryNameToCode[address.country] || 'TR'; // Default to TR for Turkish companies
}

/**
 * Get localized company name
 */
function getLocalizedCompanyName(locale: string, runtimeConfig: RuntimeConfig): string {
  const nameKey = locale as keyof typeof runtimeConfig.company.name;
  return runtimeConfig.company.name[nameKey] || runtimeConfig.company.name.tr;
}

/**
 * Get localized address information
 */
function getLocalizedAddress(locale: string, runtimeConfig: RuntimeConfig) {
  const addressKey = locale as keyof typeof runtimeConfig.company.address;
  const address = runtimeConfig.company.address[addressKey] || runtimeConfig.company.address.tr;
  
  return {
    streetAddress: address.street,
    addressLocality: address.city,
    postalCode: address.postalCode,
    addressCountry: getCountryCode(locale, runtimeConfig)
  };
}

/**
 * Get all available company names with language tags for JSON-LD
 */
function getAllCompanyNames(runtimeConfig: RuntimeConfig) {
  return Object.entries(runtimeConfig.company.name).map(([lang, name]) => ({
    '@value': name,
    '@language': lang
  }));
}

function getSameAsLinks(social: RuntimeConfig['social']): string[] {
  if (!social) return [];

  const links: (string | undefined)[] = [
    social.instagramUrl,
    social.youtubeUrl,
    social.facebookUrl,
    social.twitterUrl,
    social.linkedinUrl,
    social.whatsappNumber
      ? `https://wa.me/${social.whatsappNumber.replace(/\D/g, '')}`
      : undefined
  ];

  return links.filter((link): link is string => Boolean(link));
}

/**
 * Generates JSON-LD structured data with proper multilingual support (client-side version)
 */
export function generateClientJsonLd(
  locale: string,
  types: JsonLdType[] | JsonLdType,
  runtimeConfig: RuntimeConfig,
  data?: Record<string, unknown>
) {
  const siteUrl = SITE_URL;
  const validatedLocale = validateLocale(locale);
  const commonData = { '@context': 'https://schema.org' };
  const typeArray = Array.isArray(types) ? types : [types];
  const countryCode = getCountryCode(validatedLocale, runtimeConfig);
  const allCompanyNames = getAllCompanyNames(runtimeConfig);
  const supportedLanguages = Object.keys(runtimeConfig.company.name);

  // Simple description fallback for client-side
  const getDescription = (locale: string) => {
    const descriptionKey = locale as keyof typeof runtimeConfig.company.description;
    return runtimeConfig.company.description[descriptionKey] || runtimeConfig.company.description.tr;
  };

  return typeArray.map(type => {
    switch (type) {
      case 'Organization': {
        const localizedAddress = getLocalizedAddress(validatedLocale, runtimeConfig);

        return {
          ...commonData,
          '@id': `${siteUrl}/#organization`,
          '@type': ['Organization'],
          name: allCompanyNames,
          description: [
            { '@value': getDescription(validatedLocale), '@language': validatedLocale }
          ],
          url: siteUrl,
          logo: `${siteUrl}/images/logo.png`,
          image: `${siteUrl}/images/og-image.jpg`,
          telephone: runtimeConfig.company.phone,
          email: runtimeConfig.company.email,

          address: {
            '@type': 'PostalAddress',
            streetAddress: localizedAddress.streetAddress,
            addressLocality: localizedAddress.addressLocality,
            postalCode: localizedAddress.postalCode,
            addressCountry: localizedAddress.addressCountry
          },

          geo: {
            '@type': 'GeoCoordinates',
            latitude: runtimeConfig.company.coordinates.latitude,
            longitude: runtimeConfig.company.coordinates.longitude
          },

          openingHoursSpecification: [{
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: runtimeConfig.workingHours.days,
            opens: runtimeConfig.workingHours.opens,
            closes: runtimeConfig.workingHours.closes
          }],

          areaServed: {
            '@type': 'AdministrativeArea',
            name: localizedAddress.addressLocality
          },

          knowsLanguage: supportedLanguages,
          priceRange: '₺₺₺',

          sameAs: getSameAsLinks(runtimeConfig.social),

          inLanguage: [validatedLocale],
          ...data
        };
      }

      case 'Organization:RealEstateAgent': {
        const localizedAddress = getLocalizedAddress(validatedLocale, runtimeConfig);

        return {
          ...commonData,
          '@id': `${siteUrl}/#organization`,
          '@type': ['Organization', 'RealEstateAgent'],
          name: allCompanyNames,
          description: [
            { '@value': getDescription(validatedLocale), '@language': validatedLocale }
          ],
          url: siteUrl,
          logo: `${siteUrl}/images/logo.png`,
          image: `${siteUrl}/images/og-image.jpg`,
          telephone: runtimeConfig.company.phone,
          email: runtimeConfig.company.email,

          address: {
            '@type': 'PostalAddress',
            streetAddress: localizedAddress.streetAddress,
            addressLocality: localizedAddress.addressLocality,
            postalCode: localizedAddress.postalCode,
            addressCountry: localizedAddress.addressCountry
          },

          geo: {
            '@type': 'GeoCoordinates',
            latitude: runtimeConfig.company.coordinates.latitude,
            longitude: runtimeConfig.company.coordinates.longitude
          },

          openingHoursSpecification: [{
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: runtimeConfig.workingHours.days,
            opens: runtimeConfig.workingHours.opens,
            closes: runtimeConfig.workingHours.closes
          }],

          areaServed: {
            '@type': 'AdministrativeArea',
            name: localizedAddress.addressLocality
          },

          knowsLanguage: supportedLanguages,
          priceRange: '₺₺₺',

          sameAs: getSameAsLinks(runtimeConfig.social),

          inLanguage: [validatedLocale],
          ...data
        };
      }
      
      case 'LocalBusiness': {
        const localizedAddress = getLocalizedAddress(validatedLocale, runtimeConfig);

        return {
          ...commonData,
          '@id': `${siteUrl}/#localbusiness`,
          '@type': 'RealEstateAgent',
          name: allCompanyNames,
          description: [
            { '@value': getDescription(validatedLocale), '@language': validatedLocale }
          ],
          url: siteUrl,
          telephone: runtimeConfig.company.phone,
          email: runtimeConfig.company.email,

          address: {
            '@type': 'PostalAddress',
            streetAddress: localizedAddress.streetAddress,
            addressLocality: localizedAddress.addressLocality,
            postalCode: localizedAddress.postalCode,
            addressCountry: localizedAddress.addressCountry
          },

          geo: {
            '@type': 'GeoCoordinates',
            latitude: runtimeConfig.company.coordinates.latitude,
            longitude: runtimeConfig.company.coordinates.longitude
          },

          openingHoursSpecification: [{
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: runtimeConfig.workingHours.days,
            opens: runtimeConfig.workingHours.opens,
            closes: runtimeConfig.workingHours.closes
          }],

          areaServed: {
            '@type': 'AdministrativeArea',
            name: localizedAddress.addressLocality
          },

          priceRange: '₺₺₺',
          inLanguage: [validatedLocale],
          ...data
        };
      }

      case 'WebSite':
        return {
          ...commonData,
          '@id': `${siteUrl}/#website`,
          '@type': 'WebSite',
          url: siteUrl,
          name: allCompanyNames,
          description: [
            { '@value': getDescription(validatedLocale), '@language': validatedLocale }
          ],
          publisher: {
            '@id': `${siteUrl}/#organization`
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
            inLanguage: validatedLocale
          },
          inLanguage: supportedLanguages,
          ...data
        };

      case 'BreadcrumbList':
        const breadcrumbData = data as { items?: BreadcrumbItem[] };
        return {
          ...commonData,
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbData?.items?.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
          })) || [],
          inLanguage: validatedLocale
        };

      default:
        return { 
          ...commonData, 
          '@type': type,
          inLanguage: validatedLocale
        };
    }
  });
}
