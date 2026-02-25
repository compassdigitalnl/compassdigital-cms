import { InputHTMLAttributes, ReactNode } from 'react'

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  leftIcon?: ReactNode
  showPasswordToggle?: boolean
  error?: string
  helperText?: string
}
