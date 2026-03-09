import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

/**
 * Discount Codes Collection
 *
 * Kortingscodes voor e-commerce:
 * - Percentage korting
 * - Vast bedrag korting
 * - Gratis verzending
 * Met optionele beperkingen (min. bestelbedrag, max gebruik, geldigheid)
 */
export const DiscountCodes: CollectionConfig = {
  slug: 'discount-codes',
  labels: {
    singular: 'Kortingscode',
    plural: 'Kortingscodes',
  },
  admin: {
    group: 'Bestellingen',
    hidden: shouldHideCollection('discounts'),
    useAsTitle: 'code',
    defaultColumns: ['code', 'type', 'value', 'status', 'usedCount', 'validUntil'],
    description: 'Beheer kortingscodes voor promoties en acties',
  },
  access: {
    read: ({ req }) => checkRole(['admin', 'editor'], req.user) || false,
    create: ({ req }) => checkRole(['admin'], req.user) || false,
    update: ({ req }) => checkRole(['admin'], req.user) || false,
    delete: ({ req }) => checkRole(['admin'], req.user) || false,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-uppercase and trim the code
        if (data?.code) {
          data.code = data.code.toUpperCase().trim()
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        placeholder: 'bijv. WINTER25',
        description: 'Unieke kortingscode (wordt automatisch omgezet naar hoofdletters)',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'percentage',
          options: [
            { label: 'Percentage', value: 'percentage' },
            { label: 'Vast bedrag', value: 'fixed-amount' },
            { label: 'Gratis verzending', value: 'free-shipping' },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'value',
          type: 'number',
          required: true,
          defaultValue: 0,
          admin: {
            width: '50%',
            description: 'Percentage (bijv. 25) of bedrag in euro\'s (bijv. 10.00)',
          },
        },
      ],
    },
    {
      name: 'minOrderAmount',
      type: 'number',
      admin: {
        description: 'Minimale bestelwaarde om de code te gebruiken (optioneel)',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'maxUses',
          type: 'number',
          admin: {
            width: '50%',
            description: 'Maximaal aantal keer te gebruiken (leeg = onbeperkt)',
          },
        },
        {
          name: 'usedCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            width: '50%',
            readOnly: true,
            description: 'Aantal keer gebruikt',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'validFrom',
          type: 'date',
          admin: {
            width: '50%',
            description: 'Geldig vanaf (optioneel)',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd-MM-yyyy',
            },
          },
        },
        {
          name: 'validUntil',
          type: 'date',
          admin: {
            width: '50%',
            description: 'Geldig tot (optioneel)',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd-MM-yyyy',
            },
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Actief', value: 'active' },
        { label: 'Verlopen', value: 'expired' },
        { label: 'Uitgeschakeld', value: 'disabled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Interne notitie (niet zichtbaar voor klanten)',
      },
    },
  ],
}
