# 🌐 VERCEL CUSTOM DOMAIN SETUP - cms.compassdigital.nl

**Doel:** `cms.compassdigital.nl` koppelen aan je Vercel deployment
**Tijd:** 5-10 minuten (+ 0-48 uur DNS propagatie)

---

## 📋 STAP 1: DOMAIN TOEVOEGEN IN VERCEL

### Via Dashboard (Aanbevolen):

1. **Open Vercel Project Settings**
   ```
   https://vercel.com/compass-digital-50e6916c/compassdigital-cms/settings/domains
   ```

2. **Voeg Domain Toe**
   - Klik op: "Add Domain"
   - Voer in: `cms.compassdigital.nl`
   - Klik: "Add"

3. **Vercel Geeft DNS Instructies**
   Vercel detecteert dat dit een subdomain is en geeft je een CNAME record:
   ```
   Type:  CNAME
   Name:  cms
   Value: cname.vercel-dns.com  (of je project-specifieke CNAME)
   ```

---

## 📋 STAP 2: DNS RECORDS INSTELLEN

### Waar is compassdigital.nl gehost?

Check waar je domain DNS staat:
```bash
# Via terminal:
nslookup compassdigital.nl

# Of online tool:
https://who.is/whois/compassdigital.nl
```

**Veel gebruikte providers:**
- Vercel DNS (als je domain daar staat)
- Cloudflare
- TransIP
- Mijndomein.nl
- GoDaddy
- Namecheap

---

### Optie A: Vercel DNS (Makkelijkst)

**Als je domain al bij Vercel staat:**

1. Ga naar: https://vercel.com/domains
2. Zoek: `compassdigital.nl`
3. Klik: "Manage DNS"
4. Vercel heeft waarschijnlijk het CNAME record al automatisch toegevoegd!
5. Check de DNS records - je zou moeten zien:
   ```
   cms  →  CNAME  →  cname.vercel-dns.com
   ```

**Klaar!** ✅ Vercel regelt de rest automatisch.

---

### Optie B: Cloudflare (Populair)

**Als je DNS bij Cloudflare staat:**

1. **Login bij Cloudflare**
   ```
   https://dash.cloudflare.com
   ```

2. **Select Domain**
   - Klik op `compassdigital.nl`

3. **Ga naar DNS Settings**
   - Klik op "DNS" in het menu

4. **Voeg CNAME Record Toe**
   - Klik: "Add record"
   - Type: `CNAME`
   - Name: `cms`
   - Target: `cname.vercel-dns.com` (of de waarde die Vercel gaf)
   - **Proxy status: DNS only** (oranje cloud UITSCHAKELEN!)
   - TTL: Auto
   - Klik: "Save"

**BELANGRIJK:** Zet de proxy UIT (grijze cloud)!
- ☁️ Oranje cloud = Proxied (kan issues geven met Vercel SSL)
- ☁️ Grijze cloud = DNS only (aanbevolen voor Vercel)

---

### Optie C: TransIP (Nederlandse Provider)

1. **Login bij TransIP**
   ```
   https://www.transip.nl/cp/
   ```

2. **Ga naar Domain Management**
   - Klik op: "Domeinen"
   - Selecteer: `compassdigital.nl`

3. **DNS Instellingen**
   - Klik op: "DNS"

4. **Voeg CNAME Record Toe**
   - Klik: "Nieuw DNS record"
   - Type: `CNAME`
   - Naam: `cms`
   - Waarde: `cname.vercel-dns.com`
   - TTL: 3600 (1 uur)
   - Klik: "Opslaan"

---

### Optie D: Andere Providers (Generic)

**Algemene stappen voor elke DNS provider:**

1. Login bij je DNS provider (waar je domain staat)
2. Zoek "DNS Management" of "DNS Settings"
3. Voeg een nieuw record toe:
   ```
   Type:  CNAME
   Host:  cms
   Value: cname.vercel-dns.com
   TTL:   3600 (of Auto/Default)
   ```
4. Sla op

