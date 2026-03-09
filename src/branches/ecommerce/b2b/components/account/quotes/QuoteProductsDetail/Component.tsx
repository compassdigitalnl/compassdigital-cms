'use client'

import React from 'react'
import { FileText, Clock } from 'lucide-react'
import type { QuoteProductsDetailProps } from './types'

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)

export default function QuoteProductsDetail({ products, quotedPrice, status }: QuoteProductsDetailProps) {
  const hasItemPrices = products.some((p) => p.quotedUnitPrice != null)
  const itemsTotal = hasItemPrices
    ? products.reduce((sum, p) => sum + (p.quotedUnitPrice || 0) * p.quantity, 0)
    : null

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'var(--white)', border: '1px solid var(--grey)', boxShadow: 'var(--sh-sm)' }}
    >
      <h3 className="text-base font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}>
        <FileText className="w-4 h-4 inline mr-2" />
        Producten
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--grey)' }}>
              <th className="text-left py-2 font-semibold" style={{ color: 'var(--navy)' }}>Product</th>
              <th className="text-left py-2 font-semibold" style={{ color: 'var(--navy)' }}>SKU</th>
              <th className="text-right py-2 font-semibold" style={{ color: 'var(--navy)' }}>Aantal</th>
              {hasItemPrices && (
                <>
                  <th className="text-right py-2 font-semibold" style={{ color: 'var(--navy)' }}>Stuksprijs</th>
                  <th className="text-right py-2 font-semibold" style={{ color: 'var(--navy)' }}>Subtotaal</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--grey)' }}>
                <td className="py-3" style={{ color: 'var(--navy)' }}>{product.name}</td>
                <td className="py-3" style={{ color: 'var(--grey-mid)' }}>{product.sku || '-'}</td>
                <td className="py-3 text-right" style={{ color: 'var(--navy)' }}>{product.quantity}</td>
                {hasItemPrices && (
                  <>
                    <td className="py-3 text-right" style={{ color: 'var(--navy)' }}>
                      {product.quotedUnitPrice != null ? formatCurrency(product.quotedUnitPrice) : '-'}
                    </td>
                    <td className="py-3 text-right font-medium" style={{ color: 'var(--navy)' }}>
                      {product.quotedUnitPrice != null
                        ? formatCurrency(product.quotedUnitPrice * product.quantity)
                        : '-'}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(quotedPrice != null || itemsTotal != null) && (
        <div className="mt-4 pt-4" style={{ borderTop: '2px solid var(--grey)' }}>
          <div className="flex justify-between items-center">
            <span className="text-base font-bold" style={{ color: 'var(--navy)' }}>
              Totaalprijs (excl. BTW)
            </span>
            <span className="text-xl font-bold" style={{ color: 'var(--teal)' }}>
              {formatCurrency(quotedPrice ?? itemsTotal ?? 0)}
            </span>
          </div>
        </div>
      )}

      {quotedPrice == null && !hasItemPrices && ['new', 'processing'].includes(status) && (
        <div className="mt-4 p-3 rounded-lg text-center" style={{ background: '#F3F4F6' }}>
          <p className="text-sm" style={{ color: 'var(--grey-mid)' }}>
            <Clock className="w-4 h-4 inline mr-1" />
            Prijs wordt berekend — u ontvangt binnenkort een offerte
          </p>
        </div>
      )}
    </div>
  )
}
