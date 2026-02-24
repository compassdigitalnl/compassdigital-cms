import React, { Fragment } from 'react'
import type { Page } from '../payload-types'
import { isFeatureEnabled } from '@/lib/features'

// ─── SHARED BLOCKS (always available) ────────────────────────────
import { ContentBlock } from '@/branches/shared/blocks/Content/Component'
import { HeroBlockComponent } from '@/branches/shared/blocks/Hero/Component'
import { FeaturesBlock } from '@/branches/shared/blocks/Features/Component'
import { FAQBlockComponent } from '@/branches/shared/blocks/FAQ/Component'
import { CTABlockComponent } from '@/branches/shared/blocks/CTA/Component'
import { TwoColumnBlockComponent } from '@/branches/shared/blocks/TwoColumn/Component'
import { TestimonialsBlockComponent } from '@/branches/shared/blocks/TestimonialsBlock/Component'
import { LogoBarBlockComponent } from '@/branches/shared/blocks/LogoBar/Component'
import { StatsBlockComponent } from '@/branches/shared/blocks/Stats/Component'
import { TeamBlockComponent } from '@/branches/shared/blocks/Team/Component'
import { ServicesBlockComponent } from '@/branches/shared/blocks/Services/Component'
import { ContactFormBlockComponent } from '@/branches/shared/blocks/ContactFormBlock/Component'
import { PricingBlockComponent } from '@/branches/shared/blocks/Pricing/Component'
import { ImageGalleryBlockComponent } from '@/branches/shared/blocks/ImageGallery/Component'
import { VideoBlockComponent } from '@/branches/shared/blocks/Video/Component'
import { MapBlockComponent } from '@/branches/shared/blocks/Map/Component'
import { AccordionBlockComponent } from '@/branches/shared/blocks/Accordion/Component'
import { SpacerBlockComponent } from '@/branches/shared/blocks/Spacer/Component'
import { BlogPreviewBlockComponent } from '@/branches/shared/blocks/BlogPreview/Component'
import { BannerBlockComponent } from '@/branches/shared/blocks/Banner/Component'
import { ComparisonBlockComponent } from '@/branches/shared/blocks/Comparison/Component'
import { InfoBoxBlockComponent } from '@/branches/shared/blocks/InfoBox/Component'

// ─── ECOMMERCE BLOCKS (shop feature) ──────────────────────────────
import { CategoryGrid } from '@/branches/ecommerce/blocks/CategoryGrid/Component'
import { ProductGrid } from '@/branches/ecommerce/blocks/ProductGrid/Component'
import { QuickOrderComponent } from '@/branches/ecommerce/blocks/QuickOrder/Component'
import { ComparisonTableComponent } from '@/branches/ecommerce/blocks/ComparisonTable/Component'
import { ProductEmbedComponent } from '@/branches/ecommerce/blocks/ProductEmbed/Component'

// ─── CONSTRUCTION BLOCKS (construction feature) ───────────────────
import {
  ConstructionHeroComponent,
  ServicesGridComponent,
  StatsBarComponent as ConstructionStatsBar,
  ProjectsGridComponent,
  ReviewsGridComponent,
  CTABannerComponent,
} from '@/branches/construction/blocks/components'

const blockComponents: Record<string, React.FC<any>> = {
  // ─── SHARED (always available) ────────────────────────────────────
  content: ContentBlock,
  hero: HeroBlockComponent,
  features: FeaturesBlock,
  faq: FAQBlockComponent,
  cta: CTABlockComponent,
  twoColumn: TwoColumnBlockComponent,
  testimonials: TestimonialsBlockComponent,
  logobar: LogoBarBlockComponent,
  stats: StatsBlockComponent,
  team: TeamBlockComponent,
  services: ServicesBlockComponent,
  contactForm: ContactFormBlockComponent,
  pricing: PricingBlockComponent,
  imageGallery: ImageGalleryBlockComponent,
  video: VideoBlockComponent,
  map: MapBlockComponent,
  accordion: AccordionBlockComponent,
  spacer: SpacerBlockComponent,
  blogpreview: BlogPreviewBlockComponent,
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
