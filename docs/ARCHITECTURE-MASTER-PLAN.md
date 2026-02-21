# 🏗️ Architecture Master Plan - Vertical Slice Reorganization

**Status**: 📋 Planning Phase
**Goal**: Reorganize codebase into clean vertical slices per industry/branch
**Estimated Effort**: 8-12 hours
**Breaking Changes**: None (backward compatible migration)

---

## 🎯 Problem Statement

### Current Issues:

1. **Collections Chaos** ❌
   - `src/collections/` contains 35+ collections in flat structure
   - No logical grouping (ecommerce, content, marketplace, loyalty all mixed)
   - `src/platform/collections/` exists but only has 3 files
   - `src/collections/shop/` only has 2 collections (ProductCategories, CustomerGroups)

2. **App Routes Inconsistency** ❌
   - `src/app/(app)/` contains ALL ecommerce routes (shop, cart, checkout, account, etc.)
   - `src/app/(frontend)/` has only 6 random pages (faq, privacy, merken, etc.)
   - No branche-based grouping
   - Difficult to enable/disable entire branches

3. **Component Sprawl** ❌
   - Components not organized by feature/branch
   - Hard to find related components
   - No clear boundaries between branches

---

## 🎨 Proposed Architecture - Vertical Slices

```
src/
├─ branches/                          # NEW - Vertical slices per industry
│  ├─ ecommerce/                      # E-commerce branch (Sprint 0-1) ✅
│  │  ├─ collections/
│  │  │  ├─ Products.ts
│  │  │  ├─ ProductCategories.ts
│  │  │  ├─ Orders.ts
│  │  │  ├─ Invoices.ts
│  │  │  ├─ Returns.ts
│  │  │  ├─ RecurringOrders.ts
│  │  │  ├─ OrderLists.ts
│  │  │  ├─ RecentlyViewed.ts
│  │  │  ├─ CustomerGroups.ts
│  │  │  ├─ SubscriptionPlans.ts
│  │  │  ├─ UserSubscriptions.ts
│  │  │  ├─ PaymentMethods.ts
│  │  │  ├─ GiftVouchers.ts
│  │  │  ├─ Licenses.ts
│  │  │  ├─ LicenseActivations.ts
│  │  │  ├─ LoyaltyTiers.ts
│  │  │  ├─ LoyaltyRewards.ts
│  │  │  ├─ LoyaltyPoints.ts
│  │  │  ├─ LoyaltyTransactions.ts
│  │  │  └─ LoyaltyRedemptions.ts
│  │  ├─ components/
│  │  │  ├─ ProductCard/
│  │  │  ├─ ProductGrid/
│  │  │  ├─ Cart/
│  │  │  ├─ Checkout/
│  │  │  ├─ OrderSummary/
│  │  │  └─ ...
│  │  ├─ lib/
│  │  │  ├─ cart.ts
│  │  │  ├─ pricing.ts
│  │  │  ├─ inventory.ts
│  │  │  └─ ...
│  │  └─ routes.ts                    # Route definitions for app/(ecommerce)
│  │
│  ├─ construction/                   # Construction/Bouw branch (Sprint 2) 🆕
│  │  ├─ collections/
│  │  │  ├─ Projects.ts               # Bouw projecten
│  │  │  ├─ Services.ts               # Bouw diensten
│  │  │  ├─ ProjectCategories.ts      # Project types (nieuwbouw, renovatie, etc.)
│  │  │  ├─ QuoteRequests.ts          # Offerte aanvragen
│  │  │  ├─ ProjectGallery.ts         # Project foto galerijen
│  │  │  └─ Contractors.ts            # Aannemers/vakmensen
│  │  ├─ components/
│  │  │  ├─ ProjectCard/
│  │  │  ├─ QuoteForm/
│  │  │  ├─ ServiceOverview/
│  │  │  └─ ...
│  │  ├─ lib/
│  │  │  ├─ quotes.ts
│  │  │  ├─ project-calculator.ts
│  │  │  └─ ...
│  │  └─ routes.ts                    # Route definitions for app/(construction)
│  │
│  ├─ hospitality/                    # Horeca branch (Sprint 3) 🔜
│  │  ├─ collections/
│  │  │  ├─ Menus.ts                  # Restaurant menus
│  │  │  ├─ MenuItems.ts              # Gerechten
│  │  │  ├─ MenuCategories.ts         # Voorgerecht, Hoofdgerecht, etc.
│  │  │  ├─ Reservations.ts           # Tafereservaties
│  │  │  ├─ Events.ts                 # Events/Catering
│  │  │  ├─ Locations.ts              # Vestigingen
│  │  │  └─ Reviews.ts                # Restaurant reviews
│  │  ├─ components/
│  │  │  ├─ MenuDisplay/
│  │  │  ├─ ReservationForm/
│  │  │  ├─ EventCalendar/
│  │  │  └─ ...
│  │  └─ routes.ts
│  │
│  ├─ services/                       # Professional Services (Sprint 4) 🔜
│  │  ├─ collections/                 # Accountants, Lawyers, Consultants, etc.
│  │  │  ├─ ServicePackages.ts        # Service pakketten
│  │  │  ├─ Consultations.ts          # Afspraken/consultaties
│  │  │  ├─ Expertise.ts              # Vakgebieden
│  │  │  ├─ CaseStudies.ts            # Success stories
│  │  │  └─ Appointments.ts           # Afspraak systeem
│  │  ├─ components/
│  │  │  ├─ AppointmentBooking/
│  │  │  ├─ ServiceCard/
│  │  │  └─ ...
│  │  └─ routes.ts
│  │
│  ├─ marketplace/                    # Marketplace/Vendor branch (Sprint 5) ✅
│  │  ├─ collections/
│  │  │  ├─ Vendors.ts
│  │  │  ├─ VendorReviews.ts
│  │  │  ├─ Workshops.ts
│  │  │  └─ ...
│  │  └─ components/
│  │
│  └─ README.md                       # Branch overview documentation
│
├─ app/                               # REORGANIZED - Next.js App Router
│  ├─ (payload)/                      # Payload Admin (unchanged)
│  │  ├─ admin/
│  │  └─ api/
│  │
│  ├─ (platform)/                     # Platform routes (unchanged)
│  │  └─ platform/
│  │
│  ├─ (ecommerce)/                    # 🆕 E-commerce routes (was (app))
│  │  ├─ shop/
│  │  ├─ cart/
│  │  ├─ checkout/
│  │  ├─ my-account/
│  │  ├─ orders/
│  │  ├─ gift-vouchers/
│  │  └─ layout.tsx                   # Ecommerce-specific layout
│  │
│  ├─ (construction)/                 # 🆕 Construction routes (Sprint 2)
│  │  ├─ projecten/                   # Projects overview
│  │  ├─ projecten/[slug]/            # Project detail
│  │  ├─ diensten/                    # Services overview
│  │  ├─ diensten/[slug]/             # Service detail
│  │  ├─ offerte-aanvragen/           # Quote request
│  │  └─ layout.tsx                   # Construction-specific layout
│  │
│  ├─ (hospitality)/                  # 🆕 Horeca routes (Sprint 3)
│  │  ├─ menu/
│  │  ├─ reserveren/
│  │  ├─ events/
│  │  └─ layout.tsx
│  │
│  ├─ (services)/                     # 🆕 Professional services routes (Sprint 4)
│  │  ├─ diensten/
│  │  ├─ afspraak-maken/
│  │  ├─ expertise/
│  │  └─ layout.tsx
│  │
│  ├─ (shared)/                       # 🆕 Shared routes (was (frontend))
│  │  ├─ [slug]/                      # Dynamic pages
│  │  ├─ blog/
│  │  ├─ faq/
│  │  ├─ privacy/
│  │  ├─ algemene-voorwaarden/
│  │  ├─ contact/
│  │  └─ layout.tsx                   # Shared layout (header/footer)
│  │
│  └─ api/                            # API routes (reorganized)
│     ├─ ecommerce/                   # 🆕 E-commerce APIs
│     │  ├─ products/
│     │  ├─ cart/
│     │  ├─ checkout/
│     │  └─ orders/
│     ├─ construction/                # 🆕 Construction APIs
│     │  ├─ quotes/
│     │  └─ projects/
│     ├─ hospitality/                 # 🆕 Horeca APIs
│     │  ├─ reservations/
│     │  └─ menus/
│     ├─ services/                    # 🆕 Professional services APIs
│     │  └─ appointments/
│     └─ shared/                      # Shared APIs (contact, search, etc.)
│        ├─ contact/
│        ├─ search/
│        ├─ health/
│        └─ og/
│
├─ collections/                       # DEPRECATED - Keep for backward compat
│  └─ README.md                       # "MOVED to src/branches/*"
│
├─ components/                        # Shared/core components only
│  ├─ Header/
│  ├─ Footer/
│  ├─ RichText/
│  ├─ Grid/
│  └─ ...
│
├─ blocks/                            # Shared blocks (unchanged)
│  ├─ Hero/
│  ├─ Features/
│  └─ ...
│
├─ lib/                               # Core utilities (unchanged)
│  ├─ features.ts
│  ├─ featureFields.ts
│  └─ ...
│
└─ platform/                          # Platform code (unchanged)
   ├─ collections/                    # Platform collections (Clients, etc.)
   └─ components/
```

