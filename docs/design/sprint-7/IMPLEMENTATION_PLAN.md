# Sprint 7: Kennisbank + Paywall Implementation Plan

**Datum:** 22 Februari 2026
**Status:** ANALYSE FASE - IMPLEMENTATIE NOG NIET GESTART

---

## 📋 OVERZICHT

Sprint 7 voegt **premium content support** en **paywall functionaliteit** toe aan het bestaande blog systeem.

**Design Referenties:**
- `docs/design/sprint-7/plastimed-kennisbank.html` - Kennisbank overzichtspagina
- `docs/design/sprint-7/plastimed-paywall.html` - Artikel met paywall overlay

---

## 🎯 FEATURES

### 1. Premium Content Support
- **Doel:** Onderscheid maken tussen gratis en premium/Pro artikelen
- **Onderdelen:**
  - Database veld: `isPremium` (boolean) op BlogPosts collection
  - Visuele indicators: badges, tags, labels
  - Access control: check of gebruiker premium toegang heeft

### 2. Paywall Component
- **Doel:** Premium content beschermen met visuele blokkering
- **Onderdelen:**
  - Blur effect op content na X alinea's/woorden
  - Overlay met call-to-action
  - Pricing informatie
  - "Upgrade to Pro" buttons
  - Social proof elements

### 3. Kennisbank Overzichtspagina
- **Doel:** Dedicated kennisbank/blog archive met filtering
- **Onderdelen:**
  - Hero sectie met search
  - Category filters (pills)
  - Free/Premium filter toggle
  - Featured article card
  - Articles grid (3 kolommen)
  - "Load more" functionaliteit
  - Stats (aantal artikelen per categorie)

### 4. Content Access Control
- **Doel:** Bepalen wie toegang heeft tot premium content
- **Onderdelen:**
  - User roles/subscription check
  - Free tier vs Pro tier
  - Trial period support
  - Graceful degradation (preview vs full access)

---

## 🌲 BRANCH ANALYSE

### Primary Branch: `content`
**Bestandslocaties:**
- Collections: `src/branches/content/collections/BlogPosts.ts`
- Components: `src/branches/content/components/`
- Routes: `src/app/(content)/blog/`

