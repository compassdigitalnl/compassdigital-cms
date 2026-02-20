import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { slugField } from 'payload'

// Importeer alle custom blocks
import { Hero } from '@/blocks/Hero'
import { Content } from '@/blocks/Content/config'
import { TwoColumn } from '@/blocks/TwoColumn'
import { CTA } from '@/blocks/CTA'
import { Services } from '@/blocks/Services' // Features/USPs
import { FAQ } from '@/blocks/FAQ'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock'
import { CasesBlock } from '@/blocks/CasesBlock'
import { LogoBar } from '@/blocks/LogoBar'
import { CategoryGrid } from '@/blocks/CategoryGrid'
import { Stats } from '@/blocks/Stats'
import { Team } from '@/blocks/Team'
import { ContactFormBlock } from '@/blocks/ContactFormBlock'
import { ImageGallery } from '@/blocks/ImageGallery'
import { Video } from '@/blocks/Video'
import { Map } from '@/blocks/Map'
import { Accordion } from '@/blocks/Accordion'
import { Spacer } from '@/blocks/Spacer'
import { BlogPreview } from '@/blocks/BlogPreview'

// E-commerce blocks
import { ProductGrid } from '@/blocks/ProductGrid'
import { QuickOrder } from '@/blocks/QuickOrder'

// Hooks
import { revalidatePage, revalidateDelete } from './hooks/revalidatePage'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { isClientDeployment } from '@/lib/isClientDeployment'

// Check for disabled collections to prevent invalid relationship errors
const disabledCollections = new Set(
  (process.env.DISABLED_COLLECTIONS || '').split(',').map(s => s.trim()).filter(Boolean)
)

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    hidden: ({ user }) => (isClientDeployment() ? false : checkRole(['admin'], user)),
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
  },
  access: {
    read: () => true, // Publiek leesbaar (frontend)
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user), // Klant mag pagina's aanmaken
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user), // Admin + editor kunnen bewerken
    delete: ({ req: { user } }) => checkRole(['admin', 'editor'], user), // Klant mag eigen pagina's verwijderen
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 10,
  },
  fields: [
    // ─── Pagina Meta ────────────────────────
    {
      name: 'title',
      type: 'text',
      label: 'Paginatitel',
      required: true,
    },
    slugField(),
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'published',
      options: [
        { label: 'Gepubliceerd', value: 'published' },
        { label: 'Concept', value: 'draft' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedOn',
      type: 'date',
      label: 'Publicatiedatum',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData.status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },

    // ─── Kleurenschema (wizard-gegenereerd) ──────────
    {
      name: 'colorScheme',
      type: 'group',
      label: 'Kleurenschema',
      admin: {
        position: 'sidebar',
        description: 'Automatisch gegenereerd door de wizard. Laat leeg voor standaard kleuren.',
      },
      fields: [
        {
          name: 'primary',
          type: 'text',
          label: 'Primary Color',
          admin: {
            placeholder: '#6366f1',
          },
        },
        {
          name: 'secondary',
          type: 'text',
          label: 'Secondary Color',
          admin: {
            placeholder: '#8b5cf6',
          },
        },
        {
          name: 'accent',
          type: 'text',
          label: 'Accent Color',
          admin: {
            placeholder: '#ec4899',
          },
        },
      ],
    },

    // ─── Layout Builder (de kern!) ──────────
    {
      name: 'layout',
      type: 'blocks',
      label: 'Pagina-inhoud',
      labels: {
        singular: 'Blok',
        plural: 'Blokken',
      },
      admin: {
        description: 'Sleep blokken om de volgorde te wijzigen. Klik op een blok om de inhoud te bewerken.',
        initCollapsed: true,
      },
      blocks: [
        // ── Layout ──
        Spacer,

        // ── Basis blokken ──
        Hero,
        Content,
        TwoColumn,

        // ── E-commerce blokken ──
        ProductGrid,
        CategoryGrid, // Product categorieën
        // Services block - only if services collection is enabled
        ...(disabledCollections.has('services') ? [] : [Services]), // Features/USPs
        QuickOrder,

        // ── Conversie blokken ──
        CTA,
        ContactFormBlock,

        // ── Social proof & Portfolio ──
        TestimonialsBlock, // Klant reviews
        // Cases block - only if cases collection is enabled
        ...(disabledCollections.has('cases') ? [] : [CasesBlock]), // Portfolio/projecten
        LogoBar, // Partner/klant logo's
        Stats,

        // ── Informatief ──
        FAQ,
        Team,
        Accordion,
        BlogPreview,

        // ── Media ──
        ImageGallery,
        Video,
        Map,
      ],
    },

    // ─── SEO Score Panel (Real-time feedback) ──────────
    {
      name: 'seoScore',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/seo/SEOScorePanel#SEOScorePanel',
        },
      },
    },

    // ─── Schema Preview Panel (JSON-LD preview) ────────
    {
      name: 'schemaPreview',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/seo/SchemaPreviewPanel#SchemaPreviewPanel',
        },
      },
    },

    // SEO fields are automatically added by @payloadcms/plugin-seo
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },
}
