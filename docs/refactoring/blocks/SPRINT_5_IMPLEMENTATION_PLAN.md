# Sprint 5 Implementation Plan - Social Proof & Trust Blocks

**Sprint:** 5 of 10
**Focus:** Social proof, credibility, and trust-building blocks
**Blocks:** B07 (Services), B11 (LogoBar), B23 (Stats), B24 (Team)
**Status:** 🔄 Ready for Implementation
**Date:** February 24, 2026

---

## 📋 Overview

Sprint 5 focuses on implementing **social proof and trust-building blocks** that help establish credibility:

1. **B07 - Services Block** - Showcase services/features in a grid
2. **B11 - LogoBar Block** - Display client/partner logos with optional auto-scroll
3. **B23 - Stats Block** - Highlight key metrics and achievements
4. **B24 - Team Block** - Introduce team members with photos and bios

These blocks are essential for building trust and showcasing expertise.

---

## 🎯 Implementation Approach

### Clean Slate Strategy
Following Sprint 4's successful approach:
- ✅ Delete ALL existing block files completely
- ✅ Implement fresh from Sprint 5 specifications
- ✅ Make everything **theme-aware** from the start
- ✅ Use Theme global tokens for all colors

### Existing Files to Remove
```bash
# Directories
src/branches/shared/blocks/Services/
src/branches/shared/blocks/LogoBar/
src/branches/shared/blocks/Stats/
src/branches/shared/blocks/Team/

# Files
src/branches/shared/blocks/LogoBar.ts
src/branches/shared/blocks/Stats.ts
src/branches/shared/blocks/Team.ts
```

---

## 📦 Block Specifications

### B07 - Services Block

**Purpose:** Display services/features in a grid with icons, titles, descriptions, and optional links.

**Configuration:**
```typescript
{
  slug: 'services',
  interfaceName: 'ServicesBlock',
  fields: [
    { name: 'subtitle', type: 'text' },        // Optional overline
    { name: 'title', type: 'text' },           // Main heading
    { name: 'description', type: 'textarea' }, // Section intro
    { name: 'columns', type: 'select',         // 2, 3, or 4 columns
      options: ['2', '3', '4'],
      defaultValue: '3'
    },
    { name: 'services', type: 'array',
      minRows: 2,
      maxRows: 12,
      fields: [
        { name: 'icon', type: 'text' },        // Lucide icon name
        { name: 'iconColor', type: 'select',   // Theme-aware colors
          options: ['teal', 'blue', 'green', 'purple', 'amber', 'coral']
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'link', type: 'text' },        // Optional URL
        { name: 'linkText', type: 'text',
          defaultValue: 'Meer info'
        }
      ]
    },
    { name: 'backgroundColor', type: 'select', // Theme-aware
      options: ['white', 'bg', 'grey', 'tealLight', 'navyLight']
    }
  ]
}
```

**Key Features:**
- Lucide icons support
- Flexible grid layouts (2/3/4 columns)
- Optional links per service
- Theme-aware icon colors
- Responsive mobile stacking

---

### B11 - LogoBar Block

**Purpose:** Display client/partner logos in a grid or auto-scrolling carousel.

**Configuration:**
```typescript
{
  slug: 'logobar',
  interfaceName: 'LogoBarBlock',
  fields: [
    { name: 'title', type: 'text' },           // Optional heading
    { name: 'logos', type: 'array',
      minRows: 3,
      maxRows: 20,
      fields: [
        { name: 'image', type: 'upload',       // Logo image
          relationTo: 'media',
          required: true
        },
        { name: 'name', type: 'text',          // Alt text
          required: true
        },
        { name: 'link', type: 'text' }         // Optional URL
      ]
    },
    { name: 'autoScroll', type: 'checkbox',    // Carousel mode
      defaultValue: false
    },
    { name: 'variant', type: 'select',         // Background variant
      options: ['light', 'white', 'dark'],
      defaultValue: 'light'
    }
  ]
}
```

**Key Features:**
- Upload multiple logos (3-20)
- Optional auto-scroll animation
- Clickable logos (optional links)
- 3 background variants (light/white/dark)
- Grayscale logos with color on hover
- Responsive grid

---

### B23 - Stats Block

**Purpose:** Highlight key metrics and achievements with visual impact.

