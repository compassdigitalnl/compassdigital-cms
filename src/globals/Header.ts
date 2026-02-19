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
                      type: 'text',
                      label: 'Icon',
                      admin: {
                        placeholder: '✓ of 🚚',
                        description: 'Emoji of symbool',
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
                  type: 'text',
                  label: 'Icon',
                  admin: {
                    description: 'Lucide icon naam (bijv. "Gift", "Truck", "AlertCircle")',
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
                  type: 'text',
                  label: 'Icon (emoji or lucide name)',
                  admin: {
                    description: 'Example: 📞 or "phone"',
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
          description: 'Hoofdmenu en submenu items',
          fields: [
            {
              name: 'navigation',
              type: 'group',
              fields: [
                {
                  name: 'items',
                  type: 'array',
                  label: 'Menu items',
                  maxRows: 8,
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      label: 'Menu tekst',
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
