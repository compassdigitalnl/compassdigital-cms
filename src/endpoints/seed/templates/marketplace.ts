import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'

export async function seedMarketplace(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // ── Vendors ─────────────────────────────────────────────────────────────
  const vendorData = [
    {
      name: 'MedSupply International',
      shortName: 'MSI',
      tagline: 'Toonaangevend in medische disposables en wondverzorging',
      isPremium: true,
      isFeatured: true,
      isVerified: true,
      bannerColor: '#0A1628',
      filterTags: ['premium', 'ce-certified', 'direct-delivery'],
      contact: {
        website: 'https://example.com',
        email: 'info@example.com',
        phone: '+31 20 123 4567',
        country: 'Nederland',
        address: 'Keizersgracht 100\n1015 AA Amsterdam',
      },
      delivery: { deliveryTime: '1-2 werkdagen', freeShippingFrom: 50 },
      partnerSince: 2018,
      employeeCount: '200-500',
      stats: { productCount: 450, rating: 4.8, reviewCount: 67, stockAvailability: 96, establishedYear: 1995 },
      certifications: [
        { name: 'ISO 13485', icon: 'shield-check' },
        { name: 'CE Gecertificeerd', icon: 'shield-check' },
        { name: 'FSC Gecertificeerd', icon: 'leaf' },
      ],
      specialisms: [{ name: 'Wondverzorging' }, { name: 'Diagnostiek' }, { name: 'Disposables' }],
      meta: { title: 'MedSupply International — Leverancier', description: 'Premium leverancier van medische disposables en wondverzorging' },
    },
    {
      name: 'EuroHygiene Solutions',
      shortName: 'EHS',
      tagline: 'Specialist in hygiëne- en desinfectieproducten',
      isPremium: true,
      isFeatured: true,
      isVerified: true,
      bannerColor: '#1a365d',
      filterTags: ['premium', 'sustainable', 'has-workshops'],
      contact: {
        website: 'https://example.com',
        email: 'info@example.com',
        phone: '+49 30 456 7890',
        country: 'Duitsland',
        address: 'Friedrichstraße 50\n10117 Berlin',
      },
      delivery: { deliveryTime: '2-3 werkdagen', freeShippingFrom: 75 },
      partnerSince: 2020,
      employeeCount: '100-200',
      stats: { productCount: 280, rating: 4.6, reviewCount: 42, stockAvailability: 92, establishedYear: 2005 },
      certifications: [
        { name: 'ISO 9001', icon: 'shield-check' },
        { name: 'OEKO-TEX', icon: 'leaf' },
      ],
      specialisms: [{ name: 'Handhygiëne' }, { name: 'Desinfectie' }, { name: 'Duurzame producten' }],
      meta: { title: 'EuroHygiene Solutions — Leverancier', description: 'Specialist in hygiëne- en desinfectieproducten' },
    },
    {
      name: 'ProCare Instruments',
      shortName: 'PCI',
      tagline: 'Innovatieve diagnostiek en instrumenten voor de zorg',
      isPremium: true,
      isFeatured: true,
      isVerified: true,
      bannerColor: '#2d3748',
      filterTags: ['premium', 'ce-certified'],
      contact: {
        website: 'https://example.com',
        email: 'info@example.com',
        phone: '+31 88 765 4321',
        country: 'Nederland',
        address: 'Science Park 200\n1098 XG Amsterdam',
      },
      delivery: { deliveryTime: '1-3 werkdagen', freeShippingFrom: 100 },
      partnerSince: 2019,
      employeeCount: '50-100',
      stats: { productCount: 180, rating: 4.9, reviewCount: 31, stockAvailability: 88, establishedYear: 2010 },
      certifications: [
        { name: 'CE Gecertificeerd', icon: 'shield-check' },
        { name: 'EU MDR Compliant', icon: 'award' },
      ],
      specialisms: [{ name: 'Diagnostiek' }, { name: 'Instrumenten' }],
      meta: { title: 'ProCare Instruments — Leverancier', description: 'Innovatieve diagnostiek en instrumenten' },
    },
    {
      name: 'SafeGuard Textiles',
      shortName: 'SGT',
      tagline: 'Kwaliteitstextiel voor de zorgsector',
      isPremium: false,
      isFeatured: false,
      isVerified: true,
      filterTags: ['sustainable', 'direct-delivery'],
      contact: {
        email: 'info@example.com',
        country: 'België',
      },
      delivery: { deliveryTime: '3-5 werkdagen' },
      stats: { productCount: 120, rating: 4.3, reviewCount: 18, stockAvailability: 85, establishedYear: 2012 },
      certifications: [{ name: 'OEKO-TEX Standard 100', icon: 'leaf' }],
      specialisms: [{ name: 'Textiel' }, { name: 'Beschermende kleding' }],
    },
    {
      name: 'NordicMed Supplies',
      shortName: 'NMS',
      tagline: 'Scandinavische kwaliteit in medische hulpmiddelen',
      isPremium: false,
      isFeatured: false,
      isVerified: true,
      filterTags: ['ce-certified'],
      contact: {
        email: 'info@example.com',
        country: 'Zweden',
      },
      delivery: { deliveryTime: '3-5 werkdagen', freeShippingFrom: 150 },
      stats: { productCount: 95, rating: 4.5, reviewCount: 12, stockAvailability: 78, establishedYear: 2008 },
      certifications: [{ name: 'CE Gecertificeerd', icon: 'shield-check' }],
      specialisms: [{ name: 'Revalidatie' }, { name: 'Thuiszorg' }],
    },
    {
      name: 'GreenCare Products',
      shortName: 'GCP',
      tagline: 'Duurzame alternatieven voor de zorgsector',
      isPremium: false,
      isFeatured: false,
      isVerified: false,
      filterTags: ['sustainable', 'has-workshops'],
      contact: {
        email: 'info@example.com',
        country: 'Nederland',
      },
      delivery: { deliveryTime: '2-4 werkdagen' },
      stats: { productCount: 65, rating: 4.2, reviewCount: 8, stockAvailability: 90, establishedYear: 2019 },
      specialisms: [{ name: 'Duurzaam' }, { name: 'Biologisch afbreekbaar' }],
    },
  ]

  const vendorIds: number[] = []
  for (const data of vendorData) {
    try {
      const vendor = await payload.create({ collection: 'vendors', data: data as any })
      vendorIds.push(vendor.id)
    } catch (e: any) {
      payload.logger.warn(`      ⚠ Vendor "${data.name}": ${e.message}`)
    }
  }
  result.collections.vendors = vendorIds.length
  payload.logger.info(`      ✅ ${vendorIds.length} vendors`)

  // ── Vendor Reviews ──────────────────────────────────────────────────────
  const reviewTemplates = [
    { rating: 5, title: 'Uitstekende service', comment: 'Zeer snelle levering en uitstekende kwaliteit producten. Onze vaste leverancier.' },
    { rating: 4, title: 'Goede kwaliteit', comment: 'Betrouwbare leverancier met breed assortiment. Levertijd is soms iets langer dan verwacht.' },
    { rating: 5, title: 'Topkwaliteit producten', comment: 'De producten voldoen aan alle kwaliteitseisen. Goede communicatie bij vragen.' },
    { rating: 4, title: 'Betrouwbaar en professioneel', comment: 'Al jaren een betrouwbare partner. De klantenservice reageert snel op vragen.' },
    { rating: 5, title: 'Aanrader', comment: 'Breed assortiment, scherpe prijzen en snelle levering. Zeer tevreden!' },
    { rating: 3, title: 'Redelijk goed', comment: 'Producten zijn goed maar de webshop zou gebruiksvriendelijker kunnen.' },
    { rating: 5, title: 'Perfecte samenwerking', comment: 'Vanaf dag één een soepele samenwerking. Altijd op voorraad en snelle levering.' },
    { rating: 4, title: 'Goede prijs-kwaliteit', comment: 'Voor de prijs krijg je uitstekende kwaliteit. Zeker aan te bevelen.' },
    { rating: 5, title: 'Beste leverancier', comment: 'Na het uitproberen van meerdere leveranciers zijn we hier gebleven. Consistent hoge kwaliteit.' },
    { rating: 4, title: 'Professionele service', comment: 'Goede producten en de workshops zijn zeer informatief. Prima leverancier.' },
    { rating: 3, title: 'Kan beter', comment: 'Producten zijn prima maar de communicatie over levertijden mag beter.' },
    { rating: 5, title: 'Innovatief assortiment', comment: 'Ze bieden echt innovatieve producten die je niet bij andere leveranciers vindt.' },
  ]

  const authorNames = [
    'Jan de Vries', 'Maria Bakker', 'Peter Jansen', 'Anne Visser',
    'Tom van Dijk', 'Lisa Mulder', 'Koen Smit', 'Sophie de Boer',
    'Mark Hendriks', 'Eva Dekker', 'Bas Meijer', 'Noor Peters',
  ]

  let reviewCount = 0
  for (let i = 0; i < reviewTemplates.length; i++) {
    const vendorId = vendorIds[i % vendorIds.length]
    if (!vendorId) continue

    try {
      await payload.create({
        collection: 'vendor-reviews',
        data: {
          vendor: vendorId,
          title: reviewTemplates[i].title,
          rating: reviewTemplates[i].rating,
          comment: reviewTemplates[i].comment,
          authorName: authorNames[i],
          isApproved: true,
        },
      })
      reviewCount++
    } catch (e: any) {
      payload.logger.warn(`      ⚠ Review ${i}: ${e.message}`)
    }
  }
  result.collections['vendor-reviews'] = reviewCount
  payload.logger.info(`      ✅ ${reviewCount} vendor reviews`)

  // ── Workshops ───────────────────────────────────────────────────────────
  const workshopData = [
    {
      title: 'Basis Hygiëneprotocollen Workshop',
      excerpt: 'Leer de fundamenten van hygiëneprotocollen in de zorgsector.',
      emoji: '🧴',
      vendor: vendorIds[1], // EuroHygiene
      instructor: 'Dr. H. van der Berg',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 120,
      durationDisplay: '2 uur',
      locationType: 'physical' as const,
      locationCity: 'Amsterdam',
      maxParticipants: 25,
      currentParticipants: 12,
      isFree: false,
      price: 149,
      priceDisplay: '€149 ex BTW',
      level: 'beginner' as const,
      targetAudience: [{ name: 'Verpleegkundigen' }, { name: 'Zorgmedewerkers' }],
      status: 'open' as const,
      isFeatured: true,
      certificateAwarded: true,
      learningObjectives: [
        { objective: 'Hygiëneprotocollen correct toepassen' },
        { objective: 'Desinfectiemiddelen juist selecteren' },
      ],
    },
    {
      title: 'Geavanceerde Wondverzorging Masterclass',
      excerpt: 'Verdieping in complexe wondverzorgingstechnieken.',
      emoji: '🩹',
      vendor: vendorIds[0], // MedSupply
      instructor: 'Prof. K. Smeets',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 240,
      durationDisplay: '4 uur',
      locationType: 'hybrid' as const,
      locationCity: 'Utrecht',
      maxParticipants: 30,
      currentParticipants: 8,
      isFree: false,
      price: 249,
      priceDisplay: '€249 ex BTW',
      level: 'advanced' as const,
      targetAudience: [{ name: 'Verpleegkundigen' }, { name: 'Artsen' }],
      status: 'open' as const,
      certificateAwarded: true,
      learningObjectives: [
        { objective: 'Complexe wonden beoordelen' },
        { objective: 'Moderne verbandmaterialen toepassen' },
        { objective: 'Wondgenezingsprocessen optimaliseren' },
      ],
    },
    {
      title: 'Duurzaam Inkopen in de Zorg Webinar',
      excerpt: 'Online sessie over duurzame inkoopstrategieën.',
      emoji: '🌱',
      vendor: vendorIds[5], // GreenCare
      instructor: 'M. de Groot',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 60,
      durationDisplay: '1 uur',
      locationType: 'online' as const,
      locationCity: 'Online',
      maxParticipants: 100,
      currentParticipants: 45,
      isFree: true,
      level: 'beginner' as const,
      targetAudience: [{ name: 'Management' }, { name: 'Inkopers' }],
      status: 'open' as const,
      certificateAwarded: false,
      learningObjectives: [
        { objective: 'Duurzame alternatieven identificeren' },
        { objective: 'Kosten-baten van duurzaam inkopen begrijpen' },
      ],
    },
  ]

  let workshopCount = 0
  for (const data of workshopData) {
    if (!data.vendor) continue
    try {
      await payload.create({ collection: 'workshops', data: data as any })
      workshopCount++
    } catch (e: any) {
      payload.logger.warn(`      ⚠ Workshop "${data.title}": ${e.message}`)
    }
  }
  result.collections.workshops = workshopCount
  payload.logger.info(`      ✅ ${workshopCount} workshops`)

  // ── Vendor Applications ─────────────────────────────────────────────────
  const applicationData = [
    {
      companyName: 'BioTech Supplies BV',
      contactPerson: 'R. van den Hoek',
      email: 'info@example-biotech.com',
      phone: '+31 20 555 1234',
      website: 'https://example.com',
      description: 'Wij zijn gespecialiseerd in biologisch afbreekbare medische verbruiksartikelen. Ons assortiment omvat disposable handschoenen, schorten en mondkapjes van duurzame materialen.',
      estimatedProducts: '51-200' as const,
      status: 'pending' as const,
    },
    {
      companyName: 'MediVision Instruments',
      contactPerson: 'A. Bakker',
      email: 'info@example-medivision.com',
      description: 'Producent van optische instrumenten voor de medische sector. Wij leveren loepen, microscopen en vergrootglazen voor diverse medische toepassingen.',
      estimatedProducts: '1-50' as const,
      status: 'pending' as const,
    },
  ]

  let applicationCount = 0
  for (const data of applicationData) {
    try {
      await payload.create({ collection: 'vendor-applications' as any, data: data as any })
      applicationCount++
    } catch (e: any) {
      payload.logger.warn(`      ⚠ Application "${data.companyName}": ${e.message}`)
    }
  }
  result.collections['vendor-applications'] = applicationCount
  payload.logger.info(`      ✅ ${applicationCount} vendor applications`)

  return result
}
