/**
 * Payload CMS Integration Service
 * Handles writing generated content to Payload database
 */

import type { GeneratedPage, WizardState } from './types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { imageService } from '@/lib/images/ImageService'
import { IconService } from './IconService'
import { LexicalHelpers } from './LexicalHelpers'
import { CollectionService } from './CollectionService'

export class PayloadService {

  /**
   * Save all generated pages to Payload CMS
   */
  async saveGeneratedSite(
    pages: GeneratedPage[],
    wizardData: WizardState,
  ): Promise<{ pages: any[]; previewUrl: string }> {
    console.log('[PayloadService] Starting to save generated site...')
    console.log(`[PayloadService] ${pages.length} pages to save`)

    const payload = await getPayload({ config })
    const savedPages: any[] = []

    try {
      // First, delete any existing pages with the same slugs to avoid unique constraint errors
      console.log('[PayloadService] Checking for existing pages with duplicate slugs...')
      for (const page of pages) {
        const existing = await payload.find({
          collection: 'pages',
          where: {
            slug: {
              equals: page.slug,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`[PayloadService] Deleting existing page with slug: ${page.slug} (ID: ${existing.docs[0].id})`)
          await payload.delete({
            collection: 'pages',
            id: existing.docs[0].id,
          })
        }
      }

      for (const page of pages) {
        console.log(`[PayloadService] Saving page: ${page.title}`)
        console.log(`[PayloadService] Page slug: "${page.slug}"`)
        console.log(`[PayloadService] Page data:`, JSON.stringify(page, null, 2))

        // Convert generated blocks to Payload format
        const layoutBlocks = await this.convertBlocksToPayloadFormat(page.blocks, wizardData)

        console.log(`[PayloadService] Converted ${layoutBlocks.length} blocks for ${page.slug}:`)
        layoutBlocks.forEach((b, i) => {
          console.log(`  Block ${i + 1}: ${b.blockType}`)
        })

        // Create page in Payload
        const createdPage = await payload.create({
          collection: 'pages',
          data: {
            title: page.title,
            slug: page.slug,
            status: 'published',
            publishedOn: new Date().toISOString(),
            layout: layoutBlocks,
            // Color scheme from wizard
            colorScheme: {
              primary: wizardData.design.colorScheme.primary,
              secondary: wizardData.design.colorScheme.secondary,
              accent: wizardData.design.colorScheme.accent,
            },
            // SEO metadata (will be handled by SEO plugin if installed)
            meta: {
              title: page.meta.title,
              description: page.meta.description,
              // @ts-ignore - SEO plugin fields
              keywords: page.meta.keywords?.join(', '),
            },
            // @ts-ignore - Payload's internal draft/publish status
            _status: 'published',
          },
        })

        console.log(`[PayloadService] ✓ Saved page: ${page.title} (ID: ${createdPage.id})`)
        savedPages.push(createdPage)
      }

      // Get preview URL (home page or first page)
      const homePage = savedPages.find((p) => p.slug === '' || p.slug === 'home')
      const relativePath = homePage
        ? `/${homePage.slug}`
        : `/${savedPages[0]?.slug || ''}`

      // Use frontend URL for preview (defaults to NEXT_PUBLIC_SERVER_URL if not set)
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || process.env.NEXT_PUBLIC_SERVER_URL || ''
      const previewUrl = `${frontendUrl}${relativePath}`

      console.log(`[PayloadService] ✅ All pages saved successfully!`)
      console.log(`[PayloadService] Preview URL: ${previewUrl}`)

      return {
        pages: savedPages,
        previewUrl,
      }
    } catch (error) {
      console.error('[PayloadService] Error saving pages:', error)
      console.error('[PayloadService] Error details:', JSON.stringify(error, null, 2))
      if (error && typeof error === 'object' && 'data' in error) {
        console.error('[PayloadService] Validation errors:', JSON.stringify((error as any).data, null, 2))
      }
      throw error
    }
  }

  /**
   * Convert AI-generated blocks to Payload block format
   * ASYNC - Creates collection entries where needed (Cases)
   */
  private async convertBlocksToPayloadFormat(blocks: any[], wizardData: WizardState): Promise<any[]> {
    console.log(`[PayloadService] Converting ${blocks.length} AI blocks to Payload format...`)

    const convertedBlocks: any[] = []

    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index]
      const blockType = block.type || block.blockType // Support both 'type' and 'blockType'
      console.log(`[PayloadService]   Block ${index + 1}: ${blockType}`)

      let convertedBlock: any = null

      switch (blockType) {
        case 'hero':
          // Generate background image URL based on company name + industry
          const heroImageKeyword = `${wizardData.companyInfo.name}-${wizardData.companyInfo.industry}`.replace(/\s+/g, '-')
          const heroImageUrl = imageService.getHeroImage(heroImageKeyword)

          convertedBlock = {
            blockType: 'hero',
            style: 'image',
            title: block.headline || block.title || '',
            subtitle: block.subheadline || block.subtitle || '',
            primaryCTA: {
              text: block.primaryCTA || 'Neem contact op',
              link: '/contact',
            },
            secondaryCTA: block.secondaryCTA
              ? {
                  text: block.secondaryCTA,
                  link: '/about',
                }
              : undefined,
            backgroundImageUrl: heroImageUrl,
          }
          break

        case 'features':
        case 'services':
        case 'services-grid':
        case 'values':
        case 'why-choose-us':
          // Extract features from various field names
          const featuresData = block.features || block.services || block.reasons || wizardData.companyInfo.coreValues || []

          // Convert to proper format with icons
          const formattedFeatures = featuresData.map((feature: any) => {
            const name = typeof feature === 'string' ? feature : (feature.title || feature.name || '')
            const description = typeof feature === 'string'
              ? `Bij ${wizardData.companyInfo.name} staat ${feature.toLowerCase()} centraal in alles wat we doen.`
              : (feature.description || '')

            return {
              iconType: 'lucide',
              iconName: IconService.generateIcon(name),
              name,
              description,
              link: typeof feature === 'object' ? (feature.link || '') : '',
            }
          })

          convertedBlock = {
            blockType: 'features', // ✅ CORRECT slug!
            heading: block.heading || block.title || 'Onze diensten',
            intro: block.intro || block.introduction || block.description || '',
            source: 'manual',
            features: formattedFeatures, // ✅ CORRECT field name!
            layout: 'grid-3',
            style: 'cards',
            showHoverEffect: true,
          }
          break

        case 'cta':
          convertedBlock = {
            blockType: 'cta',
            title: block.headline || block.title || '',
            text: block.description || block.text || '',
            buttonText: block.buttonText || 'Neem contact op',
            buttonLink: '/contact',
            style: 'primary',
          }
          break

        case 'about-preview':
        case 'story':
          // Handle story content which can be an array of paragraphs
          const storyContent = block.content || block.description || ''
          const contentArray = Array.isArray(storyContent) ? storyContent : [{ paragraph: storyContent }]
          const paragraphs = contentArray.map((item: any) =>
            item.paragraph || item.text || item.content || String(item)
          )

          convertedBlock = {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: LexicalHelpers.contentToLexical(
                  block.title || block.subtitle || 'Over ons',
                  paragraphs
                ),
              },
            ],
          }
          break

        case 'testimonials':
        case 'testimonials-list':
          // Use AI-generated testimonials if available
          const testimonials = block.testimonials || []
          convertedBlock = {
            blockType: 'testimonials',
            heading: block.title || block.heading || 'Wat onze klanten zeggen',
            intro: block.introduction || block.intro || '',
            source: 'manual',
            manualTestimonials: testimonials.map((t: any) => {
              // Ensure company field is always present and not empty
              const company = t.company || `${wizardData.companyInfo.name} Klant`
              return {
                name: t.name || 'Klant',
                role: t.position || t.role || 'Client',
                company: company,
                quote: t.testimonial || t.quote || '',
                rating: t.rating || 5,
              }
            }),
            layout: 'grid-3',
          }
          break

        case 'contact-form':
          // Phase 2: Integrate with actual Form collection
          // For now, return simple content block
          convertedBlock = {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: LexicalHelpers.contentToLexical(
                  'Neem contact met ons op',
                  [
                    'Vul het formulier in en we nemen zo snel mogelijk contact met u op.',
                    `E-mail: ${wizardData.companyInfo.contactInfo?.email || `info@${wizardData.companyInfo.name.toLowerCase().replace(/\s+/g, '')}.nl`}`,
                  ]
                ),
              },
            ],
          }
          break

        case 'contact-info':
          // Use user-provided contact info (FASE 2 enhanced)
          const contactInfo = wizardData.companyInfo.contactInfo
          const contactDetails: Array<{ label: string; value: string }> = []

          // Email (always from block or contactInfo)
          if (block.email || contactInfo?.email) {
            contactDetails.push({
              label: '📧 E-mail',
              value: block.email || contactInfo?.email || '',
            })
          }

          // Phone
          if (block.phone || contactInfo?.phone) {
            contactDetails.push({
              label: '📞 Telefoon',
              value: block.phone || contactInfo?.phone || '',
            })
          }

          // Address
          const address = block.address || contactInfo?.address
          if (address && (address.street || address.city)) {
            const addressParts = [
              address.street,
              address.postalCode && address.city ? `${address.postalCode} ${address.city}` : (address.postalCode || address.city),
              address.country
            ].filter(Boolean)

            if (addressParts.length > 0) {
              contactDetails.push({
                label: '📍 Adres',
                value: addressParts.join(', '),
              })
            }
          }

          // Opening hours
          if (block.openingHours || contactInfo?.openingHours) {
            contactDetails.push({
              label: '🕒 Openingstijden',
              value: block.openingHours || contactInfo?.openingHours || '',
            })
          }

          // Response time
          if (block.responseTime) {
            contactDetails.push({
              label: '⏱️ Reactietijd',
              value: block.responseTime,
            })
          }

          // Social media
          const socialMedia = block.socialMedia || contactInfo?.socialMedia
          if (socialMedia) {
            const socialLinks = []
            if (socialMedia.facebook) socialLinks.push(`Facebook: ${socialMedia.facebook}`)
            if (socialMedia.twitter) socialLinks.push(`Twitter: ${socialMedia.twitter}`)
            if (socialMedia.linkedin) socialLinks.push(`LinkedIn: ${socialMedia.linkedin}`)
            if (socialMedia.instagram) socialLinks.push(`Instagram: ${socialMedia.instagram}`)
            if (socialMedia.youtube) socialLinks.push(`YouTube: ${socialMedia.youtube}`)

            if (socialLinks.length > 0) {
              contactDetails.push({
                label: '🌐 Social media',
                value: socialLinks.join(' | '),
              })
            }
          }

          convertedBlock = {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: LexicalHelpers.contactInfoToLexical(
                  block.heading || 'Neem contact met ons op',
                  block.intro || 'Neem gerust contact met ons op. We staan klaar om u te helpen.',
                  contactDetails
                ),
              },
            ],
          }
          break

        case 'team':
          // Generate team block with placeholder photos
          const teamMembers = block.team || block.members || []
          convertedBlock = {
            blockType: 'team',
            heading: block.heading || block.title || 'Ons Team',
            intro: block.intro || block.introduction || '',
            members: teamMembers.map((member: any) => {
              // Generate photo URL for each team member
              const photoUrl = imageService.getTeamMemberImage(member.name || 'team-member')
              return {
                name: member.name || '',
                role: member.role || member.position || '',
                bio: member.bio || member.description || '',
                email: member.email || '',
                linkedin: member.linkedin || member.linkedinUrl || '',
                photoUrl,
              }
            }),
            layout: 'grid-3',
          }
          break

        case 'faq':
          // Use AI-generated FAQ items if available
          const faqItems = block.items || []
          convertedBlock = {
            blockType: 'faq',
            heading: block.heading || 'Veelgestelde vragen',
            intro: block.intro || '',
            source: 'manual',
            items: faqItems.map((item: any) => ({
              question: item.question || '',
              answer: LexicalHelpers.textToLexical(item.answer || ''),
            })),
            generateSchema: true,
          }
          break

        case 'pricing':
          // Use AI-generated pricing plans (FASE 2 enhanced)
          const pricingPlans = block.plans || []
          convertedBlock = {
            blockType: 'pricing',
            heading: block.heading || 'Kies uw pakket',
            intro: block.intro || '',
            plans: pricingPlans.map((plan: any) => ({
              name: plan.name || '',
              price: plan.price || '',
              currency: plan.currency || '€',
              period: plan.period || '/maand',
              description: plan.description || '',
              features: (plan.features || []).map((f: any) => ({
                feature: typeof f === 'string' ? f : (f.feature || f.text || ''),
              })),
              ctaText: plan.ctaText || 'Start nu',
              ctaLink: plan.ctaLink || '/contact',
              highlighted: plan.highlighted || false,
              badge: plan.badge || '',
            })),
            style: 'cards',
          }
          break

        case 'portfolio-grid':
          // Create Cases in collection first, then use relationships
          const portfolioCases = block.cases || block.portfolioGrid?.projects || block.projects || []

          // Initialize CollectionService
          const collectionService = new CollectionService()
          const caseIds = await collectionService.createCases(portfolioCases, wizardData)

          convertedBlock = {
            blockType: 'cases', // ✅ CORRECT slug!
            heading: block.heading || block.portfolioGrid?.title || block.title || 'Ons Portfolio',
            intro: block.intro || block.portfolioGrid?.description || block.description || '',
            source: 'manual',
            cases: caseIds, // ✅ Relationships, not inline data!
            layout: 'grid-3',
            showExcerpt: true,
            showClient: true,
            showServices: true,
            showViewAllButton: false,
          }
          break

        case 'map':
          // Use user-provided address for map embed
          const addressData = block.address || wizardData.companyInfo.contactInfo?.address

          // Build full address string
          const addressParts = []
          if (addressData) {
            if (addressData.street) addressParts.push(addressData.street)
            if (addressData.postalCode) addressParts.push(addressData.postalCode)
            if (addressData.city) addressParts.push(addressData.city)
            if (addressData.country) addressParts.push(addressData.country)
          }

          const fullAddress = addressParts.join(', ')

          // Only create map block if we have an address
          if (!fullAddress) {
            console.log('[PayloadService] Skipping map block - no address data available')
            convertedBlock = null
            break
          }

          // Encode address for Google Maps embed URL
          const encodedAddress = encodeURIComponent(fullAddress)
          const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedAddress}`

          convertedBlock = {
            blockType: 'map',
            heading: block.heading || 'Locatie',
            address: fullAddress,
            zoom: 15,
            height: 'medium', // ✅ Use enum, not number
          }
          break

        default:
          // Fallback to generic content block
          const fallbackBlock = {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: LexicalHelpers.textToLexical(
                  block.content || block.description || 'Content wordt binnenkort toegevoegd.',
                ),
              },
            ],
          }
          convertedBlocks.push(fallbackBlock)
          break
      }

      // Add non-null blocks to array
      if (convertedBlock) {
        convertedBlocks.push(convertedBlock)
      } else {
        console.log(`[PayloadService]     → Skipped (null/invalid block)`)
      }
    }

    console.log(`[PayloadService] Converted ${convertedBlocks.length}/${blocks.length} blocks successfully`)
    return convertedBlocks
  }

  /**
   * Check if a page with this slug already exists
   */
  async pageExists(slug: string): Promise<boolean> {
    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    return existing.docs.length > 0
  }

  /**
   * Delete a page by slug (useful for testing)
   */
  async deletePage(slug: string): Promise<void> {
    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.delete({
        collection: 'pages',
        id: existing.docs[0].id,
      })
      console.log(`[PayloadService] Deleted page: ${slug}`)
    }
  }
}
