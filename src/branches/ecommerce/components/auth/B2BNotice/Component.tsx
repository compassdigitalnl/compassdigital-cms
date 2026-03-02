'use client'

/**
 * B2BNotice - B2B account approval information banner
 *
 * Features:
 * - 3 variants: pending, approved, info
 * - Icon + message layout
 * - Subtle styling (light grey background)
 * - Displayed at top of registration form
 *
 * @component
 * @example
 * <B2BNotice variant="pending" />
 *
 * @example
 * <B2BNotice
 *   variant="info"
 *   message="Registreer een zakelijk account voor exclusieve voordelen."
 *   icon="ℹ️"
 * />
 */

export interface B2BNoticeProps {
  variant?: 'pending' | 'approved' | 'info'
  message?: string // Custom message (overrides default)
  icon?: string // Custom icon (overrides default)
  className?: string
}

const variants = {
  pending: {
    icon: '🏥',
    message:
      'B2B registratie — Uw aanvraag wordt binnen 1 werkdag beoordeeld. Na goedkeuring ontvangt u uw persoonlijke prijsafspraken.',
  },
  approved: {
    icon: '✓',
    message:
      'Zakelijk account goedgekeurd! — U heeft nu toegang tot persoonlijke staffelprijzen en B2B-voordelen.',
  },
  info: {
    icon: 'ℹ️',
    message: 'Registreer een zakelijk account voor exclusieve voordelen.',
  },
}

export function B2BNotice({
  variant = 'pending',
  message,
  icon,
  className = '',
}: B2BNoticeProps) {
  const variantData = variants[variant]
  const displayIcon = icon || variantData.icon
  const displayMessage = message || variantData.message

  // Parse message for bold text (text before em-dash)
  const parts = displayMessage.split('—')
  const boldPart = parts[0]?.trim()
  const regularPart = parts.slice(1).join('—').trim()

  return (
    <div
      className={`rounded-lg p-4 flex items-start gap-2.5 text-[13px] leading-relaxed mb-[18px] ${className}`}
      style={{
        background: 'rgba(10, 38, 71, 0.03)',
        border: '1px solid rgba(10, 38, 71, 0.08)',
        color: 'var(--color-text-secondary, #64748B)',
      }}
    >
      {/* Icon */}
      <span className="text-lg flex-shrink-0 mt-[1px]">{displayIcon}</span>

      {/* Message */}
      <div>
        {parts.length > 1 ? (
          <>
            <strong style={{ color: 'var(--color-text-primary, #0A1628)' }}>
              {boldPart}
            </strong>{' '}
            — {regularPart}
          </>
        ) : (
          displayMessage
        )}
      </div>
    </div>
  )
}
