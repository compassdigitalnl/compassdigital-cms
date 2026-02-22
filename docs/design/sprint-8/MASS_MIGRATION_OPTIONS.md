# Sprint 8: Mass Migration Options - Alle Subscribers een Account Geven

**Date:** 22 Februari 2026
**Use Case:** Klant wil dat ALLE 250K-500K bestaande THOR subscribers toegang krijgen tot webshop

---

## 🎯 Het Scenario

**Klant wens:**
> "We willen dat al onze 250.000 - 500.000 bestaande subscribers (die nu alleen in THOR zitten)
> ook een account kunnen krijgen op de webshop om hun abonnement te beheren."

**Challenge:**
- 500K users aanmaken in CMS = performance problemen (zie Scalability Addendum)
- Maar klant wil wel self-service voor alle subscribers
- Hoe kunnen we dit oplossen?

---

## 💡 Oplossing 1: Magic Link Authentication (AANBEVOLEN) ✅

### Concept: Geen Account Nodig, Wel Toegang

**Hoe het werkt:**

Subscribers hebben **GEEN permanent CMS account**, maar kunnen wel inloggen met een tijdelijke link.

```
1. Subscriber gaat naar: aboland.nl/mijn-abonnement
2. Vult in: Email + Postcode + Huisnummer (zoals aboland.nl nu doet)
3. Backend checkt THOR: "Bestaat deze combinatie?"
4. JA → Genereert magic link (24 uur geldig)
5. Subscriber krijgt email met link
6. Klik link → Automatisch ingelogd
7. Kan abonnement beheren (adres wijzigen, opzeggen, etc.)
8. Na 24 uur: link verloopt, moet opnieuw aanvragen
```

**Voordelen:**
- ✅ **Geen database bloat** - Geen permanente users voor 500K subscribers
- ✅ **Veilig** - Authenticatie via email + adresgegevens
- ✅ **Bekende UX** - Aboland.nl gebruikt dit al
- ✅ **Geen wachtwoord gedoe** - Subscribers hoeven geen wachtwoord te onthouden
- ✅ **Self-service** - Alle subscribers kunnen inloggen zonder support

**Nadelen:**
- ⚠️ Email nodig elke keer (niet handig voor frequente bezoekers)
- ⚠️ Niet geschikt als subscriber vaak terugkomt

**Implementatie:**

```typescript
// src/app/api/auth/magic-link/request/route.ts
export async function POST(request: NextRequest) {
  const { email, postalCode, houseNumber } = await request.json()

  // 1. Fetch subscriptions from THOR
  const thorApi = new ThorApiService()
  const subscriptions = await thorApi.getSubscriptionsByEmail(email)

  // 2. Verify address matches
  const matchingSubscription = subscriptions.find(sub => {
    const receiver = sub.receiver
    return (
      receiver.address.postalCode === postalCode &&
      receiver.address.houseNumber === houseNumber
    )
  })

  if (!matchingSubscription) {
    return NextResponse.json(
      { error: 'Geen abonnement gevonden met deze gegevens' },
      { status: 404 }
    )
  }

  // 3. Generate magic link token (JWT, 24 hour expiry)
  const token = jwt.sign(
    {
      email,
      subscriptionId: matchingSubscription.subscriptionId,
      type: 'magic-link',
    },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  )

  // 4. Send email with magic link
  await sendMagicLinkEmail(email, token)

  return NextResponse.json({
    success: true,
    message: 'Check je email voor de inloglink',
  })
}

// src/app/api/auth/magic-link/verify/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  // 1. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET!)

  // 2. Create temporary session (24 hour)
  const session = await createTempSession({
    email: decoded.email,
    subscriptionId: decoded.subscriptionId,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  })

  // 3. Redirect to my-account
  return NextResponse.redirect('/my-account/subscriptions')
}
```

**Frontend Flow:**

