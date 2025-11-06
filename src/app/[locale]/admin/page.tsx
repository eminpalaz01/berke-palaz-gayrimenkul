import { Metadata } from 'next'
import { generatePageMetadata } from '@/hooks/server-metadata-utils'
import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { generateLocaleParams } from '@/utils/generatePagesForLocale'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  return generatePageMetadata({
    title: 'Yönetim Paneli',
    description: 'Admin Paneli',
    locale,
    path: '/admin'
  })
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default async function Admin({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  
  return <AdminPageWrapper />
}
