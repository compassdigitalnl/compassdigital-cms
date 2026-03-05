/**
 * Listmonk API Types
 *
 * TypeScript type definitions for Listmonk REST API
 * Based on Listmonk v3.x API documentation
 *
 * @see https://listmonk.app/docs/apis/
 */

// ═══════════════════════════════════════════════════════════
// SUBSCRIBER TYPES
// ═══════════════════════════════════════════════════════════

export interface ListmonkSubscriber {
  id?: number
  uuid?: string
  email: string
  name: string
  status: 'enabled' | 'disabled' | 'blocklisted'
  lists: number[]
  attribs: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface ListmonkSubscriberResponse {
  data: ListmonkSubscriber
}

export interface ListmonkSubscribersResponse {
  data: {
    results: ListmonkSubscriber[]
    query: string
    total: number
    per_page: number
    page: number
  }
}

// ═══════════════════════════════════════════════════════════
// LIST TYPES
// ═══════════════════════════════════════════════════════════

export interface ListmonkList {
  id?: number
  uuid?: string
  name: string
  type: 'public' | 'private'
  optin: 'single' | 'double'
  tags: string[]
  description?: string
  created_at?: string
  updated_at?: string
  subscriber_count?: number
}

export interface ListmonkListResponse {
  data: ListmonkList
}

export interface ListmonkListsResponse {
  data: ListmonkList[]
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE TYPES
// ═══════════════════════════════════════════════════════════

export interface ListmonkTemplate {
  id?: number
  name: string
  type: number // 0 = campaign, 1 = transactional
  subject?: string
  body: string
  is_default?: boolean
  created_at?: string
  updated_at?: string
}

export interface ListmonkTemplateResponse {
  data: ListmonkTemplate
}

export interface ListmonkTemplatesResponse {
  data: ListmonkTemplate[]
}

// ═══════════════════════════════════════════════════════════
// CAMPAIGN TYPES
// ═══════════════════════════════════════════════════════════

export interface ListmonkCampaign {
  id?: number
  uuid?: string
  name: string
  subject: string
  from_email?: string
  body: string
  content_type: 'richtext' | 'html' | 'markdown' | 'plain'
  send_at?: string
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'finished' | 'cancelled'
  lists: number[]
  tags?: string[]
  template_id?: number
  messenger?: string
  type: 'regular' | 'optin'
  headers?: Array<{ [key: string]: string }>

  // Stats (read-only)
  sent?: number
  views?: number
  clicks?: number
  bounces?: number
  started_at?: string
  to_send?: number
  created_at?: string
  updated_at?: string
}

export interface ListmonkCampaignResponse {
  data: ListmonkCampaign
}

export interface ListmonkCampaignsResponse {
  data: {
    results: ListmonkCampaign[]
    query: string
    total: number
    per_page: number
    page: number
  }
}

// ═══════════════════════════════════════════════════════════
// CAMPAIGN ANALYTICS TYPES
// ═══════════════════════════════════════════════════════════

export interface ListmonkCampaignStats {
  id: number
  status: string
  sent: number
  views: number
  clicks: number
  bounces: number
  lists: Array<{
    id: number
    name: string
  }>
}

export interface ListmonkCampaignView {
  id: number
  campaign_id: number
  subscriber_id: number
  created_at: string
}

export interface ListmonkCampaignClick {
  id: number
  campaign_id: number
  subscriber_id: number
  link_id: number
  url: string
  created_at: string
}

export interface ListmonkCampaignBounce {
  id: number
  campaign_id: number
  subscriber_id: number
  type: 'hard' | 'soft' | 'complaint'
  source: string
  meta: Record<string, any>
  created_at: string
}

// ═══════════════════════════════════════════════════════════
// API ERROR TYPES
// ═══════════════════════════════════════════════════════════

export interface ListmonkError {
  message: string
  data?: any
}

export interface ListmonkErrorResponse {
  error: ListmonkError
}

// ═══════════════════════════════════════════════════════════
// API REQUEST OPTIONS
// ═══════════════════════════════════════════════════════════

export interface ListmonkClientOptions {
  baseUrl: string
  username: string
  password: string
  timeout?: number
}

export interface ListmonkPaginationParams {
  page?: number
  per_page?: number
  order_by?: string
  order?: 'asc' | 'desc'
  query?: string
}

// ═══════════════════════════════════════════════════════════
// WEBHOOK PAYLOAD TYPES
// ═══════════════════════════════════════════════════════════

export type ListmonkWebhookEvent =
  | 'campaign.sent'
  | 'campaign.bounced'
  | 'campaign.link_clicked'
  | 'subscriber.created'
  | 'subscriber.updated'
  | 'subscriber.optin'
  | 'subscriber.blocklisted'

export interface ListmonkWebhookPayload {
  event: ListmonkWebhookEvent
  timestamp: string
  data: {
    campaign_id?: number
    subscriber_id?: number
    email?: string
    link?: string
    bounce_type?: 'hard' | 'soft' | 'complaint'
    [key: string]: any
  }
}
