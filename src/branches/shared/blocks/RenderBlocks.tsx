import React, { Fragment } from 'react'
import type { Page } from '../payload-types'

// Oude blocks (blijven)
import { ContentBlock } from '@/branches/shared/blocks/Content/Component'

// Nieuwe custom blocks
import { HeroBlockComponent } from '@/branches/shared/blocks/Hero/Component'
import { FeaturesBlock } from '@/branches/shared/blocks/Features/Component'
import { FAQBlockComponent } from '@/branches/shared/blocks/FAQ/Component'
import { CTABlockComponent } from '@/branches/shared/blocks/CTA/Component'
import { TwoColumnBlockComponent } from '@/branches/shared/blocks/TwoColumn/Component'
import { TestimonialsBlockComponent } from '@/branches/shared/blocks/TestimonialsBlock/Component'
import { LogoBarBlockComponent } from '@/branches/shared/blocks/LogoBar/Component'
import { CategoryGrid } from '@/branches/ecommerce/blocks/CategoryGrid/Component'
import { StatsBlockComponent } from '@/branches/shared/blocks/Stats/Component'
import { TeamBlockComponent } from '@/branches/shared/blocks/Team/Component'
import { ContactFormBlockComponent } from '@/branches/shared/blocks/ContactFormBlock/Component'
import { PricingBlockComponent } from '@/branches/shared/blocks/Pricing/Component'
import { ProductGrid } from '@/branches/ecommerce/blocks/ProductGrid/Component'
import { ImageGalleryBlockComponent } from '@/branches/shared/blocks/ImageGallery/Component'
import { VideoBlockComponent } from '@/branches/shared/blocks/Video/Component'
import { MapBlockComponent } from '@/branches/shared/blocks/Map/Component'
import { AccordionBlockComponent } from '@/branches/shared/blocks/Accordion/Component'
import { SpacerBlockComponent } from '@/branches/shared/blocks/Spacer/Component'
import { BlogPreviewBlockComponent } from '@/branches/shared/blocks/BlogPreview/Component'
import { QuickOrderComponent } from '@/branches/ecommerce/blocks/QuickOrder/Component'

const blockComponents = {
  // Oude (blijven)
  content: ContentBlock,

  // Nieuwe custom blocks
  hero: HeroBlockComponent,
  features: FeaturesBlock, // Updated from services
  faq: FAQBlockComponent,
  cta: CTABlockComponent,
  twoColumn: TwoColumnBlockComponent,
  testimonials: TestimonialsBlockComponent,
  logoBar: LogoBarBlockComponent,
  categoryGrid: CategoryGrid, // Updated from caseGrid
  stats: StatsBlockComponent,
  team: TeamBlockComponent,
  contactForm: ContactFormBlockComponent,
  pricing: PricingBlockComponent,
  productGrid: ProductGrid, // New e-commerce block
  imageGallery: ImageGalleryBlockComponent,
  video: VideoBlockComponent,
  map: MapBlockComponent,
  accordion: AccordionBlockComponent,
  spacer: SpacerBlockComponent,
  'blog-preview': BlogPreviewBlockComponent,
  quickOrder: QuickOrderComponent, // Phase 2: Quick order
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
