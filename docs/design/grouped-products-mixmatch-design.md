# Grouped Products (Mix & Match) Design Specification

**Product Type:** Grouped Product / Mix & Match Builder
**Example:** Lunch Box Builder - "Stel je eigen box samen"
**Source:** `mix-and-match-product.html` (Sprint 1)
**Created:** February 2026

---

## Overview

Mix & Match products allow customers to build their own product bundles by selecting multiple items from a catalog. The system shows real-time progress, enforces minimum/maximum selections, and offers bundle pricing discounts.

**Key Features:**
- Step-by-step builder flow with progress indicators
- Category filtering for easy product selection
- Real-time progress bar showing completion
- Sticky sidebar displaying selected items
- Visual box representation (slots filling up)
- Dynamic pricing with bundle discounts
- Configurable box sizes (Small, Medium, Large)
- Add/remove products with quantity controls

**Use Cases:**
- Food boxes (lunch boxes, meal kits, snack boxes)
- Gift sets (cosmetics, wine, cheese)
- Sample packs (coffee, tea, chocolate)
- Custom bundles (office supplies, art supplies)
- Subscription boxes

---

## Layout Structure

### Desktop Layout (1200px container)

```
┌────────────────────────────────────────────────────────────────┐
│ Header (Sticky)                                                │
│ - Logo | Search | Cart                                         │
├────────────────────────────────────────────────────────────────┤
│ HERO BANNER (Dark gradient with stats)                         │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Mix & Match | "Stel je eigen Lunch Box samen"            │   │
│ │ Intro text                                                │   │
│ │               STATS: [6 Items] [€24,95] [30+ Producten]  │   │
│ └──────────────────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────┤
│ STEPS BAR                                                      │
│ ✓ Box formaat → 2 Items kiezen → 3 Afrekenen                  │
├────────────────────────────────┬───────────────────────────────┤
│ LEFT: PRODUCT SELECTION        │ RIGHT: BOX SIDEBAR (Sticky)  │
│                                │                               │
│ Category Tabs                  │ ┌─────────────────────────┐  │
│ [Alles 32] [Salades] [Wraps]   │ │ 📦 JOUW LUNCH BOX       │  │
│ [Soepen] [Dranken] [Snacks]    │ │ ┌───┬───┬───┬───┬───┬─┐ │  │
│                                │ │ │🥗│🌯│🍲│ - │ - │ - │ │  │
│ Progress Bar                   │ │ └───┴───┴───┴───┴───┴─┘ │  │
│ [████████░░░░] 3 / 6 items     │ │                          │  │
│                                │ │ SELECTED ITEMS:          │  │
│ Products Grid (3 columns)      │ │ - Caesar Salade (×1)     │  │
│ ┌────┬────┬────┐               │ │ - Pulled Chicken (×1)    │  │
│ │🥗  │🌯  │🍲  │ IN BOX ✓      │ │ - Tom Kha Gai (×1)       │  │
│ ├────┼────┼────┤               │ │                          │  │
│ │🥗  │🌯  │🍲  │ [+ Toevoegen] │ │ PRICING:                 │  │
│ └────┴────┴────┘               │ │ 3 van 6 items: €14,95    │  │
│                                │ │ Box korting: -20%        │  │
│ (More products below...)       │ │ Totaal: € 24,95          │  │
│                                │ │                          │  │
│                                │ │ [Nog 3 items kiezen]     │  │
│                                │ │                          │  │
│                                │ │ BOX SIZE OPTIONS:        │  │
│                                │ │ ○ Small (4 items)        │  │
│                                │ │ ● Medium (6 items)       │  │
│                                │ │ ○ Large (10 items)       │  │
│                                │ └─────────────────────────┘  │
│ (Sticky at top: 96px)          │                               │
└────────────────────────────────┴───────────────────────────────┘
```

**Grid:** `grid-template-columns: 1fr 360px`
**Gap:** 20px
**Sidebar:** Sticky at `top: 96px`
**Mobile:** Stacks to single column, sidebar becomes static

---

## Components Specification

### 1. Hero Banner

**Purpose:** Introduce the Mix & Match concept and show key stats
**Design:** Dark gradient background with teal glow accent

**Specifications:**

**Container:**
- **Background:** `linear-gradient(135deg, var(--navy), var(--navy-light))`
- **Padding:** 36px 0
- **Position:** Relative (for pseudo-element glow)
- **Overflow:** Hidden

**Glow Effect:**
```css
.mm-hero::before {
  content: '';
  position: absolute;
  top: -80px;
  right: -40px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0,137,123,.1), transparent 70%);
  border-radius: 50%;
}
```

**Layout:**
- **Display:** Flex
- **Justify:** Space-between
- **Align:** Center

**Left Side Elements:**

