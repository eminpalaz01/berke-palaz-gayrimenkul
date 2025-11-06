"use client"

import { Modal } from "@/components/ui/Modal"
import { Listing } from "@/types/api"
import { MapPin, Home, Bed, Bath, Maximize, DollarSign, X } from "lucide-react"

interface ListingDetailModalProps {
  listing: Listing | null
  isOpen: boolean
  onClose: () => void
}

export function ListingDetailModal({ listing, isOpen, onClose }: ListingDetailModalProps) {
  if (!listing) return null

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="5xl">
      <div className="p-6 space-y-6">
        {/* Title */}
        <div className="border-b dark:border-slate-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {listing.title}
          </h2>
          <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400 mb-2">
            <MapPin className="h-4 w-4" />
            <span>{listing.location}</span>
          </div>
          <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
            {getPropertyTypeLabel(listing.propertyType)}
          </span>
        </div>

        {/* Cover Image */}
        {(listing.coverImage || (listing.images && listing.images.length > 0)) && (
          <div>
            <div className="aspect-video bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden">
              <img
                src={listing.coverImage || listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Images Gallery */}
        {listing.images && listing.images.length > 1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Tüm Görseller ({listing.images.length})
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {listing.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`${listing.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price & Type */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Fiyat</span>
            </div>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {formatPrice(listing.price, listing.currency)}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">İlan Tipi</span>
            </div>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {listing.type === 'sale' ? 'Satılık' : 'Kiralık'}
            </p>
          </div>
        </div>

        {/* Property Details */}
        {listing.propertyType !== "land" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Emlak Özellikleri
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg text-center">
                <Maximize className="h-5 w-5 mx-auto mb-2 text-gray-600 dark:text-slate-400" />
                <p className="text-sm text-gray-600 dark:text-slate-400">Alan</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.area} m²</p>
              </div>
              {listing.rooms && (
                <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg text-center">
                  <Bed className="h-5 w-5 mx-auto mb-2 text-gray-600 dark:text-slate-400" />
                  <p className="text-sm text-gray-600 dark:text-slate-400">Oda Sayısı</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.rooms}</p>
                </div>
              )}
              {listing.bathrooms && (
                <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg text-center">
                  <Bath className="h-5 w-5 mx-auto mb-2 text-gray-600 dark:text-slate-400" />
                  <p className="text-sm text-gray-600 dark:text-slate-400">Banyo</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.bathrooms}</p>
                </div>
              )}
              {listing.floor !== undefined && (
                <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg text-center">
                  <Home className="h-5 w-5 mx-auto mb-2 text-gray-600 dark:text-slate-400" />
                  <p className="text-sm text-gray-600 dark:text-slate-400">Kat</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.floor}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Açıklama
          </h3>
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </Modal>
  )
}
