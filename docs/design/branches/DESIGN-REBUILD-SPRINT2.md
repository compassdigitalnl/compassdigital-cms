# Design Rebuild — Alle Branches Conform HTML Mockups

Dit document bevat **complete instructies** om ALLE branch-componenten en pagina's
te herschrijven zodat ze pixel-perfect overeenkomen met de HTML design mockups.

## Overzicht Branches & Design Bronnen

| Branch | Sprint | Mockups Directory | Palette | Heading Font |
|--------|--------|-------------------|---------|--------------|
| **Construction** | sprint-2 | `docs/design/sprint-2/bouw-*.html` (5 bestanden) | Navy `#0A1628` + Teal `#00897B` | Plus Jakarta Sans |
| **Zorg/Hospitality** | sprint-4 | `docs/design/sprint-4/zorg-*.html` (5 bestanden) | Navy `#0A1628` + Teal `#00897B` | Plus Jakarta Sans |
| **Beauty** | sprint-5 | `docs/design/sprint-5/beauty-*.html` (5 bestanden) | Navy `#0A1628` + Teal `#00897B` + Pink/Purple accenten | Plus Jakarta Sans |
| **Horeca** | sprint-6 | `docs/design/sprint-6/horeca-*.html` (5 bestanden) | Warm `#2C1810` + Gold `#C9A84C` | Playfair Display (serif) |
| **Plastimed/Ecommerce** | sprint-1,3,7,9 | `docs/design/sprint-{1,3,7,9}/plastimed-*.html` (8 bestanden) | Navy `#0A1628` + Teal `#00897B` | Plus Jakarta Sans / DM Serif Display |

---

# DEEL A: CONSTRUCTION BRANCH (sprint-2)

De sprint-2 HTML mockups staan in: `docs/design/sprint-2/`

---

## 0. DESIGN SYSTEM — Globale Wijzigingen

### 0a. Fonts toevoegen

De sprint-2 designs gebruiken **Plus Jakarta Sans** (headings) en **DM Sans** (body text).
Deze moeten als Google Fonts worden geladen.

**Bestand: `src/app/(construction)/layout.tsx`**

Voeg bovenaan toe:
```tsx
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})
```

En in de `<body>` of wrapper div:
```tsx
<div className={`${plusJakarta.variable} ${dmSans.variable}`}>
  {children}
</div>
```

**Bestand: `tailwind.config.mjs`** — voeg toe aan `extend.fontFamily`:
```js
fontFamily: {
  mono: ['var(--font-geist-mono)'],
  sans: ['var(--font-dm-sans)', 'var(--font-geist-sans)'],
  heading: ['var(--font-plus-jakarta)', 'var(--font-dm-sans)', 'sans-serif'],
},
```

### 0b. CSS Design Tokens

**Bestand: `src/app/globals.css`** — voeg toe in `:root`:
```css
/* ═══════════════════════════════════════════════════════
   CONSTRUCTION DESIGN TOKENS (Sprint-2)
   ═══════════════════════════════════════════════════════ */
--c-navy: #0A1628;
--c-navy-light: #121F33;
--c-teal: #00897B;
--c-teal-light: #26A69A;
--c-teal-glow: rgba(0, 137, 123, 0.12);
--c-green: #00C853;
--c-amber: #F59E0B;
--c-coral: #FF6B6B;
--c-blue: #2196F3;
--c-purple: #7C3AED;
--c-white: #FAFBFC;
--c-grey: #E8ECF1;
--c-grey-light: #F1F4F8;
--c-grey-mid: #94A3B8;
--c-grey-dark: #64748B;

/* Shadows */
--c-shadow-sm: 0 1px 2px rgba(10,22,40,.04), 0 2px 6px rgba(10,22,40,.02);
--c-shadow-md: 0 2px 8px rgba(10,22,40,.06), 0 8px 24px rgba(10,22,40,.04);
--c-shadow-lg: 0 4px 12px rgba(10,22,40,.06), 0 12px 32px rgba(10,22,40,.08);

/* Transitions */
--c-transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Border-radius */
--c-radius: 12px;
--c-radius-sm: 8px;

/* Container */
--c-container: 1200px;
--c-gutter: 24px;
```

### 0c. Tailwind Shorthand Classes (optioneel)

Voeg toe aan `tailwind.config.mjs` → `extend.colors`:
```js
// Sprint-2 construction shortcuts (naast de bestaande navy/teal)
'c-navy': '#0A1628',
'c-navy-light': '#121F33',
'c-teal': '#00897B',
'c-teal-light': '#26A69A',
'c-grey': '#E8ECF1',
'c-grey-light': '#F1F4F8',
'c-grey-mid': '#94A3B8',
'c-grey-dark': '#64748B',
```

---

## 1. ConstructionHero — Volledige Redesign

**Bestand:** `src/branches/construction/blocks/components/ConstructionHero.tsx`

**Referentie:** `docs/design/sprint-2/bouw-homepage.html` → `.hero` sectie

### Huidige problemen:
- Gebruikt generieke `bg-gradient-to-br from-secondary to-secondary/90` → moet navy gradient worden
- Geen radial glow overlays
- Hero badge is basic → moet pill shape met teal border + glow
- Buttons zijn basic → moeten specifieke hoogtes (52px primary, rounded-xl)
- Floating badges hebben geen schaduw-effecten
- Trust element is basic → sprint-2 heeft specifiekere avatar-stack styling
- Ontbreekt: decoratieve pseudo-element (radial gradient top-right)

