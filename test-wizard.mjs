import fetch from 'node-fetch'
import { EventSource } from 'eventsource'

const BASE_URL = 'http://localhost:3020'

// Test wizard data
const testWizardData = {
  currentStep: 1,
  companyInfo: {
    name: 'Test Bedrijf BV',
    businessType: 'B2B',
    industry: 'Technology',
    targetAudience: 'Kleine tot middelgrote bedrijven die digitale transformatie zoeken',
    coreValues: ['Innovatie', 'Betrouwbaarheid', 'Kwaliteit'],
    usps: ['24/7 Support', 'Bewezen Track Record', 'Maatwerk Oplossingen'],
    services: [
      {
        name: 'Web Development',
        description: 'Custom website en web applicatie ontwikkeling',
        price: 5000,
      },
      {
        name: 'SEO Optimalisatie',
        description: 'Complete SEO strategie en implementatie',
        price: 2500,
      },
    ],
    testimonials: [],
    portfolioCases: [],
    pricingPackages: [],
  },
  design: {
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
    },
    style: 'modern',
    fontPreference: 'sans-serif',
  },
  content: {
    language: 'nl',
    tone: 'professional',
    pages: ['home', 'about', 'services', 'contact'],
  },
  features: {
    contactForm: true,
    newsletter: false,
    testimonials: false,
    faq: false,
    socialMedia: true,
    maps: false,
    cta: true,
    ecommerce: false,
  },
}

async function testWizard() {
  console.log('🧪 Starting Site Generator Test...\n')

  // Generate unique connection ID
  const connectionId = `test-${Date.now()}-${Math.random().toString(36).substring(7)}`
  console.log(`📡 Connection ID: ${connectionId}\n`)

  // Setup SSE listener
  console.log('🎧 Setting up SSE listener...')
  const eventSource = new EventSource(`${BASE_URL}/api/ai/stream/${connectionId}`)

  let progressUpdates = []

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      progressUpdates.push(data)

      if (data.type === 'connected') {
        console.log('✅ SSE Connected\n')
      } else if (data.type === 'progress') {
        console.log(`⏳ Progress: ${data.progress}% - ${data.message}`)
      } else if (data.type === 'complete') {
        console.log('\n✅ Generation Complete!')
        console.log(`Preview URL: ${BASE_URL}${data.data.previewUrl}`)
        console.log(`Pages created: ${data.data.pages.length}`)
        data.data.pages.forEach((page) => {
          console.log(`  - ${page.title} (/${page.slug})`)
        })
        eventSource.close()
      } else if (data.type === 'error') {
        console.error('\n❌ Error:', data.error)
        eventSource.close()
      }
    } catch (err) {
      // Ignore heartbeat messages
      if (!event.data.startsWith(':')) {
        console.error('Parse error:', err)
      }
    }
  }

  eventSource.onerror = (err) => {
    console.error('❌ SSE Connection Error:', err)
    eventSource.close()
  }

  // Wait for SSE to connect
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Start generation
  console.log('🚀 Starting site generation...\n')
  try {
    const response = await fetch(`${BASE_URL}/api/wizard/generate-site`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wizardData: testWizardData,
        sseConnectionId: connectionId,
      }),
    })

    const result = await response.json()

    if (!result.success) {
      console.error('❌ API Error:', result.message)
      process.exit(1)
    }

    console.log(`✅ Job started: ${result.jobId}\n`)

    // Wait for completion (max 5 minutes)
    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (eventSource.readyState === EventSource.CLOSED) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 500)

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkInterval)
        eventSource.close()
        resolve()
      }, 300000)
    })

    console.log('\n📊 Test Summary:')
    console.log(`Total progress updates: ${progressUpdates.length}`)
    console.log(`Final status: ${progressUpdates[progressUpdates.length - 1]?.type || 'unknown'}`)
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

// Run test
testWizard().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
