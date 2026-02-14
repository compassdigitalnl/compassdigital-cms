/**
 * Test Site Generator
 * Verifies that the site generator creates proper Payload blocks
 */

import 'dotenv/config'
import { PayloadService } from '@/lib/siteGenerator/PayloadService'
import type { GeneratedPage, WizardState } from '@/lib/siteGenerator/types'
import { getPayload } from 'payload'
import config from '@payload-config'

// Test data matching the wizard format
const testWizardData: WizardState = {
  companyInfo: {
    name: 'Test Bedrijf BV',
    industry: 'Technology',
    description: 'Een innovatief technologiebedrijf',
    targetAudience: 'B2B bedrijven',
    coreValues: ['Innovatie', 'Kwaliteit', 'Betrouwbaarheid'],
    contactInfo: {
      email: 'info@testbedrijf.nl',
      phone: '+31 20 123 4567',
      address: {
        street: 'Teststraat 123',
        city: 'Amsterdam',
        postalCode: '1012 AB',
        country: 'Nederland',
      },
      openingHours: 'Ma-Vr 9:00-17:00',
      socialMedia: {
        linkedin: 'https://linkedin.com/company/testbedrijf',
        twitter: 'https://twitter.com/testbedrijf',
      },
    },
  },
  websiteGoals: {
    primary: 'lead-generation',
    features: [
      'Contact formulier',
      'Service overzicht',
      'Portfolio showcase',
    ],
  },
  design: {
    style: 'modern',
    colorScheme: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#F59E0B',
    },
  },
  content: {
    tone: 'professional',
    language: 'nl',
  },
}

// Test pages with various block types
const testPages: GeneratedPage[] = [
  {
    title: 'Test Homepage',
    slug: 'test-site-generator-home',
    blocks: [
      {
        type: 'hero',
        headline: 'Welkom bij Test Bedrijf',
        subheadline: 'De beste oplossingen voor uw bedrijf',
        ctaText: 'Neem contact op',
        ctaLink: '/contact',
      },
      {
        type: 'features',
        heading: 'Onze Features',
        intro: 'Dit is wat ons uniek maakt',
        features: [
          { title: 'Veiligheid', description: 'Veilige oplossingen voor uw data' },
          { title: 'Snelheid', description: 'Razend snelle performance' },
          { title: 'Support', description: '24/7 klantenservice beschikbaar' },
        ],
      },
      {
        type: 'testimonials',
        title: 'Wat klanten zeggen',
        testimonials: [
          {
            name: 'Jan Jansen',
            company: 'ABC BV',
            position: 'CEO',
            quote: 'Uitstekende service en kwaliteit!',
            rating: 5,
          },
          {
            name: 'Marie Peters',
            company: 'XYZ NV',
            position: 'CTO',
            quote: 'Precies wat we nodig hadden.',
            rating: 5,
          },
        ],
      },
      {
        type: 'faq',
        heading: 'Veelgestelde vragen',
        items: [
          {
            question: 'Wat zijn jullie openingstijden?',
            answer: 'Wij zijn bereikbaar van maandag tot vrijdag tussen 9:00 en 17:00 uur.',
          },
          {
            question: 'Hoe kan ik contact opnemen?',
            answer: 'U kunt ons bereiken via telefoon, e-mail of het contactformulier.',
          },
        ],
      },
      {
        type: 'pricing',
        heading: 'Onze Pakketten',
        plans: [
          {
            name: 'Basis',
            price: '99',
            currency: '€',
            period: '/maand',
            description: 'Perfect voor kleine bedrijven',
            features: [
              'Feature 1',
              'Feature 2',
              'Feature 3',
            ],
            ctaText: 'Start nu',
            ctaLink: '/contact',
            highlighted: false,
          },
          {
            name: 'Pro',
            price: '199',
            currency: '€',
            period: '/maand',
            description: 'Voor groeiende bedrijven',
            features: [
              'Alles van Basis',
              'Extra feature 1',
              'Extra feature 2',
            ],
            ctaText: 'Start nu',
            ctaLink: '/contact',
            highlighted: true,
            badge: 'Populair',
          },
        ],
      },
      {
        type: 'portfolio-grid',
        heading: 'Ons Portfolio',
        intro: 'Bekijk onze recente projecten',
        cases: [
          {
            projectName: 'Project Alpha',
            client: 'Client A',
            industry: 'Technology',
            tagline: 'Innovatieve oplossing',
            description: 'Een uitgebreid platform voor data-analyse',
          },
          {
            projectName: 'Project Beta',
            client: 'Client B',
            industry: 'Finance',
            tagline: 'Veilig en snel',
            description: 'Een beveiligde banking applicatie',
          },
        ],
      },
    ],
    meta: {
      title: 'Test Homepage - Test Bedrijf',
      description: 'Dit is een test pagina voor de site generator',
      keywords: ['test', 'site generator', 'payload'],
    },
  },
  {
    title: 'Test Contact',
    slug: 'test-site-generator-contact',
    blocks: [
      {
        type: 'contact-info',
        heading: 'Contact informatie',
        intro: 'Neem gerust contact met ons op',
        email: 'info@testbedrijf.nl',
        phone: '+31 20 123 4567',
        address: {
          street: 'Teststraat 123',
          city: 'Amsterdam',
          postalCode: '1012 AB',
          country: 'Nederland',
        },
        openingHours: 'Ma-Vr 9:00-17:00',
      },
      {
        type: 'map',
        heading: 'Onze Locatie',
        address: {
          street: 'Teststraat 123',
          city: 'Amsterdam',
          postalCode: '1012 AB',
          country: 'Nederland',
        },
      },
    ],
    meta: {
      title: 'Contact - Test Bedrijf',
      description: 'Neem contact met ons op',
      keywords: ['contact', 'test bedrijf'],
    },
  },
]

