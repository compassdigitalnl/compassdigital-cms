export type NotificationType = 'order' | 'stock' | 'invoice' | 'system'

export type NotificationIconColor = 'green' | 'teal' | 'blue' | 'amber' | 'coral'

export type NotificationTab = 'Alles' | 'Bestellingen' | 'Voorraad' | 'Systeem'

export interface Notification {
  id: string
  type: NotificationType
  icon: string // Lucide icon name (e.g., 'truck', 'package', 'file-text')
  iconColor: NotificationIconColor
  title: string
  text: string
  timestamp: string // ISO 8601 format
  read: boolean
  link?: string // Optional link to navigate to
}

export interface NotificationCenterProps {
  notifications: Notification[]
  unreadCount?: number
  onMarkAllRead?: () => void | Promise<void>
  onNotificationClick?: (notification: Notification) => void | Promise<void>
  onViewAll?: () => void
  tabs?: NotificationTab[]
  maxItems?: number
  className?: string
}
