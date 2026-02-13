# 🎯 PLATFORM IMPLEMENTATION PLAN

**Datum:** 13 Februari 2026
**Status:** BEST MOGELIJKE OPLOSSING - Volledige Enterprise-Grade Implementatie
**Gekozen Architectuur:** Custom UI + Vercel per client + Geïntegreerde wizard

---

## 📋 EXECUTIVE SUMMARY

**Gekozen Oplossingen:**
1. **Custom UI:** Volledige custom `/platform/` interface (geen Payload admin UI)
2. **Site Generator:** Geïntegreerde wizard in client creation flow
3. **Deployment:** Vercel project per client (echte multi-tenancy)

**Waarom deze keuzes:**
- ✅ Professionele branding & UX
- ✅ Volledige controle over workflows
- ✅ Echte multi-tenant isolatie
- ✅ Schaalbaarheid voor enterprise

**Totale Geschatte Tijd:** 60-80 uur
**Fase 1 (Quick Wins):** 2-4 uur
**Fase 2 (Core Platform):** 16-24 uur
**Fase 3 (Advanced Features):** 24-32 uur
**Fase 4 (Control Room Migratie):** 40+ uur (later)

---

## 🏗️ ARCHITECTUUR OVERZICHT

### **Huidige Staat (AS-IS):**

```
┌──────────────────────────────────────────────────────┐
│  /admin (Payload Admin) ✅                           │
│  - Auto-generated CRUD                                │
│  - Volledig werkend                                   │
│  - /admin/collections/clients                         │
└──────────────────────────────────────────────────────┘
                    ↕ (Reads/Writes)
┌──────────────────────────────────────────────────────┐
│  Payload Collections (PostgreSQL) ✅                  │
│  - Clients (395 regels schema)                        │
│  - Deployments (dummy data)                           │
│  - PlatformAdmins                                     │
│  - Railway PostgreSQL                                 │
└──────────────────────────────────────────────────────┘
                    ↑ (Reads only)
┌──────────────────────────────────────────────────────┐
│  /platform (Custom Dashboard) ❌ 40%                  │
│  - Read-only UI                                       │
│  - Geen edit functionaliteit                         │
│  - Dummy data                                         │
│  - Settings 404                                       │
└──────────────────────────────────────────────────────┘
```

### **Gewenste Staat (TO-BE):**

```
┌──────────────────────────────────────────────────────┐
│  /platform (Custom Admin Dashboard) ✅ NIEUW          │
│  ├─ Dashboard (stats, overzichten)                    │
│  ├─ Clients Management (volledige CRUD)               │
│  ├─ Deployments (Vercel API integratie)               │
│  ├─ Site Generator (geïntegreerde wizard)             │
│  ├─ Settings (platform config)                        │
│  ├─ Performance (monitoring)                          │
│  ├─ Security (SSL, scans)                             │
│  └─ Backups, Tickets, Offertes (later)                │
└──────────────────────────────────────────────────────┘
                    ↕ (Reads/Writes via API)
┌──────────────────────────────────────────────────────┐
│  Custom API Endpoints (Next.js API Routes) ✅ NIEUW   │
│  ├─ /api/platform/clients (CRUD)                      │
│  ├─ /api/platform/deployments (Vercel sync)           │
│  ├─ /api/platform/provision (nieuwe client)           │
│  ├─ /api/wizard/generate-site (AI-powered)            │
│  └─ /api/vercel/* (deployment management)             │
└──────────────────────────────────────────────────────┘
                    ↕ (Reads/Writes)
┌──────────────────────────────────────────────────────┐
│  Payload Collections (PostgreSQL) ✅                  │
│  - Clients (updated schema)                           │
│  - Deployments (echte data)                           │
│  - PlatformAdmins                                     │
│  - Settings (nieuw)                                   │
└──────────────────────────────────────────────────────┘
                    ↕ (External API calls)
┌──────────────────────────────────────────────────────┐
│  External Services ✅ NIEUW                           │
│  ├─ Vercel API (per-client projects)                  │
│  ├─ Cloudflare API (DNS management)                   │
│  ├─ OpenAI (AI content generation)                    │
│  └─ Stripe (billing - later)                          │
└──────────────────────────────────────────────────────┘
                    ↓ (Provisions)
┌──────────────────────────────────────────────────────┐
│  Client Sites (Vercel Projects) ✅ NIEUW              │
│  - plastimed.compassdigital.nl                        │
│  - client2.compassdigital.nl                          │
│  - Or custom domains: plastimed.nl                    │
└──────────────────────────────────────────────────────┘
```

