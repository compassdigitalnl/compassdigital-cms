# ⚡ QUICK DEPLOY GUIDE - TL;DR

**For experienced admins who just need the commands**

---

## 🚀 Standard Deployment (5 minutes)

```bash
# 1. SSH to server
ssh user@cms.compassdigital.nl
cd /home/ploi/cms.compassdigital.nl

# 2. Pull code
git pull origin main

# 3. Clean & Build
rm -rf .next
npm run build

# 4. Restart
pm2 restart all

# 5. Verify
curl -I https://cms.compassdigital.nl
curl https://cms.compassdigital.nl/api/health
pm2 logs --lines 20
```

**Done! ✅**

---

## 🗄️ Database Check (Optional - 30 seconds)

```bash
# Quick DB verification
psql $DATABASE_URL -c "SELECT COUNT(*) FROM payload_migrations;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM pages;"

# Expected: No new migrations, all data intact
```

**No migrations needed!** This is file-reorganization only.

---

## ⚠️ If Build Fails

```bash
# Nuclear option
rm -rf .next node_modules
npm install
npm run build
pm2 restart all
```

---

## 🔙 Rollback (if needed)

```bash
git revert HEAD --no-edit
rm -rf .next
npm run build
pm2 restart all
```

---

## ✅ Success Check

- [ ] Homepage loads
- [ ] Admin panel works
- [ ] `pm2 logs` shows no errors

---

**Full docs**: See `SERVER-DEPLOYMENT-INSTRUCTIONS.md`
