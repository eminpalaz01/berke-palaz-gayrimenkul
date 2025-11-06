import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import type { Metadata } from 'next'
import Link from 'next/link'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins"
})

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default async function NotFound() {
  
  const locale = 'tr';
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <main className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="py-20 lg:py-32  p-4">
            <h1 className="text-6xl font-bold text-primary sm:text-8xl md:text-9xl">404</h1>
            <p className="mt-4 text-xl font-semibold sm:text-2xl md:text-3xl">Sayfa Bulunamadı</p>
            <p className="mt-2 text-muted-foreground sm:text-lg">
              Üzgünüz, aradığınız sayfa mevcut değil veya kaldırılmış olabilir.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
