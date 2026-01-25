"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload, Loader2 } from "lucide-react"
import { CreateListingDto } from "@/types/api"

interface AddListingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CreateListingDto) => Promise<void>
}

export function AddListingModal({ isOpen, onClose, onSave }: AddListingModalProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]) // Track uploaded files for cleanup
  const [formData, setFormData] = useState<CreateListingDto>({
    title: "",
    description: "",
    price: 0,
    currency: "TRY",
    location: "",
    type: "sale",
    propertyType: "apartment",
    area: 0,
    rooms: 0,
    bathrooms: 0,
    hall: 0,
    coverImage: "",
    images: [],
    status: "active",
    locale: "tr"
  })

  // Cleanup uploaded files when modal closes without saving
  const cleanupUploadedFiles = async () => {
    if (uploadedFiles.length === 0) return

    console.log('Cleaning up uploaded files:', uploadedFiles)
    
    for (const fileUrl of uploadedFiles) {
      try {
        await fetch(`/api/upload/delete?url=${encodeURIComponent(fileUrl)}`, {
          method: 'DELETE',
        })
        console.log('Cleaned up:', fileUrl)
      } catch (error) {
        console.error('Failed to cleanup:', fileUrl, error)
      }
    }
  }

  // Handle modal close
  const handleClose = async () => {
    if (!loading) {
      await cleanupUploadedFiles()
      // Reset state
      setImagePreview("")
      setImagePreviews([])
      setUploadedFiles([])
      setFormData({
        title: "",
        description: "",
        price: 0,
        currency: "TRY",
        location: "",
        type: "sale",
        propertyType: "apartment",
        area: 0,
        rooms: 0,
        bathrooms: 0,
        hall: 0,
        coverImage: "",
        images: [],
        status: "active",
        locale: "tr"
      })
      onClose()
    }
  }

  // Handle ESC key press and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        handleClose()
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
  }, [isOpen, loading])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData({ ...formData, coverImage: result.data.url })
        // Track uploaded file for cleanup
        setUploadedFiles(prev => [...prev, result.data.url])
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
      // Clear uploaded files tracking on successful save (don't cleanup, they're now in DB)
      setUploadedFiles([])
      onClose()
    } catch (error) {
      console.error('Error saving listing:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !loading) {
      handleClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold dark:text-white">Yeni İlan Ekle</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Kapak Resmi
            </label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      // Delete the file from server
                      if (imagePreview) {
                        try {
                          await fetch(`/api/upload/delete?url=${encodeURIComponent(imagePreview)}`, {
                            method: 'DELETE',
                          })
                          // Remove from tracking
                          setUploadedFiles(prev => prev.filter(url => url !== imagePreview))
                        } catch (error) {
                          console.error('Failed to delete image:', error)
                        }
                      }
                      setImagePreview("")
                      setFormData({ ...formData, coverImage: "" })
                    }}
                    disabled={uploading}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className={`w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {uploading ? (
                    <>
                      <Loader2 className="h-8 w-8 text-gray-400 dark:text-slate-500 animate-spin" />
                      <span className="mt-2 text-sm text-gray-500 dark:text-slate-400">Yükleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 dark:text-slate-500" />
                      <span className="mt-2 text-sm text-gray-500 dark:text-slate-400">Resim Seç</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Başlık *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Açıklama *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                İlan Tipi *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "sale" | "rent" })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sale">Satılık</option>
                <option value="rent">Kiralık</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Emlak Tipi *
              </label>
              <select
                required
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as 'apartment' | 'villa' | 'office' | 'land' | 'commercial' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="apartment">Daire</option>
                <option value="villa">Villa</option>
                <option value="office">Ofis</option>
                <option value="land">Arsa</option>
                <option value="commercial">Ticari</option>
              </select>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Konum *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Örn: İstanbul, Kadıköy, Fenerbahçe Mahallesi"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                Şehir, İlçe, Mahalle bilgilerini virgülle ayırarak giriniz
              </p>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Fiyat *
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as 'TRY' | 'USD' | 'EUR' })}
                  className="w-24 px-2 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Alan (m²) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Yatak Odası
              </label>
              <input
                type="number"
                min="0"
                value={formData.rooms ?? ''}
                onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Hall */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Salon
              </label>
              <input
                type="number"
                value={formData.hall ?? 0}
                onChange={(e) => setFormData({ ...formData, hall: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Banyo Sayısı
              </label>
              <input
                type="number"
                min="0"
                value={formData.bathrooms  ?? ''}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Floor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Kat
              </label>
              <input
                type="number"
                min="0"
                value={formData.floor || ''}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Durum *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
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

                      // Track uploaded files for cleanup
                      setUploadedFiles(prev => [...prev, ...uploadedUrls])
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {imagePreviews.map((url, index) => (
                    <div key={index} className="relative w-full pb-[100%] rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          const imageUrl = imagePreviews[index]
                          // Delete the file from server
                          if (imageUrl) {
                            try {
                              await fetch(`/api/upload/delete?url=${encodeURIComponent(imageUrl)}`, {
                                method: 'DELETE',
                              })
                              // Remove from tracking
                              setUploadedFiles(prev => prev.filter(url => url !== imageUrl))
                            } catch (error) {
                              console.error('Failed to delete image:', error)
                            }
                          }
                          const newPreviews = imagePreviews.filter((_, i) => i !== index)
                          const newImages = (formData.images || []).filter((_, i) => i !== index)
                          setImagePreviews(newPreviews)
                          setFormData({ ...formData, images: newImages })
                        }}
                        disabled={uploadingImages}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md z-10"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                'Kaydet'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
