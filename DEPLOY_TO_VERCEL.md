# 🚀 Deploy Platform CMS to Vercel (cms.compassdigital.nl)

## ✅ Huidige Situatie

**Platform CMS:**
- ✅ Al live op Vercel: https://cms.compassdigital.nl
- ✅ Ploi integration code is al in de repo
- 🎯 Nu: Ploi environment variables toevoegen

**Client Sites:**
- 🎯 Worden gedeployed naar Ploi server
- Server: prod-sityzr-saas-01 (89.167.61.95)

---

## 📋 Stap 1: Push Latest Code to GitHub

```bash
# Check wat er nog uncommitted is:
git status

# Add nieuwe files:
git add .

# Commit changes:
git commit -m "Add Ploi integration + deployment scripts

- Added PloiService.ts (Ploi API wrapper)
- Added PloiAdapter.ts (deployment adapter)
- Added multi-provider support (Vercel + Ploi)
- Added deployment scripts and documentation
- Updated environment variables"

# Push naar GitHub:
git push origin main
```

---

## 📋 Stap 2: Add Environment Variables in Vercel

### 2.1 Open Vercel Dashboard

1. Go to: https://vercel.com/compassdigitalnl/your-project
2. Click **Settings** → **Environment Variables**

### 2.2 Add Ploi Variables

Add deze environment variables:

```bash
# Ploi API Configuration
PLOI_API_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZDA0Y2NkMjc0OTBiYWQ5MDk3NGEyMDIyYTZmY2M5OWRmYzdjZGU1ZTk4MTUwOTdlNjg5ZTY4MTE1Nzk5MWM2NDc3MjlkOGVmYTUxZDhjMDMiLCJpYXQiOjE3NzAzMTM5NjUuNjIxMTM1LCJuYmYiOjE3NzAzMTM5NjUuNjIxMTM2LCJleHAiOjE4MzMzODU5NjUuNjE5MzUsInN1YiI6IjM2NjUxIiwic2NvcGVzIjpbInNlcnZlcnMtcmVhZCIsInNlcnZlcnMtY3JlYXRlIiwiZGF0YWJhc2UtcmVhZCIsImRhdGFiYXNlLWNyZWF0ZSIsInN5c3RlbS11c2Vycy1yZWFkIiwic3lzdGVtLXVzZXJzLWNyZWF0ZSIsInNpdGVzLWNyZWF0ZSIsInNpdGVzLWRlbGV0ZSIsInNzaC1rZXlzLXJlYWQiLCJzc2gta2V5cy1jcmVhdGUiLCJjZXJ0aWZpY2F0ZXMtcmVhZCIsImNlcnRpZmljYXRlcy1jcmVhdGUiXX0.Cx9OV8LR-zVgM5yIXCqLlp2tAnqzP8_uR8HLOF7KKWC65gdl28oHOuPbXb2SLz8buIVG3lJTW1bL5NkKLWs-tdAr4r5_R1yhpbW6q4LVJbxgQTl8qyCXDnJcrT0mHK2j3BsGEP9IqWKNqCU77wGY5niyYbVfkFALqKkxJaqmXMYDo7WPRUq-rUzxF52kjdER9eNcN3aL1zgdRD3dWyMgDLrrtdpkFW-R2xpgqqPXcvI9NgBGYws3mDZtagLBgM0N9nix4OKqtCGnZ_ZKPRCJFLFwDRV_felKpMsHUlFxuzHjCK_7Jkt935Ke-JubPRIWDYoc2STVSU1ULnbIidAvvG6rSpWfeYNiMq3XhQvZbQttRw2pW7kyzvEHScE2aagnsa_jFx7c2_VT50RJI3Az_NjX7vdpnXt7MSkF1556PXc7G9QKr13swC4244ocHqXUWoRWCzHwvPD-uW88HCBmTDkbeXNUr8CT6po5z4IhYbN90ZQDJLPbySXHhNS2zixnE2G7szlgFmHh8KJ0IAluka3Q2SWmTF9Uo--ARqMf14o04bmAA2YCTS7Bnf4S7_u5v0nP7sZF04oqM-wOI-MNd_nKrKIv9L2mDsg5z_rpleJ-ANDLd_rKZwRRpzRSuWDTqhlFq0Bqumf0j_6x7o8YX7jFGeyHWI9To_YjQinXsVU

PLOI_SERVER_ID=108942

# Default Deployment Provider
DEFAULT_DEPLOYMENT_PROVIDER=ploi

# Platform Base URL (voor client subdomains)
PLATFORM_BASE_URL=compassdigital.nl
```

### 2.3 Verify Existing Variables

