'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Package, PackageX, ChevronDown, Hash } from 'lucide-react'
import { getIcon } from '@/utilities/getIcon'
import type { OrderItemsSummaryProps } from './types'

/**
 * OrderItemsSummary Component
 *
 * Displays a compact list of products in an order. Features collapsible header,
 * product thumbnails, metadata (size/color/qty), and line prices.
 *
 * @example
 * ```tsx
 * <OrderItemsSummary
 *   items={orderItems}
 *   collapsible={true}
 * />
 * ```
 */
export function OrderItemsSummary({
  items,
  title = 'Bestelde producten',
  collapsible = false,
  defaultCollapsed = false,
  variant = 'default',
  className = '',
  onToggle,
}: OrderItemsSummaryProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const handleToggle = () => {
    if (!collapsible) return
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    onToggle?.(newCollapsed)
  }

  // Format currency (cents to euros)
  const formatPrice = (cents: number) => {
    const amount = (cents / 100).toFixed(2).replace('.', ',')
    return `€ ${amount}`
  }

  // Get Lucide icon component by name
  const resolveIcon = (iconName?: string) => {
    if (!iconName) return Hash
    return getIcon(iconName, Hash)!
  }

  return (
    <section
      className={`order-items-summary ${variant} ${collapsible ? 'collapsible' : ''} ${collapsed ? 'collapsed' : ''} ${className}`}
      aria-label="Order items"
    >
      {/* Header */}
      <div
        className="order-items-header"
        onClick={handleToggle}
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? !collapsed : undefined}
        onKeyDown={
          collapsible
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleToggle()
                }
              }
            : undefined
        }
      >
        <div className="order-items-title">
          <Package size={20} aria-hidden="true" />
          {title}
          <span className="order-items-count">
            {items.length} {items.length === 1 ? 'product' : 'producten'}
          </span>
          {collapsible && (
            <div className="order-items-toggle" aria-hidden="true">
              <ChevronDown size={20} />
            </div>
          )}
        </div>
      </div>

      {/* Items list or empty state */}
      {items.length === 0 ? (
        <div className="order-items-empty">
          <PackageX size={48} aria-hidden="true" />
          <div className="order-items-empty-title">Geen producten gevonden</div>
          <div className="order-items-empty-text">
            Er zijn geen producten in deze bestelling
          </div>
        </div>
      ) : (
        <div className="order-items-list">
          {items.map((item, index) => (
            <article key={item.id} className="order-item">
              {/* Product thumbnail */}
              <div className="order-item-image">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={60}
                    height={60}
                    style={{ objectFit: 'cover', borderRadius: '10px' }}
                  />
                ) : (
                  <span aria-hidden="true">{item.imagePlaceholder || '📦'}</span>
                )}
              </div>

              {/* Product info */}
              <div className="order-item-info">
                <div className="order-item-name">{item.name}</div>
                <div className="order-item-meta">
                  {item.metadata.map((meta, metaIndex) => {
                    const IconComponent = resolveIcon(meta.icon)
                    return (
                      <div key={metaIndex} className="order-item-meta-item">
                        <IconComponent size={12} aria-hidden="true" />
                        {meta.label}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Price */}
              <div className="order-item-price">{formatPrice(item.price)}</div>
            </article>
          ))}
        </div>
      )}

      <style jsx>{`
        /* Container */
        .order-items-summary {
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: var(--space-32);
        }

        /* Header */
        .order-items-header {
          padding: var(--space-20) var(--space-24);
          background: var(--bg);
          border-bottom: 1px solid var(--grey);
        }

        .order-items-summary.collapsible .order-items-header {
          cursor: pointer;
          user-select: none;
        }

        .order-items-summary.collapsible .order-items-header:hover {
          background: #ebeef2;
        }

        .order-items-title {
          font-family: var(--font-body);
          font-size: 16px;
          font-weight: 700;
          color: var(--navy);
          display: flex;
          align-items: center;
          gap: var(--space-8);
        }

        .order-items-title :global(svg):first-child {
          color: var(--teal);
        }

        .order-items-count {
          font-size: 13px;
          font-weight: 500;
          color: var(--grey-mid);
          margin-left: auto;
        }

        .order-items-toggle {
          transition: transform var(--transition);
        }

        .order-items-toggle :global(svg) {
          color: var(--grey-mid);
        }

        .order-items-summary.collapsed .order-items-toggle {
          transform: rotate(-90deg);
        }

        /* List */
        .order-items-list {
          padding: var(--space-20) var(--space-24);
        }

        .order-items-summary.collapsed .order-items-list {
          display: none;
        }

        /* Item row */
        .order-item {
          display: flex;
          align-items: center;
          gap: var(--space-16);
          padding: var(--space-16) 0;
          border-bottom: 1px solid var(--grey);
          transition: background var(--transition);
        }

        .order-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .order-item:first-child {
          padding-top: 0;
        }

        .order-item:hover {
          background: var(--color-primary-glow);
          margin-left: calc(var(--space-24) * -1);
          margin-right: calc(var(--space-24) * -1);
          padding-left: var(--space-24);
          padding-right: var(--space-24);
        }

        /* Product thumbnail */
        .order-item-image {
          width: 60px;
          height: 60px;
          background: var(--bg);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
          border: 1px solid var(--grey);
        }

        /* Product info */
        .order-item-info {
          flex: 1;
          min-width: 0;
        }

        .order-item-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--navy);
          margin-bottom: var(--space-4);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .order-item-meta {
          font-size: 12px;
          color: var(--grey-mid);
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-12);
          align-items: center;
        }

        .order-item-meta-item {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .order-item-meta-item :global(svg) {
          opacity: 0.7;
        }

        /* Price */
        .order-item-price {
          font-family: var(--font-body);
          font-size: 16px;
          font-weight: 800;
          color: var(--navy);
          flex-shrink: 0;
        }

        /* Empty state */
        .order-items-empty {
          padding: var(--space-48) var(--space-24);
          text-align: center;
        }

        .order-items-empty :global(svg) {
          color: var(--grey-mid);
          margin: 0 auto var(--space-16);
        }

        .order-items-empty-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: var(--space-8);
        }

        .order-items-empty-text {
          font-size: 14px;
          color: var(--grey-mid);
        }

        /* Compact variant */
        .order-items-summary.compact .order-item-image {
          width: 48px;
          height: 48px;
          font-size: 24px;
        }

        .order-items-summary.compact .order-item-name {
          font-size: 13px;
        }

        .order-items-summary.compact .order-item-meta {
          font-size: 11px;
        }

        .order-items-summary.compact .order-item-price {
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .order-item {
            flex-wrap: wrap;
          }

          .order-item-price {
            width: 100%;
            text-align: right;
            margin-top: var(--space-8);
          }

          .order-item-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-4);
          }
        }
      `}</style>
    </section>
  )
}
