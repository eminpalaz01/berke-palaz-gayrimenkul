import { PrivacyPolicyPage } from '@/components/legal/PrivacyPolicyPage'
import { generateLocaleParams } from '@/utils/generatePagesForLocale'

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />
}
