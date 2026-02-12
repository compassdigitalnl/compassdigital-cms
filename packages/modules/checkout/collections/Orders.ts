import type { CollectionConfig } from 'payload'

/**
 * Orders Collection - Customer orders with complete workflow
 * Supports B2C and B2B orders, quotes, invoicing
 */
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Bestelling',
    plural: 'Bestellingen',
  },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'status', 'total', 'createdAt'],
    group: 'Checkout',
    description: 'Klantbestellingen met volledige workflow',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // Customers can only read their own orders
      return {
        customer: {
          equals: user.id,
        },
      }
    },
    create: ({ req: { user } }) => !!user || true, // Allow guest orders
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Order Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'orderNumber',
                  type: 'text',
                  required: true,
                  unique: true,
                  label: 'Bestelnummer',
                  admin: {
                    width: '50%',
                    readOnly: true,
                  },
                  hooks: {
                    beforeChange: [
                      ({ value, operation }) => {
                        if (operation === 'create' && !value) {
                          // Generate order number: ORD-YYYYMMDD-XXXX
                          const date = new Date()
                          const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')
                          const random = Math.floor(Math.random() * 10000)
                            .toString()
                            .padStart(4, '0')
                          return `ORD-${dateStr}-${random}`
                        }
                        return value
                      },
                    ],
                  },
                },
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'pending',
                  options: [
                    { label: 'Pending (Wacht op betaling)', value: 'pending' },
                    { label: 'Paid (Betaald)', value: 'paid' },
                    { label: 'Processing (In behandeling)', value: 'processing' },
                    { label: 'Shipped (Verzonden)', value: 'shipped' },
                    { label: 'Delivered (Afgeleverd)', value: 'delivered' },
                    { label: 'Completed (Voltooid)', value: 'completed' },
                    { label: 'Cancelled (Geannuleerd)', value: 'cancelled' },
                    { label: 'Refunded (Terugbetaald)', value: 'refunded' },
                    { label: 'Quote (Offerte)', value: 'quote' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
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
              name: 'customerEmail',
              type: 'email',
              label: 'E-mail',
              admin: {
                description: 'Voor gastbestellingen',
              },
            },
          ],
        },
        {
          label: 'Items',
          fields: [
            {
              name: 'items',
              type: 'array',
              required: true,
              minRows: 1,
              label: 'Bestelde Producten',
              fields: [
                {
                  name: 'product',
                  type: 'relationship',
                  relationTo: 'products',
                  required: true,
                },
                {
                  name: 'productSnapshot',
                  type: 'group',
                  label: 'Product Snapshot',
                  admin: {
                    description: 'Product details op moment van bestelling',
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                    },
                    {
                      name: 'sku',
                      type: 'text',
                    },
                    {
                      name: 'image',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'variantId',
                  type: 'text',
                  label: 'Variant',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'quantity',
                      type: 'number',
                      required: true,
                      min: 1,
                      label: 'Aantal',
                      admin: { width: '25%' },
                    },
                    {
                      name: 'unitPrice',
                      type: 'number',
                      required: true,
                      label: 'Prijs per stuk',
                      admin: { width: '25%' },
                    },
                    {
                      name: 'discount',
                      type: 'number',
                      defaultValue: 0,
                      label: 'Korting',
                      admin: { width: '25%' },
                    },
                    {
                      name: 'totalPrice',
                      type: 'number',
                      label: 'Totaal',
                      admin: {
                        width: '25%',
                        readOnly: true,
                      },
                    },
                  ],
                },
                {
                  name: 'notes',
                  type: 'textarea',
                  label: 'Notities',
                },
              ],
            },
          ],
        },
        {
          label: 'Addresses',
          fields: [
            {
              name: 'billingAddress',
              type: 'group',
              label: 'Factuuradres',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'firstName', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'lastName', type: 'text', required: true, admin: { width: '50%' } },
                  ],
                },
                { name: 'company', type: 'text' },
                { name: 'street', type: 'text', required: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'houseNumber', type: 'text', required: true, admin: { width: '25%' } },
                    { name: 'addition', type: 'text', admin: { width: '25%' } },
                    { name: 'postalCode', type: 'text', required: true, admin: { width: '25%' } },
                    { name: 'city', type: 'text', required: true, admin: { width: '25%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'country', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'phone', type: 'text', admin: { width: '50%' } },
                  ],
                },
              ],
            },
            {
              name: 'shippingAddress',
              type: 'group',
              label: 'Verzendadres',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'firstName', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'lastName', type: 'text', required: true, admin: { width: '50%' } },
                  ],
                },
                { name: 'company', type: 'text' },
                { name: 'street', type: 'text', required: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'houseNumber', type: 'text', required: true, admin: { width: '25%' } },
                    { name: 'addition', type: 'text', admin: { width: '25%' } },
                    { name: 'postalCode', type: 'text', required: true, admin: { width: '25%' } },
                    { name: 'city', type: 'text', required: true, admin: { width: '25%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'country', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'phone', type: 'text', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Payment & Shipping',
          fields: [
            {
              name: 'payment',
              type: 'group',
              label: 'Betaling',
              fields: [
                {
                  name: 'method',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'iDEAL', value: 'ideal' },
                    { label: 'Credit Card', value: 'creditcard' },
                    { label: 'Bankoverschrijving', value: 'banktransfer' },
                    { label: 'PayPal', value: 'paypal' },
                    { label: 'Mollie', value: 'mollie' },
                    { label: 'Op factuur (B2B)', value: 'invoice' },
                  ],
                },
                {
                  name: 'status',
                  type: 'select',
                  defaultValue: 'pending',
                  options: [
                    { label: 'Pending', value: 'pending' },
                    { label: 'Paid', value: 'paid' },
                    { label: 'Failed', value: 'failed' },
                    { label: 'Refunded', value: 'refunded' },
                  ],
                },
                {
                  name: 'transactionId',
                  type: 'text',
                  label: 'Transactie ID',
                },
                {
                  name: 'paidAt',
                  type: 'date',
                  label: 'Betaald Op',
                  admin: {
                    date: {
                      displayFormat: 'dd-MM-yyyy HH:mm',
                    },
                  },
                },
              ],
            },
            {
              name: 'shipping',
              type: 'group',
              label: 'Verzending',
              fields: [
                {
                  name: 'method',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Standaard (3-5 dagen)', value: 'standard' },
                    { label: 'Express (1-2 dagen)', value: 'express' },
                    { label: 'Afhalen', value: 'pickup' },
                  ],
                },
                {
                  name: 'cost',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Verzendkosten',
                },
                {
                  name: 'trackingNumber',
                  type: 'text',
                  label: 'Track & Trace',
                },
                {
                  name: 'carrier',
                  type: 'text',
                  label: 'Vervoerder',
                },
                {
                  name: 'shippedAt',
                  type: 'date',
                  label: 'Verzonden Op',
                  admin: {
                    date: {
                      displayFormat: 'dd-MM-yyyy HH:mm',
                    },
                  },
                },
                {
                  name: 'deliveredAt',
                  type: 'date',
                  label: 'Afgeleverd Op',
                  admin: {
                    date: {
                      displayFormat: 'dd-MM-yyyy HH:mm',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Totalen',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'subtotal',
                  type: 'number',
                  required: true,
                  label: 'Subtotaal',
                  admin: { width: '25%', readOnly: true },
                },
                {
                  name: 'discountTotal',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Totale Korting',
                  admin: { width: '25%', readOnly: true },
                },
                {
                  name: 'shippingTotal',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Verzendkosten',
                  admin: { width: '25%' },
                },
                {
                  name: 'taxTotal',
                  type: 'number',
                  defaultValue: 0,
                  label: 'BTW',
                  admin: { width: '25%', readOnly: true },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'total',
                  type: 'number',
                  required: true,
                  label: 'Totaal',
                  admin: { width: '50%', readOnly: true },
                },
                {
                  name: 'currency',
                  type: 'select',
                  defaultValue: 'EUR',
                  options: [
                    { label: 'EUR', value: 'EUR' },
                    { label: 'USD', value: 'USD' },
                    { label: 'GBP', value: 'GBP' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Metadata',
          fields: [
            {
              name: 'customerNotes',
              type: 'textarea',
              label: 'Klant Notities',
            },
            {
              name: 'internalNotes',
              type: 'textarea',
              label: 'Interne Notities',
              admin: {
                description: 'Alleen zichtbaar voor admins',
              },
            },
            {
              name: 'tags',
              type: 'text',
              hasMany: true,
              label: 'Tags',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Calculate totals
        if (data.items && Array.isArray(data.items)) {
          data.subtotal = data.items.reduce(
            (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0),
            0,
          )
          data.discountTotal = data.items.reduce((sum, item) => sum + (item.discount || 0), 0)
          data.taxTotal = (data.subtotal - data.discountTotal + data.shippingTotal) * 0.21 // 21% BTW
          data.total = data.subtotal - data.discountTotal + data.shippingTotal + data.taxTotal
        }
        return data
      },
    ],
  },
  timestamps: true,
}
