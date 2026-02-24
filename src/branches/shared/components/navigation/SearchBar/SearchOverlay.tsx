/**
 * SearchOverlay Component
 *
 * Full-screen search overlay with suggestions
 * Triggered by ⌘K or clicking search bar
 */

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import type { SearchConfig } from '@/globals/Header.types'
import { SearchSuggestions } from './SearchSuggestions'

export interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string) => void
  config?: SearchConfig
  initialQuery?: string
}

export function SearchOverlay({
  isOpen,
  onClose,
  onSearch,
  config,
  initialQuery = '',
}: SearchOverlayProps) {
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle search submission
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (query.trim()) {
      onSearch(query)
      onClose()
      setQuery('')
    }
  }

  // Don't render if closed
  if (!isOpen) {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      <div className="search-overlay-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Overlay Content */}
      <div className="search-overlay" role="dialog" aria-label="Search">
        <div className="search-overlay-content">
          {/* Search Input */}
          <form onSubmit={handleSubmit} className="search-form">
            <Search className="search-icon" size={24} aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={config?.searchPlaceholder || 'Zoeken naar producten...'}
              className="search-overlay-input"
              aria-label="Search"
            />
            <button
              type="button"
              onClick={onClose}
              className="search-close-button"
              aria-label="Close search"
            >
              <X size={24} />
            </button>
          </form>

          {/* Suggestions/Results */}
          {config?.enableSearchSuggestions && query.length > 0 && (
            <SearchSuggestions query={query} onSelect={onSearch} config={config} />
          )}

          {/* Quick Categories */}
          {(!query || query.length === 0) && config?.searchCategories && (
            <div className="search-categories">
              <p className="categories-title">Populaire categorieën</p>
              <div className="categories-grid">
                {config.searchCategories.map((category, index) => (
                  <a
                    key={index}
                    href={category.url}
                    className="category-link"
                    onClick={onClose}
                  >
                    {category.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-overlay-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 300;
          backdrop-filter: blur(4px);
        }

        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 301;
          display: flex;
          justify-content: center;
          padding-top: 10vh;
          overflow-y: auto;
        }

        .search-overlay-content {
          width: 100%;
          max-width: 700px;
          margin: 0 var(--space-4, 16px);
        }

        .search-form {
          display: flex;
          align-items: center;
          gap: var(--space-3, 12px);
          background: var(--color-white, #fff);
          border: 2px solid var(--color-primary, #0a1628);
          border-radius: 12px;
          padding: var(--space-4, 16px);
          box-shadow:
            0 10px 40px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(0, 0, 0, 0.05);
        }

        :global(.search-icon) {
          color: var(--color-primary, #0a1628);
          flex-shrink: 0;
        }

        .search-overlay-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: var(--font-size-lg, 16px);
          color: var(--color-text-primary, #0a1628);
        }

        .search-overlay-input::placeholder {
          color: var(--color-text-muted, #999);
        }

        .search-close-button {
          background: transparent;
          border: none;
          color: var(--color-text-muted, #666);
          cursor: pointer;
          padding: var(--space-2, 8px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .search-close-button:hover {
          background: var(--color-surface, #f5f5f5);
          color: var(--color-text-primary, #0a1628);
        }

        /* Quick Categories */
        .search-categories {
          background: var(--color-white, #fff);
          border-radius: 12px;
          padding: var(--space-6, 24px);
          margin-top: var(--space-4, 16px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .categories-title {
          font-size: var(--font-size-sm, 12px);
          font-weight: 600;
          color: var(--color-text-muted, #666);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-3, 12px);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: var(--space-2, 8px);
        }

        .category-link {
          padding: var(--space-3, 12px) var(--space-4, 16px);
          background: var(--color-surface, #f5f5f5);
          border-radius: 8px;
          text-decoration: none;
          color: var(--color-text-primary, #0a1628);
          font-size: var(--font-size-sm, 13px);
          font-weight: 500;
          transition: all 0.2s ease;
          text-align: center;
        }

        .category-link:hover {
          background: var(--color-primary, #0a1628);
          color: var(--color-white, #fff);
          transform: translateY(-2px);
        }

        /* Mobile adjustments */
        @media (max-width: 767px) {
          .search-overlay {
            padding-top: 5vh;
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}
