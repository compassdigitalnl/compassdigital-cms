import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { isFeatureEnabled } from '@/lib/tenant/features'

// ─── ALL BLOCKS (eager loaded for SSR compatibility) ──────────────
// Note: React.lazy() is NOT compatible with Server Components in Next.js App Router.
// All blocks are imported eagerly to prevent OOM during SSR.
import ContentBlockComponent from '@/branches/shared/blocks/Content/Component'
import { HeroBlockComponent } from '@/branches/shared/blocks/Hero/Component'
import { FeaturesBlockComponent } from '@/branches/shared/blocks/Features/Component'
import { FAQBlockComponent } from '@/branches/shared/blocks/FAQ/Component'
import { CTABlockComponent } from '@/branches/shared/blocks/CTA/Component'
import { TwoColumnBlockComponent } from '@/branches/shared/blocks/TwoColumn/Component'
import { StatsBlockComponent } from '@/branches/shared/blocks/Stats/Component'
import { TeamBlockComponent } from '@/branches/shared/blocks/Team/Component'
import { ImageGalleryBlockComponent } from '@/branches/shared/blocks/ImageGallery/Component'
import { VideoBlockComponent } from '@/branches/shared/blocks/Video/Component'
import { MapBlockComponent } from '@/branches/shared/blocks/Map/Component'
import { AccordionBlockComponent } from '@/branches/shared/blocks/Accordion/Component'
import { SpacerBlockComponent } from '@/branches/shared/blocks/Spacer/Component'
import { BannerBlockComponent } from '@/branches/shared/blocks/Banner/Component'
import TestimonialsBlockComponent from '@/branches/shared/blocks/Testimonials/Component'
import ContactBlockComponent from '@/branches/shared/blocks/Contact/Component'
import NewsletterBlockComponent from '@/branches/shared/blocks/Newsletter/Component'
import BlogPreviewBlockComponent from '@/branches/shared/blocks/BlogPreview/Component'
import InfoBoxBlockComponent from '@/branches/shared/blocks/InfoBox/Component'
import MediaBlockComponent from '@/branches/shared/blocks/MediaBlock/Component'
import { ProcessStepsBlockComponent } from '@/branches/shared/blocks/ProcessSteps/Component'
import { CTASectionBlockComponent } from '@/branches/shared/blocks/CTASection/Component'
import { HeroEmailCaptureBlockComponent } from '@/branches/shared/blocks/HeroEmailCapture/Component'
import { TwoColumnImagePairBlockComponent } from '@/branches/shared/blocks/TwoColumnImagePair/Component'
import { OfferteRequestBlockComponent } from '@/branches/shared/blocks/OfferteRequest/Component'
import { BreadcrumbsBlockComponent } from '@/branches/shared/blocks/Breadcrumbs/Component'
import { ReviewsWidgetBlockComponent } from '@/branches/shared/blocks/ReviewsWidget/Component'
import { TrustSignalsBlockComponent } from '@/branches/shared/blocks/TrustSignals/Component'
import { SocialProofBannerBlockComponent } from '@/branches/shared/blocks/SocialProofBanner/Component'
import { LogoBarBlockComponent } from '@/branches/shared/blocks/LogoBar/Component'
import { CaseStudyGridBlockComponent } from '@/branches/shared/blocks/CaseStudyGrid/Component'
import { ProjectsGridBlockComponent } from '@/branches/shared/blocks/ProjectsGrid/Component'
import { PainPointsBlockComponent } from '@/branches/shared/blocks/PainPoints/Component'
import { CompetitorComparisonBlockComponent } from '@/branches/shared/blocks/ComparisonTable/Component'
import { BranchePricingBlockComponent } from '@/branches/shared/blocks/BranchePricing/Component'
import { CalculatorBlockComponent } from '@/branches/shared/blocks/Calculator/Component'

// ─── ECOMMERCE BLOCKS (eager loaded, feature-gated at render time) ─
import CategoryGrid from '@/branches/ecommerce/shared/blocks/CategoryGrid/Component'
import ProductGrid from '@/branches/ecommerce/shared/blocks/ProductGrid/Component'
import QuickOrderComponent from '@/branches/ecommerce/b2b/blocks/QuickOrder/Component'
import ComparisonTableComponent from '@/branches/ecommerce/shared/blocks/ComparisonTable/Component'
import ProductEmbedComponent from '@/branches/ecommerce/shared/blocks/ProductEmbed/Component'
import PricingGradientComponent from '@/branches/ecommerce/shared/blocks/PricingGradient/Component'
import SubscriptionPricingComponent from '@/branches/ecommerce/shared/blocks/SubscriptionPricing/Component'
import StaffelPricingComponent from '@/branches/ecommerce/shared/blocks/StaffelPricing/Component'
import BundleBuilderComponent from '@/branches/ecommerce/shared/blocks/BundleBuilder/Component'
import SubscriptionOptionsComponent from '@/branches/ecommerce/shared/blocks/SubscriptionOptions/Component'
import VendorShowcaseComponent from '@/branches/ecommerce/shared/blocks/VendorShowcase/Component'
import EcommercePricingComponent from '@/branches/ecommerce/shared/blocks/Pricing/Component'

