/**
 * Create First Client - Via REST API
 * This approach avoids dependency issues by using HTTP requests
 */

const CLIENT_DATA = {
  name: 'Test Client 1',
  domain: 'testclient1',  // Will become: testclient1.compassdigital.nl
  contactEmail: 'test@example.com',
  contactName: 'Test Contact',
  template: 'corporate',
  plan: 'starter',
  billingStatus: 'trial',
  deploymentProvider: 'ploi',
}

async function createClientViaAPI() {
  console.log('🚀 CREATING FIRST CLIENT VIA API\n')
  console.log('═'.repeat(60))
  console.log('')

  const baseUrl = 'http://localhost:3020'

  try {
    // Step 1: Check if server is running
    console.log('1️⃣  Checking if server is running...')
    const healthResponse = await fetch(`${baseUrl}/api/health`)
    if (!healthResponse.ok) {
      throw new Error('Server is not running or not healthy')
    }
    console.log('   ✅ Server is healthy\n')

    // Step 2: Login as platform admin
    console.log('2️⃣  Logging in as platform admin...')
    const loginResponse = await fetch(`${baseUrl}/api/platform-admins/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.PLATFORM_ADMIN_EMAIL || 'admin@platform.com',
        password: process.env.PLATFORM_ADMIN_PASSWORD || 'demo',
      }),
    })

    if (!loginResponse.ok) {
      const error = await loginResponse.text()
      throw new Error(`Login failed: ${error}`)
    }

    const { token } = await loginResponse.json()
    console.log('   ✅ Logged in successfully\n')

    // Step 3: Check if client already exists
    console.log('3️⃣  Checking for existing client...')
    const searchResponse = await fetch(
      `${baseUrl}/api/clients?where[domain][equals]=${CLIENT_DATA.domain}`,
      {
        headers: { Authorization: `JWT ${token}` },
      },
    )

    const { docs: existing } = await searchResponse.json()

    if (existing && existing.length > 0) {
      const client = existing[0]
      console.log(`   ℹ️  Client already exists: ${client.name} (${client.id})`)
      console.log(`   📍 Domain: ${client.domain}.compassdigital.nl`)
      console.log(`   🔧 Status: ${client.status}\n`)
      return client
    }

    // Step 4: Create new client
    console.log('4️⃣  Creating new client...')
    const createResponse = await fetch(`${baseUrl}/api/clients`, {
      method: 'POST',
      headers: {
        Authorization: `JWT ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(CLIENT_DATA),
    })

    if (!createResponse.ok) {
      const error = await createResponse.text()
      throw new Error(`Failed to create client: ${error}`)
    }

    const client = await createResponse.json()
    console.log('   ✅ Client created!')
    console.log(`   📝 ID: ${client.id}`)
    console.log(`   👤 Name: ${client.name}`)
    console.log(`   🌍 Domain: ${client.domain}.compassdigital.nl\n`)

    // Step 5: Show next steps
    console.log('5️⃣  NEXT STEPS:\n')
    console.log('   Option A: Deploy via Platform UI')
    console.log('   ─────────────────────────────────')
    console.log('   1. Open: http://localhost:3020/platform/clients')
    console.log(`   2. Click on: ${client.name}`)
    console.log('   3. Click: "Launch Site" button')
    console.log('   4. Watch real-time progress!\n')

    console.log('   Option B: Deploy via API (Advanced)')
    console.log('   ────────────────────────────────────────')
    console.log('   Run this command:\n')
    console.log(`   curl -X POST http://localhost:3020/api/wizard/provision-site \\\\`)
    console.log(`     -H "Content-Type: application/json" \\\\`)
    console.log(`     -d '{`)
    console.log(`       "clientId": "${client.id}",`)
    console.log(`       "deploymentProvider": "ploi",`)
    console.log(`       "sseConnectionId": "deploy-${Date.now()}",`)
    console.log(`       "wizardData": {`)
    console.log(`         "siteName": "${client.name}",`)
    console.log(`         "industry": "general"`)
    console.log(`       }`)
    console.log(`     }'`)
    console.log('')

    console.log('═'.repeat(60))
    console.log('\n✅ Ready to deploy!\n')
    console.log('📋 Client Details:')
    console.log(`   ID: ${client.id}`)
    console.log(`   Name: ${client.name}`)
    console.log(`   Domain: ${client.domain}.compassdigital.nl`)
    console.log(`   Provider: ${client.deploymentProvider || 'ploi'}`)
    console.log(`   Status: ${client.status}`)
    console.log('')

    return client
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    if (error.message.includes('Server is not running')) {
      console.error('\n💡 Please start the dev server first:')
      console.error('   PORT=3020 npm run dev')
    }
    process.exit(1)
  }
}

// Run
createClientViaAPI()
