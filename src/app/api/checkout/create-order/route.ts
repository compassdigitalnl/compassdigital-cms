import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Cart, Product, Order } from '@/payload-types'
import { checkStockAvailability, convertReservationToOrder } from '@/lib/stock/reservations'

/**
 * POST /api/checkout/create-order
 *
 * Complete checkout flow:
 * 1. Validate cart
 * 2. Check stock availability
 * 3. Reserve/deduct stock
 * 4. Create order
 * 5. Update cart status
 * 6. Initialize payment
 * 7. Send confirmation email
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const {
      cartId,
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingMethod,
      notes,
      guestEmail,
      guestName,
      guestPhone,
    } = body

    // ========================================
    // 1. VALIDATE CART
    // ========================================

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      )
    }

    let cart: Cart
    try {
      const cartDoc = await payload.findByID({
        collection: 'carts',
        id: cartId,
        depth: 2, // Populate products
      })
      cart = cartDoc as Cart
    } catch (error) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    // Check cart has items
    if (!cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Check cart is not already converted
    if (cart.status === 'completed' || cart.convertedToOrder) {
      return NextResponse.json(
        { error: 'Cart has already been converted to an order' },
        { status: 400 }
      )
    }

    // ========================================
    // 2. CHECK STOCK AVAILABILITY (WITH RESERVATIONS)
    // ========================================

    const stockIssues: string[] = []
    const reservationIds: string[] = []

    for (const item of cart.items) {
      const productId = typeof item.product === 'number'
        ? item.product
        : typeof item.product === 'string'
          ? item.product
          : item.product?.id
      if (!productId) continue

      const product = await payload.findByID({
        collection: 'products',
        id: productId,
      }) as Product

      // Check if stock tracking is enabled
      if (product.trackStock) {
        const requestedQuantity = item.quantity || 0

        // Check stock availability (considers active reservations by others)
        const availability = await checkStockAvailability(
          payload,
          String(productId),
          item.variantId || undefined
        )

        // Check if enough stock (after reservations)
        if (!availability.available || availability.availableStock < requestedQuantity) {
          const productTitle = typeof item.product === 'object' && item.product?.title
            ? item.product.title
            : product.title

          stockIssues.push(
            `${productTitle}: Only ${availability.availableStock} available (${availability.reserved} reserved by others)`
          )
        }

        // Find this cart's reservation for this product (if exists)
        const cartReservations = await payload.find({
          collection: 'stock-reservations',
          where: {
            and: [
              { product: { equals: productId } },
              { cart: { equals: cartId } },
              { status: { equals: 'active' } },
            ],
          },
        })

        if (cartReservations.docs.length > 0) {
          reservationIds.push((cartReservations.docs[0] as any).id)
        }

        // Check stock status
        if (product.stockStatus === 'out-of-stock' && !product.backordersAllowed) {
          const productTitle = typeof item.product === 'object' && item.product?.title
            ? item.product.title
            : product.title

          stockIssues.push(`${productTitle}: Out of stock`)
        }
      }
    }

    // Return stock errors if any
    if (stockIssues.length > 0) {
      return NextResponse.json(
        {
          error: 'Stock unavailable',
          message: 'Some items are out of stock or have insufficient quantity',
          stockIssues,
        },
        { status: 400 }
      )
    }

    // ========================================
    // 3. GENERATE ORDER NUMBER
    // ========================================

    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')

    // Get latest order to determine next sequence number
    const latestOrders = await payload.find({
      collection: 'orders',
      limit: 1,
      sort: '-createdAt',
    })

    let sequenceNumber = 1
    if (latestOrders.docs.length > 0) {
      const latestOrder = latestOrders.docs[0] as Order
      if (latestOrder.orderNumber) {
        const match = latestOrder.orderNumber.match(/-(\d+)$/)
        if (match) {
          sequenceNumber = parseInt(match[1], 10) + 1
        }
      }
    }

    const orderNumber = `ORD-${dateStr}-${String(sequenceNumber).padStart(5, '0')}`

    // ========================================
    // 4. PREPARE ORDER ITEMS (SNAPSHOT PRICES!)
    // ========================================

    const orderItems = cart.items.map((cartItem) => {
      const product = typeof cartItem.product === 'object' && cartItem.product !== null && typeof cartItem.product !== 'number'
        ? cartItem.product
        : null

      const productId = typeof cartItem.product === 'number'
        ? cartItem.product
        : typeof cartItem.product === 'string'
          ? cartItem.product
          : cartItem.product?.id

      const brandName = product?.brand
        ? typeof product.brand === 'string'
          ? product.brand
          : typeof product.brand === 'object' && product.brand !== null
            ? (product.brand as any).name
            : undefined
        : undefined

      return {
        product: productId,
        variantId: cartItem.variantId || undefined,
        quantity: cartItem.quantity || 1,
        unitPrice: cartItem.unitPrice || 0,
        totalPrice: cartItem.totalPrice || 0,
        discount: cartItem.discount || undefined,
        notes: cartItem.notes || undefined,
        // Snapshot product details (for order history)
        title: product?.title || 'Unknown Product',
        sku: product?.sku || undefined,
        brand: brandName,
      }
    })

    // ========================================
    // 5. CREATE ORDER
    // ========================================

    const customerId = typeof cart.customer === 'number'
      ? cart.customer
      : typeof cart.customer === 'string'
        ? cart.customer
        : cart.customer?.id

    const orderData: any = {
      orderNumber,
      customer: customerId || undefined,
      status: 'pending',
      paymentStatus: 'pending',
      items: orderItems,
      subtotal: cart.subtotal || 0,
      discountTotal: cart.discountTotal || 0,
      total: cart.total || 0,
      currency: cart.currency || 'EUR',
      paymentMethod: paymentMethod || 'unknown',
      shippingMethod: shippingMethod || undefined,
      notes: notes || undefined,
      orderDate: now.toISOString(),
    }

    // Guest checkout
    if (!customerId) {
      if (!guestEmail) {
        return NextResponse.json(
          { error: 'Guest email is required for guest checkout' },
          { status: 400 }
        )
      }
      orderData.guestEmail = guestEmail
      orderData.guestName = guestName || undefined
      orderData.guestPhone = guestPhone || undefined
    }

    // Shipping address (required)
    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      )
    }

    orderData.shippingStreet = shippingAddress.street
    orderData.shippingHouseNumber = shippingAddress.houseNumber
    orderData.shippingHouseNumberAddition = shippingAddress.houseNumberAddition || undefined
    orderData.shippingPostalCode = shippingAddress.postalCode
    orderData.shippingCity = shippingAddress.city
    orderData.shippingCountry = shippingAddress.country || 'NL'

    // Billing address (use shipping if not provided)
    const billing = billingAddress || shippingAddress
    orderData.billingStreet = billing.street
    orderData.billingHouseNumber = billing.houseNumber
    orderData.billingHouseNumberAddition = billing.houseNumberAddition || undefined
    orderData.billingPostalCode = billing.postalCode
    orderData.billingCity = billing.city
    orderData.billingCountry = billing.country || 'NL'

    // Create the order
    const newOrder = await payload.create({
      collection: 'orders',
      data: orderData,
    })

    console.log(`✅ Order created: ${newOrder.orderNumber} (ID: ${newOrder.id})`)

    // ========================================
    // 6. DEDUCT STOCK (SYNCHRONOUSLY)
    // ========================================
    // Note: We do this here instead of in hooks to ensure it happens
    // before we return success to the user

    for (const item of cart.items) {
      const productId = typeof item.product === 'number'
        ? item.product
        : typeof item.product === 'string'
          ? item.product
          : item.product?.id
      if (!productId) continue

      const product = await payload.findByID({
        collection: 'products',
        id: productId,
      }) as Product

      if (product.trackStock) {
        const newStock = (product.stock || 0) - (item.quantity || 0)

        // Update stock
        await payload.update({
          collection: 'products',
          id: productId,
          data: {
            stock: Math.max(0, newStock), // Never go below 0
            // Update stock status if needed
            stockStatus: newStock <= 0 ? 'out-of-stock' : 'in-stock',
          },
        })

        console.log(`  📦 Stock deducted: ${product.title} (${item.quantity} units, ${newStock} remaining)`)
      }
    }

    // ========================================
    // 7. UPDATE CART STATUS
    // ========================================

    await payload.update({
      collection: 'carts',
      id: cartId as any,
      data: {
        status: 'completed',
        convertedToOrder: newOrder.id, // Order ID (number)
      },
    })

    console.log(`  🛒 Cart marked as completed and linked to order`)

    // ========================================
    // 8. CONVERT STOCK RESERVATIONS TO ORDER
    // ========================================
    // Mark all reservations for this cart as 'converted' (linked to order)

    for (const reservationId of reservationIds) {
      try {
        await convertReservationToOrder(payload, reservationId, String(newOrder.id))
        console.log(`  ✅ Reservation ${reservationId} converted to order`)
      } catch (error) {
        console.error(`  ⚠️ Failed to convert reservation ${reservationId}:`, error)
        // Don't fail the order if reservation conversion fails
      }
    }

    // ========================================
    // 9. SEND CONFIRMATION EMAIL
    // ========================================
    // Note: Email is automatically sent by the Orders collection afterChange hook
    // This happens when the order is created above
    console.log(`  📧 Order confirmation email will be sent to ${customerId ? 'customer' : guestEmail} via hooks`)

    // ========================================
    // 10. RETURN SUCCESS
    // ========================================

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        total: newOrder.total,
        status: newOrder.status,
      },
      // Return payment session info if payment gateway is configured
      // This would be where you'd initialize Stripe/MultiSafePay session
      paymentRequired: true,
      // paymentSession: { ... } // TODO: Add when payment is implemented
    })

  } catch (error: any) {
    console.error('❌ Checkout error:', error)

    // Rollback: If order was created but stock deduction failed,
    // we should handle this gracefully
    // TODO: Implement transaction rollback or compensating actions

    return NextResponse.json(
      {
        error: 'Checkout failed',
        message: error.message || 'An error occurred during checkout',
      },
      { status: 500 }
    )
  }
}
