/**
 * Email Segments Collection
 *
 * Advanced subscriber segmentation based on RFM scores,
 * order history, churn risk, and other customer metrics.
 * Supports visual segment builder and Listmonk sync.
 */

import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures } from '@/lib/tenant/features'
import { isAdmin, isSuperAdmin, isAdminOrEditor } from '@/access/utilities'

export const EmailSegments: CollectionConfig = {
  slug: 'email-segments',
  admin: {
    hidden: !emailMarketingFeatures.isEnabled(),
    group: 'E-mail Marketing',
    useAsTitle: 'title',
    defaultColumns: ['title', 'subscriberCount', 'status', 'lastCalculatedAt', 'updatedAt'],
    description: 'Segmenteer abonnees op basis van gedrag, RFM-scores en klantgegevens',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || isAdmin(user) || isAdminOrEditor(user)
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || isAdminOrEditor(user)
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || isAdminOrEditor(user)
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || isAdmin(user)
    },
  },
  fields: [
    // ═══════════════════════════════════════════════════════════
    // BASIC FIELDS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Segment naam',
      admin: {
        description: 'Naam van het segment (bijv. "VIP Klanten", "Churning Abonnees")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'Unieke technische naam (automatisch gegenereerd)',
      },
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Omschrijving',
      admin: {
        description: 'Beschrijf het doel van dit segment',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // SEGMENT CONDITIONS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'conditions',
      type: 'json',
      required: true,
      label: 'Voorwaarden',
      admin: {
        description: 'Segmentatieregels (JSON definitie van groepen en voorwaarden)',
      },
    },
    {
      name: 'conditionLogic',
      type: 'select',
      defaultValue: 'and',
      label: 'Logica tussen groepen',
      options: [
        { label: 'Alle groepen (EN)', value: 'and' },
        { label: 'Eén van de groepen (OF)', value: 'or' },
      ],
      admin: {
        description: 'Hoe worden de groepen gecombineerd?',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // COMPUTED / READ-ONLY FIELDS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'subscriberCount',
      type: 'number',
      defaultValue: 0,
      label: 'Aantal abonnees',
      admin: {
        description: 'Aantal abonnees dat aan de voorwaarden voldoet',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'lastCalculatedAt',
      type: 'date',
      label: 'Laatst berekend',
      admin: {
        description: 'Wanneer is het aantal abonnees voor het laatst berekend?',
        readOnly: true,
        position: 'sidebar',
        date: {
          displayFormat: 'yyyy-MM-dd HH:mm',
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // SYNC & AUTOMATION
    // ═══════════════════════════════════════════════════════════
    {
      name: 'autoSync',
      type: 'checkbox',
      defaultValue: false,
      label: 'Automatisch synchroniseren',
      admin: {
        description: 'Synchroniseer dit segment automatisch met Listmonk als lijst',
        position: 'sidebar',
      },
    },
    {
      name: 'listmonkListId',
      type: 'number',
      label: 'Listmonk Lijst ID',
      admin: {
        description: 'Gekoppelde Listmonk lijst (auto-synced)',
        readOnly: true,
        position: 'sidebar',
        condition: () => false,
      },
    },

    // ═══════════════════════════════════════════════════════════
    // STATUS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Actief', value: 'active' },
        { label: 'Gearchiveerd', value: 'archived' },
      ],
      admin: {
        description: 'Status van het segment',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from title if not set
        if (data?.title && !data?.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }

        // Trim title
        if (data?.title) {
          data.title = data.title.trim()
        }

        return data
      },
    ],
  },
  timestamps: true,
}
