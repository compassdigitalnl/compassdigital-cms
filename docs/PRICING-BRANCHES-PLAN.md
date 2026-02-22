# 💰 SiteForge - Branch-Based Pricing & Features Plan

**Status:** 📋 Planning Phase
**Version:** 2.0 - Branch-Driven Architecture
**Last Updated:** February 2026

---

## 🎯 Philosophy: Pay for What You Use

Instead of traditional tiered pricing (Starter/Pro/Enterprise), we offer **modular branch-based pricing** where clients pay only for the industry branches and features they actually need.

**Core Principle:**
- Every deployment gets: Platform CMS + Core Features (Pages, Media, Users, Settings)
- Clients add **Industry Branches** relevant to their business
- Within branches, clients can enable/disable specific features

---

## 🏗️ Branch Categories & Pricing

### 1️⃣ **INDUSTRY BRANCHES** (Primary Revenue)

Each branch includes all collections, blocks, components, and routes specific to that industry.

| Branch | Monthly Price | Collections | Key Features | Ideal For |
|--------|--------------|-------------|--------------|-----------|
| **E-commerce (B2C)** | €149/mo | Products, Orders, Categories, Invoices, Returns | Shop, Cart, Checkout, My Account, Product Reviews | Online winkel, webshop |
| **E-commerce (B2B)** | €249/mo | + Customer Groups, Group Pricing, Order Lists, Recurring Orders | MOQ, Volume Pricing, Quote Requests, Account Management | Groothandel, B2B webshop |
| **Construction** | €99/mo | Services, Projects, Reviews, Quote Requests | Project Portfolio, Quote Forms, Service Pages | Aannemers, bouwbedrijven |
| **Hospitality** | €129/mo | Menus, Reservations, Events, Locations, Tables | Online Reservations, Event Booking, Menu Management | Restaurants, cafés |
| **Beauty & Wellness** | €129/mo | Services, Treatments, Appointments, Staff, Packages | Online Booking, Treatment Catalog, Staff Profiles | Salons, spa's, klinieken |
| **Real Estate** | €149/mo | Properties, Agents, Viewings, Neighborhoods | Property Search, Viewing Scheduler, Agent Profiles | Makelaars, vastgoed |
| **Professional Services** | €99/mo | Services, Team, Consultations, Case Studies | Service Catalog, Consultation Booking, Team Profiles | Advocaten, accountants |
| **Tourism & Hotels** | €179/mo | Accommodations, Rooms, Bookings, Activities, Reviews | Room Booking, Activity Scheduler, Reviews | Hotels, vakantieparken |
| **Marketplace** | €199/mo | Vendors, Vendor Products, Vendor Reviews, Workshops | Multi-vendor Platform, Commission System | Marktplaatsen |
| **Content & Blog** | €49/mo | Blog Posts, Categories, Authors, FAQs, Testimonials, Cases, Partners | Blog, FAQ, Testimonials, Case Studies | Content sites, bloggers |

**Bundle Discounts:**
- 2 branches: 10% korting
- 3+ branches: 15% korting
- Example: E-commerce B2C (€149) + Content (€49) = €178/mo (10% off) = **€160/mo**

---

### 2️⃣ **E-COMMERCE ADD-ONS** (Modular Features)

These are feature modules within the E-commerce branch that can be enabled separately.

| Add-on | Monthly Price | What's Included | Use Case |
|--------|--------------|-----------------|----------|
| **Subscriptions** | €79/mo | Subscription Plans, User Subscriptions, Recurring Billing, Payment Methods | Abonnementen, membership sites |
| **Gift Vouchers** | €39/mo | Voucher Management, Redemption Tracking, Balance Management | Cadeaubonnen, tegoedbonnen |
| **Digital Licenses** | €59/mo | License Keys, Activations, Software Distribution | Software verkoop, digitale producten |
| **Loyalty Program** | €69/mo | Tiers, Points, Rewards, Transactions, Redemptions | Loyaliteitsprogramma, spaarpunten |
| **Advanced Inventory** | €49/mo | Stock Locations, Stock Movements, Low Stock Alerts | Multi-warehouse, stock management |
| **Variable Products** | €39/mo | Product Variants (maten, kleuren), SKU Management | Kleding, schoenen, varianten |
| **Mix & Match Deals** | €29/mo | Bundle Builder, Multi-buy Discounts | "Kies 3 voor €10" deals |

