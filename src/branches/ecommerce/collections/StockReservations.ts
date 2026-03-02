import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/utilities'

/**
 * Stock Reservations Collection
 *
 * Prevents overselling by temporarily reserving stock during checkout process.
 *
 * Flow:
 * 1. User adds item to cart → stock reserved (15 min)
 * 2. User starts checkout → reservation extended
 * 3. Order completed → reservation converted to deduction
 * 4. Timeout (15 min) → reservation auto-released
 *
 * Benefits:
 * - Prevents race conditions (2+ users buying last item)
 * - Fair first-come-first-served
 * - Automatic cleanup of abandoned reservations
 */
export const StockReservations: CollectionConfig = {
  slug: 'stock-reservations',
  labels: {
    singular: 'Stock Reservation',
    plural: 'Stock Reservations',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['product', 'quantity', 'status', 'expiresAt', 'createdAt'],
    group: 'E-commerce',
    description: 'Temporary stock reservations to prevent overselling',
    hidden: ({ user }) => !isAdmin(user as any), // Hidden from non-admins
  },
  access: {
    read: ({ req: { user } }) => (user ? isAdmin(user) : false),
    create: () => true, // System can create reservations
    update: ({ req: { user } }) => (user ? isAdmin(user) : false),
    delete: ({ req: { user } }) => (user ? isAdmin(user) : false),
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
      hasMany: false,
      index: true, // Index for fast lookups
    },
    {
      name: 'variant',
      type: 'text',
      label: 'Variant ID',
      admin: {
        description: 'Product variant if applicable',
      },
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 1,
      label: 'Reserved Quantity',
    },
    {
      name: 'cartId',
      type: 'text',
      label: 'Cart ID',
      index: true,
      admin: {
        description: 'Cart identifier that owns this reservation (TODO: use relationship when Carts collection is implemented)',
      },
    },
    {
      name: 'session',
      type: 'text',
      label: 'Session ID',
      index: true,
      admin: {
        description: 'Session ID for guest carts',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Converted (to order)', value: 'converted' },
        { label: 'Released', value: 'released' },
        { label: 'Expired', value: 'expired' },
      ],
      admin: {
        description: 'Reservation status',
      },
      index: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      label: 'Expires At',
      admin: {
        date: {
          displayFormat: 'dd-MM-yyyy HH:mm:ss',
        },
        description: 'Reservation expires after 15 minutes',
      },
      index: true, // Index for cleanup queries
    },
    {
      name: 'convertedToOrder',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Converted to Order',
      hasMany: false,
      admin: {
        description: 'Order ID if reservation was converted',
        condition: (data: any) => data.status === 'converted',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: {
        description: 'Internal notes (e.g., why released early)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Set expiration time on creation (15 minutes)
        if (operation === 'create' && !data.expiresAt) {
          const now = new Date()
          const expiresAt = new Date(now.getTime() + 15 * 60 * 1000) // 15 minutes
          data.expiresAt = expiresAt.toISOString()
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Update product available stock when reservation is created/released
        if (operation === 'create' || (operation === 'update' && doc.status === 'released')) {
          try {
            const product = await req.payload.findByID({
              collection: 'products',
              id: typeof doc.product === 'string' ? doc.product : doc.product.id,
            })

            if (product.trackStock) {
              // Calculate total active reservations for this product
              const activeReservations = await req.payload.find({
                collection: 'stock-reservations',
                where: {
                  and: [
                    { product: { equals: product.id } },
                    { status: { equals: 'active' } },
                    { expiresAt: { greater_than: new Date().toISOString() } },
                  ],
                },
              })

              const totalReserved = activeReservations.docs.reduce(
                (sum, res: any) => sum + (res.quantity || 0),
                0,
              )

              // Update product's available stock (for display purposes)
              const availableStock = Math.max(0, (product.stock || 0) - totalReserved)

              console.log(
                `📦 Stock reservation ${operation}: ${product.title} (Reserved: ${totalReserved}, Available: ${availableStock})`,
              )

              // Optionally: Add a custom field to Products collection for "availableStock"
              // For now, we calculate this on-the-fly in checkout
            }
          } catch (error) {
            console.error('Failed to update product available stock:', error)
          }
        }

        return doc
      },
    ],
  },
  timestamps: true,
}
