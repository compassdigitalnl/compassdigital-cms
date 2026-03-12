import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { slugField } from 'payload'

// Importeer alle custom blocks
import { Hero } from '@/branches/shared/blocks/Hero'
import { Content } from '@/branches/shared/blocks/Content'
import { TwoColumn } from '@/branches/shared/blocks/TwoColumn'
import { CTA } from '@/branches/shared/blocks/CTA'
import { Features } from '@/branches/shared/blocks/Features' // Features/USPs (B02)
import { FAQ } from '@/branches/shared/blocks/FAQ'
import { Testimonials as TestimonialsBlock } from '@/branches/shared/blocks/Testimonials'
import { CasesBlock } from '@/branches/shared/blocks/CasesBlock'
import { Stats } from '@/branches/shared/blocks/Stats'
import { Team } from '@/branches/shared/blocks/Team'
// REMOVED: Old Services block - replaced by Features (B02) in Sprint 3
// import { Services } from '@/branches/shared/blocks/Services/config'
import { Contact } from '@/branches/shared/blocks/Contact'
import { Newsletter } from '@/branches/shared/blocks/Newsletter'
import { ImageGallery } from '@/branches/shared/blocks/ImageGallery'
import { Video } from '@/branches/shared/blocks/Video'
import { Map } from '@/branches/shared/blocks/Map'
import { Accordion } from '@/branches/shared/blocks/Accordion'
import { Code } from '@/branches/shared/blocks/Code'
import { MediaBlock } from '@/branches/shared/blocks/MediaBlock'
import { Spacer } from '@/branches/shared/blocks/Spacer'
import { BlogPreview } from '@/branches/shared/blocks/BlogPreview'
import { Banner } from '@/branches/shared/blocks/Banner'
import { InfoBox } from '@/branches/shared/blocks/InfoBox'
import { ProcessSteps } from '@/branches/shared/blocks/ProcessSteps'
import { CTASection } from '@/branches/shared/blocks/CTASection'
import { HeroEmailCapture } from '@/branches/shared/blocks/HeroEmailCapture'
import { TwoColumnImagePair } from '@/branches/shared/blocks/TwoColumnImagePair'
import { OfferteRequest } from '@/branches/shared/blocks/OfferteRequest'
import { Breadcrumbs } from '@/branches/shared/blocks/Breadcrumbs'
import { ReviewsWidget } from '@/branches/shared/blocks/ReviewsWidget'
import { TrustSignals } from '@/branches/shared/blocks/TrustSignals'
import { SocialProofBanner } from '@/branches/shared/blocks/SocialProofBanner'
import { LogoBar } from '@/branches/shared/blocks/LogoBar'
import { CaseStudyGrid } from '@/branches/shared/blocks/CaseStudyGrid'
import { PainPoints } from '@/branches/shared/blocks/PainPoints'
import { CompetitorComparison } from '@/branches/shared/blocks/ComparisonTable'
import { BranchePricing } from '@/branches/shared/blocks/BranchePricing'
import { Calculator } from '@/branches/shared/blocks/Calculator'

// E-commerce blocks
import { ecommerceBlocks } from '@/branches/ecommerce/shared/blocks'

// Construction blocks (conditional import)
import { constructionBlocks } from '@/branches/construction/blocks'

// Experiences blocks (conditional import)
import { experienceBlocks } from '@/branches/experiences/blocks'

// Horeca blocks (conditional import)
import { horecaBlocks } from '@/branches/horeca/blocks'

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
    delete: ({ req: { user } }) => checkRole(['admin'], user), // Alleen admin mag verwijderen
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
      admin: {
        components: {
          Field: '@/branches/shared/components/admin/fields/AITextField#AITextField',
        },
      },
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
        Breadcrumbs, // B-35: Navigation breadcrumbs

        // ── Basis blokken ──
        Hero,
        HeroEmailCapture, // B-01d: Hero with email capture form
        Content,
        MediaBlock,
        TwoColumn,
        TwoColumnImagePair, // B-02d: Two images side-by-side

        // ── Conversie blokken ──
        CTA,
        CTASection, // B-45: Dedicated CTA section with gradient variants
        Contact, // Contact information display
        Newsletter, // Email newsletter signup
        OfferteRequest, // B-29: Offerte request form

        // ── Social proof & Portfolio ──
        Features, // Features/USPs grid (B02) — nu ook met optionele per-item links
        TestimonialsBlock, // Klant reviews
        ReviewsWidget, // B-39: Product reviews with ratings
        TrustSignals, // B-40: Trust indicators/USPs
        SocialProofBanner, // B-41: Social proof metrics banner
        LogoBar, // B-42: Logo bar (klanten, certificeringen, partners)
        CaseStudyGrid, // B-43: Case study/portfolio grid
        // Cases block - only if cases collection is enabled
        ...(disabledCollections.has('cases') ? [] : [CasesBlock]), // Portfolio/projecten
        Stats,

        // ── Informatief ──
        FAQ,
        Team,
        Accordion,
        BlogPreview,
        InfoBox, // Status notification callouts
        ProcessSteps, // B-44: How-it-works process flow
        PainPoints, // Pain points: emotional recognition triggers
        CompetitorComparison, // Competitor comparison table (us vs competitors)
        BranchePricing, // Branch-specific pricing cards with competitor comparison
        Calculator, // Interactive savings calculator

        // ── Media ──
        ImageGallery,
        Video,
        Code,
        Map,

        // ═══════════════════════════════════════════════════════════════════════════
        // E-COMMERCE BLOCKS - Only if shop feature enabled
        // ═══════════════════════════════════════════════════════════════════════════
        // Includes: ProductGrid, ProductEmbed, CategoryGrid, Pricing, SubscriptionPricing,
        // QuickOrder, StaffelPricing, BundleBuilder, SubscriptionOptions, VendorShowcase,
        // ComparisonTable, PricingGradient
        ...ecommerceBlocks,

        // ═══════════════════════════════════════════════════════════════════════════
        // CONSTRUCTION BRANCH BLOCKS - Only if construction feature enabled
        // ═══════════════════════════════════════════════════════════════════════════
        ...(disabledCollections.has('construction-services') ? [] : constructionBlocks),

        // ═══════════════════════════════════════════════════════════════════════════
        // EXPERIENCES BRANCH BLOCKS - Only if experiences feature enabled
        // ═══════════════════════════════════════════════════════════════════════════
        ...(disabledCollections.has('experiences') ? [] : experienceBlocks),

        // ═══════════════════════════════════════════════════════════════════════════
        // HORECA BRANCH BLOCKS - Only if horeca feature enabled
        // ═══════════════════════════════════════════════════════════════════════════
        ...(disabledCollections.has('reservations') ? [] : horecaBlocks),
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
