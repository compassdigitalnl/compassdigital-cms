# 🛒 Cart, Checkout & My-Account Implementation Plan

**Datum:** 19 Februari 2026
**Status:** 📋 Implementation Plan - Awaiting Approval
**Templates:** Enterprise Template 1 (meest volledig, B2B features)

---

## 📊 Executive Summary

### Wat Gaan We Bouwen?
Complete e-commerce customer experience templates:
1. **Cart Template** - Winkelwagen met enterprise features
2. **Checkout Template** - Complete checkout flow met B2B support
3. **My-Account Template** - Customer dashboard met account management

### CMS Readiness Assessment: ✅ 95% KLAAR!

**Bestaande Backend (COMPLEET):**
- ✅ Orders collection - Complete order management
- ✅ OrderLists collection - Bestellijsten/order lists
- ✅ Users collection - Authentication + addresses + company info
- ✅ Products collection - Full product catalog
- ✅ CartContext - Cart state management (localStorage)
- ✅ B2B Support - Account types, company fields, MOQ/multiples

**Bestaande Frontend (BASIS):**
- 🔧 `/cart` page exists - Needs Template 1 redesign
- 🔧 `/checkout` page exists - Needs Template 1 redesign
- ❌ `/my-account` page - NIET AANWEZIG (needs complete build)

**Missende Functionaliteit:**
- ❌ Order creation API endpoint
- ❌ Payment gateway integration (Mollie/Stripe)
- ❌ Order history retrieval
- ❌ Invoice PDF generation
- ❌ Email notifications (order confirmation, shipping)

---

## 🎯 Implementation Scope

### Phase 1: Cart Template (Enterprise) ✅ READY TO BUILD
**Files:** `src/app/(app)/cart/page.tsx` (REPLACE existing)
**Backend:** ✅ CartContext complete, no changes needed
**Estimated:** 4-6 hours

**Features from Design:**
1. **Cart Layout**
   - Main content area (cart items)
   - Sidebar (order summary, sticky)
   - Responsive grid layout

2. **Cart Items Display**
   - Product image thumbnail
   - Title + SKU/EAN
   - Unit price + quantity stepper
   - Subtotal per item
   - Remove button
   - **Grouped products** - Items from same parent grouped together

3. **Free Shipping Progress Bar**
   - Visual progress indicator
   - "Nog €XX,XX tot gratis verzending!" message
   - Confetti animation at 100%

4. **Volume Pricing Hints**
   - "Bij 5 stuks: €8,45 per stuk (-6%)" badges
   - Staffelprijzen calculator
   - Automatic price updates

5. **Order Summary Sidebar**
   - Subtotal, shipping, BTW breakdown
   - Total (prominent)
   - Coupon code input
   - Checkout button (large, primary)

6. **Cross-Sell Section**
   - "Ook interessant" product suggestions
   - Based on cart contents
   - Quick-add buttons

7. **Trust Badges**
   - "Gratis verzending vanaf €150"
   - "Morgen in huis (voor 16:00 besteld)"
   - "100% veilig betalen"

8. **Empty Cart State**
   - Icon + message
   - "Verder winkelen" button
   - Recent products suggestion

**Technical Requirements:**
- Client component (`'use client'`)
- CartContext integration
- Real-time total calculation
- localStorage persistence
- Responsive design (mobile-first)

---

### Phase 2: Checkout Template (Enterprise) ⚠️ NEEDS BACKEND
**Files:** `src/app/(app)/checkout/page.tsx` (REPLACE existing)
**Backend:** ❌ MISSING: Order creation API, payment integration
**Estimated:** 8-10 hours (incl. backend work)

**Features from Design:**
1. **Progress Steps Indicator**
   - Cart → Checkout → Confirmation
   - Visual breadcrumbs at top
   - Current step highlighted

2. **Checkout Form Sections**
   - **Contact Information**
     - Email (required)
     - Phone (required)
     - Newsletter opt-in checkbox

   - **Delivery Address**
     - T.a.v. (name)
     - Company name (conditional for B2B)
     - Street + house number
     - Postal code + city
     - Country dropdown (default: Nederland)
     - "Save as default address" checkbox

   - **Billing Address**
     - "Zelfde als afleveradres" checkbox (default checked)
     - Conditional form fields if different
     - KVK + BTW fields for B2B accounts

