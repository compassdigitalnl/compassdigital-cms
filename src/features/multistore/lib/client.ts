/**
 * Multistore API Client
 *
 * Type-safe REST API client for communicating with Payload CMS instances
 * (child webshops). Follows the same pattern as ListmonkClient.
 *
 * Authentication: Bearer token (Payload API key)
 * Transport: HTTP fetch with timeout + AbortController
 */

import type {
  MultistoreClientOptions,
  PayloadAPIResponse,
  PayloadAPIListResponse,
  HealthCheckResult,
  StockUpdate,
  BulkStockUpdate,
} from './types'

// ═══════════════════════════════════════════════════════════
// MULTISTORE CLIENT
// ═══════════════════════════════════════════════════════════

export class MultistoreClient {
  private apiUrl: string
  private apiKey: string
  private timeout: number
  private webhookSecret?: string

  constructor(options: MultistoreClientOptions) {
    // Strip trailing slash from apiUrl
    this.apiUrl = options.apiUrl.replace(/\/$/, '')
    this.apiKey = options.apiKey
    this.timeout = options.timeout || 30000
    this.webhookSecret = options.webhookSecret
  }

  // ═══════════════════════════════════════════════════════════
  // INTERNAL HELPERS
  // ═══════════════════════════════════════════════════════════

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new MultistoreAPIError(
          errorData.errors?.[0]?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData,
        )
      }

      return response.json() as Promise<T>
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof MultistoreAPIError) {
        throw error
      }

      if ((error as Error).name === 'AbortError') {
        throw new MultistoreAPIError('Request timeout', 408)
      }

      throw new MultistoreAPIError(
        error instanceof Error ? error.message : 'Unknown error',
        500,
      )
    }
  }

  private buildQueryString(params?: Record<string, unknown>): string {
    if (!params) return ''
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
      }
    }
    const query = searchParams.toString()
    return query ? `?${query}` : ''
  }

  // ═══════════════════════════════════════════════════════════
  // PRODUCTS API
  // ═══════════════════════════════════════════════════════════

  async getProduct(id: number): Promise<PayloadAPIResponse> {
    return this.request<PayloadAPIResponse>(`/api/products/${id}`)
  }

  async getProducts(params?: { where?: Record<string, unknown>; limit?: number; page?: number }): Promise<PayloadAPIListResponse> {
    return this.request<PayloadAPIListResponse>(`/api/products${this.buildQueryString(params)}`)
  }

  async createProduct(data: Record<string, unknown>): Promise<PayloadAPIResponse> {
    return this.request<PayloadAPIResponse>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProduct(id: number, data: Record<string, unknown>): Promise<PayloadAPIResponse> {
    return this.request<PayloadAPIResponse>(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(id: number): Promise<void> {
    await this.request<void>(`/api/products/${id}`, {
      method: 'DELETE',
    })
  }

  // ═══════════════════════════════════════════════════════════
  // ORDERS API
  // ═══════════════════════════════════════════════════════════

  async getOrder(id: number): Promise<PayloadAPIResponse> {
    return this.request<PayloadAPIResponse>(`/api/orders/${id}`)
  }

  async getOrders(params?: { where?: Record<string, unknown>; limit?: number; page?: number; sort?: string }): Promise<PayloadAPIListResponse> {
    return this.request<PayloadAPIListResponse>(`/api/orders${this.buildQueryString(params)}`)
  }

  async updateOrderStatus(id: number, status: string, data?: Record<string, unknown>): Promise<PayloadAPIResponse> {
    return this.request<PayloadAPIResponse>(`/api/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...data }),
    })
  }

  // ═══════════════════════════════════════════════════════════
  // INVENTORY API
  // ═══════════════════════════════════════════════════════════

  async updateStock(productId: number, stock: number, stockStatus?: string): Promise<PayloadAPIResponse> {
    const data: Record<string, unknown> = { stock }
    if (stockStatus) data.stockStatus = stockStatus
    return this.request<PayloadAPIResponse>(`/api/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async bulkUpdateStock(updates: StockUpdate[]): Promise<Array<{ productId: number; success: boolean; error?: string }>> {
    const results = []
    for (const update of updates) {
      try {
        await this.updateStock(update.productId, update.stock, update.stockStatus)
        results.push({ productId: update.productId, success: true })
      } catch (error) {
        results.push({
          productId: update.productId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
    return results
  }

  // ═══════════════════════════════════════════════════════════
  // WEBHOOK (outgoing from Hub → Child)
  // ═══════════════════════════════════════════════════════════

  async sendWebhook(endpoint: string, payload: Record<string, unknown>): Promise<PayloadAPIResponse> {
    const headers: Record<string, string> = {}

    if (this.webhookSecret) {
      const crypto = await import('crypto')
      const timestamp = Math.floor(Date.now() / 1000)
      const payloadString = JSON.stringify(payload)
      const signedPayload = `${timestamp}.${payloadString}`
      const signature = crypto.createHmac('sha256', this.webhookSecret)
        .update(signedPayload)
        .digest('hex')

      headers['x-webhook-signature'] = signature
      headers['x-webhook-timestamp'] = timestamp.toString()
    }

    return this.request<PayloadAPIResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers,
    })
  }

  // ═══════════════════════════════════════════════════════════
  // HEALTH CHECK
  // ═══════════════════════════════════════════════════════════

  async healthCheck(): Promise<HealthCheckResult> {
    const start = Date.now()
    try {
      // Payload CMS has no built-in /health endpoint, so we use /api/users with limit=0
      await this.request<PayloadAPIListResponse>('/api/users?limit=0')
      return {
        status: 'ok',
        responseTime: Date.now() - start,
      }
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - start,
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════
// CUSTOM ERROR CLASS
// ═══════════════════════════════════════════════════════════

export class MultistoreAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown,
  ) {
    super(message)
    this.name = 'MultistoreAPIError'
  }
}
