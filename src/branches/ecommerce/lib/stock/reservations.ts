import type { Payload } from 'payload'

/**
 * Stock Reservation Utilities
 *
 * Helper functions for managing stock reservations during checkout.
 */

export interface ReserveStockParams {
  productId: string
  variantId?: string
  quantity: number
  cartId?: string
  sessionId?: string
}

export interface CheckAvailabilityResult {
  available: boolean
  stock: number
  reserved: number
  availableStock: number
  message?: string
}

/**
 * Reserve stock for a cart item
 *
 * Creates a temporary reservation that expires after 15 minutes.
 * If reservation already exists, updates the quantity.
 */
export async function reserveStock(
  payload: Payload,
  params: ReserveStockParams,
): Promise<{ success: boolean; reservationId?: string; error?: string }> {
  const { productId, variantId, quantity, cartId, sessionId } = params

  try {
    // Check if product exists and tracks stock
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (!product.trackStock) {
      // Product doesn't track stock, no reservation needed
      return { success: true }
    }

    // Check if there's enough stock available (after existing reservations)
    const availability = await checkStockAvailability(payload, productId, variantId)

    if (!availability.available || availability.availableStock < quantity) {
      return {
        success: false,
        error: `Insufficient stock. Only ${availability.availableStock} available (${availability.reserved} reserved by others)`,
      }
    }

    // Check if reservation already exists for this cart/session + product
    const existingReservations = await payload.find({
      collection: 'stock-reservations',
      where: {
        and: [
          { product: { equals: productId } },
          ...(variantId ? [{ variant: { equals: variantId } }] : []),
          ...(cartId ? [{ cart: { equals: cartId } }] : []),
          ...(sessionId ? [{ session: { equals: sessionId } }] : []),
          { status: { equals: 'active' } },
        ],
      },
    })

    if (existingReservations.docs.length > 0) {
      // Update existing reservation
      const existing: any = existingReservations.docs[0]
      const updated = await payload.update({
        collection: 'stock-reservations',
        id: existing.id,
        data: {
          quantity,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // Extend expiration
        },
      })

      return { success: true, reservationId: String(updated.id) }
    }

    // Create new reservation
    const reservation = await payload.create({
      collection: 'stock-reservations',
      data: {
        product: productId as any,
        variant: variantId as any,
        quantity,
        cartId: cartId,
        session: sessionId,
        status: 'active',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      } as any,
    })

    return { success: true, reservationId: String(reservation.id) }
  } catch (error: any) {
    console.error('Failed to reserve stock:', error)
    return { success: false, error: error.message || 'Failed to reserve stock' }
  }
}

/**
 * Check stock availability (considering active reservations)
 */
export async function checkStockAvailability(
  payload: Payload,
  productId: string,
  variantId?: string,
): Promise<CheckAvailabilityResult> {
  try {
    // Get product
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (!product.trackStock) {
      return {
        available: true,
        stock: 999999,
        reserved: 0,
        availableStock: 999999,
        message: 'Product does not track stock',
      }
    }

    const totalStock = product.stock || 0

    // Get active reservations for this product
    const activeReservations = await payload.find({
      collection: 'stock-reservations',
      where: {
        and: [
          { product: { equals: productId } },
          ...(variantId ? [{ variant: { equals: variantId } }] : []),
          { status: { equals: 'active' } },
          { expiresAt: { greater_than: new Date().toISOString() } },
        ],
      },
    })

    const totalReserved = activeReservations.docs.reduce((sum, res: any) => sum + (res.quantity || 0), 0)

    const availableStock = Math.max(0, totalStock - totalReserved)

    return {
      available: availableStock > 0,
      stock: totalStock,
      reserved: totalReserved,
      availableStock,
    }
  } catch (error) {
    console.error('Failed to check stock availability:', error)
    return {
      available: false,
      stock: 0,
      reserved: 0,
      availableStock: 0,
      message: 'Error checking availability',
    }
  }
}

/**
 * Release (cancel) a stock reservation
 */
export async function releaseReservation(
  payload: Payload,
  reservationId: string,
  reason?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await payload.update({
      collection: 'stock-reservations',
      id: reservationId,
      data: {
        status: 'released',
        notes: reason || 'Released manually',
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Failed to release reservation:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Convert reservation to order (mark as converted)
 *
 * Called when checkout is completed successfully.
 */
export async function convertReservationToOrder(
  payload: Payload,
  reservationId: string,
  orderId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await payload.update({
      collection: 'stock-reservations',
      id: reservationId as any,
      data: {
        status: 'converted',
        convertedToOrder: orderId as any,
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Failed to convert reservation:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Cleanup expired reservations
 *
 * Should be called by a cron job every minute.
 * Marks expired reservations as 'expired' to release stock.
 */
export async function cleanupExpiredReservations(payload: Payload): Promise<{
  success: boolean
  cleaned: number
  error?: string
}> {
  try {
    const now = new Date().toISOString()

    // Find all active reservations that have expired
    const expiredReservations = await payload.find({
      collection: 'stock-reservations',
      where: {
        and: [{ status: { equals: 'active' } }, { expiresAt: { less_than_equal: now } }],
      },
      limit: 1000, // Process max 1000 at a time
    })

    let cleaned = 0

    for (const reservation of expiredReservations.docs) {
      try {
        await payload.update({
          collection: 'stock-reservations',
          id: (reservation as any).id,
          data: {
            status: 'expired',
            notes: `Auto-expired at ${now}`,
          },
        })
        cleaned++
      } catch (error) {
        console.error(`Failed to expire reservation ${(reservation as any).id}:`, error)
      }
    }

    if (cleaned > 0) {
      console.log(`✅ Cleaned up ${cleaned} expired stock reservations`)
    }

    return { success: true, cleaned }
  } catch (error: any) {
    console.error('Failed to cleanup expired reservations:', error)
    return { success: false, cleaned: 0, error: error.message }
  }
}

/**
 * Release all reservations for a cart
 *
 * Called when cart is deleted or abandoned.
 */
export async function releaseCartReservations(
  payload: Payload,
  cartId: string,
): Promise<{ success: boolean; released: number; error?: string }> {
  try {
    const cartReservations = await payload.find({
      collection: 'stock-reservations',
      where: {
        and: [{ cart: { equals: cartId } }, { status: { equals: 'active' } }],
      },
    })

    let released = 0

    for (const reservation of cartReservations.docs) {
      try {
        await payload.update({
          collection: 'stock-reservations',
          id: (reservation as any).id,
          data: {
            status: 'released',
            notes: `Cart ${cartId} abandoned/deleted`,
          },
        })
        released++
      } catch (error) {
        console.error(`Failed to release reservation ${(reservation as any).id}:`, error)
      }
    }

    return { success: true, released }
  } catch (error: any) {
    console.error('Failed to release cart reservations:', error)
    return { success: false, released: 0, error: error.message }
  }
}
