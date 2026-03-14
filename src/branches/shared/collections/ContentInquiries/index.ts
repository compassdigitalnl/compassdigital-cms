import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideContentCollection } from '@/lib/tenant/shouldHideCollection'
import { isCollectionEnabled } from '@/lib/tenant/isCollectionDisabled'
import { getCachedSiteBranch } from '@/lib/tenant/contentModules'
import { branchOptions } from '../ContentServices'

/**
 * Content Inquiries — Unified collection
 *
 * Vervangt: quotes (B2B), quote-requests (bouw), consultation-requests (dienstverlening)
 * Alle offertes en aanvragen in één collection.
 */
export const ContentInquiries: CollectionConfig = {
  slug: 'content-inquiries',
  labels: {
    singular: 'Aanvraag',
    plural: 'Aanvragen',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'branch', 'status', 'submittedAt'],
    hidden: shouldHideContentCollection('content-inquiries'),
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    create: () => true, // Public form submission
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          if (!data.branch) data.branch = getCachedSiteBranch()
          if (!data.submittedAt) data.submittedAt = new Date().toISOString()
          if (!data.inquiryNumber) data.inquiryNumber = `INQ-${Date.now().toString(36).toUpperCase()}`
        }
        return data
      },
    ],
  },
  fields: [
    // ─── SIDEBAR ───────────────────────────────────────────
    {
      name: 'inquiryNumber',
      type: 'text',
      label: 'Aanvraagnummer',
      admin: { position: 'sidebar', readOnly: true },
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
      name: 'type',
      type: 'select',
      required: true,
      label: 'Type',
      defaultValue: 'general',
      options: [
        { label: 'Offerte', value: 'quote' },
        { label: 'Consultatie', value: 'consultation' },
        { label: 'Algemeen', value: 'general' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'new',
      options: [
        { label: 'Nieuw', value: 'new' },
        { label: 'Gecontacteerd', value: 'contacted' },
        { label: 'Offerte verstuurd', value: 'quoted' },
        { label: 'Gewonnen', value: 'won' },
        { label: 'Verloren', value: 'lost' },
      ],
      admin: { position: 'sidebar' },
    },

    // ─── TABS ──────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ── TAB 1: Contact ──
        {
          label: 'Contact',
          fields: [
            { name: 'name', type: 'text', required: true, label: 'Naam' },
            { name: 'email', type: 'email', required: true, label: 'E-mail' },
            { name: 'phone', type: 'text', label: 'Telefoon' },
            { name: 'companyName', type: 'text', label: 'Bedrijfsnaam' },
            { name: 'address', type: 'text', label: 'Adres' },
            { name: 'postalCode', type: 'text', label: 'Postcode' },
            { name: 'city', type: 'text', label: 'Plaats' },
          ],
        },

        // ── TAB 2: Project ──
        {
          label: 'Project',
          fields: [
            {
              name: 'projectType',
              type: 'select',
              label: 'Project type',
              options: [
                { label: 'Nieuwbouw', value: 'new-build' },
                { label: 'Renovatie', value: 'renovation' },
                { label: 'Onderhoud', value: 'maintenance' },
                { label: 'Advies', value: 'consulting' },
                { label: 'Overig', value: 'other' },
              ],
            },
            {
              name: 'budget',
              type: 'select',
              label: 'Budget',
              options: [
                { label: 'Tot €5.000', value: 'under-5k' },
                { label: '€5.000 - €15.000', value: '5k-15k' },
                { label: '€15.000 - €50.000', value: '15k-50k' },
                { label: '€50.000 - €100.000', value: '50k-100k' },
                { label: 'Meer dan €100.000', value: 'over-100k' },
                { label: 'Nader te bepalen', value: 'tbd' },
              ],
            },
            {
              name: 'timeline',
              type: 'select',
              label: 'Gewenste planning',
              options: [
                { label: 'Zo snel mogelijk', value: 'asap' },
                { label: 'Binnen 1 maand', value: '1-month' },
                { label: 'Binnen 3 maanden', value: '3-months' },
                { label: 'Binnen 6 maanden', value: '6-months' },
                { label: 'Flexibel', value: 'flexible' },
              ],
            },
            { name: 'description', type: 'textarea', label: 'Omschrijving' },
            {
              name: 'attachments',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Bijlagen',
            },
          ],
        },

        // ── TAB 3: B2B Products (quote-specifiek) ──
        {
          label: 'Producten',
          fields: [
            {
              name: 'products',
              type: 'array',
              label: 'Producten',
              admin: {
                condition: (_, s) => s?.type === 'quote',
                description: 'Alleen voor B2B offertes',
              },
              fields: [
                { name: 'productName', type: 'text', required: true, label: 'Product' },
                { name: 'sku', type: 'text', label: 'SKU' },
                { name: 'quantity', type: 'number', required: true, label: 'Aantal' },
                { name: 'price', type: 'number', label: 'Prijs (€)', admin: { step: 0.01 } },
              ],
            },
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              label: 'Klant account',
              admin: { condition: (_, s) => s?.type === 'quote' },
            },
            ...(isCollectionEnabled('orders') ? [{
              name: 'convertedToOrder',
              type: 'relationship' as const,
              relationTo: 'orders' as const,
              label: 'Omgezet naar bestelling',
              admin: {
                condition: (_: any, s: any) => s?.type === 'quote',
              },
            }] : []),
          ],
        },

        // ── TAB 4: Opvolging ──
        {
          label: 'Opvolging',
          fields: [
            {
              name: 'assignedTo',
              type: 'relationship',
              relationTo: 'users',
              label: 'Toegewezen aan',
            },
            { name: 'quotedAmount', type: 'number', label: 'Offertebedrag (€)', admin: { step: 0.01 } },
            {
              name: 'expiresAt',
              type: 'date',
              label: 'Offerte geldig tot',
              admin: { date: { pickerAppearance: 'dayOnly' } },
            },
            {
              name: 'followUpDate',
              type: 'date',
              label: 'Follow-up datum',
              admin: { date: { pickerAppearance: 'dayOnly' } },
            },
            { name: 'notes', type: 'textarea', label: 'Interne notities' },
          ],
        },

        // ── TAB 5: Timestamps ──
        {
          label: 'Tijdstempels',
          fields: [
            { name: 'submittedAt', type: 'date', label: 'Ingediend op', admin: { readOnly: true } },
            { name: 'contactedAt', type: 'date', label: 'Gecontacteerd op' },
            { name: 'quotedAt', type: 'date', label: 'Offerte verstuurd op' },
          ],
        },
      ],
    },
  ],
}