```tsx
// src/app/(app)/mijn-abonnement/page.tsx
export default function MijnAbonnementPage() {
  const [step, setStep] = useState<'form' | 'email-sent'>('form')

  async function handleSubmit(data) {
    const response = await fetch('/api/auth/magic-link/request', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (response.ok) {
      setStep('email-sent')
    }
  }

  if (step === 'email-sent') {
    return (
      <div>
        <h1>Check je email</h1>
        <p>We hebben een inloglink gestuurd naar je email adres.</p>
        <p>Klik op de link om in te loggen (24 uur geldig).</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Mijn Abonnement Beheren</h1>
      <input name="email" type="email" placeholder="Email" required />
      <input name="postalCode" placeholder="Postcode" required />
      <input name="houseNumber" placeholder="Huisnummer" required />
      <button type="submit">Inloglink Aanvragen</button>
    </form>
  )
}
```

**Cost Analysis:**
- Development: +8 uur (€600-800)
- Geen database bloat
- Email kosten: ~€0.001 per email = €500 voor 500K subscribers (eenmalig)

---

## 💡 Oplossing 2: Invite Flow + Phased Migration

### Concept: Subscribers Uitnodigen om Account Aan te Maken

**Hoe het werkt:**

```
1. Batch 1 (10K subscribers):
   - Stuur uitnodiging email: "Maak je account aan op aboland.nl"
   - Link naar registratie pagina met pre-filled email
   - Subscriber maakt wachtwoord aan
   - Account actief

2. Wacht 2 weken, analyseer conversie

3. Batch 2 (20K subscribers):
   - Repeat

4. Continue tot alle interested subscribers account hebben

5. Niet-geconverteerde subscribers:
   - Gebruik Magic Link (optie 1) als fallback
```

**Voordelen:**
- ✅ **Geleidelijke groei** - Database groeit gefaseerd (controleerbaar)
- ✅ **Opt-in** - Alleen geïnteresseerde subscribers maken account
- ✅ **Permanente accounts** - Voor frequente bezoekers handig
- ✅ **Performance beheerst** - Nooit 500K users tegelijk

**Nadelen:**
- ⚠️ Lage conversie (verwacht: 10-30% van subscribers maakt account)
- ⚠️ Duurt lang (maanden om alle batches uit te nodigen)
- ⚠️ Veel support tickets ("Hoe maak ik account aan?")

**Implementatie:**

```typescript
// src/scripts/send-invite-batch.ts
async function sendInviteBatch(batchSize: number = 10000) {
  const thorApi = new ThorApiService()

  // 1. Get subscribers from THOR (paginated)
  const subscribers = await thorApi.getSubscriptions({
    pageSize: batchSize,
    pageNumber: 1,
  })

  // 2. Filter: Only those without existing CMS account
  const existingUsers = await db.query.users.findMany({
    where: (users, { inArray }) =>
      inArray(users.email, subscribers.map(s => s.receiver.email)),
  })

  const existingEmails = new Set(existingUsers.map(u => u.email))
  const newSubscribers = subscribers.filter(
    s => !existingEmails.has(s.receiver.email)
  )

  // 3. Send invite emails
  for (const subscriber of newSubscribers) {
    const inviteToken = jwt.sign(
      {
        email: subscriber.receiver.email,
        firstName: subscriber.receiver.firstName,
        lastName: subscriber.receiver.lastName,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' } // 30 dagen geldig
    )

    await sendInviteEmail(subscriber.receiver.email, inviteToken)
  }

  // 4. Log batch
  await db.insert(inviteBatches).values({
    batchNumber: await getNextBatchNumber(),
    subscriberCount: newSubscribers.length,
    sentAt: new Date(),
  })
}

// Cron job: Run weekly
// POST /api/cron/send-invite-batch
```

**Invite Email Template:**

```html
Subject: Beheer je Winelife abonnement online!

Hoi Jan,

Goed nieuws! Je kunt nu je Winelife Magazine abonnement online beheren.

✅ Adres wijzigen
✅ Email updaten
✅ Abonnement opzeggen
✅ Facturen inzien

Maak je account aan (30 seconden):
https://aboland.nl/register?invite=TOKEN

Je gegevens staan al klaar, alleen wachtwoord kiezen!

Groeten,
Team Aboland
```

