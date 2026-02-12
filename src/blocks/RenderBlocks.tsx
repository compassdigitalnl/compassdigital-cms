import React, { Fragment } from 'react'
import type { Page } from '../payload-types'

// Oude blocks (blijven)
import { ContentBlock } from '@/blocks/Content/Component'

// Nieuwe custom blocks
import { HeroBlockComponent } from '@/blocks/Hero/Component'
import { FeaturesBlock } from '@/blocks/Features/Component'
import { FAQBlockComponent } from '@/blocks/FAQ/Component'
import { CTABlockComponent } from '@/blocks/CTA/Component'
import { TwoColumnBlockComponent } from '@/blocks/TwoColumn/Component'
import { TestimonialsBlockComponent } from '@/blocks/TestimonialsBlock/Component'
import { LogoBarBlockComponent } from '@/blocks/LogoBar/Component'
import { CategoryGrid } from '@/blocks/CategoryGrid/Component'
import { StatsBlockComponent } from '@/blocks/Stats/Component'
import { TeamBlockComponent } from '@/blocks/Team/Component'
import { ContactFormBlockComponent } from '@/blocks/ContactFormBlock/Component'
import { PricingBlockComponent } from '@/blocks/Pricing/Component'
import { ProductGrid } from '@/blocks/ProductGrid/Component'
import { ImageGalleryBlockComponent } from '@/blocks/ImageGallery/Component'
import { VideoBlockComponent } from '@/blocks/Video/Component'
import { MapBlockComponent } from '@/blocks/Map/Component'
import { AccordionBlockComponent } from '@/blocks/Accordion/Component'
import { SpacerBlockComponent } from '@/blocks/Spacer/Component'
import { BlogPreviewBlockComponent } from '@/blocks/BlogPreview/Component'
import { TopBar } from '@/blocks/TopBar/Component'
import { Breadcrumb } from '@/blocks/Breadcrumb/Component'
import { QuickOrderComponent } from '@/blocks/QuickOrder/Component'
import { ProductFiltersComponent } from '@/blocks/ProductFilters/Component'
import { SearchBarComponent } from '@/blocks/SearchBar/Component'

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
  topBar: TopBar, // New topbar block
  breadcrumb: Breadcrumb, // New breadcrumb block
  quickOrder: QuickOrderComponent, // Phase 2: Quick order
  productFilters: ProductFiltersComponent, // Phase 2: Product filters
  searchBar: SearchBarComponent, // Phase 2: Search bar
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