1. **Badge:**
   - Background: `rgba(0,137,123,.12)`
   - Border: `1px solid rgba(0,137,123,.2)`
   - Padding: 4px 12px
   - Border radius: 100px
   - Font: 12px, bold
   - Color: teal-light
   - Icon: 12×12px

2. **Title:**
   - Font: Plus Jakarta Sans
   - Size: 30px
   - Weight: 800
   - Color: White
   - Accent word: teal-light (using `<em>`)

3. **Description:**
   - Font size: 14px
   - Color: `rgba(255,255,255,.35)`
   - Max width: 480px

**Right Side - Stats:**

**Layout:**
- **Display:** Flex
- **Gap:** 16px
- **Separator:** 1px solid `rgba(255,255,255,.06)`

**Stat Card:**
```html
<div class="mmh-stat">
  <div class="mmhs-num">6</div>
  <div class="mmhs-label">Items kiezen</div>
</div>
```

**Stat Number:**
- Font: Plus Jakarta Sans
- Size: 28px
- Weight: 800
- Color: teal-light

**Stat Label:**
- Size: 11px
- Color: `rgba(255,255,255,.3)`

**Mobile:**
- Hide stats (.mmh-right display: none)
- Center-align left content

---

### 2. Steps Indicator Bar

**Purpose:** Show progress through multi-step builder flow
**Design:** Horizontal step indicator with numbered circles

**Specifications:**

**Container:**
- **Background:** White
- **Border bottom:** 1px solid var(--grey)
- **Padding:** 12px 0

**Step Layout:**
- **Display:** Flex
- **Align:** Center
- **Gap:** 4px (between steps and arrows)

**Step Element:**
```html
<div class="sb-step active">
  <div class="sb-num">2</div> Items kiezen
</div>
```

**Step States:**

1. **Default (Pending):**
   - Color: var(--grey-mid)
   - Number background: var(--grey-light)
   - Number color: var(--grey-mid)

2. **Active:**
   - Background: var(--teal-glow)
   - Color: var(--teal)
   - Number background: var(--teal)
   - Number color: white

3. **Done:**
   - Color: var(--green)
   - Number background: var(--green)
   - Number color: white
   - Shows checkmark icon instead of number

**Number Circle:**
- Size: 22×22px
- Border radius: 50%
- Font: 11px, weight 800
- Center-aligned

**Arrow Separator:**
- Icon: chevron-right
- Size: 14×14px
- Color: var(--grey)

**Example Flow:**
```
✓ Box formaat → 2 Items kiezen → 3 Afrekenen
(green/done)    (teal/active)    (grey/pending)
```

---

### 3. Category Filter Tabs

**Purpose:** Filter products by category
**Design:** Pill-style tabs with product counts

**Specifications:**

**Container:**
- **Display:** Flex
- **Gap:** 4px
- **Margin bottom:** 14px
- **Flex wrap:** Wrap

**Tab Button:**
- **Padding:** 8px 16px
- **Border radius:** 100px (pill)
- **Font:** 13px, weight 700
- **Border:** 1.5px solid var(--grey)
- **Background:** White
- **Color:** var(--grey-mid)
- **Cursor:** Pointer
- **Transition:** all 0.12s

**Tab States:**

1. **Inactive:**
   - Border: var(--grey)
   - Background: white
   - Color: var(--grey-mid)

2. **Hover:**
   - Border: var(--teal)
   - Color: var(--teal)

3. **Active:**
   - Border: var(--teal)
   - Background: var(--teal)
   - Color: white
   - Count badge: `rgba(255,255,255,.25)`

**HTML Structure:**
```html
<button class="cat-tab active">
  <i data-lucide="grid"></i> Alles <span class="cat-count">32</span>
</button>
<button class="cat-tab">
  🥗 Salades <span class="cat-count">8</span>
</button>
```

**Count Badge:**
- Font: 10px, weight 800
- Padding: 1px 6px
- Border radius: 100px
- Background: var(--grey-light) (inactive), `rgba(255,255,255,.25)` (active)

**Icon:**
- Size: 14×14px (lucide icons)
- OR emoji (🥗, 🌯, 🍲, 🥤, 🍪)

---

### 4. Progress Bar

**Purpose:** Show how many items selected vs. required
**Design:** Horizontal progress bar with count and label

**Specifications:**

**Container:**
- **Background:** White
- **Border:** 1.5px solid var(--grey)
- **Border radius:** 14px
- **Padding:** 14px 18px
- **Display:** Flex
- **Align:** Center
- **Gap:** 14px
- **Margin bottom:** 14px

**Progress Bar:**
- **Flex:** 1 (takes remaining space)
- **Height:** 10px
- **Background:** var(--grey-light)
- **Border radius:** 100px
- **Overflow:** Hidden

