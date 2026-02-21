import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

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
    hidden: shouldHideCollection('checkout'),
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
        // Product snapshots (at order time) - preserved even if product is deleted
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Product Naam',
          admin: {
            description: 'Productnaam op moment van bestelling',
          },
        },
        {
          name: 'sku',
          type: 'text',
          label: 'SKU',
          admin: {
            description: 'SKU op moment van bestelling',
          },
        },
        {
          name: 'ean',
          type: 'text',
          label: 'EAN / Barcode',
          admin: {
            description: 'EAN op moment van bestelling',
          },
        },
        // Grouped product tracking
        {
          name: 'parentProductId',
          type: 'text',
          label: 'Parent Product ID',
          admin: {
            description: 'ID van grouped parent product (indien van toepassing)',
          },
        },
        {
          name: 'parentProductTitle',
          type: 'text',
          label: 'Parent Product Naam',
          admin: {
            description: 'Naam van grouped parent product (indien van toepassing)',
          },
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
    // Shipping Information
    {
      name: 'shippingProvider',
      type: 'select',
      label: 'Verzendpartij',
      options: [
        { label: 'PostNL', value: 'postnl' },
        { label: 'DHL', value: 'dhl' },
        { label: 'DPD', value: 'dpd' },
        { label: 'UPS', value: 'ups' },
        { label: 'Transmission', value: 'transmission' },
        { label: 'Eigen bezorging', value: 'own' },
        { label: 'Ophalen', value: 'pickup' },
      ],
      admin: {
        description: 'Verzendpartner voor deze bestelling',
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
      name: 'trackingUrl',
      type: 'text',
      label: 'Track & Trace URL',
      admin: {
        description: 'Directe link naar tracking pagina',
      },
    },
    {
      name: 'shippingMethod',
      type: 'select',
      label: 'Verzendmethode',
      options: [
        { label: 'Standaard (2-3 werkdagen)', value: 'standard' },
        { label: 'Express (volgende werkdag)', value: 'express' },
        { label: 'Same day delivery', value: 'same_day' },
        { label: 'Ophalen in magazijn', value: 'pickup' },
      ],
      defaultValue: 'standard',
      admin: {
        description: 'Gekozen verzendmethode',
      },
    },
    {
      name: 'expectedDeliveryDate',
      type: 'date',
      label: 'Verwachte leverdatum',
      admin: {
        description: 'Geschatte leverdatum (bijv. "Verwacht vandaag")',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'actualDeliveryDate',
      type: 'date',
      label: 'Werkelijke leverdatum',
      admin: {
        description: 'Datum waarop bestelling is afgeleverd',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    // Timeline Events (for order tracking page)
    {
      name: 'timeline',
      type: 'array',
      label: 'Tijdlijn Events',
      admin: {
        description: 'Chronologische events voor order tracking (automatisch + handmatig)',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'event',
          type: 'select',
          required: true,
          label: 'Event Type',
          options: [
            { label: '📦 Bestelling geplaatst', value: 'order_placed' },
            { label: '💳 Betaling ontvangen', value: 'payment_received' },
            { label: '✅ In behandeling', value: 'processing' },
            { label: '📋 Factuur gegenereerd', value: 'invoice_generated' },
            { label: '🚚 Verzonden', value: 'shipped' },
            { label: '📍 In transit', value: 'in_transit' },
            { label: '🏠 Afgeleverd', value: 'delivered' },
            { label: '❌ Geannuleerd', value: 'cancelled' },
            { label: '↩️ Retour aangevraagd', value: 'return_requested' },
            { label: '💰 Terugbetaald', value: 'refunded' },
            { label: '📝 Opmerking toegevoegd', value: 'note_added' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Event Titel',
          admin: {
            description: 'Optioneel: custom titel (bijv. "Pakket onderweg naar sorteercentrum")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Beschrijving',
          admin: {
            description: 'Extra details over dit event',
          },
        },
        {
          name: 'timestamp',
          type: 'date',
          label: 'Tijdstip',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'location',
          type: 'text',
          label: 'Locatie',
          admin: {
            description: 'Optioneel: fysieke locatie (bijv. "Distributiecentrum Utrecht")',
          },
        },
      ],
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
    {
      name: 'invoiceNumber',
      type: 'text',
      label: 'Factuurnummer',
      admin: {
        description: 'Gekoppeld factuurnummer (bijv. F-2026-0187)',
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
