/**
 * Listmonk Client with Retry Logic
 *
 * Wrapper around ListmonkClient that adds automatic retry logic
 * for transient failures (network issues, rate limits, server errors)
 */

import { ListmonkClient, ListmonkAPIError } from './client'
import { executeWithRetry, classifyError, type RetryConfig } from '../error-handling/ErrorHandler'
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
  ListmonkPaginationParams,
} from '@/types/listmonk'

/**
 * Resilient Listmonk Client with automatic retry logic
 */
export class ResilientListmonkClient {
  private client: ListmonkClient

  constructor(client?: ListmonkClient) {
    this.client = client || new ListmonkClient()
  }

  // ═══════════════════════════════════════════════════════════
  // SUBSCRIBERS - WITH RETRY LOGIC
  // ═══════════════════════════════════════════════════════════

  /**
   * Create subscriber with retry logic
   */
  async createSubscriber(
    subscriber: ListmonkSubscriber,
    context?: Record<string, any>,
  ): Promise<ListmonkSubscriberResponse> {
    return executeWithRetry(
      () => this.client.createSubscriber(subscriber),
      { operation: 'createSubscriber', email: subscriber.email, ...context },
    )
  }

  /**
   * Get subscriber by ID with retry logic
   */
  async getSubscriber(id: number, context?: Record<string, any>): Promise<ListmonkSubscriberResponse> {
    return executeWithRetry(
      () => this.client.getSubscriber(id),
      { operation: 'getSubscriber', subscriberId: id, ...context },
    )
  }

  /**
   * Update subscriber with retry logic
   */
  async updateSubscriber(
    id: number,
    updates: Partial<ListmonkSubscriber>,
    context?: Record<string, any>,
  ): Promise<ListmonkSubscriberResponse> {
    return executeWithRetry(
      () => this.client.updateSubscriber(id, updates),
      { operation: 'updateSubscriber', subscriberId: id, ...context },
    )
  }

  /**
   * Delete subscriber with retry logic
   */
  async deleteSubscriber(id: number, context?: Record<string, any>): Promise<void> {
    return executeWithRetry(
      () => this.client.deleteSubscriber(id),
      { operation: 'deleteSubscriber', subscriberId: id, ...context },
    )
  }

  /**
   * List subscribers with retry logic
   */
  async listSubscribers(
    params?: ListmonkPaginationParams,
    context?: Record<string, any>,
  ): Promise<ListmonkSubscribersResponse> {
    return executeWithRetry(
      () => this.client.listSubscribers(params),
      { operation: 'listSubscribers', params, ...context },
    )
  }

  /**
   * Search subscribers with retry logic
   */
  async searchSubscribers(
    query: string,
    listIds?: number[],
    context?: Record<string, any>,
  ): Promise<ListmonkSubscribersResponse> {
    return executeWithRetry(
      () => this.client.searchSubscribers(query, listIds),
      { operation: 'searchSubscribers', query, listIds, ...context },
    )
  }

  /**
   * Block subscriber with retry logic
   */
  async blockSubscriber(id: number, context?: Record<string, any>): Promise<void> {
    return executeWithRetry(
      () => this.client.blockSubscriber(id),
      { operation: 'blockSubscriber', subscriberId: id, ...context },
    )
  }

  // ═══════════════════════════════════════════════════════════
  // LISTS - WITH RETRY LOGIC
  // ═══════════════════════════════════════════════════════════

  /**
   * Create list with retry logic
   */
  async createList(list: Omit<ListmonkList, 'id'>, context?: Record<string, any>): Promise<ListmonkListResponse> {
    return executeWithRetry(
      () => this.client.createList(list),
      { operation: 'createList', listName: list.name, ...context },
    )
  }

  /**
   * Get list by ID with retry logic
   */
  async getList(id: number, context?: Record<string, any>): Promise<ListmonkListResponse> {
    return executeWithRetry(
      () => this.client.getList(id),
      { operation: 'getList', listId: id, ...context },
    )
  }

  /**
   * Update list with retry logic
   */
  async updateList(
    id: number,
    updates: Partial<ListmonkList>,
    context?: Record<string, any>,
  ): Promise<ListmonkListResponse> {
    return executeWithRetry(
      () => this.client.updateList(id, updates),
      { operation: 'updateList', listId: id, ...context },
    )
  }

  /**
   * Delete list with retry logic
   */
  async deleteList(id: number, context?: Record<string, any>): Promise<void> {
    return executeWithRetry(
      () => this.client.deleteList(id),
      { operation: 'deleteList', listId: id, ...context },
    )
  }

