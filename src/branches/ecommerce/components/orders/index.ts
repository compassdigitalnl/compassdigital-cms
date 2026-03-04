// Order Confirmation Components (OC01-OC05)
export { SuccessHero } from './SuccessHero'
export type { SuccessHeroProps, SuccessHeroVariant } from './SuccessHero'

export { OrderDetailsCard } from './OrderDetailsCard'
export type {
  OrderDetailsCardProps,
  DeliveryDetails,
  PaymentDetails,
  TotalDetails,
  PaymentStatus,
  DeliveryIcon,
  StatusBadgeVariant,
} from './OrderDetailsCard'

export { OrderItemsSummary } from './OrderItemsSummary'
export type {
  OrderItemsSummaryProps,
  OrderItem,
  OrderItemMetadata,
  OrderItemsSummaryVariant,
} from './OrderItemsSummary'

export { NextStepsCTA } from './NextStepsCTA'
export type {
  NextStepsCTAProps,
  NextStepAction,
  NextStepVariant,
  NextStepsCTAVariant,
  NextStepBadge,
} from './NextStepsCTA'

export { EmailConfirmationBanner } from './EmailConfirmationBanner'
export type {
  EmailConfirmationBannerProps,
  EmailBannerVariant,
  EmailBannerLink,
} from './EmailConfirmationBanner'

// Order Confirmation Components (OC06-OC09) — NEW
export { OrderTimeline } from './OrderTimeline'
export type {
  OrderTimelineProps,
  TimelineStep,
  TimelineStepStatus,
} from './OrderTimeline'

export { OrderAddresses } from './OrderAddresses'
export type {
  OrderAddressesProps,
  OrderAddress,
} from './OrderAddresses'

export { AccountCreationCTA } from './AccountCreationCTA'
export type { AccountCreationCTAProps } from './AccountCreationCTA'

export { SupportCard } from './SupportCard'
export type { SupportCardProps } from './SupportCard'
