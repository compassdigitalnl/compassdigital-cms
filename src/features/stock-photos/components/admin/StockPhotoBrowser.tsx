'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import './StockPhotoBrowser.css'

interface StockPhoto {
  id: string
  source: 'unsplash' | 'pexels'
  previewUrl: string
  fullUrl: string
  downloadUrl: string
  width: number
  height: number
  alt: string
  photographer: string
  photographerUrl: string
  color: string | null
}

type Orientation = 'landscape' | 'portrait' | 'square' | ''
type Source = 'all' | 'unsplash' | 'pexels'

export function StockPhotoBrowser() {
  const [query, setQuery] = useState('')
  const [photos, setPhotos] = useState<StockPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState<Record<string, boolean>>({})
  const [downloaded, setDownloaded] = useState<Record<string, { id: number; url: string }>>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [orientation, setOrientation] = useState<Orientation>('')
  const [source, setSource] = useState<Source>('all')
  const [availableSources, setAvailableSources] = useState<string[]>([])
  const [error, setError] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(
    async (searchQuery: string, searchPage: number) => {
      if (!searchQuery.trim()) {
        setPhotos([])
        setTotalPages(0)
        setTotalResults(0)
        return
      }

      setLoading(true)
      setError('')

      try {
        const params = new URLSearchParams({
          q: searchQuery,
          page: String(searchPage),
          perPage: '24',
          source,
        })
        if (orientation) params.set('orientation', orientation)

        const res = await fetch(`/api/stock-photos/search?${params}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Zoeken mislukt')
        }

        setPhotos(data.photos || [])
        setTotalPages(data.totalPages || 0)
        setTotalResults(data.totalResults || 0)
        setAvailableSources(data.availableSources || [])
      } catch (err: any) {
        setError(err.message || 'Er is iets misgegaan')
        setPhotos([])
      } finally {
        setLoading(false)
      }
    },
    [orientation, source],
  )

  // Debounced search on query change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (query.trim()) {
        setPage(1)
        search(query, 1)
      } else {
        setPhotos([])
      }
    }, 500)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, search])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    search(query, newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDownload = async (photo: StockPhoto) => {
    setDownloading((prev) => ({ ...prev, [photo.id]: true }))

    try {
      const res = await fetch('/api/stock-photos/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Download mislukt')
      }

      setDownloaded((prev) => ({
        ...prev,
        [photo.id]: { id: data.media.id, url: data.media.url },
      }))
    } catch (err: any) {
      setError(`Download mislukt: ${err.message}`)
    } finally {
      setDownloading((prev) => ({ ...prev, [photo.id]: false }))
    }
  }

  const noSources = availableSources.length === 0 && !loading && query.trim() !== ''

  return (
    <div>
      {/* Search bar */}
      <div style={styles.searchBar}>
        <div style={styles.searchInputWrapper}>
          <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek foto's... bijv. 'medische handschoenen', 'kantoor', 'team'"
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filters}>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as Orientation)}
            style={styles.select}
          >
            <option value="">Alle orientaties</option>
            <option value="landscape">Liggend</option>
            <option value="portrait">Staand</option>
            <option value="square">Vierkant</option>
          </select>

          <select
            value={source}
            onChange={(e) => setSource(e.target.value as Source)}
            style={styles.select}
          >
            <option value="all">Alle bronnen</option>
            <option value="unsplash">Unsplash</option>
            <option value="pexels">Pexels</option>
          </select>
        </div>
      </div>

      {/* No API keys warning */}
      {noSources && (
        <div style={styles.warning}>
          <svg style={{ width: 20, height: 20, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <strong>Geen API keys geconfigureerd</strong>
            <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
              Voeg <code>UNSPLASH_ACCESS_KEY</code> en/of <code>PEXELS_API_KEY</code> toe aan je{' '}
              <code>.env</code> bestand. Beide API&apos;s zijn gratis:
            </p>
            <ul style={{ margin: '4px 0 0', paddingLeft: '20px', fontSize: '13px' }}>
              <li>Unsplash: <a href="https://unsplash.com/developers" target="_blank" rel="noopener" style={styles.link}>unsplash.com/developers</a></li>
              <li>Pexels: <a href="https://www.pexels.com/api/" target="_blank" rel="noopener" style={styles.link}>pexels.com/api</a></li>
            </ul>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={styles.errorBanner}>
          {error}
          <button onClick={() => setError('')} style={styles.dismissBtn}>
            &times;
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={styles.loadingBar}>
          <div style={styles.loadingBarInner} />
        </div>
      )}

      {/* Results count */}
      {!loading && photos.length > 0 && (
        <div style={styles.resultsInfo}>
          {totalResults.toLocaleString('nl-NL')} resultaten gevonden
          {totalPages > 1 && ` — pagina ${page} van ${totalPages}`}
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div style={styles.grid}>
          {photos.map((photo) => {
            const isDownloading = downloading[photo.id]
            const isDownloaded = downloaded[photo.id]

            return (
              <div key={photo.id} className="stock-photo-card" style={styles.card}>
                <div
                  style={{
                    ...styles.imageWrapper,
                    backgroundColor: photo.color || '#f3f4f6',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.previewUrl}
                    alt={photo.alt}
                    style={styles.image}
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className="stock-photo-overlay" style={styles.overlay}>
                    {isDownloaded ? (
                      <a
                        href={`/admin/collections/media/${isDownloaded.id}`}
                        style={styles.successBtn}
                      >
                        <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Opgeslagen — Bekijken
                      </a>
                    ) : (
                      <button
                        onClick={() => handleDownload(photo)}
                        disabled={isDownloading}
                        style={isDownloading ? styles.downloadBtnDisabled : styles.downloadBtn}
                      >
                        {isDownloading ? (
                          <>
                            <span style={styles.spinner} />
                            Downloaden...
                          </>
                        ) : (
                          <>
                            <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Importeren in Media
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Source badge */}
                  <span style={{
                    ...styles.sourceBadge,
                    backgroundColor: photo.source === 'unsplash' ? '#111' : '#05a081',
                  }}>
                    {photo.source === 'unsplash' ? 'Unsplash' : 'Pexels'}
                  </span>
                </div>

                {/* Info */}
                <div style={styles.cardInfo}>
                  <span style={styles.photographer}>
                    {photo.photographer}
                  </span>
                  <span style={styles.dimensions}>
                    {photo.width}&times;{photo.height}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && query.trim() && photos.length === 0 && !noSources && !error && (
        <div style={styles.empty}>
          <svg style={{ width: 48, height: 48, color: '#d1d5db' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <p style={{ color: '#6b7280', marginTop: '12px' }}>
            Geen foto&apos;s gevonden voor &quot;{query}&quot;
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            style={page <= 1 ? styles.pageButtonDisabled : styles.pageButton}
          >
            &larr; Vorige
          </button>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            Pagina {page} van {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            style={page >= totalPages ? styles.pageButtonDisabled : styles.pageButton}
          >
            Volgende &rarr;
          </button>
        </div>
      )}

      {/* Attribution footer */}
      {photos.length > 0 && (
        <div style={styles.attribution}>
          Foto&apos;s geleverd door{' '}
          <a href="https://unsplash.com" target="_blank" rel="noopener" style={styles.link}>Unsplash</a>
          {' & '}
          <a href="https://www.pexels.com" target="_blank" rel="noopener" style={styles.link}>Pexels</a>
          . Gratis te gebruiken voor commercieel en niet-commercieel gebruik.
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  searchBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchInputWrapper: {
    position: 'relative',
    flex: '1 1 300px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '18px',
    height: '18px',
    color: '#9ca3af',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px 10px 40px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  filters: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  select: {
    padding: '10px 12px',
    fontSize: '13px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  warning: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#fffbeb',
    border: '1px solid #fcd34d',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#92400e',
    alignItems: 'flex-start',
  },
  errorBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#991b1b',
  },
  dismissBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#991b1b',
    padding: '0 4px',
  },
  loadingBar: {
    height: '3px',
    backgroundColor: '#e5e7eb',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  loadingBarInner: {
    height: '100%',
    width: '40%',
    backgroundColor: '#3b82f6',
    borderRadius: '2px',
    animation: 'stockphoto-loading 1.2s ease-in-out infinite',
  },
  resultsInfo: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  card: {
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    backgroundColor: 'white',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  imageWrapper: {
    position: 'relative',
    aspectRatio: '4/3',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  sourceBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'white',
    letterSpacing: '0.02em',
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    backgroundColor: 'white',
    color: '#111',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  downloadBtnDisabled: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    backgroundColor: '#e5e7eb',
    color: '#6b7280',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'not-allowed',
  },
  successBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid #d1d5db',
    borderTopColor: '#111',
    borderRadius: '50%',
    animation: 'stockphoto-spin 0.6s linear infinite',
  },
  cardInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    fontSize: '12px',
  },
  photographer: {
    color: '#374151',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '65%',
  },
  dimensions: {
    color: '#9ca3af',
    flexShrink: 0,
  },
  empty: {
    textAlign: 'center',
    padding: '48px 24px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  pageButton: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 600,
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    color: '#111',
  },
  pageButtonDisabled: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 600,
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    backgroundColor: '#f9fafb',
    cursor: 'not-allowed',
    color: '#d1d5db',
  },
  attribution: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#9ca3af',
    padding: '16px 0',
    borderTop: '1px solid #f3f4f6',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
}