3. **B2B Toggle**
   - "Zakelijke bestelling" checkbox
   - Shows/hides company fields
   - Auto-enabled for B2B account types

4. **Delivery Options**
   - Radio buttons for shipping methods:
     - Standaard (1-2 werkdagen) - €9,95
     - Express (voor 16:00 besteld, morgen in huis) - €14,95
     - Gratis verzending (vanaf €150) - €0,00
   - Auto-select free shipping if applicable

5. **Payment Methods**
   - Radio buttons with icons:
     - iDEAL (most popular, default)
     - Creditcard (Visa/Mastercard)
     - Op rekening (B2B only, 30 dagen)
     - Bankoverschrijving
   - Payment logos displayed

6. **Order Review Sidebar** (Sticky)
   - Cart items summary (collapsed)
   - Subtotal + shipping + BTW
   - Total (large, prominent)
   - Coupon code input
   - Trust badges
   - "Bestelling plaatsen" button

7. **Simplified Header/Footer**
   - Logo + phone (minimal header)
   - No navigation (prevent abandonment)
   - Footer with payment badges only

**Backend Requirements (NEW):**
```typescript
// API Endpoint: POST /api/orders/create
{
  items: CartItem[]
  customer: { email, phone }
  shippingAddress: Address
  billingAddress: Address | null
  paymentMethod: 'ideal' | 'creditcard' | 'invoice' | 'banktransfer'
  deliveryOption: 'standard' | 'express' | 'free'
  notes: string
  couponCode?: string
}

// Response:
{
  order: Order (with orderNumber, total, status)
  paymentUrl?: string (for iDEAL/creditcard redirect)
  invoiceUrl?: string (for invoice payment)
}
```

**Payment Integration (NEW):**
- Mollie API integration (recommended for NL)
- Stripe alternative
- Environment variables:
  - `MOLLIE_API_KEY`
  - `PAYMENT_WEBHOOK_URL`

**Email Notifications (NEW):**
- Order confirmation email
- Shipping notification email
- Invoice email (B2B)
- Resend/Nodemailer integration

---

### Phase 3: My-Account Dashboard (Enterprise) ⚠️ COMPLEX
**Files:**
- `src/app/(app)/my-account/page.tsx` (NEW)
- `src/app/(app)/my-account/layout.tsx` (NEW - sidebar nav)
- `src/app/(app)/my-account/orders/page.tsx` (NEW)
- `src/app/(app)/my-account/orders/[id]/page.tsx` (NEW - order detail)
- `src/app/(app)/my-account/lists/page.tsx` (NEW - order lists)
- `src/app/(app)/my-account/addresses/page.tsx` (NEW)
- `src/app/(app)/my-account/settings/page.tsx` (NEW)

**Backend:** ✅ MOSTLY READY (Users, Orders, OrderLists exist)
**Missing:** Invoice PDF generation, order detail API, favorites collection
**Estimated:** 12-16 hours

**Features from Design:**

#### 1. Dashboard Page (`/my-account`)
**Components:**
- **Sidebar User Card**
  - Avatar (initials in gradient circle)
  - Name + company
  - "Klant sinds [date]"

- **Sidebar Navigation**
  - Dashboard (active)
  - Bestellingen (with badge count)
  - Bestellijsten
  - Herhaalbestellingen
  - Favorieten
  - Adressen
  - Bedrijfsgegevens (B2B only)
  - Facturen
  - Accountinstellingen
  - Uitloggen (red)

- **Stats Cards (4-column grid)**
  - Totaal bestellingen (icon: package, teal)
  - Onderweg (icon: truck, green)
  - Bestellijsten (icon: clipboard-list, amber)
  - Dit jaar besteed (icon: euro, blue)

- **Quick Actions (3-column grid)**
  - Herhaalbestelling (teal icon)
  - Offerte aanvragen (green icon)
  - Klantenservice (blue icon)

