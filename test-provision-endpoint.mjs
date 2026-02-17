/**
 * Test provision-site endpoint
 */

const uniqueId = Date.now().toString().slice(-6)

const testData = {
  wizardData: {
    companyInfo: {
      name: `Test Company ${uniqueId}`,
      industry: 'technology',
      businessType: 'B2B',
      contactInfo: {
        email: 'test@example.com'
      }
    },
    content: {
      pages: ['home'],
      language: 'nl'
    },
    design: {
      style: 'modern',
      colorScheme: {
        primary: '#3B82F6'
      }
    },
    features: {}
  },
  sseConnectionId: 'test-' + Date.now()
}

console.log('🧪 Testing provision-site endpoint...')
console.log('SSE Connection ID:', testData.sseConnectionId)

try {
  const response = await fetch('http://localhost:3020/api/wizard/provision-site', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData),
  })

  console.log('Status:', response.status, response.statusText)

  const data = await response.json()
  console.log('Response:', JSON.stringify(data, null, 2))
} catch (error) {
  console.error('❌ Error:', error.message)
}
