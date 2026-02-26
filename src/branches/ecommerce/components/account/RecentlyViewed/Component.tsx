'use client'

import React, { useRef } from 'react'
import { Clock, ChevronLeft, ChevronRight, Heart, ShoppingCart, Trash2 } from 'lucide-react'
import Image from 'next/image'
import type { RecentlyViewedProps, RecentlyViewedProduct } from './types'

// Helper: Format relative time
function formatRelativeTime(isoTimestamp: string): string {
  const now = new Date()
  const then = new Date(isoTimestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Zojuist'
  if (diffMins < 60) return `${diffMins} min`
  if (diffHours < 24) return `${diffHours} uur`
  if (diffDays === 1) return 'Gisteren'
  return `${diffDays} dagen`
}

// Helper: Format price
function formatPrice(cents: number, currency = '€'): string {
  const amount = (cents / 100).toFixed(2).replace('.', ',')
  return `${currency}${amount}`
}

/**
 * RecentlyViewed Component
 *
 * Horizontal scrolling carousel showing recently viewed products with
 * timestamps, favorites, and quick add-to-cart.
 *
 * @example
 * ```tsx
 * <RecentlyViewed
 *   products={recentlyViewed}
 *   onAddToCart={handleAddToCart}
 *   onAddToFavorites={handleAddToFavorites}
 *   onClearHistory={handleClearHistory}
 * />
 * ```
 */
export function RecentlyViewed({
  products,
  onProductClick,
  onAddToCart,
  onAddToFavorites,
  onClearHistory,
  maxProducts = 20,
  className = '',
}: RecentlyViewedProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const displayProducts = products.slice(0, maxProducts)

  const handleScroll = (direction: number) => {
    if (scrollRef.current) {
      const scrollAmount = 200 // Scroll by ~1 card width
      scrollRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleClearHistory = async () => {
    if (confirm('Weet u zeker dat u de geschiedenis wilt wissen?')) {
      if (onClearHistory) {
        await onClearHistory()
      }
    }
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className={`rv-section ${className}`}>
      <div className="rv-header">
        <h2 className="rv-title">
          <Clock size={20} />
          Recent bekeken
        </h2>
        <div className="rv-nav">
          <button
            className="rv-nav-btn"
            onClick={() => handleScroll(-1)}
            aria-label="Vorige producten"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="rv-nav-btn"
            onClick={() => handleScroll(1)}
            aria-label="Volgende producten"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="rv-scroll" ref={scrollRef} role="list" aria-label="Recent bekeken producten">
        {displayProducts.map((product) => (
          <a
            key={product.id}
            href={`/${product.slug}`}
            className="rv-card"
            role="listitem"
            onClick={(e) => {
              if (onProductClick) {
                e.preventDefault()
                onProductClick(product)
              }
            }}
          >
            {onAddToFavorites && (
              <button
                className="rv-card-fav"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onAddToFavorites(product.id)
                }}
                aria-label="Voeg toe aan favorieten"
              >
                <Heart size={14} />
              </button>
            )}

            <div className="rv-card-img">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={180}
                  height={120}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              ) : (
                <span className="rv-card-placeholder">{product.imagePlaceholder || '📦'}</span>
              )}
              <div className="rv-card-time">
                <Clock size={10} /> {formatRelativeTime(product.viewedAt)}
              </div>
            </div>

            <div className="rv-card-body">
              {product.brand && <div className="rv-card-brand">{product.brand}</div>}
              <div className="rv-card-name">{product.name}</div>
              <div className="rv-card-bottom">
                <span className="rv-card-price">{formatPrice(product.price)}</span>
                {onAddToCart && (
                  <button
                    className="rv-card-cart"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onAddToCart(product.id)
                    }}
                    aria-label="Voeg toe aan winkelwagen"
                  >
                    <ShoppingCart size={13} />
                  </button>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>

      {onClearHistory && (
        <button className="rv-clear" onClick={handleClearHistory} tabIndex={0}>
          <Trash2 size={13} /> Geschiedenis wissen
        </button>
      )}

      <style jsx>{`
        .rv-section {
          max-width: 900px;
        }

        .rv-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-14);
        }

        .rv-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: var(--space-8);
          color: var(--navy);
        }

        .rv-title :global(svg) {
          color: var(--teal);
        }

        .rv-nav {
          display: flex;
          gap: var(--space-6);
        }

        .rv-nav-btn {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--grey);
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition);
        }

        .rv-nav-btn:hover {
          border-color: var(--teal);
          background: var(--teal-glow);
        }

        .rv-nav-btn :global(svg) {
          color: var(--navy);
        }

        .rv-scroll {
          display: flex;
          gap: var(--space-12);
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: var(--space-4) 0 var(--space-12);
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .rv-scroll::-webkit-scrollbar {
          display: none;
        }

        .rv-card {
          min-width: 180px;
          max-width: 180px;
          background: white;
          border: 1px solid var(--grey);
          border-radius: var(--radius-lg);
          overflow: hidden;
          scroll-snap-align: start;
          transition: all 0.25s;
          flex-shrink: 0;
          position: relative;
          text-decoration: none;
          color: inherit;
        }

        .rv-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
          border-color: transparent;
        }

        .rv-card-img {
          height: 120px;
          background: var(--grey-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          position: relative;
          overflow: hidden;
        }

        .rv-card-placeholder {
          font-size: 36px;
        }

        .rv-card-time {
          position: absolute;
          bottom: 6px;
          right: 6px;
          background: white;
          padding: 2px 6px;
          border-radius: var(--radius-xs);
          font-size: 10px;
          font-weight: 600;
          color: var(--grey-mid);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        }

        .rv-card-fav {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          border: none;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
          opacity: 0;
          transition: all var(--transition);
          z-index: 1;
        }

        .rv-card:hover .rv-card-fav {
          opacity: 1;
        }

        .rv-card-fav :global(svg) {
          color: var(--grey-mid);
        }

        .rv-card-fav:hover :global(svg) {
          color: var(--coral);
        }

        .rv-card-body {
          padding: var(--space-12);
        }

        .rv-card-brand {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--teal);
        }

        .rv-card-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--navy);
          line-height: 1.25;
          margin: var(--space-2) 0 var(--space-6);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .rv-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .rv-card-price {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 800;
          color: var(--navy);
        }

        .rv-card-cart {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          border: none;
          background: var(--teal);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition);
        }

        .rv-card-cart:hover {
          background: var(--navy);
        }

        .rv-clear {
          font-size: 13px;
          color: var(--grey-mid);
          text-align: center;
          margin-top: var(--space-8);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-5);
          transition: color var(--transition);
          background: none;
          border: none;
          font-family: var(--font-primary);
        }

        .rv-clear:hover {
          color: var(--coral);
        }

        /* Mobile */
        @media (max-width: 640px) {
          .rv-nav {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}
