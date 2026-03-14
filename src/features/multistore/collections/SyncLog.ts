/**
 * SyncLog Collection
 *
 * Audit trail for all multistore sync operations.
 * Logs every product push, order import, inventory update, etc.
 *
 * Only visible when ENABLE_MULTISTORE_HUB=true.
 */

import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

export const SyncLog: CollectionConfig = {
  slug: 'multistore-sync-log',
  labels: {
    singular: 'Sync Log',
    plural: 'Sync Logs',
  },
  admin: {
    useAsTitle: 'summary',
    group: 'Multistore',
    defaultColumns: ['summary', 'site', 'entityType', 'operation', 'status', 'duration', 'createdAt'],
    description: 'Audit trail van alle synchronisatie-acties',
    hidden: shouldHideCollection('multistoreHub'),
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin'], user),
    create: () => true, // Created by the system
    update: () => false, // Immutable
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // ─── Summary (auto-generated) ─────────────────────────
    {
      name: 'summary',
      type: 'text',
      label: 'Samenvatting',
      admin: {
        readOnly: true,
        description: 'Automatisch gegenereerd',
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const direction = siblingData.direction === 'hub-to-child' ? 'Hub → Child' : 'Child → Hub'
            const entity = siblingData.entityType || 'unknown'
            const op = siblingData.operation || 'unknown'
            return `${direction} | ${entity} ${op}`
          },
        ],
      },
    },

    // ─── Core Fields ──────────────────────────────────────
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'multistore-sites' as any,
      required: true,
      label: 'Webshop',
      admin: {
        description: 'De webshop waar deze actie betrekking op heeft',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'direction',
          type: 'select',
          required: true,
          label: 'Richting',
          options: [
            { label: 'Hub → Child', value: 'hub-to-child' },
            { label: 'Child → Hub', value: 'child-to-hub' },
          ],
        },
        {
          name: 'entityType',
          type: 'select',
          required: true,
          label: 'Type',
          options: [
            { label: 'Product', value: 'product' },
            { label: 'Bestelling', value: 'order' },
            { label: 'Voorraad', value: 'inventory' },
            { label: 'Fulfillment', value: 'fulfillment' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'entityId',
          type: 'text',
          label: 'Entity ID',
          admin: {
            description: 'ID van het product, bestelling, etc.',
          },
        },
        {
          name: 'operation',
          type: 'select',
          required: true,
          label: 'Operatie',
          options: [
            { label: 'Aanmaken', value: 'create' },
            { label: 'Bijwerken', value: 'update' },
            { label: 'Verwijderen', value: 'delete' },
          ],
        },
      ],
    },

    // ─── Result ───────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          label: 'Status',
          options: [
            { label: 'Succes', value: 'success' },
            { label: 'Mislukt', value: 'failed' },
            { label: 'Overgeslagen', value: 'skipped' },
          ],
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'duration',
          type: 'number',
          label: 'Duur (ms)',
          admin: {
            readOnly: true,
            description: 'Uitvoertijd in milliseconden',
          },
        },
      ],
    },
    {
      name: 'error',
      type: 'textarea',
      label: 'Foutmelding',
      admin: {
        condition: (data) => data?.status === 'failed',
        description: 'Details van de fout',
      },
    },

    // ─── Debug Data (collapsed) ───────────────────────────
    {
      type: 'collapsible',
      label: 'Debug Data',
      admin: {
        initCollapsed: true,
        description: 'Request/response data voor debugging',
      },
      fields: [
        {
          name: 'requestPayload',
          type: 'json',
          label: 'Request Payload',
          admin: { readOnly: true },
        },
        {
          name: 'responsePayload',
          type: 'json',
          label: 'Response Payload',
          admin: { readOnly: true },
        },
      ],
    },
  ],
  timestamps: true,
}

export default SyncLog
