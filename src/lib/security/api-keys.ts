/**
 * API Key Management Service
 *
 * Handles API key generation, validation, and verification
 */

import crypto from 'crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Payload } from 'payload'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface ApiKeyData {
  id: string | number
  name: string
  tenant: string | number
  scopes: string[]
  status: 'active' | 'inactive' | 'revoked' | 'expired'
  expiresAt?: string
  ipWhitelist?: Array<{ ip: string; description?: string }>
  rateLimit?: {
    enabled: boolean
    maxRequests: number
  }
  usage: {
    totalRequests: number
    lastUsedAt?: string
    lastUsedIp?: string
  }
}

export interface ApiKeyValidationResult {
  valid: boolean
  reason?: string
  key?: ApiKeyData
}

// ═══════════════════════════════════════════════════════════
// KEY GENERATION
// ═══════════════════════════════════════════════════════════

/**
 * Generate a cryptographically secure API key
 *
 * Format: cms_live_[32 random bytes as hex]
 * Example: cms_live_a1b2c3d4e5f6...
 */
export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(32)
  const key = `cms_live_${randomBytes.toString('hex')}`
  return key
}

/**
 * Hash an API key using SHA-256
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

/**
 * Extract key prefix (first 8 chars after sk_live_)
 */
export function getKeyPrefix(key: string): string {
  if (!key.startsWith('sk_live_')) {
    return key.substring(0, 8)
  }
  return key.substring(8, 16) // sk_live_XXXXXXXX
}

/**
 * Create a new API key in the database
 *
 * @returns The generated API key (plain text) - only shown once!
 */
export async function createApiKey(data: {
  name: string
  description?: string
  tenantId: string | number
  scopes: string[]
  expiresAt?: Date
  ipWhitelist?: Array<{ ip: string; description?: string }>
  rateLimit?: {
    enabled: boolean
    maxRequests: number
  }
  createdBy?: string | number
}): Promise<{
  apiKey: string // Plain text - only returned once!
  keyPrefix: string
  id: string | number
}> {
  const payload = await getPayload({ config })

  // Generate API key
  const apiKey = generateApiKey()
  const keyHash = hashApiKey(apiKey)
  const keyPrefix = getKeyPrefix(apiKey)

  // Store in database
  const result = await payload.create({
    collection: 'api-keys',
    data: {
      name: data.name,
      description: data.description,
      tenant: data.tenantId,
      keyHash,
      keyPrefix,
      scopes: data.scopes,
      status: 'active',
      expiresAt: data.expiresAt?.toISOString(),
      ipWhitelist: data.ipWhitelist,
      rateLimit: data.rateLimit || {
        enabled: true,
        maxRequests: 100,
      },
      usage: {
        totalRequests: 0,
      },
      createdBy: data.createdBy,
    },
  })

  console.log(`[API Keys] Created new key: ${keyPrefix}... for tenant ${data.tenantId}`)

  return {
    apiKey, // ⚠️ Only returned once!
    keyPrefix,
    id: result.id,
  }
}

// ═══════════════════════════════════════════════════════════
// KEY VALIDATION
// ═══════════════════════════════════════════════════════════

/**
 * Validate an API key
 *
 * Checks:
 * - Key exists in database (via hash)
 * - Status is 'active'
 * - Not expired
 * - IP whitelist (if configured)
 */
