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
import { isClientDeployment } from '../../lib/isClientDeployment'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
    group: 'Platform Beheer',
    defaultColumns: ['name', 'domain', 'status', 'plan', 'createdAt'],
    description: 'Klanten beheren en sites deployen',
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
          label: 'Domein',
          admin: {
            description:
              'Subdomain (bijv. "bakkerij-dejong") of volledige hostname (bijv. "plastimed01.compassdigital.nl")',
          },
          validate: (val: string | null | undefined) => {
            if (!val) return 'Domein is verplicht'
            // Accept both subdomain-only (e.g., "plastimed01") AND full hostname (e.g., "plastimed01.compassdigital.nl")
            if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*$/.test(val)) {
              return 'Alleen kleine letters, cijfers, koppeltekens en punten toegestaan'
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
          name: 'features',
          type: 'group',
          label: 'Feature Toggles',
          admin: {
            description: 'Bepaal welke features actief zijn voor deze klant — bepaalt welke collections zichtbaar zijn en welke database tabellen aangemaakt worden',
          },
          fields: [
            // ═══ WEBSHOP & E-COMMERCE ═══
            {
              type: 'collapsible',
              label: '🛒 Webshop & E-commerce',
              admin: {
                initCollapsed: true,
                description: 'Productcatalogus, winkelwagen, en checkout functies',
              },
              fields: [
                {
                  name: 'shop',
                  type: 'checkbox',
                  label: 'Webshop (parent)',
                  defaultValue: true,
                  admin: {
                    description: 'Hoofdfeature - Schakelt producten, categorieën en merken in',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'volumePricing',
                      type: 'checkbox',
                      label: 'Volume Pricing',
                      defaultValue: false,
                      admin: {
                        description: 'Staffelprijzen (bijv. 10+ stuks = korting)',
                      },
                    },
                    {
                      name: 'compareProducts',
                      type: 'checkbox',
                      label: 'Product Vergelijking',
                      defaultValue: false,
                    },
                    {
                      name: 'quickOrder',
                      type: 'checkbox',
                      label: 'Snelbestel',
                      defaultValue: false,
                      admin: {
                        description: 'Bestel direct via SKU/artikelnummer',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'brands',
                      type: 'checkbox',
                      label: 'Merken',
                      defaultValue: false,
                    },
                    {
                      name: 'recentlyViewed',
                      type: 'checkbox',
                      label: 'Recent Bekeken',
                      defaultValue: false,
                    },
                    {
                      name: 'productReviews',
                      type: 'checkbox',
                      label: 'Product Reviews (legacy)',
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },

            // ═══ CART ═══
            {
              type: 'collapsible',
              label: '🛍️ Winkelwagen',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'cart',
                  type: 'checkbox',
                  label: 'Winkelwagen (parent)',
                  defaultValue: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'miniCart',
                      type: 'checkbox',
                      label: 'Mini Cart',
                      defaultValue: false,
                      admin: {
                        description: 'Kleine winkelwagen in header',
                      },
                    },
                    {
                      name: 'freeShippingBar',
                      type: 'checkbox',
                      label: 'Gratis Verzending Bar',
                      defaultValue: false,
                      admin: {
                        description: 'Toon voortgang tot gratis verzending',
                      },
                    },
                  ],
                },
              ],
            },

            // ═══ CHECKOUT ═══
            {
              type: 'collapsible',
              label: '💳 Checkout & Orders',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'checkout',
                  type: 'checkbox',
                  label: 'Checkout (parent)',
                  defaultValue: true,
                  admin: {
                    description: 'Hoofdfeature - Bestellingen plaatsen',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'guestCheckout',
                      type: 'checkbox',
                      label: 'Gast Checkout',
                      defaultValue: false,
                      admin: {
                        description: 'Bestellen zonder account',
                      },
                    },
                    {
                      name: 'invoices',
                      type: 'checkbox',
                      label: 'Facturen',
                      defaultValue: false,
                    },
                    {
                      name: 'orderTracking',
                      type: 'checkbox',
                      label: 'Track & Trace',
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },

            // ═══ MY ACCOUNT ═══
            {
              type: 'collapsible',
              label: '👤 Mijn Account',
              admin: {
                initCollapsed: true,
                description: 'Klantaccount functies',
              },
              fields: [
                {
                  name: 'myAccount',
                  type: 'checkbox',
                  label: 'Mijn Account (parent)',
                  defaultValue: true,
                  admin: {
                    description: 'Hoofdfeature - Schakelt alle klantaccount functies in',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'returns',
                      type: 'checkbox',
                      label: 'Retourzendingen',
                      defaultValue: false,
                    },
                    {
                      name: 'recurringOrders',
                      type: 'checkbox',
                      label: 'Terugkerende Orders',
                      defaultValue: false,
                      admin: {
                        description: 'Automatische herbestelling',
                      },
                    },
                    {
                      name: 'orderLists',
                      type: 'checkbox',
                      label: 'Bestellijsten',
                      defaultValue: false,
                      admin: {
                        description: 'B2B snelbestelformulieren',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'addresses',
                      type: 'checkbox',
                      label: 'Adresboek',
                      defaultValue: false,
                    },
                    {
                      name: 'accountInvoices',
                      type: 'checkbox',
                      label: 'Factuuroverzicht',
                      defaultValue: false,
                    },
                    {
                      name: 'notifications',
                      type: 'checkbox',
                      label: 'Notificaties',
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },

            // ═══ B2B FUNCTIES ═══
            {
              type: 'collapsible',
              label: '🏢 B2B Functies',
              admin: {
                initCollapsed: true,
                description: 'Business-to-business features',
              },
              fields: [
                {
                  name: 'b2b',
                  type: 'checkbox',
                  label: 'B2B (parent)',
                  defaultValue: false,
                  admin: {
                    description: 'Hoofdfeature - Schakelt alle B2B functies in',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'customerGroups',
                      type: 'checkbox',
                      label: 'Klantengroepen',
                      defaultValue: false,
                      admin: {
                        description: 'Verschillende prijzen per groep',
                      },
                    },
                    {
                      name: 'groupPricing',
                      type: 'checkbox',
                      label: 'Groepsprijzen',
                      defaultValue: false,
                    },
                    {
                      name: 'barcodeScanner',
                      type: 'checkbox',
                      label: 'Barcode Scanner',
                      defaultValue: false,
                      admin: {
                        description: 'Scan producten met mobiel',
                      },
                    },
                  ],
                },
              ],
            },

            // ═══ MARKETPLACE ═══
            {
              type: 'collapsible',
              label: '🏪 Marketplace',
              admin: {
                initCollapsed: true,
                description: 'Sprint 5: Multi-vendor marketplace functies',
              },
              fields: [
                {
                  name: 'vendors',
                  type: 'checkbox',
                  label: 'Leveranciers (parent)',
                  defaultValue: false,
                  admin: {
                    description: 'Hoofdfeature - Multi-vendor marketplace',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'vendorReviews',
                      type: 'checkbox',
                      label: 'Vendor Reviews',
                      defaultValue: false,
                    },
                    {
                      name: 'workshops',
                      type: 'checkbox',
                      label: 'Workshops / Trainingen',
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },

            // ═══ SPRINT 6 FEATURES ═══
            {
              type: 'collapsible',
              label: '🚀 Sprint 6 Features',
              admin: {
                initCollapsed: true,
                description: 'Subscriptions, Licenses, Gift Vouchers, Loyalty',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'subscriptions',
                      type: 'checkbox',
                      label: 'Abonnementen',
                      defaultValue: false,
                      admin: {
                        description: 'Recurring billing',
                      },
                    },
                    {
                      name: 'giftVouchers',
                      type: 'checkbox',
                      label: 'Cadeaubonnen',
                      defaultValue: false,
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'licenses',
                      type: 'checkbox',
                      label: 'Licenties',
                      defaultValue: false,
                      admin: {
                        description: 'Software license management',
                      },
                    },
                    {
                      name: 'loyalty',
                      type: 'checkbox',
                      label: 'Loyalty Programma',
                      defaultValue: false,
                      admin: {
                        description: 'Points, tiers, rewards',
                      },
                    },
                  ],
                },
              ],
            },

            // ═══ CONTENT & MARKETING ═══
            {
              type: 'collapsible',
              label: '📝 Content & Marketing',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'blog',
                      type: 'checkbox',
                      label: 'Blog',
                      defaultValue: true,
                    },
                    {
                      name: 'faq',
                      type: 'checkbox',
                      label: 'FAQ',
                      defaultValue: true,
                    },
                    {
                      name: 'testimonials',
                      type: 'checkbox',
                      label: 'Testimonials',
                      defaultValue: true,
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'cases',
                      type: 'checkbox',
                      label: 'Portfolio / Cases',
                      defaultValue: false,
                    },
                    {
                      name: 'partners',
                      type: 'checkbox',
                      label: 'Partners',
                      defaultValue: false,
                    },
                    {
                      name: 'services',
                      type: 'checkbox',
                      label: 'Diensten',
                      defaultValue: false,
                    },
                  ],
                },
                {
                  name: 'wishlists',
                  type: 'checkbox',
                  label: 'Verlanglijstjes',
                  defaultValue: false,
                },
              ],
            },

            // ═══ GEAVANCEERD ═══
            {
              type: 'collapsible',
              label: '⚙️ Geavanceerd',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'multiLanguage',
                      type: 'checkbox',
                      label: 'Meertaligheid',
                      defaultValue: false,
                    },
                    {
                      name: 'aiContent',
                      type: 'checkbox',
                      label: 'AI Content Generatie',
                      defaultValue: false,
                    },
                    {
                      name: 'search',
                      type: 'checkbox',
                      label: 'Zoekfunctie',
                      defaultValue: false,
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'newsletter',
                      type: 'checkbox',
                      label: 'Nieuwsbrief',
                      defaultValue: false,
                    },
                    {
                      name: 'authentication',
                      type: 'checkbox',
                      label: 'Gebruikers / Inloggen',
                      defaultValue: true,
                    },
                  ],
                },
              ],
            },
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
