"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Bed, Bath, Square, MapPin, Search, Loader2 } from "lucide-react"
import { publicListingsApi } from "@/lib/api-client"
import { Listing } from "@/types/api"

export function ListingsPage() {
  const { t } = useTranslation()
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true)
        const response = await publicListingsApi.getAll({
          type: selectedType === "all" ? undefined : selectedType,
          search: searchTerm,
          locale: 'tr'
        })
        
        if (response.success && response.data) {
          setListings(response.data)
        } else {
          console.error('API Error:', response.error)
          setListings([])
        }
      } catch (error) {
        console.error('Fetch error:', error)
        setListings([])
      } finally {
        setLoading(false)
      }
    }

    const delayDebounceFn = setTimeout(() => {
      fetchListings()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, selectedType])

  const filterTypes = [
    { key: "all", label: "Tümü" },
    { key: "sale", label: t('listings.forSale') },
    { key: "rent", label: t('listings.forRent') }
  ]

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "sale": return t('listings.forSale')
      case "rent": return t('listings.forRent')
      default: return type
    }
  }

  const getPropertyTypeLabel = (propertyType: string) => {
    switch (propertyType) {
      case "apartment": return "Daire"
      case "villa": return "Villa"
      case "office": return "Ofis"
      case "land": return "Arsa"
      case "commercial": return "Ticari"
      default: return propertyType
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toLocaleString('tr-TR')}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 md:pt-20">
      {/* Header */}
      <section className="bg-white dark:bg-slate-800 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-4">
              {t('listings.title')}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t('listings.subtitle')}
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Konum veya ilan başlığı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Type Filter */}
              <div className="flex flex-wrap gap-2">
                {filterTypes.map((type) => (
                  <Button
                    key={type.key}
                    variant={selectedType === type.key ? "default" : "outline"}
                    onClick={() => setSelectedType(type.key)}
                    className={`${
                      selectedType === type.key
                        ? "bg-blue-600 text-white"
                        : "border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
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
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {getPropertyTypeLabel(listing.propertyType)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                      {listing.title}
                    </h3>
                    
                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {listing.location}
                    </div>

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
                      </div>
                    )}

                    {listing.propertyType === "land" && (
                      <div className="flex items-center gap-1 mb-4 text-sm text-slate-600 dark:text-slate-300">
                        <Square className="h-4 w-4 text-blue-600" />
                        <span>{listing.area} {t('listings.sqm')}</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(listing.price, listing.currency)}
                        {listing.type === 'rent' && (
                          <span className="text-base font-normal text-slate-500 dark:text-slate-400 ml-1">
                            {t('listings.perMonth')}
                          </span>
                        )}
                      </p>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {t('common.viewDetails')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && listings.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Aradığınız kriterlere uygun ilan bulunamadı.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
