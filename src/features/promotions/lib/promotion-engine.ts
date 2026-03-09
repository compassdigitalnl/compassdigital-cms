import { sql } from 'drizzle-orm'
import type { Promotion, PromotionMatch } from './types'

/**
 * Map database row to Promotion interface
 */
function rowToPromotion(row: any): Promotion {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    type: row.type,
    value: Number(row.value),
    status: row.status,
    priority: row.priority ?? 0,
    startDate: row.start_date ? String(row.start_date) : null,
    endDate: row.end_date ? String(row.end_date) : null,
    isFlashSale: row.is_flash_sale ?? false,
    flashSaleLabel: row.flash_sale_label ?? undefined,
    appliesTo: row.applies_to ?? 'all',
    productIds: row.product_ids ?? undefined,
    categoryIds: row.category_ids ?? undefined,
    brandIds: row.brand_ids ?? undefined,
    minOrderValue: row.min_order_value != null ? Number(row.min_order_value) : undefined,
    minQuantity: row.min_quantity ?? undefined,
    maxUses: row.max_uses ?? undefined,
    usedCount: row.used_count ?? 0,
    stackable: row.stackable ?? false,
    bannerText: row.banner_text ?? undefined,
    bannerColor: row.banner_color ?? undefined,
  }
}

/**
 * Haal alle actieve promoties op die momenteel geldig zijn
 */
export async function getActivePromotions(drizzle: any): Promise<Promotion[]> {
  const result = await drizzle.execute(
    sql.raw(`
      SELECT *
      FROM "promotions"
      WHERE "status" = 'active'
        AND ("start_date" IS NULL OR "start_date" <= NOW())
        AND ("end_date" IS NULL OR "end_date" >= NOW())
      ORDER BY "priority" DESC
    `),
  )

  const rows = result?.rows ?? result ?? []
  return Array.isArray(rows) ? rows.map(rowToPromotion) : []
}

/**
 * Controleer of een promotie van toepassing is op een product
 */
export function matchPromotionToProduct(
  promotion: Promotion,
  productId: number,
  categoryIds: number[],
  brandId?: number,
): boolean {
  // Check max uses
  if (promotion.maxUses && promotion.usedCount >= promotion.maxUses) {
    return false
  }

  switch (promotion.appliesTo) {
    case 'all':
      return true

    case 'specific_products':
      return Array.isArray(promotion.productIds) && promotion.productIds.includes(productId)

    case 'specific_categories':
      if (!Array.isArray(promotion.categoryIds) || !Array.isArray(categoryIds)) return false
      return categoryIds.some((catId) => promotion.categoryIds!.includes(catId))

    case 'specific_brands':
      if (!Array.isArray(promotion.brandIds) || brandId == null) return false
      return promotion.brandIds.includes(brandId)

    default:
      return false
  }
}

/**
 * Bereken de korting voor een promotie
 */
export function calculatePromotionDiscount(
  promotion: Promotion,
  price: number,
  quantity: number,
): PromotionMatch | null {
  if (promotion.minQuantity && quantity < promotion.minQuantity) {
    return null
  }

  let discount = 0
  let discountLabel = ''

  switch (promotion.type) {
    case 'percentage': {
      discount = (price * quantity * promotion.value) / 100
      discountLabel = `${promotion.value}% korting`
      break
    }

    case 'fixed_amount': {
      discount = Math.min(promotion.value, price * quantity)
      discountLabel = `€${promotion.value.toFixed(2)} korting`
      break
    }

    case 'buy_x_get_y': {
      // value = number of items to get free per group
      // e.g., value=1 means buy 2 get 1 free (every 3rd item free)
      const groupSize = promotion.value + 1
      const freeItems = Math.floor(quantity / groupSize) * 1
      discount = freeItems * price
      discountLabel = `Koop ${groupSize - 1} krijg ${promotion.value} gratis`
      break
    }

    case 'free_shipping': {
      // Discount is 0 for product price, but flags free shipping
      discount = 0
      discountLabel = 'Gratis verzending'
      break
    }

    case 'bundle': {
      // value = bundle discount percentage
      discount = (price * quantity * promotion.value) / 100
      discountLabel = `Bundel: ${promotion.value}% korting`
      break
    }

    default:
      return null
  }

  return {
    promotion,
    discount: Math.round(discount * 100) / 100,
    discountLabel,
  }
}

/**
 * Vind de beste promotie voor een product (hoogste korting)
 */
export function getBestPromotion(
  promotions: Promotion[],
  productId: number,
  price: number,
  quantity: number,
  categoryIds: number[],
  brandId?: number,
): PromotionMatch | null {
  let bestMatch: PromotionMatch | null = null

  for (const promo of promotions) {
    if (!matchPromotionToProduct(promo, productId, categoryIds, brandId)) {
      continue
    }

    const match = calculatePromotionDiscount(promo, price, quantity)
    if (!match) continue

    // Free shipping always "matches" but doesn't beat a price discount
    if (promo.type === 'free_shipping') {
      if (!bestMatch) bestMatch = match
      continue
    }

    if (!bestMatch || match.discount > bestMatch.discount) {
      bestMatch = match
    }
  }

  return bestMatch
}
