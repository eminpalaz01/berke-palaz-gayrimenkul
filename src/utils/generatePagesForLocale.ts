import { SUPPORTED_LOCALES } from "@/constants/locales";


export function generateLocaleParams(locales: string[] = SUPPORTED_LOCALES) {
  return locales.map((locale) => ({ locale }))
}