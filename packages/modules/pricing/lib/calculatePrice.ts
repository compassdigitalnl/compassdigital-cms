/**
 * Price Calculation Utilities
 * Handles role-based pricing, volume discounts, and B2B/B2C pricing logic
 */

export interface PriceCalculationInput {
  product: {
    basePrice: number
    pricing?: {
      rolePrices?: Array<{
        roleId: string
        price: number
        minQuantity?: number
      }>
      volumePricing?: Array<{
        minQuantity: number
        maxQuantity?: number
        price?: number
        discountPercentage?: number
      }>
    }
  }
  customer?: {
    customPricingRole?: string
    customerGroup?: {
      discount?: number
    }
    discount?: number
  }
  quantity: number
  currency?: string
}

export interface PriceCalculationResult {
  basePrice: number
  unitPrice: number
  totalPrice: number
  discounts: Array<{
    type: 'role' | 'group' | 'customer' | 'volume'
    amount: number
    percentage?: number
    reason: string
  }>
  totalDiscount: number
  finalPrice: number
  currency: string
}

/**
 * Calculate product price based on customer role, quantity, and discounts
 */
export function calculatePrice(input: PriceCalculationInput): PriceCalculationResult {
  const { product, customer, quantity, currency = 'EUR' } = input
  const basePrice = product.basePrice

  let unitPrice = basePrice
  const discounts: PriceCalculationResult['discounts'] = []

  // 1. Role-based pricing (B2B)
  if (customer?.customPricingRole && product.pricing?.rolePrices) {
    const rolePrice = product.pricing.rolePrices.find(
      (rp) =>
        rp.roleId === customer.customPricingRole &&
        quantity >= (rp.minQuantity || 1),
    )

    if (rolePrice) {
      const discount = basePrice - rolePrice.price
      if (discount > 0) {
        discounts.push({
          type: 'role',
          amount: discount,
          percentage: (discount / basePrice) * 100,
          reason: `Role-based pricing: ${customer.customPricingRole}`,
        })
        unitPrice = rolePrice.price
      }
    }
  }

  // 2. Customer group discount
  if (customer?.customerGroup?.discount && customer.customerGroup.discount > 0) {
    const discountAmount = (unitPrice * customer.customerGroup.discount) / 100
    discounts.push({
      type: 'group',
      amount: discountAmount,
      percentage: customer.customerGroup.discount,
      reason: 'Customer group discount',
    })
    unitPrice -= discountAmount
  }

  // 3. Personal customer discount
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

  // 4. Volume discounts
  if (product.pricing?.volumePricing && quantity > 1) {
    // Find applicable volume tier
    const applicableTiers = product.pricing.volumePricing
      .filter(
        (vp) =>
          quantity >= vp.minQuantity &&
          (!vp.maxQuantity || quantity <= vp.maxQuantity),
      )
      .sort((a, b) => b.minQuantity - a.minQuantity) // Highest tier first

    if (applicableTiers.length > 0) {
      const tier = applicableTiers[0]

      if (tier.price) {
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
      } else if (tier.discountPercentage) {
        // Percentage discount at this tier
        const discountAmount = (unitPrice * tier.discountPercentage) / 100
        discounts.push({
          type: 'volume',
          amount: discountAmount,
          percentage: tier.discountPercentage,
          reason: `Volume discount: ${tier.minQuantity}+ units`,
        })
        unitPrice -= discountAmount
      }
    }
  }

  const totalPrice = unitPrice * quantity
  const totalDiscount = discounts.reduce((sum, d) => sum + d.amount * quantity, 0)

  return {
    basePrice,
    unitPrice,
    totalPrice,
    discounts,
    totalDiscount,
    finalPrice: totalPrice,
    currency,
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
  total: number
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

  const subtotal = itemPrices.reduce((sum, item) => sum + item.basePrice * item.totalPrice, 0)
  const totalDiscount = itemPrices.reduce((sum, item) => sum + item.totalDiscount, 0)
  const total = itemPrices.reduce((sum, item) => sum + item.finalPrice, 0)

  return {
    subtotal,
    totalDiscount,
    total,
    items: itemPrices,
  }
}
