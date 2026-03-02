'use client'

/**
 * GuestInfoBox - Account benefits information box
 *
 * Features:
 * - Teal gradient background
 * - Shows benefits of creating an account
 * - 2-column grid of benefits (responsive)
 * - Displayed in guest checkout form
 *
 * @component
 * @example
 * <GuestInfoBox />
 *
 * @example
 * <GuestInfoBox
 *   title="Account voordelen"
 *   benefits={['Sneller bestellen', 'Betere prijzen']}
 * />
 */

export interface GuestInfoBoxProps {
  title?: string
  description?: string
  benefits?: string[]
  showIcon?: boolean
  className?: string
}

const defaultBenefits = [
  'Persoonlijke staffelprijzen',
  'Bestelhistorie inzien',
  'Snelle nabestellingen',
  'Bestellijsten opslaan',
]

export function GuestInfoBox({
  title = 'Goed om te weten',
  description = 'Als gast kunt u eenmalig bestellen zonder account. Met een account profiteert u van:',
  benefits = defaultBenefits,
  showIcon = true,
  className = '',
}: GuestInfoBoxProps) {
  return (
    <div
      className={`rounded-xl p-5 mb-6 ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(0,137,123,0.04), rgba(10,38,71,0.02))',
        border: '1px solid rgba(0,137,123,0.12)',
      }}
    >
      {/* Title */}
      <h4
        className="text-sm font-semibold mb-1.5 flex items-center gap-2"
        style={{ color: 'var(--color-text-primary, #0A1628)' }}
      >
        {showIcon && <span>ℹ️</span>}
        {title}
      </h4>

      {/* Description */}
      {description && (
        <p
          className="text-[13px] leading-relaxed mb-3.5"
          style={{ color: 'var(--color-text-secondary, #64748B)' }}
        >
          {description}
        </p>
      )}

      {/* Benefits Grid */}
      {benefits.length > 0 && (
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-2.5">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: 'var(--color-text-secondary, #64748B)' }}
            >
              <span
                className="font-bold text-sm flex-shrink-0"
                style={{ color: 'var(--color-primary, #00897B)' }}
              >
                ✓
              </span>
              {benefit}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
