# Compass Digital CMS — Complete Provisioning Guide

> **Doel**: Dit document beschrijft het volledige proces van het opzetten van een nieuwe client-site tot en met oplevering. Het moet 100% automatisch kunnen draaien zonder menselijke tussenkomst.
>
> **Versie**: 1.0 — 12 maart 2026
> **Platform**: Payload CMS v3 + Next.js 15 op Ubuntu 22.04 (Railway PostgreSQL)

---

## Inhoudsopgave

1. [Architectuur Overzicht](#1-architectuur-overzicht)
2. [Fase 1: Infrastructuur Provisioning](#2-fase-1-infrastructuur-provisioning)
3. [Fase 2: Eerste Deploy & Schema](#3-fase-2-eerste-deploy--schema)
4. [Fase 3: Branding & Design Tokens](#4-fase-3-branding--design-tokens)
5. [Fase 4: Globals Configuratie](#5-fase-4-globals-configuratie)
6. [Fase 5: Content & Pagina's](#6-fase-5-content--paginas)
7. [Fase 6: Media & Afbeeldingen](#7-fase-6-media--afbeeldingen)
8. [Fase 7: Verificatie & QA](#8-fase-7-verificatie--qa)
9. [Block Referentie & API Payloads](#9-block-referentie--api-payloads)
10. [Learnings & Feedback Regels](#10-learnings--feedback-regels)
11. [Troubleshooting](#11-troubleshooting)
12. [Bijlagen](#12-bijlagen)

---

## 1. Architectuur Overzicht

### Multi-Tenant Setup

Elke client draait als **onafhankelijke instantie** van dezelfde codebase:

```
/home/ploi/cms.compassdigital.nl/          ← Platform/bron repo
/home/ploi/<site>.compassdigital.nl/        ← Client instantie (git checkout)
```

| Component | Technologie |
|-----------|-------------|
| CMS | Payload CMS v3 |
| Frontend | Next.js 15 (App Router) |
| Database | PostgreSQL (Railway) |
| Process Manager | PM2 |
| Reverse Proxy | Nginx (via Ploi) |
| Search | Meilisearch |

### Poort Toewijzing

Elke site krijgt een unieke poort (4000-4999):

| Poort | Beschikbaar |
|-------|-------------|
| 4000 | cms.compassdigital.nl (platform) |
| 4001-4008 | Bezet door bestaande sites |
| 4009+ | Beschikbaar voor nieuwe sites |

---

## 2. Fase 1: Infrastructuur Provisioning

### Stap 1.1: Database aanmaken

**Railway PostgreSQL** — maak een nieuwe database aan:

```
Database naam: client_<sitenaam>
Host: shinkansen.proxy.rlwy.net:29352
User: postgres
```

> **Let op**: Geen `psql`/`pg_dump` beschikbaar op de server. Gebruik `node -e` met `pg` module of de backup-scripts.

### Stap 1.2: Site directory aanmaken

```bash
# Clone de codebase
cd /home/ploi
git clone <repo-url> <sitenaam>.compassdigital.nl
cd <sitenaam>.compassdigital.nl
git checkout main
```

### Stap 1.3: Environment variabelen (.env)

Maak `.env` aan met **alle** variabelen. **NOOIT** waarden kopieren van een bestaande client-site.

```env
# === CORE ===
NODE_ENV=production
PORT=<volgende_vrije_poort>
PAYLOAD_SECRET=<openssl rand -hex 32>
DATABASE_URL=postgresql://postgres:<wachtwoord>@shinkansen.proxy.rlwy.net:29352/client_<sitenaam>
NEXT_TELEMETRY_DISABLED=1

# === CLIENT IDENTITEIT ===
CLIENT_ID=<sitenaam>01
NEXT_PUBLIC_CLIENT_ID=<sitenaam>01
CLIENT_NAME=<Weergavenaam>
SITE_NAME=<Volledige sitenaam>
NEXT_PUBLIC_SERVER_URL=https://<sitenaam>.compassdigital.nl
PRIMARY_COLOR=<hex_kleur>
TEMPLATE_ID=<template_type>  # corporate, ecommerce, etc.
SHOP_MODEL=b2c               # b2c of b2b

# === FEATURE TOGGLES ===
# Zet op true/false per client. Standaard = false tenzij specifiek nodig.
ECOMMERCE_ENABLED=false
ENABLE_SHOP=false
ENABLE_CART=false
ENABLE_CHECKOUT=false
ENABLE_MINI_CART=false
ENABLE_AUTHENTICATION=true
ENABLE_MY_ACCOUNT=true
ENABLE_BLOG=true
ENABLE_FAQ=true
ENABLE_NEWSLETTER=true
ENABLE_SEARCH=true
ENABLE_TESTIMONIALS=true

# Branch-specifieke features
ENABLE_CONSTRUCTION=false
ENABLE_BEAUTY=false
ENABLE_HORECA=false
ENABLE_HOSPITALITY=false
ENABLE_EXPERIENCES=false
ENABLE_TOURISM=false
ENABLE_PROFESSIONAL_SERVICES=false
ENABLE_REAL_ESTATE=false
ENABLE_PLATFORM=false

# E-commerce features (alleen als ENABLE_SHOP=true)
ENABLE_BRANDS=false
ENABLE_WISHLISTS=false
ENABLE_COMPARE_PRODUCTS=false
ENABLE_PRODUCT_REVIEWS=false
ENABLE_QUICK_ORDER=false
ENABLE_VOLUME_PRICING=false
ENABLE_GROUP_PRICING=false
ENABLE_BUNDLE_PRODUCTS=false
ENABLE_VARIABLE_PRODUCTS=false
ENABLE_CONFIGURATOR=false
ENABLE_SUBSCRIPTIONS=false
ENABLE_RECURRING_ORDERS=false
ENABLE_GIFT_VOUCHERS=false
ENABLE_LOYALTY=false
ENABLE_DISCOUNTS=false
ENABLE_INVOICES=false
ENABLE_RETURNS=false
ENABLE_ORDER_TRACKING=false
ENABLE_ORDER_LISTS=false
ENABLE_GUEST_CHECKOUT=false
ENABLE_FREE_SHIPPING_BAR=false
ENABLE_BARCODE_SCANNER=false
ENABLE_VENDORS=false
ENABLE_LICENSES=false

# B2B features (alleen als ENABLE_B2B=true)
ENABLE_B2B=false
ENABLE_CUSTOMER_GROUPS=false
ENABLE_ADDRESSES=false

# Content features
ENABLE_AI_CONTENT=false
ENABLE_CHATBOT=false
ENABLE_CASES=false
ENABLE_PARTNERS=false
ENABLE_SERVICES=false
ENABLE_MAGAZINES=false
ENABLE_SUBSCRIPTION_PAGES=false

# Marketing
ENABLE_EMAIL_MARKETING=false
ENABLE_EMAIL_CAMPAIGNS=false
ENABLE_EMAIL_AUTOMATION=false
ENABLE_EMAIL_FLOWS=false
ENABLE_EMAIL_GRAPES_EDITOR=false
ENABLE_PUSH_NOTIFICATIONS=false
ENABLE_PERSONALIZATION=false

# === API KEYS (optioneel) ===
OPENAI_API_KEY=
GROQ_API_KEY=

# === MEILISEARCH (optioneel) ===
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_MASTER_KEY=<key>
NEXT_PUBLIC_MEILISEARCH_KEY=<search_key>
MEILISEARCH_PRODUCTS_INDEX=<sitenaam>_products
MEILISEARCH_BLOG_INDEX=<sitenaam>_blog
MEILISEARCH_PAGES_INDEX=<sitenaam>_pages

# === PWA/PUSH (optioneel) ===
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:info@<sitenaam>.nl
```

### Stap 1.4: Deploy script aanmaken

```bash
cat > /home/ploi/<sitenaam>.compassdigital.nl/deploy-ploi.sh << 'EOF'
#!/bin/bash
SITE_DIR="/home/ploi/<sitenaam>.compassdigital.nl"
DB_NAME="client_<sitenaam>"
PM2_NAME="<sitenaam>-cms"
bash /home/ploi/scripts/safe-deploy.sh "$SITE_DIR" "$DB_NAME" "$PM2_NAME"
EOF
chmod +x /home/ploi/<sitenaam>.compassdigital.nl/deploy-ploi.sh
```

### Stap 1.5: Registratie in deploy-all.sh

Voeg toe aan `/home/ploi/scripts/deploy-all.sh` SITES array:
```bash
"/home/ploi/<sitenaam>.compassdigital.nl client_<sitenaam> <sitenaam>-cms"
```

### Stap 1.6: Registratie in backup-all.sh

Voeg toe aan `/home/ploi/scripts/backup-all.sh` DATABASES array:
```bash
client_<sitenaam>
```

### Stap 1.7: Nginx configuratie

Via Ploi panel of handmatig:
```
/etc/nginx/ploi/<sitenaam>.compassdigital.nl/server/
```

Proxy naar `localhost:<poort>`.

---

## 3. Fase 2: Eerste Deploy & Schema

### Stap 2.1: Eerste deploy uitvoeren

```bash
bash /home/ploi/<sitenaam>.compassdigital.nl/deploy-ploi.sh
```

**Dit doet automatisch:**
1. Pre-deploy backup (skip bij lege DB)
2. Migration safety check (exit code 2 = fresh = OK)
3. `git pull origin main`
4. `npm install --legacy-peer-deps`
5. ImportMap regeneratie
6. `NODE_OPTIONS="--max-old-space-size=4096" npm run build`
   - `db.push: true` synct schema automatisch tijdens build
7. PM2 start op opgegeven poort

### Stap 2.2: Eerste admin-gebruiker aanmaken

```bash
# Via first-register endpoint (alleen beschikbaar als er nog geen users zijn)
node -e "
const http = require('http');
const data = JSON.stringify({
  email: 'admin@<sitenaam>.nl',
  password: '<sterk_wachtwoord>',
  firstName: 'Admin',
  lastName: '<Sitenaam>'
});
const req = http.request({
  hostname: 'localhost', port: <poort>,
  path: '/api/users/first-register/',
  method: 'POST',
  headers: {'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}
}, res => {
  let b=''; res.on('data',c=>b+=c);
  res.on('end', ()=>console.log(JSON.parse(b).token ? 'OK' : b));
});
req.write(data); req.end();
"
```

### Stap 2.3: Login & token opslaan

```bash
# BELANGRIJK: Gebruik ALTIJD Node.js http module, NOOIT curl met speciale tekens
# Curl verliest de body bij redirects (308) en bash interpreteert ! in wachtwoorden
node -e "
const http = require('http');
const data = JSON.stringify({email:'admin@<sitenaam>.nl',password:'<wachtwoord>'});
const req = http.request({
  hostname:'localhost', port:<poort>,
  path:'/api/users/login/',
  method:'POST',
  headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}
}, res => {
  let b=''; res.on('data',c=>b+=c);
  res.on('end',() => {
    const d=JSON.parse(b);
    if(d.token) {
      require('fs').writeFileSync('/tmp/<sitenaam>_token.txt', d.token);
      console.log('TOKEN OK');
    } else console.log('FOUT:', b);
  });
});
req.write(data); req.end();
"
```

> **KRITIEK**: Gebruik NOOIT `curl` voor login. De 308-redirect bij `/api/users/login` (zonder slash) verliest de request body. Wachtwoorden met `!` worden door bash geinterpreteerd als history expansion. Gebruik ALTIJD `node -e` met `http.request()`.

---

## 4. Fase 3: Branding & Design Tokens

### API Helper Functie

Alle API calls gebruiken dezelfde helper:

```bash
# Sla op als /tmp/api_helper.js voor hergebruik
cat > /tmp/api_helper.js << 'JSEOF'
const http = require('http');
const fs = require('fs');

function apiCall(port, method, path, data) {
  return new Promise((resolve, reject) => {
    const token = fs.readFileSync('/tmp/<sitenaam>_token.txt', 'utf8').trim();
    const body = data ? JSON.stringify(data) : null;
    const opts = {
      hostname: 'localhost', port,
      path: path.endsWith('/') ? path : path + '/',
      method,
      headers: {
        'Authorization': 'JWT ' + token,
        'Content-Type': 'application/json',
        ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
      }
    };
    const req = http.request(opts, res => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => {
        try { resolve(JSON.parse(b)); }
        catch(e) { reject(new Error(b)); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

module.exports = { apiCall };
JSEOF
```

### Stap 3.1: Theme configureren

```bash
node -e "
const {apiCall} = require('/tmp/api_helper.js');

// BELANGRIJK: Gebruik NOOIT kleurwaarden van een bestaande client!
// Elke site heeft een UNIEKE kleuridentiteit.
const theme = {
  // Merk kleuren
  primaryColor: '#<UNIEK_PER_CLIENT>',
  primaryLight: '#<LICHTER>',
  primaryGlow: 'rgba(<r>,<g>,<b>,0.12)',
  secondaryColor: '#<UNIEK>',
  secondaryLight: '#<LICHTER>',
  accentColor: '#<UNIEK>',

  // Achtergrond & tekst
  backgroundColor: '#F5F7FA',
  surfaceColor: '#ffffff',
  borderColor: '#E8ECF1',
  greyLight: '#F1F4F8',
  greyMid: '#94A3B8',
  greyDark: '#64748B',
  textPrimary: '#0A1628',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',

  // Status kleuren (standaard, hoeft niet per client)
  successColor: '#00C853',
  warningColor: '#F59E0B',
  errorColor: '#EF4444',
  infoColor: '#00897B',

  // Typografie
  headingFont: 'Inter, system-ui, sans-serif',
  bodyFont: 'Inter, system-ui, sans-serif',
  heroSize: 42,
  sectionSize: 28,
  cardTitleSize: 18,
  bodyLgSize: 15,
  bodySize: 13,

  // Knoppen
  btnBorderRadius: '10px',
  btnFontWeight: 700,
  btnPrimaryBg: '#<ZELFDE_ALS_PRIMARY>',
  btnPrimaryText: '#ffffff',
  btnPrimaryHoverBg: '#<DONKERDER>',
  btnSecondaryBg: '#<ZELFDE_ALS_SECONDARY>',
  btnSecondaryText: '#ffffff',

  // Visueel
  containerWidth: '7xl',
  enableAnimations: true,
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,

  // Gradienten
  primaryGradient: 'linear-gradient(135deg, #<PRIMARY> 0%, #<PRIMARY_LIGHT> 100%)',
  secondaryGradient: 'linear-gradient(135deg, #<SECONDARY> 0%, #<SECONDARY_LIGHT> 100%)'
};

apiCall(<PORT>, 'PATCH', '/api/globals/theme', theme)
  .then(r => console.log('Theme:', r.primaryColor ? 'OK' : JSON.stringify(r).slice(0,200)));
"
```

---

## 5. Fase 4: Globals Configuratie

### Stap 4.1: Settings

```bash
node -e "
const {apiCall} = require('/tmp/api_helper.js');

apiCall(<PORT>, 'PATCH', '/api/globals/settings', {
  // Bedrijfsgegevens (VERPLICHT)
  companyName: '<Bedrijfsnaam>',           // REQUIRED
  tagline: '<Slogan>',
  description: '<Korte beschrijving>',

  // Contact (VERPLICHT)
  email: '<email>',                         // REQUIRED
  phone: '<telefoonnummer>',                // REQUIRED
  whatsapp: '<whatsapp_nummer>',

  // Adres
  address: {
    street: '<Straat + Huisnummer>',
    postalCode: '<Postcode>',
    city: '<Plaats>',
    country: 'Nederland',
    showOnSite: true
  },

  // Templates (defaults zijn prima, pas aan indien nodig)
  defaultHeaderTemplate: 'headertemplate1',

  // SEO
  defaultMetaDescription: '<Meta beschrijving (max 160 tekens)>',
  sitemapEnabled: true,
  enableJSONLD: true,
  enableAutoOGImages: true
}).then(r => console.log('Settings:', r.companyName ? 'OK' : r));
"
```

### Stap 4.2: Header

```bash
node -e "
const {apiCall} = require('/tmp/api_helper.js');

apiCall(<PORT>, 'PATCH', '/api/globals/header', {
  // Topbar
  topbarEnabled: true,
  topbarBgColor: '#<SECONDARY_COLOR>',
  topbarTextColor: '#ffffff',
  topbarMessages: [
    { text: '<USP 1>', icon: 'check' },
    { text: '<USP 2>', icon: 'shield' }
  ],
  topbarRightLinks: [
    { label: 'Contact', link: '/contact' }
  ],

  // Logo
  logoHeight: 32,
  logoUrl: '/',
  siteName: '<Sitenaam>',

  // Navigatie
  navigationEnabled: true,
  navigationMode: 'manual',
  manualNavItems: [
    {
      label: 'Home',
      type: 'external',
      url: '/'
    },
    {
      label: '<Menu Item>',
      type: 'mega',
      megaColumns: [
        {
          title: '<Kolom Titel>',
          links: [
            { label: '<Link>', url: '/<slug>', description: '<Beschrijving>' }
          ]
        }
      ]
    },
    {
      label: 'Contact',
      type: 'external',
      url: '/contact'
    }
  ],

  // CTA knop
  ctaButton: {
    enabled: true,
    text: '<CTA Tekst>',
    link: '/contact',
    style: 'primary'
  },

  // Zoeken
  searchEnabled: true,
  searchPlaceholder: 'Zoeken...',

  // Header acties
  // KRITIEK: showCartButton MOET false zijn als ENABLE_CHECKOUT=false
  // De nullish coalescing (?? true) in de code veroorzaakt anders een bug
  showPhoneButton: true,
  showCartButton: false,    // <-- ALLEEN true als ENABLE_CHECKOUT=true
  showAccountButton: true,
  showWishlistButton: false,

  // Sticky header
  stickyHeader: true,
  stickyBehavior: 'always'
}).then(r => console.log('Header:', r.navigationEnabled !== undefined ? 'OK' : r));
"
```

> **KRITIEK BUG**: `showCartButton` moet EXPLICIET op `false` staan als de checkout is uitgeschakeld. De code heeft `showCart: header.showCartButton ?? true` — als het veld niet bestaat (omdat ENABLE_CHECKOUT=false het veld verwijdert), wordt het `undefined`, en `undefined ?? true` = `true`. Dit toont een mini-cart icoon terwijl er geen shop actief is.

### Stap 4.3: Footer

```bash
node -e "
const {apiCall} = require('/tmp/api_helper.js');

apiCall(<PORT>, 'PATCH', '/api/globals/footer', {
  // Branding
  logoType: 'text',
  logoText: '<Sitenaam>',
  logoAccent: '',
  tagline: '<Footer tagline>',
  socialLinks: [
    { platform: 'linkedin', url: 'https://linkedin.com/company/<naam>' },
    { platform: 'instagram', url: 'https://instagram.com/<naam>' }
  ],

  // Navigatie kolommen (max 3)
  columns: [
    {
      heading: '<Kolom 1 Titel>',
      links: [
        { label: '<Link>', type: 'external', externalUrl: '/<slug>' }
      ]
    },
    {
      heading: '<Kolom 2 Titel>',
      links: [
        { label: '<Link>', type: 'external', externalUrl: '/<slug>' }
      ]
    }
  ],

  // Contact
  showContactColumn: true,
  contactHeading: 'Contact',
  phone: '<telefoonnummer>',
  email: '<email>',
  address: '<Straat, Plaats>',
  openingHours: 'Ma-Vr: 09:00 - 17:00',

  // Trust badges
  trustBadges: [
    { icon: 'shield-check', text: '<Trust tekst 1>' },
    { icon: 'check', text: '<Trust tekst 2>' },
    { icon: 'star', text: '<Trust tekst 3>' }
  ],

  // Copyright
  copyrightText: '\u00a9 2026 <Bedrijfsnaam> \u2014 Alle rechten voorbehouden',
  legalLinks: [
    { label: 'Privacybeleid', type: 'external', externalUrl: '/privacy' },
    { label: 'Algemene Voorwaarden', type: 'external', externalUrl: '/voorwaarden' }
  ]
}).then(r => console.log('Footer:', r.logoText ? 'OK' : r));
"
```

> **KRITIEK**: De footer-component was 100% hardcoded met Plastimed-content. Dit is gerepareerd — het component haalt nu data op via `getPayload()` uit de Footer + Settings globals. Maar dit betekent dat de footer LEEG is als de globals niet geconfigureerd zijn. Configureer de footer ALTIJD als onderdeel van provisioning.

---

## 6. Fase 5: Content & Pagina's

### Stap 5.1: Media uploaden

```bash
# Download stock foto's van Unsplash (licentievrij)
# Upload naar Payload media collection

upload_image() {
  local FILE=$1
  local ALT=$2
  local TOKEN=$(cat /tmp/<sitenaam>_token.txt)

  node -e "
  const http = require('http');
  const fs = require('fs');
  const path = require('path');

  const filePath = '$FILE';
  const fileName = path.basename(filePath);
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const fileContent = fs.readFileSync(filePath);

  let body = '';
  body += '--' + boundary + '\r\n';
  body += 'Content-Disposition: form-data; name=\"alt\"\r\n\r\n$ALT\r\n';
  body += '--' + boundary + '\r\n';
  body += 'Content-Disposition: form-data; name=\"file\"; filename=\"' + fileName + '\"\r\n';
  body += 'Content-Type: image/jpeg\r\n\r\n';

  const bodyStart = Buffer.from(body, 'utf8');
  const bodyEnd = Buffer.from('\r\n--' + boundary + '--\r\n', 'utf8');
  const fullBody = Buffer.concat([bodyStart, fileContent, bodyEnd]);

  const req = http.request({
    hostname: 'localhost', port: <PORT>,
    path: '/api/media/',
    method: 'POST',
    headers: {
      'Authorization': 'JWT $TOKEN',
      'Content-Type': 'multipart/form-data; boundary=' + boundary,
      'Content-Length': fullBody.length
    }
  }, res => {
    let b = ''; res.on('data', c => b += c);
    res.on('end', () => {
      const d = JSON.parse(b);
      console.log('Media ID:', d.doc?.id || 'FOUT: ' + b.slice(0,200));
    });
  });
  req.write(fullBody);
  req.end();
  "
}

# Voorbeeld: download en upload hero images
curl -sL "https://images.unsplash.com/photo-<ID>?w=1920&q=80" -o /tmp/hero.jpg
upload_image /tmp/hero.jpg "Hero afbeelding"
```

### Stap 5.2: Homepage aanmaken

```bash
node -e "
const {apiCall} = require('/tmp/api_helper.js');

apiCall(<PORT>, 'POST', '/api/pages', {
  title: '<Sitenaam> - <Tagline>',
  slug: 'home',
  _status: 'published',
  layout: [
    // Block 1: Hero
    {
      blockType: 'hero',
      title: '<Hoofdtitel>',
      subtitle: '<Ondertitel>',
      description: {
        root: {
          type: 'root', format: '', indent: 0, version: 1,
          children: [{
            type: 'paragraph', version: 1,
            children: [{ text: '<Hero beschrijving>', type: 'text', version: 1 }]
          }],
          direction: 'ltr'
        }
      },
      heroImage: <MEDIA_ID>,
      variant: 'split',
      backgroundStyle: 'gradient',
      buttons: [
        { label: '<Primaire CTA>', link: '/contact', style: 'primary' },
        { label: '<Secundaire CTA>', link: '/over-ons', style: 'secondary' }
      ],
      enableAnimation: true, animationType: 'fade-up', animationDuration: 'normal', animationDelay: 0
    },

    // Block 2: Features/USPs
    {
      blockType: 'features',
      title: '<Features titel>',
      subtitle: '<Features ondertitel>',
      layout: 'grid-3',
      iconStyle: 'glow',
      features: [
        { icon: 'zap', title: '<Feature 1>', description: '<Beschrijving>' },
        { icon: 'shield', title: '<Feature 2>', description: '<Beschrijving>' },
        { icon: 'bar-chart', title: '<Feature 3>', description: '<Beschrijving>' }
      ],
      enableAnimation: true, animationType: 'fade-up', animationDuration: 'normal', animationDelay: 0
    },

    // Block 3: Stats
    {
      blockType: 'stats',
      columns: '4',
      variant: 'cards',
      backgroundColor: 'white',
      stats: [
        { value: '<N>', suffix: '+', label: '<Label>', icon: 'users' },
        { value: '<N>', suffix: '%', label: '<Label>', icon: 'trending-up' },
        { value: '<N>', suffix: '+', label: '<Label>', icon: 'star' },
        { value: '<N>', label: '<Label>', icon: 'award' }
      ],
      enableAnimation: true, animationType: 'fade-up', animationDuration: 'normal', animationDelay: 0
    },

    // Block 4: CTA
    {
      blockType: 'cta',
      title: '<CTA titel>',
      description: '<CTA beschrijving als PLAIN TEXT>',
      variant: 'centered',
      backgroundStyle: 'gradient',
      size: 'large',
      buttons: [
        { label: '<CTA knop>', link: '/contact', style: 'primary' }
      ],
      enableAnimation: true, animationType: 'fade-up', animationDuration: 'normal', animationDelay: 0
    }
  ]
}).then(r => console.log('Homepage:', r.doc?.id ? 'OK (id=' + r.doc.id + ')' : r));
"
```

> **KRITIEK**: CTA `description` veld is `type: 'textarea'` (plain text), GEEN rich text. Stuur NOOIT een Lexical JSON object naar dit veld. Dit resulteert in `{"root":{"type":"root"...}}` als zichtbare tekst op de frontend.

### Stap 5.3: Branche Landing Pages

Elke branche-pagina volgt dezelfde optimale block-structuur:

```
1. hero          — Branch-specifieke hero met split layout + stock foto
2. painPoints    — "Herkenbaar?" emotionele connectie (4 pijnpunten)
3. features      — USPs/voordelen voor deze branche (6 items, grid-3)
4. stats         — Sociale bewijskracht (4 statistieken)
5. processSteps  — "Hoe het werkt" (3-4 stappen)
6. branchePricing — Prijsplannen met competitor vergelijking
7. testimonials  — Branche-specifieke reviews (3 stuks)
8. competitorComparison — Feature vergelijking met concurrenten
9. faq           — Veelgestelde vragen (5-8 items)
10. cta          — Afsluitende call-to-action
```

**Optionele extra blocks voor visuele impact:**
```
- caseStudyGrid    — Na processSteps, voor pricing (project showcases)
- imageGallery     — Na testimonials (visuele voorbeelden)
- twoColumnImagePair — Voor/na vergelijkingen
- socialProofBanner — Boven pricing
- trustSignals     — Onder hero of boven CTA
- logoBar          — Klant-logo's boven testimonials
- calculator       — Als alternatief voor/naast pricing
```

### Block API Payload Templates

Zie [Sectie 9](#9-block-referentie--api-payloads) voor complete API payloads per blocktype.

---

## 7. Fase 6: Media & Afbeeldingen

### Stock Foto Strategie

Elke pagina heeft minimaal 1 hero-afbeelding nodig. Gebruik **Unsplash** voor licentievrije stock foto's.

**Per branche:**
| Branche | Zoektermen | Formaat |
|---------|-----------|---------|
| E-commerce | ecommerce, online shopping, webshop | 1920x1281 |
| Bouw | construction, building, architecture | 1920x1281 |
| Beauty | beauty salon, wellness, spa | 1920x1281 |
| Horeca | restaurant, cafe, food service | 1920x1281 |
| Zorg | healthcare, medical, doctor | 1920x1281 |
| Dienstverlening | business, consulting, office | 1920x1281 |
| B2B | warehouse, wholesale, business | 1920x1281 |
| Publishing | newspaper, magazine, content | 1920x1281 |

**Download en upload:**
```bash
# Download
curl -sL "https://images.unsplash.com/photo-<ID>?w=1920&q=80" -o /tmp/<branche>.jpg

# Upload (gebruik de upload_image functie uit Stap 5.1)
upload_image /tmp/<branche>.jpg "<Branche naam>"
```

---

## 8. Fase 7: Verificatie & QA

### Checklist

Na provisioning, verifieer elk punt:

```bash
node -e "
const {apiCall} = require('/tmp/api_helper.js');
const PORT = <PORT>;
const checks = [];

async function run() {
  // 1. Settings
  const settings = await apiCall(PORT, 'GET', '/api/globals/settings');
  checks.push(['Settings companyName', !!settings.companyName]);
  checks.push(['Settings email', !!settings.email]);
  checks.push(['Settings phone', !!settings.phone]);

  // 2. Theme
  const theme = await apiCall(PORT, 'GET', '/api/globals/theme');
  checks.push(['Theme primaryColor', !!theme.primaryColor && theme.primaryColor !== '#00897B']); // Niet de default!
  checks.push(['Theme animations', theme.enableAnimations === true]);

  // 3. Header
  const header = await apiCall(PORT, 'GET', '/api/globals/header');
  checks.push(['Header navigation', header.navigationEnabled !== false]);
  checks.push(['Header cart hidden', header.showCartButton !== true || process.env.ENABLE_CHECKOUT === 'true']);

  // 4. Footer
  const footer = await apiCall(PORT, 'GET', '/api/globals/footer');
  checks.push(['Footer logoText', !!footer.logoText]);
  checks.push(['Footer columns', (footer.columns || []).length > 0]);
  checks.push(['Footer contact', !!footer.phone || !!footer.email]);

  // 5. Pages
  const pages = await apiCall(PORT, 'GET', '/api/pages?limit=50');
  checks.push(['Homepage exists', pages.docs.some(p => p.slug === 'home')]);
  checks.push(['Pages have blocks', pages.docs.every(p => (p.layout || []).length > 0)]);

  // 6. No client bleed-through
  const allText = JSON.stringify(settings) + JSON.stringify(footer) + JSON.stringify(header);
  const otherClients = ['plastimed', 'aboland', 'beauty01', 'construction01'];
  otherClients.forEach(client => {
    checks.push(['No ' + client + ' references', !allText.toLowerCase().includes(client)]);
  });

  // 7. Media
  const media = await apiCall(PORT, 'GET', '/api/media?limit=50');
  checks.push(['Media uploaded', media.totalDocs > 0]);

  // Print results
  console.log('\\n=== PROVISIONING VERIFICATIE ===');
  let passed = 0, failed = 0;
  checks.forEach(([name, ok]) => {
    console.log((ok ? 'PASS' : 'FAIL') + ' | ' + name);
    ok ? passed++ : failed++;
  });
  console.log('\\nResultaat: ' + passed + '/' + (passed+failed) + ' checks geslaagd');
  if (failed > 0) console.log('LET OP: ' + failed + ' checks gefaald!');
}

run().catch(e => console.error('Verificatie fout:', e));
"
```

### Visuele Check

Open de site in de browser en verifieer:

1. **Header**: Logo/sitenaam zichtbaar, navigatie werkt, geen cart-icoon (tenzij shop)
2. **Homepage**: Hero met afbeelding, blocks laden correct, animaties actief
3. **Footer**: Juiste bedrijfsnaam, contact info, social links
4. **Branding**: Kleuren matchen de theme configuratie
5. **Mobile**: Responsive, hamburger menu werkt
6. **SEO**: Meta tags in page source, JSON-LD aanwezig

---

## 9. Block Referentie & API Payloads

### Beschikbare Block Types

#### hero
```json
{
  "blockType": "hero",
  "title": "Titel (required)",
  "subtitle": "Ondertitel",
  "description": { "root": { "type": "root", "format": "", "indent": 0, "version": 1, "children": [{ "type": "paragraph", "version": 1, "children": [{ "text": "Tekst", "type": "text", "version": 1 }] }], "direction": "ltr" } },
  "heroImage": "<media_id (integer)>",
  "variant": "default | split | centered",
  "backgroundStyle": "gradient | image | solid",
  "backgroundColor": "navy | white | grey",
  "buttons": [
    { "label": "Knoptekst", "link": "/url", "style": "primary | secondary | ghost" }
  ],
  "enableAnimation": true,
  "animationType": "fade-up | fade-in | fade-left | fade-right | scale-in",
  "animationDuration": "fast | normal | slow",
  "animationDelay": 0
}
```

#### painPoints
```json
{
  "blockType": "painPoints",
  "title": "Titel",
  "subtitle": "Ondertitel",
  "bgColor": "light-grey | white | red-tint",
  "columns": "2 | 3 | 4",
  "painPoints": [
    {
      "icon": "alert-triangle | clock | frown | trending-down | phone-missed | users | ban | help-circle | thumbs-down | repeat",
      "title": "Pijnpunt titel",
      "description": "Beschrijving"
    }
  ]
}
```

#### features
```json
{
  "blockType": "features",
  "title": "Titel",
  "subtitle": "Ondertitel",
  "layout": "grid-3 | grid-4 | list | split",
  "iconStyle": "glow | solid | outlined",
  "splitImage": "<media_id> (alleen bij layout=split)",
  "features": [
    {
      "icon": "<lucide icon naam>",
      "title": "Feature titel",
      "description": "Beschrijving",
      "link": "/optionele-link"
    }
  ]
}
```

#### stats
```json
{
  "blockType": "stats",
  "title": "Optionele titel",
  "columns": "2 | 3 | 4",
  "variant": "inline | cards | large",
  "backgroundColor": "white | navy | teal | grey | teal-gradient | navy-gradient",
  "stats": [
    {
      "icon": "<lucide icon naam>",
      "value": "500",
      "suffix": "+",
      "label": "Label",
      "description": "Optionele beschrijving"
    }
  ]
}
```

#### processSteps
```json
{
  "blockType": "processSteps",
  "title": "Titel",
  "subtitle": "Ondertitel",
  "backgroundColor": "light-grey | white",
  "steps": [
    {
      "icon": "search | settings | check-circle | zap | rocket | target | bar-chart | lightbulb | palette | smartphone",
      "title": "Stap titel",
      "description": "Beschrijving"
    }
  ]
}
```

#### branchePricing
```json
{
  "blockType": "branchePricing",
  "title": "Titel",
  "subtitle": "Ondertitel",
  "ctaText": "CTA tekst onder pricing",
  "bgColor": "white | light-grey | gradient",
  "plans": [
    {
      "name": "Plan naam",
      "price": "499",
      "period": "/maand",
      "description": "Korte beschrijving",
      "features": [
        { "text": "Feature tekst", "included": true },
        { "text": "Niet beschikbaar", "included": false }
      ],
      "buttonLabel": "Knop tekst",
      "buttonLink": "/contact",
      "featured": false,
      "badge": "Populair"
    }
  ],
  "competitorComparison": {
    "enabled": true,
    "text": "Vergelijkingstekst"
  }
}
```

#### testimonials
```json
{
  "blockType": "testimonials",
  "title": "Titel",
  "subtitle": "Ondertitel",
  "variant": "grid | featured | carousel",
  "columns": "2 | 3",
  "testimonials": [
    {
      "quote": "Testimonial tekst",
      "author": "Naam",
      "role": "Functie",
      "company": "Bedrijf",
      "avatar": "<media_id> (optioneel)",
      "rating": 5
    }
  ]
}
```

#### competitorComparison
```json
{
  "blockType": "competitorComparison",
  "title": "Titel",
  "subtitle": "Ondertitel",
  "highlightColumn": true,
  "bgColor": "white | light-grey",
  "competitors": [
    { "name": "Concurrent 1" },
    { "name": "Concurrent 2" }
  ],
  "features": [
    {
      "name": "Feature naam",
      "ourValue": "check | cross | text | partial",
      "ourCustomValue": "Custom tekst (als ourValue=text)",
      "competitorValues": [
        { "value": "check | cross | text | partial", "customValue": "" }
      ]
    }
  ]
}
```

#### faq
```json
{
  "blockType": "faq",
  "title": "Titel",
  "subtitle": "Ondertitel",
  "variant": "simple | single-column | bordered | colored",
  "items": [
    {
      "question": "Vraag",
      "answer": { "root": { "type": "root", "format": "", "indent": 0, "version": 1, "children": [{ "type": "paragraph", "version": 1, "children": [{ "text": "Antwoord", "type": "text", "version": 1 }] }], "direction": "ltr" } }
    }
  ]
}
```

#### cta
```json
{
  "blockType": "cta",
  "title": "Titel (required)",
  "description": "PLAIN TEXT - GEEN rich text/JSON!",
  "badge": "Optionele badge tekst",
  "variant": "centered | split | banner | full-width",
  "backgroundStyle": "gradient | solid | image",
  "size": "small | medium | large",
  "alignment": "center | left",
  "buttons": [
    { "label": "Knoptekst", "link": "/url", "style": "primary | secondary | ghost" }
  ],
  "trustElements": {
    "showTrustElements": false,
    "items": []
  }
}
```

#### caseStudyGrid
```json
{
  "blockType": "caseStudyGrid",
  "title": "Titel",
  "subtitle": "Ondertitel",
  "layout": "grid | featured",
  "cases": [
    {
      "title": "Project titel",
      "client": "Klant naam",
      "description": "Beschrijving",
      "image": "<media_id>",
      "results": [
        { "metric": "Omzet", "value": "+45%" }
      ],
      "link": "/optionele-link"
    }
  ]
}
```

#### imageGallery
```json
{
  "blockType": "imageGallery",
  "title": "Titel",
  "description": "Beschrijving",
  "layout": "grid | featured-grid | masonry",
  "columns": "2 | 3 | 4",
  "aspectRatio": "16:9 | 4:3 | 1:1 | auto",
  "enableLightbox": true,
  "gap": "small | normal | large",
  "images": [
    { "image": "<media_id>", "caption": "Beschrijving" }
  ]
}
```

#### socialProofBanner
```json
{
  "blockType": "socialProofBanner",
  "variant": "dark | light | gradient",
  "trustText": "Vertrouwd door 500+ bedrijven",
  "metrics": [
    { "value": "500+", "label": "Klanten" },
    { "value": "98%", "label": "Tevredenheid" }
  ]
}
```

#### trustSignals
```json
{
  "blockType": "trustSignals",
  "variant": "horizontal | cards",
  "bgColor": "white | grey | navy",
  "items": [
    { "icon": "shield-check", "title": "Veilig", "description": "SSL beveiligd" }
  ]
}
```

#### logoBar
```json
{
  "blockType": "logoBar",
  "title": "Optionele titel",
  "context": "customers | certifications | partners",
  "variant": "static | scroll",
  "grayscale": true,
  "logos": [
    { "logo": "<media_id>", "name": "Bedrijf", "link": "https://..." }
  ]
}
```

#### calculator
```json
{
  "blockType": "calculator",
  "title": "Titel",
  "subtitle": "Ondertitel",
  "ourMonthlyPrice": 499,
  "ctaLabel": "Knoptekst",
  "ctaLink": "/contact",
  "bgColor": "white | light-grey | gradient",
  "sliders": [
    {
      "label": "Slider naam",
      "min": 0,
      "max": 100,
      "defaultValue": 50,
      "step": 1,
      "unit": "uur",
      "hourlyRate": 85
    }
  ]
}
```

---

## 10. Learnings & Feedback Regels

### ABSOLUTE REGELS (nooit overtreden)

1. **NOOIT client-specifieke content als defaults gebruiken**
   - Elke site MOET unieke branding krijgen
   - Default waarden in code zijn GENERIEK (platform-level)
   - Kopieer NOOIT kleuren, teksten of content van een bestaande client
   - Frustratie-trigger: gebruiker zag Plastimed01 styling/content op sityzr.compassdigital.nl

2. **ALTIJD Node.js http module gebruiken voor API calls, NOOIT curl**
   - Curl verliest request body bij 308 redirects (Payload redirect /path naar /path/)
   - Bash interpreteert `!` in wachtwoorden als history expansion
   - Node.js `http.request()` is betrouwbaar en consistent

3. **CTA description is PLAIN TEXT, geen rich text**
   - Veld type is `textarea`, NIET `richText`
   - Stuur NOOIT een Lexical JSON object naar dit veld
   - Resultaat van fout: `{"root":{"type":"root"...}}` als zichtbare tekst

4. **showCartButton EXPLICIET op false zetten als geen shop**
   - Code bug: `header.showCartButton ?? true` → undefined ?? true = true
   - Als ENABLE_CHECKOUT=false, verdwijnt het veld uit schema → undefined → cart zichtbaar
   - ALTIJD expliciet `showCartButton: false` sturen

5. **Footer is DYNAMISCH, niet hardcoded**
   - Footer component haalt data op uit Footer + Settings globals
   - Zonder geconfigureerde globals = lege/minimale footer
   - Footer configuratie is VERPLICHT onderdeel van provisioning

6. **Navigation link types: alleen `page`, `external`, of `mega`**
   - `link` is GEEN geldige waarde → validatiefout "invalid selection"
   - Gebruik `external` met `url` veld voor custom URLs
   - Gebruik `mega` met `megaColumns` array voor mega menus

### TECHNISCHE GOTCHAS

7. **Migrations bij verse databases**
   - `db.push: true` synct schema automatisch bij build
   - MAAR: check-migrations.mjs moet ALTIJD draaien voor de build
   - Exit code 1 (DANGER) = STOP, niet deployen
   - Aboland01 incident: verse migrations op bestaande data → data loss

8. **PM2 restart laadt PORT niet opnieuw**
   - `pm2 restart` herstart het proces maar leest .env niet opnieuw
   - Gebruik `pm2 delete` + `pm2 start` voor poortwisselingen
   - Safe-deploy doet dit automatisch correct

9. **npm install vereist --legacy-peer-deps**
   - Oude peer dependencies in het project
   - Zonder flag: `ERESOLVE unable to resolve dependency tree`

10. **Build vereist NODE_OPTIONS="--max-old-space-size=4096"**
    - Next.js build consumeert veel geheugen
    - Zonder flag: OOM kill bij ~2GB
    - Max 3 parallelle builds op de server

11. **Rich text velden (Lexical) format**
    - Hero `description`, FAQ `answer`, Content blocks gebruiken Lexical JSON
    - Structuur: `{ root: { type: "root", children: [{ type: "paragraph", children: [{ text: "...", type: "text" }] }] } }`
    - ALTIJD `format: "", indent: 0, version: 1, direction: "ltr"` meegeven

12. **Animation velden op ELKE block**
    - 4 velden per block: `enableAnimation`, `animationType`, `animationDuration`, `animationDelay`
    - Standaard uitgeschakeld — ALTIJD expliciet `enableAnimation: true` sturen
    - Best practice: `fade-up` animatie op alle blocks, `normal` duration, delay 0

13. **Feature toggles verwijderen velden uit schema**
    - `ENABLE_CHECKOUT=false` → cart-gerelateerde velden bestaan niet in de API response
    - Nullish coalescing (`??`) in frontend code kan onverwachte defaults geven
    - Test ALTIJD de frontend met de juiste feature flag configuratie

14. **Meilisearch indexen zijn site-specifiek**
    - Prefix ALTIJD met sitenaam: `<sitenaam>_products`, `<sitenaam>_blog`
    - Gedeelde Meilisearch instantie, gescheiden indexen

### STIJL & UX REGELS

15. **Tailwind classes, geen inline styles**
    - Mobile-first: base → `md:` → `lg:`
    - Gebruik CSS variabelen voor theme kleuren: `var(--color-primary)`

16. **Animaties standaard AAN op demo/showcase sites**
    - `enableAnimation: true` op ELKE block
    - `animationType: 'fade-up'` als default
    - `enableAnimations: true` in Theme global

---

## 11. Troubleshooting

### Login mislukt

```
Fout: "This field is required." voor "email"
```
**Oorzaak**: Curl redirect verliest body. Gebruik Node.js http module.

### Schema sync mislukt bij build

```
Fout: "column X does not exist"
```
**Oplossing**:
1. Drop alle tabellen: `node -e` met `pg` module, batch van 50
2. Verwijder oude migration files + snapshot JSON
3. Maak verse migration: `npx payload migrate:create`
4. Register in `src/migrations/index.ts`
5. Rebuild

### Footer toont verkeerde/geen content

**Oorzaak**: Footer globals niet geconfigureerd.
**Oplossing**: Configureer Footer global via API (Stap 4.3).

### Cart icoon zichtbaar zonder shop

**Oorzaak**: `showCartButton` niet expliciet op `false`.
**Oplossing**: PATCH header global met `showCartButton: false`.

### CTA toont raw JSON

**Oorzaak**: Rich text object gestuurd naar textarea veld.
**Oplossing**: Stuur plain text string naar CTA `description`.

### PM2 process start niet

```bash
pm2 logs <naam> --lines 50
```
Veelvoorkomend:
- Poort al bezet → andere poort kiezen
- .env ontbreekt → controleer DATABASE_URL
- Build failed → rebuild met juiste NODE_OPTIONS

### Database "out of shared memory"

**Oorzaak**: Te veel tabellen in een keer droppen met CASCADE.
**Oplossing**: Drop in batches van 50. Gebruik `SET session_replication_role = replica`.

---

## 12. Bijlagen

### A. Volledige Feature Toggle Lijst

```
ECOMMERCE_ENABLED         — Hoofdschakelaar e-commerce
ENABLE_SHOP               — Webshop pagina's
ENABLE_CART               — Winkelwagen functionaliteit
ENABLE_CHECKOUT           — Afrekenen
ENABLE_MINI_CART          — Mini-cart in header
ENABLE_AUTHENTICATION     — Login/registratie
ENABLE_MY_ACCOUNT         — Mijn account pagina's
ENABLE_BLOG               — Blog functionaliteit
ENABLE_FAQ                — FAQ pagina
ENABLE_NEWSLETTER         — Nieuwsbrief
ENABLE_SEARCH             — Zoekfunctie
ENABLE_TESTIMONIALS       — Testimonials/reviews
ENABLE_CONSTRUCTION       — Bouw branche
ENABLE_BEAUTY             — Beauty branche
ENABLE_HORECA             — Horeca branche
ENABLE_HOSPITALITY        — Hospitality branche
ENABLE_EXPERIENCES        — Ervaringen/events branche
ENABLE_TOURISM            — Toerisme branche
ENABLE_PROFESSIONAL_SERVICES — Zakelijke dienstverlening
ENABLE_REAL_ESTATE        — Vastgoed branche
ENABLE_PLATFORM           — Platform/marketplace
ENABLE_BRANDS             — Merken pagina's
ENABLE_WISHLISTS          — Verlanglijstjes
ENABLE_COMPARE_PRODUCTS   — Product vergelijking
ENABLE_PRODUCT_REVIEWS    — Product reviews
ENABLE_B2B                — B2B functionaliteit
ENABLE_VENDORS            — Multi-vendor
ENABLE_SUBSCRIPTIONS      — Abonnementen
ENABLE_LOYALTY            — Loyaliteitsprogramma
ENABLE_EMAIL_MARKETING    — E-mail marketing
ENABLE_PUSH_NOTIFICATIONS — Push notificaties
ENABLE_AI_CONTENT         — AI content tools
ENABLE_CHATBOT            — Chatbot
ENABLE_CASES              — Case studies
ENABLE_MAGAZINES          — Digitale magazines
```

### B. Ideale Block Structuur per Pagina Type

**Homepage:**
```
hero → features → stats → testimonials → cta
```

**Branche Landing Page (maximale conversie):**
```
hero → painPoints → features → stats → processSteps → caseStudyGrid → branchePricing → testimonials → competitorComparison → faq → cta
```

**Sub-branche Page (gefocust):**
```
hero → features → caseStudyGrid → testimonials → branchePricing → faq → cta
```

**Branches Overzicht:**
```
hero → features (met branche-kaarten) → stats → testimonials → cta
```

**Contact Page:**
```
hero → contact → faq → cta
```

**Over Ons:**
```
hero → content → team → stats → testimonials → cta
```

### C. Deploy Commando's Quick Reference

```bash
# Enkele site deployen
bash /home/ploi/<site>.compassdigital.nl/deploy-ploi.sh

# Alle demo sites deployen
bash /home/ploi/scripts/deploy-all.sh

# Platform deployen
cd /home/ploi/cms.compassdigital.nl && bash deploy.sh

# Handmatige backup
node /home/ploi/scripts/backup-db.mjs <db_naam> <reden>

# Backup terugzetten
CONFIRM_RESTORE=YES node /home/ploi/scripts/restore-db.mjs <backup_bestand>

# Migration safety check
node /home/ploi/scripts/check-migrations.mjs <db_naam>

# PM2 logs bekijken
pm2 logs <proces_naam> --lines 100
```

### D. Provisioning Automatisering

Voor volledige automatisering kan dit document worden omgezet naar een provisioning script:

```bash
#!/bin/bash
# provision-site.sh <sitenaam> <port> <bedrijfsnaam> <email> <telefoon> <primary_color>

SITE=$1
PORT=$2
COMPANY=$3
EMAIL=$4
PHONE=$5
COLOR=$6

# Stap 1: Directory + .env
# Stap 2: Deploy script
# Stap 3: Eerste deploy
# Stap 4: Admin user aanmaken
# Stap 5: Token ophalen
# Stap 6: Theme configureren
# Stap 7: Settings configureren
# Stap 8: Header configureren
# Stap 9: Footer configureren
# Stap 10: Media uploaden
# Stap 11: Homepage aanmaken
# Stap 12: Branche pagina's aanmaken
# Stap 13: Verificatie
```

> **TODO**: Dit script volledig implementeren voor one-click provisioning.

---

*Dit document is opgesteld op basis van hands-on provisioning ervaring met sityzr.compassdigital.nl (maart 2026) en bevat alle learnings, bugs, en feedback uit dat traject.*
