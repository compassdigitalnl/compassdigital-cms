# Security Hardening Guide

## 📋 Overview

This guide documents the security measures implemented in the SiteForge Payload CMS application and provides a comprehensive security audit checklist.

---

## 🛡️ Implemented Security Measures

### 1. Rate Limiting (Middleware)

**File**: `src/middleware.ts`

Rate limiting prevents abuse and DoS attacks by limiting request frequency per IP address.

#### Current Limits

| Endpoint Type | Window | Max Requests |
|---------------|--------|--------------|
| General API | 15 minutes | 100 |
| Contact Form | 1 hour | 5 |
| AI/Generation | 1 minute | 10 |

#### Response Headers

When rate limit is applied:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1704067200000
Retry-After: 900
```

When rate limit is exceeded (429 response):
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": "2024-01-01T00:00:00.000Z"
}
```

#### Customization

Edit `src/middleware.ts` to adjust limits:
```typescript
const RATE_LIMIT_CONFIG = {
  api: {
    windowMs: 15 * 60 * 1000, // Adjust window
    maxRequests: 100,         // Adjust limit
  },
  // ... other configs
}
```

### 2. Security Headers (Middleware)

Automatically applied to all responses via `src/middleware.ts`:

#### Headers Applied

1. **X-Frame-Options**: `SAMEORIGIN`
   - Prevents clickjacking attacks
   - Only allows embedding on same origin

2. **X-Content-Type-Options**: `nosniff`
   - Prevents MIME type sniffing
   - Browsers strictly follow Content-Type

3. **X-XSS-Protection**: `1; mode=block`
   - Legacy XSS protection (still useful)
   - Blocks page if XSS detected

4. **Referrer-Policy**: `strict-origin-when-cross-origin`
   - Controls referrer information sent
   - Full URL for same-origin, origin only for cross-origin

5. **Permissions-Policy**: Restricts dangerous features
   ```
   camera=(), microphone=(), geolocation=(), interest-cohort=()
   ```

6. **Strict-Transport-Security** (Production only)
   ```
   max-age=31536000; includeSubDomains; preload
   ```
   - Forces HTTPS for 1 year
   - Includes all subdomains
   - Eligible for browser preload list

7. **Content-Security-Policy** (CSP)
   ```
   default-src 'self';
   script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com ...;
   style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
   ...
   ```

#### Customize CSP

Edit `src/middleware.ts`:
```typescript
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' https://trusted-cdn.com",
  // Add your trusted sources
]
```

### 3. reCAPTCHA v3 Spam Protection

**Files**:
- `src/hooks/useRecaptcha.ts` - Client-side
- `src/lib/recaptcha/verify.ts` - Server-side
- `src/app/api/contact/route.ts` - Integration

#### Features

- Invisible to users (no challenges)
- Score-based assessment (0.0 - 1.0)
- Configurable minimum score (default: 0.5)
- Graceful degradation if not configured

#### Configuration

See `RECAPTCHA_SETUP_GUIDE.md` for detailed setup instructions.

### 4. Database Security

**PostgreSQL**:
- Connection pooling with SSL
- Parameterized queries (prevents SQL injection)
- Row-level security (if configured)

**Environment Variables**:
- Database credentials stored in `.env` (never committed)
- Automatic SSL for production connections

### 5. Input Validation & Sanitization

#### Contact Form API (`src/app/api/contact/route.ts`)

- Email format validation (regex)
- Required field validation
- Type checking (TypeScript)
- reCAPTCHA verification

#### Best Practices

- Always validate input on server-side
- Never trust client-side validation alone
- Use TypeScript for type safety
- Sanitize user input before database storage

### 6. Authentication & Authorization

**Payload CMS**:
- Built-in authentication system
- Password hashing (bcrypt)
- Session management
- CSRF protection

**API Routes**:
- Protected by Payload's auth middleware
- Admin-only endpoints require authentication

### 7. Error Handling

**Sentry Integration**:
- Captures errors automatically
- Filters sensitive data
- Development mode: logs to console only
- Production mode: sends to Sentry

**Error Responses**:
- Never expose stack traces in production
- Generic error messages to users
- Detailed logging for developers

### 8. Environment Variable Security

**Best Practices**:
- Use `.env` file (never commit to Git)
- Add `.env` to `.gitignore`
- Use different keys for dev/staging/prod
- Rotate secrets regularly

**Sensitive Variables**:
```bash
PAYLOAD_SECRET=
DATABASE_URL=
OPENAI_API_KEY=
RECAPTCHA_SECRET_KEY=
SENTRY_AUTH_TOKEN=
RESEND_API_KEY=
STRIPE_SECRET_KEY=
```

---

## ✅ Security Audit Checklist

### Environment Configuration

- [ ] `.env` file exists and is not committed to Git
- [ ] `.env` is listed in `.gitignore`
- [ ] All required environment variables are set
- [ ] Different secrets used for dev/staging/prod
- [ ] No hardcoded secrets in source code
- [ ] `PAYLOAD_SECRET` is at least 32 characters
- [ ] Database connection uses SSL in production
- [ ] `NODE_ENV=production` in production

### Authentication & Authorization

- [ ] Payload admin access protected with strong password
- [ ] Admin user count is minimal (principle of least privilege)
- [ ] Session timeout configured appropriately
- [ ] CSRF protection enabled
- [ ] Password requirements enforced (length, complexity)
- [ ] Failed login attempts limited
- [ ] Two-factor authentication enabled (if available)

### API Security

