# Sprint 2 Implementation Plan - VanderBouw Construction Template

**Status:** Planning Phase
**Date:** 2026-02-21
**Goal:** Implement complete construction/bouwbedrijf template system in Payload CMS

---

## 📋 Overview

Sprint-2 contains HTML templates for a complete construction company website (VanderBouw). These templates need to be converted into a fully functional Payload CMS implementation with:

1. **New vertical slice branch:** `construction` (bouw)
2. **Payload collections** for dynamic content
3. **Reusable React components**
4. **Payload blocks** for page builder
5. **Next.js routes** for the frontend

---

## 📊 Template Analysis

### Template Files

1. **bouw-homepage.html** (~200 lines)
   - Hero section with trust badges
   - Stats bar (4 metrics)
   - Services grid (6 services)
   - Projects grid (recent projects)
   - USPs/Why us section
   - Reviews (3 reviews)
   - Certifications bar
   - CTA banner
   - Footer

2. **bouw-dienst-detail.html** (~100 lines)
   - Service hero with breadcrumb
   - Content blocks (text, images)
   - Process steps grid
   - Service types grid
   - USP bar
   - FAQ accordion
   - Sidebar with quote form
   - Phone card

3. **bouw-offerte-aanvragen.html** (~80 lines)
   - Multi-step form (stepper UI)
   - Project type selection (6 types)
   - Details form (name, email, phone, address)
   - Budget slider
   - Photo upload zone
   - Timeline selection
   - Sidebar with benefits

4. **bouw-project-detail.html**
   - Project hero
   - Project details
   - Before/after gallery
   - Client testimonial
   - Related projects

5. **bouw-projecten-overzicht.html**
   - Projects grid with filters
   - Category filter
   - Year filter
   - Load more pagination

---

## 🏗️ Implementation Structure

### 1. Vertical Slice: Construction Branch

```
src/branches/construction/
├── collections/
│   ├── ConstructionServices.ts      # Diensten (Nieuwbouw, Renovatie, etc.)
│   ├── ConstructionProjects.ts      # Projecten portfolio
│   ├── ConstructionReviews.ts       # Testimonials/reviews
│   ├── ConstructionTeam.ts          # Team members (optional)
│   └── QuoteRequests.ts             # Offerte aanvragen
├── blocks/
│   ├── ConstructionHero.ts          # Hero block
│   ├── StatsBar.ts                  # Statistics block
│   ├── ServicesGrid.ts              # Services grid block
│   ├── ProjectsGrid.ts              # Projects grid block
│   ├── USPSection.ts                # USP/Why us block
│   ├── ReviewsGrid.ts               # Reviews block
│   ├── CTABanner.ts                 # CTA banner block
│   └── FAQ.ts                       # FAQ accordion block
└── index.ts                         # Branch metadata

src/components/construction/
├── Hero/
│   ├── ConstructionHero.tsx         # Hero component
│   └── index.tsx
├── StatsBar/
│   ├── StatsBar.tsx
│   └── index.tsx
├── ServiceCard/
│   ├── ServiceCard.tsx
│   └── index.tsx
├── ProjectCard/
│   ├── ProjectCard.tsx
│   └── index.tsx
├── ReviewCard/
│   ├── ReviewCard.tsx
│   └── index.tsx
├── QuoteForm/
│   ├── QuoteForm.tsx                # Multi-step form
│   ├── StepIndicator.tsx
│   └── index.tsx
└── index.ts

src/app/(construction)/                # Route group
├── diensten/                          # Services
│   ├── [slug]/
│   │   └── page.tsx                   # Service detail
│   └── page.tsx                       # Services overview
├── projecten/                         # Projects
│   ├── [slug]/
│   │   └── page.tsx                   # Project detail
│   └── page.tsx                       # Projects overview
├── offerte-aanvragen/
│   └── page.tsx                       # Quote request form
└── layout.tsx                         # Construction layout
```

---

## 📦 Collections Specification

### 1. ConstructionServices Collection

```typescript
{
  slug: 'construction-services',
  fields: [
    { name: 'title', type: 'text', required: true }, // e.g., "Nieuwbouw"
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'icon', type: 'text' }, // Emoji or icon name
    { name: 'color', type: 'select', options: ['teal', 'blue', 'green', 'purple', 'amber', 'coral'] },
    { name: 'shortDescription', type: 'textarea' }, // For cards
    { name: 'longDescription', type: 'richText' }, // For detail page

    // Service details
    { name: 'features', type: 'array', fields: [
      { name: 'feature', type: 'text' }
    ]},

    // Process steps
    { name: 'processSteps', type: 'array', fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'icon', type: 'text' }
    ]},

    // Service types
    { name: 'serviceTypes', type: 'array', fields: [
      { name: 'name', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'icon', type: 'text' }
    ]},

    // USPs
    { name: 'usps', type: 'array', fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'icon', type: 'text' }
    ]},

    // FAQ
    { name: 'faq', type: 'array', fields: [
      { name: 'question', type: 'text' },
      { name: 'answer', type: 'textarea' }
    ]},

    // Images
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },

    // SEO
    { name: 'meta', type: 'group', fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'keywords', type: 'text' }
    ]},

    // Status
    { name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft' }
  ]
}
```