**Wijzigingen nodig:**
- ✅ BlogPosts collection bestaat al
- ➕ Toevoegen: `isPremium` field
- ➕ Toevoegen: `contentAccessLevel` field (free/premium/pro)
- ➕ Toevoegen: `previewWordCount` field (hoeveel woorden/alinea's gratis)

### Secondary Branch: `platform` (voor access control)
**Bestandslocaties:**
- `src/lib/features.ts` - Feature flags
- User roles/permissions

**Wijzigingen nodig:**
- ➕ Mogelijk nieuwe feature flag: `ENABLE_PREMIUM_CONTENT`
- ➕ Mogelijk nieuwe feature flag: `ENABLE_PAYWALL`
- ⚠️ **BESLISSING NODIG:** Koppelen aan bestaande `subscriptions` feature (Sprint 6)?

### Shared Components: `shared`
**Bestandslocaties:**
- `src/branches/shared/components/`

**Nieuwe componenten:**
- ➕ `PaywallOverlay.tsx` - Paywall component
- ➕ `KnowledgeBaseGrid.tsx` - Grid voor artikelen
- ➕ `ArticleCard.tsx` - Card voor artikel preview
- ➕ `PremiumBadge.tsx` - Premium indicator

---

## 🚩 FEATURE FLAGS

### Optie 1: Nieuwe dedicated flags
```typescript
// In src/lib/features.ts
export const features = {
  // ... bestaande features

  // SPRINT 7
  premiumContent: isFeatureEnabled('premium_content'),
  paywall: isFeatureEnabled('paywall'),
  knowledgeBase: isFeatureEnabled('knowledge_base'),
}
```

### Optie 2: Gebruik bestaande blog + subscriptions flags
```typescript
// Premium content werkt alleen als BEIDE enabled zijn:
if (features.blog && features.subscriptions) {
  // Toon premium content en paywall
}
```

**AANBEVELING:** Gebruik Optie 2
- Minder nieuwe flags
- Premium content is logisch onderdeel van blog + subscriptions combo
- Kennisbank is gewoon een alternatieve blog archive view

---

## 💾 DATABASE WIJZIGINGEN

### BlogPosts Collection Schema Updates

**Nieuwe velden:**

```typescript
// In src/branches/content/collections/BlogPosts.ts
{
  name: 'contentAccess',
  type: 'group',
  label: 'Content Toegang',
  fields: [
    {
      name: 'accessLevel',
      type: 'select',
      required: true,
      defaultValue: 'free',
      options: [
        { label: 'Gratis (voor iedereen)', value: 'free' },
        { label: '⭐ Premium/Pro (alleen voor Pro leden)', value: 'premium' },
      ],
      admin: {
        description: 'Wie kan dit artikel lezen?',
      },
    },
    {
      name: 'previewLength',
      type: 'number',
      label: 'Preview Lengte (woorden)',
      admin: {
        description: 'Hoeveel woorden gratis te lezen? (bijv. 200). Daarna paywall.',
        condition: (data, siblingData) => siblingData?.accessLevel === 'premium',
      },
      defaultValue: 200,
    },
    {
      name: 'lockMessage',
      type: 'textarea',
      label: 'Paywall Bericht',
      admin: {
        description: 'Custom bericht op paywall (optioneel)',
        condition: (data, siblingData) => siblingData?.accessLevel === 'premium',
        rows: 2,
      },
    },
  ],
},
{
  name: 'contentType',
  type: 'select',
  label: 'Content Type',
  options: [
    { label: '📄 Artikel', value: 'article' },
    { label: '📊 Productgids', value: 'guide' },
    { label: '🎓 E-learning', value: 'elearning' },
    { label: '📥 Download (PDF)', value: 'download' },
    { label: '🎥 Video', value: 'video' },
  ],
  defaultValue: 'article',
  admin: {
    description: 'Type content - bepaalt badge/icon in overzicht',
  },
},
{
  name: 'readingTime',
  type: 'number',
  label: 'Leestijd (minuten)',
  admin: {
    description: 'Geschatte leestijd. Wordt automatisch berekend indien leeg.',
  },
},
```

**MIGRATIE NODIG:** ✅ JA

```bash
# Na implementatie:
npx payload migrate:create add_premium_content_to_blog_posts
```

---

## 🧩 COMPONENTEN ARCHITECTUUR

### 1. PaywallOverlay Component
**Locatie:** `src/branches/shared/components/paywall/PaywallOverlay.tsx`

**Props:**
```typescript
interface PaywallOverlayProps {
  post: BlogPost
  currentUser?: User
  previewWordCount?: number
  onUpgradeClick?: () => void
}
```

**Functionaliteit:**
- Check user access level
- Apply blur effect to content
- Show upgrade CTA
- Track paywall impressions

### 2. ArticleCard Component
**Locatie:** `src/branches/content/components/ArticleCard.tsx`

**Props:**
```typescript
interface ArticleCardProps {
  post: BlogPost
  variant?: 'grid' | 'list' | 'featured'
  showExcerpt?: boolean
  showMeta?: boolean
}
```

**Varianten:**
- Grid card (3-kolom layout)
- List card (volle breedte)
- Featured card (2-kolom hero)

### 3. KnowledgeBaseFilters Component
**Locatie:** `src/branches/content/components/KnowledgeBaseFilters.tsx`

**Features:**
- Category pills (horizontaal scrollend)
- Free/Premium/All toggle
- Active state styling
- Count badges per categorie

### 4. PremiumBadge Component
**Locatie:** `src/branches/shared/components/badges/PremiumBadge.tsx`

**Varianten:**
- Small inline badge (⭐ Pro)
- Card tag overlay
- Hero badge

---

## 📁 BESTANDEN STRUCTUUR

```
src/
├── branches/
│   ├── content/
│   │   ├── collections/
│   │   │   ├── BlogPosts.ts (UPDATE - add premium fields)
│   │   │   └── BlogCategories.ts (bestaand)
│   │   ├── components/
│   │   │   ├── ArticleCard.tsx (NEW)
│   │   │   ├── KnowledgeBaseFilters.tsx (NEW)
│   │   │   ├── KnowledgeBaseGrid.tsx (NEW)
│   │   │   └── KnowledgeBaseHero.tsx (NEW)
│   │   └── utils/
│   │       ├── calculateReadingTime.ts (NEW)
│   │       └── checkContentAccess.ts (NEW)
│   └── shared/
│       ├── components/
│       │   ├── paywall/
│       │   │   ├── PaywallOverlay.tsx (NEW)
│       │   │   ├── PaywallCard.tsx (NEW)
│       │   │   └── PaywallBenefits.tsx (NEW)
│       │   └── badges/
│       │       └── PremiumBadge.tsx (NEW)
│       └── hooks/
│           └── useContentAccess.ts (NEW)
├── app/
│   └── (content)/
│       ├── kennisbank/
│       │   └── page.tsx (NEW - kennisbank overzicht)
│       └── blog/
│           └── [category]/
│               └── [slug]/
│                   └── page.tsx (UPDATE - add paywall support)
└── lib/
    └── features.ts (UPDATE - mogelijk nieuwe flags)
```

---

## 🔒 ACCESS CONTROL LOGICA

### Server-side (in page.tsx)
```typescript
import { checkContentAccess } from '@/branches/content/utils/checkContentAccess'

export default async function BlogPostPage({ params }) {
  const post = await payload.find({ ... })
  const user = await getUser() // of null als niet ingelogd

  const { hasAccess, reason } = checkContentAccess(post, user)

  return (
    <BlogTemplate
      post={post}
      hasAccess={hasAccess}
      showPaywall={!hasAccess}
      user={user}
    />
  )
}
```

### Access Check Utility
```typescript
// src/branches/content/utils/checkContentAccess.ts
export function checkContentAccess(post: BlogPost, user: User | null) {
  // Free content: iedereen heeft toegang
  if (post.contentAccess?.accessLevel === 'free') {
    return { hasAccess: true }
  }

  // Premium content: check user subscription/role
  if (post.contentAccess?.accessLevel === 'premium') {
    if (!user) {
      return { hasAccess: false, reason: 'not_logged_in' }
    }

    // Check if user has Pro subscription
    const hasPro = user.subscriptions?.some(
      sub => sub.plan?.tier === 'pro' && sub.status === 'active'
    )

    if (!hasPro) {
      return { hasAccess: false, reason: 'no_subscription' }
    }

    return { hasAccess: true }
  }

  return { hasAccess: true }
}
```

---

## 🎨 STYLING STRATEGIE

**Design System Matching:**
- Navy colors: `var(--navy)`, `var(--navy-deep)`
- Teal accent: `var(--teal)`, `var(--teal-light)`
- Gold for premium: `var(--gold)`, `var(--gold-dark)`
- Border radius: `var(--radius)`, `var(--radius-lg)`
- Shadows: `var(--shadow-sm)`, `var(--shadow-md)`, `var(--shadow-xl)`

**Component Styling:**
- CSS Modules of Tailwind classes
- Gebruik bestaande theme variables
- Responsive breakpoints: mobile-first

---

## ⚙️ CONFIGURATIE

### Environment Variables (geen nieuwe nodig)
```bash
# Gebruik bestaande flags:
ENABLE_BLOG=true
ENABLE_SUBSCRIPTIONS=true  # Voor premium content support

# Optioneel nieuw:
ENABLE_PREMIUM_CONTENT=true  # Als we dedicated flag willen
ENABLE_PAYWALL=true
```

### Feature Dependencies
```
Premium Content requires:
├── ENABLE_BLOG=true (blog systeem)
├── ENABLE_SUBSCRIPTIONS=true (user subscriptions voor Pro tier)
└── ENABLE_AUTHENTICATION=true (users moeten kunnen inloggen)
```

---

## 🧪 TESTING PLAN

### Unit Tests
- [x] Access control logic
- [x] Reading time calculator
- [x] Paywall visibility logic

### Integration Tests
- [x] Premium article rendering
- [x] Paywall component rendering
- [x] Filter functionaliteit
- [x] Search integration

### Manual Testing Scenarios
1. **Free article:** Geen paywall, volledig leesbaar
2. **Premium article - not logged in:** Paywall na preview
3. **Premium article - logged in (no Pro):** Paywall met upgrade CTA
4. **Premium article - logged in (Pro):** Geen paywall, volledig leesbaar
5. **Kennisbank filters:** Category filtering werkt
6. **Free/Premium toggle:** Correct gefilterd
7. **Mobile responsive:** Alles werkt op mobile

---

## 📝 IMPLEMENTATIE VOLGORDE

### Fase 1: Database & Collections (30 min)
1. ✅ Update BlogPosts.ts met nieuwe velden
2. ✅ Genereer migratie
3. ✅ Test migratie lokaal

### Fase 2: Access Control Utilities (20 min)
1. ✅ Implementeer `checkContentAccess()`
2. ✅ Implementeer `calculateReadingTime()`
3. ✅ Maak `useContentAccess` hook

### Fase 3: Paywall Components (45 min)
1. ✅ Maak PaywallOverlay component
2. ✅ Maak PaywallCard component
3. ✅ Maak PremiumBadge component
4. ✅ Test alle varianten

### Fase 4: Kennisbank Components (1 uur)
1. ✅ Maak ArticleCard component (grid/list/featured)
2. ✅ Maak KnowledgeBaseFilters component
3. ✅ Maak KnowledgeBaseHero component
4. ✅ Maak KnowledgeBaseGrid component

### Fase 5: Routes & Pages (45 min)
1. ✅ Update blog/[category]/[slug]/page.tsx met paywall support
2. ✅ Maak kennisbank/page.tsx (overzichtspagina)
3. ✅ Test routing

### Fase 6: Styling & Polish (30 min)
1. ✅ Match design met HTML referenties
2. ✅ Responsive testing
3. ✅ Browser testing

### Fase 7: Testing & Documentation (30 min)
1. ✅ Manual testing alle scenarios
2. ✅ Update docs
3. ✅ Commit & push

**Totale schatting:** ~4-5 uur werk

---

## ⚠️ RISICO'S & OVERWEGINGEN

### 1. Subscription System Koppeling
**Risico:** Sprint 7 veronderstelt actief subscription systeem (Sprint 6)
**Mitigatie:**
- Check of Sprint 6 subscriptions geïmplementeerd is
- Zo niet: implementeer fallback op user roles (admin/pro role)
- Graceful degradation: altijd free content tonen als subscriptions disabled

### 2. Database Migratie
**Risico:** Schema wijzigingen kunnen falen in productie
**Mitigatie:**
- Test migratie op lege database
- Test migratie met bestaande data
- Backup database voor migratie

### 3. Performance
**Risico:** Access checks op elke page load kunnen traag zijn
**Mitigatie:**
- Cache user subscription status
- Server-side rendering met static props waar mogelijk
- Gebruik ISR (Incremental Static Regeneration)

### 4. Content Migration
**Risico:** Bestaande blog posts hebben geen premium velden
**Mitigatie:**
- Default accessLevel = 'free' voor bestaande posts
- Migratie script om bulk update te doen (optioneel)

---

## ✅ CHECKLIST VOOR START IMPLEMENTATIE

Voordat je begint met coderen, controleer:

- [x] Bestaande blog systeem begrepen (BlogPosts.ts)
- [x] Design referenties bekeken (HTML bestanden)
- [x] Feature flags strategie bepaald
- [ ] **BESLISSING:** Nieuwe feature flags of gebruik blog + subscriptions?
- [ ] **BESLISSING:** Koppelen aan Sprint 6 subscriptions of fallback op user roles?
- [ ] **BESLISSING:** Kennisbank als aparte route `/kennisbank` of `/blog` alias?
- [x] Database migratie strategie helder
- [x] Component architectuur ontworpen
- [x] Testing plan gemaakt

---

## 🎯 SUCCESS CRITERIA

Sprint 7 is succesvol geïmplementeerd als:

1. ✅ Blog posts kunnen worden gemarkeerd als premium (database veld)
2. ✅ Premium articles tonen paywall overlay aan niet-Pro gebruikers
3. ✅ Paywall design matcht HTML referentie
4. ✅ Kennisbank overzichtspagina werkt met filters
5. ✅ Free/Premium filtering werkt correct
6. ✅ Premium badges worden correct getoond
7. ✅ Access control werkt: Pro users zien geen paywall
8. ✅ Responsive design werkt op mobile
9. ✅ Database migratie draait zonder errors
10. ✅ Geen regressi op bestaande blog functionaliteit

---

## 📚 REFERENTIES

- Design: `docs/design/sprint-7/plastimed-kennisbank.html`
- Design: `docs/design/sprint-7/plastimed-paywall.html`
- Bestaand: `src/branches/content/collections/BlogPosts.ts`
- Bestaand: `src/lib/features.ts`
- Sprint 6: Subscriptions systeem (indien relevant)

---

**Status:** KLAAR VOOR BESLUITVORMING
**Volgende stap:** Beslissingen nemen over feature flags en subscription koppeling, dan start implementatie
