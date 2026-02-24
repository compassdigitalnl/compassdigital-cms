import React, { Fragment, Suspense, lazy } from 'react'
import type { Page } from '../payload-types'
import { isFeatureEnabled } from '@/lib/features'

// ─── LIGHTWEIGHT BLOCKS (always eager loaded) ─────────────────────
import ContentBlockComponent from '@/branches/shared/blocks/Content/Component'
import { HeroBlockComponent } from '@/branches/shared/blocks/Hero/Component'
import { FeaturesBlockComponent } from '@/branches/shared/blocks/Features/Component'
import { ServicesBlockComponent } from '@/branches/shared/blocks/Services/Component'
import { FAQBlockComponent } from '@/branches/shared/blocks/FAQ/Component'
import { CTABlockComponent } from '@/branches/shared/blocks/CTA/Component'
import { CallToActionComponent } from '@/branches/shared/blocks/CallToAction/Component'
import { TwoColumnBlockComponent } from '@/branches/shared/blocks/TwoColumn/Component'
import { LogoBarBlockComponent } from '@/branches/shared/blocks/LogoBar/Component'
import { StatsBlockComponent } from '@/branches/shared/blocks/Stats/Component'
import { TeamBlockComponent } from '@/branches/shared/blocks/Team/Component'
import { PricingBlockComponent } from '@/branches/shared/blocks/Pricing/Component'
import { ImageGalleryBlockComponent } from '@/branches/shared/blocks/ImageGallery/Component'
import { VideoBlockComponent } from '@/branches/shared/blocks/Video/Component'
import { MapBlockComponent } from '@/branches/shared/blocks/Map/Component'
import { AccordionBlockComponent } from '@/branches/shared/blocks/Accordion/Component'
import { SpacerBlockComponent } from '@/branches/shared/blocks/Spacer/Component'
import { BannerBlockComponent } from '@/branches/shared/blocks/Banner/Component'

// ─── HEAVY BLOCKS (lazy loaded to reduce SSR memory usage) ───────
// These blocks are >200 lines and are loaded on-demand to prevent OOM
const TestimonialsBlockComponent = lazy(() =>
  import('@/branches/shared/blocks/Testimonials/Component')
)
const ContactBlockComponent = lazy(() =>
  import('@/branches/shared/blocks/Contact/Component')
)
const ContactFormBlockComponent = lazy(() =>
  import('@/branches/shared/blocks/ContactFormBlock/Component')
)
const NewsletterBlockComponent = lazy(() =>
  import('@/branches/shared/blocks/Newsletter/Component')
)
const BlogPreviewBlockComponent = lazy(() =>
  import('@/branches/shared/blocks/BlogPreview/Component')
)
const ComparisonBlockComponent = lazy(() =>
  import('@/branches/shared/blocks/Comparison/Component')
)
const InfoBoxBlockComponent = lazy(() =>
  import('@/branches/shared/blocks/InfoBox/Component')
)

// ─── ECOMMERCE BLOCKS (lazy loaded, feature-gated) ────────────────
const CategoryGrid = lazy(() =>
  import('@/branches/ecommerce/blocks/CategoryGrid/Component')
)
const ProductGrid = lazy(() =>
  import('@/branches/ecommerce/blocks/ProductGrid/Component')
)
const QuickOrderComponent = lazy(() =>
  import('@/branches/ecommerce/blocks/QuickOrder/Component')
)
const ComparisonTableComponent = lazy(() =>
  import('@/branches/ecommerce/blocks/ComparisonTable/Component')
)
const ProductEmbedComponent = lazy(() =>
  import('@/branches/ecommerce/blocks/ProductEmbed/Component')
)

