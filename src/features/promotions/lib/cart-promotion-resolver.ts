import type { CartItem, PromotionMatch } from './types'
import { getActivePromotions, matchPromotionToProduct, calculatePromotionDiscount } from './promotion-engine'

export interface CartPromotionResult {
  items: (CartItem & { promotion?: PromotionMatch })[]
  cartDiscount: number
  freeShipping: boolean
}

/**
 * Pas actieve promoties toe op alle items in de winkelwagen
 */
export async function resolveCartPromotions(
  drizzle: any,
  items: CartItem[],
): Promise<CartPromotionResult> {
  const promotions = await getActivePromotions(drizzle)

  let cartDiscount = 0
  let freeShipping = false

  const resolvedItems = items.map((item) => {
    let bestMatch: PromotionMatch | null = null

    for (const promo of promotions) {
      if (!matchPromotionToProduct(promo, item.productId, item.categoryIds ?? [], item.brandId)) {
        continue
      }

      // Check min order value against total cart (simplified: per-item check)
      if (promo.minOrderValue && item.price * item.quantity < promo.minOrderValue) {
        continue
      }

      const match = calculatePromotionDiscount(promo, item.price, item.quantity)
      if (!match) continue

      // Handle free shipping separately
      if (promo.type === 'free_shipping') {
        freeShipping = true
        continue
      }

      // Keep best discount (or allow stacking)
      if (promo.stackable && bestMatch) {
        bestMatch = {
          promotion: promo,
          discount: bestMatch.discount + match.discount,
          discountLabel: `${bestMatch.discountLabel} + ${match.discountLabel}`,
        }
      } else if (!bestMatch || match.discount > bestMatch.discount) {
        bestMatch = match
      }
    }

    if (bestMatch) {
      cartDiscount += bestMatch.discount
    }

    return {
      ...item,
      promotion: bestMatch ?? undefined,
    }
  })

  // Also check for cart-level free shipping promotions (applies_to = 'all')
  for (const promo of promotions) {
    if (promo.type === 'free_shipping' && promo.appliesTo === 'all') {
      const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      if (!promo.minOrderValue || cartTotal >= promo.minOrderValue) {
        freeShipping = true
      }
    }
  }

  return {
    items: resolvedItems,
    cartDiscount: Math.round(cartDiscount * 100) / 100,
    freeShipping,
  }
}
