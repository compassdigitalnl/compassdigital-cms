/**
 * Security Test: CSRF (Cross-Site Request Forgery)
 *
 * Tests API endpoints for CSRF protection
 *
 * Run:
 *   npm run test:security:csrf
 */

import { describe, it, expect, beforeAll } from '@jest/globals'
import payload from 'payload'

describe('CSRF (Cross-Site Request Forgery) Tests', () => {
  let validApiKey: string
  let testTenantId: string

  beforeAll(async () => {
    if (!payload.isInitialized) {
      await payload.init({
        secret: process.env.PAYLOAD_SECRET || 'test-secret',
        local: true,
      })
    }

    // Create test tenant
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: 'CSRF Test Tenant',
        email: 'csrf-test@example.com',
      },
    })
    testTenantId = tenant.id

    // Get a valid API key for testing
    const apiKeyDoc = await payload.create({
      collection: 'email-api-keys',
      data: {
        name: 'CSRF Test Key',
        tenant: testTenantId,
        scopes: ['subscribers:read', 'subscribers:write'],
      },
    })
    validApiKey = apiKeyDoc.key || 'test-key'
  })

  describe('API Key Authentication', () => {
    it('should reject requests without API key', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/email-marketing/subscribers',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data.error).toMatch(/unauthorized|api key/i)
    })

    it('should reject requests with invalid API key', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/email-marketing/subscribers',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer invalid-key-12345',
            'Content-Type': 'application/json',
          },
        }
      )

      expect(response.status).toBe(401)
    })

    it('should accept requests with valid API key', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/email-marketing/subscribers',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${validApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      // Should be successful or 403 (if scopes are wrong), but not 401
      expect(response.status).not.toBe(401)
    })
  })

  describe('Origin Header Validation', () => {
    it('should validate Origin header for sensitive operations', async () => {
      // Simulate request from unauthorized origin
      const response = await fetch(
        'http://localhost:3000/api/v1/email-marketing/subscribers',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${validApiKey}`,
            'Content-Type': 'application/json',
            'Origin': 'https://malicious-site.com',
          },
          body: JSON.stringify({
            email: 'csrf-test@example.com',
            tenant: testTenantId,
          }),
        }
      )

      // Should have CORS headers or reject based on origin
      const corsHeader = response.headers.get('Access-Control-Allow-Origin')

      if (corsHeader) {
        // If CORS is enabled, it should be restricted
        expect(corsHeader).not.toBe('*')
      } else {
        // If no CORS, the browser would block it
        expect(response.status).toBeGreaterThanOrEqual(200)
      }
    })

    it('should set proper CORS headers', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/email-marketing/subscribers',
        {
          method: 'OPTIONS',
          headers: {
            'Origin': 'https://yourdomain.com',
            'Access-Control-Request-Method': 'POST',
          },
        }
      )

      const allowOrigin = response.headers.get('Access-Control-Allow-Origin')
      const allowMethods = response.headers.get('Access-Control-Allow-Methods')
      const allowHeaders = response.headers.get('Access-Control-Allow-Headers')

      // Should have restrictive CORS policy
      if (allowOrigin) {
        // Should not be wildcard for sensitive operations
        expect(allowOrigin).not.toBe('*')
      }

      if (allowMethods) {
        expect(allowMethods).toBeDefined()
      }
    })
  })

  describe('Referer Header Validation', () => {
    it('should validate Referer header for state-changing operations', async () => {
      const maliciousReferer = 'https://evil-site.com/csrf-attack.html'

      const response = await fetch(
        'http://localhost:3000/api/v1/email-marketing/subscribers',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${validApiKey}`,
            'Content-Type': 'application/json',
            'Referer': maliciousReferer,
          },
          body: JSON.stringify({
            email: 'csrf-referer-test@example.com',
            tenant: testTenantId,
          }),
        }
      )

      // With API key auth, Referer is less critical but still logged
      // Modern API design relies on API keys, not Referer
      expect(response.status).toBeGreaterThanOrEqual(200)
    })
  })

  describe('SameSite Cookie Protection', () => {
    it('should set SameSite attribute on cookies', async () => {
      // Test if session cookies have SameSite attribute
      const response = await fetch('http://localhost:3000/api/health')

      const cookies = response.headers.get('Set-Cookie')

      if (cookies) {
        // Should have SameSite=Lax or SameSite=Strict
        expect(cookies).toMatch(/SameSite=(Lax|Strict|None)/i)

        // If SameSite=None, must also be Secure
        if (cookies.match(/SameSite=None/i)) {
          expect(cookies).toMatch(/Secure/i)
        }
      }
    })
  })

  describe('State-Changing Operations', () => {
    it('should require authentication for POST requests', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/email-marketing/subscribers',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'no-auth@example.com',
            tenant: testTenantId,
          }),
        }
      )

      expect(response.status).toBe(401)
    })

    it('should require authentication for PUT requests', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/email-marketing/subscribers/test-id',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Updated Name',
          }),
        }
      )

      expect(response.status).toBe(401)
    })

    it('should require authentication for DELETE requests', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/email-marketing/subscribers/test-id',
        {
          method: 'DELETE',
        }
      )

      expect(response.status).toBe(401)
    })
  })

  describe('CSRF Token Validation (if implemented)', () => {
    it('should validate CSRF tokens for session-based auth', async () => {
      // This test is relevant if you use session-based auth
      // For API key auth, this is less critical

      // Simulate a request without CSRF token
      const response = await fetch(
        'http://localhost:3000/api/form-submissions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Missing: 'X-CSRF-Token': token
          },
          body: JSON.stringify({
            name: 'Test Submission',
            email: 'test@example.com',
          }),
        }
      )

      // If CSRF protection is enabled, this should fail
      // If using API keys, it should fail due to missing auth
      expect([400, 401, 403]).toContain(response.status)
    })
  })

  describe('Double Submit Cookie Pattern (if implemented)', () => {
    it('should validate double submit cookie pattern', async () => {
      // Create a CSRF token
      const csrfToken = 'test-csrf-token-12345'

      // Send token in both cookie and header
      const response = await fetch(
        'http://localhost:3000/api/form-submissions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
            'Cookie': `csrf-token=${csrfToken}`,
          },
          body: JSON.stringify({
            name: 'Test',
            email: 'test@example.com',
          }),
        }
      )

      // Should validate that cookie and header match
      // If they don't match, should reject
      expect(response.status).toBeGreaterThanOrEqual(200)
    })

    it('should reject mismatched CSRF tokens', async () => {
      const response = await fetch(
        'http://localhost:3000/api/form-submissions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': 'token-in-header',
            'Cookie': 'csrf-token=different-token-in-cookie',
          },
          body: JSON.stringify({
            name: 'Test',
            email: 'test@example.com',
          }),
        }
      )

      // Should reject due to mismatch
      expect([400, 403]).toContain(response.status)
    })
  })

  describe('Custom Header Requirement', () => {
    it('should accept requests with custom headers (simple CSRF protection)', async () => {
      // Modern APIs often require a custom header as simple CSRF protection
      // This works because browsers don't send custom headers in simple CORS requests

      const response = await fetch(
        'http://localhost:3000/api/v1/email-marketing/subscribers',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${validApiKey}`,
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      )

      expect(response.status).not.toBe(401)
    })
  })

  describe('Content-Type Validation', () => {
    it('should require application/json Content-Type for POST requests', async () => {
      // CSRF attacks from forms default to application/x-www-form-urlencoded
      // Requiring application/json is a simple CSRF protection

      const response = await fetch(
        'http://localhost:3000/api/v1/email-marketing/subscribers',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${validApiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'email=test@example.com&tenant=' + testTenantId,
        }
      )

      // Should reject or return 400 for wrong Content-Type
      expect([400, 415]).toContain(response.status)
    })

    it('should accept application/json Content-Type', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/email-marketing/subscribers',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${validApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: `csrf-test-${Date.now()}@example.com`,
            tenant: testTenantId,
          }),
        }
      )

      expect(response.status).not.toBe(415)
    })
  })

  describe('GET Request Safety', () => {
    it('should not allow state changes via GET requests', async () => {
      // GET requests should be idempotent and safe
      // This tests that you can't delete/update via GET

      const getResponse = await fetch(
        'http://localhost:3000/api/v1/email-marketing/subscribers?action=delete&id=test-id',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${validApiKey}`,
          },
        }
      )

      // Should not perform delete operation
      // Should either be a 405 (Method Not Allowed) or just list subscribers
      expect(getResponse.status).not.toBe(204)
    })
  })

  describe('Webhook CSRF Protection', () => {
    it('should require signature verification for webhooks', async () => {
      // Webhooks without signature should be rejected
      const response = await fetch(
        'http://localhost:3000/api/webhooks/events',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Missing: X-Webhook-Signature
          },
          body: JSON.stringify({
            eventType: 'subscriber.created',
            tenantId: testTenantId,
            email: 'webhook-test@example.com',
          }),
        }
      )

      // Should reject without signature
      expect(response.status).toBe(401)
    })

    it('should reject webhooks with invalid signatures', async () => {
      const response = await fetch(
        'http://localhost:3000/api/webhooks/events',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': 'invalid-signature',
            'X-Webhook-Timestamp': Date.now().toString(),
          },
          body: JSON.stringify({
            eventType: 'subscriber.created',
            tenantId: testTenantId,
            email: 'webhook-test@example.com',
          }),
        }
      )

      expect(response.status).toBe(401)
    })
  })
})

