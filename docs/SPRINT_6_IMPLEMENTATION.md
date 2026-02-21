# Sprint 6 Implementation Guide

**Date:** February 21, 2026
**Status:** ✅ **PHASE 1-4 COMPLETE** - Backend & Frontend Implemented
**Remaining:** API Integration & Testing

---

## 📋 Overview

Sprint 6 adds **4 major features** to the multi-tenant SaaS platform:
1. **Subscriptions** - Recurring billing and usage tracking
2. **Licenses** - Software license management with device activations
3. **Gift Vouchers** - Digital and physical gift cards
4. **Loyalty Program** - Points, tiers, rewards, and referrals

---

## ✅ Completed Work

### FASE 1: Database & Configuration (DONE)

**11 New Collections Created:**
- ✅ `SubscriptionPlans` - Available subscription tiers
- ✅ `UserSubscriptions` - Active user subscriptions
- ✅ `PaymentMethods` - Saved payment methods (SEPA, Card, PayPal, iDEAL)
- ✅ `GiftVouchers` - Gift voucher management
- ✅ `Licenses` - Software license tracking
- ✅ `LicenseActivations` - Device activation management
- ✅ `LoyaltyTiers` - Bronze, Silver, Gold, Platinum tiers
- ✅ `LoyaltyRewards` - Redeemable rewards catalog
- ✅ `LoyaltyPoints` - User points balances
- ✅ `LoyaltyTransactions` - Points earning/spending history
- ✅ `LoyaltyRedemptions` - Redeemed rewards tracking

**Configuration Updates:**
- ✅ All collections registered in `src/payload.config.ts`
- ✅ Feature flags added to `src/lib/features.ts`:
  - `ENABLE_SUBSCRIPTIONS`
  - `ENABLE_GIFT_VOUCHERS`
  - `ENABLE_LICENSES`
  - `ENABLE_LOYALTY`
- ✅ Collection-to-feature mapping updated
- ✅ Migrations auto-generated on build/deployment

**Files Modified:**
- `src/payload.config.ts` (11 new collection imports & registrations)
- `src/lib/features.ts` (4 new feature flags, collection mappings)

**Files Created:**
- `src/collections/SubscriptionPlans.ts`
- `src/collections/UserSubscriptions.ts`
- `src/collections/PaymentMethods.ts`
- `src/collections/GiftVouchers.ts`
- `src/collections/Licenses.ts`
- `src/collections/LicenseActivations.ts`
- `src/collections/LoyaltyTiers.ts`
- `src/collections/LoyaltyRewards.ts`
- `src/collections/LoyaltyPoints.ts`
- `src/collections/LoyaltyTransactions.ts`
- `src/collections/LoyaltyRedemptions.ts`

---

### FASE 2: Account Pages (DONE)

**4 New Account Pages Created:**

1. ✅ **Subscription Page** (`/my-account/subscription`)
   - Current plan display
   - Usage meters (Users, Storage, API Calls)
   - Add-ons management
   - Billing history
   - Payment methods
   - Upgrade/cancel options

2. ✅ **Licenses Page** (`/my-account/licenses`)
   - License list with keys
   - Device activation management
   - Download license certificates
   - Activation limits tracking

3. ✅ **Gift Vouchers Page** (`/my-account/gift-vouchers`)
   - Voucher balance display
   - Send/resend vouchers
   - Print vouchers
   - Usage history

4. ✅ **Loyalty Page** (`/my-account/loyalty`)
   - Points balance display
   - Tier progress tracker
   - Referral code sharing
   - Available rewards catalog
   - Redeem rewards
   - Transaction history
   - Stats dashboard

**Files Created:**
- `src/app/(app)/my-account/subscription/page.tsx`
- `src/app/(app)/my-account/licenses/page.tsx`
- `src/app/(app)/my-account/gift-vouchers/page.tsx`
- `src/app/(app)/my-account/loyalty/page.tsx`

**Design Pattern:**
- All pages use 'use client' directive
- React hooks for state management
- Lucide icons for consistent UI
- TODO comments for API integration
- Tailwind CSS styling
- Responsive layouts

---

### FASE 3: Public Pages (DONE)

✅ **Gift Voucher Purchase Page** (`/gift-vouchers`)
- Amount selection (preset + custom)
- Occasion selector (8 occasions with emojis)
- Recipient information form
- Personal message textarea
- Delivery method selection (Email, Print, Post)
- Scheduled delivery option
- Order summary with pricing

**File Created:**
- `src/app/(app)/gift-vouchers/page.tsx`

---

### FASE 4: Navigation & API Planning (DONE)

✅ **Account Navigation Updated**
- 4 new menu items added:
  - 🏦 Abonnement
  - 🔑 Licenties
  - 🎁 Cadeaubonnen
  - 🏆 Loyalty
- Icons imported from Lucide
- Routing configured

**File Modified:**
- `src/components/Account/AccountNav.tsx`

✅ **API Endpoints Planning**
- All pages have TODO comments marking API integration points
- Suggested endpoints documented in this file (see below)

---

## 🚧 Remaining Work (FASE 5+)

### Priority 1: API Endpoints

**Subscriptions API:**
```
POST   /api/subscriptions/create          - Create subscription
GET    /api/subscriptions/current         - Get current subscription
POST   /api/subscriptions/upgrade         - Upgrade plan
POST   /api/subscriptions/cancel          - Cancel subscription
POST   /api/subscriptions/add-addon       - Add add-on
GET    /api/subscriptions/usage           - Get usage stats
GET    /api/subscriptions/invoices        - List invoices
POST   /api/subscriptions/payment-methods - Add payment method
```

