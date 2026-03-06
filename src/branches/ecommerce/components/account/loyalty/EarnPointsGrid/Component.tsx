import React from 'react'
import { Zap, Star } from 'lucide-react'
import type { EarnPointsGridProps } from './types'
import type { EarnWayColor } from '@/branches/ecommerce/templates/account/AccountTemplate1/LoyaltyTemplate/types'

const bgColorMap: Record<EarnWayColor, string> = {
  teal: 'var(--color-primary-glow)',
  purple: 'rgba(124,58,237,0.1)',
  blue: 'rgba(33,150,243,0.1)',
  green: 'rgba(0,200,83,0.1)',
  amber: 'rgba(245,158,11,0.1)',
  coral: 'rgba(255,107,107,0.1)',
}

export function EarnPointsGrid({ earnWays }: EarnPointsGridProps) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-extrabold mb-3 flex items-center gap-2 text-gray-900">
        <Zap className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
        Punten verdienen
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {earnWays.map((way) => (
          <div
            key={way.id}
            className="bg-white border border-gray-200 rounded-xl p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-primary"
            style={{ '--tw-border-opacity': '1' } as React.CSSProperties}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2 text-2xl"
              style={{ background: bgColorMap[way.bgColor] }}
            >
              {way.icon}
            </div>
            <div className="text-sm font-bold text-gray-900 mb-0.5">{way.name}</div>
            <div className="text-xs text-gray-500">{way.description}</div>
            <div
              className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{
                background: 'var(--color-primary-glow)',
                color: 'var(--color-primary)',
              }}
            >
              <Star className="w-2.5 h-2.5" />
              {way.points} {typeof way.points === 'number' ? 'pts' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