**Common Provider Links:**
- **Mijndomein.nl:** https://mijn.mijndomein.nl/dns
- **GoDaddy:** https://dcc.godaddy.com/dns
- **Namecheap:** https://ap.www.namecheap.com/ → Domain List → Manage
- **Google Domains:** https://domains.google.com/

---

## 📋 STAP 3: VERIFIEER DNS PROPAGATIE

### Check DNS Status:

**Via Terminal:**
```bash
# Check of CNAME record actief is:
nslookup cms.compassdigital.nl

# Verwachte output:
# cms.compassdigital.nl    canonical name = cname.vercel-dns.com
```

**Via Online Tools:**
```
https://dnschecker.org/#CNAME/cms.compassdigital.nl
```
- Groene vinkjes = DNS is live!
- Rode kruisjes = Nog niet gepropageerd

**DNS Propagatie Tijd:**
- Lokaal/Regional: 5-10 minuten
- Wereldwijd: 0-48 uur (meestal binnen 1-2 uur)

---

## 📋 STAP 4: VERCEL VERIFICATIE

### In Vercel Dashboard:

1. **Ga terug naar Domains pagina:**
   ```
   https://vercel.com/compass-digital-50e6916c/compassdigital-cms/settings/domains
   ```

2. **Check Domain Status:**
   - ✅ **Valid Configuration** = DNS correct ingesteld!
   - ⏳ **Pending Verification** = Wacht op DNS propagatie
   - ❌ **Invalid Configuration** = DNS record klopt niet

3. **SSL Certificate:**
   - Vercel genereert automatisch een gratis SSL certificate
   - Dit gebeurt zodra DNS is geverifieerd
   - Status: "Provisioning SSL" → "Active"

---

## 📋 STAP 5: TEST JE DOMAIN

### Zodra Vercel "Active" toont:

```bash
# Test homepage:
curl -I https://cms.compassdigital.nl

# Verwachte output:
# HTTP/2 200
# x-vercel-id: ...
```

**In Browser:**
```
✅ https://cms.compassdigital.nl          → Homepage loads
✅ https://cms.compassdigital.nl/admin    → Admin login screen
✅ https://cms.compassdigital.nl/api/health → Health check
```

**Check SSL:**
- Klik op het slotje 🔒 in de browser
- Certificate should be issued by: "Let's Encrypt" of "Vercel"
- Valid and secure ✅

---

## 🚨 TROUBLESHOOTING

### ❌ "Domain Already in Use"

**Betekenis:** Domain is al gekoppeld aan een ander Vercel project

**Fix:**
1. Check of je een oud Vercel project hebt met deze domain
2. Ga naar: https://vercel.com/dashboard
3. Zoek oude projecten met `compassdigital` in de naam
4. Remove de domain daar
5. Probeer opnieuw

---

### ❌ "Invalid Configuration"

**Betekenis:** DNS record klopt niet

**Checks:**
```bash
# Check wat er nu ingesteld staat:
nslookup cms.compassdigital.nl

# Check CNAME:
dig cms.compassdigital.nl CNAME
```

**Mogelijke oorzaken:**
1. **CNAME waarde is verkeerd**
   - Moet zijn: `cname.vercel-dns.com` (of project-specific)
   - NIET: `compassdigital-cms.vercel.app`

2. **A record i.p.v. CNAME**
   - CNAME is vereist voor subdomains
   - Verwijder eventuele A records voor `cms`

3. **Cloudflare Proxy is aan**
   - Zet proxy UIT (grijze cloud)

4. **TTL te hoog**
   - Verlaag naar 3600 (1 uur) of lager
   - Oude cached DNS kan problemen geven

---

### ⏳ "Pending Verification" (Blijft hangen)

**Als DNS na 1 uur nog niet werkt:**

1. **Force DNS refresh in Vercel:**
   - Verwijder domain in Vercel
   - Wacht 5 minuten
   - Voeg domain opnieuw toe

2. **Flush je lokale DNS cache:**
   ```bash
   # macOS:
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

   # Windows:
   ipconfig /flushdns

   # Linux:
   sudo systemd-resolve --flush-caches
   ```

3. **Check DNS propagatie wereldwijd:**
   ```
   https://www.whatsmydns.net/#CNAME/cms.compassdigital.nl
   ```