### 2. ConstructionProjects Collection

```typescript
{
  slug: 'construction-projects',
  fields: [
    { name: 'title', type: 'text', required: true }, // e.g., "Villa met zwembad — Amstelveen"
    { name: 'slug', type: 'text', required: true, unique: true },

    // Category
    { name: 'category', type: 'relationship', relationTo: 'construction-services' },
    { name: 'badges', type: 'array', fields: [
      { name: 'badge', type: 'text' } // e.g., "Nieuwbouw", "2024"
    ]},

    // Project details
    { name: 'location', type: 'text' }, // e.g., "Amstelveen"
    { name: 'year', type: 'number' },
    { name: 'duration', type: 'text' }, // e.g., "14 maanden"
    { name: 'size', type: 'text' }, // e.g., "280m²"
    { name: 'budget', type: 'text' }, // Optional, e.g., "€450.000 - €550.000"

    // Content
    { name: 'shortDescription', type: 'textarea' },
    { name: 'longDescription', type: 'richText' },
    { name: 'challenge', type: 'richText' },
    { name: 'solution', type: 'richText' },
    { name: 'result', type: 'richText' },

    // Images
    { name: 'featuredImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'beforeAfter', type: 'group', fields: [
      { name: 'before', type: 'upload', relationTo: 'media' },
      { name: 'after', type: 'upload', relationTo: 'media' }
    ]},

    // Client testimonial
    { name: 'testimonial', type: 'group', fields: [
      { name: 'quote', type: 'textarea' },
      { name: 'clientName', type: 'text' },
      { name: 'clientRole', type: 'text' }
    ]},

    // SEO
    { name: 'meta', type: 'group', fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' }
    ]},

    // Status
    { name: 'featured', type: 'checkbox' }, // Show on homepage
    { name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft' }
  ]
}
```

### 3. ConstructionReviews Collection

```typescript
{
  slug: 'construction-reviews',
  fields: [
    { name: 'clientName', type: 'text', required: true },
    { name: 'clientRole', type: 'text' }, // e.g., "Eigenaar villa"
    { name: 'clientInitials', type: 'text' }, // e.g., "JD"
    { name: 'clientColor', type: 'select', options: ['teal', 'blue', 'green', 'purple', 'amber'] },
    { name: 'rating', type: 'number', min: 1, max: 5, required: true },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'project', type: 'relationship', relationTo: 'construction-projects' }, // Optional
    { name: 'service', type: 'relationship', relationTo: 'construction-services' }, // Optional
    { name: 'featured', type: 'checkbox' }, // Show on homepage
    { name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft' }
  ]
}
```

### 4. QuoteRequests Collection

```typescript
{
  slug: 'quote-requests',
  fields: [
    // Contact info
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'address', type: 'text' },
    { name: 'postalCode', type: 'text' },
    { name: 'city', type: 'text' },

    // Project details
    { name: 'projectType', type: 'select', options: [
      'nieuwbouw',
      'renovatie',
      'verduurzaming',
      'aanbouw',
      'utiliteitsbouw',
      'herstelwerk'
    ], required: true },
    { name: 'budget', type: 'select', options: [
      '< €50.000',
      '€50.000 - €100.000',
      '€100.000 - €250.000',
      '€250.000 - €500.000',
      '> €500.000'
    ]},
    { name: 'timeline', type: 'select', options: [
      'Zo snel mogelijk',
      'Binnen 3 maanden',
      'Binnen 6 maanden',
      'Dit jaar',
      'Volgend jaar'
    ]},
    { name: 'description', type: 'textarea' },
    { name: 'attachments', type: 'upload', relationTo: 'media', hasMany: true },

    // Status tracking
    { name: 'status', type: 'select', options: [
      'new',
      'contacted',
      'quoted',
      'won',
      'lost'
    ], defaultValue: 'new' },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users' }, // Optional
    { name: 'notes', type: 'textarea' }, // Internal notes

    // Timestamps
    { name: 'submittedAt', type: 'date', required: true },
    { name: 'contactedAt', type: 'date' },
    { name: 'quotedAt', type: 'date' }
  ],
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'projectType', 'status', 'submittedAt'],
    group: 'Construction'
  }
}
```

---

## 🎨 Design System (from templates)

### Color Palette

```css
--navy: #0A1628;
--navy-light: #121F33;
--teal: #00897B;
--teal-light: #26A69A;
--teal-glow: rgba(0,137,123,0.12);
--white: #FAFBFC;
--grey: #E8ECF1;
--grey-light: #F1F4F8;
--grey-mid: #94A3B8;
--grey-dark: #64748B;
--green: #00C853;
--coral: #FF6B6B;
--amber: #F59E0B;
--blue: #2196F3;
--purple: #7C3AED;
```

### Typography

```
Primary Font: DM Sans (400, 500, 600, 700)
Heading Font: Plus Jakarta Sans (500, 600, 700, 800)
Mono Font: JetBrains Mono (400, 500)
```

