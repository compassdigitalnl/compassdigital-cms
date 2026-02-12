/**
 * Demo Homepage Seeder
 * Creates a complete homepage with all block types for demonstration
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

export async function seedDemo() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding demo homepage...')

  // 1. Create admin user if not exists
  const existingUsers = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'demo@compassdigital.nl',
      },
    },
    limit: 1,
  })

  let adminUser
  if (existingUsers.docs.length === 0) {
    console.log('📧 Creating demo admin user...')
    adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'demo@compassdigital.nl',
        password: 'demo1234',
        roles: ['admin'],
        name: 'Demo Admin',
      },
    })
    console.log('✅ Admin user created: demo@compassdigital.nl / demo1234')
  } else {
    adminUser = existingUsers.docs[0]
    console.log('✅ Admin user already exists')
  }

  // 2. Create demo media (logo placeholder)
  console.log('📷 Creating demo media...')
  const logoMedia = await payload.create({
    collection: 'media',
    data: {
      alt: 'CompassDigital Logo',
    },
    filePath: '/Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app/public/logo.svg',
  }).catch(() => {
    console.log('⚠️  Logo upload skipped (file not found)')
    return null
  })

  // 3. Update site settings
  console.log('⚙️  Updating site settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      businessName: 'CompassDigital',
      tagline: 'Digitale oplossingen die je bedrijf vooruit helpen',
      description: 'Wij bouwen moderne websites en webapplicaties op maat.',
      email: 'info@compassdigital.nl',
      phone: '+31 6 12345678',
      address: {
        street: 'Voorbeeldstraat 123',
        postalCode: '1234 AB',
        city: 'Amsterdam',
        showOnSite: true,
      },
      primaryColor: '#3B82F6',
      accentColor: '#10B981',
    },
  })

  // 4. Create testimonials
  console.log('⭐ Creating demo testimonials...')
  const testimonial1 = await payload.create({
    collection: 'testimonials',
    data: {
      name: 'Jan Jansen',
      role: 'CEO',
      company: 'TechBedrijf BV',
      quote: 'CompassDigital heeft ons geholpen met een fantastische nieuwe website. Professioneel en snel!',
      rating: 5,
      featured: true,
    },
  })

  const testimonial2 = await payload.create({
    collection: 'testimonials',
    data: {
      name: 'Sarah de Vries',
      role: 'Marketing Manager',
      company: 'Innovatie Co',
      quote: 'Uitstekende service en een mooi eindresultaat. Aanrader!',
      rating: 5,
      featured: true,
    },
  })

  // 5. Create demo cases
  console.log('💼 Creating demo cases...')
  const case1 = await payload.create({
    collection: 'cases',
    data: {
      title: 'E-commerce Platform',
      slug: 'ecommerce-platform',
      client: 'Webshop XYZ',
      excerpt: 'Een moderne e-commerce oplossing met 1000+ producten',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Voor Webshop XYZ hebben we een volledig op maat gemaakte e-commerce oplossing ontwikkeld.',
                },
              ],
            },
          ],
        },
      },
      services: [
        { service: 'Webdesign' },
        { service: 'Development' },
        { service: 'Onderhoud' },
      ],
      liveUrl: 'https://example.com',
    },
  })

  // 6. Create demo homepage with all blocks
  console.log('🏠 Creating demo homepage...')
  const homepage = await payload.create({
    collection: 'pages',
    context: {
      disableRevalidate: true,
    },
    data: {
      title: 'Home',
      slug: 'home',
      _status: 'published',
      layout: [
        // Hero Block
        {
          blockType: 'hero',
          style: 'gradient',
          title: 'Digitale oplossingen die werken',
          subtitle: 'Wij bouwen moderne websites en webapplicaties die uw bedrijf naar een hoger niveau tillen. Van concept tot lancering.',
          primaryCTA: {
            text: 'Neem contact op',
            link: '/contact',
          },
          secondaryCTA: {
            text: 'Bekijk projecten',
            link: '/cases',
          },
        },

        // Services Block
        {
          blockType: 'services',
          heading: 'Onze diensten',
          intro: 'Van strategie tot realisatie - wij nemen u van A tot Z mee',
          layout: 'grid-3',
          services: [
            {
              name: 'Webdesign',
              description: 'Modern en gebruiksvriendelijk design dat converteert',
            },
            {
              name: 'Development',
              description: 'Op maat gemaakte websites en webapplicaties',
            },
            {
              name: 'SEO Optimalisatie',
              description: 'Vindbaar in Google en andere zoekmachines',
            },
            {
              name: 'Onderhoud',
              description: 'Continue updates en technische support',
            },
            {
              name: 'Consultancy',
              description: 'Strategisch advies voor uw digitale transformatie',
            },
            {
              name: 'Marketing',
              description: 'Online marketing en social media campagnes',
            },
          ],
        },

        // Stats Block
        {
          blockType: 'stats',
          heading: 'Resultaten waar we trots op zijn',
          layout: 'grid-4',
          stats: [
            {
              number: '150+',
              label: 'Tevreden klanten',
            },
            {
              number: '500+',
              label: 'Projecten opgeleverd',
            },
            {
              number: '10+',
              label: 'Jaar ervaring',
            },
            {
              number: '98%',
              label: 'Klanttevredenheid',
            },
          ],
        },

        // Testimonials Block
        {
          blockType: 'testimonials',
          heading: 'Wat onze klanten zeggen',
          source: 'collection',
          testimonials: [testimonial1.id, testimonial2.id],
          layout: 'grid-2',
        },

        // Case Grid
        {
          blockType: 'caseGrid',
          heading: 'Uitgelichte projecten',
          intro: 'Een selectie van onze mooiste werk',
          cases: [case1.id],
          layout: 'grid-2',
        },

        // FAQ Block
        {
          blockType: 'faq',
          heading: 'Veelgestelde vragen',
          items: [
            {
              question: 'Wat kost een website?',
              answer: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: 'De kosten van een website hangen af van uw wensen en eisen. Een simpele website kan al vanaf €2.500, terwijl complexere projecten meer investering vragen. We maken graag een offerte op maat voor u.',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              question: 'Hoe lang duurt het om een website te maken?',
              answer: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: 'Een standaard website is meestal binnen 4-6 weken live. Voor grotere projecten plannen we samen een realistisch tijdspad.',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              question: 'Krijg ik ook onderhoud en support?',
              answer: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: 'Ja! We bieden verschillende onderhoudscontracten aan. Van updates tot technische support - we denken graag met u mee.',
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          generateSchema: true,
        },

        // CTA Block
        {
          blockType: 'cta',
          style: 'primary',
          title: 'Klaar voor uw nieuwe website?',
          text: 'Neem vrijblijvend contact op en ontdek wat wij voor u kunnen betekenen.',
          buttonText: 'Plan een gesprek',
          buttonLink: '/contact',
        },

        // Spacer
        {
          blockType: 'spacer',
          height: 'large',
        },
      ],
    },
  })

  // 7. Update navigation
  console.log('🧭 Updating navigation...')
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      items: [
        {
          label: 'Home',
          type: 'page',
          page: homepage.id,
        },
        {
          label: 'Diensten',
          type: 'external',
          url: '/diensten',
        },
        {
          label: 'Projecten',
          type: 'external',
          url: '/projecten',
        },
        {
          label: 'Over ons',
          type: 'external',
          url: '/over-ons',
        },
        {
          label: 'Contact',
          type: 'external',
          url: '/contact',
        },
      ],
      ctaButton: {
        text: 'Offerte aanvragen',
        link: '/contact',
        show: true,
      },
    },
  })

  // 8. Update footer
  console.log('🦶 Updating footer...')
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        {
          heading: 'Diensten',
          links: [
            { label: 'Webdesign', externalUrl: '/diensten/webdesign' },
            { label: 'Development', externalUrl: '/diensten/development' },
            { label: 'SEO', externalUrl: '/diensten/seo' },
            { label: 'Onderhoud', externalUrl: '/diensten/onderhoud' },
          ],
        },
        {
          heading: 'Bedrijf',
          links: [
            { label: 'Over ons', externalUrl: '/over-ons' },
            { label: 'Projecten', externalUrl: '/projecten' },
            { label: 'Blog', externalUrl: '/blog' },
            { label: 'Contact', externalUrl: '/contact' },
          ],
        },
        {
          heading: 'Contact',
          links: [
            { label: 'info@compassdigital.nl', externalUrl: 'mailto:info@compassdigital.nl' },
            { label: '+31 6 12345678', externalUrl: 'tel:+31612345678' },
          ],
        },
      ],
      bottomText: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: '© 2026 CompassDigital. Alle rechten voorbehouden.',
                },
              ],
            },
          ],
        },
      },
      showSocialLinks: true,
    },
  })

  console.log('\n✅ Demo homepage seeded successfully!')
  console.log('\n📍 Visit: http://localhost:3015/home')
  console.log('🔐 Admin: http://localhost:3015/admin')
  console.log('   Email: demo@compassdigital.nl')
  console.log('   Password: demo1234\n')
}

// Run immediately
seedDemo()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error seeding demo:', error)
    process.exit(1)
  })
