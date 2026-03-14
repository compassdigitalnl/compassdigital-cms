/**
 * Resilient Multistore Client
 *
 * Wraps MultistoreClient with retry logic, exponential backoff,
 * and circuit breaker pattern. One instance per child site.
 */

import { MultistoreClient, MultistoreAPIError } from './client'
import type { MultistoreClientOptions } from './types'

// ═══════════════════════════════════════════════════════════
// CIRCUIT BREAKER
// ═══════════════════════════════════════════════════════════

interface CircuitBreakerState {
  failures: number
  lastFailure: number
  state: 'closed' | 'open' | 'half-open'
}

const DEFAULT_MAX_FAILURES = 5
const DEFAULT_RESET_TIMEOUT = 60_000 // 1 minute

// ═══════════════════════════════════════════════════════════
// RESILIENT CLIENT
// ═══════════════════════════════════════════════════════════

export class ResilientMultistoreClient {
  private client: MultistoreClient
  private siteId: number
  private siteName: string
  private maxRetries: number
  private baseDelay: number
  private circuit: CircuitBreakerState
  private maxFailures: number
  private resetTimeout: number

  constructor(
    options: MultistoreClientOptions & {
      siteId: number
      siteName: string
      maxRetries?: number
      baseDelay?: number
      maxFailures?: number
      resetTimeout?: number
    },
  ) {
    this.client = new MultistoreClient(options)
    this.siteId = options.siteId
    this.siteName = options.siteName
    this.maxRetries = options.maxRetries ?? 3
    this.baseDelay = options.baseDelay ?? 1000
    this.maxFailures = options.maxFailures ?? DEFAULT_MAX_FAILURES
    this.resetTimeout = options.resetTimeout ?? DEFAULT_RESET_TIMEOUT

    this.circuit = {
      failures: 0,
      lastFailure: 0,
      state: 'closed',
    }
  }

  get underlying(): MultistoreClient {
    return this.client
  }

  get circuitState(): CircuitBreakerState['state'] {
    return this.circuit.state
  }

  /**
   * Execute an operation with retry + circuit breaker
   */
  async execute<T>(operation: (client: MultistoreClient) => Promise<T>, label: string): Promise<T> {
    // Check circuit breaker
    if (this.circuit.state === 'open') {
      const elapsed = Date.now() - this.circuit.lastFailure
      if (elapsed >= this.resetTimeout) {
        this.circuit.state = 'half-open'
        console.log(`[Multistore] Circuit half-open for ${this.siteName} — trying one request`)
      } else {
        throw new MultistoreAPIError(
          `Circuit breaker open for ${this.siteName} — ${label} blocked (resets in ${Math.ceil((this.resetTimeout - elapsed) / 1000)}s)`,
          503,
        )
      }
    }

    let lastError: Error | undefined

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await operation(this.client)

        // Success — reset circuit breaker
        if (this.circuit.state === 'half-open' || this.circuit.failures > 0) {
          this.circuit = { failures: 0, lastFailure: 0, state: 'closed' }
          console.log(`[Multistore] Circuit closed for ${this.siteName} — recovered`)
        }

        return result
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry on 4xx errors (client errors)
        if (error instanceof MultistoreAPIError && error.statusCode >= 400 && error.statusCode < 500) {
          this.recordFailure()
          throw error
        }

        if (attempt < this.maxRetries) {
          const delay = this.baseDelay * Math.pow(2, attempt)
          console.log(
            `[Multistore] ${this.siteName} — ${label} attempt ${attempt + 1}/${this.maxRetries + 1} failed, retrying in ${delay}ms: ${lastError.message}`,
          )
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    // All retries exhausted
    this.recordFailure()
    throw lastError
  }

  private recordFailure(): void {
    this.circuit.failures++
    this.circuit.lastFailure = Date.now()

    if (this.circuit.failures >= this.maxFailures) {
      this.circuit.state = 'open'
      console.error(
        `[Multistore] Circuit OPEN for ${this.siteName} — ${this.circuit.failures} consecutive failures`,
      )
    }
  }

  /**
   * Manually reset circuit breaker (e.g. after manual health check)
   */
  resetCircuit(): void {
    this.circuit = { failures: 0, lastFailure: 0, state: 'closed' }
  }
}

// ═══════════════════════════════════════════════════════════
// CLIENT CACHE (one ResilientClient per site)
// ═══════════════════════════════════════════════════════════

const clientCache = new Map<number, ResilientMultistoreClient>()

export function getResilientClient(
  siteId: number,
  config: MultistoreClientOptions & { siteName: string },
): ResilientMultistoreClient {
  let client = clientCache.get(siteId)
  if (!client) {
    client = new ResilientMultistoreClient({ ...config, siteId })
    clientCache.set(siteId, client)
  }
  return client
}

export function clearClientCache(): void {
  clientCache.clear()
}
