# API Documentation

Complete reference for all API endpoints in the SiteForge Business Website platform.

**Last updated:** 25 Februari 2026

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Rate Limiting](#rate-limiting)
4. [Error Handling](#error-handling)
5. [Core API](#core-api)
6. [E-commerce & Checkout API](#e-commerce--checkout-api)
7. [AI Content Generation API](#ai-content-generation-api)
8. [AI SEO API](#ai-seo-api)
9. [AI Content Analysis API](#ai-content-analysis-api)
10. [AI Translation API](#ai-translation-api)
11. [Site Wizard API](#site-wizard-api)
12. [Payload CMS API](#payload-cms-api)

---

## Overview

### Base URL

```
Development: http://localhost:3020
Production:  https://yourdomain.com
```

### Content Type

All API requests and responses use JSON:

```
Content-Type: application/json
```

### Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "error": "Error message (if success = false)"
}
```

---

## Authentication

### Public Endpoints

These endpoints require no authentication:

- `GET /api/health` - Health check
- `GET /api/og` - OG image generation
- `POST /api/contact` - Contact form submission

### Protected Endpoints

AI endpoints and admin APIs require authentication:

**Method:** Session-based (Payload CMS)

**Login:**
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "message": "Auth Passed",
  "user": { ... },
  "token": "jwt-token",
  "exp": 1234567890
}
```

**Using Token:**
```bash
# Include in Authorization header
Authorization: Bearer <jwt-token>

# Or via cookie (automatic after login)
Cookie: payload-token=<jwt-token>
```

---

## Rate Limiting

### Limits

- **Core API:** 100 requests/minute
- **AI API:** 20 requests/minute
- **Contact Form:** 5 submissions/hour per IP

### Headers

Rate limit info is returned in response headers:

```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1234567890
```

### Exceeded Limit

```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 60 seconds."
}
```

---

## Error Handling

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message",
  "details": {
    "field": "Specific validation error"
  },
  "code": "ERROR_CODE"
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Invalid request data
- `AUTH_REQUIRED` - Authentication required
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `AI_SERVICE_ERROR` - AI service unavailable
- `INTERNAL_ERROR` - Server error

---

## Core API

### GET /api/health

Health check endpoint for monitoring.

**Authentication:** None

**Request:**
```bash
curl http://localhost:3020/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-10T14:00:00.000Z",
  "checks": {
    "database": {
      "status": "ok",
      "latency": 15
    },
    "memory": {
      "status": "ok",
      "used": 123456789,
      "total": 1000000000,
      "percentage": 12
    },
    "environment": {
      "nodeEnv": "development",
      "nodeVersion": "20.10.0"
    }
  }
}
```

**Status Codes:**
- `200` - System healthy
- `503` - System unhealthy

**Cache:** No cache (`Cache-Control: no-cache`)

---

### GET /api/og

Dynamic Open Graph image generation.

**Authentication:** None

**Query Parameters:**
- `title` (string, optional) - Image title
- `description` (string, optional) - Image description
- `siteName` (string, optional) - Site name

**Request:**
```bash
curl "http://localhost:3020/api/og?title=Hello+World&description=Welcome"
```

**Response:**
- Content-Type: `image/png`
- Size: 1200x630 pixels
- Format: PNG

**Example:**
```html
<!-- In HTML meta tags -->
<meta property="og:image" content="/api/og?title=My+Page&description=Description" />
```

---

### POST /api/contact

Submit contact form.

**Authentication:** None (reCAPTCHA required in production)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+31 20 123 4567",
  "subject": "Question about services",
  "message": "I would like to know more about...",
  "recaptchaToken": "recaptcha-token-here"
}
```

**Required Fields:**
- `name` (string, min 1 char)
- `email` (string, valid email)
- `message` (string, min 1 char)

**Optional Fields:**
- `phone` (string)
- `subject` (string)
- `recaptchaToken` (string, required if reCAPTCHA configured)

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "submissionId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "emailSent": true
}
```

**Error Responses:**

Missing fields (400):
```json
{
  "error": "Missing required fields"
}
```

Invalid email (400):
```json
{
  "error": "Invalid email address"
}
```

reCAPTCHA failed (403):
```json
{
  "error": "Spam verification failed. Please try again."
}
```

**Rate Limit:** 5 submissions/hour per IP

---

## E-commerce & Checkout API

Complete checkout flow with stock management, reservation system, and order creation.

### POST /api/checkout/create-order

Create an order from a cart and complete the checkout process.

**Authentication:** Optional (supports both authenticated and guest checkout)

**Request Body:**

```json
{
  "cartId": "string (required)",
  "shippingAddress": {
    "street": "string (required)",
    "houseNumber": "string (required)",
    "houseNumberAddition": "string (optional)",
    "postalCode": "string (required)",
    "city": "string (required)",
    "country": "string (optional, default: NL)"
  },
  "billingAddress": {
    // Same structure as shippingAddress (optional - uses shipping if not provided)
  },
  "paymentMethod": "string (required)",
  "shippingMethod": "string (optional)",
  "notes": "string (optional)",

  // For guest checkout (required if not authenticated):
  "guestEmail": "string",
  "guestName": "string",
  "guestPhone": "string (optional)"
}
```

**Checkout Flow:**

The endpoint performs these steps automatically:

1. **Cart Validation**
   - Validates cart exists and has items
   - Checks cart is not already converted to an order

2. **Stock Availability Check (with Reservations)**
   - Checks stock levels for all products
   - Considers active reservations by other users
   - Fails if insufficient stock available

3. **Order Number Generation**
   - Format: `ORD-YYYYMMDD-00001`
   - Sequential numbering per day

4. **Order Creation**
   - Snapshots product details (title, SKU, brand, prices)
   - Preserves historical data for order records

5. **Stock Deduction**
   - Decrements product stock synchronously
   - Updates stock status (in-stock, low-stock, out-of-stock)
   - Cannot fail once order is created

6. **Cart Status Update**
   - Marks cart as 'completed'
   - Links cart to order via `convertedToOrder`

7. **Stock Reservation Conversion**
   - Converts active reservations to 'converted' status
   - Links reservations to order

8. **Email Confirmation**
   - Automatically sent via Orders collection hooks
   - Includes order details, items, totals

**Success Response (200):**

```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "6789...",
    "orderNumber": "ORD-20260224-00042",
    "total": 249.99,
    "status": "pending"
  },
  "paymentRequired": true
}
```

**Error Responses:**

**400 Bad Request - Cart Empty:**
```json
{
  "error": "Cart is empty"
}
```

**400 Bad Request - Already Converted:**
```json
{
  "error": "Cart has already been converted to an order"
}
```

**400 Bad Request - Stock Unavailable:**
```json
{
  "error": "Stock unavailable",
  "message": "Some items are out of stock or have insufficient quantity",
  "stockIssues": [
    "Product Name: Only 2 available (3 reserved by others)",
    "Another Product: Out of stock"
  ]
}
```

**400 Bad Request - Missing Address:**
```json
{
  "error": "Shipping address is required"
}
```

**400 Bad Request - Missing Guest Email:**
```json
{
  "error": "Guest email is required for guest checkout"
}
```

**404 Not Found - Cart Not Found:**
```json
{
  "error": "Cart not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Checkout failed",
  "message": "An error occurred during checkout"
}
```

**Example Request (JavaScript):**

```javascript
const response = await fetch('/api/checkout/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    cartId: '6789...',
    shippingAddress: {
      street: 'Kerkstraat',
      houseNumber: '42',
      houseNumberAddition: 'A',
      postalCode: '1234 AB',
      city: 'Amsterdam',
      country: 'NL'
    },
    paymentMethod: 'ideal',
    shippingMethod: 'standard',

    // Guest checkout:
    guestEmail: 'customer@example.com',
    guestName: 'Jan de Vries',
    guestPhone: '+31 6 12345678'
  })
})

const data = await response.json()

if (data.success) {
  console.log('Order created:', data.order.orderNumber)
  // Redirect to payment gateway...
} else {
  console.error('Checkout failed:', data.error)
  if (data.stockIssues) {
    console.error('Stock issues:', data.stockIssues)
  }
}
```

**Example Request (cURL):**

```bash
curl -X POST https://yourdomain.com/api/checkout/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "cartId": "6789...",
    "shippingAddress": {
      "street": "Kerkstraat",
      "houseNumber": "42",
      "postalCode": "1234 AB",
      "city": "Amsterdam"
    },
    "paymentMethod": "ideal",
    "guestEmail": "customer@example.com",
    "guestName": "Jan de Vries"
  }'
```

**Example Request (Python):**

```python
import requests

response = requests.post(
    'https://yourdomain.com/api/checkout/create-order',
    json={
        'cartId': '6789...',
        'shippingAddress': {
            'street': 'Kerkstraat',
            'houseNumber': '42',
            'postalCode': '1234 AB',
            'city': 'Amsterdam'
        },
        'paymentMethod': 'ideal',
        'guestEmail': 'customer@example.com',
        'guestName': 'Jan de Vries'
    }
)

data = response.json()

if data['success']:
    print(f"Order created: {data['order']['orderNumber']}")
else:
    print(f"Checkout failed: {data['error']}")
```

---

### Stock Reservation System

To prevent overselling when multiple users checkout simultaneously, the platform uses a **stock reservation system**.

**How it works:**

1. **Automatic Reservation**
   - When items are added to cart, stock is automatically reserved
   - Reservations expire after 15 minutes
   - Prevents other users from buying reserved stock

2. **Reservation Lifecycle**
   - `active` - Stock is reserved for a cart
   - `converted` - Reservation converted to order on successful checkout
   - `released` - Reservation cancelled (cart deleted/abandoned)
   - `expired` - Reservation expired (> 15 minutes old)

3. **Stock Availability Calculation**
   ```
   Available Stock = Total Stock - Active Reservations
   ```

4. **Automatic Cleanup**
   - Expired reservations are cleaned up every 5 minutes via cron
   - Released when cart is deleted
   - Converted when order is created

**Benefits:**
- Prevents overselling during checkout
- No need for pessimistic locking
- Automatic cleanup of expired reservations
- Fair allocation (first-come, first-served)

---

### GET /api/cron/cleanup-stock-reservations

Cron endpoint to cleanup expired stock reservations (15+ minutes old).

**Authentication:** Requires `CRON_SECRET` environment variable

**Authorization Methods:**

1. **Vercel Cron** (Automatic):
   ```json
   // vercel.json
   {
     "crons": [{
       "path": "/api/cron/cleanup-stock-reservations",
       "schedule": "*/5 * * * *"
     }]
   }
   ```

2. **External Cron** (e.g., cron-job.org):
   ```bash
   # URL with secret parameter
   GET https://yourdomain.com/api/cron/cleanup-stock-reservations?secret=YOUR_CRON_SECRET

   # Or via Bearer token
   curl -X GET https://yourdomain.com/api/cron/cleanup-stock-reservations \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

**Success Response (200):**

```json
{
  "success": true,
  "cleaned": 5,
  "message": "Successfully cleaned up 5 expired stock reservations",
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Error Response (401 Unauthorized):**

```json
{
  "error": "Unauthorized - Invalid cron secret"
}
```

**Error Response (500 Internal Server Error):**

```json
{
  "success": false,
  "error": "Cron job failed",
  "message": "Error message...",
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Setup Instructions:**

1. Set `CRON_SECRET` in environment variables:
   ```bash
   CRON_SECRET=your-random-secret-here
   ```

2. Configure cron to run every 5 minutes:
   - **Vercel**: Add to `vercel.json` (automatic auth)
   - **External**: Use secret parameter in URL
   - **GitHub Actions**: Use Bearer token in Authorization header

3. Monitor logs for cleanup activity:
   ```
   ✅ Cleaned up 5 expired stock reservations
   ```

**Best Practices:**
- Run every 5 minutes for optimal cleanup
- Monitor for failures (indicates infrastructure issues)
- Set up alerting if cleanup consistently fails
- Reservations expire at 15 minutes, cleanup should run more frequently

---

## AI Content Generation API

All AI endpoints require authentication.

### POST /api/ai/generate-content

Generate text content using AI.

**Authentication:** Required

**Request Body:**
```json
{
  "prompt": "Write a compelling intro about sustainable technology",
  "context": "For a tech company focused on green solutions",
  "tone": "professional",
  "language": "nl",
  "maxTokens": 500,
  "temperature": 0.7
}
```

**Parameters:**
- `prompt` (string, required) - Content generation prompt
- `context` (string, optional) - Additional context
- `tone` (enum, optional) - `professional | casual | friendly | formal | enthusiastic | persuasive`
- `language` (enum, optional) - `nl | en | de | fr | es` (default: `nl`)
- `maxTokens` (number, optional) - Max tokens (10-4000, default: 1000)
- `temperature` (number, optional) - Creativity (0-2, default: 0.7)

**Response:**
```json
{
  "success": true,
  "content": "Generated content text here...",
  "tokensUsed": 453,
  "model": "gpt-4"
}
```

**Example:**
```bash
curl -X POST http://localhost:3020/api/ai/generate-content \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a hero section for a bakery",
    "tone": "friendly",
    "language": "nl"
  }'
```

---

### POST /api/ai/generate-block

Generate a single content block.

**Authentication:** Required

**Request Body:**
```json
{
  "blockType": "hero",
  "context": "Modern tech startup focused on AI solutions",
  "tone": "professional",
  "language": "nl"
}
```

**Block Types:**
- `hero` - Hero section
- `features` - Features grid
- `testimonials` - Customer testimonials
- `pricing` - Pricing table
- `faq` - FAQ section
- `cta` - Call-to-action
- `stats` - Statistics
- `team` - Team members
- `services` - Services grid
- `content` - Rich text content

**Response:**
```json
{
  "success": true,
  "block": {
    "blockType": "hero",
    "title": "Transform Your Business with AI",
    "description": "Leading AI solutions for modern enterprises...",
    "cta": {
      "text": "Get Started",
      "url": "/contact"
    }
  }
}
```

---

### POST /api/ai/generate-page

Generate a complete page structure with multiple blocks.

**Authentication:** Required

**Request Body:**
```json
{
  "pagePurpose": "About page showcasing company history and values",
  "pageType": "about",
  "businessInfo": {
    "name": "TechCorp",
    "industry": "Technology",
    "targetAudience": "Enterprise clients",
    "tone": "professional",
    "valueProposition": "Innovative AI solutions"
  },
  "preferences": {
    "includeHero": true,
    "includeTestimonials": true,
    "includeFAQ": false,
    "includeContactForm": true,
    "maxBlocks": 8
  },
  "language": "nl"
}
```

**Page Types:**
- `landing` - Landing page
- `about` - About page
- `services` - Services page
- `contact` - Contact page
- `blog` - Blog overview
- `custom` - Custom purpose

**Response:**
```json
{
  "success": true,
  "pageStructure": {
    "title": "About TechCorp",
    "slug": "about",
    "blocks": [
      {
        "blockType": "hero",
        "title": "...",
        "description": "..."
      },
      {
        "blockType": "content",
        "richText": "..."
      }
    ],
    "meta": {
      "title": "About TechCorp - Innovative AI Solutions",
      "description": "..."
    }
  }
}
```

---

### POST /api/ai/suggest-blocks

Get AI suggestions for which blocks to add to a page.

**Authentication:** Required

**Request Body:**
```json
{
  "pageContext": "Homepage for a restaurant",
  "existingBlocks": ["hero", "features"],
  "businessType": "restaurant",
  "language": "nl"
}
```

**Response:**
```json
{
  "success": true,
  "suggestions": [
    {
      "blockType": "testimonials",
      "reason": "Customer reviews build trust for restaurants",
      "priority": "high"
    },
    {
      "blockType": "cta",
      "reason": "Drive reservations with clear call-to-action",
      "priority": "high"
    },
    {
      "blockType": "faq",
      "reason": "Answer common questions about menu and hours",
      "priority": "medium"
    }
  ]
}
```

---

### GET /api/ai/status

Check AI service availability.

**Authentication:** None

**Request:**
```bash
curl http://localhost:3020/api/ai/status
```

**Response:**
```json
{
  "available": true,
  "model": "gpt-4",
  "imageModel": "dall-e-3",
  "configured": true
}
```

---

## AI SEO API

### POST /api/ai/analyze-seo

Analyze page content for SEO optimization.

**Authentication:** Required

**Request Body:**
```json
{
  "content": "Page content here...",
  "targetKeyword": "sustainable technology",
  "url": "/services/sustainability",
  "language": "nl"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "score": 78,
    "issues": [
      {
        "type": "warning",
        "message": "Title tag could be more descriptive",
        "fix": "Include primary keyword in title"
      }
    ],
    "improvements": [
      "Add more internal links",
      "Optimize image alt texts",
      "Improve meta description"
    ],
    "keywordDensity": 2.3,
    "readability": 65
  }
}
```

---

### POST /api/ai/generate-meta-tags

Generate SEO-optimized meta tags.

**Authentication:** Required

**Request Body:**
```json
{
  "pageTitle": "Sustainable Technology Solutions",
  "pageContent": "Brief page summary or first paragraph...",
  "targetKeywords": ["sustainable tech", "green solutions"],
  "language": "nl"
}
```

**Response:**
```json
{
  "success": true,
  "metaTags": {
    "title": "Sustainable Technology Solutions | Green Innovation",
    "description": "Leading sustainable technology solutions for a greener future...",
    "keywords": ["sustainable tech", "green solutions", "eco-friendly"],
    "ogTitle": "Sustainable Technology Solutions",
    "ogDescription": "Discover our innovative green technology solutions...",
    "twitterTitle": "Sustainable Tech Solutions",
    "twitterDescription": "..."
  }
}
```

---

### POST /api/ai/research-keywords

Research relevant keywords for content.

**Authentication:** Required

**Request Body:**
```json
{
  "topic": "sustainable technology",
  "industry": "technology",
  "language": "nl"
}
```

**Response:**
```json
{
  "success": true,
  "keywords": [
    {
      "keyword": "duurzame technologie",
      "relevance": "high",
      "searchVolume": "high",
      "difficulty": "medium"
    },
    {
      "keyword": "groene innovatie",
      "relevance": "high",
      "searchVolume": "medium",
      "difficulty": "low"
    }
  ]
}
```

---

### POST /api/ai/generate-schema-markup

Generate JSON-LD schema markup for a page.

**Authentication:** Required

**Request Body:**
```json
{
  "pageType": "LocalBusiness",
  "businessName": "TechCorp BV",
  "content": "Business description and details...",
  "language": "nl"
}
```

**Response:**
```json
{
  "success": true,
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TechCorp BV",
    "description": "...",
    "address": { ... },
    "telephone": "+31 20 123 4567"
  }
}
```

---

## AI Content Analysis API

### POST /api/ai/analyze-content

Comprehensive content analysis.

**Authentication:** Required

**Request Body:**
```json
{
  "content": "Your content text here...",
  "language": "nl"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "wordCount": 450,
    "readability": {
      "score": 65,
      "level": "intermediate"
    },
    "tone": {
      "primary": "professional",
      "confidence": 0.85
    },
    "sentiment": {
      "score": 0.7,
      "label": "positive"
    },
    "structure": {
      "headings": 5,
      "paragraphs": 12,
      "averageSentenceLength": 18
    }
  }
}
```

---

### POST /api/ai/analyze-readability

Analyze content readability.

**Authentication:** Required

**Request Body:**
```json
{
  "content": "Your content text...",
  "language": "nl"
}
```

**Response:**
```json
{
  "success": true,
  "readability": {
    "score": 68,
    "level": "Easy to read",
    "averageSentenceLength": 15,
    "complexWords": 8,
    "suggestions": [
      "Consider breaking up longer sentences",
      "Replace complex terms with simpler alternatives"
    ]
  }
}
```

---

### POST /api/ai/check-grammar

Check grammar and spelling.

**Authentication:** Required

**Request Body:**
```json
{
  "content": "Your content text...",
  "language": "nl"
}
```

**Response:**
```json
{
  "success": true,
  "issues": [
    {
      "type": "grammar",
      "message": "Subject-verb agreement error",
      "position": 45,
      "suggestion": "Use 'are' instead of 'is'"
    },
    {
      "type": "spelling",
      "message": "Possible spelling error",
      "word": "technologie",
      "suggestions": ["technology"]
    }
  ],
  "correctedText": "Your corrected text..."
}
```

---

## AI Translation API

### POST /api/ai/translate

Translate text to another language.

**Authentication:** Required

**Request Body:**
```json
{
  "text": "Welcome to our website",
  "sourceLanguage": "en",
  "targetLanguage": "nl",
  "context": "Website hero section",
  "tone": "professional"
}
```

**Response:**
```json
{
  "success": true,
  "translatedText": "Welkom op onze website",
  "sourceLanguage": "en",
  "targetLanguage": "nl",
  "confidence": 0.95
}
```

---

### POST /api/ai/translate-multiple

Translate multiple text segments at once.

**Authentication:** Required

**Request Body:**
```json
{
  "texts": [
    "Welcome",
    "About Us",
    "Contact"
  ],
  "sourceLanguage": "en",
  "targetLanguage": "nl"
}
```

**Response:**
```json
{
  "success": true,
  "translations": [
    { "original": "Welcome", "translated": "Welkom" },
    { "original": "About Us", "translated": "Over Ons" },
    { "original": "Contact", "translated": "Contact" }
  ]
}
```

---

### POST /api/ai/detect-language

Detect the language of text.

**Authentication:** Required

**Request Body:**
```json
{
  "text": "Dit is een Nederlandse tekst"
}
```

**Response:**
```json
{
  "success": true,
  "language": "nl",
  "confidence": 0.98,
  "alternatives": [
    { "language": "af", "confidence": 0.02 }
  ]
}
```

---

## Site Wizard API

### POST /api/wizard/generate-site

Generate a complete website based on wizard input.

**Authentication:** Required

**Request Body:**
```json
{
  "wizardData": {
    "currentStep": 5,
    "companyInfo": {
      "name": "Green Solutions BV",
      "businessType": "B2B",
      "industry": "Sustainability Consulting",
      "targetAudience": "Corporate sustainability managers",
      "coreValues": ["Innovation", "Sustainability", "Excellence"],
      "usps": ["20+ years experience", "Certified consultants"]
    },
    "design": {
      "colorScheme": {
        "primary": "#2E7D32",
        "secondary": "#1976D2",
        "accent": "#FFA000"
      },
      "style": "modern",
      "fontPreference": "sans-serif"
    },
    "content": {
      "language": "nl",
      "tone": "professional",
      "pages": ["home", "about", "services", "contact"]
    },
    "features": {
      "contactForm": true,
      "newsletter": true,
      "testimonials": true,
      "faq": true,
      "socialMedia": true,
      "maps": false,
      "cta": true
    }
  },
  "sseConnectionId": "optional-sse-connection-id"
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "generate-site-1234567890",
  "message": "Site generation started",
  "estimatedTime": 120
}
```

**Job Status:**

Check job status via SSE connection or polling:

```bash
GET /api/ai/stream/{connectionId}
```

**Job Complete Response:**
```json
{
  "status": "completed",
  "pages": [
    {
      "title": "Home",
      "slug": "home",
      "blocks": [ ... ]
    }
  ]
}
```

---

## Payload CMS API

### Overview

Payload CMS provides a full RESTful API for all collections.

**Base Path:** `/api/{collection-name}`

**Collections:**
- `pages` - Website pages
- `posts` - Blog posts
- `media` - Media files
- `users` - Users
- `form-submissions` - Form submissions

### Authentication

CMS API requires authentication for write operations:

```bash
# Login first
POST /api/users/login

# Then use token in subsequent requests
Authorization: Bearer <token>
```

### Common Endpoints

**Get All Documents:**
```bash
GET /api/pages
GET /api/pages?limit=10&page=1
GET /api/pages?sort=-createdAt
GET /api/pages?where[slug][equals]=home
```

**Get Single Document:**
```bash
GET /api/pages/{id}
GET /api/pages/{slug}
```

**Create Document:**
```bash
POST /api/pages
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Page",
  "slug": "new-page",
  "layout": []
}
```

**Update Document:**
```bash
PATCH /api/pages/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title"
}
```

**Delete Document:**
```bash
DELETE /api/pages/{id}
Authorization: Bearer <token>
```

### Query Parameters

**Pagination:**
- `limit` - Results per page (default: 10)
- `page` - Page number (default: 1)

**Sorting:**
- `sort` - Field to sort by (prefix with `-` for descending)
- Example: `sort=-createdAt` (newest first)

**Filtering:**
- `where[field][operator]=value`
- Operators: `equals`, `not_equals`, `like`, `contains`, `in`, `not_in`, `greater_than`, `less_than`
- Example: `where[_status][equals]=published`

**Depth:**
- `depth` - Populate relationship depth (0-10, default: 0)
- Example: `depth=1` (populate one level of relationships)

### Example Requests

**Get Published Pages:**
```bash
curl "http://localhost:3020/api/pages?where[_status][equals]=published"
```

**Search Pages:**
```bash
curl "http://localhost:3020/api/pages?where[title][like]=contact"
```

**Get Page with Populated Relationships:**
```bash
curl "http://localhost:3020/api/pages/home?depth=2"
```

**Create New Page:**
```bash
curl -X POST http://localhost:3020/api/pages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Services",
    "slug": "services",
    "_status": "draft",
    "layout": []
  }'
```

---

## SDK & Code Examples

### JavaScript/TypeScript

**Fetch API:**
```typescript
// GET request
const response = await fetch('http://localhost:3020/api/health')
const data = await response.json()

// POST request with authentication
const response = await fetch('http://localhost:3020/api/ai/generate-content', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Generate content',
    language: 'nl'
  })
})
```

**Axios:**
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3020/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// Generate content
const { data } = await api.post('/ai/generate-content', {
  prompt: 'Write about sustainable technology',
  tone: 'professional'
})
```