  /**
   * List all lists with retry logic
   */
  async listLists(params?: ListmonkPaginationParams, context?: Record<string, any>): Promise<ListmonkListsResponse> {
    return executeWithRetry(
      () => this.client.listLists(params),
      { operation: 'listLists', params, ...context },
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TEMPLATES - WITH RETRY LOGIC
  // ═══════════════════════════════════════════════════════════

  /**
   * Create template with retry logic
   */
  async createTemplate(
    template: Omit<ListmonkTemplate, 'id'>,
    context?: Record<string, any>,
  ): Promise<ListmonkTemplateResponse> {
    return executeWithRetry(
      () => this.client.createTemplate(template),
      { operation: 'createTemplate', templateName: template.name, ...context },
    )
  }

  /**
   * Get template by ID with retry logic
   */
  async getTemplate(id: number, context?: Record<string, any>): Promise<ListmonkTemplateResponse> {
    return executeWithRetry(
      () => this.client.getTemplate(id),
      { operation: 'getTemplate', templateId: id, ...context },
    )
  }

  /**
   * Update template with retry logic
   */
  async updateTemplate(
    id: number,
    updates: Partial<ListmonkTemplate>,
    context?: Record<string, any>,
  ): Promise<ListmonkTemplateResponse> {
    return executeWithRetry(
      () => this.client.updateTemplate(id, updates),
      { operation: 'updateTemplate', templateId: id, ...context },
    )
  }

  /**
   * Delete template with retry logic
   */
  async deleteTemplate(id: number, context?: Record<string, any>): Promise<void> {
    return executeWithRetry(
      () => this.client.deleteTemplate(id),
      { operation: 'deleteTemplate', templateId: id, ...context },
    )
  }

  /**
   * List templates with retry logic
   */
  async listTemplates(
    params?: ListmonkPaginationParams,
    context?: Record<string, any>,
  ): Promise<ListmonkTemplatesResponse> {
    return executeWithRetry(
      () => this.client.listTemplates(params),
      { operation: 'listTemplates', params, ...context },
    )
  }

  // ═══════════════════════════════════════════════════════════
  // CAMPAIGNS - WITH RETRY LOGIC
  // ═══════════════════════════════════════════════════════════

  /**
   * Create campaign with retry logic
   */
  async createCampaign(
    campaign: Omit<ListmonkCampaign, 'id'>,
    context?: Record<string, any>,
  ): Promise<ListmonkCampaignResponse> {
    return executeWithRetry(
      () => this.client.createCampaign(campaign),
      { operation: 'createCampaign', campaignName: campaign.name, ...context },
    )
  }

  /**
   * Get campaign by ID with retry logic
   */
  async getCampaign(id: number, context?: Record<string, any>): Promise<ListmonkCampaignResponse> {
    return executeWithRetry(
      () => this.client.getCampaign(id),
      { operation: 'getCampaign', campaignId: id, ...context },
    )
  }

  /**
   * Update campaign with retry logic
   */
  async updateCampaign(
    id: number,
    updates: Partial<ListmonkCampaign>,
    context?: Record<string, any>,
  ): Promise<ListmonkCampaignResponse> {
    return executeWithRetry(
      () => this.client.updateCampaign(id, updates),
      { operation: 'updateCampaign', campaignId: id, ...context },
    )
  }

  /**
   * Delete campaign with retry logic
   */
  async deleteCampaign(id: number, context?: Record<string, any>): Promise<void> {
    return executeWithRetry(
      () => this.client.deleteCampaign(id),
      { operation: 'deleteCampaign', campaignId: id, ...context },
    )
  }

  /**
   * List campaigns with retry logic
   */
  async listCampaigns(
    params?: ListmonkPaginationParams,
    context?: Record<string, any>,
  ): Promise<ListmonkCampaignsResponse> {
    return executeWithRetry(
      () => this.client.listCampaigns(params),
      { operation: 'listCampaigns', params, ...context },
    )
  }

  /**
   * Start campaign with retry logic
   */
  async startCampaign(id: number, context?: Record<string, any>): Promise<void> {
    return executeWithRetry(
      () => this.client.startCampaign(id),
      { operation: 'startCampaign', campaignId: id, ...context },
      // Custom retry config for campaign start (less aggressive)
      {
        maxAttempts: 3,
        baseDelay: 5000,
      },
    )
  }

  /**
   * Pause campaign with retry logic
   */
  async pauseCampaign(id: number, context?: Record<string, any>): Promise<void> {
    return executeWithRetry(
      () => this.client.pauseCampaign(id),
      { operation: 'pauseCampaign', campaignId: id, ...context },
    )
  }

  /**
   * Cancel campaign with retry logic
   */
  async cancelCampaign(id: number, context?: Record<string, any>): Promise<void> {
    return executeWithRetry(
      () => this.client.cancelCampaign(id),
      { operation: 'cancelCampaign', campaignId: id, ...context },
    )
  }

  /**
   * Get campaign stats with retry logic
   */
  async getCampaignStats(id: number, context?: Record<string, any>): Promise<ListmonkCampaignStats> {
    return executeWithRetry(
      () => this.client.getCampaignStats(id),
      { operation: 'getCampaignStats', campaignId: id, ...context },
    )
  }

  // ═══════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════

  /**
   * Health check with retry logic
   */
  async healthCheck(context?: Record<string, any>): Promise<{ status: 'ok' | 'error'; message?: string }> {
    return executeWithRetry(
      () => this.client.healthCheck(),
      { operation: 'healthCheck', ...context },
      {
        maxAttempts: 3,
        baseDelay: 1000,
      },
    )
  }
}

/**
 * Create a resilient Listmonk client instance
 */
export function createResilientListmonkClient(): ResilientListmonkClient {
  return new ResilientListmonkClient()
}

/**
 * Export singleton instance for convenience
 */
export const resilientListmonk = createResilientListmonkClient()
