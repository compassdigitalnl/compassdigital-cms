import type { CollectionConfig } from 'payload'

/**
 * Customer Groups Collection
 * Define pricing tiers and permissions for B2B/B2C customers
 */
export const CustomerGroups: CollectionConfig = {
  slug: 'customer-groups',
  labels: {
    singular: 'Klantengroep',
    plural: 'Klantengroepen',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'discount', 'priority', 'customerCount'],
    group: 'Accounts',
    description: 'Groepen voor pricing en permissions',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Groepsnaam',
      maxLength: 50,
      admin: {
        description: 'Bijvoorbeeld: "Hospital", "Clinic", "Retail"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschrijving',
      maxLength: 200,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'b2c',
          options: [
            { label: 'B2C (Consument)', value: 'b2c' },
            { label: 'B2B (Zakelijk)', value: 'b2b' },
          ],
          admin: {
            width: '33%',
          },
        },
        {
          name: 'discount',
          type: 'number',
          required: true,
          defaultValue: 0,
          min: 0,
          max: 100,
          label: 'Korting (%)',
          admin: {
            width: '33%',
            description: 'Percentage korting op basisprijs',
          },
        },
        {
          name: 'priority',
          type: 'number',
          required: true,
          defaultValue: 50,
          min: 1,
          max: 100,
          label: 'Prioriteit',
          admin: {
            width: '34%',
            description: 'Hogere prioriteit = belangrijker (1-100)',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Pricing Rules',
      fields: [
        {
          name: 'minOrderAmount',
          type: 'number',
          label: 'Minimum Bestelbedrag',
          min: 0,
          admin: {
            description: 'Minimaal bestelbedrag voor deze groep',
          },
        },
        {
          name: 'maxOrderAmount',
          type: 'number',
          label: 'Maximum Bestelbedrag',
          min: 0,
          admin: {
            description: 'Maximaal bestelbedrag (optioneel)',
          },
        },
        {
          name: 'taxExempt',
          type: 'checkbox',
          defaultValue: false,
          label: 'BTW Vrijgesteld',
          admin: {
            description: 'Klanten in deze groep betalen geen BTW',
          },
        },
        {
          name: 'hidePrice',
          type: 'checkbox',
          defaultValue: false,
          label: 'Verberg Prijzen',
          admin: {
            description: 'Toon "Login voor prijzen" (B2B)',
          },
        },
        {
          name: 'requireApproval',
          type: 'checkbox',
          defaultValue: false,
          label: 'Goedkeuring Vereist',
          admin: {
            description: 'Orders vereisen admin goedkeuring',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Validity Period',
      fields: [
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
          label: 'Standaard Groep',
          admin: {
            description: 'Automatisch toegewezen aan nieuwe klanten',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'validFrom',
              type: 'date',
              label: 'Geldig Vanaf',
              admin: {
                width: '50%',
                date: {
                  displayFormat: 'dd-MM-yyyy',
                },
              },
            },
            {
              name: 'validUntil',
              type: 'date',
              label: 'Geldig Tot',
              admin: {
                width: '50%',
                date: {
                  displayFormat: 'dd-MM-yyyy',
                },
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Permissions',
      fields: [
        {
          name: 'canViewCatalog',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mag Catalogus Bekijken',
        },
        {
          name: 'canPlaceOrders',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mag Bestellingen Plaatsen',
        },
        {
          name: 'canRequestQuotes',
          type: 'checkbox',
          defaultValue: false,
          label: 'Mag Offertes Aanvragen',
        },
        {
          name: 'canDownloadInvoices',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mag Facturen Downloaden',
        },
        {
          name: 'canViewOrderHistory',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mag Bestelgeschiedenis Bekijken',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Statistics',
      fields: [
        {
          name: 'customerCount',
          type: 'number',
          defaultValue: 0,
          label: 'Aantal Klanten',
          admin: {
            readOnly: true,
            description: 'Automatisch bijgewerkt',
          },
        },
        {
          name: 'totalRevenue',
          type: 'number',
          defaultValue: 0,
          label: 'Totale Omzet',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'averageOrderValue',
          type: 'number',
          defaultValue: 0,
          label: 'Gemiddelde Bestelwaarde',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
  timestamps: true,
}
