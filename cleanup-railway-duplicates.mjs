#!/usr/bin/env node

/**
 * Railway Duplicate Projects Cleanup
 *
 * Removes duplicate "client-plastimed01" projects from Railway
 * Keeps only the NEWEST one (most recent)
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createInterface } from 'readline'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '.env') })

const RAILWAY_API_KEY = process.env.RAILWAY_API_KEY
const RAILWAY_GRAPHQL_URL = 'https://backboard.railway.app/graphql/v2'

console.log('\n🧹 Railway Duplicate Projects Cleanup\n')
console.log('━'.repeat(60))

if (!RAILWAY_API_KEY) {
  console.error('❌ RAILWAY_API_KEY not configured in .env')
  process.exit(1)
}

// Helper: Ask user for confirmation
function askConfirmation(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(question + ' (yes/no): ', (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y')
    })
  })
}

// Step 1: Fetch all projects
console.log('\n1️⃣ Fetching all Railway projects...')

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

let projectsData
try {
  const response = await fetch(RAILWAY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RAILWAY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: projectsQuery }),
  })

  projectsData = await response.json()

  if (projectsData.errors) {
    console.error('❌ Railway API errors:')
    console.error(JSON.stringify(projectsData.errors, null, 2))
    process.exit(1)
  }
} catch (error) {
  console.error('❌ Failed to fetch projects:', error.message)
  process.exit(1)
}

const allProjects = projectsData.data?.projects?.edges || []
console.log(`✅ Found ${allProjects.length} total Railway projects`)

// Step 2: Find duplicate "client-plastimed01" projects
const plastimed01Projects = allProjects
  .map(({ node }) => node)
  .filter(p => p.name === 'client-plastimed01')
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Newest first

console.log(`\n2️⃣ Found ${plastimed01Projects.length}x "client-plastimed01" projects`)

if (plastimed01Projects.length === 0) {
  console.log('✅ No duplicate "client-plastimed01" projects found!')
  console.log('   Nothing to clean up.')
  process.exit(0)
}

if (plastimed01Projects.length === 1) {
  console.log('✅ Only 1 "client-plastimed01" project - no duplicates!')
  console.log(`   Project: ${plastimed01Projects[0].id}`)
  console.log(`   Created: ${plastimed01Projects[0].createdAt}`)
  process.exit(0)
}

// Step 3: Show what we'll keep vs delete
console.log('\n📋 Project breakdown:\n')

console.log('   ✅ KEEP (newest):')
console.log(`      • ID: ${plastimed01Projects[0].id}`)
console.log(`      • Created: ${plastimed01Projects[0].createdAt}`)
console.log(`      • Description: ${plastimed01Projects[0].description || '(none)'}`)

console.log('\n   ❌ DELETE (duplicates):')
for (let i = 1; i < plastimed01Projects.length; i++) {
  const p = plastimed01Projects[i]
  console.log(`      ${i}. ID: ${p.id}`)
  console.log(`         Created: ${p.createdAt}`)
}

console.log(`\n   Total to delete: ${plastimed01Projects.length - 1} projects`)

// Step 4: Ask for confirmation
console.log('\n━'.repeat(60))
const confirmed = await askConfirmation(
  `\n⚠️  Are you sure you want to DELETE ${plastimed01Projects.length - 1} duplicate projects?`
)

if (!confirmed) {
  console.log('\n❌ Cleanup cancelled by user')
  process.exit(0)
}

// Step 5: Delete duplicates
console.log('\n3️⃣ Deleting duplicate projects...\n')

const deleteProjectMutation = `
  mutation DeleteProject($id: String!) {
    projectDelete(id: $id)
  }
`

let deletedCount = 0
let failedCount = 0

for (let i = 1; i < plastimed01Projects.length; i++) {
  const project = plastimed01Projects[i]
  console.log(`   Deleting project ${i}/${plastimed01Projects.length - 1}: ${project.id}...`)

  try {
    const response = await fetch(RAILWAY_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RAILWAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: deleteProjectMutation,
        variables: { id: project.id },
      }),
    })

    const deleteData = await response.json()

    if (deleteData.errors) {
      console.error(`   ❌ Failed: ${deleteData.errors[0].message}`)
      failedCount++
    } else {
      console.log(`   ✅ Deleted successfully`)
      deletedCount++
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`)
    failedCount++
  }
}

// Step 6: Summary
console.log('\n━'.repeat(60))
console.log('\n✅ Cleanup Complete!\n')
console.log('   Summary:')
console.log(`   • Deleted: ${deletedCount} duplicate projects`)
console.log(`   • Failed: ${failedCount} projects`)
console.log(`   • Kept: 1 project (newest)`)
console.log('\n   Remaining "client-plastimed01" projects: 1')
console.log('\n💡 Tip: Future provisioning will NOT create duplicates thanks to')
console.log('   RAILWAY_USE_SHARED_DATABASE=true in your .env file!')
console.log('\n')