---

## 📦 Branch-Specific Collections Mapping

### **Ecommerce Branch** (19 collections)
```
✅ Products
✅ ProductCategories (from shop/)
✅ Orders
✅ Invoices
✅ Returns
✅ RecurringOrders
✅ OrderLists
✅ RecentlyViewed
✅ CustomerGroups (from shop/)
✅ SubscriptionPlans
✅ UserSubscriptions
✅ PaymentMethods
✅ GiftVouchers
✅ Licenses
✅ LicenseActivations
✅ LoyaltyTiers
✅ LoyaltyRewards
✅ LoyaltyPoints
✅ LoyaltyTransactions
✅ LoyaltyRedemptions
```

### **Marketplace Branch** (3 collections)
```
✅ Vendors
✅ VendorReviews
✅ Workshops
```

### **Content Branch** (Shared) (4 collections)
```
✅ BlogPosts
✅ BlogCategories
✅ FAQs
✅ Testimonials
```

### **Shared/Core** (7 collections)
```
✅ Pages
✅ Media
✅ Users
✅ FormSubmissions
✅ Brands (can be used across branches)
✅ Partners (can be used across branches)
✅ ServicesCollection → Move to services branch OR keep shared
```

### **Platform** (3 collections - stay in src/platform/)
```
✅ Clients
✅ ClientRequests
✅ Deployments
```