- **Recent Orders Table**
  - Columns: Bestelnr., Datum, Producten, Status, Totaal, Acties
  - Product thumbnails (emoji icons)
  - Status badges (shipped/processing/delivered)
  - Action buttons:
    - Track & trace
    - Download invoice
    - Reorder
  - "Alle bestellingen →" link

- **Bestellijsten Cards (2-column grid)**
  - List icon + name + product count
  - Product thumbnails (4-5 shown)
  - Total price
  - "Bestel alles" button
  - "+ Nieuwe bestellijst" card (dashed border)

- **Addresses Cards (2-column grid)**
  - Shipping address (marked as default)
  - Billing address (with KVK/BTW)
  - Edit/Copy buttons
  - Type badges (shipping/billing)

#### 2. Orders Page (`/my-account/orders`)
**Features:**
- Full orders table (paginated)
- Filters: Status, date range, search
- Sort: Date, total, status
- Export to CSV
- Bulk actions (reorder selected)

#### 3. Order Detail Page (`/my-account/orders/[id]`)
**Features:**
- Order header (number, date, status)
- Progress timeline (pending → paid → processing → shipped → delivered)
- Items list with images
- Addresses shown
- Track & trace link
- Download invoice PDF
- Reorder button
- Print button

#### 4. Order Lists Page (`/my-account/lists`)
**Features:**
- Create new list
- Edit existing lists
- Add products to list
- Set default quantities
- Share with team members (B2B)
- Quick reorder entire list

#### 5. Addresses Page (`/my-account/addresses`)
**Features:**
- Add new address
- Edit existing addresses
- Delete addresses
- Set default shipping/billing
- Address validation

#### 6. Settings Page (`/my-account/settings`)
**Features:**
- Change email/password
- Update profile (name, phone)
- Company details (B2B)
- Notification preferences
- Delete account

**Backend Requirements (NEW):**
```typescript
// API Endpoints:
GET  /api/account/orders?page=1&limit=10
GET  /api/account/orders/[id]
POST /api/account/orders/[id]/reorder
GET  /api/account/stats
GET  /api/account/lists
POST /api/account/lists
PUT  /api/account/lists/[id]
DELETE /api/account/lists/[id]
GET  /api/account/addresses
POST /api/account/addresses
PUT  /api/account/addresses/[id]
DELETE /api/account/addresses/[id]
PUT  /api/account/settings
```

**Missing Collections:**
```typescript
// Favorites Collection (NEW)
{
  slug: 'favorites'
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users' }
    { name: 'product', type: 'relationship', relationTo: 'products' }
    { name: 'addedAt', type: 'date', defaultValue: () => new Date() }
  ]
}
```

---

## 🏗️ Technical Architecture

### Component Structure

```
src/
├── app/(app)/
│   ├── cart/
│   │   └── page.tsx                     # ✅ Cart Template 1 (REPLACE)
│   ├── checkout/
│   │   └── page.tsx                     # ✅ Checkout Template 1 (REPLACE)
│   └── my-account/
│       ├── layout.tsx                   # ❌ NEW - Sidebar navigation
│       ├── page.tsx                     # ❌ NEW - Dashboard
│       ├── orders/
│       │   ├── page.tsx                 # ❌ NEW - Orders list
│       │   └── [id]/
│       │       └── page.tsx             # ❌ NEW - Order detail
│       ├── lists/
│       │   └── page.tsx                 # ❌ NEW - Order lists
│       ├── addresses/
│       │   └── page.tsx                 # ❌ NEW - Addresses
│       └── settings/
│           └── page.tsx                 # ❌ NEW - Settings
├── components/
│   ├── account/
│   │   ├── Sidebar.tsx                  # ❌ NEW
│   │   ├── StatsCard.tsx                # ❌ NEW
│   │   ├── OrdersTable.tsx              # ❌ NEW
│   │   ├── OrderListCard.tsx            # ❌ NEW
│   │   └── AddressCard.tsx              # ❌ NEW
│   ├── cart/
│   │   ├── CartItem.tsx                 # ❌ NEW
│   │   ├── OrderSummary.tsx             # ❌ NEW
│   │   ├── FreeShippingBar.tsx          # ❌ NEW
│   │   └── CrossSell.tsx                # ❌ NEW
│   └── checkout/
│       ├── ProgressSteps.tsx            # ❌ NEW
│       ├── ContactForm.tsx              # ❌ NEW
│       ├── AddressForm.tsx              # ❌ NEW
│       ├── DeliveryOptions.tsx          # ❌ NEW
│       └── PaymentMethods.tsx           # ❌ NEW
├── app/api/
│   ├── orders/
│   │   └── create/
│   │       └── route.ts                 # ❌ NEW - Order creation
│   └── account/
│       ├── orders/
│       │   ├── route.ts                 # ❌ NEW
│       │   └── [id]/
│       │       ├── route.ts             # ❌ NEW
│       │       └── reorder/
│       │           └── route.ts         # ❌ NEW
│       ├── lists/
│       │   ├── route.ts                 # ❌ NEW
│       │   └── [id]/
│       │       └── route.ts             # ❌ NEW
│       ├── addresses/
│       │   ├── route.ts                 # ❌ NEW
│       │   └── [id]/
│       │       └── route.ts             # ❌ NEW
│       └── stats/
│           └── route.ts                 # ❌ NEW
└── collections/
    └── Favorites.ts                     # ❌ NEW
```

