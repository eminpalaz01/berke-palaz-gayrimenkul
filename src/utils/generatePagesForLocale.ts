export function generateLocaleParams(locales: string[] = ['tr', 'en']) {
  return locales.map((locale) => ({ locale }))
}