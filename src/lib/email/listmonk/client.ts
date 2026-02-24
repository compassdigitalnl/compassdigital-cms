/**
 * Listmonk API Client
 *
 * Type-safe REST API client for Listmonk email marketing platform
 * Supports subscribers, lists, templates, campaigns, and analytics
 *
 * @see https://listmonk.app/docs/apis/
 */

import type {
  ListmonkSubscriber,
  ListmonkSubscriberResponse,
  ListmonkSubscribersResponse,
  ListmonkList,
  ListmonkListResponse,
  ListmonkListsResponse,
  ListmonkTemplate,
  ListmonkTemplateResponse,
  ListmonkTemplatesResponse,
  ListmonkCampaign,
  ListmonkCampaignResponse,
  ListmonkCampaignsResponse,
  ListmonkCampaignStats,
  ListmonkErrorResponse,
  ListmonkClientOptions,
  ListmonkPaginationParams,
} from '@/types/listmonk'

// ═══════════════════════════════════════════════════════════
// LISTMONK CLIENT
// ═══════════════════════════════════════════════════════════

export class ListmonkClient {
  private baseUrl: string
  private authHeader: string
  private timeout: number

  constructor(options?: Partial<ListmonkClientOptions>) {
    this.baseUrl = options?.baseUrl || process.env.LISTMONK_URL || 'http://localhost:9000'
    const username = options?.username || process.env.LISTMONK_API_USER || 'admin'
    const password = options?.password || process.env.LISTMONK_API_PASS || ''
    this.timeout = options?.timeout || 30000
    this.authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
  }

  // ═══════════════════════════════════════════════════════════
  // INTERNAL HELPERS
  // ═══════════════════════════════════════════════════════════

  /**
   * Make authenticated request to Listmonk API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as ListmonkErrorResponse
        throw new ListmonkAPIError(
          errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.error?.data,
        )
      }

      return response.json() as Promise<T>
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ListmonkAPIError) {
        throw error
      }

      if ((error as Error).name === 'AbortError') {
        throw new ListmonkAPIError('Request timeout', 408)
      }

      throw new ListmonkAPIError(
        error instanceof Error ? error.message : 'Unknown error',
        500,
      )
    }
  }

  /**
   * Build query string from pagination params
   */
  private buildQueryString(params?: ListmonkPaginationParams): string {
    if (!params) return ''
    const searchParams = new URLSearchParams()
    if (params.page !== undefined) searchParams.append('page', String(params.page))
    if (params.per_page !== undefined) searchParams.append('per_page', String(params.per_page))
    if (params.order_by) searchParams.append('order_by', params.order_by)
    if (params.order) searchParams.append('order', params.order)
    if (params.query) searchParams.append('query', params.query)
    const query = searchParams.toString()
    return query ? `?${query}` : ''
  }

  // ═══════════════════════════════════════════════════════════
  // SUBSCRIBERS API
  // ═══════════════════════════════════════════════════════════

  /**
   * Get all subscribers with pagination
   */
  async getSubscribers(params?: ListmonkPaginationParams): Promise<ListmonkSubscribersResponse> {
    return this.request<ListmonkSubscribersResponse>(`/api/subscribers${this.buildQueryString(params)}`)
  }

  /**
   * Get subscriber by ID
   */
  async getSubscriber(id: number): Promise<ListmonkSubscriberResponse> {
    return this.request<ListmonkSubscriberResponse>(`/api/subscribers/${id}`)
  }

  /**
   * Get subscriber by email
   */
  async getSubscriberByEmail(email: string): Promise<ListmonkSubscriberResponse | null> {
    const response = await this.getSubscribers({ query: `subscribers.email = '${email}'` })
    if (response.data.results.length === 0) return null
    return { data: response.data.results[0] }
  }

  /**
   * Create new subscriber
   */
  async createSubscriber(subscriber: Omit<ListmonkSubscriber, 'id' | 'uuid' | 'created_at' | 'updated_at'>): Promise<ListmonkSubscriberResponse> {
    return this.request<ListmonkSubscriberResponse>('/api/subscribers', {
      method: 'POST',
      body: JSON.stringify(subscriber),
    })
  }

