import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { isFeatureEnabled } from '@/lib/features'

// ─── ALL BLOCKS (eager loaded for SSR compatibility) ──────────────
// Note: React.lazy() is NOT compatible with Server Components in Next.js App Router.
// All blocks are imported eagerly to prevent OOM during SSR.
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
import TestimonialsBlockComponent from '@/branches/shared/blocks/Testimonials/Component'
import ContactBlockComponent from '@/branches/shared/blocks/Contact/Component'
import ContactFormBlockComponent from '@/branches/shared/blocks/ContactFormBlock/Component'
import NewsletterBlockComponent from '@/branches/shared/blocks/Newsletter/Component'
import BlogPreviewBlockComponent from '@/branches/shared/blocks/BlogPreview/Component'
import ComparisonBlockComponent from '@/branches/shared/blocks/Comparison/Component'
import InfoBoxBlockComponent from '@/branches/shared/blocks/InfoBox/Component'

// ─── ECOMMERCE BLOCKS (eager loaded, feature-gated at render time) ─
import CategoryGrid from '@/branches/ecommerce/blocks/CategoryGrid/Component'
import ProductGrid from '@/branches/ecommerce/blocks/ProductGrid/Component'
import QuickOrderComponent from '@/branches/ecommerce/blocks/QuickOrder/Component'
import ComparisonTableComponent from '@/branches/ecommerce/blocks/ComparisonTable/Component'
import ProductEmbedComponent from '@/branches/ecommerce/blocks/ProductEmbed/Component'

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
