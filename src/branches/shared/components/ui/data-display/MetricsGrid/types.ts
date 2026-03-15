export interface MetricItem {
  value: string
  label: string
  icon?: string
  suffix?: string
  description?: string
}

export interface MetricsGridProps {
  metrics: MetricItem[]
  columns?: 2 | 3 | 4
  variant?: 'default' | 'compact' | 'gradient'
  className?: string
}
