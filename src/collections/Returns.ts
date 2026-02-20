import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const Returns: CollectionConfig = {
  slug: 'returns',
  labels: {
    singular: 'Retour / RMA',
    plural: 'Retourneren / RMA',
  },
  admin: {
    useAsTitle: 'rmaNumber',
    group: 'E-commerce',
    defaultColumns: ['rmaNumber', 'customer', 'status', 'returnValue', 'createdAt'],
    description: 'Retour en RMA management (Return Merchandise Authorization)',
    hidden: ({ user }) => !checkRole(['admin'], user),
  },
  access: {
    read: ({ req: { user } }) => {
      // Admins can read all, users can only read their own returns
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        customer: {
          equals: user.id,
        },
      }
    },
    create: () => true, // Users can create return requests
    update: ({ req: { user } }) => {
      // Users can update their own pending returns, admins can update all
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        customer: {
          equals: user.id,
        },
        status: {
          equals: 'pending',
        },
      }
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete returns
      return user?.roles?.includes('admin') || false
    },
  },
  fields: [
    {
      name: 'rmaNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'RMA Nummer',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Automatisch gegenereerd (bijv. RMA-2026-001)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              // Generate RMA number: RMA-YYYY-XXX
              const date = new Date()
              const year = date.getFullYear()
              const random = Math.floor(Math.random() * 999)
                .toString()
                .padStart(3, '0')
              return `RMA-${year}-${random}`
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
        description: 'Originele bestelling waarvoor retour wordt aangevraagd',
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
    // Status & Dates
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'In behandeling', value: 'pending' },
        { label: 'Goedgekeurd', value: 'approved' },
        { label: 'Afgekeurd', value: 'rejected' },
        { label: 'Retourlabel verstuurd', value: 'label_sent' },
        { label: 'Product ontvangen', value: 'received' },
        { label: 'In inspectie', value: 'inspecting' },
        { label: 'Terugbetaald', value: 'refunded' },
        { label: 'Vervangen', value: 'replaced' },
        { label: 'Afgerond', value: 'completed' },
        { label: 'Geannuleerd', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'returnDeadline',
      type: 'date',
      label: 'Retourtermijn vervalt',
      admin: {
        description: 'Uiterste datum voor retourneren (14 dagen na levering)',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'receivedDate',
      type: 'date',
      label: 'Ontvangstdatum retour',
      admin: {
        description: 'Datum waarop geretourneerde producten zijn ontvangen',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'processedDate',
      type: 'date',
      label: 'Verwerkingsdatum',
      admin: {
        description: 'Datum waarop retour is afgehandeld',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    // Return Items
    {
      name: 'items',
      type: 'array',
      label: 'Te retourneren producten',
      required: true,
      minRows: 1,
      admin: {
        description: 'Producten die de klant wil retourneren',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          label: 'Product',
        },
        // Product snapshots
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Product Naam',
        },
        {
          name: 'sku',
          type: 'text',
          label: 'SKU',
        },
        {
          name: 'brand',
          type: 'text',
          label: 'Merk',
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
          name: 'quantityOrdered',
          type: 'number',
          required: true,
          min: 1,
          label: 'Aantal besteld',
        },
        {
          name: 'quantityReturning',
          type: 'number',
          required: true,
          min: 1,
          label: 'Aantal retour',
          admin: {
            description: 'Aantal stuks dat geretourneerd wordt',
          },
        },
        {
          name: 'isReturnable',
          type: 'checkbox',
          defaultValue: true,
          label: 'Retourneerbaar',
          admin: {
            description: 'Steriele of hygiëne-artikelen zijn niet retourneerbaar',
          },
        },
        {
          name: 'returnValue',
          type: 'number',
          label: 'Retourwaarde (€)',
          admin: {
            readOnly: true,
            step: 0.01,
          },
          hooks: {
            beforeChange: [
              ({ siblingData }) => {
                const price = siblingData.unitPrice || 0
                const quantity = siblingData.quantityReturning || 0
                return price * quantity
              },
            ],
          },
        },
      ],
    },
    // Return Reason
    {
      name: 'returnReason',
      type: 'select',
      required: true,
      label: 'Reden van retour',
      options: [
        { label: 'Verkeerd product ontvangen', value: 'wrong_product' },
        { label: 'Verkeerde maat/variant', value: 'wrong_size' },
        { label: 'Beschadigd ontvangen', value: 'damaged' },
        { label: 'Voldoet niet aan verwachting', value: 'not_expected' },
        { label: 'Dubbel besteld', value: 'duplicate' },
        { label: 'Andere reden', value: 'other' },
      ],
      admin: {
        description: 'Hoofdreden voor retourneren',
      },
    },
    {
      name: 'reasonDescription',
      type: 'textarea',
      label: 'Toelichting',
      admin: {
        description: 'Extra uitleg of details van de klant',
      },
    },
    // Product Condition
    {
      name: 'productCondition',
      type: 'select',
      required: true,
      label: 'Conditie van product',
      options: [
        { label: 'Ongeopend (originele verpakking intact)', value: 'unopened' },
        { label: 'Geopend (verpakking geopend, product intact)', value: 'opened' },
        { label: 'Beschadigd (product of verpakking beschadigd)', value: 'damaged' },
      ],
      admin: {
        description: 'Status van het te retourneren product',
      },
    },
    {
      name: 'photos',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Foto\'s',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
      admin: {
        description: 'Foto\'s van het product/verpakking (max. 5 foto\'s)',
      },
    },
    // Preferred Resolution
    {
      name: 'preferredResolution',
      type: 'select',
      required: true,
      label: 'Gewenste oplossing',
      options: [
        { label: 'Vervangend product', value: 'replacement' },
        { label: 'Geld terug', value: 'refund' },
        { label: 'Tegoed / voucher', value: 'store_credit' },
        { label: 'Ander product', value: 'exchange' },
      ],
      admin: {
        description: 'Hoe wil de klant de retour afgehandeld zien?',
      },
    },
    // Shipping
    {
      name: 'returnShipping',
      type: 'group',
      label: 'Retourverzending',
      fields: [
        {
          name: 'trackingCode',
          type: 'text',
          label: 'Track & Trace Code',
          admin: {
            description: 'Tracking nummer van retourzending',
          },
        },
        {
          name: 'trackingUrl',
          type: 'text',
          label: 'Track & Trace URL',
        },
        {
          name: 'returnLabelGenerated',
          type: 'checkbox',
          defaultValue: false,
          label: 'Retourlabel gegenereerd',
        },
        {
          name: 'returnLabelSentDate',
          type: 'date',
          label: 'Retourlabel verzonden op',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'shippingCostRefund',
          type: 'number',
          defaultValue: 0,
          label: 'Verzendkosten terugbetaling (€)',
          admin: {
            step: 0.01,
            description: 'Bij foutieve levering worden verzendkosten terugbetaald',
          },
        },
      ],
    },
    // Refund Information
    {
      name: 'returnValue',
      type: 'number',
      required: true,
      label: 'Totale retourwaarde (€)',
      admin: {
        step: 0.01,
        readOnly: true,
        position: 'sidebar',
        description: 'Totaalbedrag van geretourneerde producten',
      },
    },
    {
      name: 'refundAmount',
      type: 'number',
      defaultValue: 0,
      label: 'Terugbetaald bedrag (€)',
      admin: {
        step: 0.01,
        description: 'Daadwerkelijk terugbetaald bedrag (kan afwijken na inspectie)',
      },
    },
    {
      name: 'refundDate',
      type: 'date',
      label: 'Terugbetaaldatum',
      admin: {
        description: 'Datum waarop terugbetaling is verwerkt',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'refundMethod',
      type: 'select',
      label: 'Terugbetalingsmethode',
      options: [
        { label: 'Originele betaalmethode', value: 'original' },
        { label: 'Bankoverschrijving', value: 'bank_transfer' },
        { label: 'Tegoed / voucher', value: 'store_credit' },
      ],
      admin: {
        description: 'Manier waarop terugbetaling plaatsvindt',
      },
    },
    // Inspection & Processing
    {
      name: 'inspectionNotes',
      type: 'textarea',
      label: 'Inspectie notities',
      admin: {
        description: 'Bevindingen bij inspectie van geretourneerde producten (alleen voor admins)',
        condition: (data, siblingData, { user }) => checkRole(['admin'], user),
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Interne notities',
      admin: {
        description: 'Interne opmerkingen (niet zichtbaar voor klant)',
        condition: (data, siblingData, { user }) => checkRole(['admin'], user),
      },
    },
    {
      name: 'approvalDate',
      type: 'date',
      label: 'Goedkeuringsdatum',
      admin: {
        description: 'Datum waarop retour is goedgekeurd',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'rejectionReason',
      type: 'text',
      label: 'Reden afkeuring',
      admin: {
        description: 'Reden waarom retour is afgekeurd',
        condition: (data) => data.status === 'rejected',
      },
    },
    // Additional Info
    {
      name: 'replacementOrder',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Vervangingsbestelling',
      admin: {
        description: 'Nieuwe bestelling voor vervangend product (indien van toepassing)',
      },
    },
    {
      name: 'storeCreditAmount',
      type: 'number',
      defaultValue: 0,
      label: 'Tegoed bedrag (€)',
      admin: {
        step: 0.01,
        description: 'Bedrag toegevoegd als tegoed indien gekozen als oplossing',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Auto-calculate total return value from items
        if (data.items && Array.isArray(data.items)) {
          const total = data.items.reduce((sum: number, item: any) => {
            const itemValue = (item.unitPrice || 0) * (item.quantityReturning || 0)
            return sum + itemValue
          }, 0)
          data.returnValue = total
        }

        // Auto-set approval date when status changes to approved
        if (data.status === 'approved' && !data.approvalDate) {
          data.approvalDate = new Date().toISOString()
        }

        // Auto-set processed date when status is completed or refunded
        if (
          (data.status === 'completed' || data.status === 'refunded') &&
          !data.processedDate
        ) {
          data.processedDate = new Date().toISOString()
        }

        // Auto-set refund date when refund amount is entered and status is refunded
        if (data.refundAmount && data.refundAmount > 0 && data.status === 'refunded' && !data.refundDate) {
          data.refundDate = new Date().toISOString()
        }

        return data
      },
    ],
  },
}
