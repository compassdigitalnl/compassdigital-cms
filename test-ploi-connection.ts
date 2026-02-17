/**
 * Test Ploi Connection
 * Quick test to verify Ploi API is working
 */

import dotenv from 'dotenv'
dotenv.config()

async function testPloiConnection() {
  console.log('🔌 Testing Ploi Connection...\n')

  try {
    // Import PloiService
    const { PloiService } = await import('./src/lib/ploi/PloiService')

    // Create service
    const ploi = new PloiService({
      apiToken: process.env.PLOI_API_TOKEN!,
    })

    // Test 1: List servers
    console.log('1️⃣ Fetching servers...')
    const serversResponse = await ploi.listServers()
    const servers = serversResponse.data

    if (servers.length === 0) {
      console.log('   ⚠️  No servers found in Ploi account')
      return
    }

    console.log(`   ✅ Found ${servers.length} server(s)`)
    servers.forEach((server: any) => {
      console.log(`      - ${server.name} (${server.ip_address}) [${server.status}]`)
    })

    // Test 2: Get specific server
    const serverId = parseInt(process.env.PLOI_SERVER_ID || '0')
    if (serverId) {
      console.log(`\n2️⃣ Fetching server ${serverId}...`)
      const serverResponse = await ploi.getServer(serverId)
      const server = serverResponse.data
      console.log(`   ✅ Server: ${server.name}`)
      console.log(`   📍 IP: ${server.ip_address}`)
      console.log(`   🟢 Status: ${server.status}`)

      // Test 3: List sites on server
      console.log(`\n3️⃣ Fetching sites on server...`)
      const sitesResponse = await ploi.listSites(serverId)
      const sites = sitesResponse.data
      console.log(`   ✅ Found ${sites.length} site(s)`)
      sites.slice(0, 5).forEach((site: any) => {
        console.log(`      - ${site.domain} [${site.status}]`)
      })
    }

    console.log('\n✅ All tests passed!')
    console.log('🚀 Ploi is ready for client deployments!\n')

  } catch (error: any) {
    console.error('❌ Ploi connection failed:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Check PLOI_API_TOKEN in .env')
    console.error('2. Check PLOI_SERVER_ID in .env')
    console.error('3. Verify server is connected in Ploi dashboard')
    process.exit(1)
  }
}

testPloiConnection()