**Progress Fill:**
```css
.bp-fill {
  height: 100%;
  border-radius: 100px;
  background: var(--teal);
  transition: width .3s cubic-bezier(.4,0,.2,1);
  width: 50%; /* Dynamic based on progress */
}

.bp-fill.full {
  background: var(--green); /* When 100% complete */
}
```

**Count Display:**
- **Font:** Plus Jakarta Sans
- **Size:** 18px
- **Weight:** 800
- **White-space:** nowrap
- **Format:** `<em>3</em> / 6` (current in teal, total in black)

**Label:**
- **Font size:** 11px
- **Color:** var(--grey-mid)
- **Weight:** 600
- **White-space:** nowrap
- **Text:** "items geselecteerd"

**HTML Structure:**
```html
<div class="box-progress">
  <div class="bp-bar">
    <div class="bp-fill" style="width:50%;"></div>
  </div>
  <div class="bp-count"><em>3</em> / 6</div>
  <div class="bp-label">items geselecteerd</div>
</div>
```

---

### 5. Product Grid

**Purpose:** Display available products with add/remove controls
**Design:** 3-column grid of product cards

**Specifications:**

**Grid:**
- **Display:** Grid
- **Columns:** `repeat(3, 1fr)`
- **Gap:** 10px
- **Mobile:** 2 columns (below 900px)

**Product Card:**
- **Background:** White
- **Border:** 1.5px solid var(--grey)
- **Border radius:** 16px
- **Overflow:** Hidden
- **Transition:** all 0.15s

**Card States:**

1. **Default:**
   - Border: var(--grey)

2. **Hover:**
   - Border: var(--teal)
   - Transform: `translateY(-2px)`
   - Box shadow: var(--shadow-sm)

3. **In Box (selected):**
   - Border: var(--teal)
   - Box shadow: `0 0 0 2px var(--teal-glow)`
   - Shows checkmark icon

**Card Structure:**

```html
<div class="mm-product in-box">
  <div class="mmp-img" style="background:linear-gradient(135deg,#a8e6cf,#dcedc1);">
    🥗
    <div class="mmp-tag tag-popular">⭐ Populair</div>
    <div class="mmp-check"><i data-lucide="check"></i></div>
  </div>
  <div class="mmp-body">
    <div class="mmp-name">Caesar Salade Classic</div>
    <div class="mmp-meta">
      <span><i data-lucide="flame"></i> 320 kcal</span>
      <span><i data-lucide="clock"></i> Vers</span>
    </div>
    <div class="mmp-footer">
      <div class="mmp-price included">✓ In box</div>
      <div class="mmp-qty">
        <button class="mmp-qty-btn">−</button>
        <div class="mmp-qty-val">1</div>
        <button class="mmp-qty-btn">+</button>
      </div>
    </div>
  </div>
</div>
```

**Image Area:**
- **Height:** 130px
- **Display:** Flex, centered
- **Font size:** 48px (emoji)
- **Background:** Gradient (category-specific colors)
- **Position:** Relative (for badges and check)

**Tags/Badges:**

**Position:** Absolute, top 6px, left 6px

**Tag Types:**
```css
.tag-popular { background: var(--amber); color: white; }
.tag-new { background: var(--teal); color: white; }
.tag-vegan { background: var(--green); color: white; }
.tag-spicy { background: var(--coral); color: white; }
```

**Specifications:**
- Padding: 2px 8px
- Border radius: 4px
- Font: 10px, weight 700

**Checkmark (when selected):**
- **Position:** Absolute, top 6px, right 6px
- **Size:** 26×26px circle
- **Background:** var(--teal)
- **Icon:** 14×14px white check
- **Box shadow:** `0 2px 6px rgba(0,137,123,.3)`
- **Display:** None by default, flex when `.in-box`

**Body:**
- **Padding:** 10px 12px

**Name:**
- **Font size:** 13px
- **Weight:** 700
- **Margin bottom:** 2px
- **Overflow:** Hidden
- **Text overflow:** Ellipsis
- **White-space:** nowrap

**Meta Row:**
- **Font size:** 10px
- **Color:** var(--grey-mid)
- **Display:** Flex
- **Gap:** 6px
- **Margin bottom:** 6px

**Meta Item:**
```html
<span><i data-lucide="flame"></i> 320 kcal</span>
```

**Icons:** 10×10px

**Footer:**
- **Display:** Flex
- **Justify:** Space-between
- **Align:** Center

**Price:**

**When NOT in box:**
- Font: JetBrains Mono
- Size: 14px
- Weight: 700
- Format: "€ 4,95"

**When IN box:**
```css
.mmp-price.included {
  color: var(--green);
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 700;
}
```
- Text: "✓ In box"

**Quantity Control (when in box):**