### State Management

**CartContext (EXISTING - NO CHANGES):**
- Already handles cart state perfectly
- localStorage persistence
- MOQ/order multiples validation
- Grouped products support

**Authentication:**
- Payload's built-in auth
- `useAuth()` hook
- Protected routes with middleware

**Server Components vs Client:**
- Cart page: Client (state management)
- Checkout page: Client (form handling)
- My-account pages: Server (data fetching) + Client (interactive components)

---

## 🎨 Design Implementation

### Styling Approach

**Design System (from HTML):**
```css
:root {
  --navy: #0A1628;
  --navy-light: #121F33;
  --teal: #00897B;
  --teal-light: #26A69A;
  --teal-glow: rgba(0,137,123,0.15);
  --white: #FAFBFC;
  --grey: #E8ECF1;
  --grey-mid: #94A3B8;
  --green: #00C853;
  --coral: #FF6B6B;
  --amber: #F59E0B;
  --blue: #2196F3;
  --bg: #F5F7FA;
}
```

**Fonts:**
- Headings: `Plus Jakarta Sans` (800 weight)
- Body: `DM Sans` (400-700)
- Monospace: `JetBrains Mono` (SKU, order numbers)

**Component Styling:**
- Tailwind CSS (preferred)
- Inline styles for dynamic colors
- CSS modules for complex components
- Lucide React icons

**Responsive:**
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Stack layouts on mobile
- Sticky sidebar on desktop

---

## 🔌 Backend Integration

### Required API Endpoints

#### 1. Order Creation API
```typescript
// POST /api/orders/create
export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await req.json() // From auth

  // 1. Validate cart items stock
  // 2. Calculate totals (with volume pricing)
  // 3. Create order in database
  // 4. Generate order number
  // 5. Initiate payment (Mollie/Stripe)
  // 6. Send confirmation email
  // 7. Clear cart

  return Response.json({
    order: createdOrder,
    paymentUrl: molliePayment.getCheckoutUrl()
  })
}
```

#### 2. Account Stats API
```typescript
// GET /api/account/stats
export async function GET(req: Request) {
  const { user } = await payload.auth({ headers: req.headers })

  const stats = {
    totalOrders: await payload.count({ collection: 'orders', where: { customer: user.id } }),
    ordersInTransit: await payload.count({ collection: 'orders', where: { customer: user.id, status: 'shipped' } }),
    orderLists: await payload.count({ collection: 'orderLists', where: { owner: user.id } }),
    yearlySpend: await calculateYearlySpend(user.id)
  }

  return Response.json(stats)
}
```

#### 3. Order History API
```typescript
// GET /api/account/orders?page=1&limit=10&status=shipped
export async function GET(req: Request) {
  const { user } = await payload.auth({ headers: req.headers })
  const { searchParams } = new URL(req.url)

  const orders = await payload.find({
    collection: 'orders',
    where: { customer: user.id },
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
    depth: 2, // Include product details
    sort: '-createdAt'
  })

  return Response.json(orders)
}
```

