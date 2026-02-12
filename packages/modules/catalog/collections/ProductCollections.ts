import type { CollectionConfig } from 'payload'

/**
 * Product Collections
 * Curated product groups (e.g., "Summer Sale", "New Arrivals", "Staff Picks")
 */
export const ProductCollections: CollectionConfig = {
  slug: 'product-collections',
  labels: {
    singular: 'Product Collectie',
    plural: 'Product Collecties',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'featured', 'visible', 'order', 'updatedAt'],
    group: 'Catalog',
    description: 'Beheer gecureerde product collecties',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Collectie Naam',
      admin: {
        description: 'Bijvoorbeeld: "Zomer Sale", "Nieuw Binnen", "Personeel Keuze"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
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
      name: 'description',
      type: 'richText',
      label: 'Beschrijving',
      admin: {
        description: 'Collectie beschrijving voor landingspagina',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Collectie Afbeelding',
      admin: {
        description: 'Header/banner afbeelding',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Producten',
          fields: [
            {
              name: 'manualProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'Handmatig Geselecteerde Producten',
              admin: {
                description: 'Selecteer producten handmatig',
              },
            },
            {
              type: 'collapsible',
              label: 'Automatische Regels',
              admin: {
                initCollapsed: true,
                description: 'Voeg automatisch producten toe op basis van criteria',
              },
              fields: [
                {
                  name: 'autoInclude',
                  type: 'checkbox',
                  label: 'Automatisch Toevoegen Inschakelen',
                  defaultValue: false,
                  admin: {
                    description: 'Producten die aan onderstaande criteria voldoen worden automatisch toegevoegd',
                  },
                },
                {
                  name: 'rules',
                  type: 'group',
                  label: 'Inclusie Regels',
                  admin: {
                    condition: (data) => data.autoInclude,
                  },
                  fields: [
                    {
                      name: 'categories',
                      type: 'relationship',
                      relationTo: 'product-categories',
                      hasMany: true,
                      label: 'Categorieën',
                      admin: {
                        description: 'Voeg producten uit deze categorieën toe',
                      },
                    },
                    {
                      name: 'tags',
                      type: 'array',
                      label: 'Tags',
                      admin: {
                        description: 'Voeg producten met deze tags toe',
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
                      name: 'brands',
                      type: 'array',
                      label: 'Merken',
                      admin: {
                        description: 'Voeg producten van deze merken toe',
                      },
                      fields: [
                        {
                          name: 'brand',
                          type: 'text',
                          required: true,
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'minPrice',
                          type: 'number',
                          min: 0,
                          label: 'Min Prijs',
                          admin: {
                            width: '50%',
                            step: 0.01,
                          },
                        },
                        {
                          name: 'maxPrice',
                          type: 'number',
                          min: 0,
                          label: 'Max Prijs',
                          admin: {
                            width: '50%',
                            step: 0.01,
                          },
                        },
                      ],
                    },
                    {
                      name: 'featured',
                      type: 'checkbox',
                      label: 'Alleen Uitgelichte Producten',
                      defaultValue: false,
                    },
                    {
                      name: 'maxProducts',
                      type: 'number',
                      min: 1,
                      label: 'Max Aantal Producten',
                      admin: {
                        description: 'Limiet voor auto-include (optioneel)',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Instellingen',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Uitgelicht',
                  admin: {
                    width: '33%',
                    description: 'Toon op homepage',
                  },
                },
                {
                  name: 'visible',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Zichtbaar',
                  admin: {
                    width: '33%',
                    description: 'Publiek tonen',
                  },
                },
                {
                  name: 'order',
                  type: 'number',
                  required: true,
                  defaultValue: 0,
                  label: 'Volgorde',
                  admin: {
                    width: '34%',
                    description: 'Sorteervolgorde (laag = eerst)',
                  },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'SEO',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: 'Meta Titel',
                  maxLength: 60,
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  label: 'Meta Beschrijving',
                  maxLength: 160,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        // If auto-include is enabled, fetch matching products
        if (doc.autoInclude && doc.rules) {
          // This would fetch products based on rules
          // Implementation depends on how you want to handle this
          // For now, we'll just return the doc
        }
        return doc
      },
    ],
  },
  timestamps: true,
}
