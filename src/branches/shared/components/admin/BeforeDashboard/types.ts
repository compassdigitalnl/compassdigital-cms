export interface QuickActionProps {
  href: string
  icon: string
  label: string
  description: string
  accent?: boolean
  external?: boolean
}

export interface StatCardProps {
  value: string
  label: string
  icon: string
  color: 'blue' | 'green' | 'orange' | 'purple'
  change?: number
}

export interface DashboardProps {
  userName: string
}
