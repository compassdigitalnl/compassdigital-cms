/**
 * 🚀 Deployments Collection
 *
 * Bijhoudt deployment history voor alle klant-sites.
 * Wordt automatisch aangemaakt door het platform — handmatig aanmaken is niet nodig.
 */

import type { CollectionConfig } from 'payload'
import { checkRole } from '../../access/utilities'
import { isClientDeployment } from '../../lib/isClientDeployment'

export const Deployments: CollectionConfig = {
  slug: 'deployments',
  admin: {
    useAsTitle: 'id',
    group: 'Platform Beheer',
    defaultColumns: ['client', 'status', 'environment', 'type', 'createdAt'],
    description:
      'Automatisch bijgehouden deployment history. Alleen-lezen — wordt aangemaakt door het systeem.',
    // Verberg voor niet-admins
    hidden: ({ user }) => {
      // Always hide in client/tenant deployments
      if (isClientDeployment()) return true
      // Otherwise hide for non-admin users
      return !checkRole(['admin'], user)
    },
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin'], user),
    create: ({ req: { user } }) => checkRole(['admin'], user),
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // ─── Altijd zichtbaar: Klant + Status + Omgeving ─────────────────────────

    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      label: 'Klant',
      admin: {
        description: 'Voor welke klant is deze deployment uitgevoerd?',
      },
    },

    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          label: 'Status',
          options: [
            { label: '⏳ Wachtrij', value: 'pending' },
            { label: '🔄 Bezig', value: 'in_progress' },
            { label: '✅ Geslaagd', value: 'success' },
            { label: '❌ Mislukt', value: 'failed' },
            { label: '🔙 Teruggedraaid', value: 'rolled_back' },
            { label: '🚫 Geannuleerd', value: 'cancelled' },
          ],
          admin: {
            description: 'Huidige status van deze deployment',
          },
        },
        {
          name: 'environment',
          type: 'select',
          required: true,
          defaultValue: 'production',
          label: 'Omgeving',
          options: [
            { label: 'Productie', value: 'production' },
            { label: 'Staging', value: 'staging' },
            { label: 'Ontwikkeling', value: 'development' },
          ],
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Type',
          options: [
            { label: 'Eerste installatie', value: 'initial' },
            { label: 'Update', value: 'update' },
            { label: 'Hotfix', value: 'hotfix' },
            { label: 'Rollback', value: 'rollback' },
            { label: 'Migratie', value: 'migration' },
          ],
        },
      ],
    },

    // ─── Versie & Git informatie ──────────────────────────────────────────────

    {
      type: 'collapsible',
      label: 'Versie-informatie',
      admin: {
        initCollapsed: true,
        description: 'Git commit en versienummer — automatisch ingevuld',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'version',
              type: 'text',
              label: 'Versienummer',
              admin: {
                description: 'Bijv. 1.2.3',
                readOnly: true,
              },
            },
            {
              name: 'gitBranch',
              type: 'text',
              label: 'Git Branch',
              admin: {
                readOnly: true,
              },
            },
          ],
        },
        {
          name: 'gitCommit',
          type: 'text',
          label: 'Git Commit Hash',
          admin: {
            description: 'SHA van de gedeployde commit',
            readOnly: true,
          },
        },
      ],
    },

    // ─── Timing ──────────────────────────────────────────────────────────────

    {
      type: 'collapsible',
      label: 'Tijdregistratie',
      admin: {
        initCollapsed: true,
        description: 'Start- en eindtijd — automatisch bijgehouden',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'startedAt',
              type: 'date',
              label: 'Gestart om',
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
                readOnly: true,
              },
            },
            {
              name: 'completedAt',
              type: 'date',
              label: 'Afgerond om',
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
                readOnly: true,
              },
            },
          ],
        },
        {
          name: 'duration',
          type: 'number',
          label: 'Duur (seconden)',
          admin: {
            description: 'Totale deployduur in seconden — automatisch berekend',
            readOnly: true,
          },
        },
      ],
    },

    // ─── Notities (handmatig invulbaar) ──────────────────────────────────────

    {
      type: 'collapsible',
      label: 'Notities',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'reason',
          type: 'textarea',
          label: 'Reden',
          admin: {
            description: 'Waarom is deze deployment uitgevoerd?',
          },
        },
        {
          name: 'notes',
          type: 'textarea',
          label: 'Opmerkingen',
          admin: {
            description: 'Extra opmerkingen over deze deployment',
          },
        },
        {
          name: 'triggeredBy',
          type: 'text',
          label: 'Gestart door',
          admin: {
            description: 'Gebruiker of systeem dat de deployment heeft gestart',
            readOnly: true,
          },
        },
      ],
    },

    // ─── Logs & Foutmeldingen ─────────────────────────────────────────────────

    {
      type: 'collapsible',
      label: 'Logs & Foutmeldingen',
      admin: {
        initCollapsed: true,
        description: 'Technische uitvoer van de deployment — automatisch gevuld',
      },
      fields: [
        {
          name: 'logs',
          type: 'textarea',
          label: 'Deployment Logs',
          admin: {
            description: 'Volledige log-uitvoer',
            rows: 15,
            readOnly: true,
          },
        },
        {
          name: 'errorMessage',
          type: 'textarea',
          label: 'Foutmelding',
          admin: {
            description: 'Foutmelding als de deployment mislukt is',
            condition: (data) => data.status === 'failed',
          },
        },
        {
          name: 'errorStack',
          type: 'textarea',
          label: 'Stack Trace',
          admin: {
            description: 'Volledige technische stack trace',
            condition: (data) => data.status === 'failed',
            rows: 10,
            readOnly: true,
          },
        },
      ],
    },

    // ─── Ploi/Vercel integratie [toekomstig] ──────────────────────────────────

    {
      type: 'collapsible',
      label: 'Ploi Deployment Details [toekomstig]',
      admin: {
        initCollapsed: true,
        description:
          'Fase 2: Technische Ploi/Vercel deployment-IDs — automatisch ingevuld door de deployment-API',
      },
      fields: [
        {
          name: 'vercelDeploymentId',
          type: 'text',
          label: 'Deployment ID',
          admin: {
            description: 'Externe deployment-ID van Ploi of Vercel',
            readOnly: true,
          },
        },
        {
          name: 'vercelDeploymentUrl',
          type: 'text',
          label: 'Deployment URL',
          admin: {
            description: 'URL van de gedeployde site',
            readOnly: true,
          },
        },
        {
          name: 'vercelProjectId',
          type: 'text',
          label: 'Project ID',
          admin: {
            description: 'Extern project-ID in Ploi of Vercel',
            readOnly: true,
          },
        },
      ],
    },

    // ─── Configuratie snapshot [technisch] ────────────────────────────────────

    {
      type: 'collapsible',
      label: 'Configuratie Snapshot [technisch]',
      admin: {
        initCollapsed: true,
        description: 'Snapshot van de klantconfiguratie op het moment van deployment',
      },
      fields: [
        {
          name: 'configSnapshot',
          type: 'json',
          label: 'Configuratie',
          admin: {
            description: 'Snapshot van de klantconfiguratie op het moment van deployment',
            readOnly: true,
          },
        },
        {
          name: 'environmentSnapshot',
          type: 'json',
          label: 'Omgevingsvariabelen',
          admin: {
            description: 'Gebruikte environment variables (gevoelige waarden zijn verborgen)',
            readOnly: true,
          },
        },
      ],
    },

    // ─── Health check resultaten [toekomstig] ─────────────────────────────────

    {
      type: 'collapsible',
      label: 'Health Check Resultaten [toekomstig]',
      admin: {
        initCollapsed: true,
        description: 'Fase 2: Automatische health checks na deployment',
      },
      fields: [
        {
          name: 'healthCheckPassed',
          type: 'checkbox',
          label: 'Health check geslaagd',
          admin: {
            description: 'Zijn de post-deployment health checks geslaagd?',
            readOnly: true,
          },
        },
        {
          name: 'healthCheckResults',
          type: 'json',
          label: 'Health check details',
          admin: {
            description: 'Gedetailleerde resultaten van de health checks',
            readOnly: true,
          },
        },
      ],
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Bereken duur als completedAt + startedAt beschikbaar zijn
        if (data.completedAt && data.startedAt) {
          const start = new Date(data.startedAt).getTime()
          const end = new Date(data.completedAt).getTime()
          data.duration = Math.round((end - start) / 1000)
        }

        // Zet startedAt automatisch bij status → in_progress
        if (operation === 'update' && data.status === 'in_progress' && !data.startedAt) {
          data.startedAt = new Date().toISOString()
        }

        // Zet completedAt automatisch bij status → success / failed
        if (
          operation === 'update' &&
          (data.status === 'success' || data.status === 'failed') &&
          !data.completedAt
        ) {
          data.completedAt = new Date().toISOString()
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          console.log(`[Deployment] Nieuwe deployment gestart voor klant ID: ${doc.client}`)
        }
        if (doc.status === 'success') {
          console.log(`[Deployment] Deployment ${doc.id} geslaagd in ${doc.duration}s`)
        }
        if (doc.status === 'failed') {
          console.error(`[Deployment] Deployment ${doc.id} mislukt: ${doc.errorMessage}`)
        }
      },
    ],
  },
}