### **Construction Branch** (NEW - Sprint 2)
```
🆕 Projects
🆕 ProjectCategories
🆕 Services (construction-specific)
🆕 QuoteRequests
🆕 ProjectGallery
🆕 Contractors
```

### **Hospitality Branch** (NEW - Sprint 3)
```
🔜 Menus
🔜 MenuItems
🔜 MenuCategories
🔜 Reservations
🔜 Events
🔜 Locations
🔜 Reviews (hospitality-specific)
```

### **Professional Services Branch** (NEW - Sprint 4)
```
🔜 ServicePackages
🔜 Consultations
🔜 Expertise
🔜 CaseStudies
🔜 Appointments
```

---

## 🔄 Migration Strategy

### **Phase 1: Create Branch Structure** (2 hours)
```bash
mkdir -p src/branches/ecommerce/collections
mkdir -p src/branches/ecommerce/components
mkdir -p src/branches/ecommerce/lib
mkdir -p src/branches/marketplace/collections
mkdir -p src/branches/marketplace/components
mkdir -p src/branches/content/collections
mkdir -p src/branches/shared/collections
mkdir -p src/branches/construction/collections  # Sprint 2
mkdir -p src/branches/construction/components
mkdir -p src/branches/construction/lib
```

### **Phase 2: Move Collections** (3 hours)
**Strategy**: Move files + create symlinks for backward compatibility

```bash
# Ecommerce collections
mv src/collections/Products.ts src/branches/ecommerce/collections/
mv src/collections/Orders.ts src/branches/ecommerce/collections/
mv src/collections/Invoices.ts src/branches/ecommerce/collections/
# ... (repeat for all 19 ecommerce collections)

# Create backward-compatible symlinks
ln -s ../../branches/ecommerce/collections/Products.ts src/collections/Products.ts
ln -s ../../branches/ecommerce/collections/Orders.ts src/collections/Orders.ts
# ... (repeat)

# Marketplace collections
mv src/collections/Vendors.ts src/branches/marketplace/collections/
mv src/collections/VendorReviews.ts src/branches/marketplace/collections/
mv src/collections/Workshops.ts src/branches/marketplace/collections/

# Content collections
mv src/collections/BlogPosts.ts src/branches/content/collections/
mv src/collections/BlogCategories.ts src/branches/content/collections/
# ...

# Shared collections
mv src/collections/Pages src/branches/shared/collections/
mv src/collections/Media.ts src/branches/shared/collections/
# ...
```

