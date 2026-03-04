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
        // TAB 1: LAYOUT & STRUCTUUR
        // ═══════════════════════════════════════════════════════════════════════
        {
          label: 'Layout & Structuur',
          description: 'Kies header layout en beheer component zichtbaarheid',
          fields: [
            {
              name: 'layoutType',
              type: 'select',
              label: 'Header Layout Type',
              defaultValue: 'mega-nav',
              required: true,
              options: [
                {
                  label: 'Mega Navigation (c14-meganav) - Volledig webshop layout',
                  value: 'mega-nav',
                },
                {
                  label: 'Single Row - Logo + Nav + Acties op 1 rij',
                  value: 'single-row',
                },
                {
                  label: 'Minimal - Alleen logo + acties (landing pages)',
                  value: 'minimal',
                },
              ],
              admin: {
                description:
                  'Mega Nav: Topbar + Header + Navigatie balk (ideaal voor webshops). Single Row: Alles op 1 rij (compacte sites). Minimal: Alleen logo en acties (landing pages).',
              },
            },
            {
              name: 'showTopbar',
              type: 'checkbox',
              label: 'Toon Topbar',
              defaultValue: true,
              admin: {
                description:
                  'Topbar met USP berichten, links, taalwisselaar en prijs toggle. Configureer in "Topbar" tab.',
              },
            },
            {
              name: 'showAlertBar',
              type: 'checkbox',
              label: 'Toon Alert Bar',
              defaultValue: false,
              admin: {
                description:
                  'Alert bar met belangrijke mededelingen. Configureer in "Alert Bar" tab.',
              },
            },
            {
              name: 'showNavigation',
              type: 'checkbox',
              label: 'Toon Hoofdnavigatie',
              defaultValue: true,
              admin: {
                description:
                  'Hoofdnavigatie menu. Configureer in "Navigatie" tab. Niet beschikbaar bij Minimal layout.',
                condition: (data) => data.layoutType !== 'minimal',
              },
            },
            {
              name: 'showSearchBar',
              type: 'checkbox',
              label: 'Toon Zoekbalk',
              defaultValue: true,
              admin: {
                description:
                  'Zoekbalk in header. Op mobile wordt dit een search icon met overlay. Configureer in "Zoeken" tab.',
                condition: (data) => data.layoutType !== 'minimal',
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TAB 2: TOPBAR
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
                  'Let op: Als "Toon Topbar" uitstaat in Layout tab, wordt de topbar niet getoond, zelfs als deze hier aanstaat.',
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
                  type: 'select',
                  label: 'Icon',
                  options: [
                    { label: 'Geen icon', value: '' },
                    { label: '✓ Badge Check (verificatie)', value: 'BadgeCheck' },
                    { label: '🚚 Truck (verzending)', value: 'Truck' },
                    { label: '🛡️ Shield (veiligheid)', value: 'Shield' },
                    { label: '⭐ Award (kwaliteit)', value: 'Award' },
                    { label: '⚡ Zap (snel)', value: 'Zap' },
                    { label: '💳 Credit Card', value: 'CreditCard' },
                    { label: '🔒 Lock (beveiligd)', value: 'Lock' },
                    { label: '🔄 Refresh (retour)', value: 'RefreshCw' },
                    { label: '✅ Check Circle', value: 'CheckCircle' },
                  ],
                  admin: {
                    description: 'Lucide icon naam',
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
                  type: 'select',
                  label: 'Icon (optioneel)',
                  options: [
                    { label: 'Geen icon', value: '' },
                    { label: '📞 Phone', value: 'Phone' },
                    { label: '✉️ Mail', value: 'Mail' },
                    { label: '📍 Map Pin', value: 'MapPin' },
                    { label: '🕐 Clock', value: 'Clock' },
                    { label: '👥 Users', value: 'Users' },
                  ],
                },
              ],
            },

            // ── Taalwisselaar ──
            {
              name: 'enableLanguageSwitcher',
              type: 'checkbox',
              label: 'Toon Taalwisselaar',
              defaultValue: false,
              admin: {
                description:
                  'Taalwisselaar in topbar (rechts). Bij 2-3 talen: button group. Bij 4+ talen: dropdown.',
                condition: (data) => data.topbarEnabled === true,
              },
            },
            {
              name: 'languages',
              type: 'array',
              label: 'Beschikbare Talen',
              maxRows: 8,
              admin: {
                description: 'Configureer beschikbare talen. Eerste taal met isDefault=true wordt standaard.',
                condition: (data) => data.topbarEnabled === true && data.enableLanguageSwitcher === true,
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
                  'Toon een alert bar bovenaan alle pagina\'s (boven topbar). Let op: Als "Toon Alert Bar" uitstaat in Layout tab, wordt deze niet getoond.',
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
              type: 'select',
              label: 'Icon',
              options: [
                { label: 'Geen icon', value: '' },
                { label: 'ℹ️ Info', value: 'Info' },
                { label: '✅ Check Circle', value: 'CheckCircle' },
                { label: '⚠️ Alert Circle', value: 'AlertCircle' },
                { label: '❌ X Circle', value: 'XCircle' },
                { label: '🎁 Gift', value: 'Gift' },
                { label: '⚡ Zap', value: 'Zap' },
                { label: '🔔 Bell', value: 'Bell' },
                { label: '📢 Megaphone', value: 'Megaphone' },
                { label: '⭐ Award', value: 'Award' },
                { label: '🚚 Truck', value: 'Truck' },
              ],
              admin: {
                description: 'Lucide icon naam',
                condition: (data) => data.alertBarEnabled === true,
              },
            },
            {
              name: 'alertBarLink',
              type: 'group',
              label: 'Call-to-Action Link (optioneel)',
              admin: {
                condition: (data) => data.alertBarEnabled === true,
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Link toevoegen',
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Link tekst',
                  admin: {
                    description: 'Bijvoorbeeld: "Bekijk aanbiedingen"',
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  admin: {
                    description: 'Interne (/shop) of externe URL',
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
              ],
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
            {
              name: 'alertBarSchedule',
              type: 'group',
              label: 'Planning (optioneel)',
              admin: {
                description: 'Automatisch tonen/verbergen op basis van datums',
                condition: (data) => data.alertBarEnabled === true,
              },
              fields: [
                {
                  name: 'useSchedule',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Gebruik planning',
                },
                {
                  name: 'startDate',
                  type: 'date',
                  label: 'Startdatum',
                  admin: {
                    description: 'Alert wordt getoond vanaf deze datum',
                    condition: (data, siblingData) => siblingData?.useSchedule === true,
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
                {
                  name: 'endDate',
                  type: 'date',
                  label: 'Einddatum',
                  admin: {
                    description: 'Alert wordt verborgen na deze datum',
                    condition: (data, siblingData) => siblingData?.useSchedule === true,
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
              ],
            },
            {
              name: 'alertBarCustomColors',
              type: 'group',
              label: 'Aangepaste Kleuren (optioneel)',
              admin: {
                description: 'Overschrijf standaard kleuren voor dit type',
                condition: (data) => data.alertBarEnabled === true,
              },
              fields: [
                {
                  name: 'useCustomColors',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Gebruik aangepaste kleuren',
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  label: 'Achtergrondkleur',
                  admin: {
                    description: 'CSS var of hex code (bijv. var(--color-info) of #0A1628)',
                    condition: (data, siblingData) => siblingData?.useCustomColors === true,
                  },
                },
                {
                  name: 'textColor',
                  type: 'text',
                  label: 'Tekstkleur',
                  admin: {
                    description: 'CSS var of hex code',
                    condition: (data, siblingData) => siblingData?.useCustomColors === true,
                  },
                },
              ],
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
            {
              name: 'siteNameAccent',
              type: 'text',
              label: 'Accent deel van sitenaam',
              admin: {
                description:
                  'Optioneel: Dit deel wordt in de primary kleur getoond (bijv. "med" in "plastimed"). Laat leeg als je geen accent wilt.',
                placeholder: 'med',
                condition: (data) => !!data.siteName,
              },
            },
            {
              name: 'showLogoOnMobile',
              type: 'checkbox',
              label: 'Toon Logo op Mobile',
              defaultValue: true,
              admin: {
                description: 'Op mobile (<768px) logo tonen? Uit voor extra ruimte voor andere elementen.',
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
                  name: 'showProductCount',
                  type: 'checkbox',
                  label: 'Toon product aantal',
                  defaultValue: true,
                  admin: {
                    description: 'Toon aantal producten per subcategorie in het mega menu',
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
                {
                  name: 'maxProductsInMega',
                  type: 'number',
                  label: 'Max producten in mega menu',
                  defaultValue: 3,
                  min: 1,
                  max: 6,
                  admin: {
                    description:
                      'Aantal populaire producten per categorie (alleen bij stijl "with-products" of "full")',
                    condition: (data, siblingData) =>
                      siblingData?.megaMenuStyle === 'with-products' ||
                      siblingData?.megaMenuStyle === 'full',
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
                  type: 'select',
                  label: 'Icon',
                  options: [
                    { label: 'Geen icon', value: '' },
                    { label: '🔥 Flame (hot/sale)', value: 'Flame' },
                    { label: '⭐ Star', value: 'Star' },
                    { label: '🎁 Gift', value: 'Gift' },
                    { label: '✨ Sparkles (nieuw)', value: 'Sparkles' },
                    { label: '📦 Package', value: 'Package' },
                    { label: '🏷️ Tag (sale)', value: 'Tag' },
                    { label: '⚡ Zap', value: 'Zap' },
                  ],
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
                {
                  name: 'position',
                  type: 'select',
                  label: 'Positie',
                  defaultValue: 'end',
                  options: [
                    { label: 'Begin (links)', value: 'start' },
                    { label: 'Einde (rechts)', value: 'end' },
                  ],
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
                  type: 'select',
                  label: 'Icon (optioneel)',
                  options: [
                    { label: 'Geen icon', value: '' },
                    { label: '🏠 Home', value: 'Home' },
                    { label: '📦 Package', value: 'Package' },
                    { label: '🏢 Building', value: 'Building2' },
                    { label: '👥 Users', value: 'Users' },
                    { label: '⭐ Award', value: 'Award' },
                    { label: '📄 File Text', value: 'FileText' },
                    { label: '🛒 Shopping Cart', value: 'ShoppingCart' },
                    { label: '📧 Mail', value: 'Mail' },
                    { label: '📞 Phone', value: 'Phone' },
                    { label: 'ℹ️ Info', value: 'Info' },
                  ],
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
                  'Let op: Als "Toon Zoekbalk" uitstaat in Layout tab, wordt de zoekbalk niet getoond, zelfs als deze hier aanstaat.',
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
              name: 'searchKeyboardShortcut',
              type: 'text',
              label: 'Keyboard Shortcut Hint',
              defaultValue: '⌘K',
              admin: {
                description:
                  'Toon deze hint in de zoekbalk (bijv. ⌘K op Mac, Ctrl+K op Windows). De shortcut moet in frontend code geïmplementeerd worden.',
                placeholder: '⌘K',
                condition: (data) => data.searchEnabled === true,
              },
            },
            {
              name: 'enableSearchOverlay',
              type: 'checkbox',
              label: 'Toon Search Overlay',
              defaultValue: true,
              admin: {
                description:
                  'Op mobile: altijd overlay. Op desktop: overlay optioneel (als uit: inline search dropdown).',
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
            {
              name: 'searchCategories',
              type: 'array',
              label: 'Snelle Zoek Categorieën',
              maxRows: 6,
              admin: {
                description:
                  'Quick links die onder de zoekbalk verschijnen wanneer deze focus heeft (bijv. "Alle producten", "Nieuw", "Sale")',
                condition: (data) => data.searchEnabled === true,
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Label',
                  admin: {
                    placeholder: 'Alle producten',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'URL',
                  admin: {
                    placeholder: '/producten',
                  },
                },
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  options: [
                    { label: 'Geen icon', value: '' },
                    { label: '📦 Package', value: 'Package' },
                    { label: '✨ Sparkles', value: 'Sparkles' },
                    { label: '🔥 Flame', value: 'Flame' },
                    { label: '⭐ Star', value: 'Star' },
                    { label: '🏷️ Tag', value: 'Tag' },
                  ],
                },
              ],
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
                  type: 'select',
                  label: 'Icon',
                  required: true,
                  options: [
                    { label: '🔍 Search', value: 'Search' },
                    { label: '🛒 Shopping Cart', value: 'ShoppingCart' },
                    { label: '👤 User', value: 'User' },
                    { label: '❤️ Heart', value: 'Heart' },
                    { label: '⚖️ Scale (vergelijk)', value: 'Scale' },
                    { label: '📋 Clipboard', value: 'Clipboard' },
                    { label: '📞 Phone', value: 'Phone' },
                    { label: '✉️ Mail', value: 'Mail' },
                    { label: '📍 Map Pin', value: 'MapPin' },
                    { label: '📥 Download', value: 'Download' },
                    { label: '🔔 Bell', value: 'Bell' },
                    { label: '⚙️ Settings', value: 'Settings' },
                  ],
                  admin: {
                    description: 'Lucide icon naam',
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
                  name: 'showBadge',
                  type: 'checkbox',
                  label: 'Toon Badge',
                  defaultValue: false,
                  admin: {
                    description:
                      'Toon een count badge (bijv. aantal items). Badge waarde moet via JavaScript geüpdatet worden.',
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
                {
                  name: 'style',
                  type: 'select',
                  label: 'Knop Stijl',
                  defaultValue: 'default',
                  options: [
                    { label: 'Default (icon only)', value: 'default' },
                    { label: 'Primary (met achtergrond)', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                  ],
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
              name: 'mobileDrawerPosition',
              type: 'select',
              label: 'Mobile Drawer Positie',
              defaultValue: 'left',
              options: [
                { label: 'Links', value: 'left' },
                { label: 'Rechts', value: 'right' },
              ],
              admin: {
                description: 'Van welke kant schuift de mobile drawer in?',
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
            {
              name: 'mobileBreakpoint',
              type: 'number',
              label: 'Mobile Breakpoint (px)',
              defaultValue: 768,
              min: 640,
              max: 1024,
              admin: {
                description:
                  'Bij welke breedte (px) schakelt de header naar mobile modus? 768px = standaard (tablet), 1024px = alleen phone.',
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TAB 9: THEME KLEUREN
        // ═══════════════════════════════════════════════════════════════════════
        {
          label: 'Theme Kleuren',
          description: 'Kleur instellingen en theme integratie',
          fields: [
            {
              name: 'useThemeColors',
              type: 'checkbox',
              label: 'Gebruik Theme Kleuren',
              defaultValue: true,
              admin: {
                description:
                  'AANBEVOLEN: Gebruik kleuren uit Theme Global (var(--color-*)). Als uit: gebruik custom hex codes hieronder.',
              },
            },
            {
              name: 'headerBgColor',
              type: 'text',
              label: 'Header Achtergrondkleur',
              defaultValue: 'var(--color-white)',
              admin: {
                description:
                  'Achtergrondkleur van de hoofdheader. Gebruik CSS variabele (var(--color-white)) of hex code (#FFFFFF).',
              },
            },
            {
              name: 'navBgColor',
              type: 'text',
              label: 'Navigatie Achtergrondkleur',
              defaultValue: 'var(--color-primary)',
              admin: {
                description:
                  'Achtergrondkleur van de navigatiebalk (alleen bij mega-nav layout). Gebruik var(--color-primary) aanbevolen.',
              },
            },
            {
              name: 'navTextColor',
              type: 'text',
              label: 'Navigatie Tekstkleur',
              defaultValue: 'var(--color-white)',
              admin: {
                description: 'Tekstkleur in de navigatiebalk. Gebruik var(--color-white) aanbevolen.',
              },
            },
            {
              name: 'stickyHeaderBg',
              type: 'text',
              label: 'Sticky Header Achtergrond (optioneel)',
              admin: {
                description:
                  'Optioneel: Andere achtergrondkleur als header sticky wordt. Laat leeg om zelfde kleur te gebruiken.',
                placeholder: 'var(--color-white)',
              },
            },
            {
              name: 'stickyHeaderShadow',
              type: 'checkbox',
              label: 'Sticky Header Shadow',
              defaultValue: true,
              admin: {
                description: 'Toon schaduw onder header wanneer sticky (scroll)',
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TAB 10: GEDRAG
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
                condition: (data) => data.stickyHeader === true && data.showTopbar === true,
              },
            },
            {
              name: 'enableAnimations',
              type: 'checkbox',
              label: 'Animaties Inschakelen',
              defaultValue: true,
              admin: {
                description:
                  'Smooth animations voor dropdowns, mobile drawer, sticky header, etc. Zet uit voor betere performance op langzame devices.',
              },
            },
            {
              name: 'dropdownOpenDelay',
              type: 'number',
              label: 'Dropdown Open Delay (ms)',
              defaultValue: 150,
              min: 0,
              max: 500,
              admin: {
                description:
                  'Vertraging voordat dropdown menu opent bij hover (in milliseconden). 150ms = standaard, 0ms = instant.',
              },
            },
            {
              name: 'dropdownCloseDelay',
              type: 'number',
              label: 'Dropdown Close Delay (ms)',
              defaultValue: 300,
              min: 0,
              max: 1000,
              admin: {
                description:
                  'Vertraging voordat dropdown menu sluit na mouse-out (in milliseconden). 300ms = standaard (tijd om terug te bewegen).',
              },
            },
          ],
        },
      ],
    },
  ],
}
