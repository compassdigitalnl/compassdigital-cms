import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

/**
 * Themes Collection - Multi-tenant theme configurations
 *
 * Purpose: Stores theme overrides for each industry vertical (Beauty, Horeca, etc.)
 * Used by: Root layout to generate vertical-specific CSS custom properties
 *
 * Architecture:
 * - Base tokens defined in Theme global (src/globals/Theme.ts)
 * - Vertical overrides defined here (10 industry-specific themes)
 * - CSS generation happens in layout.tsx via [data-theme="slug"] selectors
 */
export const Themes: CollectionConfig = {
  slug: 'themes',
  admin: {
    group: 'Systeem',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', 'isDefault', 'updatedAt'],
    description: 'Multi-tenant theme configurations for all 10 industry verticals',
  },
  access: {
    read: () => true, // Public read access (used by frontend for CSS generation)
    create: ({ req: { user } }) => checkRole(['admin'], user),
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ═══════════════════════════════════════════════════════
        // Tab 1: Basic Info
        // ═══════════════════════════════════════════════════════
        {
          label: 'Basis Info',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Thema Naam',
              required: true,
              admin: {
                description: 'Weergavenaam (bijv. "Beauty/Salon", "Horeca", "Bouw")',
              },
            },
            {
              name: 'slug',
              type: 'text',
              label: 'Thema Slug',
              required: true,
              unique: true,
              admin: {
                description:
                  'URL-veilige identifier (bijv. "beauty", "horeca", "bouw") — gebruikt in data-theme attribuut',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Beschrijving',
              admin: {
                description: 'Korte beschrijving van deze vertical',
                rows: 3,
              },
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icoon (Emoji)',
              admin: {
                description: 'Enkele emoji die deze vertical representeert (bijv. "✨", "🍽️", "🏗️")',
              },
            },
            {
              name: 'isDefault',
              type: 'checkbox',
              label: 'Standaard Thema',
              defaultValue: false,
              admin: {
                description:
                  '⚠️ Slechts ÉÉN thema moet als standaard gemarkeerd zijn (fallback als geen thema gespecificeerd)',
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════
        // Tab 2: Kleur Overrides
        // ═══════════════════════════════════════════════════════
        {
          label: 'Kleuren',
          description: 'Override basis kleurtokens voor deze vertical',
          fields: [
            {
              type: 'collapsible',
              label: 'Primair Kleursysteem (Teal Vervanging)',
              admin: {
                description: 'Deze kleuren vervangen --teal tokens uit het basisthema',
              },
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  label: '--teal (Primaire merkkleur)',
                  admin: {
                    description: 'Hex kleur (bijv. #E91E63 voor Beauty, #C9A84C voor Horeca)',
                    placeholder: '#00897B',
                  },
                  validate: (value) => {
                    if (!value) return true // Optional field
                    return /^#[0-9A-F]{6}$/i.test(value) || 'Moet geldige hex kleur zijn (bijv. #E91E63)'
                  },
                },
                {
                  name: 'primaryColorLight',
                  type: 'text',
                  label: '--teal-light',
                  admin: {
                    placeholder: '#26A69A',
                  },
                  validate: (value) => {
                    if (!value) return true
                    return /^#[0-9A-F]{6}$/i.test(value) || 'Moet geldige hex kleur zijn'
                  },
                },
                {
                  name: 'primaryColorDark',
                  type: 'text',
                  label: '--teal-dark',
                  admin: {
                    placeholder: '#00695C',
                  },
                  validate: (value) => {
                    if (!value) return true
                    return /^#[0-9A-F]{6}$/i.test(value) || 'Moet geldige hex kleur zijn'
                  },
                },
              ],
            },

            {
              type: 'collapsible',
              label: 'Donkere Oppervlakken (Navy Vervanging)',
              fields: [
                {
                  name: 'darkSurface',
                  type: 'text',
                  label: '--navy (Hoofd donkere achtergrond)',
                  admin: {
                    description: 'Hex kleur (bijv. #1a1a2e voor Beauty, #2C1810 voor Horeca)',
                    placeholder: '#0A1628',
                  },
                  validate: (value) => {
                    if (!value) return true
                    return /^#[0-9A-F]{6}$/i.test(value) || 'Moet geldige hex kleur zijn'
                  },
                },
                {
                  name: 'darkSurfaceLight',
                  type: 'text',
                  label: '--navy-light (Lichtere donkere tint)',
                  admin: {
                    placeholder: '#121F33',
                  },
                  validate: (value) => {
                    if (!value) return true
                    return /^#[0-9A-F]{6}$/i.test(value) || 'Moet geldige hex kleur zijn'
                  },
                },
              ],
            },

            {
              type: 'collapsible',
              label: 'Vertical-Specifieke Kleuren (Optioneel)',
              admin: {
                description:
                  'Extra kleuren uniek voor deze vertical (bijv. --pink voor Beauty, --gold voor Horeca)',
              },
              fields: [
                {
                  name: 'customColors',
                  type: 'array',
                  label: 'Custom Kleur Tokens',
                  fields: [
                    {
                      name: 'tokenName',
                      type: 'text',
                      label: 'CSS Variabele Naam',
                      required: true,
                      admin: {
                        description: 'bijv. "pink", "gold", "warm" (wordt --pink, --gold, --warm)',
                      },
                    },
                    {
                      name: 'tokenValue',
                      type: 'text',
                      label: 'Waarde',
                      required: true,
                      admin: {
                        description: 'Hex kleur (bijv. #EC4899) of RGBA',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════
        // Tab 3: Typografie Overrides
        // ═══════════════════════════════════════════════════════
        {
          label: 'Typografie',
          description: 'Override lettertype-instellingen voor deze vertical',
          fields: [
            {
              name: 'bodyFont',
              type: 'text',
              label: 'Body Lettertype',
              admin: {
                description: 'Lettertypefamilie voor body tekst (bijv. "DM Sans", "Plus Jakarta Sans")',
                placeholder: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
              },
            },
            {
              name: 'headingFont',
              type: 'text',
              label: 'Heading Lettertype',
              admin: {
                description: 'Optioneel — override heading lettertype (standaard naar body font indien niet ingesteld)',
                placeholder: "'DM Serif Display', Georgia, serif",
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════
        // Tab 4: Gradiënten Overrides (Optioneel)
        // ═══════════════════════════════════════════════════════
        {
          label: 'Gradiënten',
          description: 'Override gradient fills voor buttons en hero sections',
          fields: [
            {
              name: 'primaryGradient',
              type: 'textarea',
              label: 'Primaire Gradiënt',
              admin: {
                description: 'Hoofdgradiënt voor buttons, CTAs, en interactieve elementen',
                placeholder: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
                rows: 2,
              },
            },
            {
              name: 'heroGradient',
              type: 'textarea',
              label: 'Hero Gradiënt',
              admin: {
                description: 'Subtiele overlay gradiënt voor hero sections (lage opacity)',
                placeholder: 'linear-gradient(135deg, rgba(0,137,123,0.08) 0%, rgba(38,166,154,0.12) 100%)',
                rows: 2,
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════
        // Tab 5: Visueel (Optioneel)
        // ═══════════════════════════════════════════════════════
        {
          label: 'Visueel (Optioneel)',
          description: 'Override border radius, shadows, etc.',
          fields: [
            {
              name: 'borderRadiusSm',
              type: 'number',
              label: '--r-sm (Kleine radius in px)',
              admin: {
                description: 'Standaard: 8px — kan overschrijven voor strakkere/lossere esthetiek',
              },
            },
            {
              name: 'borderRadiusMd',
              type: 'number',
              label: '--r-md (Gemiddelde radius in px)',
              admin: {
                description: 'Standaard: 12px',
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════
        // Tab 6: Metadata
        // ═══════════════════════════════════════════════════════
        {
          label: 'Metadata',
          fields: [
            {
              name: 'templateCount',
              type: 'number',
              label: 'Aantal Templates',
              admin: {
                description: 'Aantal HTML templates voor deze vertical (informatief)',
              },
            },
            {
              name: 'uniqueComponentCount',
              type: 'number',
              label: 'Aantal Unieke Componenten',
              admin: {
                description: 'Aantal vertical-specifieke componenten (informatief)',
              },
            },
            {
              name: 'status',
              type: 'select',
              label: 'Status',
              defaultValue: 'active',
              options: [
                { label: 'Actief', value: 'active' },
                { label: 'In Ontwikkeling', value: 'development' },
                { label: 'Gearchiveerd', value: 'archived' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
