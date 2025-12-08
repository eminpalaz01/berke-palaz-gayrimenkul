"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Loader2, Upload } from "lucide-react"
import { Listing, UpdateListingDto } from "@/types/api"

interface EditListingModalProps {
  listing: Listing
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, data: UpdateListingDto) => Promise<void>
}

export function EditListingModal({ listing, isOpen, onClose, onSave }: EditListingModalProps) {
  const [formData, setFormData] = useState<UpdateListingDto>({
    title: listing.title,
    description: listing.description,
    location: listing.location,
    price: listing.price,
    currency: listing.currency,
    type: listing.type,
    propertyType: listing.propertyType,
    area: listing.area,
    rooms: listing.rooms,
    bathrooms: listing.bathrooms,
    floor: listing.floor,
    buildingAge: listing.buildingAge,
    hall: listing.hall,
    features: listing.features,
    images: listing.images,
    status: listing.status
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>(listing.coverImage || '')
  const [imagePreviews, setImagePreviews] = useState<string[]>(listing.images || [])
  const [newImageUrl, setNewImageUrl] = useState<string>('')

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('type', 'listing')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      const result = await response.json()

      if (result.success && result.data?.url) {
        setImagePreview(result.data.url)
        setNewImageUrl(result.data.url)
      } else {
        console.error('Upload failed:', result.error)
        alert('Resim yüklenirken bir hata oluştu: ' + (result.error || 'Bilinmeyen hata'))
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Resim yüklenirken bir hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  // Handle ESC key press and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !saving) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, saving])

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: listing.title,
        description: listing.description,
        location: listing.location,
        price: listing.price,
        currency: listing.currency,
        type: listing.type,
        propertyType: listing.propertyType,
        area: listing.area,
        rooms: listing.rooms,
        bathrooms: listing.bathrooms,
        floor: listing.floor,
        buildingAge: listing.buildingAge,
        hall: listing.hall,
        features: listing.features,
        images: listing.images,
        status: listing.status
      })
      setImagePreview(listing.coverImage || '')
      setImagePreviews(listing.images || [])
      setNewImageUrl('')
    }
  }, [listing, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const dataToSave = { ...formData }
      if (newImageUrl) {
        dataToSave.coverImage = newImageUrl
      }
      await onSave(listing.id, dataToSave)
      onClose()
    } catch (error) {
      console.error('Error saving listing:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !saving) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold dark:text-white">İlan Düzenle</h2>
          <button 
            onClick={onClose} 
            disabled={saving}
            className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Kapak Resmi
            </label>
            <div className="space-y-2">
              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {uploading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {uploading ? 'Resim yükleniyor...' : 'Yeni resim seçmezseniz mevcut resim korunur'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Başlık *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Açıklama *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Konum *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Örn: İstanbul, Kadıköy, Fenerbahçe Mahallesi"
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Şehir, İlçe, Mahalle bilgilerini virgülle ayırarak giriniz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Fiyat *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Para Birimi *
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as 'TRY' | 'USD' | 'EUR' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="TRY">TRY (₺)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                İlan Tipi *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sale' | 'rent' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="sale">Satılık</option>
                <option value="rent">Kiralık</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Emlak Tipi *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as 'apartment' | 'villa' | 'office' | 'land' | 'commercial' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="apartment">Daire</option>
                <option value="villa">Villa</option>
                <option value="office">Ofis</option>
                <option value="land">Arsa</option>
                <option value="commercial">Ticari</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Alan (m²) *
              </label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Oda Sayısı
              </label>
              <input
                type="number"
                value={formData.rooms || ''}
                onChange={(e) => setFormData({ ...formData, rooms: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Banyo
              </label>
              <input
                type="number"
                value={formData.bathrooms || ''}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Kat
              </label>
              <input
                type="number"
                value={formData.floor || ''}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Salon
              </label>
              <input
                type="text"
                value={formData.hall || ''}
                onChange={(e) => setFormData({ ...formData, hall: Number(e.target.value) })}
                placeholder="Örn: 1+1, 2+1, 3+1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Durum
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'sold' | 'rented' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="sold">Satıldı</option>
                <option value="rented">Kiralandı</option>
              </select>
            </div>
          </div>

          {/* Additional Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              İlan Resimleri (Çoklu)
            </label>
            <div className="space-y-4">
              <label className={`w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 p-6 ${uploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploadingImages ? (
                  <>
                    <Loader2 className="h-8 w-8 text-gray-400 dark:text-slate-500 animate-spin" />
                    <span className="mt-2 text-sm text-gray-500 dark:text-slate-400">Yükleniyor...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 dark:text-slate-500" />
                    <span className="mt-2 text-sm text-gray-500 dark:text-slate-400">Resimler Seç (Çoklu)</span>
                    <span className="mt-1 text-xs text-gray-400 dark:text-slate-500">Birden fazla resim seçebilirsiniz</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files
                    if (!files || files.length === 0) return

                    setUploadingImages(true)
                    try {
                      const uploadedUrls: string[] = []
                      
                      for (let i = 0; i < files.length; i++) {
                        const file = files[i]
                        const formDataUpload = new FormData()
                        formDataUpload.append('file', file)
                        formDataUpload.append('type', 'listing')

                        const response = await fetch('/api/upload', {
                          method: 'POST',
                          body: formDataUpload,
                        })

                        const result = await response.json()

                        if (result.success && result.data?.url) {
                          uploadedUrls.push(result.data.url)
                        }
                      }

                      setImagePreviews([...imagePreviews, ...uploadedUrls])
                      setFormData({ ...formData, images: [...(formData.images || []), ...uploadedUrls] })
                    } catch (error) {
                      console.error('Upload error:', error)
                      alert('Resimler yüklenirken bir hata oluştu')
                    } finally {
                      setUploadingImages(false)
                    }
                  }}
                  disabled={uploadingImages}
                  className="hidden"
                />
              </label>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {imagePreviews.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPreviews = imagePreviews.filter((_, i) => i !== index)
                          const newImages = (formData.images || []).filter((_, i) => i !== index)
                          setImagePreviews(newPreviews)
                          setFormData({ ...formData, images: newImages })
                        }}
                        disabled={uploadingImages}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              İptal
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={saving}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
