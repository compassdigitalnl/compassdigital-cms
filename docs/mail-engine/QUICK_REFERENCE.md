# 📋 EMAIL MARKETING ENGINE - QUICK REFERENCE

**Voor het volledige plan:** Zie `MASTER_IMPLEMENTATIEPLAN_v1.md`

---

## 🚀 QUICK START

### 1. Directory Structuur (waar gaat wat?)

```
src/
├── lib/email/
│   ├── listmonk/         # Listmonk API client & sync
│   ├── automation/       # Event-driven automation
│   ├── flows/            # Welkomstreeksen etc.
│   ├── deliverability/   # DNS, warmup, reputation
│   └── analytics/        # Tracking & reporting

├── branches/shared/collections/email-marketing/
│   └── [8 collections]   # EmailSubscribers, EmailLists, etc.

├── branches/shared/components/GrapesEmailEditor/
│   └── [Visual editor]   # Drag-and-drop template builder

├── types/
│   ├── email-marketing.ts  # Centrale types
│   └── listmonk.ts         # Listmonk API types

└── lib/queue/workers/
    ├── emailWorker.ts      # Campaign & automation jobs
    └── emailFlowWorker.ts  # Flow execution
```

---

## 🚩 FEATURE FLAGS

### .env Toevoegen:

```bash
# Master switch
ENABLE_EMAIL_MARKETING=false

# Subfeatures
ENABLE_EMAIL_CAMPAIGNS=false
ENABLE_EMAIL_AUTOMATION=false
ENABLE_EMAIL_FLOWS=false
ENABLE_EMAIL_GRAPES_EDITOR=false
ENABLE_EMAIL_DELIVERABILITY=false
ENABLE_EMAIL_ANALYTICS=false

# Listmonk
LISTMONK_URL=http://localhost:9000
LISTMONK_API_USER=admin
LISTMONK_API_PASS=<wachtwoord>

# SMTP
SMTP_HOST=mail.example.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASS=<wachtwoord>
```

### lib/featureGuard.ts Uitbreiden:

```typescript
export const emailMarketingFeatures = {
  isEnabled: () => process.env.ENABLE_EMAIL_MARKETING === 'true',
  campaigns: () => emailMarketingFeatures.isEnabled() && process.env.ENABLE_EMAIL_CAMPAIGNS === 'true',
  automation: () => emailMarketingFeatures.isEnabled() && process.env.ENABLE_EMAIL_AUTOMATION === 'true',
  // ... etc
}
```

---

## 🗄️ DATABASE MIGRATIES

### Stap 1: Collections Migratie

```bash
# ⚠️ Zet feature flag EERST op true!
ENABLE_EMAIL_MARKETING=true

# Genereer migratie
npx payload migrate:create email-marketing-collections

# Review SQL in src/migrations/

# Run migratie
npx payload migrate
```

### Stap 2: Custom Indexes

```bash
# Genereer tweede migratie voor performance indexes
npx payload migrate:create email-marketing-indexes

# Edit de file en voeg 13+ indexes toe (zie master plan)
# Run migratie
npx payload migrate
```

### Test Migratie op Verse DB:

```bash
# Start test database
docker run --name test-postgres -e POSTGRES_PASSWORD=test -p 5433:5432 -d postgres:16

# Test migratie
DATABASE_URL="postgresql://postgres:test@localhost:5433/test" npx payload migrate

# Check tabellen
DATABASE_URL="postgresql://postgres:test@localhost:5433/test" psql -c "\dt" -c "\di"

# Cleanup
docker stop test-postgres && docker rm test-postgres
```

---

## 🔧 TYPESCRIPT TYPES

### Centrale Types Locaties:

- **src/types/email-marketing.ts** - Job types, automation types, GrapesJS types
- **src/types/listmonk.ts** - Listmonk API types
- **src/payload-types.ts** - Auto-generated (Payload collections)

### Type Import Pattern:

```typescript
// ✅ CORRECT
import type { ListmonkSubscriber, SendCampaignJob } from '@/types/email-marketing'
import type { EmailSubscriber } from '@/payload-types'

// ❌ FOUT (niet type-only import)
import { ListmonkSubscriber } from '@/types/email-marketing'
```

---

## 🧪 TESTING CHEAT SHEET

### Unit Test (Vitest):

```typescript
// lib/email/listmonk/client.test.ts
import { describe, it, expect, vi } from 'vitest'

describe('ListmonkClient', () => {
  it('should create subscriber', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    // ... test logic
  })
})
```

### E2E Test (Playwright):

```typescript
// tests/e2e/email-marketing.e2e.spec.ts
test('should create subscriber', async ({ page }) => {
  await page.goto('http://localhost:3020/admin')
  // ... test logic
})
```

### Run Tests:

```bash
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:coverage     # Coverage report
```

---

## 🚀 BUILD & DEPLOYMENT

### Pre-Deployment Checks:

```bash
# 1. Type validation
npm run validate-email-types

# 2. Tests
npm run test

# 3. Build
npm run build

# 4. Bundle size
npm run analyze:email

# 5. Database migraties
npx payload migrate:status
```

### Deployment Script:

```bash
# Run pre-flight checks
bash scripts/deploy-email-marketing.sh

# Deploy
npm run deploy
```

---

## ⚠️ TOP 5 VALKUILEN

### 1. Migratie met feature flag uit

```bash
❌ ENABLE_EMAIL_MARKETING=false npx payload migrate:create
✅ ENABLE_EMAIL_MARKETING=true npx payload migrate:create
```

### 2. Foreign key indexes vergeten

```sql
✅ CREATE INDEX idx_email_subscribers_tenant_id ON email_subscribers (tenant_id);
```

### 3. Listmonk ID niet opslaan

```typescript
✅ await payload.update({ id, data: { listmonkId: result.data.id } })
```

### 4. GrapesJS CSS niet inlinen

```typescript
❌ editor.getHtml()
✅ editor.runCommand('gjs-get-inlined-html')
```

### 5. Geen tenant filter (data leakage!)

```typescript
✅ where: { AND: [{ tenant: { equals: req.user.tenant } }, ...] }
```

---

## 📝 FASERING (11.5 weken)

| Fase | Duur | Focus |
|------|------|-------|
| **0** | 1 week | Voorbereiding & structuur |
| **1** | 2 weken | Listmonk + basis collections |
| **2** | 1.5 weken | GrapesJS template editor |
| **3** | 1.5 weken | Campagnes + analytics |
| **4** | 1 week | Deliverability + warmup |
| **5** | 2 weken | Automation rules |
| **6** | 1.5 weken | Flows |
| **7** | 1 week | Billing & usage tracking |
| **8** | 1 week | Productie-klaar |

---

## 🎯 PER-FASE CHECKLIST

Herhaal dit voor elke fase:

```
□ Feature branch aanmaken (feature/email-marketing-fase-X)
□ Pull latest main
□ Zet feature flags correct
□ Run tests VOOR je begint (moet slagen!)
□ Implementeer feature
□ Write unit tests (80%+ coverage)
□ Write integration tests
□ Write E2E test
□ Run full test suite (npm run test)
□ Run type check (npm run typecheck)
□ Run build (npm run build)
□ Bundle size check (npm run analyze)
□ Database migratie test (verse DB)
□ Code review (1+ developers)
□ Merge naar main
□ Deploy naar staging
□ Smoke test staging
□ Deploy naar productie
```

---

## 🔗 BELANGRIJKE COMMANDS

```bash
# Development
npm run dev                           # Start dev server
npm run validate-env                  # Check environment
npm run validate-email-types          # Type validation

# Testing
npm run test                          # Unit tests
npm run test:e2e                      # E2E tests
npm run test:coverage                 # Coverage report

# Database
npx payload migrate:create <name>     # Nieuwe migratie
npx payload migrate                   # Run migraties
npx payload migrate:status            # Check status
npx payload migrate:rollback          # Rollback laatste

# Build & Deploy
npm run build                         # Production build
npm run analyze                       # Bundle analysis
npm run analyze:email                 # Email marketing bundle
bash scripts/deploy-email-marketing.sh # Pre-flight checks

# Monitoring
curl http://localhost:3020/api/health       # General health
curl http://localhost:3020/api/health/email # Email health
```

---

## 📚 DOCUMENTATIE LINKS

- **Master Plan:** `docs/mail-engine/MASTER_IMPLEMENTATIEPLAN_v1.md`
- **Origineel Plan:** `docs/mail-engine/implementatieplan-email-engine-v3 (1).md`
- **Listmonk Docs:** https://listmonk.app/docs/
- **GrapesJS Docs:** https://grapesjs.com/docs/
- **BullMQ Docs:** https://docs.bullmq.io/

---

## 🆘 TROUBLESHOOTING

### Build faalt met "Module not found: grapesjs"

```bash
# Check feature flag
echo $ENABLE_EMAIL_GRAPES_EDITOR

# Install packages als feature enabled
npm install grapesjs @grapesjs/react grapesjs-preset-newsletter
```

### Migratie faalt met "Column already exists"

```bash
# Check bestaande migraties
npx payload migrate:status

# Rollback als nodig
npx payload migrate:rollback
```

### Tests falen met "Redis connection refused"

```bash
# Start Redis
docker run -d -p 6379:6379 redis:7-alpine

# Of check .env
echo $REDIS_URL
```

### Listmonk niet bereikbaar

```bash
# Check Listmonk status
curl http://localhost:9000/api/health

# Start Listmonk (Docker)
cd /path/to/listmonk
docker-compose up -d

# Check logs
docker logs listmonk
```

---

**Voor complete details, zie:** `MASTER_IMPLEMENTATIEPLAN_v1.md`
