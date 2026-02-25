export type PasswordStrength = 'weak' | 'medium' | 'strong'

export interface PasswordStrengthMeterProps {
  password: string
  showLabel?: boolean
  className?: string
}

export interface PasswordStrengthResult {
  strength: PasswordStrength
  score: number
  label: string
}
