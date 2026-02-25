# Variable Products Design Specification

**Product Type:** Variable Product (Configurable)
**Example:** Custom Sneaker Pro X
**Source:** `variabel-product.html` (Sprint 1)
**Created:** February 2026

---

## Overview

Variable products allow customers to configure products with multiple options (variants) like size, color, material, add-ons, and personalization. Each variant affects the final price and product configuration.

**Key Features:**
- 6 variant types supported
- Real-time price calculation
- Configuration summary
- Dynamic image gallery based on selections
- Sticky sidebar with product info
- Desktop: 2-column layout (gallery + config)
- Mobile: Single column, scrollable

---

## Layout Structure

### Desktop Layout (1200px container)

```
┌─────────────────────────────────────────────────────────────┐
│ Header (Sticky)                                             │
│ - Logo | Search | Cart (sticky at top: 72px height)        │
├─────────────────────────────────────────────────────────────┤
│ Breadcrumb Bar                                              │
│ - Home > Category > Product                                 │
├──────────────────────────┬──────────────────────────────────┤
│ GALLERY (Sticky)         │ PRODUCT INFO                     │
│                          │                                  │
│ Main Image (1:1)         │ Category badge                   │
│ - Badge: "Nieuw"         │ Product Title (H1)              │
│ - Badge: "6 opties"      │ Rating (stars + count)          │
│                          │ Short description                │
│ Thumbnail row (5 imgs)   │                                  │
│ [👟][🎨][📐][📦][🏷️]      │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                          │ PRICE DISPLAY                    │
│                          │ € 159,95 | €189,95 | -16%        │
│                          │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                          │                                  │
│ (Gallery sticks at       │ VARIANTS (6 types below)         │
│  top: 100px)             │                                  │
│                          │ 1. Color swatches               │
│                          │ 2. Size radio buttons            │
│                          │ 3. Dropdown select               │
│                          │ 4. Image radio                   │
│                          │ 5. Checkbox add-ons              │
│                          │ 6. Custom text input             │
│                          │                                  │
│                          │ CONFIG SUMMARY                   │
│                          │ - All selections listed          │
│                          │ - Dynamic total price            │
│                          │                                  │
│                          │ QUANTITY + ADD TO CART           │
│                          │ [−][1][+] [In winkelmand - €]   │
│                          │                                  │
│                          │ Trust badges (truck, shield, etc)│
└──────────────────────────┴──────────────────────────────────┘
│ TABS (Full width)                                           │
│ - Beschrijving | Specificaties | Reviews | FAQ             │
└─────────────────────────────────────────────────────────────┘
```

**Grid:** `grid-template-columns: 1fr 1fr` (50/50 split)
**Gap:** 36px
**Mobile:** Stacks to single column, gallery becomes static

---

## Component Specifications

### 1. Variant Type: Color Swatches (Radio Visual)

**Use case:** Visual color selection
**Design:** Circular swatches with hover tooltips

**Specifications:**
- **Swatch size:** 44×44px
- **Border radius:** 12px
- **Border:** 2.5px solid transparent (selected: navy)
- **Hover:** `transform: scale(1.08)`
- **Selected state:**
  - Border: navy
  - Box shadow: `0 0 0 3px var(--teal-glow)`
  - White checkmark circle visible

**HTML Structure:**
```html
<div class="color-swatches">
  <div class="swatch selected" style="background:#1a1a2e;">
    <div class="swatch-check">
      <i data-lucide="check"></i>
    </div>
    <span class="swatch-tooltip">Midnight Black</span>
  </div>
  <!-- More swatches... -->
</div>
```

**Features:**
- Tooltip appears on hover/selected
- Supports solid colors + gradients
- Premium options can show "+€10" in tooltip
- Checkmark only visible when selected

**CSS Classes:**
- `.color-swatches` - Flex container (gap: 6px, wrap)
- `.swatch` - Individual swatch
- `.swatch.selected` - Active state
- `.swatch-check` - Checkmark (hidden by default)
- `.swatch-tooltip` - Hover tooltip (opacity 0 → 1)

---

### 2. Variant Type: Size Radio Buttons

**Use case:** Size selection with stock indicators
**Design:** Button-style radios with colored stock dots

