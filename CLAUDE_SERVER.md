# 🤖 Server Cleanup Instructions (Sprint 1)

**Voor:** Claude AI agent op Ploi/Hetzner server
**Datum:** February 24, 2026
**Context:** Sprint 1 (Compass Design System) deployment + script cleanup

---

## 🎯 TAAK: Verwijder Obsolete Scripts van Server

Na het pullen van deze commit, voer de volgende cleanup uit:

### Stap 1: Navigeer naar scripts directory
```bash
cd /home/ploi/scripts
```

### Stap 2: Verwijder obsolete scripts
```bash
# Verwijder legacy migration scripts (niet meer gebruikt)
rm -f migrate-ultra-safe.sh
rm -f emergency-rollback.sh
rm -f pre-flight-check.sh
rm -f add-auto-slug.sh

# Controleer dat ze weg zijn
ls -lh *.sh
```

### Stap 3: Verificeer resterende scripts
Na cleanup moeten **alleen deze scripts** aanwezig zijn:

**✅ Actieve Scripts (BEHOUDEN):**
- `safe-deploy.sh` - Re-deployment bestaande tenants
- `deploy-all.sh` - Bulk deployment alle tenants
- `backup-all.sh` - Database backups

**✅ Actieve JavaScript/Node scripts (BEHOUDEN):**
- `backup-db.mjs` - Database backup utility
- `check-migrations.mjs` - Migration safety checker
- (andere .mjs/.js scripts zijn OK)

### Stap 4: Controleer disk space (optioneel)
```bash
# Check hoeveel ruimte vrijgemaakt is
du -sh /home/ploi/scripts/
```

---

## 📝 Context: Waarom Deze Scripts Verwijderen?

### Gearchiveerde Scripts:

1. **`migrate-ultra-safe.sh`** (12KB)
   ❌ Legacy src/ directory cleanup - Eenmalige migratie uit Feb 2026

2. **`emergency-rollback.sh`** (7.3KB)
   ❌ Oude rollback utility - Vervangen door `safe-deploy.sh`

3. **`pre-flight-check.sh`** (2.9KB)
   ❌ Oude pre-migration checks - Vervangen door `src/scripts/pre-build-check.ts`

4. **`add-auto-slug.sh`** (1.3KB)
   ❌ Eenmalige utility voor oude schema - Niet meer nodig

### Actieve Deployment Architectuur:

**Voor NIEUWE tenant provisioning:**
- 🤖 Automatisch: `src/lib/provisioning/adapters/PloiAdapter.ts`
- 🛠️ Manueel: `docs/setup/provision-site.sh`

**Voor BESTAANDE tenant updates:**
- 🔄 Enkele site: `scripts/safe-deploy.sh`
- 🚀 Bulk (parallel): `scripts/deploy-all.sh`

**Voor Platform CMS:**
- 🏢 `/deploy.sh` (root directory)

---

## ✅ Sprint 1 Updates (Deze Commit)

### Provisioning Scripts Updated:
- ✅ **PloiAdapter.ts** - Toegevoegd: database migrations + theme seeding
- ✅ **provision-site.sh** - Toegevoegd: theme seeding (10 industry verticals)

### Database Changes:
- ✅ **5 migrations** - 54 design tokens (colors, spacing, typography, visual, gradients)
- ✅ **Theme seeding** - 10 default industry themes (Medisch, Beauty, Bouw, Horeca, etc.)

### New Collections:
- ✅ **Themes collection** - Multi-tenant theme configurations

---

## 🚨 BELANGRIJKE NOTES

1. **BACKUP EERST** (optioneel, maar aanbevolen):
   ```bash
   # Backup scripts directory (just in case)
   cp -r /home/ploi/scripts /home/ploi/scripts-backup-$(date +%Y%m%d)
   ```

2. **VERWIJDER GEEN .mjs/.js scripts** - Alleen de 4 genoemde .sh scripts!

3. **Test deployment na cleanup:**
   ```bash
   # Test een safe-deploy op een test site
   bash /home/ploi/scripts/safe-deploy.sh /home/ploi/testsite01.compassdigital.nl
   ```

4. **Bij twijfel:** Check deze documentatie of vraag Mark

---

**Generated:** Sprint 1 Cleanup (Compass Design System)
**Last updated:** February 24, 2026
