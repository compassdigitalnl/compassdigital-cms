import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { slugField } from 'payload'

// Importeer alle custom blocks
import { Hero } from '@/branches/shared/blocks/Hero/config'
import { Content } from '@/branches/shared/blocks/Content/config'
import { TwoColumn } from '@/branches/shared/blocks/TwoColumn/config'
import { CTA } from '@/branches/shared/blocks/CTA/config'
import { CallToAction } from '@/branches/shared/blocks/CallToAction/config' // B30 - Inline CTA
import { Features } from '@/branches/shared/blocks/Features/config' // Features/USPs (B02)
import { Services } from '@/branches/shared/blocks/Services/config' // Services (B07)
import { FAQ } from '@/branches/shared/blocks/FAQ/config'
import { Testimonials as TestimonialsBlock } from '@/branches/shared/blocks/Testimonials/config'
import { CasesBlock } from '@/branches/shared/blocks/CasesBlock'
import { LogoBar } from '@/branches/shared/blocks/LogoBar/config'
import { CategoryGrid } from '@/branches/ecommerce/shared/blocks/CategoryGrid'
import { Stats } from '@/branches/shared/blocks/Stats/config'
import { Team } from '@/branches/shared/blocks/Team/config'
// REMOVED: Old Services block - replaced by Features (B02) in Sprint 3
// import { Services } from '@/branches/shared/blocks/Services/config'
import { Contact } from '@/branches/shared/blocks/Contact/config'
import { ContactFormBlock } from '@/branches/shared/blocks/ContactFormBlock/config'
import { Newsletter } from '@/branches/shared/blocks/Newsletter/config'
import { ImageGallery } from '@/branches/shared/blocks/ImageGallery/config'
import { Video } from '@/branches/shared/blocks/Video/config'
import { Map } from '@/branches/shared/blocks/Map'
import { Accordion } from '@/branches/shared/blocks/Accordion/config'
import { Code } from '@/branches/shared/blocks/Code/config'
import { MediaBlock } from '@/branches/shared/blocks/MediaBlock/config'
import { Spacer } from '@/branches/shared/blocks/Spacer/config'
import { BlogPreview } from '@/branches/shared/blocks/BlogPreview/config'
import { Banner } from '@/branches/shared/blocks/Banner/config'
import { Comparison } from '@/branches/shared/blocks/Comparison/config'
import { InfoBox } from '@/branches/shared/blocks/InfoBox/config'

// E-commerce blocks
import { ProductGrid } from '@/branches/ecommerce/shared/blocks/ProductGrid'
import { QuickOrder } from '@/branches/ecommerce/shared/blocks/QuickOrder'

// Construction blocks (conditional import)
import { constructionBlocks } from '@/branches/construction/blocks'

// Hooks
import { revalidatePage, revalidateDelete } from './hooks/revalidatePage'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { isClientDeployment } from '@/lib/tenant/isClientDeployment'

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
    hidden: !isClientDeployment(),
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
    {
      name: 'publishAt',
      type: 'date',
      label: 'Inplannen: publiceren op',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Stel in wanneer deze pagina automatisch gepubliceerd wordt. Laat leeg voor handmatig publiceren.',
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
        description: 'Stel in wanneer deze pagina automatisch wordt gedepubliceerd.',
        condition: (data) => data?.status === 'published',
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
        Banner, // Top announcement/promo banners
        Spacer,

        // ── Basis blokken ──
        Hero,
        Content,
        MediaBlock,
        TwoColumn,

        // ── E-commerce blokken ──
        ProductGrid,
        CategoryGrid, // Product categorieën
        QuickOrder,

        // ── Conversie blokken ──
        CTA,
        CallToAction, // B30 - Inline CTA (mid-page soft CTAs)
        Contact, // Contact information display
        ContactFormBlock, // Contact form with sidebar
        Newsletter, // Email newsletter signup

        // ── Social proof & Portfolio ──
        Features, // Features/USPs grid (B02)
        Services, // Services catalog with links (B07)
        TestimonialsBlock, // Klant reviews
        // Cases block - only if cases collection is enabled
        ...(disabledCollections.has('cases') ? [] : [CasesBlock]), // Portfolio/projecten
        LogoBar, // Partner/klant logo's
        Stats,
        // REMOVED: Services (old) - replaced by Features (B02) in Sprint 3

        // ── Informatief ──
        FAQ,
        Team,
        Accordion,
        BlogPreview,
        Comparison, // Feature comparison tables
        InfoBox, // Status notification callouts

        // ── Media ──
        ImageGallery,
        Video,
        Code,
        Map,

        // ═══════════════════════════════════════════════════════════════════════════
        // CONSTRUCTION BRANCH BLOCKS - Only if construction feature enabled
        // ═══════════════════════════════════════════════════════════════════════════
        // Construction blocks are only available when construction-services collection is enabled
        // Includes: ConstructionHero, ServicesGrid, ProjectsGrid, ReviewsGrid, CTABanner, StatsBar
        ...(disabledCollections.has('construction-services') ? [] : constructionBlocks),
      ],
    },

    // ─── SEO Score Panel (Real-time feedback) ──────────
    {
      name: 'seoScore',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/features/seo/components/SEOScorePanel#SEOScorePanel',
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
          Field: '@/features/seo/components/SchemaPreviewPanel#SchemaPreviewPanel',
        },
      },
    },

    // SEO fields are automatically added by @payloadcms/plugin-seo
  ],
  hooks: {
    afterChange: [
      revalidatePage,
      async ({ doc }) => {
        // Fire-and-forget: index page in Meilisearch
        import('@/features/search/lib/meilisearch/indexPages').then(({ indexPage }) => {
          indexPage(doc).catch(() => {})
        }).catch(() => {})
      },
    ],
    afterDelete: [
      revalidateDelete,
      async ({ doc }) => {
        // Fire-and-forget: remove page from Meilisearch
        import('@/features/search/lib/meilisearch/indexPages').then(({ deletePageFromIndex }) => {
          deletePageFromIndex(doc.id).catch(() => {})
        }).catch(() => {})
      },
    ],
  },
}

export default Pages
