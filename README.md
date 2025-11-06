# Next.js Çok Dilli Şablon

Uluslararasılaştırma (i18n), SEO optimizasyonu ve esnek yapılandırma sistemi ile üretime hazır Next.js şablonu. Çok dilli web siteleri oluşturmak için mükemmel.

## 🚀 Özellikler

- **Next.js 15** App Router ile
- **TypeScript** tip güvenliği için
- **Uluslararasılaştırma (i18n)** next-intl ile
- **SEO Optimizasyonu** dinamik metadata ile
- **Esnek Yapılandırma** sistemi
- **Tailwind CSS** stil için
- **Radix UI** bileşenleri
- **Framer Motion** animasyonları
- **Karanlık Mod** desteği
- **Duyarlı Tasarım**

## 📋 Gereksinimler

- Node.js 20+ 
- npm, yarn, veya pnpm

## 🛠️ Kurulum

1. Bu şablonu klonlayın
2. Bağımlılıkları yükleyin: `npm install`
3. Ortam değişkenlerini ayarlayın
4. Yapılandırma dosyalarını düzenleyin
5. Geliştirme sunucusunu başlatın: `npm run dev`

## 📁 Kritik Dosyalar ve Yapılandırma

### 🔧 Yapılandırma Dosyaları

| Dosya | Amaç | Düzenlenmesi Gereken |
|-------|------|---------------------|
| `public/configs/{COMPANY_NAME}/config.json` | Ana site yapılandırması | Şirket bilgileri, iletişim, sosyal medya |
| `public/configs/{COMPANY_NAME}/metadata-config.json` | SEO ve meta etiketleri | Başlıklar, açıklamalar, anahtar kelimeler |
| `src/routes.ts` | Rota yapılandırması ve SEO | Sayfa rotaları, çok dilli URL'ler |
| `.env.development` | Geliştirme ortamı | CONFIG_PATH, COMPANY, OUTPUT |
| `.env.production` | Üretim ortamı | CONFIG_PATH, COMPANY, OUTPUT |

> **Not:** `{COMPANY_NAME}` kısmı `NEXT_PUBLIC_CONFIG_PATH` environment variable'ında tanımlanan değerdir.

### 🌍 Çeviri Dosyaları

| Dosya | Amaç | Düzenlenmesi Gereken |
|-------|------|---------------------|
| `messages/tr.json` | Türkçe çeviriler | Tüm UI metinleri |
| `messages/en.json` | İngilizce çeviriler | Tüm UI metinleri |

### 🖼️ Görsel Dosyaları

| Dosya | Amaç | Boyut/Format |
|-------|------|-------------|
| `public/images/logo.png` | Koyu tema logosu | PNG, şeffaf arka plan |
| `public/images/logo-beyaz.png` | Açık tema logosu | PNG, şeffaf arka plan |
| `public/images/og-image.jpg` | Sosyal medya görseli | 1200x630 px |
| `public/favicon.ico` | Web sitesi ikonu | 32x32 px |

### 📱 Responsive Text CSS Sistemi

Bu şablon özel responsive text utility sınıfları içerir:

#### Mevcut Responsive Text Sınıfları:
```css
/* Temel responsive text boyutları */
.responsive-text-xs     /* En küçük text */
.responsive-text-sm     /* Küçük text */
.responsive-text-base   /* Normal text */
.responsive-text-lg     /* Büyük text */
.responsive-text-xl     /* Çok büyük text */
.responsive-text-2xl    /* 2XL text */
.responsive-text-3xl    /* 3XL text */
.responsive-text-4xl    /* 4XL text */
.responsive-text-5xl    /* 5XL text */

/* Responsive başlık sınıfları */
.responsive-heading-sm  /* Küçük başlık: text-3xl md:text-4xl */
.responsive-heading-md  /* Orta başlık: text-4xl md:text-5xl */
.responsive-heading-lg  /* Büyük başlık: text-4xl md:text-5xl lg:text-6xl */
.responsive-heading-xl  /* XL başlık: text-5xl md:text-6xl lg:text-7xl xl:text-8xl */
```

#### Kullanım Örneği:
```jsx
// Responsive başlık
<h1 className="responsive-heading-xl">
  Ana Başlık
</h1>

// Responsive alt başlık
<h2 className="responsive-heading-lg">
  Alt Başlık
</h2>

// Responsive paragraf
<p className="responsive-text-base">
  İçerik metni
</p>
```

## 🌐 Ortam Değişkenleri

### Gerekli Değişkenler:
- `NEXT_PUBLIC_CONFIG_PATH`: Yapılandırma klasör adı
- `NEXT_PUBLIC_COMPANY`: Şirket tanımlayıcısı  
- `NEXT_PUBLIC_OUTPUT`: Çıktı türü (export/boş) (export demek statik site çıktısı demek oluyor)

## 📈 SEO Sistemi

### Otomatik Üretilen:
- Meta etiketleri (title, description, keywords)
- Open Graph etiketleri
- Twitter Card etiketleri
- JSON-LD yapılandırılmış veri
- Sitemap.xml
- Robots.txt

### Sayfa Bazında SEO:
Her sayfa için `generateMetadata` fonksiyonu kullanılır.

