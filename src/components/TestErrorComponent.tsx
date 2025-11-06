'use client'

import { useState } from 'react'
import { useErrorHandler } from '@/hooks/useErrorHandler'

export default function TestErrorComponent() {
  const [isVisible, setIsVisible] = useState(false)
  const { handleError, handleApiError, showSuccess, showWarning, showInfo } = useErrorHandler()

  const testRenderError = () => {
    throw new Error('Bu bir test render hatası!')
  }

  const testPromiseRejection = () => {
    Promise.reject(new Error('Bu bir test promise rejection hatası!'))
  }

  const testApiError = () => {
    const mockApiError = {
      response: {
        status: 404,
        data: {
          message: 'API endpoint bulunamadı'
        }
      }
    }
    handleApiError(mockApiError)
  }

  const testGeneralError = () => {
    handleError(new Error('Bu bir test genel hatası!'))
  }

  const testSuccessMessage = () => {
    showSuccess('İşlem başarıyla tamamlandı!')
  }

  const testWarningMessage = () => {
    showWarning('Bu bir uyarı mesajıdır!')
  }

  const testInfoMessage = () => {
    showInfo('Bu bir bilgi mesajıdır!')
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50 hidden lg:block">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Test Error Handler
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm hidden lg:block">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">Error Handler Test</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={testRenderError}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Test Render Error
        </button>
        
        <button
          onClick={testPromiseRejection}
          className="w-full bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          Test Promise Rejection
        </button>
        
        <button
          onClick={testApiError}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
        >
          Test API Error
        </button>
        
        <button
          onClick={testGeneralError}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
        >
          Test General Error
        </button>
        
        <button
          onClick={testSuccessMessage}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
        >
          Test Success
        </button>
        
        <button
          onClick={testWarningMessage}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
        >
          Test Warning
        </button>
        
        <button
          onClick={testInfoMessage}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Test Info
        </button>
      </div>
    </div>
  )
}
