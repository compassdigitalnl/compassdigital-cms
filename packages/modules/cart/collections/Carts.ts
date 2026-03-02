import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/utilities'

/**
 * Carts Collection - Shopping cart with B2B/B2C support
 * Supports guest carts, customer carts, quotes, and saved carts
 */
export const Carts: CollectionConfig = {
  slug: 'carts',
  labels: {
    singular: 'Winkelwagen',
    plural: 'Winkelwagens',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['customer', 'status', 'itemCount', 'total', 'updatedAt'],
    group: 'Bestellingen',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) {
        // Guest carts readable by session
        return {
          status: {
            equals: 'active',
          },
        } as any
      }
      if (isAdmin(user)) return true
      // Customers can only read their own carts
      return {
        customer: {
          equals: user.id,
        },
      }
    },
    create: () => true, // Anyone can create a cart
    update: ({ req: { user } }) => {
      if (!user) return true // Guest carts
      if (isAdmin(user)) return true
      return {
        customer: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if ((user ? isAdmin(user) : false)) return true
      if (!user) return false
      return {
        customer: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: 'Klant',
      admin: {
        description: 'Leeg voor gastbestellingen',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      label: 'Sessie ID',
      admin: {
        description: 'Voor gastbestellingen en sessie tracking',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Actief', value: 'active' },
        { label: 'Afgerond (Bestelling geplaatst)', value: 'completed' },
        { label: 'Verlaten', value: 'abandoned' },
        { label: 'Opgeslagen (Later)', value: 'saved' },
        { label: 'Offerte', value: 'quote' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Winkelwagen Items',
      minRows: 0,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'variantId',
          type: 'text',
          label: 'Variant ID',
          admin: {
            description: 'Als product variants heeft',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'quantity',
              type: 'number',
              required: true,
              min: 1,
              defaultValue: 1,
              label: 'Aantal',
              admin: { width: '33%' },
            },
            {
              name: 'unitPrice',
              type: 'number',
              required: true,
              label: 'Prijs per stuk',
              admin: {
                width: '33%',
                description: 'Prijs op moment van toevoegen',
              },
            },
            {
              name: 'totalPrice',
              type: 'number',
              label: 'Totaal',
              admin: {
                width: '34%',
                readOnly: true,
              },
              hooks: {
                beforeChange: [
                  ({ siblingData }) => {
                    return (siblingData?.quantity || 0) * (siblingData?.unitPrice || 0)
                  },
                ],
              },
            },
          ],
        },
        {
          name: 'discount',
          type: 'group',
          label: 'Korting',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Geen', value: 'none' },
                { label: 'Percentage', value: 'percentage' },
                { label: 'Vast bedrag', value: 'fixed' },
              ],
              defaultValue: 'none',
            },
            {
              name: 'value',
              type: 'number',
              label: 'Waarde',
              admin: {
                description: 'Percentage of bedrag',
              },
            },
            {
              name: 'reason',
              type: 'text',
              label: 'Reden',
              admin: {
                description: 'Bijv. "Volume discount", "Customer group"',
              },
            },
          ],
        },
        {
          name: 'notes',
          type: 'textarea',
          label: 'Notities',
          admin: {
            description: 'Klant notities (bijv. gravure tekst, kleurwensen)',
          },
        },
        {
          name: 'addedAt',
          type: 'date',
          defaultValue: () => new Date(),
          admin: {
            readOnly: true,
            date: {
              displayFormat: 'dd-MM-yyyy HH:mm',
            },
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Totalen',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'itemCount',
              type: 'number',
              defaultValue: 0,
              label: 'Aantal Items',
              admin: {
                width: '25%',
                readOnly: true,
              },
            },
            {
              name: 'subtotal',
              type: 'number',
              defaultValue: 0,
              label: 'Subtotaal',
              admin: {
                width: '25%',
                readOnly: true,
              },
            },
            {
              name: 'discountTotal',
              type: 'number',
              defaultValue: 0,
              label: 'Totale Korting',
              admin: {
                width: '25%',
                readOnly: true,
              },
            },
            {
              name: 'total',
              type: 'number',
              defaultValue: 0,
              label: 'Totaal',
              admin: {
                width: '25%',
                readOnly: true,
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Coupons & Kortingen',
      fields: [
        {
          name: 'coupons',
          type: 'array',
          label: 'Toegepaste Coupons',
          fields: [
            {
              name: 'code',
              type: 'text',
              required: true,
              label: 'Coupon Code',
            },
            {
              name: 'discountType',
              type: 'select',
              options: [
                { label: 'Percentage', value: 'percentage' },
                { label: 'Vast bedrag', value: 'fixed' },
                { label: 'Gratis verzending', value: 'free_shipping' },
              ],
            },
            {
              name: 'discountValue',
              type: 'number',
              label: 'Korting Waarde',
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Metadata',
      fields: [
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'EUR',
          options: [
            { label: 'Euro (EUR)', value: 'EUR' },
            { label: 'US Dollar (USD)', value: 'USD' },
            { label: 'British Pound (GBP)', value: 'GBP' },
          ],
        },
        {
          name: 'customerGroup',
          type: 'relationship',
          relationTo: 'customer-groups',
          label: 'Klantengroep',
          admin: {
            description: 'Voor pricing calculations',
          },
        },
        {
          name: 'expiresAt',
          type: 'date',
          label: 'Verloopt Op',
          admin: {
            description: 'Auto-verwijderen na deze datum',
            date: {
              displayFormat: 'dd-MM-yyyy HH:mm',
            },
          },
        },
        {
          name: 'convertedToOrder',
          type: 'relationship',
          relationTo: 'orders',
          label: 'Omgezet naar Bestelling',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Calculate totals
        if (data.items && Array.isArray(data.items)) {
          data.itemCount = data.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
          data.subtotal = data.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
          // Apply cart-level discounts
          data.total = data.subtotal - (data.discountTotal || 0)
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // ========================================
        // AUTO-RESERVE STOCK FOR CART ITEMS
        // ========================================
        // When cart items are added/updated, automatically reserve stock
        // This prevents overselling when multiple users checkout simultaneously

        if (operation === 'create' || operation === 'update') {
          // Only reserve for active carts (not completed, abandoned, or quote)
          if (doc.status !== 'active') {
            return doc
          }

          const { reserveStock } = await import('@/lib/stock/reservations')

          if (doc.items && Array.isArray(doc.items)) {
            for (const item of doc.items) {
              const productId = typeof item.product === 'string' ? item.product : item.product?.id
              if (!productId) continue

              try {
                // Reserve or update stock reservation for this cart item
                const result = await reserveStock(req.payload, {
                  productId,
                  variantId: item.variantId,
                  quantity: item.quantity || 0,
                  cartId: doc.id,
                  sessionId: doc.sessionId,
                })

                if (!result.success) {
                  console.warn(`⚠️ Failed to reserve stock for ${productId}:`, result.error)
                  // Don't fail cart update if reservation fails - user can still try checkout
                }
              } catch (error) {
                console.error(`❌ Error reserving stock for ${productId}:`, error)
                // Don't fail cart update if reservation fails
              }
            }
          }
        }

        // ========================================
        // RELEASE RESERVATIONS ON CART DELETION
        // ========================================
        // Note: This hook is for afterChange, not afterDelete
        // We handle cart abandonment in a separate cleanup job

        return doc
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        // Release all stock reservations when cart is deleted
        const { releaseCartReservations } = await import('@/lib/stock/reservations')

        try {
          const result = await releaseCartReservations(req.payload, doc.id)
          if (result.success && result.released > 0) {
            console.log(`✅ Released ${result.released} stock reservations for deleted cart ${doc.id}`)
          }
        } catch (error) {
          console.error(`Failed to release stock reservations for cart ${doc.id}:`, error)
          // Don't fail cart deletion if reservation release fails
        }
      },
    ],
  },
  timestamps: true,
}
