"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { Link } from "@/navigation"
import { motion } from "framer-motion"
import { Bed, Bath, Square, Loader2, Home } from "lucide-react"
import { publicListingsApi } from "@/lib/api-client"
import { Listing } from "@/types/api"

export function FeaturedListings() {
  const { t } = useTranslation()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      const response = await publicListingsApi.getAll({
        locale: 'tr'
      })
      
      if (response.success && response.data) {
        // Get first 3 active listings
        setListings(response.data.slice(0, 3))
      }
      setLoading(false)
    }

    fetchListings()
  }, [])

  const formatPrice = (price: number, currency: string) => {
    const currencySymbols: { [key: string]: string } = {
      'TRY': '₺',
      'USD': '$',
      'EUR': '€'
    }
    const symbol = currencySymbols[currency] || currency
    return `${symbol} ${price.toLocaleString('tr-TR')}`
  }

  const getTypeLabel = (type: string) => {
    return type === 'sale' ? t('listings.forSale') : t('listings.forRent')
  }

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
            {t('listings.title')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t('listings.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={listing.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                  alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {getTypeLabel(listing.type)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                    {listing.location}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">
                    {listing.description}
                  </p>

                  {/* Property Details */}
                  {listing.propertyType !== "land" && (
                    <div className="flex items-center flex-wrap gap-4 mb-4 text-sm text-slate-600 dark:text-slate-300">
                      {listing.rooms && listing.rooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4 text-blue-600" />
                          <span>{listing.rooms} oda</span>
                        </div>
                      )}
                      {listing.bathrooms && listing.bathrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4 text-blue-600" />
                          <span>{listing.bathrooms} {t('listings.bathrooms')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4 text-blue-600" />
                        <span>{listing.area} {t('listings.sqm')}</span>
                      </div>
                      {listing.floor !== undefined && listing.floor !== null && (
                        <div className="flex items-center gap-1">
                          <Home className="h-4 w-4 text-blue-600" />
                          <span>{listing.floor}. kat</span>
                        </div>
                      )}
                    </div>
                  )}
                  {listing.propertyType === "land" && (
                    <div className="flex items-center gap-1 mb-4 text-sm text-slate-600 dark:text-slate-300">
                      <Square className="h-4 w-4 text-blue-600" />
                      <span>{listing.area} {t('listings.sqm')}</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mt-auto">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(listing.price, listing.currency)}
                    {listing.type === 'rent' && (
                      <span className="text-base font-normal text-slate-500 dark:text-slate-400 ml-1">
                        {t('listings.perMonth')}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 font-semibold"
          >
            <Link href="/listings">
              {t('listings.viewAll')}
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