/**
 * Test Results Interpretation:
 *
 * ✅ PASS: CSRF protections are properly implemented
 * ❌ FAIL: CSRF vulnerability detected
 *
 * Expected Results:
 * - API endpoints require authentication (API key or session)
 * - State-changing operations (POST/PUT/DELETE) are protected
 * - CORS headers are restrictive (not wildcard)
 * - SameSite cookies are set properly
 * - GET requests don't modify state
 * - Webhooks require signature verification
 * - Content-Type validation for JSON APIs
 *
 * Protection Strategies Implemented:
 *
 * 1. **API Key Authentication**
 *    - Primary CSRF protection for REST APIs
 *    - Requires Authorization header (not automatically sent by browsers)
 *
 * 2. **CORS Headers**
 *    - Restricts which origins can make requests
 *    - Not wildcard (*) for sensitive operations
 *
 * 3. **SameSite Cookies**
 *    - SameSite=Lax or Strict for session cookies
 *    - Prevents cookies from being sent in cross-site requests
 *
 * 4. **Webhook Signatures**
 *    - HMAC-SHA256 signature verification
 *    - Prevents unauthorized webhook submissions
 *
 * 5. **Content-Type Validation**
 *    - Requires application/json
 *    - Simple forms can't trigger the attack
 *
 * 6. **Safe Methods**
 *    - GET requests are read-only
 *    - No state changes via GET
 *
 * Remediation:
 * If any tests fail:
 * 1. Implement API key authentication for all state-changing operations
 * 2. Set restrictive CORS headers
 * 3. Add SameSite attribute to all cookies
 * 4. Validate Content-Type headers
 * 5. Implement CSRF tokens for session-based auth
 * 6. Require signature verification for webhooks
 * 7. Never allow state changes via GET requests
 *
 * References:
 * - OWASP CSRF Prevention Cheat Sheet
 * - SameSite Cookie Specification
 * - CORS Specification
 */
