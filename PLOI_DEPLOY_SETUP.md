# Ploi Deployment Setup

## Quick Setup

### 1. Kopieer het Deploy Script naar Ploi

1. Open `deploy-ploi.sh` in deze repository
2. Ga naar **Ploi Dashboard** → Your Site → **Deploy Script**
3. Plak de volledige inhoud
4. Klik **Save**

### 2. Configureer Environment Variables in Ploi

Zorg dat deze environment variables zijn ingesteld in Ploi:

**Verplicht:**
```bash
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=https://cms.compassdigital.nl
NODE_ENV=production
PORT=4000
```

**Optioneel (maar aanbevolen):**
```bash
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
CONTACT_EMAIL=info@compassdigital.nl
FROM_EMAIL=noreply@compassdigital.nl
```

📍 **Waar:** Ploi Dashboard → Site → Environment → Add Variable

### 3. Test Deployment

**Optie 1: Via Ploi Dashboard**
```
Dashboard → Site → Deployments → Deploy Now
```

**Optie 2: Via Git Push**
```bash
git commit --allow-empty -m "Test deployment"
git push origin main
```

---

## Wat Doet het Script?

### Deployment Flow

```
1. 📥 Pull code        → git pull origin main
2. 📦 Install deps     → npm install
3. 🔨 Build            → npm run build
4. 🗄️  Migrate DB      → npm run migrate (auto-accepts prompts!)
5. 🔄 Restart PM2      → Graceful restart with new code
6. ✅ Verify           → Health check
```

### Key Features

✅ **Auto-migration** - Gebruikt `forceAcceptWarning: true`
✅ **Zero-downtime** - PM2 restart (niet kill/start)
✅ **Error handling** - `set -e` stopt bij fouten
✅ **Logging** - Duidelijke output bij elke stap
✅ **Health check** - Automatische verificatie na deploy

---

## Verschillen met Jouw Originele Script

### ✅ Verbeteringen

| Aspect | Jouw Script | Nieuw Script |
|--------|-------------|--------------|
| **Error output** | Basic | Gedetailleerd met emoji's |
| **Logging** | Minimaal | Elke stap logged |
| **Health check** | ❌ Geen | ✅ Automatisch |
| **Timing** | ❌ Geen | ✅ Start/end timestamps |
| **PM2 status** | ❌ Geen | ✅ Shows process list |
| **NODE_ENV** | ❌ Niet gezet | ✅ production |

### ⚠️ Let Op

**Jouw script was goed, maar:**
1. **Geen NODE_ENV=production** - Dit kan build/runtime verschillen veroorzaken
2. **Geen health check** - Je weet niet of deployment succesvol was
3. **Minimale logging** - Moeilijk debuggen bij problemen

---

## Troubleshooting

### Deployment Hangt bij Migratie

**Symptoom:**
```
[06:51:15] INFO: Reading migration files from...
? It looks like you've run Payload in dev mode...
[migrate] Safety timeout reached (90s) — force exit
```

**Oplossing:**
✅ **Gefixed!** - Nieuwe `migrate.ts` gebruikt `forceAcceptWarning: true`

### 502 Error Na Deployment

**Mogelijke oorzaken:**
1. **App crasht** - Check `pm2 logs cms-compassdigital`
2. **Port conflict** - Check `lsof -i :4000`
3. **Database unreachable** - Check DATABASE_URL

**Debug commando's:**
```bash
# SSH into server
ssh ploi@your-server-ip

# Check PM2 status
pm2 list
pm2 logs cms-compassdigital --lines 50

# Check app health
curl http://localhost:4000/api/health

# Restart manually
cd /home/ploi/cms.compassdigital.nl
pm2 restart cms-compassdigital
```

### Build Errors

**TypeScript errors:**
```bash
# Regenerate types
npm run generate:types
git add src/payload-types.ts
git commit -m "Update Payload types"
git push
```

**Out of memory:**
```bash
# In deploy script, verhoog memory:
export NODE_OPTIONS="--max-old-space-size=2048"
npm run build
```

---

## Monitoring Deployment

### Via Ploi Dashboard

1. **Deployments Tab** - Real-time deployment log
2. **Logs Tab** - PM2 application logs
3. **Environment Tab** - Check env vars

### Via SSH

