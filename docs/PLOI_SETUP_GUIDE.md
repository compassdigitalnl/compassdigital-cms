# Ploi Integration Setup Guide

Complete guide for setting up Ploi deployment provider for multi-tenant client sites.

## Why Ploi?

**Best for Multi-Tenant SaaS Platforms:**
- **Lower Costs:** VPS hosting + Ploi vs serverless pricing
- **Full Control:** Own servers, custom configurations
- **Better Margins:** ~€15-30/month for unlimited clients vs per-client serverless costs
- **Multi-CMS:** WordPress, Payload, Laravel, Node.js all supported
- **Existing Infrastructure:** Integrate with your existing Hetzner/DigitalOcean servers

## Prerequisites

1. **Ploi Account** - https://ploi.io (€10/month)
2. **VPS Server** - Hetzner, DigitalOcean, Linode, etc. (€5-20/month)
3. **Server connected to Ploi** - Add server in Ploi dashboard

## Step 1: Get Ploi API Token

1. Go to https://ploi.io/profile
2. Click **API Tokens** tab
3. Click **Create Token**
4. Name: `PayloadCMS Multi-Tenant Platform`
5. Copy the generated token

## Step 2: Get Server ID

1. Go to https://ploi.io/servers
2. Click on your server
3. Check the URL: `https://ploi.io/servers/12345` ← Server ID is `12345`

## Step 3: Configure Environment Variables

Add to your `.env`:

```bash
# Ploi Configuration
PLOI_API_TOKEN=your-ploi-api-token-here
PLOI_SERVER_ID=12345

# Set as default provider
DEFAULT_DEPLOYMENT_PROVIDER=ploi
```

## Step 4: Test Connection

Run this script to test your Ploi connection:

```typescript
// test-ploi.ts
import { PloiService } from '@/lib/ploi/PloiService'

const ploi = new PloiService({
  apiToken: process.env.PLOI_API_TOKEN!,
})

async function test() {
  try {
    const servers = await ploi.listServers()
    console.log('✅ Ploi connection successful!')
    console.log('Servers:', servers.data)
  } catch (error) {
    console.error('❌ Ploi connection failed:', error)
  }
}

test()
```

Run: `npx tsx test-ploi.ts`

## Step 5: Provision Your First Client

### Option A: Via API

```bash
curl -X POST http://localhost:3020/api/wizard/provision-site \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client-id-here",
    "deploymentProvider": "ploi",
    "sseConnectionId": "test-connection",
    "wizardData": {
      "siteName": "Test Client",
      "industry": "general"
    }
  }'
```

### Option B: Via UI

1. Go to Platform Dashboard: http://localhost:3020/platform
2. Click **Clients** → Select a client
3. Click **Launch Site** button
4. Select **Ploi** as deployment provider
5. Watch real-time progress!

## Architecture

### How Ploi Provisioning Works

```
1. Create Site on Ploi
   └─> POST /api/servers/{server}/sites
   └─> Domain: client.compassdigital.nl
   └─> Project Type: nodejs (Payload CMS)

2. Configure Environment Variables
   └─> PATCH /api/servers/{server}/sites/{id}/env
   └─> Injects: PAYLOAD_SECRET, DATABASE_URL, etc.

3. Setup Deployment Script
   └─> PATCH /api/servers/{server}/sites/{id}/deploy/script
   └─> Script: git pull → npm install → npm build → pm2 restart

4. Trigger Deployment
   └─> POST /api/servers/{server}/sites/{id}/deploy
   └─> Executes deployment script

5. Setup SSL Certificate
   └─> POST /api/servers/{server}/sites/{id}/certificates
   └─> Let's Encrypt auto-renewal

6. Monitor Deployment
   └─> GET /api/servers/{server}/sites/{id}/log
   └─> Real-time status updates
```

## Server Requirements

Your Ploi-managed server needs:

### Software Stack
- **OS:** Ubuntu 20.04/22.04 (Ploi auto-configures)
- **Node.js:** v18+ (installed by Ploi)
- **PM2:** For process management
- **Nginx:** Reverse proxy (managed by Ploi)
- **PostgreSQL:** Database (can be on same server or separate)

