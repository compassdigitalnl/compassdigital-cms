import type { GlobalConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header & Navigatie',
  admin: {
    group: 'Ontwerp',
    description: 'Alle header-gerelateerde instellingen: TopBar, AlertBar, Navigatie, Branding',
    hidden: ({ user }) => (isClientDeployment() ? false : checkRole(['admin'], user)),
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ─── TAB 1: TOPBAR USPs ───────────────────────────────────
        {
          label: 'TopBar USPs',
          description: 'USP berichten boven de header',
          fields: [
            {
              name: 'topBar',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'TopBar Tonen',
                  defaultValue: true,
                  admin: {
                    description: 'Schakel de TopBar in of uit',
                  },
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  label: 'Achtergrondkleur',
                  defaultValue: '#0A1628',
                  admin: {
                    description: 'Hex kleurcode voor achtergrond (bijv: #0A1628)',
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'textColor',
                  type: 'text',
                  label: 'Tekstkleur',
                  defaultValue: '#FFFFFF',
                  admin: {
                    description: 'Hex kleurcode voor tekst (bijv: #FFFFFF)',
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'leftMessages',
                  type: 'array',
                  label: 'Berichten Links',
                  admin: {
                    description: "USP's en belangrijke berichten aan de linkerkant",
                    condition: (data, siblingData) => siblingData?.enabled === true,
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
                        { label: '📞 Phone', value: 'Phone' },
                        { label: '✉️ Mail', value: 'Mail' },
                        { label: '🕐 Clock', value: 'Clock' },
                        { label: '📍 Map Pin', value: 'MapPin' },
                        { label: '✅ Check Circle', value: 'CheckCircle' },
                        { label: '💳 Credit Card', value: 'CreditCard' },
                        { label: '🔒 Lock (beveiligd)', value: 'Lock' },
                        { label: '⚡ Zap (snel)', value: 'Zap' },
                        { label: '🎁 Gift', value: 'Gift' },
                        { label: '🔄 Refresh (retour)', value: 'RefreshCw' },
                        { label: '👥 Users', value: 'Users' },
                      ],
                      admin: {
                        description: 'Kies een Lucide icon',
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
                {
                  name: 'rightLinks',
                  type: 'array',
                  label: 'Links Rechts',
                  admin: {
                    description: 'Actie links aan de rechterkant (bijv: Klant worden, Contact)',
                    condition: (data, siblingData) => siblingData?.enabled === true,
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
                  ],
                },
              ],
            },
          ],
        },

        // ─── TAB 2: ALERT BAR ──────────────────────────────────────
        {
          label: 'Alert Bar',
          description: 'Meldingen banner bovenaan site',
          fields: [
            {
              name: 'alertBar',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Alert Bar Tonen',
                  admin: {
                    description: "Toon een melding bovenaan alle pagina's",
                  },
                },
                {
                  name: 'message',
                  type: 'text',
                  required: true,
                  label: 'Bericht',
                  admin: {
                    description: 'De boodschap die getoond wordt',
                    condition: (data, siblingData) => siblingData?.enabled,
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  defaultValue: 'info',
                  label: 'Type',
                  options: [
                    { label: 'Informatie', value: 'info' },
                    { label: 'Succes', value: 'success' },
                    { label: 'Waarschuwing', value: 'warning' },
                    { label: 'Fout', value: 'error' },
                    { label: 'Promotie', value: 'promo' },
                  ],
                  admin: {
                    description: 'Type bepaalt de kleur',
                    condition: (data, siblingData) => siblingData?.enabled,
                  },
                },
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  options: [
                    { label: 'Geen icon', value: '' },
                    { label: '✓ Badge Check', value: 'BadgeCheck' },
                    { label: '🚚 Truck', value: 'Truck' },
                    { label: '⭐ Award', value: 'Award' },
                    { label: '🎁 Gift', value: 'Gift' },
                    { label: '⚡ Zap', value: 'Zap' },
                    { label: '⚠️ Alert Circle', value: 'AlertCircle' },
                    { label: 'ℹ️ Info', value: 'Info' },
                    { label: '✅ Check Circle', value: 'CheckCircle' },
                    { label: '🔔 Bell', value: 'Bell' },
                    { label: '📢 Megaphone', value: 'Megaphone' },
                  ],
                  admin: {
                    description: 'Kies een Lucide icon',
                    condition: (data, siblingData) => siblingData?.enabled,
                  },
                },
                {
                  name: 'link',
                  type: 'group',
                  label: 'Call-to-Action Link (optioneel)',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled,
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
                        condition: (data, siblingData) => siblingData?.enabled,
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'URL',
                      admin: {
                        description: 'Interne (/shop) of externe URL',
                        condition: (data, siblingData) => siblingData?.enabled,
                      },
                    },
                  ],
                },
                {
                  name: 'dismissible',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Wegklikbaar',
                  admin: {
                    description: 'Gebruikers kunnen de alert sluiten',
                    condition: (data, siblingData) => siblingData?.enabled,
                  },
                },
                {
                  name: 'schedule',
                  type: 'group',
                  label: 'Planning (optioneel)',
                  admin: {
                    description: 'Automatisch tonen/verbergen op basis van datums',
                    condition: (data, siblingData) => siblingData?.enabled,
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
                        condition: (data, siblingData) => siblingData?.useSchedule,
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
                        condition: (data, siblingData) => siblingData?.useSchedule,
                        date: {
                          pickerAppearance: 'dayAndTime',
                        },
                      },
                    },
                  ],
                },
                {
                  name: 'customColors',
                  type: 'group',
                  label: 'Aangepaste Kleuren (optioneel)',
                  admin: {
                    description: 'Overschrijf standaard kleuren voor dit type',
                    condition: (data, siblingData) => siblingData?.enabled,
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
                        description: 'Hex code (bijv. #0A1628)',
                        condition: (data, siblingData) => siblingData?.useCustomColors,
                      },
                    },
                    {
                      name: 'textColor',
                      type: 'text',
                      label: 'Tekstkleur',
                      admin: {
                        description: 'Hex code (bijv. #FFFFFF)',
                        condition: (data, siblingData) => siblingData?.useCustomColors,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ─── TAB 3: BRANDING & LOGO ────────────────────────────────
        {
          label: 'Branding & Logo',
          description: 'Logo en sitenaam overrides',
          fields: [
            {
              name: 'logoOverride',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo Override',
              admin: {
                description:
                  'Optional: Override site logo specifically for header. Leave empty to use logo from Site Settings.',
              },
            },
            {
              name: 'siteNameOverride',
              type: 'text',
              label: 'Site Name Override',
              admin: {
                description:
                  'Optional: Override site name specifically for header. Leave empty to use name from Site Settings.',
              },
            },
            {
              name: 'siteNameAccent',
              type: 'text',
              label: 'Accent deel van sitenaam',
              admin: {
                description:
                  'Optioneel: Dit deel wordt in de primaire kleur getoond (bijv. "med" in "plastimed"). Laat leeg als je geen accent wilt.',
                condition: (data) => !!data.siteNameOverride,
                placeholder: 'med',
              },
            },
          ],
        },

        // ─── TAB 4: SEARCH & ACTION BUTTONS ────────────────────────
        {
          label: 'Search & Buttons',
          description: 'Zoekbalk en actie knoppen',
          fields: [
            {
              name: 'enableSearch',
              type: 'checkbox',
              label: 'Enable Search Bar',
              defaultValue: true,
              admin: {
                description: 'Show/hide the search bar in header',
              },
            },
            {
              name: 'searchPlaceholder',
              type: 'text',
              label: 'Search Placeholder Text',
              defaultValue: 'Zoek producten...',
              admin: {
                condition: (data) => data.enableSearch === true,
              },
            },
            {
              name: 'showPhone',
              type: 'checkbox',
              label: 'Show Phone Button',
              defaultValue: true,
              admin: {
                description: 'Shows phone number from Shop Settings',
              },
            },
            {
              name: 'showWishlist',
              type: 'checkbox',
              label: 'Show Wishlist Button',
              defaultValue: false,
            },
            {
              name: 'showAccount',
              type: 'checkbox',
              label: 'Show Account Button',
              defaultValue: true,
            },
            {
              name: 'showCart',
              type: 'checkbox',
              label: 'Show Cart Button',
              defaultValue: true,
            },
            {
              name: 'customButtons',
              type: 'array',
              label: 'Custom Action Buttons',
              maxRows: 3,
              admin: {
                description: 'Add custom action buttons to the header',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Button Text',
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'Link URL',
                },
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  options: [
                    { label: 'Geen icon', value: '' },
                    { label: '📞 Phone', value: 'Phone' },
                    { label: '✉️ Mail', value: 'Mail' },
                    { label: '📍 Map Pin', value: 'MapPin' },
                    { label: '🛒 Shopping Cart', value: 'ShoppingCart' },
                    { label: '👤 User', value: 'User' },
                    { label: '📋 Clipboard', value: 'Clipboard' },
                    { label: '💳 Credit Card', value: 'CreditCard' },
                    { label: '🔍 Search', value: 'Search' },
                  ],
                  admin: {
                    description: 'Kies een Lucide icon',
                  },
                },
                {
                  name: 'style',
                  type: 'select',
                  label: 'Button Style',
                  defaultValue: 'default',
                  options: [
                    { label: 'Default (gray)', value: 'default' },
                    { label: 'Primary (brand color)', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                  ],
                },
              ],
            },
          ],
        },

        // ─── TAB 5: NAVIGATIE MENU ─────────────────────────────────
        {
          label: 'Navigatie Menu',
          description: 'Hoofdmenu configuratie: categorie-gedreven, handmatig of hybride',
          fields: [
            {
              name: 'navigation',
              type: 'group',
              fields: [
                // ── Navigatie modus ──
                {
                  name: 'mode',
                  type: 'select',
                  label: 'Navigatie modus',
                  defaultValue: 'manual',
                  required: true,
                  options: [
                    {
                      label: 'Handmatig (zelf menu items beheren)',
                      value: 'manual',
                    },
                    {
                      label: 'Categorie-gedreven (automatisch uit product categorieën)',
                      value: 'categories',
                    },
                    {
                      label: 'Hybride (categorieën + extra handmatige items)',
                      value: 'hybrid',
                    },
                  ],
                  admin: {
                    description:
                      'Bepaalt hoe het navigatiemenu wordt opgebouwd. Categorie-gedreven is ideaal voor webshops.',
                  },
                },

                // ── Categorie-modus instellingen ──
                {
                  name: 'categorySettings',
                  type: 'group',
                  label: 'Categorie navigatie instellingen',
                  admin: {
                    condition: (data, siblingData) =>
                      siblingData?.mode === 'categories' || siblingData?.mode === 'hybrid',
                    description:
                      'Configureer hoe product categorieën in de navigatie worden getoond',
                  },
                  fields: [
                    {
                      name: 'showIcons',
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
                      label: 'Toon product aantal in mega menu',
                      defaultValue: true,
                      admin: {
                        description: 'Toon aantal producten per subcategorie in het mega menu',
                      },
                    },
                    {
                      name: 'megaMenuStyle',
                      type: 'select',
                      label: 'Mega menu stijl',
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
                      name: 'maxItems',
                      type: 'number',
                      label: 'Max aantal categorie items',
                      defaultValue: 10,
                      min: 1,
                      max: 20,
                      admin: {
                        description:
                          'Maximaal aantal categorieën in de navigatiebalk (1-20). Meer items kunnen niet op het scherm passen.',
                      },
                    },
                    {
                      name: 'maxProductsInMegaMenu',
                      type: 'number',
                      label: 'Max aantal producten in mega menu',
                      defaultValue: 3,
                      min: 1,
                      max: 6,
                      admin: {
                        description:
                          'Aantal populaire producten per categorie in mega menu (alleen bij stijl "with-products" of "full")',
                        condition: (data, siblingData) =>
                          siblingData?.megaMenuStyle === 'with-products' ||
                          siblingData?.megaMenuStyle === 'full',
                      },
                    },
                  ],
                },

                // ── Speciale items (altijd zichtbaar) ──
                {
                  name: 'specialItems',
                  type: 'array',
                  label: 'Speciale navigatie items',
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
                        { label: '🚚 Truck', value: 'Truck' },
                        { label: '⚡ Zap', value: 'Zap' },
                      ],
                      admin: {
                        description: 'Kies een Lucide icon',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      label: 'Link',
                      admin: {
                        placeholder: '/shop?badge=sale',
                      },
                    },
                    {
                      name: 'highlight',
                      type: 'checkbox',
                      label: 'Highlight (opvallende kleur)',
                      defaultValue: false,
                      admin: {
                        description: 'Toont in coral/rood kleur voor extra aandacht',
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
                      admin: {
                        description: 'Waar dit item in de navigatie verschijnt',
                      },
                    },
                  ],
                },

                // ── Handmatige items (bestaand, voor manual/hybrid modus) ──
                {
                  name: 'items',
                  type: 'array',
                  label: 'Handmatige menu items',
                  maxRows: 8,
                  admin: {
                    condition: (data, siblingData) =>
                      siblingData?.mode === 'manual' || siblingData?.mode === 'hybrid',
                    description:
                      'Voeg zelf menu items toe. In hybride modus worden deze getoond naast de categorie items.',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      label: 'Menu tekst',
                    },
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Icon (optioneel)',
                      options: [
                        { label: 'Geen icon', value: '' },
                        { label: '📦 Package', value: 'Package' },
                        { label: '🏢 Building', value: 'Building2' },
                        { label: '👥 Users', value: 'Users' },
                        { label: '⭐ Award', value: 'Award' },
                        { label: '📄 File Text', value: 'FileText' },
                        { label: '🛒 Shopping Cart', value: 'ShoppingCart' },
                        { label: '📧 Mail', value: 'Mail' },
                        { label: '📞 Phone', value: 'Phone' },
                        { label: '🏠 Home', value: 'Home' },
                      ],
                      admin: {
                        description: 'Kies een Lucide icon',
                      },
                    },
                    {
                      name: 'type',
                      type: 'select',
                      label: 'Link type',
                      defaultValue: 'page',
                      options: [
                        { label: 'Pagina', value: 'page' },
                        { label: 'Externe URL', value: 'external' },
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
                      name: 'children',
                      type: 'array',
                      label: 'Submenu items',
                      maxRows: 6,
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                          label: 'Menu tekst',
                        },
                        {
                          name: 'page',
                          type: 'relationship',
                          relationTo: 'pages',
                        },
                      ],
                    },
                  ],
                },

                // ── CTA knop (bestaand) ──
                {
                  name: 'ctaButton',
                  type: 'group',
                  label: 'CTA knop (rechtsboven)',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      label: 'Knoptekst',
                      defaultValue: 'Contact',
                    },
                    {
                      name: 'link',
                      type: 'text',
                      label: 'Link',
                      defaultValue: '/contact',
                    },
                    {
                      name: 'show',
                      type: 'checkbox',
                      label: 'Tonen',
                      defaultValue: true,
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ─── TAB 6: BEHAVIOR ───────────────────────────────────────
        {
          label: 'Behavior',
          description: 'Sticky header, shadow, etc.',
          fields: [
            {
              name: 'stickyHeader',
              type: 'checkbox',
              label: 'Sticky Header',
              defaultValue: true,
              admin: {
                description: 'Header stays visible when scrolling',
              },
            },
            {
              name: 'showShadow',
              type: 'checkbox',
              label: 'Show Shadow',
              defaultValue: true,
              admin: {
                description: 'Show shadow beneath header',
              },
            },
          ],
        },
      ],
    },
  ],
}
