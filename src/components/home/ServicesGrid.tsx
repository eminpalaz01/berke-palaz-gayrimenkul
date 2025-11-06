"use client"

import { motion } from "framer-motion"
import { Link } from "@/navigation"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useCommonTranslation, useServicesTranslation } from "@/hooks/useTranslation"

const services = [
  {
    id: "readyMix",
    titleKey: "readyMix.title",
    descriptionKey: "readyMix.description",
    image: "/images/hazir-beton.png",
    href: "/services/ready-mix-concrete",
    color: "from-brand-secondary to-brand-accent-red"
  },
  {
    id: "construction",
    titleKey: "construction.title",
    descriptionKey: "construction.description",
    image: "/images/calisma-sahasi-ornegi.jpg",
    href: "/services/construction",
    color: "from-brand-primary to-brand-accent-blue"
  },
  {
    id: "materials",
    titleKey: "materials.title",
    descriptionKey: "materials.description",
    image: "/images/yapi-malzemeleri.png",
    href: "/services/construction-materials",
    color: "from-brand-accent-green to-emerald-600"
  },
  {
    id: "quarry",
    titleKey: "quarry.title",
    descriptionKey: "quarry.description",
    image: "/images/tas-ocagi.png",
    href: "/services/quarry",
    color: "from-brand-concrete-600 to-brand-concrete-800"
  }
]

export function ServicesGrid() {
  const { t } = useServicesTranslation()
  const { viewMore } = useCommonTranslation()
  return (
    <section data-section="services" className="py-20 bg-brand-concrete-50 dark:bg-brand-concrete-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="responsive-heading-lg font-heading font-bold text-brand-concrete-900 dark:text-white mb-6">
            {t('title')}
          </h2>
          <p className="responsive-text-xl text-brand-concrete-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={service.href} className="block">
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/5]">
                  {/* Background Image */}
                  <Image
                    src={service.image}
                    alt={t(service.titleKey)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300 z-10`} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white z-20">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="responsive-heading-sm font-heading font-bold mb-3 text-shadow-md">
                        {t(service.titleKey)}
                      </h3>
                      
                      <p className="responsive-text-lg opacity-95 mb-6 leading-relaxed text-shadow-sm">
                        {t(service.descriptionKey)}
                      </p>

                      <div className="flex items-center font-semibold text-white group-hover:text-yellow-300 transition-colors duration-300">
                        <span className="mr-2">{viewMore}</span>
                        <ArrowRight className="h-5 w-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-20" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="responsive-text-lg text-brand-concrete-600 dark:text-gray-300 mb-6">
            {t('learnMoreQuestion')}
          </p>
          <Link 
            href="/hizmetler"
            className="inline-flex items-center px-8 py-4 bg-brand-secondary hover:bg-brand-secondary/90 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            {t('viewAllServices')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div> */}
      </div>
    </section>
  )
}