---

## 📊 FASE 1: QUICK WINS (2-4 uur) 🚀 PRIORITY 1

**Doel:** Direct zichtbare verbeteringen, geen breaking changes

### ✅ **Task 1.1: Environment Variables Fix (15 min)**

**Status:** ✅ DONE

**Files aangepast:**
- ✅ `.env` - Added `PLATFORM_BASE_URL=compassdigital.nl`
- ✅ `.env.example` - Added `PLATFORM_BASE_URL` with documentation

**Impact:**
- Client URLs worden nu correct gegenereerd: `plastimed.compassdigital.nl`
- Geen `.yourplatform.com` meer

**Testing:**
```bash
# Test client URL generation
1. Create new client in /admin/collections/clients
2. Check deploymentUrl field
3. Should be: https://[domain].compassdigital.nl
```

---

### ⏳ **Task 1.2: Connect AI Wizard to API (30 min)**

**Status:** TODO

**Wat het doet:**
- Replace simplified API endpoint with full AI service
- Enable GPT-4 content generation
- Professional SEO-optimized copy

**Files te wijzigen:**

1. **`src/app/api/wizard/generate-site/route.ts`**
   - Replace simplified logic
   - Connect `SiteGeneratorService`
   - Add error handling
   - SSE progress updates

**Nieuwe code (copy-paste ready):**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { sendProgress } from '@/app/api/ai/stream/[connectionId]/route'
import { WizardState } from '@/lib/siteGenerator/types'
import { SiteGeneratorService } from '@/lib/siteGenerator/SiteGeneratorService'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes

interface GenerateSiteRequest {
  wizardData: WizardState
  sseConnectionId: string
}