**Container:**
- Border: 1.5px solid var(--grey)
- Border radius: 8px
- Overflow: hidden
- Display: Inline-flex

**Buttons:**
- Size: 28×28px
- Background: var(--grey-light)
- Font: 14px, weight 700
- Hover: background teal-glow, color teal

**Value Display:**
- Size: 28×28px
- Font: JetBrains Mono, 12px, weight 800
- Center-aligned

**Add Button (when not in box):**
```html
<button class="mmp-add">
  <i data-lucide="plus"></i> Toevoegen
</button>
```

**Specifications:**
- Height: 28px
- Padding: 0 12px
- Background: var(--teal)
- Color: white
- Border radius: 8px
- Font: 11px, weight 800
- Icon: 12×12px
- Hover: background navy
- When added: background green, text "Toegevoegd"

---

### 6. Box Sidebar (Sticky)

**Purpose:** Real-time display of selected items and pricing
**Design:** White card with dark header, sticky on desktop

**Specifications:**

**Container:**
- **Position:** Sticky
- **Top:** 96px (accounts for header + steps bar)
- **Mobile:** Static (not sticky)

**Card:**
- **Background:** White
- **Border:** 1.5px solid var(--grey)
- **Border radius:** 20px
- **Overflow:** Hidden
- **Box shadow:** var(--shadow-md)

---

#### 6a. Box Visual Header

**Purpose:** Visual representation of box slots
**Design:** Dark gradient with emoji slots

**Specifications:**

**Container:**
- **Background:** `linear-gradient(135deg, var(--navy), var(--navy-light))`
- **Padding:** 20px
- **Text align:** Center
- **Position:** Relative
- **Overflow:** Hidden

**Glow Effect:**
```css
.box-visual::before {
  content: '';
  position: absolute;
  top: -30px;
  right: -30px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(0,137,123,.12), transparent 70%);
  border-radius: 50%;
}
```

**Title:**
- Font: Plus Jakarta Sans
- Size: 18px
- Weight: 800
- Color: White
- Margin bottom: 4px
- Position: Relative, z-index: 2
- Content: "📦 Jouw Lunch Box"

**Slots Grid:**
```html
<div class="bv-slots">
  <div class="bv-slot filled">🥗</div>
  <div class="bv-slot filled">🌯</div>
  <div class="bv-slot filled">🍲</div>
  <div class="bv-slot empty-pulse"></div>
  <div class="bv-slot empty-pulse"></div>
  <div class="bv-slot empty-pulse"></div>
</div>
```

**Grid:**
- **Display:** Grid
- **Columns:** `repeat(6, 1fr)` (desktop), `repeat(3, 1fr)` (mobile)
- **Gap:** 4px
- **Margin top:** 10px
- **Position:** Relative, z-index: 2

**Slot:**
- **Aspect ratio:** 1:1 (square)
- **Border radius:** 8px
- **Display:** Flex, centered
- **Font size:** 16px (emoji)
- **Transition:** all 0.15s

**Slot States:**

1. **Empty:**
   - Background: `rgba(255,255,255,.05)`
   - Border: `1.5px dashed rgba(255,255,255,.1)`

2. **Empty with pulse:**
   - Animation: pulse 2s infinite
   ```css
   @keyframes pulse {
     0%, 100% { border-color: rgba(255,255,255,.08); }
     50% { border-color: rgba(0,137,123,.3); }
   }
   ```

3. **Filled:**
   - Background: `rgba(0,137,123,.15)`
   - Border: `1.5px solid rgba(0,137,123,.3)`
   - Shows product emoji

---

#### 6b. Box Items List

**Purpose:** Detailed list of selected items with remove option
**Design:** Scrollable list of items

**Specifications:**

**Container:**
- **Display:** Flex column
- **Gap:** 4px
- **Margin bottom:** 12px
- **Max height:** 260px
- **Overflow-y:** Auto

**Item Row:**
```html
<div class="bi">
  <div class="bi-icon">🥗</div>
  <div class="bi-info">
    <div class="bi-name">Caesar Salade Classic</div>
    <div class="bi-detail">320 kcal · Vers</div>
  </div>
  <div class="bi-qty">×1</div>
  <div class="bi-price">€4,95</div>
  <button class="bi-remove"><i data-lucide="x"></i></button>
</div>
```

**Row:**
- **Display:** Flex
- **Align:** Center
- **Gap:** 8px
- **Padding:** 6px 8px
- **Border radius:** 8px
- **Hover:** background var(--grey-light)

**Icon:**
- Font size: 18px (emoji)
- Flex-shrink: 0

**Info:**
- **Flex:** 1
- **Min width:** 0 (for text truncation)

**Name:**
- Font: 12px, weight 700
- Overflow: hidden
- Text overflow: ellipsis
- White-space: nowrap