### Payment Integration (Mollie)

```typescript
// lib/payment/mollie.ts
import { createMollieClient } from '@mollie/api-client'

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY!
})

export async function createPayment(order: Order) {
  const payment = await mollieClient.payments.create({
    amount: {
      currency: 'EUR',
      value: order.total.toFixed(2)
    },
    description: `Order ${order.orderNumber}`,
    redirectUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout/success?order=${order.id}`,
    webhookUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/webhooks/mollie`,
    metadata: {
      orderId: order.id
    }
  })

  return payment
}

// Webhook: POST /api/webhooks/mollie
export async function POST(req: Request) {
  const { id } = await req.json()
  const payment = await mollieClient.payments.get(id)

  if (payment.isPaid()) {
    // Update order status
    await payload.update({
      collection: 'orders',
      id: payment.metadata.orderId,
      data: {
        status: 'paid',
        paymentStatus: 'paid'
      }
    })

    // Send confirmation email
    await sendOrderConfirmationEmail(payment.metadata.orderId)
  }

  return Response.json({ received: true })
}
```

### Email Notifications (Resend)

```typescript
// lib/email/templates.ts
export const orderConfirmationEmail = (order: Order) => ({
  from: 'noreply@plastimed.nl',
  to: order.customer.email,
  subject: `Bestelling ${order.orderNumber} bevestigd`,
  html: `
    <h1>Bedankt voor je bestelling!</h1>
    <p>Ordernummer: <strong>${order.orderNumber}</strong></p>
    <p>Totaal: €${order.total.toFixed(2)}</p>
    <p>Status: ${order.status}</p>
    <!-- Full order details -->
  `
})

// Send via Resend
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmationEmail(orderId: string) {
  const order = await payload.findByID({ collection: 'orders', id: orderId })
  await resend.emails.send(orderConfirmationEmail(order))
}
```

---

## 📦 Dependencies Required

### New NPM Packages

```json
{
  "dependencies": {
    "@mollie/api-client": "^4.0.0",      // Payment gateway
    "resend": "^3.0.0",                  // Email notifications
    "date-fns": "^3.0.0",                // Date formatting
    "react-confetti": "^6.1.0"           // Free shipping celebration
  },
  "devDependencies": {
    "@types/react-confetti": "^6.1.0"
  }
}
```

**Alternative Payment Providers:**
- Stripe (more international)
- MultiSafepay (NL alternative)
- Adyen (enterprise)

**Alternative Email Providers:**
- Nodemailer (SMTP)
- SendGrid
- Postmark

---

## ✅ Testing Strategy

### Unit Tests
- Cart calculations (subtotal, tax, shipping)
- Volume pricing logic
- MOQ/order multiples validation
- Address validation

### Integration Tests
- Order creation flow
- Payment webhook handling
- Email sending
- Order list operations

### E2E Tests (Playwright)
```typescript
test('Complete checkout flow', async ({ page }) => {
  // 1. Add products to cart
  // 2. Navigate to cart
  // 3. Verify totals
  // 4. Proceed to checkout
  // 5. Fill form
  // 6. Select payment
  // 7. Complete order
  // 8. Verify confirmation
})

test('My-account order history', async ({ page, context }) => {
  // 1. Login
  // 2. Navigate to my-account
  // 3. Verify stats
  // 4. Click orders
  // 5. Verify order list
  // 6. Click order detail
  // 7. Verify order info
})
```

### Manual Testing Checklist
- [ ] Cart: Add/remove items, update quantities
- [ ] Cart: Free shipping bar updates correctly
- [ ] Cart: Volume pricing hints display
- [ ] Cart: Grouped products display together
- [ ] Checkout: Form validation works
- [ ] Checkout: B2B toggle shows/hides fields
- [ ] Checkout: Payment methods display
- [ ] Checkout: Order summary accurate
- [ ] My-account: Login redirects to dashboard
- [ ] My-account: Stats cards show correct data
- [ ] My-account: Orders table loads
- [ ] My-account: Order detail shows all info
- [ ] My-account: Reorder adds items to cart
- [ ] My-account: Order lists CRUD works
- [ ] My-account: Addresses CRUD works

