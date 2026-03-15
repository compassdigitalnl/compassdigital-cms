# Provisioning Briefing — Bij Tante Roos

> **Opgesteld door:** Compass Digital · Online Marketing Bureau
> **Datum:** 12 maart 2026
> **Platform:** Payload CMS v3 + Next.js 15
> **Staging URL:** bijtanteroos.compassdigital.nl

---

## 1. Projectoverzicht

| Parameter | Waarde |
|---|---|
| Klant | Bij Tante Roos |
| Domein (productie) | bijtanteroos.nl |
| Staging URL | bijtanteroos.compassdigital.nl |
| Template type | ecommerce |
| Shop model | b2c |
| Beschikbare poort | 4009 (eerste vrije) |
| Database naam | client_bijtanteroos |
| PM2 naam | bijtanteroos-cms |
| CLIENT_ID | bijtanteroos01 |
| Brandvariant | Variant 1 — Soft Rose (aanbevolen) |

Bij Tante Roos is een B2C e-commerce webshop gericht op breien, haken, wol & garen en creatieve workshops. De shop biedt vier producttypes (simpel, variabel, bookable workshops, gepersonaliseerd en gebundeld), aangevuld met e-mailmarketing, Meilisearch zoekfunctionaliteit en een chatbot add-on.

---

## 2. Branding — Variant 1: Soft Rose

De aanbevolen variant uit de brandguide. Het warme oudroze palet vertaalt de merknaam direct naar een visuele identiteit: gezellig, persoonlijk en uitnodigend — passend bij de wereld van wol, garen en handwerk.

### 2.1 Kleurenpalet

| Naam | Hex | Gebruik |
|---|---|---|
| Warm Mokka | `#3D2B2B` | `primaryColor` — headers, navigatie, footer |
| Oud Roze | `#C4908A` | `secondaryColor` — CTA's, links, badges |
| Rosé | `#D4A59E` | `secondaryLight` — hover states |
| Blush | `#EEDAD5` | `accentColor` — card achtergrond, hover |
| Crème | `#FDF5F3` | `backgroundColor` — pagina-achtergrond |

### 2.2 Typografie

| Element | Waarde |
|---|---|
| Heading font | DM Serif Display — gewicht 400 (sierlijk, warm, ambachtelijk) |
| Body font | Nunito — gewicht 300–800 (rond, vriendelijk, leesbaar) |
| H1 | 40px |
| H2 | 28px |
| H3 | 20px |
| Body | 16px, line-height 1.7 |
| Body klein | 14px |
| Heading stijl | Normal — **geen** uppercase headings |

### 2.3 UI Specificaties

| Element | Waarde |
|---|---|
| Button stijl | Pill — `border-radius: 24px` |
| Button font-weight | 700 |
| Primary button | `#C4908A` achtergrond, `#FFFFFF` tekst |
| Secondary button | Transparant, `border: #C4908A`, tekst `#3D2B2B` |
| Dark button | `#3D2B2B` achtergrond, `#FDF5F3` tekst |
| Card radius | 16px |
| Pagina achtergrond | `#FDF5F3` (crème) |
| Surface kleur | `#FFFFFF` |
| Border kleur | `#F0EBE3` |
| Animaties | Aan — `fade-up`, `normal` duration |

### 2.4 Theme API Configuratie

Gebruik deze waarden voor **Stap 3.1** (`PATCH /api/globals/theme`):

```js
{
  primaryColor:        '#3D2B2B',
  primaryLight:        '#5E3C3A',
  primaryGlow:         'rgba(61,43,43,0.12)',
  secondaryColor:      '#C4908A',
  secondaryLight:      '#D4A59E',
  accentColor:         '#EEDAD5',
  backgroundColor:     '#FDF5F3',
  surfaceColor:        '#FFFFFF',
  borderColor:         '#F0EBE3',
  greyLight:           '#FBF9F7',
  greyMid:             '#8C7E73',
  greyDark:            '#57534E',
  textPrimary:         '#3D2B2B',
  textSecondary:       '#57534E',
  textMuted:           '#8C7E73',

  headingFont:         "'DM Serif Display', serif",
  bodyFont:            "'Nunito', sans-serif",
  heroSize:            40,
  sectionSize:         28,
  cardTitleSize:       20,
  bodyLgSize:          16,
  bodySize:            14,

  btnBorderRadius:     '24px',
  btnFontWeight:       700,
  btnPrimaryBg:        '#C4908A',
  btnPrimaryText:      '#FFFFFF',
  btnPrimaryHoverBg:   '#B07E78',
  btnSecondaryBg:      'transparent',
  btnSecondaryText:    '#3D2B2B',

  containerWidth:      '7xl',
  enableAnimations:    true,
  radiusSm:            8,
  radiusMd:            16,
  radiusLg:            24,

  primaryGradient:     'linear-gradient(165deg, #3D2B2B 0%, #5E3C3A 40%, #C4908A 100%)',
  secondaryGradient:   'linear-gradient(135deg, #C4908A 0%, #D4A59E 100%)',
}
```