**Detail:**
- Font: 10px
- Color: var(--grey-mid)

**Quantity Badge:**
- Font: JetBrains Mono
- Size: 11px, weight 700
- Background: var(--grey-light)
- Padding: 2px 6px
- Border radius: 4px
- Flex-shrink: 0

**Price:**
- Font: JetBrains Mono
- Size: 11px, weight 700
- Flex-shrink: 0

**Remove Button:**
- Size: 20×20px
- Border radius: 4px
- Background: transparent
- Border: none
- Cursor: pointer
- Icon: 12×12px, color coral
- Hover: background coral-light

**Empty State:**
```html
<div class="box-empty">
  <div class="box-empty-icon">📦</div>
  Nog geen items geselecteerd
</div>
```

**Specifications:**
- Text align: center
- Padding: 20px
- Font: 13px
- Color: var(--grey-mid)
- Icon: 36px, margin bottom 6px

---

#### 6c. Box Pricing

**Purpose:** Show pricing breakdown with bundle discount
**Design:** Grey box with itemized pricing

**Specifications:**

**Container:**
- **Padding:** 12px
- **Background:** var(--grey-light)
- **Border radius:** 12px
- **Margin bottom:** 12px

**Pricing Row:**
```html
<div class="bpr sub">
  <span>3 van 6 items geselecteerd</span>
  <span>€14,95</span>
</div>
```

**Row Types:**

1. **Sub (regular):**
   - Font: 12px
   - Color: var(--grey-dark)
   - Display: Flex, space-between
   - Padding: 3px 0

2. **Discount:**
   - Font: 12px
   - Color: var(--green)
   - Weight: 700
   - Format: "Box korting (bij 6 items)" | "-20%"

3. **Total:**
   - Font: Plus Jakarta Sans, 18px, weight 800
   - Padding top: 8px
   - Margin top: 6px
   - Border top: 2px solid var(--navy)
   - Format: "Box prijs" | "€ 24,95"

4. **Per Item:**
   - Font: 11px
   - Color: var(--grey-mid)
   - Format: "Per item gemiddeld" | "€ 4,16"

**Example Pricing:**
```
3 van 6 items geselecteerd    €14,95
Nog 3 items toevoegen             —
Box korting (bij 6 items)      -20%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Box prijs                     € 24,95
Per item gemiddeld            € 4,16
```

---

#### 6d. Add to Cart Button

**Purpose:** Primary CTA to add completed box to cart
**Design:** Full-width button with conditional state

**Specifications:**

**Button:**
- **Width:** 100%
- **Height:** 52px
- **Border:** None
- **Border radius:** var(--radius) (12px)
- **Font:** Plus Jakarta Sans, 16px, weight 800
- **Display:** Flex, centered
- **Gap:** 8px
- **Cursor:** Pointer
- **Transition:** all var(--transition)

**States:**

1. **Incomplete (disabled):**
```css
.box-cta.incomplete {
  background: var(--grey);
  color: var(--grey-mid);
  cursor: not-allowed;
}
```
- Icon: lock
- Text: "Nog 3 items kiezen"

2. **Ready (enabled):**
```css
.box-cta.ready {
  background: var(--teal);
  color: white;
  box-shadow: 0 4px 16px rgba(0,137,123,.3);
}

.box-cta.ready:hover {
  background: var(--navy);
  transform: translateY(-1px);
}
```
- Icon: shopping-cart
- Text: "In winkelmand — € 24,95"

**Note Below Button:**
- **Text align:** Center
- **Font:** 10px
- **Color:** var(--grey-mid)
- **Margin top:** 6px
- **Text:** "Selecteer 6 items om je box te bestellen"

---

#### 6e. Box Size Options

**Purpose:** Select different box sizes (Small, Medium, Large)
**Design:** Radio-style option cards

**Specifications:**

**Container:**
- **Margin top:** 12px
- **Padding top:** 12px
- **Border top:** 1px solid var(--grey)

**Title:**
- Font: 11px, weight 700
- Color: var(--grey-mid)
- Text transform: uppercase
- Letter spacing: 0.03em
- Margin bottom: 6px
- Text: "BOX FORMAAT"

**Option Card:**
```html
<div class="bo-option selected">
  <div class="bo-radio">
    <div class="bo-radio-dot"></div>
  </div>
  <div class="bo-info">
    Medium (6 items)
    <div class="bo-detail">Ideaal voor lunch + snack</div>
  </div>
  <div class="bo-price">€ 24,95</div>
</div>
```

**Card:**
- **Display:** Flex
- **Align:** Center
- **Gap:** 8px
- **Padding:** 8px
- **Border:** 1.5px solid var(--grey)
- **Border radius:** 8px
- **Margin bottom:** 4px
- **Cursor:** Pointer
- **Transition:** all 0.12s
- **Font:** 12px

