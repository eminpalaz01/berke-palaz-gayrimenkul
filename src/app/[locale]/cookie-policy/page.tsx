import { CookiePolicyPage } from '@/components/legal/CookiePolicyPage'
import { generateLocaleParams } from '@/utils/generatePagesForLocale'

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default function CookiePolicy() {
  return <CookiePolicyPage />
}
