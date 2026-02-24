/**
 * SearchBar Component
 *
 * Global search with keyboard shortcut support (⌘K)
 * Two modes: Embedded (header) or Overlay (fullscreen)
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import type { SearchConfig } from '@/globals/Header.types'
import { SearchOverlay } from './SearchOverlay'

export interface SearchBarProps {
  config?: SearchConfig
  variant?: 'embedded' | 'compact' // Embedded in header or compact icon-only
  onSearch?: (query: string) => void
  className?: string
}

export function SearchBar({
  config,
  variant = 'embedded',
  onSearch,
  className = '',
}: SearchBarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const placeholder = config?.searchPlaceholder || 'Zoeken naar producten...'
  const keyboardShortcut = config?.searchKeyboardShortcut || '⌘K'

  // Keyboard shortcut listener (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      // ESC to close
      if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      // Default: navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  // Compact variant (icon only, opens overlay)
  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={() => setSearchOpen(true)}
          className={`search-button-compact ${className}`}
          aria-label="Open search"
          title={`Search (${keyboardShortcut})`}
        >
          <Search size={20} aria-hidden="true" />
        </button>

        <SearchOverlay
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSearch={handleSearch}
          config={config}
        />

        <style jsx>{`
          .search-button-compact {
            background: transparent;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: var(--space-2, 8px);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: background-color 0.2s ease;
          }

          .search-button-compact:hover {
            background: var(--color-surface, #f5f5f5);
          }
        `}</style>
      </>
    )
  }

  // Embedded variant (full search bar in header)
  return (
    <>
      <div className={`search-bar ${className}`}>
        <Search className="search-icon" size={18} aria-hidden="true" />
        <input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => config?.enableSearchSuggestions && setSearchOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              handleSearch(query)
            }
          }}
          className="search-input"
          aria-label="Search"
        />
        <kbd className="search-kbd">{keyboardShortcut}</kbd>
      </div>

      {/* Overlay for autocomplete/suggestions */}
      {config?.enableSearchSuggestions && (
        <SearchOverlay
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSearch={handleSearch}
          config={config}
          initialQuery={query}
        />
      )}

      <style jsx>{`
        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
          gap: var(--space-2, 8px);
          background: var(--color-surface, #f5f5f5);
          border: 1px solid var(--color-border, #e0e0e0);
          border-radius: 8px;
          padding: var(--space-2, 8px) var(--space-3, 12px);
          width: 100%;
          max-width: 400px;
          transition: all 0.2s ease;
        }

        .search-bar:focus-within {
          border-color: var(--color-primary, #0a1628);
          background: var(--color-white, #fff);
        }

        :global(.search-icon) {
          color: var(--color-text-muted, #666);
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: var(--font-size-sm, 12px);
          color: var(--color-text-primary, #0a1628);
        }

        .search-input::placeholder {
          color: var(--color-text-muted, #999);
        }

        .search-kbd {
          background: var(--color-white, #fff);
          border: 1px solid var(--color-border, #e0e0e0);
          border-radius: 4px;
          padding: 2px 6px;
          font-size: var(--font-size-xs, 11px);
          color: var(--color-text-muted, #666);
          font-family: monospace;
          flex-shrink: 0;
        }

        /* Mobile: hide keyboard shortcut */
        @media (max-width: 767px) {
          .search-kbd {
            display: none;
          }

          .search-bar {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  )
}
