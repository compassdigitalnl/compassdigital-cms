import type { Theme1 } from '@/payload-types'

export type AlertBarData = {
  enabled?: boolean | null
  message?: string | null
  type?: 'info' | 'success' | 'warning' | 'error' | 'promo'
  icon?: string | null
  link?: {
    enabled?: boolean | null
    label?: string | null
    url?: string | null
  }
  dismissible?: boolean | null
  schedule?: {
    useSchedule?: boolean | null
    startDate?: string | null
    endDate?: string | null
  }
  customColors?: {
    useCustomColors?: boolean | null
    backgroundColor?: string | null
    textColor?: string | null
  }
}

export type AlertBarProps = {
  alertBar: AlertBarData
  theme: Theme1 | null
}
