#!/usr/bin/env node

/**
 * Test Railway API Connection
 *
 * This script verifies that the RAILWAY_API_KEY is valid and working.
 * It tests the Railway GraphQL API to ensure database provisioning will work.
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '.env') })

const RAILWAY_API_KEY = process.env.RAILWAY_API_KEY
const RAILWAY_GRAPHQL_URL = 'https://backboard.railway.app/graphql/v2'

console.log('\n🚂 Railway API Connection Test\n')
console.log('━'.repeat(60))

// Step 1: Check if API key is configured
console.log('\n1️⃣ Checking environment configuration...')
if (!RAILWAY_API_KEY) {
  console.error('❌ RAILWAY_API_KEY is not configured in .env')
  process.exit(1)
}
console.log(`✅ RAILWAY_API_KEY found (length: ${RAILWAY_API_KEY.length})`)
console.log(`   First 8 chars: ${RAILWAY_API_KEY.substring(0, 8)}...`)

// Step 2: Test authentication with 'me' query
console.log('\n2️⃣ Testing authentication with Railway API...')
try {
  const meQuery = `
    query {
      me {
        id
        email
        name
      }
    }
  `

  const meResponse = await fetch(RAILWAY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RAILWAY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: meQuery }),
  })

  const meData = await meResponse.json()

  if (meResponse.status !== 200) {
    console.error(`❌ Authentication failed (HTTP ${meResponse.status})`)
    console.error('Response:', JSON.stringify(meData, null, 2))
    process.exit(1)
  }

  if (meData.errors) {
    console.error('❌ GraphQL errors during authentication:')
    console.error(JSON.stringify(meData.errors, null, 2))
    process.exit(1)
  }

  if (!meData.data?.me) {
    console.error('❌ No user data returned - API key might be invalid')
    console.error('Response:', JSON.stringify(meData, null, 2))
    process.exit(1)
  }

  console.log('✅ Authentication successful!')
  console.log(`   User ID: ${meData.data.me.id}`)
  console.log(`   Email: ${meData.data.me.email}`)
  console.log(`   Name: ${meData.data.me.name || '(not set)'}`)

  // Step 3: List existing projects
  console.log('\n3️⃣ Fetching existing Railway projects...')
  const projectsQuery = `
    query {
      projects {
        edges {
          node {
            id
            name
            description
            createdAt
          }
        }
      }
    }
  `

  const projectsResponse = await fetch(RAILWAY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RAILWAY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: projectsQuery }),
  })

  const projectsData = await projectsResponse.json()

  if (projectsData.errors) {
    console.error('❌ GraphQL errors fetching projects:')
    console.error(JSON.stringify(projectsData.errors, null, 2))
    process.exit(1)
  }

  const projects = projectsData.data?.projects?.edges || []
  console.log(`✅ Found ${projects.length} existing Railway projects`)

  if (projects.length > 0) {
    console.log('\n   Recent projects:')
    projects.slice(0, 5).forEach(({ node }, i) => {
      console.log(`   ${i + 1}. ${node.name} (${node.id})`)
    })
  }

  // Step 4: Test database template query
  console.log('\n4️⃣ Checking available database templates...')
  const templatesQuery = `
    query {
      publicTemplates(input: {}) {
        edges {
          node {
            code
            name
            services {
              id
              name
              icon
            }
          }
        }
      }
    }
  `

  const templatesResponse = await fetch(RAILWAY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RAILWAY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: templatesQuery }),
  })

  const templatesData = await templatesResponse.json()

  if (templatesData.errors) {
    console.warn('⚠️ Could not fetch templates (not critical)')
  } else {
    const templates = templatesData.data?.publicTemplates?.edges || []
    const postgresTemplate = templates.find(
      ({ node }) => node.code === 'postgresql' || node.name?.toLowerCase().includes('postgres')
    )

    if (postgresTemplate) {
      console.log('✅ PostgreSQL template available')
      console.log(`   Template: ${postgresTemplate.node.name} (${postgresTemplate.node.code})`)
    } else {
      console.log('⚠️ PostgreSQL template not found in response (might still work)')
    }
  }

  console.log('\n━'.repeat(60))
  console.log('\n✅ Railway API Test PASSED!')
  console.log('\n   Summary:')
  console.log('   • Authentication: ✅ Working')
  console.log('   • Projects access: ✅ Working')
  console.log('   • API key is valid and has necessary permissions')
  console.log('\n   Next steps:')
  console.log('   • Railway API is working correctly')
  console.log('   • The error might be coming from a different source')
  console.log('   • Check ProvisioningService logs during actual provisioning')
  console.log('\n')

} catch (error) {
  console.error('\n❌ Unexpected error during Railway API test:')
  console.error(error)
  process.exit(1)
}
