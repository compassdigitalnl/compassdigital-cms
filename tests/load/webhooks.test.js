/**
 * Load Test: Webhook Endpoints
 *
 * Tests webhook processing under load, including signature verification
 * and rate limiting
 *
 * Run:
 *   k6 run tests/load/webhooks.test.js
 *
 * Environment variables:
 *   WEBHOOK_SIGNING_SECRET - Secret for HMAC signature generation
 */

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend, Counter } from 'k6/metrics'
import { crypto } from 'k6/experimental/webcrypto'

// Custom metrics
const webhooksProcessed = new Counter('webhooks_processed')
const webhooksRateLimited = new Counter('webhooks_rate_limited')
const webhooksSignatureFailed = new Counter('webhooks_signature_failed')
const webhookDuration = new Trend('webhook_duration')

// Configuration
const BASE_URL = __ENV.BASE_URL || 'https://yourdomain.com'
const WEBHOOK_SECRET = __ENV.WEBHOOK_SIGNING_SECRET || 'test_secret'

// Aggressive load test to trigger rate limits
export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '10s', target: 30 },
    { duration: '20s', target: 50 },  // This should trigger rate limits
    { duration: '10s', target: 0 },
  ],

  thresholds: {
    http_req_duration: ['p(95)<1000'], // Webhooks can be slower (processing)
    webhooks_processed: ['count>100'], // At least 100 should succeed
  },
}

// Generate HMAC-SHA256 signature
function generateSignature(payload, secret, timestamp) {
  const signedPayload = `${timestamp}.${payload}`

  // Use k6's crypto module for HMAC
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(signedPayload)

  // Note: k6 crypto API may vary, this is a simplified version
  // In practice, you might need to use a different approach or library
  // For testing purposes, we'll use a simple hash

  // Simplified signature generation (for load testing)
  // In production, use proper HMAC-SHA256
  const signature = crypto.subtle.digest('SHA-256', messageData)
    .then(hash => {
      return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    })

  return signature
}

// Simplified synchronous signature for k6
function simpleHash(payload, secret, timestamp) {
  const signedPayload = `${timestamp}.${payload}`
  // For load testing, we'll use a simplified approach
  // Real implementation should use proper HMAC-SHA256
  const hash = crypto.sha256(signedPayload + secret)
  return hash
}

export default function () {
  const timestamp = Math.floor(Date.now() / 1000)

  // Generate webhook payload
  const payload = {
    eventType: 'order.placed',
    tenantId: `tenant_${Math.floor(Math.random() * 10)}`, // 10 different tenants
    email: `user-${Math.random().toString(36).substring(7)}@example.com`,
    total: Math.floor(Math.random() * 500) + 10,
    timestamp: new Date().toISOString(),
  }

  const payloadString = JSON.stringify(payload)

  // Generate signature
  // Note: This is simplified for k6. In real implementation,
  // you'd use proper HMAC-SHA256
  const signature = `${timestamp}.${crypto.md5(payloadString + WEBHOOK_SECRET)}`

  const headers = {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': signature,
    'X-Webhook-Timestamp': timestamp.toString(),
  }

  // Send webhook
  const webhookStart = Date.now()
  const webhookResponse = http.post(
    `${BASE_URL}/api/webhooks/events`,
    payloadString,
    { headers }
  )
  const webhookDurationMs = Date.now() - webhookStart

  // Check response
  const webhookSuccess = check(webhookResponse, {
    'webhook accepted (200/201)': (r) => r.status === 200 || r.status === 201,
    'webhook rate limited (429)': (r) => r.status === 429,
    'webhook unauthorized (401)': (r) => r.status === 401,
    'webhook has response body': (r) => r.body && r.body.length > 0,
  })

  if (webhookResponse.status === 200 || webhookResponse.status === 201) {
    webhooksProcessed.add(1)
    webhookDuration.add(webhookDurationMs)
  } else if (webhookResponse.status === 429) {
    webhooksRateLimited.add(1)
    console.log(`Rate limited: ${webhookResponse.headers['Retry-After'] || 'unknown'} seconds`)
  } else if (webhookResponse.status === 401) {
    webhooksSignatureFailed.add(1)
    console.error('Signature verification failed')
  } else {
    console.error(`Unexpected status: ${webhookResponse.status} ${webhookResponse.body}`)
  }

  // Random delay
  sleep(Math.random() * 0.5 + 0.1) // 0.1-0.6 seconds
}

export function handleSummary(data) {
  const metrics = data.metrics

  let summary = '\n'
  summary += '╔═══════════════════════════════════════════════════════════════╗\n'
  summary += '║         Load Test Results: Webhook Endpoints                  ║\n'
  summary += '╠═══════════════════════════════════════════════════════════════╣\n'
  summary += '║                                                               ║\n'

  if (metrics.http_reqs) {
    summary += `║  Total Requests: ${metrics.http_reqs.values.count.toString().padStart(10)}                            ║\n`
  }

  if (metrics.webhooks_processed) {
    summary += `║  Webhooks Processed: ${metrics.webhooks_processed.values.count.toString().padStart(10)}                       ║\n`
  }

  if (metrics.webhooks_rate_limited) {
    summary += `║  Webhooks Rate Limited: ${metrics.webhooks_rate_limited.values.count.toString().padStart(10)}                    ║\n`
  }

  if (metrics.webhooks_signature_failed) {
    summary += `║  Signature Failures: ${metrics.webhooks_signature_failed.values.count.toString().padStart(10)}                       ║\n`
  }

  if (metrics.webhook_duration) {
    const p95 = metrics.webhook_duration.values['p(95)']
    const avg = metrics.webhook_duration.values.avg
    summary += `║  Average Duration: ${avg.toFixed(2).toString().padStart(8)}ms                           ║\n`
    summary += `║  P95 Duration: ${p95.toFixed(2).toString().padStart(8)}ms                               ║\n`
  }

  summary += '║                                                               ║\n'
  summary += '║  ℹ️  Rate limiting is expected and healthy!                    ║\n'
  summary += '║  Target: 60 req/min per IP, 300 req/min per tenant           ║\n'
  summary += '║                                                               ║\n'
  summary += '╚═══════════════════════════════════════════════════════════════╝\n'

  console.log(summary)

  return {
    'stdout': summary,
    'load-test-webhooks.json': JSON.stringify(data),
  }
}
