"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

// Define the types for our theme
type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

// Define the shape of the context provider's props
interface DarkModeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

// Define the state that our context will provide
interface DarkModeProviderState {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

// Create the context with a default initial state
const DarkModeContext = createContext<DarkModeProviderState | undefined>(undefined)

/**
 * Helper function to get the system's preferred theme.
 * @returns 'dark' or 'light'
 */
const getSystemPreference = (): ResolvedTheme => {
  // On the server, we can default to 'light' as there's no window object.
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * The main provider component. It manages the theme state, handles persistence
 * to localStorage, and listens for system theme changes.
 */
export function DarkModeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'system-theme-preference',
}: DarkModeProviderProps) {
  // State to hold the user's selected theme ('light', 'dark', or 'system')
  const [theme, setTheme] = useState<Theme>(() => {
    // This function runs only on the initial render to determine the starting theme.
    if (typeof window === 'undefined') {
      return defaultTheme
    }
    try {
      const storedTheme = window.localStorage.getItem(storageKey)
      if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
        return storedTheme as Theme
      }
    } catch (e) {
      console.warn(`Failed to read theme from localStorage with key "${storageKey}"`, e)
    }
    // If no stored theme, use the default.
    return defaultTheme
  })

  // State to hold the resolved theme ('light' or 'dark'), which is what's actually applied.
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(getSystemPreference())
  const [mounted, setMounted] = useState(false)

  // Effect to apply the theme to the DOM and persist the user's choice.
  useEffect(() => {
    // Determine the theme to apply. If 'system', use the system preference.
    const themeToApply = theme === 'system' ? getSystemPreference() : theme
    setResolvedTheme(themeToApply)

    // Update the DOM
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(themeToApply)
    root.style.colorScheme = themeToApply

    // Save the user's preference to localStorage
    try {
      window.localStorage.setItem(storageKey, theme)
    } catch (e) {
      console.warn(`Failed to save theme to localStorage with key "${storageKey}"`, e)
    }
  }, [theme, storageKey])

  // Effect to listen for changes in the system's theme preference.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemPreference = e.matches ? 'dark' : 'light'
      // If the user has 'system' theme selected, we need to update the applied theme.
      if (theme === 'system') {
        setResolvedTheme(newSystemPreference)
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(newSystemPreference)
        root.style.colorScheme = newSystemPreference
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [theme]) // Rerun this effect if the user changes the theme to/from 'system'.

  // This effect runs once on the client to signal that we can safely render the UI.
  useEffect(() => {
    setMounted(true)
  }, [])

  // To prevent hydration mismatch, we don't render the children on the server
  // or on the initial client render. This ensures the UI doesn't flash with
  // a theme that doesn't match the user's preference.
  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    // When toggling, we explicitly switch between light and dark,
    // overriding the 'system' preference.
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  const value = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  }

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  )
}

/**
 * Custom hook to access the theme context.
 */
export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}

// For compatibility, if other parts of the app use `useTheme`.
export const useTheme = useDarkMode
