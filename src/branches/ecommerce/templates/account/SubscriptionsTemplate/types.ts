export interface SubscriptionPlan {
  name: string
  price: number
  billingInterval: 'monthly' | 'yearly'
  icon: string
}

export interface SubscriptionUsage {
  users: { current: number; limit: number }
  storage: { current: number; limit: number } // in GB
  apiCalls: { current: number; limit: number }
}

export interface SubscriptionAddon {
  name: string
  icon: string
  price: number
  since: string
}

export interface SubscriptionPaymentMethod {
  type: string
  brand: string
  last4: string
  isDefault: boolean
}

export interface SubscriptionInvoice {
  id: number
  date: string
  description: string
  amount: number
  status: 'paid' | 'open' | 'void'
}

export interface Subscription {
  plan: SubscriptionPlan
  status: 'active' | 'trialing' | 'canceled' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string
  usage: SubscriptionUsage
  addons: SubscriptionAddon[]
  paymentMethod: SubscriptionPaymentMethod
}

export interface SubscriptionsTemplateProps {
  subscription: Subscription
  invoices: SubscriptionInvoice[]
  onCancelSubscription: () => void
  onUpgradePlan: () => void
  onAddAddon: () => void
  onAddPaymentMethod: () => void
}