## 🎨 Stil Sistemi

### Tailwind CSS Yapılandırması:
- Özel renk paleti
- Responsive breakpoint'ler
- Karanlık mod desteği
- Özel animasyonlar
- Responsive text sistemi

### UI Bileşenleri:
- Radix UI tabanlı
- Tam erişilebilir
- Özelleştirilebilir
- TypeScript desteği

## 🚀 Dağıtım

### Statik Export:
```bash
NEXT_PUBLIC_OUTPUT=export npm run build
```

### Sunucu Dağıtımı:
```bash
npm run build && npm run start
```

## 📝 Hızlı Entegrasyon Rehberi

### 1. Temel Bilgileri Değiştir:
- `public/configs/{COMPANY_NAME}/config.json` → Şirket bilgileri
- `public/configs/{COMPANY_NAME}/metadata-config.json` → SEO bilgileri
- `.env.development` ve `.env.production` → Ortam değişkenleri

> **Not:** `{COMPANY_NAME}` kısmı `NEXT_PUBLIC_CONFIG_PATH` environment variable'ında tanımlanan değerdir.

### 2. Görselleri Değiştir:
- Logo dosyalarını değiştir
- Favicon'u güncelle
- OG image'ı değiştir

### 3. Çevirileri Güncelle:
- `messages/tr.json` → Türkçe metinler
- `messages/en.json` → İngilizce metinler

### 4. Basit Sayfa Oluşturma Örneği:

#### Ana Sayfa Basitleştirme (`src/app/[locale]/page.tsx`):
```tsx
import { generatePageMetadata } from "@/hooks/server-metadata-utils";
import { validateLocale } from "@/hooks/locale-utils";
import { type SupportedLocale } from '@/constants/locales';
import type { Metadata } from "next";
import Home from "@/components/home/Home";
import { JsonLdComponent } from "@/components/JsonLdComponent";
import { generateLocaleParams } from "@/utils/generatePagesForLocale";
import { loadMetadataConfig } from "@/utils/metadata-config";

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validatedLocale = validateLocale(locale) as SupportedLocale;
  
  // Load metadata config instead of translations
  const metadataConfig = loadMetadataConfig();
  const localeConfig = metadataConfig[validatedLocale as keyof typeof metadataConfig];
  
  return generatePageMetadata({
    locale,
    path: '/',
    title: localeConfig?.title?.default || 'Default Title',
    description: localeConfig?.description || 'Default description',
    keywords: localeConfig?.keywords || ['default', 'keywords']
  });
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdComponent locale={locale} types = {['WebSite', 'Organization']} />
      <Home />
    </>
  )
}

```

#### Yeni Sayfa Ekleme (`src/app/[locale]/about/page.tsx`):
```tsx
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generatePageMetadata } from '@/hooks/server-metadata-utils'
import { AboutPage } from '@/components/about/AboutPage'
import { JsonLdComponent } from '@/components/JsonLdComponent';
import { generateLocaleParams } from '@/utils/generatePagesForLocale';


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AboutPage' })
  
  return generatePageMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    path: '/about'
  })
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdComponent locale={locale} types = {['Organization']} />
      <AboutPage />
    </>
  )
}
```


### 🗂️ Component Yapısı

Bu şablon modüler component yapısı kullanır (page dosyaları Page.tsx ile biten componentleri direkt olarak kullanır): 

#### Sayfa Component Yapısı:
```
src/components/[sayfa-adi]/
├── [SayfaAdi]Page.tsx          # Ana sayfa component'i
├── [Component1].tsx            # Sayfa alt component'leri
├── [Component2].tsx            # Sayfa alt component'leri
└── ...
```

#### Mevcut Component Klasörleri:
- `src/components/home/` - Ana sayfa component'leri
- `src/components/about/` - Hakkımızda sayfası
- `src/components/contact/` - İletişim sayfası
- `src/components/projects/` - Projeler sayfası
- `src/components/services/` - Hizmetler sayfaları
- `src/components/legal/` - Yasal sayfalar
- `src/components/ui/` - Genel UI component'leri

#### Sayfa Entegrasyonu:
```tsx
// src/app/[locale]/sayfa-adi/page.tsx
import SayfaAdiPage from '@/components/sayfa-adi/SayfaAdiPage';

export default function Page() {
  return <SayfaAdiPage />;
}
```

### 5. Test Et:
```bash
npm run dev
npm run build
npm run type-check
```

## 🔍 Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi |
| `npm run start` | Üretim sunucusu |
| `npm run lint` | Kod kalitesi kontrolü |
| `npm run type-check` | TypeScript kontrolü |

## 🛠️ Teknoloji Yığını

- **Framework:** Next.js 15
- **Dil:** TypeScript
- **Stil:** Tailwind CSS + Responsive Text System
- **UI:** Radix UI
- **Animasyon:** Framer Motion
- **i18n:** next-intl
- **Tema:** next-themes

## 📞 Destek

- Repository'de issue oluşturun
- Dokümantasyonu kontrol edin
- Yapılandırma dosyalarını inceleyin

---

**Bu şablon prompt olarak verilebilir ve hızlıca yeni projelere entegre edilebilir! 🚀**
