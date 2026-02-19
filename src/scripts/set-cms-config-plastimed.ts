#!/usr/bin/env tsx
/**
 * set-cms-config-plastimed
 *
 * Stelt de juiste DISABLED_COLLECTIONS env var in op de Ploi-site
 * van plastimed01 (server 108942, site 349397).
 *
 * Plastimed profiel:
 *   - Webshop (B2B medische groothandel)
 *   - shopModel: 'b2b'
 *   - Blog aanwezig
 *   - DISABLED: services, cases (website-only)
 *
 * Run: npx tsx src/scripts/set-cms-config-plastimed.ts
 */

import 'dotenv/config'

const PLOI_API_TOKEN = process.env.PLOI_API_TOKEN
const PLOI_SERVER_ID = 108942
const PLOI_SITE_ID = 349397  // plastimed01.compassdigital.nl

// ─── CMS config voor plastimed ───────────────────────────────────────────────

const DISABLED_COLLECTIONS = 'services,cases'

const ENV_VARS_TO_SET: Record<string, string> = {
  DISABLED_COLLECTIONS,
  ECOMMERCE_ENABLED: 'true',
  SHOP_MODEL: 'b2b',
  PRICING_MODEL: 'tiered',
  CUSTOMER_GROUPS_ENABLED: 'true',
  TEMPLATE_ID: 'b2b',
}

// ─── Ploi API helpers ─────────────────────────────────────────────────────────

async function ploiGet(path: string) {
  const res = await fetch(`https://ploi.io/api${path}`, {
    headers: {
      Authorization: `Bearer ${PLOI_API_TOKEN}`,
      Accept: 'application/json',
    },
  })
  if (!res.ok) throw new Error(`Ploi GET ${path} failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function ploiRequest(method: string, path: string, body?: unknown) {
  const res = await fetch(`https://ploi.io/api${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${PLOI_API_TOKEN}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`Ploi ${method} ${path} failed: ${res.status} ${await res.text()}`)
  const text = await res.text()
  try { return text ? JSON.parse(text) : {} } catch { return { raw: text } }
}

function envStringToObject(str: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const line of str.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.substring(0, eqIdx).trim()
    const val = trimmed.substring(eqIdx + 1).trim()
    result[key] = val
  }
  return result
}

function envObjectToString(obj: Record<string, string>): string {
  return Object.entries(obj)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!PLOI_API_TOKEN) {
    console.error('❌ PLOI_API_TOKEN not set in environment')
    process.exit(1)
  }

  console.log('=== CMS Config instellen voor plastimed01 ===\n')
  console.log(`Server: ${PLOI_SERVER_ID}`)
  console.log(`Site:   ${PLOI_SITE_ID} (plastimed01.compassdigital.nl)`)
  console.log()

  // 1. Haal bestaande env op
  console.log('📥 Bestaande .env ophalen van Ploi...')
  const envResponse = await ploiGet(`/servers/${PLOI_SERVER_ID}/sites/${PLOI_SITE_ID}/env`)
  const existingEnv = envStringToObject(envResponse.data || '')
  console.log(`   ${Object.keys(existingEnv).length} bestaande variabelen gevonden`)

  // 2. Merge met nieuwe waarden
  const mergedEnv = { ...existingEnv, ...ENV_VARS_TO_SET }

  console.log('\n📝 Toe te voegen / bij te werken:')
  for (const [k, v] of Object.entries(ENV_VARS_TO_SET)) {
    const was = existingEnv[k]
    const label = was ? (was === v ? '  (geen wijziging)' : ` (was: ${was})`) : '  (nieuw)'
    console.log(`   ${k}=${v}${label}`)
  }

  // 3. Update env op Ploi (Ploi env endpoint gebruikt PUT)
  console.log('\n📤 Env bijwerken op Ploi...')
  await ploiRequest('PUT', `/servers/${PLOI_SERVER_ID}/sites/${PLOI_SITE_ID}/env`, {
    content: envObjectToString(mergedEnv),
  })
  console.log('✅ Env bijgewerkt')

  // 4. Trigger redeploy op Ploi zodat de nieuwe env vars ingeladen worden
  console.log('\n🔄 Redeploy triggeren op Ploi...')
  await ploiRequest('POST', `/servers/${PLOI_SERVER_ID}/sites/${PLOI_SITE_ID}/deploy`)
  console.log('✅ Redeploy gestart (pm2 restart --update-env wordt automatisch uitgevoerd)')

  // 5. Update client record in Payload database
  console.log('\n💾 Client record bijwerken in Payload database...')
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })

  const clients = await payload.find({
    collection: 'clients',
    where: { domain: { equals: 'plastimed01' } },
    limit: 1,
    depth: 0,
  })

  if (clients.docs.length > 0) {
    const clientId = String(clients.docs[0].id)
    await payload.update({
      collection: 'clients',
      id: clientId,
      data: {
        template: 'b2b' as any,
        disabledCollections: ['services', 'cases'] as any,
        customEnvironment: ENV_VARS_TO_SET,
        customSettings: {
          ...(clients.docs[0] as any).customSettings,
          cmsConfigSummary: 'B2B Webshop (medische groothandel)',
          shopModel: 'b2b',
        },
      },
      overrideAccess: true,
      context: { skipProvisioningHook: true },
    } as any)
    console.log(`✅ Client record bijgewerkt (ID: ${clientId})`)
  } else {
    console.warn('⚠️  Geen client record gevonden met domain=plastimed01 — sla Payload update over')
  }

  console.log('\n🎉 Klaar! plastimed01 draait nu met:')
  console.log(`   DISABLED_COLLECTIONS=${DISABLED_COLLECTIONS}`)
  console.log('   → admin panel toont alleen relevante B2B ecommerce collections')
  console.log('\n⏳ De herstart duurt 30-60 seconden. Daarna is het zichtbaar op:')
  console.log('   https://plastimed01.compassdigital.nl/admin')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
