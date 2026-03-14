/**
 * MultistoreSettings Global
 *
 * Hub-wide configuration for the multistore system.
 * Sync intervals, default commission, conflict resolution, etc.
 *
 * Only visible when ENABLE_MULTISTORE_HUB=true.
 */

import type { GlobalConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { features } from '@/lib/tenant/features'

export const MultistoreSettings: GlobalConfig = {
  slug: 'multistore-settings',
  label: 'Multistore Instellingen',
  admin: {
    group: 'Multistore',
    hidden: !features.multistoreHub,
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin'], user),
    update: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // ─── Sync Intervals ───────────────────────────────────
    {
      type: 'collapsible',
      label: 'Sync Intervallen',
      admin: {
        description: 'Hoe vaak worden gegevens automatisch gesynchroniseerd',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'productSyncInterval',
              type: 'number',
              label: 'Product sync interval (minuten)',
              defaultValue: 15,
              min: 1,
              max: 1440,
              admin: {
                description: 'Hoe vaak producten worden gesynchroniseerd (1-1440 min)',
              },
            },
            {
              name: 'orderSyncInterval',
              type: 'number',
              label: 'Order sync interval (minuten)',
              defaultValue: 5,
              min: 1,
              max: 1440,
              admin: {
                description: 'Hoe vaak bestellingen worden opgehaald (1-1440 min)',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'inventorySyncInterval',
              type: 'number',
              label: 'Voorraad sync interval (minuten)',
              defaultValue: 30,
              min: 1,
              max: 1440,
              admin: {
                description: 'Hoe vaak voorraad wordt gereconcilieerd (1-1440 min)',
              },
            },
            {
              name: 'healthCheckInterval',
              type: 'number',
              label: 'Health check interval (minuten)',
              defaultValue: 5,
              min: 1,
              max: 60,
              admin: {
                description: 'Hoe vaak de bereikbaarheid van webshops wordt gecontroleerd',
              },
            },
          ],
        },
      ],
    },

    // ─── Default Commissie ────────────────────────────────
    {
      type: 'collapsible',
      label: 'Standaard Commissie',
      admin: {
        description: 'Wordt gebruikt als een webshop geen eigen commissie-instelling heeft',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'defaultCommissionPercentage',
              type: 'number',
              label: 'Standaard commissie (%)',
              defaultValue: 0,
              min: 0,
              max: 100,
              admin: {
                step: 0.1,
                description: 'Standaard commissiepercentage over bestellingen',
              },
            },
            {
              name: 'defaultCommissionType',
              type: 'select',
              label: 'Commissie type',
              defaultValue: 'percentage',
              options: [
                { label: 'Percentage', value: 'percentage' },
                { label: 'Vast bedrag per order', value: 'fixed' },
              ],
            },
          ],
        },
      ],
    },

    // ─── Conflict Resolution ──────────────────────────────
    {
      type: 'collapsible',
      label: 'Conflictresolutie',
      admin: {
        initCollapsed: true,
        description: 'Hoe conflicten worden opgelost bij gelijktijdige wijzigingen',
      },
      fields: [
        {
          name: 'productConflictResolution',
          type: 'select',
          label: 'Product conflicten',
          defaultValue: 'hub-wins',
          options: [
            { label: 'Hub heeft voorrang', value: 'hub-wins' },
            { label: 'Meest recent wint', value: 'latest-wins' },
            { label: 'Handmatig oplossen', value: 'manual' },
          ],
          admin: {
            description: 'Strategie als Hub en child tegelijkertijd dezelfde data wijzigen',
          },
        },
        {
          name: 'inventoryConflictResolution',
          type: 'select',
          label: 'Voorraad conflicten',
          defaultValue: 'lowest-wins',
          options: [
            { label: 'Laagste voorraad wint', value: 'lowest-wins' },
            { label: 'Hub heeft voorrang', value: 'hub-wins' },
            { label: 'Laatste wijziging wint', value: 'latest-wins' },
          ],
          admin: {
            description: 'Bij voorraadconflicten: laagste waarde voorkomt overselling',
          },
        },
      ],
    },

    // ─── Sync Gedrag ──────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Sync Gedrag',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'autoSyncOnProductChange',
          type: 'checkbox',
          label: 'Auto-sync bij productwijziging',
          defaultValue: true,
          admin: {
            description: 'Product direct synchroniseren naar webshops bij opslaan (naast scheduled sync)',
          },
        },
        {
          name: 'autoImportOrders',
          type: 'checkbox',
          label: 'Auto-import bestellingen',
          defaultValue: true,
          admin: {
            description: 'Bestellingen automatisch importeren via scheduled polling',
          },
        },
        {
          name: 'syncDeletedProducts',
          type: 'checkbox',
          label: 'Verwijderde producten synchroniseren',
          defaultValue: false,
          admin: {
            description: 'Verwijder producten ook op webshops wanneer ze op de Hub worden verwijderd',
          },
        },
      ],
    },
  ],
}

export default MultistoreSettings