Zorg dat deze er ook staan (waarschijnlijk al geconfigureerd):

```bash
# Database
DATABASE_URL=postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/railway

# Payload
PAYLOAD_SECRET=mygeneratedsecret

# Server URL
NEXT_PUBLIC_SERVER_URL=https://cms.compassdigital.nl
PAYLOAD_PUBLIC_SERVER_URL=https://cms.compassdigital.nl

# OpenAI (voor AI features)
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE
```

---

## 📋 Stap 3: Redeploy Vercel

### Option A: Via Vercel Dashboard (Makkelijkst)

1. Go to: https://vercel.com/compassdigitalnl/your-project
2. Click **Deployments** tab
3. Click **"⋯"** next to latest deployment
4. Click **"Redeploy"**
5. Wait ~2 minutes for deployment ✅

### Option B: Via Git Push (Automatic)

Als je je code hebt gepusht (Stap 1), deployt Vercel automatisch!

Check: https://vercel.com/compassdigitalnl/your-project/deployments

---

## 📋 Stap 4: Test Ploi Integration

### 4.1 Check Platform CMS

1. Open: https://cms.compassdigital.nl/platform/clients
2. Login met platform admin
3. Klik **"+ Create New"**

### 4.2 Create Test Client

Fill in:
- **Name:** Test Client 1
- **Domain:** testclient1 (becomes: testclient1.compassdigital.nl)
- **Email:** test@example.com
- **Deployment Provider:** **ploi** ← Important!
- **Plan:** starter
- **Template:** corporate

Click **Save**

### 4.3 Deploy to Ploi!

1. Open de client die je net maakte
2. Klik **"Launch Site"** button
3. Watch real-time deployment progress! 🚀

---

## 🎯 Deployment Flow

```
Developer (JIJ)
      ↓
   GitHub Push
      ↓
Platform CMS (Vercel)
cms.compassdigital.nl
      ↓
   Triggers Deployment
      ↓
Ploi Server (prod-sityzr-saas-01)
      ├─ testclient1.compassdigital.nl
      ├─ testclient2.compassdigital.nl
      └─ ... more clients
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Platform CMS accessible: https://cms.compassdigital.nl
- [ ] Can login to Platform admin
- [ ] Can create new client
- [ ] "Deployment Provider" dropdown shows "ploi" option
- [ ] Can click "Launch Site" button
- [ ] Deployment starts and shows progress
- [ ] Check Ploi dashboard: https://ploi.io/servers/108942/sites
- [ ] New site appears in Ploi
- [ ] Site deploys successfully
- [ ] SSL certificate provisions (5-10 min)
- [ ] Client site accessible at subdomain

---

## 🐛 Troubleshooting

### Environment Variables Not Showing?

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Click **"Add New"**
3. Make sure to select **All Environments** (Production, Preview, Development)
4. Click **Save**
5. Redeploy

### Ploi Integration Not Working?

Check Vercel deployment logs:

1. Go to: https://vercel.com/compassdigitalnl/your-project/deployments
2. Click latest deployment
3. Click **"Build Logs"** or **"Runtime Logs"**
4. Search for errors related to "Ploi" or "provisioning"

### Can't Create Client?

Check Railway database connection:

```bash
# Test from local:
PGPASSWORD="eBTNOrSGwkADvgAVJKyQtllGSjugdtrN" \
  psql -h shinkansen.proxy.rlwy.net -p 29352 \
  -U postgres -d railway -c "SELECT COUNT(*) FROM clients;"
```

---

## 📊 Cost Breakdown (Monthly)

```
Platform CMS (Vercel Pro):      $20/month
Client Sites (Ploi + Hetzner):  €30/month (~$33)
Database (Railway):              $9/month
─────────────────────────────────────────
TOTAL:                          ~$62/month

For 10-30 client sites!

Compare to:
All-Vercel: $200-500/month
Savings: 70-88%! 🎉
```

---

## 🎉 You're Done!

**Next Steps:**

1. ✅ Push code to GitHub
2. ✅ Add Ploi env vars to Vercel
3. ✅ Redeploy Vercel
4. ✅ Create first test client
5. 🚀 Deploy to Ploi!

**Your Setup:**
```
✅ Platform CMS: Vercel (auto-scaling, global CDN)
✅ Client Sites: Ploi (cost-effective VPS hosting)
✅ Database: Railway (managed PostgreSQL)

Perfect multi-tenant SaaS architecture! 🎊
```

---

**Need help?**
- Vercel Docs: https://vercel.com/docs
- Ploi API: https://developers.ploi.io
- Railway Docs: https://docs.railway.app