async function generateSiteWithAI(wizardData: WizardState, sseConnectionId: string) {
  try {
    const onProgress = async (progress: number, message: string) => {
      await sendProgress(sseConnectionId, {
        type: 'progress',
        progress,
        message,
      })
    }

    const generator = new SiteGeneratorService(onProgress)
    const result = await generator.generateSite(wizardData)

    await sendProgress(sseConnectionId, {
      type: 'complete',
      data: {
        previewUrl: result.previewUrl || '/',
        pages: result.pages.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
        })),
      },
    })

    return result
  } catch (error: any) {
    console.error('[AI Wizard] Error:', error)
    await sendProgress(sseConnectionId, {
      type: 'error',
      error: error.message || 'AI generation failed',
    })
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateSiteRequest = await request.json()
    const { wizardData, sseConnectionId } = body

    if (!wizardData || !sseConnectionId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 },
      )
    }

    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Start AI generation in background
    generateSiteWithAI(wizardData, sseConnectionId).catch((error) => {
      console.error('[AI Wizard] Background generation failed:', error)
    })

    return NextResponse.json({
      success: true,
      jobId,
      message: 'AI site generation started',
    })
  } catch (error: any) {
    console.error('[AI Wizard] API error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 },
    )
  }
}
```

**Testing:**
```bash
1. Go to /site-generator
2. Fill wizard (all steps)
3. Click "Generate Site"
4. Watch progress (should show AI generation steps)
5. Check /admin/collections/pages (should have professional content)
6. Verify SEO metadata is populated
```

**Expected Results:**
- Homepage with compelling hero copy
- Services with professional descriptions
- SEO metadata (title, description, keywords)
- JSON-LD schemas
- OG tags
- 3-5 minute generation time

---

### ⏳ **Task 1.3: Clean Up Dummy Data (15 min)**

**Status:** TODO

**Wat te doen:**
1. Delete 3 dummy deployments from database
2. Optionally seed real deployment (Plastimed)

**Database query:**
```sql
-- Via /admin/collections/deployments
-- Delete all dummy deployments manually
-- Or via PostgreSQL:
DELETE FROM deployments WHERE client_id IS NULL;
```

**Optional:** Seed real deployment
```sql
INSERT INTO deployments (client_id, status, environment, started_at, completed_at)
VALUES (
  (SELECT id FROM clients WHERE domain = 'plastimed'),
  'success',
  'production',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day' + INTERVAL '8 minutes'
);
```

---

### ⏳ **Task 1.4: Update PLATFORM_REALITY_CHECK.md (15 min)**

**Status:** TODO

**Wat te updaten:**
- Mark Task 1.1, 1.2, 1.3 as DONE
- Update completeness percentages
- Add "What's Next" section

---

## 📊 FASE 2: CORE PLATFORM (16-24 uur) 🏗️ PRIORITY 2

**Doel:** Volledige custom CRUD UI in `/platform/clients`

### ⏳ **Task 2.1: Clients List Page (4-6 uur)**

**File:** `src/app/(platform)/platform/clients/page.tsx` (NEW)

**Features:**
- Table met alle clients
- Kolommen: Name, Domain, Template, Status, Revenue, Actions
- Filters: Status, Template, Billing Status
- Search: Name, Domain
- Pagination: 20 per page
- Sort: Name, Created, Revenue

**UI Components:**
- shadcn/ui Table
- shadcn/ui Select (filters)
- shadcn/ui Input (search)
- shadcn/ui Button (actions)
- shadcn/ui Badge (status)

**Actions per row:**
- View Details (→ `/platform/clients/[id]`)
- Edit (→ `/platform/clients/[id]/edit`)
- Visit Site (opens deploymentUrl)
- Open Admin (opens adminUrl)
- Delete (confirmation modal)

**API Endpoint:**
```typescript
// Uses existing Payload REST API
GET /api/clients?limit=20&page=1&where[status][equals]=active
```

**Mock-up:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Clients                                         [+ New Client]  │
├─────────────────────────────────────────────────────────────────┤
│  Filters: [Status ▾] [Template ▾] [Billing ▾]    Search: [____] │
├──────┬──────────┬──────────┬─────────┬──────────┬───────────────┤
│ Name │ Domain   │ Template │ Status  │ Revenue  │ Actions       │
├──────┼──────────┼──────────┼─────────┼──────────┼───────────────┤
│ Plas │ plastim  │ B2B      │ Active  │ €99/mo   │ [👁️] [✏️] [🗑️] │
│ timed│ ed       │          │         │          │               │
├──────┼──────────┼──────────┼─────────┼──────────┼───────────────┤
│ ...  │          │          │         │          │               │
└──────┴──────────┴──────────┴─────────┴──────────┴───────────────┘
                    ← 1 2 3 ... 10 →
```

**Geschatte tijd:** 4-6 uur

---

### ⏳ **Task 2.2: Client Detail Page (3-4 uur)**

**File:** `src/app/(platform)/platform/clients/[id]/page.tsx` (NEW)

**Sections:**
1. **Header:**
   - Client name
   - Status badge
   - Actions: Edit, Delete, Visit, Admin

2. **Overview Cards:**
   - Template type
   - Enabled features
   - Deployment status
   - Health status
   - Revenue (monthly + total)

3. **Deployment Info:**
   - Deployment URL (clickable)
   - Admin URL (clickable)
   - Vercel Project ID
   - Last deployed
   - Deploy button (triggers Vercel API)

4. **Billing:**
   - Plan type
   - Billing status
   - Monthly fee
   - Next billing date
   - Invoice history (later)

5. **Activity Timeline:**
   - Recent deployments
   - Status changes
   - Billing events

**API:**
```typescript
GET /api/clients/[id]
```

**Geschatte tijd:** 3-4 uur