**Specifications:**
- **Button size:** 52×44px (width × height)
- **Border:** 2px solid var(--grey)
- **Border radius:** 10px
- **Font:** 14px, weight 700
- **Selected state:**
  - Background: var(--teal)
  - Color: white
  - Border: var(--teal)
  - Box shadow: `0 0 0 3px var(--teal-glow)`
- **Out of stock:** opacity 0.35, line-through, cursor not-allowed

**Stock Indicator Dots:**
- **Position:** Absolute, top-right (-3px, -3px)
- **Size:** 8×8px circle
- **Border:** 1.5px solid white
- **Colors:**
  - Green: In stock (high)
  - Amber: Low stock
  - Red: Last items

**HTML Structure:**
```html
<div class="size-radios">
  <div class="size-radio selected">
    43
    <span class="stock-dot stock-green"></span>
  </div>
  <div class="size-radio">
    41
    <span class="stock-dot stock-amber"></span>
  </div>
  <div class="size-radio oos">46</div> <!-- Out of stock -->
</div>
```

**Interaction:**
- Hover: border changes to teal
- Click: becomes selected, previous deselected
- Link to "Maattabel" (size chart) next to header

---

### 3. Variant Type: Dropdown Select

**Use case:** Options with descriptions and pricing
**Design:** Custom dropdown with icons, descriptions, and price modifiers

**Specifications:**

**Trigger:**
- **Height:** 48px
- **Padding:** 0 42px 0 14px
- **Border:** 2px solid var(--grey)
- **Border radius:** var(--radius) (12px)
- **Focus state:** Border teal, box shadow `0 0 0 3px var(--teal-glow)`

**Dropdown Menu:**
- **Position:** Absolute, top + 4px
- **Border:** 1.5px solid var(--grey)
- **Box shadow:** var(--shadow-lg)
- **Max height:** 240px (scrollable)
- **Item height:** Auto (padding: 10px 14px)

**Dropdown Item Structure:**
```html
<div class="dd-item selected">
  <div class="dd-item-icon" style="background:var(--teal-glow);">🏃</div>
  <div class="dd-item-info">
    <div class="dd-item-name">ComfortFlex</div>
    <div class="dd-item-desc">Dagelijks gebruik · EVA schuim</div>
  </div>
  <div class="dd-item-price" style="color:var(--green);">Incl.</div>
  <div class="dd-item-check"><i data-lucide="check"></i></div>
</div>
```

**Features:**
- Icon (28×28px, emoji or lucide icon)
- Main label (bold)
- Description text (10px, grey)
- Price modifier ("Incl.", "+ €15", "+ €20")
- Check icon when selected (teal circle, 18×18px)
- Hover: background teal-glow
- Selected: background teal-glow, text teal

**States:**
- Closed: Shows selected option with icon
- Open: Menu slides down, shows all options
- Click outside: Closes menu

---

### 4. Variant Type: Image Radio Selection

**Use case:** Visual option selection (e.g., lacing type, finish)
**Design:** Image cards in grid layout

**Specifications:**

**Grid:**
- **Desktop:** 4 columns
- **Mobile:** 2 columns
- **Gap:** 6px

**Card:**
- **Border:** 2px solid var(--grey)
- **Border radius:** 12px
- **Hover:** Border teal
- **Selected:** Border teal, box shadow `0 0 0 3px var(--teal-glow)`

**Card Structure:**
```html
<div class="img-radio selected">
  <div class="ir-img" style="background:var(--grey-light);">🎀</div>
  <div class="ir-name">Klassiek</div>
  <div class="ir-price">Incl.</div>
</div>
```

**Elements:**
- **Image area:** 1:1 aspect ratio, centered emoji/icon (28px)
- **Name label:** 11px, bold, centered
- **Price label:** 10px, teal, centered ("+€5", "Incl.")

**Use Cases:**
- Lacing types (classic, speed lace, magnetic, slip-on)
- Finishes (matte, glossy, textured)
- Patterns or designs

---

### 5. Variant Type: Checkbox Add-ons

**Use case:** Optional extras that can be added independently
**Design:** List of cards with checkbox, icon, description, and price

**Specifications:**

