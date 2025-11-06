import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generatePageMetadata } from '@/hooks/server-metadata-utils'
import { BlogPage } from '@/components/blog/BlogPage'
import { JsonLdComponent } from '@/components/JsonLdComponent'
import { generateLocaleParams } from '@/utils/generatePagesForLocale'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  
  return generatePageMetadata({
    title: t('title'),
    description: t('subtitle'),
    locale,
    path: '/blog'
  })
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <>
      <JsonLdComponent locale={locale} types={['Blog']} />
      <BlogPage />
    </>
  )
}