// ─── CONSTRUCTION BLOCKS (lazy loaded, feature-gated) ─────────────
// Note: Construction blocks are re-exported from barrel file, so we need named imports
const ConstructionHeroComponent = lazy(async () => {
  const { ConstructionHeroComponent } = await import('@/branches/construction/blocks/components')
  return { default: ConstructionHeroComponent }
})
const ServicesGridComponent = lazy(async () => {
  const { ServicesGridComponent } = await import('@/branches/construction/blocks/components')
  return { default: ServicesGridComponent }
})
const ConstructionStatsBar = lazy(async () => {
  const { StatsBarComponent } = await import('@/branches/construction/blocks/components')
  return { default: StatsBarComponent }
})
const ProjectsGridComponent = lazy(async () => {
  const { ProjectsGridComponent } = await import('@/branches/construction/blocks/components')
  return { default: ProjectsGridComponent }
})
const ReviewsGridComponent = lazy(async () => {
  const { ReviewsGridComponent } = await import('@/branches/construction/blocks/components')
  return { default: ReviewsGridComponent }
})
const CTABannerComponent = lazy(async () => {
  const { CTABannerComponent } = await import('@/branches/construction/blocks/components')
  return { default: CTABannerComponent }
})

// Loading fallback component
const BlockLoadingFallback = () => (
  <div className="w-full py-12 flex items-center justify-center">
    <div className="animate-pulse text-sm text-gray-400">Loading...</div>
  </div>
)

const blockComponents: Record<string, React.FC<any>> = {
  // ─── SHARED (always available) ────────────────────────────────────
  content: ContentBlockComponent,
  hero: HeroBlockComponent,
  features: FeaturesBlockComponent,
  services: ServicesBlockComponent,
  faq: FAQBlockComponent,
  cta: CTABlockComponent,
  calltoaction: CallToActionComponent,
  twoColumn: TwoColumnBlockComponent,
  testimonials: TestimonialsBlockComponent,
  logoBar: LogoBarBlockComponent,
  stats: StatsBlockComponent,
  team: TeamBlockComponent,
  // REMOVED: services (old) - replaced by features (B02) in Sprint 3
  contact: ContactBlockComponent,
  contactForm: ContactFormBlockComponent,
  newsletter: NewsletterBlockComponent,
  pricing: PricingBlockComponent,
  imageGallery: ImageGalleryBlockComponent,
  video: VideoBlockComponent,
  map: MapBlockComponent,
  accordion: AccordionBlockComponent,
  spacer: SpacerBlockComponent,
  'blog-preview': BlogPreviewBlockComponent,
  banner: BannerBlockComponent,
  comparison: ComparisonBlockComponent,
  infobox: InfoBoxBlockComponent,

  // ─── ECOMMERCE (only if shop enabled) ──────────────────────────────
  ...(isFeatureEnabled('shop')
    ? {
        categoryGrid: CategoryGrid,
        productGrid: ProductGrid,
        quickOrder: QuickOrderComponent,
        comparisontable: ComparisonTableComponent,
        productembed: ProductEmbedComponent,
      }
    : {}),

  // ─── CONSTRUCTION (only if construction enabled) ───────────────────
  ...(isFeatureEnabled('construction')
    ? {
        'construction-hero': ConstructionHeroComponent,
        'services-grid': ServicesGridComponent,
        'stats-bar': ConstructionStatsBar,
        'projects-grid': ProjectsGridComponent,
        'reviews-grid': ReviewsGridComponent,
        'cta-banner': CTABannerComponent,
      }
    : {}),
}

// List of lazy-loaded blocks (for Suspense wrapping)
const lazyBlocks = new Set([
  'testimonials',
  'contact',
  'contactForm',
  'newsletter',
  'blog-preview',
  'comparison',
  'infobox',
  'categoryGrid',
  'productGrid',
  'quickOrder',
  'comparisontable',
  'productembed',
  'construction-hero',
  'services-grid',
  'stats-bar',
  'projects-grid',
  'reviews-grid',
  'cta-banner',
])

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              // Wrap lazy-loaded blocks in Suspense to prevent SSR blocking
              if (lazyBlocks.has(blockType)) {
                return (
                  <Suspense key={index} fallback={<BlockLoadingFallback />}>
                    <div>
                      {/* @ts-ignore - type mismatch */}
                      <Block {...block} />
                    </div>
                  </Suspense>
                )
              }

              // Eager-loaded lightweight blocks render directly
              return (
                <div key={index}>
                  {/* @ts-ignore - type mismatch */}
                  <Block {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
