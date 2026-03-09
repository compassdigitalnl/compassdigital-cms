export interface PersonalizationTextInputProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  label?: string
  helperText?: string
  required?: boolean
  className?: string
}