// ─── EXPERIENCES BLOCKS (eager loaded, feature-gated at render time) ─
import { ExperienceHeroComponent } from '@/branches/experiences/blocks/components/ExperienceHero'
import { ExperienceGridComponent } from '@/branches/experiences/blocks/components/ExperienceGrid'
import { ExperienceCategoryGridComponent } from '@/branches/experiences/blocks/components/ExperienceCategoryGrid'
import { ExperienceSocialProofComponent } from '@/branches/experiences/blocks/components/ExperienceSocialProof'
import WorkshopRegistrationBlockComponent from '@/branches/experiences/blocks/WorkshopRegistration/Component'

// ─── CONSTRUCTION BLOCKS (eager loaded, feature-gated at render time) ─
import { ConstructionHeroComponent } from '@/branches/construction/blocks/ConstructionHero/Component'
import { ServicesGridComponent } from '@/branches/construction/blocks/ServicesGrid/Component'
import { ProjectsGridComponent } from '@/branches/construction/blocks/ProjectsGrid/Component'

// ─── PROFESSIONAL SERVICES BLOCKS (eager loaded, feature-gated at render time) ─
import { ProfessionalHeroComponent } from '@/branches/professional-services/blocks/ProfessionalHero/Component'
import { ProfessionalServicesGridComponent } from '@/branches/professional-services/blocks/ServicesGrid/Component'
import { CasesGridComponent } from '@/branches/professional-services/blocks/CasesGrid/Component'

// ─── HORECA BLOCKS (eager loaded, feature-gated at render time) ─────
import ReservationFormBlockComponent from '@/branches/horeca/blocks/ReservationForm/Component'

const blockComponents: Record<string, React.FC<any>> = {
  // ─── SHARED (always available) ────────────────────────────────────
  content: ContentBlockComponent,
  hero: HeroBlockComponent,
  features: FeaturesBlockComponent,
  faq: FAQBlockComponent,
  cta: CTABlockComponent,
  twoColumn: TwoColumnBlockComponent,
  testimonials: TestimonialsBlockComponent,
  stats: StatsBlockComponent,
  team: TeamBlockComponent,
  contact: ContactBlockComponent,
  newsletter: NewsletterBlockComponent,
  imageGallery: ImageGalleryBlockComponent,
  video: VideoBlockComponent,
  map: MapBlockComponent,
  accordion: AccordionBlockComponent,
  spacer: SpacerBlockComponent,
  'blog-preview': BlogPreviewBlockComponent,
  banner: BannerBlockComponent,
  infobox: InfoBoxBlockComponent,
  mediaBlock: MediaBlockComponent,
  processSteps: ProcessStepsBlockComponent,
  ctaSection: CTASectionBlockComponent,
  heroEmailCapture: HeroEmailCaptureBlockComponent,
  twoColumnImagePair: TwoColumnImagePairBlockComponent,
  offerteRequest: OfferteRequestBlockComponent,
  breadcrumbs: BreadcrumbsBlockComponent,
  reviewsWidget: ReviewsWidgetBlockComponent,
  trustSignals: TrustSignalsBlockComponent,
  socialProofBanner: SocialProofBannerBlockComponent,
  logoBar: LogoBarBlockComponent,
  caseStudyGrid: CaseStudyGridBlockComponent,
  projectsGrid: ProjectsGridBlockComponent,
  painPoints: PainPointsBlockComponent,
  competitorComparison: CompetitorComparisonBlockComponent,
  branchePricing: BranchePricingBlockComponent,
  calculator: CalculatorBlockComponent,

  // ─── ECOMMERCE (only if shop enabled) ──────────────────────────────
  ...(isFeatureEnabled('shop')
    ? {
        categoryGrid: CategoryGrid,
        productGrid: ProductGrid,
        quickOrder: QuickOrderComponent,
        comparisontable: ComparisonTableComponent,
        productEmbed: ProductEmbedComponent,
        pricingGradient: PricingGradientComponent,
        subscriptionPricing: SubscriptionPricingComponent,
        staffelPricing: StaffelPricingComponent,
        bundleBuilder: BundleBuilderComponent,
        subscriptionOptions: SubscriptionOptionsComponent,
        vendorShowcase: VendorShowcaseComponent,
        pricing: EcommercePricingComponent, // Overrides shared pricing when shop enabled
      }
    : {}),

  // ─── EXPERIENCES (only if experiences enabled) ────────────────────────
  ...(isFeatureEnabled('experiences')
    ? {
        'experience-hero': ExperienceHeroComponent,
        'experience-grid': ExperienceGridComponent,
        'experience-category-grid': ExperienceCategoryGridComponent,
        'experience-social-proof': ExperienceSocialProofComponent,
        workshopRegistration: WorkshopRegistrationBlockComponent,
      }
    : {}),

  // ─── CONSTRUCTION (only if construction enabled) ────────────────────
  ...(isFeatureEnabled('construction')
    ? {
        'construction-hero': ConstructionHeroComponent,
        'services-grid': ServicesGridComponent,
        'projects-grid': ProjectsGridComponent,
      }
    : {}),

  // ─── PROFESSIONAL SERVICES (only if professional_services enabled) ───
  ...(isFeatureEnabled('professional_services')
    ? {
        'professional-hero': ProfessionalHeroComponent,
        'professional-services-grid': ProfessionalServicesGridComponent,
        'cases-grid': CasesGridComponent,
      }
    : {}),

  // ─── HORECA (only if horeca enabled) ─────────────────────────────────
  ...(isFeatureEnabled('horeca')
    ? {
        reservationForm: ReservationFormBlockComponent,
      }
    : {}),
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout']
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
