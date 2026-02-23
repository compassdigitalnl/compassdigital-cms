import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextResponse } from 'next/server'
import { seedTenant, type SeedOptions } from '@/endpoints/seed/seedOrchestrator'

/**
 * POST /api/seed
 *
 * Seeds demo content for a tenant based on template and features
 *
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/api/seed \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "template": "construction",
 *     "features": { "construction": true, "blog": true },
 *     "companyName": "Bouwbedrijf XYZ",
 *     "domain": "bouwbedrijf-xyz.nl",
 *     "draftOnly": true
 *   }'
 * ```
 */
export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })

    // Parse request body
    const body = await req.json()
    const {
      template = 'corporate',
      features = {},
      companyName = 'Demo Company',
      domain = 'demo.compassdigital.nl',
      draftOnly = true,
    } = body

    // Validate template
    const validTemplates = [
      'ecommerce',
      'blog',
      'b2b',
      'portfolio',
      'corporate',
      'construction',
      'beauty',
      'horeca',
      'hospitality',
    ]

    if (!validTemplates.includes(template)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid template. Must be one of: ${validTemplates.join(', ')}`,
        },
        { status: 400 },
      )
    }

    // Build seed options
    const options: SeedOptions = {
      template,
      features,
      companyName,
      domain,
      draftOnly,
    }

    // Execute seeding
    const result = await seedTenant(payload, options)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Seeding completed successfully',
        result: {
          template: result.template,
          features: result.features,
          seeded: result.seeded,
          duration: `${(result.duration / 1000).toFixed(2)}s`,
        },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Seeding failed',
          errors: result.errors,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Seed API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/seed
 *
 * Returns available templates and their required features
 */
export async function GET() {
  return NextResponse.json({
    templates: [
      {
        id: 'ecommerce',
        name: 'E-commerce',
        description: 'Online shop with products, categories, and checkout',
        features: ['shop', 'products'],
      },
      {
        id: 'construction',
        name: 'Construction',
        description: 'Construction company with services and projects',
        features: ['construction'],
      },
      {
        id: 'beauty',
        name: 'Beauty Salon',
        description: 'Beauty salon with services and stylists',
        features: ['beauty'],
      },
      {
        id: 'horeca',
        name: 'Horeca',
        description: 'Restaurant/bar with menu items and events',
        features: ['horeca'],
      },
      {
        id: 'hospitality',
        name: 'Hospitality',
        description: 'Medical/wellness with treatments and practitioners',
        features: ['hospitality'],
      },
      {
        id: 'blog',
        name: 'Blog',
        description: 'Content-focused blog site',
        features: ['blog'],
      },
      {
        id: 'corporate',
        name: 'Corporate',
        description: 'General corporate website',
        features: [],
      },
    ],
    usage: {
      method: 'POST',
      endpoint: '/api/seed',
      body: {
        template: 'construction',
        features: { construction: true, blog: true },
        companyName: 'Your Company Name',
        domain: 'yourcompany.com',
        draftOnly: true,
      },
    },
  })
}
