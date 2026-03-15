import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

/**
 * VendorApplications Collection (Marketplace)
 *
 * Incoming vendor/supplier applications.
 * Public create access for the partner registration form.
 * Admin-only read/update/delete.
 */
export const VendorApplications: CollectionConfig = {
  slug: 'vendor-applications',
  labels: {
    singular: 'Leverancier Aanvraag',
    plural: 'Leverancier Aanvragen',
  },
  admin: {
    useAsTitle: 'companyName',
    group: 'Marktplaats',
    defaultColumns: ['companyName', 'contactPerson', 'email', 'status', 'submittedAt'],
    description: 'Aanvragen van potentiële leveranciers',
    hidden: shouldHideCollection('vendors'),
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin'], user),
    create: () => true, // Public — anyone can submit
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'companyName',
          type: 'text',
          required: true,
          label: 'Bedrijfsnaam',
          admin: { width: '50%' },
        },
        {
          name: 'contactPerson',
          type: 'text',
          required: true,
          label: 'Contactpersoon',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          label: 'E-mailadres',
          admin: { width: '50%' },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefoonnummer',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Beschrijving bedrijf',
      admin: {
        rows: 5,
        description: 'Korte beschrijving van het bedrijf en productaanbod',
      },
    },
    {
      name: 'productCategories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      label: 'Productcategorieën',
      admin: {
        description: 'In welke categorieën levert dit bedrijf?',
      },
    },
    {
      name: 'estimatedProducts',
      type: 'select',
      label: 'Geschat aantal producten',
      options: [
        { label: '1 – 50', value: '1-50' },
        { label: '51 – 200', value: '51-200' },
        { label: '201 – 500', value: '201-500' },
        { label: '500+', value: '500+' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'In afwachting', value: 'pending' },
        { label: 'In behandeling', value: 'under-review' },
        { label: 'Goedgekeurd', value: 'approved' },
        { label: 'Afgewezen', value: 'rejected' },
      ],
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Interne notities',
      admin: {
        description: 'Niet zichtbaar voor de aanvrager',
        rows: 4,
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      label: 'Ingediend op',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
  ],
}

export default VendorApplications
