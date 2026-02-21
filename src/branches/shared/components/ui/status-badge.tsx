import { Badge } from './badge'
import { cn } from '@/utilities/cn'

export type StatusType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'pending'
  | 'active'
  | 'inactive'

export interface StatusBadgeProps {
  status: StatusType
  label: string
  className?: string
}

const statusStyles: Record<StatusType, string> = {
  success: 'bg-green-100 text-green-800 hover:bg-green-100',
  warning: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  error: 'bg-red-100 text-red-800 hover:bg-red-100',
  info: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  pending: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  active: 'bg-green-100 text-green-800 hover:bg-green-100',
  inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-100',
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(statusStyles[status], className)}>
      {label}
    </Badge>
  )
}
