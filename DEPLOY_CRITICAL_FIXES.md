# 🚨 CRITICAL DEPLOYMENT - PM2 Port Conflict Fix

**Datum:** 25 februari 2026
**Prioriteit:** 🔴 CRITICAL - Alle sites crashen met EADDRINUSE
**Commits:** `fe39685` + `0715341`
**Status:** ✅ KLAAR OM TE DEPLOYEN

---

## 📋 Wat is er gefixed?

### Fix #1: package.json start script (Commit: fe39685)
**Probleem:**
- Start script had unescaped inner quotes → invalid JSON
- Veroorzaakte webpack build failures op hospitality01

**Oplossing:**
```json
// VOOR:
"start": "cross-env NODE_OPTIONS=--no-deprecation next start"

// NA:
"start": "cross-env NODE_OPTIONS=\"--no-deprecation --max-old-space-size=1024\" next start"
```

### Fix #2: PM2 Port Conflicts (Commit: 0715341) 🔴 CRITICAL
**Probleem:**
- Alle sites proberen op port 3000 te draaien → EADDRINUSE crashes
- `pm2 restart --update-env` pikt PORT uit .env NIET op
- Sites crashen omdat ze elkaars poort gebruiken

**Oorzaak:**
- `pm2 restart` hergebruikt originele start arguments
- `.env` PORT variable wordt NIET opnieuw ingelezen
- `--port` flag wordt NIET opnieuw meegegeven

**Oplossing:**
- Deploy scripts lezen PORT uit .env per site
- PM2 wordt volledig herstart (stop + delete + start) met correcte --port flag
- Scripts: `safe-deploy.sh` + `deploy-all.sh` gefixed

---

## 🎯 Deployment Stappen

### Stap 1: Backup ALLES (5 min)
```bash
# SSH naar server
ssh ploi@89.167.61.95

# Backup alle databases (BELANGRIJK!)
cd /home/ploi/scripts
node backup-all.mjs "pre-critical-fix"

# Check backup status
ls -lh /home/ploi/backups/ | tail -20
```

**Verwacht:** Backups voor alle 7+ sites met timestamp

---

### Stap 2: Pull de fixes (1 min)
```bash
cd /home/ploi/siteforge.compassdigital.nl
git pull origin main
```

**Verwacht output:**
```
From https://github.com/compassdigitalnl/compassdigital-cms
   fe39685..0715341  main -> main
Updating fe39685..0715341
Fast-forward
 package.json                           | 2 +-
 scripts/deployment/deploy-all.sh       | 16 ++++++++++++----
 scripts/deployment/safe-deploy.sh      | 23 ++++++++++++++++++----
 3 files changed, 36 insertions(+), 5 deletions(-)
```

---

### Stap 3: Verify de changes (2 min)
```bash
cd /home/ploi/siteforge.compassdigital.nl

# Check Fix #1: package.json start script
grep '"start"' package.json

# Moet tonen:
# "start": "cross-env NODE_OPTIONS=\"--no-deprecation --max-old-space-size=1024\" next start",

# Check Fix #2: PM2 restart logic in deploy scripts
grep -A 10 "PORT uit .env" scripts/deployment/safe-deploy.sh

# Moet tonen:
# if [ -f "${SITE_DIR}/.env" ]; then
#     PORT=$(grep -E "^PORT=" "${SITE_DIR}/.env" | cut -d '=' -f2 || echo "3020")
#     echo "[deploy] PORT uit .env: ${PORT}"
# ...
```

**Als grep niets toont:** Fix is NIET aanwezig! Stop en debug.

---

### Stap 4: Check huidige PM2 status (1 min)
```bash
pm2 list

# Noteer welke processen NIET "online" zijn!
# Dit zijn waarschijnlijk de sites met EADDRINUSE errors
```

**Verwacht probleem:**
```
│ horeca01-cms       │ errored   │ 0     │ Error: listen EADDRINUSE :::3000
│ hospitality01-cms  │ errored   │ 0     │ Error: listen EADDRINUSE :::3000
```

---

### Stap 5: Deploy ALLE sites (15-20 min) 🔴 KRITIEK
```bash
cd /home/ploi/siteforge.compassdigital.nl

# OPTIE A: Deploy ALLE sites parallel (snelste, ~15 min)
bash scripts/deployment/deploy-all.sh

# OPTIE B: Deploy sites individueel (langzamer, maar meer controle)
# Alleen als je voorzichtig wilt zijn met 1-2 sites eerst
```

**Wat gebeurt er tijdens deploy-all.sh:**
```
FASE 1/4: Git pull + npm install      (elk ~10 sec)
FASE 2/4: Database migraties           (elk ~5 sec)
FASE 3/4: Next.js builds (parallel)    (~2-3 min per batch)
FASE 4/4: PM2 restarts                 (nieuw: met correcte PORT!)
```

