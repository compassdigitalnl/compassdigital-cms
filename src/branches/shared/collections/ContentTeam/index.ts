import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { getCachedSiteBranch } from '@/lib/tenant/contentModules'
import { branchOptions } from '../ContentServices'

const workDayOptions = [
  { label: 'Maandag', value: 'monday' },
  { label: 'Dinsdag', value: 'tuesday' },
  { label: 'Woensdag', value: 'wednesday' },
  { label: 'Donderdag', value: 'thursday' },
  { label: 'Vrijdag', value: 'friday' },
  { label: 'Zaterdag', value: 'saturday' },
  { label: 'Zondag', value: 'sunday' },
]

/**
 * Content Team — Unified collection
 *
 * Vervangt: stylists, practitioners
 * Alle medewerkers/teamleden in één collection.
 */
export const ContentTeam: CollectionConfig = {
  slug: 'content-team',
  labels: {
    singular: 'Teamlid',
    plural: 'Team',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'branch', 'role', 'availability', 'bookable'],
    hidden: shouldHideCollection(),
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.branch) {
          data.branch = getCachedSiteBranch()
        }
        return data
      },
    ],
  },
  fields: [
    // ─── TOP FIELDS ────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Naam',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'Slug',
      admin: { position: 'sidebar' },
    },
    {
      name: 'branch',
      type: 'select',
      required: true,
      label: 'Branche',
      options: branchOptions,
      defaultValue: () => getCachedSiteBranch(),
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'published',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Gepubliceerd', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },

    // ─── TABS ──────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ── TAB 1: Profiel ──
        {
          label: 'Profiel',
          fields: [
            { name: 'role', type: 'text', required: true, label: 'Functie' },
            { name: 'avatar', type: 'upload', relationTo: 'media', label: 'Foto' },
            { name: 'initials', type: 'text', label: 'Initialen', maxLength: 3 },
            { name: 'bio', type: 'richText', label: 'Biografie' },
            { name: 'experience', type: 'number', label: 'Jaren ervaring' },
          ],
        },

        // ── TAB 2: Specialisaties ──
        {
          label: 'Specialisaties',
          fields: [
            {
              name: 'specialties',
              type: 'array',
              label: 'Specialisaties',
              fields: [
                { name: 'specialty', type: 'text', required: true, label: 'Specialisatie' },
              ],
            },
            {
              name: 'qualifications',
              type: 'array',
              label: 'Kwalificaties & Certificaten',
              fields: [
                { name: 'name', type: 'text', required: true, label: 'Naam' },
                { name: 'year', type: 'number', label: 'Jaar' },
                { name: 'institution', type: 'text', label: 'Instituut' },
              ],
            },
            {
              name: 'services',
              type: 'relationship',
              relationTo: 'content-services',
              hasMany: true,
              label: 'Diensten',
            },
          ],
        },

        // ── TAB 3: Beschikbaarheid ──
        {
          label: 'Beschikbaarheid',
          fields: [
            {
              name: 'availability',
              type: 'select',
              label: 'Beschikbaarheid',
              options: [
                { label: 'Beschikbaar', value: 'available' },
                { label: 'Beperkt beschikbaar', value: 'limited' },
                { label: 'Volgeboekt', value: 'booked' },
                { label: 'Niet beschikbaar', value: 'unavailable' },
              ],
            },
            {
              name: 'workDays',
              type: 'select',
              hasMany: true,
              label: 'Werkdagen',
              options: workDayOptions,
            },
            {
              name: 'bookable',
              type: 'checkbox',
              label: 'Online boekbaar',
              defaultValue: false,
            },
          ],
        },

        // ── TAB 4: Contact ──
        {
          label: 'Contact',
          fields: [
            { name: 'email', type: 'email', label: 'E-mail' },
            { name: 'phone', type: 'text', label: 'Telefoon' },
          ],
        },
      ],
    },
  ],
}