### Gewenste output:
```tsx
<section className="relative overflow-hidden py-16 md:py-20 lg:py-24"
  style={{ background: 'linear-gradient(135deg, #0A1628 0%, #121F33 100%)' }}>

  {/* Decorative radial glows */}
  <div className="absolute inset-0 pointer-events-none"
    style={{
      background: 'radial-gradient(circle at 70% 30%, rgba(0,137,123,0.08) 0%, transparent 70%)',
    }} />
  <div className="absolute inset-0 pointer-events-none"
    style={{
      background: 'radial-gradient(circle at 30% 80%, rgba(0,137,123,0.12) 0%, transparent 60%)',
    }} />

  <div className="container mx-auto px-6 relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left: Content */}
      <div className="space-y-6">
        {/* Badge — pill shape */}
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white font-medium"
            style={{
              background: 'rgba(0,137,123,0.12)',
              border: '1.5px solid rgba(0,137,123,0.4)',
            }}>
            {badgeIcon && <Icon name={badgeIcon} size={16} className="text-teal-400" />}
            <span>{badge}</span>
          </div>
        )}

        {/* Title — Plus Jakarta Sans 800, 48px */}
        {title && (
          <h1 className="font-heading text-[40px] md:text-[48px] font-extrabold text-white leading-tight">
            {parseTitle(title)}
            {/* Highlight tekst moet teal kleur krijgen: */}
          </h1>
        )}
        {/* In parseTitle(): class "text-primary" → "text-teal-400" */}

        {/* Description — 17px, DM Sans */}
        {description && (
          <p className="text-[17px] text-white/70 leading-relaxed max-w-[500px]">
            {description}
          </p>
        )}

        {/* CTAs — specifieke hoogtes */}
        <div className="flex flex-wrap gap-3">
          {primaryCTA && (
            <Link href={primaryCTA.link || '/'}
              className="inline-flex items-center gap-2 h-[52px] px-7 bg-teal-500 text-white font-semibold rounded-xl hover:bg-navy transition-all"
              style={{ boxShadow: '0 4px 16px rgba(0,137,123,0.3)' }}>
              {primaryCTA.text}
              {primaryCTA.icon && <Icon name={primaryCTA.icon} size={20} />}
            </Link>
          )}
          {secondaryCTA?.text && (
            <Link href={secondaryCTA.link || '/'}
              className="inline-flex items-center gap-2 h-[52px] px-7 text-white font-semibold rounded-xl border-[1.5px] border-white/20 hover:bg-white/10 transition-all">
              {secondaryCTA.text}
            </Link>
          )}
        </div>

        {/* Trust Element */}
        {trustText && (
          <div className="flex items-center gap-3 pt-4">
            {avatars && avatars.length > 0 && (
              <div className="flex -space-x-2">
                {avatars.map((avatar, index) => (
                  <div key={index}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 border-[#0A1628]"
                    style={{ background: avatar.color === 'teal' ? '#00897B' : avatar.color === 'blue' ? '#2196F3' : avatar.color === 'purple' ? '#7C3AED' : '#F59E0B' }}>
                    <span className="text-white">{avatar.initials}</span>
                  </div>
                ))}
              </div>
            )}
            <div>
              <div className="text-sm font-semibold text-white">{trustText}</div>
              {trustSubtext && <div className="text-xs text-white/50">{trustSubtext}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Right: Hero Image */}
      <div className="relative">
        {heroImageUrl ? (
          <div className="relative aspect-square rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <img src={heroImageUrl} alt={title || ''} className="w-full h-full object-cover" />
          </div>
        ) : heroEmoji ? (
          <div className="aspect-square rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(0,137,123,0.08)', border: '1.5px solid rgba(255,255,255,0.1)' }}>
            <span className="text-9xl">{heroEmoji}</span>
          </div>
        ) : null}

        {/* Floating Badges — nu met schaduw en betere positie */}
        {floatingBadges?.map((badge, index) => (
          <div key={index}
            className={`absolute ${badge.position === 'bottom-left' ? 'bottom-5 -left-5' : 'top-8 -right-3'} bg-white px-4 py-3 rounded-xl flex items-center gap-3`}
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            {badge.icon && <div className="w-10 h-10 rounded-lg bg-teal-500 text-white flex items-center justify-center">
              <Icon name={badge.icon} size={20} />
            </div>}
            <div>
              <div className="text-sm font-bold text-navy">{badge.title}</div>
              {badge.subtitle && <div className="text-xs text-c-grey-mid">{badge.subtitle}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

---

## 2. StatsBar — Overlapping Design

**Bestand:** `src/branches/construction/blocks/components/StatsBar.tsx`

**Referentie:** `bouw-homepage.html` → `.stats`

### Huidige problemen:
- Geen negatieve marge (stats bar moet overlappen met hero: `mt-[-50px]`)
- Generieke kleuren
- Ontbreken: grote cijfers in teal met Plus Jakarta Sans 800
- Geen dividers per sprint-2 design

### Gewenste wijzigingen:
```tsx
<section className="relative z-10 -mt-12 md:-mt-14 px-4 mb-8">
  <div className="container mx-auto">
    <div className="bg-white rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6"
      style={{ boxShadow: 'var(--c-shadow-lg)' }}>
      {stats.map((stat, index) => (
        <div key={index} className={`text-center ${
          index < stats.length - 1 ? 'md:border-r md:border-[#E8ECF1]' : ''
        }`}>
          {/* Value — 36px Plus Jakarta Sans 800, teal */}
          <div className="font-heading text-[28px] md:text-[36px] font-extrabold text-teal-500 mb-1">
            {stat.value}
            {stat.suffix && <span className="text-[18px]">{stat.suffix}</span>}
          </div>
          {/* Label — 13px, grey-mid, 600 weight */}
          <div className="text-[13px] font-semibold text-c-grey-mid uppercase tracking-wide">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Let op:** De `suffix` prop bestaat mogelijk nog niet in het block schema. Voeg toe als nodig,
of parse het uit de `value` string (bijv. "250+" → value="250", suffix="+").

---

## 3. ServicesGrid + ServiceCard — Redesign

### 3a. ServicesGrid
**Bestand:** `src/branches/construction/blocks/components/ServicesGrid.tsx`

**Referentie:** `bouw-homepage.html` → `.services-grid`

### Gewenste wijzigingen:
- Gap: `gap-3.5` (14px) i.p.v. `gap-6`
- Heading: font-heading class
- Badge: teal kleuren

### 3b. ServiceCard — Volledige Redesign
**Bestand:** `src/branches/construction/components/ServiceCard/index.tsx`
**Styles:** `src/branches/construction/components/ServiceCard/styles.scss`

**Referentie:** `bouw-homepage.html` → `.service` card

### Huidige problemen:
- Generieke border/hover kleuren
- Geen bottom-border accent (3px teal) on hover
- Icon box is 64px → moet 52px met 14px radius
- Geen gekleurde icon backgrounds per type
- CTA link is basic → moet teal met pijl-icon
- Border-radius: 12px → moet 18px

### Gewenste SCSS (`styles.scss`):
```scss
.service-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #FAFBFC;
  border: 1.5px solid #E8ECF1;
  border-radius: 18px;
  padding: 1.5rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;

  // Bottom accent line
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #00897B;
    border-radius: 0 0 18px 18px;
    transform: scaleX(0);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    border-color: #00897B;
    transform: translateY(-3px);
    box-shadow: 0 2px 8px rgba(10,22,40,.06), 0 8px 24px rgba(10,22,40,.04);

    &::after {
      transform: scaleX(1);
    }
  }

  &__icon {
    width: 52px;
    height: 52px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    // Default icon background — kan per service-type variëren:
    background: rgba(0, 137, 123, 0.12);

    img {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }
  }

  &__title {
    font-family: var(--font-plus-jakarta), sans-serif;
    font-size: 17px;
    font-weight: 800;
    color: #0A1628;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  &__description {
    font-size: 13px;
    color: #64748B;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 13px;
    font-weight: 700;
    color: #00897B;
    text-decoration: none;
    margin-top: auto;
    transition: gap 0.2s ease;

    &:hover {
      gap: 0.625rem;
    }
  }

  &__arrow {
    transition: transform 0.2s ease;
    width: 14px;
    height: 14px;
  }

  // Badge (service type)
  &__badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.25rem 0.625rem;
    font-size: 0.6875rem;
    font-weight: 700;
    color: #0A1628;
    background: #F1F4F8;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
}
```

---

## 4. ProjectsGrid + ProjectCard — Dark Section Design

### 4a. ProjectsGrid
**Bestand:** `src/branches/construction/blocks/components/ProjectsGrid.tsx`

**Referentie:** `bouw-homepage.html` → `.section.dark` + `.projects-grid`

### Gewenste wijzigingen:
- Wrapper sectie moet navy achtergrond krijgen als de `style` prop `dark` is
- Gap: 14px
- Heading: wit op donkere achtergrond

Voeg een `style` prop toe aan het block schema als die er nog niet is:
```tsx
// In de render:
<section className={`py-12 md:py-16 lg:py-20 px-4 ${
  props.style === 'dark' ? 'bg-navy text-white' : ''
}`}>
```

### 4b. ProjectCard — Redesign
**Bestand:** `src/branches/construction/components/ProjectCard/index.tsx`
**Styles:** `src/branches/construction/components/ProjectCard/styles.scss`

**Referentie:** `bouw-homepage.html` → `.project` card + `bouw-projecten-overzicht.html` → `.project` card

### Huidige problemen:
- Image heeft geen gradient overlay (dark overlay van onder)
- Geen badges systeem (category badge als gekleurde pill, year badge, before/after badge)
- Content overlay op image ontbreekt (sprint-2 zet title/meta OVER de image met overlay)
- Card radius: 12px → moet 18px
- Image hoogte: aspect-ratio → moet 220px vast
- Geen favorite button (hart icoon)
- Footer met tags en link ontbreekt

### Gewenste SCSS (`styles.scss`):
```scss
.project-card {
  position: relative;
  background: #FAFBFC;
  border: 1.5px solid #E8ECF1;
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: #00897B;
    transform: translateY(-3px);
    box-shadow: 0 2px 8px rgba(10,22,40,.06), 0 8px 24px rgba(10,22,40,.04);

    .project-card__image {
      transform: scale(1.05);
    }
  }

  &__link {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }

  &__image-wrapper {
    position: relative;
    width: 100%;
    height: 220px;
    overflow: hidden;
    background: #F1F4F8;

    // Dark gradient overlay van boven
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(10,22,40,0.5) 0%, transparent 60%);
      z-index: 1;
      pointer-events: none;
    }
  }

  &__image {
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  // Badges row — top left
  &__badges {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    display: flex;
    gap: 4px;
    z-index: 2;
  }

  &__badge {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    backdrop-filter: blur(8px);

    &--category {
      background: #00897B;
      color: white;
    }

    &--ba {
      background: rgba(255,255,255,0.9);
      color: #0A1628;
    }

    &--year {
      background: rgba(10,22,40,0.6);
      color: white;
    }
  }

  // Content
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }

  &__category-text {
    font-size: 11px;
    color: #00897B;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 600;
    margin-bottom: 0.375rem;
  }

  &__title {
    font-family: var(--font-plus-jakarta), sans-serif;
    font-size: 16px;
    font-weight: 800;
    color: #0A1628;
    margin-bottom: 0.375rem;
    line-height: 1.3;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
    margin-bottom: 0.5rem;
  }

  &__meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 12px;
    color: #94A3B8;

    svg {
      color: #00897B;
      width: 14px;
      height: 14px;
    }
  }

  &__description {
    font-size: 13px;
    color: #64748B;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 0.75rem;
  }

  // Footer
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #E8ECF1;
    padding-top: 0.625rem;
    margin-top: auto;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 13px;
    font-weight: 700;
    color: #00897B;
  }

  &__tags {
    display: flex;
    gap: 3px;
  }

  &__tag {
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    background: #F1F4F8;
    color: #64748B;
  }
}
```

### ProjectCard TSX updates:
Voeg toe aan de JSX:
- Badges row bovenop de image (category, voor/na, year)
- Category text boven de title
- Footer met link + tags
- Verwijder de oude category badge en ba-indicator

---

## 5. ReviewsGrid + ReviewCard — Redesign

### 5a. ReviewsGrid
**Bestand:** `src/branches/construction/blocks/components/ReviewsGrid.tsx`

**Referentie:** `bouw-homepage.html` → `.reviews-grid` (op grey-light achtergrond)

### Gewenste wijzigingen:
- Background: `bg-[#F1F4F8]` (grey-light)
- Gap: 14px
- Heading: centered

### 5b. ReviewCard — Redesign
**Bestand:** `src/branches/construction/components/ReviewCard/index.tsx`
**Styles:** `src/branches/construction/components/ReviewCard/styles.scss`

**Referentie:** `bouw-homepage.html` → `.review` card

### Huidige problemen:
- Card padding: 2rem → moet 22px
- Border-radius: 12px → moet 16px
- Border: 1px → moet 1.5px
- Avatar is ronde cirkel → sprint-2 heeft een rounded-square (36px, 10px radius) met gekleurde achtergrond
- Sterren zijn SVG → sprint-2 gebruikt simpele ★ tekst in amber
- Review text: 14px italic, niet 1rem
- Hover: border moet teal worden

### Gewenste SCSS (`styles.scss`):
```scss
.review-card {
  position: relative;
  background: white;
  border: 1.5px solid #E8ECF1;
  border-radius: 16px;
  padding: 22px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;

  &:hover {
    border-color: #00897B;
    box-shadow: 0 1px 2px rgba(10,22,40,.04), 0 2px 6px rgba(10,22,40,.02);
  }

  // Stars
  &__stars {
    color: #F59E0B;
    font-size: 14px;
    margin-bottom: 0.75rem;
    letter-spacing: 2px;
  }

  // Review text
  &__text {
    font-size: 14px;
    font-style: italic;
    color: #64748B;
    line-height: 1.6;
    margin: 0 0 1rem 0;
  }

  // Author section
  &__author {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: auto;
  }

  // Avatar — rounded square
  &__avatar {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: white;
  }

  &__author-name {
    font-size: 13px;
    font-weight: 700;
    color: #0A1628;
  }

  &__author-role {
    font-size: 11px;
    color: #94A3B8;
  }
}
```

### ReviewCard TSX updates:
- Verander de rating display van SVG sterren naar tekst: `{'★'.repeat(rating)}{'☆'.repeat(5-rating)}`
- Avatar: van rond naar rounded-square met gekleurde achtergrond
- Volgorde: sterren → tekst → auteur (sprint-2 layout)

---

## 6. CTABanner — Navy Gradient Design

**Bestand:** `src/branches/construction/blocks/components/CTABanner.tsx`

**Referentie:** `bouw-homepage.html` → `.cta-banner`

### Huidige problemen:
- Gradient gebruikt generieke primary kleuren → moet navy gradient
- Geen radial teal glow overlay
- Layout: centered → sprint-2 heeft 2-kolom (tekst links, knop rechts)
- Badge is basic → moet semi-transparante witte achtergrond
- Trust elements zijn basic → moeten teal-light iconen krijgen
- Padding: generic → moet 56px, border-radius 24px

### Gewenste output:
```tsx
<section className="py-12 md:py-16 px-4">
  <div className="container mx-auto">
    <div className="relative overflow-hidden rounded-3xl p-10 md:p-14"
      style={{ background: 'linear-gradient(135deg, #0A1628 0%, #121F33 100%)' }}>

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 80% 20%, rgba(0,137,123,0.15) 0%, transparent 60%)' }} />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-300 mb-4"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              {badge}
            </div>
          )}
          <h2 className="font-heading text-2xl md:text-[28px] font-extrabold text-white mb-3">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-white/60 mb-4 max-w-lg">{description}</p>
          )}
          {trustElements?.enabled && (
            <div className="flex flex-wrap gap-4">
              {trustElements.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-teal-300">
                  <Icon name={trustIconMap[item.icon] || 'CheckCircle'} size={14} />
                  {item.text}
                </div>
              ))}
            </div>
          )}
        </div>

        {buttons && buttons.length > 0 && (
          <div className="flex flex-col gap-2">
            {buttons.map((button, i) => (
              <Link key={i} href={button.link || '/'}
                className={`inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl font-semibold text-sm transition-all ${
                  button.variant === 'primary'
                    ? 'bg-teal-500 text-white hover:bg-navy-dark'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}>
                {button.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
</section>
```

---

## 7. Service Detail Page — Volledige Redesign

**Bestand:** `src/app/(construction)/diensten/[slug]/page.tsx`

**Referentie:** `docs/design/sprint-2/bouw-dienst-detail.html`

### Huidige problemen:
- Hero is basic dark gray → moet navy gradient met breadcrumb, badge, features pills
- Layout: 3-kolom (2+1) → sprint-2 heeft `1fr 360px` met sticky sidebar
- Process steps: verticale lijst → moet 2x2 grid met genummerde cards
- USPs: basic blue box → moet 3-kolom bar met iconen
- FAQ: basic `<details>` → moet gestylde accordion met teal active border
- Sidebar: basic CTA card → moet form met navy header + telefoon card + related services
- Contact info in sidebar is hardcoded → moet dynamisch

### Volledige nieuwe structuur:

```tsx
return (
  <div className="min-h-screen bg-[#FAFBFC]">
    {/* Service Hero — navy gradient */}
    <div className="relative py-14 md:py-16"
      style={{ background: 'linear-gradient(135deg, #0A1628 0%, #121F33 100%)' }}>
      <div className="container mx-auto px-6">
        <div className="max-w-5xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-6">
            <a href="/" className="hover:text-white/70">Home</a>
            <span>›</span>
            <a href="/diensten" className="hover:text-white/70">Diensten</a>
            <span>›</span>
            <span className="text-white/70">{service.title}</span>
          </nav>

          {/* Badge */}
          {service.serviceType && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white mb-4"
              style={{ background: 'rgba(0,137,123,0.12)', border: '1.5px solid rgba(0,137,123,0.4)' }}>
              {service.serviceType === 'residential' && 'Particulier'}
              {service.serviceType === 'commercial' && 'Zakelijk'}
              {service.serviceType === 'both' && 'Particulier & Zakelijk'}
            </div>
          )}

          <h1 className="font-heading text-[32px] md:text-[40px] font-extrabold text-white leading-tight mb-4">
            {service.title}
          </h1>

          {service.shortDescription && (
            <p className="text-base text-white/40 max-w-2xl mb-6">{service.shortDescription}</p>
          )}

          {/* Feature pills */}
          {service.features && service.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {service.features.slice(0, 5).map((f, i) => (
                <span key={i} className="px-3 py-1 text-xs text-white/70 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {f.feature}
                </span>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex gap-3">
            <a href="/offerte-aanvragen" className="inline-flex items-center h-12 px-7 bg-teal-500 text-white font-semibold rounded-xl hover:bg-navy transition-all">
              Offerte aanvragen
            </a>
            <a href="tel:+31302345678" className="inline-flex items-center h-12 px-7 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/10 transition-all">
              Bel ons
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Main Layout: 2 columns */}
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

        {/* Left Column */}
        <div className="space-y-7">
          {/* Description */}
          {service.description && (
            <div>
              <h2 className="font-heading text-lg font-extrabold text-navy flex items-center gap-2 mb-3">
                <svg className="w-[18px] h-[18px] text-teal-500" .../>
                Over deze dienst
              </h2>
              <p className="text-[15px] text-c-grey-dark leading-[1.7]">{service.description}</p>
            </div>
          )}

          {/* Process Steps — 2x2 grid */}
          {service.processSteps && service.processSteps.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-extrabold text-navy mb-4">Ons werkproces</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {service.processSteps.map((step, i) => (
                  <div key={i} className="relative bg-white border-[1.5px] border-[#E8ECF1] rounded-2xl p-5 hover:border-teal-500 hover:-translate-y-0.5 transition-all"
                    style={{ boxShadow: 'var(--c-shadow-sm)' }}>
                    {/* Large number watermark */}
                    <div className="absolute top-3 right-3 font-heading text-[48px] font-extrabold text-[#F1F4F8]">
                      {i + 1}
                    </div>
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: i % 4 === 0 ? 'rgba(0,137,123,0.12)' : i % 4 === 1 ? 'rgba(33,150,243,0.12)' : i % 4 === 2 ? 'rgba(0,200,83,0.12)' : 'rgba(245,158,11,0.12)' }}>
                      <span className="text-xl">
                        {i === 0 ? '📞' : i === 1 ? '📋' : i === 2 ? '🔨' : '✅'}
                      </span>
                    </div>
                    <h3 className="font-heading text-[15px] font-extrabold text-navy mb-1.5">{step.title}</h3>
                    <p className="text-[13px] text-c-grey-dark leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features / Types Grid — 2-kolom */}
          {service.features && service.features.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-extrabold text-navy mb-4">Wat krijgt u?</h2>
              <div className="grid grid-cols-2 gap-2">
                {service.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white border border-[#E8ECF1] rounded-[10px] hover:border-teal-500 transition-colors">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                      style={{ background: 'rgba(0,137,123,0.12)' }}>
                      ✓
                    </div>
                    <span className="text-[13px] font-bold text-navy">{f.feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USP Bar — 3 kolommen */}
          {service.usps && service.usps.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {service.usps.slice(0, 3).map((usp, i) => (
                <div key={i} className="bg-white border-[1.5px] border-[#E8ECF1] rounded-[14px] p-[18px] text-center hover:border-teal-500 transition-colors">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ background: i === 0 ? 'rgba(0,137,123,0.12)' : i === 1 ? 'rgba(33,150,243,0.12)' : 'rgba(0,200,83,0.12)' }}>
                    <span className="text-xl">{i === 0 ? '🏆' : i === 1 ? '⚡' : '🛡️'}</span>
                  </div>
                  <div className="font-heading text-sm font-extrabold text-navy mb-1">{usp.usp}</div>
                </div>
              ))}
            </div>
          )}

          {/* FAQ Accordion */}
          {service.faqs && service.faqs.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-extrabold text-navy mb-4">Veelgestelde vragen</h2>
              <div className="space-y-1.5">
                {service.faqs.map((faq, i) => (
                  <details key={i} className="group bg-white border-[1.5px] border-[#E8ECF1] rounded-xl overflow-hidden open:border-teal-500 transition-colors">
                    <summary className="flex justify-between items-center p-4 cursor-pointer text-sm font-bold text-navy hover:bg-[#F1F4F8]">
                      {faq.question}
                      <svg className="w-4 h-4 text-c-grey-mid transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-4 pb-4 text-[13px] text-c-grey-dark leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* CTA Bottom — navy gradient */}
          <div className="relative overflow-hidden rounded-[20px] p-10 text-center"
            style={{ background: 'linear-gradient(135deg, #0A1628 0%, #121F33 100%)' }}>
            <h2 className="font-heading text-2xl font-extrabold text-white mb-2">
              Interesse in {service.title.toLowerCase()}?
            </h2>
            <p className="text-sm text-white/35 mb-5">
              Vraag vrijblijvend een offerte aan
            </p>
            <div className="flex justify-center gap-2">
              <a href="/offerte-aanvragen" className="h-12 px-7 bg-teal-500 text-white font-semibold rounded-xl inline-flex items-center hover:bg-navy transition-all">
                Offerte aanvragen
              </a>
              <a href="tel:+31302345678" className="h-12 px-7 text-white font-semibold rounded-xl inline-flex items-center border border-white/20 hover:bg-white/10 transition-all">
                Bel ons direct
              </a>
            </div>
          </div>
        </div>

        {/* Right Sidebar — sticky */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">

            {/* Contact Form */}
            <div className="bg-white border-[1.5px] border-[#E8ECF1] rounded-[18px] overflow-hidden"
              style={{ boxShadow: 'var(--c-shadow-md)' }}>
              {/* Header */}
              <div className="p-[18px] text-center text-white"
                style={{ background: 'linear-gradient(135deg, #0A1628 0%, #121F33 100%)' }}>
                <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-teal-400"
                  style={{ background: 'rgba(0,137,123,0.12)' }}>
                  📝
                </div>
                <div className="font-heading text-base font-extrabold">Gratis offerte</div>
                <div className="text-xs text-white/40">Reactie binnen 24 uur</div>
              </div>
              {/* Form body */}
              <div className="p-4 space-y-2">
                <div>
                  <label className="text-[11px] font-bold text-navy block mb-1">Naam</label>
                  <input className="w-full h-10 px-2.5 text-sm border-[1.5px] border-[#E8ECF1] rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-navy block mb-1">Email</label>
                  <input type="email" className="w-full h-10 px-2.5 text-sm border-[1.5px] border-[#E8ECF1] rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-navy block mb-1">Telefoon</label>
                  <input type="tel" className="w-full h-10 px-2.5 text-sm border-[1.5px] border-[#E8ECF1] rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-navy block mb-1">Bericht</label>
                  <textarea rows={3} className="w-full px-2.5 py-2 text-sm border-[1.5px] border-[#E8ECF1] rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 outline-none resize-none" />
                </div>
                <button className="w-full h-11 bg-teal-500 text-white font-semibold rounded-lg hover:bg-navy transition-all text-sm"
                  style={{ boxShadow: '0 4px 16px rgba(0,137,123,0.3)' }}>
                  Verstuur aanvraag
                </button>
                <p className="text-[10px] text-center text-c-grey-mid">Geen spam, beloofd</p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white border-[1.5px] border-[#E8ECF1] rounded-[14px] p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-teal-500"
                style={{ background: 'rgba(0,137,123,0.12)' }}>
                📞
              </div>
              <div>
                <div className="text-[10px] text-c-grey-mid font-semibold">Bel direct</div>
                <a href="tel:+31302345678" className="font-heading text-[15px] font-extrabold text-navy hover:text-teal-500 transition-colors">
                  030 234 5678
                </a>
                <div className="text-[10px] text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Nu bereikbaar
                </div>
              </div>
            </div>

            {/* Related Services */}
            {/* Fetch other services and show links */}
          </div>
        </div>
      </div>
    </div>
  </div>
)
```

---

## 8. Project Detail Page — Redesign

**Bestand:** `src/app/(construction)/projecten/[slug]/page.tsx`

**Referentie:** `docs/design/sprint-2/bouw-project-detail.html`

### Belangrijkste wijzigingen:
1. **Breadcrumb bar** — ipv hero, gebruik een lichte breadcrumb balk boven de gallery
2. **Photo Gallery Grid** — `grid-template-columns: 2fr 1fr` met `grid-template-rows: 1fr 1fr`, 460px hoogte
3. **Before/After Slider** — interactieve slider met drag handle (client component nodig)
4. **Project Header** — category text in teal, title in 30px Plus Jakarta, locatie met teal icon
5. **Specs Grid** — 4-kolom met iconen, waarde groot, label klein
6. **Process Timeline** — verticale lijn met genummerde stappen en datums
7. **Testimonial** — groot quote teken, italic tekst, avatar
8. **Sidebar** — CTA form + phone card (zelfde als dienst-detail)

### Layout structuur:
```
[breadcrumb]
[gallery grid — 2fr 1fr, 2 rows]
[before/after slider]
[grid: main (specs, beschrijving, timeline, testimonial) | sidebar (cta form, phone)]
[related projects — 3 kolommen]
```

De sidebar is identiek aan de dienst-detail sidebar. Overweeg een shared component
`ConstructionSidebar` te maken die in beide pagina's hergebruikt wordt.

---

## 9. Projects Overview Page — Redesign

**Bestand:** `src/app/(construction)/projecten/page.tsx`

**Referentie:** `docs/design/sprint-2/bouw-projecten-overzicht.html`

### Belangrijkste wijzigingen:
1. **Page Hero** — navy gradient met stats (projecten, m², klanten)
2. **Toolbar** — pill filter buttons met count badges, sort dropdown
3. **Featured Project** — eerste project als full-width 2-kolom card
4. **Project Grid** — 3-kolom met sprint-2 styled ProjectCards
5. **Pagination** — genummerde knoppen met teal actieve staat
6. **Bottom CTA** — navy sidebar-style CTA

### Filter buttons:
```tsx
<a href={href}
  className={`px-4 py-2 rounded-full text-[13px] font-bold border-[1.5px] transition-all ${
    isActive
      ? 'bg-teal-500 text-white border-teal-500'
      : 'bg-white text-c-grey-mid border-[#E8ECF1] hover:border-teal-500 hover:text-teal-500'
  }`}>
  {label}
  {count > 0 && (
    <span className="ml-1.5 text-[10px] font-bold">{count}</span>
  )}
</a>
```

---

## 10. Offerte Aanvragen Page — Redesign

**Bestand:** `src/app/(construction)/offerte-aanvragen/page.tsx`
**+ Client component:** `src/branches/construction/components/QuoteForm/index.tsx`

**Referentie:** `docs/design/sprint-2/bouw-offerte-aanvragen.html`

### Belangrijkste wijzigingen:
1. **Layout** — 2-kolom (`1fr 380px`) met sidebar
2. **Header** — minimaal, alleen logo + trust indicators + telefoon
3. **Stepper** — visuele stap-indicator met cirkels, labels en verbindingslijnen
4. **Progress bar** — 4px, teal fill, geanimeerd
5. **Form Card** — witte card met header (stap nummer, titel, beschrijving)
6. **Step 1** — 3-kolom type-selection grid met selecteerbare cards (emoji, naam, check indicator)
7. **Step 2** — 2-kolom formulier met upload zone
8. **Step 3** — budget slider met range input, option grid (multi-select)
9. **Step 4** — contact form
10. **Sidebar** — trust card + quote preview + testimonial + phone

### QuoteForm redesign highlights:

**Stepper component (bovenaan het formulier):**
```tsx
<div className="flex items-center mb-6">
  {[1, 2, 3, 4].map((step, i) => (
    <React.Fragment key={step}>
      <div className="flex flex-col items-center flex-1 z-10">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
          currentStep === step
            ? 'bg-teal-500 text-white border-teal-500 shadow-[0_0_0_4px_rgba(0,137,123,0.12)]'
            : currentStep > step
            ? 'bg-green-500 text-white border-green-500'
            : 'bg-[#F1F4F8] text-c-grey-mid border-[#E8ECF1]'
        }`}>
          {currentStep > step ? '✓' : step}
        </div>
        <span className={`text-xs font-bold mt-2 ${
          currentStep === step ? 'text-teal-500' : currentStep > step ? 'text-green-500' : 'text-c-grey-mid'
        }`}>
          {['Project', 'Details', 'Wensen', 'Contact'][i]}
        </span>
      </div>
      {i < 3 && (
        <div className={`flex-1 h-0.5 -mt-5 ${currentStep > step ? 'bg-green-500' : 'bg-[#E8ECF1]'}`} />
      )}
    </React.Fragment>
  ))}
</div>
```

**Type selection cards (step 1):**
```tsx
<div className="grid grid-cols-3 gap-2">
  {projectTypes.map((type) => (
    <div key={type.value}
      onClick={() => toggleArrayValue('projectType', type.value)}
      className={`p-4 border-2 rounded-[14px] cursor-pointer transition-all text-center ${
        formData.projectType?.includes(type.value)
          ? 'border-teal-500 bg-[rgba(0,137,123,0.06)] shadow-[0_0_0_3px_rgba(0,137,123,0.12)]'
          : 'border-[#E8ECF1] hover:border-teal-500 hover:-translate-y-0.5'
      }`}>
      <span className="text-2xl block mb-1.5">{type.emoji}</span>
      <div className="font-heading text-sm font-extrabold text-navy">{type.label}</div>
      <div className="text-[11px] text-c-grey-mid mt-0.5">{type.description}</div>
      {/* Check indicator */}
      <div className={`w-5 h-5 rounded-full border-2 mx-auto mt-2 flex items-center justify-center ${
        formData.projectType?.includes(type.value)
          ? 'bg-teal-500 border-teal-500 text-white'
          : 'border-[#E8ECF1]'
      }`}>
        {formData.projectType?.includes(type.value) && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
            <path d="M2 6l3 3 5-5" />
          </svg>
        )}
      </div>
    </div>
  ))}
</div>
```

---

## 11. Footer — Moet aangepast voor Construction

De bestaande `Footer` component wordt gedeeld. Check of deze al navy achtergrond ondersteunt.
Sprint-2 design heeft een 4-kolom footer met:
- Kolom 1 (2fr): Logo, beschrijving, social icons
- Kolom 2-4 (elk 1fr): Link lijsten (Diensten, Informatie, Contact)

Als de huidige Footer dit niet ondersteunt, maak een `ConstructionFooter` variant of
pas de bestaande Footer aan om CMS-driven kleuren te respecteren.

---

## 12. Samenvatting — Bestanden die aangepast moeten worden

| # | Bestand | Wijziging | Prioriteit |
|---|---------|-----------|------------|
| 0a | `src/app/(construction)/layout.tsx` | Plus Jakarta Sans + DM Sans fonts laden | HIGH |
| 0b | `tailwind.config.mjs` | `fontFamily.heading` toevoegen | HIGH |
| 0c | `src/app/globals.css` | Construction design tokens | HIGH |
| 1 | `src/branches/construction/blocks/components/ConstructionHero.tsx` | Navy gradient, radial glows, pill badge, specific button heights | HIGH |
| 2 | `src/branches/construction/blocks/components/StatsBar.tsx` | Negatieve marge overlap, teal cijfers, Plus Jakarta | HIGH |
| 3a | `src/branches/construction/blocks/components/ServicesGrid.tsx` | Gap 14px, heading font | MEDIUM |
| 3b | `src/branches/construction/components/ServiceCard/index.tsx` | Nieuwe card layout per sprint-2 | HIGH |
| 3c | `src/branches/construction/components/ServiceCard/styles.scss` | Volledig herschrijven (18px radius, teal accenten, bottom line) | HIGH |
| 4a | `src/branches/construction/blocks/components/ProjectsGrid.tsx` | Dark section optie, gap 14px | MEDIUM |
| 4b | `src/branches/construction/components/ProjectCard/index.tsx` | Badges, overlay, footer met tags | HIGH |
| 4c | `src/branches/construction/components/ProjectCard/styles.scss` | Volledig herschrijven (18px radius, image overlay, badges) | HIGH |
| 5a | `src/branches/construction/blocks/components/ReviewsGrid.tsx` | Grey-light achtergrond | MEDIUM |
| 5b | `src/branches/construction/components/ReviewCard/index.tsx` | Stars als tekst, rounded-square avatar | MEDIUM |
| 5c | `src/branches/construction/components/ReviewCard/styles.scss` | Herschrijven (16px radius, 22px padding, teal hover) | MEDIUM |
| 6 | `src/branches/construction/blocks/components/CTABanner.tsx` | Navy gradient, 2-kolom layout, radial glow | HIGH |
| 7 | `src/app/(construction)/diensten/[slug]/page.tsx` | Volledige redesign (hero, process grid, sidebar form) | CRITICAL |
| 8 | `src/app/(construction)/projecten/[slug]/page.tsx` | Volledige redesign (gallery, specs, timeline, sidebar) | HIGH |
| 9 | `src/app/(construction)/projecten/page.tsx` | Hero met stats, pill filters, featured card, pagination | HIGH |
| 10a | `src/app/(construction)/offerte-aanvragen/page.tsx` | 2-kolom layout met sidebar | HIGH |
| 10b | `src/branches/construction/components/QuoteForm/index.tsx` | Stepper, type cards, budget slider | HIGH |
| 10c | `src/branches/construction/components/QuoteForm/styles.scss` | Volledig herschrijven | HIGH |

---

## 13. Design Token Quick Reference

### Kleuren
| Token | Hex | Gebruik |
|-------|-----|---------|
| Navy | `#0A1628` | Achtergronden, headings, dark sections |
| Navy Light | `#121F33` | Gradient eindpunt |
| Teal | `#00897B` | Primary actie, accenten, links |
| Teal Light | `#26A69A` | Hover states, icons in dark context |
| Teal Glow | `rgba(0,137,123,0.12)` | Badge/icon achtergronden, focus rings |
| White | `#FAFBFC` | Page background |
| Grey | `#E8ECF1` | Borders |
| Grey Light | `#F1F4F8` | Section backgrounds, hover states |
| Grey Mid | `#94A3B8` | Secondary text, labels |
| Grey Dark | `#64748B` | Body text |
| Green | `#00C853` | Success, completed states |
| Amber | `#F59E0B` | Sterren, waarschuwingen |
| Coral | `#FF6B6B` | Verwijder knoppen |
| Blue | `#2196F3` | Info, alternatieve iconen |
| Purple | `#7C3AED` | Alternatieve iconen |

### Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 (hero) | Plus Jakarta Sans | 48px | 800 |
| H1 (page) | Plus Jakarta Sans | 40px | 800 |
| H2 (section) | Plus Jakarta Sans | 28-32px | 800 |
| H3 (card) | Plus Jakarta Sans | 16-18px | 800 |
| Body | DM Sans | 14-15px | 400 |
| Small | DM Sans | 12-13px | 500-600 |
| Label | DM Sans | 11-12px | 700 |
| Badge | DM Sans | 11-12px | 700 |

### Spacing & Sizing
| Element | Value |
|---------|-------|
| Container | 1200px |
| Card border-radius | 14-20px |
| Button border-radius | 8-12px (standaard), 100px (pill) |
| Card border | 1.5px |
| Input height | 40-46px |
| Button height | 44-52px |
| Card padding | 16-22px |
| Section padding | 48-64px verticaal |
| Grid gap | 8-14px |

### Hover Effects
| Element | Effect |
|---------|--------|
| Cards | `border-color: #00897B`, `translateY(-2 to -3px)`, shadow elevation |
| Buttons | Background shift (teal→navy), `translateY(-1px)` |
| Links | `color: #00897B` |
| Icons | Subtle scale or color change |

### Shadows
| Level | Value |
|-------|-------|
| sm | `0 1px 2px rgba(10,22,40,.04), 0 2px 6px rgba(10,22,40,.02)` |
| md | `0 2px 8px rgba(10,22,40,.06), 0 8px 24px rgba(10,22,40,.04)` |
| lg | `0 4px 12px rgba(10,22,40,.06), 0 12px 32px rgba(10,22,40,.08)` |

---

## 14. Volgorde van Implementatie (Aanbevolen)

1. **Fonts + Design Tokens** (0a, 0b, 0c) — alles heeft dit nodig
2. **ConstructionHero + StatsBar** (1, 2) — meteen zichtbaar op homepage
3. **ServiceCard + ProjectCard** (3b/3c, 4b/4c) — worden hergebruikt in grids EN detail pagina's
4. **ReviewCard** (5b/5c) — wordt hergebruikt
5. **Grids** (3a, 4a, 5a) — wrapper componenten, snel klaar
6. **CTABanner** (6) — snel klaar
7. **Dienst Detail Page** (7) — meest complexe pagina
8. **Project Detail Page** (8) — tweede complexe pagina
9. **Projecten Overview** (9) — filter + grid pagina
10. **Offerte Page + QuoteForm** (10a/10b/10c) — multi-step form redesign

---
---

# DEEL B: ZORG/HOSPITALITY BRANCH (sprint-4)

De sprint-4 HTML mockups staan in: `docs/design/sprint-4/`

Bestanden:
- `zorg-homepage.html` — Homepage voor zorgpraktijk (FysioVitaal)
- `zorg-behandeling-detail.html` — Behandeling detailpagina
- `zorg-contact.html` — Contact & afspraak maken
- `zorg-patienteninfo.html` — Patiënteninformatie
- `zorg-tarieven.html` — Tarieven & verzekeringen

---

## B0. DESIGN SYSTEM — Zorg-specifiek

### Palette
Zorg gebruikt **dezelfde palette** als Construction (Navy + Teal), maar met extra **status kleuren**:

| Token | Hex | Gebruik |
|-------|-----|---------|
| Navy | `#0A1628` | Achtergronden, headings, dark sections |
| Navy Light | `#121F33` | Gradient eindpunt |
| Teal | `#00897B` | Primary actie, accenten, links |
| Teal Light | `#26A69A` | Hover states, hero accenten |
| Teal Glow | `rgba(0,137,123,0.12)` | Badge/icon achtergronden |
| Green | `#00C853` | Beschikbaar, vergoed, success |
| Green Light | `#E8F5E9` | Success achtergrond |
| Coral | `#FF6B6B` | Urgentie, niet vergoed |
| Coral Light | `#FFF0F0` | Urgentie achtergrond |
| Amber | `#F59E0B` | Sterren, deels vergoed |
| Amber Light | `#FFF8E1` | Waarschuwing achtergrond |
| Blue | `#2196F3` | Info alerts |
| Blue Light | `#E3F2FD` | Info achtergrond |
| Purple | `#7C3AED` | Specialisatie badges |
| Purple Light | `#EDE9FE` | Specialisatie achtergrond |

### Typography
Zelfde als Construction:
- **Headings**: Plus Jakarta Sans 800
- **Body**: DM Sans 400-600
- **Mono** (prijzen): JetBrains Mono 400-500

### Fonts laden
**Bestand: `src/app/(hospitality)/layout.tsx`**

Voeg toe (zelfde patroon als construction):
```tsx
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})
```

---

## B1. HOMEPAGE — `zorg-homepage.html`

### Bestand
`src/app/(hospitality)/fysio/page.tsx` (of vergelijkbaar homepage bestand)

### B1a. Hero Section

**Layout**: 2-kolom grid (content + afbeelding), `gap: 48px`, `align-items: center`
**Achtergrond**: `linear-gradient(135deg, var(--c-navy), var(--c-navy-light))`
**Padding**: `72px 0 96px`
**Decoratief element**: Radial gradient orb, `radial-gradient(circle, rgba(0,137,123,.08), transparent 70%)`, `500x500px`, positie absolute rechts-boven

**Hero Badge**:
```
display: inline-flex, gap: 5px
background: rgba(0,137,123,.1)
border: 1px solid rgba(0,137,123,.2)
padding: 5px 14px, border-radius: 100px
font: 12px/700, color: teal-light
icon: 12x12px
```

**H1**: Plus Jakarta Sans, `42px`, weight `800`, line-height `1.1`
- `<em>` accent woord → color `teal-light`

**Beschrijving**: `15px`, `rgba(255,255,255,.35)`, line-height `1.6`, max-width `480px`

**Knoppen**:
- Primary: `height: 50px`, `padding: 0 26px`, bg `teal`, color `white`, shadow `0 4px 16px rgba(0,137,123,.3)`, hover → bg `white`, color `navy`
- Outline: transparant bg, `border: 1.5px solid rgba(255,255,255,.12)`, hover → border `teal`, color `teal`

**Trust items**: flex wrap, gap `14px`, font `12px`, icons `14x14px` teal

### B1b. Urgentie Balk (StatsBar equivalent)

**Positie**: `margin-top: -40px`, `z-index: 10` — overlapt de hero
**Container**: white bg, `border: 1.5px solid var(--c-grey)`, `border-radius: 18px`, `padding: 18px 28px`, `box-shadow: var(--c-shadow-md)`

**Beschikbaarheid indicator**:
- Groene knipperende stip: `animation: blink 2s infinite` (opacity `1 → 0.4`)
- Tekst: "Vandaag beschikbaar" in teal

### B1c. Diensten Grid

**Grid**: variabel kolommen (3-4), `gap: 10-14px`
**Kaart**:
```
background: white
border: 1.5px solid var(--c-grey)
border-radius: 16px
padding: 24px
hover: border-color teal, translateY(-3px), shadow-md
transition: 0.15s
```

**Icon**: `48x48px`, `border-radius: 14px`
**Titel**: Plus Jakarta Sans, `15px`, `800`
**Beschrijving**: `12px`, grey-dark
**Link**: `12px`, teal, flex met pijl-icon

### B1d. Team Sectie

**Grid**: 4 kolommen, `gap: 12px`
**Kaart**:
```
background: white
border: 1.5px solid var(--c-grey)
border-radius: 16px
overflow: hidden
```

**Afbeelding**: `180px` hoogte, centered
**Badge** (bv "Praktijkhouder"): absolute top-right `8px`, padding `2px 8px`, radius `4px`, bg `teal`, color `white`, font `10px 700`
**Body**: padding `14px`
**Naam**: `14px 800`
**Rol**: `12px teal 600`
**Specialisatie**: `11px grey-mid`

### B1e. Reviews Grid

Zelfde patroon als Construction ReviewCard maar met **platform badge**:
- Platform badge: `11px 700 grey-mid`
- Stars: `14px amber`
- Text: `13px italic grey-dark`, line-height `1.6`
- Author avatar: `32x32px`, `8px` radius
- Author naam: `12px 700`
- Detail: `10px grey-mid`

### B1f. Verzekeringen Strip

**Layout**: flex wrap, gap `6px`
**Badge**:
```
border: 1.5px solid var(--c-grey)
padding: 8px 16px
border-radius: 8px
background: white
font: 12px/700 grey-mid
icon: 16x16px teal
```

### B1g. CTA Banner

**Achtergrond**: `linear-gradient(135deg, var(--c-navy), var(--c-navy-light))`
**Border-radius**: `20px`
**Padding**: `40px`
**Layout**: flex, `justify-content: space-between`, `align-items: center`
**Knop**: `height: 48px`, `padding: 0 24px`

---

## B2. BEHANDELING DETAIL — `zorg-behandeling-detail.html`

### Bestand
`src/app/(hospitality)/behandelingen/[slug]/page.tsx`

### B2a. Service Hero

**Achtergrond**: `linear-gradient(135deg, var(--c-navy), var(--c-navy-light))`
**Padding**: `48px 0`
**Grid**: `1fr auto`, gap `32px`, align-items `end`

**Breadcrumb**:
```
display: flex, gap: 6px
font: 12px
links: rgba(255,255,255,.3)
separator: 12x12px icon, color rgba(255,255,255,.1)
current: teal-light, weight 600
```

**Stats** (rechts in hero):
```
flex column, gap: 8px
elke stat: bg rgba(255,255,255,.04), border 1px rgba(255,255,255,.06)
border-radius: 12px, padding: 12px 16px, text-center, min-width: 120px
nummer: 22px/800 teal-light
label: 10px rgba(255,255,255,.3)
```

**Chips** (onder titel):
```
padding: 5px 12px, border-radius: 6px
bg: rgba(255,255,255,.04), border: 1px rgba(255,255,255,.06)
font: 12px/600, color: rgba(255,255,255,.4)
icon: 13x13px teal
```

### B2b. Page Layout

**Grid**: `1fr 360px`, gap `24px`
**Sidebar**: `position: sticky`, `top: 96px`

### B2c. Content Secties

**Symptoms Grid**:
```
grid: 2 kolommen, gap: 6px
item: flex gap 8px, padding 10px 12px, bg white
border: 1.5px var(--c-grey), radius 10px
font: 13px/600, icon: 16x16px teal
hover: border-color teal
```

**Process Steps**:
```
item: flex gap 12px, padding 14px, bg white
border: 1.5px var(--c-grey), radius 14px
hover: border-color teal

nummer: 36x36px, radius 10px, bg teal, color white
font: 15px/800, display flex center
titel: 14px/800
beschrijving: 12px grey-dark, line-height 1.4
```

**Results Grid**:
```
grid: 3 kolommen, gap 8px
item: bg white, border 1.5px var(--c-grey), radius 12px
padding: 16px, text-center
hover: border-color teal
icon: 28px
nummer: 22px/800 teal
label: 11px grey-mid
```

**FAQ Accordion**:
```
container: flex column, gap 4px
item: bg white, border 1.5px var(--c-grey), radius 12px, overflow hidden
vraag: padding 14px 16px, font 14px/700
display flex space-between, cursor pointer
hover: color teal
icon: 16x16px grey-mid, transition transform 0.2s
antwoord: padding 0 16px 14px, font 13px grey-dark, line-height 1.6
display: none (show wanneer .open)
open state: icon rotate(180deg) + color teal
```

**Related Treatments**:
```
grid: 2 kolommen, gap 8px
item: bg white, border 1.5px var(--c-grey), radius 12px
padding: 14px, flex gap 10px, cursor pointer
hover: border-color teal
icon: 24px, naam: 13px/800
beschrijving: 11px grey-mid
pijl: 14x14px grey-mid, margin-left auto
```

### B2d. Sidebar Componenten

**Side Card** (standaard):
```
bg: white, border: 1.5px var(--c-grey), radius: 16px
padding: 18px, margin-bottom: 10px, shadow: var(--c-shadow-sm)
titel: 15px/800, icon: 16x16px teal
```

**Afspraak Formulier**:
```
label: 11px/700, margin-bottom: 3px
required indicator: color coral, 10px
input: width 100%, height 42px, padding 0 12px
border: 1.5px var(--c-grey), radius 8px (var(--radius-sm))
font: 13px DM Sans, color navy
focus: border-color teal, shadow 0 0 0 3px var(--c-teal-glow)
select: appearance none, custom dropdown SVG
textarea: height 60px, padding 8px 12px, resize none
submit: width 100%, height 44px, bg teal, color white
radius var(--c-radius), font 14px/800 Plus Jakarta Sans
shadow: 0 4px 16px rgba(0,137,123,.3)
hover: bg navy
```

**Info Rijen**:
```
display: flex, gap: 8px, padding: 8px 0
border-bottom: 1px var(--c-grey), last-child no border
icon container: 28x28px, radius 6px
label: 10px grey-mid
value: font-weight 700
```

**Verzekering Tags**:
```
display: flex wrap, gap: 3px
tag: padding 4px 8px, radius 4px, font 10px/700
vergoed: bg green-light, color green
deels: bg amber-light, color amber
niet: bg coral-light, color coral
```

**Telefoon Card**:
```
bg: var(--c-navy), radius: 14px, padding: 14px
display: flex gap 10px, color: white
icon container: 36x36px, radius 10px, bg rgba(0,137,123,.15)
icon: 16x16px teal
label: 10px rgba(255,255,255,.3)
nummer: 15px/800 Plus Jakarta Sans
beschikbaar: 10px teal
```

---

## B3. CONTACT & AFSPRAAK — `zorg-contact.html`

### Bestand
`src/app/(hospitality)/contact/page.tsx`

### B3a. Page Hero

```
bg: linear-gradient(135deg, var(--c-navy), var(--c-navy-light))
padding: 44px 0, text-align: center
decoratief: radial-gradient(circle at 50% 100%, rgba(0,137,123,.06), transparent 70%)
badge: 11px/700 teal-light, padding 4px 12px, radius 100px
titel: 34px/800 white
beschrijving: 14px rgba(255,255,255,.3), max-width 520px, margin 0 auto
```

### B3b. Contact Strip

**Positie**: `margin-top: -36px`, `z-index: 10`
**Grid**: 4 kolommen, gap `8px`
**Contact Card**:
```
bg: white, border: 1.5px var(--c-grey), radius: 14px
padding: 16px, text-center, shadow: var(--c-shadow-sm)
hover: border-color teal, translateY(-2px)
icon container: 40x40px, radius 10px, centered
titel: 13px/800
waarde: 13px teal 700
sub: 10px grey-mid
```

### B3c. Urgentie Alert

```
display: flex, gap: 10px, padding: 14px 18px
bg: var(--c-coral-light) (#FFF0F0)
border: 1.5px rgba(255,107,107,.2), radius: 14px
icon: 36x36px, radius 10px, bg white, icon 18px coral
titel: 14px/800 #991B1B
text: 12px #7F1D1D
```

### B3d. Formulier Card

```
bg: white, border: 1.5px var(--c-grey), radius: 20px
overflow: hidden, shadow: var(--c-shadow-md)

header: padding 18px 22px, border-bottom 1px var(--c-grey)
icon: 36x36px, radius 10px, bg teal-glow, icon 18px teal
titel: 18px/800
beschrijving: 12px grey-mid
body: padding 22px
```

**Type Selector** (afspraaktype):
```
grid: 3 kolommen, gap 6px
item: padding 10px 8px, border 1.5px var(--c-grey), radius 10px
text-center, cursor pointer, transition 0.12s
hover: border-color teal
selected: border-color teal, bg teal-glow
icon: 20px, naam: 11px/700
```

**Tijdvoorkeur knoppen**:
```
display: flex, gap: 4px, flex-wrap
button: padding 6px 12px, border 1.5px var(--c-grey), radius 6px
font: 11px/700, color grey-mid, cursor pointer
hover: border-color teal, color teal
selected: border-color teal, bg teal-glow, color teal
```

**Submit**:
```
width: 100%, height: 50px, bg: teal, color: white
radius: var(--c-radius), font: 15px/800 Plus Jakarta Sans
shadow: 0 4px 16px rgba(0,137,123,.3)
hover: bg navy
icon: 16x16px
```

### B3e. Sidebar

**Direct Contact Card** (dark):
```
bg: var(--c-navy), radius: 16px, padding: 16px, color: white
titel: 14px/800, icon 14px teal
rijen: flex gap 8px, padding 6px 0, border-bottom 1px rgba(255,255,255,.06)
icon container: 28x28px, radius 6px, bg rgba(0,137,123,.15)
label: 10px rgba(255,255,255,.3)
waarde: 13px/700
```

**Locatie Card**:
```
kaart placeholder: 150px hoogte, radius 12px
gradient bg: 135deg grey-light → grey
kaart link: 11px/700 teal, flex centered gap 3px
adres items: flex gap 6px, font 12px
icon: 24x24px, radius 6px
```

**Openingstijden**:
```
grid: flex column, gap 3px
rij: flex space-between, font 12px, padding 3px 0
border-bottom: 1px var(--c-grey)
dag: weight 700
tijd: grey-mid
vandaag: color teal, weight 700
notitie: 10px teal 700, flex gap 3px
```

**Team Beschikbaarheid**:
```
items: flex gap 8px, padding 6px 0, border-bottom 1px var(--c-grey)
avatar: 28x28px, radius 8px
naam: 12px/700
specialisatie: 10px grey-mid
status: margin-left auto, flex gap 3px, font 10px/700
dot: 6x6px radius 50%
  groen: bg green (beschikbaar)
  amber: bg amber (beperkt)
  grijs: bg grey-mid (niet beschikbaar)
```

### B3f. Layout

**Grid**: `1fr 380px`, gap `24px`

**Responsive** (`< 900px`):
- Grid → 1 kolom
- Contact strip → 2 kolommen
- Formulier rijen → 1 kolom
- Type grid → 1 kolom

---

## B4. PATIËNTENINFO — `zorg-patienteninfo.html`

### Bestand
`src/app/(hospitality)/patienteninfo/page.tsx` (NOG NIET GEÏMPLEMENTEERD — nieuw bestand)

### B4a. Quick Navigation

```
display: flex justify-center, gap: 6px, flex-wrap
padding: 18px 0
link: padding 8px 16px, radius 100px, font 12px/700
border: 1.5px var(--c-grey), bg white, color grey-mid
hover: border-color teal, color teal
active: bg teal, color white, border-color teal
icon: 14x14px
```

### B4b. Content Layout

**Grid**: `1fr 320px`, gap `24px`

### B4c. Info Blocks

```
bg: white, border: 1.5px var(--c-grey), radius: 16px
padding: 20px, margin-bottom: 12px
titel: 16px/800, icon 16px teal
text: 13px grey-dark, line-height 1.6
```

### B4d. Checklist

```
container: flex column, gap 4px
item: flex gap 8px, padding 10px 14px, bg white
border: 1.5px var(--c-grey), radius 10px
font: 13px/600, hover: border-color teal

checkbox: 22x22px, radius 6px, border 2px var(--c-grey)
  done: border-color teal, bg teal, icon white
```

### B4e. Stappen

```
container: flex column, gap 6px
item: flex gap 12px, padding 14px, bg white
border: 1.5px var(--c-grey), radius 14px
nummer: 36x36px, radius 10px, bg teal, color white, font 15px/800
titel: 14px/800
beschrijving: 12px grey-dark, line-height 1.4
```

### B4f. Alert Boxes

Drie varianten:

**Waarschuwing (.alert.warn)**:
```
bg: var(--c-amber-light), border: 1px rgba(245,158,11,.15)
color: #92400E
icon container: 32x32px, radius 8px
```

**Info (.alert.info)**:
```
bg: var(--c-blue-light), border: 1px rgba(33,150,243,.15)
color: #1565C0
```

**Gevaar (.alert.danger)**:
```
bg: var(--c-coral-light), border: 1px rgba(255,107,107,.15)
color: #B91C1C
```

### B4g. Downloads

```
container: flex column, gap 4px
item: flex gap 10px, padding 12px, bg white
border: 1.5px var(--c-grey), radius 10px
hover: border-color teal

icon: 36x36px, radius 8px
naam: 13px/700
grootte: 10px grey-mid

download knop: margin-left auto
32x32px, radius 8px, border 1.5px var(--c-grey)
icon: 14x14px teal
hover: border-color teal
```

### B4h. Sidebar

**Afspraak Card** (dark):
```
bg: var(--c-navy), radius: 16px, padding: 18px
color: white, text-center
titel: 15px/800
beschrijving: 11px rgba(255,255,255,.3)
knop: width 100%, height 42px, bg teal, radius 8px
font: 13px/800, hover: bg white, color navy
telefoon: 11px rgba(255,255,255,.3)
```

**Sidebar Links**:
```
display: flex, gap: 6px, padding: 6px 0
border-bottom: 1px var(--c-grey)
font: 12px/600, color navy
hover: color teal
icon: 14x14px teal
pijl: margin-left auto, 12x12px grey-mid
```

---

## B5. TARIEVEN — `zorg-tarieven.html`

### Bestand
`src/app/(hospitality)/tarieven/page.tsx` (NOG NIET GEÏMPLEMENTEERD — nieuw bestand)

### B5a. Key Message Box

```
bg: var(--c-green-light), border: 1.5px rgba(0,200,83,.2)
radius: 16px, padding: 18px 24px
display: flex, gap: 12px
icon: 40x40px, radius 10px, bg white, icon 20px green
text: 14px/600 green
sub: 12px grey-dark 400
```

### B5b. Tarief Tabel Card

```
card: bg white, border 1.5px var(--c-grey), radius 18px
overflow: hidden, shadow: var(--c-shadow-sm)

header: padding 16px 20px, bg grey-light
border-bottom 1.5px var(--c-grey)
titel: 16px/800, icon 18px teal
notitie: 11px grey-mid 600

tabel: width 100%, border-collapse collapse
thead th: padding 10px 16px, font 12px/700 grey-mid
text-transform uppercase, letter-spacing 0.03em
border-bottom 1.5px var(--c-grey)

tbody tr: border-bottom 1px var(--c-grey)
hover: bg grey-light
td: padding 12px 16px, font 13px

prijs: 14px/700 teal, font-family JetBrains Mono
duur: color grey-mid

vergoeding badges:
  vergoed: bg green-light, color green
  deels: bg amber-light, color amber
  niet: bg coral-light, color coral
  elke badge: padding 2px 8px, radius 4px, font 10px/700
```

### B5c. Vergoeding Checker

```
card: bg white, border 1.5px var(--c-grey), radius 18px
padding: 24px, shadow: var(--c-shadow-sm)
titel: 18px/800, icon 20px teal
beschrijving: 13px grey-dark

form rij: grid 1fr 1fr auto, gap 8px, align-items end
label: 11px/700
input: width 100%, height 44px, padding 0 12px
border: 1.5px var(--c-grey), radius var(--c-radius)
focus: border-color teal, ring 0 0 0 3px teal-glow

check knop: height 44px, padding 0 20px
bg teal, color white, font 13px/800, radius var(--c-radius)
hover: bg navy

resultaat: margin-top 12px, padding 14px, radius 12px
bg green-light, border 1px rgba(0,200,83,.15)
font: 13px green, icon 18px
```

### B5d. Uitleg Cards

```
grid: 2 kolommen, gap 12px
card: bg white, border 1.5px var(--c-grey), radius 16px
padding: 20px, hover: border-color teal
icon: 28px, margin-bottom 6px
titel: 16px/800
text: 13px grey-dark, line-height 1.5
lijst items: flex gap 5px, font 12px grey-dark
check icon: 12px teal
```

### B5e. Verzekeraars Grid

```
grid: 4 kolommen, gap 8px
card: bg white, border 1.5px var(--c-grey), radius 12px
padding: 14px, text-center, hover: border-color teal
naam: 13px/800
status: flex centered gap 3px, font 11px/700 green, icon 12px
detail: 10px grey-mid
```

### B5f. FAQ Accordion

Zelfde patroon als B2c FAQ — zie boven.

### B5g. CTA Banner

```
bg: linear-gradient(135deg, var(--c-navy), var(--c-navy-light))
radius: 20px, padding: 36px
display: flex space-between

titel: 22px/800 white
beschrijving: 13px rgba(255,255,255,.35)
knoppen: flex gap 8px
  fill: height 46px, padding 0 22px, bg teal, color white
    hover: bg white, color navy
  ghost: transparent, border 1.5px rgba(255,255,255,.12)
    hover: border-color teal
```

---

## B6. Volgorde van Implementatie — Zorg/Hospitality

1. **Fonts + Tokens** (B0) — base voor alles
2. **Homepage Hero + Urgentie Balk** (B1a, B1b)
3. **Diensten Grid + Team Sectie** (B1c, B1d)
4. **Behandeling Detail** (B2) — meest complexe pagina
5. **Contact & Afspraak** (B3)
6. **Patiënteninfo** (B4) — nieuw bestand
7. **Tarieven** (B5) — nieuw bestand

### Herbruikbare Componenten
| Component | Gebruikt op |
|-----------|-------------|
| `SideCard` | Behandeling detail, Contact, Patiënteninfo, Tarieven |
| `AlertBox` (warn/info/danger) | Patiënteninfo, Contact |
| `FAQ Accordion` | Behandeling detail, Tarieven |
| `TelefoonCard` (dark) | Behandeling detail, Contact |
| `VerzekeringsTag` | Behandeling detail, Homepage, Tarieven |
| `StepCard` | Patiënteninfo, Behandeling detail |

---
---

# DEEL C: BEAUTY BRANCH (sprint-5)

De sprint-5 HTML mockups staan in: `docs/design/sprint-5/`

Bestanden:
- `beauty-homepage.html` — Homepage salon
- `beauty-behandelingen.html` — Behandelingen overzicht
- `beauty-boeken.html` — Booking flow (4 stappen)
- `beauty-contact.html` — Contact pagina
- `beauty-portfolio.html` — Portfolio / Before-After gallery

---

## C0. DESIGN SYSTEM — Beauty-specifiek

### Palette
Beauty gebruikt de **Navy + Teal base** maar voegt **Pink en Purple accenten** toe:

| Token | Hex | Gebruik |
|-------|-----|---------|
| Navy | `#0A1628` | Achtergronden, headings |
| Teal | `#00897B` | Primary knoppen, links, prijzen |
| Teal Light | `#26A69A` | Hover states |
| Teal Glow | `rgba(0,137,123,0.12)` | Badges, icon bg |
| **Pink** | `#EC4899` | "Nieuw" tags, featured |
| **Pink Light** | `#FCE7F3` | Pink tag achtergrond |
| **Purple** | `#7C3AED` | "Specialist" tags |
| **Purple Light** | `#EDE9FE` | Purple tag achtergrond |
| Green | `#00C853` | Beschikbaar indicators |
| Green Light | `#E8F5E9` | Success achtergrond |
| Amber | `#F59E0B` | Sterren, promo tags |
| Amber Light | `#FFF8E1` | Promo achtergrond |
| Coral | `#FF6B6B` | Gesloten, warning |

### Extra CSS Tokens
**Bestand: `src/app/globals.css`** — voeg toe in `:root`:
```css
/* ═══════════════════════════════════════════════════════
   BEAUTY DESIGN TOKENS (Sprint-5)
   ═══════════════════════════════════════════════════════ */
--b-pink: #EC4899;
--b-pink-light: #FCE7F3;
--b-purple: #7C3AED;
--b-purple-light: #EDE9FE;
```

### Fonts
Zelfde als Construction/Zorg:
- **Headings**: Plus Jakarta Sans 800
- **Body**: DM Sans 400-600
- **Prijzen**: JetBrains Mono 400-700

---

## C1. HOMEPAGE — `beauty-homepage.html`

### Bestand
`src/app/(beauty)/salon/page.tsx`

### C1a. Topbar

```
bg: var(--c-navy), height: auto, padding: 8px 0
color: rgba(255,255,255,.35)
font: 12px
icons: 12px teal
layout: flex space-between
items: flex gap 4px (icon + text)
```

### C1b. Header

```
height: 72px, bg: white, sticky top 0 z-index 200
border-bottom: 1px var(--c-grey)

logo: Plus Jakarta Sans, 20px/800
logo mark: 36x36px, bg teal, radius 10px, white icon

nav items: font 13.5px/600, padding 10px 16px, radius 8px
hover/active: color teal, bg teal-glow

CTA button: height 42px, padding 0 20px
bg teal, color white, font 13px/800
radius var(--c-radius-sm) (8px)
```

### C1c. Hero Section

**Achtergrond**: `linear-gradient(135deg, var(--c-navy), var(--c-navy-light))`
**Padding**: `72px 0 96px`
**Grid**: 2 kolommen, gap `48px`, align-items center
**Decoratief**: radial gradient orb 500px, `rgba(0,137,123,.08)`

**Hero Badge**: Zelfde als Zorg/Construction — pill shape, teal kleuren

**H1**: Plus Jakarta Sans, `42px/800`, line-height `1.1`
- `<em>` accent → color `teal-light`

**Beschrijving**: `15px`, `rgba(255,255,255,.35)`, max-width `480px`

**Knoppen**: Zelfde patroon als Zorg

**Trust items**: flex wrap, gap `14px`, font `12px`

**Hero Visual** (rechts):
```
width: 100%, max-width: 440px, aspect-ratio: 4/3
border-radius: 20px
bg: rgba(0,137,123,.04)
border: 1px rgba(255,255,255,.06)

floating badges (2 stuks): position absolute
radius: 14px, padding: 10px 14px
icon box: 32x32px, radius 8px
main text: 12px/700
sub text: 10px
```

### C1d. Stats Card

**Positie**: `margin-top: -40px`, `z-index: 10`
**Grid**: 4 kolommen, gap `16px`
**Container**: white bg, `1.5px` border grey, `18px` radius, `20px 28px` padding

```
stat box: border-right (behalve laatste)
nummer: Plus Jakarta Sans, 28px/800, color teal
label: 12px/600, color grey-mid
```

### C1e. Behandelingen Grid

**Grid**: 4 kolommen, gap `10px`

**Treatment Card**:
```
bg: white, border: 1.5px var(--c-grey), radius: 16px
hover: border-color teal, translateY(-3px), shadow-md

afbeelding: 150px hoogte
tags (absolute top-right 8px): font 9px/700, radius 4px
  popular: bg teal, color white
  specialist: bg purple, color white
  nieuw: bg pink, color white

body: padding 14px
naam: Plus Jakarta Sans, 15px/800, color teal
beschrijving: 12px grey-dark, line-height 1.4
meta: flex space-between, font 11px
prijs: JetBrains Mono, 14px/700, color teal
duur: 11px grey-mid met icon
link: 11px teal, met pijl icon
```

### C1f. Over Ons Sectie

**Grid**: 2 kolommen, gap `40px`, align-items center

**Afbeelding**: aspect-ratio `4/3`, radius `20px`

**Content**:
```
badge: inline-flex, padding 4px 12px, radius 100px
font: 11px, bg teal, color white (of teal kleuren)

titel: Plus Jakarta Sans, 28px/800
paragrafen: 14px grey-dark, line-height 1.6

waarden grid: 2x2, gap 8px
item: flex start, padding 10px, bg grey-light, radius 10px
icon: 28x28px, radius 8px, bg teal-glow
titel: 12px/700
beschrijving: 11px grey-mid
```

### C1g. Team Sectie

Zelfde patroon als Zorg Team (B1d) — 4 kolommen, member cards.

### C1h. Reviews Sectie

**Achtergrond**: white (sectie-level)
**Grid**: 3 kolommen, gap `12px`
Zelfde kaart patroon als Zorg Reviews (B1e).

### C1i. Instagram Gallery

```
grid: 6 kolommen, gap: 6px
items: aspect-ratio 1:1, radius 12px
overlay: absolute inset 0, bg rgba(10,22,40,.5)
flex centered, icon 20px white
hover: overlay opacity 1
```

### C1j. Cadeaubon Banner

```
bg: linear-gradient(135deg, var(--c-navy), var(--c-navy-light))
radius: 20px, padding: 36px
flex space-between, align-items center

links: flex gap 16px
icon: 48px
titel: Plus Jakarta Sans, 22px/800 white
beschrijving: 13px rgba(255,255,255,.35)

knop: height 48px, padding 0 24px
bg teal, color white, font 14px/800
```

### C1k. CTA Banner

```
bg: white, border: 2px solid var(--c-teal), radius: 20px
padding: 36px, flex space-between, align-items center

titel: Plus Jakarta Sans, 24px/800
beschrijving: 13px grey-dark

knoppen: flex gap 8px
  fill: bg teal, color white, hover bg navy
  ghost: bg white, color navy, border 1.5px grey, hover border teal
```

---

## C2. BEHANDELINGEN OVERZICHT — `beauty-behandelingen.html`

### Bestand
`src/app/(beauty)/behandelingen/page.tsx` (of vergelijkbaar)

### C2a. Sticky Toolbar

```
bg: white, border-bottom: 1px var(--c-grey)
padding: 10px 0, position sticky top 72px z-index 100

category knoppen: padding 7px 14px, radius 100px
font: 12px/700, border 1.5px var(--c-grey), bg white, color grey-mid
icon: 13px
hover: border teal, color teal
active: bg teal, color white, border teal
```

### C2b. Page Layout

**Grid**: `1fr 300px`, gap `24px`

### C2c. Categorie Secties

```
margin-bottom: 24px per sectie
header: flex items-center gap 8px, margin-bottom 10px
border-bottom: 2px var(--c-grey), padding-bottom 6px
icon: 24px
naam: Plus Jakarta Sans, 20px/800
count: 12px grey-mid 600
```

### C2d. Treatment Item (lijst)

```
display: flex items-center, gap: 12px, padding: 14px
border: 1.5px var(--c-grey), bg white, radius: 14px
hover: border-color teal

icon: 44x44px, radius 12px, centered, flex-shrink 0

info (flex 1):
  naam: Plus Jakarta Sans, 14px/800, flex items-center gap 4px
  tag: padding 2px 6px, radius 3px, font 9px/700
    popular: bg teal-glow, color teal
    nieuw: bg pink-light, color pink
    promo: bg amber-light, color amber
  beschrijving: 11px grey-mid

rechts (flex-shrink 0):
  duur: 11px grey-mid 600, flex gap 3px
  prijs: JetBrains Mono, 15px/700, color teal, min-width 65px, text-right
  boek knop: 34x34px, radius 8px, bg teal, color white
```

### C2e. Sidebar — Speciale Aanbieding

```
bg: linear-gradient(135deg, var(--c-navy), var(--c-navy-light))
radius: 16px, padding: 18px, color: white

badge: padding 3px 8px, radius 4px, font 10px/700, bg teal
titel: Plus Jakarta Sans, 16px/800
beschrijving: 12px rgba(255,255,255,.35)

prijs: flex baseline gap 6px
  oud: 14px line-through, rgba(255,255,255,.3)
  nieuw: Plus Jakarta Sans, 22px/800, color teal-light

knop: width 100%, height 38px, bg teal, color white
font: 12px/800, gap 8px
```

### C2f. Sidebar — Pakket Cards

```
card: padding 12px, border 1.5px var(--c-grey), radius 12px, margin-bottom 6px
naam: 13px/700, flex gap 4px, icon teal
beschrijving: 11px grey-mid
meta: flex space-between
  duur: 11px grey-mid
  prijs: JetBrains Mono, bold, teal
```

### C2g. Sidebar — Cadeaubon Mini

```
bg: var(--c-navy), radius: 14px, padding: 14px
text-center, color: white
icon: 28px, titel: 14px/800
beschrijving: 11px rgba(255,255,255,.3)
knop: width 100%, height 36px, bg teal, color white, font 12px/800
```

---

## C3. BOOKING FLOW — `beauty-boeken.html`

### Bestand
`src/app/(beauty)/boeken/page.tsx` (of vergelijkbaar)

### C3a. Progress Bar

```
bg: white, border-bottom: 1px var(--c-grey), padding: 14px 0
position: sticky top 72px z-index 100
display: flex centered, gap: 4px

stap: flex items-center gap 1.5
padding: 6px 14px, radius: 100px, font: 12px/700

done: bg green-light, color green, checkmark icon
active: bg teal, color white, nummer
default: color grey-mid, nummer

separator: width 24px, height 2px
  done: bg green
  default: bg grey
```

### C3b. Step Card

```
bg: white, border: 1.5px var(--c-grey), radius: 20px
shadow: var(--c-shadow-sm)

header: padding 18px 22px, border-bottom 1px var(--c-grey)
  stap nummer: 11px/700 uppercase, tracking 0.04em, color teal
  titel: Plus Jakarta Sans, 20px/800
  beschrijving: 12px grey-mid

body: padding 22px
```

### C3c. Stap 1: Behandeling Selectie

**Category buttons**: flex gap `3px`, flex-wrap, font `11px/700`

**Treatment list**:
```
flex column, gap 4px
item: flex items-center gap 10px, padding 12px
border: 1.5px var(--c-grey), radius 12px

radio: 18x18px, radius 50%, border 2px grey
  selected: border teal, inner dot teal

icon: 18px, flex-shrink 0
naam: 13px/700
beschrijving: 10px grey-mid
prijs: JetBrains Mono, 13px/700, teal
duur: 10px grey-mid
```

### C3d. Stap 2: Stylist Selectie

```
grid: 2 kolommen, gap 8px
card: padding 14px, border 1.5px var(--c-grey), radius 14px, text-center

afbeelding: 56x56px, radius 14px, bg grey-light
naam: 13px/700
rol: 10px teal 600
beschikbaar: 10px grey-mid, flex centered gap 3px
  dot: 5x5px radius indicator (groen/amber/grijs)

selected: border teal, bg teal-glow
```

### C3e. Stap 3: Datum/Tijd

**Kalender navigatie**:
```
flex space-between, margin-bottom 10px
maand: Plus Jakarta Sans, 16px/800
knoppen: 32x32px, radius 8px, border 1.5px var(--c-grey)
```

**Kalender grid**:
```
7 kolommen, gap 3px
header: 10px grey-mid 600, padding 4px
dagen: aspect 1:1, font 13px/600, flex centered
border: 1.5px transparent
  disabled: grey text, cursor default
  today: border teal
  selected: bg teal, color white
```

**Tijdsloten**:
```
label: 12px/700, flex gap 4px met icon
grid: 4 kolommen, gap 4px
slot: padding 8px, border 1.5px, radius 8px, font 13px/700, centered
  unavailable: grey text, line-through, cursor default
  selected: bg teal, color white
```

### C3f. Step Navigation

```
flex space-between, margin-top 14px
terug: bg white, color grey-mid, border 1.5px var(--c-grey)
  hover: border teal, color teal
volgende: bg teal, color white
  hover: bg navy
```

### C3g. Sidebar Summary

```
position: sticky, top: 96px
card: bg white, border 1.5px var(--c-grey), radius 18px
padding: 20px, shadow: var(--c-shadow-sm)

titel: Plus Jakarta Sans, 15px/800, flex gap 5px

rijen: flex space-between, padding 6px 0
border-bottom: 1px var(--c-grey), font 13px
label: grey-mid, flex gap 4px met icon
waarde: bold

totaal: flex space-between, padding-top 10px
border-top: 2px var(--c-navy)
font: Plus Jakarta Sans, 16px/800

knop: width 100%, height 46px, bg teal, color white
font: 14px/700, flex centered gap 6px
shadow: 0 4px 16px rgba(0,137,123,.3)
```

**Trust lijst**:
```
flex column gap 4px, margin-top 10px
items: flex gap 5px, font 11px grey-mid
icon: 12px teal
```

---

## C4. CONTACT — `beauty-contact.html`

### Bestand
`src/app/(beauty)/contact/page.tsx` (of vergelijkbaar)

### C4a. Contact Strip

**Grid**: 3 kolommen, gap `10px` (niet 4 zoals bij Zorg)
**Cards**:
```
bg: white, border: 1.5px var(--c-grey), radius: 16px
padding: 20px, text-center, shadow: var(--c-shadow-sm)
hover: border-color teal, translateY(-2px)

icon: 48x48px, radius 14px, centered, font 22px
titel: Plus Jakarta Sans, 15px/800
waarde: 14px teal 700
sub: 11px grey-mid
```

### C4b. Formulier Card

Zelfde structuur als Zorg Contact (B3d), maar met **onderwerp selector**:

```
grid: 3 kolommen, gap 6px
item: padding 10px 8px, border 1.5px var(--c-grey), radius 10px, text-center
icon: 20px, naam: 11px/700
hover: border teal
selected: border teal, bg teal-glow
```

### C4c. Sidebar

Zelfde patronen als Zorg, plus:

**Social Grid**:
```
grid: 2 kolommen, gap 6px
link: flex items-center gap 6px, padding 10px
border: 1.5px var(--c-grey), radius 10px
font: 12px/700
icon: 28x28px, radius 8px
handle: 10px grey-mid 600
```

**Cadeaubon Mini**: Zelfde als C2g.

---

## C5. PORTFOLIO — `beauty-portfolio.html`

### Bestand
`src/app/(beauty)/portfolio/page.tsx` (of vergelijkbaar)

### C5a. Toolbar

```
bg: white, border-bottom: 1px var(--c-grey)
padding: 10px 0, sticky top 72px
flex space-between, flex-wrap gap 8px

categorie knoppen: zelfde als C2a

view toggle: flex gap 2px
  knoppen: 36x36px, radius 8px, border 1.5px var(--c-grey)
  bg white, flex centered, icon 16px
  hover/active: border teal, bg teal-glow
```

### C5b. Before/After Sectie

**Titel**: Plus Jakarta Sans, `22px/800`, flex gap `6px`, icon `20px` teal
**Grid**: 3 kolommen, gap `12px`

**BA Card**:
```
bg: white, border: 1.5px var(--c-grey), radius: 16px
overflow: hidden

afbeelding container: grid 2 kolommen, position relative
  afbeeldingen: aspect-ratio 3/4, flex centered
  labels: position absolute, padding 2px 8px, radius 4px, font 9px/700, color white
    before: left 8px, bg grey-mid
    after: right 8px, bg teal
  scheidslijn: position absolute left 50%, top 0 bottom 0, 2px white, z-index 2

body: padding 12px
  behandeling: Plus Jakarta Sans, 13px/800
  stylist: 11px teal 600
  beschrijving: 11px grey-mid
```

### C5c. Gallery Grid

```
grid: 4 kolommen, gap: 8px
item: bg white, border 1.5px var(--c-grey), radius 14px, overflow hidden

afbeelding: aspect-ratio 1:1, flex centered, position relative
  overlay: absolute inset 0, bg rgba(10,22,40,.6)
  flex column centered
  icon: 20px white
  text: 10px rgba(255,255,255,.7) bold
  hover: overlay opacity 1

categorie badge: absolute top-left 6px
  padding 2px 6px, radius 3px, font 9px/700

body: padding 10px
  titel: 12px/700
  meta: flex gap 4px, font 10px grey-mid
```

### C5d. CTA Strip

```
bg: linear-gradient(135deg, var(--c-navy), var(--c-navy-light))
radius: 20px, padding: 32px
flex space-between items-center

titel: Plus Jakarta Sans, 20px/800 white
beschrijving: 13px rgba(255,255,255,.35)

knoppen: flex gap 8px
  fill: bg teal, color white, hover bg white + color navy
  ghost: transparent, border 1.5px rgba(255,255,255,.12), hover border teal
```

### C5e. Instagram Strip

```
margin-top: 24px, text-center
titel: Plus Jakarta Sans, 16px/800, flex centered gap 4px, icon 18px teal
grid: 8 kolommen, gap 4px
items: aspect-ratio 1:1, radius 8px, overflow hidden
hover: scale(1.05)
```

---

## C6. Volgorde van Implementatie — Beauty

1. **Tokens + Fonts** (C0) — pink/purple toevoegen
2. **Homepage Hero + Stats** (C1c, C1d)
3. **Treatment Card** (C1e) — herbruikbaar component
4. **Treatment Item** (C2d) — lijst-variant voor overzicht
5. **Booking Flow** (C3) — meest complex (4 stappen)
6. **Before/After Card** (C5b) — uniek component
7. **Gallery Grid** (C5c)
8. **Contact** (C4) — formulier + sidebar
9. **Instagram Gallery** (C1i, C5e)

### Herbruikbare Componenten
| Component | Gebruikt op |
|-----------|-------------|
| `TreatmentCard` (grid) | Homepage, Behandelingen |
| `TreatmentItem` (lijst) | Behandelingen overzicht |
| `BeforeAfterCard` | Portfolio |
| `GalleryItem` | Portfolio |
| `StepCard` | Booking flow |
| `SidebarCard` | Alle pagina's |
| `CadeaubonMini` | Behandelingen, Contact |
| `StylistCard` | Booking flow, Homepage |

---
---

# DEEL D: HORECA BRANCH (sprint-6)

De sprint-6 HTML mockups staan in: `docs/design/sprint-6/`

Bestanden:
- `horeca-homepage.html` — Restaurant homepage
- `horeca-evenementen.html` — Evenementen & pakketten
- `horeca-menukaart.html` — Menukaart met filters
- `horeca-over-ons.html` — Over ons met team & tijdlijn
- `horeca-reserveren.html` — Reserveringsformulier

> **LET OP**: De Horeca branch gebruikt een **COMPLEET ANDER** design system dan alle andere branches!
> - Andere kleuren: Warm Brown + Gold (in plaats van Navy + Teal)
> - Ander heading font: Playfair Display serif (in plaats van Plus Jakarta Sans)
> - Warme, donkere sfeer in plaats van koele navy

---

## D0. DESIGN SYSTEM — Horeca-specifiek

### Palette

| Token | Hex | Gebruik |
|-------|-----|---------|
| **Warm** | `#2C1810` | Primary dark bg, headers, footer |
| **Warm Light** | `#3D2419` | Gradient eindpunt |
| **Gold** | `#C9A84C` | Primary accent, knoppen, prijzen |
| **Gold Light** | `rgba(201,168,76,.12)` | Badge achtergronden, hover states |
| **Cream** | `#FDF8F0` | Sectie achtergronden |
| **BG** | `#FAFAF8` | Page background |
| Grey | `#E8ECF1` | Borders |
| Grey Light | `#F1F4F8` | Light backgrounds |
| Grey Mid | `#94A3B8` | Secondary text |
| Grey Dark | `#64748B` | Body text |
| Green | `#00C853` | Vegetarisch badge |
| Teal | `#00897B` | Alternatief accent (sommige tags) |
| Coral | `#FF6B6B` | Allergenen |
| Amber | `#F59E0B` | Sterren |

### CSS Tokens
**Bestand: `src/app/globals.css`** — voeg toe in `:root`:
```css
/* ═══════════════════════════════════════════════════════
   HORECA DESIGN TOKENS (Sprint-6)
   ═══════════════════════════════════════════════════════ */
--h-warm: #2C1810;
--h-warm-light: #3D2419;
--h-gold: #C9A84C;
--h-gold-light: rgba(201,168,76,.12);
--h-cream: #FDF8F0;
--h-bg: #FAFAF8;
```

### Typography

**BELANGRIJK**: Horeca gebruikt **Playfair Display** (serif) voor headings!

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 (hero) | Playfair Display | 52px | 700 |
| H1 (pagina) | Playfair Display | 38-44px | 700 |
| H2 (sectie) | Playfair Display | 28-34px | 700 |
| H3 (card) | Playfair Display | 16-22px | 700 |
| Body | DM Sans | 12-15px | 400-600 |
| Knoppen/UI | Plus Jakarta Sans | 11-15px | 700-800 |
| Prijzen | JetBrains Mono | 14-18px | 700 |

### Fonts laden
**Bestand: `src/app/(horeca)/layout.tsx`**

```tsx
import { Playfair_Display, DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
})
```

**Bestand: `tailwind.config.mjs`** — voeg toe:
```js
fontFamily: {
  serif: ['var(--font-playfair)', 'Georgia', 'serif'],
  // ... bestaande sans/mono entries
},
```

---

## D1. HOMEPAGE — `horeca-homepage.html`

### Bestand
`src/app/(horeca)/restaurant/page.tsx` (of vergelijkbaar)

### D1a. Header

```
height: 72px, bg: var(--h-warm), sticky top 0 z-index 200
color: white

logo: Playfair Display, 20px
  accent (<em>): italic, color gold

nav: font 13.5px DM Sans 600, padding 10px 16px, radius 8px
  hover: bg gold-light, color gold

CTA knop: height 42px, padding 0 20px
  bg gold, color warm, font 13px/800 Plus Jakarta Sans
  radius 8px
  hover: bg white, color warm
```

### D1b. Hero Section

**Achtergrond**: `linear-gradient(135deg, var(--h-warm), var(--h-warm-light))`
**Padding**: `80px 0 96px`
**Decoratief**: `radial-gradient(circle, rgba(201,168,76,.06), transparent 70%)` — goud in plaats van teal!
**Grid**: 2 kolommen, gap `48px`

**Hero Badge**:
```
inline-flex, gap: 5px
border: 1px solid rgba(201,168,76,.25)  ← GOUD
color: gold
padding: 5px 14px, radius: 100px, font: 12px/700
```

**H1**: Playfair Display, `52px/700`, line-height `1.1`
- `<em>` italic → color `gold`

**Beschrijving**: `15px`, `rgba(255,255,255,.35)`

**Knoppen**:
- Primary: bg `gold`, color `warm` (donker op goud!), hover → bg `white`
- Outline: transparant, border `1.5px rgba(255,255,255,.12)`, hover border `gold`

**Openingstijden** (in hero):
```
semi-transparant: bg rgba(255,255,255,.03), border rgba(255,255,255,.06)
radius: 10px, padding: 8px 12px
keuken sluiting: color gold
```

### D1c. Menu Highlights

**Sectie header** (herbruikbaar patroon):
```
text-center, margin-bottom: 32px
badge: bg gold-light, color gold, radius 100px
titel: Playfair Display, 34px/700
subtitel: 14px grey-dark
```

**Filter knoppen**:
```
font: 13px/700, border 1.5px var(--c-grey)
hover: border gold, color gold
active: bg gold, color white (of warm), border gold
```

**Dish Cards**:
```
bg: white, border: 1.5px var(--c-grey), radius: 18px
hover: border-color gold, translateY(-3px), shadow-md

afbeelding: 180px hoogte
tags (absolute top-left): font 9px, radius 4px
  chef choice: bg gold, color warm
  vegetarisch: bg green-light, color green
  nieuw: bg teal, color white

body: padding 14px
naam: Playfair Display, 16px/700
prijs: JetBrains Mono, 15px/700, color gold  ← GOUD
beschrijving: 12px grey-dark

dieet badges: font 9px, light backgrounds
  vegan, glutenvrij, lactosevrij, etc.
```

**"Bekijk menu" knop**:
```
bg: var(--h-warm), color: gold
font: 13px/700
```

### D1d. Reservering Banner

```
grid: 2 kolommen, bg: var(--h-warm), radius: 24px

links: padding 44px, flex column justify-center
badge: border 1px rgba(201,168,76,.25), color gold
titel: Playfair Display, 28px/700, color white
beschrijving: 13px rgba(255,255,255,.35)
features: gold icons, 11px text

knoppen:
  fill: bg gold, color warm, height 46px
    hover: bg white
  ghost: transparent, border 1.5px rgba(255,255,255,.12)
    hover: border gold

rechts: 280px min-height, radial gradient overlay
```

### D1e. Sfeer Gallery

```
grid: 3 kolommen (2fr 1fr 1fr), 2 rijen, 400px hoogte, gap 8px
eerste item: span 2 rijen
items: radius 16px, overflow hidden
hover: brightness(1.08)
label: absolute bottom-left, semi-transparant zwart bg
font: 11px white
```

### D1f. Reviews

**Achtergrond**: `var(--h-cream)` (warm crème)
**Grid**: 3 kolommen, gap `12px`
Zelfde kaart structuur als andere branches, maar:
- Stars: amber (consistent)
- Platform badge: `11px grey-mid`

### D1g. Info Grid

```
grid: 3 kolommen, gap: 14px
card: bg white, border 1.5px var(--c-grey), radius 16px
padding: 22px, text-center

icon: 48x48px, radius 14px, centered
titel: Playfair Display, 16px/700
text: 13px grey-dark
link: 12px gold, flex gap  ← GOUD
```

### D1h. Newsletter

```
bg: var(--h-cream), border: 1.5px var(--c-grey), radius: 20px
padding: 36px, text-center

titel: Playfair Display, 22px/700
form: flex gap 6px, max-width 420px
input: height 46px, radius 14px
  focus: border-color gold  ← GOUD
knop: bg var(--h-warm), color gold  ← GOUD
  hover: bg gold, color warm
```

### D1i. Footer

```
bg: var(--h-warm), padding: 48px 0 (top)
grid: 4 kolommen (2fr 1fr 1fr 1fr), gap: 28px
links: hover color gold  ← GOUD
keuken sluiting: color gold
```

---

## D2. EVENEMENTEN — `horeca-evenementen.html`

### Bestand
`src/app/(horeca)/evenementen/page.tsx` (of vergelijkbaar)

### D2a. Event Hero

```
bg: linear-gradient(135deg, var(--h-warm), var(--h-warm-light))
radial gradient: 50% 80%, rgba(201,168,76,.06)
text-center

stats: 3 kolommen, flex centered
  nummers: Plus Jakarta Sans, 30px/700, color gold  ← GOUD
  labels: 11px rgba(255,255,255,.3)
```

### D2b. Pakketten Grid

**Grid**: 3 kolommen
**Card**:
```
bg: white, border: 1.5px var(--c-grey), radius: 20px
hover: translateY(-3px), shadow-md

featured card: border-color gold, box-shadow: 0 0 0 2px gold-light  ← GOUD glow

header:
  icon: 36px
  populair badge: absolute top-right, bg gold, color warm, font 10px/700
  naam: Playfair Display, 20px/700
  bereik: 12px grey-mid
  "vanaf" label: 11px grey-mid
  prijs: Plus Jakarta Sans, 28px/700, color gold  ← GOUD
  eenheid: 12px grey-mid

body: padding 22px
features: check icons → color gold  ← GOUD
font: 13px

knop: height 44px, width 100%
  fill: bg gold, color warm
    hover: bg warm, color gold
  outline: bg white, border 1.5px gold, color gold
    hover: bg gold-light
```

### D2c. Ruimtes Grid

```
grid: 2 kolommen
card: grid 1fr 1fr (intern), border 1.5px var(--c-grey), radius 16px

afbeelding: 200px min-height
info: padding 22px
  naam: Playfair Display, 18px/700
  beschrijving: 12px grey-dark
  specs: flex wrap, badges 10px, met icons
  link: 12px gold  ← GOUD
```

### D2d. Catering Menu

```
grid: 3 kolommen
card: bg white, border 1.5px var(--c-grey), radius 14px, padding 18px
icon: 28px
naam: Plus Jakarta Sans, 14px/800
prijs: JetBrains Mono, 14px/700, color gold  ← GOUD
eenheid: 10px grey-mid
```

### D2e. Evenement Aanvraag Formulier

**Layout**: `1fr 380px` (formulier + sidebar)

**Formulier Card**:
```
bg: white, border 1.5px var(--c-grey), radius 20px, shadow-md

header: bg var(--h-warm), centered, padding 20px
stap nummers: gold bg, warm text, rond
titel: Plus Jakarta Sans, 17px/800
beschrijving: 12px grey-mid

form body: padding 20px
labels: 12px/700
inputs: height 44px, border 1.5px var(--c-grey), radius 12px
  focus: border-color gold, ring gold  ← GOUD

submit: width 100%, height 48px
  bg gold, color warm, shadow gold/30%  ← GOUD
  hover: bg warm, color gold
```

---

## D3. MENUKAART — `horeca-menukaart.html`

### Bestand
`src/app/(horeca)/menukaart/page.tsx` (of vergelijkbaar)

### D3a. Sticky Toolbar

```
bg: white, border-bottom: 1px var(--c-grey)
sticky top 72px

categorie tabs: font 12px/700, border 1.5px, radius pill
  hover/active: border gold, color gold  ← GOUD
  active: bg gold, color warm

view toggle: font 12px, bordered container
filter knoppen: 11px, 6px padding
  active: bg gold-light  ← GOUD
```

### D3b. Menu Layout

**Grid**: `1fr 320px` (menu + sidebar)

### D3c. Menu Items

```
categorie header: icon + titel + count badge
border-bottom: 2px var(--c-grey)

item: flex layout, afbeelding (80x80px, radius 12px) + info
  tags: absolute top-left, kleine badges
  naam + prijs: flex space-between
    prijs: JetBrains Mono, color gold  ← GOUD
  beschrijving: 12px grey-dark
  dieet badges: 9px, meerdere badges
  wijn pairing: klein icon + text
```

### D3d. Chef's Special

```
bg: linear-gradient(135deg, var(--h-warm), var(--h-warm-light))
padding: 22px, radius: 18px

afbeelding: 90x90px, radius 14px, bg rgba(201,168,76,.1)  ← GOUD glow
label: 10px gold uppercase
naam: Playfair Display, 18px/700, color white
beschrijving: 12px rgba(255,255,255,.4)
prijs: JetBrains Mono, 18px/700, color gold  ← GOUD
```

### D3e. Sidebar

**Reservering mini**:
```
bg: linear-gradient(135deg, var(--h-warm), var(--h-warm-light))
text-center, color white
knop: bg gold, color warm  ← GOUD
```

**Wijnkaart**:
```
items: flex, icon + naam + regio + prijs
prijs: JetBrains Mono, color gold  ← GOUD
```

**Allergenen Legende**:
```
flex wrap, badges met icons
kleuren per allergie-type
download knop: border, hover border gold  ← GOUD
```

---

## D4. OVER ONS — `horeca-over-ons.html`

### Bestand
`src/app/(horeca)/over-ons/page.tsx` (of vergelijkbaar)

### D4a. About Hero

**Grid**: 2 kolommen, tekst links + afbeelding rechts (440px max, 3/4 aspect)
**Achtergrond**: zelfde warm gradient

```
badge: border 1px rgba(201,168,76,.25), color gold  ← GOUD
titel: Playfair Display, 42px/700
text: 15px rgba(255,255,255,.35), line-height 1.7
handtekening: Playfair Display, 18px italic, color gold  ← GOUD
```

### D4b. Filosofie Cards

```
grid: 3 kolommen
card: bg white, border 1.5px var(--c-grey), radius 16px, padding 24px
hover: translateY(-2px)

icon: 52x52px, radius 14px
titel: Playfair Display, 17px/700
beschrijving: 13px grey-dark
```

### D4c. Team Sectie (DARK)

```
bg: var(--h-warm)  ← DONKERE achtergrond
grid: 4 kolommen

member card:
  bg: rgba(255,255,255,.03)
  border: 1px rgba(255,255,255,.06)
  radius: 16px

  afbeelding: 200px hoogte
  rol badge: absolute bottom-center
    bg gold, color warm, font 10px/700  ← GOUD

  body: padding 14px, color white
  naam: Playfair Display, 16px/700
  rol: 12px rgba(255,255,255,.35)
  beschrijving: 11px rgba(255,255,255,.25)

  hover: border rgba(201,168,76,.3), translateY(-3px)  ← GOUD border
```

### D4d. Tijdlijn

```
links padding: 36px voor absolute dots
verticale lijn: 2px var(--c-grey), left 14px
items: padding-bottom 28px

dot: 28x28px, absolute left -36px, top 2px
  border: 3px solid gold  ← GOUD
  bg: white, centered icon 12x12px

jaar: JetBrains Mono, 13px/700, color gold  ← GOUD
titel: Playfair Display, 18px/700
text: 13px grey-dark
```

### D4e. Awards Grid

```
flex centered wrap, gap: 20px
card: bg white, border 1.5px var(--c-grey), radius 16px
padding: 22-28px
icon: 36px
titel: Plus Jakarta Sans, 14px/800
jaar: 12px gold 700  ← GOUD
```

### D4f. Gallery Grid

```
grid: 4 kolommen, aspect-ratio 1:1
radius: 14px, hover: scale(1.03)
```

### D4g. CTA Bar

```
bg: var(--h-warm), radius: 20px, padding: 40px
text-center, color: white
titel: Playfair Display, 26px/700
beschrijving: 14px rgba(255,255,255,.3)

knoppen: flex centered gap 8px, height 48px
  fill: bg gold, color warm  ← GOUD
    hover: bg white
  ghost: transparent, border 1.5px rgba(255,255,255,.12)
    hover: border gold  ← GOUD
```

---

## D5. RESERVEREN — `horeca-reserveren.html`

### Bestand
`src/app/(horeca)/reserveren/page.tsx` (of vergelijkbaar)

### D5a. Page Hero

```
bg: linear-gradient(135deg, var(--h-warm), var(--h-warm-light))
padding: 44px 0
titel: Playfair Display, 38px/700
badge: 11px gold
```

### D5b. Layout

**Grid**: `1fr 380px`, gap `28px`

### D5c. Formulier Card

```
bg: white, border 1.5px var(--c-grey), radius 20px, shadow-md

stap header: padding 20px
  nummer: 28x28px rond, bg gold, color warm  ← GOUD
  titel: Plus Jakarta Sans, 17px/800
  beschrijving: 12px grey-mid

body: padding 20px
```

### D5d. Kalender

```
header: flex space-between
  maand: Plus Jakarta Sans, 16px/700
  navigatie knoppen: 32x32px, border 1.5px, hover border gold  ← GOUD

dag grid: 7 kolommen, gap 2px
weekdagen: 11px/700 grey-mid
dagen: aspect-square, font 13px/600

  hover: bg gold-light, border gold  ← GOUD
  selected: bg gold, color white, border gold  ← GOUD
  today: border gold, color gold  ← GOUD
  disabled: grey, cursor not-allowed
```

### D5e. Tijdsloten

```
labeled secties (Lunch/Diner met emoji)
flex wrap, gap 4px
slot: font 13px/700, border 1.5px, padding 8px 14px

  hover: border gold, color gold  ← GOUD
  selected: bg gold, color white  ← GOUD
  bezet: opacity 35%, line-through, cursor not-allowed
  populair: vuur emoji indicator (absolute -right-1 -top-1.5)
```

### D5f. Aantal Gasten

```
knoppen: 48x48px, border 2px, radius 12px
font: Plus Jakarta Sans, 16px/700
selected: border gold, bg gold, color white  ← GOUD
```

### D5g. Zitvoorkeur

```
grid: 3 kolommen, gap 6px
item: border 1.5px, radius 10px
  icon: 22px
  naam: 12px/700
  beschrijving: 10px grey-mid
  selected: border gold, bg gold-light  ← GOUD
```

### D5h. Formulier Velden

```
grid: 1fr 1fr, gap 10px
labels: 12px/700
required: color coral
inputs: height 44px, border 1.5px var(--c-grey), radius 12px
  focus: border gold, ring 3px gold-light  ← GOUD
```

### D5i. Submit Knop

```
width: 100%, height: 52px
bg: gold, color: warm  ← GOUD
font: Plus Jakarta Sans, 16px/800
shadow: 0 4px 16px rgba(201,168,76,.3)  ← GOUD shadow
hover: bg warm, color gold, translateY(-1px)
```

### D5j. Sidebar Summary

```
card: bg white, border 1.5px var(--c-grey), radius 18px

header: bg var(--h-warm), centered text, color white
body: padding 16px

rijen: flex gap, padding 8px 0, border-bottom grey
  icon: 32x32px flex centered
  label: 11px grey-mid
  waarde: bold
```

**Info Cards** en **Telefoon Card**:
```
telefoon card: gradient warm → warm-light
radius: 14px, padding: 16px
icon container: 40x40px, radius 10px, bg rgba(201,168,76,.15)  ← GOUD
label: 10px rgba(255,255,255,.3)
nummer: Plus Jakarta Sans, 16px/800
beschikbaar: 10px gold  ← GOUD
```

---

## D6. Volgorde van Implementatie — Horeca

1. **Fonts + Tokens** (D0) — KRITISCH: Playfair Display + warme palette
2. **Header** (D1a) — compleet ander design dan andere branches
3. **Homepage Hero + Menu Highlights** (D1b, D1c)
4. **Dish Card** (D1c) — herbruikbaar component met dieet badges
5. **Menukaart** (D3) — met sticky toolbar en filters
6. **Reserveren** (D5) — kalender + formulier
7. **Evenementen** (D2) — pakketten en aanvraag
8. **Over Ons** (D4) — team + tijdlijn
9. **Footer** (D1i) — warme variant

### Herbruikbare Componenten
| Component | Gebruikt op |
|-----------|-------------|
| `DishCard` | Homepage, Menukaart |
| `DieetBadge` | DishCard, Menukaart, Allergenen legende |
| `EventPakketCard` | Evenementen |
| `RuimteCard` | Evenementen |
| `CateringItem` | Evenementen |
| `TeamMemberCard` (dark) | Over ons |
| `TijdlijnItem` | Over ons |
| `KalenderPicker` | Reserveren |
| `TijdslotSelector` | Reserveren |
| `GastenAantal` | Reserveren |
| `ZitvoorkeurSelector` | Reserveren |

### Belangrijke Verschillen met Andere Branches
| Aspect | Andere Branches | Horeca |
|--------|----------------|--------|
| Primary Dark | `#0A1628` (Navy) | `#2C1810` (Warm Brown) |
| Accent | `#00897B` (Teal) | `#C9A84C` (Gold) |
| Heading Font | Plus Jakarta Sans | Playfair Display (serif) |
| Sfeer | Koel, modern | Warm, klassiek |
| Sectie BG | `#F1F4F8` (grijs) | `#FDF8F0` (crème) |
| Hover glow | Teal glow | Gold glow |
| Shadow tint | `rgba(10,22,40,..)` | `rgba(44,24,16,..)` |

---
---

# DEEL E: PLASTIMED / ECOMMERCE BRANCH (sprint-1, 3, 7, 9)

De ecommerce mockups zijn verspreid over meerdere sprints:

| Sprint | Bestanden |
|--------|-----------|
| sprint-3 | `plastimed-header-v3.html` — 3-laags flyout navigatie |
| sprint-7 | `plastimed-kennisbank.html` — Kennisbank / blog |
| sprint-7 | `plastimed-paywall.html` — Premium content paywall |
| sprint-9 | `plastimed-cart-variant-a.html` — Winkelwagen (compact, tabel) |
| sprint-9 | `plastimed-cart-variant-b.html` — Winkelwagen (visueel, cards) |
| sprint-9 | `plastimed-login-registratie.html` — Login/registratie/gast checkout |

---

## E0. DESIGN SYSTEM — Ecommerce-specifiek

### Palette
Ecommerce gebruikt de **standaard Navy + Teal** palette, plus:

| Token | Hex | Gebruik |
|-------|-----|---------|
| Navy | `#0A1628` | Header, dark sections, sidebar headers |
| Navy Deep | `#061A33` | Diepere gradients (kennisbank) |
| Navy Mid | `#1A2D45` | Flyout L1 kolom, borders |
| Teal | `#00897B` | Primary knoppen, links, prijzen |
| Teal Dark | `#00695C` | Hover states, donkere teal |
| Teal Glow | `rgba(0,137,123,0.12)` | Hover backgrounds |
| Coral | `#FF6B6B` / `#E94560` | Sale tags, verwijder knoppen, kort-badges |
| Gold | `#F59E0B` | Premium badges, paywall |
| Gold Dark | `#D97706` | Premium gradient eindpunt |
| Gold BG | `#FFFBEB` | Premium achtergrond |
| Gold Border | `#FDE68A` | Premium card border |
| Green | `#00C853` / `#16A34A` | Op voorraad, gratis verzending |
| Green BG | `#F0FDF4` | Voorraad achtergrond |
| Green Border | `#BBF7D0` | Voorraad border |

### Typography
- **Body**: DM Sans (400-700)
- **Headings/UI**: Plus Jakarta Sans (500-800)
- **Display** (kennisbank, cart totaal, login): DM Serif Display (regular, italic)
- **Mono** (prijzen, SKU): JetBrains Mono (400-500)

### Extra Fonts laden
**Bestand: `src/app/(ecommerce)/layout.tsx`**

```tsx
import { DM_Serif_Display } from 'next/font/google'

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-dm-serif',
  display: 'swap',
})
```

### Extra CSS Tokens
```css
/* ═══════════════════════════════════════════════════════
   ECOMMERCE DESIGN TOKENS (Plastimed)
   ═══════════════════════════════════════════════════════ */
--e-navy-deep: #061A33;
--e-navy-mid: #1A2D45;
--e-teal-dark: #00695C;
--e-teal-bg: #E0F2F1;
--e-coral: #E94560;
--e-gold: #F59E0B;
--e-gold-dark: #D97706;
--e-gold-bg: #FFFBEB;
--e-gold-border: #FDE68A;
--e-green: #16A34A;
--e-green-bg: #F0FDF4;
--e-green-border: #BBF7D0;
```

### Container
**Let op**: Ecommerce gebruikt een **bredere container**: `max-width: 1320px`, `padding: 0 32px`
(in plaats van 1200px/24px bij andere branches)

---

## E1. HEADER & NAVIGATIE — `plastimed-header-v3.html`

### Bestanden
- `src/branches/shared/components/layout/header/Header/NavigationBar.tsx`
- `src/branches/shared/components/layout/header/Header/index.tsx`

### E1a. Topbar

```
height: 36px, bg: var(--c-navy)
color: rgba(255,255,255,.6), font: 12.5px/500
icons: 14x14px
grid: 1fr auto (USPs links, links rechts)
USP gap: 24px
```

### E1b. Header Bar

```
height: 72px, bg: white, sticky top 0, z-index 200
border-bottom: 1px var(--c-grey)
grid: auto 1fr auto, gap: 32px
```

**Zoekbalk**:
```
height: 44px, padding: 0 100px 0 48px
border: 2px var(--c-grey), radius: 12px
bg: grey-light, font: 14.5px DM Sans
focus: border teal, shadow 0 0 0 4px teal-glow, bg white
zoek icon: absolute left 16px
keyboard shortcut badge: absolute right, 9px font
```

**B2B/B2C Toggle** (uniek voor ecommerce):
```
bg: grey-light, border 1px, radius: 6px
knop: padding 5px 10px, font 11px/700
active: bg teal, color white
```

**Actie Knoppen**:
```
height: 42px, radius: 10px, bg: grey-light
icon: 19x19px
hover: bg teal-glow, border rgba(0,137,123,.15), color teal

cart knop: speciaal — padding 0 16px 0 12px, bg navy, color white
count badge: bg coral, color white, font 10px/800
min-width 18px, height 18px, radius 100px
```

### E1c. Navigatie Bar

```
height: 48px, sticky top 72px, z-index 190
bg: white, border-bottom: 1px var(--c-grey)

nav links: font 14px/600, padding 0 18px, color navy
border-bottom: 2px transparent
icon: 16px, chevron: 13px opacity 0.4
hover: color teal, border-bottom teal

menu trigger: bg navy, color white, padding 0 20px, gap 8px
```

### E1d. Branch Dropdown

```
position: absolute top 100% left 0
bg: white, radius: 0 0 16px 16px
shadow: 0 16px 56px rgba(10,22,40,.14)
border-top: 2px teal
padding: 24px 28px, min-width: 560px
grid: 2 kolommen, gap: 8px

item: padding 12px 16px, radius 10px, border 1px var(--c-grey)
hover: border teal, bg teal-glow
icon: 40x40px, radius 10px
```

### E1e. 3-Laags Flyout Menu (COMPLEX!)

Dit is het meest complexe navigatie-element:

**L1 (eerste kolom)**:
```
width: 260px, bg: var(--c-navy)
padding: 12px 0, border-right: 1px var(--e-navy-mid)

items: color rgba(255,255,255,.7), font 14px/500
padding: 10px 20px, icons: 17x17px
hover/active: bg rgba(0,137,123,.18), color white
count: 11px rgba(255,255,255,.2)
```

**L2 (tweede kolom)**:
```
width: 280px, flex-shrink: 0
header: padding 8px, margin-bottom 14px
items: zelfde styling als L1
```

**L3 (derde kolom)**:
```
flex: 1, min-width: 340px
grid: 2 kolommen voor links, gap: 0 8px
items: padding 10px 20px, font 14px/500
sale variant: color coral, hover bg coral-light
```

**Promo Card** (onderin flyout):
```
margin: auto 20px 12px
padding: 18px
bg: linear-gradient(135deg, var(--c-navy), var(--e-navy-mid))
radius: 14px, gap: 16px
afbeelding: 64x64px
```

### E1f. Mobile Drawer

```
position: fixed, width: 320px (max 85vw)
bg: white, z-index: 300
transform: translateX(-100%) → 0
transition: 0.35s cubic-bezier(0.4,0,0.2,1)

header: padding 16px 20px, border-bottom 1px var(--c-grey)
close: 36x36px, bg grey-light
items: padding 12px 20px, font 15px/600
hover: bg teal-glow, color teal
```

---

## E2. KENNISBANK — `plastimed-kennisbank.html`

### Bestand
`src/app/(ecommerce)/kennisbank/page.tsx` (of vergelijkbaar)

### E2a. Hero

```
bg: linear-gradient(160deg, var(--c-navy) 0%, var(--e-navy-deep) 60%, #041526 100%)
padding: 60px 0 80px
radial gradient: rgba(0,137,123,.1)

badge: bg rgba(0,137,123,.15), border 1px rgba(0,137,123,.25)
radius: 20px, font: 11px/700 uppercase, tracking 0.06em, color teal-light

titel: DM Serif Display, 40px, color white, line-height 1.2
  accent: teal-light
beschrijving: 16px rgba(255,255,255,.55), line-height 1.7

zoekbalk: max-width 480px
  input: padding 14px 18px 14px 48px
  border: 1.5px rgba(255,255,255,.15)
  bg: rgba(255,255,255,.06)
  focus: border teal, bg rgba(255,255,255,.1), ring 3px rgba(0,137,123,.15)
```

**Stats Cards** (in hero):
```
grid: 2x2, gap 16px
bg: rgba(255,255,255,.04), border 1px rgba(255,255,255,.08)
radius: 14px, padding: 20px
nummer: DM Serif Display, 32px, color teal-light
label: 12px/600 rgba(255,255,255,.45)
```

### E2b. Filter Bar

```
bg: white, border-bottom: 1px grey-200, padding: 14px 0
sticky top 68px, z-index 90

pills: padding 8px 18px, bg grey-50, border 1.5px grey-200
radius: 20px, font: 13px/600, color grey-600
hover: border teal, color teal
active: bg teal, color white

count badge: bg rgba(0,0,0,.08), padding 1px 6px
radius: 8px, font: 10px/800

type toggle: bg grey-100, radius 8px, padding 3px
  knop: padding 6px 14px
  active: bg white, color navy, shadow small
```

### E2c. Featured Article Card

```
bg: white, radius: 20px, border: 1px grey-200
shadow: medium, grid: 1fr 1fr, overflow hidden
hover: shadow large, translateY(-2px)

afbeelding: bg linear-gradient(135deg, navy, navy-deep)
min-height: 280px, radial gradient overlay

body: padding 36px
  categorie: 11px teal uppercase, tracking 0.08em
  titel: DM Serif Display, 26px, navy, line-height 1.25
  excerpt: 14px grey-500, line-height 1.7
  lees meer: bg teal, color white, padding 12px 24px, font 14px/700
```

### E2d. Article Cards Grid

```
grid: 3 kolommen, gap: 20px

card: bg white, radius 14px, border 1px grey-200, overflow hidden

thumbnail: height 140px, bg linear-gradient(135deg, grey-100, grey-200)
  tags (absolute top-left 10px): padding 3px 8px, font 9px/800 uppercase, radius 4px
    gratis: bg teal-bg, color teal-dark
    premium: bg linear-gradient(135deg, gold, gold-dark), color white
    video: bg coral, color white
    pdf: bg navy, color white

body: padding 18px
  categorie: 10px teal uppercase, tracking 0.06em
  titel: 15px/700, navy, line-height 1.35
  excerpt: 13px grey-500, -webkit-line-clamp 3

footer: padding 12px 18px, border-top 1px grey-100
  font: 11px grey-400, flex space-between
```

### E2e. Premium Banner

```
bg: linear-gradient(135deg, var(--c-navy), var(--e-navy-deep))
radius: 20px, padding: 40px, gap: 32px
radial gradient: rgba(245,158,11,.1)

badge: bg linear-gradient(135deg, gold, gold-dark)
padding: 4px 12px, radius: 12px, font: 10px/800 white uppercase

titel: DM Serif Display, 24px, white
knoppen:
  primary: bg linear-gradient(135deg, gold, gold-dark), color white
    padding: 14px 28px, radius: 10px, font: 14px/700
    hover: translateY(-1px), shadow 0 4px 20px rgba(245,158,11,.3)
  ghost: transparent, border 1.5px rgba(255,255,255,.2)
```

---

## E3. PAYWALL — `plastimed-paywall.html`

### Bestand
`src/app/(ecommerce)/kennisbank/[slug]/page.tsx` (of vergelijkbaar — paywall overlay op artikel)

### E3a. Blur Content Zone

```
filter: blur(6px)
user-select: none
pointer-events: none
opacity: 0.5
```

### E3b. Paywall Card

```
bg: white
border: 2px var(--e-gold-border) (#FDE68A)
radius: 20px
shadow: 0 20px 60px rgba(10,38,71,.18), 0 0 60px rgba(245,158,11,.08)

glow effect: pseudo-element absolute inset -2px
  bg: linear-gradient(135deg, gold, transparent 40%, transparent 60%, teal-light)
  opacity: 0.3, z-index: -1
```

**Header**:
```
bg: linear-gradient(135deg, var(--c-navy), var(--e-navy-deep))
padding: 28px 32px, text-center
radial gradient: rgba(245,158,11,.12)

icon: 56x56px, bg linear-gradient(135deg, gold, gold-dark)
radius: 16px, shadow: 0 4px 20px rgba(245,158,11,.3)

titel: DM Serif Display, 26px, white
subtitel: 14px rgba(255,255,255,.6), max-width 400px
```

**Body**: padding `28px 32px`

**Benefits Grid**:
```
grid: 2 kolommen, gap 12px
item: padding 12px 14px, bg grey-50, radius 10px
font: 13px/600 grey-700, icon: 32x32px (emoji)
```

**Pricing Box**:
```
text-center, padding: 16px, bg: gold-bg, border: 1px gold-border
radius: 10px
bedrag: DM Serif Display, 36px, navy
periode: 14px grey-500 500
notitie: 12px grey-400
```

**CTA Knoppen**:
```
primary: width 100%, padding 16px
  bg: linear-gradient(135deg, gold, gold-dark), color white
  font: 16px/800, radius: 10px
  hover: translateY(-2px), shadow 0 8px 30px rgba(245,158,11,.35)
  shimmer effect: ::after gradient animatie

secondary: bg teal, color white
  hover: bg teal-dark, translateY(-1px)

tertiary: transparent, border 1.5px dashed grey-200
  hover: border grey-400, color grey-700
```

**Social Proof**:
```
flex centered, padding-top 16px, border-top 1px grey-100
avatars: 28x28px, border 2px white, margin-left -8px (overlapping)
text: 12px grey-500, bold: navy
```

---

## E4. WINKELWAGEN VARIANT A (Compact) — `plastimed-cart-variant-a.html`

### Bestand
`src/app/(ecommerce)/winkelwagen/page.tsx` of `src/branches/ecommerce/components/CartPage.tsx`

### E4a. Layout

**Grid**: `1fr 360px`, gap `28px`

### E4b. Gratis Verzending Bar

```
bg: var(--e-green-bg), border: 1px var(--e-green-border)
radius: 8px, padding: 12px 16px
display: flex gap 12px

progress bar: height 4px, bg rgba(22,163,74,.15), radius 2px
  fill: width N%, bg green
```

### E4c. Cart Tabel

**Header**:
```
grid: 50px 1fr 120px 120px 100px 40px, gap 12px
padding: 14px 20px, bg: grey-50
font: 11px/700 uppercase, tracking 0.06em
```

**Rij**:
```
zelfde grid template
padding: 16px 20px, align-items center
border-bottom: 1px grey-100
hover: bg grey-50

afbeelding: 50x50px, radius 8px, bg grey-100
merk: 10px teal uppercase
naam: 14px/600, navy, ellipsis
sku: 11px grey-400
voorraad: 11px green 600, dot 6px

prijs: 14px/700 navy
  oud: 11px grey-400 strikethrough
  korting: 10px coral 700
```

### E4d. Quantity Stepper

```
border: 1.5px grey-200, radius: 8px, overflow hidden
knoppen: 32x32px, bg grey-50
input: 40px breed, font 13px/700
border-left/right: 1px grey-200
```

### E4e. Verwijder Knop

```
32x32px, bg none, color grey-300, radius 6px
hover: color coral, bg rgba(233,69,96,.06)
```

### E4f. Coupon Rij

```
padding: 16px 20px, border-top 1px grey-100
bg: grey-50, flex space-between
input: 200px breed, padding 8px 14px
knop: padding 8px 16px, bg navy, color white
```

### E4g. Sidebar Summary

```
bg: white, radius: 12px, shadow: small
border: 1px grey-200, sticky top 90px

header: padding 20px 24px, border-bottom 1px grey-100
titel: DM Serif Display, 20px, navy

rijen: padding 8px 0, font 14px grey-600
  waarde: 600 weight
  korting: color green
  verzending: color green 700

totaal: font 14px
  bedrag: DM Serif Display, 28px, navy
btw: 11px grey-400, text-align right

checkout knop: width 100%, padding 16px
  bg teal, color white, font 16px/700, radius 8px
  hover: bg teal-dark, shadow 0 4px 16px rgba(0,137,123,.3)
    translateY(-1px)
```

### E4h. Betaalmethoden

```
flex centered gap 8px
padding: 16px 24px 20px, border-top 1px grey-100
badge: 11px/600 grey-500
methode icons: kleine badges/logos
```

### E4i. Upsell Sectie

```
bg: white, radius: 12px, padding: 20px 24px, margin-top 16px
titel: 13px uppercase 700

item: padding 10px 0, border-bottom 1px grey-100
flex gap 12px
afbeelding: 44x44px, radius 8px, bg grey-100
prijs: font 13px/700 navy
  oud: 11px grey-400 strikethrough

toevoegen knop: 32x32px, bg teal, color white, font 18px
hover: bg teal-dark, scale(1.05)
```

---

## E5. WINKELWAGEN VARIANT B (Visueel) — `plastimed-cart-variant-b.html`

### Bestand
Alternatieve variant — configureerbaar via template selector

### E5a. Step Indicator

```
bg: white, border-bottom: 1px grey-200, padding: 20px 0
flex centered, max-width: 600px

stap: flex gap 10px, font 13px/600, color grey-400
  active: color teal
  done: color green

nummer: 30x30px, border 2px grey-300, radius 50%
  font: 12px/800
  active: bg teal, color white, border teal
  done: bg green, color white, border green

lijn: width 60px, height 2px, bg grey-200
  done: bg green
```

### E5b. Page Header

```
flex space-between
titel: DM Serif Display, 36px, navy, line-height 1.1
subtitel: 14px grey-500
```

### E5c. Layout

**Grid**: `1fr 380px`, gap `32px`

### E5d. Product Cards

```
bg: white, radius: 14px, border: 1px grey-200
grid: 120px 1fr auto, overflow hidden
hover: shadow medium, border grey-300

afbeelding: width 120px, min-height 140px
  bg: linear-gradient(135deg, grey-50, grey-100)
  border-right: 1px grey-100
  sale tag: absolute top 10px left 10px
    bg coral, color white, font 10px/800
    padding 3px 8px, radius 4px

body: padding 20px 24px
  merk: 10px/700 teal uppercase, tracking 0.08em
  naam: 16px/700 navy, line-height 1.3
  meta: flex gap 16px, flex-wrap
  voorraad: flex gap 5px, font 12px/600, color green
    dot: 6x6px, radius 50%

acties: padding 20px 24px, flex column
  align-items flex-end, gap 12px
  border-left: 1px grey-100, min-width 160px

  prijs: text-right
    huidig: 20px/800 navy
    oud: 12px grey-400 strikethrough
    eenheid: 11px grey-400

  quantity: flex, border 1.5px grey-200, radius 8px
    knoppen: 36x36px, bg grey-50
    input: 44x36px, border-left/right 1px grey-200, font 14px/700

  subtotaal: 11px grey-500, bold: navy 14px
  verwijder: font 12px grey-300, hover: color coral
```

### E5e. Sidebar

**Verzending Card**:
```
bg: var(--e-green-bg), border: 1px var(--e-green-border)
radius: 14px, padding: 18px 20px
progress bar: height 6px, radius 3px
```

**Summary Card**:
```
bg: white, radius: 14px, border: 1px grey-200
shadow: medium

header: bg navy, padding 18px 24px, color white
  titel: DM Serif Display, 20px

body: padding 20px 24px
rijen: flex space-between, padding 8px 0

totaal:
  label: 16px/700 navy
  bedrag: DM Serif Display, 32px, navy
btw: 11px grey-400

checkout knop: width 100%, padding 16px
  bg teal, color white, font 16px/700
  hover: bg teal-dark, shadow 0 6px 20px rgba(0,137,123,.3)
  shimmer effect: ::after

alt checkout: bg navy, color white, font 14px/600
  margin-top 8px
```

**Trust Card**:
```
bg: white, radius: 14px, border 1px grey-200, padding: 18px 20px
grid: 2 kolommen, gap: 12px
item: flex gap 8px, font 12px/600 grey-600
icon: 32x32px, radius 8px, bg teal-bg
```

### E5f. Recent Bekeken

```
margin-top: 48px, padding-top: 32px, border-top: 1px grey-200
titel: DM Serif Display, 22px, navy
grid: 4 kolommen, gap: 16px

card: bg white, radius 14px, border 1px grey-200
padding: 16px, text-center
hover: shadow medium, border teal-light

afbeelding: 60x60px, margin 0 auto 10px, bg grey-100, radius 10px
toevoegen: bg teal, color white, font 12px/600, radius 6px
  padding 6px 14px, hover: bg teal-dark
```

---

## E6. LOGIN / REGISTRATIE — `plastimed-login-registratie.html`

### Bestand
`src/app/(ecommerce)/login/page.tsx` of `src/app/(shared)/(auth)/login/page.tsx`

### E6a. Split Layout

```
grid: 1fr 1fr, min-height: calc(100vh - 140px)
```

### E6b. Links Panel (Branding)

```
bg: linear-gradient(160deg, var(--c-navy), var(--e-navy-deep), #041526)
padding: 60px, flex column center
radial gradients: teal 0.12 + coral 0.06 opacity

badge: bg rgba(0,137,123,.15), border 1px rgba(0,137,123,.25)
padding: 6px 14px, radius: 20px, font: 12px/600, color teal-light
  dot: 6x6px met pulse animatie

titel: DM Serif Display, 42px, white, line-height 1.2
  accent: teal-light
beschrijving: rgba(255,255,255,.6), font 16px, line-height 1.7
  max-width: 420px

features: flex column gap 16px
  item: flex gap 14px, color rgba(255,255,255,.75), font 14px
  icon: 40x40px, radius 10px, bg teal met border
```

### E6c. Rechts Panel (Formulieren)

```
flex center, padding: 40px, bg: var(--bg) (#F5F7FA)
form wrapper: width 100%, max-width: 440px
```

### E6d. Auth Tabs

```
flex, bg: white, radius: 12px, padding: 4px
shadow: small, border: 1px grey-200

tab: flex 1, padding: 12px, text-center
  font: 14px/600, color grey-500
  bg: transparent, radius: 8px
  active: bg navy, color white, shadow 0 2px 8px rgba(10,38,71,.2)
  hover (inactive): color navy, bg grey-50
```

### E6e. OAuth Knoppen

```
flex column gap 10px, width 100%
knop: padding 13px 16px, bg white
  border: 1.5px grey-200, radius: 8px
  font: 14px/600
  hover: border grey-300, shadow small, translateY(-1px)
```

### E6f. Divider

```
flex gap 16px, color grey-400
font: 12px/600 uppercase, tracking 0.08em
lijnen: ::before/::after 1px grey-200
```

### E6g. Form Fields

```
group: margin-bottom 18px
label: 13px/600, color grey-700, margin-bottom 6px

input: width 100%, padding 12px 14px
  border: 1.5px grey-200, radius: 8px
  font: 14px, color: text (#1E293B)
  focus: border teal, shadow 0 0 0 3px rgba(0,137,123,.1)

password toggle: absolute right 14px top 50%
  color grey-400, hover: grey-600

checkbox: accent-color teal
form link: 13px teal 600, hover: teal-dark
```

### E6h. Wachtwoord Sterkte Indicator

```
container: margin-top 8px
bar: height 4px, bg grey-200, radius 2px
  fill progressie:
    33% = weak (coral)
    66% = medium (amber)
    100% = strong (teal)
label: 11px/600, kleur matcht bar
```

### E6i. Knoppen

```
primary: width 100%, padding 14px
  bg teal, color white, font 15px/700, radius 8px
  hover: bg teal-dark, shadow 0 4px 16px rgba(0,137,123,.3)
    translateY(-1px)
  shimmer effect: ::after

secondary: bg navy, hover: bg navy-light
  shadow 0 4px 16px rgba(10,38,71,.25)

gast knop: padding 14px, bg transparent
  border: 1.5px dashed grey-300, radius 8px
  font: 14px/600, color grey-600
  hover: border teal, color teal, bg rgba(0,137,123,.03)
```

### E6j. B2B Notificatie

```
bg: rgba(10,38,71,.03), border: 1px rgba(10,38,71,.08)
radius: 8px, padding: 14px 16px
flex gap 10px, font: 13px grey-600, line-height 1.5
```

### E6k. Gast Checkout Info

```
bg: linear-gradient(135deg, rgba(0,137,123,.04), rgba(10,38,71,.02))
border: 1px rgba(0,137,123,.12), radius: 12px
padding: 20px

voordelen grid: 2 kolommen, gap 10px
item: flex gap 6px, font 12px/600 grey-600
check: color teal, font 14px
```

### E6l. Trust Badges

```
flex centered gap 32px, margin-top 36px
padding-top: 24px, border-top: 1px grey-200
font: 11px/600 grey-400, tracking 0.02em
icon: 16px
```

---

## E7. Volgorde van Implementatie — Ecommerce

1. **Tokens + Fonts** (E0) — DM Serif Display + extra kleur tokens
2. **Header & 3-Laags Flyout** (E1) — meest complex, beïnvloedt alle pagina's
3. **Cart Variant A** (E4) — compact tabel layout
4. **Cart Variant B** (E5) — visueel card layout
5. **Login/Registratie** (E6) — split layout + auth tabs
6. **Kennisbank** (E2) — artikel grid + filters
7. **Paywall** (E3) — overlay component

### Herbruikbare Componenten
| Component | Gebruikt op |
|-----------|-------------|
| `FlyoutMenu` (3-laags) | Header |
| `BranchDropdown` | Header |
| `B2BToggle` | Header zoekbalk |
| `QuantityStepper` | Cart A, Cart B |
| `FreeShippingBar` | Cart A, Cart B |
| `CartSummary` | Cart A, Cart B |
| `AuthTabs` | Login/Registratie |
| `PasswordStrength` | Registratie |
| `OAuthButtons` | Login/Registratie |
| `ArticleCard` | Kennisbank |
| `FilterPills` | Kennisbank |
| `PaywallOverlay` | Kennisbank artikel |
| `PremiumBanner` | Kennisbank |
| `StepIndicator` | Cart B, Checkout |
| `TrustBadges` | Cart, Login |
| `UpsellSection` | Cart A |
| `RecentBekeken` | Cart B |

---
---

# DEEL F: CROSS-BRANCH REFERENTIE

## Gedeelde Patronen

Alle branches (behalve Horeca) delen deze basis:

| Patroon | Waarde |
|---------|--------|
| Card border | `1.5px solid var(--c-grey)` |
| Card radius | `14-20px` |
| Card hover | `border-color accent`, `translateY(-2 tot -3px)`, `shadow-md` |
| Section padding | `48-64px` verticaal |
| Container | `1200px` (ecommerce: `1320px`) |
| Button height | `44-52px` |
| Input height | `42-46px` |
| Input focus | `border accent`, `ring 3px accent-glow` |
| Gradient bg | `135deg, dark → dark-light` |
| Badge pill | `radius 100px`, `font 11-12px/700` |
| Transition | `0.2s cubic-bezier(0.4,0,0.2,1)` |

## Branch-specifieke Accenten

| Branch | Dark | Accent | Glow | Heading Font |
|--------|------|--------|------|-------------|
| Construction | `#0A1628` | `#00897B` | `rgba(0,137,123,.12)` | Plus Jakarta Sans |
| Zorg/Hospitality | `#0A1628` | `#00897B` | `rgba(0,137,123,.12)` | Plus Jakarta Sans |
| Beauty | `#0A1628` | `#00897B` + `#EC4899` | `rgba(0,137,123,.12)` | Plus Jakarta Sans |
| **Horeca** | `#2C1810` | `#C9A84C` | `rgba(201,168,76,.12)` | **Playfair Display** |
| Ecommerce | `#0A1628` | `#00897B` | `rgba(0,137,123,.12)` | Plus Jakarta Sans + DM Serif Display |