**Configuration:**
```typescript
{
  slug: 'stats',
  interfaceName: 'StatsBlock',
  fields: [
    { name: 'title', type: 'text' },           // Optional heading
    { name: 'description', type: 'textarea' }, // Optional intro
    { name: 'columns', type: 'select',         // 2, 3, or 4 columns
      options: ['2', '3', '4'],
      defaultValue: '3'
    },
    { name: 'stats', type: 'array',
      minRows: 2,
      maxRows: 4,
      fields: [
        { name: 'icon', type: 'text' },        // Optional emoji/icon
        { name: 'value', type: 'text',         // The stat (e.g., "500+")
          required: true
        },
        { name: 'label', type: 'text',         // Description (e.g., "Clients")
          required: true
        },
        { name: 'description', type: 'text' }  // Optional detail
      ]
    },
    { name: 'backgroundColor', type: 'select', // Theme-aware
      options: ['white', 'grey', 'tealGradient', 'navyGradient'],
      defaultValue: 'white'
    }
  ]
}
```

**Key Features:**
- 2-4 statistics per block
- Optional icons/emojis
- Optional descriptions
- Multiple background styles
- Large, prominent numbers
- Centered layout

---

### B24 - Team Block

**Purpose:** Introduce team members with photos, roles, bios, and contact info.

**Configuration:**
```typescript
{
  slug: 'team',
  interfaceName: 'TeamBlock',
  fields: [
    { name: 'subtitle', type: 'text' },        // Optional overline
    { name: 'title', type: 'text' },           // Main heading
    { name: 'description', type: 'textarea' }, // Section intro
    { name: 'columns', type: 'select',         // 2, 3, or 4 columns
      options: ['2', '3', '4'],
      defaultValue: '3'
    },
    { name: 'photoStyle', type: 'select',      // Photo shape
      options: ['square', 'circle'],
      defaultValue: 'square'
    },
    { name: 'members', type: 'array',
      minRows: 2,
      maxRows: 20,
      fields: [
        { name: 'photo', type: 'upload',       // Profile photo
          relationTo: 'media',
          required: true
        },
        { name: 'name', type: 'text',
          required: true
        },
        { name: 'role', type: 'text',          // Job title
          required: true
        },
        { name: 'bio', type: 'textarea' },     // Short bio
        { name: 'email', type: 'email' },      // Contact email
        { name: 'linkedin', type: 'text' },    // LinkedIn URL
        { name: 'twitter', type: 'text' },     // Twitter URL
        { name: 'github', type: 'text' }       // GitHub URL
      ]
    },
    { name: 'backgroundColor', type: 'select', // Theme-aware
      options: ['white', 'bg', 'grey'],
      defaultValue: 'bg'
    }
  ]
}
```

**Key Features:**
- Profile photos with square/circle options
- Name, role, bio for each member
- Contact email + social links
- Flexible grid layouts (2/3/4 columns)
- Hover effects on cards
- Responsive mobile layout

---

## 🎨 Theme Integration

All Sprint 5 blocks MUST be theme-aware:

### Color References
```typescript
// Background colors - Always reference Theme global
backgroundColor: {
  options: [
    { label: 'White (theme.colors.white)', value: 'white' },
    { label: 'Light Background (theme.colors.bg)', value: 'bg' },
    { label: 'Light Grey (theme.colors.grey)', value: 'grey' },
    { label: 'Teal Light (theme.colors.tealLight)', value: 'tealLight' },
    { label: 'Navy Light (theme.colors.navyLight)', value: 'navyLight' },
    { label: 'Teal Gradient (theme.gradients.teal)', value: 'tealGradient' },
    { label: 'Navy Gradient (theme.gradients.navy)', value: 'navyGradient' }
  ]
}

// Icon colors for Services block
iconColor: {
  options: [
    { label: 'Teal (theme.colors.teal)', value: 'teal' },
    { label: 'Blue (theme.colors.blue)', value: 'blue' },
    { label: 'Green (theme.colors.green)', value: 'green' },
    { label: 'Purple (theme.colors.purple)', value: 'purple' },
    { label: 'Amber (theme.colors.amber)', value: 'amber' },
    { label: 'Coral (theme.colors.coral)', value: 'coral' }
  ]
}
```

### CSS Variables Mapping
```css
/* These will be rendered on frontend: */
--color-white
--color-bg
--color-grey
--color-teal
--color-teal-light
--color-navy
--color-navy-light
--color-blue
--color-green
--color-purple
--color-amber
--color-coral
```

---

## 🚀 Implementation Steps

### Phase 1: Clean Slate (5 min)
```bash
# Remove old blocks
rm -rf src/branches/shared/blocks/Services/
rm -rf src/branches/shared/blocks/LogoBar/
rm -rf src/branches/shared/blocks/Stats/
rm -rf src/branches/shared/blocks/Team/
rm src/branches/shared/blocks/LogoBar.ts
rm src/branches/shared/blocks/Stats.ts
rm src/branches/shared/blocks/Team.ts
```

### Phase 2: Implement New Configs (30 min)