---

### ⏳ **Task 2.3: Client Edit Page (6-8 uur)**

**File:** `src/app/(platform)/platform/clients/[id]/edit/page.tsx` (NEW)

**Form Sections:**
1. **Basic Info:**
   - Name (text)
   - Domain (text, readonly after creation)
   - Contact email
   - Contact name
   - Contact phone

2. **Template & Features:**
   - Template selector (dropdown)
   - Enabled features (multi-select checkboxes)
   - Disabled collections (multi-select)

3. **Billing:**
   - Plan selector
   - Billing status
   - Monthly fee (number input)
   - Next billing date (date picker)

4. **Configuration (Advanced):**
   - Custom environment variables (JSON editor)
   - Custom settings (JSON editor)

5. **Internal:**
   - Notes (textarea)

**Validation:**
- Name required
- Domain required (lowercase, alphanumeric + hyphens)
- Email format
- Monthly fee >= 0

**API:**
```typescript
GET /api/clients/[id]
PATCH /api/clients/[id]
```

**Custom API Endpoint (NEW):**
`src/app/api/platform/clients/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const updated = await payload.update({
      collection: 'clients',
      id: params.id,
      data: body,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
```

**Geschatte tijd:** 6-8 uur

---

### ⏳ **Task 2.4: Settings Page (4-6 uur)**

**File:** `src/app/(platform)/platform/settings/page.tsx` (NEW)

**Settings Collection (NEW):**
`src/platform/collections/Settings.ts`

```typescript
import type { CollectionConfig } from 'payload'

export const Settings: CollectionConfig = {
  slug: 'settings',
  admin: {
    useAsTitle: 'key',
    group: 'Platform Management',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      label: 'Setting Key',
    },
    {
      name: 'value',
      type: 'json',
      required: true,
      label: 'Setting Value',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Platform', value: 'platform' },
        { label: 'Billing', value: 'billing' },
        { label: 'Email', value: 'email' },
        { label: 'Security', value: 'security' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
  ],
}
```

**Settings to configure:**
1. **Platform:**
   - Base domain
   - Default template
   - Default features

2. **Billing:**
   - Default plan
   - Default monthly fee
   - Currency

3. **Email:**
   - From email
   - Contact email
   - Email templates

4. **Security:**
   - Max login attempts
   - Session timeout
   - 2FA required

**Geschatte tijd:** 4-6 uur

---

### ⏳ **Task 2.5: Vercel API Integration Basis (4-6 uur)**

**File:** `src/lib/vercel/VercelService.ts` (NEW)

**Features:**
- List projects
- Get project details
- Trigger deployment
- Get deployment status
- Get deployment logs

**Example:**
```typescript
import { VercelClient } from '@vercel/sdk'

export class VercelService {
  private client: VercelClient

  constructor() {
    this.client = new VercelClient({
      bearerToken: process.env.VERCEL_API_TOKEN,
    })
  }

  async listProjects() {
    const { data } = await this.client.projects.getProjects({
      teamId: process.env.VERCEL_TEAM_ID,
    })
    return data?.projects || []
  }

  async getProject(projectId: string) {
    const { data } = await this.client.projects.getProject({
      idOrName: projectId,
      teamId: process.env.VERCEL_TEAM_ID,
    })
    return data
  }

  async triggerDeployment(projectId: string) {
    const { data } = await this.client.deployments.createDeployment({
      name: projectId,
      gitSource: {
        type: 'github',
        ref: 'main',
        repoId: process.env.GITHUB_REPO_ID,
      },
      teamId: process.env.VERCEL_TEAM_ID,
    })
    return data
  }

  async getDeployment(deploymentId: string) {
    const { data } = await this.client.deployments.getDeployment({
      idOrName: deploymentId,
      teamId: process.env.VERCEL_TEAM_ID,
    })
    return data
  }
}
```

**API Endpoints:**
- `POST /api/platform/deployments/trigger` - Trigger redeploy
- `GET /api/platform/deployments/[id]` - Get deployment status
- `GET /api/platform/deployments/[id]/logs` - Get logs