**Card:**
- **Display:** Flex, align center
- **Padding:** 10px 14px
- **Border:** 1.5px solid var(--grey)
- **Border radius:** 10px
- **Gap:** 10px between elements
- **Hover:** Border teal
- **Selected:** Border teal, background teal-glow

**Checkbox:**
- **Size:** 20×20px
- **Border radius:** 5px
- **Border:** 2px solid var(--grey)
- **Selected:** Background teal, border teal, white checkmark visible

**Structure:**
```html
<div class="addon selected">
  <div class="addon-check"><i data-lucide="check"></i></div>
  <div class="addon-icon">🧴</div>
  <div class="addon-info">
    <div class="addon-name">Beschermende coating</div>
    <div class="addon-desc">Water- en vuilafstotende nano-coating</div>
  </div>
  <div class="addon-price">+ €12,50</div>
</div>
```

**Elements:**
- **Checkbox:** 20×20px, checkmark icon (12×12px)
- **Icon:** 20px emoji
- **Name:** 13px, bold
- **Description:** 10px, grey
- **Price:** 13px, JetBrains Mono, teal

**Interaction:**
- Click anywhere on card to toggle
- Multiple selections allowed
- Each affects total price

**Examples:**
- Protective coating (+ €12,50)
- Premium packaging (+ €9,95)
- Extra laces set (+ €7,50)
- Express production (+ €19,95)

---

### 6. Variant Type: Custom Text/Number Input

**Use case:** Personalization fields (names, text, numbers)
**Design:** Floating label inputs with character counter

**Specifications:**

**Input Field:**
- **Height:** 46px
- **Padding:** 0 14px (+ right padding for counter)
- **Border:** 2px solid var(--grey)
- **Border radius:** var(--radius) (12px)
- **Font:** 14px, weight 600
- **Focus:** Border teal, box shadow `0 0 0 3px var(--teal-glow)`

**Floating Label:**
- **Position:** Absolute, top -8px, left 10px
- **Background:** White (with padding 0 4px)
- **Font size:** 10px
- **Font weight:** 700
- **Color:** var(--grey-mid)

**Character Counter:**
- **Position:** Absolute, right 12px, centered vertically
- **Font size:** 10px
- **Color:** var(--grey-mid)
- **Format:** "0/12" (current/max)

**Hint Text:**
- **Font size:** 10px
- **Color:** var(--grey-mid)
- **Margin top:** 3px
- **Example:** "Max. 12 karakters · Gratis"

**HTML Structure:**
```html
<div class="custom-field">
  <div class="cf-label">Tekst linker schoen</div>
  <input class="cf-input" type="text" placeholder="bijv. uw naam" maxlength="12">
  <div class="cf-counter"><span>0</span>/12</div>
  <div class="cf-hint">Max. 12 karakters · Gratis</div>
</div>
```

**Grid Layout:**
- **Desktop:** 2 columns (1fr 1fr)
- **Mobile:** 1 column
- **Gap:** 8px

**Use Cases:**
- Personalized text (names, initials)
- Jersey numbers
- Custom messages
- Date/year engraving

---

## Additional Components

### Configuration Summary

**Purpose:** Shows all selected options and calculated total price
**Design:** Grey box with itemized list and total

**Specifications:**
- **Background:** var(--grey-light)
- **Border radius:** 14px
- **Padding:** 14px
- **Font size:** 12px
- **Margin top:** 14px

**Structure:**
```html
<div class="config-summary">
  <div class="cs-title">
    <i data-lucide="clipboard-list"></i> Jouw configuratie
  </div>
  <div class="cs-row"><span class="cs-label">Basisprijs</span><span class="cs-val">€ 159,95</span></div>
  <div class="cs-row"><span class="cs-label">Kleur: Midnight Black</span><span class="cs-val">Incl.</span></div>
  <!-- More rows... -->
  <div class="cs-total"><span>Totaal</span><span>€ 172,45</span></div>
</div>
```

**Row Types:**
- **Normal row:** Label (grey) + Value (bold)
- **Total row:** Plus Jakarta Sans, 16px, weight 800, top border (2px navy)

**Features:**
- Updates in real-time as options change
- Shows included vs. additional costs
- Clear visual separation for total

---

