import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlugFromName } from '@/utilities/slugify'

/**
 * Vendors Collection (Marketplace Rebuild)
 *
 * Represents suppliers, manufacturers, or service providers.
 * Tab-based admin layout for better UX.
 *
 * Features:
 * - Vendor profile pages with tabs
 * - Product associations (via vendor field on Products)
 * - Ratings and reviews (auto-calculated)
 * - Contact information & delivery
 * - Categories, certifications, specialisms
 * - Premium/Featured/Verified vendors
 * - Filter tags for archive page filtering
 */
export const Vendors: CollectionConfig = {
  slug: 'vendors',
  labels: {
    singular: 'Leverancier',
    plural: 'Leveranciers',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Marktplaats',
    defaultColumns: ['name', 'isPremium', 'isVerified', 'isFeatured', 'stats.productCount', 'updatedAt'],
    description: 'Leveranciers, fabrikanten en partners',
    hidden: shouldHideCollection('vendors'),
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 10,
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Recalculate productCount by counting products with this vendor
        try {
          const products = await req.payload.find({
            collection: 'products',
            where: { vendor: { equals: doc.id } },
            limit: 0, // Only need totalDocs
            depth: 0,
          })

          const currentCount = doc.stats?.productCount ?? 0
          if (products.totalDocs !== currentCount) {
            await req.payload.update({
              collection: 'vendors',
              id: doc.id,
              data: {
                stats: {
                  ...doc.stats,
                  productCount: products.totalDocs,
                },
              },
            })
          }
        } catch {
          // Products collection might not have vendor field yet
        }
      },
    ],
  },
  fields: [
    // ── Sidebar fields ────────────────────────────────────────────────────
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        position: 'sidebar',
        description: 'Automatisch gegenereerd uit de naam',
      },
      hooks: {
        beforeValidate: [autoGenerateSlugFromName],
      },
    },
    {
      name: 'isVerified',
      type: 'checkbox',
      label: 'Geverifieerd',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Toon "Geverifieerd" badge',
      },
    },
    {
      name: 'isPremium',
      type: 'checkbox',
      label: 'Premium Partner',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Premium partners worden uitgelicht',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Toon in "Uitgelichte partners" sectie',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Volgorde',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Sorteer volgorde (lager = eerder getoond)',
      },
    },

    // ── Tab layout ────────────────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ═══════════════════════════════════════════════════════════
        // TAB 1: Profiel
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Profiel',
          description: 'Basisinformatie en visuele identiteit',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Bedrijfsnaam',
              admin: {
                description: 'Volledige bedrijfsnaam',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'shortName',
                  type: 'text',
                  label: 'Korte naam',
                  admin: {
                    width: '50%',
                    description: 'Voor logo fallback (bijv: "BD", "3M")',
                  },
                },
                {
                  name: 'tagline',
                  type: 'text',
                  label: 'Tagline',
                  maxLength: 120,
                  admin: {
                    width: '50%',
                    description: 'Korte beschrijvende tekst (max 120 tekens)',
                  },
                },
              ],
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Beschrijving',
              admin: {
                description: 'Uitgebreide beschrijving over de leverancier',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo',
                  admin: {
                    width: '50%',
                    description: 'SVG of PNG met transparante achtergrond',
                  },
                },
                {
                  name: 'banner',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Banner Image',
                  admin: {
                    width: '50%',
                    description: 'Hero banner (1200x300px)',
                  },
                },
              ],
            },
            {
              name: 'bannerColor',
              type: 'text',
              label: 'Banner Achtergrondkleur',
              admin: {
                description: 'Hex kleurcode voor banner gradient (bijv: #0A1628)',
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 2: Classificatie
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Classificatie',
          description: 'Tags, categorieën, certificeringen en specialismen',
          fields: [
            {
              name: 'filterTags',
              type: 'select',
              label: 'Filter Tags',
              hasMany: true,
              admin: {
                description: 'Tags voor filtering op archief pagina',
              },
              options: [
                { label: 'Premium', value: 'premium' },
                { label: 'CE Gecertificeerd', value: 'ce-certified' },
                { label: 'Duurzaam', value: 'sustainable' },
                { label: 'Direct Leverbaar', value: 'direct-delivery' },
                { label: 'Met Workshops', value: 'has-workshops' },
              ],
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'product-categories',
              hasMany: true,
              label: 'Productcategorieën',
              admin: {
                description: 'In welke categorieën is deze leverancier actief?',
              },
            },
            {
              name: 'certifications',
              type: 'array',
              label: 'Certificeringen',
              admin: {
                description: 'Certificaten en keurmerken (CE, ISO, etc.)',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      label: 'Naam',
                      admin: {
                        width: '60%',
                      },
                    },
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Icoon',
                      admin: {
                        width: '40%',
                      },
                      options: [
                        { label: 'Shield Check', value: 'shield-check' },
                        { label: 'Award', value: 'award' },
                        { label: 'Leaf (Duurzaam)', value: 'leaf' },
                        { label: 'Star', value: 'star' },
                        { label: 'Check Circle', value: 'check-circle' },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'specialisms',
              type: 'array',
              label: 'Specialismen',
              admin: {
                description: 'Specialisatiegebieden van deze leverancier',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Specialisme',
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 3: Contact & Levering
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Contact & Levering',
          description: 'Contactgegevens en leveringsinformatie',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Contactgegevens',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'website',
                      type: 'text',
                      label: 'Website URL',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'email',
                      type: 'email',
                      label: 'E-mailadres',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'phone',
                      type: 'text',
                      label: 'Telefoonnummer',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'country',
                      type: 'text',
                      label: 'Land',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'address',
                  type: 'textarea',
                  label: 'Adres',
                  admin: { rows: 3 },
                },
              ],
            },
            {
              name: 'delivery',
              type: 'group',
              label: 'Levering & Service',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'deliveryTime',
                      type: 'text',
                      label: 'Levertijd',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'freeShippingFrom',
                      type: 'number',
                      label: 'Gratis verzending vanaf (€)',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'partnerSince',
                  type: 'number',
                  label: 'Partner sinds (jaar)',
                  admin: {
                    width: '50%',
                    description: 'Jaar van partnerschap',
                  },
                },
                {
                  name: 'employeeCount',
                  type: 'text',
                  label: 'Aantal medewerkers',
                  admin: {
                    width: '50%',
                    description: 'Bijv: 50-100, 500+',
                  },
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 4: Statistieken
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Statistieken',
          description: 'Automatisch berekende en handmatige statistieken',
          fields: [
            {
              name: 'stats',
              type: 'group',
              label: 'Statistieken',
              admin: {
                description: 'Automatisch berekend — handmatig overschrijfbaar',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'productCount',
                      type: 'number',
                      label: 'Aantal Producten',
                      admin: {
                        width: '33%',
                        description: 'Auto-berekend uit Products',
                      },
                    },
                    {
                      name: 'rating',
                      type: 'number',
                      label: 'Gem. Beoordeling',
                      min: 0,
                      max: 5,
                      admin: {
                        width: '33%',
                        step: 0.1,
                        description: 'Auto-berekend uit reviews',
                      },
                    },
                    {
                      name: 'reviewCount',
                      type: 'number',
                      label: 'Aantal Reviews',
                      admin: {
                        width: '33%',
                        description: 'Auto-berekend',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'stockAvailability',
                      type: 'number',
                      label: 'Voorraad beschikbaarheid (%)',
                      min: 0,
                      max: 100,
                      admin: {
                        width: '50%',
                        description: 'Percentage producten op voorraad (0-100)',
                      },
                    },
                    {
                      name: 'establishedYear',
                      type: 'number',
                      label: 'Opgericht in',
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 5: SEO
        // ═══════════════════════════════════════════════════════════
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'SEO',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Meta Title',
                  admin: {
                    description: 'SEO titel voor de vendor pagina',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Meta Beschrijving',
                  maxLength: 160,
                  admin: {
                    description: 'Korte beschrijving voor zoekmachines (max 160 tekens)',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Social Share Image',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default Vendors
