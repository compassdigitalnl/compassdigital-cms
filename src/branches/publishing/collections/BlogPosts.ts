import type { CollectionConfig, Field } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { featureFields } from '@/lib/tenant/featureFields'
import { autoGenerateSlug } from '@/utilities/slugify'
import { autoFillSEO, autoSetPublishedDate, autoSetAuthor } from '@/features/seo/lib/seoAutoFill'
import { isCollectionEnabled } from '@/lib/tenant/isCollectionDisabled'
import {
  BoldFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
  BlocksFeature,
} from '@payloadcms/richtext-lexical'

// Blog-specific blocks
import { InfoBox } from '@/branches/shared/blocks/InfoBox/config'
import { ProductEmbed } from '@/branches/ecommerce/shared/blocks/ProductEmbed'
import { ComparisonTable } from '@/branches/ecommerce/shared/blocks/ComparisonTable'
import { FAQ } from '@/branches/shared/blocks/FAQ'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
    hidden: shouldHideCollection('blog'),
  },
  access: {
    read: ({ req: { user } }) => {
      // Publiek kan published posts lezen, editors kunnen alle zien
      if (checkRole(['admin', 'editor'], user)) return true
      return {
        status: { equals: 'published' },
      }
    },
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 10,
  },
  fields: [
    // ═══════════════════════════════════════════════════════════
    // BASIC INFO
    // ═══════════════════════════════════════════════════════════
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
      admin: {
        placeholder: 'De complete gids voor medische handschoenen',
        components: {
          Field: '@/branches/shared/components/admin/fields/AITextField#AITextField',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL slug',
      admin: {
        position: 'sidebar',
        description: 'Auto-gegenereerd uit titel (kan handmatig overschreven worden)',
      },
      hooks: {
        beforeValidate: [autoGenerateSlug],
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      label: 'Excerpt / Intro',
      admin: {
        description: 'Korte samenvatting (max 160 tekens) - getoond in overzichten en intro paragraph',
        rows: 3,
        components: {
          Field: '@/branches/shared/components/admin/fields/AITextareaField#AITextareaField',
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // MEDIA
    // ═══════════════════════════════════════════════════════════
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Hero Afbeelding',
      admin: {
        description: 'Grote afbeelding bovenaan artikel (360px hoog)',
      },
    },
    {
      name: 'featuredImageEmoji',
      type: 'text',
      label: 'Hero Emoji (alternatief)',
      admin: {
        description: 'Als er geen afbeelding is: toon een emoji als placeholder (bijv: 🧤)',
        placeholder: '🧤',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // CATEGORIZATION & TAGGING
    // ═══════════════════════════════════════════════════════════
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'blog-categories',
      hasMany: true,
      required: true,
      label: 'Categorieën',
      admin: {
        position: 'sidebar',
        description: 'Selecteer 1 of meer categorieën. Eerste categorie wordt gebruikt in URL.',
      },
    },
    {
      name: 'featuredTag',
      type: 'select',
      label: 'Featured Tag / Badge',
      options: [
        { label: 'Geen badge', value: 'none' },
        { label: '📖 Handleiding', value: 'guide' },
        { label: '🆕 Nieuw', value: 'new' },
        { label: '⭐ Uitgelicht', value: 'featured' },
        { label: '💡 Tip', value: 'tip' },
        { label: '📰 Nieuws', value: 'news' },
      ],
      defaultValue: 'none',
      admin: {
        description: 'Badge getoond op hero image (top-left)',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: {
        description: 'Zoektermen en onderwerpen (getoond onderaan artikel)',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          label: 'Tag',
          admin: {
            placeholder: 'Bijv: Handschoenen, Nitrile, Hygiëne',
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // CONTENT
    // ═══════════════════════════════════════════════════════════
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Content',
      admin: {
        description:
          'Hoofdcontent van het artikel (ondersteunt headings, lists, bold, links, info boxes, product embeds, tabellen, FAQ)',
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature({
            enabledCollections: ['pages', 'blog-posts', 'products'],
          }),
          OrderedListFeature(),
          UnorderedListFeature(),
          BlocksFeature({
            blocks: [InfoBox, ProductEmbed, ComparisonTable, FAQ],
          }),
        ],
      }),
    },

    // ═══════════════════════════════════════════════════════════
    // AUTHOR & META
    // ═══════════════════════════════════════════════════════════
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Auteur',
      admin: {
        position: 'sidebar',
        description: 'Wordt getoond in author box',
      },
    },
    {
      name: 'authorBio',
      type: 'textarea',
      label: 'Auteur Bio (override)',
      admin: {
        description: 'Optioneel: overschrijf auteur bio voor dit artikel',
        rows: 2,
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      label: 'Leestijd (minuten)',
      admin: {
        description: 'Automatisch berekend, maar kan handmatig overschreven worden',
      },
    },
    {
      name: 'viewCount',
      type: 'number',
      label: 'Aantal views',
      defaultValue: 0,
      admin: {
        description: 'Wordt automatisch bijgewerkt bij elke page view',
        readOnly: true,
      },
    },

    // ═══════════════════════════════════════════════════════════
    // FEATURED & DISPLAY
    // ═══════════════════════════════════════════════════════════
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht artikel',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Toon als grote featured card bovenaan blog archive',
      },
    },
    {
      name: 'template',
      type: 'select',
      label: 'Template',
      defaultValue: 'blogtemplate1',
      options: [
        { label: 'Template 1 - Enterprise (volledig, sidebar, TOC)', value: 'blogtemplate1' },
        { label: 'Template 2 - Minimal (centered, clean)', value: 'blogtemplate2' },
        { label: 'Template 3 - Premium (wide, elegant)', value: 'blogtemplate3' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Layout template voor dit artikel',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // SPRINT 7: PREMIUM CONTENT & PAYWALL
    // ═══════════════════════════════════════════════════════════
    {
      name: 'contentType',
      type: 'select',
      label: 'Content Type',
      defaultValue: 'article',
      options: [
        { label: '📄 Artikel', value: 'article' },
        { label: '📊 Productgids', value: 'guide' },
        { label: '🎓 E-learning', value: 'elearning' },
        { label: '📥 Download (PDF)', value: 'download' },
        { label: '🎥 Video', value: 'video' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Type content - bepaalt badge/icon in overzicht en kennisbank filtering',
      },
    },
    {
      name: 'contentAccess',
      type: 'group',
      label: 'Content Toegang',
      fields: [
        {
          name: 'accessLevel',
          type: 'select',
          required: true,
          defaultValue: 'free',
          label: 'Toegangsniveau',
          options: [
            { label: '✅ Gratis (voor iedereen)', value: 'free' },
            { label: '⭐ Premium/Pro (alleen voor Pro leden)', value: 'premium' },
          ],
          admin: {
            description: 'Wie kan dit artikel volledig lezen?',
          },
        },
        {
          name: 'previewLength',
          type: 'number',
          label: 'Preview Lengte (woorden)',
          defaultValue: 200,
          admin: {
            description:
              'Hoeveel woorden gratis te lezen? (bijv. 200). Daarna wordt paywall getoond.',
            condition: (data, siblingData) => siblingData?.accessLevel === 'premium',
          },
        },
        {
          name: 'lockMessage',
          type: 'textarea',
          label: 'Paywall Bericht (optioneel)',
          admin: {
            description:
              'Custom bericht op paywall. Als leeg: standaard "Upgrade naar Pro" bericht.',
            condition: (data, siblingData) => siblingData?.accessLevel === 'premium',
            rows: 2,
            placeholder:
              'Ontgrendel dit artikel en 40+ andere expertgidsen met een Pro membership.',
          },
        },
      ],
      admin: {
        description: 'Bepaal wie toegang heeft tot dit artikel en hoe de paywall werkt',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // RELATED CONTENT
    // ═══════════════════════════════════════════════════════════
    ...featureFields('shop', [
      {
        name: 'relatedProducts',
        type: 'relationship',
        relationTo: 'products',
        hasMany: true,
        label: 'Gerelateerde Producten',
        admin: {
          description: 'Producten genoemd in artikel (getoond in sidebar + inline embeds)',
        },
      },
    ]),
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'blog-posts',
      hasMany: true,
      label: 'Gerelateerde Artikelen',
      admin: {
        description: 'Handmatig geselecteerde gerelateerde artikelen (max 3)',
      },
    },
    // Related cases via unified content-cases collection
    ...(isCollectionEnabled('content-cases')
      ? [
          {
            name: 'relatedCases',
            type: 'relationship',
            relationTo: 'content-cases',
            hasMany: true,
            label: 'Gerelateerde Cases',
            admin: {
              description: 'Cases die bij dit artikel horen',
            },
          } satisfies Field,
        ]
      : []),
    // Related services via unified content-services collection
    ...(isCollectionEnabled('content-services')
      ? [
          {
            name: 'relatedServices',
            type: 'relationship',
            relationTo: 'content-services',
            hasMany: true,
            label: 'Gerelateerde Diensten',
            admin: {
              description: 'Diensten die bij dit artikel horen',
            },
          } satisfies Field,
        ]
      : []),

    // ═══════════════════════════════════════════════════════════
    // SEO & SCHEMA
    // ═══════════════════════════════════════════════════════════
    // Note: metaTitle and metaDescription are provided by @payloadcms/plugin-seo
    // in the 'meta' group. No need to duplicate them here.

    {
      name: 'faq',
      type: 'array',
      label: 'FAQ (voor SEO schema)',
      admin: {
        description: 'Optioneel: voeg FAQ toe voor Google rich snippets',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          label: 'Vraag',
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
          label: 'Antwoord',
          admin: {
            rows: 3,
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // FEATURES
    // ═══════════════════════════════════════════════════════════
    {
      name: 'enableTOC',
      type: 'checkbox',
      label: 'Table of Contents inschakelen',
      defaultValue: true,
      admin: {
        description: 'Toon automatische inhoudsopgave in sidebar (Template 1)',
      },
    },
    {
      name: 'enableShare',
      type: 'checkbox',
      label: 'Share buttons inschakelen',
      defaultValue: true,
      admin: {
        description: 'Toon LinkedIn, Email, Link, Print buttons onderaan artikel',
      },
    },
    {
      name: 'enableComments',
      type: 'checkbox',
      label: 'Comments inschakelen',
      defaultValue: false,
      admin: {
        description: 'Toon comment sectie onderaan artikel (toekomstige feature)',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // STATUS & PUBLISH
    // ═══════════════════════════════════════════════════════════
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publicatiedatum',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Gepubliceerd', value: 'published' },
        { label: 'Concept', value: 'draft' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishAt',
      type: 'date',
      label: 'Inplannen: publiceren op',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Automatisch publiceren op dit tijdstip.',
        condition: (data) => data?.status === 'draft',
      },
    },
    {
      name: 'unpublishAt',
      type: 'date',
      label: 'Inplannen: depubliceren op',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Automatisch depubliceren op dit tijdstip.',
        condition: (data) => data?.status === 'published',
      },
    },
  ],
  hooks: {
    beforeChange: [
      autoFillSEO, // Auto-fill meta title, description, OG image
      autoSetPublishedDate, // Auto-set published date on status change
      autoSetAuthor, // Auto-set author to current user
      async ({ data, operation }) => {
        // Auto-calculate reading time from content
        if (data.content && !data.readingTime) {
          // Extract text from Lexical content (rough estimate)
          const contentString = JSON.stringify(data.content)
          const wordCount = contentString.split(/\s+/).length
          // Average reading speed: 200 words per minute
          data.readingTime = Math.ceil(wordCount / 200)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        // Fire-and-forget: index blog post in Meilisearch
        import('@/features/search/lib/meilisearch/indexBlogPosts').then(({ indexBlogPost }) => {
          indexBlogPost(doc).catch(() => {})
        }).catch(() => {})
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        // Fire-and-forget: remove blog post from Meilisearch
        import('@/features/search/lib/meilisearch/indexBlogPosts').then(({ deleteBlogPostFromIndex }) => {
          deleteBlogPostFromIndex(doc.id).catch(() => {})
        }).catch(() => {})
      },
    ],
  },
}

export default BlogPosts