**Registratie pagina met invite token:**

```tsx
// src/app/(app)/register/page.tsx
export default function RegisterPage({ searchParams }) {
  const inviteToken = searchParams.invite

  // Decode token to get pre-filled data
  const inviteData = inviteToken ? jwt.verify(inviteToken, ...) : null

  return (
    <form>
      <h1>Account Aanmaken</h1>
      <input
        name="email"
        defaultValue={inviteData?.email}
        readOnly={!!inviteData}
      />
      <input
        name="firstName"
        defaultValue={inviteData?.firstName}
      />
      <input
        name="lastName"
        defaultValue={inviteData?.lastName}
      />
      <input name="password" type="password" placeholder="Kies wachtwoord" />
      <button type="submit">Account Aanmaken</button>
    </form>
  )
}
```

**Phased Rollout:**

| Batch | Size | Week | Expected Conversion | New Users |
|-------|------|------|---------------------|-----------|
| 1 | 10K | 1 | 20% | 2K |
| 2 | 20K | 3 | 15% | 3K |
| 3 | 50K | 6 | 12% | 6K |
| 4 | 100K | 10 | 10% | 10K |
| 5 | 320K | 16 | 8% | 25K |
| **Total** | **500K** | **16 weken** | **~10%** | **~46K users** |

**Cost Analysis:**
- Development: +16 uur (€1.200-1.600)
- Email kosten: 500K emails × €0.001 = €500
- Database: ~46K users × 1KB = 46 MB (acceptabel)
- Timeline: 16 weken rollout

---

## 💡 Oplossing 3: Lazy Account Creation on First Visit

### Concept: Automatisch Account Aanmaken Bij Eerste Bezoek

**Hoe het werkt:**

```
1. Subscriber krijgt email: "Beheer je abonnement op aboland.nl"
2. Link: aboland.nl/activate?email=xxx&token=yyy
3. Klik link → Backend:
   - Fetch subscription from THOR
   - Create user in CMS (auto-generated wachtwoord)
   - Send "Account Aangemaakt" email met wachtwoord reset link
   - Redirect to /my-account/subscriptions
4. Subscriber ziet abonnement direct
5. Kan wachtwoord instellen voor latere logins
```

**Voordelen:**
- ✅ **Frictionless** - Subscriber doet NIETS, account wordt aangemaakt
- ✅ **Hoge conversie** - Elke klik = account
- ✅ **Opt-out ipv opt-in** - Subscribers kunnen het negeren als niet geïnteresseerd

**Nadelen:**
- ⚠️ **Database groeit snel** - Elke klik = nieuwe user
- ⚠️ **GDPR concerns** - Account aanmaken zonder expliciete consent?
- ⚠️ **Wachtwoord management** - Auto-generated wachtwoorden zijn vervelend

**Implementatie:**

```typescript
// src/app/api/activate/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  // 1. Verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET!)
  if (verified.email !== email) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  // 2. Check if user already exists
  let user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })

  if (!user) {
    // 3. Fetch subscription from THOR
    const thorApi = new ThorApiService()
    const subscriptions = await thorApi.getSubscriptionsByEmail(email)

    if (!subscriptions.length) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    const subscription = subscriptions[0]

    // 4. Create user in CMS
    const autoPassword = generateSecurePassword() // Random 16-char password

    user = await payload.create({
      collection: 'users',
      data: {
        email,
        password: autoPassword,
        firstName: subscription.receiver.firstName,
        lastName: subscription.receiver.lastName,
      },
    })

    // 5. Cache subscriptions
    for (const sub of subscriptions) {
      await cacheService.upsertSubscription(sub, user.id)
    }

    // 6. Send "Account Created" email with password reset link
    const resetToken = await generatePasswordResetToken(email)
    await sendAccountCreatedEmail(email, resetToken)
  }

  // 7. Create session and redirect
  const session = await createSession(user.id)
  return NextResponse.redirect('/my-account/subscriptions')
}
```

