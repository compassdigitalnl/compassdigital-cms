# 🚀 Platform & Site Wizard - Complete Guide

**The MOST POWERFUL features of this platform!**

This guide explains how to use the multi-tenant platform management and the AI-powered Site Generator Wizard to automatically create complete, production-ready websites in minutes.

---

## 📋 Table of Contents

1. [Understanding the Platform Architecture](#understanding-the-platform-architecture)
2. [Platform Admin Dashboard (`/platform/`)](#platform-admin-dashboard-platform)
3. [Creating New Clients](#creating-new-clients)
4. [Site Generator Wizard](#site-generator-wizard)
5. [Complete Workflow Example](#complete-workflow-example)
6. [Features & Configuration](#features--configuration)

---

## 🏗️ Understanding the Platform Architecture

This is NOT just a CMS - it's a **Multi-Tenant SaaS Platform** for building and managing multiple client websites!

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  YOUR PLATFORM                              │
│        cms.compassdigital.nl (Platform Admin)               │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │  Client A    │  │  Client B    │  │  Client C    │
    │  clienta.nl  │  │  clientb.nl  │  │  clientc.nl  │
    │              │  │              │  │              │
    │  E-commerce  │  │  B2B Portal  │  │  Blog Site   │
    │  + Blog      │  │  No shop     │  │  No shop     │
    └──────────────┘  └──────────────┘  └──────────────┘
```

### Three Levels of Access

**1. Platform Admin** - `https://cms.compassdigital.nl/platform/`
- **Who:** You (the platform owner)
- **Purpose:** Manage ALL clients, create new sites, monitor health
- **Collections:** Clients, Platform Admins, Global Settings

**2. Regular CMS Admin** - `https://cms.compassdigital.nl/admin`
- **Who:** You or client admins
- **Purpose:** Manage content (Pages, Posts, Products, Media)
- **Collections:** Pages, Blog Posts, Products, Media, Users

**3. Site Generator Wizard** - `https://cms.compassdigital.nl/site-generator`
- **Who:** You or clients (if enabled)
- **Purpose:** AI-powered automatic website generation
- **Output:** Complete, production-ready website in 5 minutes

---

## 🎯 Platform Admin Dashboard (`/platform/`)

### What Is It?

The Platform Admin Dashboard is your **central control panel** for managing the entire multi-tenant platform.

**Access:** https://cms.compassdigital.nl/platform/

### Features

**1. Platform Statistics**
- Total clients
- Active deployments
- System health
- Revenue tracking

**2. Client Management**
- Create new clients
- View all client sites
- Monitor health & uptime
- Manage billing

**3. Global Configuration**
- Platform-wide settings
- Default templates
- Feature flags
- API quotas

### How It Communicates with `/` and `/admin`

```
/platform/
    ↓
Creates & manages clients
    ↓
/admin (Clients collection)
    ↓
Creates pages, posts, products
    ↓
/ (Frontend)
    ↓
Displays client website
```

**Relationship:**
- `/platform/` = **Management layer** (creates clients, config)
- `/admin` = **Content layer** (creates pages, posts, products)
- `/` = **Frontend layer** (displays website to visitors)

**Example Flow:**
1. **Platform Admin** creates "Client A" via `/platform/` → stored in `clients` collection
2. **Client A Admin** creates content via `/admin` → stored in `pages`, `blog_posts` collections
3. **Visitors** see website at `/` → renders data from collections

---

## 👥 Creating New Clients

### Method 1: Via Platform Admin UI

**Step-by-Step:**

1. **Go to Platform Admin**
   ```
   https://cms.compassdigital.nl/admin
   → Click "Clients" in sidebar (under "Platform Management")
   → Click "Create New"
   ```

2. **Fill in Client Information**

   **Basic Information:**
   - **Client Name:** "Acme Corp"
   - **Domain:** "acme" (becomes acme.yourplatform.com)
   - **Contact Email:** client@acme.com
   - **Contact Name:** John Doe
   - **Phone:** +31 20 123 4567

3. **Configure Template & Features**

   **Site Template:**
   - ✅ E-commerce Store (webshop + products)
   - ✅ Blog & Magazine (blog focus)
   - ✅ **B2B Platform** (business-to-business)
   - ✅ Portfolio & Agency (creative showcase)
   - ✅ Corporate Website (standard business site)

   **Enabled Features** (check what client needs):
   - ✅ E-commerce (enable Products collection + checkout)
   - ✅ Blog (enable Blog Posts collection)
   - ✅ Forms (contact forms, newsletter)
   - ✅ Authentication (user accounts)
   - ✅ Multi-language (translations)
   - ✅ AI Features (content generation)

   **Disabled Collections** (hide what client doesn't need):
   - Example: If no blog, add "blog-posts" here

4. **Deployment Configuration**

   **Status:** Pending → Provisioning → Active
   - Platform automatically generates:
     - Deployment URL: `https://acme.yourplatform.com`
     - Admin URL: `https://acme.yourplatform.com/admin`
     - Database URL: (auto-created PostgreSQL)
     - Vercel Project ID: (auto-deployed)

5. **Billing Setup** (optional)

   **Subscription Plan:**
   - Free (limited features)
   - Starter (€49/month)
   - Professional (€99/month)
   - Enterprise (€299/month)

   **Billing Status:** Active / Trial / Past Due

6. **Click "Save"**
   - Client is created!
   - Database provisioned
   - Site deployed (if auto-deploy enabled)

### Method 2: Via API

```bash
# Create new client via API
curl -X POST https://cms.compassdigital.nl/api/admin/tenants/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Acme Corp",
    "domain": "acme",
    "contactEmail": "client@acme.com",
    "template": "b2b",
    "enabledFeatures": [
      {"feature": "ecommerce"},
      {"feature": "blog"},
      {"feature": "forms"}
    ],
    "plan": "professional",
    "billingStatus": "active"
  }'
```

### Configuration Options Explained

**Business Types & Templates:**

| Template | Use Case | Features Included |
|----------|----------|-------------------|
| **E-commerce Store** | Online shop, retail | Products, Cart, Checkout, Stripe |
| **Blog & Magazine** | News, content site | Blog posts, Categories, Tags, Comments |
| **B2B Platform** | Business services | Services, Quotes, Contact forms, Case studies |
| **Portfolio & Agency** | Creative showcase | Portfolio, Team, Testimonials, Projects |
| **Corporate Website** | Standard business | About, Services, Contact, News |

**Feature Flags:**

```typescript
{
  ecommerce: true,        // Enable Products, Cart, Checkout
  blog: true,             // Enable Blog Posts, Categories
  forms: true,            // Enable Contact Forms, Newsletter
  authentication: true,   // Enable User Accounts, Login
  multiLanguage: true,    // Enable Translations (NL/EN/DE/FR/ES)
  ai: true                // Enable AI Content Generation
}
```

**Example Configurations:**

**1. Simple Blog (no webshop)**
```typescript
{
  template: "blog",
  enabledFeatures: [
    { feature: "blog" },
    { feature: "forms" }
  ],
  disabledCollections: [
    { collection: "products" },
    { collection: "orders" }
  ]
}
```

**2. E-commerce + Blog**
```typescript
{
  template: "ecommerce",
  enabledFeatures: [
    { feature: "ecommerce" },
    { feature: "blog" },
    { feature: "forms" },
    { feature: "ai" }
  ]
}
```

**3. B2B Portal (no public shop)**
```typescript
{
  template: "b2b",
  enabledFeatures: [
    { feature: "authentication" },  // Login required
    { feature: "forms" },
    { feature: "ai" }
  ],
  disabledCollections: [
    { collection: "products" }  // No public product catalog
  ],
  customSettings: {
    "requireLogin": true,
    "pricingStrategy": "role-based"  // Different prices per customer
  }
}
```

---

## 🧙 Site Generator Wizard

### What Is It?

The **Site Generator Wizard** is an AI-powered tool that generates COMPLETE, production-ready websites automatically based on a step-by-step questionnaire.

**Access:** https://cms.compassdigital.nl/site-generator

### How It Works

```
User fills wizard (5 min)
    ↓
AI generates content (GPT-4)
    ↓
Creates all pages + blocks
    ↓
Uploads to Payload CMS
    ↓
Website ready! 🎉
```

### The 5-Step Wizard Flow

**Step 1: Company Info** 📋
- Company name
- Business type (B2B, B2C, Non-profit, E-commerce)
- Industry
- Target audience
- Core values
- USPs (Unique Selling Points)

**Step 2: Design** 🎨
- Color scheme (primary, secondary, accent)
- Style (modern, classic, minimalist, bold)
- Logo upload
- Font preference (serif, sans-serif, monospace)

**Step 3: Content** ✍️
- Language (NL, EN, DE, FR, ES, IT, PT)
- Tone (professional, casual, friendly, authoritative)
- Pages to generate:
  - ✅ Home (always included)
  - ✅ Services
  - ✅ About Us
  - ✅ Portfolio
  - ✅ Testimonials
  - ✅ Pricing
  - ✅ Blog
  - ✅ Contact

**Step 4: Features** ⚙️
- Contact form
- Newsletter signup
- Testimonials section
- FAQ section
- Social media integration
- Google Maps
- Call-to-action buttons
- **E-commerce** (triggers additional steps!)

**Step 5: Generate!** 🚀
- Review all settings
- Click "Generate Site"
- AI creates everything automatically

### Dynamic Steps (Conditional)

**If you selected specific pages in Step 3:**

**Services Page** → **Services Step** appears
- Add your services:
  - Name: "Web Development"
  - Description: "Custom websites tailored to your needs"

**Testimonials Page** → **Testimonials Step** appears
- Add testimonials:
  - Name: "John Doe"
  - Company: "Acme Corp"
  - Quote: "Amazing service! Highly recommended."
  - Rating: 5/5

**Portfolio Page** → **Portfolio Step** appears
- Add portfolio cases:
  - Project Name: "E-commerce Platform for XYZ"
  - Client: "XYZ Corp"
  - Description: "Built a scalable e-commerce solution..."
  - Challenge: "Needed to handle 10,000+ products..."
  - Solution: "Implemented custom catalog system..."
  - Results: "300% increase in online sales"
  - Technologies: ["Next.js", "Payload CMS", "Stripe"]

**Pricing Page** → **Pricing Step** appears
- Add pricing packages:
  - Name: "Starter"
  - Price: "€49"
  - Period: "per month"
  - Features: ["5 pages", "Contact form", "Basic SEO"]

**Contact Page** → **Contact Step** appears
- Email: info@yourbusiness.com
- Phone: +31 20 123 4567
- Address: Street, City, Postal Code, Country
- Social Media: Facebook, Twitter, LinkedIn, Instagram
- Opening Hours: "Mon-Fri 9:00-17:00"
- Form Configuration:
  - Enable name/phone/company fields
  - Notification email
  - Confirmation message

**If you enabled E-commerce in Step 4:**

**E-commerce Step** appears
- **Shop Type:**
  - B2C (Business-to-Consumer) - standard shop
  - B2B (Business-to-Business) - wholesale, quotes
  - Hybrid - both B2C and B2B

- **Pricing Strategy:**
  - Simple - one price per product
  - Role-based - different prices for customer types
  - Volume-based - bulk discounts
  - Hybrid - combine strategies

- **Custom Pricing Roles** (if role-based):
  - Guest (default public price)
  - Retail Customer
  - Wholesale Partner
  - VIP Customer
  - Priority: 1 (highest) to 10 (lowest)

- **Settings:**
  - Currency: EUR, USD, GBP
  - Tax rate: 21%
  - Shipping enabled: yes/no
  - Stock management: yes/no

**Product Import Step** (if e-commerce enabled)
- **Import Method:**
  - Manual - add products via admin panel
  - CSV - upload CSV file
  - XLSX - upload Excel file

- **Download Template:**
  - Basis - name, price, description
  - Advanced - + variants, specifications, categories
  - Enterprise - + role pricing, bulk discounts, custom fields

### What Gets Generated?

**Pages Created:**
Based on your selection, the wizard creates:
- ✅ Homepage (Hero, Features, CTA, Testimonials, etc.)
- ✅ Services page (service listings with descriptions)
- ✅ About Us (company story, team, values)
- ✅ Portfolio (case studies with images)
- ✅ Testimonials (customer reviews)
- ✅ Pricing (pricing packages comparison)
- ✅ Blog (3-5 sample blog posts)
- ✅ Contact (contact form + map + info)

**Content Blocks Per Page:**
Each page includes multiple professionally designed blocks:

**Homepage Example:**
1. Hero block (headline, subheadline, CTA button)
2. Features block (3-6 key features with icons)
3. Services overview (your services in cards)
4. Testimonials carousel
5. Stats block (achievements, numbers)
6. CTA block (call-to-action)
7. FAQ block (common questions)

**AI-Generated Content:**
- ✅ Headlines & taglines
- ✅ Body copy (professional, SEO-optimized)
- ✅ Meta titles & descriptions
- ✅ Keywords
- ✅ Alt text for images
- ✅ Call-to-action text

**SEO Optimization:**
- ✅ JSON-LD schemas (Organization, LocalBusiness, FAQPage, Article)
- ✅ Meta tags (title, description, keywords)
- ✅ OG tags (social media sharing)
- ✅ Sitemap generation
- ✅ Semantic HTML structure

---

## 🎬 Complete Workflow Example

### Scenario: Creating a B2B Client Site with Wizard

**Goal:** Create a complete B2B website for "Acme Industrial Solutions" in 10 minutes.

### Part 1: Create Client (2 minutes)

**1. Go to Platform Admin**
```
https://cms.compassdigital.nl/admin
→ Clients → Create New
```

**2. Configure Client**
```typescript
{
  name: "Acme Industrial Solutions",
  domain: "acme-industrial",
  contactEmail: "info@acme-industrial.com",
  template: "b2b",
  enabledFeatures: [
    { feature: "forms" },
    { feature: "ai" },
    { feature: "authentication" }  // B2B clients may need login
  ],
  plan: "professional",
  billingStatus: "active"
}
```

**3. Click Save**
- Client created!
- URLs generated:
  - Frontend: https://acme-industrial.yourplatform.com
  - Admin: https://acme-industrial.yourplatform.com/admin

### Part 2: Generate Site with Wizard (8 minutes)

**1. Open Site Generator**
```
https://cms.compassdigital.nl/site-generator
```

**2. Step 1: Company Info (2 min)**
```
Company Name: Acme Industrial Solutions
Business Type: B2B
Industry: Manufacturing & Industrial Equipment
Target Audience: Manufacturing companies, procurement managers
Core Values:
  - Quality
  - Reliability
  - Innovation
USPs:
  - 25+ years experience
  - ISO 9001 certified
  - 24/7 support
```

**3. Step 2: Design (1 min)**
```
Color Scheme:
  Primary: #1e3a8a (professional blue)
  Secondary: #64748b (neutral gray)
  Accent: #f59e0b (warm orange)
Style: Modern
Font: Sans-serif
```

**4. Step 3: Content (1 min)**
```
Language: NL (Dutch)
Tone: Professional
Pages:
  ✅ Home
  ✅ Services
  ✅ About Us
  ✅ Portfolio
  ✅ Contact
```

**5. Services Step (2 min)**
```
Service 1:
  Name: Industrial Automation
  Description: Complete automation solutions for manufacturing processes

Service 2:
  Name: Equipment Maintenance
  Description: Preventive and corrective maintenance services

Service 3:
  Name: Safety Systems
  Description: Safety equipment and compliance consulting
```

**6. Portfolio Step (1 min)**
```
Case 1:
  Project: Factory Automation System
  Client: XYZ Manufacturing
  Description: Implemented automated assembly line
  Results: 40% productivity increase
```

**7. Contact Step (1 min)**
```
Email: info@acme-industrial.com
Phone: +31 20 123 4567
Address: Industrieweg 42, 1000 AB Amsterdam
Opening Hours: Mon-Fri 8:00-17:00
Notification Email: sales@acme-industrial.com
```

**8. Step 4: Features (30 sec)**
```
✅ Contact form
✅ FAQ
✅ Social media
✅ Maps
✅ CTA buttons
❌ E-commerce (B2B quotes instead)
```

**9. Step 5: Generate! (5 min processing time)**
```
Click "Generate Site"
→ AI starts processing
→ Progress shown:
  ✓ Analyzing company info...
  ✓ Generating homepage...
  ✓ Generating services page...
  ✓ Generating about page...
  ✓ Generating portfolio...
  ✓ Generating contact page...
  ✓ Optimizing SEO...
  ✓ Creating meta tags...
  ✅ Complete!
```

### Part 3: Review & Publish (2 minutes)

**1. Preview Generated Site**
```
Click "Preview Site"
→ Opens preview URL
→ Check all pages
→ Review content
```

**2. Publish to Production**
```
Click "Publish to Production"
→ All pages saved to Payload CMS
→ Site live at https://acme-industrial.yourplatform.com
```

**3. Customize (optional)**
```
Go to /admin
→ Edit pages as needed
→ Upload real images
→ Fine-tune content
→ Add more blog posts
```

### Result

**✅ Complete B2B website with:**
- 5 professional pages
- AI-generated content
- SEO-optimized
- Mobile-responsive
- Contact form configured
- Google Maps integrated
- Portfolio showcases
- FAQ section
- Meta tags & JSON-LD
- Production-ready!

**Total time:** ~10 minutes! 🎉

---

## ⚙️ Features & Configuration

### Client Template Comparison

| Feature | E-commerce | Blog | B2B | Portfolio | Corporate |
|---------|-----------|------|-----|-----------|-----------|
| Products Collection | ✅ | ❌ | ⚠️ (optional) | ❌ | ❌ |
| Orders/Cart | ✅ | ❌ | ❌ | ❌ | ❌ |
| Blog Posts | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Contact Forms | ✅ | ✅ | ✅ | ✅ | ✅ |
| User Authentication | ✅ | ⚠️ | ✅ | ❌ | ❌ |
| Role-based Pricing | ⚠️ (B2B option) | ❌ | ✅ | ❌ | ❌ |
| Portfolio/Cases | ❌ | ❌ | ✅ | ✅ | ⚠️ |
| Services Pages | ⚠️ | ❌ | ✅ | ✅ | ✅ |

Legend:
- ✅ = Included by default
- ⚠️ = Optional (can enable)
- ❌ = Not included

### Site Wizard Page Options

**Always Available:**
- ✅ Homepage (required)
- ✅ About Us
- ✅ Contact

**Conditional Pages:**
- Services (if business offers services)
- Portfolio (if showcasing work)
- Testimonials (if customer reviews)
- Pricing (if defined pricing packages)
- Blog (if content marketing)
- Shop (if e-commerce enabled)

### AI Content Generation Features

**What AI Generates:**
1. **Page Content**
   - Headlines based on company info
   - Body copy matching tone & language
   - Call-to-action text
   - Button labels

2. **SEO Elements**
   - Meta titles (50-60 chars, keyword-optimized)
   - Meta descriptions (150-160 chars, engaging)
   - Keywords (relevant to industry)
   - Alt text for images

3. **Structured Data**
   - JSON-LD Organization schema
   - LocalBusiness schema (if contact info provided)
   - FAQPage schema (if FAQ enabled)
   - Article schema (for blog posts)

4. **Social Media**
   - OG titles
   - OG descriptions
   - Twitter card data

### E-commerce Pricing Strategies

**1. Simple Pricing**
```typescript
Product: Widget A
Price: €49.99
```

**2. Role-based Pricing**
```typescript
Product: Widget A
Prices:
  - Guest: €59.99
  - Retail: €49.99
  - Wholesale: €39.99 (bulk customers)
  - VIP: €34.99 (top customers)
```

**3. Volume-based Pricing**
```typescript
Product: Widget A
Prices:
  - 1-10 units: €49.99/unit
  - 11-50 units: €44.99/unit
  - 51+ units: €39.99/unit
```

**4. Hybrid Pricing**
```typescript
Product: Widget A
Base Price: €49.99

Role Discounts:
  - Wholesale: -10%
  - VIP: -15%

Volume Discounts:
  - 11-50 units: -5%
  - 51+ units: -10%

Final Price = Base * (1 - RoleDiscount) * (1 - VolumeDiscount)
```

### Product Import Templates

**Basic Template (CSV/XLSX):**
```
name, price, description, inStock
Widget A, 49.99, A great widget, true
Widget B, 69.99, An even better widget, true
```

**Advanced Template:**
```
name, price, description, category, images, variants, specifications, inStock
Widget A, 49.99, Great widget, Widgets, image1.jpg;image2.jpg, Color:Red|Size:Large, Material:Steel|Weight:2kg, true
```

**Enterprise Template (with role pricing):**
```
name, price_guest, price_retail, price_wholesale, price_vip, description, category, ...
Widget A, 59.99, 49.99, 39.99, 34.99, Great widget, Widgets, ...
```

---

## 🎯 Quick Reference

### Key URLs

```bash
# Platform Admin
https://cms.compassdigital.nl/platform/        # Dashboard
https://cms.compassdigital.nl/admin → Clients  # Manage clients

# Site Generator
https://cms.compassdigital.nl/site-generator   # Wizard

# API Endpoints
POST /api/admin/tenants/create                 # Create client
GET  /api/admin/tenants/list                   # List clients
POST /api/wizard/generate-site                 # Generate site
```

### Common Workflows

**Creating Simple Blog Site:**
1. Create client with "blog" template
2. Use wizard: Company → Design → Content (select Blog) → Generate
3. Done! (2 minutes)

**Creating E-commerce Site:**
1. Create client with "ecommerce" template
2. Use wizard: Include E-commerce step → Configure shop type → Download product template
3. Upload products via CSV
4. Done! (5 minutes)

**Creating B2B Portal:**
1. Create client with "b2b" template
2. Enable authentication feature
3. Use wizard: Add services, portfolio, testimonials
4. Configure role-based pricing
5. Done! (10 minutes)

---

## 📊 Monitoring & Management

### Client Health Monitoring

Each client has health metrics:
- ✅ Healthy (all systems operational)
- ⚠️ Warning (minor issues)
- ❌ Critical (requires attention)
- ❓ Unknown (health check failed)

**Automatic Checks:**
- Database connectivity
- Site availability
- SSL certificate status
- Build status
- API quota usage

### Billing & Subscriptions

**Plans:**
- **Free:** 1 site, basic features, Payload branding
- **Starter:** €49/month, 5 sites, no branding
- **Professional:** €99/month, 25 sites, AI features
- **Enterprise:** €299/month, unlimited, priority support

**Billing Status:**
- Active - paying, all features enabled
- Trial - 14-day free trial
- Past Due - payment failed, limited access
- Cancelled - subscription ended

---

## 🎓 Best Practices

### Client Setup

1. **Always use descriptive domain names**
   - ✅ "acme-industrial"
   - ❌ "client1"

2. **Choose the right template**
   - E-commerce → actual online shop
   - B2B → services, quotes, no public pricing
   - Blog → content focus
   - Portfolio → showcase work

3. **Enable only needed features**
   - Don't enable e-commerce if no products
   - Don't enable authentication if no user accounts

### Site Wizard Usage

1. **Provide detailed company info**
   - More detail = better AI content
   - Include USPs, values, target audience

2. **Choose appropriate tone**
   - B2B → Professional
   - Consumer brand → Friendly
   - Tech company → Authoritative

3. **Add real testimonials/portfolio if available**
   - AI generates placeholders
   - Replace with real data for best results

4. **Review before publishing**
   - Check all pages
   - Verify contact information
   - Test contact form

---

## 🚀 Next Steps

**After creating your first client & site:**

1. **Customize Content**
   - Go to `/admin`
   - Edit pages as needed
   - Upload real images
   - Add more blog posts

2. **Configure SEO**
   - Review meta tags
   - Add keywords
   - Submit sitemap to Google

3. **Setup Domain**
   - Point custom domain to Vercel
   - Configure SSL
   - Update environment variables

4. **Test Everything**
   - Contact form
   - Newsletter signup
   - E-commerce checkout (if enabled)
   - Mobile responsiveness

5. **Go Live!**
   - Final review
   - Publish
   - Monitor analytics

---

**Last Updated:** February 12, 2026
**Status:** ✅ Production Ready
**Version:** 1.0.0
