import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

/**
 * Seed Homepage API
 *
 * Simple seed script to create example homepage with demo content
 * This is a FRAMEWORK EXAMPLE - customize via CMS admin!
 *
 * Framework principle: "Keep CMS schema clean and reusable" - payload-website-framework-b2b-b2c.md
 */
export async function GET() {
  try {
    console.log('🌱 Starting Homepage Seed...')

    const payload = await getPayload({ config })

    // Check if homepage already exists
    const existingHome = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
    })

    if (existingHome.docs.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Homepage already exists. Delete it first to reseed.',
        existing: existingHome.docs[0].id,
      })
    }

    // Create example homepage with 3 blocks
    const homepageData = {
      title: 'Home',
      slug: 'home',
      _status: 'published' as const,
      layout: [
        // Hero Block
        {
          blockType: 'hero',
          style: 'gradient',
          title: 'Welcome to Your Website',
          subtitle:
            'This is an example homepage. Customize it via the CMS admin panel.',
          primaryCTA: {
            text: 'Get Started →',
            link: '/contact',
          },
        },

        // Features Block
        {
          blockType: 'features',
          blockName: 'Key Features',
          heading: 'Why Choose Us',
          intro: 'We offer professional solutions tailored to your needs.',
          layout: 'grid-3',
          style: 'cards',
          features: [
            {
              iconType: 'lucide',
              iconName: 'zap',
              name: 'Fast Performance',
              description: 'Lightning-fast load times and optimized delivery.',
            },
            {
              iconType: 'lucide',
              iconName: 'shield',
              name: 'Secure & Reliable',
              description: 'Enterprise-grade security and 99.9% uptime.',
            },
            {
              iconType: 'lucide',
              iconName: 'heart',
              name: '24/7 Support',
              description: 'Always here to help when you need us.',
            },
          ],
        },

        // CTA Block
        {
          blockType: 'cta',
          blockName: 'Final CTA',
          style: 'primary',
          title: 'Ready to get started?',
          text: 'Contact us today to learn more about our services.',
          buttonText: 'Contact Us →',
          buttonLink: '/contact',
        },
      ],
    }

    await payload.create({
      collection: 'pages',
      data: homepageData,
    })

    console.log('✅ Homepage created successfully\n')

    return NextResponse.json({
      success: true,
      message: 'Example homepage created! Now customize it via /admin',
      data: {
        homepage: 'created',
        blocks: homepageData.layout.length,
      },
      nextSteps: [
        '1. Go to /admin/globals to configure Theme, Navigation, Header, Footer',
        '2. Go to /admin/collections/pages to edit the homepage content',
        '3. Add your own blocks, images, and content',
      ],
    })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
