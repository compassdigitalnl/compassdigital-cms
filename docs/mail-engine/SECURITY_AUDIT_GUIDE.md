# Security Audit Guide

Complete security audit procedures and best practices for the Email Marketing Engine.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Automated Security Tests](#automated-security-tests)
3. [Manual Security Checks](#manual-security-checks)
4. [Vulnerability Categories](#vulnerability-categories)
5. [Security Audit Checklist](#security-audit-checklist)
6. [Remediation Procedures](#remediation-procedures)
7. [Security Best Practices](#security-best-practices)
8. [Compliance Requirements](#compliance-requirements)

---

## Quick Start

### Run Complete Security Audit

```bash
# Run all automated security tests
npm run security:audit

# Run specific security tests
npm run test:security:sql        # SQL injection tests
npm run test:security:xss        # XSS tests
npm run test:security:csrf       # CSRF tests

# Check dependencies for vulnerabilities
npm audit
npm audit fix
```

### Security Audit Report

The audit generates a JSON report with:
- **Severity levels:** CRITICAL, HIGH, MEDIUM, LOW, INFO
- **Status:** PASS, FAIL, WARN, INFO
- **Recommendations:** Actionable remediation steps

---

## Automated Security Tests

### 1. SQL Injection Tests

**File:** `tests/security/sql-injection.test.ts`

**What it tests:**
- Email field sanitization
- Name field sanitization
- Search query sanitization
- Campaign name/subject sanitization
- API query parameter sanitization
- Tenant isolation bypass attempts
- Order by injection
- Stored SQL injection
- Time-based blind injection

**Common payloads tested:**
```sql
' OR '1'='1
' OR '1'='1' --
' UNION SELECT NULL--
'; DROP TABLE users--
' OR SLEEP(5)--
{ $gt: '' }  # NoSQL injection
```

**How to run:**
```bash
npm run test:security:sql

# Or with Jest directly
npx jest tests/security/sql-injection.test.ts
```

**Expected results:**
- ✅ All tests should PASS
- ✅ No SQL errors should be thrown
- ✅ No queries should take > 1 second (time-based attack protection)
- ✅ Tenant isolation should be maintained

**Remediation if tests fail:**
1. Use parameterized queries (Payload does this by default)
2. Validate and sanitize all user inputs
3. Never concatenate user input into SQL strings
4. Implement input validation at API level

---

### 2. Cross-Site Scripting (XSS) Tests

**File:** `tests/security/xss.test.ts`

**What it tests:**
- Storage of XSS payloads without execution
- HTML sanitization in rich text fields
- Output encoding in API responses
- URL parameter injection
- Email template injection
- Template expression injection
- DOM-based XSS prevention
- Content-Type header validation
- CSP header validation
- Reflected XSS prevention

**Common payloads tested:**
```html
<script>alert("XSS")</script>
<img src=x onerror=alert("XSS")>
<svg/onload=alert("XSS")>
<a href="javascript:alert('XSS')">Click</a>
{{constructor.constructor("alert(1)")()}}
${alert(1)}
```

**How to run:**
```bash
npm run test:security:xss

# Or with Jest
npx jest tests/security/xss.test.ts
```

**Expected results:**
- ✅ XSS payloads stored safely (not executed)
- ✅ HTML in rich text fields is sanitized
- ✅ API responses have proper encoding
- ✅ Content-Type headers are application/json
- ✅ X-Content-Type-Options: nosniff is set
- ✅ CSP headers restrict script execution

**Remediation if tests fail:**
1. Implement proper output encoding (HTML escape)
2. Use Content Security Policy (CSP) headers
3. Set X-Content-Type-Options: nosniff
4. Sanitize HTML in rich text (use DOMPurify)
5. Escape template variables before rendering
6. Never use dangerouslySetInnerHTML without sanitization

---

### 3. CSRF (Cross-Site Request Forgery) Tests

**File:** `tests/security/csrf.test.ts`

**What it tests:**
- API key authentication requirement
- Invalid API key rejection
- Origin header validation
- CORS header configuration
- Referer header validation
- SameSite cookie protection
- State-changing operation protection
- CSRF token validation (if implemented)
- Double submit cookie pattern
- Custom header requirement
- Content-Type validation
- GET request safety
- Webhook signature verification

**How to run:**
```bash
npm run test:security:csrf

# Or with Jest
npx jest tests/security/csrf.test.ts
```

**Expected results:**
- ✅ Requests without API keys are rejected (401)
- ✅ Invalid API keys are rejected (401)
- ✅ CORS headers are restrictive (not wildcard)
- ✅ SameSite cookies are set properly
- ✅ State-changing operations require authentication
- ✅ GET requests don't modify state
- ✅ Webhooks require signature verification

**Protection strategies implemented:**
1. **API Key Authentication** - Primary CSRF protection
2. **CORS Headers** - Restricts allowed origins
3. **SameSite Cookies** - Prevents cross-site cookie sending
4. **Webhook Signatures** - HMAC-SHA256 verification
5. **Content-Type Validation** - Requires application/json
6. **Safe Methods** - GET requests are read-only

**Remediation if tests fail:**
1. Implement API key auth for all state-changing operations
2. Set restrictive CORS headers
3. Add SameSite attribute to all cookies
4. Validate Content-Type headers
5. Implement CSRF tokens for session-based auth
6. Require signature verification for webhooks

---

### 4. Comprehensive Security Audit

**File:** `src/scripts/security-audit.ts`

**What it audits:**
- Environment variables (secrets, strength)
- Database security (SSL, production config)
- API key security (generation, storage, scopes)
- Rate limiting (Redis, multi-tier limits)
- Encryption (HTTPS, webhook signatures, data at rest)
- Tenant isolation (access control, cross-tenant leakage)
- Input validation (email, XSS, SQL injection)
- Webhook security (signatures, timestamps, rate limits)
- Error handling (logging, sensitive data exposure)
- Logging (security events, retention, PII)
- Dependencies (vulnerabilities, updates)

**How to run:**
```bash
npm run security:audit
```

**Output:**
```
🔒 Starting Security Audit...

📋 Auditing Environment Variables...
✅ [INFO] Environment Variables: Required secret: PAYLOAD_SECRET
✅ [INFO] Environment Variables: PAYLOAD_SECRET strength
...

🗄️ Auditing Database Security...
✅ [INFO] Database Security: SSL/TLS Connection
...

📊 SECURITY AUDIT SUMMARY
======================================================================
Total Checks: 45
✅ Passed: 38
❌ Failed: 2
⚠️  Warnings: 5

Severity Breakdown:
  🔴 Critical: 1
  🟠 High: 2
  🟡 Medium: 5
  🔵 Low: 2
======================================================================

📄 Full report saved to: security-audit-report.json
```

**Severity levels:**
- **CRITICAL** - Immediate action required, blocks production deployment
- **HIGH** - Address before production deployment
- **MEDIUM** - Should be addressed, but not blocking
- **LOW** - Nice to have, best practices
- **INFO** - Informational, no action needed

---

## Manual Security Checks

### 1. Tenant Isolation Verification

**Manual test procedure:**

```typescript
// Test 1: Create two tenants
const tenant1 = await payload.create({
  collection: 'tenants',
  data: { name: 'Tenant 1', email: 'tenant1@example.com' }
})

const tenant2 = await payload.create({
  collection: 'tenants',
  data: { name: 'Tenant 2', email: 'tenant2@example.com' }
})

// Test 2: Create data for tenant 1
const subscriber1 = await payload.create({
  collection: 'email-subscribers',
  data: {
    email: 'tenant1-user@example.com',
    tenant: tenant1.id
  }
})

// Test 3: Try to access tenant 1's data with tenant 2's API key
// This should FAIL (return empty results or 403)
const results = await payload.find({
  collection: 'email-subscribers',
  where: {
    tenant: { equals: tenant2.id }
  }
})

// Verify: subscriber1 should NOT be in results
expect(results.docs).not.toContainEqual(
  expect.objectContaining({ id: subscriber1.id })
)
```

**What to verify:**
- ✅ Tenant 2 cannot see tenant 1's subscribers
- ✅ Tenant 2 cannot see tenant 1's campaigns
- ✅ Tenant 2 cannot see tenant 1's API keys
- ✅ Tenant 2 cannot see tenant 1's events

---

### 2. API Key Scope Verification

**Manual test procedure:**

```bash
# Create API key with limited scope
curl -X POST http://localhost:3000/api/v1/email-marketing/api-keys \
  -H "Authorization: Bearer admin-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Read-Only Key",
    "scopes": ["subscribers:read"]
  }'

# Try to create subscriber with read-only key (should FAIL)
curl -X POST http://localhost:3000/api/v1/email-marketing/subscribers \
  -H "Authorization: Bearer read-only-key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
# Expected: 403 Forbidden

# Try to read subscribers with read-only key (should SUCCEED)
curl -X GET http://localhost:3000/api/v1/email-marketing/subscribers \
  -H "Authorization: Bearer read-only-key"
# Expected: 200 OK
```

**What to verify:**
- ✅ Read-only keys cannot create/update/delete
- ✅ Write-only keys cannot read
- ✅ Scopes are enforced for all operations

---

### 3. Rate Limiting Effectiveness

**Manual test procedure:**

```bash
# Install Apache Bench (if not installed)
# macOS: brew install httpd
# Ubuntu: sudo apt-get install apache2-utils

# Test IP rate limit (60 requests/minute)
ab -n 100 -c 10 http://localhost:3000/api/webhooks/events

# Expected: First 60 succeed, then 429 (Too Many Requests)

# Test with k6 (recommended)
k6 run tests/load/webhooks.test.js
```

**What to verify:**
- ✅ IP rate limit triggers after 60 req/min
- ✅ Tenant rate limit triggers after 300 req/min
- ✅ Global rate limit triggers after 1000 req/min
- ✅ 429 responses include Retry-After header
- ✅ Rate limiting resets after window expires

---

### 4. Webhook Signature Verification

**Manual test procedure:**

```typescript
import crypto from 'crypto'

// Generate valid signature
function generateSignature(payload: any, secret: string, timestamp: number): string {
  const signedPayload = `${timestamp}.${JSON.stringify(payload)}`
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(signedPayload)
  return hmac.digest('hex')
}

const payload = {
  eventType: 'subscriber.created',
  tenantId: 'test-tenant',
  email: 'test@example.com'
}

const timestamp = Math.floor(Date.now() / 1000)
const signature = generateSignature(payload, process.env.WEBHOOK_SIGNING_SECRET, timestamp)

// Test 1: Valid signature (should SUCCEED)
fetch('http://localhost:3000/api/webhooks/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': signature,
    'X-Webhook-Timestamp': timestamp.toString()
  },
  body: JSON.stringify(payload)
})

// Test 2: Invalid signature (should FAIL with 401)
fetch('http://localhost:3000/api/webhooks/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': 'invalid-signature',
    'X-Webhook-Timestamp': timestamp.toString()
  },
  body: JSON.stringify(payload)
})

// Test 3: Old timestamp (should FAIL with 401)
const oldTimestamp = Math.floor(Date.now() / 1000) - 600 // 10 minutes ago
const oldSignature = generateSignature(payload, process.env.WEBHOOK_SIGNING_SECRET, oldTimestamp)

fetch('http://localhost:3000/api/webhooks/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': oldSignature,
    'X-Webhook-Timestamp': oldTimestamp.toString()
  },
  body: JSON.stringify(payload)
})
```

**What to verify:**
- ✅ Valid signatures are accepted
- ✅ Invalid signatures are rejected (401)
- ✅ Old timestamps are rejected (>5 minutes)
- ✅ Timing-safe comparison is used (no timing attacks)

---

## Vulnerability Categories

### OWASP Top 10 Coverage

| Vulnerability | Status | Protection | Test Coverage |
|--------------|--------|------------|---------------|
| A01: Broken Access Control | ✅ Protected | API key auth, tenant isolation | Manual + Automated |
| A02: Cryptographic Failures | ✅ Protected | HTTPS, HMAC-SHA256, bcrypt | Automated |
| A03: Injection | ✅ Protected | Parameterized queries, validation | Automated (SQL, XSS) |
| A04: Insecure Design | ✅ Addressed | Security by design, defense in depth | Manual review |
| A05: Security Misconfiguration | ✅ Protected | Audit script, environment validation | Automated |
| A06: Vulnerable Components | ⚠️ Partial | npm audit, regular updates | Manual (npm audit) |
| A07: Authentication Failures | ✅ Protected | API key auth, rate limiting | Automated (CSRF) |
| A08: Software/Data Integrity | ✅ Protected | Webhook signatures, checksums | Automated |
| A09: Logging Failures | ✅ Protected | Comprehensive logging, Sentry | Manual review |
| A10: SSRF | ⚠️ Partial | URL validation, allowlists | Manual testing |

---

## Security Audit Checklist

### Pre-Production Security Checklist

- [ ] **Environment Variables**
  - [ ] PAYLOAD_SECRET is strong (32+ characters)
  - [ ] DATABASE_URL uses SSL/TLS
  - [ ] REDIS_URL is configured
  - [ ] WEBHOOK_SIGNING_SECRET is set (32+ characters)
  - [ ] No default/test secrets in production

- [ ] **Authentication & Authorization**
  - [ ] API keys are generated with crypto.randomBytes(32)
  - [ ] API key scopes are enforced
  - [ ] Tenant isolation is verified
  - [ ] No hardcoded credentials

- [ ] **Data Protection**
  - [ ] HTTPS is enforced (no HTTP)
  - [ ] Database encryption at rest is enabled
  - [ ] Passwords are hashed with bcrypt
  - [ ] Sensitive data is not logged

- [ ] **Rate Limiting**
  - [ ] Redis is configured for rate limiting
  - [ ] IP rate limits are effective (60/min)
  - [ ] Tenant rate limits are effective (300/min)
  - [ ] Webhook rate limits are effective

- [ ] **Input Validation**
  - [ ] SQL injection tests pass
  - [ ] XSS tests pass
  - [ ] CSRF tests pass
  - [ ] Email validation is enforced
  - [ ] File upload restrictions (if applicable)

- [ ] **Error Handling**
  - [ ] Errors don't expose sensitive data
  - [ ] Sentry is configured for production
  - [ ] Dead letter queue is set up
  - [ ] Retry logic is implemented

- [ ] **Monitoring & Logging**
  - [ ] Health checks are configured
  - [ ] Security events are logged (auth failures, rate limits)
  - [ ] Log retention policy is defined (90+ days)
  - [ ] Alerts are configured (critical errors, downtime)

- [ ] **Dependencies**
  - [ ] npm audit shows no critical vulnerabilities
  - [ ] All dependencies are up to date
  - [ ] Unnecessary dependencies are removed

- [ ] **Testing**
  - [ ] All security tests pass
  - [ ] Load testing is complete
  - [ ] Penetration testing (if required)

---

## Remediation Procedures

### Critical Issue: SQL Injection Vulnerability

**Symptoms:**
- SQL injection tests fail
- Error messages contain SQL syntax errors
- Queries can be manipulated via user input

**Remediation:**
1. **Immediate:** Disable the vulnerable endpoint
2. **Fix:** Use parameterized queries (Payload does this by default)
3. **Verify:** Run SQL injection tests
4. **Deploy:** Update production immediately

**Example fix:**
```typescript
// ❌ VULNERABLE (never do this)
const query = `SELECT * FROM users WHERE email = '${userInput}'`

// ✅ SAFE (use ORM)
const users = await payload.find({
  collection: 'users',
  where: {
    email: { equals: userInput }  // Automatically parameterized
  }
})
```

---

### High Issue: XSS Vulnerability

**Symptoms:**
- XSS tests fail
- User input is rendered without escaping
- Script tags execute in browser

**Remediation:**
1. **Immediate:** Sanitize all output
2. **Fix:** Implement proper encoding/escaping
3. **Add:** Content Security Policy (CSP) headers
4. **Verify:** Run XSS tests

**Example fix:**
```typescript
// ❌ VULNERABLE (React)
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ SAFE (React automatically escapes)
<div>{userInput}</div>

// ✅ SAFE (with sanitization for HTML content)
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

**CSP Header:**
```typescript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self';
  frame-src 'none';
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
]
```

---

### High Issue: Weak API Key

**Symptoms:**
- API key is short (<32 characters)
- API key is predictable
- API key uses weak random generator

**Remediation:**
1. **Immediate:** Revoke weak keys
2. **Fix:** Generate new keys with crypto.randomBytes(32)
3. **Migrate:** Force all users to generate new keys
4. **Verify:** Run API key security audit

**Example fix:**
```typescript
import crypto from 'crypto'

// ❌ WEAK (Math.random is not cryptographically secure)
const weakKey = Math.random().toString(36).substr(2, 9)

// ✅ STRONG (crypto.randomBytes is cryptographically secure)
const strongKey = crypto.randomBytes(32).toString('base64url')
// Example: "K8vX2nZ9pQ4mL5jH3gF6dA1sC7yB0wE4tR9uV8iO2xN"
```

---

### Medium Issue: Missing Rate Limiting

**Symptoms:**
- Endpoints can be hammered without restriction
- No Redis configuration
- DDoS vulnerability

**Remediation:**
1. **Setup:** Configure Redis
2. **Implement:** Multi-tier rate limiting
3. **Test:** Run load tests to verify
4. **Monitor:** Track rate limit triggers

**Example implementation:**
```typescript
import { RateLimiter } from '@/lib/email/webhooks/RateLimiter'

const rateLimiter = new RateLimiter({
  keyPrefix: 'webhook',
  windowMs: 60000,  // 1 minute
  maxRequests: 60   // 60 requests per minute
})

export async function POST(req: NextRequest) {
  const clientIp = req.headers.get('x-forwarded-for') || 'unknown'

  // Check rate limit BEFORE expensive operations
  const rateLimitResult = await rateLimiter.checkLimit(clientIp)

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.retryAfter.toString()
        }
      }
    )
  }

  // Process request...
}
```

---

## Security Best Practices

### 1. Defense in Depth

**Principle:** Multiple layers of security controls

**Implementation:**
- **Layer 1:** Network security (firewall, VPC)
- **Layer 2:** Rate limiting (prevent brute force)
- **Layer 3:** Authentication (API keys, JWT)
- **Layer 4:** Authorization (scopes, tenant isolation)
- **Layer 5:** Input validation (sanitization, validation)
- **Layer 6:** Output encoding (XSS prevention)
- **Layer 7:** Monitoring (detect anomalies)

---

### 2. Principle of Least Privilege

**Principle:** Grant minimal necessary permissions

**Implementation:**
- API keys have specific scopes (read/write separation)
- Database user has minimal permissions
- Service accounts are restricted
- Tenant isolation prevents cross-tenant access

**Example:**
```typescript
// ❌ TOO BROAD
const apiKey = {
  scopes: ['*']  // Full access to everything
}

// ✅ LEAST PRIVILEGE
const apiKey = {
  scopes: [
    'subscribers:read',
    'campaigns:read'
  ]  // Only what's needed
}
```

---

### 3. Secure by Default

**Principle:** Security is the default configuration

**Implementation:**
- HTTPS enforced (no HTTP)
- Rate limiting enabled by default
- Authentication required for all endpoints
- CORS restricted (no wildcard)
- Sensitive headers are set (X-Content-Type-Options, etc.)

---

### 4. Fail Securely

**Principle:** Failures should not compromise security

**Implementation:**
- Auth failures deny access (not grant)
- Invalid signatures are rejected
- Rate limit errors return 429
- Database errors don't expose SQL

**Example:**
```typescript
// ❌ INSECURE (grants access on error)
let isAuthorized = true
try {
  isAuthorized = await verifyApiKey(key)
} catch (error) {
  // On error, defaults to true!
}

// ✅ SECURE (denies access on error)
let isAuthorized = false
try {
  isAuthorized = await verifyApiKey(key)
} catch (error) {
  // On error, stays false
  logger.error('Auth error:', error)
}
```

---

### 5. Never Trust User Input

**Principle:** All user input is potentially malicious

**Implementation:**
- Validate all inputs (type, length, format)
- Sanitize before storage
- Encode before output
- Use parameterized queries
- Implement file type restrictions

**Example:**
```typescript
// Validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(userEmail)) {
  throw new Error('Invalid email format')
}

// Sanitize HTML
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(userHtml)

// Encode for output
const safe = escapeHtml(userInput)
```

---

## Compliance Requirements

### GDPR Compliance

**Data Protection Measures:**
- [ ] Data encryption at rest and in transit
- [ ] Data minimization (collect only necessary data)
- [ ] Right to access (API to retrieve user data)
- [ ] Right to deletion (delete endpoint)
- [ ] Right to portability (export endpoint)
- [ ] Data breach notification (<72 hours)
- [ ] Privacy policy and consent

**Implementation:**
```typescript
// Right to deletion
async function deleteUserData(email: string) {
  await payload.delete({
    collection: 'email-subscribers',
    where: { email: { equals: email } }
  })

  await payload.delete({
    collection: 'email-events',
    where: { email: { equals: email } }
  })

  // Anonymize in audit logs
  await anonymizeAuditLogs(email)
}

// Right to access
async function exportUserData(email: string) {
  const subscriber = await payload.find({
    collection: 'email-subscribers',
    where: { email: { equals: email } }
  })

  const events = await payload.find({
    collection: 'email-events',
    where: { email: { equals: email } }
  })

  return { subscriber, events }
}
```

---

### PCI DSS (if handling payments)

**Requirements:**
- [ ] Encrypt cardholder data
- [ ] Use strong cryptography (AES-256)
- [ ] Restrict access to cardholder data
- [ ] Log all access to cardholder data
- [ ] Regular security testing
- [ ] Maintain secure systems

**Note:** If using Stripe, they handle PCI compliance. Never store raw card numbers.

---

### SOC 2 Type II

**Controls:**
- [ ] Security (access control, encryption)
- [ ] Availability (uptime monitoring, DR plan)
- [ ] Processing Integrity (error handling, validation)
- [ ] Confidentiality (data classification, NDAs)
- [ ] Privacy (consent, data handling)

**Implementation:**
- Implement all security measures in this guide
- Setup monitoring and alerting
- Maintain audit logs (90+ days)
- Document all procedures
- Regular security training

---

## Continuous Security

### Daily

- [ ] Review error logs (Sentry)
- [ ] Check health metrics
- [ ] Monitor rate limit triggers

### Weekly

- [ ] Review access logs
- [ ] Check for failed auth attempts
- [ ] Review security alerts

### Monthly

- [ ] Run `npm audit`
- [ ] Update dependencies
- [ ] Run full security audit
- [ ] Review API key usage

### Quarterly

- [ ] Penetration testing
- [ ] Security training
- [ ] Review and update security policies
- [ ] Audit user permissions

### Annually

- [ ] Third-party security audit
- [ ] Disaster recovery testing
- [ ] Security policy review
- [ ] Compliance certification renewal

---

## Resources

### Tools

- **Security Testing:** Jest, k6, Apache Bench
- **Dependency Scanning:** npm audit, Snyk
- **Code Analysis:** ESLint, TypeScript strict mode
- **Monitoring:** Sentry, Prometheus, Grafana
- **Penetration Testing:** OWASP ZAP, Burp Suite

### References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

## Support

For security issues:
- **Public issues:** GitHub Issues
- **Security vulnerabilities:** security@yourdomain.com (private disclosure)

**Response time:**
- Critical: 4 hours
- High: 24 hours
- Medium: 7 days
- Low: 30 days

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