**Create:**
1. `src/branches/shared/blocks/Services/config.ts` - Full Services block
2. `src/branches/shared/blocks/LogoBar/config.ts` - Full LogoBar block
3. `src/branches/shared/blocks/Stats/config.ts` - Full Stats block
4. `src/branches/shared/blocks/Team/config.ts` - Full Team block

**Requirements:**
- All colors reference Theme global tokens
- All option labels show which theme property is used
- Proper validation (URLs, required fields)
- Admin descriptions for all fields
- Row layouts for paired fields

### Phase 3: Update Pages Collection (5 min)
```typescript
// src/branches/shared/collections/Pages/index.ts

// Update imports
import { Services } from '@/branches/shared/blocks/Services/config'
import { LogoBar } from '@/branches/shared/blocks/LogoBar/config'
import { Stats } from '@/branches/shared/blocks/Stats/config'
import { Team } from '@/branches/shared/blocks/Team/config'

// Add to blocks array (in appropriate position)
blocks: [
  // ... existing blocks

  // Social proof & Portfolio
  TestimonialsBlock,
  CasesBlock,
  LogoBar,    // NEW
  Stats,      // NEW
  Services,   // NEW or moved here
  Team,       // NEW

  // ... rest of blocks
]
```

### Phase 4: Generate Migration (5 min - Manual)
```bash
npx payload migrate:create sprint5_social_proof_blocks

# Select "create table" for all:
- pages_blocks_services
- pages_blocks_services_services (array items)
- pages_blocks_logobar
- pages_blocks_logobar_logos (array items)
- pages_blocks_stats
- pages_blocks_stats_stats (array items)
- pages_blocks_team
- pages_blocks_team_members (array items)
```

### Phase 5: Test & Verify (10 min)
```bash
# Test TypeScript compilation
npm run build

# Run migration
npx payload migrate

# Start dev server and test in admin
npm run dev
```

---

## ✅ Acceptance Criteria

### Functional Requirements
- [ ] All 4 blocks create successfully in admin
- [ ] Services block displays with correct columns
- [ ] LogoBar shows logos and auto-scroll works
- [ ] Stats block displays metrics prominently
- [ ] Team block shows photos, bios, and social links
- [ ] All theme colors apply correctly
- [ ] Mobile responsive layouts work

### Technical Requirements
- [ ] All blocks theme-aware (reference Theme global)
- [ ] TypeScript builds without errors
- [ ] Database migration generates successfully
- [ ] No console errors in admin panel
- [ ] All field validations work
- [ ] Array min/max limits enforced

### Documentation Requirements
- [ ] Sprint 5 progress doc created
- [ ] All blocks have clear admin descriptions
- [ ] Theme token mapping documented
- [ ] Migration steps documented

---

## 📊 Complexity Estimate

**Total Effort:** ~60 minutes

| Task | Time | Complexity |
|------|------|-----------|
| Read specifications | 10 min | Low |
| Remove old blocks | 5 min | Low |
| Implement Services config | 15 min | Medium |
| Implement LogoBar config | 10 min | Low |
| Implement Stats config | 10 min | Low |
| Implement Team config | 15 min | Medium |
| Update Pages collection | 5 min | Low |
| Test & migration | 10 min | Low |

**Difficulty:** Medium (more fields per block than Sprint 4)

---

## 🎯 Success Metrics

- ✅ 4/4 blocks implemented
- ✅ 100% theme-aware (all colors)
- ✅ Build passes (exit code 0)
- ✅ Migration generates successfully
- ✅ Admin panel shows all blocks correctly

---

## 📚 Reference Documentation

**Sprint 5 Specs:**
- `docs/refactoring/sprint-5/b07-services.html`
- `docs/refactoring/sprint-5/b11-logobar.html`
- `docs/refactoring/sprint-5/b23-stats.html`
- `docs/refactoring/sprint-5/b24-team.html`

**Related:**
- Theme Global: `src/globals/Theme.ts`
- Theme Types: `src/types/theme.ts`
- Pages Collection: `src/branches/shared/collections/Pages/index.ts`
- Sprint 4 Progress: `docs/refactoring/SPRINT_4_PROGRESS.md`

---

## 🔄 Rollback Plan

If issues arise:
```bash
# Revert to Sprint 4 state
git checkout HEAD~1 src/branches/shared/blocks/
git checkout HEAD~1 src/branches/shared/collections/Pages/

# Remove Sprint 5 migration
rm src/migrations/*sprint5*
npx payload migrate:status
```

---

**Created:** February 24, 2026
**Sprint:** 5 of 10
**Next:** Frontend components (Sprint 5 Phase 2)
