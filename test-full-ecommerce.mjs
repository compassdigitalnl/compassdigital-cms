import fetch from 'node-fetch'
import { EventSource } from 'eventsource'

const BASE_URL = 'http://localhost:3016'

// COMPLETE E-COMMERCE WIZARD DATA with ALL features
const fullEcommerceData = {
  currentStep: 1,
  companyInfo: {
    name: 'TechStore Premium',
    businessType: 'E-commerce',
    industry: 'Technology & Electronics',
    targetAudience: 'Tech-savvy consumenten en professionals die hoogwaardige elektronica zoeken met uitstekende service',
    coreValues: ['Innovatie', 'Kwaliteit', 'Klanttevredenheid', 'Duurzaamheid', 'Expertise'],
    usps: [
      '30 dagen niet-goed-geld-terug garantie',
      'Gratis verzending vanaf €50',
      '24/7 Nederlandse klantenservice',
      'Laagste prijsgarantie',
      'Premium merken met officiële garantie'
    ],
    services: [
      {
        name: 'Personal Shopping Service',
        description: 'Onze experts helpen je bij het kiezen van de perfecte technologie voor jouw behoeften',
        price: 0,
      },
      {
        name: 'Installatie & Setup Service',
        description: 'Professionele installatie en configuratie van al je nieuwe apparaten bij je thuis',
        price: 79,
      },
      {
        name: 'Extended Warranty',
        description: '3 jaar extra garantie op al je aankopen met premium support',
        price: 149,
      },
      {
        name: 'Trade-In Program',
        description: 'Ruil je oude apparaat in en ontvang korting op je nieuwe aankoop',
        price: 0,
      },
    ],
    testimonials: [
      {
        author: 'Jan Pieters',
        role: 'Zakelijke klant',
        rating: 5,
        text: 'Uitstekende service! Binnen 24 uur geleverd en perfect verpakt. De klantenservice dacht actief mee met mijn specifieke wensen.',
      },
      {
        author: 'Sophie van Dam',
        role: 'Particuliere klant',
        text: 'Beste prijzen gevonden voor mijn nieuwe laptop. De personal shopping service was zeer behulpzaam bij het maken van mijn keuze.',
        rating: 5,
      },
      {
        author: 'Mike de Jong',
        role: 'Gaming enthusiast',
        text: 'Gaming setup compleet samengesteld door hun experts. Alles werkt perfect en de installatie service was top!',
        rating: 5,
      },
    ],
    portfolioCases: [
      {
        title: 'Complete Office Setup - StartupHub Amsterdam',
        description: 'Volledige kantoorinrichting met 50+ werkstations, netwerk infrastructuur en AV-oplossingen voor moderne startup.',
        client: 'StartupHub Amsterdam',
        year: '2025',
        results: '100% uptime, 30% kostenbespa ring t.o.v. alternatieven',
      },
      {
        title: 'Smart Home Transformatie - Villa Wassenaar',
        description: 'Luxe woning volledig uitgerust met slimme technologie: verlichting, beveiliging, entertainment en klimaatbeheersing.',
        client: 'Particuliere klant',
        year: '2025',
        results: '40% energie besparing, volledige app-controle',
      },
      {
        title: 'Gaming Center Rotterdam',
        description: '20 high-end gaming stations met professionele streaming setup en tournament-ready infrastructuur.',
        client: 'GameZone Rotterdam',
        year: '2024',
        results: '500+ bezoekers per week, 5-sterren reviews',
      },
    ],
    pricingPackages: [
      {
        name: 'Starter Pack',
        price: 49,
        interval: 'maand',
        features: [
          'Toegang tot exclusive deals',
          '5% korting op alle producten',
          'Gratis basisverzending',
          'Email support binnen 24u',
        ],
        highlighted: false,
      },
      {
        name: 'Premium Member',
        price: 99,
        interval: 'maand',
        features: [
          'Alles van Starter Pack',
          '10% korting op alle producten',
          'Gratis express verzending',
          'Priority support 24/7',
          'Early access nieuwe producten',
          'Persoonlijke account manager',
        ],
        highlighted: true,
      },
      {
        name: 'Business Pro',
        price: 299,
        interval: 'maand',
        features: [
          'Alles van Premium Member',
          '15% korting + bulk discounts',
          'Dedicated support team',
          'Maandelijkse consultatie (2u)',
          'Factuur betaling 30 dagen',
          'Custom configuraties',
          'Lifetime warranty op selectie',
        ],
        highlighted: false,
      },
    ],
    contactInfo: {
      email: 'info@techstore-premium.nl',
      phone: '+31 20 123 4567',
      address: {
        street: 'Technologielaan 123',
        city: 'Amsterdam',
        postalCode: '1000 AB',
        country: 'Nederland',
      },
      formConfig: {
        notificationEmail: 'contact@techstore-premium.nl',
        autoReply: true,
      },
    },
  },
  design: {
    colorScheme: {
      primary: '#2563eb', // Modern blue
      secondary: '#1e293b', // Dark slate
      accent: '#f59e0b', // Vibrant orange
    },
    style: 'modern',
    fontPreference: 'sans-serif',
  },
  content: {
    language: 'nl',
    tone: 'professional',
    pages: ['home', 'about', 'services', 'portfolio', 'testimonials', 'pricing', 'blog', 'contact'],
  },
  features: {
    contactForm: true,
    newsletter: true,
    testimonials: true,
    faq: true,
    socialMedia: true,
    maps: true,
    cta: true,
    ecommerce: true,
  },
  ecommerce: {
    shopType: 'physical',
    currency: 'EUR',
    shippingZones: ['NL', 'BE', 'DE', 'EU'],
    paymentMethods: ['ideal', 'creditcard', 'paypal', 'banktransfer'],
    taxRate: 21,
  },
}

