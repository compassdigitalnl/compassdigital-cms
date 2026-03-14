/**
 * MultistoreSites Collection
 *
 * Registered child webshops that the Hub manages.
 * Each site has its own API URL, API key, and sync configuration.
 *
 * Only visible when ENABLE_MULTISTORE_HUB=true.
 */

import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

export const MultistoreSites: CollectionConfig = {
  slug: 'multistore-sites',
  labels: {
    singular: 'Webshop',
    plural: 'Webshops',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Multistore',
    defaultColumns: ['name', 'domain', 'status', 'healthStatus', 'lastHealthCheck'],
    description: 'Geregistreerde webshops die door deze Hub worden beheerd',
    hidden: shouldHideCollection('multistoreHub'),
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin'], user),
    create: ({ req: { user } }) => checkRole(['admin'], user),
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // ─── Sidebar ──────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Actief', value: 'active' },
        { label: 'Gepauzeerd', value: 'paused' },
        { label: 'Niet verbonden', value: 'disconnected' },
        { label: 'Fout', value: 'error' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'healthStatus',
      type: 'select',
      defaultValue: 'unknown',
      label: 'Gezondheid',
      options: [
        { label: 'Gezond', value: 'healthy' },
        { label: 'Verslechterd', value: 'degraded' },
        { label: 'Niet bereikbaar', value: 'down' },
        { label: 'Onbekend', value: 'unknown' },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'lastHealthCheck',
      type: 'date',
      label: 'Laatste check',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },

    // ─── Basisgegevens ────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Webshop naam',
          admin: {
            description: 'Herkenbare naam (bijv. "Aboland Webshop", "Magvilla")',
          },
        },
        {
          name: 'domain',
          type: 'text',
          required: true,
          unique: true,
          label: 'Domein',
          admin: {
            description: 'Volledig domein (bijv. "aboland01.compassdigital.nl")',
          },
        },
      ],
    },

    // ─── API Connectie ────────────────────────────────────
    {
      type: 'collapsible',
      label: 'API Connectie',
      admin: {
        initCollapsed: false,
        description: 'Verbinding met de Payload CMS REST API van deze webshop',
      },
      fields: [
        {
          name: 'apiUrl',
          type: 'text',
          required: true,
          label: 'API URL',
          admin: {
            description: 'Basis URL van de webshop (bijv. "https://aboland01.compassdigital.nl")',
            placeholder: 'https://...',
          },
          validate: (val: string | null | undefined) => {
            if (!val) return 'API URL is verplicht'
            try {
              new URL(val)
              return true
            } catch {
              return 'Ongeldige URL'
            }
          },
        },
        {
          name: 'apiKey',
          type: 'text',
          required: true,
          label: 'API Key',
          admin: {
            description: 'Payload CMS API key (Bearer token) van de webshop',
          },
        },
        {
          name: 'webhookSecret',
          type: 'text',
          label: 'Webhook Secret',
          admin: {
            description: 'HMAC-SHA256 geheime sleutel voor webhook verificatie',
          },
        },
      ],
    },

    // ─── Sync Configuratie ────────────────────────────────
    {
      type: 'collapsible',
      label: 'Sync Configuratie',
      admin: {
        initCollapsed: true,
        description: 'Bepaal welke data gesynchroniseerd wordt',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'syncProducts',
              type: 'checkbox',
              label: 'Producten synchroniseren',
              defaultValue: true,
              admin: {
                description: 'Producten van Hub pushen naar deze webshop',
              },
            },
            {
              name: 'syncOrders',
              type: 'checkbox',
              label: 'Bestellingen ophalen',
              defaultValue: true,
              admin: {
                description: 'Bestellingen van deze webshop importeren',
              },
            },
            {
              name: 'syncInventory',
              type: 'checkbox',
              label: 'Voorraad synchroniseren',
              defaultValue: true,
              admin: {
                description: 'Voorraadwijzigingen in beide richtingen synchroniseren',
              },
            },
          ],
        },
      ],
    },

    // ─── Commissie ────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Commissie',
      admin: {
        initCollapsed: true,
        description: 'Commissie-instellingen voor deze webshop',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'defaultCommission',
              type: 'number',
              label: 'Standaard commissie (%)',
              admin: {
                step: 0.1,
                description: 'Percentage commissie over bestellingen (bijv. 15 = 15%)',
              },
            },
            {
              name: 'commissionType',
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

    // ─── Statistieken (read-only) ─────────────────────────
    {
      type: 'collapsible',
      label: 'Statistieken',
      admin: {
        initCollapsed: true,
        description: 'Automatisch bijgewerkt door het sync-systeem',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'totalProductsSynced',
              type: 'number',
              label: 'Producten gesynchroniseerd',
              defaultValue: 0,
              admin: { readOnly: true },
            },
            {
              name: 'totalOrdersImported',
              type: 'number',
              label: 'Bestellingen geimporteerd',
              defaultValue: 0,
              admin: { readOnly: true },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'lastProductSync',
              type: 'date',
              label: 'Laatste product sync',
              admin: {
                readOnly: true,
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
            {
              name: 'lastOrderSync',
              type: 'date',
              label: 'Laatste order sync',
              admin: {
                readOnly: true,
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
          ],
        },
        {
          name: 'lastSyncError',
          type: 'textarea',
          label: 'Laatste sync fout',
          admin: {
            readOnly: true,
            description: 'Wordt automatisch leeggemaakt na succesvolle sync',
          },
        },
      ],
    },
  ],
  timestamps: true,
}

export default MultistoreSites
