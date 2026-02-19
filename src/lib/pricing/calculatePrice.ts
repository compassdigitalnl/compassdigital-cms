/**
 * Price Calculation Utilities
 * Handles customer group pricing, volume discounts, and B2B/B2C pricing logic
 *
 * Discount Hierarchy:
 * 1. Customer group price (groupPrices) - if lower than base price
 * 2. Personal customer discount (percentage)
 * 3. Volume discount (highest applicable tier)
 */

export interface PriceCalculationInput {
  product: {
    price: number // Base price (excl. BTW)
    salePrice?: number // Sale price override
    groupPrices?: Array<{
      group: string | { id: string } // Customer group ID or relationship
      price: number
      minQuantity?: number
    }>
    volumePricing?: Array<{
      minQuantity: number
      maxQuantity?: number
      price?: number
      discountPercentage?: number
    }>
    taxClass?: 'standard' | 'reduced' | 'zero'
    includesTax?: boolean
  }
  customer?: {
    customerGroup?: string | { id: string } // Customer group ID or relationship
    discount?: number // Personal discount percentage
  }
  quantity: number
  currency?: string
}

export interface PriceCalculationResult {
  basePrice: number // Original base price
  unitPrice: number // Final price per unit after all discounts
  totalPrice: number // unitPrice * quantity
  subtotal: number // basePrice * quantity (before discounts)
  discounts: Array<{
    type: 'sale' | 'group' | 'customer' | 'volume'
    amount: number // Discount amount per unit
    percentage?: number
    reason: string
  }>
  totalDiscount: number // Sum of all discount amounts
  finalPrice: number // Same as totalPrice (for consistency)
  currency: string
  tax?: {
    rate: number
    amount: number
    included: boolean
  }
}

/**
 * Get tax rate from tax class
 */
function getTaxRate(taxClass?: 'standard' | 'reduced' | 'zero'): number {
  switch (taxClass) {
    case 'standard':
      return 0.21 // 21% BTW
    case 'reduced':
      return 0.09 // 9% BTW
    case 'zero':
      return 0.0 // 0% BTW
    default:
      return 0.21 // Default to standard
  }
}

/**
 * Calculate product price based on customer group, quantity, and discounts
 */
export function calculatePrice(input: PriceCalculationInput): PriceCalculationResult {
  const { product, customer, quantity, currency = 'EUR' } = input

  // Start with base price or sale price
  let basePrice = product.price
  const discounts: PriceCalculationResult['discounts'] = []

  // Apply sale price if available
  if (product.salePrice && product.salePrice < basePrice) {
    const discount = basePrice - product.salePrice
    discounts.push({
      type: 'sale',
      amount: discount,
      percentage: (discount / basePrice) * 100,
      reason: 'Sale price',
    })
    basePrice = product.salePrice
  }

  let unitPrice = basePrice
  const subtotal = basePrice * quantity

  // 1. Customer group pricing (B2B)
  if (customer?.customerGroup && product.groupPrices && product.groupPrices.length > 0) {
    const customerGroupId =
      typeof customer.customerGroup === 'string'
        ? customer.customerGroup
        : customer.customerGroup.id

    const groupPrice = product.groupPrices.find((gp) => {
      const groupId = typeof gp.group === 'string' ? gp.group : gp.group.id
      return groupId === customerGroupId && quantity >= (gp.minQuantity || 1)
    })

    if (groupPrice && groupPrice.price < unitPrice) {
      const discount = unitPrice - groupPrice.price
      discounts.push({
        type: 'group',
        amount: discount,
        percentage: (discount / unitPrice) * 100,
        reason: `Customer group pricing`,
      })
      unitPrice = groupPrice.price
    }
  }

  // 2. Personal customer discount (percentage)
  if (customer?.discount && customer.discount > 0) {
    const discountAmount = (unitPrice * customer.discount) / 100
    discounts.push({
      type: 'customer',
      amount: discountAmount,
      percentage: customer.discount,
      reason: 'Personal customer discount',
    })
    unitPrice -= discountAmount
  }

  // 3. Volume discounts (staffelprijzen)
  if (product.volumePricing && product.volumePricing.length > 0 && quantity > 1) {
    // Find applicable volume tier (highest tier that applies)
    const applicableTiers = product.volumePricing
      .filter(
        (vp) =>
          quantity >= vp.minQuantity && (!vp.maxQuantity || quantity <= vp.maxQuantity),
      )
      .sort((a, b) => b.minQuantity - a.minQuantity) // Highest tier first

    if (applicableTiers.length > 0) {
      const tier = applicableTiers[0]

      if (tier.price !== undefined) {
        // Fixed price per unit at this tier
        const discount = unitPrice - tier.price
        if (discount > 0) {
          discounts.push({
            type: 'volume',
            amount: discount,
            percentage: (discount / unitPrice) * 100,
            reason: `Volume pricing: ${tier.minQuantity}+ units`,
          })
          unitPrice = tier.price
        }
      } else if (tier.discountPercentage !== undefined && tier.discountPercentage > 0) {
        // Percentage discount at this tier
        const discountAmount = (unitPrice * tier.discountPercentage) / 100
        discounts.push({
          type: 'volume',
          amount: discountAmount,
          percentage: tier.discountPercentage,
          reason: `Volume discount: ${tier.minQuantity}+ units (${tier.discountPercentage}%)`,
        })
        unitPrice -= discountAmount
      }
    }
  }

  // Calculate totals
  const totalPrice = unitPrice * quantity
  const totalDiscount = discounts.reduce((sum, d) => sum + d.amount * quantity, 0)

  // Calculate tax
  const taxRate = getTaxRate(product.taxClass)
  const taxIncluded = product.includesTax || false
  const taxAmount = taxIncluded ? totalPrice - totalPrice / (1 + taxRate) : totalPrice * taxRate

  return {
    basePrice,
    unitPrice,
    totalPrice,
    subtotal,
    discounts,
    totalDiscount,
    finalPrice: totalPrice,
    currency,
    tax: {
      rate: taxRate,
      amount: taxAmount,
      included: taxIncluded,
    },
  }
}

