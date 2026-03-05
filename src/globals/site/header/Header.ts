import type { GlobalConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'
import { featureField } from '@/lib/featureFields'

/**
 * Header Global Configuration (v2 - Clean Slate)
 *
 * Complete header system with flexible layouts, mega navigation,
 * language switching, price toggle, and full mobile support.
 *
 * Created: 24 February 2026
 * Architecture: Tab-based configuration with 10 organized sections
 */
export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header & Navigatie',
  admin: {
    group: 'Ontwerp',
    description:
      'Complete header configuratie: Topbar, Navigation, Search, Mobile Drawer, Talen & Prijzen',
    hidden: !isClientDeployment(),
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ═══════════════════════════════════════════════════════════════════════
        // TAB 1: TOPBAR
        // ═══════════════════════════════════════════════════════════════════════
        {
          label: 'Topbar',
          description: 'USP berichten, links, taalwisselaar en prijs toggle',
          fields: [
            // ── Basis instellingen ──
            {
              name: 'topbarEnabled',
              type: 'checkbox',
              label: 'Topbar Actief',
              defaultValue: true,
              admin: {
                description:
                  'Schakel de topbar in of uit. De topbar toont USP berichten, links en taalwisselaar.',
              },
            },
            {
              name: 'topbarBgColor',
              type: 'text',
              label: 'Achtergrondkleur',
              defaultValue: 'var(--color-primary)',
              admin: {
                description:
                  'CSS variabele (bijv: var(--color-primary)) of hex code (#0A1628). Gebruik CSS vars voor theme compliance!',
                condition: (data) => data.topbarEnabled === true,
              },
            },
            {
              name: 'topbarTextColor',
              type: 'text',
              label: 'Tekstkleur',
              defaultValue: 'var(--color-white)',
              admin: {
                description: 'CSS variabele of hex code. Gebruik var(--color-white) aanbevolen.',
                condition: (data) => data.topbarEnabled === true,
              },
            },

            // ── USP Berichten (links) ──
            {
              name: 'topbarMessages',
              type: 'array',
              label: 'USP Berichten (Links)',
              maxRows: 4,
              admin: {
                description:
                  'USP berichten aan de linkerkant (bijv: "Gratis verzending vanaf €150")',
                condition: (data) => data.topbarEnabled === true,
              },
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon',
                  admin: {
                    components: {
                      Field: '@/branches/shared/components/admin/fields/IconPickerField',
                    },
                  },
                },
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Tekst',
                  admin: {
                    placeholder: 'Gratis verzending vanaf €150',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Link (optioneel)',
                  admin: {
                    placeholder: '/verzending',
                  },
                },
              ],
            },

            // ── Rechter Links ──
            {
              name: 'topbarRightLinks',
              type: 'array',
              label: 'Rechter Links',
              maxRows: 3,
              admin: {
                description:
                  'Actie links aan de rechterkant (bijv: "Klant worden", "Contact"). Verschijnen VOOR de taalwisselaar/prijs toggle.',
                condition: (data) => data.topbarEnabled === true,
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Label',
                  admin: {
                    placeholder: 'Klant worden',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  required: true,
                  label: 'Link',
                  admin: {
                    placeholder: '/klant-worden',
                  },
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon (optioneel)',
                  admin: {
                    components: {
                      Field: '@/branches/shared/components/admin/fields/IconPickerField',
                    },
                  },
                },
              ],
            },

            // ── Taalwisselaar ──
            {
              name: 'languages',
              type: 'array',
              label: 'Beschikbare Talen',
              maxRows: 8,
              admin: {
                description: 'Configureer beschikbare talen. Als er talen zijn ingesteld, wordt automatisch een taalwisselaar getoond. Eerste taal met isDefault=true wordt standaard.',
                condition: (data) => data.topbarEnabled === true,
              },
              fields: [
                {
                  name: 'code',
                  type: 'text',
                  required: true,
                  label: 'Taalcode',
                  admin: {
                    placeholder: 'NL',
                    description: 'Hoofdletters (NL, EN, DE, FR, ES, IT, etc.)',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Label',
                  admin: {
                    placeholder: 'Nederlands',
                  },
                },
                {
                  name: 'flag',
                  type: 'text',
                  label: 'Vlag Emoji',
                  admin: {
                    placeholder: '🇳🇱',
                    description: 'Optioneel maar aanbevolen voor visuele herkenning',
                  },
                },
                {
                  name: 'isDefault',
                  type: 'checkbox',
                  label: 'Standaard Taal',
                  defaultValue: false,
                  admin: {
                    description: 'Slechts 1 taal mag default zijn',
                  },
                },
              ],
            },

          ],
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TAB 3: ALERT BAR
        // ═══════════════════════════════════════════════════════════════════════
        {
          label: 'Alert Bar',
          description: 'Belangrijke mededelingen bovenaan de site',
          fields: [
            {
              name: 'alertBarEnabled',
              type: 'checkbox',
              defaultValue: false,
              label: 'Alert Bar Tonen',
              admin: {
                description:
                  'Toon een alert bar bovenaan alle pagina\'s (boven topbar) met een belangrijke mededeling.',
              },
            },
            {
              name: 'alertBarMessage',
              type: 'text',
              required: true,
              label: 'Bericht',
              admin: {
                description: 'De boodschap die getoond wordt',
                condition: (data) => data.alertBarEnabled === true,
              },
            },
            {
              name: 'alertBarType',
              type: 'select',
              defaultValue: 'info',
              label: 'Type',
              options: [
                { label: 'Informatie (blauw)', value: 'info' },
                { label: 'Succes (groen)', value: 'success' },
                { label: 'Waarschuwing (geel)', value: 'warning' },
                { label: 'Fout (rood)', value: 'error' },
                { label: 'Promotie (teal)', value: 'promo' },
              ],
              admin: {
                description: 'Type bepaalt de kleur (tenzij custom colors ingeschakeld)',
                condition: (data) => data.alertBarEnabled === true,
              },
            },
            {
              name: 'alertBarIcon',
              type: 'text',
              label: 'Icon',
              admin: {
                components: {
                  Field: '@/branches/shared/components/admin/fields/IconPickerField',
                },
                condition: (data) => data.alertBarEnabled === true,
              },
            },
            {
              name: 'alertBarDismissible',
              type: 'checkbox',
              defaultValue: true,
              label: 'Wegklikbaar',
              admin: {
                description: 'Gebruikers kunnen de alert sluiten (wordt opgeslagen in localStorage)',
                condition: (data) => data.alertBarEnabled === true,
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TAB 4: LOGO & BRANDING
        // ═══════════════════════════════════════════════════════════════════════
        {
          label: 'Logo & Branding',
          description: 'Logo, sitenaam en branding instellingen',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              admin: {
                description:
                  'Upload het site logo. Laat leeg om het logo uit Site Settings te gebruiken. PNG/SVG aanbevolen.',
              },
            },
            {
              name: 'logoHeight',
              type: 'number',
              label: 'Logo Hoogte (px)',
              defaultValue: 32,
              min: 20,
              max: 60,
              admin: {
                description:
                  'Logo hoogte in pixels. 32px = standaard, 40-48px = groot, 20-28px = klein. Breedte schaalt automatisch.',
              },
            },
            {
              name: 'logoUrl',
              type: 'text',
              label: 'Logo Link',
              defaultValue: '/',
              admin: {
                description: 'URL waar het logo naartoe linkt. Standaard: homepage (/).',
                placeholder: '/',
              },
            },
            {
              name: 'siteName',
              type: 'text',
              label: 'Sitenaam Override',
              admin: {
                description:
                  'Optioneel: Overschrijf sitenaam alleen voor header. Laat leeg om sitenaam uit Site Settings te gebruiken.',
                placeholder: 'Mijn Bedrijf',
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TAB 5: NAVIGATIE
        // ═══════════════════════════════════════════════════════════════════════
        {
          label: 'Navigatie',
          description: 'Hoofdmenu configuratie: handmatig, categorie-gedreven of hybride',
          fields: [
            {
              name: 'navigationEnabled',
              type: 'checkbox',
              label: 'Navigatie Actief',
              defaultValue: true,
              admin: {
                description: 'Schakel de hoofdnavigatie in of uit.',
              },
            },
            {
              name: 'navigationMode',
              type: 'select',
              label: 'Navigatie Modus',
              defaultValue: 'manual',
              required: true,
              options: [
                {
                  label: 'Handmatig - Zelf menu items beheren',
                  value: 'manual',
                },
                {
                  label: 'Categorie-gedreven - Automatisch uit product categorieën',
                  value: 'categories',
                },
                {
                  label: 'Hybride - Categorieën + extra handmatige items',
                  value: 'hybrid',
                },
              ],
              admin: {
                description:
                  'Handmatig: Je beheert alle items zelf. Categorie-gedreven: Automatisch uit Products categorieën (ideaal voor webshops). Hybride: Beste van beide werelden.',
              },
            },

            // ── Categorie Settings ──
            {
              name: 'categoryNavigation',
              type: 'group',
              label: 'Categorie Navigatie Instellingen',
              admin: {
                description: 'Configureer hoe product categorieën in de navigatie worden getoond',
                condition: (data) =>
                  data.navigationMode === 'categories' || data.navigationMode === 'hybrid',
              },
              fields: [
                {
                  name: 'showCategoryIcons',
                  type: 'checkbox',
                  label: 'Toon categorie icons',
                  defaultValue: true,
                  admin: {
                    description: 'Toon emoji/icons voor elke categorie in de navigatiebalk',
                  },
                },
                {
                  name: 'megaMenuStyle',
                  type: 'select',
                  label: 'Mega Menu Stijl',
                  defaultValue: 'subcategories',
                  required: true,
                  options: [
                    {
                      label: 'Alleen subcategorieën',
                      value: 'subcategories',
                    },
                    {
                      label: 'Subcategorieën + populaire producten',
                      value: 'with-products',
                    },
                    {
                      label: 'Volledig (subcategorieën + producten + promo banner)',
                      value: 'full',
                    },
                  ],
                  admin: {
                    description: 'Bepaalt hoeveel content er in het mega menu wordt getoond',
                  },
                },
                {
                  name: 'maxCategories',
                  type: 'number',
                  label: 'Max aantal categorieën',
                  defaultValue: 8,
                  min: 1,
                  max: 12,
                  admin: {
                    description:
                      'Maximaal aantal categorieën in de navigatiebalk (1-12). Te veel items passen niet op het scherm.',
                  },
                },
              ],
            },

            // ── Speciale Nav Items ──
            {
              name: 'specialNavItems',
              type: 'array',
              label: 'Speciale Navigatie Items',
              maxRows: 3,
              admin: {
                description:
                  'Extra items zoals "Aanbiedingen", "Nieuw", etc. Deze verschijnen altijd in de navigatie, ongeacht de modus.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Label',
                  admin: {
                    placeholder: 'Aanbiedingen',
                  },
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon',
                  admin: {
                    components: {
                      Field: '@/branches/shared/components/admin/fields/IconPickerField',
                    },
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'Link',
                  admin: {
                    placeholder: '/aanbiedingen',
                  },
                },
                {
                  name: 'highlight',
                  type: 'checkbox',
                  label: 'Highlight (opvallende kleur)',
                  defaultValue: false,
                  admin: {
                    description: 'Toont in accent kleur (bijv. coral/teal) voor extra aandacht',
                  },
                },
              ],
            },

            // ── Handmatige Nav Items ──
            {
              name: 'manualNavItems',
              type: 'array',
              label: 'Handmatige Menu Items',
              maxRows: 10,
              admin: {
                description:
                  'Zelf menu items toevoegen. In hybride modus worden deze getoond naast de categorie items.',
                condition: (data) =>
                  data.navigationMode === 'manual' || data.navigationMode === 'hybrid',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Menu Tekst',
                  admin: {
                    placeholder: 'Producten',
                  },
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon (optioneel)',
                  admin: {
                    components: {
                      Field: '@/branches/shared/components/admin/fields/IconPickerField',
                    },
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  label: 'Link Type',
                  defaultValue: 'page',
                  options: [
                    { label: 'Pagina', value: 'page' },
                    { label: 'Externe URL', value: 'external' },
                    { label: 'Mega Menu (meerdere kolommen)', value: 'mega' },
                  ],
                },
                {
                  name: 'page',
                  type: 'relationship',
                  relationTo: 'pages',
                  label: 'Pagina',
                  admin: {
                    condition: (data, siblingData) => siblingData?.type === 'page',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  admin: {
                    condition: (data, siblingData) => siblingData?.type === 'external',
                  },
                },
                {
                  name: 'megaColumns',
                  type: 'array',
                  label: 'Mega Menu Kolommen',
                  maxRows: 4,
                  admin: {
                    description: 'Voeg meerdere kolommen toe voor een mega dropdown menu',
                    condition: (data, siblingData) => siblingData?.type === 'mega',
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Kolom Titel',
                      admin: {
                        placeholder: 'Productgroep',
                      },
                    },
                    {
                      name: 'links',
                      type: 'array',
                      label: 'Links in deze kolom',
                      maxRows: 8,
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                          label: 'Label',
                        },
                        {
                          name: 'url',
                          type: 'text',
                          required: true,
                          label: 'URL',
                        },
                        {
                          name: 'icon',
                          type: 'text',
                          label: 'Icon (Lucide naam)',
                          admin: {
                            placeholder: 'Package',
                          },
                        },
                        {
                          name: 'description',
                          type: 'textarea',
                          label: 'Beschrijving (optioneel)',
                          maxLength: 100,
                          admin: {
                            placeholder: 'Korte beschrijving van deze link',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'subItems',
                  type: 'array',
                  label: 'Submenu Items',
                  maxRows: 8,
                  admin: {
                    description: 'Simpele dropdown (geen mega menu)',
                    condition: (data, siblingData) =>
                      siblingData?.type === 'page' || siblingData?.type === 'external',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      label: 'Menu Tekst',
                    },
                    {
                      name: 'page',
                      type: 'relationship',
                      relationTo: 'pages',
                      label: 'Pagina',
                    },
                  ],
                },
              ],
            },

            // ── CTA Button ──
            {
              name: 'ctaButton',
              type: 'group',
              label: 'CTA Knop (rechtsboven navigatie)',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Toon CTA Knop',
                  defaultValue: false,
                  admin: {
                    description:
                      'Toon een opvallende CTA knop rechts in de navigatiebalk (bijv. "Contact", "Offerte aanvragen")',
                  },
                },
                {
                  name: 'text',
                  type: 'text',
                  label: 'Knoptekst',
                  defaultValue: 'Contact',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Link',
                  defaultValue: '/contact',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'style',
                  type: 'select',
                  label: 'Knop Stijl',
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primary (opvallend, brand kleur)', value: 'primary' },
                    { label: 'Secondary (subtiel)', value: 'secondary' },
                    { label: 'Outline (omlijnd)', value: 'outline' },
                  ],
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TAB 6: ZOEKEN
        // ═══════════════════════════════════════════════════════════════════════
        {
          label: 'Zoeken',
          description: 'Zoekbalk, overlay en sneltoetsen',
          fields: [
            {
              name: 'searchEnabled',
              type: 'checkbox',
              label: 'Zoeken Actief',
              defaultValue: true,
              admin: {
                description:
                  'Schakel de zoekfunctie in de header in of uit.',
              },
            },
            {
              name: 'searchPlaceholder',
              type: 'text',
              label: 'Placeholder Tekst',
              defaultValue: 'Zoeken naar producten...',
              admin: {
                placeholder: 'Zoeken naar producten...',
                condition: (data) => data.searchEnabled === true,
              },
            },
            {
              name: 'enableSearchSuggestions',
              type: 'checkbox',
              label: 'Toon Zoeksuggesties',
              defaultValue: true,
              admin: {
                description: 'Autocomplete suggesties tijdens het typen',
                condition: (data) => data.searchEnabled === true,
              },
            },
            // ── Prijs Toggle (B2B/B2C) — embedded in zoekbalk ──
            {
              name: 'enablePriceToggle',
              type: 'checkbox',
              label: 'Toon Prijs Wisselaar (B2B/B2C)',
              defaultValue: false,
              admin: {
                description:
                  'Prijs wisselaar in de zoekbalk (rechts). Gebruikers kunnen schakelen tussen particuliere en zakelijke prijzen.',
                condition: (data) => data.searchEnabled === true,
              },
            },
            {
              name: 'priceToggle',
              type: 'group',
              label: 'Prijs Wisselaar Instellingen',
              admin: {
                condition: (data) => data.enablePriceToggle === true,
              },
              fields: [
                {
                  name: 'defaultMode',
                  type: 'select',
                  label: 'Standaard Modus',
                  defaultValue: 'b2c',
                  options: [
                    { label: 'B2C (Particulier)', value: 'b2c' },
                    { label: 'B2B (Zakelijk)', value: 'b2b' },
                  ],
                },
                {
                  name: 'b2cLabel',
                  type: 'text',
                  label: 'B2C Label',
                  defaultValue: 'Particulier',
                  admin: {
                    placeholder: 'Particulier',
                  },
                },
                {
                  name: 'b2bLabel',
                  type: 'text',
                  label: 'B2B Label',
                  defaultValue: 'Zakelijk',
                  admin: {
                    placeholder: 'Zakelijk',
                  },
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TAB 7: HEADER ACTIES
        // ═══════════════════════════════════════════════════════════════════════
        {
          label: 'Header Acties',
          description: 'Winkelwagen, account, wishlist en custom knoppen',
          fields: [
            // ── Standaard Acties ──
            {
              name: 'showPhoneButton',
              type: 'checkbox',
              label: 'Toon Telefoon Knop',
              defaultValue: true,
              admin: {
                description:
                  'Toon telefoon knop met nummer uit Shop Settings. Op mobile: click-to-call link.',
              },
            },
            ...featureField('checkout', {
              name: 'showCartButton',
              type: 'checkbox',
              label: 'Toon Winkelwagen Knop',
              defaultValue: true,
              admin: {
                description: 'Toon winkelwagen icon met badge (aantal items).',
              },
            }),
            {
              name: 'showAccountButton',
              type: 'checkbox',
              label: 'Toon Account Knop',
              defaultValue: true,
              admin: {
                description: 'Toon account/login knop. Als ingelogd: dropdown met account opties.',
              },
            },
            ...featureField('shop', {
              name: 'showWishlistButton',
              type: 'checkbox',
              label: 'Toon Wishlist Knop',
              defaultValue: false,
              admin: {
                description: 'Toon wishlist/favorieten knop met badge (aantal items).',
              },
            }),

            // ── Custom Action Buttons ──
            {
              name: 'customActionButtons',
              type: 'array',
              label: 'Custom Actie Knoppen',
              maxRows: 4,
              admin: {
                description:
                  'Voeg extra actie knoppen toe (bijv. "Vergelijk", "Downloads", etc.). Verschijnen NA de standaard knoppen.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Label',
                  admin: {
                    placeholder: 'Vergelijk',
                    description: 'Voor accessibility (screen readers)',
                  },
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon',
                  required: true,
                  admin: {
                    components: {
                      Field: '@/branches/shared/components/admin/fields/IconPickerField',
                    },
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'Link',
                  admin: {
                    placeholder: '/vergelijken',
                  },
                },
                {
                  name: 'showOnMobile',
                  type: 'checkbox',
                  label: 'Toon op Mobile',
                  defaultValue: true,
                  admin: {
                    description: 'Toon deze knop ook op mobile (<768px)? Ruimte is beperkt!',
                  },
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TAB 8: MOBILE
        // ═══════════════════════════════════════════════════════════════════════
        {
          label: 'Mobile',
          description: 'Mobile drawer, hamburger menu en responsive settings',
          fields: [
            {
              name: 'mobileDrawerWidth',
              type: 'number',
              label: 'Mobile Drawer Breedte (px)',
              defaultValue: 320,
              min: 280,
              max: 400,
              admin: {
                description:
                  'Breedte van de mobile drawer in pixels. 320px = standaard (100% op kleine phones), 360-400px = breed.',
              },
            },
            {
              name: 'showMobileContactInfo',
              type: 'checkbox',
              label: 'Toon Contact Info in Drawer',
              defaultValue: true,
              admin: {
                description:
                  'Toon telefoon en email onderaan de mobile drawer (uit Shop Settings).',
              },
            },
            {
              name: 'mobileContactInfo',
              type: 'group',
              label: 'Custom Contact Info (optioneel)',
              admin: {
                description:
                  'Overschrijf contact info alleen voor mobile drawer. Laat leeg om info uit Shop Settings te gebruiken.',
                condition: (data) => data.showMobileContactInfo === true,
              },
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Telefoon',
                  admin: {
                    placeholder: '+31 20 123 4567',
                  },
                },
                {
                  name: 'email',
                  type: 'text',
                  label: 'Email',
                  admin: {
                    placeholder: 'info@bedrijf.nl',
                  },
                },
              ],
            },
            {
              name: 'showMobileToggles',
              type: 'checkbox',
              label: 'Toon Toggles in Mobile Footer',
              defaultValue: true,
              admin: {
                description:
                  'Toon taalwisselaar en/of prijs toggle onderaan de mobile drawer (als deze ingeschakeld zijn).',
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TAB 9: GEDRAG
        // ═══════════════════════════════════════════════════════════════════════
        {
          label: 'Gedrag',
          description: 'Sticky header, animations en gedragsinstellingen',
          fields: [
            {
              name: 'stickyHeader',
              type: 'checkbox',
              label: 'Sticky Header (blijft zichtbaar bij scrollen)',
              defaultValue: true,
              admin: {
                description:
                  'Header blijft bovenaan vast zitten bij scrollen. Aanbevolen voor betere navigatie.',
              },
            },
            {
              name: 'stickyBehavior',
              type: 'select',
              label: 'Sticky Gedrag',
              defaultValue: 'always',
              options: [
                { label: 'Altijd sticky', value: 'always' },
                { label: 'Alleen bij omhoog scrollen', value: 'scroll-up' },
                { label: 'Alleen bij omlaag scrollen', value: 'scroll-down' },
              ],
              admin: {
                description:
                  'Wanneer wordt header sticky? "Scroll-up" = verschijnt bij terugscrollen (space-saving).',
                condition: (data) => data.stickyHeader === true,
              },
            },
            {
              name: 'hideTopbarOnScroll',
              type: 'checkbox',
              label: 'Verberg Topbar bij Scrollen',
              defaultValue: false,
              admin: {
                description:
                  'Verberg de topbar automatisch bij scrollen om ruimte te besparen. Topbar verschijnt weer bij terugscrollen.',
                condition: (data) => data.stickyHeader === true && data.topbarEnabled === true,
              },
            },
          ],
        },
      ],
    },
  ],
}
