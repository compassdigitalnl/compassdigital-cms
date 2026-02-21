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
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openSearch = useCallback(() => setIsOpen(true), [])
  const closeSearch = useCallback(() => setIsOpen(false), [])
  const toggleSearch = useCallback(() => setIsOpen((prev) => !prev), [])

  // Cmd/Ctrl+K global shortcut
  useSearchShortcut(openSearch)

  return (
    <SearchContext.Provider value={{ isOpen, openSearch, closeSearch, toggleSearch }}>
      {children}
      <InstantSearch isOpen={isOpen} onClose={closeSearch} />
    </SearchContext.Provider>
  )
}
