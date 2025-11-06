import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ContactPage } from '@/components/contact/ContactPage'
import { generatePageMetadata } from '@/hooks/server-metadata-utils'
import { generateLocaleParams } from '@/utils/generatePagesForLocale';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' })
  
  return generatePageMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    path: '/contact'
  })
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default async function Contact() {
  return <ContactPage />
}
