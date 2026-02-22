import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

/**
 * Appointments Collection
 *
 * Patient appointment requests submitted via contact form
 */
export const Appointments: CollectionConfig = {
  slug: 'appointments',
  access: {
    read: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    create: () => true, // Anyone can submit an appointment request
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('hospitality'),
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'treatment', 'status', 'createdAt'],
    group: 'Hospitality',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          label: 'Voornaam',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          label: 'Achternaam',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'name',
      type: 'text',
      label: 'Volledige naam',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            return `${siblingData.firstName || ''} ${siblingData.lastName || ''}`.trim()
          },
        ],
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          required: true,
          label: 'Telefoon',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'E-mail',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'birthDate',
      type: 'date',
      label: 'Geboortedatum',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'insurance',
          type: 'select',
          label: 'Verzekeraar',
          options: [
            { label: 'Zilveren Kruis', value: 'zilveren-kruis' },
            { label: 'CZ', value: 'cz' },
            { label: 'VGZ', value: 'vgz' },
            { label: 'Menzis', value: 'menzis' },
            { label: 'ONVZ', value: 'onvz' },
            { label: 'DSW', value: 'dsw' },
            { label: 'a.s.r.', value: 'asr' },
            { label: 'Anders', value: 'other' },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'treatment',
          type: 'select',
          label: 'Gewenste behandeling',
          options: [
            { label: 'Weet ik nog niet', value: 'unknown' },
            { label: 'Manuele therapie', value: 'manuele-therapie' },
            { label: 'Sportfysiotherapie', value: 'sportfysiotherapie' },
            { label: 'Kinderfysiotherapie', value: 'kinderfysiotherapie' },
            { label: 'Psychosomatische fysio', value: 'psychosomatisch' },
            { label: 'Dry needling', value: 'dry-needling' },
            { label: 'Revalidatie', value: 'revalidatie' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'complaint',
      type: 'textarea',
      required: true,
      label: 'Klacht omschrijving',
      admin: {
        description: 'Beschrijf kort de klacht en het doel',
      },
    },
    {
      name: 'preferredTime',
      type: 'select',
      hasMany: true,
      label: 'Voorkeur moment',
      options: [
        { label: 'Ochtend (07:30-12:00)', value: 'morning' },
        { label: 'Middag (12:00-17:00)', value: 'afternoon' },
        { label: 'Avond (17:00-20:00)', value: 'evening' },
        { label: 'Zaterdag', value: 'saturday' },
      ],
    },
    {
      name: 'hasReferral',
      type: 'select',
      label: 'Heeft verwijsbrief?',
      options: [
        { label: 'Nee (niet nodig bij directe toegang)', value: 'no' },
        { label: 'Ja, van huisarts', value: 'gp' },
        { label: 'Ja, van specialist', value: 'specialist' },
      ],
      defaultValue: 'no',
    },
    {
      name: 'type',
      type: 'select',
      label: 'Type afspraak',
      options: [
        { label: 'Nieuwe patiënt', value: 'new' },
        { label: 'Vervolgafspraak', value: 'follow-up' },
        { label: 'Vraag stellen', value: 'question' },
      ],
      defaultValue: 'new',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Nieuw', value: 'new' },
        { label: 'Bevestigd', value: 'confirmed' },
        { label: 'Afgerond', value: 'completed' },
        { label: 'Geannuleerd', value: 'cancelled' },
      ],
      defaultValue: 'new',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Interne notities',
      admin: {
        description: 'Notities voor intern gebruik',
      },
    },
  ],
}