**Card States:**

1. **Default:**
   - Border: var(--grey)
   - Hover: border teal

2. **Selected:**
   - Border: var(--teal)
   - Background: var(--teal-glow)

**Radio Circle:**
- **Size:** 16×16px
- **Border radius:** 50%
- **Border:** 2px solid var(--grey)
- **Display:** Flex, centered
- **Flex-shrink:** 0

**Radio Dot (when selected):**
- Size: 8×8px
- Border radius: 50%
- Background: var(--teal)
- Display: none (block when selected)

**Info:**
- **Flex:** 1
- **Font weight:** 700

**Detail:**
- Font weight: 400
- Color: var(--grey-mid)
- Font: 10px

**Price:**
- Font: JetBrains Mono
- Weight: 700
- Flex-shrink: 0

**Example Options:**
```
○ Small (4 items)           € 17,95
  Perfect voor 1 persoon

● Medium (6 items)          € 24,95
  Ideaal voor lunch + snack

○ Large (10 items)          € 37,95
  Delen met collega's
```

---

#### 6f. Trust Badges

**Purpose:** Show shipping, freshness, and sustainability info
**Design:** Horizontal row of icon + text badges

**Specifications:**

**Container:**
- **Display:** Flex
- **Gap:** 10px
- **Margin top:** 10px

**Badge:**
```html
<div class="bt">
  <i data-lucide="truck"></i> Gratis bezorging
</div>
```

**Specifications:**
- Display: Flex, center aligned
- Gap: 3px
- Font: 10px, weight 600
- Color: var(--grey-mid)
- Icon: 12×12px, color teal

**Common Badges:**
- 🚚 Gratis bezorging
- 🌱 100% vers
- ♻️ Duurzaam verpakt

---

## Product Grid Background Colors

**Category-specific gradients for visual variety:**

```css
/* Salads (Green tones) */
background: linear-gradient(135deg, #a8e6cf, #dcedc1);
background: linear-gradient(135deg, #c7ecee, #dff9fb);
background: linear-gradient(135deg, #badc58, #6ab04c);

/* Wraps (Warm tones) */
background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
background: linear-gradient(135deg, #ffeaa7, #f9ca24);

/* Soups (Orange/Red tones) */
background: linear-gradient(135deg, #fab1a0, #e17055);
background: linear-gradient(135deg, #fdcb6e, #e17055);
background: linear-gradient(135deg, #e17055, #d63031); /* Spicy */

/* Drinks (Blue/Purple tones) */
background: linear-gradient(135deg, #a29bfe, #6c5ce7);
background: linear-gradient(135deg, #55a3e8, #74b9ff);
background: linear-gradient(135deg, #dfe6e9, #b2bec3); /* Water */

/* Snacks (Yellow/Brown tones) */
background: linear-gradient(135deg, #f9ca24, #f0932b);
```

---

## Interaction Patterns

### Add Product to Box

```javascript
document.querySelectorAll('.mmp-add').forEach(button => {
  button.addEventListener('click', () => {
    const product = button.closest('.mm-product');

    // Update button state
    button.classList.add('added');
    button.innerHTML = '<i data-lucide="check"></i> Toegevoegd';

    // Mark product card as in-box
    product.classList.add('in-box');

    // Show checkmark
    // Add to sidebar items list
    // Update progress bar
    // Update pricing
    // Update visual slots

    lucide.createIcons();
  });
});
```

### Remove Product from Box

```javascript
document.querySelectorAll('.bi-remove').forEach(button => {
  button.addEventListener('click', () => {
    const itemId = button.dataset.itemId;

    // Remove from items list
    // Update progress bar
    // Update pricing
    // Update visual slots
    // Update product card state (remove in-box class)
    // Reset add button
  });
});
```

### Update Quantity

```javascript
document.querySelectorAll('.mmp-qty-btn').forEach(button => {
  button.addEventListener('click', () => {
    const qtyDisplay = button.parentElement.querySelector('.mmp-qty-val');
    let currentQty = parseInt(qtyDisplay.textContent);

    if (button.textContent === '−') {
      currentQty = Math.max(1, currentQty - 1);
    } else {
      currentQty = Math.min(10, currentQty + 1); // Max 10 per product
    }

    qtyDisplay.textContent = currentQty;

    // Update sidebar item quantity
    // Update pricing
    // Update visual slots (if quantity > 1, show multiple)
  });
});
```

### Change Box Size

```javascript
function selectBoxOption(el) {
  // Deselect all options
  document.querySelectorAll('.bo-option').forEach(opt => {
    opt.classList.remove('selected');
  });

  // Select clicked option
  el.classList.add('selected');

  // Update required items count
  // Update visual slots grid
  // Update pricing
  // Update progress bar max value
  // Update CTA button text
}
```