- [ ] Rate limiting enabled (middleware)
- [ ] reCAPTCHA configured for public forms
- [ ] All user input validated server-side
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization, CSP)
- [ ] CORS configured for production
- [ ] API keys rotated regularly
- [ ] Sensitive endpoints require authentication

### Headers & Policies

- [ ] Security headers configured (middleware)
- [ ] HSTS enabled in production
- [ ] CSP configured and tested
- [ ] X-Frame-Options prevents clickjacking
- [ ] Referrer-Policy configured
- [ ] Permissions-Policy restricts dangerous features

### Data Protection

- [ ] Database backups configured (see BACKUP_STRATEGY_GUIDE.md)
- [ ] Backups tested and verified
- [ ] Sensitive data encrypted at rest
- [ ] SSL/TLS configured for all connections
- [ ] File uploads validated (type, size)
- [ ] User data anonymization considered

### Monitoring & Logging

- [ ] Sentry error tracking configured
- [ ] Google Analytics configured (optional)
- [ ] Rate limit violations monitored
- [ ] Failed authentication attempts logged
- [ ] Security headers validated (use securityheaders.com)
- [ ] SSL certificate valid and auto-renewing

### Dependencies & Updates

- [ ] All npm packages up to date (`npm audit`)
- [ ] No critical vulnerabilities (`npm audit fix`)
- [ ] Dependabot/Renovate configured (GitHub)
- [ ] Regular dependency updates scheduled
- [ ] Security patches applied promptly

### Third-Party Services

- [ ] OpenAI API key restricted by IP (if possible)
- [ ] Resend email service configured
- [ ] reCAPTCHA keys are production keys
- [ ] Stripe webhooks using webhook secrets
- [ ] S3 bucket permissions configured (if using)
- [ ] All third-party keys rotated regularly

### Infrastructure Security

- [ ] Firewall configured (only ports 80, 443 open)
- [ ] SSH key-based authentication only
- [ ] Root login disabled
- [ ] Automatic security updates enabled
- [ ] DDoS protection enabled (Cloudflare, etc.)
- [ ] Regular security scans scheduled

### Code Security

- [ ] No secrets committed to Git (check history)
- [ ] TypeScript strict mode enabled
- [ ] ESLint security rules configured
- [ ] Code review process in place
- [ ] Security testing in CI/CD pipeline
- [ ] Dependency scanning in CI/CD

---

## 🔍 Security Testing

### 1. Headers Test

Use [Security Headers](https://securityheaders.com) to test your deployed site:

```bash
# Test your production URL
https://securityheaders.com/?q=https://yourdomain.com
```

**Target Grade**: A or A+

### 2. SSL/TLS Test

Use [SSL Labs](https://www.ssllabs.com/ssltest/) to test SSL configuration:

```bash
# Test your production domain
https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
```

**Target Grade**: A or A+

### 3. Rate Limiting Test

```bash
# Test contact form rate limit (should fail after 5 requests)
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","message":"Test message"}' \
    -w "\nStatus: %{http_code}\n"
done
```

**Expected**: First 5 succeed (200), remaining fail (429)

### 4. reCAPTCHA Test

```bash
# Test without reCAPTCHA token (should fail if configured)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test"}'
```

**Expected**: 400 or 403 error if reCAPTCHA configured

### 5. SQL Injection Test

Try to submit malicious input through forms:

```
Email: test@example.com' OR '1'='1
Message: '; DROP TABLE pages; --
```

**Expected**: Input sanitized, no SQL injection

### 6. XSS Test

Try to submit script tags:

```
Name: <script>alert('XSS')</script>
Message: <img src=x onerror="alert('XSS')">
```

**Expected**: Scripts blocked by CSP, input sanitized

---

## 🚨 Incident Response Plan

### 1. Detect

**Monitoring**:
- Sentry alerts for errors/exceptions
- Rate limit violations in logs
- Failed authentication attempts
- Unusual traffic patterns

### 2. Analyze

**Questions to Ask**:
- What data was accessed?
- How was the vulnerability exploited?
- What is the scope of the breach?
- Are there any ongoing attacks?

### 3. Contain

**Immediate Actions**:
- Disable compromised accounts
- Rotate all API keys and secrets
- Block malicious IP addresses
- Enable maintenance mode if needed

### 4. Recover

**Recovery Steps**:
- Restore from clean backups
- Patch vulnerabilities
- Update dependencies
- Reset all user passwords

### 5. Learn

**Post-Mortem**:
- Document the incident
- Update security measures
- Train team on lessons learned
- Improve monitoring and detection

---

## 📚 Security Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [Payload Security](https://payloadcms.com/docs/authentication/overview)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)

### Tools
- [Security Headers](https://securityheaders.com)
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)
- [OWASP ZAP](https://www.zaproxy.org/)

### Monitoring
- [Sentry](https://sentry.io/)
- [Datadog](https://www.datadoghq.com/)
- [New Relic](https://newrelic.com/)

---

## 🔄 Regular Maintenance

### Weekly
- [ ] Review Sentry error reports
- [ ] Check rate limit logs
- [ ] Review failed authentication attempts

### Monthly
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Test backup restore process
- [ ] Review access logs for anomalies
- [ ] Update dependencies

### Quarterly
- [ ] Rotate API keys and secrets
- [ ] Review and update security policies
- [ ] Conduct security testing (penetration test)
- [ ] Update incident response plan
- [ ] Review OWASP Top 10 for new threats

---

**Status**: ✅ Implementation Complete
**Files Modified**:
- `src/middleware.ts` - Rate limiting + security headers
- `.env.example` - Security configuration
- This guide - Security documentation

**Next Steps**: Complete security audit checklist before production deployment
