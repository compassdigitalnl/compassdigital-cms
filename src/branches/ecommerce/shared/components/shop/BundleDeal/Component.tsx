'use client'

import { CountdownTimer } from '@/features/promotions/components/CountdownTimer'
import type { BundleDealProps } from './types'

export function BundleDeal({ title, products, bundlePrice, savingsLabel, endDate }: BundleDealProps) {
  const totalOriginal = products.reduce((sum, p) => sum + p.originalPrice, 0)
  const savings = totalOriginal - bundlePrice

  return (
    <div className="border border-amber-200 rounded-lg bg-amber-50 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-navy">{title}</h3>
        {endDate && (
          <CountdownTimer endDate={endDate} label="Nog" className="text-amber-600" />
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-3">
            {index > 0 && (
              <span className="text-2xl font-bold text-amber-500">+</span>
            )}
            <div className="flex flex-col items-center text-center">
              {product.image && (
                <div className="w-20 h-20 bg-white rounded border border-grey-light flex items-center justify-center mb-1 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              <span className="text-sm text-grey-dark line-clamp-2">{product.title}</span>
              <span className="text-sm text-grey-mid line-through">
                &euro;{product.originalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-amber-200 pt-4">
        <div>
          <span className="text-sm text-grey-mid line-through mr-2">
            &euro;{totalOriginal.toFixed(2)}
          </span>
          <span className="text-2xl font-bold text-amber-600">
            &euro;{bundlePrice.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="bg-amber-600 text-white text-sm font-bold px-3 py-1 rounded-full">
            {savingsLabel}
          </span>
          {savings > 0 && (
            <span className="text-xs text-grey-mid mt-1">
              Bespaar &euro;{savings.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