**Environment Variables:**
```bash
VERCEL_API_TOKEN=xxx
VERCEL_TEAM_ID=xxx
GITHUB_REPO_ID=xxx
```

**Geschatte tijd:** 4-6 uur

---

## 📊 FASE 3: ADVANCED FEATURES (24-32 uur) 🚀 PRIORITY 3

**Doel:** Geïntegreerde workflows en per-client provisioning

### ⏳ **Task 3.1: Client Creation Wizard (8-12 uur)**

**File:** `src/app/(platform)/platform/clients/new/page.tsx` (NEW)

**Multi-Step Wizard:**

**Step 1: Basic Info (2 min)**
- Client name
- Domain (subdomain)
- Contact email
- Contact name

**Step 2: Template Selection (1 min)**
- Visual cards voor elk template:
  - E-commerce
  - Blog
  - B2B
  - Portfolio
  - Corporate
- Preview van template features

**Step 3: Features Configuration (2 min)**
- Checkboxes voor enabled features
- Visual toggles
- Feature descriptions

**Step 4: Billing Setup (1 min)**
- Plan selection
- Monthly fee
- Billing status

**Step 5: Site Generator (10-15 min)**
- Redirect naar `/site-generator` met `clientId` parameter
- OR: Embed site generator steps inline
- Generate initial content with AI

**Step 6: Review & Provision (5 min)**
- Summary van alle settings
- "Provision Client" button
- Progress bar:
  - Create client in database
  - Generate Vercel project
  - Setup DNS (Cloudflare API)
  - Deploy initial site
  - Send welcome email

**API Endpoint:**
`POST /api/platform/clients/provision`

```typescript
export async function POST(request: NextRequest) {
  const { clientData, wizardData } = await request.json()

  // 1. Create client in Payload
  const client = await payload.create({
    collection: 'clients',
    data: clientData,
  })

  // 2. Generate Vercel project
  const vercelProject = await vercelService.createProject({
    name: clientData.domain,
    framework: 'nextjs',
  })

  // 3. Setup DNS (Cloudflare)
  await cloudflareService.createRecord({
    type: 'CNAME',
    name: clientData.domain,
    content: vercelProject.alias[0],
  })

  // 4. Generate site with AI
  const siteGenerator = new SiteGeneratorService()
  await siteGenerator.generateSite(wizardData, client.id)

  // 5. Trigger initial deployment
  await vercelService.triggerDeployment(vercelProject.id)

  // 6. Send welcome email
  await emailService.sendWelcome(client.contactEmail, {
    deploymentUrl: client.deploymentUrl,
    adminUrl: client.adminUrl,
  })

  return NextResponse.json({ success: true, client })
}
```

**Geschatte tijd:** 8-12 uur

---

### ⏳ **Task 3.2: Per-Client Vercel Project Provisioning (8-12 uur)**

**Vercel Setup:**
1. Create new Vercel project per client
2. Link to GitHub repo
3. Setup environment variables per client
4. Configure custom domain or subdomain
5. Enable auto-deployments

**Vercel API Calls:**
```typescript
// 1. Create project
const project = await vercel.createProject({
  name: clientDomain,
  framework: 'nextjs',
  gitRepository: {
    type: 'github',
    repo: 'compassdigitalnl/client-template',
  },
  environmentVariables: [
    { key: 'CLIENT_ID', value: client.id },
    { key: 'DATABASE_URL', value: client.databaseUrl },
    { key: 'PAYLOAD_SECRET', value: generateSecret() },
  ],
})

// 2. Add domain
await vercel.addDomain({
  projectId: project.id,
  domain: `${clientDomain}.compassdigital.nl`,
})

// 3. Trigger deployment
await vercel.createDeployment({
  projectId: project.id,
  target: 'production',
})
```

**Client Template Repo:**
- Fork of main project
- Minimal setup
- Client-specific config
- Automated via GitHub API

**Geschatte tijd:** 8-12 uur

---

