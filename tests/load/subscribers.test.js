/**
 * Load Test: Subscribers API
 *
 * Tests subscriber creation, retrieval, and update under load
 *
 * Run:
 *   k6 run tests/load/subscribers.test.js
 *
 * Run with different stages:
 *   k6 run --vus 50 --duration 5m tests/load/subscribers.test.js
 */

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend, Counter } from 'k6/metrics'

// Custom metrics
const errorRate = new Rate('errors')
const apiDuration = new Trend('api_duration')
const subscribersCreated = new Counter('subscribers_created')
const subscribersRetrieved = new Counter('subscribers_retrieved')

// Configuration
const BASE_URL = __ENV.BASE_URL || 'https://yourdomain.com'
const API_KEY = __ENV.API_KEY || 'sk_live_test_key'

// Load test stages
export const options = {
  stages: [
    // Ramp up
    { duration: '2m', target: 10 },  // Ramp to 10 users over 2 minutes
    { duration: '2m', target: 20 },  // Ramp to 20 users
    { duration: '2m', target: 50 },  // Ramp to 50 users

    // Sustained load
    { duration: '5m', target: 50 },  // Stay at 50 users for 5 minutes

    // Peak load
    { duration: '2m', target: 100 }, // Spike to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 for 3 minutes

    // Ramp down
    { duration: '2m', target: 0 },   // Ramp down to 0
  ],

  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.05'],   // Less than 5% failed requests
    errors: ['rate<0.05'],            // Less than 5% errors
  },
}

// Generate random email
function generateEmail() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  return `loadtest-${timestamp}-${random}@example.com`
}

// Generate random name
function generateName() {
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia']
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
}

export default function () {
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  }

  // Test 1: Create subscriber
  const createPayload = JSON.stringify({
    email: generateEmail(),
    name: generateName(),
    status: 'subscribed',
    lists: [1],
  })

  const createStart = Date.now()
  const createResponse = http.post(
    `${BASE_URL}/api/v1/email-marketing/subscribers`,
    createPayload,
    { headers }
  )
  const createDuration = Date.now() - createStart

  const createSuccess = check(createResponse, {
    'create status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'create response has data': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.success === true || body.data !== undefined
      } catch {
        return false
      }
    },
  })

  if (createSuccess) {
    subscribersCreated.add(1)
    apiDuration.add(createDuration)
  } else {
    errorRate.add(1)
    console.error(`Create failed: ${createResponse.status} ${createResponse.body}`)
  }

  // Small delay between operations
  sleep(1)

  // Test 2: List subscribers
  const listStart = Date.now()
  const listResponse = http.get(
    `${BASE_URL}/api/v1/email-marketing/subscribers?limit=20`,
    { headers }
  )
  const listDuration = Date.now() - listStart

  const listSuccess = check(listResponse, {
    'list status is 200': (r) => r.status === 200,
    'list response has data array': (r) => {
      try {
        const body = JSON.parse(r.body)
        return Array.isArray(body.data) || Array.isArray(body.docs)
      } catch {
        return false
      }
    },
  })

  if (listSuccess) {
    subscribersRetrieved.add(1)
    apiDuration.add(listDuration)
  } else {
    errorRate.add(1)
    console.error(`List failed: ${listResponse.status} ${listResponse.body}`)
  }

  // Random delay to simulate real user behavior
  sleep(Math.random() * 3 + 1) // 1-4 seconds
}

// Summary after test completes
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: '  ', enableColors: true }),
    'load-test-subscribers.json': JSON.stringify(data),
  }
}

function textSummary(data, { indent = '', enableColors = false } = {}) {
  const metrics = data.metrics

  let summary = '\n'
  summary += `${indent}╔═══════════════════════════════════════════════════════════════╗\n`
  summary += `${indent}║         Load Test Results: Subscribers API                    ║\n`
  summary += `${indent}╠═══════════════════════════════════════════════════════════════╣\n`
  summary += `${indent}║                                                               ║\n`

  // Request metrics
  if (metrics.http_reqs) {
    summary += `${indent}║  Total Requests: ${metrics.http_reqs.values.count.toString().padStart(10)}                            ║\n`
  }

  if (metrics.http_req_duration) {
    const p95 = metrics.http_req_duration.values['p(95)']
    const avg = metrics.http_req_duration.values.avg
    summary += `${indent}║  Average Duration: ${avg.toFixed(2).toString().padStart(8)}ms                           ║\n`
    summary += `${indent}║  P95 Duration: ${p95.toFixed(2).toString().padStart(8)}ms                               ║\n`
  }

  if (metrics.http_req_failed) {
    const failRate = (metrics.http_req_failed.values.rate * 100).toFixed(2)
    summary += `${indent}║  Failed Requests: ${failRate.toString().padStart(7)}%                                ║\n`
  }

  summary += `${indent}║                                                               ║\n`

  // Custom metrics
  if (metrics.subscribers_created) {
    summary += `${indent}║  Subscribers Created: ${metrics.subscribers_created.values.count.toString().padStart(10)}                       ║\n`
  }

  if (metrics.subscribers_retrieved) {
    summary += `${indent}║  Subscribers Retrieved: ${metrics.subscribers_retrieved.values.count.toString().padStart(10)}                     ║\n`
  }

  if (metrics.errors) {
    const errRate = (metrics.errors.values.rate * 100).toFixed(2)
    summary += `${indent}║  Error Rate: ${errRate.toString().padStart(7)}%                                     ║\n`
  }

  summary += `${indent}║                                                               ║\n`
  summary += `${indent}╚═══════════════════════════════════════════════════════════════╝\n`

  return summary
}
