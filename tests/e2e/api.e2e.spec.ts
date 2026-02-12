import { test, expect } from '@playwright/test'

test.describe('API Endpoints', () => {
  // ===========================================================================
  // Health Check API
  // ===========================================================================
  test('GET /api/health - should return 200 and healthy status', async ({ request }) => {
    const response = await request.get('/api/health')

    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body.status).toBe('healthy')
    expect(body.checks).toBeDefined()
    expect(body.checks.database).toBeDefined()
    expect(body.checks.database.status).toBe('ok')
  })

  test('GET /api/health - should have database latency', async ({ request }) => {
    const response = await request.get('/api/health')
    const body = await response.json()

    expect(body.checks.database.latency).toBeDefined()
    expect(typeof body.checks.database.latency).toBe('number')
    expect(body.checks.database.latency).toBeLessThan(1000) // Less than 1 second
  })

  test('GET /api/health - should have memory info', async ({ request }) => {
    const response = await request.get('/api/health')
    const body = await response.json()

    expect(body.checks.memory).toBeDefined()
    expect(body.checks.memory.status).toMatch(/ok|warning/)
    expect(body.checks.memory.used).toBeGreaterThan(0)
    expect(body.checks.memory.total).toBeGreaterThan(0)
  })

  // ===========================================================================
  // OG Image API
  // ===========================================================================
  test('GET /api/og - should generate OG image', async ({ request }) => {
    const response = await request.get('/api/og?title=Test Title')

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('image')
  })

  test('GET /api/og - should accept title and description', async ({ request }) => {
    const response = await request.get('/api/og?title=Hello&description=World')

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('image')
  })

  test('GET /api/og - should work without parameters', async ({ request }) => {
    const response = await request.get('/api/og')

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('image')
  })

  // ===========================================================================
  // Contact Form API
  // ===========================================================================
  test('POST /api/contact - should validate required fields', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: {},
    })

    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body.error).toBeDefined()
    expect(body.error).toContain('required')
  })

  test('POST /api/contact - should validate email format', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: {
        name: 'Test User',
        email: 'invalid-email',
        message: 'Test message',
      },
    })

    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body.error).toContain('email')
  })

  test('POST /api/contact - should accept valid submission', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: {
        name: 'E2E Test User',
        email: 'test@example.com',
        message: 'This is an E2E test message from Playwright',
        recaptchaToken: 'test-token', // Test environment
      },
    })

    // Should either succeed (200) or fail on reCAPTCHA (403)
    // Both are acceptable in test environment
    expect([200, 403]).toContain(response.status())

    const body = await response.json()

    if (response.status() === 200) {
      expect(body.success).toBe(true)
      expect(body.submissionId).toBeDefined()
    } else {
      // reCAPTCHA verification expected to fail in test
      expect(body.error).toBeDefined()
    }
  })

  // ===========================================================================
  // Payload CMS API
  // ===========================================================================
  test('GET /api/pages - should return pages collection', async ({ request }) => {
    const response = await request.get('/api/pages')

    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body.docs).toBeDefined()
    expect(Array.isArray(body.docs)).toBe(true)
  })

  test('GET /api/pages - should support pagination', async ({ request }) => {
    const response = await request.get('/api/pages?limit=5')

    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body.docs).toBeDefined()
    expect(body.limit).toBe(5)
    expect(body.totalDocs).toBeDefined()
    expect(body.hasNextPage).toBeDefined()
  })

  // ===========================================================================
  // Error Handling
  // ===========================================================================
  test('GET /api/non-existent - should return 404', async ({ request }) => {
    const response = await request.get('/api/non-existent-endpoint-12345')

    expect(response.status()).toBe(404)
  })

  test('GET /api/health - should have correct cache headers', async ({ request }) => {
    const response = await request.get('/api/health')

    const cacheControl = response.headers()['cache-control']
    expect(cacheControl).toContain('no-cache')
  })
})
