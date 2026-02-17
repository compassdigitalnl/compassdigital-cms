import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Bestelling',
    plural: 'Bestellingen',
  },
  admin: {
    useAsTitle: 'orderNumber',
    group: 'E-commerce',
    defaultColumns: ['orderNumber', 'customer', 'total', 'status', 'createdAt'],
    description: 'Klantbestellingen en order management',
    hidden: ({ user }) => !checkRole(['admin'], user),
  },
  access: {
    read: ({ req: { user } }) => {
      // Admins can read all, users can only read their own orders
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        customer: {
          equals: user.id,
        },
      }
    },
    create: () => true, // Orders created by checkout process
    update: ({ req: { user } }) => {
      // Only admins can update orders
      return user?.roles?.includes('admin') || false
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete orders
      return user?.roles?.includes('admin') || false
    },
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Bestelnummer',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Automatisch gegenereerd',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              // Generate order number: ORD-YYYYMMDD-XXXXX
              const date = new Date()
              const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
              const random = Math.floor(Math.random() * 99999)
                .toString()
                .padStart(5, '0')
              return `ORD-${dateStr}-${random}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Klant',
      admin: {
        position: 'sidebar',
      },
    },
    // Order Items
    {
      name: 'items',
      type: 'array',
      label: 'Producten',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          label: 'Product',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
          label: 'Aantal',
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          label: 'Prijs per stuk (€)',
          admin: {
            step: 0.01,
            description: 'Prijs op moment van bestelling',
          },
        },
        {
          name: 'subtotal',
          type: 'number',
          label: 'Subtotaal (€)',
          admin: {
            readOnly: true,
            step: 0.01,
          },
          hooks: {
            beforeChange: [
              ({ siblingData }) => {
                const price = siblingData.price || 0
                const quantity = siblingData.quantity || 0
                return price * quantity
              },
            ],
          },
        },
      ],
    },
    // Pricing
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      label: 'Subtotaal (€)',
      admin: {
        step: 0.01,
        readOnly: true,
      },
    },
    {
      name: 'shippingCost',
      type: 'number',
      defaultValue: 0,
      label: 'Verzendkosten (€)',
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'tax',
      type: 'number',
      defaultValue: 0,
      label: 'BTW (€)',
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'discount',
      type: 'number',
      defaultValue: 0,
      label: 'Korting (€)',
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      label: 'Totaal (€)',
      admin: {
        step: 0.01,
        readOnly: true,
        position: 'sidebar',
      },
    },
    // Addresses
    {
      name: 'shippingAddress',
      type: 'group',
      label: 'Verzendadres',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Naam',
        },
        {
          name: 'company',
          type: 'text',
          label: 'Bedrijfsnaam',
        },
        {
          name: 'street',
          type: 'text',
          required: true,
          label: 'Straat',
        },
        {
          name: 'houseNumber',
          type: 'text',
          required: true,
          label: 'Huisnummer',
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
          label: 'Postcode',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          label: 'Plaats',
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'Nederland',
          label: 'Land',
        },
      ],
    },
    {
      name: 'billingAddress',
      type: 'group',
      label: 'Factuuradres',
      fields: [
        {
          name: 'sameAsShipping',
          type: 'checkbox',
          label: 'Zelfde als verzendadres',
          defaultValue: true,
        },
        {
          name: 'company',
          type: 'text',
          label: 'Bedrijfsnaam',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
        {
          name: 'street',
          type: 'text',
          label: 'Straat',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
        {
          name: 'houseNumber',
          type: 'text',
          label: 'Huisnummer',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'Postcode',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
        {
          name: 'city',
          type: 'text',
          label: 'Plaats',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'Nederland',
          label: 'Land',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
      ],
    },
    // Payment & Status
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Bestelstatus',
      options: [
        { label: 'In behandeling', value: 'pending' },
        { label: 'Betaald', value: 'paid' },
        { label: 'In voorbereiding', value: 'processing' },
        { label: 'Verzonden', value: 'shipped' },
        { label: 'Geleverd', value: 'delivered' },
        { label: 'Geannuleerd', value: 'cancelled' },
        { label: 'Terugbetaald', value: 'refunded' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      label: 'Betaalmethode',
      options: [
        { label: 'iDEAL', value: 'ideal' },
        { label: 'Op rekening', value: 'invoice' },
        { label: 'Creditcard', value: 'creditcard' },
        { label: 'Bankoverschrijving', value: 'banktransfer' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Betaalstatus',
      options: [
        { label: 'In behandeling', value: 'pending' },
        { label: 'Betaald', value: 'paid' },
        { label: 'Mislukt', value: 'failed' },
        { label: 'Terugbetaald', value: 'refunded' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    // Additional Info
    {
      name: 'notes',
      type: 'textarea',
      label: 'Opmerkingen',
      admin: {
        description: 'Interne notities of klant opmerkingen',
      },
    },
    {
      name: 'trackingCode',
      type: 'text',
      label: 'Track & Trace Code',
      admin: {
        description: 'Verzend tracking nummer',
      },
    },
    {
      name: 'invoicePDF',
      type: 'upload',
      relationTo: 'media',
      label: 'Factuur PDF',
      filterOptions: {
        mimeType: { contains: 'pdf' },
      },
      admin: {
        description: 'Gegenereerde factuur',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Calculate totals
        if (data.items && Array.isArray(data.items)) {
          const subtotal = data.items.reduce((sum: number, item: any) => {
            const itemSubtotal = (item.price || 0) * (item.quantity || 0)
            return sum + itemSubtotal
          }, 0)

          data.subtotal = subtotal
          data.total =
            subtotal + (data.shippingCost || 0) + (data.tax || 0) - (data.discount || 0)
        }

        return data
      },
    ],
  },
}
