# Meilisearch Settings - Complete Guide

**Feature:** CMS-driven Meilisearch configuration
**Global:** `/admin/globals/meilisearch-settings`
**Implemented:** February 22, 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Configuration Tabs](#configuration-tabs)
4. [Use Cases & Examples](#use-cases--examples)
5. [Best Practices](#best-practices)
6. [API Integration](#api-integration)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Features](#advanced-features)

---

## 🎯 Overview

The **Meilisearch Settings global** provides 100% CMS-driven configuration of the Meilisearch search engine. No code changes needed - everything is configurable via the admin panel!

### Why This Matters

**Before:** Search configuration hardcoded in `client.ts`
```typescript
// Had to edit code for every client!
searchableAttributes: ['title', 'brand', 'sku']
```

**After:** Configure via CMS per client
```
Aboland → Search by: title, magazineTitle, sku
Plastimed → Search by: title, brand, productCode
```

### Key Features

- ✅ **Per-client customization** - Every tenant gets unique search behavior
- ✅ **No code deployments** - Change settings instantly via admin
- ✅ **Smart defaults** - Works out-of-the-box, customize as needed
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Backwards compatible** - Uses defaults if not configured

---

## 🚀 Quick Start

### 1. Access Settings

Navigate to: **`/admin/globals/meilisearch-settings`**

### 2. Enable Collections

**Tab:** "Indexed Collections"

Add collections you want searchable:
- Products ✅ (Priority: 1)
- Blog Posts ✅ (Priority: 1)
- Pages ✅ (Priority: 0)

**Priority:** Higher = more important in ranking (0-10)

### 3. Configure Searchable Fields

**Tab:** "Searchable Fields"

For Products, select fields (in order of importance):
1. Title
2. SKU
3. Brand
4. Description
5. Tags

**Order matters!** First field = highest search weight.

### 4. Save & Reindex

1. Click **"Save"**
2. Run reindex: `POST /api/meilisearch/reindex`
3. Test search!

---

## 📑 Configuration Tabs

### Tab 1: Indexed Collections

**Purpose:** Choose which collections to index

**Settings:**
- **Collection:** products, blog-posts, pages, etc.
- **Enable Indexing:** Toggle on/off
- **Priority:** 0-10 (affects ranking)
- **Custom Index Name:** Optional (for multi-tenant)

**Example Use Case - Aboland:**
```
Collection: products
Enabled: ✅
Priority: 2 (higher than blog)
Custom Index Name: aboland_products
```

**When to Use Custom Index Names:**
- Multi-tenant setups (aboland_products vs plastimed_products)
- A/B testing different configurations
- Separate staging/production indexes

---

### Tab 2: Searchable Fields

**Purpose:** Define which fields users can search

**Per Collection Configuration:**

#### Products
- Title ⭐ (always include)
- SKU / EAN (for product codes)
- Brand (for filtering by manufacturer)
- Description (full-text search)
- Short Description
- Categories (category names)
- Tags (keywords)

**Field Order = Search Weight**
```
1. Title        → 100% weight (most important)
2. SKU          → 80% weight
3. Brand        → 60% weight
4. Description  → 40% weight
5. Tags         → 20% weight (least important)
```

#### Blog Posts
- Title
- Excerpt
- Content (full article)
- Categories
- Tags
- Author

#### Pages
- Title
- Meta Description
- Content Blocks

**💡 Tip:** Don't add too many fields! 5-7 fields is optimal for performance.

---

### Tab 3: Filterable & Sortable

**Purpose:** Enable faceted search and sorting

#### Filterable Fields (Facets)

**Products:**
- Brand → "Filter by Nike, Adidas, etc."
- Categories → "Filter by Clothing > T-Shirts"
- Price → "€0-€50, €50-€100"
- Stock → "In Stock, Out of Stock"
- Status → "Published, Draft"
- Featured → "Featured Products Only"

**Blog Posts:**
- Categories → "Tech, Business, Lifestyle"
- Status → "Published"
- Featured → "Featured Articles"
- Published At → "Last 7 days, Last 30 days"

**Example Faceted Search UI:**
```
Search: "laptop"

Filters:
☐ Dell (12)
☐ HP (8)
☐ Apple (5)

Price:
☐ €0-€500 (15)
☐ €500-€1000 (7)
☐ €1000+ (3)

In Stock: ☑
```

#### Sortable Fields

**Products:**
- Price (€ low → high)
- Created At (newest first)
- Title (A → Z)
- Stock (availability)
- Sales Count (popularity)

**Blog Posts:**
- Published At (newest first)
- Title (A → Z)
- View Count (most popular)

**💡 Tip:** Always include `createdAt` for "newest first" sorting!

---

### Tab 4: Ranking & Relevance

**Purpose:** Control how search results are ranked

#### Ranking Rules (Order Matters!)

Default order (recommended):
1. **Words** - Number of matching terms
2. **Typo** - Typo tolerance
3. **Proximity** - How close terms are
4. **Attribute** - Field importance
5. **Sort** - Custom sorting
6. **Exactness** - Exact matches

**Custom Scenarios:**

**E-commerce (prioritize stock):**
1. Words
2. **Attribute** (move up for field importance)
3. Typo
4. Proximity
5. Sort
6. Exactness

**Content (prioritize freshness):**
1. Words
2. Typo
3. **Sort** (move up for publishedAt:desc)
4. Proximity
5. Attribute
6. Exactness

#### Custom Ranking Attributes

**Boost specific fields:**

**Example - Boost Featured Products:**
```
Attribute: featured
Order: Descending (high to low)
Result: Featured products appear first
```

**Example - Boost Popular Posts:**
```
Attribute: viewCount
Order: Descending
Result: Most viewed posts rank higher
```

**Example - Boost In-Stock Products:**
```
Attribute: stock
Order: Descending
Result: Available products rank higher
```

---

### Tab 5: Typo & Synonyms

**Purpose:** Handle misspellings and word variations

#### Typo Tolerance

**Settings:**
- **Enable:** ✅ (recommended)
- **Min Word Size for 1 Typo:** 4 characters
- **Min Word Size for 2 Typos:** 8 characters

**Example:**
```
Search: "laptp" (1 typo, 5 chars)
→ Finds: "laptop" ✅

Search: "lapotp" (2 typos, 6 chars)
→ Finds: "laptop" ❌ (needs 8+ chars)

Search: "lapotop" (2 typos, 7 chars)
→ Finds: "laptop" ❌ (needs 8+ chars)

Search: "lapopto" (2 typos, 7 chars)
→ Finds: "laptop" ❌ (needs 8+ chars)
```

**Disable on Words:**
```
Words: Nike, Adidas, Sony
Reason: Brand names must be exact
```

#### Synonyms

**Purpose:** Make different words find same results

**Example - E-commerce:**
```
Group: laptop,notebook,computer
Result: Search "laptop" also finds "notebook" products
```

**Example - Medical:**
```
Group: plaster,bandage,verband
Result: Dutch + English terms both work
```

**Example - Product Types:**
```
Group: trui,sweater,pullover
Group: broek,pants,jeans
```

**Format:** Comma-separated words (no quotes)

#### Stop Words

**Purpose:** Ignore common words in search

**Use Sparingly!** Stop words can hurt search quality.

**Example (NOT recommended):**
```
Words: de, het, een, the, a, an
Problem: "the best laptop" → searches only "best laptop"
```

**When to Use:**
- Very large datasets (millions of docs)
- Extremely common words causing noise
- After thorough testing only!

**💡 Tip:** Start with zero stop words. Add only if needed.

---

### Tab 6: Exclusions & Auto-Index

**Purpose:** Control what NOT to index

#### Exclude Patterns

**URL Patterns:**
```
Pattern: /admin/*
Type: URL
Result: Never index admin pages
```

```
Pattern: /draft/*
Type: URL
Result: Exclude draft content
```

```
Pattern: *concept*
Type: URL or Content
Result: Exclude anything with "concept" in URL/content
```

**Field Value Patterns:**
```
Pattern: status=draft
Type: Field
Result: Never index drafts
```

#### Exclude by Status

**Common exclusions:**
- Draft ✅ (always exclude)
- Archived ✅ (old content)
- Pending Review (waiting approval)
- Sold Out (optional - client preference)

#### Auto-Indexing Behavior

**Settings:**
- **Enable Auto-Indexing:** ✅ (recommended)
  - Auto-indexes on create/update
  - Saves manual reindexing

- **Index Only on Publish:** ✅ (recommended)
  - Only indexes when `status = published`
  - Prevents indexing drafts

- **Batch Size:** 100 documents
  - For bulk reindexing
  - Increase for faster reindex (max 1000)

- **Debounce:** 1000ms (1 second)
  - Prevents spam indexing
  - If doc updated 5x in 1 sec → only 1 index call

**Performance Tuning:**
```
Small site (< 1000 products):
Batch Size: 100
Debounce: 1000ms

Large site (> 10,000 products):
Batch Size: 500
Debounce: 2000ms
```

---

### Tab 7: Pagination & Performance

**Purpose:** Configure search results & performance

#### Pagination

- **Max Total Hits:** 1000
  - Maximum results Meilisearch returns
  - Increase if you have > 1000 products

- **Default Results per Page:** 20
  - How many results to show by default

- **Max Results per Page:** 100
  - Maximum user can request via API

**Example Search:**
```javascript
// Default (20 results)
fetch('/api/search?q=laptop')

// Custom limit (50 results)
fetch('/api/search?q=laptop&limit=50')

// Can't exceed maxLimit
fetch('/api/search?q=laptop&limit=200') // ❌ Capped at 100
```

#### Performance & Caching

**Highlighting:**
- **Enable:** ✅ (shows matched terms)
- **Pre Tag:** `<mark>` (opening tag)
- **Post Tag:** `</mark>` (closing tag)

**Example Result:**
```html
Title: "Dell <mark>Laptop</mark> XPS 13"
Description: "Powerful <mark>laptop</mark> for professionals"
```

**Cropping:**
- **Crop Length:** 200 characters
  - Snippet length in results

- **Crop Marker:** `...`
  - Shows text was cropped

**Example Cropped Result:**
```
"This powerful laptop features Intel i7 processor, 16GB RAM,
and 512GB SSD storage. Perfect for professionals who need
high performance on the go..."
```

---

## 💼 Use Cases & Examples

### Use Case 1: Aboland Magazine Shop

**Goal:** Search magazine titles and editions

**Configuration:**

**Indexed Collections:**
```
products: enabled, priority 2
blog-posts: enabled, priority 1
```

**Searchable Fields (Products):**
```
1. magazineTitle  (highest weight - "WINELIFE")
2. title          ("WINELIFE #99 2026")
3. sku            ("WL-99-2026")
4. description
```

**Sortable Fields:**
```
- createdAt (newest editions first) ⭐
- price
- title
```

**Custom Ranking:**
```
Attribute: featured
Order: desc
→ Featured magazines rank higher
```

**Result:**
- Search "WINELIFE" → Finds all editions
- Search "wine" → Finds WINELIFE, Wijn&Co, etc.
- Newest editions appear first ✅

---

### Use Case 2: Plastimed Medical Supplies

**Goal:** Search by product code, brand, medical terms

**Configuration:**

**Searchable Fields (Products):**
```
1. sku / productCode
2. title
3. brand
4. description
5. tags
```

**Filterable Fields:**
```
- brand (Hartmann, BSN Medical, 3M)
- categories (Wondverzorging, Bandages, etc.)
- certifications (CE, FDA)
- stock (in stock, low stock, out of stock)
```

**Synonyms:**
```
plaster,bandage,verband
gaas,gauze,compress
latex,rubber,rubber-free
```

**Typo Tolerance - Disable on:**
```
Words: Hartmann, Molnlycke, Coloplast
Reason: Medical brand names must be exact
```

**Result:**
- Search "3M plaster" → Finds 3M bandages
- Search "hartman" (typo) → ❌ Exact brand required
- Search "verband" → Also finds "bandage" products ✅

---

### Use Case 3: Blog/Content Site

**Goal:** Find articles by topic, author, date

**Configuration:**

**Indexed Collections:**
```
blog-posts: enabled, priority 2 (main content)
pages: enabled, priority 1 (secondary)
products: disabled
```

**Searchable Fields (Blog Posts):**
```
1. title
2. excerpt
3. categories
4. tags
```

**Filterable Fields:**
```
- categories (Tech, Business, Lifestyle)
- publishedAt (date ranges)
- author
- featured
```

**Sortable Fields:**
```
- publishedAt:desc (newest first) ⭐ DEFAULT
- viewCount:desc (most popular)
- title:asc (A-Z)
```

**Ranking Rules:**
```
1. words
2. typo
3. sort         ← Higher priority for freshness
4. proximity
5. attribute
6. exactness
```

**Custom Ranking:**
```
Attribute: viewCount
Order: desc
→ Popular posts rank slightly higher
```

**Result:**
- Search "AI trends" → Recent AI articles first
- Filter by "Tech" category
- Sort by "Most Popular"
- Featured articles boosted ✅

---

## ✅ Best Practices

### 1. Start with Defaults, Customize Later

**Don't over-configure!**
- ✅ Enable collections
- ✅ Set searchable fields (5-7 max)
- ✅ Add filters for main facets
- ⏸️ Leave advanced settings default
- ⏸️ Add synonyms only when users search for them
- ⏸️ Test before changing ranking rules

### 2. Field Order = Search Quality

**Order searchable fields by importance:**
```
✅ GOOD:
1. title         (exact match)
2. sku           (product code)
3. brand         (manufacturer)
4. description   (details)

❌ BAD (random order):
1. description
2. tags
3. title
4. sku
```

### 3. Monitor Search Queries

**Track what users search for:**
- Most common queries → Add synonyms
- Typos → Ensure typo tolerance enabled
- No results → Missing synonyms or fields

**Example:**
```
Users search: "telefoon" (Dutch)
Products say: "phone" (English)
→ Add synonym: telefoon,phone,smartphone
```

### 4. Test Before Deploying

**Always test changes:**

1. Save settings in CMS
2. Run reindex: `POST /api/meilisearch/reindex`
3. Test searches
4. Check facets work
5. Verify sorting
6. Monitor performance

**Rollback if needed:**
- Click "Revert" in global
- Reindex again

### 5. Performance Tips

**Small Sites (< 1,000 products):**
```
Searchable Fields: 5-7
Filterable Fields: 5-7
Sortable Fields: 3-5
Batch Size: 100
```

**Medium Sites (1,000 - 10,000 products):**
```
Searchable Fields: 5-7
Filterable Fields: 7-10
Sortable Fields: 3-5
Batch Size: 250
```

**Large Sites (> 10,000 products):**
```
Searchable Fields: 5-7 (don't add more!)
Filterable Fields: 5-7 (be selective)
Sortable Fields: 3-5
Batch Size: 500
Max Total Hits: 2000
```

### 6. Multi-Tenant Configuration

**Each client gets own settings:**

**Aboland:**
```
Priority: magazineTitle > title
Sort: createdAt:desc (newest magazines)
```

**Plastimed:**
```
Priority: sku > brand > title
Filters: certifications, brand
Synonyms: Medical Dutch ↔ English
```

**Implementation:**
- Settings stored per client database
- No code changes needed
- Each tenant fully customizable

---

## 🔌 API Integration

### Fetching Settings in Code

```typescript
import { getMeilisearchSettings, mergeSettings } from '@/lib/meilisearch/settings'
import { getPayload } from 'payload'
import config from '@payload-config'

// Get CMS settings
const payload = await getPayload({ config })
const cmsSettings = await getMeilisearchSettings(payload)
const settings = mergeSettings(cmsSettings)

// Use settings
console.log(settings.searchableFields.products)
// → ['title', 'brand', 'sku', 'description']
```

### Checking if Collection is Indexed

```typescript
import { isCollectionIndexed } from '@/lib/meilisearch/settings'

if (isCollectionIndexed('products', settings)) {
  // Index the product
  await indexProduct(product)
}
```

### Custom Search with Settings

```typescript
import { meilisearchClient } from '@/lib/meilisearch/client'
import { getIndexName } from '@/lib/meilisearch/settings'

// Get custom index name (supports multi-tenant)
const indexName = getIndexName('products', settings)
const index = meilisearchClient.index(indexName)

// Search with CMS-configured settings
const results = await index.search(query, {
  limit: settings.pagination.defaultLimit,
  sort: [`createdAt:desc`],
  filter: [`status = published`],
})
```

### Checking Exclusions

```typescript
import { shouldExcludeDocument } from '@/lib/meilisearch/settings'

// Before indexing, check if doc should be excluded
if (shouldExcludeDocument(doc, settings)) {
  console.log('Skipping indexing:', doc.slug)
  return
}

await indexProduct(doc)
```

---

## 🐛 Troubleshooting

### Search Not Working

**1. Check Meilisearch is Running**
```bash
curl http://localhost:7700/health
# Should return: {"status": "available"}
```

**2. Check Collections are Enabled**
- Go to `/admin/globals/meilisearch-settings`
- Tab: "Indexed Collections"
- Verify checkboxes are enabled ✅

**3. Reindex**
```bash
curl -X POST http://localhost:3020/api/meilisearch/reindex
```

**4. Check Settings Applied**
```bash
curl http://localhost:7700/indexes/products/settings
```

### No Results for Valid Searches

**Possible Causes:**

**1. Fields Not Searchable**
- Add field to "Searchable Fields" tab
- Save & reindex

**2. Status Excluded**
- Check "Exclusions & Auto-Index" tab
- Remove `draft` from excludeStatuses if needed

**3. Wrong Index Name**
- Check "Indexed Collections" tab
- Verify custom index name matches code

**4. Typo Tolerance Too Strict**
- Increase typo tolerance
- Lower minWordSize thresholds

### Facets Not Showing

**1. Add to Filterable Fields**
- Tab: "Filterable & Sortable"
- Add field to filterableFields
- Save & reindex

**2. Field Must Have Values**
- Check documents have the field populated
- Empty fields won't show in facets

### Sorting Not Working

**1. Add to Sortable Fields**
- Tab: "Filterable & Sortable"
- Add field to sortableFields
- Save & reindex

**2. Field Must Be Number/Date**
- Only numeric/date fields can sort
- Text fields: use title:asc/desc

### Synonyms Not Working

**1. Check Format**
```
✅ CORRECT: laptop,notebook,computer
❌ WRONG: "laptop", "notebook", "computer"
❌ WRONG: laptop; notebook; computer
```

**2. Reindex After Changes**
- Synonyms only apply after reindex
- Run: `POST /api/meilisearch/reindex`

---

## 🚀 Advanced Features

### A/B Testing Different Configurations

**Goal:** Test which ranking performs better

**Setup:**
```
Index 1: products (default rules)
Index 2: products_test (custom rules)
```

**Steps:**
1. Duplicate collection config
2. Set custom index name: `products_test`
3. Change ranking rules
4. Reindex both
5. Compare search quality
6. Keep best performing config

### Multi-Language Search

**Goal:** Search in multiple languages

**Synonyms Approach:**
```
Group: laptop,ordinateur,laptop (EN,FR,NL)
Group: telefoon,telephone,phone (NL,FR,EN)
```

**Separate Indexes Approach:**
```
Collection: products
Index Name: products_en

Collection: products
Index Name: products_nl
```

Then search appropriate index based on user language.

### Custom Ranking Formulas

**Boost Multiple Fields:**
```
1. Attribute: featured, Order: desc
2. Attribute: stock, Order: desc
3. Attribute: salesCount, Order: desc
```

**Result:** Featured + In Stock + Popular = Top ranking

### Geo Search (Future)

**Coming Soon:** Geo-location filtering

```
Filter: Products within 50km
Sort: Distance ascending
```

### Real-Time vs Batched Indexing

**Real-Time (Default):**
```
Auto-Indexing: ✅
Debounce: 1000ms
→ Index on every save (with 1s delay)
```

**Batched (High Volume):**
```
Auto-Indexing: ❌
Manual Reindex: Daily cron job
→ Index 10,000 products overnight
```

---

## 📊 Monitoring & Analytics

### Track Search Performance

**Meilisearch provides metrics:**
```bash
curl http://localhost:7700/stats
```

**Response:**
```json
{
  "databaseSize": 12345678,
  "lastUpdate": "2026-02-22T12:00:00Z",
  "indexes": {
    "products": {
      "numberOfDocuments": 5432,
      "isIndexing": false,
      "fieldDistribution": {
        "title": 5432,
        "brand": 5201,
        "sku": 5432
      }
    }
  }
}
```

### Search Query Logs

**Log popular searches:**
```typescript
// In search API route
console.log('[Search]', query, results.hits.length)
```

**Analyze logs monthly:**
- Most searched terms
- Zero-result queries → Add synonyms
- Slow queries → Optimize fields

---

## 🎓 Summary

### ✅ What You Can Configure

- **Collections:** Which to index (products, blog, pages)
- **Searchable Fields:** What users can search (title, sku, etc.)
- **Filterable Fields:** Faceted search (brand, category, price)
- **Sortable Fields:** Sort options (price, date, name)
- **Ranking Rules:** Result ordering (words, typo, proximity)
- **Typo Tolerance:** Misspelling handling (1-2 typos)
- **Synonyms:** Word variations (laptop = notebook)
- **Exclusions:** What NOT to index (drafts, admin pages)
- **Auto-Indexing:** When to index (on publish, debounced)
- **Pagination:** Results per page (20 default, 100 max)
- **Performance:** Highlighting, cropping, caching

### 🎯 Key Takeaways

1. **Start Simple** - Enable collections, set fields, save
2. **Test Often** - Reindex after every settings change
3. **Monitor Usage** - Track searches, improve synonyms
4. **Client-Specific** - Each tenant configures independently
5. **No Code Needed** - Everything via CMS admin panel

### 🔗 Related Documentation

- Meilisearch Official Docs: https://docs.meilisearch.com
- API Reference: `docs/API_DOCUMENTATION.md`
- Search Component Guide: `src/branches/shared/components/features/search/README.md`

---

**Status:** ✅ 100% Complete & Production Ready
**Last Updated:** February 22, 2026