**Licenses API:**
```
GET    /api/licenses                      - List user licenses
POST   /api/licenses/activate             - Activate on device
POST   /api/licenses/deactivate           - Deactivate device
GET    /api/licenses/download/:id         - Download license certificate
GET    /api/licenses/verify               - Verify license key
```

**Gift Vouchers API:**
```
POST   /api/gift-vouchers/purchase        - Purchase voucher
POST   /api/gift-vouchers/send            - Send voucher email
POST   /api/gift-vouchers/redeem          - Redeem voucher code
GET    /api/gift-vouchers/balance         - Check balance
GET    /api/gift-vouchers/history         - Usage history
POST   /api/gift-vouchers/print           - Generate PDF
```

**Loyalty API:**
```
GET    /api/loyalty/points                - Get points balance
GET    /api/loyalty/transactions          - Points history
POST   /api/loyalty/redeem                - Redeem reward
GET    /api/loyalty/rewards               - Available rewards
GET    /api/loyalty/tiers                 - Tier information
POST   /api/loyalty/referral              - Generate referral code
GET    /api/loyalty/stats                 - User statistics
```

### Priority 2: Stripe Integration

**Payment Processing:**
- Subscription billing setup
- SEPA Direct Debit support
- Card payment processing
- Webhook handlers for:
  - Subscription created/updated/canceled
  - Payment succeeded/failed
  - Invoice finalized

**Files to Create:**
- `src/app/api/subscriptions/webhooks/route.ts`
- `src/lib/stripe/subscriptions.ts`
- `src/lib/stripe/payment-methods.ts`

### Priority 3: Testing

**Unit Tests Needed:**
- Collection validation
- API endpoint logic
- Payment processing
- Points calculation
- Tier progression

**E2E Tests Needed:**
- Subscription flow
- License activation
- Gift voucher purchase & redemption
- Loyalty points earning & spending

### Priority 4: Documentation

**User Documentation:**
- Subscription plans comparison
- License activation guide
- Gift voucher usage instructions
- Loyalty program rules

**Admin Documentation:**
- Creating subscription plans
- Managing licenses
- Configuring loyalty tiers/rewards
- Gift voucher administration

---

## 🎯 Feature Flags Usage

**Enable/Disable Features Per Client:**

```bash
# In client .env file:
ENABLE_SUBSCRIPTIONS=true
ENABLE_GIFT_VOUCHERS=true
ENABLE_LICENSES=true
ENABLE_LOYALTY=true
```

**Platform Admin:**
- Configure via Clients collection > Features tab
- Features are synced to client deployments automatically

---

## 📊 Database Schema Notes

**Key Relationships:**
- `UserSubscriptions` → `Users` + `SubscriptionPlans`
- `Licenses` → `Users` + `LicenseActivations`
- `GiftVouchers` → Sender/Recipient (Users)
- `LoyaltyPoints` → `Users` + `LoyaltyTiers`
- `LoyaltyRedemptions` → `Users` + `LoyaltyRewards`
- `PaymentMethods` → `Users`

**Indexes Created:**
- User relationships (for fast lookups)
- Status fields (for filtering)
- Code fields (unique constraints)
- Date fields (for sorting/expiry checks)

---

## 🔒 Security Considerations

**Access Control:**
- ✅ Users can only read their own data
- ✅ Admin-only access for plans/tiers/rewards configuration
- ✅ License key generation must be server-side
- ✅ Payment method data must be encrypted
- ✅ Gift voucher codes must be cryptographically secure

**Validation Required:**
- Subscription plan limits enforcement
- License activation limits
- Gift voucher balance checks
- Points balance validation before redemption
- Tier eligibility verification

---

## 📈 Next Steps for Claude Server

**Immediate Actions:**
1. Review this document
2. Test account pages navigation
3. Implement subscription API endpoints
4. Set up Stripe webhook handlers
5. Add license key generation logic
6. Implement loyalty points calculation
7. Test gift voucher purchase flow

**Long-term Enhancements:**
- Subscription analytics dashboard
- License usage reporting
- Gift voucher sales reports
- Loyalty program analytics
- A/B testing for pricing
- Automated tier progression
- Referral tracking

---

## 📝 Notes

**Code Quality:**
- All pages follow existing project patterns
- TypeScript interfaces defined
- Consistent error handling structure
- TODO comments mark integration points
- Responsive design implemented

**Performance:**
- Database queries need optimization for large datasets
- Consider caching for:
  - Subscription plan data
  - Loyalty tier thresholds
  - Available rewards catalog
  - User points balances

**UX Considerations:**
- Loading states needed for all async operations
- Error messages should be user-friendly
- Success confirmations for important actions
- Progress indicators for multi-step flows

---

## 🎉 Summary

**Sprint 6 Status: 80% Complete**

✅ **DONE:**
- 11 collections created and configured
- 4 feature flags implemented
- 5 pages built (4 account + 1 public)
- Navigation updated
- Database schema designed
- Migration system configured

⏳ **TODO:**
- API endpoint implementation
- Stripe integration
- Testing
- Documentation

**Estimated Time to Complete:** 8-12 hours
- API Endpoints: 4-6 hours
- Stripe Integration: 2-3 hours
- Testing: 1-2 hours
- Documentation: 1 hour

---

**Last Updated:** February 21, 2026 10:15 AM
**Developer:** Claude Code + Mark Kokkelkoren
**Sprint:** 6 - Subscriptions, Licenses, Gift Vouchers, Loyalty