### Recommended Server Specs
- **Small:** 2 vCPU, 4GB RAM (5-10 clients)
- **Medium:** 4 vCPU, 8GB RAM (10-30 clients)
- **Large:** 8 vCPU, 16GB RAM (30-100 clients)

### Providers
- **Hetzner:** €5-40/month (best value)
- **DigitalOcean:** $12-80/month
- **Linode:** $12-80/month
- **Vultr:** $12-80/month

## Cost Comparison

### Ploi + Hetzner (Recommended)
```
Ploi:           €10/month
Hetzner VPS:    €20/month (4 vCPU, 8GB RAM)
---
Total:          €30/month for unlimited clients
Per Client:     €0.30 - €3 depending on scale
```

### Vercel (Current)
```
Vercel Pro:     $20/month per team member
Per Client:     Serverless costs scale with traffic
Estimate:       $5-50/client/month depending on traffic
```

**Savings:** 80-90% cost reduction at scale!

## DNS Configuration

After provisioning, configure DNS:

### For compassdigital.nl subdomain:
```
Type:   A Record
Name:   client.compassdigital.nl
Value:  YOUR_SERVER_IP (from Ploi)
TTL:    3600
```

OR use a wildcard:
```
Type:   A Record
Name:   *.compassdigital.nl
Value:  YOUR_SERVER_IP
TTL:    3600
```

## Deployment Script Customization

The default deployment script:

```bash
#!/bin/bash
set -e

echo "🚀 Starting Payload CMS deployment..."

# Pull latest code
git pull origin main

# Install dependencies
npm ci --production=false

# Build application
npm run build

# Restart with PM2
pm2 restart payload-cms || pm2 start ecosystem.config.js --env production

echo "✅ Deployment completed!"
```

**Customize in:** `src/lib/provisioning/adapters/PloiAdapter.ts` → `generateDeploymentScript()`

## Monitoring & Logs

### View Deployment Logs
```typescript
const ploi = new PloiService({ apiToken: process.env.PLOI_API_TOKEN! })
const logs = await ploi.getLogs(serverId, siteId)
console.log(logs.data)
```

### Via Ploi Dashboard
1. Go to https://ploi.io/servers/{server}/sites/{site}
2. Click **Logs** tab
3. See realtime deployment logs

## Multi-CMS Support

Ploi adapter supports multiple CMS types:

```typescript
await service.createSite(serverId, {
  root_domain: 'client.domain.com',
  project_type: 'nodejs',      // Payload CMS
  // project_type: 'wordpress', // WordPress
  // project_type: 'php',       // Laravel
  // project_type: 'static',    // Static sites
  web_directory: '/public',
})
```

## Troubleshooting

### Error: "Ploi API token not configured"
- Add `PLOI_API_TOKEN` to `.env`
- Verify token is valid in Ploi dashboard

### Error: "Ploi server ID not configured"
- Add `PLOI_SERVER_ID` to `.env`
- Check server ID in Ploi URL

### Site not deploying
- Check deployment logs in Ploi dashboard
- Verify Git repository is connected
- Check deployment script for errors

### SSL certificate not working
- Wait 5-10 minutes for Let's Encrypt
- Verify DNS is pointing to server IP
- Check Ploi certificate status

## Advanced Configuration

### Custom Deployment Provider

Want to use another provider? Create your own adapter:

```typescript
// src/lib/provisioning/adapters/CustomAdapter.ts
export class CustomAdapter implements DeploymentAdapter {
  readonly provider = 'custom' as const

  async createProject(input) {
    // Your implementation
  }

  async deploy(input) {
    // Your implementation
  }

  // ... implement all interface methods
}
```

Then register it:
```typescript
// src/lib/provisioning/ProvisioningService.ts
if (provider === 'custom') {
  adapter = new CustomAdapter(config)
}
```

## Support

- **Ploi Docs:** https://developers.ploi.io
- **Ploi Support:** support@ploi.io
- **Platform Issues:** GitHub Issues

---

**Next Steps:**
1. Setup Ploi account
2. Connect your Hetzner/DO server
3. Configure environment variables
4. Test with a client deployment
5. Scale! 🚀