```bash
# Connect
ssh ploi@your-server-ip

# Watch deployment live
tail -f /home/ploi/cms.compassdigital.nl/.pm2/logs/cms-compassdigital-out.log

# Check PM2 status
pm2 list
pm2 monit  # Interactive monitoring

# Check recent logs
pm2 logs cms-compassdigital --lines 100
```

### Via API

```bash
# Health check
curl https://cms.compassdigital.nl/api/health

# Full diagnostic
curl https://cms.compassdigital.nl/api/diag
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Code committed en gepusht naar `main` branch
- [ ] Environment variables ingesteld in Ploi
- [ ] Database backup gemaakt (optioneel maar aanbevolen)

### During Deployment
- [ ] Ploi deployment log monitoren
- [ ] Geen errors in build output
- [ ] Migratie succesvol: `✅ Migrations completed successfully`
- [ ] PM2 restart succesvol

### Post-Deployment
- [ ] Health check: `https://cms.compassdigital.nl/api/health`
- [ ] Admin login werkt: `https://cms.compassdigital.nl/admin`
- [ ] Frontend laadt: `https://cms.compassdigital.nl`
- [ ] Check PM2 logs: geen errors

---

## Advanced Configuration

### Custom Port

```bash
# In Ploi environment variables
PORT=5000

# Deploy script detecteert dit automatisch
```

### Multiple Environments

**Staging:**
```bash
# Separate site in Ploi met eigen:
- Branch: staging
- Domain: staging.cms.compassdigital.nl
- PORT: 4001
- DATABASE_URL: (staging database)
```

**Production:**
```bash
- Branch: main
- Domain: cms.compassdigital.nl
- PORT: 4000
- DATABASE_URL: (production database)
```

### Auto-Deploy on Git Push

**Webhook Setup:**
1. Ploi → Site → **Repository**
2. Enable **"Quick Deploy"**
3. Selecteer **main** branch
4. Elke push naar main triggert auto-deploy

---

## Performance Tips

### Optimize Build Time

```bash
# In deploy script, voeg toe:
export NEXT_TELEMETRY_DISABLED=1
npm run build
```

### Parallelize Steps

```bash
# Als je meerdere build stappen hebt:
npm run build:css & npm run build:js & wait
```

### Cache Dependencies

Ploi cached automatisch `node_modules` tussen deployments als:
- `package.json` niet veranderd is
- Deployment succesvol was

---

## Rollback Procedure

### Als deployment faalt:

```bash
# SSH into server
ssh ploi@your-server-ip
cd /home/ploi/cms.compassdigital.nl

# 1. Check laatste werkende commit
git log --oneline -5

# 2. Rollback naar vorige versie
git reset --hard <previous-commit-hash>

# 3. Rebuild en restart
npm install
npm run build
pm2 restart cms-compassdigital

# 4. Verify
curl http://localhost:4000/api/health
```

### Via Ploi Dashboard:

1. **Deployments** tab
2. Find previous successful deployment
3. Click **"Redeploy"**

---

## Security Notes

### Environment Variables

⚠️ **Nooit committen:**
- `.env` files
- `PAYLOAD_SECRET`
- Database credentials
- API keys

✅ **Altijd via Ploi:**
- Dashboard → Environment Variables
- Encrypted at rest
- Niet in git history

### Database Migrations

⚠️ **Production migrations:**
- Altijd backup maken eerst
- Test migrations op staging
- Review migration files voor destructive changes

✅ **Safe migrations:**
- Adding columns = safe
- Dropping columns = dangerous (data loss!)
- Renaming = complex (use multi-step approach)

---

## Support & Resources

### Logs & Debugging

```bash
# PM2 logs
pm2 logs cms-compassdigital

# System logs
journalctl -u nginx -f

# Deployment log
cat /home/ploi/cms.compassdigital.nl/deploy.log
```

### Useful Commands

```bash
# Restart app
pm2 restart cms-compassdigital

# Stop app
pm2 stop cms-compassdigital

# Delete and recreate
pm2 delete cms-compassdigital
pm2 start npm --name cms-compassdigital -- start

# Monitor resources
pm2 monit
htop
```

### Links

- [Ploi Docs](https://ploi.io/documentation)
- [PM2 Docs](https://pm2.keymetrics.io/docs)
- [Payload Migrations](https://payloadcms.com/docs/database/migrations)

---

**Last Updated:** 19 Februari 2026
**Status:** ✅ Production Ready