**Activation Email Template:**

```html
Subject: Beheer je Winelife abonnement online

Hoi Jan,

Klik op de link hieronder om je abonnement online te beheren:

https://aboland.nl/activate?email=jan@example.com&token=TOKEN

Je account wordt automatisch aangemaakt.
Daarna kun je een wachtwoord instellen voor toekomstige logins.

Groeten,
Team Aboland
```

**Cost Analysis:**
- Development: +12 uur (€900-1.200)
- Email kosten: €500 (500K emails)
- Database: Onbekend (afhankelijk van klik-rate)
- Risico: Database kan snel groeien (30-50% klik-rate = 150K-250K users)

---

## 💡 Oplossing 4: Hybrid Approach (BESTE VAN ALLES) ⭐

### Concept: Combinatie van Alle Strategieën

**Segmentatie:**

```
500K THOR Subscribers
    ↓
    ├─ Segment A: "Power Users" (10K - 20K)
    │  → Frequent website bezoekers
    │  → Stuur invite email (Oplossing 2)
    │  → Maak permanent account aan
    │
    ├─ Segment B: "Occasional Users" (50K - 100K)
    │  → Bezoeken website 1-2x/jaar
    │  → Magic Link (Oplossing 1)
    │  → Optioneel account aanmaken na 2e bezoek
    │
    └─ Segment C: "Non-Digital" (380K - 440K)
       → Gebruiken website nooit
       → Geen actie (blijven in THOR)
       → Magic Link beschikbaar als ze ooit willen
```

**Strategie:**

**Fase 1: Power Users (Week 1-4)**
```typescript
// Criteria voor "Power Users":
const powerUsers = await thorApi.getSubscriptions({
  // Filters (if THOR supports):
  hasEmail: true,
  emailOptIn: true,
  hasMultipleSubscriptions: true,
  // Or: manually segment based on historical data
})

// Send invite emails (Oplossing 2)
await sendInviteBatch(powerUsers, { permanent: true })

// Expected: 10K-20K accounts created
```

**Fase 2: Magic Link voor Rest (Week 5+)**
```typescript
// Voor alle anderen: Magic Link beschikbaar
// Landingspagina: aboland.nl/mijn-abonnement

// Als subscriber Magic Link vaak gebruikt (3x in 6 maanden):
// → Auto-suggest permanent account
```

**Fase 3: Auto-Conversion (Maand 6+)**
```typescript
// Als Magic Link user 3x+ heeft ingelogd:
await sendAccountUpgradeEmail(email, {
  message: "Je gebruikt je abonnement vaak online! Maak een permanent account voor makkelijker inloggen."
})
```

**Voordelen:**
- ✅ **Best of all worlds** - Permanent accounts voor frequent users, Magic Link voor occasionals
- ✅ **Beheerste groei** - Database groeit organisch (10K-50K users)
- ✅ **Flexibel** - Subscribers kiezen zelf (impliciete opt-in)
- ✅ **Performance** - Database blijft beheersbaar
- ✅ **User experience** - Power users krijgen beste ervaring

**Cost Analysis:**
- Development: +20 uur (€1.500-2.000)
- Email kosten: ~€200 (alleen power users)
- Database: ~20K-50K users (1-2 GB, acceptabel)
- Timeline: 4-6 weken rollout

---

## 📊 Vergelijking Alle Opties

| Option | Dev Cost | DB Users | Timeline | UX | Complexity |
|--------|----------|----------|----------|-----|-----------|
| **1. Magic Link** | €600-800 | 0 | 2 weken | ⭐⭐⭐ | ⭐ (Low) |
| **2. Invite Flow** | €1.2K-1.6K | ~46K | 16 weken | ⭐⭐⭐⭐ | ⭐⭐⭐ (Medium) |
| **3. Lazy Creation** | €900-1.2K | 150K-250K | 8 weken | ⭐⭐⭐⭐ | ⭐⭐ (Low-Med) |
| **4. Hybrid** ⭐ | €1.5K-2K | 20K-50K | 6 weken | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ (High) |

