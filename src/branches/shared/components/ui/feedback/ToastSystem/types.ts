export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastConfig {
  type: ToastType
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

export interface Toast extends ToastConfig {
  id: string
  timestamp: number
}

export interface ToastIconConfig {
  icon: string
  backgroundColor: string
  iconColor: string
  progressColor: string
}
