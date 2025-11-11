"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  Upload, 
  Download, 
  Save, 
  RefreshCw, 
  FileJson,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  X
} from "lucide-react"
import toast from "react-hot-toast"

interface ConfigManagementProps {
  onConfigUpdate?: () => void
}

export function ConfigManagement({ onConfigUpdate }: ConfigManagementProps) {
  const [loading, setLoading] = useState(false)
  const [configFiles, setConfigFiles] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<string>('public/configs/config.json')
  const [configContent, setConfigContent] = useState<string>('')
  const [originalContent, setOriginalContent] = useState<string>('')
  const [hasChanges, setHasChanges] = useState(false)
  const [jsonError, setJsonError] = useState<string>('')
  const [showRawJson, setShowRawJson] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadPath, setUploadPath] = useState<string>('public/configs/')
  const [uploadFileName, setUploadFileName] = useState<string>('')
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingFile, setEditingFile] = useState<string>('')
  const [newFileName, setNewFileName] = useState<string>('')
  const [showFileList, setShowFileList] = useState(false)

  // Helper function to display path without "public/"
  const displayPath = (path: string) => {
    return path.replace(/^public\//, '')
  }

  // Helper function to get full path from display path
  const getFullPath = (displayPath: string) => {
    return displayPath.startsWith('public/') ? displayPath : `public/${displayPath}`
  }

  // Load available config files
  const loadConfigFiles = async () => {
    try {
      const response = await fetch('/api/admin/config/list', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success && data.data) {
        setConfigFiles(data.data)
      } else {
        toast.error(data.error || 'Config dosyaları yüklenemedi')
      }
    } catch (error) {
      console.error('Error loading config files:', error)
      toast.error('Config dosyaları yüklenirken hata oluştu')
    }
  }

  // Load config content
  const loadConfig = async (path: string) => {
    setLoading(true)
    setJsonError('')
    
    try {
      const response = await fetch(`/api/admin/config?path=${encodeURIComponent(path)}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        const formatted = JSON.stringify(data.data.content, null, 2)
        setConfigContent(formatted)
        setOriginalContent(formatted)
        setHasChanges(false)
      } else {
        toast.error(data.error || 'Config yüklenemedi')
      }
    } catch (error) {
      console.error('Error loading config:', error)
      toast.error('Config yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Save config
  const saveConfig = async () => {
    // Validate JSON
    try {
      JSON.parse(configContent)
      setJsonError('')
    } catch (error) {
      setJsonError('Geçersiz JSON formatı')
      toast.error('Geçersiz JSON formatı')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: selectedFile,
          content: JSON.parse(configContent)
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Config başarıyla kaydedildi')
        setOriginalContent(configContent)
        setHasChanges(false)
        if (onConfigUpdate) {
          onConfigUpdate()
        }
      } else {
        toast.error(data.error || 'Config kaydedilemedi')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      toast.error('Config kaydedilirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Upload config file with custom path
  const handleFileUploadWithPath = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      toast.error('Sadece JSON dosyaları yüklenebilir')
      return
    }

    if (!uploadFileName) {
      toast.error('Dosya adı gerekli')
      return
    }

    // Ensure filename ends with .json
    const fileName = uploadFileName.endsWith('.json') ? uploadFileName : `${uploadFileName}.json`
    const fullPath = `${uploadPath}${fileName}`

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', fullPath)

      const response = await fetch('/api/admin/config/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Config dosyası başarıyla yüklendi')
        setShowUploadModal(false)
        setUploadFileName('')
        await loadConfigFiles()
        await loadConfig(fullPath)
        if (onConfigUpdate) {
          onConfigUpdate()
        }
      } else {
        toast.error(data.error || 'Dosya yüklenemedi')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Dosya yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Download config
  const downloadConfig = () => {
    try {
      const blob = new Blob([configContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = selectedFile.split('/').pop() || 'config.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Config dosyası indirildi')
    } catch (error) {
      console.error('Error downloading config:', error)
      toast.error('Dosya indirilemedi')
    }
  }

  // Handle content change
  const handleContentChange = (value: string) => {
    setConfigContent(value)
    setHasChanges(value !== originalContent)
    
    // Validate JSON on change
    try {
      JSON.parse(value)
      setJsonError('')
    } catch (error) {
      setJsonError('Geçersiz JSON formatı')
    }
  }

  // Format JSON
  const formatJson = () => {
    try {
      const parsed = JSON.parse(configContent)
      const formatted = JSON.stringify(parsed, null, 2)
      setConfigContent(formatted)
      setJsonError('')
      toast.success('JSON formatlandı')
    } catch (error) {
      toast.error('JSON formatlanamadı - geçersiz format')
    }
  }

  // Reset changes
  const resetChanges = () => {
    if (confirm('Değişiklikleri geri almak istediğinizden emin misiniz?')) {
      setConfigContent(originalContent)
      setHasChanges(false)
      setJsonError('')
      toast.success('Değişiklikler geri alındı')
    }
  }

  // Delete config file
  const handleDeleteFile = async (filePath: string) => {
    if (!confirm(`"${displayPath(filePath)}" dosyasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/config/delete?path=${encodeURIComponent(filePath)}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Config dosyası başarıyla silindi')
        await loadConfigFiles()
        
        // If deleted file was selected, select first available file
        if (filePath === selectedFile && configFiles.length > 1) {
          const remainingFiles = configFiles.filter(f => f !== filePath)
          if (remainingFiles.length > 0) {
            setSelectedFile(remainingFiles[0])
            await loadConfig(remainingFiles[0])
          }
        }
        
        if (onConfigUpdate) {
          onConfigUpdate()
        }
      } else {
        toast.error(data.error || 'Dosya silinemedi')
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Dosya silinirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Rename config file
  const handleRenameFile = async () => {
    if (!newFileName) {
      toast.error('Yeni dosya adı gerekli')
      return
    }

    const fileName = newFileName.endsWith('.json') ? newFileName : `${newFileName}.json`
    const oldDir = editingFile.substring(0, editingFile.lastIndexOf('/'))
    const newPath = `${oldDir}/${fileName}`

    setLoading(true)
    try {
      const response = await fetch('/api/admin/config/rename', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oldPath: editingFile,
          newPath: newPath
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Config dosyası başarıyla yeniden adlandırıldı')
        setShowEditModal(false)
        setEditingFile('')
        setNewFileName('')
        await loadConfigFiles()
        
        // Update selected file if it was the renamed one
        if (editingFile === selectedFile) {
          setSelectedFile(newPath)
          await loadConfig(newPath)
        }
        
        if (onConfigUpdate) {
          onConfigUpdate()
        }
      } else {
        toast.error(data.error || 'Dosya yeniden adlandırılamadı')
      }
    } catch (error) {
      console.error('Error renaming file:', error)
      toast.error('Dosya yeniden adlandırılırken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Load initial data
  useEffect(() => {
    loadConfigFiles()
    loadConfig(selectedFile)
  }, [])

  // Load config when file selection changes
  useEffect(() => {
    if (selectedFile) {
      loadConfig(selectedFile)
    }
  }, [selectedFile])

  // Get active config path from environment
  const getActiveConfigPath = () => {
    if (typeof window !== 'undefined') {
      const configPath = process.env.NEXT_PUBLIC_CONFIG_PATH
      if (configPath) {
        if (configPath.startsWith('/')) {
          return configPath
        } else {
          return `configs/${configPath}/`
        }
      }
    }
    return 'configs/'
  }

  const activeConfigPath = getActiveConfigPath()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold dark:text-white">Config Yönetimi</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => loadConfig(selectedFile)}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
        </div>
      </div>

      {/* Active Config Info */}
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-900 dark:text-green-300 mb-1">
              Aktif Config Dosyası
            </h4>
            <p className="text-sm text-green-800 dark:text-green-300">
              Uygulama şu anda <code className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 rounded font-mono">{activeConfigPath}</code> yolunda bulunan ayarları kullanıyor.
            </p>
            <p className="text-xs text-green-700 dark:text-green-400 mt-2">
              💡 Farklı bir config kullanmak için <code className="px-1 py-0.5 bg-green-100 dark:bg-green-900/40 rounded">NEXT_PUBLIC_CONFIG_PATH</code> environment variable&apos;ını ayarlayın.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 space-y-6">
        {/* File Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              Config Dosyası Seç
            </label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingFile(selectedFile)
                  setNewFileName(selectedFile.split('/').pop()?.replace('.json', '') || '')
                  setShowEditModal(true)
                }}
                disabled={loading || hasChanges}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleDeleteFile(selectedFile)}
                disabled={loading || hasChanges}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            disabled={loading || hasChanges}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {configFiles.map((file) => (
              <option key={file} value={file}>
                {displayPath(file)}
              </option>
            ))}
          </select>
          {hasChanges && (
            <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Kaydedilmemiş değişiklikler var. Başka bir dosyaya geçmek için önce kaydedin veya değişiklikleri geri alın.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={saveConfig}
            disabled={loading || !hasChanges || !!jsonError}
            className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Kaydet
          </Button>

          <Button
            onClick={resetChanges}
            disabled={loading || !hasChanges}
            variant="outline"
            className="text-red-600 hover:text-red-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Geri Al
          </Button>

          <Button
            onClick={formatJson}
            disabled={loading}
            variant="outline"
            title="JSON'u düzgün girintileme ve satır sonlarıyla formatlar"
          >
            <FileJson className="h-4 w-4 mr-2" />
            Formatla
          </Button>

          <Button
            onClick={downloadConfig}
            disabled={loading}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            İndir
          </Button>

          <Button
            onClick={() => setShowUploadModal(true)}
            disabled={loading}
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            Yükle
          </Button>

          <Button
            onClick={() => setShowRawJson(!showRawJson)}
            variant="outline"
          >
            {showRawJson ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Ham JSON Gizle
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Ham JSON Göster
              </>
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {hasChanges && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span className="text-sm text-amber-800 dark:text-amber-300">
              Kaydedilmemiş değişiklikler var
            </span>
          </div>
        )}

        {jsonError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-800 dark:text-red-300">
              {jsonError}
            </span>
          </div>
        )}

        {!jsonError && !hasChanges && configContent && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-800 dark:text-green-300">
              Geçerli JSON formatı
            </span>
          </div>
        )}

        {/* JSON Editor */}
        {showRawJson && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              JSON İçeriği
            </label>
            <textarea
              value={configContent}
              onChange={(e) => handleContentChange(e.target.value)}
              disabled={loading}
              className="w-full h-[600px] px-4 py-3 font-mono text-sm border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              spellCheck={false}
            />
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            Bilgi
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>Config dosyaları otomatik olarak yedeklenir (7 gün saklanır)</li>
            <li>Sadece <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded">configs/</code> dizinindeki dosyalar düzenlenebilir</li>
            <li>JSON formatı geçerli olmalıdır</li>
            <li>Değişiklikler kaydedilene kadar uygulanmaz</li>
            <li>Dosya silme ve yeniden adlandırma işlemleri geri alınamaz</li>
            <li><strong>Formatla butonu:</strong> JSON&apos;u düzgün girintileme (2 boşluk) ve satır sonlarıyla düzenler. Dağınık veya tek satırda olan JSON&apos;u okunabilir hale getirir.</li>
          </ul>
        </div>
      </div>

      {/* Rename Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold dark:text-white">Dosyayı Yeniden Adlandır</h3>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingFile('')
                  setNewFileName('')
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Mevcut Dosya
                </label>
                <div className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-gray-900 dark:text-white font-mono">
                    {displayPath(editingFile)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Yeni Dosya Adı
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="config"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRenameFile()
                    }
                  }}
                />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  .json uzantısı otomatik eklenecektir
                </p>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Yeni yol:</strong> {displayPath(editingFile.substring(0, editingFile.lastIndexOf('/')) + '/' + (newFileName || 'dosya-adi') + (newFileName && !newFileName.endsWith('.json') ? '.json' : ''))}
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t dark:border-slate-700">
              <Button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingFile('')
                  setNewFileName('')
                }}
                variant="outline"
                disabled={loading}
              >
                İptal
              </Button>
              <Button
                onClick={handleRenameFile}
                disabled={loading || !newFileName}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                Yeniden Adlandır
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold dark:text-white">Config Dosyası Yükle</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadFileName('')
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Klasör Yolu
                </label>
                <input
                  type="text"
                  value={uploadPath}
                  onChange={(e) => setUploadPath(e.target.value)}
                  placeholder="configs/"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Örnek: configs/ veya configs/alt-klasor/
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Dosya Adı
                </label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="config"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  .json uzantısı otomatik eklenecektir
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  JSON Dosyası Seç
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setSelectedUploadFile(file)
                    }
                  }}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {selectedUploadFile && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Seçilen dosya: {selectedUploadFile.name}
                  </p>
                )}
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Önizleme:</strong> {uploadPath}{uploadFileName || 'dosya-adi'}{uploadFileName && !uploadFileName.endsWith('.json') ? '.json' : ''}
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t dark:border-slate-700">
              <Button
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadFileName('')
                  setSelectedUploadFile(null)
                }}
                variant="outline"
                disabled={loading}
              >
                İptal
              </Button>
              <Button
                onClick={() => {
                  if (selectedUploadFile) {
                    handleFileUploadWithPath(selectedUploadFile)
                  }
                }}
                disabled={loading || !selectedUploadFile || !uploadFileName}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Yükle
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