### Python

```python
import requests

# GET request
response = requests.get('http://localhost:3020/api/health')
data = response.json()

# POST request with authentication
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

payload = {
    'prompt': 'Generate content',
    'language': 'nl'
}

response = requests.post(
    'http://localhost:3020/api/ai/generate-content',
    headers=headers,
    json=payload
)

data = response.json()
```

### cURL

```bash
# Health check
curl http://localhost:3020/api/health

# Generate content (with auth)
curl -X POST http://localhost:3020/api/ai/generate-content \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Generate hero text","language":"nl"}'

# Submit contact form
curl -X POST http://localhost:3020/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "message":"Hello!"
  }'
```

---

## Webhooks

### Configuration

Configure webhooks in Payload admin:

1. Go to Settings → Webhooks
2. Add webhook URL
3. Select events to listen to
4. Save configuration

### Webhook Events

Available events:
- `pages.create` - Page created
- `pages.update` - Page updated
- `pages.delete` - Page deleted
- `posts.create` - Post created
- `form-submissions.create` - Form submitted

### Webhook Payload

```json
{
  "event": "pages.create",
  "doc": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "title": "New Page",
    "slug": "new-page",
    "createdAt": "2026-02-10T14:00:00.000Z"
  },
  "collection": "pages"
}
```

