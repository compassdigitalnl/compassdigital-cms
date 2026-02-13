# Automated Client Provisioning Architecture

**Status:** 🔨 IN DEVELOPMENT
**Goal:** 1-Click Multi-Tenant SaaS Client Deployment

---

## Overview

Complete automation of client onboarding from wizard to live website:

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Clicks "New Client"                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              AI Site Generator Wizard (Existing)                 │
│  - Business info (name, description, industry, target audience) │
│  - Design preferences (colors, style, tone)                      │
│  - Content requirements (pages, features)                        │
│  - Contact info, social media, etc.                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│         Step 1: AI Content Generation (SiteGeneratorService)     │
│  - Generate professional content with GPT-4                      │
│  - Create pages (home, about, services, contact, etc.)           │
│  - Generate SEO metadata, OG images, JSON-LD schemas             │
│  - Create navigation structure                                   │
│  Duration: 30-60 seconds                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Step 2: Create Client Record (Payload)              │
│  - Save client to database                                       │
│  - Store generated content (pages, media, settings)              │
│  - Set initial status: "provisioning"                            │
│  Duration: 2-5 seconds                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│          Step 3: Create Vercel Project (VercelService)           │
│  - Project name: client-domain-[random]                          │
│  - Framework: Next.js                                            │
│  - Git repo: compassdigital-cms (monorepo)                       │
│  - Region: ams1 (Amsterdam)                                      │
│  Duration: 5-10 seconds                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│       Step 4: Configure Environment Variables (VercelService)    │
│  - DATABASE_URL (Railway PostgreSQL)                             │
│  - PAYLOAD_SECRET (shared or per-client)                         │
│  - NEXT_PUBLIC_SERVER_URL (client domain)                        │
│  - CLIENT_ID (for multi-tenant routing)                          │
│  Duration: 2-5 seconds                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│            Step 5: Trigger Initial Deployment (Vercel)           │
│  - Deploy from main branch                                       │
│  - Build with Next.js                                            │
│  - Generate: client-xyz.vercel.app                               │
│  Duration: 2-4 minutes (Next.js build)                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│          Step 6: Monitor Deployment (Polling/Webhook)            │
│  - Poll deployment status every 10 seconds                       │
│  - States: QUEUED → BUILDING → READY / ERROR                    │
│  - Update client record with deployment URL                      │
│  - Create deployment record in database                          │
│  Duration: Until deployment completes                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               Step 7: Health Check (Verification)                │
│  - Test deployment URL responds (200 OK)                         │
│  - Verify homepage loads                                         │
│  - Check Payload admin accessible                                │
│  Duration: 5-10 seconds                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│            Step 8: Update Client Status (Success)                │
│  - Status: provisioning → active                                 │
│  - Set deploymentUrl, adminUrl, vercelProjectId                  │
│  - Send notification email (optional)                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ✅ CLIENT LIVE!                              │
│  - Website: https://client-xyz.vercel.app                        │
│  - Admin: https://client-xyz.vercel.app/admin                    │
│  - Next step: Custom domain setup (manual or automated)          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Architecture Components

### 1. ProvisioningService (New)

**File:** `src/lib/provisioning/ProvisioningService.ts`

**Responsibilities:**
- Orchestrate entire provisioning workflow
- Coordinate SiteGeneratorService, VercelService, PayloadService
- Handle errors and rollback
- Provide progress updates via SSE
- Store provisioning logs

**Key Methods:**
```typescript
class ProvisioningService {
  async provisionClient(wizardData: WizardState, onProgress?: ProgressCallback): Promise<ProvisioningResult>
  async monitorDeployment(deploymentId: string): Promise<DeploymentStatus>
  async healthCheck(url: string): Promise<boolean>
  async rollback(clientId: string, vercelProjectId: string): Promise<void>
}
```

### 2. Provisioning API Endpoints (New)

**File:** `src/app/api/provisioning/provision/route.ts`

