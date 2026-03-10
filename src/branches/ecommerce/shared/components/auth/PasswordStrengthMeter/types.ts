export interface PasswordStrengthMeterProps {
  password: string
  showRequirements?: boolean // Show requirements checklist
  minLength?: number // Default: 8
  className?: string
}
