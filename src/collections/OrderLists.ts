import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideOnPlatform } from '@/lib/shouldHideCollection'

export const OrderLists: CollectionConfig = {
  slug: 'orderLists',
  labels: {
    singular: 'Bestellijst',
    plural: 'Bestellijsten',
  },
  admin: {
    useAsTitle: 'name',
    group: 'E-commerce',
    defaultColumns: ['name', 'owner', 'itemCount', 'isDefault', 'updatedAt'],
    description: 'Opgeslagen bestellijsten voor snelle herbestellingen',
    hidden: shouldHideOnPlatform(),
  },
  access: {
    read: ({ req: { user } }) => {
      // Users can read their own lists, shared lists, or admins can read all
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        or: [
          {
            owner: {
              equals: user.id,
            },
          },
          {
            'shareWith.user': {
              equals: user.id,
            },
          },
        ],
      }
    },
    create: ({ req: { user } }) => {
      // Only logged-in users can create lists
      return !!user
    },
    update: ({ req: { user } }) => {
      // Users can update their own lists or shared lists (with canEdit), admins can update all
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        or: [
          {
            owner: {
              equals: user.id,
            },
          },
          {
            and: [
              {
                'shareWith.user': {
                  equals: user.id,
                },
              },
              {
                'shareWith.canEdit': {
                  equals: true,
                },
              },
            ],
          },
        ],
      }
    },
    delete: ({ req: { user } }) => {
      // Users can only delete their own lists, admins can delete all
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        owner: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Lijstnaam',
      admin: {
        description: 'Bijvoorbeeld: "Maandelijkse EHBO bestelling"',
      },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Icoon',
      defaultValue: 'clipboard-list',
      options: [
        { label: 'Clipboard (standaard)', value: 'clipboard-list' },
        { label: 'Repeat (herhaling)', value: 'repeat' },
        { label: 'Stethoscope (medisch)', value: 'stethoscope' },
        { label: 'Flask (lab)', value: 'flask-conical' },
        { label: 'Plus Circle (EHBO)', value: 'plus-circle' },
        { label: 'Building (gebouw)', value: 'building-2' },
        { label: 'Package (pakket)', value: 'package' },
      ],
      admin: {
        description: 'Icoon voor visuele identificatie',
      },
    },
    {
      name: 'color',
      type: 'select',
      label: 'Kleur',
      defaultValue: 'teal',
      options: [
        { label: 'Teal (standaard)', value: 'teal' },
        { label: 'Blue (blauw)', value: 'blue' },
        { label: 'Amber (oranje)', value: 'amber' },
        { label: 'Green (groen)', value: 'green' },
      ],
      admin: {
        description: 'Achtergrondkleur van het icoon',
      },
    },
    {
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
      label: 'Vastgepind',
      admin: {
        description: 'Vastgepinde lijsten worden bovenaan getoond',
      },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Eigenaar',
      admin: {
        position: 'sidebar',
        description: 'Gebruiker die deze lijst aangemaakt heeft',
      },
      hooks: {
        beforeValidate: [
          ({ req, value }) => {
            // Auto-assign current user if not set (for non-admins)
            if (!value && req.user && !req.user.roles?.includes('admin')) {
              return req.user.id
            }
            return value
          },
        ],
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      label: 'Standaard bestellijst',
      admin: {
        position: 'sidebar',
        description: 'Deze lijst wordt voorgeselecteerd bij quick order',
      },
    },
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
          name: 'defaultQuantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
          label: 'Standaard aantal',
          admin: {
            description: 'Hoeveel van dit product normaal besteld wordt',
          },
        },
        {
          name: 'notes',
          type: 'textarea',
          label: 'Notities',
          admin: {
            description: 'Persoonlijke notities over dit product',
            rows: 2,
          },
        },
      ],
    },
    {
      name: 'itemCount',
      type: 'number',
      label: 'Aantal producten',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automatisch berekend',
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            return siblingData.items?.length || 0
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschrijving',
      admin: {
        description: 'Optionele beschrijving van deze bestellijst',
        rows: 3,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notities',
      admin: {
        description: 'Notities bij deze lijst (bijv. instructies voor collega\'s, bestelmomenten)',
        rows: 4,
      },
    },
    {
      name: 'lastOrderedAt',
      type: 'date',
      label: 'Laatst besteld op',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Wordt automatisch bijgewerkt wanneer producten uit deze lijst worden besteld',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'shareWith',
      type: 'array',
      label: 'Delen met',
      admin: {
        description: 'Andere gebruikers die deze lijst mogen zien (optioneel)',
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          label: 'Gebruiker',
        },
        {
          name: 'canEdit',
          type: 'checkbox',
          defaultValue: false,
          label: 'Mag bewerken',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // If setting as default, unset other default lists for this user
        if (data.isDefault && data.owner && operation !== 'create') {
          try {
            const payload = req.payload
            await payload.update({
              collection: 'orderLists',
              where: {
                and: [
                  {
                    owner: {
                      equals: data.owner,
                    },
                  },
                  {
                    isDefault: {
                      equals: true,
                    },
                  },
                ],
              },
              data: {
                isDefault: false,
              },
            })
          } catch (error) {
            // Silently fail if error (no-op)
          }
        }
        return data
      },
    ],
  },
}