async function generateFullEcommerce() {
  console.log('🚀 Starting COMPLETE E-COMMERCE Site Generation...\n')
  console.log('📦 Configuration:')
  console.log(`   Company: ${fullEcommerceData.companyInfo.name}`)
  console.log(`   Type: ${fullEcommerceData.companyInfo.businessType}`)
  console.log(`   Pages: ${fullEcommerceData.content.pages.length} pages`)
  console.log(`   Services: ${fullEcommerceData.companyInfo.services.length}`)
  console.log(`   Testimonials: ${fullEcommerceData.companyInfo.testimonials.length}`)
  console.log(`   Portfolio Cases: ${fullEcommerceData.companyInfo.portfolioCases.length}`)
  console.log(`   Pricing Tiers: ${fullEcommerceData.companyInfo.pricingPackages.length}`)
  console.log(`   E-commerce: ✅ Enabled`)
  console.log(`   Shop Type: ${fullEcommerceData.ecommerce.shopType}`)
  console.log(`   Currency: ${fullEcommerceData.ecommerce.currency}\n`)

  const connectionId = `ecommerce-${Date.now()}-${Math.random().toString(36).substring(7)}`
  console.log(`📡 Connection ID: ${connectionId}\n`)

  console.log('🎧 Setting up SSE listener...')
  const eventSource = new EventSource(`${BASE_URL}/api/ai/stream/${connectionId}`)

  let progressUpdates = []
  let startTime = Date.now()

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      progressUpdates.push(data)

      if (data.type === 'connected') {
        console.log('✅ SSE Connected\n')
      } else if (data.type === 'progress') {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
        console.log(`⏳ [${elapsed}s] Progress: ${data.progress}% - ${data.message}`)
      } else if (data.type === 'complete') {
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1)
        console.log(`\n🎉 ===== GENERATION COMPLETE in ${totalTime}s! =====`)
        console.log(`\n📄 Preview URL: ${BASE_URL}${data.data.previewUrl}`)
        console.log(`\n📝 Pages created (${data.data.pages.length}):`)
        data.data.pages.forEach((page, idx) => {
          console.log(`   ${idx + 1}. ${page.title} - ${BASE_URL}/${page.slug}`)
        })
        console.log('\n🎯 Next Steps:')
        console.log(`   1. Visit: ${BASE_URL}${data.data.previewUrl}`)
        console.log(`   2. Admin: ${BASE_URL}/admin/collections/pages`)
        console.log(`   3. Edit pages and customize content in CMS\n`)
        eventSource.close()
      } else if (data.type === 'error') {
        console.error('\n❌ Generation Error:', data.error)
        eventSource.close()
      }
    } catch (err) {
      if (!event.data.startsWith(':')) {
        console.error('Parse error:', err)
      }
    }
  }

  eventSource.onerror = (err) => {
    console.error('❌ SSE Connection Error:', err)
    eventSource.close()
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log('🚀 Starting generation API call...\n')
  try {
    const response = await fetch(`${BASE_URL}/api/wizard/generate-site`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wizardData: fullEcommerceData,
        sseConnectionId: connectionId,
      }),
    })

    const result = await response.json()

    if (!result.success) {
      console.error('❌ API Error:', result.message)
      process.exit(1)
    }

    console.log(`✅ Job started: ${result.jobId}`)
    console.log('⏳ Generating pages (this may take 30-60 seconds)...\n')

    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (eventSource.readyState === EventSource.CLOSED) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 500)

      setTimeout(() => {
        clearInterval(checkInterval)
        eventSource.close()
        resolve()
      }, 300000)
    })

    console.log('\n📊 Generation Summary:')
    console.log(`   Total updates: ${progressUpdates.length}`)
    console.log(`   Final status: ${progressUpdates[progressUpdates.length - 1]?.type || 'unknown'}`)
    console.log(`   Duration: ${((Date.now() - startTime) / 1000).toFixed(1)}s\n`)
  } catch (error) {
    console.error('❌ Fatal Error:', error.message)
    process.exit(1)
  }
}

generateFullEcommerce().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
