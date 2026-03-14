/**
 * Order Mapper
 *
 * Maps a child webshop order to the Hub order format.
 * Strips child-specific data, adds Hub-specific fields (sourceSite, remoteOrderId).
 */

import type { MappedOrder } from './types'

/**
 * Map a child order (from Payload REST API response) to Hub order format
 */
export function mapChildOrderToHub(
  childOrder: Record<string, any>,
  sourceSiteId: number,
): MappedOrder {
  // Map order items, resolving Hub product IDs where available
  const items = (childOrder.items || []).map((item: any) => ({
    hubProductId: item.hubProductId || item.product?.hubProductId || undefined,
    title: item.title || item.product?.title || 'Onbekend product',
    sku: item.sku || item.product?.sku || '',
    quantity: item.quantity || 1,
    price: item.price || 0,
    subtotal: item.subtotal || (item.price || 0) * (item.quantity || 1),
  }))

  return {
    remoteOrderId: childOrder.id,
    remoteOrderNumber: childOrder.orderNumber || `REMOTE-${childOrder.id}`,
    sourceSiteId,
    items,
    subtotal: childOrder.subtotal || 0,
    shippingCost: childOrder.shippingCost || 0,
    tax: childOrder.tax || 0,
    discount: childOrder.discount || 0,
    total: childOrder.total || 0,
    customerEmail: childOrder.customerEmail || childOrder.guestEmail || '',
    shippingAddress: childOrder.shippingAddress || undefined,
    billingAddress: childOrder.billingAddress || undefined,
    status: childOrder.status || 'pending',
    paymentMethod: childOrder.paymentMethod || undefined,
    paymentStatus: childOrder.paymentStatus || 'pending',
    notes: childOrder.notes || undefined,
  }
}

/**
 * Calculate commission for an order
 */
export function calculateCommission(
  total: number,
  commissionPercentage?: number,
  commissionType?: string,
  fixedAmount?: number,
): number {
  if (commissionType === 'fixed' && fixedAmount) {
    return fixedAmount
  }
  if (commissionPercentage && commissionPercentage > 0) {
    return Math.round(total * (commissionPercentage / 100) * 100) / 100
  }
  return 0
}