### Purchase Row

**Purpose:** Quantity selector + Add to cart button + Wishlist
**Design:** Horizontal flex layout

**Specifications:**

**Container:**
- **Display:** Flex
- **Gap:** 8px
- **Margin top:** 20px
- **Padding top:** 18px
- **Border top:** 1px solid var(--grey)

**Quantity Selector:**
- **Height:** 52px
- **Border:** 2px solid var(--grey)
- **Border radius:** var(--radius)
- **Buttons:** 42px wide, grey-light background
- **Input:** 48px wide, center-aligned, JetBrains Mono
- **Hover:** Buttons turn teal-glow

**Add to Cart Button:**
- **Flex:** 1 (takes remaining space)
- **Height:** 52px
- **Background:** var(--teal)
- **Color:** White
- **Font:** Plus Jakarta Sans, 16px, weight 800
- **Border radius:** var(--radius)
- **Box shadow:** `0 4px 16px rgba(0,137,123,.3)`
- **Hover:** Background navy, `translateY(-1px)`
- **Icon:** Shopping cart (18×18px)

**Wishlist Button:**
- **Size:** 52×52px
- **Border:** 2px solid var(--grey)
- **Background:** White
- **Icon:** Heart (20×20px)
- **Hover:** Border coral, color coral

**HTML:**
```html
<div class="purchase-row">
  <div class="qty-wrap">
    <button class="qty-btn">−</button>
    <input class="qty-val" type="text" value="1" readonly>
    <button class="qty-btn">+</button>
  </div>
  <button class="add-btn">
    <i data-lucide="shopping-cart"></i> In winkelmand — € 172,45
  </button>
  <button class="wish-btn">
    <i data-lucide="heart"></i>
  </button>
</div>
```

---

### Trust Badges Row

**Purpose:** Show shipping, return, and production time info
**Design:** Horizontal flex row with icons

**Specifications:**
- **Display:** Flex
- **Gap:** 12px
- **Margin top:** 14px
- **Font size:** 11px
- **Font weight:** 600
- **Color:** var(--grey-mid)

**Badge:**
```html
<div class="trust">
  <i data-lucide="truck"></i> Gratis verzending
</div>
```

**Icons:**
- **Size:** 14×14px
- **Color:** var(--teal)

**Common Badges:**
- Truck icon: "Gratis verzending"
- Shield icon: "30 dagen retour"
- Clock icon: "Op maat gemaakt in 14 dagen"

---

### Product Tabs

**Purpose:** Additional product information below the fold
**Design:** Tabbed content area

**Tab Navigation:**
- **Border bottom:** 2px solid var(--grey)
- **Tab button:** Padding 10px 20px, 14px bold font
- **Active tab:** Color teal, border-bottom teal (2px)
- **Hover:** Color navy

**Tab Content:**
- **Padding:** 20px 0
- **Font size:** 14px
- **Line height:** 1.7
- **Color:** var(--grey-dark)

**Common Tabs:**
1. Beschrijving (Description)
2. Specificaties (Specifications)
3. Reviews (with count)
4. FAQ

---

## Variant Section Header Pattern

**Consistent across all variant types:**

```html
<div class="variant-section">
  <div class="var-header">
    <div class="var-label">
      <i data-lucide="palette"></i> Kleur
    </div>
    <div>
      <span class="var-type-badge">Swatches</span>
      <span class="var-selected">Midnight Black</span>
    </div>
  </div>
  <!-- Variant options here -->
</div>
```

**Elements:**
- **Icon:** Lucide icon (15×15px, teal)
- **Label:** 14px, bold
- **Type badge:** 10px, uppercase, grey-light background, rounded
- **Selected value:** 12px, teal, teal-glow background, rounded

**Type Badge Values:**
- "Swatches" (color swatches)
- "Radio" (size buttons)
- "Dropdown" (select menu)
- "Afbeelding" (image radio)
- "Checkbox" (add-ons)
- "Tekstveld" (text input)

---

## Gallery Component

### Main Image

**Specifications:**
- **Aspect ratio:** 1:1 (square)
- **Border radius:** 20px
- **Border:** 1px solid var(--grey)
- **Background:** Linear gradient (placeholder)
- **Display:** Flex, centered content
- **Font size:** 140px (emoji placeholder)
- **Margin bottom:** 10px

