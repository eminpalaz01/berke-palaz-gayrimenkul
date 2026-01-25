import { TermsOfServicePage } from '@/components/legal/TermsOfServicePage'
import { generateLocaleParams } from '@/utils/generatePagesForLocale'
import { Metadata } from 'next'

export async function generateStaticParams() {
  return generateLocaleParams()
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function TermsOfService() {
  return <TermsOfServicePage />
}