### Category Filter

```javascript
document.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Deselect all tabs
    document.querySelectorAll('.cat-tab').forEach(t => {
      t.classList.remove('active');
    });

    // Select clicked tab
    tab.classList.add('active');

    // Filter products grid
    const category = tab.dataset.category;
    filterProductsByCategory(category);
  });
});
```

---

## Dynamic Pricing Logic

### Calculate Bundle Discount

```javascript
function calculateTotalPrice(selectedItems, boxSize) {
  // Individual items total
  const subtotal = selectedItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Box size pricing
  const boxPricing = {
    small: { requiredItems: 4, price: 17.95 },
    medium: { requiredItems: 6, price: 24.95 },
    large: { requiredItems: 10, price: 37.95 },
  };

  const selectedBoxSize = boxPricing[boxSize];
  const currentItemCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate if complete
  if (currentItemCount >= selectedBoxSize.requiredItems) {
    // Box is complete, use fixed box price
    return {
      subtotal,
      boxPrice: selectedBoxSize.price,
      discount: subtotal - selectedBoxSize.price,
      discountPercentage: Math.round(((subtotal - selectedBoxSize.price) / subtotal) * 100),
      perItem: selectedBoxSize.price / selectedBoxSize.requiredItems,
      isComplete: true,
    };
  } else {
    // Box incomplete, show current subtotal
    return {
      subtotal,
      boxPrice: null,
      discount: 0,
      discountPercentage: 0,
      perItem: 0,
      isComplete: false,
      remainingItems: selectedBoxSize.requiredItems - currentItemCount,
    };
  }
}
```

---

## Responsive Breakpoints

### Desktop (> 900px)
- **Layout:** 2 columns (1fr 360px)
- **Product grid:** 3 columns
- **Box visual slots:** 6 columns
- **Sidebar:** Sticky at top 96px
- **Hero stats:** Visible

### Mobile (≤ 900px)
- **Layout:** 1 column (stacked)
- **Product grid:** 2 columns
- **Box visual slots:** 3 columns (2 rows)
- **Sidebar:** Static (not sticky)
- **Hero stats:** Hidden

---

## Payload CMS Integration

### Grouped Product Collection

**Required Fields:**

```typescript
{
  name: 'grouped-products',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Intro text shown in hero banner',
      },
    },
    {
      name: 'boxSizes',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'requiredItems',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'defaultBoxSize',
      type: 'select',
      required: true,
      admin: {
        description: 'Default selected box size',
      },
    },
    {
      name: 'availableProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: true,
      admin: {
        description: 'Products available for selection',
      },
    },
    {
      name: 'productCategories',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'emoji',
          type: 'text',
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Lucide icon name',
          },
        },
        {
          name: 'products',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
        },
      ],
    },
  ],
}
```

### Product Collection Extensions

**Additional fields for products used in Mix & Match:**

```typescript
{
  name: 'emojiIcon',
  type: 'text',
  admin: {
    description: 'Emoji displayed in product cards (e.g., 🥗, 🌯)',
  },
},
{
  name: 'gradientColors',
  type: 'group',
  fields: [
    { name: 'colorStart', type: 'text' },
    { name: 'colorEnd', type: 'text' },
  ],
  admin: {
    description: 'Background gradient for product card',
  },
},
{
  name: 'nutritionInfo',
  type: 'group',
  fields: [
    { name: 'calories', type: 'number' },
    { name: 'proteins', type: 'number' },
    { name: 'carbs', type: 'number' },
    { name: 'fats', type: 'number' },
  ],
},
{
  name: 'dietaryTags',
  type: 'select',
  hasMany: true,
  options: [
    { label: 'Vegetarisch', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Glutenvrij', value: 'gluten-free' },
    { label: 'Lactosevrij', value: 'lactose-free' },
    { label: 'Noten-vrij', value: 'nut-free' },
  ],
},
{
  name: 'badges',
  type: 'select',
  hasMany: true,
  options: [
    { label: 'Populair', value: 'popular' },
    { label: 'Nieuw', value: 'new' },
    { label: 'Pittig', value: 'spicy' },
    { label: 'Bio', value: 'organic' },
  ],
},
```

---

## SEO & Accessibility

### Semantic HTML

```html
<!-- Main section -->
<main>
  <!-- Hero -->
  <section aria-labelledby="hero-title">
    <h1 id="hero-title">Stel je eigen Lunch Box samen</h1>
  </section>

  <!-- Progress -->
  <nav aria-label="Box builder steps">
    <ol>
      <li aria-current="step">Box formaat</li>
      <li aria-current="page">Items kiezen</li>
      <li>Afrekenen</li>
    </ol>
  </nav>

  <!-- Product grid -->
  <section aria-labelledby="products-heading">
    <h2 id="products-heading" class="sr-only">Available Products</h2>
    <!-- Products... -->
  </section>

  <!-- Box sidebar -->
  <aside aria-labelledby="box-heading">
    <h2 id="box-heading" class="sr-only">Your Box</h2>
    <!-- Box contents... -->
  </aside>
</main>
```