**Add-on Bundle:** Alle 7 add-ons samen: €299/mo (normaal €362) - **17% korting**

---

### 3️⃣ **ADVANCED FEATURES** (Cross-Branch)

Features that work across all branches and enhance the entire platform.

| Feature | Monthly Price | Description | Benefit |
|---------|--------------|-------------|---------|
| **Multi-Language** | €79/mo | Content translation, Language switcher, Localized URLs | Meertalige websites (EN, DE, FR, etc.) |
| **AI Content Generation** | €99/mo | Auto-generate blog posts, product descriptions, meta tags, SEO analysis | 10x sneller content maken |
| **Advanced Search** | €59/mo | Meilisearch integration, Faceted search, Auto-suggestions | Betere vindbaarheid |
| **Newsletter Integration** | €29/mo | Mailchimp/Brevo integration, Signup forms, Campaign tracking | Email marketing |
| **Analytics Suite** | €49/mo | Advanced analytics, Conversion tracking, Heatmaps | Data-driven beslissingen |

---

## 📦 Pre-Built Packages (Most Popular)

### **Starter Web** - €99/mo
**Perfect voor: Kleine bedrijven, portfolios, dienstverleners**
- ✅ Content Branch (Blog, FAQ, Testimonials)
- ✅ 5 Pages
- ✅ Custom Domain
- ✅ SSL Certificate
- ✅ 10GB Storage

---

### **E-commerce Essential** - €199/mo
**Perfect voor: Online winkels, webshops**
- ✅ E-commerce B2C Branch
- ✅ Content Branch (Blog + FAQ)
- ✅ Up to 500 products
- ✅ Payment Integration (Stripe/Mollie)
- ✅ Order Management
- ✅ Email Notifications
- ✅ 50GB Storage

---

### **E-commerce Pro** - €349/mo
**Perfect voor: Groeiende webshops, B2B bedrijven**
- ✅ E-commerce B2B Branch
- ✅ Content Branch
- ✅ Subscriptions Add-on
- ✅ Loyalty Program Add-on
- ✅ Unlimited products
- ✅ Advanced Analytics
- ✅ Priority Support
- ✅ 200GB Storage

---

### **Industry Professional** - €179/mo
**Perfect voor: Construction, Beauty, Services**
- ✅ 1 Industry Branch (keuze uit Construction/Beauty/Services)
- ✅ Content Branch
- ✅ Booking/Quote System
- ✅ Custom Forms
- ✅ 50GB Storage

---

### **Multi-Branch Enterprise** - €499/mo
**Perfect voor: Grote bedrijven, complexe requirements**
- ✅ 3+ Industry Branches (naar keuze)
- ✅ All E-commerce Add-ons
- ✅ Multi-Language
- ✅ AI Content Generation
- ✅ Advanced Search
- ✅ Dedicated Support
- ✅ 500GB Storage
- ✅ Custom Development Hours (5u/maand)

---

## 🔧 Feature Flag Mapping (Technical)

### Branch → Feature Flags

