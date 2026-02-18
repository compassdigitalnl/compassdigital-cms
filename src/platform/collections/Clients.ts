/**
 * 👥 Clients Collection
 *
 * Beheert alle klant-sites in het multi-tenant platform.
 * Elke client vertegenwoordigt een aparte gedeployde site.
 *
 * FORMULIER STRUCTUUR:
 * - Sidebar: Status + Plan (altijd zichtbaar)
 * - Hoofd: Naam + Domein (altijd zichtbaar)
 * - Ingeklapt: Contactgegevens, Template, Deployment, Billing, etc.
 *
 * TOEKOMSTIGE UITBREIDINGEN (reeds voorbereid, nog niet actief):
 * - Stripe Connect: automatische betalingsverwerking per klant
 * - MultiSafePay: iDEAL/Cards voor NL markt
 * - Health Monitoring: automatische uptime checks
 * - Auto-deployment: via Ploi API
 */

import type { CollectionConfig } from 'payload'
import { checkRole } from '../../access/utilities'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
    group: 'Platform Beheer',
    defaultColumns: ['name', 'domain', 'status', 'plan', 'createdAt'],
    description: 'Klanten beheren en sites deployen',
    hidden: ({ user }) => !checkRole(['admin'], user),
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin'], user),
    create: ({ req: { user } }) => checkRole(['admin'], user),
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // ─── Sidebar: Status & Plan ─────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: '⏳ Nieuw / Nog niet gedeployed', value: 'pending' },
        { label: '🔄 Wordt ingericht...', value: 'provisioning' },
        { label: '🚀 Wordt gedeployed...', value: 'deploying' },
        { label: '✅ Actief', value: 'active' },
        { label: '❌ Deploy mislukt', value: 'failed' },
        { label: '⏸️ Geblokkeerd', value: 'suspended' },
        { label: '📦 Gearchiveerd', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Huidige status van de klantsite',
      },
    },
    {
      name: 'plan',
      type: 'select',
      label: 'Abonnement',
      defaultValue: 'starter',
      options: [
        { label: 'Gratis (demo)', value: 'free' },
        { label: 'Starter', value: 'starter' },
        { label: 'Professional', value: 'professional' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Huidig abonnement',
      },
    },

    // ─── Basisgegevens (altijd zichtbaar) ───────────────
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Bedrijfsnaam',
          admin: {
            description: 'Naam van de klant / het bedrijf',
          },
        },
        {
          name: 'domain',
          type: 'text',
          required: true,
          unique: true,
          label: 'Subdomein',
          admin: {
            description: 'Bijv. "bakkerij-dejong" → bakkerij-dejong.compassdigital.nl',
          },
          validate: (val: string | null | undefined) => {
            if (!val) return 'Subdomein is verplicht'
            if (!/^[a-z0-9-]+$/.test(val)) {
              return 'Alleen kleine letters, cijfers en koppeltekens toegestaan'
            }
            return true
          },
        },
      ],
    },

    // ─── Contactgegevens (ingeklapt) ─────────────────────
    {
      type: 'collapsible',
      label: 'Contactgegevens',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              required: true,
              label: 'E-mailadres',
            },
            {
              name: 'contactName',
              type: 'text',
              label: 'Contactpersoon',
            },
          ],
        },
        {
          name: 'contactPhone',
          type: 'text',
          label: 'Telefoonnummer',
          admin: {
            placeholder: '+31 6 1234 5678',
          },
        },
      ],
    },

    // ─── Template & Functies (ingeklapt) ─────────────────
    {
      type: 'collapsible',
      label: 'Template & Functies',
      admin: {
        initCollapsed: true,
        description: 'Bepaalt welk startpunt en welke features deze klant krijgt',
      },
      fields: [
        {
          name: 'template',
          type: 'select',
          required: true,
          label: 'Site Template',
          defaultValue: 'corporate',
          options: [
            { label: 'Webshop (e-commerce)', value: 'ecommerce' },
            { label: 'Blog & Magazine', value: 'blog' },
            { label: 'B2B Platform', value: 'b2b' },
            { label: 'Portfolio & Agency', value: 'portfolio' },
            { label: 'Zakelijke website', value: 'corporate' },
          ],
          admin: {
            description: 'Basistemplate voor de klantsite',
          },
        },
        {
          name: 'enabledFeatures',
          type: 'select',
          hasMany: true,
          label: 'Extra functies',
          admin: {
            description: 'Selecteer alle extra modules die voor deze klant actief zijn',
          },
          options: [
            { label: 'E-commerce / webshop', value: 'ecommerce' },
            { label: 'Blog', value: 'blog' },
            { label: 'Contactformulier', value: 'forms' },
            { label: 'Inloggen voor klanten', value: 'authentication' },
            { label: 'Meertalig', value: 'multiLanguage' },
            { label: 'AI contentgeneratie', value: 'ai' },
          ],
        },
        {
          name: 'disabledCollections',
          type: 'select',
          hasMany: true,
          label: 'Uitgeschakelde modules',
          admin: {
            description: 'Modules die voor deze klant verborgen zijn (niet nodig)',
          },
          options: [
            { label: 'Webshop / Orders', value: 'orders' },
            { label: 'Producten', value: 'products' },
            { label: 'Productcategorieën', value: 'product-categories' },
            { label: 'Blog', value: 'blog-posts' },
            { label: 'Klantengroepen', value: 'customer-groups' },
            { label: 'Bestellijsten', value: 'order-lists' },
            { label: 'Cases / Portfolio', value: 'cases' },
            { label: 'Testimonials', value: 'testimonials' },
            { label: 'Partners', value: 'partners' },
            { label: 'Merken', value: 'brands' },
            { label: 'Diensten', value: 'services' },
            { label: 'FAQ', value: 'faqs' },
          ],
        },
      ],
    },

    // ─── Deployment Info (ingeklapt, read-only) ──────────
    {
      type: 'collapsible',
      label: 'Deployment details',
      admin: {
        initCollapsed: true,
        description: 'Worden automatisch ingevuld bij deployment — niet handmatig invullen',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'deploymentUrl',
              type: 'text',
              label: 'Site URL',
              admin: {
                readOnly: true,
                description: 'Automatisch ingevuld',
              },
            },
            {
              name: 'adminUrl',
              type: 'text',
              label: 'Admin Panel URL',
              admin: {
                readOnly: true,
                description: 'Automatisch ingevuld',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'deploymentProvider',
              type: 'select',
              label: 'Hosting provider',
              options: [
                { label: 'Ploi (VPS)', value: 'ploi' },
                { label: 'Anders', value: 'custom' },
              ],
              admin: {
                readOnly: true,
                description: 'Automatisch ingevuld',
              },
            },
            {
              name: 'lastDeployedAt',
              type: 'date',
              label: 'Laatste deployment',
              admin: {
                readOnly: true,
              },
            },
          ],
        },
        {
          name: 'deploymentProviderId',
          type: 'text',
          label: 'Provider Site ID',
          admin: {
            readOnly: true,
            description: 'Ploi site ID',
          },
        },
        {
          name: 'lastDeploymentId',
          type: 'text',
          label: 'Laatste Deployment ID',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'databaseUrl',
          type: 'text',
          label: 'Database URL',
          admin: {
            readOnly: true,
            description: 'PostgreSQL connection string (versleuteld opgeslagen)',
          },
        },
        {
          name: 'databaseProviderId',
          type: 'text',
          label: 'Database Provider ID',
          admin: {
            readOnly: true,
            description: 'Railway service ID voor de database',
          },
        },
        {
          name: 'port',
          type: 'number',
          label: 'Node.js Port',
          admin: {
            readOnly: true,
            description: 'Toegewezen serverpoort (bijv. 3001). Automatisch ingevuld bij provisioning.',
          },
        },
      ],
    },

    // ─── Admin Toegang (ingeklapt) ───────────────────────
    {
      type: 'collapsible',
      label: 'Admin toegang client-site',
      admin: {
        initCollapsed: false,
        description: 'Inloggegevens die automatisch zijn aangemaakt tijdens provisioning',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'adminEmail',
              type: 'email',
              label: 'Admin e-mailadres',
              admin: {
                readOnly: true,
                description: 'Automatisch ingevuld bij provisioning (contactEmail van de klant)',
              },
            },
            {
              name: 'initialAdminPassword',
              type: 'text',
              label: 'Tijdelijk wachtwoord',
              admin: {
                readOnly: true,
                description: 'Eenmalig gegenereerd — vraag klant dit te wijzigen na eerste login',
              },
            },
          ],
        },
      ],
    },

    // ─── Configuratie (ingeklapt) ────────────────────────
    {
      type: 'collapsible',
      label: 'Aangepaste configuratie',
      admin: {
        initCollapsed: true,
        description: 'Geavanceerde instellingen voor deze klant',
      },
      fields: [
        {
          name: 'customEnvironment',
          type: 'json',
          label: 'Omgevingsvariabelen (custom)',
          admin: {
            description: 'Extra .env variabelen specifiek voor deze klant (bijv. eigen API keys)',
          },
        },
        {
          name: 'customSettings',
          type: 'json',
          label: 'Platforminstellingen (custom)',
          admin: {
            description: 'Klantspecifieke platform-instellingen',
          },
        },
      ],
    },

    // ─── Facturering (ingeklapt) — FASE 2 ────────────────
    {
      type: 'collapsible',
      label: 'Facturering [toekomstig]',
      admin: {
        initCollapsed: true,
        description: 'Fase 2: Automatische facturering via Stripe Billing',
      },
      fields: [
        {
          name: 'billingStatus',
          type: 'select',
          label: 'Factuurstatus',
          options: [
            { label: 'Actief', value: 'active' },
            { label: 'Achterstallig', value: 'past_due' },
            { label: 'Opgezegd', value: 'cancelled' },
            { label: 'Proefperiode', value: 'trial' },
          ],
          defaultValue: 'active',
        },
        {
          name: 'monthlyFee',
          type: 'number',
          label: 'Maandelijks bedrag (EUR)',
        },
        {
          name: 'nextBillingDate',
          type: 'date',
          label: 'Volgende factuurdatum',
        },
      ],
    },

    // ─── Stripe Betalingen (ingeklapt) — FASE 3 ─────────
    {
      type: 'collapsible',
      label: 'Stripe Connect [toekomstig]',
      admin: {
        initCollapsed: true,
        description: 'Fase 3: Betalingsverwerking voor e-commerce klanten via Stripe Connect',
      },
      fields: [
        {
          name: 'paymentsEnabled',
          type: 'checkbox',
          label: 'Stripe betalingen ingeschakeld',
          defaultValue: false,
        },
        {
          name: 'stripeAccountId',
          type: 'text',
          label: 'Stripe Account ID',
          admin: { readOnly: true, description: 'acct_... — automatisch ingevuld' },
        },
        {
          name: 'stripeAccountStatus',
          type: 'select',
          label: 'Stripe Account Status',
          options: [
            { label: 'Niet gestart', value: 'not_started' },
            { label: 'In behandeling', value: 'pending' },
            { label: 'Actief', value: 'enabled' },
            { label: 'Afgewezen', value: 'rejected' },
            { label: 'Beperkt', value: 'restricted' },
          ],
          defaultValue: 'not_started',
          admin: { readOnly: true },
        },
        {
          name: 'paymentPricingTier',
          type: 'select',
          label: 'Tarief transacties',
          options: [
            { label: 'Standaard (2.4% + €0.25)', value: 'standard' },
            { label: 'Professional (1.9% + €0.25)', value: 'professional' },
            { label: 'Enterprise (1.6% + €0.20)', value: 'enterprise' },
            { label: 'Maatwerk', value: 'custom' },
          ],
          defaultValue: 'standard',
          admin: {
            condition: (data) => data.paymentsEnabled === true,
          },
        },
        {
          name: 'customTransactionFee',
          type: 'group',
          label: 'Maatwerkpercentage',
          admin: {
            condition: (data) => data.paymentPricingTier === 'custom',
          },
          fields: [
            { name: 'percentage', type: 'number', label: 'Percentage (%)', admin: { step: 0.1 } },
            { name: 'fixed', type: 'number', label: 'Vast bedrag (EUR)', admin: { step: 0.01 } },
          ],
        },
        {
          name: 'totalPaymentVolume',
          type: 'number',
          label: 'Totaal transactievolume (EUR)',
          admin: { readOnly: true },
        },
        {
          name: 'totalPaymentRevenue',
          type: 'number',
          label: 'Totale platformfee (EUR)',
          admin: { readOnly: true },
        },
        {
          name: 'lastPaymentAt',
          type: 'date',
          label: 'Laatste betaling',
          admin: { readOnly: true },
        },
      ],
    },

    // ─── MultiSafePay (ingeklapt) — FASE 3 ──────────────
    {
      type: 'collapsible',
      label: 'MultiSafePay [toekomstig]',
      admin: {
        initCollapsed: true,
        description: 'Fase 3: iDEAL / Cards via MultiSafePay (aanbevolen voor NL/EU)',
      },
      fields: [
        {
          name: 'multiSafepayEnabled',
          type: 'checkbox',
          label: 'MultiSafePay ingeschakeld',
          defaultValue: false,
        },
        {
          name: 'multiSafepayAffiliateId',
          type: 'text',
          label: 'Affiliate ID',
          admin: { readOnly: true },
        },
        {
          name: 'multiSafepayAccountStatus',
          type: 'select',
          label: 'Account Status',
          options: [
            { label: 'Niet gestart', value: 'not_started' },
            { label: 'In verificatie', value: 'pending' },
            { label: 'Actief', value: 'active' },
            { label: 'Geblokkeerd', value: 'suspended' },
            { label: 'Afgewezen', value: 'rejected' },
          ],
          defaultValue: 'not_started',
          admin: { readOnly: true },
        },
        {
          name: 'multiSafepayPricingTier',
          type: 'select',
          label: 'Tarieftier',
          options: [
            { label: 'Standaard (iDEAL €0.35, Cards 1.8%)', value: 'standard' },
            { label: 'Professional (iDEAL €0.30, Cards 1.6%)', value: 'professional' },
            { label: 'Enterprise (iDEAL €0.28, Cards 1.5%)', value: 'enterprise' },
            { label: 'Maatwerk partnertarieven', value: 'custom' },
          ],
          defaultValue: 'standard',
          admin: {
            condition: (data) => data.multiSafepayEnabled === true,
          },
        },
        {
          name: 'multiSafepayCustomRates',
          type: 'group',
          label: 'Maatwerktarieven',
          admin: {
            condition: (data) => data.multiSafepayPricingTier === 'custom',
          },
          fields: [
            { name: 'idealFee', type: 'number', label: 'iDEAL fee (EUR)', admin: { step: 0.01 } },
            {
              name: 'cardPercentage',
              type: 'number',
              label: 'Cards percentage (%)',
              admin: { step: 0.1 },
            },
            {
              name: 'cardFixed',
              type: 'number',
              label: 'Cards vast bedrag (EUR)',
              admin: { step: 0.01 },
            },
          ],
        },
        {
          name: 'multiSafepayTotalVolume',
          type: 'number',
          label: 'Totaal volume (EUR)',
          admin: { readOnly: true },
        },
        {
          name: 'multiSafepayTotalRevenue',
          type: 'number',
          label: 'Totale platformfee (EUR)',
          admin: { readOnly: true },
        },
        {
          name: 'multiSafepayLastPaymentAt',
          type: 'date',
          label: 'Laatste betaling',
          admin: { readOnly: true },
        },
      ],
    },

    // ─── Health & Monitoring (ingeklapt) — FASE 2 ────────
    {
      type: 'collapsible',
      label: 'Health & Monitoring [toekomstig]',
      admin: {
        initCollapsed: true,
        description: 'Fase 2: Automatische uptime monitoring — wordt gevuld door het systeem',
      },
      fields: [
        {
          name: 'lastHealthCheck',
          type: 'date',
          label: 'Laatste health check',
          admin: { readOnly: true },
        },
        {
          name: 'healthStatus',
          type: 'select',
          label: 'Health Status',
          options: [
            { label: '✅ Gezond', value: 'healthy' },
            { label: '⚠️ Waarschuwing', value: 'warning' },
            { label: '🔴 Kritiek', value: 'critical' },
            { label: '❓ Onbekend', value: 'unknown' },
          ],
          admin: { readOnly: true },
        },
        {
          name: 'uptimePercentage',
          type: 'number',
          label: 'Uptime % (30 dagen)',
          admin: { readOnly: true },
        },
      ],
    },

    // ─── Interne notities ────────────────────────────────
    {
      type: 'collapsible',
      label: 'Interne notities',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'notes',
          type: 'textarea',
          label: 'Notities (intern)',
          admin: {
            description: 'Alleen zichtbaar voor admins van CompassDigital — niet voor de klant',
            rows: 4,
          },
        },
      ],
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Auto-genereer URLs bij aanmaken
        if (operation === 'create' && data.domain) {
          const baseUrl = process.env.PLATFORM_BASE_URL || 'compassdigital.nl'
          data.deploymentUrl = `https://${data.domain}.${baseUrl}`
          data.adminUrl = `https://${data.domain}.${baseUrl}/admin`
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation === 'create') {
          console.log(`[Platform] Nieuwe klant aangemaakt: ${doc.name} (${doc.domain})`)
        }

        // Trigger provisioning when status changes TO 'provisioning'
        // BUT: skip if this update was made by provisionClient itself
        // (to prevent double-execution when provisionClient calls payload.update)
        const skipHook = (req as any)?.context?.skipProvisioningHook === true
        const statusChanged = previousDoc?.status !== doc.status
        const shouldProvision = doc.status === 'provisioning' && statusChanged && !skipHook

        if (shouldProvision) {
          console.log(`[Platform] Provisioning gestart voor: ${doc.name} (${doc.domain}) — ID: ${doc.id}`)

          // Fire-and-forget: run in background so the Payload save completes immediately
          setImmediate(async () => {
            try {
              const { provisionClient } = await import('@/lib/provisioning/provisionClient')
              const result = await provisionClient({
                clientId: String(doc.id),
                provider: 'ploi',
                verbose: true,
              })

              if (result.success) {
                console.log(`[Platform] Provisioning voltooid voor ${doc.name}: ${result.deploymentUrl}`)
              } else {
                console.error(`[Platform] Provisioning mislukt voor ${doc.name}: ${result.error}`)
              }
            } catch (err: any) {
              console.error(`[Platform] Onverwachte fout bij provisioning van ${doc.name}:`, err)
            }
          })
        }
      },
    ],
  },
}