### ARIA Attributes

```html
<!-- Category tabs -->
<div role="tablist" aria-label="Product categories">
  <button role="tab" aria-selected="true" aria-controls="products-panel">
    Alles
  </button>
</div>

<!-- Progress bar -->
<div role="progressbar" aria-valuenow="3" aria-valuemin="0" aria-valuemax="6" aria-label="Items selected">
  <div class="bp-fill" style="width: 50%;"></div>
</div>

<!-- Product card (add button) -->
<button aria-label="Add Caesar Salade to box" aria-pressed="false">
  Toevoegen
</button>

<!-- Box size options -->
<div role="radiogroup" aria-labelledby="box-size-label">
  <div role="radio" aria-checked="true">Medium (6 items)</div>
</div>

<!-- Add to cart button -->
<button
  aria-disabled="true"
  aria-label="Complete your box by selecting 3 more items"
>
  Nog 3 items kiezen
</button>
```

### Keyboard Navigation

**Tab Order:**
1. Header (logo, search, cart)
2. Steps bar
3. Category tabs
4. Product cards (add buttons)
5. Box sidebar
   - Remove buttons
   - Quantity controls
   - Box size options
   - Add to cart button

**Keyboard Controls:**
- **Tab/Shift+Tab:** Navigate through focusable elements
- **Enter/Space:** Activate buttons, select options
- **Arrow keys:** Navigate category tabs
- **Escape:** Close any open modals/dropdowns

---

## Performance Optimization

### Lazy Loading
- Lazy load product images below the fold
- Lazy load products as user scrolls (infinite scroll or pagination)
- Defer non-critical JavaScript

### State Management
```javascript
// Use React context or Zustand for box state
const useBoxStore = create((set) => ({
  selectedItems: [],
  boxSize: 'medium',
  addItem: (product, quantity) => set((state) => ({
    selectedItems: [...state.selectedItems, { product, quantity }],
  })),
  removeItem: (productId) => set((state) => ({
    selectedItems: state.selectedItems.filter(item => item.product.id !== productId),
  })),
  updateQuantity: (productId, quantity) => set((state) => ({
    selectedItems: state.selectedItems.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ),
  })),
  setBoxSize: (size) => set({ boxSize: size }),
}));
```

### Memoization
```javascript
// Memoize expensive calculations
const totalPrice = useMemo(() => {
  return calculateTotalPrice(selectedItems, boxSize);
}, [selectedItems, boxSize]);

const filteredProducts = useMemo(() => {
  return products.filter(p => p.category === selectedCategory);
}, [products, selectedCategory]);
```

---

## Testing Checklist

### Functionality
- [ ] Adding product updates sidebar, progress bar, and visual slots
- [ ] Removing product updates all displays
- [ ] Quantity controls work (min 1, max 10)
- [ ] Category filtering shows correct products
- [ ] Box size change updates required items and pricing
- [ ] Progress bar fills correctly (0-100%)
- [ ] Visual slots fill/empty correctly
- [ ] Bundle discount calculates correctly
- [ ] Add to cart button disabled until box complete
- [ ] Add to cart captures all selected items

### Responsive
- [ ] Layout stacks on mobile (sidebar below products)
- [ ] Product grid shows 2 columns on mobile
- [ ] Visual slots show 3 columns (2 rows) on mobile
- [ ] Hero stats hidden on mobile
- [ ] Touch targets ≥ 44×44px
- [ ] Sidebar not sticky on mobile

### Accessibility
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible and clear
- [ ] Screen reader announces progress updates
- [ ] ARIA attributes present and correct
- [ ] Progress bar has proper ARIA attributes
- [ ] Color contrast meets WCAG AA standards

### Performance
- [ ] Product images optimized (WebP + fallback)
- [ ] Lazy loading implemented
- [ ] No layout shift when products load
- [ ] Smooth animations (60fps)
- [ ] State updates don't cause full re-renders

---

## Related Files

- **Source:** `/docs/design/sprint-1/mix-and-match-product.html`
- **Component:** `/src/branches/ecommerce/components/MixAndMatchBuilder.tsx` (to be created)
- **Collection:** `/src/branches/ecommerce/collections/GroupedProducts.ts` (to be created)
- **Store:** `/src/branches/ecommerce/stores/boxStore.ts` (to be created)

---

**Last Updated:** February 25, 2026
**Version:** 1.0
**Status:** Production Ready