### Webhook Security

Verify webhook authenticity using signature:

```typescript
import crypto from 'crypto'

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return signature === expectedSignature
}
```

---

## Testing

### Test Mode

Enable test mode with environment variable:

```bash
NODE_ENV=test
```

In test mode:
- Rate limiting disabled
- reCAPTCHA accepts test tokens
- Emails not sent (logged instead)

### Test Credentials

```json
{
  "email": "dev@payloadcms.com",
  "password": "test"
}
```

### Mock Responses

For testing without AI API:

```bash
MOCK_AI_RESPONSES=true
```

---

## Changelog

### Version 1.0.0 (February 2026)

**Added:**
- Core API (health, og, contact)
- AI Content Generation (30+ endpoints)
- AI SEO optimization
- AI Content analysis
- AI Translation
- Site Wizard
- Full Payload CMS REST API

**Changed:**
- N/A (initial release)

**Deprecated:**
- None

---

## Support

### Documentation
- Full docs: `/docs`
- API examples: `/docs/API_DOCUMENTATION.md`

### Issues
- GitHub: [Issues](https://github.com/your-repo/issues)
- Email: support@yourdomain.com

### Rate Limit Increase
Contact support for higher rate limits.

---

**🎉 Complete API documentation for SiteForge Business Website!**

All endpoints documented with request/response examples, authentication details, and code samples.

**Last updated:** 25 Februari 2026
