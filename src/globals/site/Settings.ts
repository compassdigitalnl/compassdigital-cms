import type { GlobalConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { isClientDeployment } from '@/lib/tenant/isClientDeployment'
import { featureField, featureTab } from '@/lib/tenant/featureFields'
import { updateContentModulesCache } from '@/lib/tenant/contentModules'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Instellingen',
  admin: {
    group: 'Instellingen',
    description: 'Alle website en webshop instellingen op één plek',
    hidden: !isClientDeployment(),
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        // Update content modules cache when Settings are saved
        updateContentModulesCache(doc)
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ─── TAB 1: BEDRIJFSGEGEVENS (GECONSOLIDEERD) ─────────────
        {
          label: 'Bedrijfsgegevens',
          description: 'Algemene bedrijfsinformatie',
          fields: [
            {
              name: 'companyName',
              type: 'text',
              required: true,
              label: 'Bedrijfsnaam',
              admin: {
                description: 'Officiële bedrijfsnaam',
                placeholder: 'Uw Bedrijfsnaam B.V.',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Slogan',
              admin: {
                placeholder: 'Uw partner in medische disposables',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Korte beschrijving',
              admin: {
                rows: 3,
                description: 'Korte beschrijving van uw bedrijf voor SEO en social media',
              },
            },
            {
              name: 'kvkNumber',
              type: 'text',
              label: 'KVK Nummer',
              admin: {
                placeholder: '12345678',
              },
            },
            {
              name: 'vatNumber',
              type: 'text',
              label: 'BTW Nummer',
              admin: {
                placeholder: 'NL123456789B01',
              },
            },
            {
              name: 'timezone',
              type: 'select',
              label: 'Tijdzone',
              defaultValue: 'Europe/Amsterdam',
              options: [
                { label: 'Amsterdam (CET/CEST)', value: 'Europe/Amsterdam' },
                { label: 'Brussel (CET/CEST)', value: 'Europe/Brussels' },
                { label: 'Londen (GMT/BST)', value: 'Europe/London' },
                { label: 'Berlijn (CET/CEST)', value: 'Europe/Berlin' },
                { label: 'Parijs (CET/CEST)', value: 'Europe/Paris' },
                { label: 'New York (EST/EDT)', value: 'America/New_York' },
                { label: 'Los Angeles (PST/PDT)', value: 'America/Los_Angeles' },
              ],
              admin: {
                description: 'Gebruikt voor ingeplande content en cron-jobs',
              },
            },
          ],
        },

        // ─── TAB 2: CONTACT & ADRES (GECONSOLIDEERD) ───────────────
        {
          label: 'Contact & Adres',
          description: 'Contactgegevens en bezoekadres',
          fields: [
            {
              name: 'email',
              type: 'email',
              required: true,
              label: 'E-mailadres',
              admin: {
                placeholder: 'info@uwbedrijf.nl',
              },
            },
            {
              name: 'phone',
              type: 'text',
              required: true,
              label: 'Telefoonnummer',
              admin: {
                placeholder: '0251-247233',
              },
            },
            {
              name: 'whatsapp',
              type: 'text',
              label: 'WhatsApp nummer',
              admin: {
                placeholder: '+31612345678',
                description: 'Voor WhatsApp Business integratie',
              },
            },
            {
              name: 'address',
              type: 'group',
              label: 'Adres',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  label: 'Straat + Huisnummer',
                  admin: {
                    placeholder: 'Industrieweg 12',
                  },
                },
                {
                  name: 'postalCode',
                  type: 'text',
                  label: 'Postcode',
                  admin: {
                    placeholder: '1234 AB',
                  },
                },
                {
                  name: 'city',
                  type: 'text',
                  label: 'Plaats',
                  admin: {
                    placeholder: 'Amsterdam',
                  },
                },
                {
                  name: 'country',
                  type: 'text',
                  defaultValue: 'Nederland',
                  label: 'Land',
                },
                {
                  name: 'showOnSite',
                  type: 'checkbox',
                  label: 'Toon op website',
                  defaultValue: true,
                  admin: {
                    description: 'Adres zichtbaar maken op contact pagina',
                  },
                },
              ],
            },
          ],
        },

        // ─── TAB 3: SOCIAL MEDIA ───────────────────────────────────
        {
          label: 'Social Media',
          description: 'Social media links',
          fields: [
            {
              name: 'facebook',
              type: 'text',
              label: 'Facebook URL',
              admin: {
                placeholder: 'https://facebook.com/uwbedrijf',
              },
            },
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram URL',
              admin: {
                placeholder: 'https://instagram.com/uwbedrijf',
              },
            },
            {
              name: 'linkedin',
              type: 'text',
              label: 'LinkedIn URL',
              admin: {
                placeholder: 'https://linkedin.com/company/uwbedrijf',
              },
            },
            {
              name: 'twitter',
              type: 'text',
              label: 'X (Twitter) URL',
              admin: {
                placeholder: 'https://twitter.com/uwbedrijf',
              },
            },
            {
              name: 'youtube',
              type: 'text',
              label: 'YouTube URL',
              admin: {
                placeholder: 'https://youtube.com/@uwbedrijf',
              },
            },
            {
              name: 'tiktok',
              type: 'text',
              label: 'TikTok URL',
              admin: {
                placeholder: 'https://tiktok.com/@uwbedrijf',
              },
            },
          ],
        },

        // ─── TAB 4: OPENINGSTIJDEN ─────────────────────────────────
        {
          label: 'Openingstijden',
          description: 'Kantoor/winkel openingstijden',
          fields: [
            {
              name: 'hours',
              type: 'array',
              label: 'Openingstijden',
              maxRows: 7,
              fields: [
                {
                  name: 'day',
                  type: 'select',
                  label: 'Dag',
                  options: [
                    { label: 'Maandag', value: 'monday' },
                    { label: 'Dinsdag', value: 'tuesday' },
                    { label: 'Woensdag', value: 'wednesday' },
                    { label: 'Donderdag', value: 'thursday' },
                    { label: 'Vrijdag', value: 'friday' },
                    { label: 'Zaterdag', value: 'saturday' },
                    { label: 'Zondag', value: 'sunday' },
                  ],
                },
                {
                  name: 'open',
                  type: 'checkbox',
                  label: 'Open',
                  defaultValue: true,
                },
                {
                  name: 'from',
                  type: 'text',
                  label: 'Van',
                  admin: {
                    placeholder: '09:00',
                  },
                },
                {
                  name: 'to',
                  type: 'text',
                  label: 'Tot',
                  admin: {
                    placeholder: '17:00',
                  },
                },
              ],
            },
            {
              name: 'hoursNote',
              type: 'text',
              label: 'Aanvullende info',
              admin: {
                placeholder: 'Bijv. "Op afspraak" of "Behalve feestdagen"',
              },
            },
          ],
        },

        // ─── TAB 5: TEMPLATES (Product, Blog, Shop Archive, Cart, Checkout, My Account) ──────────
        {
          label: 'Templates',
          description: 'Visuele templates voor alle pagina types',
          fields: [
            ...featureField('shop', {
              name: 'defaultProductTemplate',
              type: 'select',
              label: 'Standaard Product Template',
              defaultValue: 'template1',
              options: [
                { label: 'Template 1 - Enterprise (Volledig, B2B features)', value: 'template1' },
                { label: 'Template 2 - Minimal (Clean, modern)', value: 'template2' },
                { label: 'Template 3 - Luxury (Premium, elegant)', value: 'template3' },
                { label: 'Template 4 - Ultimate (18 componenten, 54 product-types ready)', value: 'template4' },
              ],
              admin: {
                description: 'Template voor product detail pagina\'s',
              },
            }),
            ...featureField('blog', {
              name: 'defaultBlogTemplate',
              type: 'select',
              label: 'Standaard Blog Template',
              defaultValue: 'blogtemplate1',
              options: [
                { label: 'Blog Template 1 - Magazine (2-kolom, sidebar)', value: 'blogtemplate1' },
                { label: 'Blog Template 2 - Minimal (Centered, clean)', value: 'blogtemplate2' },
                { label: 'Blog Template 3 - Premium (Wide, elegant)', value: 'blogtemplate3' },
              ],
              admin: {
                description: 'Template voor blog post pagina\'s',
              },
            }),
            ...featureField('shop', {
              name: 'defaultShopArchiveTemplate',
              type: 'select',
              label: 'Standaard Shop Archive Template',
              defaultValue: 'shoparchivetemplate1',
              options: [
                { label: 'Shop Archive Template 1 - Enterprise (Volledig, filters, stats)', value: 'shoparchivetemplate1' },
                // Template 2 and 3 will be added later
              ],
              admin: {
                description: 'Template voor shop/producten overzichtspagina',
              },
            }),
            ...featureField('brands', {
              name: 'defaultBrandsTemplate',
              type: 'select',
              label: 'Standaard Merken Template',
              defaultValue: 'brandstemplate1',
              options: [
                { label: 'Merken Template 1 - Enterprise (A-Z, featured, zoeken)', value: 'brandstemplate1' },
              ],
              admin: {
                description: 'Template voor merken overzicht- en detailpagina\'s',
              },
            }),
            ...featureField('shop', {
              name: 'defaultBranchesTemplate',
              type: 'select',
              label: 'Standaard Branches Template',
              defaultValue: 'branchestemplate1',
              options: [
                { label: 'Branches Template 1 - Enterprise (Hero, zoeken, grid)', value: 'branchestemplate1' },
              ],
              admin: {
                description: 'Template voor branches overzicht- en detailpagina\'s',
              },
            }),
            ...featureField('shop', {
              name: 'defaultLoginTemplate',
              type: 'select',
              label: 'Standaard Login/Registratie Template',
              defaultValue: 'logintemplate1',
              options: [
                { label: 'Login Template 1 - Tabs (Login/Registreren/Gast)', value: 'logintemplate1' },
              ],
              admin: {
                description: 'Template voor inlog- en registratiepagina\'s',
              },
            }),
            ...featureField('shop', {
              name: 'defaultRegisterTemplate',
              type: 'select',
              label: 'Standaard Klant Worden Template',
              defaultValue: 'registertemplate1',
              options: [
                { label: 'Register Template 1 - Multi-step wizard (4 stappen)', value: 'registertemplate1' },
              ],
              admin: {
                description: 'Template voor de "Klant worden" registratie wizard',
              },
            }),
            ...featureField('checkout', {
              name: 'checkoutFlow',
              type: 'select',
              label: 'Checkout Flow',
              defaultValue: 'premium',
              options: [
                { label: 'Premium — Visuele stepper, multi-step checkout', value: 'premium' },
                { label: 'Efficiënt — Compact B2B, one-step checkout', value: 'efficient' },
                { label: 'Klassiek — Card layout, one-step checkout', value: 'classic' },
              ],
              admin: {
                description: 'Bepaalt welke cart- en checkout templates samen worden gebruikt. Elke flow biedt een consistente ervaring van winkelwagen tot bevestiging.',
              },
            }),
            {
              name: 'defaultHeaderTemplate',
              type: 'select',
              label: 'Standaard Header Template',
              defaultValue: 'headertemplate1',
              options: [
                { label: 'Header Template 1 - Enterprise (Volledig, mega menu, mobile drawer)', value: 'headertemplate1' },
              ],
              admin: {
                description: 'Template voor de website header',
              },
            },
            {
              name: 'defaultMyAccountTemplate',
              type: 'select',
              label: 'Standaard My Account Template',
              defaultValue: 'enterprise',
              options: [
                { label: 'Enterprise — Dashboard met statistieken, sidebar navigatie', value: 'enterprise' },
              ],
              admin: {
                description: 'Template voor mijn account pagina\'s',
              },
            },
            ...featureField('magazines', {
              name: 'defaultMagazineArchiveTemplate',
              type: 'select',
              label: 'Standaard Magazine Archief Template',
              defaultValue: 'magazinearchivetemplate1',
              options: [
                { label: 'Magazine Archief Template 1 — Hero, featured, zoeken, grid', value: 'magazinearchivetemplate1' },
              ],
              admin: {
                description: 'Template voor het magazines overzicht',
              },
            }),
            ...featureField('magazines', {
              name: 'defaultMagazineDetailTemplate',
              type: 'select',
              label: 'Standaard Magazine Detail Template',
              defaultValue: 'magazinedetailtemplate1',
              options: [
                { label: 'Magazine Detail Template 1 — Hero, plannen, USPs, edities, testimonial', value: 'magazinedetailtemplate1' },
              ],
              admin: {
                description: 'Template voor magazine detailpagina\'s',
              },
            }),
            ...featureField('magazines', {
              name: 'defaultSubscriptionPricingTemplate',
              type: 'select',
              label: 'Standaard Abonnement Pricing Template',
              defaultValue: 'subscriptionpricingtemplate1',
              options: [
                { label: 'Pricing Template 1 — Plannen naast elkaar, FAQ, vergelijkingstabel', value: 'subscriptionpricingtemplate1' },
              ],
              admin: {
                description: 'Template voor de abonnement-prijzenpagina (/abonneren/[slug])',
              },
            }),
            ...featureField('magazines', {
              name: 'defaultSubscriptionCheckoutTemplate',
              type: 'select',
              label: 'Standaard Abonnement Checkout Template',
              defaultValue: 'subscriptioncheckouttemplate1',
              options: [
                { label: 'Checkout Template 1 — 2-kolom layout (plan kiezen + besteloverzicht)', value: 'subscriptioncheckouttemplate1' },
              ],
              admin: {
                description: 'Template voor de abonnement checkout (/abonneren/[slug]?plan=...)',
              },
            }),

            // ─── EXPERIENCES TEMPLATES & ROUTES ────────────────────────────
            ...featureField('experiences', {
              name: 'experiencesRouteSlug',
              type: 'text',
              label: 'Ervaringen Route URL',
              defaultValue: 'ervaringen',
              admin: {
                description: 'URL-prefix voor ervaringen pagina\'s. Bijv. "workshops", "arrangementen", "ervaringen". Let op: geen slash ervoor of erna.',
                placeholder: 'ervaringen',
              },
            }),
            ...featureField('experiences', {
              name: 'experiencesRouteLabel',
              type: 'text',
              label: 'Ervaringen Route Label',
              defaultValue: 'Ervaringen',
              admin: {
                description: 'Weergavenaam voor breadcrumbs en navigatie. Bijv. "Workshops", "Arrangementen", "Ervaringen"',
                placeholder: 'Ervaringen',
              },
            }),

            // ─── CONSTRUCTION TEMPLATES ─────────────────────────────────
            ...featureField('construction', {
              name: 'defaultConstructionServiceTemplate',
              type: 'select',
              label: 'Standaard Dienst Template (Bouw)',
              defaultValue: 'constructionservice1',
              options: [
                { label: 'Dienst Template 1 — 2-kolom layout (content + sidebar met offerte)', value: 'constructionservice1' },
              ],
              admin: {
                description: 'Template voor bouwdienst detailpagina\'s (/diensten/[slug])',
              },
            }),
            ...featureField('construction', {
              name: 'defaultConstructionProjectTemplate',
              type: 'select',
              label: 'Standaard Project Template (Bouw)',
              defaultValue: 'constructionproject1',
              options: [
                { label: 'Project Template 1 — Gallerij, specs, voor/na, timeline', value: 'constructionproject1' },
              ],
              admin: {
                description: 'Template voor bouwproject detailpagina\'s (/projecten/[slug])',
              },
            }),
            ...featureField('construction', {
              name: 'defaultConstructionProjectsArchiveTemplate',
              type: 'select',
              label: 'Standaard Projecten Overzicht Template (Bouw)',
              defaultValue: 'constructionprojectsarchive1',
              options: [
                { label: 'Projecten Archief Template 1 — Hero, filters, featured, grid', value: 'constructionprojectsarchive1' },
              ],
              admin: {
                description: 'Template voor de projecten overzichtspagina (/projecten)',
              },
            }),
            ...featureField('construction', {
              name: 'defaultConstructionServicesArchiveTemplate',
              type: 'select',
              label: 'Standaard Diensten Overzicht Template (Bouw)',
              defaultValue: 'constructionservicesarchive1',
              options: [
                { label: 'Diensten Archief Template 1 — Hero, grid, CTA', value: 'constructionservicesarchive1' },
              ],
              admin: {
                description: 'Template voor de diensten overzichtspagina (/diensten)',
              },
            }),
            ...featureField('construction', {
              name: 'defaultConstructionQuoteTemplate',
              type: 'select',
              label: 'Standaard Offerte Template (Bouw)',
              defaultValue: 'constructionquote1',
              options: [
                { label: 'Offerte Template 1 — Multi-step wizard + sidebar', value: 'constructionquote1' },
              ],
              admin: {
                description: 'Template voor de offerte-aanvraagpagina (/offerte-aanvragen)',
              },
            }),
          ],
        },

        // ─── TAB 6: CONTENT MODULES ────────────────────────────
        {
          label: 'Content Modules',
          description: 'Activeer en configureer content-modules. Labels en routes worden automatisch ingevuld o.b.v. uw branche.',
          fields: [
            // ── Branche selector ──
            {
              name: 'siteBranch',
              type: 'select',
              label: 'Branche',
              defaultValue: 'general',
              options: [
                { label: 'Algemeen', value: 'general' },
                { label: 'Tech / ICT', value: 'tech' },
                { label: 'Zakelijke Dienstverlening', value: 'dienstverlening' },
                { label: 'Bouw & Renovatie', value: 'bouw' },
                { label: 'Beauty & Wellness', value: 'beauty' },
                { label: 'Zorg & Fysiotherapie', value: 'zorg' },
                { label: 'Horeca & Restaurant', value: 'horeca' },
                { label: 'Ervaringen & Belevenissen', value: 'ervaringen' },
                { label: 'Marktplaats', value: 'marketplace' },
              ],
              admin: {
                description: 'Bepaalt standaard labels, URL-routes en conditionele velden voor alle content-modules',
              },
            },

            // ── Module 1: Diensten ──
            {
              name: 'servicesModule',
              type: 'group',
              label: 'Diensten / Behandelingen / Services',
              admin: {
                description: 'Diensten, behandelingen, services — afhankelijk van uw branche',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Actief',
                  defaultValue: false,
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Sidebar label',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    placeholder: 'Automatisch o.b.v. branche (bijv. "Diensten", "Behandelingen")',
                  },
                },
                {
                  name: 'routeSlug',
                  type: 'text',
                  label: 'URL prefix',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    placeholder: 'Automatisch o.b.v. branche (bijv. "diensten", "behandelingen")',
                    description: 'Wordt gebruikt als URL: /[prefix]/[slug]',
                  },
                },
              ],
            },

            // ── Module 2: Cases / Portfolio / Projecten ──
            {
              name: 'casesModule',
              type: 'group',
              label: 'Cases / Portfolio / Projecten',
              admin: {
                description: 'Cases, portfolio, projecten — dezelfde collection, andere naamgeving per branche',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Actief',
                  defaultValue: false,
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Sidebar label',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    placeholder: 'Automatisch (bijv. "Projecten", "Cases", "Portfolio")',
                  },
                },
                {
                  name: 'routeSlug',
                  type: 'text',
                  label: 'URL prefix',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    placeholder: 'Automatisch (bijv. "projecten", "cases", "portfolio")',
                    description: 'Wordt gebruikt als URL: /[prefix]/[slug]',
                  },
                },
              ],
            },

            // ── Module 3: Reviews / Testimonials ──
            {
              name: 'reviewsModule',
              type: 'group',
              label: 'Reviews & Testimonials',
              admin: {
                description: 'Klantreviews en testimonials (geen eigen pagina, getoond op dienst- en casepagina\'s)',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Actief',
                  defaultValue: false,
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Sidebar label',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    placeholder: 'Automatisch (bijv. "Reviews", "Testimonials")',
                  },
                },
              ],
            },

            // ── Module 4: Aanvragen / Offertes ──
            {
              name: 'inquiriesModule',
              type: 'group',
              label: 'Offertes & Aanvragen',
              admin: {
                description: 'Offerteaanvragen, adviesgesprekken, consultatie-aanvragen',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Actief',
                  defaultValue: false,
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Sidebar label',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    placeholder: 'Automatisch (bijv. "Offerteaanvragen", "Adviesgesprekken")',
                  },
                },
                {
                  name: 'routeSlug',
                  type: 'text',
                  label: 'URL prefix',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    placeholder: 'Automatisch (bijv. "offerte-aanvragen", "adviesgesprek")',
                    description: 'Wordt gebruikt als URL: /[prefix]',
                  },
                },
              ],
            },

            // ── Module 5: Boekingen / Reserveringen / Afspraken ──
            {
              name: 'bookingsModule',
              type: 'group',
              label: 'Boekingen & Reserveringen',
              admin: {
                description: 'Boekingen, reserveringen, afspraken',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Actief',
                  defaultValue: false,
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Sidebar label',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    placeholder: 'Automatisch (bijv. "Boekingen", "Reserveringen", "Afspraken")',
                  },
                },
                {
                  name: 'routeSlug',
                  type: 'text',
                  label: 'URL prefix',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    placeholder: 'Automatisch (bijv. "boeken", "reserveren", "afspraak-maken")',
                    description: 'Wordt gebruikt als URL: /[prefix]',
                  },
                },
              ],
            },

            // ── Module 6: Team / Medewerkers ──
            {
              name: 'teamModule',
              type: 'group',
              label: 'Team & Medewerkers',
              admin: {
                description: 'Teamleden, stylisten, behandelaars, gidsen',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Actief',
                  defaultValue: false,
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Sidebar label',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    placeholder: 'Automatisch (bijv. "Team", "Stylisten", "Behandelaars")',
                  },
                },
                {
                  name: 'routeSlug',
                  type: 'text',
                  label: 'URL prefix',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    placeholder: 'Automatisch (bijv. "team")',
                    description: 'Wordt gebruikt als URL: /[prefix]/[slug]',
                  },
                },
              ],
            },

            // ── Module 7: Activiteiten / Events / Workshops ──
            {
              name: 'activitiesModule',
              type: 'group',
              label: 'Activiteiten & Events',
              admin: {
                description: 'Evenementen, ervaringen, workshops, open dagen',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Actief',
                  defaultValue: false,
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Sidebar label',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    placeholder: 'Automatisch (bijv. "Evenementen", "Ervaringen", "Workshops")',
                  },
                },
                {
                  name: 'routeSlug',
                  type: 'text',
                  label: 'URL prefix',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    placeholder: 'Automatisch (bijv. "evenementen", "ervaringen")',
                    description: 'Wordt gebruikt als URL: /[prefix]/[slug]',
                  },
                },
              ],
            },
          ],
        },

        // ─── TAB 7: TRUST BADGES & CERTIFICATEN ────────────────────
        {
          label: 'Trust Badges',
          description: 'Certificaten, keurmerken en vertrouwen',
          fields: [
            {
              name: 'certifications',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Certificaten & Keurmerken',
              admin: {
                description: 'Bijv: ISO, CE, Thuiswinkel Waarborg badges',
              },
            },
            {
              name: 'paymentMethods',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: "Betaalmethode Logo's",
              admin: {
                description: 'iDEAL, Visa, Mastercard, etc.',
              },
            },
            {
              name: 'trustIndicators',
              type: 'group',
              label: 'Vertrouwensindicatoren',
              fields: [
                {
                  name: 'trustScore',
                  type: 'number',
                  label: 'Waarderingscijfer',
                  admin: {
                    step: 0.1,
                    placeholder: '4.8',
                  },
                },
                {
                  name: 'trustSource',
                  type: 'text',
                  label: 'Bron',
                  admin: {
                    placeholder: 'Google Reviews',
                  },
                },
                {
                  name: 'yearsInBusiness',
                  type: 'number',
                  label: 'Jaren actief',
                  admin: {
                    placeholder: '30',
                  },
                },
                {
                  name: 'customersServed',
                  type: 'number',
                  label: 'Aantal klanten',
                  admin: {
                    placeholder: '5000',
                  },
                },
              ],
            },
          ],
        },

        // ─── TAB 7: BRANDING ──────────────────────────────────────
        {
          label: 'Branding',
          description: "Logo's en kleuren (alleen admin)",
          access: {
            update: ({ req: { user } }) => checkRole(['admin'], user),
          },
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              admin: {
                description: 'Primaire logo voor de website',
              },
            },
            {
              name: 'logoWhite',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo (wit)',
              admin: {
                description: 'Witte versie voor donkere achtergronden',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
              admin: {
                description: 'Browser tab icoon (32x32 of 64x64 PNG)',
              },
            },
            {
              name: 'primaryColor',
              type: 'text',
              label: 'Primaire kleur (hex)',
              admin: {
                placeholder: '#0066CC',
                description: 'Hoofdkleur van uw huisstijl',
              },
            },
            {
              name: 'accentColor',
              type: 'text',
              label: 'Accentkleur (hex)',
              admin: {
                placeholder: '#FF6B00',
                description: 'Secundaire kleur voor accenten',
              },
            },
          ],
        },

        // ─── TAB 8: PWA & MELDINGEN ──────────────────────────────
        {
          label: 'PWA & Meldingen',
          description: 'Progressive Web App en push notificatie instellingen',
          fields: [
            {
              name: 'pwaInstallPrompt',
              type: 'checkbox',
              label: 'Installatie-banner tonen',
              defaultValue: false,
              admin: {
                description: 'Toon "Voeg toe aan startscherm" banner aan bezoekers',
              },
            },
            {
              name: 'pwaPushNotifications',
              type: 'checkbox',
              label: 'Push notificaties aanbieden',
              defaultValue: false,
              admin: {
                description: 'Vraag bezoekers of ze push meldingen willen ontvangen',
              },
            },
          ],
        },

        // ─── TAB 9: TRACKING ──────────────────────────────────────
        {
          label: 'Tracking',
          description: 'Analytics en tracking codes (alleen admin)',
          access: {
            update: ({ req: { user } }) => checkRole(['admin'], user),
          },
          fields: [
            {
              name: 'ga4Id',
              type: 'text',
              label: 'Google Analytics 4 ID',
              admin: {
                placeholder: 'G-XXXXXXXXXX',
              },
            },
            {
              name: 'gtmId',
              type: 'text',
              label: 'Google Tag Manager ID',
              admin: {
                placeholder: 'GTM-XXXXXXX',
              },
            },
            {
              name: 'facebookPixel',
              type: 'text',
              label: 'Facebook Pixel ID',
              admin: {
                placeholder: '123456789012345',
              },
            },
          ],
        },

        // ─── TAB 9: SEO ───────────────────────────────────────────
        {
          label: 'SEO',
          description: 'Zoekmachine optimalisatie instellingen',
          access: {
            update: ({ req: { user } }) => checkRole(['admin'], user),
          },
          fields: [
            // ─── Google Verificatie ───────────────────────────────
            {
              name: 'googleSiteVerification',
              type: 'text',
              label: 'Google Site Verification Code',
              admin: {
                placeholder: 'abc123...',
                description: 'Van Google Search Console voor eigendom verificatie',
              },
            },

            // ─── Default SEO Values ────────────────────────────────
            {
              name: 'defaultMetaDescription',
              type: 'textarea',
              label: 'Standaard Meta Beschrijving',
              admin: {
                rows: 3,
                description: 'Gebruikt als fallback voor pagina\'s zonder eigen beschrijving',
              },
            },
            {
              name: 'defaultOGImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Standaard Open Graph Afbeelding',
              admin: {
                description: 'Voor social sharing (1200x630px aanbevolen)',
              },
            },

            // ─── Archive Page SEO ────────────────────────────────
            {
              name: 'archiveSeo',
              type: 'group',
              label: 'Archief Pagina SEO',
              admin: {
                description: 'SEO instellingen voor overzichtspagina\'s (shop, merken, branches)',
              },
              fields: [
                {
                  name: 'shopTitle',
                  type: 'text',
                  label: 'Shop - Meta Title',
                  admin: {
                    description: 'SEO titel voor /shop',
                  },
                },
                {
                  name: 'shopDescription',
                  type: 'textarea',
                  label: 'Shop - Meta Beschrijving',
                  maxLength: 160,
                  admin: {
                    description: 'SEO beschrijving voor /shop',
                  },
                },
                {
                  name: 'brandsTitle',
                  type: 'text',
                  label: 'Merken - Meta Title',
                  admin: {
                    description: 'SEO titel voor /merken',
                  },
                },
                {
                  name: 'brandsDescription',
                  type: 'textarea',
                  label: 'Merken - Meta Beschrijving',
                  maxLength: 160,
                  admin: {
                    description: 'SEO beschrijving voor /merken',
                  },
                },
                {
                  name: 'branchesTitle',
                  type: 'text',
                  label: 'Branches - Meta Title',
                  admin: {
                    description: 'SEO titel voor /branches',
                  },
                },
                {
                  name: 'branchesDescription',
                  type: 'textarea',
                  label: 'Branches - Meta Beschrijving',
                  maxLength: 160,
                  admin: {
                    description: 'SEO beschrijving voor /branches',
                  },
                },
              ],
            },

            // ─── Structured Data ───────────────────────────────────
            {
              name: 'businessCategory',
              type: 'text',
              label: 'Business Categorie',
              admin: {
                placeholder: 'Medical Equipment Supplier',
                description: 'Voor LocalBusiness schema.org markup',
              },
            },
            {
              name: 'geo',
              type: 'group',
              label: 'Geo Coördinaten',
              admin: {
                description: 'Voor LocalBusiness schema - helpt Google Maps integratie',
              },
              fields: [
                {
                  name: 'latitude',
                  type: 'number',
                  label: 'Latitude',
                  admin: {
                    placeholder: '52.3676',
                    description: 'Breedtegraad (decimaal)',
                  },
                },
                {
                  name: 'longitude',
                  type: 'number',
                  label: 'Longitude',
                  admin: {
                    placeholder: '4.9041',
                    description: 'Lengtegraad (decimaal)',
                  },
                },
              ],
            },
            {
              name: 'priceRange',
              type: 'text',
              label: 'Prijsklasse',
              admin: {
                placeholder: '€€ - €€€',
                description: 'Voor LocalBusiness schema (optioneel)',
              },
            },

            // ─── Sitemap Settings ──────────────────────────────────
            {
              name: 'sitemapEnabled',
              type: 'checkbox',
              label: 'Sitemap Inschakelen',
              defaultValue: true,
              admin: {
                description: 'Automatische sitemap.xml generatie',
              },
            },
            {
              name: 'sitemapExclude',
              type: 'array',
              label: 'Pagina\'s Uitsluiten van Sitemap',
              admin: {
                description: 'Voeg slugs toe die NIET in sitemap moeten (bijv: "preview", "test")',
              },
              fields: [
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'preview',
                  },
                },
              ],
            },

            // ─── Robots.txt Settings ───────────────────────────────
            {
              name: 'robotsDisallow',
              type: 'array',
              label: 'Robots.txt Extra Disallow Paths',
              admin: {
                description: 'Extra paths om te blokkeren (naast /admin en /api)',
              },
              fields: [
                {
                  name: 'path',
                  type: 'text',
                  admin: {
                    placeholder: '/private',
                  },
                },
              ],
            },

            // ─── Advanced Features ─────────────────────────────────
            {
              name: 'enableAutoOGImages',
              type: 'checkbox',
              label: 'Automatische OG Images',
              defaultValue: true,
              admin: {
                description: 'Genereer automatisch branded OG images voor pagina\'s zonder eigen afbeelding',
              },
            },
            {
              name: 'enableJSONLD',
              type: 'checkbox',
              label: 'JSON-LD Structured Data',
              defaultValue: true,
              admin: {
                description: 'Automatische schema.org markup voor betere Google rich results',
              },
            },
          ],
        },

        // ─── TAB: SUPPORT (feature-gated) ──────────────────────────
        ...featureTab('support', {
          label: 'Support',
          description: 'Ticketsysteem en chatbot instellingen',
          fields: [
            {
              name: 'supportEnableTickets',
              type: 'checkbox',
              label: 'Ticketsysteem inschakelen',
              defaultValue: true,
              admin: {
                description: 'Klanten kunnen support tickets aanmaken in hun account',
              },
            },
            {
              name: 'supportEnableChatbotEscalation',
              type: 'checkbox',
              label: 'Chatbot escalatie',
              defaultValue: true,
              admin: {
                description: 'Chatbot gesprekken kunnen worden geëscaleerd naar tickets',
              },
            },
            {
              name: 'supportEnableRating',
              type: 'checkbox',
              label: 'Tevredenheidsbeoordeling',
              defaultValue: true,
              admin: {
                description: 'Klanten kunnen opgeloste tickets beoordelen (1-5 sterren)',
              },
            },
            {
              name: 'supportDefaultCategory',
              type: 'relationship',
              relationTo: 'support-categories',
              label: 'Standaard categorie',
              admin: {
                description: 'Categorie voor tickets zonder specifieke categorie',
              },
            },
            {
              name: 'supportAutoCloseAfterDays',
              type: 'number',
              label: 'Automatisch sluiten na (dagen)',
              defaultValue: 14,
              admin: {
                description: 'Opgeloste tickets worden automatisch gesloten na dit aantal dagen',
              },
            },
            {
              name: 'supportBusinessHours',
              type: 'group',
              label: 'Kantooruren',
              fields: [
                {
                  name: 'start',
                  type: 'text',
                  label: 'Start',
                  defaultValue: '09:00',
                  admin: { placeholder: '09:00' },
                },
                {
                  name: 'end',
                  type: 'text',
                  label: 'Eind',
                  defaultValue: '17:00',
                  admin: { placeholder: '17:00' },
                },
              ],
            },
            {
              name: 'supportOutOfHoursMessage',
              type: 'textarea',
              label: 'Bericht buiten kantooruren',
              admin: {
                rows: 3,
                placeholder: 'Wij zijn momenteel gesloten. Uw ticket wordt de eerstvolgende werkdag opgepakt.',
              },
            },
          ],
        }),
      ],
    },
  ],
}