**Badges:**

1. **Top-left badge (e.g., "Nieuw"):**
   - Position: Absolute, top 14px, left 14px
   - Padding: 5px 12px
   - Border radius: 8px
   - Font: 12px, weight 800
   - Background: var(--teal) (for "new")
   - Color: White
   - Icon: 13×13px

2. **Top-right badge (e.g., "6 opties configureerbaar"):**
   - Position: Absolute, top 14px, right 14px
   - Background: `rgba(10,22,40,.7)`
   - Backdrop filter: `blur(8px)`
   - Color: White
   - Padding: 4px 10px
   - Border radius: 100px
   - Font: 11px, weight 700

### Thumbnail Row

**Specifications:**
- **Grid:** 5 columns, equal width
- **Gap:** 6px
- **Thumbnail:**
  - Aspect ratio: 1:1
  - Border radius: 10px
  - Border: 2px solid transparent
  - Background: var(--grey-light)
  - Font size: 28px (emoji)
  - Cursor: pointer

**States:**
- **Hover:** Border teal
- **Active:** Border teal, box shadow `0 0 0 3px var(--teal-glow)`

### Sticky Behavior

**Desktop:**
- **Position:** Sticky
- **Top:** 100px (to account for 72px header + padding)
- **Stays visible** as user scrolls down product info

**Mobile:**
- **Position:** Static (not sticky)
- Gallery scrolls normally

---

## Price Display

**Location:** Below product description, above variants

**Specifications:**

**Container:**
- **Display:** Flex, baseline aligned
- **Gap:** 10px
- **Margin bottom:** 18px
- **Padding bottom:** 18px
- **Border bottom:** 1px solid var(--grey)

**Current Price:**
- **Font:** Plus Jakarta Sans
- **Size:** 32px
- **Weight:** 800
- **Color:** var(--navy)
- **ID:** `totalPrice` (for JavaScript updates)

**Original Price (strikethrough):**
- **Size:** 16px
- **Color:** var(--grey-mid)
- **Text decoration:** line-through

**Save Badge:**
- **Padding:** 4px 10px
- **Border radius:** 6px
- **Font:** 12px, weight 800
- **Background:** var(--coral-light)
- **Color:** var(--coral)
- **Content:** "-16%" (percentage saved)

**Price Note:**
- **Font size:** 11px
- **Color:** var(--grey-mid)
- **Margin top:** 4px
- **Content:** "Incl. BTW · Gratis verzending vanaf €100"

**Dynamic Pricing:**
The total price updates in real-time based on:
1. Selected color (some premium colors add cost)
2. Selected sole type (dropdown options add €10-€20)
3. Selected lacing type (image radios add €5-€12)
4. Selected add-ons (checkboxes add to total)
5. Custom text input (usually free or small fee)

---

## Responsive Breakpoints

### Desktop (> 900px)
- **Product layout:** 2 columns (1fr 1fr)
- **Gallery:** Sticky at top 100px
- **Image radios:** 4 columns
- **Custom inputs:** 2 columns

### Mobile (≤ 900px)
- **Product layout:** 1 column (stacked)
- **Gallery:** Static (not sticky)
- **Image radios:** 2 columns
- **Custom inputs:** 1 column (full width)

---

## Interaction Patterns

### Color Swatch Selection
```javascript
function selectSwatch(el, name) {
  // Remove selected from all swatches
  document.querySelectorAll('.swatch').forEach(e => e.classList.remove('selected'));

  // Add selected to clicked swatch
  el.classList.add('selected');

  // Update selected text in header
  document.getElementById('colorSelected').textContent = name;

  // Reinitialize lucide icons
  lucide.createIcons();
}
```

### Size Selection
```javascript
function selectSize(el, size) {
  // Check if out of stock
  if (el.classList.contains('oos')) return;

  // Deselect all
  document.querySelectorAll('.size-radio').forEach(e => e.classList.remove('selected'));

  // Select clicked
  el.classList.add('selected');

  // Update header
  document.getElementById('sizeSelected').textContent = size;
}
```

