"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function usePageView() {
  const pathname = usePathname()
  const hasTracked = useRef(false)

  useEffect(() => {
    // Don't track admin pages
    if (pathname?.includes('/admin')) {
      return
    }

    // Prevent double tracking in React Strict Mode
    if (hasTracked.current) {
      return
    }

    // Track page view
    const trackView = async () => {
      try {
        hasTracked.current = true
        await fetch('/api/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        console.trace('✅ [Page View] Tracked:', pathname)
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.error('❌ [Page View] Failed to track:', error)
        hasTracked.current = false // Reset on error so it can retry
      }
    }

    trackView()
  }, [pathname])
}