**Verwacht output per site:**
```
→ horeca01.compassdigital.nl: PM2 herstarten...
  → PORT uit .env: 4001
  ✓ Herstart succesvol (port 4001)

→ hospitality01.compassdigital.nl: PM2 herstarten...
  → PORT uit .env: 4002
  ✓ Herstart succesvol (port 4002)
```

**Als je OPTIE B kiest (individueel):**
```bash
# horeca01
bash scripts/deployment/safe-deploy.sh \
  /home/ploi/horeca01.compassdigital.nl \
  client_horeca01 \
  horeca01-cms

# hospitality01
bash scripts/deployment/safe-deploy.sh \
  /home/ploi/hospitality01.compassdigital.nl \
  client_hospitality01 \
  hospitality01-cms

# plastimed01
bash scripts/deployment/safe-deploy.sh \
  /home/ploi/plastimed01.compassdigital.nl \
  client_plastimed01 \
  payload-cms

# aboland01
bash scripts/deployment/safe-deploy.sh \
  /home/ploi/aboland01.compassdigital.nl \
  client_aboland01 \
  aboland01-cms

# beauty01
bash scripts/deployment/safe-deploy.sh \
  /home/ploi/beauty01.compassdigital.nl \
  client_beauty01 \
  beauty01-cms

# construction01
bash scripts/deployment/safe-deploy.sh \
  /home/ploi/construction01.compassdigital.nl \
  client_construction01 \
  construction01-cms

# content01
bash scripts/deployment/safe-deploy.sh \
  /home/ploi/content01.compassdigital.nl \
  client_content01 \
  content01-cms
```

---

### Stap 6: Verificatie (5 min) ✅ BELANGRIJK!
```bash
# Check PM2 status
pm2 list

# ALLE sites moeten "online" zijn met restart count
# Check dat elke site op ZIJN EIGEN PORT draait
```

**Verwacht (ALLE sites online):**
```
┌─────┬───────────────────────┬─────────┬─────────┬───────────┬──────────┐
│ id  │ name                  │ status  │ restart │ uptime    │ memory   │
├─────┼───────────────────────┼─────────┼─────────┼───────────┼──────────┤
│ 0   │ siteforge-cms         │ online  │ 0       │ 5m        │ 456 MB   │
│ 1   │ horeca01-cms          │ online  │ 0       │ 4m        │ 412 MB   │
│ 2   │ hospitality01-cms     │ online  │ 0       │ 4m        │ 389 MB   │
│ 3   │ plastimed01-cms       │ online  │ 0       │ 4m        │ 401 MB   │
│ 4   │ aboland01-cms         │ online  │ 0       │ 4m        │ 367 MB   │
│ 5   │ beauty01-cms          │ online  │ 0       │ 3m        │ 378 MB   │
│ 6   │ construction01-cms    │ online  │ 0       │ 3m        │ 392 MB   │
│ 7   │ content01-cms         │ online  │ 0       │ 3m        │ 355 MB   │
└─────┴───────────────────────┴─────────┴─────────┴───────────┴──────────┘
```

**Check dat PM2 de juiste PORTS gebruikt:**
```bash
# Bekijk PM2 startup commands
pm2 prettylist | grep -E "port|exec_mode" | head -20

# OF check logs voor port confirmation
pm2 logs horeca01-cms --lines 3 --nostream
pm2 logs hospitality01-cms --lines 3 --nostream
```

**Verwacht in logs:**
```
horeca01-cms: ready - started server on 0.0.0.0:4001
hospitality01-cms: ready - started server on 0.0.0.0:4002
```

**Check individuele site health:**
```bash
# Test elke site op ZIJN PORT (niet port 3000!)
curl -s http://localhost:4001/admin/ | grep -i "payload"  # horeca01
curl -s http://localhost:4002/admin/ | grep -i "payload"  # hospitality01
curl -s http://localhost:4003/admin/ | grep -i "payload"  # plastimed01
curl -s http://localhost:4004/admin/ | grep -i "payload"  # aboland01
curl -s http://localhost:4005/admin/ | grep -i "payload"  # beauty01
curl -s http://localhost:4006/admin/ | grep -i "payload"  # construction01
curl -s http://localhost:4007/admin/ | grep -i "payload"  # content01
```

**Elk moet Payload HTML teruggeven!**

---

