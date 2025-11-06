"use client"

import * as React from "react"
import { LegalConsent, useConsent } from '@/components/ui/LegalConsent'
import { DataManagement, useDataManagement } from '@/components/ui/DataManagement'

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { showConsent, handleConsentAccept, setShowConsent } = useConsent()
  const { showDataManagement, openDataManagement, closeDataManagement } = useDataManagement()

  React.useEffect(() => {
    const handleOpenDataManagement = () => {
      openDataManagement()
    }

    window.addEventListener('openDataManagement', handleOpenDataManagement)
    
    return () => {
      window.removeEventListener('openDataManagement', handleOpenDataManagement)
    }
  }, [openDataManagement])

  return (
    <>
      {children}
      <LegalConsent
        isOpen={showConsent}
        onClose={() => setShowConsent(false)}
        onAccept={handleConsentAccept}
        type="banner"
      />
      <DataManagement
        isOpen={showDataManagement}
        onClose={closeDataManagement}
      />
    </>
  )
}
