import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  labels: {
    singular: 'Offerte Aanvraag',
    plural: 'Offerte Aanvragen',
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    create: () => true, // Anyone can submit a quote request
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('construction'),
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'projectType', 'status', 'submittedAt'],
    group: 'Construction',
    description: 'Offerte aanvragen van de website',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Naam',
              admin: {
                description: 'Volledige naam van de aanvrager',
              },
            },
            {
              name: 'email',
              type: 'email',
              required: true,
              label: 'E-mail',
            },
            {
              name: 'phone',
              type: 'text',
              required: true,
              label: 'Telefoonnummer',
            },
            {
              name: 'address',
              type: 'text',
              label: 'Adres',
            },
            {
              name: 'postalCode',
              type: 'text',
              label: 'Postcode',
            },
            {
              name: 'city',
              type: 'text',
              label: 'Plaats',
            },
          ],
        },
        {
          label: 'Project',
          fields: [
            {
              name: 'projectType',
              type: 'select',
              required: true,
              label: 'Type project',
              options: [
                { label: 'Nieuwbouw', value: 'nieuwbouw' },
                { label: 'Renovatie', value: 'renovatie' },
                { label: 'Verduurzaming', value: 'verduurzaming' },
                { label: 'Aanbouw / Opbouw', value: 'aanbouw' },
                { label: 'Utiliteitsbouw', value: 'utiliteitsbouw' },
                { label: 'Herstelwerk', value: 'herstelwerk' },
              ],
            },
            {
              name: 'budget',
              type: 'select',
              label: 'Indicatief budget',
              options: [
                { label: '< €50.000', value: '< 50k' },
                { label: '€50.000 - €100.000', value: '50k-100k' },
                { label: '€100.000 - €250.000', value: '100k-250k' },
                { label: '€250.000 - €500.000', value: '250k-500k' },
                { label: '> €500.000', value: '> 500k' },
                { label: 'Weet ik nog niet', value: 'unknown' },
              ],
            },
            {
              name: 'timeline',
              type: 'select',
              label: 'Gewenste start',
              options: [
                { label: 'Zo snel mogelijk', value: 'asap' },
                { label: 'Binnen 3 maanden', value: '3months' },
                { label: 'Binnen 6 maanden', value: '6months' },
                { label: 'Dit jaar', value: 'thisyear' },
                { label: 'Volgend jaar', value: 'nextyear' },
                { label: 'Nog onbekend', value: 'unknown' },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Omschrijving',
              admin: {
                description: 'Beschrijf uw project zo gedetailleerd mogelijk',
                rows: 5,
              },
            },
            {
              name: 'attachments',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Bijlagen',
              admin: {
                description: 'Foto\'s, tekeningen, schetsen, etc.',
              },
            },
          ],
        },
        {
          label: 'Status',
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'new',
              label: 'Status',
              options: [
                { label: '🆕 Nieuw', value: 'new' },
                { label: '📞 Gecontacteerd', value: 'contacted' },
                { label: '📋 Offerte verstuurd', value: 'quoted' },
                { label: '✅ Opdracht gegund', value: 'won' },
                { label: '❌ Niet doorgegaan', value: 'lost' },
              ],
              admin: {
                description: 'Huidige status van de aanvraag',
              },
            },
            {
              name: 'assignedTo',
              type: 'relationship',
              relationTo: 'users',
              label: 'Toegewezen aan',
              admin: {
                description: 'Welke medewerker is verantwoordelijk?',
              },
            },
            {
              name: 'notes',
              type: 'textarea',
              label: 'Interne notities',
              admin: {
                description: 'Notities die niet naar de klant gaan',
                rows: 4,
              },
            },
          ],
        },
        {
          label: 'Timestamps',
          fields: [
            {
              name: 'submittedAt',
              type: 'date',
              required: true,
              defaultValue: () => new Date().toISOString(),
              label: 'Ingediend op',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                readOnly: true,
              },
            },
            {
              name: 'contactedAt',
              type: 'date',
              label: 'Gecontacteerd op',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'quotedAt',
              type: 'date',
              label: 'Offerte verstuurd op',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Auto-set submittedAt on creation
        if (operation === 'create' && !data.submittedAt) {
          data.submittedAt = new Date().toISOString()
        }

        // Auto-set contactedAt when status changes to 'contacted'
        if (data.status === 'contacted' && !data.contactedAt) {
          data.contactedAt = new Date().toISOString()
        }

        // Auto-set quotedAt when status changes to 'quoted'
        if (data.status === 'quoted' && !data.quotedAt) {
          data.quotedAt = new Date().toISOString()
        }

        return data
      },
    ],
  },
}

export default QuoteRequests