### Stap 7: Test publieke toegang (2 min)
```bash
# Test alle sites via HTTPS
curl -sI https://horeca01.compassdigital.nl | head -1
curl -sI https://hospitality01.compassdigital.nl | head -1
curl -sI https://plastimed01.compassdigital.nl | head -1
curl -sI https://aboland01.compassdigital.nl | head -1
curl -sI https://beauty01.compassdigital.nl | head -1
curl -sI https://construction01.compassdigital.nl | head -1
curl -sI https://content01.compassdigital.nl | head -1
```

**Verwacht ALLEMAAL:**
```
HTTP/2 200
```

---

## 🔥 Troubleshooting

### Probleem: Site blijft "errored" na restart
**Diagnose:**
```bash
# Check PM2 logs
pm2 logs horeca01-cms --lines 50 --nostream

# Check .env PORT variable
grep "^PORT=" /home/ploi/horeca01.compassdigital.nl/.env

# Check welke processen op port 4001 draaien
lsof -i :4001
```

**Oplossing 1: Force restart met correcte port**
```bash
pm2 stop horeca01-cms
pm2 delete horeca01-cms
cd /home/ploi/horeca01.compassdigital.nl
PORT=$(grep "^PORT=" .env | cut -d'=' -f2)
pm2 start npm --name horeca01-cms -- start -- --port $PORT
pm2 save
```

**Oplossing 2: Check port conflict**
```bash
# Als lsof toont dat port in gebruik is door ander proces:
lsof -i :4001
# Kill het andere proces OF kies andere port in .env
```

---

### Probleem: Build faalt met OOM (Out Of Memory)
**Oplossing:**
```bash
# Builds draaien al met 4096MB, maar als site ZEER groot is:
cd /home/ploi/horeca01.compassdigital.nl
NODE_OPTIONS="--max-old-space-size=8192" npm run build
```

---

### Probleem: Deploy script faalt bij git pull
**Oplossing:**
```bash
cd /home/ploi/horeca01.compassdigital.nl
git status  # Check voor uncommitted changes
git stash   # Bewaar lokale wijzigingen
git pull origin main
```

---

### Probleem: "EADDRINUSE" errors blijven
**Dit betekent dat de fix NIET is toegepast!**

**Check:**
```bash
# Moet nieuwe code tonen met PORT uit .env
grep -A 5 "PORT uit .env" /home/ploi/siteforge.compassdigital.nl/scripts/deployment/safe-deploy.sh

# Als dit LEEG is, is de fix niet gepulled!
cd /home/ploi/siteforge.compassdigital.nl
git log --oneline -5

# Moet tonen:
# 0715341 fix(deploy): Read PORT from .env and fully restart PM2
# fe39685 fix: Escape quotes in package.json start script
```

---

## ✅ Success Criteria

Deployment is succesvol als:

1. ✅ `git log` toont commits `fe39685` + `0715341`
2. ✅ `pm2 list` toont ALLE sites als "online"
3. ✅ PM2 logs tonen correcte ports (4001, 4002, 4003, etc.)
4. ✅ Geen "EADDRINUSE" errors in PM2 logs
5. ✅ Alle sites bereikbaar via HTTPS (200 status)
6. ✅ Admin panels werken: https://{site}.compassdigital.nl/admin/

---

## 📊 Expected Results

### Voor de fix:
- ❌ 5-7 sites "errored" met EADDRINUSE
- ❌ Alle sites proberen port 3000 te gebruiken
- ❌ Builds falen op sommige sites

### Na de fix:
- ✅ ALLE sites "online"
- ✅ Elke site op eigen PORT (4001, 4002, 4003, etc.)
- ✅ Geen port conflicts
- ✅ Builds succesvol met 4096MB limiet
- ✅ PM2 restarts werken correct

---

## 🎉 Post-Deployment Checklist

Na succesvolle deployment:

- [ ] PM2 list: ALLE sites online
- [ ] PM2 logs: Geen EADDRINUSE errors
- [ ] Port check: Elke site op eigen port
- [ ] HTTPS check: Alle sites bereikbaar
- [ ] Admin check: Admin panels werken
- [ ] Monitor logs: Check voor 5 minuten op errors
- [ ] PM2 save: Process list opgeslagen

```bash
# Final check
pm2 list
pm2 save
echo "✅ Deployment compleet!"
```

---

## 📞 Contact

Bij problemen:
- **Developer:** Mark Kokkelkoren
- **AI Assistant:** Claude Code
- **Repo:** https://github.com/compassdigitalnl/compassdigital-cms
- **Commits:** `fe39685` + `0715341`

---

**🚀 KLAAR VOOR DEPLOYMENT!**

Alle fixes zijn getest en gepushed naar `main`.
Server kan nu veilig pullen en deployen.
Verwachte downtime: 15-20 minuten (tijdens rebuild).
