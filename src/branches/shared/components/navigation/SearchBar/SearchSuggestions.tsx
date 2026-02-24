/**
 * SearchSuggestions Component
 *
 * Autocomplete search results
 * Shows products, pages, and other content matching the query
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Package, FileText, Tag, TrendingUp } from 'lucide-react'
import type { SearchConfig } from '@/globals/Header.types'

export interface SearchSuggestionsProps {
  query: string
  onSelect: (query: string) => void
  config?: SearchConfig
}

interface SearchResult {
  type: 'product' | 'page' | 'category'
  title: string
  url: string
  description?: string
  image?: string
}

export function SearchSuggestions({ query, onSelect, config }: SearchSuggestionsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch search suggestions
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        // Call search API
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(query)}&limit=8`,
        )
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error('Failed to fetch search suggestions:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce search requests
    const timeoutId = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  // No results
  if (!loading && results.length === 0 && query.length >= 2) {
    return (
      <div className="search-suggestions">
        <div className="no-results">
          <p>Geen resultaten gevonden voor "{query}"</p>
          <button
            onClick={() => onSelect(query)}
            className="search-all-button"
            type="button"
          >
            Zoek overal naar "{query}"
          </button>
        </div>

        <style jsx>{`
          .search-suggestions {
            background: var(--color-white, #fff);
            border-radius: 12px;
            padding: var(--space-6, 24px);
            margin-top: var(--space-4, 16px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .no-results {
            text-align: center;
            padding: var(--space-6, 24px);
          }

          .no-results p {
            color: var(--color-text-muted, #666);
            margin-bottom: var(--space-4, 16px);
          }

          .search-all-button {
            background: var(--color-primary, #0a1628);
            color: var(--color-white, #fff);
            border: none;
            padding: var(--space-3, 12px) var(--space-6, 24px);
            border-radius: 8px;
            font-size: var(--font-size-sm, 13px);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .search-all-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        `}</style>
      </div>
    )
  }

  // Loading state
  if (loading && results.length === 0) {
    return (
      <div className="search-suggestions">
        <div className="loading">
          <div className="loading-spinner" />
          <p>Zoeken...</p>
        </div>

        <style jsx>{`
          .search-suggestions {
            background: var(--color-white, #fff);
            border-radius: 12px;
            padding: var(--space-6, 24px);
            margin-top: var(--space-4, 16px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-3, 12px);
            padding: var(--space-6, 24px);
          }

          .loading-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid var(--color-surface, #f5f5f5);
            border-top-color: var(--color-primary, #0a1628);
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .loading p {
            color: var(--color-text-muted, #666);
            font-size: var(--font-size-sm, 13px);
          }
        `}</style>
      </div>
    )
  }

  // Results
  if (results.length > 0) {
    return (
      <div className="search-suggestions">
        <div className="results-list">
          {results.map((result, index) => (
            <a key={index} href={result.url} className="result-item">
              <div className="result-icon">
                {result.type === 'product' && <Package size={20} />}
                {result.type === 'page' && <FileText size={20} />}
                {result.type === 'category' && <Tag size={20} />}
              </div>
              <div className="result-content">
                <div className="result-title">{result.title}</div>
                {result.description && (
                  <div className="result-description">{result.description}</div>
                )}
              </div>
              <div className="result-arrow">→</div>
            </a>
          ))}
        </div>

        <div className="view-all">
          <button onClick={() => onSelect(query)} className="view-all-button" type="button">
            <TrendingUp size={16} />
            Bekijk alle resultaten voor "{query}"
          </button>
        </div>

        <style jsx>{`
          .search-suggestions {
            background: var(--color-white, #fff);
            border-radius: 12px;
            padding: var(--space-4, 16px);
            margin-top: var(--space-4, 16px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .results-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-1, 4px);
          }

          .result-item {
            display: flex;
            align-items: center;
            gap: var(--space-3, 12px);
            padding: var(--space-3, 12px);
            border-radius: 8px;
            text-decoration: none;
            color: inherit;
            transition: background-color 0.2s ease;
          }

          .result-item:hover {
            background: var(--color-surface, #f5f5f5);
          }

          .result-icon {
            color: var(--color-text-muted, #666);
            flex-shrink: 0;
          }

          .result-content {
            flex: 1;
            min-width: 0;
          }

          .result-title {
            font-size: var(--font-size-sm, 13px);
            font-weight: 600;
            color: var(--color-text-primary, #0a1628);
            margin-bottom: 2px;
          }

          .result-description {
            font-size: var(--font-size-xs, 11px);
            color: var(--color-text-muted, #666);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .result-arrow {
            color: var(--color-text-muted, #999);
            flex-shrink: 0;
            font-size: 18px;
          }

          .view-all {
            margin-top: var(--space-3, 12px);
            padding-top: var(--space-3, 12px);
            border-top: 1px solid var(--color-border, #e0e0e0);
          }

          .view-all-button {
            width: 100%;
            background: transparent;
            border: 1px solid var(--color-border, #e0e0e0);
            color: var(--color-primary, #0a1628);
            padding: var(--space-3, 12px);
            border-radius: 8px;
            font-size: var(--font-size-sm, 13px);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-2, 8px);
          }

          .view-all-button:hover {
            background: var(--color-primary, #0a1628);
            color: var(--color-white, #fff);
            border-color: var(--color-primary, #0a1628);
          }
        `}</style>
      </div>
    )
  }

  return null
}
