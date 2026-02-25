/**
 * Load Test: Health & Metrics Endpoints
 *
 * Tests health check and metrics endpoints under load
 *
 * Run:
 *   k6 run tests/load/health-endpoints.test.js
 */

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

// Custom metrics
const healthCheckDuration = new Trend('health_check_duration')
const metricsCheckDuration = new Trend('metrics_check_duration')
const errorRate = new Rate('errors')

// Configuration
const BASE_URL = __ENV.BASE_URL || 'https://yourdomain.com'
const API_KEY = __ENV.API_KEY || 'sk_live_test_key'

// Simple load test - health checks should be fast
export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],

  thresholds: {
    http_req_duration: ['p(95)<200'],      // 95% under 200ms
    http_req_failed: ['rate<0.01'],        // Less than 1% failed
    health_check_duration: ['p(95)<150'],  // Health checks super fast
    metrics_check_duration: ['p(95)<300'], // Metrics can be slightly slower
  },
}

export default function () {
  // Test 1: Health check
  const healthStart = Date.now()
  const healthResponse = http.get(`${BASE_URL}/api/email-marketing/health`)
  const healthDuration = Date.now() - healthStart

  const healthSuccess = check(healthResponse, {
    'health status is 200 or 503': (r) => r.status === 200 || r.status === 503,
    'health has status field': (r) => {
      try {
        const body = JSON.parse(r.body)
        return ['healthy', 'degraded', 'unhealthy'].includes(body.status)
      } catch {
        return false
      }
    },
  })

  if (healthSuccess) {
    healthCheckDuration.add(healthDuration)
  } else {
    errorRate.add(1)
  }

  sleep(0.5)

  // Test 2: Readiness probe
  const readyResponse = http.get(`${BASE_URL}/api/email-marketing/ready`)

  check(readyResponse, {
    'ready status is 200 or 503': (r) => r.status === 200 || r.status === 503,
  })

  sleep(0.5)

  // Test 3: Liveness probe
  const aliveResponse = http.get(`${BASE_URL}/api/email-marketing/alive`)

  check(aliveResponse, {
    'alive status is 200 or 503': (r) => r.status === 200 || r.status === 503,
  })

  sleep(0.5)

  // Test 4: Metrics endpoint (requires auth)
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
  }

  const metricsStart = Date.now()
  const metricsResponse = http.get(`${BASE_URL}/api/email-marketing/metrics`, { headers })
  const metricsDuration = Date.now() - metricsStart

  const metricsSuccess = check(metricsResponse, {
    'metrics status is 200': (r) => r.status === 200,
    'metrics has systemHealth': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.systemHealth !== undefined
      } catch {
        return false
      }
    },
  })

  if (metricsSuccess) {
    metricsCheckDuration.add(metricsDuration)
  } else {
    errorRate.add(1)
  }

  sleep(Math.random() * 2 + 1) // 1-3 seconds
}
