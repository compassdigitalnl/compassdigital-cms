'use client'

import type { ActivityTickerProps } from './types'

export function ActivityTicker({ items, className = '' }: ActivityTickerProps) {
  if (items.length === 0) return null

  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...items, ...items]

  return (
    <div
      className={`bg-[#FFF8E1] border-y border-amber-200 overflow-hidden ${className}`}
    >
      <div className="flex gap-8 py-2 animate-ticker">
        {duplicatedItems.map((item, index) => {
          // Split text around the highlight to render it bold
          const parts = item.text.split(item.highlight)

          return (
            <div
              key={index}
              className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs text-gray-700">
                {parts.length > 1 ? (
                  <>
                    {parts[0]}
                    <span className="font-bold text-[var(--color-navy)]">
                      {item.highlight}
                    </span>
                    {parts[1]}
                  </>
                ) : (
                  <>
                    <span className="font-bold text-[var(--color-navy)]">
                      {item.highlight}
                    </span>{' '}
                    {item.text}
                  </>
                )}
              </span>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker {
          animation: ticker-scroll 40s linear infinite;
        }
      `}</style>
    </div>
  )
}
