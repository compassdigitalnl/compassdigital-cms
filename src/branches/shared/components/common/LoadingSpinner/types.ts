import type React from 'react'

export interface SpinnerContentProps {
  show?: boolean | null
  size?: 'small' | 'medium' | 'large' | null
  className?: string
  children?: React.ReactNode
}