**Endpoint:** `POST /api/provisioning/provision`

**Request:**
```json
{
  "wizardData": { /* WizardState */ },
  "sseConnectionId": "conn-123"
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "prov-1234567890",
  "message": "Provisioning started"
}
```

**Progress Events (SSE):**
```json
{ "type": "progress", "step": 1, "total": 8, "message": "Generating content..." }
{ "type": "progress", "step": 2, "total": 8, "message": "Creating client..." }
{ "type": "progress", "step": 3, "total": 8, "message": "Creating Vercel project..." }
...
{ "type": "complete", "data": { "clientId": "...", "deploymentUrl": "..." } }
```

### 3. Integrated Wizard UI (Updated)

**File:** `src/app/(platform)/platform/clients/new/page.tsx`

**Features:**
- Embedded AI Site Generator wizard
- Real-time progress indicator
- Step-by-step status updates
- Error handling with retry
- Success page with deployment info

### 4. Client Collection Updates (Enhanced)

**New Fields:**
```typescript
{
  vercelProjectId: string        // Vercel project ID
  vercelDeploymentId: string     // Latest deployment ID
  provisioningStatus: string     // queued, in_progress, completed, failed
  provisioningLogs: array        // Audit trail of provisioning steps
  provisionedAt: date            // Timestamp when provisioning completed
}
```

### 5. Deployments Collection (New)

**File:** `src/collections/Deployments.ts`

**Purpose:** Track all deployments for audit and rollback

**Fields:**
```typescript
{
  client: relationship           // Link to client
  vercelDeploymentId: string     // Vercel deployment ID
  status: string                 // QUEUED, BUILDING, READY, ERROR, CANCELED
  deploymentUrl: string          // https://client-xyz.vercel.app
  branch: string                 // main, develop, etc.
  commit: string                 // Git commit hash
  triggeredBy: string            // user, webhook, cron, manual
  startedAt: date
  completedAt: date
  buildTime: number              // Duration in seconds
  errorMessage: string           // If failed
  logs: json                     // Build logs
}
```

---

## Data Flow

### 1. User Input → AI Generation
```
WizardState
  ├── businessInfo { name, description, industry, targetAudience }
  ├── designPreferences { primaryColor, secondaryColor, style, tone }
  ├── pages: ['home', 'about', 'services', 'contact']
  ├── features: ['blog', 'testimonials', 'faq']
  └── contactInfo { email, phone, address, social }
     ↓
SiteGeneratorService.generateSite()
     ↓
GeneratedSite
  ├── pages: [{ title, slug, content, metaTitle, metaDescription, blocks }]
  ├── navigation: MenuItem[]
  ├── settings: { siteName, tagline, logo, colors }
  └── seo: { schemas, sitemaps, robots }
```

### 2. AI Generation → Client Record
```
GeneratedSite + WizardState
     ↓
payload.create({ collection: 'clients', data: {
  name: wizardData.businessInfo.name,
  domain: generateDomain(name),
  status: 'provisioning',
  template: 'custom',
  // ... store all generated content
}})
     ↓
Client { id, name, domain, status, pages, settings }
```

### 3. Client Record → Vercel Project
```
Client { id, name, domain }
     ↓
VercelService.createProject({
  name: `client-${domain}-${randomId}`,
  framework: 'nextjs',
  gitRepository: { repo: 'compassdigital-cms' },
  environmentVariables: [
    { key: 'CLIENT_ID', value: client.id },
    { key: 'DATABASE_URL', value: process.env.DATABASE_URL },
    { key: 'NEXT_PUBLIC_SERVER_URL', value: `https://${domain}.compassdigital.nl` }
  ]
})
     ↓
VercelProject { id, name, targets: { production: { url } } }
```

### 4. Vercel Project → Deployment
```
VercelProject { id }
     ↓
VercelService.createDeployment({
  name: project.name,
  project: project.id,
  target: 'production',
  gitSource: { type: 'github', ref: 'main', repoId: ... }
})
     ↓