### **Phase 3: Update payload.config.ts** (1 hour)
```typescript
// src/payload.config.ts

// Import from branches
import { ecommerceCollections } from './branches/ecommerce/collections'
import { marketplaceCollections } from './branches/marketplace/collections'
import { contentCollections } from './branches/content/collections'
import { sharedCollections } from './branches/shared/collections'
import { constructionCollections } from './branches/construction/collections'
import { platformCollections } from './platform/collections'

export default buildConfig({
  collections: [
    ...sharedCollections,           // Always included
    ...contentCollections,          // Always included (blog, faq)
    ...platformCollections,         // Platform (Clients, etc.)

    // Branch collections - conditionally included based on features
    ...(features.shop ? ecommerceCollections : []),
    ...(features.vendors ? marketplaceCollections : []),
    ...(features.construction ? constructionCollections : []),
    ...(features.hospitality ? hospitalityCollections : []),
    ...(features.professionalServices ? professionalServicesCollections : []),
  ],
  // ...
})
```

### **Phase 4: Create Branch Index Files** (1 hour)
```typescript
// src/branches/ecommerce/collections/index.ts
export { Products } from './Products'
export { ProductCategories } from './ProductCategories'
export { Orders } from './Orders'
// ... export all

export const ecommerceCollections = [
  Products,
  ProductCategories,
  Orders,
  // ...
]
```

### **Phase 5: Reorganize App Routes** (2 hours)
```bash
# Move ecommerce routes
mv src/app/(app)/shop src/app/(ecommerce)/shop
mv src/app/(app)/cart src/app/(ecommerce)/cart
mv src/app/(app)/checkout src/app/(ecommerce)/checkout
mv src/app/(app)/my-account src/app/(ecommerce)/my-account
# ...

# Move shared routes
mv src/app/(frontend)/faq src/app/(shared)/faq
mv src/app/(frontend)/blog src/app/(shared)/blog
mv src/app/(app)/[slug] src/app/(shared)/[slug]
# ...

# Remove old directories
rmdir src/app/(app)
rmdir src/app/(frontend)
```

### **Phase 6: Update Imports** (2 hours)
**Use automated tool**:
```bash
# Create migration script
node scripts/update-collection-imports.mjs

# OR use find/replace
find src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/collections/Products|@/branches/ecommerce/collections/Products|g'
```

---

## 🎯 Implementation Order

### **Sprint 0: Preparation** (1-2 hours)
- [x] Create this master plan
- [ ] Create migration script
- [ ] Test migration on single collection
- [ ] Document rollback plan

### **Sprint 1: Move Ecommerce** (3-4 hours)
- [ ] Create `src/branches/ecommerce/` structure
- [ ] Move all 19 ecommerce collections
- [ ] Create index.ts exports
- [ ] Update payload.config.ts
- [ ] Test: `npm run dev` (should work identically)
- [ ] Commit: "refactor: move ecommerce collections to vertical slice"

### **Sprint 2: Move Other Existing Branches** (2-3 hours)
- [ ] Create `src/branches/marketplace/` and move Vendors, etc.
- [ ] Create `src/branches/content/` and move Blog, FAQ, etc.
- [ ] Create `src/branches/shared/` and move Pages, Media, Users
- [ ] Update all imports
- [ ] Test compilation
- [ ] Commit: "refactor: complete vertical slice migration"

### **Sprint 3: Reorganize App Routes** (2-3 hours)
- [ ] Create `src/app/(ecommerce)/` and move routes
- [ ] Create `src/app/(shared)/` and move routes
- [ ] Update layouts
- [ ] Test all routes
- [ ] Commit: "refactor: reorganize app routes by vertical slice"

### **Sprint 4: Construction Branch** (NEW - Sprint 2 content)
- [ ] Create `src/branches/construction/` structure
- [ ] Implement construction collections (Projects, Services, etc.)
- [ ] Create `src/app/(construction)/` routes
- [ ] Add feature flag `ENABLE_CONSTRUCTION`
- [ ] Implement frontend (bouw-homepage, dienst-detail, etc.)
- [ ] Commit: "feat: add construction vertical slice"

