export interface NotificationPreferencesProps {
  notifications: {
    orderConfirmation: boolean
    shippingUpdates: boolean
    newsletter: boolean
    productUpdates: boolean
    priceAlerts: boolean
  }
  onToggle: (key: string) => void
}