### ⏳ **Task 3.3: Custom Domain Management (6-8 uur)**

**Cloudflare API Integration:**
```typescript
import Cloudflare from 'cloudflare'

export class CloudflareService {
  private client: Cloudflare

  constructor() {
    this.client = new Cloudflare({
      apiToken: process.env.CLOUDFLARE_API_TOKEN,
    })
  }

  async createRecord(domain: string, target: string) {
    return await this.client.dns.records.create({
      zone_id: process.env.CLOUDFLARE_ZONE_ID,
      type: 'CNAME',
      name: domain,
      content: target,
      proxied: true,
    })
  }

  async deleteRecord(recordId: string) {
    return await this.client.dns.records.delete({
      zone_id: process.env.CLOUDFLARE_ZONE_ID,
      dns_record_id: recordId,
    })
  }
}
```

**Custom Domain UI:**
- `src/app/(platform)/platform/clients/[id]/domains/page.tsx`
- Add custom domain
- Verify DNS
- SSL certificate status
- Redirect rules

**Geschatte tijd:** 6-8 uur

---

## 📊 FASE 4: CONTROL ROOM MIGRATIE (40+ uur) 🔮 LATER

**Doel:** Migreer alle features uit bestaande Next.js control room

### **Features te migreren:**

1. **Performance Monitoring (8-12 uur)**
   - Speed metrics (Lighthouse)
   - Uptime tracking (UptimeRobot API)
   - Page views (Google Analytics API)
   - Load times
   - Core Web Vitals

2. **Security Dashboard (6-8 uur)**
   - SSL certificate monitoring
   - Security headers check
   - Vulnerability scanning
   - 2FA management
   - Access logs

3. **Backups (6-8 uur)**
   - Automated database backups
   - Media backups
   - Restore functionality
   - Backup scheduling
   - Retention policies

4. **Support Tickets (10-12 uur)**
   - Ticket creation
   - Priority levels
   - Status tracking
   - Client portal
   - Email notifications

5. **Strippenkaart (8-10 uur)**
   - Hours tracking
   - Remaining hours
   - Invoice generation
   - Reports

6. **Offertes (8-12 uur)**
   - Quote creation
   - Templates
   - Digitale ondertekening (DocuSign/HelloSign)
   - PDF generation
   - Email sending

7. **Verwerkersovereenkomst (6-8 uur)**
   - AVG/GDPR documents
   - Digitale ondertekening
   - Version tracking
   - Expiration notifications

**Totaal:** 52-70 uur

**Planning:** Na Fase 1-3 compleet

---

## 📊 DEPENDENCIES & PACKAGES

### **Nieuwe Dependencies:**

```json
{
  "dependencies": {
    "@vercel/sdk": "^1.0.0",
    "cloudflare": "^3.0.0",
    "@hello-pangea/dnd": "^16.0.0",
    "date-fns": "^3.0.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "sonner": "^1.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0"
  }
}
```

**Install:**
```bash
npm install @vercel/sdk cloudflare @hello-pangea/dnd date-fns react-hook-form zod @hookform/resolvers sonner
```

---

## 📊 ENVIRONMENT VARIABLES

**Nieuwe Environment Variables:**

```bash
# Vercel API
VERCEL_API_TOKEN=xxx
VERCEL_TEAM_ID=team_xxx
GITHUB_REPO_ID=123456

# Cloudflare API
CLOUDFLARE_API_TOKEN=xxx
CLOUDFLARE_ZONE_ID=xxx

# Platform Configuration
PLATFORM_BASE_URL=compassdigital.nl

# Email (Resend)
RESEND_API_KEY=re_xxx
FROM_EMAIL=noreply@compassdigital.nl

# Stripe (later)
STRIPE_SECRET_KEY=sk_live_xxx
```

---

## 📊 DATABASE MIGRATIONS

**Nieuwe Collections:**

