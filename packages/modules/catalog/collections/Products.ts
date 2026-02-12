import type { CollectionConfig } from 'payload'

/**
 * Products Collection - Enterprise Template with 63+ fields
 * Supports B2C, B2B, and Hybrid pricing strategies
 */
export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'status', 'basePrice', 'stockStatus', 'updatedAt'],
    group: 'Catalog',
    description: 'Manage products with enterprise-level features (63+ fields)',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
    maxPerDoc: 50,
  },
  fields: [
    // ========================================
    // BASIC INFO (20 fields)
    // ========================================
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basis Info',
          description: 'Basis productinformatie (20 velden)',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Product Naam',
              admin: {
                description: 'Volledige productnaam zoals getoond aan klanten',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'Slug',
              admin: {
                description: 'URL-vriendelijke naam (bijv. premium-laptop-15inch)',
              },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (!value && data?.name) {
                      return data.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '')
                    }
                    return value
                  },
                ],
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'sku',
                  type: 'text',
                  required: true,
                  unique: true,
                  label: 'SKU',
                  admin: {
                    width: '25%',
                    description: 'Stock Keeping Unit (intern artikelnummer)',
                  },
                },
                {
                  name: 'ean',
                  type: 'text',
                  label: 'EAN',
                  admin: {
                    width: '25%',
                    description: 'European Article Number (13 cijfers)',
                  },
                },
                {
                  name: 'upc',
                  type: 'text',
                  label: 'UPC',
                  admin: {
                    width: '25%',
                    description: 'Universal Product Code',
                  },
                },
                {
                  name: 'mpn',
                  type: 'text',
                  label: 'MPN',
                  admin: {
                    width: '25%',
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
                description: 'Korte samenvatting (max 200 karakters) voor product cards',
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Volledige Beschrijving',
              required: true,
              admin: {
                description: 'Uitgebreide productbeschrijving met opmaak',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'brand',
                  type: 'text',
                  label: 'Merk',
                  admin: {
                    width: '33%',
                    description: 'Bijvoorbeeld: Apple, Samsung, Nike',
                  },
                },
                {
                  name: 'manufacturer',
                  type: 'text',
                  label: 'Fabrikant',
                  admin: {
                    width: '33%',
                    description: 'Als afwijkend van merk',
                  },
                },
                {
                  name: 'model',
                  type: 'text',
                  label: 'Model',
                  admin: {
                    width: '34%',
                    description: 'Modelnummer of -aanduiding',
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
                description: 'Selecteer één of meerdere categorieën',
              },
            },
            {
              name: 'tags',
              type: 'array',
              label: 'Tags',
              admin: {
                description: 'Zoekwoorden en filters (bijv. "nieuw", "actie", "bestseller")',
              },
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'draft',
                  label: 'Status',
                  options: [
                    { label: 'Concept', value: 'draft' },
                    { label: 'Actief', value: 'active' },
                    { label: 'Gearchiveerd', value: 'archived' },
                    { label: 'Uitverkocht', value: 'out-of-stock' },
                  ],
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  label: 'Uitgelicht',
                  defaultValue: false,
                  admin: {
                    width: '25%',
                    description: 'Toon op homepage/uitgelichte producten',
                  },
                },
                {
                  name: 'condition',
                  type: 'select',
                  label: 'Conditie',
                  defaultValue: 'new',
                  options: [
                    { label: 'Nieuw', value: 'new' },
                    { label: 'Gereviseerd', value: 'refurbished' },
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
                    description: 'Bijv. "2 jaar", "Lifetime"',
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
                    description: 'Wanneer wordt/werd product gelanceerd',
                  },
                },
                {
                  name: 'endOfLife',
                  type: 'date',
                  label: 'End of Life',
                  admin: {
                    width: '50%',
                    description: 'Wanneer wordt product uitgefaseerd',
                  },
                },
              ],
            },
          ],
        },

        // ========================================
        // PRICING (8-28 fields based on configuration)
        // ========================================
        {
          label: 'Prijzen',
          description: 'Prijsinformatie en role-based pricing (8-28 velden)',
          fields: [
            {
              type: 'collapsible',
              label: 'Basis Prijzen',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'basePrice',
                      type: 'number',
                      required: true,
                      min: 0,
                      label: 'Basis Prijs',
                      admin: {
                        width: '33%',
                        description: 'Standaard verkoopprijs (excl. BTW)',
                        step: 0.01,
                      },
                    },
                    {
                      name: 'salePrice',
                      type: 'number',
                      min: 0,
                      label: 'Actieprijs',
                      admin: {
                        width: '33%',
                        description: 'Gereduceerde prijs tijdens actie',
                        step: 0.01,
                      },
                    },
                    {
                      name: 'currency',
                      type: 'select',
                      required: true,
                      defaultValue: 'EUR',
                      label: 'Valuta',
                      options: [
                        { label: '€ EUR', value: 'EUR' },
                        { label: '$ USD', value: 'USD' },
                        { label: '£ GBP', value: 'GBP' },
                      ],
                      admin: {
                        width: '34%',
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
                      label: 'Kostprijs',
                      admin: {
                        width: '50%',
                        description: 'Inkoopprijs (intern)',
                        step: 0.01,
                      },
                    },
                    {
                      name: 'msrp',
                      type: 'number',
                      min: 0,
                      label: 'Adviesprijs (MSRP)',
                      admin: {
                        width: '50%',
                        description: 'Manufacturer Suggested Retail Price',
                        step: 0.01,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'BTW Configuratie',
              admin: {
                initCollapsed: true,
              },
              fields: [
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
                        description: 'Zijn bovenstaande prijzen incl. BTW?',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Role-Based Pricing (B2B)',
              admin: {
                initCollapsed: true,
                description: 'Speciale prijzen per klantengroep',
              },
              fields: [
                {
                  name: 'rolePrices',
                  type: 'array',
                  label: 'Rol Prijzen',
                  admin: {
                    description: 'Max 20 custom pricing roles',
                  },
                  maxRows: 20,
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'roleId',
                          type: 'text',
                          required: true,
                          label: 'Rol ID',
                          admin: {
                            width: '25%',
                            description: 'Bijv. "wholesale", "vip"',
                          },
                        },
                        {
                          name: 'roleName',
                          type: 'text',
                          required: true,
                          label: 'Rol Naam',
                          admin: {
                            width: '25%',
                          },
                        },
                        {
                          name: 'price',
                          type: 'number',
                          required: true,
                          min: 0,
                          label: 'Prijs',
                          admin: {
                            width: '25%',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'minQuantity',
                          type: 'number',
                          min: 1,
                          label: 'Min Aantal',
                          admin: {
                            width: '25%',
                            description: 'Optioneel: vanaf X stuks',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Volume Pricing (Staffelkortingen)',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'volumePricing',
                  type: 'array',
                  label: 'Volume Prijzen',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'minQuantity',
                          type: 'number',
                          required: true,
                          min: 1,
                          label: 'Min Aantal',
                          admin: {
                            width: '25%',
                          },
                        },
                        {
                          name: 'maxQuantity',
                          type: 'number',
                          min: 1,
                          label: 'Max Aantal',
                          admin: {
                            width: '25%',
                            description: 'Optioneel',
                          },
                        },
                        {
                          name: 'price',
                          type: 'number',
                          required: true,
                          min: 0,
                          label: 'Prijs per stuk',
                          admin: {
                            width: '25%',
                            step: 0.01,
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
                            description: 'Of vul korting percentage in',
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

        // ========================================
        // INVENTORY (6 fields)
        // ========================================
        {
          label: 'Voorraad',
          description: 'Voorraadbeheer (6 velden)',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'trackStock',
                  type: 'checkbox',
                  label: 'Voorraad Bijhouden',
                  defaultValue: true,
                  admin: {
                    width: '50%',
                    description: 'Automatisch voorraad beheren',
                  },
                },
                {
                  name: 'stockStatus',
                  type: 'select',
                  required: true,
                  defaultValue: 'in-stock',
                  label: 'Voorraad Status',
                  options: [
                    { label: 'Op voorraad', value: 'in-stock' },
                    { label: 'Uitverkocht', value: 'out-of-stock' },
                    { label: 'Op backorder', value: 'on-backorder' },
                    { label: 'Niet meer leverbaar', value: 'discontinued' },
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
                  name: 'stockQuantity',
                  type: 'number',
                  min: 0,
                  label: 'Voorraad Aantal',
                  admin: {
                    width: '33%',
                    description: 'Huidige voorraad',
                    condition: (data) => data.trackStock,
                  },
                },
                {
                  name: 'lowStockThreshold',
                  type: 'number',
                  min: 0,
                  label: 'Lage Voorraad Drempel',
                  defaultValue: 5,
                  admin: {
                    width: '33%',
                    description: 'Waarschuwing bij X stuks',
                    condition: (data) => data.trackStock,
                  },
                },
                {
                  name: 'backordersAllowed',
                  type: 'checkbox',
                  label: 'Backorders Toestaan',
                  defaultValue: false,
                  admin: {
                    width: '34%',
                    description: 'Verkopen bij 0 voorraad',
                  },
                },
              ],
            },
            {
              name: 'availabilityDate',
              type: 'date',
              label: 'Verwachte Leverdatum',
              admin: {
                description: 'Voor pre-orders of backorders',
                condition: (data) => data.stockStatus === 'on-backorder',
              },
            },
          ],
        },

        // ========================================
        // SHIPPING (5 fields)
        // ========================================
        {
          label: 'Verzending',
          description: 'Verzendgegevens (5 velden)',
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
                    width: '50%',
                    step: 0.01,
                    description: 'Voor verzendberekening',
                  },
                },
                {
                  name: 'weightUnit',
                  type: 'select',
                  label: 'Gewicht Eenheid',
                  defaultValue: 'kg',
                  options: [
                    { label: 'Kilogram (kg)', value: 'kg' },
                    { label: 'Gram (g)', value: 'g' },
                    { label: 'Pound (lb)', value: 'lb' },
                    { label: 'Ounce (oz)', value: 'oz' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Afmetingen',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'dimensionsLength',
                      type: 'number',
                      min: 0,
                      label: 'Lengte',
                      admin: {
                        width: '25%',
                        step: 0.1,
                      },
                    },
                    {
                      name: 'dimensionsWidth',
                      type: 'number',
                      min: 0,
                      label: 'Breedte',
                      admin: {
                        width: '25%',
                        step: 0.1,
                      },
                    },
                    {
                      name: 'dimensionsHeight',
                      type: 'number',
                      min: 0,
                      label: 'Hoogte',
                      admin: {
                        width: '25%',
                        step: 0.1,
                      },
                    },
                    {
                      name: 'dimensionsUnit',
                      type: 'select',
                      label: 'Eenheid',
                      defaultValue: 'cm',
                      options: [
                        { label: 'Centimeter (cm)', value: 'cm' },
                        { label: 'Meter (m)', value: 'm' },
                        { label: 'Inch (in)', value: 'in' },
                        { label: 'Feet (ft)', value: 'ft' },
                      ],
                      admin: {
                        width: '25%',
                      },
                    },
                  ],
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
                    description: 'Bijv. "bulky", "fragile", "express"',
                  },
                },
                {
                  name: 'freeShipping',
                  type: 'checkbox',
                  label: 'Gratis Verzending',
                  defaultValue: false,
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'handlingTime',
                  type: 'number',
                  min: 0,
                  label: 'Verwerkingstijd (dagen)',
                  defaultValue: 1,
                  admin: {
                    width: '25%',
                    description: 'Dagen voor verzending',
                  },
                },
              ],
            },
          ],
        },

        // ========================================
        // MEDIA (5 fields)
        // ========================================
        {
          label: 'Media',
          description: 'Afbeeldingen en video\'s (5 velden)',
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hoofdafbeelding',
              required: true,
              admin: {
                description: 'Primaire productafbeelding',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Afbeeldingen Galerij',
              maxRows: 20,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'alt',
                  type: 'text',
                  label: 'Alt Tekst',
                  admin: {
                    description: 'Beschrijving voor SEO en accessibility',
                  },
                },
              ],
            },
            {
              name: 'videos',
              type: 'array',
              label: 'Video\'s',
              maxRows: 5,
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      label: 'Video URL',
                      admin: {
                        width: '50%',
                        description: 'YouTube, Vimeo of direct link',
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
                        { label: 'Custom', value: 'custom' },
                      ],
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  name: 'thumbnail',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Video Thumbnail',
                },
              ],
            },
            {
              name: 'documents',
              type: 'array',
              label: 'Documenten',
              admin: {
                description: 'Handleidingen, datasheets, certificaten',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Titel',
                      admin: {
                        width: '40%',
                      },
                    },
                    {
                      name: 'type',
                      type: 'select',
                      required: true,
                      label: 'Type',
                      options: [
                        { label: 'Handleiding', value: 'manual' },
                        { label: 'Datasheet', value: 'datasheet' },
                        { label: 'Certificaat', value: 'certificate' },
                        { label: 'Anders', value: 'other' },
                      ],
                      admin: {
                        width: '30%',
                      },
                    },
                    {
                      name: 'file',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                      label: 'Bestand',
                      admin: {
                        width: '30%',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ========================================
        // VARIANTS (8 fields)
        // ========================================
        {
          label: 'Varianten',
          description: 'Product varianten zoals maat, kleur (8 velden)',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'hasVariants',
                  type: 'checkbox',
                  label: 'Heeft Varianten',
                  defaultValue: false,
                  admin: {
                    width: '50%',
                    description: 'Bijv. verschillende maten/kleuren',
                  },
                },
                {
                  name: 'variantType',
                  type: 'select',
                  label: 'Variant Type',
                  defaultValue: 'single',
                  options: [
                    { label: 'Dropdown (1 attribuut)', value: 'single' },
                    { label: 'Matrix (meerdere attributen)', value: 'matrix' },
                  ],
                  admin: {
                    width: '50%',
                    condition: (data) => data.hasVariants,
                  },
                },
              ],
            },
            {
              name: 'attributes',
              type: 'array',
              label: 'Variant Attributen',
              admin: {
                description: 'Bijv. Kleur, Maat, Materiaal',
                condition: (data) => data.hasVariants,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      label: 'Attribuut Naam',
                      admin: {
                        width: '40%',
                        description: 'Bijv. "Kleur", "Maat"',
                      },
                    },
                    {
                      name: 'slug',
                      type: 'text',
                      required: true,
                      label: 'Slug',
                      admin: {
                        width: '30%',
                        description: 'Bijv. "color", "size"',
                      },
                    },
                    {
                      name: 'visible',
                      type: 'checkbox',
                      label: 'Zichtbaar',
                      defaultValue: true,
                      admin: {
                        width: '15%',
                      },
                    },
                    {
                      name: 'variation',
                      type: 'checkbox',
                      label: 'Voor Variaties',
                      defaultValue: true,
                      admin: {
                        width: '15%',
                      },
                    },
                  ],
                },
                {
                  name: 'values',
                  type: 'array',
                  label: 'Waardes',
                  required: true,
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                          label: 'Label',
                          admin: {
                            width: '50%',
                            description: 'Bijv. "Rood", "Large"',
                          },
                        },
                        {
                          name: 'value',
                          type: 'text',
                          required: true,
                          label: 'Waarde',
                          admin: {
                            width: '50%',
                            description: 'Bijv. "red", "lg"',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'combinations',
              type: 'array',
              label: 'Variant Combinaties',
              admin: {
                description: 'Alle mogelijke combinaties van attributen',
                condition: (data) => data.hasVariants,
              },
              fields: [
                {
                  name: 'sku',
                  type: 'text',
                  required: true,
                  label: 'Variant SKU',
                  admin: {
                    description: 'Unieke SKU voor deze variant',
                  },
                },
                {
                  name: 'attributes',
                  type: 'json',
                  label: 'Attributen',
                  admin: {
                    description: 'JSON: {"color": "red", "size": "M"}',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'price',
                      type: 'number',
                      min: 0,
                      label: 'Prijs',
                      admin: {
                        width: '33%',
                        description: 'Laat leeg voor basis prijs',
                        step: 0.01,
                      },
                    },
                    {
                      name: 'stockQuantity',
                      type: 'number',
                      min: 0,
                      label: 'Voorraad',
                      admin: {
                        width: '33%',
                      },
                    },
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      label: 'Actief',
                      defaultValue: true,
                      admin: {
                        width: '34%',
                      },
                    },
                  ],
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Variant Afbeelding',
                  admin: {
                    description: 'Specifieke afbeelding voor deze variant',
                  },
                },
              ],
            },
          ],
        },

        // ========================================
        // SEO (4 fields)
        // ========================================
        {
          label: 'SEO',
          description: 'Zoekmachine optimalisatie (4 velden)',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Meta Titel',
              maxLength: 60,
              admin: {
                description: 'Titel voor zoekmachines (max 60 karakters)',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta Beschrijving',
              maxLength: 160,
              admin: {
                description: 'Beschrijving voor zoekmachines (max 160 karakters)',
              },
            },
            {
              name: 'keywords',
              type: 'array',
              label: 'SEO Keywords',
              fields: [
                {
                  name: 'keyword',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'canonicalUrl',
              type: 'text',
              label: 'Canonical URL',
              admin: {
                description: 'Optioneel: primaire URL voor duplicate content',
              },
            },
          ],
        },

        // ========================================
        // SPECIFICATIONS (Dynamic 4+ fields)
        // ========================================
        {
          label: 'Specificaties',
          description: 'Technische specificaties (dynamisch)',
          fields: [
            {
              name: 'specifications',
              type: 'array',
              label: 'Specificatie Groepen',
              admin: {
                description: 'Groepeer specs: Technisch, Afmetingen, Features, etc.',
              },
              fields: [
                {
                  name: 'group',
                  type: 'text',
                  required: true,
                  label: 'Groep Naam',
                  admin: {
                    description: 'Bijv. "Technische Specificaties", "Afmetingen"',
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
                            description: 'Bijv. "Processor", "Gewicht"',
                          },
                        },
                        {
                          name: 'value',
                          type: 'text',
                          required: true,
                          label: 'Waarde',
                          admin: {
                            width: '40%',
                            description: 'Bijv. "Intel i7", "2.5"',
                          },
                        },
                        {
                          name: 'unit',
                          type: 'text',
                          label: 'Eenheid',
                          admin: {
                            width: '20%',
                            description: 'Bijv. "kg", "GB"',
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

        // ========================================
        // B2B SPECIFIC
        // ========================================
        {
          label: 'B2B',
          description: 'B2B-specifieke instellingen',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'minOrderQuantity',
                  type: 'number',
                  min: 1,
                  label: 'Min Order Aantal (MOQ)',
                  admin: {
                    width: '33%',
                    description: 'Minimum afname per order',
                  },
                },
                {
                  name: 'maxOrderQuantity',
                  type: 'number',
                  min: 1,
                  label: 'Max Order Aantal',
                  admin: {
                    width: '33%',
                    description: 'Maximum afname per order',
                  },
                },
                {
                  name: 'orderMultiple',
                  type: 'number',
                  min: 1,
                  label: 'Order Veelvoud',
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
                    description: 'Productietijd na bestelling',
                  },
                },
                {
                  name: 'customizable',
                  type: 'checkbox',
                  label: 'Maatwerk Mogelijk',
                  defaultValue: false,
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'quotationRequired',
                  type: 'checkbox',
                  label: 'Offerte Verplicht',
                  defaultValue: false,
                  admin: {
                    width: '25%',
                    description: 'Geen directe aankoop mogelijk',
                  },
                },
                {
                  name: 'contractPricing',
                  type: 'checkbox',
                  label: 'Contract Pricing',
                  defaultValue: false,
                  admin: {
                    width: '25%',
                    description: 'Prijzen per contract',
                  },
                },
              ],
            },
          ],
        },

        // ========================================
        // CROSS-SELL & UPSELL
        // ========================================
        {
          label: 'Gerelateerd',
          description: 'Cross-sell, upsell en accessoires',
          fields: [
            {
              name: 'crossSells',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'Cross-Sells',
              admin: {
                description: 'Vaak samen gekocht',
              },
            },
            {
              name: 'upSells',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'Up-Sells',
              admin: {
                description: 'Upgrade suggesties (duurdere alternatieven)',
              },
            },
            {
              name: 'accessories',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'Accessoires',
              admin: {
                description: 'Bijpassende accessoires',
              },
            },
            {
              name: 'bundles',
              type: 'array',
              label: 'Bundels',
              admin: {
                description: 'Voordeelbundels met andere producten',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Bundel Naam',
                },
                {
                  name: 'products',
                  type: 'relationship',
                  relationTo: 'products',
                  hasMany: true,
                  required: true,
                  label: 'Producten in Bundel',
                },
                {
                  name: 'discount',
                  type: 'number',
                  required: true,
                  min: 0,
                  max: 100,
                  label: 'Korting %',
                  admin: {
                    description: 'Totale korting op bundel',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-generate slug if not provided
        if (!data.slug && data.name) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }

        // Set publishedAt on first publish
        if (operation === 'create' && data.status === 'active') {
          data.publishedAt = new Date()
        }

        // Track who created/updated
        if (operation === 'create') {
          data.createdBy = req.user?.id
        }
        data.updatedBy = req.user?.id

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // Log product changes for audit trail
        console.log(`Product ${operation}: ${doc.name} (${doc.id})`)
      },
    ],
  },
  timestamps: true,
}
