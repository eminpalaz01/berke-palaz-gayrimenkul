import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generatePageMetadata } from '@/hooks/server-metadata-utils'
import { AboutPage } from '@/components/about/AboutPage'
import { JsonLdComponent } from '@/components/JsonLdComponent';
import { generateLocaleParams } from '@/utils/generatePagesForLocale';


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' })
  
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