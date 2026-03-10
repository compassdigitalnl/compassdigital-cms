export interface B2BNoticeProps {
  variant?: 'pending' | 'approved' | 'info'
  message?: string
  icon?: string
  className?: string
}

export interface B2BNoticeVariant {
  icon: string
  message: string
}