---

### ❌ SSL Certificate Fails

**Als SSL niet wordt uitgegeven:**

1. **Check CAA records:**
   ```bash
   dig compassdigital.nl CAA
   ```
   - Als er CAA records zijn, moet Let's Encrypt toegestaan zijn
   - Voeg toe (in DNS): `0 issue "letsencrypt.org"`

2. **Check DNS is wereldwijd gepropageerd**
   - SSL kan niet worden uitgegeven als DNS nog niet overal live is

3. **Wacht 30 minuten**
   - SSL provisioning kan tot 30 min duren

---

## 🎯 VERCEL CLI METHODE (Alternatief)

**Als je Vercel CLI hebt geïnstalleerd:**

```bash
# Login
vercel login

# Link project
cd /Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app
vercel link

# Add domain
vercel domains add cms.compassdigital.nl

# Check domain status
vercel domains ls
```

**Output:**
```
Domain                    Created    Status
cms.compassdigital.nl    5m ago     Valid Configuration ✅
```

---

## 📊 VERWACHTE TIJDLIJN

**Optimistische Scenario:**
```
00:00  → Add domain in Vercel
00:01  → Add CNAME record in DNS
00:05  → DNS propagation (lokaal)
00:06  → Vercel verificatie succesvol
00:10  → SSL certificate uitgegeven
00:10  → ✅ Domain live!
```

**Realistische Scenario:**
```
00:00  → Add domain in Vercel
00:02  → Add CNAME record in DNS
00:30  → DNS propagation (regional)
00:35  → Vercel verificatie succesvol
01:00  → SSL certificate uitgegeven
01:00  → ✅ Domain live!
```

**Worst Case Scenario:**
```
00:00  → Add domain in Vercel
00:05  → Add CNAME record in DNS
12:00  → DNS propagation (global, high TTL)
12:30  → Vercel verificatie succesvol
13:00  → SSL certificate uitgegeven
13:00  → ✅ Domain live!
```

---

## ✅ CHECKLIST

**Setup:**
- [ ] Domain toegevoegd in Vercel (`cms.compassdigital.nl`)
- [ ] Vercel geeft CNAME instructies
- [ ] CNAME record toegevoegd in DNS provider:
  - Type: CNAME
  - Name: cms
  - Value: cname.vercel-dns.com
- [ ] (Cloudflare only) Proxy UIT (grijze cloud)

**Verificatie:**
- [ ] `nslookup cms.compassdigital.nl` → Shows CNAME
- [ ] Vercel domain status: "Valid Configuration"
- [ ] SSL status: "Active"
- [ ] `https://cms.compassdigital.nl` → Loads in browser
- [ ] Browser shows 🔒 (SSL secure)

**Na Custom Domain Setup:**
- [ ] Update `NEXT_PUBLIC_SERVER_URL` in Vercel env vars
- [ ] Update `PAYLOAD_PUBLIC_SERVER_URL` in Vercel env vars
- [ ] Trigger redeploy

---

## 🎯 VOLGENDE STAP NA DOMAIN SETUP

**Zodra domain live is, update environment variables:**

```
https://vercel.com/compass-digital-50e6916c/compassdigital-cms/settings/environment-variables
```

**Update deze 2 variables:**
```
NEXT_PUBLIC_SERVER_URL      → https://cms.compassdigital.nl
PAYLOAD_PUBLIC_SERVER_URL   → https://cms.compassdigital.nl
```

**Redeploy:**
```bash
git commit --allow-empty -m "Update domain to cms.compassdigital.nl"
git push
```

---

## 🚀 SAMENVATTING

**3 Eenvoudige Stappen:**
1. Add `cms.compassdigital.nl` in Vercel Domains
2. Add CNAME record in DNS provider (waar compassdigital.nl staat)
3. Wacht 5-60 min voor DNS propagatie

**Dan:**
- Vercel genereert automatisch SSL
- Domain wordt live op `https://cms.compassdigital.nl`
- Update environment variables
- Klaar! 🎉

---

**Last Updated:** February 12, 2026