VercelDeployment { uid, state: 'BUILDING', url }
     ↓
(Poll every 10s until state === 'READY')
     ↓
VercelDeployment { uid, state: 'READY', url: 'client-xyz.vercel.app' }
```

### 5. Deployment → Client Update
```
VercelDeployment { uid, state: 'READY', url }
     ↓
payload.update({ collection: 'clients', id: client.id, data: {
  status: 'active',
  vercelProjectId: project.id,
  vercelDeploymentId: deployment.uid,
  deploymentUrl: `https://${deployment.url}`,
  adminUrl: `https://${deployment.url}/admin`,
  provisionedAt: new Date()
}})
     ↓
Client { status: 'active', deploymentUrl, adminUrl }
```

---

## Error Handling & Rollback

### Error Types

**1. AI Generation Failure:**
- Cause: OpenAI API error, timeout, rate limit
- Rollback: None needed (nothing created yet)
- Retry: Yes, with exponential backoff

**2. Client Creation Failure:**
- Cause: Database error, validation failure
- Rollback: None needed
- Retry: Yes, after fixing validation

**3. Vercel Project Creation Failure:**
- Cause: Vercel API error, auth failure, quota exceeded
- Rollback: Delete client record OR mark as "failed"
- Retry: Yes, after fixing Vercel config

**4. Deployment Failure:**
- Cause: Build error, Next.js compilation failure
- Rollback: Delete Vercel project, mark client as "failed"
- Retry: Yes, after fixing build errors

**5. Health Check Failure:**
- Cause: Deployment succeeded but site not responding
- Rollback: None (deployment exists)
- Action: Mark as "warning", manual investigation

### Rollback Strategy

```typescript
async rollback(provisioningState: ProvisioningState) {
  // Step backwards through completed steps
  if (provisioningState.vercelProjectId) {
    await vercelService.deleteProject(provisioningState.vercelProjectId)
  }

  if (provisioningState.clientId) {
    await payload.update({
      collection: 'clients',
      id: provisioningState.clientId,
      data: {
        status: 'failed',
        provisioningLogs: [...logs, { step: 'rollback', message: 'Provisioning failed, rolled back' }]
      }
    })
  }
}
```

---

## Progress Tracking

### SSE Event Stream

**Connection:** `/api/ai/stream/[connectionId]`

**Events:**
```typescript
// Step progress
{
  type: 'progress',
  step: 3,
  total: 8,
  percentage: 37.5,
  message: 'Creating Vercel project...',
  timestamp: '2026-02-13T10:30:00Z'
}

// Deployment status update
{
  type: 'deployment',
  status: 'BUILDING',
  url: 'https://client-xyz-git-main-compassdigital.vercel.app',
  message: 'Building Next.js application...'
}

// Success
{
  type: 'complete',
  data: {
    clientId: '...',
    deploymentUrl: 'https://client-xyz.vercel.app',
    adminUrl: 'https://client-xyz.vercel.app/admin',
    vercelProjectId: 'prj_...'
  }
}

