#!/usr/bin/env tsx
/**
 * Provision Plastimed via the generic ProvisioningService
 *
 * This script:
 * 1. Creates a "Plastimed" client record in Payload (if not exists)
 * 2. Calls provisionClient() — the same generic flow used by the Clients hook
 *
 * Run: npm run provision:plastimed
 */

import 'dotenv/config'

async function main() {
  console.log('=== Plastimed Provisioning (via generic ProvisioningService) ===\n')

  // ── Load Payload ─────────────────────────────────────────────────────────
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })

  // ── Find or create Plastimed client ──────────────────────────────────────
  const domain = 'plastimed01'
  const name = 'Plastimed'

  let clientId: string

  // Check if already exists
  const existing = await payload.find({
    collection: 'clients',
    where: { domain: { equals: domain } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as any
    clientId = String(doc.id)
    console.log(`Found existing client: ${name} (ID: ${clientId}, status: ${doc.status})`)

    // Reset to 'pending' so we can re-provision
    await payload.update({
      collection: 'clients',
      id: clientId,
      data: { status: 'pending' },
    })
    console.log('Reset status to pending')
  } else {
    // Create new client record
    const newClient = await payload.create({
      collection: 'clients',
      data: {
        name,
        domain,
        contactEmail: 'info@plastimed.nl',
        template: 'corporate',
        status: 'pending',
        plan: 'professional',
      } as any,
    })
    clientId = String(newClient.id)
    console.log(`Created new client: ${name} (ID: ${clientId})`)
  }

  console.log(`\nStarting provisioning for client ID: ${clientId}\n`)

  // ── Run provisionClient ───────────────────────────────────────────────────
  const { provisionClient } = await import('../lib/provisioning/provisionClient.js')

  const result = await provisionClient({
    clientId,
    provider: 'ploi',
    verbose: true,
  })

  // ── Print result ──────────────────────────────────────────────────────────
  console.log('\n=== PROVISIONING RESULT ===')
  console.log('Success:', result.success)
  console.log('Status:', result.status)

  if (result.success) {
    console.log('Deployment URL:', result.deploymentUrl)
    console.log('Admin URL:', result.adminUrl)
    console.log('Provider ID:', result.providerId)
  } else {
    console.log('Error:', result.error)
  }

  console.log('\nLogs:')
  result.logs?.forEach((log) => console.log(' ', log))

  process.exit(result.success ? 0 : 1)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
