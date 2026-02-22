import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { slugField } from 'payload'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

/**
 * Stylists Collection
 *
 * Stylists, beauticians, and wellness specialists
 */
export const Stylists: CollectionConfig = {
  slug: 'stylists',
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
    hidden: shouldHideCollection('beauty'),
    group: 'Beauty',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'specialties', 'availability', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Naam',
      admin: {
        description: 'Bijv: Lisa van der Berg, Tom Jansen',
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
                description: 'Emoji als fallback, bijv: 💇‍♀️ 💅',
              },
            },
            {
              name: 'initials',
              type: 'text',
              label: 'Initialen',
              admin: {
                description: 'Voor avatar display, bijv: LB, TJ',
              },
            },
            {
              name: 'role',
              type: 'select',
              label: 'Rol',
              required: true,
              options: [
                { label: 'Stylist', value: 'stylist' },
                { label: 'Color Specialist', value: 'color-specialist' },
                { label: 'Beauty Specialist', value: 'beauty-specialist' },
                { label: 'Nail Artist', value: 'nail-artist' },
                { label: 'Massage Therapeut', value: 'massage-therapist' },
                { label: 'Bridal Specialist', value: 'bridal-specialist' },
                { label: 'Salon Owner', value: 'owner' },
              ],
            },
            {
              name: 'specialties',
              type: 'array',
              label: 'Specialisaties',
              fields: [
                {
                  name: 'specialty',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Bijv: Balayage, Facial behandelingen, Gel nagels',
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
              name: 'experience',
              type: 'number',
              label: 'Jaren ervaring',
            },
            {
              name: 'certifications',
              type: 'array',
              label: 'Certificaten & opleidingen',
              fields: [
                {
                  name: 'certification',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'year',
                  type: 'number',
                  label: 'Jaar',
                },
                {
                  name: 'institution',
                  type: 'text',
                  label: 'Instelling',
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
                { label: 'Vol geboekt', value: 'booked' },
                { label: 'Afwezig', value: 'unavailable' },
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
            {
              type: 'row',
              fields: [
                {
                  name: 'startTime',
                  type: 'text',
                  label: 'Start tijd',
                  admin: {
                    width: '50%',
                    description: 'Bijv: 09:00',
                  },
                },
                {
                  name: 'endTime',
                  type: 'text',
                  label: 'Eind tijd',
                  admin: {
                    width: '50%',
                    description: 'Bijv: 21:00',
                  },
                },
              ],
            },
            {
              name: 'bookable',
              type: 'checkbox',
              label: 'Online boekbaar',
              defaultValue: true,
              admin: {
                description: 'Kunnen klanten deze stylist online boeken?',
              },
            },
          ],
        },
        {
          label: 'Contact & Social',
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
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram',
              admin: {
                description: 'Bijv: @lisavanderberg',
              },
            },
            {
              name: 'portfolio',
              type: 'array',
              label: 'Portfolio foto\'s',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Bijschrift',
                },
              ],
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
      name: 'services',
      type: 'relationship',
      relationTo: 'beautyServices',
      hasMany: true,
      label: 'Behandelingen',
      admin: {
        description: 'Welke behandelingen kan deze stylist uitvoeren?',
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
