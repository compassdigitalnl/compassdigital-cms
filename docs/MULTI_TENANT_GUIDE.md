# 🏢 Multi-Tenant SaaS Platform - Complete Guide

**Platform Architectuur:** Deployment-per-Tenant
**Status:** Production-Ready Foundation
**Laatst bijgewerkt:** Februari 2026

---

## 📋 Inhoudsopgave

1. [Overzicht](#overzicht)
2. [Architectuur](#architectuur)
3. [Template Systeem](#template-systeem)
4. [Platform Collections](#platform-collections)
5. [Provisioning Flow](#provisioning-flow)
6. [Client Management](#client-management)
7. [Monitoring](#monitoring)
8. [Implementatie Stappen](#implementatie-stappen)
9. [API Reference](#api-reference)
10. [Kosten & Scaling](#kosten--scaling)

---

## 🎯 Overzicht

### Wat is het?

Een **multi-tenant SaaS platform** waarmee je websites kunt maken en beheren voor meerdere klanten vanuit één centraal admin panel.

### Deployment-per-Tenant Model

```
Global Admin Platform (platform.jouwbedrijf.nl)
    │
    ├── Klant A → clientA.jouwplatform.nl
    │   ├── Eigen Payload CMS (/admin)
    │   ├── Eigen PostgreSQL database
    │   └── Template: E-commerce
    │
    ├── Klant B → clientB.jouwplatform.nl
    │   ├── Eigen Payload CMS (/admin)
    │   ├── Eigen PostgreSQL database
    │   └── Template: Blog
    │
    └── Klant C → clientC.jouwplatform.nl
        ├── Eigen Payload CMS (/admin)
        ├── Eigen PostgreSQL database
        └── Template: B2B
```

**Voordelen:**
- ✅ Complete isolatie tussen klanten (veiligheid)
- ✅ Onafhankelijke scaling per klant
- ✅ Geen performance impact tussen klanten
- ✅ Flexibele configuratie per klant
- ✅ Failure isolation (één crash ≠ alles down)

---

## 🏗️ Architectuur

### Components

#### 1. **Global Admin Platform**
- **URL:** `platform.jouwbedrijf.nl/admin`
- **Doel:** Centraal beheer voor jou als platform admin
- **Functionaliteit:**
  - Klanten toevoegen/verwijderen
  - Template selectie
  - Deployments triggeren
  - Monitoring dashboard
  - Billing beheer

#### 2. **Client Sites**
- **URL:** `{client-domain}.jouwplatform.nl`
- **Doel:** Aparte website per klant
- **Functionaliteit:**
  - Eigen Payload CMS (`/admin`)
  - Eigen database (PostgreSQL)
  - Eigen content & configuratie
  - Template-based features

#### 3. **Provisioning Service**
- **Doel:** Automated client deployment
- **Functionaliteit:**
  - Database provisioning
  - Vercel deployment
  - Domain configuration
  - Environment setup
  - Initial admin creation

#### 4. **Monitoring Service**
- **Doel:** Health tracking van alle sites
- **Functionaliteit:**
  - Periodic health checks
  - Uptime tracking
  - Alert management
  - Performance metrics

### Technology Stack

**Global Admin:**
- Next.js 15
- Payload CMS 3.0 (voor platform management)
- PostgreSQL (platform database)
- React dashboard

**Client Sites:**
- Next.js 15 (same codebase)
- Payload CMS 3.0 (client-specific config)
- PostgreSQL (client database)
- Template-based feature set

**Infrastructure:**
- Vercel (hosting)
- Railway/Supabase (databases)
- GitHub Actions (CI/CD)

---

## 🎨 Template Systeem

### Beschikbare Templates

#### 1. **E-commerce Store**
```typescript
Template ID: 'ecommerce'
Collections: products, product-categories, product-brands, orders, customers, blog-posts
Blocks: hero, product-grid, category-grid, search-bar, quick-order, testimonials
Features: E-commerce, Blog, Forms, Authentication, AI
```

**Beste voor:**
- Online winkels
- Product catalogen
- B2C e-commerce

#### 2. **Blog & Magazine**
```typescript
Template ID: 'blog'
Collections: blog-posts, blog-categories, authors
Blocks: hero, content, testimonials, cta
Features: Blog, Forms, Authentication, AI
```

**Beste voor:**
- Content websites
- Magazines
- News sites

#### 3. **B2B Platform**
```typescript
Template ID: 'b2b'
Collections: products, quotes, customers, orders
Blocks: product-grid, quick-order, search-bar, testimonials
Features: E-commerce, Blog, Forms, Authentication, AI
```

**Beste voor:**
- B2B portals
- Wholesale platforms
- Quote-based sales

#### 4. **Portfolio & Agency**
```typescript
Template ID: 'portfolio'
Collections: cases, services, team
Blocks: hero, content, grid, testimonials
Features: Blog, Forms, AI
```

**Beste voor:**
- Creative agencies
- Freelance portfolios
- Service companies

#### 5. **Corporate Website**
```typescript
Template ID: 'corporate'
Collections: services, team, cases
Blocks: hero, content, feature-grid, testimonials
Features: Blog, Forms, AI
```

**Beste voor:**
- Corporate sites
- Professional services
- Company websites

### Template Configuratie

**File:** `src/templates/index.ts`

```typescript
export interface TemplateConfig {
  id: string
  name: string
  description: string
  collections: string[]        // Enabled collections
  blocks: string[]            // Available blocks
  plugins: string[]           // Active plugins
  globals: string[]           // Global settings
  features: {                 // Feature flags
    ecommerce?: boolean
    blog?: boolean
    forms?: boolean
    authentication?: boolean
    multiLanguage?: boolean
    ai?: boolean
  }
  defaultSettings?: Record<string, any>
}
```

### Per-Client Customization

Templates zijn **startpunten**. Per klant kun je:
- ✅ Collections disablen uit template
- ✅ Extra features enablen
- ✅ Custom environment variables toevoegen
- ✅ Specifieke settings overriden

**Voorbeeld:**
```typescript
// E-commerce template ZONDER blog voor Klant A
{
  template: 'ecommerce',
  disabledCollections: ['blog-posts', 'blog-categories'],
  customSettings: {
    showComparePrice: false,
    enableWishlist: false
  }
}
```

---

## 📊 Platform Collections

### 1. Clients Collection

**File:** `src/platform/collections/Clients.ts`

**Velden:**
```typescript
{
  // Basic Info
  name: string                    // Client naam
  domain: string                  // Subdomain (bijv. "clientA")
  contactEmail: string            // Primary contact
  contactName?: string
  contactPhone?: string

  // Template & Features
  template: 'ecommerce' | 'blog' | 'b2b' | 'portfolio' | 'corporate'
  enabledFeatures: string[]       // Extra features
  disabledCollections: string[]   // Disabled from template

  // Deployment
  status: 'pending' | 'provisioning' | 'deploying' | 'active' | 'failed' | 'suspended'
  deploymentUrl: string           // https://clientA.jouwplatform.nl
  adminUrl: string                // /admin URL
  vercelProjectId: string
  databaseUrl: string (encrypted)

  // Configuration
  customEnvironment: JSON         // Custom env vars
  customSettings: JSON            // Client-specific settings

  // Billing
  plan: 'free' | 'starter' | 'professional' | 'enterprise'
  billingStatus: 'active' | 'past_due' | 'cancelled' | 'trial'
  monthlyFee: number
  nextBillingDate: Date

  // Health & Monitoring
  lastHealthCheck: Date
  healthStatus: 'healthy' | 'warning' | 'critical' | 'unknown'
  uptimePercentage: number

  // Internal
  notes: string                   // Admin notes
}
```

### 2. Deployments Collection

**File:** `src/platform/collections/Deployments.ts`

**Velden:**
```typescript
{
  client: Relationship<'clients'>
  status: 'pending' | 'in_progress' | 'success' | 'failed' | 'rolled_back'
  environment: 'production' | 'staging' | 'development'
  type: 'initial' | 'update' | 'hotfix' | 'rollback' | 'migration'

  // Version
  version: string
  gitCommit: string
  gitBranch: string

  // Vercel
  vercelDeploymentId: string
  vercelDeploymentUrl: string

  // Timing
  startedAt: Date
  completedAt: Date
  duration: number (seconds)

  // Logs
  logs: string
  errorMessage?: string
  errorStack?: string

  // Snapshots
  configSnapshot: JSON
  environmentSnapshot: JSON

  // Health
  healthCheckPassed: boolean
  healthCheckResults: JSON
}
```

---

## 🚀 Provisioning Flow

### Complete Workflow

```
User clicks "Add New Client" in Global Admin
    ↓
1. [Validate Request]
   ✓ Check required fields
   ✓ Validate domain format
   ✓ Check template exists
    ↓
2. [Load Template]
   ✓ Get template configuration
   ✓ Load collections, blocks, plugins
    ↓
3. [Provision Database]
   ✓ Create PostgreSQL database (Railway/Supabase)
   ✓ Get connection URL
    ↓
4. [Generate Environment]
   ✓ Generate PAYLOAD_SECRET (32-char random)
   ✓ Create .env with all variables
   ✓ Include template-specific settings
    ↓
5. [Deploy to Vercel]
   ✓ Create Vercel project
   ✓ Set environment variables
   ✓ Trigger deployment
   ✓ Wait for completion
    ↓
6. [Configure Domain]
   ✓ Add custom domain to Vercel
   ✓ Setup DNS (automatic with Vercel)
    ↓
7. [Create Admin User]
   ✓ Generate secure password
   ✓ Create user via API
   ✓ Send welcome email
    ↓
8. [Save to Platform DB]
   ✓ Create client record
   ✓ Create deployment record
   ✓ Set status to 'active'
    ↓
9. [Post-Deploy Health Check]
   ✓ Check site is accessible
   ✓ Verify /api/health endpoint
   ✓ Update client health status
    ↓
✅ DONE! Client site is live
```

### Code Implementation

**File:** `src/platform/services/provisioning.ts`

```typescript
const result = await provisionClient({
  clientName: 'Acme Corp',
  contactEmail: 'admin@acme.com',
  domain: 'acme',
  template: 'ecommerce',
  enabledFeatures: ['blog', 'ai'],
  plan: 'professional'
})

if (result.success) {
  console.log(`Client deployed: ${result.deploymentUrl}`)
  console.log(`Admin panel: ${result.adminUrl}`)
}
```

### Timeline

**Typical provisioning time: 3-5 minuten**

- Database provision: ~30s
- Environment generation: <1s
- Vercel deployment: 2-3min
- Domain configuration: ~30s
- Admin creation: <5s
- Health checks: ~10s

---

## 🔧 Client Management

### Global Admin Dashboard

**URL:** `/platform/admin`

**Features:**

#### Clients Overview
```
┌─────────────────────────────────────────────┐
│ Clients (128)                               │
├─────────────────────────────────────────────┤
│ [+ Add New Client]  [Import]  [Export]      │
│                                             │
│ 🔍 Search: ________  Filter: All ▼         │
│                                             │
│ ┌───────────────────────────────────────┐  │
│ │ Acme Corp              E-commerce      │  │
│ │ acme.jouwplatform.nl   ✅ Active      │  │
│ │ Last check: 2min ago   Uptime: 99.9%  │  │
│ │ [View Site] [Admin] [Settings] [...]  │  │
│ └───────────────────────────────────────┘  │
│                                             │
│ ┌───────────────────────────────────────┐  │
│ │ BlogCo                 Blog            │  │
│ │ blogco.jouwplatform.nl ⚠️  Warning    │  │
│ │ Last check: 5min ago   Uptime: 98.2%  │  │
│ │ [View Site] [Admin] [Settings] [...]  │  │
│ └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

#### Add New Client Modal
```
┌──────────────────────────────────────┐
│ Add New Client                       │
├──────────────────────────────────────┤
│                                      │
│ Client Name: _________________       │
│ Domain: _____________________.com    │
│ Contact Email: ______________        │
│                                      │
│ Template:                            │
│  ( ) E-commerce Store                │
│  (•) Blog & Magazine                 │
│  ( ) B2B Platform                    │
│  ( ) Portfolio                       │
│  ( ) Corporate                       │
│                                      │
│ Plan:                                │
│  ( ) Starter - €25/month             │
│  (•) Professional - €49/month        │
│  ( ) Enterprise - €99/month          │
│                                      │
│ [Cancel]  [Create & Deploy] ←  3-5min│
└──────────────────────────────────────┘
```

#### Client Details Page
```
┌─────────────────────────────────────────────┐
│ Acme Corp                                   │
│ acme.jouwplatform.nl                        │
├─────────────────────────────────────────────┤
│ [View Live Site]  [Open Admin Panel]       │
│                                             │
│ Status: ✅ Active   Uptime: 99.9%          │
│ Template: E-commerce                        │
│ Plan: Professional (€49/month)              │
│                                             │
│ ─── Deployments (15) ───────────────────   │
│ ✅ v1.2.3 - 2 days ago (dpl_xyz123)        │
│ ✅ v1.2.2 - 1 week ago (dpl_abc456)        │
│ ❌ v1.2.1 - 1 week ago (failed)            │
│                                             │
│ ─── Health Checks ───────────────────────  │
│ Last check: 2 minutes ago                   │
│ Response time: 245ms                        │
│ Database: ✅ Healthy                       │
│ Memory: 45% (512MB / 1GB)                  │
│                                             │
│ ─── Actions ──────────────────────────────  │
│ [Redeploy] [Suspend] [Delete] [Export]     │
└─────────────────────────────────────────────┘
```

### API Endpoints

**Base URL:** `/api/platform`

```typescript
// List all clients
GET /api/platform/clients
Query: ?status=active&template=ecommerce&search=acme&page=1&limit=10

// Create new client (triggers provisioning)
POST /api/platform/clients
Body: { clientName, contactEmail, domain, template, ... }

// Get client details
GET /api/platform/clients/:id

// Update client
PATCH /api/platform/clients/:id
Body: { name?, plan?, customSettings?, ... }

// Delete client (triggers deprovisioning)
DELETE /api/platform/clients/:id

// Client actions
POST /api/platform/clients/:id/suspend
POST /api/platform/clients/:id/activate
POST /api/platform/clients/:id/redeploy

// Health & monitoring
GET /api/platform/clients/:id/health
GET /api/platform/clients/:id/deployments

// Platform stats
GET /api/platform/stats
```

---

## 📊 Monitoring

### Health Checks

**Frequency:** Elke 5 minuten

**What's Checked:**
- ✅ Site accessibility (HEAD request)
- ✅ Health endpoint (`/api/health`)
- ✅ Response time
- ✅ Database connectivity
- ✅ Memory usage

**Statuses:**
- 🟢 **Healthy** - All checks passing
- 🟡 **Warning** - Slow response or minor issues
- 🔴 **Critical** - Site down or major errors
- ⚪ **Unknown** - No recent data

### Uptime Tracking

**Calculation:**
```typescript
Uptime % = (Successful Checks / Total Checks) × 100

// Example: Last 30 days
Total checks: 8,640 (30 days × 24 hours × 12 checks/hour)
Failed checks: 12
Uptime: (8,628 / 8,640) × 100 = 99.86%
```

### Alerts

**Alert Triggers:**
- 🔴 Site down (status 500/503)
- 🔴 Health endpoint failing
- 🟡 Response time > 3 seconds
- 🟡 Uptime drops below 99%

**Alert Channels:**
- Email (via Resend)
- Slack webhook
- SMS (via Twilio) - optional
- PagerDuty - optional

**Configuration:**
```typescript
// src/platform/services/monitoring.ts

await sendAlert({
  clientId: 'client_123',
  clientName: 'Acme Corp',
  issue: 'Site returning 503 errors',
  severity: 'critical'
})
```

---

## 🛠️ Implementatie Stappen

### Fase 1: Platform Setup (Completed ✅)

✅ Template system implemented
✅ Platform collections created
✅ Provisioning service built
✅ Client management API ready
✅ Monitoring service ready

### Fase 2: Infrastructure Integration (TODO)

**1. Database Provisioning**

Kies provider en implementeer:

**Option A: Railway**
```typescript
// src/platform/integrations/railway.ts
import { RailwayClient } from '@railway/sdk'

async function createRailwayDatabase(name: string) {
  const railway = new RailwayClient(process.env.RAILWAY_API_KEY)

  const project = await railway.createProject({
    name: `client-${name}`
  })

  const postgres = await railway.provisionService({
    projectId: project.id,
    type: 'postgresql'
  })

  return {
    url: postgres.connectionString,
    id: postgres.id
  }
}
```

**Option B: Supabase**
```typescript
// src/platform/integrations/supabase.ts
async function createSupabaseProject(name: string) {
  const response = await fetch('https://api.supabase.com/v1/projects', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SUPABASE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `client-${name}`,
      organization_id: process.env.SUPABASE_ORG_ID,
      region: 'eu-west-1'
    })
  })

  const project = await response.json()
  return {
    url: project.database.connection_string,
    id: project.id
  }
}
```

**2. Vercel Integration**

```bash
# Install Vercel SDK
npm install @vercel/client
```

```typescript
// src/platform/integrations/vercel.ts
import { createClient } from '@vercel/client'

const vercel = createClient({ token: process.env.VERCEL_TOKEN })

async function deployClientToVercel(data: {
  name: string
  environment: Record<string, string>
}) {
  // 1. Create project
  const project = await vercel.createProject({
    name: data.name,
    framework: 'nextjs',
    gitRepository: {
      type: 'github',
      repo: process.env.GITHUB_REPO // your-org/client-template
    }
  })

  // 2. Set environment variables
  await vercel.createEnvironmentVariables({
    projectId: project.id,
    variables: Object.entries(data.environment).map(([key, value]) => ({
      key,
      value,
      target: ['production']
    }))
  })

  // 3. Trigger deployment
  const deployment = await vercel.createDeployment({
    projectId: project.id,
    target: 'production'
  })

  return {
    url: deployment.url,
    projectId: project.id,
    deploymentId: deployment.id
  }
}
```

**3. Platform Database Setup**

```bash
# Create platform database (separate from client DBs)
# Railway/Supabase for global admin data
```

```env
# .env.platform
PLATFORM_DATABASE_URL="postgresql://..."
PLATFORM_DOMAIN="jouwplatform.com"
VERCEL_TOKEN="..."
RAILWAY_API_KEY="..."  # or SUPABASE_API_KEY
```

### Fase 3: Global Admin UI (TODO)

**1. Platform Admin Dashboard**

```typescript
// src/platform/app/(admin)/layout.tsx
export default function PlatformAdminLayout({ children }) {
  return (
    <div className="platform-admin">
      <Sidebar />
      <main>{children}</main>
    </div>
  )
}
```

```typescript
// src/platform/app/(admin)/clients/page.tsx
export default function ClientsPage() {
  const { data: clients } = useSWR('/api/platform/clients')

  return (
    <div>
      <h1>Clients</h1>
      <ClientTable clients={clients} />
      <AddClientButton />
    </div>
  )
}
```

**2. React Components**

```
src/platform/components/
├── ClientTable.tsx
├── ClientCard.tsx
├── AddClientModal.tsx
├── DeploymentLog.tsx
├── HealthStatus.tsx
└── MonitoringDashboard.tsx
```

### Fase 4: Testing & Production (TODO)

**1. Test Provisioning Flow**

```bash
# Test client creation end-to-end
npm run test:provisioning
```

**2. Setup Monitoring**

```bash
# Start monitoring service
npm run start:monitoring
```

**3. Deploy Platform**

```bash
# Deploy global admin platform
vercel --prod

# Setup scheduled health checks
# Use Vercel Cron or separate service
```

---

## 💰 Kosten & Scaling

### Per Client Kosten

**Infrastructure:**
- Database (Railway): €5/maand
- Vercel: Gratis (tot 100 deployments in Pro)
- **Totaal per client: ~€5/maand**

**Platform Kosten:**
- Vercel Pro: €20/maand (unlimited deployments)
- Platform database: €5/maand
- Domain: €10/jaar
- **Totaal platform: ~€25/maand**

### Break-Even Analysis

**Scenario: €25/client/maand**

| Klanten | Infrastructure | Marge | Totaal Winst |
|---------|----------------|-------|--------------|
| 10      | €50           | €200  | €150/maand   |
| 50      | €250          | €1000 | €750/maand   |
| 100     | €500          | €2000 | €1500/maand  |
| 500     | €2500         | €10k  | €7.5k/maand  |

### Scaling Limits

**Vercel Pro:**
- Unlimited deployments ✅
- 1000 GB bandwidth/maand
- 6000 build minutes/maand

**Database:**
- Railway: Unlimited projects
- Supabase: Unlimited projects

**Praktisch limiet: 500-1000 klanten** zonder extra optimalisatie.

Voor 1000+: Overweeg Enterprise plan of self-hosted infrastructure.

---

## 📚 API Reference

### Complete API Documentation

Zie `src/platform/api/clients.ts` voor volledige implementatie.

**Quick Reference:**

```bash
# List clients
curl -X GET https://platform.jouwbedrijf.nl/api/platform/clients

# Create client
curl -X POST https://platform.jouwbedrijf.nl/api/platform/clients \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Acme Corp",
    "contactEmail": "admin@acme.com",
    "domain": "acme",
    "template": "ecommerce",
    "plan": "professional"
  }'

# Get client health
curl -X GET https://platform.jouwbedrijf.nl/api/platform/clients/:id/health

# Redeploy client
curl -X POST https://platform.jouwbedrijf.nl/api/platform/clients/:id/redeploy
```

---

## 🎯 Next Steps

### Immediate Tasks

1. **Implement Database Integration**
   - Kies Railway of Supabase
   - Implement provisioning API
   - Test database creation

2. **Implement Vercel Integration**
   - Setup Vercel API client
   - Implement deployment logic
   - Test end-to-end deployment

3. **Build Global Admin UI**
   - Client management dashboard
   - Template selection interface
   - Monitoring dashboard

4. **Testing**
   - Test provisioning flow
   - Test health checks
   - Load testing

5. **Production Deployment**
   - Deploy platform
   - Setup monitoring
   - Documentation

### Future Enhancements

- Custom domains (bring your own domain)
- White-label options
- Advanced billing (Stripe integration)
- Client portal (self-service)
- Automated backups
- Staging environments per client
- Multi-region deployment
- Custom templates (user-created)

---

## 📖 Resources

**Files:**
- `src/templates/` - Template definitions
- `src/templates/config-generator.ts` - Dynamic config generation
- `src/platform/collections/` - Platform CMS collections
- `src/platform/services/` - Core platform services
- `src/platform/api/` - API endpoints

**Documentation:**
- Railway API: https://docs.railway.app/develop/api
- Supabase API: https://supabase.com/docs/reference/api
- Vercel API: https://vercel.com/docs/rest-api

---

**Questions?** Open an issue or check the inline code comments!

🚀 **Happy Multi-Tenanting!**
