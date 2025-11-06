"use client"

import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { Link } from "@/navigation"
import { motion } from "framer-motion"
import { useRuntimeConfig } from "@/utils/runtime-config"
import { useParams } from "next/navigation"
import Image from "next/image"

export function AboutSection() {
  const { t } = useTranslation()
  const { config } = useRuntimeConfig()
  const params = useParams()
  const locale = params.locale as string || 'tr'

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] md:h-[800px] lg:h-[700px]">
              <Image
                src="/images/profile.png"
                alt="Berke Palaz"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
            
            {/* Stats Overlay */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-11/12 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-1">10+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {t('about.experience')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-1">100+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {t('about.happyClients')}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:pt-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              {t('about.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base lg:text-lg leading-relaxed mb-8">
              {t('about.description')}
            </p>

            {/* Vision & Mission Cards */}
            <div className="space-y-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-700/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-100 dark:border-slate-600 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                      {t('about.vision')}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {t('about.visionText')}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-700/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-100 dark:border-slate-600 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                      {t('about.mission')}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {t('about.missionText')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Office Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 rounded-xl shadow-lg mb-8 text-white"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Image
                    src="/images/logo-beyaz.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold">
                    {config?.company?.officeName?.[locale] || 'Coldwell Banker Eagle'}
                  </h4>
                  <p className="text-sm text-blue-100">
                    {t('about.officeSlogan')}
                  </p>
                </div>
              </div>
              <div className="text-sm space-y-2 text-blue-50">
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{config?.company?.address?.[locale]?.full || 'Atatürk Mah. Sıtkı Yırcalı Cad. No:3/1A Karesi / Balıkesir'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a 
                    href={`tel:${config?.company?.officePhone || '+902665441111'}`}
                    className="hover:text-white transition-colors"
                  >
                    {config?.company?.officePhone || '+90 266 544 11 11'}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a 
                    href={`mailto:${config?.company?.officeEmail || 'eagle@cb.com.tr'}`}
                    className="hover:text-white transition-colors"
                  >
                    {config?.company?.officeEmail || 'eagle@cb.com.tr'}
                  </a>
                </p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white px-8 py-6 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/about">
                {t('common.learnMore')}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
