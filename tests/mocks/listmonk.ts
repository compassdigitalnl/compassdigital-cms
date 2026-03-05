/**
 * Listmonk API Mocks
 *
 * Mock responses for testing Listmonk integration
 *
 * @see docs/mail-engine/MASTER_IMPLEMENTATIEPLAN_v1.md
 */

import type {
  ListmonkSubscriber,
  ListmonkSubscriberResponse,
  ListmonkSubscribersResponse,
  ListmonkList,
  ListmonkListResponse,
  ListmonkListsResponse,
  ListmonkCampaign,
  ListmonkCampaignResponse,
  ListmonkCampaignsResponse,
  ListmonkTemplate,
  ListmonkTemplateResponse,
  ListmonkTemplatesResponse,
  ListmonkErrorResponse,
} from '@/features/email-marketing/types/listmonk'

// ═══════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════

export const mockSubscriber: ListmonkSubscriber = {
  id: 1,
  uuid: 'test-subscriber-uuid-123',
  email: 'test@example.com',
  name: 'Test User',
  status: 'enabled',
  lists: [1],
  attribs: {
    tenant_id: 'test-tenant',
    source: 'website',
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockList: ListmonkList = {
  id: 1,
  uuid: 'test-list-uuid-456',
  name: 'Test Newsletter',
  type: 'public',
  optin: 'single',
  tags: ['newsletter', 'test'],
  description: 'Test newsletter list',
  subscriber_count: 150,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockCampaign: ListmonkCampaign = {
  id: 1,
  uuid: 'test-campaign-uuid-789',
  name: 'January Newsletter',
  subject: 'Welcome to our January Newsletter!',
  from_email: 'newsletter@example.com',
  body: '<h1>Hello!</h1><p>Welcome to our newsletter.</p>',
  content_type: 'html',
  send_at: '2024-01-15T10:00:00Z',
  status: 'draft',
  lists: [1],
  tags: ['monthly', 'newsletter'],
  template_id: 1,
  type: 'regular',
  sent: 0,
  views: 0,
  clicks: 0,
  bounces: 0,
  to_send: 150,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockTemplate: ListmonkTemplate = {
  id: 1,
  name: 'Default Newsletter',
  type: 0, // 0 = campaign template
  subject: '{{ .Campaign.Subject }}',
  body: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <h1>{{ .Campaign.Subject }}</h1>
        {{ .Campaign.Body }}
        <hr>
        <p><a href="{{ .UnsubscribeURL }}">Unsubscribe</a></p>
      </body>
    </html>
  `,
  is_default: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// ═══════════════════════════════════════════════════════════
// MOCK API RESPONSES
// ═══════════════════════════════════════════════════════════

export const mockSubscriberResponse: ListmonkSubscriberResponse = {
  data: mockSubscriber,
}

export const mockSubscribersResponse: ListmonkSubscribersResponse = {
  data: {
    results: [mockSubscriber],
    query: '',
    total: 1,
    per_page: 20,
    page: 1,
  },
}

export const mockListResponse: ListmonkListResponse = {
  data: mockList,
}

export const mockListsResponse: ListmonkListsResponse = {
  data: [mockList],
}

export const mockCampaignResponse: ListmonkCampaignResponse = {
  data: mockCampaign,
}

export const mockCampaignsResponse: ListmonkCampaignsResponse = {
  data: {
    results: [mockCampaign],
    query: '',
    total: 1,
    per_page: 20,
    page: 1,
  },
}

export const mockTemplateResponse: ListmonkTemplateResponse = {
  data: mockTemplate,
}

export const mockTemplatesResponse: ListmonkTemplatesResponse = {
  data: [mockTemplate],
}

export const mockErrorResponse: ListmonkErrorResponse = {
  error: {
    message: 'Test error message',
    data: null,
  },
}

// ═══════════════════════════════════════════════════════════
// MOCK FETCH FUNCTION
// ═══════════════════════════════════════════════════════════

/**
 * Mock fetch function for Listmonk API calls
 * Use with vi.fn() or jest.fn()
 *
 * Example usage:
 * ```ts
 * global.fetch = vi.fn(mockListmonkFetch)
 * ```
 */
export async function mockListmonkFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const url = typeof input === 'string' ? input : input.toString()

  // Parse URL to determine endpoint
  const urlObj = new URL(url)
  const path = urlObj.pathname

  // Mock subscriber endpoints
  if (path.includes('/api/subscribers') && init?.method === 'POST') {
    return new Response(JSON.stringify(mockSubscriberResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (path.includes('/api/subscribers') && init?.method === 'GET') {
    return new Response(JSON.stringify(mockSubscribersResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (path.match(/\/api\/subscribers\/\d+/) && init?.method === 'PUT') {
    return new Response(JSON.stringify(mockSubscriberResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (path.match(/\/api\/subscribers\/\d+/) && init?.method === 'DELETE') {
    return new Response(JSON.stringify({ data: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Mock list endpoints
  if (path.includes('/api/lists') && init?.method === 'POST') {
    return new Response(JSON.stringify(mockListResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (path.includes('/api/lists') && init?.method === 'GET') {
    return new Response(JSON.stringify(mockListsResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Mock campaign endpoints
  if (path.includes('/api/campaigns') && init?.method === 'POST') {
    return new Response(JSON.stringify(mockCampaignResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (path.includes('/api/campaigns') && init?.method === 'GET') {
    return new Response(JSON.stringify(mockCampaignsResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (path.match(/\/api\/campaigns\/\d+\/status/) && init?.method === 'PUT') {
    return new Response(JSON.stringify(mockCampaignResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Mock template endpoints
  if (path.includes('/api/templates') && init?.method === 'GET') {
    return new Response(JSON.stringify(mockTemplatesResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Mock health check
  if (path.includes('/api/health')) {
    return new Response(JSON.stringify({ data: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Default: return 404
  return new Response(JSON.stringify(mockErrorResponse), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  })
}

// ═══════════════════════════════════════════════════════════
// MOCK LISTMONK CLIENT
// ═══════════════════════════════════════════════════════════

/**
 * Mock Listmonk client for unit tests
 * Use this instead of the real Listmonk client to avoid network calls
 *
 * Example usage:
 * ```ts
 * import { mockListmonkClient } from '@/tests/mocks/listmonk'
 *
 * const result = await mockListmonkClient.createSubscriber({ email: 'test@example.com' })
 * ```
 */
export const mockListmonkClient = {
  // Subscribers
  createSubscriber: async (data: Partial<ListmonkSubscriber>) => ({
    ...mockSubscriberResponse,
    data: { ...mockSubscriber, ...data },
  }),

  getSubscriber: async (id: number) => mockSubscriberResponse,

  updateSubscriber: async (id: number, data: Partial<ListmonkSubscriber>) => ({
    ...mockSubscriberResponse,
    data: { ...mockSubscriber, id, ...data },
  }),

  deleteSubscriber: async (id: number) => ({ data: true }),

  getSubscribers: async () => mockSubscribersResponse,

  // Lists
  createList: async (data: Partial<ListmonkList>) => ({
    ...mockListResponse,
    data: { ...mockList, ...data },
  }),

  getList: async (id: number) => mockListResponse,

  getLists: async () => mockListsResponse,

  // Campaigns
  createCampaign: async (data: Partial<ListmonkCampaign>) => ({
    ...mockCampaignResponse,
    data: { ...mockCampaign, ...data },
  }),

  getCampaign: async (id: number) => mockCampaignResponse,

  getCampaigns: async () => mockCampaignsResponse,

  updateCampaignStatus: async (id: number, status: string) => ({
    ...mockCampaignResponse,
    data: { ...mockCampaign, id, status },
  }),

  // Templates
  getTemplates: async () => mockTemplatesResponse,

  getTemplate: async (id: number) => mockTemplateResponse,

  // Health
  healthCheck: async () => ({ data: true }),
}

// ═══════════════════════════════════════════════════════════
// VITEST/JEST SETUP HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Setup mock for Vitest/Jest tests
 * Call this in beforeEach() hook
 *
 * Example:
 * ```ts
 * import { setupListmonkMocks } from '@/tests/mocks/listmonk'
 * import { vi } from 'vitest'
 *
 * beforeEach(() => {
 *   setupListmonkMocks(vi)
 * })
 * ```
 */
export function setupListmonkMocks(mockFramework: any): void {
  global.fetch = mockFramework.fn(mockListmonkFetch)
}

/**
 * Reset all mocks
 * Call this in afterEach() hook
 */
export function resetListmonkMocks(mockFramework: any): void {
  mockFramework.restoreAllMocks()
}

// ═══════════════════════════════════════════════════════════
// ERROR SCENARIOS
// ═══════════════════════════════════════════════════════════

/**
 * Mock network error
 */
export async function mockNetworkError(): Promise<Response> {
  throw new Error('Network error: Failed to fetch')
}

/**
 * Mock 401 Unauthorized
 */
export async function mock401Error(): Promise<Response> {
  return new Response(
    JSON.stringify({
      error: {
        message: 'Unauthorized',
        data: null,
      },
    }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    },
  )
}

/**
 * Mock 500 Server Error
 */
export async function mock500Error(): Promise<Response> {
  return new Response(
    JSON.stringify({
      error: {
        message: 'Internal server error',
        data: null,
      },
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    },
  )
}

/**
 * Mock rate limit error (429)
 */
export async function mockRateLimitError(): Promise<Response> {
  return new Response(
    JSON.stringify({
      error: {
        message: 'Too many requests',
        data: null,
      },
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '60',
      },
    },
  )
}
