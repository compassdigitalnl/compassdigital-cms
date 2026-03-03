import type { GuestCheckoutFormData } from '@/branches/ecommerce/components/auth/GuestCheckoutForm'
import type { TabId } from '@/branches/ecommerce/components/auth/AuthTabSwitcher'

export interface CheckoutAuthPanelProps {
  onAuthenticated: (data: {
    email: string
    isGuest: boolean
    guestData?: GuestCheckoutFormData
  }) => void
  defaultTab?: TabId
  enableGuestCheckout?: boolean
  className?: string
}
