import type { CollectionConfig } from 'payload'

/**
 * Pages Collection - CMS Pages with blocks
 * Supports homepage, about, services, contact, etc.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Pagina',
    plural: "Pagina's",
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'publishedAt', 'updatedAt'],
    group: 'Core',
    description: 'Content pagina\'s met flexibele content blocks',
  },
  access: {
    read: ({ req: { user } }) => {
      // Publish pages are public
      if (!user) {
        return {
          status: {
            equals: 'published',
          },
        }
      }
      return true
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
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
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Pagina Titel',
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'URL Slug',
              admin: {
                description: 'Unieke URL (bijv. "over-ons", "contact")',
              },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (!value && data?.title) {
                      return data.title
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
              name: 'excerpt',
              type: 'textarea',
              label: 'Samenvatting',
              admin: {
                description: 'Korte samenvatting (gebruikt in previews en SEO)',
              },
            },
            {
              name: 'layout',
              type: 'blocks',
              label: 'Content Blocks',
              minRows: 1,
              blocks: [
                {
                  slug: 'hero',
                  labels: {
                    singular: 'Hero',
                    plural: 'Hero Sections',
                  },
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'subheading',
                      type: 'text',
                    },
                    {
                      name: 'backgroundImage',
                      type: 'upload',
                      relationTo: 'media',
                    },
                    {
                      name: 'cta',
                      type: 'group',
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                        },
                        {
                          name: 'url',
                          type: 'text',
                        },
                      ],
                    },
                  ],
                },
                {
                  slug: 'content',
                  labels: {
                    singular: 'Content Block',
                    plural: 'Content Blocks',
                  },
                  fields: [
                    {
                      name: 'richText',
                      type: 'richText',
                      required: true,
                    },
                  ],
                },
                {
                  slug: 'twoColumn',
                  labels: {
                    singular: 'Twee Kolommen',
                    plural: 'Twee Kolommen Blocks',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'leftColumn',
                          type: 'richText',
                          admin: { width: '50%' },
                        },
                        {
                          name: 'rightColumn',
                          type: 'richText',
                          admin: { width: '50%' },
                        },
                      ],
                    },
                  ],
                },
                {
                  slug: 'imageText',
                  labels: {
                    singular: 'Image + Text',
                    plural: 'Image + Text Blocks',
                  },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    {
                      name: 'content',
                      type: 'richText',
                      required: true,
                    },
                    {
                      name: 'imagePosition',
                      type: 'select',
                      defaultValue: 'left',
                      options: [
                        { label: 'Links', value: 'left' },
                        { label: 'Rechts', value: 'right' },
                      ],
                    },
                  ],
                },
                {
                  slug: 'cta',
                  labels: {
                    singular: 'Call to Action',
                    plural: 'CTA Blocks',
                  },
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'content',
                      type: 'textarea',
                    },
                    {
                      name: 'buttons',
                      type: 'array',
                      minRows: 1,
                      maxRows: 3,
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'url',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'style',
                          type: 'select',
                          defaultValue: 'primary',
                          options: [
                            { label: 'Primary', value: 'primary' },
                            { label: 'Secondary', value: 'secondary' },
                            { label: 'Outline', value: 'outline' },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  slug: 'faq',
                  labels: {
                    singular: 'FAQ',
                    plural: 'FAQ Blocks',
                  },
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      defaultValue: 'Veelgestelde Vragen',
                    },
                    {
                      name: 'items',
                      type: 'array',
                      minRows: 1,
                      fields: [
                        {
                          name: 'question',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'answer',
                          type: 'richText',
                          required: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: 'Meta Title',
                  admin: {
                    description: 'Laat leeg om pagina titel te gebruiken',
                  },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  label: 'Meta Description',
                  maxLength: 160,
                },
                {
                  name: 'keywords',
                  type: 'text',
                  hasMany: true,
                  label: 'Keywords',
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'OG Image (Social Share)',
                },
                {
                  name: 'noIndex',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Verberg voor zoekmachines (noindex)',
                },
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'draft',
              options: [
                { label: 'Concept', value: 'draft' },
                { label: 'Gepubliceerd', value: 'published' },
                { label: 'Gearchiveerd', value: 'archived' },
              ],
            },
            {
              name: 'publishedAt',
              type: 'date',
              label: 'Publicatiedatum',
              admin: {
                date: {
                  displayFormat: 'dd-MM-yyyy HH:mm',
                },
              },
            },
            {
              name: 'template',
              type: 'select',
              label: 'Template',
              defaultValue: 'default',
              options: [
                { label: 'Standaard', value: 'default' },
                { label: 'Homepage', value: 'homepage' },
                { label: 'Breed (geen sidebar)', value: 'wide' },
                { label: 'Contact', value: 'contact' },
              ],
            },
            {
              name: 'showInMenu',
              type: 'checkbox',
              defaultValue: true,
              label: 'Toon in navigatie',
            },
            {
              name: 'menuOrder',
              type: 'number',
              defaultValue: 0,
              label: 'Menu volgorde',
              admin: {
                description: 'Lagere nummers verschijnen eerst',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date()
        }
        return data
      },
    ],
  },
  timestamps: true,
}
