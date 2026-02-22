# Master Implementatieplan: Aboland Magazine Features

**Datum:** 22 februari 2026
**Client:** Aboland (aboland01.compassdigital.nl)
**Type:** Tijdschriften-abonnementen webshop (5.000+ titels)

---

## Context

Aboland verkoopt tijdschriften in twee vormen:
1. **Abonnementen** — variable products met variaties (bijv. 3 nummers persoonlijk, 6 nummers persoonlijk/cadeau)
2. **Losse nummers** — simple products per editie (bijv. WINELIFE #99 2026, €7.95)

Er zijn drie features die gebouwd moeten worden:
- **Feature 1:** Abonnementspagina met prijstabel (producttemplate)
- **Feature 2:** "Nieuwste editie" notificaties (email + opt-in)
- **Feature 3:** Meilisearch "nieuwste eerst" standaard sortering

---

## Feature 1: Abonnements-Producttemplate

### Wat het moet doen
Wanneer een product van type `variable` wordt bekeken en het gaat om een abonnement, moet een **prijstabel** getoond worden i.p.v. de standaard variant-dropdown. Voorbeeld van Aboland:

```
┌────────────────────────────────────────────────────────────┐
│ WINELIFE Abonnement                                         │
│                                                              │
│ ┌──────────────┬─────────────┬──────────┬────────────────┐  │
│ │              │ Looptijd    │ Korting  │ Prijs          │  │
│ ├──────────────┼─────────────┼──────────┼────────────────┤  │
│ │ ● Persoonlijk│ 3 nummers   │ 28%      │ €15,00         │  │
│ │ ○ Persoonlijk│ 6 nummers   │ 34%      │ €27,50         │  │
│ │ ○ Cadeau     │ 6 nummers   │ 34%      │ €27,50         │  │
│ └──────────────┴─────────────┴──────────┴────────────────┘  │
│                                                              │
│ [ In Winkelwagen ]                                           │
└────────────────────────────────────────────────────────────┘
```

### Implementatie

#### Stap 1: Voeg `isSubscription` veld toe aan Products
**Bestand:** `src/branches/ecommerce/collections/Products.ts`

In de Basis Info tab, voeg een checkbox toe na `productType`:

```typescript
{
  name: 'isSubscription',
  type: 'checkbox',
  label: 'Dit is een abonnementsproduct',
  defaultValue: false,
  admin: {
    description: 'Toont een prijstabel i.p.v. standaard variant selector',
    condition: (data) => data.productType === 'variable',
  },
},
```

#### Stap 2: Voeg abonnementsvelden toe aan variant values
**Bestand:** `src/branches/ecommerce/collections/Products.ts`

In de `variantOptions.values` array, voeg extra velden toe:

```typescript
// In products_variant_options_values structuur:
{
  name: 'subscriptionType',
  type: 'select',
  label: 'Type',
  options: [
    { label: 'Persoonlijk', value: 'personal' },
    { label: 'Cadeau', value: 'gift' },
    { label: 'Proef', value: 'trial' },
  ],
  admin: {
    condition: (data, siblingData, { user }) => {
      // Only show if parent product isSubscription = true
      return true; // Use admin.condition on parent if possible
    },
  },
},
{
  name: 'issues',
  type: 'number',
  label: 'Aantal nummers',
},
{
  name: 'discountPercentage',
  type: 'number',
  label: 'Korting %',
  min: 0,
  max: 100,
},
{
  name: 'autoRenew',
  type: 'checkbox',
  label: 'Automatisch verlengen',
  defaultValue: true,
},
```

#### Stap 3: Maak SubscriptionPriceTable component
**Nieuw bestand:** `src/branches/shared/components/shop/SubscriptionPriceTable.tsx`

```typescript
'use client'

import { useState } from 'react'

type Variant = {
  label: string
  value: string
  priceModifier: number
  subscriptionType?: string
  issues?: number
  discountPercentage?: number
}

type Props = {
  basePrice: number
  variants: Variant[]
  onSelect: (variant: Variant) => void
}

export function SubscriptionPriceTable({ basePrice, variants, onSelect }: Props) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="font-bold text-sm">Kies je abonnement</h3>
      </div>
      <div className="divide-y">
        {variants.map((variant, i) => {
          const price = basePrice + (variant.priceModifier || 0)
          return (
            <button
              key={variant.value}
              onClick={() => { setSelected(i); onSelect(variant) }}
              className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${
                selected === i ? 'bg-[var(--color-primary)]/.05' : 'hover:bg-gray-50'
              }`}
            >
              {/* Radio */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selected === i ? 'border-[var(--color-primary)]' : 'border-gray-300'
              }`}>
                {selected === i && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />}
              </div>

              {/* Type */}
              <span className="text-sm font-medium w-28">
                {variant.subscriptionType === 'gift' ? 'Cadeau' : 'Persoonlijk'}
              </span>

              {/* Issues */}
              <span className="text-sm text-gray-600">
                {variant.issues || '?'} nummers
              </span>

              {/* Discount badge */}
              {variant.discountPercentage && (
                <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  -{variant.discountPercentage}%
                </span>
              )}

              {/* Price */}
              <span className="font-bold text-sm">
                €{price.toFixed(2).replace('.', ',')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

#### Stap 4: Integreer in product template
**Bestand:** `src/app/(app)/shop/[slug]/page.tsx` (of het product detail template)

```typescript
// In de product detail page, check isSubscription:
{product.isSubscription && product.variantOptions?.[0]?.values ? (
  <SubscriptionPriceTable
    basePrice={product.price}
    variants={product.variantOptions[0].values}
    onSelect={(variant) => setSelectedVariant(variant)}
  />
) : (
  // Bestaande variant selector (dropdown/radio)
  <VariantSelector ... />
)}
```

---

## Feature 2: "Meld mij bij nieuwe editie" Notificaties

### Wat het moet doen
1. Op elke productpagina van een los nummer: knop "Meld mij bij nieuwe editie"
2. Gebruiker vult email in (of is al ingelogd)
3. Wanneer een NIEUW product wordt gepubliceerd met dezelfde tijdschrift-naam (bijv. "WINELIFE"), krijgen alle geabonneerde gebruikers een email

### Implementatie

#### Stap 1: Maak EditionNotifications collectie
**Nieuw bestand:** `src/branches/ecommerce/collections/EditionNotifications.ts`

```typescript
import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

