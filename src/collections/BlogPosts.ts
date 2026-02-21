import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideOnPlatform } from '@/lib/shouldHideCollection'
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
import { InfoBox } from '@/blocks/InfoBox'
import { ProductEmbed } from '@/blocks/ProductEmbed'
import { ComparisonTable } from '@/blocks/ComparisonTable'
import { FAQ } from '@/blocks/FAQ'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
    hidden: shouldHideOnPlatform(),
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
    delete: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
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
        description: 'Gebruikt in URL: /blog/{categorie}/{slug}',
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
    // RELATED CONTENT
    // ═══════════════════════════════════════════════════════════
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

    // ═══════════════════════════════════════════════════════════
    // SEO & SCHEMA
    // ═══════════════════════════════════════════════════════════
    {
      name: 'metaTitle',
      type: 'text',
      label: 'SEO Title',
      admin: {
        description: 'Optioneel: overschrijf page title voor SEO (max 60 tekens)',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'SEO Meta Description',
      admin: {
        description: 'Optioneel: overschrijf excerpt voor SEO (max 160 tekens)',
        rows: 2,
      },
    },
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
  ],
}
