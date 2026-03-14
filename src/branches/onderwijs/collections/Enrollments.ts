import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { enrollmentHook } from '@/branches/onderwijs/hooks/enrollmentHook'

/**
 * Enrollments Collection — Onderwijs Branch
 *
 * Inschrijvingen voor cursussen met betalingsstatus, voortgang en certificaten.
 * Gekoppeld aan users en courses.
 */
export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  labels: {
    singular: 'Inschrijving',
    plural: 'Inschrijvingen',
  },
  admin: {
    group: 'Onderwijs',
    useAsTitle: 'enrollmentNumber',
    defaultColumns: ['enrollmentNumber', 'user', 'course', 'enrollmentStatus', 'paymentStatus', 'progress'],
    hidden: shouldHideCollection(),
  },
  access: {
    read: ({ req: { user } }) => {
      if (checkRole(['admin', 'editor'], user)) return true
      // Users can read their own enrollments
      if (user) return { user: { equals: user.id } }
      return false
    },
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    afterChange: [enrollmentHook],
  },
  fields: [
    // ─── TABS ────────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ── TAB 1: Inschrijving ──
        {
          label: 'Inschrijving',
          fields: [
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              required: true,
              label: 'Gebruiker',
            },
            {
              name: 'course',
              type: 'relationship',
              relationTo: 'courses',
              required: true,
              label: 'Cursus',
            },
            {
              name: 'enrollmentNumber',
              type: 'text',
              required: true,
              unique: true,
              label: 'Inschrijfnummer',
              admin: {
                description: 'Automatisch gegenereerd (bijv. ENR-2026-12345)',
              },
            },
            {
              name: 'enrolledAt',
              type: 'date',
              label: 'Ingeschreven op',
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
            {
              name: 'enrollmentStatus',
              type: 'select',
              label: 'Status',
              defaultValue: 'pending',
              options: [
                { label: 'In afwachting', value: 'pending' },
                { label: 'Actief', value: 'active' },
                { label: 'Afgerond', value: 'completed' },
                { label: 'Terugbetaald', value: 'refunded' },
                { label: 'Verlopen', value: 'expired' },
              ],
              admin: { position: 'sidebar' },
            },
          ],
        },

        // ── TAB 2: Betaling ──
        {
          label: 'Betaling',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'paymentMethod',
                  type: 'select',
                  label: 'Betaalmethode',
                  options: [
                    { label: 'iDEAL', value: 'ideal' },
                    { label: 'Creditcard', value: 'creditcard' },
                    { label: 'PayPal', value: 'paypal' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'paymentStatus',
                  type: 'select',
                  label: 'Betalingsstatus',
                  defaultValue: 'pending',
                  options: [
                    { label: 'In afwachting', value: 'pending' },
                    { label: 'Voltooid', value: 'completed' },
                    { label: 'Mislukt', value: 'failed' },
                    { label: 'Terugbetaald', value: 'refunded' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'paymentId',
              type: 'text',
              label: 'Betaling ID',
              admin: {
                description: 'Extern betaling-referentienummer',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'amount',
                  type: 'number',
                  label: 'Bedrag (€)',
                  admin: {
                    width: '50%',
                    step: 0.01,
                  },
                },
                {
                  name: 'discount',
                  type: 'number',
                  label: 'Korting (€)',
                  admin: {
                    width: '50%',
                    step: 0.01,
                  },
                },
              ],
            },
          ],
        },

        // ── TAB 3: Voortgang ──
        {
          label: 'Voortgang',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'progress',
                  type: 'number',
                  label: 'Voortgang (%)',
                  min: 0,
                  max: 100,
                  defaultValue: 0,
                  admin: { width: '50%' },
                },
                {
                  name: 'completedLessons',
                  type: 'number',
                  label: 'Afgeronde lessen',
                  defaultValue: 0,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'lastAccessedAt',
                  type: 'date',
                  label: 'Laatst geopend',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayAndTime' },
                  },
                },
                {
                  name: 'completedAt',
                  type: 'date',
                  label: 'Afgerond op',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayAndTime' },
                  },
                },
              ],
            },
            {
              name: 'certificateIssued',
              type: 'checkbox',
              label: 'Certificaat uitgegeven',
              defaultValue: false,
            },
            {
              name: 'certificateUrl',
              type: 'text',
              label: 'Certificaat URL',
              admin: {
                condition: (_, siblingData) => siblingData?.certificateIssued,
                description: 'URL naar het certificaat PDF-bestand',
              },
            },
          ],
        },
      ],
    },
  ],
}