### Dropdown Toggle
```javascript
function toggleDropdown() {
  const menu = document.getElementById('ddMenu');
  const trigger = document.getElementById('ddTrigger');

  menu.classList.toggle('show');
  trigger.classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('.var-dropdown')) {
    document.getElementById('ddMenu').classList.remove('show');
    document.getElementById('ddTrigger').classList.remove('open');
  }
});
```

### Add-on Toggle
```javascript
// Click anywhere on addon card to toggle
document.querySelectorAll('.addon').forEach(addon => {
  addon.addEventListener('click', () => {
    addon.classList.toggle('selected');
    updateTotal(); // Recalculate price
  });
});
```

### Character Counter
```javascript
document.querySelectorAll('.cf-input').forEach(input => {
  input.addEventListener('input', () => {
    const counter = input.parentElement.querySelector('.cf-counter span');
    counter.textContent = input.value.length;
  });
});
```

---

## Design Tokens

**Color Variables:**
```css
--navy: #0A1628;
--navy-light: #121F33;
--teal: #00897B;
--teal-light: #26A69A;
--teal-glow: rgba(0,137,123,0.12);
--grey: #E8ECF1;
--grey-light: #F1F4F8;
--grey-mid: #94A3B8;
--grey-dark: #64748B;
--green: #00C853;
--coral: #FF6B6B;
--amber: #F59E0B;
--blue: #2196F3;
--purple: #7C3AED;
--bg: #F5F7FA;
```

**Typography:**
```css
--font-body: 'DM Sans', sans-serif;
--font-display: 'Plus Jakarta Sans', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

**Spacing:**
```css
--radius: 12px;
--radius-sm: 8px;
--container: 1240px;
--gutter: 24px;
```

**Shadows:**
```css
--shadow-sm: 0 1px 3px rgba(10,22,40,0.06);
--shadow-md: 0 8px 24px rgba(10,22,40,0.08);
```

**Animation:**
```css
--transition: 0.2s cubic-bezier(0.4,0,0.2,1);
```

---

## Payload CMS Integration

### Variable Product Collection

**Required Fields:**

```typescript
{
  name: 'products',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'productType',
      type: 'select',
      options: [
        { label: 'Simple', value: 'simple' },
        { label: 'Variable', value: 'variable' },
        { label: 'Grouped', value: 'grouped' },
      ],
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
    },
    {
      name: 'comparePrice',
      type: 'number',
      admin: {
        description: 'Original price (for strikethrough)',
      },
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        {
          name: 'variantType',
          type: 'select',
          options: [
            { label: 'Color Swatches', value: 'color-swatches' },
            { label: 'Size Radio', value: 'size-radio' },
            { label: 'Dropdown Select', value: 'dropdown' },
            { label: 'Image Radio', value: 'image-radio' },
            { label: 'Checkbox Add-ons', value: 'checkbox-addons' },
            { label: 'Custom Text Input', value: 'text-input' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Lucide icon name (e.g., "palette", "ruler")',
          },
        },
        {
          name: 'options',
          type: 'array',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'value', type: 'text' },
            { name: 'priceModifier', type: 'number' },
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'color', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text', required: true },
      ],
    },
  ],
}
```

### Frontend Component Structure

**React/Next.js Example:**

```tsx
// components/VariableProduct.tsx
import { useState, useEffect } from 'react'

interface Variant {
  variantType: string
  label: string
  icon: string
  options: VariantOption[]
}

interface VariantOption {
  label: string
  value: string
  priceModifier: number
  image?: string
  color?: string
}