```typescript
// E-commerce B2C
ENABLE_SHOP=true
ENABLE_CART=true
ENABLE_CHECKOUT=true
ENABLE_MY_ACCOUNT=true

// E-commerce B2B (requires B2C)
ENABLE_B2B=true
ENABLE_CUSTOMER_GROUPS=true
ENABLE_GROUP_PRICING=true
ENABLE_ORDER_LISTS=true
ENABLE_RECURRING_ORDERS=true

// Construction
ENABLE_CONSTRUCTION=true
// → Enables: construction-services, construction-projects,
//            construction-reviews, quote-requests

// Hospitality
ENABLE_HOSPITALITY=true
// → Enables: menus, menu-items, reservations, events, locations

// Beauty & Wellness
ENABLE_BEAUTY=true
// → Enables: treatments, appointments, staff, packages, booking

// Real Estate
ENABLE_REAL_ESTATE=true
// → Enables: properties, agents, viewings, neighborhoods

// Professional Services
ENABLE_SERVICES=true
// → Enables: services, team, consultations, case-studies

// Tourism & Hotels
ENABLE_TOURISM=true
// → Enables: accommodations, rooms, bookings, activities

// Marketplace
ENABLE_VENDORS=true
ENABLE_VENDOR_REVIEWS=true
ENABLE_WORKSHOPS=true

// Content
ENABLE_BLOG=true
ENABLE_FAQ=true
ENABLE_TESTIMONIALS=true
ENABLE_CASES=true
ENABLE_PARTNERS=true

// E-commerce Add-ons
ENABLE_SUBSCRIPTIONS=true
ENABLE_GIFT_VOUCHERS=true
ENABLE_LICENSES=true
ENABLE_LOYALTY=true
ENABLE_VARIABLE_PRODUCTS=true
ENABLE_MIX_AND_MATCH=true

// Advanced Features
ENABLE_MULTI_LANGUAGE=true
ENABLE_AI_CONTENT=true
ENABLE_SEARCH=true
ENABLE_NEWSLETTER=true
```

---

## 🎨 Client Dashboard - Feature Management

In the Platform CMS, each client has a visual feature management interface:

```
┌─────────────────────────────────────────────┐
│ Client: Plastimed B.V.                      │
├─────────────────────────────────────────────┤
│                                             │
│ INDUSTRY BRANCHES                           │
│ ✅ E-commerce (B2C)          €149/mo       │
│ ☐  E-commerce (B2B)          €249/mo       │
│ ☐  Construction              €99/mo        │
│ ☐  Beauty & Wellness         €129/mo       │
│                                             │
│ E-COMMERCE ADD-ONS                          │
│ ✅ Subscriptions             €79/mo        │
│ ☐  Gift Vouchers             €39/mo        │
│ ☐  Digital Licenses          €59/mo        │
│ ✅ Loyalty Program           €69/mo        │
│                                             │
│ CONTENT & MARKETING                         │
│ ✅ Blog & Content            €49/mo        │
│ ✅ Multi-Language            €79/mo        │
│ ☐  AI Content Generation     €99/mo        │
│                                             │
│ MONTHLY TOTAL: €425/mo                      │
│ (15% multi-branch discount applied)         │
└─────────────────────────────────────────────┘
```

---

## 💡 Revenue Examples

### Example 1: Small Accountancy Firm
**Stack:**
- Professional Services Branch: €99/mo
- Content Branch: €49/mo

**Total:** €148/mo → **€133/mo** (10% bundle discount)

---

### Example 2: Growing Webshop
**Stack:**
- E-commerce B2C: €149/mo
- Content Branch: €49/mo
- Subscriptions Add-on: €79/mo
- Loyalty Program: €69/mo

**Total:** €346/mo → **€294/mo** (15% multi-feature discount)

---

### Example 3: Construction Company
**Stack:**
- Construction Branch: €99/mo
- Content Branch: €49/mo
- AI Content Generation: €99/mo

**Total:** €247/mo → **€210/mo** (15% discount)

---

### Example 4: B2B Medical Supplier (like Plastimed)
**Stack:**
- E-commerce B2B: €249/mo
- Content Branch: €49/mo
- Subscriptions: €79/mo
- Loyalty: €69/mo
- Multi-Language: €79/mo

