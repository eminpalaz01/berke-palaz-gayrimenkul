import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, type Locale } from './i18n';
import { pathnames } from '@/routes';

export default function middleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;
  const pathSegments = pathname.split('/').filter(Boolean);
  const potentialLocale = pathSegments[0];

 const isUnsupportedLocale = 
    potentialLocale &&
    potentialLocale.length === 2 &&
    !locales.includes(potentialLocale.toLowerCase() as Locale);

  if (isUnsupportedLocale) {
    // Strip the unsupported locale and redirect to the default locale
    const newPath = pathname.replace(`/${potentialLocale}`, '');
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${newPath || '/'}`;
    
    return NextResponse.redirect(url);
  }

  // If the locale is supported or missing, let the default next-intl middleware handle it
  const handleI18nRouting = createIntlMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
    pathnames: pathnames
  });

  return handleI18nRouting(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.txt$|.*\\.webmanifest$|.*\\.xml$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$|.*\\.json$).*)']
};