---

## 🚀 Deployment Plan

### Environment Variables

```bash
# Payment (Mollie)
MOLLIE_API_KEY=test_xxx                  # Test key
MOLLIE_API_KEY_LIVE=live_xxx             # Production key
PAYMENT_WEBHOOK_URL=https://plastimed01.compassdigital.nl/api/webhooks/mollie

# Email (Resend)
RESEND_API_KEY=re_xxx

# Site
NEXT_PUBLIC_SERVER_URL=https://plastimed01.compassdigital.nl

# Already configured
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=...
```

### Database Migrations

```bash
# 1. Create Favorites collection
npm run payload migrate:create

# 2. Run migration
npm run payload migrate

# 3. Verify
psql $DATABASE_URL -c "SELECT * FROM favorites LIMIT 1;"
```

### Server Deployment Steps

```bash
# 1. SSH to server
ssh ploi@plastimed01.compassdigital.nl

# 2. Navigate to project
cd /home/ploi/plastimed01.compassdigital.nl

# 3. Stop server
pm2 stop all

# 4. Backup database
PGPASSWORD="..." pg_dump ... > backup_$(date +%Y%m%d_%H%M%S).sql

# 5. Pull latest code
git pull origin main

# 6. Install dependencies
npm install

# 7. Add environment variables
nano .env
# Add MOLLIE_API_KEY, RESEND_API_KEY, etc.

# 8. Regenerate types
npm run payload generate:types

# 9. Run migrations
npm run payload migrate

# 10. Build
npm run build

# 11. Start server
pm2 restart all
pm2 save

# 12. Verify
pm2 logs --lines 50
curl https://plastimed01.compassdigital.nl/my-account
```

---

## 📅 Timeline Estimate

### Phase 1: Cart Template (4-6 hours)
- [ ] Replace `src/app/(app)/cart/page.tsx`
- [ ] Create cart components (CartItem, OrderSummary, etc.)
- [ ] Implement free shipping bar
- [ ] Add volume pricing hints
- [ ] Cross-sell section
- [ ] Empty state
- [ ] Test & verify

### Phase 2: Checkout Template (8-10 hours)
- [ ] Replace `src/app/(app)/checkout/page.tsx`
- [ ] Create checkout components
- [ ] Progress steps indicator
- [ ] Form sections (contact, delivery, payment)
- [ ] B2B toggle logic
- [ ] **Backend:** Order creation API
- [ ] **Backend:** Mollie payment integration
- [ ] **Backend:** Email notifications
- [ ] Test payment flow (sandbox)
- [ ] Test & verify

### Phase 3: My-Account Dashboard (12-16 hours)
- [ ] Create account layout + sidebar
- [ ] Dashboard page (stats, quick actions, recent orders)
- [ ] Orders page (list + detail)
- [ ] Order lists page
- [ ] Addresses page
- [ ] Settings page
- [ ] **Backend:** Account API endpoints
- [ ] **Backend:** Favorites collection
- [ ] **Backend:** Invoice PDF generation
- [ ] Authentication middleware
- [ ] Test all flows
- [ ] Test & verify

### Phase 4: Refinement & Testing (4-6 hours)
- [ ] E2E tests (Playwright)
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Accessibility audit
- [ ] Documentation updates

**Total Estimated Time:** 28-38 hours (3.5-5 workdays)

---

## 🎯 Success Criteria

### Cart Template
- [x] Free shipping bar animates correctly
- [x] Volume pricing hints display and update
- [x] Grouped products display together
- [x] Cross-sell suggestions load
- [x] Empty state displays when cart cleared
- [x] Mobile responsive
- [x] Matches design 95%+

### Checkout Template
- [x] Progress steps update correctly
- [x] Form validation works (all fields)
- [x] B2B toggle shows/hides company fields
- [x] Payment methods display correctly
- [x] Order creation succeeds
- [x] Payment redirect works (Mollie)
- [x] Confirmation email sent
- [x] Mobile responsive
- [x] Matches design 95%+

