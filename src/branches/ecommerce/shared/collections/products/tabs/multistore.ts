/**
 * Multistore Tab for Products
 *
 * Hub variant: distributedTo array (sites, sync status, price overrides)
 * Child variant: hub product ID, sync status, sync source
 *
 * Feature-gated: only visible when multistoreHub or multistoreChild is enabled.
 */

import type { Tab } from 'payload'
import { featureTab } from '@/lib/tenant/featureFields'

// ═══════════════════════════════════════════════════════════
// HUB TAB — visible on the Hub site
// ═══════════════════════════════════════════════════════════

export const multistoreHubTab: Tab[] = featureTab('multistoreHub', {
  label: 'Multistore',
  description: 'Distributie naar webshops',
  fields: [
    {
      name: 'hubMasterSku',
      type: 'text',
      unique: true,
      label: 'Master SKU',
      admin: {
        description: 'Unieke SKU die op alle webshops wordt gebruikt',
      },
    },
    {
      name: 'multistoreSyncEnabled',
      type: 'checkbox',
      defaultValue: true,
      label: 'Sync ingeschakeld',
      admin: {
        description: 'Product synchroniseren naar webshops (per product aan/uit)',
      },
    },
    {
      name: 'distributedTo',
      type: 'array',
      label: 'Gedistribueerd naar',
      admin: {
        description: 'Webshops waar dit product naartoe is gesynchroniseerd',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'site',
          type: 'relationship',
          relationTo: 'multistore-sites' as any,
          required: true,
          label: 'Webshop',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'remoteProductId',
              type: 'number',
              label: 'Remote Product ID',
              admin: {
                readOnly: true,
                description: 'Product ID op de webshop',
              },
            },
            {
              name: 'syncStatus',
              type: 'select',
              label: 'Sync Status',
              defaultValue: 'pending',
              options: [
                { label: 'In afwachting', value: 'pending' },
                { label: 'Gesynchroniseerd', value: 'synced' },
                { label: 'Verouderd', value: 'outdated' },
                { label: 'Fout', value: 'error' },
              ],
              admin: { readOnly: true },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'lastSyncedAt',
              type: 'date',
              label: 'Laatste sync',
              admin: {
                readOnly: true,
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
            {
              name: 'priceOverride',
              type: 'number',
              label: 'Prijsoverschrijving',
              admin: {
                step: 0.01,
                description: 'Laat leeg om de standaard prijs te gebruiken',
              },
            },
          ],
        },
        {
          name: 'syncError',
          type: 'text',
          label: 'Foutmelding',
          admin: {
            readOnly: true,
            condition: (_data: any, siblingData: any) => siblingData?.syncStatus === 'error',
          },
        },
      ],
    },
  ],
})

// ═══════════════════════════════════════════════════════════
// CHILD TAB — visible on child webshops
// ═══════════════════════════════════════════════════════════

export const multistoreChildTab: Tab[] = featureTab('multistoreChild', {
  label: 'Multistore',
  description: 'Synchronisatie met Hub',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'hubProductId',
          type: 'number',
          label: 'Hub Product ID',
          admin: {
            readOnly: true,
            description: 'Product ID op de Hub',
          },
        },
        {
          name: 'hubMasterSku',
          type: 'text',
          label: 'Hub Master SKU',
          admin: {
            readOnly: true,
            description: 'SKU op de Hub',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'syncStatus',
          type: 'select',
          label: 'Sync Status',
          defaultValue: 'local-only',
          options: [
            { label: 'Gesynchroniseerd', value: 'synced' },
            { label: 'Verouderd', value: 'outdated' },
            { label: 'Fout', value: 'error' },
            { label: 'Alleen lokaal', value: 'local-only' },
          ],
          admin: { readOnly: true },
        },
        {
          name: 'syncSource',
          type: 'select',
          label: 'Bron',
          defaultValue: 'local',
          options: [
            { label: 'Hub', value: 'hub' },
            { label: 'Lokaal', value: 'local' },
          ],
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'lastSyncedAt',
      type: 'date',
      label: 'Laatste synchronisatie',
      admin: {
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
})