export const EditionNotifications: CollectionConfig = {
  slug: 'edition-notifications',
  admin: {
    hidden: shouldHideCollection('shop'),
    useAsTitle: 'email',
    defaultColumns: ['email', 'magazineTitle', 'active', 'createdAt'],
    group: 'E-commerce',
  },
  access: {
    read: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    create: () => true, // Publiek: iedereen kan zich aanmelden
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          label: 'E-mailadres',
        },
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          label: 'Gebruiker',
          admin: { description: 'Optioneel, als de gebruiker ingelogd was' },
        },
      ],
    },
    {
      name: 'magazineTitle',
      type: 'text',
      required: true,
      label: 'Tijdschrift',
      admin: {
        description: 'Bijv. "WINELIFE" — wordt gematcht tegen nieuwe producttitels',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: 'Oorspronkelijk product',
      admin: {
        description: 'Het product waarop de gebruiker klikte',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          label: 'Actief',
        },
        {
          name: 'lastNotified',
          type: 'date',
          label: 'Laatst gemaild',
          admin: { readOnly: true },
        },
      ],
    },
  ],
  timestamps: true,
}
```

#### Stap 2: Registreer collectie
**Bestand:** `src/payload.config.ts`

```typescript
import { EditionNotifications } from '@/branches/ecommerce/collections/EditionNotifications'

// In collections array, bij E-COMMERCE section:
_col(EditionNotifications),
```

#### Stap 3: Voeg `magazineTitle` toe aan Products
**Bestand:** `src/branches/ecommerce/collections/Products.ts`

In de Basis Info tab:

```typescript
{
  name: 'magazineTitle',
  type: 'text',
  label: 'Tijdschrift naam',
  admin: {
    description: 'Bijv. "WINELIFE" — wordt gebruikt voor editie-notificaties. Alle producten met dezelfde naam worden als edities van hetzelfde blad behandeld.',
    position: 'sidebar',
  },
},
```

#### Stap 4: Product afterChange hook voor notificaties
**Nieuw bestand:** `src/branches/ecommerce/hooks/notifyEditionSubscribers.ts`

```typescript
import type { CollectionAfterChangeHook } from 'payload'
import { getEmailService } from '@/lib/email/EmailService'

