'use client'

import React, { useMemo } from 'react'
import styles from './PasswordStrengthMeter.module.css'
import type { PasswordStrengthMeterProps, PasswordStrengthResult } from './types'

/**
 * Calculate password strength based on multiple criteria:
 * - Length >= 8 chars
 * - Length >= 12 chars
 * - Has lowercase letters
 * - Has uppercase letters
 * - Has numbers
 * - Has special characters
 */
function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { strength: 'weak', score: 0, label: '' }
  }

  let score = 0

  // Length criteria
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // Character type criteria
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  // Determine strength
  if (score <= 2) {
    return { strength: 'weak', score, label: 'Zwak' }
  } else if (score <= 4) {
    return { strength: 'medium', score, label: 'Gemiddeld' }
  } else {
    return { strength: 'strong', score, label: 'Sterk' }
  }
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showLabel = true,
  className = '',
}) => {
  const result = useMemo(() => calculatePasswordStrength(password), [password])

  if (!password) {
    return null
  }

  return (
    <div className={`${styles.pwStrength} ${className}`}>
      <div className={styles.pwBar}>
        <div className={`${styles.pwFill} ${styles[result.strength]}`} />
      </div>
      {showLabel && (
        <span className={`${styles.pwLabel} ${styles[result.strength]}`}>
          {result.label}
        </span>
      )}
    </div>
  )
}

export default PasswordStrengthMeter
