import { TermsOfServicePage } from '@/components/legal/TermsOfServicePage'
import { generateLocaleParams } from '@/utils/generatePagesForLocale'

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default function TermsOfService() {
  return <TermsOfServicePage />
}
