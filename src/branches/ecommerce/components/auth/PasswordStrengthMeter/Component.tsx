'use client'

/**
 * PasswordStrengthMeter - Real-time password strength indicator
 *
 * Features:
 * - 3 strength levels: weak, medium, strong
 * - Progress bar with color coding (coral/amber/teal)
 * - Text label with strength
 * - Optional requirements checklist
 * - Animated transitions
 *
 * Strength Criteria:
 * - Length: ≥8 chars (+1 point), ≥12 chars (+1 point)
 * - Character variety: lowercase (+1), uppercase (+1), numbers (+1), special chars (+1)
 * - Score: 0-2 = weak, 3-4 = medium, 5-6 = strong
 *
 * @component
 * @example
 * <PasswordStrengthMeter password={password} />
 *
 * @example
 * <PasswordStrengthMeter
 *   password={password}
 *   showRequirements
 *   minLength={10}
 * />
 */

import { useMemo } from 'react'
import { Check, X } from 'lucide-react'

export interface PasswordStrengthMeterProps {
  password: string
  showRequirements?: boolean // Show requirements checklist
  minLength?: number // Default: 8
  className?: string
}

type StrengthLevel = 'weak' | 'medium' | 'strong' | null

interface StrengthData {
  level: StrengthLevel
  label: string
  width: string
  color: string
}

export function PasswordStrengthMeter({
  password,
  showRequirements = false,
  minLength = 8,
  className = '',
}: PasswordStrengthMeterProps) {
  // Calculate password strength
  const strengthData = useMemo<StrengthData>(() => {
    if (!password) {
      return { level: null, label: '', width: '0%', color: 'transparent' }
    }

    let score = 0

    // Length scoring
    if (password.length >= minLength) score++
    if (password.length >= 12) score++

    // Character variety
    if (/[a-z]/.test(password)) score++ // lowercase
    if (/[A-Z]/.test(password)) score++ // uppercase
    if (/[0-9]/.test(password)) score++ // numbers
    if (/[^A-Za-z0-9]/.test(password)) score++ // special chars

    // Determine strength level
    if (score <= 2) {
      return {
        level: 'weak',
        label: 'ZWAK WACHTWOORD',
        width: '33%',
        color: '#FF6B6B', // coral
      }
    } else if (score <= 4) {
      return {
        level: 'medium',
        label: 'GEMIDDELD WACHTWOORD',
        width: '66%',
        color: '#F59E0B', // amber
      }
    } else {
      return {
        level: 'strong',
        label: 'STERK WACHTWOORD',
        width: '100%',
        color: 'var(--color-primary, #00897B)', // teal
      }
    }
  }, [password, minLength])

  // Requirements check
  const requirements = useMemo(() => {
    if (!showRequirements) return []

    return [
      {
        met: password.length >= minLength,
        label: `Minimaal ${minLength} tekens`,
      },
      {
        met: /[A-Z]/.test(password),
        label: 'Minimaal 1 hoofdletter',
      },
      {
        met: /[0-9]/.test(password),
        label: 'Minimaal 1 cijfer',
      },
      {
        met: /[^A-Za-z0-9]/.test(password),
        label: 'Minimaal 1 speciaal teken',
      },
    ]
  }, [password, minLength, showRequirements])

  // Don't render if no password
  if (!password) return null

  return (
    <div className={`mt-2 ${className}`}>
      {/* Progress Bar */}
      <div
        className="h-1 rounded-sm overflow-hidden mb-1"
        style={{ background: 'var(--color-border, #E8ECF1)' }}
      >
        <div
          className="h-full rounded-sm transition-all duration-300 ease-out"
          style={{
            width: strengthData.width,
            background: strengthData.color,
          }}
        />
      </div>

      {/* Label */}
      <div
        className="text-[11px] font-semibold tracking-wide"
        style={{ color: strengthData.color }}
      >
        {strengthData.label}
      </div>

      {/* Requirements Checklist */}
      {showRequirements && requirements.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              {req.met ? (
                <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
              )}
              <span
                className={req.met ? 'text-green-600 font-medium' : ''}
                style={{
                  color: req.met ? undefined : 'var(--color-text-muted, #94A3B8)',
                }}
              >
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