1. **Settings** (Task 2.4)
2. **PerformanceMetrics** (Fase 4)
3. **SecurityScans** (Fase 4)
4. **Backups** (Fase 4)
5. **Tickets** (Fase 4)
6. **Strippenkaart** (Fase 4)
7. **Quotes** (Fase 4)
8. **Contracts** (Fase 4)

**Schema Updates:**

- Clients: Add `vercelProjectId`, `cloudflareRecordId`
- Deployments: Add `vercelDeploymentId`, `buildTime`, `errorLogs`

---

## 📊 TESTING STRATEGY

### **Per Fase:**

**Fase 1:**
- Manual testing: AI wizard, environment vars
- Test production URL generation

**Fase 2:**
- E2E tests: Client CRUD operations
- API endpoint tests
- UI component tests (Playwright)

**Fase 3:**
- Integration tests: Vercel API, Cloudflare API
- Provisioning flow end-to-end
- Custom domain setup

**Fase 4:**
- Feature-specific tests per migratie
- Performance benchmarks
- Security audits

---

## 📊 DEPLOYMENT PLAN

**Per Fase Deployen:**

**Fase 1:**
```bash
git add .
git commit -m "feat: AI wizard integration + environment fixes"
git push origin main
# Vercel auto-deploys
```

**Fase 2:**
```bash
git add .
git commit -m "feat: custom platform CRUD UI + settings"
git push origin main
```

**Fase 3:**
```bash
git add .
git commit -m "feat: client provisioning + Vercel per-client projects"
git push origin main
```

---

## 📊 ROLLBACK STRATEGY

**Als iets misgaat:**

1. **Code rollback:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Database rollback:**
   - Payload heeft automatische migrations
   - Backup voor grote schema changes

3. **Vercel rollback:**
   - Via Vercel dashboard: Promote previous deployment

---

## 📊 SUCCESS CRITERIA

**Fase 1 Complete:**
- ✅ AI wizard genereert professionele content
- ✅ Client URLs zijn correct (.compassdigital.nl)
- ✅ Geen dummy data meer

**Fase 2 Complete:**
- ✅ Volledige client CRUD in /platform/
- ✅ Settings page werkend
- ✅ Vercel API basis integratie
- ✅ Redeploy button werkt echt

**Fase 3 Complete:**
- ✅ Client creation wizard volledig geïntegreerd
- ✅ Vercel project per client provisioning
- ✅ Custom domains werkend
- ✅ Geautomatiseerde setup flow

**Fase 4 Complete:**
- ✅ Alle Next.js control room features gemigreerd
- ✅ Performance monitoring live
- ✅ Security dashboard werkend
- ✅ Backups, Tickets, Offertes actief

---

## 📊 TIMELINE

**Week 1:**
- Fase 1 (2-4 uur)
- Start Fase 2 (8-12 uur)

**Week 2:**
- Complete Fase 2 (4-12 uur)
- Start Fase 3 (12+ uur)

**Week 3-4:**
- Complete Fase 3 (12-20 uur)

**Week 5-8:**
- Fase 4 (40+ uur)
- Testing & polish

**Totaal:** 4-8 weken (afhankelijk van beschikbare tijd)

---

## 📊 RISKS & MITIGATIONS

**Risk 1: Vercel API rate limits**
- Mitigatie: Caching, request throttling

**Risk 2: Database migration failures**
- Mitigatie: Backup voor elke migration, test lokaal eerst

**Risk 3: DNS propagation delays**
- Mitigatie: User messaging, status checks

**Risk 4: Breaking changes in custom UI**
- Mitigatie: Keep Payload admin accessible als fallback

---

## 📊 NEXT STEPS

**Vandaag:**
1. Review dit document
2. Approve implementation plan
3. Start Fase 1 Task 1.2 (AI wizard)

**Deze Week:**
4. Complete Fase 1
5. Start Fase 2 (clients CRUD)

**Volgende Week:**
6. Complete Fase 2
7. Start Fase 3

---

**Laatst bijgewerkt:** 13 Februari 2026
**Status:** DOCUMENTATIE COMPLEET - WACHT OP GOEDKEURING
**Volgende stap:** User approval → Start implementatie
