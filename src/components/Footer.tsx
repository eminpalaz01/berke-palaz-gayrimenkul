"use client"

import Image from "next/image"
import { Link } from "@/navigation"
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Twitter, Linkedin, Home, Building, User, MessageCircle, FileText } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { useRuntimeConfig } from "@/utils/runtime-config"
import { CopyrightYear } from "@/components/ui/CopyrightYear"

export function Footer() {
  const { t, locale } = useTranslation()
  const { config } = useRuntimeConfig()
  
  const footerLinks = {
    quickLinks: [
      { nameKey: "home", href: "/", icon: Home },
      { nameKey: "listings", href: "/listings", icon: Building },
      { nameKey: "about", href: "/about", icon: User },
      { nameKey: "blog", href: "/blog", icon: FileText },
      { nameKey: "contact", href: "/contact", icon: MessageCircle },
    ],
    services: [
      { nameKey: "residentialSales", href: "/listings?type=sale" },
      { nameKey: "residentialRentals", href: "/listings?type=rent" },
      { nameKey: "commercialProperties", href: "/listings?category=commercial" },
      { nameKey: "investmentConsulting", href: "#" },
      { nameKey: "propertyValuation", href: "#" },
      { nameKey: "propertyManagement", href: "#" }
    ],
    legal: [
      { nameKey: "privacyPolicy", href: "/privacy-policy" },
      { nameKey: "termsOfService", href: "/terms-of-service" },
      { nameKey: "cookiePolicy", href: "/cookie-policy" }
    ]
  }

  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Company Info - Takes more space */}
            <div className="lg:col-span-5">
              <div className="mb-8">
                <Link href="/" className="inline-block mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Image
                        src="/images/logo-beyaz.png"
                        alt="Logo"
                        width={28}
                        height={28}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-2xl text-white">
                        Berke Palaz
                      </span>
                      <span className="text-blue-400 font-medium">
                        Gayrimenkul Danışmanı
                      </span>
                    </div>
                  </div>
                </Link>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide italic mb-6 text-blue-400">
                  {t('footer.dreamHomeWelcome')}
                </h3>
                <p className="text-gray-300 mb-8 leading-relaxed text-base lg:text-lg max-w-md">
                  {t('footer.footerDescription')}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                {config?.company?.phone && (
                  <div className="flex items-center space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                      <Phone className="h-5 w-5 text-blue-400" />
                    </div>
                    <a 
                      href={`tel:${config.company.phone}`}
                      className="text-gray-300 hover:text-white transition-colors font-medium"
                    >
                      {config.company.phone}
                    </a>
                  </div>
                )}
                
                {config?.company?.email && (
                  <div className="flex items-center space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                      <Mail className="h-5 w-5 text-blue-400" />
                    </div>
                    <a 
                      href={`mailto:${config.company.email}`}
                      className="text-gray-300 hover:text-white transition-colors font-medium break-all"
                    >
                      {config.company.email}
                    </a>
                  </div>
                )}
                
                {config?.company?.address?.[locale] && (
                  <div className="flex items-center space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                      <MapPin className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="text-gray-300 font-medium leading-relaxed">
                      {config.company.address[locale].full}
                    </span>
                  </div>
                )}
                
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors mt-1">
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-gray-300 font-medium">
                    {config?.workingHours ? (
                      <p>
                        {t(`days.${config.workingHours.days[0]}`)} - {t(`days.${config.workingHours.days[config.workingHours.days.length - 1]}`)}: {config.workingHours.opens} - {config.workingHours.closes}
                      </p>
                    ) : (
                      <>
                        <p>{t('footer.defaultWorkingHours')}</p>
                        <p>{t('footer.defaultSaturdayHours')}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Media */}
              {(config?.social?.instagramUrl || config?.social?.facebookUrl || config?.social?.twitterUrl || config?.social?.linkedinUrl) && (
                <div>
                  <h4 className="text-blue-400 font-semibold text-lg mb-4">
                    {t('footer.followUs')}
                  </h4>
                  <div className="flex space-x-3">
                    {config?.social?.instagramUrl && (
                      <a
                        href={config.social.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-600 hover:scale-110 transition-all duration-300"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-6 w-6" />
                      </a>
                    )}
                    {config?.social?.facebookUrl && (
                      <a
                        href={config.social.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-600 hover:scale-110 transition-all duration-300"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-6 w-6" />
                      </a>
                    )}
                    {config?.social?.twitterUrl && (
                      <a
                        href={config.social.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-600 hover:scale-110 transition-all duration-300"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-6 w-6" />
                      </a>
                    )}
                    {config?.social?.linkedinUrl && (
                      <a
                        href={config.social.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-600 hover:scale-110 transition-all duration-300"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-6 w-6" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Quick Links */}
                <div>
                  <h3 className="text-xl font-bold mb-6 text-white relative">
                    {t('footer.quickLinks')}
                    <div className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-600 rounded-full"></div>
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.quickLinks.map((link) => {
                      const IconComponent = link.icon
                      return (
                        <li key={link.nameKey}>
                          <Link
                            href={link.href}
                            className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 hover:translate-x-2 transition-all duration-200 group"
                          >
                            <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>{t(`navigation.${link.nameKey}`)}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* Services Links */}
                <div>
                  <h3 className="text-xl font-bold mb-6 text-white relative">
                    {t('footer.services')}
                    <div className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-600 rounded-full"></div>
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.services.map((link) => (
                      <li key={link.nameKey}>
                        <span className="text-gray-300 inline-block">
                          {t(`footer.${link.nameKey}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal & Newsletter */}
                <div>
                  <h3 className="text-xl font-bold mb-6 text-white relative">
                    {t('footer.legal')}
                    <div className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-600 rounded-full"></div>
                  </h3>
                  <ul className="space-y-3 mb-6">
                    {footerLinks.legal.map((link) => (
                      <li key={link.nameKey}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-blue-400 hover:translate-x-2 transition-all duration-200 inline-block relative group"
                        >
                          <span className="relative z-10">{t(`footer.${link.nameKey}`)}</span>
                          <div className="absolute inset-0 w-0 bg-blue-600/10 rounded group-hover:w-full transition-all duration-300 -z-0"></div>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Newsletter */}
                  {/* <div>
                    <h4 className="text-blue-400 font-semibold text-lg mb-4">
                      {t('footer.newsletter')}
                    </h4>
                    <p className="text-gray-400 text-sm mb-4">
                      {t('footer.newsletterDescription')}
                    </p>
                    <form className="flex">
                      <input
                        type="email"
                        placeholder={t('footer.emailPlaceholder')}
                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors"
                      >
                        {t('footer.subscribe')}
                      </button>
                    </form>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-700/50 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-gray-400 text-sm text-center lg:text-left">
              © <CopyrightYear /> Berke Palaz Gayrimenkul. {t('footer.allRightsReserved')}
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-6 text-sm">
              <Link 
                href="/privacy-policy" 
                className="text-gray-400 hover:text-blue-400 transition-colors px-3 py-1 rounded hover:bg-slate-800/50"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link 
                href="/terms-of-service" 
                className="text-gray-400 hover:text-blue-400 transition-colors px-3 py-1 rounded hover:bg-slate-800/50"
              >
                {t('footer.termsOfService')}
              </Link>
              <Link 
                href="/cookie-policy" 
                className="text-gray-400 hover:text-blue-400 transition-colors px-3 py-1 rounded hover:bg-slate-800/50"
              >
                {t('footer.cookiePolicy')}
              </Link>
              <button 
                onClick={() => {
                  // This will be handled by the DataManagement component
                  const event = new CustomEvent('openDataManagement')
                  window.dispatchEvent(event)
                }}
                className="text-gray-400 hover:text-blue-400 transition-colors px-3 py-1 rounded hover:bg-slate-800/50"
              >
                {t('footer.dataManagement')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
