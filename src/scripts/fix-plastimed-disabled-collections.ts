#!/usr/bin/env tsx
/**
 * Quick fix: Update plastimed01 client record with disabledCollections
 *
 * This ensures HideCollections component has the right data to work with.
 * Run: npx tsx src/scripts/fix-plastimed-disabled-collections.ts
 */

import 'dotenv/config'

async function main() {
  console.log('=== Updating plastimed01 disabledCollections ===\n')

  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })

  // Find plastimed01 client (try both subdomain and full hostname)
  let clients = await payload.find({
    collection: 'clients',
    where: {
      or: [
        { domain: { equals: 'plastimed01' } },
        { domain: { equals: 'plastimed01.compassdigital.nl' } },
      ],
    },
    limit: 1,
    depth: 0,
  })

  if (clients.docs.length === 0) {
    console.error('❌ No client found with domain=plastimed01 or plastimed01.compassdigital.nl')
    console.log('\nSearching all clients...\n')

    const all = await payload.find({
      collection: 'clients',
      limit: 10,
      depth: 0,
    })

    console.log('Found clients:')
    all.docs.forEach((doc: any) => {
      console.log(`  - ${doc.name} (domain: ${doc.domain})`)
    })

    process.exit(1)
  }

  const client = clients.docs[0] as any
  console.log(`Found client: ${client.name}`)
  console.log(`  ID: ${client.id}`)
  console.log(`  Domain: ${client.domain}`)
  console.log(`  Current disabledCollections:`, client.disabledCollections || [])

  // Update with correct disabled collections for Plastimed
  const disabledCollections = ['services', 'cases']

  console.log(`\nUpdating disabledCollections to: [${disabledCollections.join(', ')}]`)

  await payload.update({
    collection: 'clients',
    id: String(client.id),
    data: {
      disabledCollections: disabledCollections as any,
      template: 'b2b' as any,
    },
    overrideAccess: true,
    context: { skipProvisioningHook: true } as any,
  })

  console.log('✅ Client record updated successfully!')
  console.log('\nVerify at: https://plastimed01.compassdigital.nl/admin')
  console.log('Expected: "services" and "cases" collections should be hidden')

  // Verify the update
  const updated = await payload.findByID({
    collection: 'clients',
    id: String(client.id),
    depth: 0,
  })

  console.log('\nVerification:')
  console.log(`  disabledCollections: ${JSON.stringify((updated as any).disabledCollections)}`)

  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
