// Promotion Engine
export { getActivePromotions, matchPromotionToProduct, calculatePromotionDiscount, getBestPromotion } from './lib/promotion-engine'
export { resolveCartPromotions } from './lib/cart-promotion-resolver'
export { activateScheduledPromotions, deactivateExpiredPromotions } from './lib/flash-sale-scheduler'

// Types
export type { Promotion, PromotionType, PromotionMatch, CartItem } from './lib/types'

// Components
export { CountdownTimer } from './components/CountdownTimer'
export { PromotionStats } from './components/PromotionStats'
