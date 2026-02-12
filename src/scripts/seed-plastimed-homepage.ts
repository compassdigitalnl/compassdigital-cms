import { getPayload } from 'payload'
import config from '@payload-config'

async function seedPlastimedHomepage() {
  console.log('🌱 Starting Plastimed Homepage Seeding...\n')

  const payload = await getPayload({ config })

  // 1. Seed TopBarSettings Global
  console.log('📊 Seeding TopBarSettings...')
  try {
    await payload.updateGlobal({
      slug: 'topBarSettings',
      data: {
        enabled: true,
        backgroundColor: '#0A1628',
        textColor: '#FFFFFF',
        leftMessages: [
          { icon: '✓', text: 'Voordelige B2B prijzen' },
          { icon: '🚚', text: 'Gratis verzending vanaf €150' },
          { icon: '🔒', text: 'Veilig & achteraf betalen' },
        ],
        rightLinks: [
          { label: 'Klant worden', link: '/klant-worden' },
          { label: 'Help & Contact', link: '/contact' },
        ],
      },
    })
    console.log('✅ TopBarSettings created\n')
  } catch (error) {
    console.error('❌ Error creating TopBarSettings:', error)
  }

  // 2. Seed ShopSettings Global
  console.log('🏪 Seeding ShopSettings...')
  try {
    await payload.updateGlobal({
      slug: 'shopSettings',
      data: {
        companyName: 'Plastimed B.V.',
        phone: '0251-247233',
        email: 'info@plastimed.nl',
        whatsapp: '+31612345678',
        address: {
          street: 'Industrieweg',
          houseNumber: '123',
          postalCode: '1948 AA',
          city: 'Beverwijk',
          country: 'Nederland',
        },
        freeShippingThreshold: 150,
        shippingCosts: 6.95,
        deliveryTime: 'Besteld voor 16:00, morgen in huis',
        returnDays: 30,
        showPricesExclVat: false,
        vatPercentage: 21,
        trustScore: 4.8,
        trustSource: 'Google Reviews',
        yearsInBusiness: 30,
        customerCount: 5000,
      },
    })
    console.log('✅ ShopSettings created\n')
  } catch (error) {
    console.error('❌ Error creating ShopSettings:', error)
  }

  // 3. Seed Categories
  console.log('📁 Seeding Categories...')
  const categories = [
    { title: 'Diagnostiek', icon: '🩺', order: 1 },
    { title: 'EHBO', icon: '🏥', order: 2 },
    { title: 'Injectiemateriaal', icon: '💉', order: 3 },
    { title: 'Instrumentarium', icon: '✂️', order: 4 },
    { title: 'Laboratorium', icon: '🔬', order: 5 },
    { title: 'Praktijkinrichting', icon: '🪑', order: 6 },
    { title: 'Verbandmiddelen', icon: '🩹', order: 7 },
    { title: 'Verbruiksmateriaal', icon: '📦', order: 8 },
    { title: 'Verzorging', icon: '🧴', order: 9 },
  ]

  const createdCategories = []
  for (const cat of categories) {
    try {
      const category = await payload.create({
        collection: 'categories',
        data: {
          title: cat.title,
          slug: cat.title.toLowerCase().replace(/\s+/g, '-'),
          icon: cat.icon,
          featured: true,
          order: cat.order,
          description: `Professionele ${cat.title.toLowerCase()} producten voor de zorgsector`,
        },
      })
      createdCategories.push(category)
      console.log(`  ✅ Category: ${cat.title}`)
    } catch (error) {
      console.log(`  ⚠️  Category ${cat.title} might already exist`)
    }
  }
  console.log(`✅ ${createdCategories.length} categories created\n`)

  // 4. Seed Brands
  console.log('🏷️  Seeding Brands...')
  const brands = [
    'Hartmann',
    'BSN Medical',
    '3M',
    'BD',
    'Medline',
    'Clinhand',
    'Parker',
    'Blayco',
  ]

  for (const brandName of brands) {
    try {
      await payload.create({
        collection: 'brands',
        data: {
          name: brandName,
          slug: brandName.toLowerCase().replace(/\s+/g, '-'),
          featured: true,
        },
      })
      console.log(`  ✅ Brand: ${brandName}`)
    } catch (error) {
      console.log(`  ⚠️  Brand ${brandName} might already exist`)
    }
  }
  console.log('✅ Brands created\n')

  // 5. Create Homepage with Blocks
  console.log('🏠 Creating Homepage...')

  // Define homepage layout (blocks)
  const homepageLayout: any[] = [
    // 1. Hero Block
    {
      blockType: 'hero',
      badge: 'Sinds 1994 — 30+ jaar ervaring',
      heading: 'Uw partner in medische supplies',
      description:
        'Plastimed levert ruim 4.000 professionele medische producten aan zorginstellingen door heel Nederland. Van huisartsenpraktijk tot ziekenhuis.',
      primaryCTA: {
        label: 'Bekijk assortiment',
        url: '/shop',
      },
      secondaryCTA: {
        label: 'Klant worden',
        url: '/klant-worden',
      },
    },

    // 2. Stats Block
    {
      blockType: 'stats',
      heading: 'In cijfers',
      layout: 'grid',
      columns: 2,
      stats: [
        { number: '4000+', label: 'Producten', icon: '📦' },
        { number: '30+', label: 'Jaar ervaring', icon: '🏆' },
        { number: '24u', label: 'Levertijd', icon: '⚡' },
        { number: '4.8★', label: 'Klantwaardering', icon: '⭐' },
      ],
    },

    // 3. Features Block (Trust Bar)
    {
      blockType: 'features',
      layout: 'horizontal',
      style: 'trustBar',
      items: [
        {
          iconType: 'emoji',
          emoji: '🏆',
          title: '30+ jaar expertise',
          description: 'Sinds 1994 actief',
        },
        {
          iconType: 'emoji',
          emoji: '📦',
          title: 'Gratis verzending',
          description: 'Bij bestellingen vanaf €150',
        },
        {
          iconType: 'emoji',
          emoji: '⚡',
          title: 'Snelle levering',
          description: 'Vandaag besteld, morgen in huis',
        },
        {
          iconType: 'emoji',
          emoji: '🔒',
          title: 'Veilig betalen',
          description: 'iDEAL, op rekening & meer',
        },
        {
          iconType: 'emoji',
          emoji: '✅',
          title: 'A-merken',
          description: 'Hartmann, BSN, 3M, BD',
        },
      ],
    },

    // 4. CategoryGrid Block
    {
      blockType: 'categoryGrid',
      heading: 'Onze productcategorieën',
      subheading:
        'Alles wat uw praktijk, kliniek of ziekenhuis nodig heeft — van diagnostiek tot verbruiksmateriaal.',
      label: 'Assortiment',
      source: 'auto',
      layout: 5,
      showIcon: true,
      showProductCount: true,
      limit: 10,
    },

    // 5. CTA Block
    {
      blockType: 'cta',
      heading: 'Klaar om te bestellen?',
      description:
        'Word vandaag nog klant bij Plastimed en ervaar zelf de voordelen van bestellen bij dé medische groothandel van Nederland.',
      primaryCTA: {
        label: 'Klant worden',
        url: '/klant-worden',
      },
      secondaryCTA: {
        label: 'Neem contact op',
        url: '/contact',
      },
    },
  ]

  try {
    // Check if homepage already exists
    const existingHome = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
    })

    if (existingHome.docs.length > 0) {
      console.log('⚠️  Homepage already exists, updating...')
      await payload.update({
        collection: 'pages',
        id: existingHome.docs[0].id,
        data: {
          title: 'Home',
          slug: 'home',
          _status: 'published',
          layout: homepageLayout,
        },
      })
      console.log('✅ Homepage updated with all blocks\n')
    } else {
      await payload.create({
        collection: 'pages',
        data: {
          title: 'Home',
          slug: 'home',
          _status: 'published',
          layout: homepageLayout,
        },
      })
      console.log('✅ Homepage created with all blocks\n')
    }
  } catch (error) {
    console.error('❌ Error creating homepage:', error)
  }

  console.log('\n🎉 Plastimed Homepage Seeding Complete!\n')
  console.log('📍 Visit: http://localhost:3016')
  console.log('👤 Admin: http://localhost:3016/admin\n')

  process.exit(0)
}

seedPlastimedHomepage().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