---

## 🎯 Aanbeveling voor Aboland

### Optie 4: Hybrid Approach ⭐

**Waarom:**
1. **Beste UX** - Power users krijgen permanent account, occasionals gebruiken Magic Link
2. **Beheerste groei** - Database groeit organisch naar 20K-50K (acceptabel)
3. **Flexibel** - Kan aanpassen op basis van data
4. **Schaalbaarheid** - Performance blijft goed

**Implementatie Roadmap:**

```
Week 1-2: Magic Link implementeren (baseline voor iedereen)
Week 3-4: Power User invite flow (10K-20K users)
Week 5-8: Monitoring, optimalisatie
Week 9+: Auto-conversion voor frequent Magic Link users
```

**Kosten:**
- Development: €1.500 - €2.000 (bovenop basis €4.500)
- Email: ~€200
- Database: 20K-50K users (1-2 GB, geen probleem)
- **Totaal: €6.200 - €6.700**

**ROI:**
- 20K-50K users met self-service = €20K-50K besparing/jaar op support
- Terugverdientijd: 2-4 maanden

---

## 🔒 GDPR Compliance

**Voor alle opties:**

### 1. **Consent**
```typescript
// In invite email:
"Door je account aan te maken, ga je akkoord met onze privacy policy."

// In Magic Link:
"We gebruiken je email en adres alleen voor authenticatie."
```

### 2. **Data Minimization**
```typescript
// Alleen opslaan wat nodig is:
- Email (authenticatie)
- Naam (personalisatie)
- Session tokens (tijdelijk)

// NIET opslaan:
- Volledige adres (tenzij user wil opslaan)
- Payment info (blijft in THOR)
```

### 3. **Right to be Forgotten**
```typescript
// Delete account flow:
async function deleteAccount(userId: string) {
  // Delete CMS user
  await payload.delete({ collection: 'users', id: userId })

  // Delete cached subscriptions
  await db.delete(thorSubscriptions).where(eq(userId))

  // Subscription blijft in THOR (source of truth)
}
```

### 4. **Data Portability**
```typescript
// Export user data:
async function exportUserData(userId: string) {
  const user = await payload.findByID({ collection: 'users', id: userId })
  const subscriptions = await getSubscriptions(userId)

  return {
    user: { email, name },
    subscriptions: subscriptions.map(s => ({
      magazineName: s.magazineName,
      status: s.isActive,
      // etc
    }))
  }
}
```

---

## 🎯 Decision Matrix

**Vraag voor klant:**

> **Hoeveel van uw 500K subscribers verwacht u actief de webshop te gebruiken?**

| Verwachting | Aanbevolen Optie |
|-------------|------------------|
| < 5% (25K users) | **Optie 1: Magic Link** (goedkoopst, simpelst) |
| 5-15% (25K-75K) | **Optie 4: Hybrid** ⭐ (beste balans) |
| 15-30% (75K-150K) | **Optie 2: Invite Flow** (gefaseerd, controleerbaar) |
| > 30% (150K+) | **Architectuur heroverwegen** (mogelijk dedicated subscription platform) |

---

## 📝 Next Steps

1. **Bespreek met klant:**
   - Hoeveel subscribers verwachten actief de webshop te gebruiken?
   - Voorkeur voor Magic Link vs. Permanent Accounts?
   - Budget voor extra development (€600-€2.000)?

2. **Choose option** gebaseerd op antwoorden

3. **Update kosten in presentatie**

4. **Implementeer gekozen strategie**

---

**Conclusie:**

✅ **JA, het is mogelijk om alle 500K subscribers toegang te geven!**

Maar de beste aanpak hangt af van:
- Verwacht gebruik (hoeveel subscribers gebruiken webshop echt?)
- Budget (€600 - €2.000 extra)
- Gewenste UX (Magic Link vs. Permanent Account)

**Aanbeveling: Start met Optie 4 (Hybrid) - beste balans tussen kosten, UX en schaalbaarheid.**

---

**Laatst bijgewerkt:** 22 Februari 2026
