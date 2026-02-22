'use client'

/**
 * Free Shipping Progress Component
 *
 * Shows progress towards free shipping threshold with visual feedback.
 * Supports two variants for different cart templates.
 *
 * Features:
 * - Progress bar with percentage
 * - Dynamic message ("Nog €X tot gratis verzending" vs "Gratis verzending bereikt!")
 * - Color coding (primary → success when reached)
 * - Two visual variants (bar vs card)
 *
 * @example
 * ```tsx
 * <FreeShippingProgress
 *   currentTotal={112.50}
 *   freeShippingThreshold={150}
 *   variant="card"
 * />
 * ```
 */

export interface FreeShippingProgressProps {
  /** Current cart total */
  currentTotal: number
  /** Minimum amount for free shipping (from Settings global) */
  freeShippingThreshold: number
  /** Visual style variant */
  variant?: 'bar' | 'card'
  /** Optional className for custom styling */
  className?: string
}

export function FreeShippingProgress({
  currentTotal,
  freeShippingThreshold,
  variant = 'card',
  className = '',
}: FreeShippingProgressProps) {
  // Calculate progress
  const progress = Math.min((currentTotal / freeShippingThreshold) * 100, 100)
  const remaining = Math.max(freeShippingThreshold - currentTotal, 0)
  const hasReached = currentTotal >= freeShippingThreshold

  if (variant === 'bar') {
    return <BarVariant progress={progress} remaining={remaining} hasReached={hasReached} className={className} />
  }

  return (
    <CardVariant
      currentTotal={currentTotal}
      threshold={freeShippingThreshold}
      progress={progress}
      remaining={remaining}
      hasReached={hasReached}
      className={className}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BAR VARIANT (for CartTemplate1 - compact)
// ─────────────────────────────────────────────────────────────────────────────

function BarVariant({
  progress,
  remaining,
  hasReached,
  className,
}: {
  progress: number
  remaining: number
  hasReached: boolean
  className: string
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${className}`}
      style={{
        background: hasReached
          ? 'var(--color-success-bg, #f0fdf4)'
          : 'var(--color-primary-bg, rgba(0, 137, 123, 0.04))',
        borderColor: hasReached
          ? 'var(--color-success-border, #bbf7d0)'
          : 'var(--color-primary-border, rgba(0, 137, 123, 0.12))',
      }}
    >
      {/* Icon */}
      <span className="text-xl flex-shrink-0">{hasReached ? '🎉' : '🚚'}</span>

      {/* Text + Progress */}
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-semibold mb-1.5"
          style={{
            color: hasReached ? 'var(--color-success, #16a34a)' : 'var(--color-primary, #00897b)',
          }}
        >
          {hasReached ? 'Gratis verzending bereikt!' : `Nog €${remaining.toFixed(2)} tot gratis verzending!`}
        </div>
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: 'rgba(0, 0, 0, 0.08)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: hasReached ? 'var(--color-success, #16a34a)' : 'var(--color-primary, #00897b)',
            }}
          />
        </div>
      </div>

      {/* Amount */}
      <div
        className="text-xs font-bold flex-shrink-0"
        style={{
          color: hasReached ? 'var(--color-success, #16a34a)' : 'var(--color-primary, #00897b)',
        }}
      >
        {progress.toFixed(0)}%
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD VARIANT (for CartTemplate2 - visual)
// ─────────────────────────────────────────────────────────────────────────────

function CardVariant({
  currentTotal,
  threshold,
  progress,
  remaining,
  hasReached,
  className,
}: {
  currentTotal: number
  threshold: number
  progress: number
  remaining: number
  hasReached: boolean
  className: string
}) {
  return (
    <div
      className={`p-5 rounded-xl border ${className}`}
      style={{
        background: hasReached
          ? 'var(--color-success-bg, #f0fdf4)'
          : 'var(--color-primary-bg, #e0f2f1)',
        borderColor: hasReached
          ? 'var(--color-success-border, #bbf7d0)'
          : 'var(--color-primary-border, #b2dfdb)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="text-xl">{hasReached ? '🎉' : '🚚'}</span>
        <span
          className="font-semibold text-sm"
          style={{
            color: hasReached ? 'var(--color-success, #16a34a)' : 'var(--color-primary, #00897b)',
          }}
        >
          {hasReached
            ? 'Gratis verzending bereikt!'
            : `Nog €${remaining.toFixed(2)} tot gratis verzending!`}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.1)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: hasReached ? 'var(--color-success, #16a34a)' : 'var(--color-primary, #00897b)',
          }}
        />
      </div>

      {/* Footer */}
      <div
        className="text-center text-xs font-semibold mt-2"
        style={{
          color: hasReached ? 'var(--color-success, #16a34a)' : 'var(--color-primary, #00897b)',
        }}
      >
        {hasReached
          ? '✓ Uw bestelling wordt gratis verzonden'
          : `€${currentTotal.toFixed(2)} / €${threshold.toFixed(2)}`}
      </div>
    </div>
  )
}

export default FreeShippingProgress
