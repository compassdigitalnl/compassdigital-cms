import type { Theme1 } from '@/payload-types'

export type AlertBarData = {
  enabled?: boolean | null
  message?: string | null
  type?: 'info' | 'success' | 'warning' | 'error' | 'promo'
  icon?: string | null
  dismissible?: boolean | null
}

export type AlertBarProps = {
  alertBar: AlertBarData
  theme: Theme1 | null
}