/**
 * Calculate cart total with all items and discounts
 */
export function calculateCartTotal(
  items: Array<{
    product: PriceCalculationInput['product']
    quantity: number
  }>,
  customer?: PriceCalculationInput['customer'],
  currency = 'EUR',
): {
  subtotal: number
  totalDiscount: number
  taxAmount: number
  total: number
  totalExclTax: number
  totalInclTax: number
  items: Array<PriceCalculationResult>
} {
  const itemPrices = items.map((item) =>
    calculatePrice({
      product: item.product,
      customer,
      quantity: item.quantity,
      currency,
    }),
  )

  const subtotal = itemPrices.reduce((sum, item) => sum + item.subtotal, 0)
  const totalDiscount = itemPrices.reduce((sum, item) => sum + item.totalDiscount, 0)
  const totalExclTax = itemPrices.reduce((sum, item) => sum + item.finalPrice, 0)
  const taxAmount = itemPrices.reduce((sum, item) => sum + (item.tax?.amount || 0), 0)
  const totalInclTax = totalExclTax + taxAmount

  return {
    subtotal,
    totalDiscount,
    taxAmount,
    total: totalInclTax,
    totalExclTax,
    totalInclTax,
    items: itemPrices,
  }
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency = 'EUR', locale = 'nl-NL'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Validate quantity against MOQ and order multiples
 */
export function validateQuantity(
  quantity: number,
  constraints: {
    minOrderQuantity?: number
    maxOrderQuantity?: number
    orderMultiple?: number
    stock?: number
  },
): {
  valid: boolean
  adjustedQuantity: number
  errors: string[]
} {
  const { minOrderQuantity = 1, maxOrderQuantity, orderMultiple, stock } = constraints
  const errors: string[] = []
  let adjustedQuantity = quantity

  // Check minimum
  if (quantity < minOrderQuantity) {
    errors.push(`Minimum bestelhoeveelheid is ${minOrderQuantity}`)
    adjustedQuantity = minOrderQuantity
  }

  // Check maximum
  if (maxOrderQuantity && quantity > maxOrderQuantity) {
    errors.push(`Maximum bestelhoeveelheid is ${maxOrderQuantity}`)
    adjustedQuantity = maxOrderQuantity
  }

  // Check stock
  if (stock !== undefined && quantity > stock) {
    errors.push(`Slechts ${stock} stuks op voorraad`)
    adjustedQuantity = Math.min(adjustedQuantity, stock)
  }

  // Check order multiple
  if (orderMultiple && orderMultiple > 1) {
    const remainder = quantity % orderMultiple
    if (remainder !== 0) {
      const roundedDown = quantity - remainder
      const roundedUp = roundedDown + orderMultiple
      adjustedQuantity = roundedUp <= (stock || Infinity) ? roundedUp : roundedDown
      if (adjustedQuantity < minOrderQuantity) {
        adjustedQuantity = orderMultiple
      }
      errors.push(`Bestelbaar in veelvouden van ${orderMultiple}`)
    }
  }

  return {
    valid: errors.length === 0,
    adjustedQuantity: Math.max(minOrderQuantity, adjustedQuantity),
    errors,
  }
}
