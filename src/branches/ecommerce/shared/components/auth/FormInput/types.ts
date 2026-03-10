export interface FormInputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  label?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  icon?: string // Lucide icon name
  showPasswordToggle?: boolean // Auto-enabled for type="password"
  autoComplete?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  className?: string
  id?: string
  name?: string
}
