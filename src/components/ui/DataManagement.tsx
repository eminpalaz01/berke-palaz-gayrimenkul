"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  X,
  FileText,
  Clock,
  Database
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/hooks/useTranslation"
import { CookieManager, DataCollectionManager } from "@/utils/cookieManager"
import { useConsent } from "@/components/ui/LegalConsent"

interface DataManagementProps {
  isOpen: boolean
  onClose: () => void
}

export function DataManagement({ isOpen, onClose }: DataManagementProps) {
  const { t } = useTranslation()
  const { consents, resetConsents, exportUserData } = useConsent()
  const [activeTab, setActiveTab] = React.useState<'overview' | 'cookies' | 'forms' | 'export' | 'delete'>('overview')
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [exportData, setExportData] = React.useState<Record<string, unknown> | null>(null)

  const handleExportData = () => {
    const data = exportUserData()
    setExportData(data)
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `berkepalaz-user-data-${new Date().toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDeleteAllData = () => {
    // Clear all cookies and data
    resetConsents()
    
    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('form_submissions')
      localStorage.removeItem('theme')
    }
    
    setShowDeleteConfirm(false)
    onClose()
  }

  const getStoredFormSubmissions = () => {
    return DataCollectionManager.getStoredFormSubmissions()
  }

  const getCookieInfo = () => {
    const allCookies = CookieManager.getAllOurCookies()
    return Object.entries(allCookies).map(([name, value]) => ({
      name,
      value: value.length > 50 ? value.substring(0, 50) + '...' : value,
      type: name.includes('consent') ? t('DataManagement.cookieTypes.essential') : 
            name.includes('analytics') ? t('DataManagement.cookieTypes.analytics') :
            name.includes('functional') ? t('DataManagement.cookieTypes.functional') :
            name.includes('marketing') ? t('DataManagement.cookieTypes.marketing') : t('DataManagement.cookieTypes.other')
    }))
  }

  const tabs = [
    { id: 'overview', label: t('DataManagement.tabs.overview'), icon: Eye },
    { id: 'cookies', label: t('DataManagement.tabs.cookies'), icon: Database },
    { id: 'forms', label: t('DataManagement.tabs.forms'), icon: FileText },
    { id: 'export', label: t('DataManagement.tabs.export'), icon: Download },
    { id: 'delete', label: t('DataManagement.tabs.delete'), icon: Trash2 }
  ] as const

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <Card className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-muted">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="responsive-text-xl mobile:responsive-text-2xl font-bold text-foreground">
                    {t('DataManagement.title')}
                  </h2>
                  <p className="responsive-text-sm text-muted-foreground">
                    {t('DataManagement.subtitle')}
                  </p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-muted overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-brand-secondary border-b-2 border-brand-secondary bg-brand-secondary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="responsive-text-lg font-semibold mb-3 text-foreground">
                      {t('DataManagement.overview.title')}
                    </h3>
                    <p className="responsive-text-sm text-muted-foreground leading-relaxed mb-4">
                      {t('DataManagement.overview.description')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="h-5 w-5 text-blue-500" />
                        <h4 className="font-semibold text-foreground">
                          {t('DataManagement.overview.cookies')}
                        </h4>
                      </div>
                      <p className="responsive-text-sm text-muted-foreground">
                        {getCookieInfo().length} {t('DataManagement.overview.cookiesStored')}
                      </p>
                    </Card>

                    <Card className="p-4 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-green-500" />
                        <h4 className="font-semibold text-foreground">
                          {t('DataManagement.overview.forms')}
                        </h4>
                      </div>
                      <p className="responsive-text-sm text-muted-foreground">
                        {getStoredFormSubmissions().length} {t('DataManagement.overview.formsSubmitted')}
                      </p>
                    </Card>
                  </div>

                  <div className="bg-blue-50 dark:bg-gray-800/30 p-4 rounded-lg border border-blue-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          {t('DataManagement.overview.gdprCompliant')}
                        </h4>
                        <p className="responsive-text-sm text-blue-700 dark:text-blue-200">
                          {t('DataManagement.overview.gdprDescription')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cookies' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="responsive-text-lg font-semibold mb-3 text-foreground">
                      {t('DataManagement.cookies.title')}
                    </h3>
                    <p className="responsive-text-sm text-muted-foreground mb-4">
                      {t('DataManagement.cookies.description')}
                    </p>
                  </div>

                  {consents && (
                    <Card className="p-4 mb-4 dark:bg-gray-800/50">
                      <h4 className="font-semibold mb-3 text-foreground">
                        {t('DataManagement.cookies.currentConsents')}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        {/* Necessary Cookies */}
                        <div className="flex items-center justify-between py-2">
                          <span className="responsive-text-sm text-foreground">{t('LegalConsent.cookies.necessary.title')}</span>
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium responsive-text-sm">{t('DataManagement.enabled')}</span>
                          </div>
                        </div>
                        {/* Functional Cookies */}
                        <div className="flex items-center justify-between py-2">
                          <span className="responsive-text-sm text-foreground">{t('LegalConsent.cookies.functional.title')}</span>
                          <div className={`flex items-center gap-2 ${consents.functional ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {consents.functional ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                            <span className="font-medium responsive-text-sm">
                              {consents.functional ? t('DataManagement.enabled') : t('DataManagement.disabled')}
                            </span>
                          </div>
                        </div>
                        {/* Analytics Cookies */}
                        <div className="flex items-center justify-between py-2">
                          <span className="responsive-text-sm text-foreground">{t('LegalConsent.cookies.analytics.title')}</span>
                          <div className={`flex items-center gap-2 ${consents.analytics ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {consents.analytics ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                            <span className="font-medium responsive-text-sm">
                              {consents.analytics ? t('DataManagement.enabled') : t('DataManagement.disabled')}
                            </span>
                          </div>
                        </div>
                        {/* Marketing Cookies */}
                        <div className="flex items-center justify-between py-2">
                          <span className="responsive-text-sm text-foreground">{t('LegalConsent.cookies.marketing.title')}</span>
                          <div className={`flex items-center gap-2 ${consents.marketing ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {consents.marketing ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                            <span className="font-medium responsive-text-sm">
                              {consents.marketing ? t('DataManagement.enabled') : t('DataManagement.disabled')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {getCookieInfo().map((cookie, index) => (
                      <Card key={index} className="p-4 dark:bg-gray-800/50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex-1">
                            <h5 className="font-semibold text-foreground break-all">{cookie.name}</h5>
                            <p className="responsive-text-xs text-muted-foreground break-all">{cookie.value}</p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span className={`px-2.5 py-1 rounded-full responsive-text-xs font-medium whitespace-nowrap ${
                              cookie.type === t('DataManagement.cookieTypes.essential') ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                              cookie.type === t('DataManagement.cookieTypes.analytics') ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                              cookie.type === t('DataManagement.cookieTypes.functional') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                              cookie.type === t('DataManagement.cookieTypes.marketing') ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}>
                              {cookie.type}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'forms' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="responsive-text-lg font-semibold mb-3 text-foreground">
                      {t('DataManagement.forms.title')}
                    </h3>
                    <p className="responsive-text-sm text-muted-foreground mb-4">
                      {t('DataManagement.forms.description')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {getStoredFormSubmissions().map((submission: Record<string, unknown>, index: number) => {
                      const submissionData = submission.data as Record<string, unknown>
                      const submissionType = submission.type as string
                      const submissionTimestamp = submission.timestamp as number
                      const expiryTimestamp = submission.expiryTimestamp as number

                      const expiresInDays = expiryTimestamp 
                        ? Math.ceil((expiryTimestamp - Date.now()) / (1000 * 60 * 60 * 24))
                        : null

                      return (
                        <Card key={index} className="p-4 dark:bg-gray-800/50">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                            <div>
                              <h5 className="font-medium text-foreground capitalize">
                                {submissionType} {t('DataManagement.forms.form')}
                              </h5>
                              <div className="flex items-center gap-2 responsive-text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(submissionTimestamp).toLocaleString()}</span>
                              </div>
                            </div>
                            {expiresInDays !== null && (
                              <div className="flex items-center gap-2 responsive-text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full mt-2 sm:mt-0">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {t("DataManagement.forms.expiresIn", { days: expiresInDays })}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="responsive-text-sm text-muted-foreground">
                            {submissionType === 'contact' && (
                              <div>
                                <p><strong>{t('DataManagement.forms.name')}:</strong> {submissionData.name as string}</p>
                                <p><strong>{t('DataManagement.forms.email')}:</strong> {submissionData.email as string}</p>
                                <p><strong>{t('DataManagement.forms.subject')}:</strong> {submissionData.subject as string}</p>
                              </div>
                            )}
                            {submissionType === 'hr' && (
                              <div>
                                <p><strong>{t('DataManagement.forms.name')}:</strong> {submissionData.firstName as string} {submissionData.lastName as string}</p>
                                <p><strong>{t('DataManagement.forms.email')}:</strong> {submissionData.email as string}</p>
                                <p><strong>{t('DataManagement.forms.positions')}:</strong> {(submissionData.preferredPositions as string[])?.join(', ') || 'N/A'}</p>
                              </div>
                            )}
                          </div>
                        </Card>
                      )
                    })}
                    {getStoredFormSubmissions().length === 0 && (
                      <Card className="p-6 text-center dark:bg-gray-800/50">
                        <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="responsive-text-sm text-muted-foreground">
                          {t('DataManagement.forms.noSubmissions')}
                        </p>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'export' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="responsive-text-lg font-semibold mb-3 text-foreground">
                      {t('DataManagement.export.title')}
                    </h3>
                    <p className="responsive-text-sm text-muted-foreground mb-4">
                      {t('DataManagement.export.description')}
                    </p>
                  </div>

                  <Card className="p-4 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Download className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {t('DataManagement.export.downloadData')}
                        </h4>
                        <p className="responsive-text-sm text-muted-foreground">
                          {t('DataManagement.export.downloadDescription')}
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleExportData} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      {t('DataManagement.export.download')}
                    </Button>
                  </Card>

                  {exportData && (
                    <Card className="p-4 dark:bg-gray-800/50">
                      <h4 className="font-semibold mb-2 text-foreground">
                        {t('DataManagement.export.preview')}
                      </h4>
                      <pre className="responsive-text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                        {JSON.stringify(exportData, null, 2)}
                      </pre>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'delete' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="responsive-text-lg font-semibold mb-3 text-foreground">
                      {t('DataManagement.delete.title')}
                    </h3>
                    <p className="responsive-text-sm text-muted-foreground mb-4">
                      {t('DataManagement.delete.description')}
                    </p>
                  </div>

                  <div className="bg-red-50 dark:bg-gray-800/30 p-4 rounded-lg border border-red-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                          {t('DataManagement.delete.warning')}
                        </h4>
                        <p className="responsive-text-sm text-red-700 dark:text-red-200 mb-3">
                          {t('DataManagement.delete.warningDescription')}
                        </p>
                        <ul className="responsive-text-sm text-red-700 dark:text-red-200 list-disc list-inside space-y-1">
                          <li>{t('DataManagement.delete.item1')}</li>
                          <li>{t('DataManagement.delete.item2')}</li>
                          <li>{t('DataManagement.delete.item3')}</li>
                          <li>{t('DataManagement.delete.item4')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {!showDeleteConfirm ? (
                    <Button 
                      onClick={() => setShowDeleteConfirm(true)}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('DataManagement.delete.requestDeletion')}
                    </Button>
                  ) : (
                    <Card className="p-4 border-red-200 dark:border-gray-700 dark:bg-gray-800/50">
                      <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                        {t('DataManagement.delete.confirmTitle')}
                      </h4>
                      <p className="responsive-text-sm text-red-700 dark:text-red-200 mb-4">
                        {t('DataManagement.delete.confirmDescription')}
                      </p>
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleDeleteAllData}
                          className="bg-red-600 hover:bg-red-700 text-white flex-1"
                        >
                          {t('DataManagement.delete.confirmDelete')}
                        </Button>
                        <Button 
                          onClick={() => setShowDeleteConfirm(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          {t('DataManagement.delete.cancel')}
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook for managing data management modal
export function useDataManagement() {
  const [showDataManagement, setShowDataManagement] = React.useState(false)

  return {
    showDataManagement,
    setShowDataManagement,
    openDataManagement: () => setShowDataManagement(true),
    closeDataManagement: () => setShowDataManagement(false)
  }
}