export async function validateApiKey(
  apiKey: string,
  options?: {
    requiredScopes?: string[]
    clientIp?: string
  }
): Promise<ApiKeyValidationResult> {
  try {
    const payload = await getPayload({ config })

    // Hash the provided key
    const keyHash = hashApiKey(apiKey)

    // Find key in database
    const results = await payload.find({
      collection: 'api-keys',
      where: {
        keyHash: {
          equals: keyHash,
        },
      },
      limit: 1,
    })

    if (results.docs.length === 0) {
      return {
        valid: false,
        reason: 'Invalid API key',
      }
    }

    const keyData = results.docs[0] as any

    // Check status
    if (keyData.status !== 'active') {
      return {
        valid: false,
        reason: `API key is ${keyData.status}`,
      }
    }

    // Check expiration
    if (keyData.expiresAt) {
      const expiryDate = new Date(keyData.expiresAt)
      if (expiryDate < new Date()) {
        // Auto-update status to expired
        await payload.update({
          collection: 'api-keys',
          id: keyData.id,
          data: {
            status: 'expired',
          },
        })

        return {
          valid: false,
          reason: 'API key has expired',
        }
      }
    }

    // Check IP whitelist
    if (options?.clientIp && keyData.ipWhitelist && keyData.ipWhitelist.length > 0) {
      const allowedIps = keyData.ipWhitelist.map((entry: any) => entry.ip)
      const isAllowed = allowedIps.some((ip: string) => {
        // Support CIDR notation or exact match
        if (ip.includes('/')) {
          // TODO: Implement CIDR matching
          return false
        }
        return ip === options.clientIp
      })

      if (!isAllowed) {
        return {
          valid: false,
          reason: `IP ${options.clientIp} not in whitelist`,
        }
      }
    }

    // Check required scopes
    if (options?.requiredScopes && options.requiredScopes.length > 0) {
      const keyScopes = keyData.scopes || []
      const hasAdminScope = keyScopes.includes('admin:*')

      if (!hasAdminScope) {
        const hasAllScopes = options.requiredScopes.every((scope) =>
          keyScopes.includes(scope)
        )

        if (!hasAllScopes) {
          return {
            valid: false,
            reason: 'Insufficient permissions',
          }
        }
      }
    }

    // Valid! Return key data
    return {
      valid: true,
      key: {
        id: keyData.id,
        name: keyData.name,
        tenant: keyData.tenant,
        scopes: keyData.scopes,
        status: keyData.status,
        expiresAt: keyData.expiresAt,
        ipWhitelist: keyData.ipWhitelist,
        rateLimit: keyData.rateLimit,
        usage: keyData.usage,
      },
    }
  } catch (error: any) {
    console.error('[API Keys] Validation error:', error)
    return {
      valid: false,
      reason: 'Internal error during validation',
    }
  }
}

/**
 * Track API key usage
 */
export async function trackApiKeyUsage(
  keyId: string | number,
  clientIp?: string
): Promise<void> {
  try {
    const payload = await getPayload({ config })

    // Get current usage
    const keyData = await payload.findByID({
      collection: 'api-keys',
      id: keyId,
    })

    const currentRequests = (keyData as any).usage?.totalRequests || 0

    // Update usage
    await payload.update({
      collection: 'api-keys',
      id: keyId,
      data: {
        usage: {
          totalRequests: currentRequests + 1,
          lastUsedAt: new Date().toISOString(),
          lastUsedIp: clientIp,
        },
      },
    })
  } catch (error: any) {
    console.error('[API Keys] Failed to track usage:', error)
    // Don't throw - tracking failure shouldn't block the request
  }
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(
  keyId: string | number,
  revokedBy?: string | number
): Promise<void> {
  const payload = await getPayload({ config })

  await payload.update({
    collection: 'api-keys',
    id: keyId,
    data: {
      status: 'revoked',
      revokedAt: new Date().toISOString(),
      revokedBy,
    },
  })

  console.log(`[API Keys] Revoked key: ${keyId}`)
}

/**
 * Rotate an API key (revoke old, create new with same settings)
 */
export async function rotateApiKey(
  keyId: string | number,
  rotatedBy?: string | number
): Promise<{
  apiKey: string
  keyPrefix: string
  id: string | number
}> {
  const payload = await getPayload({ config })

  // Get old key data
  const oldKey = await payload.findByID({
    collection: 'api-keys',
    id: keyId,
  })

  // Revoke old key
  await revokeApiKey(keyId, rotatedBy)

  // Create new key with same settings
  const newKey = await createApiKey({
    name: `${(oldKey as any).name} (Rotated)`,
    description: (oldKey as any).description,
    tenantId: (oldKey as any).tenant,
    scopes: (oldKey as any).scopes,
    expiresAt: (oldKey as any).expiresAt ? new Date((oldKey as any).expiresAt) : undefined,
    ipWhitelist: (oldKey as any).ipWhitelist,
    rateLimit: (oldKey as any).rateLimit,
    createdBy: rotatedBy,
  })

  console.log(`[API Keys] Rotated key ${keyId} to ${newKey.id}`)

  return newKey
}

/**
 * Check if a scope is allowed
 */
export function hasScope(keyData: ApiKeyData, requiredScope: string): boolean {
  const keyScopes = keyData.scopes || []

  // Admin scope grants everything
  if (keyScopes.includes('admin:*')) {
    return true
  }

  // Check exact match
  if (keyScopes.includes(requiredScope)) {
    return true
  }

  // Check wildcard match (e.g., "subscribers:*" matches "subscribers:read")
  const wildcardScopes = keyScopes.filter((s) => s.endsWith(':*'))
  for (const wildcardScope of wildcardScopes) {
    const prefix = wildcardScope.replace(':*', '')
    if (requiredScope.startsWith(prefix)) {
      return true
    }
  }

  return false
}
