import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "../globals.css"
import { DarkModeProvider } from "@/components/providers/DarkModeProvider"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { validateLocale } from '@/hooks/locale-utils'
import { generateLayoutMetadata } from '@/hooks/server-metadata-utils'
import ScrollToTop from "@/components/ui/ScrollToTop";
import GlobalErrorProvider from '@/components/GlobalErrorProvider'
import { ClientLayout } from '@/components/ClientLayout'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins"
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateLayoutMetadata(locale)
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',

    // Tarayıcı üst çubuğu ve dark/light mod teması
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#000000be' },
    ],

    // Apple-specific meta tags
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: "Berke Palaz Gayrimenkul",
    }
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  // Validate that the incoming `locale` parameter is valid
  const validatedLocale = validateLocale(locale)
  setRequestLocale(validatedLocale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale: validatedLocale });
  return (
    <html lang={validatedLocale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={validatedLocale} messages={messages}>
          <DarkModeProvider>
            <GlobalErrorProvider>
              <ClientLayout>
                <ScrollToTop />
                <div className="relative flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                  <ScrollToTopButton />
                </div>
                {/* {process.env.NODE_ENV === 'development' && <TestErrorComponent />} */}
              </ClientLayout>
            </GlobalErrorProvider>
          </DarkModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
