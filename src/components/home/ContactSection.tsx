"use client"

import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { Link } from "@/navigation"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, User, Building2 } from "lucide-react"
import { useRuntimeConfig } from "@/utils/runtime-config"
import { useParams } from "next/navigation"

export function ContactSection() {
  const { t } = useTranslation()
  const { config } = useRuntimeConfig()
  const params = useParams()
  const locale = params.locale as string || 'tr'

  return (
    <section className="py-16 sm:py-24 bg-slate-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Consultant Info */}
            <div className="border-b border-slate-700 pb-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400" />
                Danışman Bilgileri
              </h3>
              <div className="space-y-3 ml-7">
                <p className="text-lg font-semibold">Berke Palaz</p>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <a 
                    href={`tel:${config?.company?.phone || '+905051529818'}`}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {config?.company?.phone || '+90 505 152 98 18'}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <a 
                    href={`mailto:${config?.company?.email || 'berke.palaz@cb.com.tr'}`}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {config?.company?.email || 'berke.palaz@cb.com.tr'}
                  </a>
                </div>
              </div>
            </div>

            {/* Office Info */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-400" />
                {t('contact.officeInfo')}
              </h3>
              <div className="space-y-4 ml-7">
                <p className="text-lg font-semibold">
                  {config?.company?.officeName?.[locale] || 'Coldwell Banker Eagle'}
                </p>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                  <p className="text-slate-300">
                    {config?.company?.address?.[locale]?.full || 'Atatürk Mah. Sıtkı Yırcalı Cad. No:3/1A Karesi / Balıkesir'}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <a 
                    href={`tel:${config?.company?.officePhone || '+902665441111'}`}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {config?.company?.officePhone || '+90 266 544 11 11'}
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <a 
                    href={`mailto:${config?.company?.officeEmail || 'eagle@cb.com.tr'}`}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {config?.company?.officeEmail || 'eagle@cb.com.tr'}
                  </a>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 text-blue-400 mt-1" />
                  <div className="text-slate-300">
                    {config?.company?.officeWorkingHours ? (
                      <>
                        <p>
                          {t(`days.${config.company.officeWorkingHours.weekdays.days[0]}`)} - {t(`days.${config.company.officeWorkingHours.weekdays.days[config.company.officeWorkingHours.weekdays.days.length - 1]}`)}: {config.company.officeWorkingHours.weekdays.opens} - {config.company.officeWorkingHours.weekdays.closes}
                        </p>
                        <p>
                          {t(`days.${config.company.officeWorkingHours.saturday.days[0]}`)}: {config.company.officeWorkingHours.saturday.opens} - {config.company.officeWorkingHours.saturday.closes}
                        </p>
                        {config.company.officeWorkingHours.sunday && (
                          <p>
                            {t(`days.${config.company.officeWorkingHours.sunday.days[0]}`)}: {config.company.officeWorkingHours.sunday.opens === 'Closed' ? t('contact.closed') : `${config.company.officeWorkingHours.sunday.opens} - ${config.company.officeWorkingHours.sunday.closes}`}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                        <p>Cumartesi: 10:00 - 16:00</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-slate-800 p-8 rounded-lg"
          >
            <h3 className="text-2xl font-bold mb-6">{t('contact.getInTouch')}</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={t('contact.form.namePlaceholder')}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t('contact.form.emailPlaceholder')}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  {t('contact.form.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder={t('contact.form.phonePlaceholder')}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder={t('contact.form.messagePlaceholder')}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <Button
                type="button"
                onClick={() => {
                  const name = (document.getElementById('name') as HTMLInputElement)?.value || ''
                  const email = (document.getElementById('email') as HTMLInputElement)?.value || ''
                  const phone = (document.getElementById('phone') as HTMLInputElement)?.value || ''
                  const message = (document.getElementById('message') as HTMLTextAreaElement)?.value || ''
                  
                  const subject = encodeURIComponent('İletişim Talebi - ' + (name || 'Ziyaretçi'))
                  const body = encodeURIComponent(
                    `Merhaba,\n\n` +
                    `Ad Soyad: ${name}\n` +
                    `E-posta: ${email}\n` +
                    `Telefon: ${phone}\n\n` +
                    `Mesaj:\n${message}\n\n` +
                    `İyi günler dilerim.`
                  )
                  
                  const mailtoLink = `mailto:${config?.company?.email || 'berke.palaz@cb.com.tr'}?subject=${subject}&body=${body}`
                  window.open(mailtoLink, '_blank', 'noopener,noreferrer')
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold"
              >
                {t('contact.form.submit')}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white px-8 py-6 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Link href="/contact">
              {t('common.viewMore')}
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
