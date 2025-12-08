"use client"

import { Modal } from "@/components/ui/Modal"
import { Listing } from "@/types/api"
import { MapPin, Home, Bed, Bath, Maximize, DollarSign, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface ListingDetailModalProps {
  listing: Listing | null
  isOpen: boolean
  onClose: () => void
}

export function ListingDetailModal({ listing, isOpen, onClose }: ListingDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!listing) return null

  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : listing.coverImage 
    ? [listing.coverImage] 
    : []

  const formatPrice = (price: number, currency: string) => {
    const currencySymbols: { [key: string]: string } = {
      'TRY': '₺',
      'USD': '$',
      'EUR': '€'
    }
    const symbol = currencySymbols[currency] || currency
    return `${symbol} ${price.toLocaleString('tr-TR')}`
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="7xl">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-6 min-h-[600px]">
        {/* Left Side - Image Gallery (Takes 3/5 of space on large screens) */}
        <div className="lg:col-span-3 bg-black relative">
          {images.length > 0 ? (
            <>
              {/* Main Image Display */}
              <div className="relative aspect-[16/9] lg:aspect-auto lg:h-full w-full bg-black">
                <img
                  src={images[currentImageIndex]}
                  alt={`${listing.title} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                
                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-lg"
                      aria-label="Önceki resim"
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-900 dark:text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-lg"
                      aria-label="Sonraki resim"
                    >
                      <ChevronRight className="h-6 w-6 text-gray-900 dark:text-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Navigation - Only visible on large screens */}
              {images.length > 1 && (
                <div className="hidden lg:block absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-center px-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? 'border-blue-500 scale-110'
                            : 'border-white/30 hover:border-white/60'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-slate-700">
              <p className="text-gray-500 dark:text-slate-400">Görsel bulunamadı</p>
            </div>
          )}
        </div>

        {/* Right Side - Property Details (Takes 2/5 of space on large screens) */}
        <div className="lg:col-span-2 p-4 lg:p-6 overflow-y-auto max-h-[600px] space-y-4 lg:space-y-6">
          {/* Title & Location */}
          <div>
            <h2 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-3">
              {listing.title}
            </h2>
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400 mb-2 lg:mb-3">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs lg:text-sm">{listing.location}</span>
            </div>
            <span className="inline-block px-2 lg:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs lg:text-sm font-medium">
              {getPropertyTypeLabel(listing.propertyType)}
            </span>
          </div>

          {/* Price & Type Cards */}
          <div className="grid grid-cols-2 gap-2 lg:gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 lg:p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-1 lg:gap-2 text-blue-600 dark:text-blue-400 mb-1">
                <DollarSign className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="text-[10px] lg:text-xs font-medium">Fiyat</span>
              </div>
              <p className="text-base lg:text-xl font-bold text-blue-700 dark:text-blue-300">
                {formatPrice(listing.price, listing.currency)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-3 lg:p-4 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-1 lg:gap-2 text-purple-600 dark:text-purple-400 mb-1">
                <Home className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="text-[10px] lg:text-xs font-medium">İlan Tipi</span>
              </div>
              <p className="text-base lg:text-xl font-bold text-purple-700 dark:text-purple-300">
                {listing.type === 'sale' ? 'Satılık' : 'Kiralık'}
              </p>
            </div>
          </div>

          {/* Property Features */}
          {listing.propertyType !== "land" && (
            <div>
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2 lg:mb-3">
                Emlak Özellikleri
              </h3>
              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                <div className="bg-gray-50 dark:bg-slate-700/50 p-2 lg:p-3 rounded-lg border border-gray-200 dark:border-slate-600">
                  <Maximize className="h-4 w-4 lg:h-5 lg:w-5 mb-1 lg:mb-2 text-gray-600 dark:text-slate-400" />
                  <p className="text-[10px] lg:text-xs text-gray-600 dark:text-slate-400">Alan</p>
                  <p className="text-sm lg:text-lg font-bold text-gray-900 dark:text-white">{listing.area} m²</p>
                </div>
                {(listing.hall || listing.rooms) && (
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-2 lg:p-3 rounded-lg border border-gray-200 dark:border-slate-600">
                    <Bed className="h-4 w-4 lg:h-5 lg:w-5 mb-1 lg:mb-2 text-gray-600 dark:text-slate-400" />
                    <p className="text-[10px] lg:text-xs text-gray-600 dark:text-slate-400">Oda Sayısı</p>
                    <p className="text-sm lg:text-lg font-bold text-gray-900 dark:text-white">{listing.rooms || 0}+{listing.hall || 0}</p>
                  </div>
                )}
                {listing.bathrooms && (
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-2 lg:p-3 rounded-lg border border-gray-200 dark:border-slate-600">
                    <Bath className="h-4 w-4 lg:h-5 lg:w-5 mb-1 lg:mb-2 text-gray-600 dark:text-slate-400" />
                    <p className="text-[10px] lg:text-xs text-gray-600 dark:text-slate-400">Banyo</p>
                    <p className="text-sm lg:text-lg font-bold text-gray-900 dark:text-white">{listing.bathrooms}</p>
                  </div>
                )}
                {listing.floor !== undefined && (
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-2 lg:p-3 rounded-lg border border-gray-200 dark:border-slate-600">
                    <Home className="h-4 w-4 lg:h-5 lg:w-5 mb-1 lg:mb-2 text-gray-600 dark:text-slate-400" />
                    <p className="text-[10px] lg:text-xs text-gray-600 dark:text-slate-400">Kat</p>
                    <p className="text-sm lg:text-lg font-bold text-gray-900 dark:text-white">{listing.floor}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2 lg:mb-3">
              Açıklama
            </h3>
            <div className="bg-gray-50 dark:bg-slate-700/50 p-3 lg:p-4 rounded-lg border border-gray-200 dark:border-slate-600">
              <p className="text-xs lg:text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {listing.description}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-3 lg:pt-4 border-t dark:border-slate-700">
            <button
              onClick={onClose}
              className="w-full px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm lg:text-base font-medium transition-all shadow-md hover:shadow-lg"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
