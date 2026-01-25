import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const isStaticExport = process.env.NEXT_PUBLIC_OUTPUT === 'export'
const ignoreTsErrors = process.env.NEXT_PUBLIC_IGNORE_TS_ERRORS === 'true';
const ignoreDuringBuilds = process.env.NEXT_PUBLIC_IGNORE_ESLINT_ERRORS === 'true';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: ignoreTsErrors,
  },
  eslint: {
    ignoreDuringBuilds: ignoreDuringBuilds,
  },
  output: isStaticExport ? 'export' : undefined, // dynamic veya SSR olabilir
  images: isStaticExport ? { unoptimized: true } : undefined, // Sadece static export'ta ekle
  trailingSlash: isStaticExport ? true : undefined,
  
  // Tarayıcı uyumluluğu için optimizasyonlar
  // optimizeCss experimental özelliğini kaldırdık - critters dependency sorunu
  
  // Compiler optimizasyonları
  compiler: {
    // CSS-in-JS kütüphaneleri için
    styledComponents: false,
    // Emotion konfigürasyonunu kaldırdık - dependency sorunu
  },
  
  // CSS ve stil optimizasyonları
  sassOptions: {
    // SCSS kullanılıyorsa tarayıcı uyumluluğu
    includePaths: ['./src/styles'],
  },
  
  // Webpack konfigürasyonu
  webpack: (config, { dev, isServer }) => {
    // CSS loader konfigürasyonu
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss|sass)$/,
        chunks: 'all',
        enforce: true,
      };
    }
    
    return config;
  },
  
  // Headers - tarayıcı cache ve güvenlik
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join('; ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
