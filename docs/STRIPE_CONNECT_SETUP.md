# 💳 Stripe Connect Setup Guide

**White-label Payment Processing Platform**

Offer payment processing to your clients just like Shopify Payments! Earn application fees on every transaction.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Revenue Model](#revenue-model)
3. [Stripe Dashboard Setup](#stripe-dashboard-setup)
4. [Environment Configuration](#environment-configuration)
5. [Webhook Configuration](#webhook-configuration)
6. [Client Onboarding Flow](#client-onboarding-flow)
7. [Payment Processing](#payment-processing)
8. [API Reference](#api-reference)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### What is Stripe Connect?

Stripe Connect allows you to offer payment processing to your clients under your brand. You create connected accounts for each client and earn application fees on their transactions.

### Key Benefits

- **White-label Solution**: Clients see your brand, not Stripe
- **Passive Revenue**: Earn 0.5%-1.2% on every transaction
- **No Compliance Burden**: Stripe handles PCI compliance, KYC, payouts
- **Fast Implementation**: 2-3 weeks vs 6-12 months for PayFac
- **Low Investment**: €5K-10K vs €110K+ for PayFac

### How It Works

```
Customer Payment → Stripe → Connected Account (Client) → Your Platform Fee
```

1. Client completes Stripe onboarding (KYC verification)
2. Customer makes payment on client's website
3. Money goes to client's connected account
4. Your platform automatically takes application fee
5. Client receives net amount after Stripe + Platform fees

---

## 💰 Revenue Model

### Pricing Tiers

Your platform can offer different rates based on subscription tier:

| Tier | Subscription | Transaction Fee | Your Commission | Client Volume (avg) | Your Revenue |
|------|-------------|-----------------|-----------------|---------------------|--------------|
| **Standard** | €79/month | 2.4% + €0.25 | ~0.5% | €50K/year | €250/year |
| **Professional** | €149/month | 1.9% + €0.25 | ~0.8% | €150K/year | €1,200/year |
| **Enterprise** | €299/month | 1.6% + €0.20 | ~1.2% | €500K/year | €6,000/year |
| **Custom** | Negotiated | Custom rates | 0.5%-2.0% | Varies | Varies |

**Note**: Stripe's base fee is ~1.5% + €0.25. Your commission is the difference between what you charge the client and Stripe's fee.

### Revenue Projections

**Scenario: 40 e-commerce clients**

| Avg Volume/Client | Commission | Total Volume | Platform Revenue |
|-------------------|------------|--------------|------------------|
| €100K/year | 0.5% | €4M/year | **€25K/year** |
| €100K/year | 1.0% | €4M/year | **€50K/year** |
| €100K/year | 1.2% | €4M/year | **€60K/year** |

**Additional subscription revenue**: 40 clients × €149/month = €71K/year

**Total potential revenue**: €71K (subscriptions) + €50K (payments) = **€121K/year**

---

## 🔧 Stripe Dashboard Setup

### Step 1: Create Stripe Account

1. Go to https://dashboard.stripe.com/register
2. Create account with business email
3. Complete business verification
4. Activate your account

### Step 2: Enable Stripe Connect

1. Go to **Settings** → **Connect**
2. Click **Get Started**
3. Select **Platform or Marketplace**
4. Choose **Express** account type
5. Configure branding:
   - Platform name: "Your Platform Name"
   - Support email: support@yourdomain.com
   - Icon/Logo: Upload your logo

### Step 3: Get API Keys

1. Go to **Developers** → **API keys**
2. Copy **Publishable key** (starts with `pk_test_` or `pk_live_`)
3. Click **Reveal test key** → Copy **Secret key** (starts with `sk_test_` or `sk_live_`)
4. Save both keys securely

### Step 4: Configure Connect Settings

1. Go to **Settings** → **Connect** → **Settings**
2. Configure:
   - **Client branding**: Your logo, colors
   - **Support contact**: Your support email
   - **Redirect URIs**: Add your domain
   - **Account requirements**: Enable for Netherlands (NL)

---

## ⚙️ Environment Configuration

### Update .env File

Add these variables to your `.env` file:

```bash
# Stripe Connect API Keys
# Get from: https://dashboard.stripe.com/apikeys

# Test Keys (Development)
STRIPE_SECRET_KEY=sk_test_your_test_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Live Keys (Production - uncomment when ready)
# STRIPE_SECRET_KEY=sk_live_your_live_key_here
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key_here
# STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret_here

# Platform Pricing (optional - defaults used if not set)
STRIPE_FEE_STANDARD_PERCENTAGE=2.4
STRIPE_FEE_STANDARD_FIXED=0.25

STRIPE_FEE_PROFESSIONAL_PERCENTAGE=1.9
STRIPE_FEE_PROFESSIONAL_FIXED=0.25

STRIPE_FEE_ENTERPRISE_PERCENTAGE=1.6
STRIPE_FEE_ENTERPRISE_FIXED=0.20
```

### Verify Configuration

Run the validation script:

```bash
npm run validate-env
```

Should show:
```
✓ STRIPE_SECRET_KEY configured
✓ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY configured
✓ STRIPE_WEBHOOK_SECRET configured
```

---

## 🔗 Webhook Configuration

Webhooks notify your platform of Stripe events (account updates, payments, etc.).

### Step 1: Create Webhook Endpoint

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter endpoint URL:
   - **Development**: Use ngrok or localhost tunnel
   - **Production**: `https://yourdomain.com/api/stripe/webhooks`
4. Click **Select events**
5. Choose these events:
   - `account.updated` (account status changes)
   - `charge.succeeded` (successful payments)
   - `charge.failed` (failed payments)
   - `payout.paid` (successful payouts)
   - `payout.failed` (failed payouts)
6. Click **Add endpoint**

### Step 2: Get Signing Secret

1. Click on your new webhook endpoint
2. Click **Reveal** under **Signing secret**
3. Copy the secret (starts with `whsec_`)
4. Add to `.env`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret_here
   ```

### Step 3: Test Webhook

Use Stripe CLI to test locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to http://localhost:3020/api/stripe/webhooks

# Trigger test event
stripe trigger account.updated
```

Expected output:
```
[Stripe Webhook] Received event: account.updated
[Stripe Webhook] Updated client xyz status: enabled
```

---

## 👥 Client Onboarding Flow

### Step 1: Enable Payments for Client

In Payload admin panel:

1. Go to **Collections** → **Clients**
2. Select client
3. Scroll to **Stripe Connect Payments** section
4. Set **Payment Pricing Tier**:
   - Standard (2.4% + €0.25)
   - Professional (1.9% + €0.25)
   - Enterprise (1.6% + €0.20)
   - Custom (set custom rates)
5. If Custom, fill in:
   - **Percentage**: e.g., 2.0
   - **Fixed**: e.g., 0.25
6. Save client

### Step 2: Create Stripe Account

Make API call to create connected account:

```bash
curl -X POST http://localhost:3020/api/stripe/connect/create-account \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client_id_here"
  }'
```

Response:
```json
{
  "success": true,
  "accountId": "acct_1234567890",
  "message": "Stripe Connect account created successfully"
}
```

### Step 3: Generate Onboarding Link

```bash
curl -X POST http://localhost:3020/api/stripe/connect/onboarding-link \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client_id_here",
    "returnUrl": "https://yourdomain.com/admin/collections/clients/client_id_here",
    "refreshUrl": "https://yourdomain.com/api/stripe/connect/onboarding-link"
  }'
```

Response:
```json
{
  "success": true,
  "url": "https://connect.stripe.com/setup/s/xyz...",
  "expiresAt": 1234567890
}
```

### Step 4: Client Completes Onboarding

1. Send onboarding URL to client
2. Client clicks link
3. Client fills in:
   - Business details
   - Bank account info
   - Tax information
   - Identity verification
4. Stripe verifies information (1-2 days)
5. Webhook updates client status to `enabled`

### Step 5: Verify Status

Check account status:

```bash
curl http://localhost:3020/api/stripe/connect/account-status?clientId=client_id_here
```

Response:
```json
{
  "success": true,
  "hasAccount": true,
  "accountId": "acct_1234567890",
  "status": "enabled",
  "chargesEnabled": true,
  "payoutsEnabled": true,
  "detailsSubmitted": true,
  "paymentsEnabled": true
}
```

---

## 💳 Payment Processing

### Create Checkout Session

Once client account is enabled, create checkout sessions:

```bash
curl -X POST http://localhost:3020/api/stripe/checkout/create-session \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client_id_here",
    "lineItems": [
      {
        "price_data": {
          "currency": "eur",
          "product_data": {
            "name": "Product Name",
            "description": "Product description"
          },
          "unit_amount": 5000
        },
        "quantity": 1
      }
    ],
    "successUrl": "https://client-domain.com/success",
    "cancelUrl": "https://client-domain.com/checkout",
    "metadata": {
      "orderId": "order_123"
    }
  }'
```

Response:
```json
{
  "success": true,
  "sessionId": "cs_test_1234567890",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### Redirect Customer

Redirect customer to `url` to complete payment.

### Payment Flow

```
1. Customer clicks "Pay" → Redirected to Stripe Checkout
2. Customer enters card details → Stripe processes payment
3. Payment succeeds:
   - Funds go to client's connected account
   - Platform fee automatically deducted
   - Customer redirected to successUrl
4. Webhook fires: charge.succeeded
5. Platform updates:
   - totalPaymentVolume += €50.00
   - totalPaymentRevenue += €0.40 (0.8% commission)
   - lastPaymentAt = now
```

---

## 📚 API Reference

### Create Account

**Endpoint**: `POST /api/stripe/connect/create-account`

**Request**:
```json
{
  "clientId": "string (required)"
}
```

**Response**:
```json
{
  "success": true,
  "accountId": "acct_...",
  "message": "Stripe Connect account created successfully"
}
```

**Errors**:
- `400`: clientId missing or account already exists
- `404`: Client not found
- `500`: Stripe API error

---

### Create Onboarding Link

**Endpoint**: `POST /api/stripe/connect/onboarding-link`

**Request**:
```json
{
  "clientId": "string (required)",
  "returnUrl": "string (optional)",
  "refreshUrl": "string (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "url": "https://connect.stripe.com/setup/s/...",
  "expiresAt": 1234567890
}
```

**Errors**:
- `400`: clientId missing or no Stripe account
- `404`: Client not found
- `500`: Stripe API error

---

### Check Account Status

**Endpoint**: `GET /api/stripe/connect/account-status?clientId=xxx`

**Response**:
```json
{
  "success": true,
  "hasAccount": true,
  "accountId": "acct_...",
  "status": "enabled",
  "chargesEnabled": true,
  "payoutsEnabled": true,
  "detailsSubmitted": true,
  "paymentsEnabled": true,
  "requirements": []
}
```

**Status Values**:
- `not_started`: No account created yet
- `pending`: Account created, onboarding in progress
- `enabled`: Fully verified, ready to accept payments
- `rejected`: Verification failed
- `restricted`: Account temporarily restricted

---

### Create Checkout Session

**Endpoint**: `POST /api/stripe/checkout/create-session`

**Request**:
```json
{
  "clientId": "string (required)",
  "lineItems": [
    {
      "price_data": {
        "currency": "eur",
        "product_data": {
          "name": "Product Name",
          "description": "Description"
        },
        "unit_amount": 5000
      },
      "quantity": 1
    }
  ],
  "successUrl": "string (required)",
  "cancelUrl": "string (required)",
  "metadata": {}
}
```

**Response**:
```json
{
  "success": true,
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/c/pay/cs_...",
  "message": "Checkout session created successfully"
}
```

**Errors**:
- `400`: Missing fields or payments not enabled
- `404`: Client not found
- `500`: Stripe API error

---

### Webhooks

**Endpoint**: `POST /api/stripe/webhooks`

Automatically handles:
- `account.updated`: Syncs account status
- `charge.succeeded`: Updates payment volume & revenue
- `charge.failed`: Logs failed payment
- `payout.paid`: Tracks successful payout
- `payout.failed`: Tracks failed payout

---

## 🧪 Testing

### Test Cards

Use Stripe test cards:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |
| `4000 0000 0000 9995` | Payment declined |

**CVV**: Any 3 digits
**Expiry**: Any future date
**ZIP**: Any 5 digits

### Test Account Onboarding

1. Create test account
2. Generate onboarding link
3. Fill in test data:
   - **Business name**: Test Business
   - **Phone**: +31 20 123 4567
   - **Account number**: NL02ABNA0123456789
   - **DOB**: 1990-01-01
   - **Last 4 SSN**: 0000

### Test Payment Flow

```bash
# 1. Create account
curl -X POST http://localhost:3020/api/stripe/connect/create-account \
  -H "Content-Type: application/json" \
  -d '{"clientId": "test_client_id"}'

# 2. Get onboarding link
curl -X POST http://localhost:3020/api/stripe/connect/onboarding-link \
  -H "Content-Type: application/json" \
  -d '{"clientId": "test_client_id"}'

# 3. Complete onboarding (manual step)

# 4. Check status
curl http://localhost:3020/api/stripe/connect/account-status?clientId=test_client_id

# 5. Create checkout session
curl -X POST http://localhost:3020/api/stripe/checkout/create-session \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "test_client_id",
    "lineItems": [{
      "price_data": {
        "currency": "eur",
        "product_data": {"name": "Test Product"},
        "unit_amount": 5000
      },
      "quantity": 1
    }],
    "successUrl": "http://localhost:3020/success",
    "cancelUrl": "http://localhost:3020/cancel"
  }'

# 6. Visit checkout URL and complete payment with test card
```

### Verify Revenue Tracking

After successful payment:

1. Go to **Clients** in admin panel
2. Check client record:
   - **Total Payment Volume**: €50.00
   - **Total Payment Revenue**: €0.40 (0.8% of €50)
   - **Last Payment At**: Just now
3. Verify in Stripe Dashboard:
   - Balance shows application fee collected

---

## 🔍 Troubleshooting

### Account Creation Failed

**Error**: `Failed to create Stripe account`

**Solutions**:
1. Check `STRIPE_SECRET_KEY` is set correctly
2. Verify Stripe Connect is enabled in dashboard
3. Check Stripe API version compatibility
4. Review Stripe dashboard for errors

### Onboarding Link Expired

**Error**: `This link has expired`

**Solutions**:
1. Links expire after 24 hours
2. Generate new link:
   ```bash
   curl -X POST /api/stripe/connect/onboarding-link \
     -d '{"clientId": "xxx"}'
   ```

### Webhook Not Receiving Events

**Error**: Webhooks not triggering

**Solutions**:
1. Verify webhook URL is correct
2. Check `STRIPE_WEBHOOK_SECRET` matches dashboard
3. Test with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3020/api/stripe/webhooks
   stripe trigger account.updated
   ```
4. Check server logs for errors
5. Verify webhook events are selected in dashboard

### Payments Not Working

**Error**: `Payments not enabled for this client`

**Solutions**:
1. Check account status:
   ```bash
   curl /api/stripe/connect/account-status?clientId=xxx
   ```
2. Ensure `status` is `enabled`
3. Complete onboarding if `status` is `pending`
4. Check `chargesEnabled` and `payoutsEnabled` are both `true`

### Application Fee Not Deducted

**Error**: Platform fee not showing in balance

**Solutions**:
1. Verify client has `paymentPricingTier` set
2. Check fee calculation in logs:
   ```
   [Stripe Connect] Fee calculation:
     Amount: €50.00
     Tier: professional
     Rate: 1.9% + €0.25
     Application Fee: €1.20
   ```
3. Ensure `createCheckoutSession` receives `pricingTier`
4. Verify payment succeeded (check webhooks)

---

## 📊 Monitoring & Analytics

### Platform Dashboard Metrics

Track these KPIs in your admin panel:

**Per Client**:
- Total Payment Volume (lifetime)
- Total Platform Revenue (your fees)
- Last Payment Date
- Number of Transactions
- Average Transaction Value

**Platform-wide**:
- Total Volume (all clients)
- Total Revenue (all fees)
- Active Payment-Enabled Clients
- Monthly Recurring Revenue (MRR)

### Stripe Dashboard

Monitor in Stripe:
- **Balance** → Application fees collected
- **Connect** → Connected accounts overview
- **Payments** → All transactions
- **Payouts** → Your platform payouts

---

## 🚀 Go Live Checklist

Before switching to production:

- [ ] Complete Stripe business verification
- [ ] Enable Stripe Connect in production account
- [ ] Replace test API keys with live keys
- [ ] Update webhook endpoint to production URL
- [ ] Configure live webhook secret
- [ ] Test live onboarding flow
- [ ] Process test transaction in production mode
- [ ] Verify application fees are collected
- [ ] Set up payout schedule (daily/weekly/monthly)
- [ ] Configure email notifications
- [ ] Update terms of service (payment processing)
- [ ] Train support team on troubleshooting
- [ ] Document client onboarding process

---

## 💡 Best Practices

### Security

1. **Never expose secret keys**: Only use in server-side code
2. **Verify webhooks**: Always validate signature
3. **Use HTTPS**: Required for production
4. **Rotate keys**: Periodically update API keys
5. **Monitor fraud**: Set up Stripe Radar

### Performance

1. **Cache account status**: Don't query Stripe on every request
2. **Use webhooks**: Don't poll for updates
3. **Async processing**: Handle payments in background jobs
4. **Retry failed webhooks**: Implement retry logic

### Client Experience

1. **Clear communication**: Explain fees upfront
2. **Fast onboarding**: Minimize required fields
3. **Support**: Provide help during setup
4. **Transparency**: Show fee breakdown in invoices

---

## 📞 Support Resources

- **Stripe Docs**: https://stripe.com/docs/connect
- **Stripe Support**: https://support.stripe.com
- **API Reference**: https://stripe.com/docs/api
- **Webhook Guide**: https://stripe.com/docs/webhooks
- **Testing Guide**: https://stripe.com/docs/testing

---

## 🎉 Success!

You now have a white-label payment processing platform! Your clients can accept payments and you earn passive income on every transaction.

**Next Steps**:
1. Create first client account
2. Complete test transaction
3. Monitor revenue growth
4. Scale to more clients!

**Questions?** Check the troubleshooting section or contact Stripe support.

---

**Last Updated**: February 2026
**Version**: 1.0.0
