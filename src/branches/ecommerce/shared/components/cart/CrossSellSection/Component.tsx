'use client'

import { Sparkles, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { CrossSellSectionProps } from './types'

export default function CrossSellSection({
  products,
  title = 'Vaak samen besteld',
  onAddToCart,
  className = '',
}: CrossSellSectionProps) {
  if (products.length === 0) return null

  return (
    <section className={className}>
      <h3 className="cross-sell__title">
        <Sparkles className="cross-sell__title-icon" />
        {title}
      </h3>
      <div className="cross-sell__grid">
        {products.map((product) => (
          <div key={product.id} className="cross-sell__card">
            <Link href={`/shop/${product.slug}`} className="cross-sell__img-link">
              <div className="cross-sell__img">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="120px"
                  />
                ) : (
                  <span className="cross-sell__img-placeholder" />
                )}
              </div>
            </Link>
            <div className="cross-sell__body">
              {product.brand && (
                <span className="cross-sell__brand">{product.brand}</span>
              )}
              <Link href={`/shop/${product.slug}`} className="cross-sell__name">
                {product.title}
              </Link>
              <div className="cross-sell__bottom">
                <span className="cross-sell__price">
                  &euro;{product.price.toFixed(2).replace('.', ',')}
                </span>
                {onAddToCart && (
                  <button
                    className="cross-sell__add"
                    onClick={() => onAddToCart(product.id)}
                    aria-label={`${product.title} toevoegen aan winkelwagen`}
                  >
                    <Plus className="cross-sell__add-icon" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .cross-sell__title {
          font-family: var(--font-display);
          font-size: var(--text-card-title);
          font-weight: 800;
          color: var(--navy);
          margin-bottom: var(--sp-4);
          display: flex;
          align-items: center;
          gap: var(--sp-2);
        }
        .cross-sell__title-icon {
          width: 20px;
          height: 20px;
          color: var(--teal);
        }
        .cross-sell__grid {
          display: flex;
          gap: var(--sp-4);
          overflow-x: auto;
          padding-bottom: var(--sp-2);
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .cross-sell__grid::-webkit-scrollbar {
          height: 4px;
        }
        .cross-sell__grid::-webkit-scrollbar-track {
          background: var(--grey);
          border-radius: 2px;
        }
        .cross-sell__grid::-webkit-scrollbar-thumb {
          background: var(--grey-mid);
          border-radius: 2px;
        }
        .cross-sell__card {
          flex-shrink: 0;
          width: 200px;
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: var(--r-lg);
          overflow: hidden;
          transition: all var(--transition, 0.3s);
          scroll-snap-align: start;
        }
        .cross-sell__card:hover {
          transform: translateY(-3px);
          box-shadow: var(--sh-md);
          border-color: transparent;
        }
        .cross-sell__img-link {
          display: block;
          text-decoration: none;
        }
        .cross-sell__img {
          height: 120px;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .cross-sell__img-placeholder {
          width: 48px;
          height: 48px;
          background: var(--grey);
          border-radius: var(--r-sm);
        }
        .cross-sell__body {
          padding: var(--sp-3);
        }
        .cross-sell__brand {
          font-size: var(--text-label);
          font-weight: 700;
          text-transform: uppercase;
          color: var(--teal);
          letter-spacing: 0.05em;
          display: block;
        }
        .cross-sell__name {
          font-size: var(--text-body);
          font-weight: 600;
          color: var(--navy);
          line-height: 1.3;
          margin: var(--sp-1) 0 var(--sp-2);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-decoration: none;
        }
        .cross-sell__name:hover {
          color: var(--teal);
        }
        .cross-sell__bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cross-sell__price {
          font-family: var(--font-display);
          font-size: var(--text-body-lg);
          font-weight: 800;
          color: var(--navy);
        }
        .cross-sell__add {
          width: 34px;
          height: 34px;
          background: var(--teal);
          color: white;
          border: none;
          border-radius: var(--r-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition, 0.2s);
          flex-shrink: 0;
        }
        .cross-sell__add:hover {
          background: var(--navy);
        }
        .cross-sell__add-icon {
          width: 16px;
          height: 16px;
        }

        @media (max-width: 640px) {
          .cross-sell__card {
            width: 160px;
          }
          .cross-sell__img {
            height: 100px;
          }
        }
      `}</style>
    </section>
  )
}
