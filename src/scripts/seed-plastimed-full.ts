import dotenv from 'dotenv'
dotenv.config()

import { getPayload } from 'payload'
import config from '@/payload.config'

async function seed() {
  const payload = await getPayload({ config })
  console.log('\n🌱 Plastimed — Volledige seed gestart...\n')

  // ─────────────────────────────────────────────────────────────
  // 1. ADMIN USER
  // ─────────────────────────────────────────────────────────────
  console.log('👤 Aanmaken admin gebruiker...')
  let adminId: string | number = ''
  try {
    const existing = await payload.find({ collection: 'users', where: { email: { equals: 'admin@plastimed.nl' } } })
    if (existing.docs.length === 0) {
      const user = await payload.create({
        collection: 'users',
        data: {
          email: 'admin@plastimed.nl',
          password: 'Admin123!',
          name: 'Plastimed Admin',
          roles: ['admin'],
        },
      })
      adminId = user.id
      console.log('  ✓ admin@plastimed.nl aangemaakt')
    } else {
      adminId = existing.docs[0].id
      console.log('  ✓ admin@plastimed.nl bestaat al')
    }
  } catch (e: any) {
    console.log('  ⚠️  Fout bij aanmaken user:', e.message)
  }

  // ─────────────────────────────────────────────────────────────
  // 2. CLIENT RECORD
  // ─────────────────────────────────────────────────────────────
  console.log('\n🏢 Aanmaken client record...')
  try {
    const existing = await payload.find({ collection: 'clients', where: { domain: { equals: 'plastimed' } } })
    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'clients',
        data: {
          name: 'Plastimed B.V.',
          domain: 'plastimed',
          contactEmail: 'info@plastimed.nl',
          contactName: 'Plastimed Admin',
          contactPhone: '0251-247233',
          template: 'ecommerce',
          enabledFeatures: ['ecommerce', 'blog', 'forms'],
          status: 'active',
          plan: 'professional',
          notes: 'Medische groothandel. Demo/template klant voor Contyzr platform.',
        },
      })
      console.log('  ✓ Plastimed client aangemaakt')
    } else {
      console.log('  ✓ Plastimed client bestaat al')
    }
  } catch (e: any) {
    console.log('  ⚠️  Fout bij aanmaken client:', e.message)
  }

  // ─────────────────────────────────────────────────────────────
  // 3. GLOBALS — SETTINGS
  // ─────────────────────────────────────────────────────────────
  console.log('\n⚙️  Instellen globals...')
  try {
    await payload.updateGlobal({
      slug: 'settings',
      data: {
        companyName: 'Plastimed B.V.',
        tagline: 'Uw partner in medische disposables',
        description: 'Plastimed levert ruim 4.000 professionele medische producten aan zorginstellingen door heel Nederland. Van huisartsenpraktijk tot ziekenhuis.',
        kvkNumber: '37048291',
        vatNumber: 'NL812345678B01',
        email: 'info@plastimed.nl',
        phone: '0251-247233',
        whatsapp: '+31 6 12 34 56 78',
        website: 'https://www.plastimed.nl',
        address: {
          street: 'Industrieweg 123',
          city: 'Beverwijk',
          postalCode: '1948 AA',
          country: 'Nederland',
        },
        socialMedia: {
          linkedin: 'https://linkedin.com/company/plastimed',
        },
        freeShippingThreshold: 150,
        shippingCosts: 6.95,
        deliveryTime: 'Besteld voor 16:00, morgen in huis',
        returnDays: 30,
        vatPercentage: 21,
        trustScore: 4.8,
        trustSource: 'Google Reviews',
        yearsInBusiness: 30,
        customerCount: 5000,
      } as any,
    })
    console.log('  ✓ Settings')
  } catch (e: any) {
    console.log('  ⚠️  Settings:', e.message)
  }

  // ─────────────────────────────────────────────────────────────
  // 4. GLOBALS — THEME
  // ─────────────────────────────────────────────────────────────
  try {
    await payload.updateGlobal({
      slug: 'theme',
      data: {
        primaryColor: '#0A3D82',
        secondaryColor: '#E8F0FE',
        accentColor: '#1A73E8',
        textColor: '#1A1A2E',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Inter',
        borderRadius: 'md',
      } as any,
    })
    console.log('  ✓ Theme')
  } catch (e: any) {
    console.log('  ⚠️  Theme:', e.message)
  }

  // ─────────────────────────────────────────────────────────────
  // 5. GLOBALS — HEADER
  // ─────────────────────────────────────────────────────────────
  try {
    await payload.updateGlobal({
      slug: 'header',
      data: {
        topBar: {
          enabled: true,
          backgroundColor: '#0A3D82',
          textColor: '#FFFFFF',
          leftMessages: [
            { icon: '✓', text: 'Voordelige B2B prijzen', link: '/klant-worden' },
            { icon: '🚚', text: 'Gratis verzending vanaf €150' },
            { icon: '🔒', text: 'Veilig & achteraf betalen' },
          ],
          rightLinks: [
            { label: 'Klant worden', link: '/klant-worden' },
            { label: 'Help & Contact', link: '/contact' },
          ],
        },
        navigation: [
          { label: 'Shop', link: '/shop' },
          { label: 'Categorieën', link: '/shop', hasDropdown: false },
          { label: 'Over ons', link: '/over-ons' },
          { label: 'Blog', link: '/blog' },
          { label: 'Contact', link: '/contact' },
        ],
      } as any,
    })
    console.log('  ✓ Header')
  } catch (e: any) {
    console.log('  ⚠️  Header:', e.message)
  }

  // ─────────────────────────────────────────────────────────────
  // 6. GLOBALS — FOOTER
  // ─────────────────────────────────────────────────────────────
  try {
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        columns: [
          {
            title: 'Plastimed',
            links: [
              { label: 'Over ons', link: '/over-ons' },
              { label: 'Blog', link: '/blog' },
              { label: 'Klant worden', link: '/klant-worden' },
              { label: 'Contact', link: '/contact' },
            ],
          },
          {
            title: 'Categorieën',
            links: [
              { label: 'Diagnostiek', link: '/shop?categorie=diagnostiek' },
              { label: 'EHBO', link: '/shop?categorie=ehbo' },
              { label: 'Injectiemateriaal', link: '/shop?categorie=injectiemateriaal' },
              { label: 'Verbandmiddelen', link: '/shop?categorie=verbandmiddelen' },
              { label: 'Alle categorieën', link: '/shop' },
            ],
          },
          {
            title: 'Klantenservice',
            links: [
              { label: 'Veelgestelde vragen', link: '/faq' },
              { label: 'Verzending & retour', link: '/faq' },
              { label: 'Betaalwijzen', link: '/faq' },
              { label: 'Contact', link: '/contact' },
            ],
          },
        ],
        bottomText: '© 2024 Plastimed B.V. — Alle rechten voorbehouden. KVK: 37048291',
      } as any,
    })
    console.log('  ✓ Footer')
  } catch (e: any) {
    console.log('  ⚠️  Footer:', e.message)
  }

  // ─────────────────────────────────────────────────────────────
  // 7. PRODUCT CATEGORIES
  // ─────────────────────────────────────────────────────────────
  console.log('\n📁 Aanmaken productcategorieën...')
  const categoryData = [
    { name: 'Diagnostiek', slug: 'diagnostiek', description: 'Stethoscopen, bloeddrukmeters, otoscopen en meer diagnostisch materiaal', visible: true, order: 1 },
    { name: 'EHBO', slug: 'ehbo', description: 'Verbandmateriaal, handschoenen en overig EHBO-materiaal', visible: true, order: 2 },
    { name: 'Injectiemateriaal', slug: 'injectiemateriaal', description: 'Spuiten, naalden en overig injectiemateriaal', visible: true, order: 3 },
    { name: 'Instrumentarium', slug: 'instrumentarium', description: 'Scharen, pincetten, klemmen en overig instrumentarium', visible: true, order: 4 },
    { name: 'Laboratorium', slug: 'laboratorium', description: 'Bloedafname, urinetests en overig laboratoriummateriaal', visible: true, order: 5 },
    { name: 'Praktijkinrichting', slug: 'praktijkinrichting', description: 'Onderzoeksbanken, lampen en overige praktijkinrichting', visible: false, order: 6 },
    { name: 'Verbandmiddelen', slug: 'verbandmiddelen', description: 'Pleisters, zwachtels, gazen en overig verbandmateriaal', visible: true, order: 7 },
    { name: 'Verbruiksmateriaal', slug: 'verbruiksmateriaal', description: 'Handschoenen, mondmaskers en overig verbruiksmateriaal', visible: false, order: 8 },
    { name: 'Verzorging', slug: 'verzorging', description: 'Desinfectiemiddelen, crèmes en overige verzorgingsproducten', visible: false, order: 9 },
  ]

  const cats: Record<string, string | number> = {}
  for (const cat of categoryData) {
    try {
      const existing = await payload.find({ collection: 'product-categories', where: { slug: { equals: cat.slug } } })
      if (existing.docs.length === 0) {
        const created = await payload.create({ collection: 'product-categories', data: cat as any })
        cats[cat.slug] = created.id
        console.log(`  ✓ ${cat.name}`)
      } else {
        cats[cat.slug] = existing.docs[0].id
        console.log(`  ✓ ${(cat as any).name || (existing.docs[0] as any).name} (bestaat al)`)
      }
    } catch (e: any) {
      console.log(`  ⚠️  ${cat.title}:`, e.message)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 8. BRANDS
  // ─────────────────────────────────────────────────────────────
  console.log('\n🏷️  Aanmaken merken...')
  const brandData = [
    { name: 'Hartmann', slug: 'hartmann', description: 'Toonaangevend merk in wondverzorging en verbruiksmateriaal', featured: true },
    { name: 'BSN Medical', slug: 'bsn-medical', description: 'Specialist in verbandmiddelen en zwachtels', featured: true },
    { name: '3M', slug: '3m', description: 'Innovatieve producten voor medische zorg', featured: true },
    { name: 'BD (Becton Dickinson)', slug: 'bd', description: 'Wereldleider in injectiemateriaal en diagnostiek', featured: true },
    { name: 'Medline', slug: 'medline', description: 'Breed assortiment medisch verbruiksmateriaal', featured: false },
    { name: 'Littmann', slug: 'littmann', description: 'Nummer 1 stethoscopen voor zorgprofessionals', featured: true },
    { name: 'Welch Allyn', slug: 'welch-allyn', description: 'Diagnostische instrumenten van hoge kwaliteit', featured: false },
    { name: 'Parker', slug: 'parker', description: 'Echogel en diagnostische vloeistoffen', featured: false },
  ]

  const brands: Record<string, string | number> = {}
  for (const brand of brandData) {
    try {
      const existing = await payload.find({ collection: 'brands', where: { slug: { equals: brand.slug } } })
      if (existing.docs.length === 0) {
        const created = await payload.create({ collection: 'brands', data: brand as any })
        brands[brand.slug] = created.id
        console.log(`  ✓ ${brand.name}`)
      } else {
        brands[brand.slug] = existing.docs[0].id
        console.log(`  ✓ ${brand.name} (bestaat al)`)
      }
    } catch (e: any) {
      console.log(`  ⚠️  ${brand.name}:`, e.message)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 9. PRODUCTS (25+)
  // ─────────────────────────────────────────────────────────────
  console.log('\n🛍️  Aanmaken producten...')
  const productData = [
    // DIAGNOSTIEK
    {
      title: 'Littmann Classic III Stethoscoop — Zwart',
      slug: 'littmann-classic-iii-zwart',
      sku: 'LT-5803',
      price: 139.95,
      compareAtPrice: 159.95,
      stock: 45,
      categories: [cats['diagnostiek']],
      brand: brands['littmann'],
      badge: 'popular',
      featured: true,
      status: 'published',
      specifications: [
        { key: 'Type', value: 'Akoestische stethoscoop' },
        { key: 'Chestpiece', value: 'Dubbelzijdig' },
        { key: 'Slangenlengte', value: '69 cm' },
        { key: 'Garantie', value: '5 jaar' },
      ],
    },
    {
      title: 'Littmann Cardiology IV Stethoscoop — Antraciet',
      slug: 'littmann-cardiology-iv-antraciet',
      sku: 'LT-6232',
      price: 219.95,
      compareAtPrice: 249.00,
      stock: 18,
      categories: [cats['diagnostiek']],
      brand: brands['littmann'],
      badge: 'new',
      featured: true,
      status: 'published',
      specifications: [
        { key: 'Type', value: 'Cardiologische stethoscoop' },
        { key: 'Frequentiebereik', value: '20 Hz – 1.000 Hz' },
        { key: 'Slangenlengte', value: '69 cm' },
        { key: 'Garantie', value: '7 jaar' },
      ],
    },
    {
      title: 'Welch Allyn Bloeddrukmeter met manchet',
      slug: 'welch-allyn-bloeddrukmeter',
      sku: 'WA-5080-E1',
      price: 89.95,
      stock: 22,
      categories: [cats['diagnostiek']],
      brand: brands['welch-allyn'],
      badge: 'none',
      featured: true,
      status: 'published',
      specifications: [
        { key: 'Type', value: 'Handmatig, aneroid' },
        { key: 'Manchetmaat', value: 'Standaard (23–40 cm)' },
        { key: 'Nauwkeurigheid', value: '±3 mmHg' },
      ],
    },
    {
      title: 'Welch Allyn Otoscoop 3.5V Diagnostisch',
      slug: 'welch-allyn-otoscoop',
      sku: 'WA-23820',
      price: 124.50,
      stock: 12,
      categories: [cats['diagnostiek']],
      brand: brands['welch-allyn'],
      badge: 'none',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Lichtbron', value: 'Halogeen 3.5V' },
        { key: 'Vergroting', value: '5×' },
        { key: 'Incl.', value: 'Specula set (10 stuks)' },
      ],
    },
    // EHBO
    {
      title: 'Hartmann Handschoenen Latex Poedervrij (100 st)',
      slug: 'hartmann-latex-handschoenen-100',
      sku: 'HT-3893',
      price: 8.95,
      compareAtPrice: 10.50,
      stock: 230,
      categories: [cats['ehbo'], cats['verbruiksmateriaal']],
      brand: brands['hartmann'],
      badge: 'sale',
      featured: true,
      status: 'published',
      specifications: [
        { key: 'Materiaal', value: 'Latex, poedervrij' },
        { key: 'Verpakking', value: '100 stuks/doos' },
        { key: 'Maten', value: 'XS, S, M, L, XL' },
        { key: 'Steriel', value: 'Nee (niet-steriel)' },
      ],
    },
    {
      title: 'Hartmann Handschoenen Nitrile Zwart (100 st)',
      slug: 'hartmann-nitrile-handschoenen-zwart',
      sku: 'HT-3912',
      price: 11.95,
      stock: 180,
      categories: [cats['ehbo'], cats['verbruiksmateriaal']],
      brand: brands['hartmann'],
      badge: 'none',
      featured: true,
      status: 'published',
      specifications: [
        { key: 'Materiaal', value: 'Nitrile, latexvrij' },
        { key: 'Kleur', value: 'Zwart' },
        { key: 'Verpakking', value: '100 stuks/doos' },
      ],
    },
    {
      title: 'EHBO Koffer Compleet — Bedrijven',
      slug: 'ehbo-koffer-compleet-bedrijven',
      sku: 'EH-2045',
      price: 49.95,
      stock: 35,
      categories: [cats['ehbo']],
      brand: brands['hartmann'],
      badge: 'none',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Inhoud', value: '95 items' },
        { key: 'Koffer', value: 'Hard kunststof, rood' },
        { key: 'Voldoet aan', value: 'DIN 13157' },
      ],
    },
    // INJECTIEMATERIAAL
    {
      title: 'BD Injectiespuit 10ml Luer Lock (100 st)',
      slug: 'bd-injectiespuit-10ml-100st',
      sku: 'BD-302831',
      price: 18.95,
      stock: 150,
      categories: [cats['injectiemateriaal']],
      brand: brands['bd'],
      badge: 'none',
      featured: true,
      status: 'published',
      specifications: [
        { key: 'Inhoud', value: '10 ml' },
        { key: 'Aansluiting', value: 'Luer Lock' },
        { key: 'Steriel', value: 'Ja, EO-gesteriliseerd' },
        { key: 'Verpakking', value: '100 stuks' },
      ],
    },
    {
      title: 'BD Microlance Naalden 21G x 1.5" (100 st)',
      slug: 'bd-microlance-naalden-21g',
      sku: 'BD-301155',
      price: 9.50,
      stock: 200,
      categories: [cats['injectiemateriaal']],
      brand: brands['bd'],
      badge: 'none',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Maat', value: '21G × 1½" (0.8 × 40 mm)' },
        { key: 'Kleur', value: 'Groen' },
        { key: 'Steriel', value: 'Ja' },
        { key: 'Verpakking', value: '100 stuks' },
      ],
    },
    {
      title: 'BD Vacutainer Bloedafnamesysteem Starter',
      slug: 'bd-vacutainer-starter-set',
      sku: 'BD-367820',
      price: 34.50,
      stock: 55,
      categories: [cats['injectiemateriaal'], cats['laboratorium']],
      brand: brands['bd'],
      badge: 'new',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Inhoud', value: 'Houder + 20 EDTA buisjes + 20 naalden' },
        { key: 'Naaldmaat', value: '21G' },
      ],
    },
    // VERBANDMIDDELEN
    {
      title: 'BSN Leukoplast Hechtpleister — 5m × 2.5cm',
      slug: 'bsn-leukoplast-5m-2-5cm',
      sku: 'BSN-76014',
      price: 6.50,
      stock: 120,
      categories: [cats['verbandmiddelen']],
      brand: brands['bsn-medical'],
      badge: 'none',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Formaat', value: '5 m × 2.5 cm' },
        { key: 'Materiaal', value: 'Elastisch non-woven' },
        { key: 'Huidvriendelijk', value: 'Ja, hypoallergeen' },
      ],
    },
    {
      title: 'Hartmann Gazenstripjes Steriel 7.5×7.5cm (10 st)',
      slug: 'hartmann-gazen-steriel-7-5cm',
      sku: 'HT-902123',
      price: 4.25,
      stock: 300,
      categories: [cats['verbandmiddelen']],
      brand: brands['hartmann'],
      badge: 'none',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Formaat', value: '7.5 × 7.5 cm' },
        { key: 'Lagen', value: '12-laags' },
        { key: 'Steriel', value: 'Ja (individueel verpakt)' },
        { key: 'Verpakking', value: '10 stuks' },
      ],
    },
    {
      title: 'BSN Tricofix Buisverband Maat D (10m)',
      slug: 'bsn-tricofix-buisverband-d',
      sku: 'BSN-45470',
      price: 7.95,
      stock: 80,
      categories: [cats['verbandmiddelen']],
      brand: brands['bsn-medical'],
      badge: 'none',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Maat', value: 'D (6 cm)' },
        { key: 'Lengte', value: '10 m' },
        { key: 'Materiaal', value: 'Katoen-elastaan' },
      ],
    },
    // INSTRUMENTARIUM
    {
      title: 'Chirurgische Schaar Mayo Gebogen 17cm',
      slug: 'schaar-mayo-gebogen-17cm',
      sku: 'INS-2201',
      price: 22.50,
      stock: 40,
      categories: [cats['instrumentarium']],
      brand: brands['medline'],
      badge: 'none',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Lengte', value: '17 cm' },
        { key: 'Type', value: 'Gebogen, stomp-stomp' },
        { key: 'Materiaal', value: 'Roestvrij staal' },
        { key: 'Autoclaafbaar', value: 'Ja' },
      ],
    },
    {
      title: 'Pincet Anatomisch 14cm (set van 5)',
      slug: 'pincet-anatomisch-14cm-set5',
      sku: 'INS-1145',
      price: 18.75,
      stock: 60,
      categories: [cats['instrumentarium']],
      brand: brands['medline'],
      badge: 'none',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Lengte', value: '14 cm' },
        { key: 'Type', value: 'Anatomisch (zonder tand)' },
        { key: 'Materiaal', value: 'Roestvrij staal' },
        { key: 'Verpakking', value: '5 stuks' },
      ],
    },
    // LABORATORIUM
    {
      title: 'BD Vacutainer EDTA Buisjes 4ml (100 st)',
      slug: 'bd-vacutainer-edta-4ml',
      sku: 'BD-367838',
      price: 24.95,
      stock: 100,
      categories: [cats['laboratorium']],
      brand: brands['bd'],
      badge: 'none',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Inhoud', value: '4 ml' },
        { key: 'Additief', value: 'K2EDTA' },
        { key: 'Dopkleur', value: 'Paars' },
        { key: 'Verpakking', value: '100 stuks' },
      ],
    },
    {
      title: 'Urineteststrips Combi-10 (100 st)',
      slug: 'urineteststrips-combi-10',
      sku: 'LAB-4501',
      price: 32.50,
      stock: 65,
      categories: [cats['laboratorium']],
      brand: brands['medline'],
      badge: 'none',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Parameters', value: '10 (glucose, eiwit, pH, bloedcellen, etc.)' },
        { key: 'Afleestijd', value: '60 seconden' },
        { key: 'Verpakking', value: '100 strips' },
        { key: 'Houdbaarheid', value: '18 maanden' },
      ],
    },
    // VERZORGING
    {
      title: 'Hartmann Desinfectie-Alcohol 70% — 500ml',
      slug: 'hartmann-desinfectie-alcohol-500ml',
      sku: 'HT-9871',
      price: 12.95,
      stock: 85,
      categories: [cats['verzorging']],
      brand: brands['hartmann'],
      badge: 'none',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Concentratie', value: '70% isopropylalcohol' },
        { key: 'Toepassing', value: 'Huid en oppervlakken' },
        { key: 'Inhoud', value: '500 ml met doseerpomp' },
      ],
    },
    {
      title: 'Hartmann Bactosept Handgel 250ml',
      slug: 'hartmann-bactosept-handgel-250ml',
      sku: 'HT-5560',
      price: 6.95,
      stock: 140,
      categories: [cats['verzorging'], cats['verbruiksmateriaal']],
      brand: brands['hartmann'],
      badge: 'none',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Werkzame stof', value: 'Ethanol 75%' },
        { key: 'Inhoud', value: '250 ml' },
        { key: 'Huidvriendelijk', value: 'Met glycerine' },
      ],
    },
    // VERBRUIKSMATERIAAL
    {
      title: '3M Nexcare Chirurgisch Mondmasker Type IIR (50 st)',
      slug: '3m-nexcare-mondmasker-type-iir',
      sku: '3M-1820',
      price: 14.95,
      compareAtPrice: 17.50,
      stock: 200,
      categories: [cats['verbruiksmateriaal']],
      brand: brands['3m'],
      badge: 'sale',
      featured: true,
      status: 'published',
      specifications: [
        { key: 'Norm', value: 'EN 14683 Type IIR' },
        { key: 'BFE', value: '≥98%' },
        { key: 'Verpakking', value: '50 stuks' },
        { key: 'Kleur', value: 'Blauw' },
      ],
    },
    {
      title: 'Parker Aquasonic Echogel 250ml',
      slug: 'parker-aquasonic-echogel-250ml',
      sku: 'PA-01-08',
      price: 8.50,
      stock: 70,
      categories: [cats['diagnostiek']],
      brand: brands['parker'],
      badge: 'none',
      featured: false,
      status: 'published',
      specifications: [
        { key: 'Inhoud', value: '250 ml' },
        { key: 'Kleur', value: 'Blauw, helder' },
        { key: 'Wateroplosbaar', value: 'Ja' },
        { key: 'Hypoallergeen', value: 'Ja' },
      ],
    },
  ]

  const productIds: (string | number)[] = []
  for (const product of productData) {
    try {
      const existing = await payload.find({ collection: 'products', where: { slug: { equals: product.slug } } })
      if (existing.docs.length === 0) {
        const created = await payload.create({ collection: 'products', data: product as any })
        productIds.push(created.id)
        console.log(`  ✓ ${product.title}`)
      } else {
        productIds.push(existing.docs[0].id)
        console.log(`  ✓ ${product.title} (bestaat al)`)
      }
    } catch (e: any) {
      console.log(`  ⚠️  ${product.title}:`, e.message)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 10. TESTIMONIALS
  // ─────────────────────────────────────────────────────────────
  console.log('\n⭐ Aanmaken testimonials...')
  const testimonialsData = [
    {
      name: 'Dr. Miriam van der Berg',
      role: 'Huisarts',
      company: 'Huisartsenpraktijk De Linde',
      quote: 'Al meer dan 10 jaar bestel ik bij Plastimed. Betrouwbare kwaliteit, snelle levering en een uitstekende klantenservice. Kan ik iedereen in de zorg aanbevelen.',
      rating: 5,
      featured: true,
      status: 'published',
    },
    {
      name: 'Mark Hendriks',
      role: 'Inkoopmanager',
      company: 'Regionaal Zorgcentrum Amstelland',
      quote: 'De B2B prijzen van Plastimed zijn echt concurrerend. We bestellen grote volumes injectiemateriaal en handschoenen — altijd op voorraad en snel geleverd.',
      rating: 5,
      featured: true,
      status: 'published',
    },
    {
      name: 'Sandra Willemsen',
      role: 'Praktijkmanager',
      company: 'Fysiotherapiepraktijk Willemsen',
      quote: 'Fijn dat Plastimed ook voor kleine praktijken aantrekkelijke prijzen biedt. Bestelling geplaatst op maandag, dinsdag in huis. Precies zoals beloofd.',
      rating: 5,
      featured: true,
      status: 'published',
    },
    {
      name: 'Karin Baas',
      role: 'Teamleider Zorg',
      company: 'Verpleeghuis De Zonnehoek',
      quote: 'We zijn overgestapt van een andere leverancier naar Plastimed en zijn erg blij met de keuze. Betere service, ruimer assortiment en scherpe prijzen.',
      rating: 4,
      featured: false,
      status: 'published',
    },
    {
      name: 'Joost Vermeer',
      role: 'Paramedisch Directeur',
      company: 'GGD Kennemerland',
      quote: 'Plastimed is onze vaste leverancier voor vaccinatiemateriaal. Altijd tijdig leverbaar, ook tijdens drukke periodes zoals griepvaccin-seizoen.',
      rating: 5,
      featured: false,
      status: 'published',
    },
  ]

  const testimonialIds: (string | number)[] = []
  for (const t of testimonialsData) {
    try {
      const existing = await payload.find({ collection: 'testimonials', where: { name: { equals: t.name } } })
      if (existing.docs.length === 0) {
        const created = await payload.create({ collection: 'testimonials', data: t as any })
        testimonialIds.push(created.id)
        console.log(`  ✓ ${t.name}`)
      } else {
        testimonialIds.push(existing.docs[0].id)
        console.log(`  ✓ ${t.name} (bestaat al)`)
      }
    } catch (e: any) {
      console.log(`  ⚠️  ${t.name}:`, e.message)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 11. FAQS
  // ─────────────────────────────────────────────────────────────
  console.log('\n❓ Aanmaken FAQs...')
  const faqData = [
    {
      question: 'Wat zijn de verzendkosten?',
      answer: { root: { children: [{ children: [{ text: 'Verzendkosten bedragen €6,95 per bestelling. Bij bestellingen vanaf €150 exclusief BTW is verzending gratis. We werken samen met DHL voor snelle en betrouwbare bezorging.' }], type: 'paragraph' }], direction: null, format: '', indent: 0, type: 'root', version: 1 } },
      category: 'verzending',
      featured: true,
      order: 1,
      status: 'published',
    },
    {
      question: 'Wanneer wordt mijn bestelling geleverd?',
      answer: { root: { children: [{ children: [{ text: 'Bestellingen geplaatst voor 16:00 uur op werkdagen worden de volgende werkdag bezorgd. Bestellingen op vrijdag worden de volgende maandag geleverd.' }], type: 'paragraph' }], direction: null, format: '', indent: 0, type: 'root', version: 1 } },
      category: 'verzending',
      featured: true,
      order: 2,
      status: 'published',
    },
    {
      question: 'Hoe word ik klant bij Plastimed?',
      answer: { root: { children: [{ children: [{ text: 'U kunt zich registreren via de pagina "Klant worden". Vul het formulier in met uw bedrijfsgegevens en KVK-nummer. Na verificatie (maximaal 1 werkdag) ontvangt u uw inloggegevens en heeft u direct toegang tot onze B2B-prijzen.' }], type: 'paragraph' }], direction: null, format: '', indent: 0, type: 'root', version: 1 } },
      category: 'account',
      featured: true,
      order: 3,
      status: 'published',
    },
    {
      question: 'Welke betaalmethoden accepteert Plastimed?',
      answer: { root: { children: [{ children: [{ text: 'We accepteren iDEAL, creditcard (Visa/Mastercard), Bancontact en betalen op rekening (voor geregistreerde B2B-klanten na goedkeuring). Factuurbetaling is mogelijk binnen 30 dagen.' }], type: 'paragraph' }], direction: null, format: '', indent: 0, type: 'root', version: 1 } },
      category: 'betaling',
      featured: true,
      order: 4,
      status: 'published',
    },
    {
      question: 'Kan ik producten retourneren?',
      answer: { root: { children: [{ children: [{ text: 'Ja, producten kunnen binnen 30 dagen na ontvangst worden geretourneerd, mits ze ongebruikt en in originele verpakking zijn. Steriele producten zijn om hygiënische redenen uitgesloten van retour. Neem contact op voor een retourformulier.' }], type: 'paragraph' }], direction: null, format: '', indent: 0, type: 'root', version: 1 } },
      category: 'retourneren',
      featured: true,
      order: 5,
      status: 'published',
    },
    {
      question: 'Zijn de producten CE-gecertificeerd?',
      answer: { root: { children: [{ children: [{ text: 'Ja, alle medische hulpmiddelen die wij leveren voldoen aan de Europese MDR-regelgeving en zijn CE-gecertificeerd. Certificaten zijn op aanvraag beschikbaar.' }], type: 'paragraph' }], direction: null, format: '', indent: 0, type: 'root', version: 1 } },
      category: 'producten',
      featured: false,
      order: 6,
      status: 'published',
    },
    {
      question: 'Biedt Plastimed kortingen voor grote afnames?',
      answer: { root: { children: [{ children: [{ text: 'Ja, voor grote afnames bieden we volumekortingen. Neem contact op met onze verkoopafdeling voor een offerte op maat. We hebben ook speciale tarieven voor zorginstellingen en GGD-contracten.' }], type: 'paragraph' }], direction: null, format: '', indent: 0, type: 'root', version: 1 } },
      category: 'algemeen',
      featured: false,
      order: 7,
      status: 'published',
    },
    {
      question: 'Wat is de minimale bestelhoeveelheid?',
      answer: { root: { children: [{ children: [{ text: 'Er is geen minimale bestelhoeveelheid. U kunt zelfs één product bestellen. Bij kleine bestellingen geldt wel het standaard verzendtarief van €6,95.' }], type: 'paragraph' }], direction: null, format: '', indent: 0, type: 'root', version: 1 } },
      category: 'algemeen',
      featured: false,
      order: 8,
      status: 'published',
    },
  ]

  const faqIds: (string | number)[] = []
  for (const faq of faqData) {
    try {
      const existing = await payload.find({ collection: 'faqs', where: { question: { equals: faq.question } } })
      if (existing.docs.length === 0) {
        const created = await payload.create({ collection: 'faqs', data: faq as any })
        faqIds.push(created.id)
        console.log(`  ✓ ${faq.question.substring(0, 50)}`)
      } else {
        faqIds.push(existing.docs[0].id)
        console.log(`  ✓ ${faq.question.substring(0, 50)} (bestaat al)`)
      }
    } catch (e: any) {
      console.log(`  ⚠️  FAQ:`, e.message)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 12. BLOG POSTS
  // ─────────────────────────────────────────────────────────────
  console.log('\n📝 Aanmaken blogposts...')
  const blogData = [
    {
      title: '5 Tips voor het kiezen van de juiste stethoscoop',
      slug: '5-tips-juiste-stethoscoop',
      excerpt: 'Een goede stethoscoop is het visitekaartje van elke zorgprofessional. Maar hoe kies je de juiste? Wij delen 5 praktische tips.',
      content: {
        root: {
          children: [
            { children: [{ text: 'Een stethoscoop is één van de meest persoonlijke instrumenten in de gereedschapskist van een zorgprofessional. Of je nu huisarts, verpleegkundige of fysiotherapeut bent — de keuze van de juiste stethoscoop maakt een verschil.' }], type: 'paragraph' },
            { children: [{ text: '1. Bepaal je specialisme', bold: true }], type: 'paragraph' },
            { children: [{ text: 'Voor algemene diagnostiek is een dubbelzijdige stethoscoop zoals de Littmann Classic III ideaal. Cardiologen kiezen eerder voor een cardiologische versie met hogere gevoeligheid.' }], type: 'paragraph' },
            { children: [{ text: '2. Let op de slangenlengte', bold: true }], type: 'paragraph' },
            { children: [{ text: 'De standaardlengte is 69 cm. Langere slangen (76 cm) zijn handig in de IC maar verminderen iets de geluidskwaliteit.' }], type: 'paragraph' },
            { children: [{ text: '3. Kies je materiaal' , bold: true }], type: 'paragraph' },
            { children: [{ text: 'Latex-vrije stethoscopen zijn verplicht bij patiënten met latexallergie. Controleer altijd of de oordoppen goed passen — dit beïnvloedt de geluidskwaliteit enorm.' }], type: 'paragraph' },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      },
      publishedAt: new Date('2024-11-15').toISOString(),
      _status: 'draft',
      author: adminId || undefined,
    },
    {
      title: 'Nieuwe MDR-regelgeving: wat betekent dit voor uw praktijk?',
      slug: 'mdr-regelgeving-praktijk',
      excerpt: 'De Medical Device Regulation (MDR) is volledig van kracht. Wat verandert er voor zorginstellingen en wat moet u weten over de nieuwe CE-markering?',
      content: {
        root: {
          children: [
            { children: [{ text: 'Sinds 2021 is de nieuwe Medical Device Regulation (MDR, EU 2017/745) stapsgewijs in werking getreden. Voor veel zorginstellingen roept dit vragen op: welke producten mogen we nog gebruiken en wat zijn de nieuwe eisen?' }], type: 'paragraph' },
            { children: [{ text: 'Wat verandert er?', bold: true }], type: 'paragraph' },
            { children: [{ text: 'De MDR vervangt de oude MDD-richtlijn en stelt strengere eisen aan de klinische validatie, technische documentatie en post-market surveillance van medische hulpmiddelen.' }], type: 'paragraph' },
            { children: [{ text: 'Praktische gevolgen', bold: true }], type: 'paragraph' },
            { children: [{ text: 'Voor de meeste gebruikers verandert er weinig aan de dagelijkse praktijk. Plastimed zorgt ervoor dat alle producten in ons assortiment MDR-compliant zijn en voorzien van de juiste documentatie.' }], type: 'paragraph' },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      },
      publishedAt: new Date('2024-12-01').toISOString(),
      _status: 'draft',
      author: adminId || undefined,
    },
    {
      title: 'Gratis verzending: zo haalt u het meeste uit uw bestelling',
      slug: 'gratis-verzending-tips',
      excerpt: 'Bij bestellingen vanaf €150 verstuurt Plastimed gratis. We geven tips hoe u slim kunt combineren om de verzendkosten te besparen.',
      content: {
        root: {
          children: [
            { children: [{ text: 'Slim inkopen bespaart kosten. Een van de makkelijkste manieren is het combineren van bestellingen om de gratis-verzendingsdrempel van €150 te halen.' }], type: 'paragraph' },
            { children: [{ text: 'Tip 1: Gebruik de verlanglijst', bold: true }], type: 'paragraph' },
            { children: [{ text: 'Voeg producten die u periodiek nodig heeft toe aan uw verlanglijst en bestel ze samen. Zo vermijdt u meerdere kleine bestellingen met telkens €6,95 verzendkosten.' }], type: 'paragraph' },
            { children: [{ text: 'Tip 2: Gebruik de snelbestel-functie', bold: true }], type: 'paragraph' },
            { children: [{ text: 'Bekende producten kunt u direct op artikelnummer (SKU) bestellen via onze snelbestel-pagina. Dit bespaart u zoektijd.' }], type: 'paragraph' },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      },
      publishedAt: new Date('2025-01-10').toISOString(),
      _status: 'draft',
      author: adminId || undefined,
    },
  ]

  for (const post of blogData) {
    try {
      const existing = await payload.find({ collection: 'blog-posts', where: { slug: { equals: post.slug } } })
      if (existing.docs.length === 0) {
        await payload.create({ collection: 'blog-posts', data: post as any })
        console.log(`  ✓ ${post.title}`)
      } else {
        console.log(`  ✓ ${post.title} (bestaat al)`)
      }
    } catch (e: any) {
      console.log(`  ⚠️  ${post.title}:`, e.message)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 13. PAGES
  // ─────────────────────────────────────────────────────────────
  console.log('\n📄 Aanmaken pagina\'s...')

  const pages = [
    // ── HOME ──────────────────────────────────────────────────
    {
      title: 'Home',
      slug: 'home',
      _status: 'published',
      layout: [
        {
          blockType: 'topBar',
          enabled: true,
          backgroundColor: '#0A3D82',
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
        {
          blockType: 'hero',
          style: 'gradient',
          title: 'Uw partner in medische supplies',
          subtitle: 'Plastimed levert ruim 4.000 professionele medische producten aan zorginstellingen door heel Nederland. Vandaag besteld, morgen in huis.',
          primaryCTA: { text: 'Bekijk assortiment', link: '/shop' },
          secondaryCTA: { text: 'Klant worden', link: '/klant-worden' },
        },
        {
          blockType: 'stats',
          heading: 'Plastimed in cijfers',
          stats: [
            { number: '4.000', suffix: '+', label: 'Producten' },
            { number: '30', suffix: ' jaar', label: 'Ervaring' },
            { number: '5.000', suffix: '+', label: 'Klanten' },
            { number: '4.8', suffix: '★', label: 'Klantscore' },
          ],
          layout: 'grid-4',
        },
        {
          blockType: 'features',
          source: 'manual',
          layout: 'horizontal',
          style: 'trust-bar',
          showHoverEffect: false,
          features: [
            { iconType: 'lucide', iconName: 'Award', name: '30+ jaar expertise', description: 'Betrouwbaar leverancier sinds 1994' },
            { iconType: 'lucide', iconName: 'Truck', name: 'Gratis verzending', description: 'Bij bestellingen vanaf €150' },
            { iconType: 'lucide', iconName: 'Zap', name: 'Snelle levering', description: 'Besteld voor 16:00, morgen in huis' },
            { iconType: 'lucide', iconName: 'ShieldCheck', name: 'Veilig betalen', description: 'iDEAL, op rekening & meer' },
            { iconType: 'lucide', iconName: 'Star', name: 'Alleen A-merken', description: 'Hartmann, BSN, 3M, BD & meer' },
          ],
        },
        {
          blockType: 'categoryGrid',
          heading: 'Shop per categorie',
          intro: 'Alles wat uw praktijk, kliniek of ziekenhuis nodig heeft — van diagnostiek tot verbruiksmateriaal.',
          source: 'auto',
          showIcon: true,
          showProductCount: false,
          layout: 'grid-5',
          limit: 9,
        },
        {
          blockType: 'productGrid',
          heading: 'Populaire producten',
          intro: 'Onze meest bestelde producten — van topmerken als Hartmann, BD en Littmann.',
          source: 'featured',
          limit: 8,
          layout: 'grid-4',
          displayMode: 'grid',
          showAddToCart: true,
          showBrand: true,
          showStockStatus: true,
          showComparePrice: true,
          showViewAllButton: true,
          viewAllButtonText: 'Bekijk alle producten',
          viewAllButtonLink: '/shop',
        },
        {
          blockType: 'testimonials',
          heading: 'Wat zeggen onze klanten?',
          intro: 'Meer dan 5.000 zorginstellingen vertrouwen op Plastimed.',
          source: 'collection',
          layout: 'grid-3',
        },
        {
          blockType: 'blog-preview',
          heading: 'Nieuws & Tips',
          intro: 'Blijf op de hoogte van productnieuws, regelgeving en tips voor de zorgprofessional.',
          limit: 3,
          layout: 'grid-3',
          showExcerpt: true,
          showDate: true,
          showAuthor: false,
        },
        {
          blockType: 'cta',
          title: 'Klaar om te bestellen?',
          text: 'Word vandaag nog klant bij Plastimed en ervaar zelf de voordelen van bestellen bij dé medische groothandel van Nederland.',
          buttonText: 'Klant worden',
          buttonLink: '/klant-worden',
          style: 'primary',
        },
      ],
    },

    // ── SHOP (PRODUCT ARCHIEF) ────────────────────────────────
    {
      title: 'Shop — Medisch Assortiment',
      slug: 'shop',
      _status: 'published',
      layout: [
        {
          blockType: 'hero',
          style: 'minimal',
          title: 'Medisch Assortiment',
          subtitle: 'Ruim 4.000 professionele medische producten van topmerken. Snelle levering, scherpe B2B-prijzen.',
        },
        {
          blockType: 'searchBar',
          heading: 'Zoek een product',
          popularSearches: [
            { term: 'stethoscoop' },
            { term: 'handschoenen' },
            { term: 'injectiespuit' },
            { term: 'mondmasker' },
            { term: 'bloeddrukmeter' },
          ],
        },
        {
          blockType: 'categoryGrid',
          heading: 'Productcategorieën',
          source: 'auto',
          showIcon: true,
          showProductCount: false,
          layout: 'grid-3',
          limit: 9,
        },
        {
          blockType: 'productGrid',
          heading: 'Alle producten',
          source: 'latest',
          limit: 12,
          layout: 'grid-4',
          displayMode: 'grid',
          showAddToCart: true,
          showBrand: true,
          showStockStatus: true,
          showComparePrice: true,
          showViewAllButton: false,
        },
        {
          blockType: 'cta',
          title: 'Niet gevonden wat u zocht?',
          text: 'Ons volledige assortiment telt meer dan 4.000 producten. Neem contact op en wij helpen u verder.',
          buttonText: 'Contact opnemen',
          buttonLink: '/contact',
          style: 'secondary',
        },
      ],
    },

    // ── OVER ONS ─────────────────────────────────────────────
    {
      title: 'Over Plastimed',
      slug: 'over-ons',
      _status: 'published',
      layout: [
        {
          blockType: 'hero',
          style: 'default',
          title: 'Over Plastimed',
          subtitle: 'Uw betrouwbare partner in medische disposables en instrumentarium sinds 1994.',
        },
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: {
                root: {
                  children: [
                    { children: [{ text: 'Plastimed is opgericht in 1994 en is sindsdien uitgegroeid tot één van de toonaangevende medische groothandels van Nederland. Wij leveren aan meer dan 5.000 zorginstellingen, van huisartsenpraktijken en fysiotherapiepraktijken tot ziekenhuizen, GGD-locaties en verpleeghuizen.' }], type: 'paragraph' },
                    { children: [{ text: 'Ons assortiment telt ruim 4.000 producten van A-merken zoals Hartmann, BSN Medical, 3M, BD en Littmann. We selecteren onze producten zorgvuldig op kwaliteit, veiligheid en prijs.' }], type: 'paragraph' },
                    { children: [{ text: 'Ons team', bold: true }], type: 'paragraph' },
                    { children: [{ text: 'Ons team van 25 medewerkers staat elke werkdag klaar om u te helpen. Of het nu gaat om productvragen, leveringsproblemen of een offerte op maat — wij reageren altijd binnen één werkdag.' }], type: 'paragraph' },
                  ],
                  direction: null, format: '', indent: 0, type: 'root', version: 1,
                },
              },
            },
          ],
        },
        {
          blockType: 'stats',
          heading: 'Plastimed in cijfers',
          stats: [
            { number: '1994', label: 'Opgericht' },
            { number: '4.000', suffix: '+', label: 'Producten' },
            { number: '5.000', suffix: '+', label: 'Klanten' },
            { number: '25', label: 'Medewerkers' },
          ],
          layout: 'grid-4',
        },
        {
          blockType: 'features',
          heading: 'Onze kernwaarden',
          source: 'manual',
          layout: 'grid-4',
          style: 'cards',
          showHoverEffect: true,
          features: [
            { iconType: 'lucide', iconName: 'ShieldCheck', name: 'Kwaliteit & Veiligheid', description: 'Alle producten zijn CE-gecertificeerd en MDR-compliant. We werken alleen met gecertificeerde leveranciers.' },
            { iconType: 'lucide', iconName: 'Clock', name: 'Snelle levering', description: 'Besteld voor 16:00, morgen in huis. We streven altijd naar de snelst mogelijke levering.' },
            { iconType: 'lucide', iconName: 'Users', name: 'Persoonlijke service', description: 'Een vast contactpersoon voor uw vragen. Wij kennen onze klanten bij naam.' },
            { iconType: 'lucide', iconName: 'TrendingDown', name: 'Scherpe prijzen', description: 'Volumekortingen voor vaste klanten. Transparante prijzen, geen verborgen kosten.' },
          ],
        },
        {
          blockType: 'features',
          heading: 'Onze merken & partners',
          source: 'manual',
          layout: 'grid-6',
          style: 'clean',
          showHoverEffect: false,
          features: [
            { iconType: 'lucide', iconName: 'Package', name: 'Hartmann', description: 'Verbandmiddelen & verbruiksmateriaal' },
            { iconType: 'lucide', iconName: 'Package', name: 'BSN Medical', description: 'Verbandmiddelen specialist' },
            { iconType: 'lucide', iconName: 'Package', name: '3M', description: 'Innovatieve medische producten' },
            { iconType: 'lucide', iconName: 'Package', name: 'BD', description: 'Injectiemateriaal & diagnostiek' },
            { iconType: 'lucide', iconName: 'Package', name: 'Littmann', description: 'Nummer 1 stethoscopen' },
            { iconType: 'lucide', iconName: 'Package', name: 'Welch Allyn', description: 'Diagnostische instrumenten' },
          ],
        },
        {
          blockType: 'cta',
          title: 'Wil je ook klant worden?',
          text: 'Registreer je vandaag en profiteer direct van onze B2B-prijzen en snelle levering.',
          buttonText: 'Klant worden',
          buttonLink: '/klant-worden',
          style: 'primary',
        },
      ],
    },

    // ── FAQ ──────────────────────────────────────────────────
    {
      title: 'Veelgestelde Vragen',
      slug: 'faq',
      _status: 'published',
      layout: [
        {
          blockType: 'hero',
          style: 'minimal',
          title: 'Veelgestelde Vragen',
          subtitle: 'Antwoorden op de meest gestelde vragen over bestellen, levering, retour en meer.',
        },
        {
          blockType: 'faq',
          heading: 'Verzending & Levering',
          source: 'collection',
          category: 'verzending',
          limit: 10,
          showFeaturedOnly: false,
          generateSchema: true,
        },
        {
          blockType: 'faq',
          heading: 'Bestellen & Betalen',
          source: 'collection',
          category: 'betaling',
          limit: 10,
          showFeaturedOnly: false,
          generateSchema: true,
        },
        {
          blockType: 'faq',
          heading: 'Klantenaccount',
          source: 'collection',
          category: 'account',
          limit: 10,
          showFeaturedOnly: false,
          generateSchema: true,
        },
        {
          blockType: 'faq',
          heading: 'Producten & Kwaliteit',
          source: 'collection',
          category: 'producten',
          limit: 10,
          showFeaturedOnly: false,
          generateSchema: true,
        },
        {
          blockType: 'faq',
          heading: 'Overige vragen',
          source: 'collection',
          category: 'algemeen',
          limit: 10,
          showFeaturedOnly: false,
          generateSchema: true,
        },
        {
          blockType: 'contactForm',
          heading: 'Vraag niet beantwoord?',
          intro: 'Stuur ons een bericht en wij reageren binnen één werkdag.',
        },
      ],
    },

    // ── CONTACT ──────────────────────────────────────────────
    {
      title: 'Contact',
      slug: 'contact',
      _status: 'published',
      layout: [
        {
          blockType: 'hero',
          style: 'minimal',
          title: 'Neem Contact Op',
          subtitle: 'We staan klaar om u te helpen. Bereikbaar op werkdagen van 08:00 tot 17:00.',
        },
        {
          blockType: 'features',
          source: 'manual',
          layout: 'grid-3',
          style: 'clean',
          showHoverEffect: false,
          features: [
            { iconType: 'lucide', iconName: 'Phone', name: 'Telefoon', description: '0251-247233\nMa–Vr 08:00–17:00' },
            { iconType: 'lucide', iconName: 'Mail', name: 'E-mail', description: 'info@plastimed.nl\nReactie binnen 1 werkdag' },
            { iconType: 'lucide', iconName: 'MapPin', name: 'Adres', description: 'Industrieweg 123\n1948 AA Beverwijk' },
          ],
        },
        {
          blockType: 'contactForm',
          heading: 'Stuur een bericht',
          intro: 'Vul het formulier in en we reageren binnen één werkdag.',
        },
      ],
    },

    // ── BLOG ARCHIEF ─────────────────────────────────────────
    {
      title: 'Blog — Nieuws & Tips',
      slug: 'blog',
      _status: 'published',
      layout: [
        {
          blockType: 'hero',
          style: 'minimal',
          title: 'Nieuws & Tips',
          subtitle: 'Productnieuws, regelgeving en praktische tips voor de zorgprofessional.',
        },
        {
          blockType: 'blog-preview',
          heading: 'Recente artikelen',
          limit: 9,
          layout: 'grid-3',
          showExcerpt: true,
          showDate: true,
          showAuthor: false,
        },
      ],
    },

    // ── KLANT WORDEN ─────────────────────────────────────────
    {
      title: 'Klant Worden',
      slug: 'klant-worden',
      _status: 'published',
      layout: [
        {
          blockType: 'hero',
          style: 'default',
          title: 'Word klant bij Plastimed',
          subtitle: 'Registreer uw bedrijf en profiteer van B2B-prijzen, snelle levering en persoonlijke service.',
        },
        {
          blockType: 'features',
          heading: 'Voordelen als klant',
          source: 'manual',
          layout: 'grid-4',
          style: 'cards',
          showHoverEffect: true,
          features: [
            { iconType: 'lucide', iconName: 'Tag', name: 'B2B-prijzen', description: 'Exclusieve prijzen voor zakelijke klanten, automatisch zichtbaar na aanmelding.' },
            { iconType: 'lucide', iconName: 'FileText', name: 'Factuur op rekening', description: 'Betaal gemakkelijk achteraf op factuur met 30 dagen betaaltermijn.' },
            { iconType: 'lucide', iconName: 'BarChart2', name: 'Besteloverzicht', description: 'Bekijk eenvoudig uw bestelgeschiedenis en herhaal eerdere bestellingen.' },
            { iconType: 'lucide', iconName: 'Headphones', name: 'Vaste contactpersoon', description: 'Direct contact met uw accountmanager voor vragen en offertes.' },
          ],
        },
        {
          blockType: 'contactForm',
          heading: 'Aanmeldformulier',
          intro: 'Vul uw bedrijfsgegevens in. Na verificatie (max. 1 werkdag) ontvangt u uw inloggegevens.',
        },
        {
          blockType: 'faq',
          heading: 'Vragen over klant worden?',
          source: 'collection',
          category: 'account',
          limit: 4,
          showFeaturedOnly: true,
          generateSchema: false,
        },
      ],
    },
  ]

  for (const page of pages) {
    try {
      const existing = await payload.find({ collection: 'pages', where: { slug: { equals: page.slug } } })
      if (existing.docs.length === 0) {
        await payload.create({ collection: 'pages', data: page as any })
        console.log(`  ✓ /${page.slug}`)
      } else {
        await payload.update({ collection: 'pages', id: existing.docs[0].id, data: page as any })
        console.log(`  ✓ /${page.slug} (bijgewerkt)`)
      }
    } catch (e: any) {
      console.log(`  ⚠️  /${page.slug}:`, e.message)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // DONE
  // ─────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(60))
  console.log('🎉 Plastimed seed volledig afgerond!\n')
  console.log('📍 Samenvatting:')
  console.log('   👤  1 admin gebruiker     admin@plastimed.nl / Admin123!')
  console.log('   🏢  1 client record       Plastimed B.V.')
  console.log('   ⚙️   4 globals             Settings, Theme, Header, Footer')
  console.log('   📁  9 categorieën')
  console.log('   🏷️   8 merken')
  console.log(`   🛍️  ${productData.length} producten`)
  console.log('   ⭐  5 testimonials')
  console.log('   ❓  8 FAQs')
  console.log('   📝  3 blogposts')
  console.log('   📄  7 pagina\'s             /, /shop, /over-ons, /faq, /contact, /blog, /klant-worden')
  console.log('\n🔗 Admin panel: http://localhost:3020/admin')
}

seed()
  .then(() => { console.log('\n✅ Klaar!\n'); process.exit(0) })
  .catch((error) => { console.error('\n❌ Fout:', error); process.exit(1) })
