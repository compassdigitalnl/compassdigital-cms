# 🔐 API Key Management Guide - Email Marketing Engine

**Last Updated:** February 25, 2026
**Status:** ✅ Production Ready
**Version:** 1.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Creating API Keys](#creating-api-keys)
4. [Using API Keys](#using-api-keys)
5. [Scopes & Permissions](#scopes--permissions)
6. [Rate Limiting](#rate-limiting)
7. [Security Features](#security-features)
8. [API Examples](#api-examples)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Email Marketing API Key Management system provides secure, scoped access to email marketing endpoints for external applications.

### Key Features

✅ **Secure Storage** - API keys hashed with SHA-256
✅ **Scoped Permissions** - Granular control over what each key can do
✅ **Rate Limiting** - Per-minute, per-hour, and per-day limits
✅ **IP Whitelisting** - Restrict keys to specific IP addresses
✅ **Usage Tracking** - Monitor key usage and detect anomalies
✅ **Tenant Isolation** - Keys are isolated per tenant
✅ **Key Rotation** - Support for rotating compromised keys
✅ **Expiry Dates** - Optional automatic key expiration

---

## 🚀 Quick Start

### Step 1: Create an API Key

1. Log into Payload CMS admin panel
2. Navigate to **Email Marketing → API Keys**
3. Click **Create New**
4. Fill in:
   - **Name**: "Production API" (friendly identifier)
   - **Description**: "API key for production server"
   - **Environment**: Live or Test
   - **Scopes**: Select permissions needed (e.g., `subscribers:create`)
   - **Rate Limits**: Set appropriate limits
5. Click **Save**
6. **⚠️ IMPORTANT**: Copy the generated API key immediately - it will NOT be shown again!

### Step 2: Use the API Key

```bash
curl -X GET https://yourdomain.com/api/v1/email-marketing/subscribers \
  -H "Authorization: Bearer sk_live_xxxxxxxxxxxxxx"
```

---

## 🔑 Creating API Keys

### Via Admin UI

The admin UI is the recommended way to create API keys.

**Fields:**

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Friendly name to identify the key |
| Description | No | Optional description of purpose |
| Environment | Yes | `live` (production) or `test` (development) |
| Scopes | Yes | Array of permissions (see [Scopes](#scopes--permissions)) |
| Rate Limits | Yes | Requests per minute/hour/day |
| Allowed IPs | No | IP whitelist (empty = all IPs allowed) |
| Expires At | No | Optional expiration date |

**Example:**

```
Name: Production Server API
Description: Main API key for backend integration
Environment: live
Scopes:
  - subscribers:create
  - subscribers:read
  - campaigns:send
Rate Limits:
  - 60 requests/minute
  - 1000 requests/hour
  - 10000 requests/day
Allowed IPs:
  - 192.168.1.100
  - 10.0.0.0/24
```

### Generated Key Format

API keys follow this format:

```
sk_live_[64 character hex string]    # Production
sk_test_[64 character hex string]    # Development
```

**Example:**
```
cms_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🔐 Using API Keys

### Authentication Header

Include the API key in the `Authorization` header:

```bash
# Method 1: Bearer token (recommended)
Authorization: Bearer sk_live_xxxxxxxxxxxxxx

# Method 2: Direct key
Authorization: sk_live_xxxxxxxxxxxxxx
```

### Tenant Isolation

API keys are automatically scoped to their tenant. You cannot access data from other tenants.

**Example:**

```javascript
// ❌ WRONG - Attempting to access another tenant's data
// This will return 401 Unauthorized or 404 Not Found
const response = await fetch('/api/v1/email-marketing/subscribers?tenant=other-tenant', {
  headers: {
    'Authorization': 'Bearer sk_live_your_key'
  }
})

// ✅ CORRECT - Tenant is automatically determined from API key
const response = await fetch('/api/v1/email-marketing/subscribers', {
  headers: {
    'Authorization': 'Bearer sk_live_your_key'
  }
})
```

---

## 🎯 Scopes & Permissions

Each API key has an array of scopes that define what it can do.

### Available Scopes

#### Subscribers

| Scope | Description |
|-------|-------------|
| `subscribers:read` | List and retrieve subscribers |
| `subscribers:create` | Create new subscribers |
| `subscribers:update` | Update existing subscribers |
| `subscribers:delete` | Delete subscribers |

#### Lists

| Scope | Description |
|-------|-------------|
| `lists:read` | List and retrieve email lists |
| `lists:create` | Create new lists |
| `lists:update` | Update existing lists |
| `lists:delete` | Delete lists |

#### Campaigns

| Scope | Description |
|-------|-------------|
| `campaigns:read` | List and retrieve campaigns |
| `campaigns:create` | Create new campaigns |
| `campaigns:update` | Update existing campaigns |
| `campaigns:send` | Send/start campaigns |
| `campaigns:delete` | Delete campaigns |

#### Templates

| Scope | Description |
|-------|-------------|
| `templates:read` | List and retrieve templates |
| `templates:create` | Create new templates |
| `templates:update` | Update existing templates |
| `templates:delete` | Delete templates |

#### Analytics

| Scope | Description |
|-------|-------------|
| `analytics:read` | Access campaign analytics and stats |

#### Events

| Scope | Description |
|-------|-------------|
| `events:send` | Send webhook events to trigger automations |

#### Automation

| Scope | Description |
|-------|-------------|
| `automation:read` | Read automation rules and flows |
| `automation:trigger` | Manually trigger automation rules |

### Scope Validation

When you call an API endpoint, the middleware automatically checks if your API key has the required scope.

**Example:**

```javascript
// Endpoint: POST /api/v1/email-marketing/subscribers
// Required scope: subscribers:create

// ✅ API key has scope → Request succeeds
{
  "scopes": ["subscribers:create", "subscribers:read"]
}

// ❌ API key missing scope → 401 Unauthorized
{
  "scopes": ["subscribers:read"]  // Missing subscribers:create
}
```

---

## ⏱️ Rate Limiting

Rate limiting prevents abuse and ensures fair usage across all tenants.

### Rate Limit Configuration

Each API key has three limits:

1. **Requests per minute** (default: 60)
2. **Requests per hour** (default: 1000)
3. **Requests per day** (default: 10000)

### Rate Limit Response

When you exceed a rate limit, you'll receive:

```json
{
  "error": "Rate limit exceeded for minute. Try again in 45 seconds.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

**HTTP Status:** `401 Unauthorized`

### Best Practices

1. **Implement exponential backoff** - Wait longer between retries
2. **Cache responses** - Don't repeatedly request the same data
3. **Batch operations** - Create multiple subscribers in one request (if supported)
4. **Monitor usage** - Track your usage in the admin panel

### Example: Exponential Backoff

```javascript
async function makeRequest(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options)

    if (response.status === 401) {
      const data = await response.json()
      if (data.code === 'RATE_LIMIT_EXCEEDED') {
        // Exponential backoff: 1s, 2s, 4s, 8s...
        const delay = Math.pow(2, i) * 1000
        console.log(`Rate limited. Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
    }

    return response
  }

  throw new Error('Max retries exceeded')
}
```

---

## 🔒 Security Features

### 1. SHA-256 Hashing

API keys are never stored in plaintext. We hash them with SHA-256 before storage.

**Flow:**

```
User creates key
  ↓
sk_live_abc123... (shown once)
  ↓
SHA-256 hash stored in database
  ↓
Original key discarded
```

### 2. IP Whitelisting

Restrict API keys to specific IP addresses or CIDR ranges.

**Examples:**

```
Single IP:      192.168.1.100
CIDR /24:       192.168.1.0/24  (192.168.1.0 - 192.168.1.255)
CIDR /16:       10.0.0.0/16     (10.0.0.0 - 10.0.255.255)
```

**Validation:**

```javascript
// ✅ Request from 192.168.1.100 → Allowed
// ✅ Request from 192.168.1.50 (in /24 range) → Allowed
// ❌ Request from 203.0.113.1 → Blocked
```

### 3. Expiration Dates

Set an optional expiration date for temporary keys.

**Use cases:**

- Contractor access (expires when contract ends)
- Demo keys (expires after trial period)
- Temporary integrations

**Example:**

```
Created: 2026-01-01
Expires: 2026-03-31

After March 31, 2026:
  → API calls return: "API key has expired"
```

### 4. Key Rotation

Rotate compromised keys without downtime.

**Process:**

1. Create new API key
2. Update your application to use new key
3. Monitor old key usage
4. Revoke old key when no longer used

### 5. Usage Tracking

Every API call updates:

- `totalRequests` - Total number of requests
- `lastUsedAt` - Timestamp of last use
- `lastUsedIp` - IP address of last request
- `lastUsedEndpoint` - Last endpoint accessed

**Use this to:**

- Detect unauthorized usage
- Monitor integration health
- Plan rate limit adjustments

---

## 📡 API Examples

### List Subscribers

```bash
curl -X GET "https://yourdomain.com/api/v1/email-marketing/subscribers?page=1&limit=10" \
  -H "Authorization: Bearer sk_live_your_key"
```

**Response:**

```json
{
  "data": [
    {
      "id": "sub_123",
      "email": "john@example.com",
      "name": "John Doe",
      "status": "enabled",
      "lists": ["list_1", "list_2"],
      "customFields": {
        "company": "Acme Inc"
      },
      "createdAt": "2026-02-24T10:00:00Z",
      "updatedAt": "2026-02-24T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalDocs": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Create Subscriber

```bash
curl -X POST "https://yourdomain.com/api/v1/email-marketing/subscribers" \
  -H "Authorization: Bearer sk_live_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "name": "Jane Smith",
    "lists": ["list_1"],
    "customFields": {
      "company": "Tech Corp",
      "role": "Developer"
    }
  }'
```

**Response:**

```json
{
  "data": {
    "id": "sub_124",
    "email": "jane@example.com",
    "name": "Jane Smith",
    "status": "enabled",
    "lists": ["list_1"],
    "customFields": {
      "company": "Tech Corp",
      "role": "Developer"
    },
    "createdAt": "2026-02-25T00:35:00Z"
  },
  "message": "Subscriber created successfully"
}
```

### Error Responses

#### Missing API Key

```json
{
  "error": "Missing Authorization header",
  "code": "MISSING_KEY"
}
```

#### Invalid API Key

```json
{
  "error": "Invalid API key",
  "code": "INVALID_KEY"
}
```

#### Insufficient Permissions

```json
{
  "error": "API key does not have required scope: subscribers:create",
  "code": "SCOPE_REQUIRED"
}
```

#### Rate Limit Exceeded

```json
{
  "error": "Rate limit exceeded for hour. Try again in 3600 seconds.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

#### IP Not Allowed

```json
{
  "error": "IP 203.0.113.1 is not allowed to use this API key",
  "code": "IP_NOT_ALLOWED"
}
```

---

## ✅ Best Practices

### 1. Use Environment-Specific Keys

```javascript
// ❌ DON'T: Use live key in development
const API_KEY = 'sk_live_...'

// ✅ DO: Use environment variables
const API_KEY = process.env.NODE_ENV === 'production'
  ? process.env.EMAIL_API_KEY_LIVE
  : process.env.EMAIL_API_KEY_TEST
```

### 2. Principle of Least Privilege

Only grant the scopes you actually need.

```javascript
// ❌ DON'T: Grant all permissions
scopes: [
  'subscribers:create',
  'subscribers:read',
  'subscribers:update',
  'subscribers:delete',
  'campaigns:send',  // Not needed!
  'campaigns:delete' // Not needed!
]

// ✅ DO: Grant minimal permissions
scopes: [
  'subscribers:create',
  'subscribers:read'
]
```

### 3. Rotate Keys Regularly

**Recommended schedule:**

- **High-security:** Every 30 days
- **Normal security:** Every 90 days
- **Low-security:** Every 180 days

### 4. Monitor Key Usage

Set up alerts for:

- Unexpected IP addresses
- Unusual usage patterns
- Failed authentication attempts
- Rate limit violations

### 5. Store Keys Securely

```javascript
// ❌ DON'T: Hardcode in source code
const API_KEY = 'sk_live_abc123...'

// ❌ DON'T: Commit to Git
// .env file should be in .gitignore

// ✅ DO: Use environment variables
const API_KEY = process.env.EMAIL_API_KEY

// ✅ DO: Use secrets management (AWS Secrets Manager, Vault, etc.)
const API_KEY = await secretsManager.getSecret('email-api-key')
```

### 6. Implement Webhook Notifications

Configure webhook URL to get notified about:

- API key usage
- Rate limit violations
- Failed authentication attempts

**Example:**

```
Webhook URL: https://your-app.com/webhooks/api-key-events

Payload:
{
  "event": "rate_limit_exceeded",
  "apiKey": {
    "id": "key_123",
    "name": "Production API",
    "keyPrefix": "sk_live_abc1..."
  },
  "timestamp": "2026-02-25T00:40:00Z",
  "ip": "203.0.113.1",
  "endpoint": "/api/v1/email-marketing/subscribers"
}
```

---

## 🔧 Troubleshooting

### Issue: "Missing Authorization header"

**Cause:** You forgot to include the `Authorization` header.

**Solution:**

```javascript
// ❌ Wrong
fetch('/api/v1/email-marketing/subscribers')

// ✅ Correct
fetch('/api/v1/email-marketing/subscribers', {
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  }
})
```

### Issue: "Invalid API key format"

**Cause:** API key doesn't start with `sk_live_` or `sk_test_`.

**Solution:** Check that you copied the full key, including the prefix.

```
✅ Correct: sk_live_a1b2c3d4e5f6...
❌ Wrong:   a1b2c3d4e5f6...
```

### Issue: "API key has expired"

**Cause:** The key has passed its expiration date.

**Solution:** Create a new API key.

### Issue: "IP not allowed"

**Cause:** Your server's IP is not in the allowed IPs list.

**Solution:**

1. Find your server's public IP: `curl ifconfig.me`
2. Add it to the allowed IPs list in the admin panel
3. Or remove IP restrictions if not needed

### Issue: "Rate limit exceeded"

**Cause:** You've made too many requests.

**Solution:**

1. Implement exponential backoff
2. Request higher rate limits from admin
3. Cache responses to reduce API calls

### Issue: "Scope required"

**Cause:** Your API key doesn't have the necessary permission.

**Solution:**

1. Check which scope is required (error message will tell you)
2. Add the scope to your API key in admin panel
3. Or create a new key with correct scopes

---

## 📊 Usage Monitoring

### Via Admin Panel

1. Navigate to **Email Marketing → API Keys**
2. Click on an API key
3. View usage stats:
   - Total requests
   - Last used timestamp
   - Last used IP
   - Last used endpoint

### Programmatic Monitoring

Query the `email-api-keys` collection to get usage data:

```javascript
const key = await payload.findByID({
  collection: 'email-api-keys',
  id: 'key_123'
})

console.log({
  totalRequests: key.usage.totalRequests,
  lastUsedAt: key.usage.lastUsedAt,
  lastUsedIp: key.usage.lastUsedIp,
  lastUsedEndpoint: key.usage.lastUsedEndpoint
})
```

---

## 🎓 Summary

### What You Learned

✅ How to create and manage API keys
✅ How to use API keys for authentication
✅ Understanding scopes and permissions
✅ How rate limiting works
✅ Security best practices
✅ Common troubleshooting steps

### Next Steps

1. ✅ Create your first API key
2. ✅ Test it with the example endpoints
3. ✅ Integrate into your application
4. ✅ Set up monitoring and alerts
5. ✅ Implement key rotation schedule

---

## 📚 Related Documentation

- [Email Marketing API Reference](./API_DOCUMENTATION.md)
- [Security Hardening Guide](../SECURITY_HARDENING_GUIDE.md)
- [Rate Limiting Deep Dive](./RATE_LIMITING_GUIDE.md)
- [Webhook Events Guide](./WEBHOOK_EVENTS_GUIDE.md)

---

**Questions?** Contact your system administrator or refer to the [Master Implementation Plan](./MASTER_IMPLEMENTATIEPLAN_v1.md).
