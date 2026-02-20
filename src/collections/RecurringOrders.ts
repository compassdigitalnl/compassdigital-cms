import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const RecurringOrders: CollectionConfig = {
  slug: 'recurring-orders',
  labels: {
    singular: 'Herhaalbestelling',
    plural: 'Herhaalbestellingen',
  },
  admin: {
    useAsTitle: 'name',
    group: 'E-commerce',
    defaultColumns: ['name', 'customer', 'status', 'nextDeliveryDate', 'estimatedTotal'],
    description: 'Automatische herhaalbestellingen voor B2B klanten',
    hidden: ({ user }) => !checkRole(['admin'], user),
  },
  access: {
    read: ({ req: { user } }) => {
      // Admins can read all, users can only read their own recurring orders
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        customer: {
          equals: user.id,
        },
      }
    },
    create: () => true, // Users can create their own recurring orders
    update: ({ req: { user } }) => {
      // Users can update their own, admins can update all
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        customer: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      // Users can delete their own, admins can delete all
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        customer: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'referenceNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Referentienummer',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Automatisch gegenereerd (bijv. HR-001)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              // Generate reference number: HR-XXX
              const random = Math.floor(Math.random() * 999)
                .toString()
                .padStart(3, '0')
              return `HR-${random}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Naam',
      admin: {
        description: 'Beschrijvende naam voor deze herhaalbestelling (bijv. "Maandelijkse praktijkvoorraad")',
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
    // Status & Frequency
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Actief', value: 'active' },
        { label: 'Gepauzeerd', value: 'paused' },
        { label: 'Geannuleerd', value: 'cancelled' },
        { label: 'Verlopen', value: 'expired' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'frequency',
      type: 'group',
      label: 'Frequentie',
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
          defaultValue: 1,
          min: 1,
          label: 'Waarde',
          admin: {
            description: 'Hoeveelheid (bijv. "4" voor elke 4 weken)',
          },
        },
        {
          name: 'unit',
          type: 'select',
          required: true,
          defaultValue: 'weeks',
          label: 'Eenheid',
          options: [
            { label: 'Dagen', value: 'days' },
            { label: 'Weken', value: 'weeks' },
            { label: 'Maanden', value: 'months' },
          ],
        },
        {
          name: 'displayText',
          type: 'text',
          label: 'Weergavetekst',
          admin: {
            description: 'Optioneel: aangepaste weergavetekst (bijv. "Elke 4 weken"). Wordt automatisch gegenereerd indien leeg.',
            readOnly: true,
          },
          hooks: {
            beforeChange: [
              ({ siblingData }) => {
                if (!siblingData) return ''
                const value = siblingData.value || 1
                const unit = siblingData.unit || 'weeks'
                const unitLabels: { [key: string]: string } = {
                  days: value === 1 ? 'dag' : 'dagen',
                  weeks: value === 1 ? 'week' : 'weken',
                  months: value === 1 ? 'maand' : 'maanden',
                }
                return `Elke ${value} ${unitLabels[unit]}`
              },
            ],
          },
        },
      ],
    },
    // Delivery Dates
    {
      name: 'nextDeliveryDate',
      type: 'date',
      required: true,
      label: 'Volgende levering',
      admin: {
        description: 'Datum van de volgende automatische bestelling',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'lastDeliveryDate',
      type: 'date',
      label: 'Laatste levering',
      admin: {
        description: 'Datum van de meest recente automatische bestelling',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Startdatum',
      admin: {
        description: 'Datum waarop deze herhaalbestelling is aangemaakt',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Einddatum',
      admin: {
        description: 'Optioneel: automatisch stoppen na deze datum',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'pausedDate',
      type: 'date',
      label: 'Gepauzeerd sinds',
      admin: {
        description: 'Datum waarop deze herhaalbestelling is gepauzeerd',
        condition: (data) => data.status === 'paused',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    // Products
    {
      name: 'items',
      type: 'array',
      label: 'Producten',
      required: true,
      minRows: 1,
      admin: {
        description: 'Producten die automatisch besteld worden',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          label: 'Product',
        },
        // Product snapshots (for display if product is deleted)
        {
          name: 'title',
          type: 'text',
          label: 'Product Naam',
          admin: {
            description: 'Snapshot voor weergave indien product verwijderd wordt',
          },
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
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
          label: 'Aantal',
          admin: {
            description: 'Aantal per automatische levering',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          label: 'Prijs per stuk (€)',
          admin: {
            step: 0.01,
            description: 'Prijs op moment van toevoegen (kan wijzigen bij daadwerkelijke bestelling)',
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
                const price = siblingData.price || 0
                const quantity = siblingData.quantity || 0
                return price * quantity
              },
            ],
          },
        },
      ],
    },
    // Pricing & Statistics
    {
      name: 'estimatedTotal',
      type: 'number',
      required: true,
      label: 'Geschat bedrag per levering (€)',
      admin: {
        step: 0.01,
        readOnly: true,
        position: 'sidebar',
        description: 'Totaal bedrag per automatische bestelling (prijzen kunnen wijzigen)',
      },
    },
    {
      name: 'deliveryCount',
      type: 'number',
      defaultValue: 0,
      label: 'Aantal leveringen',
      admin: {
        description: 'Totaal aantal uitgevoerde automatische bestellingen',
        readOnly: true,
      },
    },
    {
      name: 'totalSpent',
      type: 'number',
      defaultValue: 0,
      label: 'Totaal besteed (€)',
      admin: {
        step: 0.01,
        description: 'Totaalbedrag van alle automatische bestellingen',
        readOnly: true,
      },
    },
    {
      name: 'savingsPerDelivery',
      type: 'number',
      defaultValue: 0,
      label: 'Besparing per levering (€)',
      admin: {
        step: 0.01,
        description: 'Geschatte besparing door volumekortingen (optioneel)',
      },
    },
    // Shipping & Preferences
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
      name: 'paymentMethod',
      type: 'select',
      label: 'Betaalmethode',
      options: [
        { label: 'iDEAL', value: 'ideal' },
        { label: 'Op rekening', value: 'invoice' },
        { label: 'Creditcard', value: 'creditcard' },
        { label: 'Incasso', value: 'direct_debit' },
      ],
      admin: {
        description: 'Standaard betaalmethode voor automatische bestellingen',
      },
    },
    // Generated Orders
    {
      name: 'generatedOrders',
      type: 'relationship',
      relationTo: 'orders',
      hasMany: true,
      label: 'Gegenereerde bestellingen',
      admin: {
        description: 'Alle automatisch aangemaakte bestellingen',
        readOnly: true,
      },
    },
    // Additional Info
    {
      name: 'notes',
      type: 'textarea',
      label: 'Opmerkingen',
      admin: {
        description: 'Extra informatie of speciale instructies',
      },
    },
    {
      name: 'notifyBeforeDelivery',
      type: 'checkbox',
      defaultValue: true,
      label: 'Herinnering sturen',
      admin: {
        description: 'E-mail notificatie versturen voor elke automatische bestelling',
      },
    },
    {
      name: 'notifyDaysBefore',
      type: 'number',
      defaultValue: 2,
      min: 0,
      max: 7,
      label: 'Herinneringsdagen',
      admin: {
        description: 'Aantal dagen voor levering waarop herinnering wordt verstuurd',
        condition: (data) => data.notifyBeforeDelivery === true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Auto-calculate estimated total from items
        if (data.items && Array.isArray(data.items)) {
          const total = data.items.reduce((sum: number, item: any) => {
            const itemTotal = (item.price || 0) * (item.quantity || 0)
            return sum + itemTotal
          }, 0)
          data.estimatedTotal = total
        }

        // Auto-set pausedDate when status changes to paused
        if (data.status === 'paused' && !data.pausedDate) {
          data.pausedDate = new Date().toISOString()
        }

        // Clear pausedDate when status is not paused
        if (data.status !== 'paused') {
          data.pausedDate = null
        }

        return data
      },
    ],
  },
}
