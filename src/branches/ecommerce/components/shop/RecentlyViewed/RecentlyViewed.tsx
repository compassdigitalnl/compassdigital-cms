'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const STORAGE_KEY = 'recently-viewed-products'
const MAX_ITEMS = 10

export interface RecentlyViewedProduct {
  id: string
  title: string
  slug: string
  price: number
  image?: string
}

export function addToRecentlyViewed(product: RecentlyViewedProduct) {
  if (typeof window === 'undefined') return

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as RecentlyViewedProduct[]
    const filtered = stored.filter((p) => p.id !== product.id)
    filtered.unshift(product)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)))
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function RecentlyViewed({ className = '' }: { className?: string }) {
  const [items, setItems] = useState<RecentlyViewedProduct[]>([])

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as RecentlyViewedProduct[]
      setItems(stored)
    } catch {
      // Silently fail
    }
  }, [])

  if (items.length === 0) return null

  return (
    <section className={`py-8 ${className}`}>
      <h2
        className="text-[18px] font-bold mb-4"
        style={{ color: 'var(--navy, #0A1628)' }}
      >
        Recent bekeken
      </h2>
      <div
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {items.map((product) => (
          <Link
            key={product.id}
            href={`/${product.slug}`}
            className="flex-shrink-0 rounded-xl border bg-white transition-shadow hover:shadow-md"
            style={{
              width: '160px',
              borderColor: 'var(--grey, #E8ECF1)',
              scrollSnapAlign: 'start',
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                height: '100px',
                background: 'var(--bg, #F5F7FA)',
                borderRadius: '12px 12px 0 0',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  style={{ objectFit: 'contain', padding: '8px' }}
                />
              ) : (
                <span style={{ fontSize: '32px', opacity: 0.5 }}>📦</span>
              )}
            </div>
            <div className="p-2.5">
              <div
                className="text-[12px] font-medium leading-tight"
                style={{
                  color: 'var(--navy, #0A1628)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {product.title}
              </div>
              <div
                className="text-[13px] font-bold mt-1"
                style={{ color: 'var(--navy, #0A1628)' }}
              >
                € {(product.price ?? 0).toFixed(2).replace('.', ',')}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