  /**
   * Update existing subscriber
   */
  async updateSubscriber(id: number, updates: Partial<ListmonkSubscriber>): Promise<ListmonkSubscriberResponse> {
    return this.request<ListmonkSubscriberResponse>(`/api/subscribers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  /**
   * Delete subscriber
   */
  async deleteSubscriber(id: number): Promise<void> {
    await this.request<void>(`/api/subscribers/${id}`, {
      method: 'DELETE',
    })
  }

  /**
   * Blocklist subscriber
   */
  async blocklistSubscriber(id: number): Promise<ListmonkSubscriberResponse> {
    return this.request<ListmonkSubscriberResponse>(`/api/subscribers/${id}/blocklist`, {
      method: 'PUT',
    })
  }

  /**
   * Add subscriber to lists
   */
  async addSubscriberToLists(id: number, listIds: number[]): Promise<ListmonkSubscriberResponse> {
    return this.request<ListmonkSubscriberResponse>(`/api/subscribers/lists`, {
      method: 'PUT',
      body: JSON.stringify({
        ids: [id],
        action: 'add',
        target_list_ids: listIds,
      }),
    })
  }

  /**
   * Remove subscriber from lists
   */
  async removeSubscriberFromLists(id: number, listIds: number[]): Promise<ListmonkSubscriberResponse> {
    return this.request<ListmonkSubscriberResponse>(`/api/subscribers/lists`, {
      method: 'PUT',
      body: JSON.stringify({
        ids: [id],
        action: 'remove',
        target_list_ids: listIds,
      }),
    })
  }

  // ═══════════════════════════════════════════════════════════
  // LISTS API
  // ═══════════════════════════════════════════════════════════

  /**
   * Get all lists
   */
  async getLists(params?: ListmonkPaginationParams): Promise<ListmonkListsResponse> {
    return this.request<ListmonkListsResponse>(`/api/lists${this.buildQueryString(params)}`)
  }

  /**
   * Get list by ID
   */
  async getList(id: number): Promise<ListmonkListResponse> {
    return this.request<ListmonkListResponse>(`/api/lists/${id}`)
  }

  /**
   * Create new list
   */
  async createList(list: Omit<ListmonkList, 'id' | 'uuid' | 'created_at' | 'updated_at' | 'subscriber_count'>): Promise<ListmonkListResponse> {
    return this.request<ListmonkListResponse>('/api/lists', {
      method: 'POST',
      body: JSON.stringify(list),
    })
  }

  /**
   * Update existing list
   */
  async updateList(id: number, updates: Partial<ListmonkList>): Promise<ListmonkListResponse> {
    return this.request<ListmonkListResponse>(`/api/lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  /**
   * Delete list
   */
  async deleteList(id: number): Promise<void> {
    await this.request<void>(`/api/lists/${id}`, {
      method: 'DELETE',
    })
  }

  // ═══════════════════════════════════════════════════════════
  // TEMPLATES API
  // ═══════════════════════════════════════════════════════════

  /**
   * Get all templates
   */
  async getTemplates(): Promise<ListmonkTemplatesResponse> {
    return this.request<ListmonkTemplatesResponse>('/api/templates')
  }

  /**
   * Get template by ID
   */
  async getTemplate(id: number): Promise<ListmonkTemplateResponse> {
    return this.request<ListmonkTemplateResponse>(`/api/templates/${id}`)
  }

  /**
   * Get default template
   */
  async getDefaultTemplate(): Promise<ListmonkTemplateResponse> {
    return this.request<ListmonkTemplateResponse>('/api/templates/default')
  }

  /**
   * Create new template
   */
  async createTemplate(template: Omit<ListmonkTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<ListmonkTemplateResponse> {
    return this.request<ListmonkTemplateResponse>('/api/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    })
  }

  /**
   * Update existing template
   */
  async updateTemplate(id: number, updates: Partial<ListmonkTemplate>): Promise<ListmonkTemplateResponse> {
    return this.request<ListmonkTemplateResponse>(`/api/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  /**
   * Delete template
   */
  async deleteTemplate(id: number): Promise<void> {
    await this.request<void>(`/api/templates/${id}`, {
      method: 'DELETE',
    })
  }

  /**
   * Preview template
   */
  async previewTemplate(id: number): Promise<string> {
    const response = await this.request<{ data: string }>(`/api/templates/${id}/preview`)
    return response.data
  }

  // ═══════════════════════════════════════════════════════════
  // CAMPAIGNS API
  // ═══════════════════════════════════════════════════════════

  /**
   * Get all campaigns with pagination
   */
  async getCampaigns(params?: ListmonkPaginationParams): Promise<ListmonkCampaignsResponse> {
    return this.request<ListmonkCampaignsResponse>(`/api/campaigns${this.buildQueryString(params)}`)
  }

  /**
   * Get campaign by ID
   */
  async getCampaign(id: number): Promise<ListmonkCampaignResponse> {
    return this.request<ListmonkCampaignResponse>(`/api/campaigns/${id}`)
  }

  /**
   * Create new campaign
   */
  async createCampaign(campaign: Omit<ListmonkCampaign, 'id' | 'uuid' | 'created_at' | 'updated_at' | 'sent' | 'views' | 'clicks' | 'bounces' | 'started_at' | 'to_send'>): Promise<ListmonkCampaignResponse> {
    return this.request<ListmonkCampaignResponse>('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    })
  }

  /**
   * Update existing campaign
   */
  async updateCampaign(id: number, updates: Partial<ListmonkCampaign>): Promise<ListmonkCampaignResponse> {
    return this.request<ListmonkCampaignResponse>(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(id: number): Promise<void> {
    await this.request<void>(`/api/campaigns/${id}`, {
      method: 'DELETE',
    })
  }

  /**
   * Start campaign
   */
  async startCampaign(id: number): Promise<ListmonkCampaignResponse> {
    return this.request<ListmonkCampaignResponse>(`/api/campaigns/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'running' }),
    })
  }

  /**
   * Pause campaign
   */
  async pauseCampaign(id: number): Promise<ListmonkCampaignResponse> {
    return this.request<ListmonkCampaignResponse>(`/api/campaigns/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'paused' }),
    })
  }

  /**
   * Cancel campaign
   */
  async cancelCampaign(id: number): Promise<ListmonkCampaignResponse> {
    return this.request<ListmonkCampaignResponse>(`/api/campaigns/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'cancelled' }),
    })
  }

  /**
   * Get campaign stats
   */
  async getCampaignStats(id: number): Promise<ListmonkCampaignStats> {
    const response = await this.getCampaign(id)
    return {
      id: response.data.id!,
      status: response.data.status,
      sent: response.data.sent || 0,
      views: response.data.views || 0,
      clicks: response.data.clicks || 0,
      bounces: response.data.bounces || 0,
      lists: [],
    }
  }

  /**
   * Test campaign (send to test emails)
   */
  async testCampaign(id: number, emails: string[]): Promise<void> {
    await this.request<void>(`/api/campaigns/${id}/test`, {
      method: 'POST',
      body: JSON.stringify({ emails }),
    })
  }

  // ═══════════════════════════════════════════════════════════
  // TRANSACTIONAL EMAILS
  // ═══════════════════════════════════════════════════════════

  /**
   * Send transactional email
   */
  async sendTransactional(params: {
    subscriber_email?: string
    subscriber_id?: number
    template_id: number
    from_email?: string
    data?: Record<string, any>
    headers?: Array<{ [key: string]: string }>
    messenger?: string
    content_type?: 'html' | 'markdown' | 'plain'
  }): Promise<void> {
    await this.request<void>('/api/tx', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  // ═══════════════════════════════════════════════════════════
  // HEALTH CHECK
  // ═══════════════════════════════════════════════════════════

  /**
   * Check Listmonk API health
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      await this.request<any>('/api/health')
      return { status: 'ok' }
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════
// CUSTOM ERROR CLASS
// ═══════════════════════════════════════════════════════════

export class ListmonkAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any,
  ) {
    super(message)
    this.name = 'ListmonkAPIError'
  }
}

// ═══════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════

let listmonkClientInstance: ListmonkClient | null = null

/**
 * Get singleton Listmonk client instance
 */
export function getListmonkClient(): ListmonkClient {
  if (!listmonkClientInstance) {
    listmonkClientInstance = new ListmonkClient()
  }
  return listmonkClientInstance
}

/**
 * Create new Listmonk client with custom options
 */
export function createListmonkClient(options: Partial<ListmonkClientOptions>): ListmonkClient {
  return new ListmonkClient(options)
}
