export type B2BNoticeVariant = 'pending' | 'approved' | 'info'

export interface B2BNoticeProps {
  variant?: B2BNoticeVariant
  message?: string
  className?: string
}
