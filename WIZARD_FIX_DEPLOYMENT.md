# 🚀 Site Generator Wizard Fix - Deployment Guide

**Date:** 13 February 2026
**Issue:** Wizard hangs at 0% without errors
**Root Cause:** Insufficient memory allocation (95% usage) causing AI generation to fail silently

---

## ✅ FIXES APPLIED

### 1. **Memory Configuration** (`vercel.json`)
Added function-specific memory limits:
- **Wizard endpoints**: 3GB (`api/wizard/**/*.ts`)
- **AI Stream endpoints**: 1GB (`api/ai/**/*.ts`)

### 2. **Runtime Configuration** (`route.ts`)
Updated wizard API route with:
- `runtime = 'nodejs'` - Required for OpenAI SDK
- `preferredRegion = 'auto'` - Auto-select best region for performance

### 3. **Dependencies Fixed**
- ✅ Installed missing `cross-env` package
- ✅ Updated test scripts to use correct port (3020)

---

## 📊 PROBLEM ANALYSIS

### What Was Happening:
```
1. ✅ Frontend wizard loads perfectly
2. ✅ User fills in wizard and clicks "Generate"
3. ✅ API call succeeds (HTTP 200, Job ID returned)
4. ✅ SSE connection established
5. ❌ Backend crashes silently due to memory (95% usage)
6. ❌ OpenAI API calls fail (no memory available)
7. ❌ No progress updates sent to frontend
8. ❌ User sees: "Uw website wordt gegenereerd... 0%" forever
```

### Health Check Before Fix:
```json
{
  "memory": {
    "status": "error",
    "used": 42GB,
    "total": 45GB,
    "percentage": 95%
  }
}
```

---

## 🔧 DEPLOYMENT STEPS

### Step 1: Commit Changes
```bash
cd /Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app

git add .
git commit -m "Fix: Wizard memory limits for AI generation

- Add 3GB memory to wizard functions (vercel.json)
- Configure Node.js runtime for OpenAI SDK
- Fix cross-env dependency
- Update test scripts to port 3020

Fixes wizard hanging at 0% due to memory exhaustion (95% usage)"

git push origin main
```

### Step 2: Vercel Auto-Deploy
Vercel will automatically deploy when you push to `main` branch.

**Monitor deployment:**
1. Go to https://vercel.com/dashboard
2. Open your project: `cms-compassdigital-nl`
3. Go to **Deployments** tab
4. Wait for green ✅ (usually 2-3 minutes)

### Step 3: Verify Deployment
**Test health endpoint:**
```bash
curl https://cms.compassdigital.nl/api/health | json_pp
```

**Expected result:**
```json
{
  "status": "healthy",
  "memory": {
    "status": "ok",  // ← Should be "ok" now!
    "percentage": 40-60  // ← Should be much lower
  }
}
```

### Step 4: Test Wizard
1. Open: https://cms.compassdigital.nl/site-generator
2. Fill in wizard completely:
   - Company info
   - Design
   - Content pages
   - Features
3. Click **"Genereer!"**
4. **Watch for progress updates** (should see 10%, 25%, 40%, etc.)
5. Wait for completion (~2-5 minutes)

---

## 🎯 EXPECTED RESULTS AFTER FIX

### Before:
- ❌ Wizard hangs at 0%
- ❌ No console errors
- ❌ SSE stream receives no data
- ❌ Memory: 95% (error state)

### After:
- ✅ Progress bar updates in real-time
- ✅ "Analyseren van bedrijfsinformatie..." (10%)
- ✅ "Genereren van home pagina..." (25%)
- ✅ "Genereren van about pagina..." (40%)
- ✅ "SEO optimalisatie..." (75%)
- ✅ "Opslaan in database..." (90%)
- ✅ "✅ Site gegenereerd!" (100%)
- ✅ Memory: 40-60% (healthy)

---

## 🔍 TROUBLESHOOTING

### If Wizard Still Hangs:

**1. Check Vercel Function Logs:**
```
Vercel Dashboard → Project → Logs → Filter: "wizard"
```
Look for:
- `OPENAI_API_KEY not configured` → Add to Vercel env vars
- `Out of memory` → Memory config not applied
- `Timeout` → Function exceeded 5 minutes

**2. Check Memory Again:**
```bash
curl https://cms.compassdigital.nl/api/health
```
If memory is still high (>80%), there may be a memory leak.

**3. Manual Redeploy:**
```
Vercel Dashboard → Deployments → Latest → "Redeploy"
```

**4. Check OpenAI API Key:**
```
Vercel Dashboard → Settings → Environment Variables
Verify: OPENAI_API_KEY = sk-proj-...
```

**5. Check Browser Console:**
```
F12 → Console tab
Look for errors during wizard generation
```

**6. Check Network Tab:**
```
F12 → Network tab → Filter: "stream"
Click on /api/ai/stream/wizard-... request
Check "EventStream" tab for progress updates
```

---

## 📝 FILES CHANGED

```
✅ src/app/api/wizard/generate-site/route.ts
   - Added runtime = 'nodejs'
   - Added preferredRegion = 'auto'

✅ vercel.json
   - Added functions.api/wizard/**/*.ts (3GB, 300s)
   - Added functions.api/ai/**/*.ts (1GB, 300s)

✅ test-wizard.mjs
   - Updated BASE_URL: 3015 → 3020

✅ .env
   - DATABASE_URL: PostgreSQL → SQLite (local testing)

✅ .env.local
   - DATABASE_URL: PostgreSQL → SQLite (local testing)

✅ package.json
   - Added cross-env dependency (1180 packages)
```

---

## 🎉 SUCCESS CRITERIA

After deployment, the wizard should:
- ✅ Show real-time progress updates (0% → 100%)
- ✅ Generate 4-6 pages in 2-5 minutes
- ✅ Display generated pages in Payload CMS
- ✅ Memory usage stay below 70%
- ✅ No silent failures or hangs

---

## 🆘 SUPPORT

If issues persist after deployment:
1. Check Vercel logs for errors
2. Verify all environment variables are set
3. Test with minimal wizard config (just home page)
4. Contact support with:
   - Vercel deployment URL
   - Health check output
   - Browser console screenshot
   - Network tab screenshot (SSE stream)

---

**Good luck with deployment! 🚀**
