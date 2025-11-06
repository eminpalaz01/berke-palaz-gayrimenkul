"use client"

import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { Link } from "@/navigation"
import { motion } from "framer-motion"
import { Bed, Bath, Square } from "lucide-react"

export function FeaturedListings() {
  const { t } = useTranslation()

  const listings = [
    {
      id: 1,
      title: t('listings.modernApartment'),
      location: "Beşiktaş, İstanbul",
      price: "₺ 5.800.000",
      type: t('listings.forSale'),
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rooms: "3+1",
      bathrooms: 2,
      area: 150,
      description: t('listings.modernApartmentDesc')
    },
    {
      id: 2,
      title: t('listings.luxuryVilla'),
      location: "Çeşme, İzmir",
      price: "₺ 45.000",
      priceUnit: t('listings.perMonth'),
      type: t('listings.forRent'),
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rooms: "5+2",
      bathrooms: 4,
      area: 350,
      description: t('listings.luxuryVillaDesc')
    },
    {
      id: 3,
      title: t('listings.studioApartment'),
      location: "Kadıköy, İstanbul",
      price: "₺ 1.850.000",
      type: t('listings.forSale'),
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rooms: "1+0",
      bathrooms: 1,
      area: 55,
      description: t('listings.studioApartmentDesc')
    }
  ]

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
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {listing.type}
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
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                    {listing.description}
                  </p>

                  {/* Property Details */}
                  <div className="flex items-center flex-wrap gap-4 mb-4 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4 text-blue-600" />
                      <span>{listing.rooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4 text-blue-600" />
                      <span>{listing.bathrooms} {t('listings.bathrooms')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4 text-blue-600" />
                      <span>{listing.area} {t('listings.sqm')}</span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-auto">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {listing.price}
                    {listing.priceUnit && (
                      <span className="text-base font-normal text-slate-500 dark:text-slate-400 ml-1">
                        {listing.priceUnit}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
