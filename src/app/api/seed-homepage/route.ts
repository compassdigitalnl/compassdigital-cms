import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

/**
 * Seed Homepage API
 *
 * Simple seed script to create example homepage with demo content
 * This is a FRAMEWORK EXAMPLE - customize via CMS admin!
 *
 * Framework principle: "Keep CMS schema clean and reusable" - payload-website-framework-b2b-b2c.md
 *
 * Also supports: ?createUser=true&secret=PAYLOAD_SECRET to create editor user
 */
export async function GET(req: NextRequest) {
  // Support creating editor user via query param
  const createUser = req.nextUrl.searchParams.get('createUser')
  const secret = req.nextUrl.searchParams.get('secret')

  if (createUser === 'true') {
    if (secret !== process.env.PAYLOAD_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    try {
      const payload = await getPayload({ config })
      const email = req.nextUrl.searchParams.get('email') || 'editor@compassdigital.nl'
      const password = req.nextUrl.searchParams.get('password') || 'Editor1234!'
      const name = req.nextUrl.searchParams.get('name') || 'Editor User'

      const existing = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        return NextResponse.json({
          success: false,
          message: `User ${email} already exists`,
          user: { id: existing.docs[0].id, email: existing.docs[0].email, roles: existing.docs[0].roles },
        })
      }

      const newUser = await payload.create({
        collection: 'users',
        data: { email, password, name, roles: ['editor'] },
      })

      return NextResponse.json({
        success: true,
        message: 'Editor user created successfully!',
        user: { id: newUser.id, email: newUser.email, roles: newUser.roles },
        loginUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/admin`,
        credentials: { email, password },
      })
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
  }
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
