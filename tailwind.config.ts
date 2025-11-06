import type { Config } from "tailwindcss"
// @ts-expect-error - tailwindcss-textshadow does not have type definitions
import textShadow from 'tailwindcss-textshadow'

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        'xs': '475px',
        'sm': '600px',
        'desktop': '1480px',
      },
      colors: {
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
        // berkepalaz brand colors - Logo ve sektöre uygun renk paleti
        brand: {
          // Ana marka renkleri
          primary: "#6C757D", // Koyu gri - güven ve profesyonellik
          secondary: "#E67E22", // Turuncu - enerji ve dinamizm (daha yumuşak)
          // selale-beton-logo-red: "#dd0f24"
          // Beton sektörüne uygun gri tonları
          concrete: {
            50: "#F8F9FA",   // Çok açık gri
            100: "#E9ECEF",  // Açık gri
            200: "#DEE2E6",  // Orta açık gri
            300: "#CED4DA",  // Orta gri
            400: "#ADB5BD",  // Koyu orta gri
            500: "#6C757D",  // Ana gri
            600: "#495057",  // Koyu gri
            700: "#343A40",  // Çok koyu gri
            800: "#212529",  // Neredeyse siyah
            900: "#1A1D20",  // En koyu
          },
          
          // Vurgu renkleri (sadece gerektiğinde kullanın)
          accent: {
            blue: "#3498DB",    // Açık mavi - sadece bilgi amaçlı
            green: "#27AE60",   // Yeşil - başarı mesajları
            red: "#E74C3C",     // Kırmızı - hata/uyarı
            yellow: "#F39C12",  // Sarı - dikkat
          },
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-in": "slide-in 0.5s ease-out",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Responsive typography system
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        
        // Mobile-first responsive typography
        'mobile-xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'mobile-sm': ['0.75rem', { lineHeight: '1rem' }],
        'mobile-base': ['0.875rem', { lineHeight: '1.25rem' }],
        'mobile-lg': ['1rem', { lineHeight: '1.5rem' }],
        'mobile-xl': ['1.125rem', { lineHeight: '1.75rem' }],
        'mobile-2xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'mobile-3xl': ['1.5rem', { lineHeight: '2rem' }],
        'mobile-4xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'mobile-5xl': ['2.25rem', { lineHeight: '2.5rem' }],
        
        // Landscape mobile (shorter screens)
        'landscape-xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'landscape-sm': ['0.75rem', { lineHeight: '1rem' }],
        'landscape-base': ['0.8125rem', { lineHeight: '1.125rem' }],
        'landscape-lg': ['0.9375rem', { lineHeight: '1.375rem' }],
        'landscape-xl': ['1rem', { lineHeight: '1.5rem' }],
        'landscape-2xl': ['1.125rem', { lineHeight: '1.625rem' }],
        'landscape-3xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'landscape-4xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      }
    },
  },
  plugins: [
    textShadow
  ],
} satisfies Config

export default config
