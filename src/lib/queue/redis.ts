/**
 * Redis Configuration
 * Supports both local Redis (development) and Upstash (production)
 */

import { Redis } from 'ioredis'

// Redis connection for BullMQ (local or Upstash)
export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
})

// Upstash Redis (for edge caching - optional)
// Uncomment when you have Upstash credentials
/*
import { Redis as UpstashRedis } from '@upstash/redis'

export const upstashRedis = new UpstashRedis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})
*/

// Cache key generators
export const cacheKeys = {
  contentAnalysis: (contentHash: string) => `analysis:content:${contentHash}`,
  seoAnalysis: (contentHash: string) => `analysis:seo:${contentHash}`,
  translation: (contentHash: string, targetLang: string) => `translation:${contentHash}:${targetLang}`,
  blockGeneration: (blockType: string, businessHash: string) => `block:${blockType}:${businessHash}`,
  pageGeneration: (templateHash: string) => `page:${templateHash}`,
}

// Cache TTLs (in seconds)
export const cacheTTL = {
  PERMANENT: 90 * 24 * 60 * 60,  // 90 days
  STABLE: 7 * 24 * 60 * 60,      // 7 days
  DYNAMIC: 60 * 60,               // 1 hour
  REALTIME: 15 * 60,              // 15 minutes
}

// Helper: Generate content hash for caching
import crypto from 'crypto'

export function generateContentHash(content: string): string {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex')
    .substring(0, 16) // First 16 chars is enough
}

// Helper: Check cache with fallback
export async function getCached<T>(
  key: string,
  fallback: () => Promise<T>,
  ttl: number = cacheTTL.DYNAMIC
): Promise<T> {
  try {
    // Try to get from cache
    const cached = await redis.get(key)

    if (cached) {
      console.log(`[CACHE HIT] ${key}`)
      return JSON.parse(cached) as T
    }

    console.log(`[CACHE MISS] ${key}`)

    // Execute fallback
    const result = await fallback()

    // Store in cache
    await redis.setex(key, ttl, JSON.stringify(result))

    return result
  } catch (error) {
    console.error('[CACHE ERROR]', error)
    // If cache fails, still execute fallback
    return await fallback()
  }
}

// Helper: Invalidate cache
export async function invalidateCache(pattern: string): Promise<number> {
  const keys = await redis.keys(pattern)
  if (keys.length === 0) return 0
  return await redis.del(...keys)
}

// Monitor Redis connection
redis.on('connect', () => {
  console.log('✅ Redis connected')
})

redis.on('error', (err) => {
  console.error('❌ Redis error:', err)
})

redis.on('ready', () => {
  console.log('✅ Redis ready')
})