**Total:** €525/mo → **€446/mo** (15% multi-branch discount)

---

### Example 5: Hotel Chain
**Stack:**
- Tourism & Hotels: €179/mo
- Content Branch: €49/mo
- Multi-Language: €79/mo
- Advanced Search: €59/mo

**Total:** €366/mo → **€311/mo** (15% discount)

---

## 🚀 Implementation Roadmap

### Phase 1: E-commerce Branches (LIVE) ✅
- ✅ E-commerce B2C
- ✅ E-commerce B2B
- ✅ Add-ons: Subscriptions, Vouchers, Licenses, Loyalty
- ✅ Content Branch

### Phase 2: Construction Branch (LIVE) ✅
- ✅ Construction collections
- ✅ Quote request system
- ✅ Project portfolio
- ✅ Feature flag: `ENABLE_CONSTRUCTION`

### Phase 3: Hospitality Branch (Q1 2026) 🔜
- Menus & Menu Items
- Reservations
- Events & Catering
- Table Management

### Phase 4: Beauty & Professional Services (Q2 2026) 🔜
- Appointments & Bookings
- Staff Management
- Treatment/Service Catalog
- Professional Services Consultations

### Phase 5: Real Estate & Tourism (Q2-Q3 2026) 🔜
- Property Listings
- Room Bookings
- Activity Scheduler
- Agent/Staff Profiles

---

## 📊 Competitive Analysis

### vs WordPress + WooCommerce
**Their model:** €50-150/mo hosting + €200-500 setup + plugins (€5-30/ea)
**Our advantage:**
- All-in-one (no plugin hell)
- Per-branch pricing (only pay for what you use)
- Modern tech stack (Next.js + Payload)
- Built-in AI features

### vs Shopify
**Their model:** €29-299/mo + 2% transaction fees + apps (€10-50/ea)
**Our advantage:**
- No transaction fees
- More flexible (custom branches)
- Better for non-ecommerce industries (construction, hospitality)
- Full control over hosting

### vs Custom Development
**Their model:** €10,000-50,000 upfront + €500-2000/mo maintenance
**Our advantage:**
- €99-499/mo (no huge upfront cost)
- Instant deployment
- Regular updates included
- Feature toggles (easy scaling)

---

## 🎯 Next Steps

1. **Update `src/lib/features.ts`:**
   - Add feature flags for new branches: `hospitality`, `beauty`, `realEstate`, `services`, `tourism`

2. **Create Branch Directories:**
   ```
   src/branches/hospitality/
   src/branches/beauty/
   src/branches/real-estate/
   src/branches/services/
   src/branches/tourism/
   ```

3. **Platform CMS: Add Pricing UI**
   - Visual feature selector
   - Real-time price calculator
   - Bundle discount display

4. **Documentation:**
   - Branch-specific setup guides
   - Feature comparison matrix
   - Migration guides (from competitors)

5. **Marketing:**
   - Landing pages per branch
   - Industry-specific case studies
   - Pricing calculator on website

---

## 🔐 Technical Notes

### Feature Dependencies

```typescript
// E-commerce B2B requires B2C
if (features.b2b && !features.shop) {
  throw new Error('B2B branch requires E-commerce B2C base')
}

// Subscriptions requires E-commerce
if (features.subscriptions && !features.shop) {
  throw new Error('Subscriptions require E-commerce branch')
}

// Marketplace can be standalone or with E-commerce
// (vendors can sell products or workshops separately)
```

### Database Impact

Each branch has its own collections, so enabling a branch means:
1. New tables created (via Payload auto-migration)
2. New admin menu items appear
3. New API endpoints available
4. New frontend routes activated

**Storage Requirements per Branch:**
- E-commerce B2C: ~50MB base (500 products)
- Content: ~10MB (100 blog posts)
- Construction: ~20MB (50 projects)
- Hospitality: ~30MB (menus + images)

---

**End of Document**

✅ **Ready for review and refinement**
