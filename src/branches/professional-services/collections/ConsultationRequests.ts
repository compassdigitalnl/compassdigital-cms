import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { consultationRequestHook } from '@/branches/professional-services/hooks/consultationRequestHook'

export const ConsultationRequests: CollectionConfig = {
  slug: 'consultation-requests',
  labels: {
    singular: 'Adviesgesprek Aanvraag',
    plural: 'Adviesgesprek Aanvragen',
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    create: () => true, // Anyone can submit a consultation request
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('professional_services'),
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'projectType', 'status', 'submittedAt'],
    group: 'Zakelijke Dienstverlening',
    description: 'Adviesgesprek aanvragen van de website',
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
              name: 'company',
              type: 'text',
              label: 'Bedrijfsnaam',
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
              label: 'Type dienst',
              options: [
                { label: 'Accountancy', value: 'accountancy' },
                { label: 'Juridisch advies', value: 'juridisch' },
                { label: 'Vastgoed', value: 'vastgoed' },
                { label: 'Marketing', value: 'marketing' },
                { label: 'IT & Software', value: 'it' },
                { label: 'Consultancy', value: 'consultancy' },
                { label: 'HR & Personeel', value: 'hr' },
                { label: 'Anders', value: 'anders' },
              ],
            },
            {
              name: 'budget',
              type: 'select',
              label: 'Indicatief budget',
              options: [
                { label: '< \u20AC1.000/maand', value: '< 1k' },
                { label: '\u20AC1.000 - \u20AC2.500/maand', value: '1k-2.5k' },
                { label: '\u20AC2.500 - \u20AC5.000/maand', value: '2.5k-5k' },
                { label: '\u20AC5.000 - \u20AC10.000/maand', value: '5k-10k' },
                { label: '> \u20AC10.000/maand', value: '> 10k' },
                { label: 'Weet ik nog niet', value: 'unknown' },
              ],
            },
            {
              name: 'timeline',
              type: 'select',
              label: 'Gewenste start',
              options: [
                { label: 'Zo snel mogelijk', value: 'asap' },
                { label: 'Binnen 1 maand', value: '1month' },
                { label: 'Binnen 3 maanden', value: '3months' },
                { label: 'Dit kwartaal', value: 'thisquarter' },
                { label: 'Nog onbekend', value: 'unknown' },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Omschrijving',
              admin: {
                description: 'Beschrijf uw vraag of situatie zo gedetailleerd mogelijk',
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
                description: 'Relevante documenten, rapportages, etc.',
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
                { label: '\uD83C\uDD95 Nieuw', value: 'new' },
                { label: '\uD83D\uDCDE Gecontacteerd', value: 'contacted' },
                { label: '\uD83D\uDCCB Voorstel verstuurd', value: 'quoted' },
                { label: '\u2705 Opdracht gegund', value: 'won' },
                { label: '\u274C Niet doorgegaan', value: 'lost' },
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
              name: 'quotedAmount',
              type: 'number',
              label: 'Offertebedrag',
              admin: {
                description: 'Totaalbedrag van het voorstel (excl. BTW)',
                step: 0.01,
              },
            },
            {
              name: 'expiresAt',
              type: 'date',
              label: 'Voorstel geldig tot',
              admin: {
                description: 'Datum waarop het voorstel verloopt',
                date: {
                  pickerAppearance: 'dayOnly',
                },
              },
            },
            {
              name: 'followUpDate',
              type: 'date',
              label: 'Follow-up datum',
              admin: {
                description: 'Wanneer moet er opnieuw contact worden opgenomen?',
                date: {
                  pickerAppearance: 'dayOnly',
                },
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
              label: 'Voorstel verstuurd op',
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
    afterChange: [consultationRequestHook],
  },
}

export default ConsultationRequests
