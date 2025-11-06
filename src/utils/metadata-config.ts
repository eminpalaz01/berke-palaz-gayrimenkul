import fs from 'fs';
import path from 'path';

export interface MetadataConfig {
  tr: {
    title: {
      default: string;
      template: string;
    };
    description: string;
    keywords: string[];
    dc: {
      subject: string;
      description: string;
      publisher: string;
      contributor: string;
      coverage: string;
      rights: string;
    };
    openGraph: {
      title: string;
      description: string;
      alt: string;
    };
    twitter: {
      title: string;
      description: string;
      creator:string;
    };
  };
  en: {
    title: {
      default: string;
      template: string;
    };
    description: string;
    keywords: string[];
    dc: {
      subject: string;
      description: string;
      publisher: string;
      contributor: string;
      coverage: string;
      rights: string;
    };
    openGraph: {
      title: string;
      description: string;
      alt: string;
    };
    twitter: {
      title: string;
      description: string;
      creator:string;
    };
  };
}

// Fallback metadata config - Generic, not project-specific
const fallbackConfig: MetadataConfig = {
  tr: {
    title: {
      default: 'Şirket Adı - Web Sitesi',
      template: '%s | Şirket Adı'
    },
    description: 'Şirket açıklaması ve hizmetleri hakkında bilgi.',
    keywords: ['şirket', 'hizmet', 'kalite'],
    dc: {
      subject: 'Şirket Hizmetleri',
      description: 'Şirket hizmetleri ve ürünleri hakkında bilgi.',
      publisher: 'Şirket Adı',
      contributor: 'Şirket Adı',
      coverage: 'Türkiye',
      rights: 'Telif Hakkı © Şirket Adı'
    },
    openGraph: {
      title: 'Şirket Adı - Web Sitesi',
      description: 'Şirket açıklaması ve hizmetleri hakkında bilgi.',
      alt: 'Şirket Logosu'
    },
    twitter: {
      title: 'Şirket Adı - Web Sitesi',
      description: 'Şirket açıklaması ve hizmetleri hakkında bilgi.',
      creator:"@yourcompany"
    }
  },
  en: {
    title: {
      default: 'Company Name - Website',
      template: '%s | Company Name'
    },
    description: 'Information about company description and services.',
    keywords: ['company', 'service', 'quality'],
    dc: {
      subject: 'Company Services',
      description: 'Information about company services and products.',
      publisher: 'Company Name',
      contributor: 'Company Name',
      coverage: 'Turkey',
      rights: 'Copyright © Company Name'
    },
    openGraph: {
      title: 'Company Name - Website',
      description: 'Information about company description and services.',
      alt: 'Company Logo'
    },
    twitter: {
      title: 'Company Name - Website',
      description: 'Information about company description and services.',
      creator:"@yourcompany"
    }
  }
};

/**
 * Determines the path to the metadata config file based on environment variables.
 */
function getMetadataConfigPath(): string {
  const configPath = process.env.NEXT_PUBLIC_CONFIG_PATH;

  if (configPath && !configPath.startsWith('/')) {
    // If a specific config path is defined (e.g., 'selale-beton'), use it
    return path.join(process.cwd(), 'public', 'configs', configPath, 'metadata-config.json');
  } else if (configPath) {
    // If the path is absolute, use it directly
    return path.join(process.cwd(), 'public', configPath);
  }
  
  // Default to the generic metadata config file
  return path.join(process.cwd(), 'public', 'configs', 'metadata-config.json');
}

/**
 * Load metadata configuration from JSON file.
 * Works both in development and production builds.
 */
export function loadMetadataConfig(): MetadataConfig {
  try {
    const configPath = getMetadataConfigPath();
    
    if (fs.existsSync(configPath)) {
      const configFile = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configFile) as MetadataConfig;
      return config;
    } else {
      console.warn(`metadata-config.json not found at ${configPath}, using fallback config`);
      return fallbackConfig;
    }
  } catch (error) {
    console.warn('Failed to load metadata config, using fallback:', error);
    return fallbackConfig;
  }
}
