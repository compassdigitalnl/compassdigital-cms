import dotenv from 'dotenv'
// Load environment variables FIRST
dotenv.config()

import { getPayload } from 'payload'
import config from '@/payload.config'

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Plastimed demo data...')

  // 1. Create admin user if not exists
  try {
    const existingUser = await payload.find({
      collection: 'users',
      where: { email: { equals: 'admin@plastimed.nl' } },
    })

    if (existingUser.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'admin@plastimed.nl',
          password: 'admin123',
          roles: ['admin'],
          name: 'Plastimed Admin',
        },
      })
      console.log('✅ Admin user created (admin@plastimed.nl / admin123)')
    } else {
      console.log('✅ Admin user already exists')
    }
  } catch (error) {
    console.log('⚠️ Error creating admin:', error)
  }

  // 2. Create brands
  console.log('📦 Creating brands...')
  const brands = [
    { name: 'Littmann', slug: 'littmann', featured: true },
    { name: 'Hartmann', slug: 'hartmann', featured: true },
    { name: 'BD (Becton Dickinson)', slug: 'bd', featured: true },
    { name: 'BSN Medical', slug: 'bsn-medical', featured: false },
    { name: 'Welch Allyn', slug: 'welch-allyn', featured: false },
  ]

  const createdBrands: any = {}
  for (const brand of brands) {
    const existing = await payload.find({
      collection: 'brands',
      where: { slug: { equals: brand.slug } },
    })

    if (existing.docs.length === 0) {
      const created = await payload.create({
        collection: 'brands',
        data: brand,
      })
      createdBrands[brand.slug] = created.id
      console.log(`  ✓ ${brand.name}`)
    } else {
      createdBrands[brand.slug] = existing.docs[0].id
      console.log(`  ✓ ${brand.name} (exists)`)
    }
  }

  // 3. Create categories with icons
  console.log('📁 Creating categories...')
  const categories = [
    { name: 'Diagnostiek', slug: 'diagnostiek', icon: 'Stethoscope', featured: true },
    { name: 'EHBO', slug: 'ehbo', icon: 'Cross', featured: true },
    { name: 'Injectiemateriaal', slug: 'injectiemateriaal', icon: 'Syringe', featured: true },
    { name: 'Instrumentarium', slug: 'instrumentarium', icon: 'Scissors', featured: true },
    { name: 'Laboratorium', slug: 'laboratorium', icon: 'Microscope', featured: true },
    { name: 'Verbandmiddelen', slug: 'verbandmiddelen', icon: 'Bandage', featured: false },
    { name: 'Verzorging', slug: 'verzorging', icon: 'Sparkles', featured: false },
  ]

  const createdCategories: any = {}
  for (const category of categories) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: category.slug } },
    })

    if (existing.docs.length === 0) {
      const created = await payload.create({
        collection: 'categories',
        data: category,
      })
      createdCategories[category.slug] = created.id
      console.log(`  ✓ ${category.name}`)
    } else {
      createdCategories[category.slug] = existing.docs[0].id
      console.log(`  ✓ ${category.name} (exists)`)
    }
  }

  // 4. Create demo products
  console.log('🛍️ Creating products...')
  const products = [
    {
      name: 'Littmann Classic III Stethoscoop',
      slug: 'littmann-classic-iii-stethoscoop',
      sku: 'LT-334',
      price: 139.95,
      compareAtPrice: 159.95,
      description:
        'De meest populaire stethoscoop voor artsen en verpleegkundigen. Uitstekende akoestiek voor beide zijden van de borst.',
      category: createdCategories['diagnostiek'],
      brand: createdBrands['littmann'],
      badge: 'popular',
      inStock: true,
      stockQuantity: 45,
      featured: true,
    },
    {
      name: 'Hartmann Handschoenen Latex Poedervrij',
      slug: 'hartmann-handschoenen-latex',
      sku: 'HT-892',
      price: 8.95,
      compareAtPrice: 10.5,
      description:
        'Hoogwaardige latex handschoenen, poedervrij. Per doos van 100 stuks. Ideaal voor onderzoek en behandeling.',
      category: createdCategories['ehbo'],
      brand: createdBrands['hartmann'],
      badge: 'sale',
      inStock: true,
      stockQuantity: 230,
      featured: true,
    },
    {
      name: 'BD Injectiespuit 10ml Luer Lock',
      slug: 'bd-injectiespuit-10ml',
      sku: 'BD-1045',
      price: 4.25,
      description:
        'Steriele wegwerp injectiespuit 10ml met Luer Lock aansluiting. Per 100 stuks verpakt.',
      category: createdCategories['injectiemateriaal'],
      brand: createdBrands['bd'],
      badge: 'none',
      inStock: true,
      stockQuantity: 180,
      featured: true,
    },
    {
      name: 'BSN Leukoplast Hechtpleister 5m x 2.5cm',
      slug: 'bsn-leukoplast-hechtpleister',
      sku: 'BSN-567',
      price: 6.5,
      description:
        'Elastische, ademende hechtpleister. Geschikt voor alle huidtypes. Goed hechtend, gemakkelijk te verwijderen.',
      category: createdCategories['verbandmiddelen'],
      brand: createdBrands['bsn-medical'],
      badge: 'none',
      inStock: true,
      stockQuantity: 120,
      featured: false,
    },
    {
      name: 'Welch Allyn Bloeddrukmeter Deluxe',
      slug: 'welch-allyn-bloeddrukmeter',
      sku: 'WA-2340',
      price: 89.95,
      description:
        'Professionele bloeddrukmeter met manchet en stethoscoop. Duurzaam aluminium frame.',
      category: createdCategories['diagnostiek'],
      brand: createdBrands['welch-allyn'],
      badge: 'new',
      inStock: true,
      stockQuantity: 25,
      featured: true,
    },
    {
      name: 'Hartmann Desinfectie Alcohol 70% - 500ml',
      slug: 'hartmann-desinfectie-alcohol',
      sku: 'HT-450',
      price: 12.95,
      description:
        'Desinfectie-alcohol 70%, geschikt voor huid en oppervlakken. Flacon van 500ml met doseerpomp.',
      category: createdCategories['verzorging'],
      brand: createdBrands['hartmann'],
      badge: 'none',
      inStock: true,
      stockQuantity: 85,
      featured: false,
    },
  ]

  for (const product of products) {
    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: product.slug } },
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'products',
        data: product,
      })
      console.log(`  ✓ ${product.name}`)
    } else {
      console.log(`  ✓ ${product.name} (exists)`)
    }
  }

  // 5. Create homepage
  console.log('🏠 Creating homepage...')
  const existingHome = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
  })

  if (existingHome.docs.length === 0) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Plastimed - Medische Groothandel',
        slug: 'home',
        status: 'published',
        layout: [
          {
            blockType: 'topBar',
            enabled: true,
            useGlobalSettings: false,
            backgroundColor: '#0A1628',
            textColor: '#FFFFFF',
            leftMessages: [
              { text: '✓ Voordelige B2B prijzen', icon: '✓' },
              { text: '🚚 Gratis verzending vanaf €150', icon: '🚚' },
            ],
            rightLinks: [
              { label: 'Klant worden', link: '/contact' },
              { label: 'Help & Contact', link: '/contact' },
            ],
          },
          {
            blockType: 'hero',
            heading: 'Uw Partner in Medische Zorg',
            subheading:
              'Ruim 3000+ medische producten van A-merken. Snelle levering, scherpe prijzen.',
            primaryButton: { label: 'Naar de shop', link: '/shop' },
            secondaryButton: { label: 'Meer info', link: '/about' },
            style: 'gradient',
          },
          {
            blockType: 'features',
            heading: 'Waarom Plastimed?',
            layout: 'horizontal',
            style: 'trust-bar',
            showHoverEffect: false,
            services: [
              { title: '30+ jaar expertise', iconName: 'Award' },
              { title: 'Gratis verzending €150+', iconName: 'Truck' },
              { title: 'Snelle levering', iconName: 'Zap' },
              { title: 'Veilig betalen', iconName: 'ShieldCheck' },
              { title: 'Alleen A-merken', iconName: 'Star' },
            ],
          },
          {
            blockType: 'categoryGrid',
            heading: 'Shop per Categorie',
            intro: 'Vind snel wat u zoekt in ons uitgebreide assortiment',
            source: 'auto',
            showIcon: true,
            showProductCount: true,
            layout: 'five',
          },
          {
            blockType: 'productGrid',
            heading: 'Populaire Producten',
            intro: 'Onze meest bestelde producten',
            source: 'featured',
            limit: 6,
            layout: 'four',
            showAddToCart: true,
            showBrand: true,
            showStockStatus: true,
            showViewAll: true,
            viewAllLink: '/shop',
          },
          {
            blockType: 'cta',
            heading: 'Klaar om te bestellen?',
            content: 'Maak een account aan en profiteer van onze B2B voordelen',
            primaryButton: { label: 'Account aanmaken', link: '/create-account' },
            secondaryButton: { label: 'Contact opnemen', link: '/contact' },
            style: 'gradient',
          },
        ],
      },
    })
    console.log('✅ Homepage created')
  } else {
    console.log('✅ Homepage already exists')
  }

  console.log('\n🎉 Seeding complete!')
  console.log('\n📍 Next steps:')
  console.log('  1. Visit http://localhost:3016/admin')
  console.log('  2. Login with admin@plastimed.nl / admin123')
  console.log('  3. Check Collections: Products, Brands, Categories')
  console.log('  4. Check Pages: Home')
  console.log('  5. Visit http://localhost:3016/home to see the page!')
}

seed()
  .then(() => {
    console.log('✅ Done')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
