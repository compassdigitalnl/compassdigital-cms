import type { CollectionConfig } from 'payload'

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
    group: 'Cart',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) {
        // Guest carts readable by session
        return {
          status: {
            equals: 'active',
          },
        }
      }
      if (user.role === 'admin') return true
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
      if (user.role === 'admin') return true
      return {
        customer: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
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
  },
  timestamps: true,
}