export const notifyEditionSubscribers: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  // Alleen bij NIEUW product dat gepubliceerd wordt
  if (operation !== 'create') return doc
  if (doc.status !== 'published') return doc
  if (!doc.magazineTitle) return doc

  const { payload } = req

  try {
    // Vind alle actieve notificatie-abonnees voor dit tijdschrift
    const subscribers = await payload.find({
      collection: 'edition-notifications',
      where: {
        magazineTitle: { equals: doc.magazineTitle },
        active: { equals: true },
      },
      limit: 1000,
    })

    if (subscribers.docs.length === 0) return doc

    const emailService = getEmailService()
    if (!emailService.isConfigured()) {
      console.warn('[EditionNotify] Email service not configured')
      return doc
    }

    // Stuur email naar elke abonnee
    for (const sub of subscribers.docs) {
      try {
        await emailService.send({
          to: sub.email,
          subject: `Nieuwe editie: ${doc.title} nu beschikbaar!`,
          html: generateEditionEmail(doc),
        })

        // Update lastNotified
        await payload.update({
          collection: 'edition-notifications',
          id: sub.id,
          data: { lastNotified: new Date().toISOString() },
        })
      } catch (err) {
        console.error(`[EditionNotify] Failed to email ${sub.email}:`, err)
      }
    }

    console.log(`[EditionNotify] Notified ${subscribers.docs.length} subscribers for ${doc.magazineTitle}`)
  } catch (err) {
    console.error('[EditionNotify] Hook error:', err)
  }

  return doc
}

function generateEditionEmail(product: any): string {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://aboland01.compassdigital.nl'
  return `
    <div style="font-family: Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #018360; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Aboland</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #0A1628; margin-top: 0;">Nieuwe editie beschikbaar!</h2>
        <p style="color: #475569; font-size: 16px;">
          <strong>${product.title}</strong> is nu beschikbaar in onze webshop.
        </p>
        ${product.shortDescription ? `<p style="color: #64748b; font-size: 14px;">${product.shortDescription}</p>` : ''}
        <p style="font-size: 20px; font-weight: bold; color: #018360;">
          €${product.price?.toFixed(2).replace('.', ',')}
        </p>
        <a href="${siteUrl}/shop/${product.slug}" style="display: inline-block; background: #018360; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Bekijk & Bestel →
        </a>
      </div>
      <div style="background: #f8faf9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
        <p>Je ontvangt deze email omdat je notificaties hebt ingeschakeld voor ${product.magazineTitle || 'dit tijdschrift'}.</p>
        <p>Aboland | De Trompet 1739, 1967 DB Heemskerk</p>
      </div>
    </div>
  `
}
```

#### Stap 5: Registreer hook in Products
**Bestand:** `src/branches/ecommerce/collections/Products.ts`

```typescript
import { notifyEditionSubscribers } from '../hooks/notifyEditionSubscribers'

// In de collection config:
hooks: {
  afterChange: [notifyEditionSubscribers],
},
```

#### Stap 6: Frontend "Meld mij" component
**Nieuw bestand:** `src/branches/shared/components/shop/NotifyMeButton.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Bell, BellRing, Check } from 'lucide-react'

type Props = {
  productId: string | number
  magazineTitle: string
  userEmail?: string // Pre-fill als ingelogd
}

export function NotifyMeButton({ productId, magazineTitle, userEmail }: Props) {
  const [email, setEmail] = useState(userEmail || '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [showInput, setShowInput] = useState(false)

  async function subscribe() {
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/edition-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          magazineTitle,
          product: productId,
          active: true,
        }),
      })

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-lg">
        <Check className="w-4 h-4" />
        Je ontvangt een email bij de volgende editie van {magazineTitle}
      </div>
    )
  }

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-lg border transition-colors hover:bg-gray-50"
        style={{ borderColor: 'var(--color-border, #e5e7eb)', color: 'var(--color-text-primary, #0A1628)' }}
      >
        <Bell className="w-4 h-4" style={{ color: 'var(--color-primary, #018360)' }} />
        Meld mij bij nieuwe editie
      </button>
    )
  }

  return (
    <div className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="je@email.nl"
        className="flex-1 px-3 py-2 text-sm border rounded-lg"
        style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
      />
      <button
        onClick={subscribe}
        disabled={status === 'loading' || !email}
        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: 'var(--color-primary, #018360)' }}
      >
        <BellRing className="w-4 h-4" />
        {status === 'loading' ? 'Even geduld...' : 'Aanmelden'}
      </button>
    </div>
  )
}
```

#### Stap 7: Integreer in productpagina
Op de productdetailpagina, onder de "In winkelwagen" knop:

```typescript
{product.magazineTitle && (
  <NotifyMeButton
    productId={product.id}
    magazineTitle={product.magazineTitle}
    userEmail={user?.email}
  />
)}
```

---

## Feature 3: Meilisearch "Nieuwste Eerst" Sortering

### Wat er al is
- `createdAt` is al een sortable attribute in Meilisearch
- Products worden automatisch geïndexeerd via afterChange hook

### Wat moet veranderen

#### Stap 1: Standaard sortering aanpassen
**Bestand:** `src/lib/meilisearch/client.ts` (of waar de search wordt geconfigureerd)

Voeg `createdAt:desc` toe als standaard ranking rule of sort:

```typescript
// Bij het aanmaken/updaten van de index settings:
await index.updateRankingRules([
  'words',
  'typo',
  'proximity',
  'attribute',
  'sort',     // <-- zorgt dat sort parameter werkt
  'exactness',
])