### Component Patterns

1. **Cards with hover effects**
   - Border color change (grey → teal)
   - Translate Y (-2px to -4px)
   - Box shadow increase
   - Bottom border accent (3px teal)

2. **Icons**
   - Lucide icons
   - Size: 14px-24px
   - Colors: teal, grey-mid, white

3. **Buttons**
   - Primary: teal background, white text
   - Outline: transparent background, white border
   - Ghost: transparent background, teal text
   - Height: 44px-52px
   - Padding: 22px-28px
   - Border radius: 8px-12px
   - Hover: background color swap

4. **Form inputs**
   - Height: 40px-46px
   - Border: 1.5px solid grey
   - Focus: teal border + glow (3px)
   - Border radius: 8px-12px

---

## 🚀 Implementation Steps

### Phase 1: Branch & Collections Setup (Priority 1)

1. **Create construction branch structure**
   ```bash
   mkdir -p src/branches/construction/collections
   mkdir -p src/branches/construction/blocks
   mkdir -p src/components/construction
   mkdir -p src/app/(construction)
   ```

2. **Create collections**
   - ConstructionServices.ts
   - ConstructionProjects.ts
   - ConstructionReviews.ts
   - QuoteRequests.ts

3. **Update payload.config.ts**
   - Import construction collections
   - Add to collections array
   - Set admin grouping

### Phase 2: UI Components (Priority 2)

1. **Base components**
   - ServiceCard
   - ProjectCard
   - ReviewCard
   - StatsBar
   - CTABanner

2. **Form components**
   - QuoteForm (multi-step)
   - StepIndicator
   - FileUpload
   - BudgetSlider

3. **Layout components**
   - ConstructionHeader
   - ConstructionFooter

### Phase 3: Payload Blocks (Priority 3)

1. **Homepage blocks**
   - ConstructionHero
   - StatsBar
   - ServicesGrid
   - ProjectsGrid
   - ReviewsGrid
   - CTABanner

2. **Content blocks**
   - ProcessSteps
   - USPSection
   - FAQ
   - BeforeAfterGallery

### Phase 4: Next.js Routes (Priority 4)

1. **Create route group: (construction)**
   - layout.tsx
   - page.tsx (homepage)

2. **Services routes**
   - diensten/page.tsx
   - diensten/[slug]/page.tsx

3. **Projects routes**
   - projecten/page.tsx
   - projecten/[slug]/page.tsx

4. **Quote form route**
   - offerte-aanvragen/page.tsx

### Phase 5: Seed Data (Priority 5)

1. **Create seed script**
   - 6 services
   - 9+ projects
   - 6+ reviews
   - Settings/globals

2. **Test data quality**
   - Realistic Dutch content
   - Proper images
   - Complete metadata

### Phase 6: Testing & Polish (Priority 6)

1. **Functionality testing**
   - All routes work
   - Forms submit
   - Collections CRUD
   - Blocks render

2. **Responsive design**
   - Mobile breakpoints
   - Tablet layout
   - Desktop optimization

3. **SEO & Performance**
   - Meta tags
   - JSON-LD schemas
   - Image optimization
   - Page load speed

---

## 📋 Acceptance Criteria

### Must Have
- [ ] All 4 collections created and functional
- [ ] Homepage renders with all sections
- [ ] Services list and detail pages work
- [ ] Projects list and detail pages work
- [ ] Quote form submits successfully
- [ ] Admin panel shows all collections
- [ ] Mobile responsive
- [ ] Build succeeds without errors

### Should Have
- [ ] All Payload blocks created
- [ ] Seed data populates automatically
- [ ] Form validation works
- [ ] Image uploads work
- [ ] Search/filter on projects page
- [ ] FAQ accordion works
- [ ] Multi-step form with stepper

### Nice to Have
- [ ] Before/after image slider
- [ ] Project filtering by category/year
- [ ] Review rating stars
- [ ] Photo upload in quote form
- [ ] Email notifications for quotes
- [ ] Admin dashboard stats

---

## 🎯 Success Metrics

1. **Technical**
   - Build time < 40s
   - Zero TypeScript errors
   - Zero console warnings
   - All E2E tests pass

2. **Functional**
   - All 5 pages render correctly
   - Form submissions save to database
   - Admin panel fully functional
   - Images load and display

3. **Quality**
   - Matches design 95%+
   - Responsive on all devices
   - Accessible (WCAG AA)
   - SEO optimized

---

## 📚 References

- Sprint-2 templates: `/docs/design/sprint-2/`
- Vertical slice architecture: `CLAUDE_SERVER_INSTRUCTIONS.md`
- Existing blocks: `src/blocks/`
- Existing collections: `src/branches/*/collections/`

---

**Next Action:** Start Phase 1 - Create branch structure and collections

**Estimated Time:** 4-6 hours total
- Phase 1: 1 hour
- Phase 2: 1.5 hours
- Phase 3: 1 hour
- Phase 4: 1 hour
- Phase 5: 0.5 hours
- Phase 6: 1 hour

---

Generated with Claude Code
