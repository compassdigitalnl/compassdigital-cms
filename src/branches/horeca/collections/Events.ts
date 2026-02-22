import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { slugField } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

/**
 * Events Collection
 *
 * Restaurant events (live music, wine tastings, special dinners, etc.)
 */
export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    read: ({ req: { user } }) => {
      if (checkRole(['admin', 'editor'], user)) return true
      return {
        _status: { equals: 'published' },
      }
    },
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('horeca'),
    group: 'Horeca',
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventType', 'date', 'featured', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'events',
        })
        return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: (data) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'events',
      }),
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Evenement titel',
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      label: 'Type evenement',
      options: [
        { label: '🎵 Live muziek', value: 'live-music' },
        { label: '🍷 Wijnproeverij', value: 'wine-tasting' },
        { label: '👨‍🍳 Chef Table', value: 'chefs-table' },
        { label: '🎂 Privé dinner', value: 'private-dinner' },
        { label: '🎉 Feestdag special', value: 'holiday-special' },
        { label: '📚 Workshop/cursus', value: 'workshop' },
        { label: '🎭 Thema avond', value: 'themed-night' },
        { label: '🍺 Bier/Spirits proeverij', value: 'beer-spirits' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Korte beschrijving',
      maxLength: 160,
      admin: {
        description: 'Korte samenvatting voor overzichtspagina',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Volledige beschrijving',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Datum',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'Einddatum',
          admin: {
            description: 'Optioneel: voor meerdaagse events',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'text',
          label: 'Starttijd',
          defaultValue: '19:00',
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Duur',
          admin: {
            description: 'Bijv. 3 uur, hele avond',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          label: 'Prijs per persoon (€)',
          min: 0,
          admin: {
            description: 'Laat leeg indien gratis',
          },
        },
        {
          name: 'maxGuests',
          type: 'number',
          label: 'Max aantal gasten',
          admin: {
            description: 'Optioneel: maximaal aantal deelnemers',
          },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        description: 'Toon prominent op homepage',
      },
    },
    {
      name: 'bookingRequired',
      type: 'checkbox',
      label: 'Reservering verplicht',
      defaultValue: true,
    },
    {
      name: 'bookingUrl',
      type: 'text',
      label: 'Reserveringslink',
      admin: {
        description: 'Optioneel: externe reserveringslink',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Event foto',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Foto galerij',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        description: 'Extra foto\'s van eerdere edities',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Emoji/Icon',
      defaultValue: '🎉',
      admin: {
        description: 'Emoji voor dit event (bijv. 🎵, 🍷, 👨‍🍳)',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      admin: {
        description: 'Bijv. "romantisch", "families", "vegetarisch"',
      },
    },
    slugField(),
  ],
}
