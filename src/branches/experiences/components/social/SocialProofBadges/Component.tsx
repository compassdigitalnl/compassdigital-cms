import type { SocialProofBadgesProps } from './types'

export function SocialProofBadges({ badges, className = '' }: SocialProofBadgesProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {badges.map((badge, index) => {
        // Split text around the highlight to render it bold
        const parts = badge.text.split(badge.highlight)

        return (
          <div
            key={index}
            className="flex items-center gap-2 bg-white border border-grey-light rounded-lg py-1.5 px-3"
          >
            <span className="text-base flex-shrink-0">{badge.icon}</span>
            <span className="text-xs text-grey-dark">
              {parts.length > 1 ? (
                <>
                  {parts[0]}
                  <span className="font-bold text-[var(--color-navy)]">{badge.highlight}</span>
                  {parts[1]}
                </>
              ) : (
                <>
                  <span className="font-bold text-[var(--color-navy)]">{badge.highlight}</span>
                  {' '}
                  {badge.text}
                </>
              )}
            </span>
          </div>
        )
      })}
    </div>
  )
}