// Of bij de default sort in de shop pagina:
const results = await index.search(query, {
  sort: ['createdAt:desc'],  // Nieuwste eerst
  // ... andere parameters
})
```

#### Stap 2: Frontend sorteer-optie
In de shop pagina, voeg "Nieuwste eerst" toe als standaard sorteeroptie:

```typescript
const sortOptions = [
  { label: 'Nieuwste eerst', value: 'createdAt:desc' },  // DEFAULT
  { label: 'Prijs laag-hoog', value: 'price:asc' },
  { label: 'Prijs hoog-laag', value: 'price:desc' },
  { label: 'Naam A-Z', value: 'title:asc' },
]
```

---

## Feature 4: Email Service Uitbreiden

### Huidige staat
De Resend email service (`src/lib/email/EmailService.ts`) heeft alleen `sendContactEmail()`.

### Wat moet toegevoegd worden

```typescript
// Voeg generieke send methode toe aan EmailService:
async send({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!this.isConfigured()) throw new Error('Email not configured')

  return this.resend.emails.send({
    from: process.env.EMAIL_FROM || 'Aboland <noreply@aboland.nl>',
    to,
    subject,
    html,
  })
}
```

---

## Implementatievolgorde

```
┌─────────────────────────────────────────────────────┐
│ Fase 1: Foundation (1-2 uur)                        │
│ ├── EmailService.send() generiek maken              │
│ ├── magazineTitle veld op Products                  │
│ ├── isSubscription veld op Products                 │
│ └── Subscription variant velden toevoegen           │
│                                                      │
│ Fase 2: EditionNotifications (2-3 uur)              │
│ ├── EditionNotifications collectie                  │
│ ├── Registreer in payload.config.ts                 │
│ ├── notifyEditionSubscribers hook                   │
│ └── Registreer hook op Products                     │
│                                                      │
│ Fase 3: Frontend Components (2-3 uur)               │
│ ├── SubscriptionPriceTable component                │
│ ├── NotifyMeButton component                        │
│ ├── Integratie in product detail template            │
│ └── Meilisearch "nieuwste eerst" default sort       │
│                                                      │
│ Fase 4: Testing & Polish (1 uur)                    │
│ ├── Test met WINELIFE producten                     │
│ ├── Email template verificatie                      │
│ └── Feature flags check                             │
└─────────────────────────────────────────────────────┘
Totaal geschat: 6-9 uur development
```

---

## Database Migraties

Na implementatie moeten de volgende DB migraties draaien:
1. `products` tabel: kolommen `is_subscription`, `magazine_title` toevoegen
2. `products_variant_options_values`: kolommen `subscription_type`, `issues`, `discount_percentage`, `auto_renew` toevoegen
3. `edition_notifications` tabel aanmaken (door Payload automatisch bij eerste run)

---

## Feature Flags

Voeg toe aan `.env` van Aboland01:
```
ENABLE_EDITION_NOTIFICATIONS=true
```

En optioneel in `features.ts`:
```typescript
editionNotifications: isFeatureEnabled('edition_notifications'),
```

---

## Samenvatting

| Feature | Complexiteit | Bestaande infra | Nieuw te bouwen |
|---------|-------------|-----------------|-----------------|
| Abonnements-prijstabel | Medium | Variable products, variants | `isSubscription` veld, PriceTable component |
| Editie-notificaties | High | Resend email, Notifications collectie | EditionNotifications collectie, hook, UI |
| Nieuwste eerst sortering | Low | Meilisearch `createdAt` sortable | Default sort aanpassen |
| Email service uitbreiden | Low | Resend geconfigureerd | Generieke `send()` methode |