---

## 3. .env Configuratie

> ⚠️ **Veiligheidsregel:** NOOIT waarden kopiëren van een bestaande client-site. Genereer `PAYLOAD_SECRET` met `openssl rand -hex 32`. `DATABASE_URL` wachtwoord ophalen uit Railway dashboard.

```env
# === CORE ===
NODE_ENV=production
PORT=4009
PAYLOAD_SECRET=<openssl rand -hex 32>
DATABASE_URL=postgresql://postgres:<wachtwoord>@shinkansen.proxy.rlwy.net:29352/client_bijtanteroos
NEXT_TELEMETRY_DISABLED=1

# === CLIENT IDENTITEIT ===
CLIENT_ID=bijtanteroos01
NEXT_PUBLIC_CLIENT_ID=bijtanteroos01
CLIENT_NAME=Bij Tante Roos
SITE_NAME=Bij Tante Roos — breien, haken, wol & garen
NEXT_PUBLIC_SERVER_URL=https://bijtanteroos.compassdigital.nl
PRIMARY_COLOR=#3D2B2B
TEMPLATE_ID=ecommerce
SHOP_MODEL=b2c

# === E-COMMERCE CORE ===
ECOMMERCE_ENABLED=true
ENABLE_SHOP=true
ENABLE_CART=true
ENABLE_CHECKOUT=true
ENABLE_MINI_CART=true
ENABLE_AUTHENTICATION=true
ENABLE_MY_ACCOUNT=true
ENABLE_GUEST_CHECKOUT=true

# === CONTENT FEATURES ===
ENABLE_BLOG=true
ENABLE_FAQ=true
ENABLE_NEWSLETTER=true
ENABLE_SEARCH=true
ENABLE_TESTIMONIALS=true

# === PRODUCTTYPEN ===
ENABLE_VARIABLE_PRODUCTS=true     # variabele producten
ENABLE_BUNDLE_PRODUCTS=true       # breipakketten (zie openstaande vraag §5)
ENABLE_CONFIGURATOR=true          # gepersonaliseerd (tegeltjes)
ENABLE_EXPERIENCES=true           # bookable workshops

# === SHOP FEATURES ===
ENABLE_WISHLISTS=true
ENABLE_PRODUCT_REVIEWS=true
ENABLE_DISCOUNTS=true
ENABLE_GIFT_VOUCHERS=true
ENABLE_FREE_SHIPPING_BAR=true

# === E-MAILMARKETING ===
ENABLE_EMAIL_MARKETING=true
ENABLE_EMAIL_CAMPAIGNS=true
ENABLE_EMAIL_AUTOMATION=true
ENABLE_EMAIL_FLOWS=true
ENABLE_EMAIL_GRAPES_EDITOR=true

# === ADD-ONS ===
ENABLE_CHATBOT=true
ENABLE_AI_CONTENT=true
ENABLE_PERSONALIZATION=true

# === MEILISEARCH ===
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_MASTER_KEY=<master_key>
NEXT_PUBLIC_MEILISEARCH_KEY=<search_only_key>
MEILISEARCH_PRODUCTS_INDEX=bijtanteroos_products
MEILISEARCH_BLOG_INDEX=bijtanteroos_blog
MEILISEARCH_PAGES_INDEX=bijtanteroos_pages

# === API KEYS ===
OPENAI_API_KEY=<key voor chatbot en AI content>
GROQ_API_KEY=<optioneel alternatief>

# === ALLES OVERIG = false ===
ENABLE_B2B=false
ENABLE_VOLUME_PRICING=false
ENABLE_SUBSCRIPTIONS=false
ENABLE_LOYALTY=false
ENABLE_COMPARE_PRODUCTS=false
ENABLE_BARCODE_SCANNER=false
ENABLE_VENDORS=false
ENABLE_BRANDS=false
ENABLE_INVOICES=false
ENABLE_RETURNS=false
ENABLE_ORDER_TRACKING=false
ENABLE_ORDER_LISTS=false
ENABLE_PUSH_NOTIFICATIONS=false
ENABLE_CASES=false
ENABLE_MAGAZINES=false
```

---

## 4. Producttype Mapping

| Producttype | Platform implementatie |
|---|---|
| Simpel | Standaard enkel product. Geen extra toggle — altijd beschikbaar. |
| Variabel | Keuze-opties (bijv. kleur garen, naaldmaat). Vereist: `ENABLE_VARIABLE_PRODUCTS=true` |
| Bookable (workshops) | Datum/tijd-gebonden reservering. Vereist: `ENABLE_EXPERIENCES=true` — bevestig of dit de juiste toggle is. |
| Gepersonaliseerd | Klant voert eigen tekst/opties in (bijv. tegeltjes met tekst). Vereist: `ENABLE_CONFIGURATOR=true` |
| Gebundeld | Meerdere producten als pakket (breipakket). Vereist: `ENABLE_BUNDLE_PRODUCTS=true` — zie openstaande vraag §10. |