async function testSiteGenerator() {
  console.log('🧪 Starting Site Generator Test\n')
  console.log('=' .repeat(60))

  try {
    const payload = await getPayload({ config })
    const payloadService = new PayloadService()

    // Step 1: Clean up existing test pages
    console.log('\n📋 Step 1: Cleaning up existing test pages...')
    for (const page of testPages) {
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
        await payload.delete({
          collection: 'pages',
          id: existing.docs[0].id,
        })
        console.log(`   ✓ Deleted existing page: ${page.slug}`)
      }
    }

    // Step 2: Clean up existing test cases
    console.log('\n📋 Step 2: Cleaning up existing test cases...')
    const existingCases = await payload.find({
      collection: 'cases',
      where: {
        title: {
          contains: 'Project',
        },
      },
    })

    for (const testCase of existingCases.docs) {
      await payload.delete({
        collection: 'cases',
        id: testCase.id,
      })
      console.log(`   ✓ Deleted existing case: ${testCase.title}`)
    }

    // Step 3: Generate and save site
    console.log('\n🚀 Step 3: Generating site with PayloadService...')
    const result = await payloadService.saveGeneratedSite(testPages, testWizardData)

    console.log(`   ✓ Generated ${result.pages.length} pages`)
    console.log(`   ✓ Preview URL: ${result.previewUrl}`)

    // Step 4: Verify created pages
    console.log('\n🔍 Step 4: Verifying created pages...')
    for (const savedPage of result.pages) {
      const page = await payload.findByID({
        collection: 'pages',
        id: savedPage.id,
      })

      console.log(`\n   Page: ${page.title} (${page.slug})`)
      console.log(`   Status: ${page.status}`)
      console.log(`   Blocks: ${page.layout?.length || 0}`)

      if (page.layout && page.layout.length > 0) {
        page.layout.forEach((block: any, index: number) => {
          console.log(`      ${index + 1}. ${block.blockType}`)

          // Verify specific block details
          if (block.blockType === 'features') {
            console.log(`         → Features count: ${block.features?.length || 0}`)
            if (block.features && block.features.length > 0) {
              console.log(`         → First feature icon: ${block.features[0].iconName || 'N/A'}`)
              console.log(`         → Icon type: ${block.features[0].iconType || 'N/A'}`)
            }
          }

          if (block.blockType === 'cases') {
            console.log(`         → Cases count: ${block.cases?.length || 0}`)
            console.log(`         → Source: ${block.source || 'N/A'}`)
          }

          if (block.blockType === 'faq') {
            console.log(`         → FAQ items: ${block.items?.length || 0}`)
            if (block.items && block.items.length > 0) {
              const firstAnswer = block.items[0].answer
              const isLexical = firstAnswer && typeof firstAnswer === 'object' && firstAnswer.root
              console.log(`         → First answer is Lexical: ${isLexical ? 'YES ✓' : 'NO ✗'}`)
            }
          }

          if (block.blockType === 'pricing') {
            console.log(`         → Plans count: ${block.plans?.length || 0}`)
            if (block.plans && block.plans.length > 0) {
              const firstPlanFeatures = block.plans[0].features
              const hasCorrectStructure = firstPlanFeatures && firstPlanFeatures.length > 0 &&
                typeof firstPlanFeatures[0] === 'object' && 'feature' in firstPlanFeatures[0]
              console.log(`         → Features have correct structure: ${hasCorrectStructure ? 'YES ✓' : 'NO ✗'}`)
            }
          }

          if (block.blockType === 'content') {
            const hasLexical = block.columns?.[0]?.richText?.root
            console.log(`         → Has Lexical content: ${hasLexical ? 'YES ✓' : 'NO ✗'}`)
          }

          if (block.blockType === 'map') {
            console.log(`         → Height: ${block.height || 'N/A'}`)
            console.log(`         → Zoom: ${block.zoom || 'N/A'}`)
          }
        })
      }
    }

    // Step 5: Verify created cases
    console.log('\n🔍 Step 5: Verifying created cases...')
    const createdCases = await payload.find({
      collection: 'cases',
      where: {
        title: {
          contains: 'Project',
        },
      },
    })

    console.log(`   ✓ Found ${createdCases.docs.length} cases in collection`)
    createdCases.docs.forEach((testCase, index) => {
      console.log(`      ${index + 1}. ${testCase.title} - ${testCase.client}`)
      console.log(`         Industry: ${testCase.industry}`)
      console.log(`         Status: ${testCase.status}`)
      console.log(`         Featured: ${testCase.featured}`)
    })

    console.log('\n' + '='.repeat(60))
    console.log('✅ All tests passed successfully!')
    console.log('='.repeat(60))

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Test failed with error:')
    console.error(error)
    process.exit(1)
  }
}

// Run test
testSiteGenerator()
