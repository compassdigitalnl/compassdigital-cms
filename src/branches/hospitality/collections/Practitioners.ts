import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { slugField } from 'payload'

/**
 * Practitioners Collection
 *
 * Healthcare practitioners/staff (physiotherapists, specialists, etc.)
 */
export const Practitioners: CollectionConfig = {
  slug: 'practitioners',
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
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'specializations', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Naam',
      admin: {
        description: 'Bijv: drs. Sander Vos, Lisa Hendriks MSc',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profiel',
          fields: [
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              label: 'Profielfoto',
            },
            {
              name: 'emoji',
              type: 'text',
              label: 'Avatar emoji',
              admin: {
                description: 'Emoji als fallback, bijv: 👨‍⚕️ 👩‍⚕️',
              },
            },
            {
              name: 'initials',
              type: 'text',
              label: 'Initialen',
              admin: {
                description: 'Voor badge display, bijv: SV, LH',
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Functie',
              admin: {
                description: 'Bijv: Manueel therapeut, Sportfysiotherapeut',
              },
            },
            {
              name: 'role',
              type: 'select',
              label: 'Rol',
              options: [
                { label: 'Praktijkhouder', value: 'owner' },
                { label: 'Fysiotherapeut', value: 'physio' },
                { label: 'Manueel therapeut', value: 'manual' },
                { label: 'Specialist', value: 'specialist' },
              ],
            },
            {
              name: 'specializations',
              type: 'array',
              label: 'Specialisaties',
              fields: [
                {
                  name: 'specialization',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Bijv: Rug- en nekklachten, Sportblessures',
                  },
                },
              ],
            },
            {
              name: 'bio',
              type: 'richText',
              label: 'Biografie',
            },
            {
              name: 'qualifications',
              type: 'array',
              label: 'Kwalificaties & opleidingen',
              fields: [
                {
                  name: 'qualification',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'year',
                  type: 'number',
                  label: 'Jaar',
                },
              ],
            },
          ],
        },
        {
          label: 'Beschikbaarheid',
          fields: [
            {
              name: 'availability',
              type: 'select',
              label: 'Beschikbaarheid status',
              options: [
                { label: 'Beschikbaar', value: 'available' },
                { label: 'Beperkt beschikbaar', value: 'limited' },
                { label: 'Niet beschikbaar', value: 'unavailable' },
              ],
              defaultValue: 'available',
            },
            {
              name: 'workDays',
              type: 'select',
              hasMany: true,
              label: 'Werkdagen',
              options: [
                { label: 'Maandag', value: 'monday' },
                { label: 'Dinsdag', value: 'tuesday' },
                { label: 'Woensdag', value: 'wednesday' },
                { label: 'Donderdag', value: 'thursday' },
                { label: 'Vrijdag', value: 'friday' },
                { label: 'Zaterdag', value: 'saturday' },
                { label: 'Zondag', value: 'sunday' },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'email',
              type: 'email',
              label: 'E-mail',
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Telefoon',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            slugField(),
          ],
        },
      ],
    },
    {
      name: 'treatments',
      type: 'relationship',
      relationTo: 'treatments',
      hasMany: true,
      label: 'Behandelingen',
      admin: {
        description: 'Welke behandelingen biedt deze behandelaar aan?',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publicatiedatum',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
