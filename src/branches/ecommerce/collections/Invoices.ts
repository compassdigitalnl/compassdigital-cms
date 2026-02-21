import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  labels: {
    singular: 'Factuur',
    plural: 'Facturen',
  },
  admin: {
    useAsTitle: 'invoiceNumber',
    group: 'E-commerce',
    defaultColumns: ['invoiceNumber', 'customer', 'amount', 'status', 'dueDate'],
    description: 'Facturen en betalingsadministratie',
    hidden: shouldHideCollection('invoices'),
  },
  access: {
    read: ({ req: { user } }) => {
      // Admins can read all, users can only read their own invoices
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        customer: {
          equals: user.id,
        },
      }
    },
    create: ({ req: { user } }) => {
      // Only admins can create invoices
      return user?.roles?.includes('admin') || false
    },
    update: ({ req: { user } }) => {
      // Only admins can update invoices
      return user?.roles?.includes('admin') || false
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete invoices
      return user?.roles?.includes('admin') || false
    },
  },
  fields: [
    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Factuurnummer',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Automatisch gegenereerd (bijv. F-2026-0187)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              // Generate invoice number: F-YYYY-XXXXX
              const date = new Date()
              const year = date.getFullYear()
              const random = Math.floor(Math.random() * 99999)
                .toString()
                .padStart(5, '0')
              return `F-${year}-${random}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      label: 'Bestelling',
      admin: {
        position: 'sidebar',
        description: 'Gekoppelde bestelling',
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
        description: 'Wordt automatisch overgenomen van bestelling indien niet ingevuld',
      },
    },
    // Dates
    {
      name: 'invoiceDate',
      type: 'date',
      required: true,
      label: 'Factuurdatum',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      required: true,
      label: 'Vervaldatum',
      admin: {
        description: 'Betaaltermijn (standaard: factuurdatum + 14 dagen)',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (!value && siblingData?.invoiceDate) {
              // Auto-set due date to 14 days after invoice date
              const invoiceDate = new Date(siblingData.invoiceDate)
              const dueDate = new Date(invoiceDate)
              dueDate.setDate(dueDate.getDate() + 14)
              return dueDate.toISOString()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'paymentDate',
      type: 'date',
      label: 'Betaaldatum',
      admin: {
        description: 'Datum waarop factuur is voldaan',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    // Pricing
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      label: 'Subtotaal (€)',
      admin: {
        step: 0.01,
        description: 'Bedrag excl. BTW',
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
      name: 'shippingCost',
      type: 'number',
      defaultValue: 0,
      label: 'Verzendkosten (€)',
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
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Totaalbedrag (€)',
      admin: {
        step: 0.01,
        readOnly: true,
        position: 'sidebar',
        description: 'Totaal incl. BTW (automatisch berekend)',
      },
    },
    // Status
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      label: 'Status',
      options: [
        { label: 'Openstaand', value: 'open' },
        { label: 'Betaald', value: 'paid' },
        { label: 'Achterstallig', value: 'overdue' },
        { label: 'Geannuleerd', value: 'cancelled' },
        { label: 'Creditnota', value: 'credit_note' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    // Invoice Items (snapshot from order)
    {
      name: 'items',
      type: 'array',
      label: 'Factuurregels',
      required: true,
      minRows: 1,
      admin: {
        description: 'Snapshot van de bestelregels op moment van facturatie',
      },
      fields: [
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Omschrijving',
        },
        {
          name: 'sku',
          type: 'text',
          label: 'SKU/Artikelnummer',
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
          name: 'unitPrice',
          type: 'number',
          required: true,
          min: 0,
          label: 'Prijs per stuk (€)',
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'lineTotal',
          type: 'number',
          label: 'Subtotaal (€)',
          admin: {
            readOnly: true,
            step: 0.01,
          },
          hooks: {
            beforeChange: [
              ({ siblingData }) => {
                const price = siblingData.unitPrice || 0
                const quantity = siblingData.quantity || 0
                return price * quantity
              },
            ],
          },
        },
      ],
    },
    // Payment Information
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Betaalmethode',
      options: [
        { label: 'iDEAL', value: 'ideal' },
        { label: 'Op rekening', value: 'invoice' },
        { label: 'Creditcard', value: 'creditcard' },
        { label: 'Bankoverschrijving', value: 'banktransfer' },
        { label: 'Incasso', value: 'direct_debit' },
      ],
      admin: {
        description: 'Gekozen of gebruikte betaalmethode',
      },
    },
    {
      name: 'paymentReference',
      type: 'text',
      label: 'Betalingskenmerk',
      admin: {
        description: 'Referentie/transactie-ID van betaling',
      },
    },
    // PDF File
    {
      name: 'pdfFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Factuur PDF',
      filterOptions: {
        mimeType: { contains: 'pdf' },
      },
      admin: {
        description: 'Gegenereerde factuur PDF',
      },
    },
    // Additional Info
    {
      name: 'notes',
      type: 'textarea',
      label: 'Opmerkingen',
      admin: {
        description: 'Interne notities of extra informatie op factuur',
      },
    },
    {
      name: 'remindersSent',
      type: 'number',
      defaultValue: 0,
      label: 'Aantal herinneringen',
      admin: {
        description: 'Aantal verstuurde betalingsherinneringen',
        readOnly: true,
      },
    },
    {
      name: 'lastReminderDate',
      type: 'date',
      label: 'Laatste herinnering',
      admin: {
        description: 'Datum laatste betalingsherinnering',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Auto-calculate amount from subtotal, tax, shipping, discount
        if (data.subtotal !== undefined) {
          data.amount =
            (data.subtotal || 0) +
            (data.tax || 0) +
            (data.shippingCost || 0) -
            (data.discount || 0)
        }

        // Auto-set status to paid if paymentDate is set
        if (data.paymentDate && data.status === 'open') {
          data.status = 'paid'
        }

        // Auto-set status to overdue if past due date and still open
        if (data.dueDate && data.status === 'open') {
          const now = new Date()
          const dueDate = new Date(data.dueDate)
          if (now > dueDate) {
            data.status = 'overdue'
          }
        }

        return data
      },
    ],
  },
}
