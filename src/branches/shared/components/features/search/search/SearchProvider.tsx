'use client'
import React, { createContext, useContext, useState, useCallback } from 'react'
import { InstantSearch } from './InstantSearch'
import { useSearchShortcut } from '@/hooks/useKeyboardShortcut'

interface SearchContextValue {
  isOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined)

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return context
}

interface SearchProviderProps {
  children: React.ReactNode
  enableSearch?: boolean
}

export function SearchProvider({ children, enableSearch = true }: SearchProviderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openSearch = useCallback(() => {
    if (enableSearch) setIsOpen(true)
  }, [enableSearch])
  const closeSearch = useCallback(() => setIsOpen(false), [])
  const toggleSearch = useCallback(() => {
    if (enableSearch) setIsOpen((prev) => !prev)
  }, [enableSearch])

  // Cmd/Ctrl+K global shortcut - only register if search is enabled
  useSearchShortcut(enableSearch ? openSearch : () => {})

  return (
    <SearchContext.Provider value={{ isOpen, openSearch, closeSearch, toggleSearch }}>
      {children}
      {enableSearch && <InstantSearch isOpen={isOpen} onClose={closeSearch} />}
    </SearchContext.Provider>
  )
}
