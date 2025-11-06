'use client'

import { useEffect } from 'react'
import { setupGlobalErrorHandlers } from '@/hooks/useErrorHandler'
import ToastProvider from './ToastProvider'
import ErrorBoundary from './ErrorBoundary'

interface GlobalErrorProviderProps {
  children: React.ReactNode
}

export default function GlobalErrorProvider({ children }: GlobalErrorProviderProps) {
  useEffect(() => {
    // Setup global error handlers when component mounts
    setupGlobalErrorHandlers()
  }, [])

  return (
    <ErrorBoundary>
      {children}
      <ToastProvider />
    </ErrorBoundary>
  )
}