> ⚠️ **Openstaande vraag — Gebundelde producten:** Op `bijtanteroos.nl/breipakket-looping-vestje-barley/` zijn breipakketten momenteel als 2 aparte variabelen uitgewerkt. Is dit in het nieuwe platform een **bundle** (klant kiest losse componenten) of een **variabel product** (1 SKU met kleur-/maatkeuze)? Aanbeveling: variabel als de samenstelling altijd gelijk is; bundle als de klant losse componenten samenstelt. Bevestig dit vóór productimport.

---

## 5. Aanbevolen Navigatiestructuur

Op basis van het productaanbod — aan te passen naar de definitieve categoriestructuur.

| Menu item | Type & inhoud |
|---|---|
| Home | `external` → `/` |
| Winkel | `mega` → Wol & Garen / Haakpakketten / Breipakketten / Naalden & Tools / Accessoires |
| Workshops | `external` → `/workshops` (bookable) |
| Gepersonaliseerd | `external` → `/gepersonaliseerd` (tegeltjes etc.) |
| Inspiratie / Blog | `external` → `/blog` |
| Over Bij Tante Roos | `external` → `/over-ons` |
| Contact | `external` → `/contact` |

---

## 6. Homepage Block Structuur

```
hero → features → productGrid/cta → stats → testimonials → features (workshops) → cta
```

| Block | Inhoud |
|---|---|
| 1. `hero` | Split layout — "Ontdek onze haak- en breipakketten" + warm hero beeld + 2 CTA's (Bekijk pakketten / Bekijk workshops) |
| 2. `features` | USP's grid-3 — bijv. "Gratis patroon bij elk pakket", "Workshop voor elk niveau", "Persoonlijk advies" |
| 3. `productGrid` / `cta` | Uitgelichte producten of categorie-blokken |
| 4. `stats` | 4 statistieken — aantal producten, tevreden klanten, workshopdagen, jaar ervaring |
| 5. `testimonials` | 3 klantreviews, handwerkwebshop-specifiek |
| 6. `features` | Spotlight workshops met `split` image layout |
| 7. `cta` | Nieuwsbrief — "Ontvang patronen & aanbiedingen" |

---

## 7. E-mailmarketing Setup

| Flow | Trigger & inhoud |
|---|---|
| Welkomstflow | Nieuwe abonnee: welkom + korting + meest populaire pakketten |
| Abandoned cart | Verlaten winkelwagen (1u / 24u / 72u) |
| Post-purchase | Na aankoop: patroon download + next steps + upsell |
| Workshop reminder | Bevestiging direct + herinnering 1 dag voor workshop |
| Seizoenscampagnes | Herfst/winter breien, lente/zomer haken — op collectie-basis |
| Review request | 7 dagen na levering |
| Gepersonaliseerd besteld | Bevestiging met productie-indicatie + verwachte leverdatum |

---

## 8. Meilisearch Configuratie

| Index naam | Inhoud & zoekstrategie |
|---|---|
| `bijtanteroos_products` | Producten — doorzoekbaar op naam, beschrijving, tags, categorie, garen-type |
| `bijtanteroos_blog` | Blog / patronen — doorzoekbaar op titel, categorie, tags |
| `bijtanteroos_pages` | Pagina's — doorzoekbaar op titel en content |

Aanbevolen filters voor producten: categorie, prijsrange, garen-type, niveau (beginner/gevorderd), beschikbaarheid workshopdatum.

---

## 9. Footer & Globals Configuratie

### 9.1 Settings (verplicht in te vullen)

| Veld | Waarde |
|---|---|
| `companyName` | Bij Tante Roos |
| `tagline` | TE BEVESTIGEN door klant |
| `description` | TE LEVEREN door klant (max 160 tekens) |
| `email` | TE LEVEREN door klant |
| `phone` | TE LEVEREN door klant |
| `whatsapp` | TE LEVEREN door klant |
| `address.street` | TE LEVEREN door klant |
| `address.city` | TE LEVEREN door klant |
| `defaultMetaDescription` | TE LEVEREN door klant (max 160 tekens) |
| `sitemapEnabled` | `true` |
| `enableJSONLD` | `true` |
| `enableAutoOGImages` | `true` |

### 9.2 Header (kritieke instellingen)