### **Sprint 5: Cleanup** (1 hour)
- [ ] Remove symlinks from `src/collections/`
- [ ] Add README.md in old locations pointing to new structure
- [ ] Update documentation
- [ ] Commit: "docs: update architecture documentation"

---

## ✅ Success Criteria

1. **No Breaking Changes** ✅
   - All existing code continues to work
   - Backward compatible imports via symlinks (phase 1)
   - Can remove symlinks after all imports updated

2. **Clean Separation** ✅
   - Each branch is self-contained
   - Clear boundaries between branches
   - Easy to enable/disable entire branches via feature flags

3. **Scalability** ✅
   - Easy to add new branches (hospitality, services, healthcare, etc.)
   - Consistent structure across all branches
   - Plug-and-play architecture

4. **Developer Experience** ✅
   - Intuitive file locations
   - Easy to find related code
   - Clear mental model

---

## 🏷️ Feature Flags for Branches

```typescript
// src/lib/features.ts

export interface ClientFeatures {
  // Existing
  shop?: boolean
  blog?: boolean
  vendors?: boolean

  // New branch flags
  construction?: boolean        // Sprint 2
  hospitality?: boolean         // Sprint 3
  professionalServices?: boolean // Sprint 4
  healthcare?: boolean          // Sprint 5
  automotive?: boolean          // Sprint 6
  realestate?: boolean          // Sprint 7
}

export const features = {
  // ...existing

  // New branches
  construction: isFeatureEnabled('construction'),
  hospitality: isFeatureEnabled('hospitality'),
  professionalServices: isFeatureEnabled('professional_services'),
}
```

---

## 📝 Naming Conventions

### **Branch Names**:
- `ecommerce` - E-commerce/webshop
- `construction` - Bouw/aannemerij
- `hospitality` - Horeca/restaurants
- `services` - Professional services (accountants, lawyers, consultants)
- `healthcare` - Zorg/medisch (future)
- `automotive` - Automotive/garage (future)
- `realestate` - Real estate/makelaardij (future)

### **Collection Naming**:
- **Branch-specific**: `Projects.ts` (in construction branch)
- **Shared**: `Pages.ts`, `Media.ts`, `Users.ts`
- **Platform**: `Clients.ts`, `Deployments.ts`

### **Route Naming**:
- **Route groups**: `(ecommerce)`, `(construction)`, `(shared)`
- **Dutch URLs**: `/projecten`, `/diensten`, `/offerte-aanvragen`

---

## 🚀 Benefits

1. **Modularity** 📦
   - Enable/disable entire branches
   - Ship only what clients need
   - Reduce bundle size

2. **Maintainability** 🛠️
   - Clear code organization
   - Easy to find related code
   - Reduced cognitive load

3. **Scalability** 📈
   - Easy to add new branches
   - Consistent patterns
   - Template for new verticals

4. **Performance** ⚡
   - Code splitting per branch
   - Lazy load unused branches
   - Smaller admin bundle

5. **Team Collaboration** 👥
   - Clear ownership boundaries
   - Parallel development
   - Less merge conflicts

---

## ⚠️ Risks & Mitigations

### **Risk 1: Import Path Changes**
**Mitigation**:
- Use symlinks during transition
- Automated find/replace script
- Gradual migration over multiple commits

### **Risk 2: Circular Dependencies**
**Mitigation**:
- Clear dependency rules (branches can't depend on each other)
- Shared code goes in `src/shared/` or `src/lib/`

### **Risk 3: Testing Overhead**
**Mitigation**:
- Comprehensive test suite before migration
- Test after each phase
- Keep old structure as fallback

---

## 📚 Documentation Updates Needed

1. **README.md** - Update with new structure
2. **CONTRIBUTING.md** - Add branch creation guide
3. **ARCHITECTURE.md** - Document vertical slice pattern
4. **Each branch README.md** - Document branch-specific info

---

**Total Estimated Time**: 12-15 hours
**Priority**: High (foundation for all future sprints)
**Impact**: 🚀 Massive improvement in code organization
**Risk Level**: Low (backward compatible, phased approach)
