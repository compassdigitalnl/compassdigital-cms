/**
 * Security Test: SQL Injection
 *
 * Tests all user inputs for SQL injection vulnerabilities
 *
 * Run:
 *   npm run test:security:sql
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import payload from 'payload'

// Common SQL injection payloads
const SQL_INJECTION_PAYLOADS = [
  // Classic SQL injection
  "' OR '1'='1",
  "' OR '1'='1' --",
  "' OR '1'='1' /*",
  "admin' --",
  "admin' #",
  "admin'/*",
  "' or 1=1--",
  "' or 1=1#",
  "' or 1=1/*",

  // Union-based injection
  "' UNION SELECT NULL--",
  "' UNION SELECT NULL, NULL--",
  "' UNION SELECT NULL, NULL, NULL--",

  // Stacked queries
  "'; DROP TABLE users--",
  "'; DELETE FROM users--",
  "'; UPDATE users SET password='hacked'--",

  // Time-based blind injection
  "' OR SLEEP(5)--",
  "' OR pg_sleep(5)--",

  // Boolean-based blind injection
  "' AND 1=1--",
  "' AND 1=2--",

  // Advanced payloads
  "1' AND '1'='1",
  "1' AND '1'='2",
  "1 AND 1=1",
  "1 AND 1=2",

  // NoSQL injection attempts (for completeness)
  "{ $gt: '' }",
  "{ $ne: null }",
  "'; return true; var x='",
]

describe('SQL Injection Tests', () => {
  let testTenantId: string

  beforeAll(async () => {
    // Initialize Payload if not already initialized
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
        name: 'SQL Injection Test Tenant',
        email: 'sql-test@example.com',
      },
    })
    testTenantId = tenant.id
  })

  afterAll(async () => {
    // Cleanup: delete test tenant
    if (testTenantId) {
      await payload.delete({
        collection: 'tenants',
        id: testTenantId,
      })
    }
  })

  describe('EmailSubscriber Collection', () => {
    it('should sanitize email input', async () => {
      for (const payload_data of SQL_INJECTION_PAYLOADS) {
        const startTime = Date.now()

        try {
          await payload.create({
            collection: 'email-subscribers',
            data: {
              email: payload_data,
              tenant: testTenantId,
            },
          })
        } catch (error) {
          // Expected: validation error, not SQL error
          expect(error.message).not.toMatch(/sql|syntax|query/i)
        }

        const endTime = Date.now()
        const duration = endTime - startTime

        // Check for time-based attacks (shouldn't delay more than 1 second)
        expect(duration).toBeLessThan(1000)
      }
    })

    it('should sanitize name input', async () => {
      for (const payload_data of SQL_INJECTION_PAYLOADS) {
        try {
          await payload.create({
            collection: 'email-subscribers',
            data: {
              email: 'test@example.com',
              name: payload_data,
              tenant: testTenantId,
            },
          })
        } catch (error) {
          // Expected: validation error, not SQL error
          expect(error.message).not.toMatch(/sql|syntax|query/i)
        }
      }
    })

    it('should sanitize search queries', async () => {
      for (const query of SQL_INJECTION_PAYLOADS) {
        const startTime = Date.now()

        try {
          await payload.find({
            collection: 'email-subscribers',
            where: {
              email: {
                contains: query,
              },
            },
          })
        } catch (error) {
          // Should not throw SQL errors
          expect(error.message).not.toMatch(/sql|syntax|query/i)
        }

        const endTime = Date.now()
        const duration = endTime - startTime

        // Check for time-based attacks
        expect(duration).toBeLessThan(1000)
      }
    })
  })

  describe('EmailCampaign Collection', () => {
    it('should sanitize campaign name', async () => {
      for (const payload_data of SQL_INJECTION_PAYLOADS) {
        try {
          await payload.create({
            collection: 'email-campaigns',
            data: {
              name: payload_data,
              subject: 'Test Subject',
              tenant: testTenantId,
            },
          })
        } catch (error) {
          expect(error.message).not.toMatch(/sql|syntax|query/i)
        }
      }
    })

    it('should sanitize subject line', async () => {
      for (const payload_data of SQL_INJECTION_PAYLOADS) {
        try {
          await payload.create({
            collection: 'email-campaigns',
            data: {
              name: 'Test Campaign',
              subject: payload_data,
              tenant: testTenantId,
            },
          })
        } catch (error) {
          expect(error.message).not.toMatch(/sql|syntax|query/i)
        }
      }
    })
  })

  describe('API Endpoints', () => {
    it('should sanitize API query parameters', async () => {
      const testEndpoint = async (query: string) => {
        const url = new URL(`http://localhost:3000/api/v1/email-marketing/subscribers`)
        url.searchParams.set('where[email][contains]', query)

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer test-api-key`,
          },
        })

        // Should return valid response, not SQL error
        expect(response.status).not.toBe(500)

        if (response.status === 400) {
          const data = await response.json()
          expect(data.error).not.toMatch(/sql|syntax|query/i)
        }
      }

      for (const query of SQL_INJECTION_PAYLOADS.slice(0, 5)) {
        await testEndpoint(query)
      }
    })
  })

  describe('Tenant Isolation', () => {
    it('should prevent cross-tenant SQL injection', async () => {
      // Create second tenant
      const tenant2 = await payload.create({
        collection: 'tenants',
        data: {
          name: 'Tenant 2',
          email: 'tenant2@example.com',
        },
      })

      // Create subscriber for tenant 1
      const subscriber1 = await payload.create({
        collection: 'email-subscribers',
        data: {
          email: 'tenant1@example.com',
          tenant: testTenantId,
        },
      })

      // Try to access tenant 1's data using tenant 2's context with SQL injection
      const sqlInjectionAttempts = [
        `${tenant2.id}' OR tenant='${testTenantId}' --`,
        `${tenant2.id}' UNION SELECT * FROM email_subscribers WHERE tenant='${testTenantId}' --`,
      ]

      for (const maliciousTenantId of sqlInjectionAttempts) {
        try {
          const result = await payload.find({
            collection: 'email-subscribers',
            where: {
              tenant: {
                equals: maliciousTenantId,
              },
            },
          })

          // Should not return tenant 1's subscriber
          const subscriberIds = result.docs.map(doc => doc.id)
          expect(subscriberIds).not.toContain(subscriber1.id)
        } catch (error) {
          // If it throws, it should not be a SQL error
          expect(error.message).not.toMatch(/sql|syntax|query/i)
        }
      }

      // Cleanup
      await payload.delete({ collection: 'tenants', id: tenant2.id })
      await payload.delete({ collection: 'email-subscribers', id: subscriber1.id })
    })
  })

  describe('Order By Injection', () => {
    it('should prevent ORDER BY injection', async () => {
      const orderByPayloads = [
        '(SELECT * FROM users)',
        'name; DROP TABLE users--',
        'name UNION SELECT password FROM users--',
        '1; UPDATE users SET admin=1--',
      ]

      for (const orderBy of orderByPayloads) {
        const startTime = Date.now()

        try {
          // Most ORMs don't allow direct ORDER BY user input
          // This tests if there's any vulnerable code
          await payload.find({
            collection: 'email-subscribers',
            sort: orderBy as any,
          })
        } catch (error) {
          // Should be validation error, not SQL error
          expect(error.message).not.toMatch(/sql|syntax|query/i)
        }

        const endTime = Date.now()
        expect(endTime - startTime).toBeLessThan(1000)
      }
    })
  })

  describe('Stored SQL Injection', () => {
    it('should sanitize stored values on retrieval', async () => {
      // Create a subscriber with potential SQL in metadata
      const subscriber = await payload.create({
        collection: 'email-subscribers',
        data: {
          email: 'stored-sql@example.com',
          tenant: testTenantId,
          customFields: {
            notes: "'; DROP TABLE users--",
          },
        },
      })

      // Retrieve and use in another query - should not execute SQL
      const retrieved = await payload.findByID({
        collection: 'email-subscribers',
        id: subscriber.id,
      })

      // Use the stored value in a search
      const startTime = Date.now()
      try {
        await payload.find({
          collection: 'email-subscribers',
          where: {
            'customFields.notes': {
              contains: retrieved.customFields?.notes || '',
            },
          },
        })
      } catch (error) {
        expect(error.message).not.toMatch(/sql|syntax|query/i)
      }
      const endTime = Date.now()
      expect(endTime - startTime).toBeLessThan(1000)

      // Cleanup
      await payload.delete({
        collection: 'email-subscribers',
        id: subscriber.id,
      })
    })
  })
})

/**
 * Test Results Interpretation:
 *
 * ✅ PASS: All inputs are properly sanitized
 * ❌ FAIL: SQL injection vulnerability detected
 *
 * Expected Results:
 * - All tests should pass
 * - No SQL errors should be thrown
 * - No queries should take longer than 1 second (time-based attack protection)
 * - Tenant isolation should be maintained
 * - Stored values should be sanitized on retrieval
 *
 * Remediation:
 * If any tests fail:
 * 1. Use parameterized queries (prepared statements)
 * 2. Validate and sanitize all user inputs
 * 3. Use ORM/query builder escaping (Payload handles this)
 * 4. Implement input validation at API level
 * 5. Never concatenate user input into SQL strings
 */