// Error
{
  type: 'error',
  error: 'Deployment failed: Build error in page.tsx',
  step: 5,
  recoverable: true
}
```

---

## Environment Variables Strategy

### Shared vs Per-Client

**Option A: Shared Database (Multi-Tenant)**
```bash
# All clients share same DATABASE_URL
DATABASE_URL=postgresql://... (Railway)
# Each client has unique CLIENT_ID for data isolation
CLIENT_ID=abc123
# Client-specific public URL
NEXT_PUBLIC_SERVER_URL=https://plastimed.compassdigital.nl
```

**Option B: Per-Client Database (Isolated)**
```bash
# Each client gets own database
DATABASE_URL=postgresql://.../plastimed_db
# No CLIENT_ID needed (database-level isolation)
NEXT_PUBLIC_SERVER_URL=https://plastimed.compassdigital.nl
```

**Recommendation:** Option A (Shared Database)
- Simpler architecture
- Lower cost (1 database vs 100+ databases)
- Easier backups and migrations
- Payload CMS designed for multi-tenancy

---

## Multi-Tenant Routing

### How Clients Access Their Site

**Current Monorepo:** All code in `compassdigital-cms` repo

**Routing Strategy:**

**Option 1: Subdomain-Based (Current)**
```
https://cms.compassdigital.nl          → Platform admin
https://plastimed.compassdigital.nl    → Plastimed site (CLIENT_ID=plastimed)
https://acme.compassdigital.nl         → Acme site (CLIENT_ID=acme)
```

**Implementation:**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')

  // Extract subdomain
  const subdomain = hostname?.split('.')[0]

  if (subdomain && subdomain !== 'cms') {
    // This is a client site request
    // Set CLIENT_ID for tenant isolation
    request.headers.set('x-client-id', subdomain)
  }

  return NextResponse.next()
}
```

**Option 2: Path-Based**
```
https://cms.compassdigital.nl/client/plastimed  → Plastimed site
https://cms.compassdigital.nl/client/acme       → Acme site
```

**Recommendation:** Option 1 (Subdomain-Based)
- Cleaner URLs for clients
- Standard multi-tenant pattern
- Easier custom domain mapping

---

## Custom Domain Setup

### Manual Process (Current)

**After Provisioning:**
1. Client gets: `https://plastimed-xyz.vercel.app`
2. Platform admin adds custom domain in Vercel:
   - Domain: `plastimed.compassdigital.nl`
   - Vercel provides: `cname.vercel-dns.com`
3. Admin configures DNS (TransIP/Cloudflare):
   ```
   plastimed.compassdigital.nl  CNAME  cname.vercel-dns.com
   ```
4. Wait 5-10 min for SSL certificate
5. Site live at: `https://plastimed.compassdigital.nl`

### Automated Process (Future)

**DNS Provider API Integration:**
- TransIP API: Automatic CNAME creation
- Cloudflare API: Automatic record + SSL
- Vercel DNS: Fully automated

**Full Automation:**
```typescript
await vercelService.addDomain(projectId, `${domain}.compassdigital.nl`)
await dnsService.createCNAME(`${domain}.compassdigital.nl`, 'cname.vercel-dns.com')
// SSL auto-provisioned by Vercel
```

---

## Timeline & Complexity

### Phase 3.1: Core Provisioning (4-6 hours)
- [x] VercelService (DONE!)
- [x] SiteGeneratorService (DONE!)
- [ ] ProvisioningService orchestrator
- [ ] Provisioning API endpoint
- [ ] Progress monitoring (SSE)

### Phase 3.2: UI Integration (3-4 hours)
- [ ] Integrated wizard page
- [ ] Progress indicator UI
- [ ] Success/error states
- [ ] Deployment status dashboard

### Phase 3.3: Database & Collections (2-3 hours)
- [ ] Deployments collection
- [ ] Client collection updates
- [ ] Provisioning logs storage

### Phase 3.4: Testing & Refinement (2-3 hours)
- [ ] End-to-end provisioning test
- [ ] Error handling & rollback
- [ ] Performance optimization

### Phase 3.5: DNS Automation (Optional, 4-6 hours)
- [ ] TransIP API integration
- [ ] Cloudflare API integration
- [ ] Automatic CNAME creation

**Total Estimate:** 12-16 hours (core) + 4-6 hours (DNS automation)

---

## Next Steps

1. ✅ Build ProvisioningService
2. ✅ Create provisioning API endpoint
3. ✅ Update Site Generator wizard to use provisioning
4. ✅ Add Deployments collection
5. ✅ Build deployment monitoring UI
6. ✅ Test end-to-end flow
7. 📋 Document for users
8. 🚀 Deploy to production

---

**Status:** Ready to build! 🚀
**Target:** Complete automated provisioning in 12-16 hours