export default function VariableProduct({ product }) {
  const [selectedOptions, setSelectedOptions] = useState({})
  const [totalPrice, setTotalPrice] = useState(product.basePrice)

  // Calculate total price whenever options change
  useEffect(() => {
    let price = product.basePrice

    product.variants.forEach(variant => {
      const selected = selectedOptions[variant.label]
      if (selected) {
        const option = variant.options.find(opt => opt.value === selected)
        if (option?.priceModifier) {
          price += option.priceModifier
        }
      }
    })

    setTotalPrice(price)
  }, [selectedOptions, product])

  const handleOptionChange = (variantLabel, optionValue) => {
    setSelectedOptions(prev => ({
      ...prev,
      [variantLabel]: optionValue,
    }))
  }

  return (
    <div className="product-layout">
      <Gallery images={product.gallery} />

      <div className="product-info">
        <ProductHeader product={product} />
        <PriceDisplay
          currentPrice={totalPrice}
          comparePrice={product.comparePrice}
        />

        {product.variants.map(variant => (
          <VariantSection
            key={variant.label}
            variant={variant}
            selectedValue={selectedOptions[variant.label]}
            onChange={(value) => handleOptionChange(variant.label, value)}
          />
        ))}

        <ConfigSummary
          basePrice={product.basePrice}
          selectedOptions={selectedOptions}
          variants={product.variants}
          totalPrice={totalPrice}
        />

        <PurchaseRow totalPrice={totalPrice} />
      </div>
    </div>
  )
}
```

---

## SEO & Accessibility

### Semantic HTML
- Use `<h1>` for product title
- Use `<button>` for all interactive elements
- Use `role="radiogroup"` for size/color selections
- Use `role="checkbox"` for add-ons
- Use proper `<label>` elements for inputs

### ARIA Attributes
```html
<!-- Size selection -->
<div role="radiogroup" aria-labelledby="size-label">
  <div id="size-label" class="var-label">Maat (EU)</div>
  <button role="radio" aria-checked="true" class="size-radio selected">43</button>
  <button role="radio" aria-checked="false" class="size-radio">44</button>
</div>

<!-- Dropdown -->
<button
  aria-haspopup="listbox"
  aria-expanded="false"
  aria-labelledby="sole-label"
  class="dropdown-trigger"
>
  ComfortFlex
</button>

<!-- Add-on checkbox -->
<div role="checkbox" aria-checked="true" class="addon selected" tabindex="0">
  Beschermende coating
</div>
```

### Keyboard Navigation
- All interactive elements must be focusable
- Tab order follows logical flow
- Enter/Space to select options
- Escape to close dropdown
- Arrow keys to navigate dropdown items

### Focus Indicators
```css
.swatch:focus,
.size-radio:focus,
.dropdown-trigger:focus,
.addon:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--teal-glow);
}
```

---

## Performance Considerations

### Image Optimization
- Use Next.js `<Image>` component for gallery
- Lazy load thumbnail images
- Provide proper `width` and `height` attributes
- Use WebP format with JPEG fallback
- Implement blur-up placeholder

### JavaScript
- Debounce price calculations
- Use event delegation for option clicks
- Minimize re-renders with React.memo
- Lazy load tabs content

### CSS
- Use CSS Grid for layouts (better than flexbox for complex layouts)
- Minimize box-shadow usage (performance impact)
- Use `transform` for animations (GPU-accelerated)
- Avoid layout thrashing in JavaScript

---

## Testing Checklist

### Functionality
- [ ] All variant types render correctly
- [ ] Price updates in real-time
- [ ] Configuration summary shows all selections
- [ ] Out-of-stock sizes are disabled
- [ ] Dropdown closes when clicking outside
- [ ] Character counter updates in text inputs
- [ ] Add to cart captures all selected options
- [ ] Gallery thumbnails change main image

### Responsive
- [ ] Layout stacks correctly on mobile
- [ ] Gallery is not sticky on mobile
- [ ] Image radio grid shows 2 columns on mobile
- [ ] Custom input fields stack on mobile
- [ ] Touch targets are at least 44×44px
- [ ] Buttons are full width on mobile

### Accessibility
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Screen reader announces selections
- [ ] ARIA labels present and correct
- [ ] Color contrast ratio meets WCAG AA (4.5:1)
- [ ] Images have alt text

### Performance
- [ ] Page load time < 2s (3G)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Images properly optimized
- [ ] No layout shift (CLS < 0.1)

---

## Related Files

- **Source:** `/docs/design/sprint-1/variabel-product.html`
- **Component:** `/src/branches/ecommerce/components/VariableProduct.tsx` (to be created)
- **Collection:** `/src/branches/ecommerce/collections/Products.ts`
- **Styles:** Use design tokens from `/src/app/(app)/(marketing)/globals.css`

---

**Last Updated:** February 25, 2026
**Version:** 1.0
**Status:** Production Ready
