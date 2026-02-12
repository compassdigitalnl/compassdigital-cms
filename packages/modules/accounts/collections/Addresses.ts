import type { CollectionConfig } from 'payload'

/**
 * Addresses Collection
 * Billing and shipping addresses for customers
 */
export const Addresses: CollectionConfig = {
  slug: 'addresses',
  labels: {
    singular: 'Adres',
    plural: 'Adressen',
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'customer', 'type', 'city', 'country'],
    group: 'Accounts',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // Customers can only read their own addresses
      return {
        customer: {
          equals: user.id,
        },
      }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        customer: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
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
      required: true,
      label: 'Klant',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Label',
      admin: {
        description: 'Bijvoorbeeld: "Thuis", "Werk", "Magazijn"',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'both',
      options: [
        { label: 'Factuuradres', value: 'billing' },
        { label: 'Verzendadres', value: 'shipping' },
        { label: 'Beide', value: 'both' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Adresgegevens',
      fields: [
        {
          name: 'company',
          type: 'text',
          label: 'Bedrijfsnaam',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'firstName',
              type: 'text',
              required: true,
              label: 'Voornaam',
              admin: { width: '50%' },
            },
            {
              name: 'lastName',
              type: 'text',
              required: true,
              label: 'Achternaam',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'street',
          type: 'text',
          required: true,
          label: 'Straat',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'houseNumber',
              type: 'text',
              required: true,
              label: 'Huisnummer',
              admin: { width: '25%' },
            },
            {
              name: 'addition',
              type: 'text',
              label: 'Toevoeging',
              admin: { width: '25%' },
            },
            {
              name: 'postalCode',
              type: 'text',
              required: true,
              label: 'Postcode',
              admin: { width: '25%' },
            },
            {
              name: 'city',
              type: 'text',
              required: true,
              label: 'Plaats',
              admin: { width: '25%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'state',
              type: 'text',
              label: 'Provincie/Staat',
              admin: { width: '50%' },
            },
            {
              name: 'country',
              type: 'select',
              required: true,
              defaultValue: 'NL',
              label: 'Land',
              options: [
                { label: 'Nederland', value: 'NL' },
                { label: 'België', value: 'BE' },
                { label: 'Duitsland', value: 'DE' },
                { label: 'Frankrijk', value: 'FR' },
                { label: 'Verenigd Koninkrijk', value: 'GB' },
                { label: 'Verenigde Staten', value: 'US' },
                { label: 'Overig', value: 'OTHER' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefoonnummer',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Delivery Instructions',
      fields: [
        {
          name: 'deliveryInstructions',
          type: 'textarea',
          label: 'Bezorgnotities',
          admin: {
            description: 'Speciale instructies voor bezorging',
          },
        },
        {
          name: 'accessCode',
          type: 'text',
          label: 'Toegangscode',
        },
        {
          name: 'businessHours',
          type: 'text',
          label: 'Openingstijden',
          admin: {
            description: 'Voor zakelijke adressen',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
          label: 'Standaard Adres',
          admin: { width: '33%' },
        },
        {
          name: 'isValidated',
          type: 'checkbox',
          defaultValue: false,
          label: 'Gevalideerd',
          admin: {
            width: '33%',
            description: 'Adres is gecontroleerd',
          },
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
          label: 'Actief',
          admin: { width: '34%' },
        },
      ],
    },
  ],
  timestamps: true,
}
