import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Producten',
  },
  admin: {
    useAsTitle: 'title',
    group: 'E-commerce',
    defaultColumns: ['title', 'sku', 'ean', 'price', 'stock', 'status', 'productType', 'updatedAt'],
    // In tenant deployments, always show; in platform, hide from non-editors and non-webshop clients
    hidden: ({ user }) =>
      isClientDeployment()
        ? false
        : !checkRole(['editor'], user) || (user as any)?.clientType !== 'webshop',
  },
  access: {
    read: () => true, // Products are publicly accessible (webshop catalog)
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Auto-generate slug from title if not provided
        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ═══════════════════════════════════════════════════════════
        // TAB 1: BASIS INFO
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Basis Info',
          description: 'Algemene productinformatie',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Product Naam',
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'URL Slug',
              admin: {
                position: 'sidebar',
                description: 'Auto-gegenereerd uit productnaam',
              },
            },
            {
              name: 'productType',
              type: 'select',
              label: 'Product Type',
              defaultValue: 'simple',
              required: true,
              options: [
                { label: 'Simple Product (Enkel)', value: 'simple' },
                { label: 'Grouped Product (Multi-select)', value: 'grouped' },
              ],
              admin: {
                position: 'sidebar',
                description: 'Simple = normaal product, Grouped = multi-select parent',
              },
            },
            {
              name: 'template',
              type: 'select',
              label: 'Product Template',
              defaultValue: 'template1',
              options: [
                { label: 'Template 1 - Enterprise (Volledig, B2B features)', value: 'template1' },
                { label: 'Template 2 - Minimal (Clean, modern)', value: 'template2' },
              ],
              admin: {
                position: 'sidebar',
                description: 'Kies welke template gebruikt wordt voor dit product',
              },
            },
            // SKU, EAN, MPN row
            {
              type: 'row',
              fields: [
                {
                  name: 'sku',
                  type: 'text',
                  label: 'SKU / Artikelnummer',
                  unique: true,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'ean',
                  type: 'text',
                  label: 'EAN / Barcode',
                  admin: {
                    width: '33%',
                    description: 'European Article Number (13 cijfers)',
                  },
                },
                {
                  name: 'mpn',
                  type: 'text',
                  label: 'MPN',
                  admin: {
                    width: '34%',
                    description: 'Manufacturer Part Number',
                  },
                },
              ],
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Korte Beschrijving',
              maxLength: 200,
              admin: {
                description: 'Max 200 karakters, gebruikt in productlijsten',
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Beschrijving',
            },
            // Brand & Manufacturer row
            {
              type: 'row',
              fields: [
                {
                  name: 'brand',
                  type: 'relationship',
                  relationTo: 'brands',
                  label: 'Merk',
                  admin: {
                    width: '50%',
                    description: 'Bijv: Hartmann, BSN Medical, 3M',
                  },
                },
                {
                  name: 'manufacturer',
                  type: 'text',
                  label: 'Fabrikant',
                  admin: {
                    width: '50%',
                    description: 'Als afwijkend van merk',
                  },
                },
              ],
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'product-categories',
              hasMany: true,
              label: 'Categorieën',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'tags',
              type: 'array',
              label: 'Tags',
              admin: {
                description: 'Voor zoeken en filtering',
              },
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  required: true,
                  label: 'Tag',
                },
              ],
            },
            // Status, Featured, Condition, Warranty row
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  defaultValue: 'draft',
                  required: true,
                  label: 'Status',
                  options: [
                    { label: 'Concept', value: 'draft' },
                    { label: 'Gepubliceerd', value: 'published' },
                    { label: 'Uitverkocht', value: 'sold-out' },
                    { label: 'Gearchiveerd', value: 'archived' },
                  ],
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Featured',
                  admin: {
                    width: '25%',
                    description: 'Toon in featured secties',
                  },
                },
                {
                  name: 'condition',
                  type: 'select',
                  label: 'Conditie',
                  defaultValue: 'new',
                  options: [
                    { label: 'Nieuw', value: 'new' },
                    { label: 'Refurbished', value: 'refurbished' },
                    { label: 'Gebruikt', value: 'used' },
                  ],
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'warranty',
                  type: 'text',
                  label: 'Garantie',
                  admin: {
                    width: '25%',
                    placeholder: 'Bijv: 2 jaar, Lifetime',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'releaseDate',
                  type: 'date',
                  label: 'Release Datum',
                  admin: {
                    width: '50%',
                    date: {
                      pickerAppearance: 'dayOnly',
                    },
                  },
                },
                {
                  name: 'badge',
                  type: 'select',
                  label: 'Product Badge',
                  defaultValue: 'none',
                  options: [
                    { label: 'Geen', value: 'none' },
                    { label: 'Nieuw', value: 'new' },
                    { label: 'Sale / Aanbieding', value: 'sale' },
                    { label: 'Populair', value: 'popular' },
                    { label: 'Uitverkocht', value: 'sold-out' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Badge op productkaart',
                  },
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 2: PRIJZEN
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Prijzen',
          description: 'Prijzen, BTW, staffels en klantengroepen',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  min: 0,
                  label: 'Basis Prijs (excl. BTW)',
                  admin: {
                    step: 0.01,
                    width: '33%',
                  },
                },
                {
                  name: 'salePrice',
                  type: 'number',
                  min: 0,
                  label: 'Actieprijs',
                  admin: {
                    step: 0.01,
                    width: '33%',
                    description: 'Tijdelijke korting',
                  },
                },
                {
                  name: 'compareAtPrice',
                  type: 'number',
                  min: 0,
                  label: 'Vergelijk Prijs (doorstreept)',
                  admin: {
                    step: 0.01,
                    width: '34%',
                    description: 'Voor "Was €X, nu €Y"',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'costPrice',
                  type: 'number',
                  min: 0,
                  label: 'Kostprijs (intern)',
                  admin: {
                    step: 0.01,
                    width: '50%',
                    description: 'Voor winstmarge berekening',
                  },
                },
                {
                  name: 'msrp',
                  type: 'number',
                  min: 0,
                  label: 'Adviesprijs (MSRP)',
                  admin: {
                    step: 0.01,
                    width: '50%',
                    description: 'Manufacturer Suggested Retail Price',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'taxClass',
                  type: 'select',
                  label: 'BTW Klasse',
                  defaultValue: 'standard',
                  options: [
                    { label: 'Standaard (21%)', value: 'standard' },
                    { label: 'Verlaagd (9%)', value: 'reduced' },
                    { label: 'Nul (0%)', value: 'zero' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'includesTax',
                  type: 'checkbox',
                  label: 'Prijs inclusief BTW',
                  defaultValue: false,
                  admin: {
                    width: '50%',
                    description: 'Anders = excl. BTW',
                  },
                },
              ],
            },

            // Klantengroep Prijzen (B2B)
            {
              type: 'collapsible',
              label: 'Klantengroep Prijzen (B2B)',
              admin: {
                initCollapsed: true,
                description: 'Speciale prijzen per klantengroep',
              },
              fields: [
                {
                  name: 'groupPrices',
                  type: 'array',
                  label: 'Groepsprijzen',
                  maxRows: 20,
                  admin: {
                    description:
                      'Stel verschillende prijzen in voor verschillende klantengroepen (bijv. dealers, groothandel)',
                  },
                  fields: [
                    {
                      name: 'group',
                      type: 'relationship',
                      relationTo: 'customer-groups',
                      required: true,
                      label: 'Klantengroep',
                    },
                    {
                      name: 'price',
                      type: 'number',
                      required: true,
                      min: 0,
                      label: 'Prijs',
                      admin: {
                        step: 0.01,
                      },
                    },
                    {
                      name: 'minQuantity',
                      type: 'number',
                      min: 1,
                      defaultValue: 1,
                      label: 'Vanaf aantal',
                      admin: {
                        description: 'Minimale afname voor deze prijs',
                      },
                    },
                  ],
                },
              ],
            },

            // Staffelprijzen (Volume)
            {
              type: 'collapsible',
              label: 'Staffelprijzen (Volume)',
              admin: {
                initCollapsed: true,
                description: 'Korting bij grotere aantallen',
              },
              fields: [
                {
                  name: 'volumePricing',
                  type: 'array',
                  label: 'Staffels',
                  admin: {
                    description:
                      'Bijv: 1-9 stuks €10, 10-49 stuks €9, 50+ stuks €8',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'minQuantity',
                          type: 'number',
                          required: true,
                          min: 1,
                          label: 'Vanaf',
                          admin: {
                            width: '25%',
                          },
                        },
                        {
                          name: 'maxQuantity',
                          type: 'number',
                          min: 1,
                          label: 'Tot',
                          admin: {
                            width: '25%',
                            description: 'Leeg = onbeperkt',
                          },
                        },
                        {
                          name: 'price',
                          type: 'number',
                          required: true,
                          min: 0,
                          label: 'Stuksprijs',
                          admin: {
                            step: 0.01,
                            width: '25%',
                          },
                        },
                        {
                          name: 'discountPercentage',
                          type: 'number',
                          min: 0,
                          max: 100,
                          label: 'Korting %',
                          admin: {
                            width: '25%',
                            description: 'Of vul prijs in',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 3: VOORRAAD
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Voorraad',
          description: 'Voorraadbeheer en beschikbaarheid',
          fields: [
            {
              name: 'trackStock',
              type: 'checkbox',
              defaultValue: true,
              label: 'Voorraad Bijhouden',
              admin: {
                description: 'Schakel uit voor virtuele/digitale producten',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'stock',
                  type: 'number',
                  min: 0,
                  defaultValue: 0,
                  label: 'Voorraad Aantal',
                  admin: {
                    width: '33%',
                    condition: (data) => data.trackStock === true,
                  },
                },
                {
                  name: 'stockStatus',
                  type: 'select',
                  label: 'Voorraad Status',
                  defaultValue: 'in-stock',
                  options: [
                    { label: 'Op Voorraad', value: 'in-stock' },
                    { label: 'Uitverkocht', value: 'out-of-stock' },
                    { label: 'Backorder', value: 'on-backorder' },
                    { label: 'Uitgefaseerd', value: 'discontinued' },
                  ],
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'lowStockThreshold',
                  type: 'number',
                  min: 0,
                  defaultValue: 5,
                  label: 'Lage Voorraad Drempel',
                  admin: {
                    width: '34%',
                    description: 'Waarschuwing bij minder dan X stuks',
                    condition: (data) => data.trackStock === true,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'backordersAllowed',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Backorders Toestaan',
                  admin: {
                    width: '50%',
                    description: 'Verkopen bij uitverkocht',
                  },
                },
                {
                  name: 'availabilityDate',
                  type: 'date',
                  label: 'Verwachte Leverdatum',
                  admin: {
                    width: '50%',
                    description: 'Bij backorder/pre-order',
                    condition: (data) => data.stockStatus === 'on-backorder',
                    date: {
                      pickerAppearance: 'dayOnly',
                    },
                  },
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 4: VERZENDING
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Verzending',
          description: 'Gewicht, afmetingen en verzendopties',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'weight',
                  type: 'number',
                  min: 0,
                  label: 'Gewicht',
                  admin: {
                    step: 0.01,
                    width: '50%',
                  },
                },
                {
                  name: 'weightUnit',
                  type: 'select',
                  label: 'Eenheid',
                  defaultValue: 'kg',
                  options: [
                    { label: 'Kilogram (kg)', value: 'kg' },
                    { label: 'Gram (g)', value: 'g' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'dimensionsLength',
                  type: 'number',
                  min: 0,
                  label: 'Lengte (cm)',
                  admin: {
                    step: 0.1,
                    width: '33%',
                  },
                },
                {
                  name: 'dimensionsWidth',
                  type: 'number',
                  min: 0,
                  label: 'Breedte (cm)',
                  admin: {
                    step: 0.1,
                    width: '33%',
                  },
                },
                {
                  name: 'dimensionsHeight',
                  type: 'number',
                  min: 0,
                  label: 'Hoogte (cm)',
                  admin: {
                    step: 0.1,
                    width: '34%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'shippingClass',
                  type: 'text',
                  label: 'Verzendklasse',
                  admin: {
                    width: '50%',
                    description: 'Bijv: standard, fragile, hazmat',
                  },
                },
                {
                  name: 'freeShipping',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Gratis Verzending',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 5: MEDIA
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Media',
          description: 'Afbeeldingen, videos en downloads',
          fields: [
            {
              name: 'images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Product Afbeeldingen',
              admin: {
                description: 'Eerste afbeelding = hoofdafbeelding',
              },
            },
            {
              name: 'videos',
              type: 'array',
              label: 'Product Videos',
              maxRows: 5,
              admin: {
                description: 'YouTube, Vimeo of directe video links',
              },
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'Video URL',
                  admin: {
                    placeholder: 'https://www.youtube.com/watch?v=...',
                  },
                },
                {
                  name: 'platform',
                  type: 'select',
                  label: 'Platform',
                  defaultValue: 'youtube',
                  options: [
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Vimeo', value: 'vimeo' },
                    { label: 'Direct Link', value: 'custom' },
                  ],
                },
              ],
            },
            {
              name: 'downloads',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Downloads',
              admin: {
                description: 'PDF datasheets, handleidingen, certificaten',
              },
              filterOptions: {
                mimeType: { contains: 'pdf' },
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 6: GEGROEPEERDE PRODUCTEN
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Gegroepeerde Producten',
          description: 'Koppel sub-producten voor multi-select bestelling',
          fields: [
            {
              name: 'childProducts',
              type: 'array',
              label: 'Sub-producten',
              admin: {
                description:
                  'Alleen zichtbaar als Product Type = Grouped. Elk sub-product is een zelfstandig Simple product met eigen SKU, EAN, prijs en voorraad.',
                condition: (data) => data.productType === 'grouped',
              },
              fields: [
                {
                  name: 'product',
                  type: 'relationship',
                  relationTo: 'products',
                  required: true,
                  label: 'Product',
                  filterOptions: {
                    productType: { equals: 'simple' },
                  },
                  admin: {
                    description: 'Alleen Simple producten',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'sortOrder',
                      type: 'number',
                      defaultValue: 0,
                      label: 'Volgorde',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'isDefault',
                      type: 'checkbox',
                      defaultValue: false,
                      label: 'Standaard geselecteerd',
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'ui',
              name: 'groupedProductsInfo',
              admin: {
                condition: (data) => data.productType !== 'grouped',
                components: {
                  Field: () => {
                    return null
                  },
                },
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 7: B2B
        // ═══════════════════════════════════════════════════════════
        {
          label: 'B2B',
          description: 'B2B instellingen (MOQ, levertijd, offertes)',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'minOrderQuantity',
                  type: 'number',
                  min: 1,
                  label: 'Minimum Bestelhoeveelheid (MOQ)',
                  admin: {
                    width: '33%',
                    description: 'Minimale afname per order',
                  },
                },
                {
                  name: 'maxOrderQuantity',
                  type: 'number',
                  min: 1,
                  label: 'Maximum Bestelhoeveelheid',
                  admin: {
                    width: '33%',
                    description: 'Maximale afname per order',
                  },
                },
                {
                  name: 'orderMultiple',
                  type: 'number',
                  min: 1,
                  label: 'Bestel Veelvoud',
                  admin: {
                    width: '34%',
                    description: 'Alleen bestelbaar in veelvouden van X',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'leadTime',
                  type: 'number',
                  min: 0,
                  label: 'Levertijd (dagen)',
                  admin: {
                    width: '25%',
                    description: 'Standaard levertijd',
                  },
                },
                {
                  name: 'customizable',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Maatwerk Mogelijk',
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'quotationRequired',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Offerte Verplicht',
                  admin: {
                    width: '25%',
                    description: 'Geen directe aankoop',
                  },
                },
                {
                  name: 'contractPricing',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Contract Pricing',
                  admin: {
                    width: '25%',
                    description: 'Prijs o.b.v. contract',
                  },
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 8: SEO
        // ═══════════════════════════════════════════════════════════
        {
          label: 'SEO',
          description: 'Zoekmachine optimalisatie',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'Meta Tags',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Meta Title',
                  maxLength: 60,
                  admin: {
                    description: 'Max 60 karakters. Standaard = product naam',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Meta Beschrijving',
                  maxLength: 160,
                  admin: {
                    description: 'Max 160 karakters',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Social Share Image',
                  admin: {
                    description: 'Standaard = eerste product afbeelding',
                  },
                },
                {
                  name: 'keywords',
                  type: 'array',
                  label: 'Zoekwoorden',
                  admin: {
                    description: 'SEO keywords voor dit product',
                  },
                  fields: [
                    {
                      name: 'keyword',
                      type: 'text',
                      required: true,
                      label: 'Keyword',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 9: SPECIFICATIES
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Specificaties',
          description: 'Technische specificaties en eigenschappen',
          fields: [
            {
              name: 'specifications',
              type: 'array',
              label: 'Specificatie Groepen',
              admin: {
                description:
                  'Groepeer specificaties logisch (bijv: Technische Specificaties, Afmetingen, Materialen)',
              },
              fields: [
                {
                  name: 'group',
                  type: 'text',
                  required: true,
                  label: 'Groep Naam',
                  admin: {
                    description: 'Bijv: "Technische Specificaties", "Afmetingen"',
                  },
                },
                {
                  name: 'attributes',
                  type: 'array',
                  label: 'Attributen',
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
                            width: '40%',
                            placeholder: 'Bijv: Materiaal',
                          },
                        },
                        {
                          name: 'value',
                          type: 'text',
                          required: true,
                          label: 'Waarde',
                          admin: {
                            width: '40%',
                            placeholder: 'Bijv: Nitrile',
                          },
                        },
                        {
                          name: 'unit',
                          type: 'text',
                          label: 'Eenheid',
                          admin: {
                            width: '20%',
                            placeholder: 'cm, kg, etc.',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 10: GERELATEERD
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Gerelateerd',
          description: 'Gerelateerde producten, cross-sells en up-sells',
          fields: [
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'Gerelateerde Producten',
              admin: {
                description: 'Producten die vaak samen bekeken worden',
              },
            },
            {
              name: 'crossSells',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'Cross-Sells',
              admin: {
                description: 'Vaak samen gekocht - toon in winkelwagen',
              },
            },
            {
              name: 'upSells',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'Up-Sells',
              admin: {
                description: 'Upgrade suggesties - betere/duurdere alternatieven',
              },
            },
            {
              name: 'accessories',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'Accessoires',
              admin: {
                description: 'Optionele accessoires en toebehoren',
              },
            },
          ],
        },
      ],
    },
  ],
}