### My-Account Dashboard
- [x] Login required (redirect to login)
- [x] Stats cards show accurate data
- [x] Orders table loads and paginates
- [x] Order detail shows complete info
- [x] Reorder button works
- [x] Order lists CRUD functional
- [x] Addresses CRUD functional
- [x] Settings update works
- [x] Mobile responsive
- [x] Matches design 95%+

---

## 🛡️ Security Considerations

### Cart & Checkout
- ✅ Server-side price validation (prevent client manipulation)
- ✅ Stock availability check before order creation
- ✅ CSRF protection on order creation
- ✅ Rate limiting on checkout endpoint
- ✅ Input sanitization (XSS prevention)

### My-Account
- ✅ Authentication required for all routes
- ✅ User can only view own orders/lists/addresses
- ✅ Admin override for customer service
- ✅ Sensitive data (KVK, BTW) only visible to owner
- ✅ Password change requires current password
- ✅ Session timeout (14 days)

### Payment
- ✅ No credit card data stored locally
- ✅ Mollie handles PCI compliance
- ✅ Webhook signature verification
- ✅ Idempotency for payment webhooks
- ✅ HTTPS required in production

---

## 📚 Documentation Deliverables

### User Guides
1. **Cart & Checkout Guide** - How to use cart, apply coupons, checkout process
2. **My-Account Guide** - How to manage orders, lists, addresses
3. **B2B Features Guide** - Invoice payments, order lists, company accounts

### Developer Guides
1. **API Documentation** - All new endpoints documented
2. **Component Documentation** - Props, usage examples
3. **Payment Integration Guide** - Mollie setup, testing, webhooks
4. **Email Templates Guide** - Customizing emails

### Deployment Guide
- Complete server deployment instructions
- Environment variables reference
- Database migration steps
- Testing checklist
- Troubleshooting guide

---

## 🔄 Future Enhancements (Out of Scope)

**Not in Phase 1-3, but planned for later:**
- [ ] Wishlist/Favorites functionality
- [ ] Product reviews & ratings
- [ ] Order tracking integration (PostNL/DHL)
- [ ] Invoice PDF automatic generation
- [ ] Repeat order scheduling
- [ ] Multi-currency support
- [ ] Multi-language checkout
- [ ] Guest checkout (no account)
- [ ] Save cart for later
- [ ] Cart abandonment emails
- [ ] Product recommendations AI
- [ ] Loyalty points system

---

## ❓ Questions for Client

Before starting implementation:

1. **Payment Gateway:** Mollie or Stripe? (Recommend Mollie for NL)
2. **Shipping Costs:** Fixed €9,95 or weight-based calculation?
3. **Free Shipping:** Confirm €150 threshold?
4. **B2B Invoice:** Net 30 or configurable payment terms?
5. **Email Provider:** Resend OK or prefer alternative?
6. **Order Numbers:** Format OK (`ORD-YYYYMMDD-XXXXX`)?
7. **Invoice PDF:** Auto-generate or upload manually?
8. **Tax Rate:** Fixed 21% BTW or product-specific?
9. **Coupon Codes:** Needed in Phase 1 or later?
10. **Guest Checkout:** Allow or require account?

---

## 🎉 Summary

**CMS Readiness:** ✅ 95% READY
- Backend is almost complete (Orders, Users, OrderLists all exist)
- Cart system already functional
- Only missing: Payment integration, email notifications, my-account frontend

**Complexity:**
- Phase 1 (Cart): ⭐⭐ Easy (mostly frontend, backend exists)
- Phase 2 (Checkout): ⭐⭐⭐⭐ Medium-Hard (payment integration required)
- Phase 3 (My-Account): ⭐⭐⭐⭐⭐ Hard (many pages, API endpoints)

**Recommendation:**
Start with Phase 1 (Cart), then Phase 2 (Checkout + backend), then Phase 3 (My-Account). This gives you working cart/checkout faster, and my-account can be built incrementally.

**Total Effort:** ~30-40 hours (4-5 workdays)

**Risk Level:** LOW
- Backend foundation is solid
- Payment provider (Mollie) well-documented
- Design specs are complete
- No major technical blockers

---

**Ready to start? Let me know and I'll begin with Phase 1: Cart Template! 🚀**
