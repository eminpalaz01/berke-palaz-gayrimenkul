"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Award, Shield, CheckCircle, Users } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { AnimatedSectionHeader } from "@/components/ui/AnimatedSectionHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/navigation"

export function BrandsWeRepresentPage() {
  const { t } = useTranslation()
  const [isClient, setIsClient] = React.useState(false)

  // Client-side hydration için
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const features = [
    {
      id: "authorized-dealer",
      icon: Award,
      titleKey: "authorizedDealer",
      descriptionKey: "authorizedDealerDesc"
    },
    {
      id: "quality-guarantee",
      icon: Shield,
      titleKey: "qualityGuarantee",
      descriptionKey: "qualityGuaranteeDesc"
    },
    {
      id: "expert-support",
      icon: Users,
      titleKey: "expertSupport",
      descriptionKey: "expertSupportDesc"
    }
  ]

  const services = [
    {
      id: "product-consultation",
      titleKey: "productConsultation",
      descriptionKey: "productConsultationDesc"
    },
    {
      id: "technical-support",
      titleKey: "technicalSupport",
      descriptionKey: "technicalSupportDesc"
    },
    {
      id: "after-sales",
      titleKey: "afterSales",
      descriptionKey: "afterSalesDesc"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-concrete-50 dark:from-brand-concrete-900 dark:to-brand-concrete-800">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 dark:from-brand-primary/5 dark:to-brand-secondary/5" />
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="responsive-text-4xl lg:responsive-text-5xl font-bold text-brand-concrete-900 dark:text-white leading-tight">
                {t('services.brandsWeRepresent.title')}
              </h1>
              <p className="responsive-text-lg text-brand-concrete-600 dark:text-brand-concrete-300 leading-relaxed max-w-3xl mx-auto">
                {t('services.brandsWeRepresent.subtitle')}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="responsive-text-base">
                <Link href="/contact">
                  {t('services.brandsWeRepresent.productCatalog')}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="responsive-text-base">
                <Link href="/contact">
                  {t('services.brandsWeRepresent.getQuote')}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 bg-white dark:bg-brand-concrete-800">
        <div className="container-custom">
          <AnimatedSectionHeader
            title={t('services.brandsWeRepresent.brandsWeRepresent')}
            subtitle={t('services.brandsWeRepresent.brandsWeRepresentSubtitle')}
            className="text-center mb-16"
          />

          {/* Premium Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-12">
            {[
              { name: "AKG Gazbeton", logo: "/images/services/brands-we-represent/akg-gazbeton.png" },
              { name: "Aragonit", logo: "/images/services/brands-we-represent/aragonit.png" },
              { name: "Austrotherm", logo: "/images/services/brands-we-represent/austrotherm.png" },
              { name: "Bloksan", logo: "/images/services/brands-we-represent/bloksan.png" },
              { name: "BoardeX", logo: "/images/services/brands-we-represent/boardex.png" },
              { name: "Braas", logo: "/images/services/brands-we-represent/braas.png" },
              { name: "Çevik Kiremit", logo: "/images/services/brands-we-represent/cevikkiremit.png" },
              { name: "Demireller", logo: "/images/services/brands-we-represent/demireller.png" },
              { name: "Dev Blok", logo: "/images/services/brands-we-represent/dev-blok.png" },
              { name: "Habas", logo: "/images/services/brands-we-represent/habas.png" },
              { name: "Işık Ege", logo: "/images/services/brands-we-represent/isikege.png" },
              { name: "Işıklar", logo: "/images/services/brands-we-represent/isiklar.png" },
              { name: "İzocam", logo: "/images/services/brands-we-represent/izocam.png" },
              { name: "Kılıçoğlu", logo: "/images/services/brands-we-represent/kilicogluu.png" },
              { name: "Lafarge", logo: "/images/services/brands-we-represent/lafarge.png" },
              { name: "Neotherm", logo: "/images/services/brands-we-represent/neotherm.png" },
              { name: "Ode", logo: "/images/services/brands-we-represent/ode.png" },
              { name: "Okyap", logo: "/images/services/brands-we-represent/okyap.png" },
              { name: "Onduline", logo: "/images/services/brands-we-represent/onduline.png" },
              { name: "Protektor", logo: "/images/services/brands-we-represent/protektor.png" },
              { name: "Rigips", logo: "/images/services/brands-we-represent/rigips.png" },
              { name: "Sart Blok", logo: "/images/services/brands-we-represent/sartblok.png" },
              { name: "Somçim", logo: "/images/services/brands-we-represent/somcim.png" },
              { name: "Terraco", logo: "/images/services/brands-we-represent/terraco.png" },
              { name: "Ytong", logo: "/images/services/brands-we-represent/ytong.png" }
            ].map((brand, index) => {
              // F5 sonrası animasyon bozukluğunu tamamen önlemek için
              const shouldAnimate = isClient && typeof window !== 'undefined'
              
              return (
                <motion.div
                  key={brand.name}
                  initial={false} // F5 sonrası flash'ı önlemek için initial false
                  animate={{ opacity: 1, y: 0 }} // Her zaman görünür
                  whileInView={shouldAnimate ? { 
                    opacity: 1, 
                    y: 0,
                    scale: [0.95, 1] // Hafif scale animasyonu
                  } : undefined}
                  transition={shouldAnimate ? { 
                    duration: 0.4, 
                    delay: Math.min(index * 0.03, 0.8), // Daha kısa delay
                    ease: "easeOut"
                  } : { duration: 0 }}
                  viewport={shouldAnimate ? { 
                    once: true, 
                    margin: "-20px 0px", // Daha küçük margin
                    amount: 0.1 // Daha erken tetikleme
                  } : undefined}
                  className="group"
                >
                  <div className="relative bg-white dark:bg-brand-concrete-700 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-concrete-100 dark:border-brand-concrete-600 group-hover:border-brand-primary/20 dark:group-hover:border-brand-primary/30 group-hover:-translate-y-1">
                    {/* Logo Container */}
                    <div className="aspect-[3/2] flex items-center justify-center mb-3 md:mb-4 bg-gradient-to-br from-brand-concrete-50 to-white dark:from-brand-concrete-600 dark:to-brand-concrete-700 rounded-lg p-3 md:p-4">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={140}
                        height={90}
                        className="object-contain max-w-full max-h-full filter group-hover:brightness-110 transition-all duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Brand Name */}
                    <div className="text-center">
                      <h3 className="responsive-text-sm font-semibold text-brand-concrete-800 dark:text-brand-concrete-200 group-hover:text-brand-primary dark:group-hover:text-brand-secondary transition-colors duration-300">
                        {brand.name}
                      </h3>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 dark:from-brand-primary/20 dark:to-brand-secondary/20 px-6 py-3 rounded-full">
              <div className="w-2 h-2 bg-brand-primary rounded-full opacity-80"></div>
              <span className="responsive-text-sm font-medium text-brand-concrete-700 dark:text-brand-concrete-300">
                {t('services.brandsWeRepresent.brandTrustBadge')}
              </span>
              <div className="w-2 h-2 bg-brand-secondary rounded-full opacity-80"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-brand-concrete-50 dark:bg-brand-concrete-900">
        <div className="container-custom">
          <AnimatedSectionHeader
            title={t('services.brandsWeRepresent.dealershipAdvantages')}
            subtitle={t('services.brandsWeRepresent.dealershipAdvantagesSubtitle')}
            className="text-center mb-16"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full flex items-center justify-center">
                  <feature.icon className="w-10 h-10 text-brand-primary" />
                </div>
                <h3 className="responsive-text-xl font-semibold mb-4 text-brand-concrete-900 dark:text-white">
                  {t(`services.brandsWeRepresent.${feature.titleKey}`)}
                </h3>
                <p className="responsive-text-base text-brand-concrete-600 dark:text-brand-concrete-300">
                  {t(`services.brandsWeRepresent.${feature.descriptionKey}`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-brand-concrete-800">
        <div className="container-custom">
          <AnimatedSectionHeader
            title={t('services.brandsWeRepresent.ourServices')}
            subtitle={t('services.brandsWeRepresent.ourServicesSubtitle')}
            className="text-center mb-16"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-white to-brand-concrete-50 dark:from-brand-concrete-700 dark:to-brand-concrete-800">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-brand-primary" />
                    </div>
                    <CardTitle className="responsive-text-xl">{t(`services.brandsWeRepresent.${service.titleKey}`)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="responsive-text-base text-center">
                      {t(`services.brandsWeRepresent.${service.descriptionKey}`)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-primary to-brand-secondary">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="responsive-text-3xl lg:responsive-text-4xl font-bold text-white">
              {t('services.brandsWeRepresent.ctaTitle')}
            </h2>
            <p className="responsive-text-lg text-white/90">
              {t('services.brandsWeRepresent.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="responsive-text-base">
                <Link href="/contact">
                  {t('services.brandsWeRepresent.downloadCatalog')}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="responsive-text-base border-white hover:bg-white hover:text-brand-primary">
                <Link href="tel:+905466991701">
                  {t('services.brandsWeRepresent.callNow')}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
