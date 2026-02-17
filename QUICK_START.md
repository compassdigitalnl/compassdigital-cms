# 🚀 Quick Start - Deploy First Client to Ploi

## ✅ Status: EVERYTHING IS READY!

**Ploi Integration:** ✅ Complete (380 + 280 lines of code)
**Configuration:** ✅ Ready (.env configured)
**Server:** ✅ Running on http://localhost:3020
**Ploi API:** ✅ Tested & Working (7 servers found)

---

## 🎯 Option 1: Via Platform UI (EASIEST - 2 minutes)

### Step 1: Open Platform
```bash
# Open in browser:
http://localhost:3020/platform/clients
```

### Step 2: Create Client
1. Click **"+ Create New"**
2. Fill in:
   - **Name:** Test Client 1
   - **Domain:** testclient1 (becomes: testclient1.compassdigital.nl)
   - **Contact Email:** test@example.com
   - **Contact Name:** Test Contact
   - **Template:** corporate
   - **Plan:** starter
   - **Deployment Provider:** ploi ← IMPORTANT!
3. Click **Save**

### Step 3: Deploy to Ploi!
1. Open the client you just created
2. Click **"Launch Site"** button
3. Watch real-time progress! 🚀

**That's it!** Your first client will be deployed to Ploi server: `prod-sityzr-saas-01`

---

## 🎯 Option 2: Via Command Line (ADVANCED)

### Step 1: Create Client in Database
```bash
# Open browser and login to Platform CMS:
open http://localhost:3020/platform/login

# Or use this curl command (after getting auth token):
curl -X POST http://localhost:3020/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: JWT <your-token>" \
  -d '{
    "name": "Test Client 1",
    "domain": "testclient1",
    "contactEmail": "test@example.com",
    "contactName": "Test Contact",
    "template": "corporate",
    "plan": "starter",
    "billingStatus": "trial",
    "deploymentProvider": "ploi"
  }'
```

### Step 2: Trigger Deployment
```bash
curl -X POST http://localhost:3020/api/wizard/provision-site \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "<client-id-from-step-1>",
    "deploymentProvider": "ploi",
    "sseConnectionId": "deploy-'$(date +%s)'",
    "wizardData": {
      "siteName": "Test Client 1",
      "industry": "general"
    }
  }'
```

---

## 📋 What Will Happen:

### 1. **Ploi Creates Site** (30 seconds)
- Domain: testclient1.compassdigital.nl
- Server: prod-sityzr-saas-01 (89.167.61.95)
- Type: Node.js (Payload CMS)

### 2. **Environment Setup** (10 seconds)
- Injects: PAYLOAD_SECRET, DATABASE_URL, etc.
- Configures deployment script

### 3. **Git Deployment** (2-3 minutes)
- Clones repository
- Runs: npm install
- Runs: npm build
- Starts: PM2 process

### 4. **SSL Certificate** (5-10 minutes)
- Let's Encrypt auto-provision
- Auto-renewal configured

### 5. **Site is LIVE!** 🎉
- URL: https://testclient1.compassdigital.nl
- Admin: https://testclient1.compassdigital.nl/admin

---

## 🔍 Monitor Deployment

### Via Platform UI:
- Real-time progress in the UI
- Step-by-step updates
- Error messages if any issues

### Via Ploi Dashboard:
1. Go to: https://ploi.io
2. Navigate to: Servers → prod-sityzr-saas-01 → Sites
3. Find: testclient1.compassdigital.nl
4. View logs in real-time!

---

## ⚙️ Architecture Reminder:

```
┌─────────────────────────────────┐
│   PLATFORM CMS (localhost)      │
│   http://localhost:3020         │
│   Database: Railway PostgreSQL  │
│   - Manages all clients         │
│   - Triggers deployments        │
└─────────────────────────────────┘
                │
                │ provisions
                ▼
┌─────────────────────────────────┐
│   PLOI SERVER (Hetzner VPS)     │
│   prod-sityzr-saas-01           │
│   IP: 89.167.61.95              │
│                                 │
│   ├─ testclient1.domain.nl      │
│   │  └─ SQLite database         │
│   │  └─ PM2 process (port 3000) │
│   │  └─ Nginx reverse proxy     │
│   │                             │
│   └─ (more clients here...)     │
└─────────────────────────────────┘
```

**Platform DB (Railway):** Control plane - manages clients
**Client DBs (Ploi):** Each client gets own SQLite database

---

## 🐛 Troubleshooting

### Server not responding?
```bash
# Check if server is running:
curl http://localhost:3020/api/health

# If not, restart:
PORT=3020 npm run dev
```

### Can't access Platform UI?
```bash
# Create platform admin if needed:
npm run payload -- migrate
```

### Deployment failed?
1. Check Ploi dashboard for logs
2. Verify DNS is pointed to server IP
3. Check deployment script in Ploi site settings

---

## 📊 Cost Breakdown:

**Current Setup:**
- **Platform CMS:** Free (localhost) or $20/month (Vercel)
- **Ploi:** €10/month (management)
- **Hetzner VPS:** €20/month (4vCPU, 8GB RAM)
- **Railway DB:** $9/month (PostgreSQL)

**Total:** €40-60/month for **10-30 client sites!**

Compare to Vercel-only: €150-450/month for same number of clients!

---

## 🎉 Next Steps:

1. ✅ Deploy first test client (you're here!)
2. Configure DNS (add A record pointing to 89.167.61.95)
3. Wait for SSL provisioning (5-10 min)
4. Access site at https://testclient1.compassdigital.nl
5. Deploy more clients! 🚀

---

**Need help?** Check these files:
- `docs/PLOI_SETUP_GUIDE.md` - Complete setup guide
- `test-ploi-connection.ts` - Test Ploi API connection
- `check-setup.sh` - Verify environment configuration

**Ready to go!** 🎊