| Veld | Waarde |
|---|---|
| `topbarBgColor` | `#C4908A` (Oud Roze) |
| `topbarTextColor` | `#FFFFFF` |
| `topbarMessages` | TE LEVEREN door klant (USP's) |
| `showCartButton` | `true` (ENABLE_CHECKOUT=true) |
| `showAccountButton` | `true` |
| `showWishlistButton` | `true` |
| `stickyHeader` | `true` |
| `searchEnabled` | `true` |

> ⚠️ **Kritieke bug:** `showCartButton` moet expliciet `true` zijn. De code heeft `showCartButton ?? true` — zonder expliciete waarde kan dit onverwacht gedrag veroorzaken. Zie PROVISIONING-GUIDE §4.2.

### 9.3 Trust Badges (footer — suggesties)

| Icoon | Tekst |
|---|---|
| `shield-check` | Veilig & beveiligd betalen |
| `truck` | Gratis verzending vanaf €XX |
| `package` | Snel geleverd |
| `refresh-cw` | XX dagen retour |
| `star` | Meer dan XXX tevreden klanten |

---

## 10. Benodigde informatie van klant

### Branding & keuze
- Bevestiging gekozen brandvariant (aanbevolen: Variant 1 Soft Rose — al bevestigd?)
- Logo bestand in SVG of hoge-resolutie PNG (transparante achtergrond)
- Eventuele aanpassingen op kleuren of fonts t.o.v. de brandguide

### Contactgegevens (verplicht voor Settings global)
- E-mailadres (info@ of klantenservice)
- Telefoonnummer
- WhatsApp nummer
- Postadres (straat + huisnummer, postcode, stad)

### Sociale media
- Instagram URL (meest relevant voor handwerkwebshop)
- Facebook URL
- Pinterest URL (sterk aanbevolen — hoog bereik in breien/haken niche)
- Overige kanalen

### Shop & producten
- **Bevestiging producttype "gebundeld":** bundle of variabel? (zie §4)
- Welke betaalmethoden? (iDEAL, Creditcard, PayPal, Achteraf betalen)
- Verzendkosten en drempel gratis verzending
- Retourbeleid (aantal dagen)
- KVK-nummer
- BTW-nummer

### Content
- SEO meta description homepage (max 160 tekens)
- Tagline / slogan
- Openingstijden klantenservice
- USP's voor topbar (bijv. "Gratis verzending vanaf €50 · Direct uit voorraad · Persoonlijk advies")
- 3–5 klanttestimonials voor homepage
- Homepage statistieken (aantal producten, workshopdagen, etc.)
- Hero afbeeldingen (of Unsplash voorkeur: warme wol/garen/handwerk sfeer)

### Technisch & marketing
- Google Analytics 4 measurement ID (`G-XXXXXXXXXX`)
- Google Tag Manager ID (`GTM-XXXXXXX`) — indien van toepassing
- E-mailmarketing "Van"-naam en afzender e-mailadres
- Welke flows direct activeren bij launch? (zie §7)

---

## 11. Uitvoervolgorde Provisioning

| Stap | Actie |
|---|---|
| 1.1 | Railway database aanmaken: `client_bijtanteroos` |
| 1.2 | Git clone → `/home/ploi/bijtanteroos.compassdigital.nl` |
| 1.3 | `.env` aanmaken met configuratie uit §3 |
| 1.4 | `deploy-ploi.sh` aanmaken |
| 1.5 | Registreren in `deploy-all.sh` |
| 1.6 | Registreren in `backup-all.sh` |
| 1.7 | Nginx configuratie via Ploi (proxy → poort 4009) |
| 2.1 | Eerste deploy uitvoeren |
| 2.2 | Admin user aanmaken: `admin@bijtanteroos.nl` |
| 2.3 | Login token opslaan: `/tmp/bijtanteroos_token.txt` |
| 3.1 | Theme configureren (waarden uit §2.4) |
| 4.1 | Settings global configureren |
| 4.2 | Header global configureren |
| 4.3 | Footer global configureren |
| 5.1 | Hero afbeeldingen uploaden |
| 5.2 | Homepage aanmaken (blokstructuur §6) |
| 6 | Meilisearch indexen aanmaken en koppelen |
| 6 | E-mailmarketing flows instellen |
| 6 | Chatbot add-on configureren |
| 7 | Verificatie & QA checklist |
| Post-launch | Google Analytics & GTM koppelen |

---

## 12. Quick Reference — Deploy Commands

```bash
# Site deployen
bash /home/ploi/bijtanteroos.compassdigital.nl/deploy-ploi.sh

# Logs bekijken
pm2 logs bijtanteroos-cms --lines 100

# Handmatige backup
node /home/ploi/scripts/backup-db.mjs client_bijtanteroos pre-launch

# Migration safety check
node /home/ploi/scripts/check-migrations.mjs client_bijtanteroos
```

---

*Compass Digital · Online Marketing Bureau · Vertrouwelijk document · Maart 2026*
