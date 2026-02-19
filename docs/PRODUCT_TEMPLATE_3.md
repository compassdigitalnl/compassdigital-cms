# Product Template 3 - Luxury Design

**Created:** February 19, 2026
**Status:** ✅ Complete - Production Ready
**File:** `src/app/(app)/shop/[slug]/ProductTemplate3.tsx`

---

## 📋 Overview

Product Template 3 is a **premium, luxury** e-commerce template designed for high-end brands that want an elegant, sophisticated product presentation with a focus on storytelling and premium aesthetics.

**Design Philosophy:**
- ✅ **Luxury & Premium** - Elegant, sophisticated design
- ✅ **Story-Driven** - Focus on product narrative
- ✅ **Large Imagery** - Prominent, beautiful visuals
- ✅ **Refined** - Polished, high-end feel
- ✅ **Elevated UX** - Smooth interactions, premium touches

---

## 🎨 Key Differences from Template 1 & 2

### Template 1 (Enterprise)
- Complex B2B features
- Size grid selector
- Volume pricing grid
- 4 tabs
- **Target:** B2B, Medical, Wholesale

### Template 2 (Minimal)
- Clean, modern B2C
- Dropdown selector
- Simple pricing list
- 2 tabs
- **Target:** Retail, Modern Brands

### Template 3 (Luxury) ✨
- **60/40 asymmetric layout** (large image left, sticky info right)
- **Premium radio buttons** (elegant variant selector with checkmarks)
- **Luxury price display** (large, prominent with gradient background)
- **3 tabs** (Product Story, Details, Specs)
- **Premium badges** (gold accents, quality indicators)
- **Large hero image** (4:5 aspect ratio)
- **Sticky sidebar** (product info follows scroll)
- **Target:** Luxury brands, Premium products, High-end retail

---

## 🏗️ Template Structure

### Layout

```
┌────────────────────────────────────────────────┐
│ [Large Hero Image - 60%]  │ [Sticky Info - 40%]│
│                            │                    │
│  - Premium badge (gold)    │  - Brand           │
│  - Quality badge           │  - Large title     │
│  - 4:5 aspect ratio        │  - Short desc      │
│  - Full coverage           │  - 5-star rating   │
│  - Thumbnails (4x)         │  - Premium price   │
│                            │  - Radio variants  │
│                            │  - Elegant qty     │
│                            │  - Premium CTA     │
│                            │  - 3 Features      │
└────────────────────────────────────────────────┘
│ Tabs: Story | Details | Specs                  │
└────────────────────────────────────────────────┘
│ Related Products (4 columns)                   │
└────────────────────────────────────────────────┘
```

---

## ✨ Premium Features

### 1. Large Hero Image (60% width)

**Luxury-focused:**
```tsx
- Aspect ratio: 4:5 (tall, editorial)
- Full image coverage (object-fit: cover)
- Gradient background
- Premium gold badge with Sparkles icon
- Quality badge (top-right)
- Large box shadow (0 20px 60px)
- Rounded corners (24px)
```

### 2. Premium Variant Selector (Radio Buttons)

**Instead of dropdown or grid:**
```tsx
<div> // 2-column grid
  {childProducts.map((child) => (
    <div // Elegant card with border
      - 2px border (primary when selected)
      - Checkmark icon when selected
      - Hover effects (border change, background tint)
      - Size, price, stock info
    />
  ))}
</div>
```

**Benefits:**
- ✅ Visually premium
- ✅ Clear selection state
- ✅ Easy to scan
- ✅ Touch-friendly
- ✅ Accessible

### 3. Luxury Price Display

**Large, prominent pricing:**
```tsx
<div style={{
  background: 'linear-gradient(135deg, primary 3%, primary 8%)',
  border: '2px solid primary 15%',
  borderRadius: '20px',
  padding: '32px',
}}>
  <div>
    <span style={{ fontSize: '48px', fontWeight: 800 }}>
      €{price}
    </span>
    {oldPrice && <span style={{ fontSize: '24px', strikethrough }}>
      €{oldPrice}
    </span>}
  </div>
  <div style={{ color: 'green' }}>
    You save €{savings} ({percent}%)
  </div>
  <div style={{ color: 'muted' }}>
    Excl. BTW · Gratis verzending boven €50
  </div>
</div>
```

### 4. Sticky Sidebar

**Product info follows scroll:**
```tsx
<div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
  {/* All product info */}
</div>
```

### 5. Premium Add to Cart Button

**Elevated CTA:**
```tsx
<button style={{
  background: 'linear-gradient(135deg, primary, primary 85%)',
  boxShadow: '0 12px 32px rgba(primary, 0.3)',
  fontSize: '17px',
  fontWeight: 700,
  letterSpacing: '0.5px',
  padding: '20px 40px',
  borderRadius: '16px',
  hover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 16px 40px rgba(primary, 0.4)',
  }
}}>
  <ShoppingCart /> Add to Cart · €{total}
</button>
```

### 6. Premium Features Grid

**3 elegant feature cards:**
```tsx
1. Free Shipping - Truck icon + "On orders over €50"
2. Secure Payment - Shield icon + "SSL encrypted checkout"
3. Fast Delivery - Clock icon + "2-3 business days"

Each with:
- Icon in colored circle
- Title + subtitle
- Clean spacing
- Rounded container
```

### 7. Three Tabs (Story-Driven)

**Focus on narrative:**
1. **Product Story** - Rich description, storytelling
2. **Details** - SKU, EAN, brand, condition, warranty
3. **Specs** - Technical specifications in elegant tables

**No Reviews or Downloads** (keeps focus on premium presentation)

---

## 🎨 Design System

### Colors

```css
--color-primary       /* Buttons, accents, borders */
--color-text-primary  /* Headings, price */
--color-text-secondary /* Body text, descriptions */
--color-text-muted    /* Meta info, labels */
--color-surface       /* Cards, containers */
--color-border        /* Borders */
Gold accent: #F59E0B  /* Premium badges, quality indicators */
Green: #059669        /* Savings, success states */
```

### Typography

```css
Headings: var(--font-heading)
- Product Title: 42px/700/1.2
- Section Title: 32px/700
- Subsection: 20px/700

Body: var(--font-body)
- Description: 17px/1.9
- Standard: 15px/1.7
- Small: 13px/1.4

Price: 48px/800 (extra bold!)
```

### Spacing

```css
Layout gap: 80px (extra spacious)
Section gap: 48px
Element gap: 32px
Compact gap: 16px
Tight gap: 12px
```

### Borders & Shadows

```css
Border radius: 24px (hero), 20px (price), 16px (cards), 12px (badges)
Border width: 2px (premium feel)
Box shadow: 0 20px 60px rgba(0,0,0,0.08) (deep, soft)
```

---

## 📱 Responsive Design

### Desktop (> 1024px)
```
Grid: 60% 40% (asymmetric, luxury layout)
Image: 4:5 aspect, full coverage
Sidebar: Sticky, follows scroll
```

### Tablet (768px - 1024px)
```
Grid: 1fr (stacked)
Image: 4:5 aspect, full width
Sidebar: Static, below image
```

### Mobile (< 768px)
```
Grid: 1fr (stacked)
Image: 1:1 aspect (square on mobile)
Sidebar: Static, below image
All elements full width
```

---

## 💡 When to Use Template 3

### ✅ Use Template 3 When:

- **Luxury Brand** - High-end, premium positioning
- **Premium Products** - €500+ price point
- **Story-Driven** - Brand narrative important
- **Visual Focus** - Beautiful product photography
- **Aspirational** - Lifestyle, prestige products
- **High Margins** - Can afford premium presentation
- **Brand Experience** - Customer journey matters

### Examples:
1. **High-End Fashion** - Designer clothing, accessories
2. **Luxury Watches** - Premium timepieces
3. **Premium Cosmetics** - Prestige beauty brands
4. **Designer Furniture** - High-end home decor
5. **Artisan Crafts** - Handmade luxury items
6. **Premium Electronics** - High-end audio, cameras
7. **Jewelry** - Fine jewelry, diamonds

### ❌ Use Template 1 or 2 Instead When:

- **B2B Wholesale** → Use Template 1
- **Budget Products** → Use Template 2
- **Quick Ordering** → Use Template 1
- **Bulk Purchases** → Use Template 1
- **Minimal Aesthetic** → Use Template 2

---

## 🎯 Unique Selling Points

**What makes Template 3 special:**

1. **60/40 Asymmetric Layout** - Not standard 50/50
2. **4:5 Hero Image** - Editorial, tall format
3. **Sticky Sidebar** - Info follows as you scroll
4. **Premium Radio Buttons** - Elegant variant selection
5. **Luxury Price Display** - Large, gradient background
6. **Gold Accents** - Premium badge styling
7. **Story Tab** - Focus on narrative
8. **Deep Shadows** - Elevated, layered feel
9. **Smooth Animations** - Polished interactions
10. **Quality Badges** - Premium positioning

---

## 📊 Performance vs Other Templates

| Metric | Template 1 | Template 2 | Template 3 |
|--------|-----------|-----------|-----------|
| Component Size | 1500 lines | 800 lines | 1100 lines |
| Layout Complexity | High | Low | Medium |
| DOM Elements | ~80 | ~45 | ~60 |
| Premium Feel | ★★☆☆☆ | ★★★☆☆ | ★★★★★ |
| Visual Impact | ★★★☆☆ | ★★★☆☆ | ★★★★★ |
| Best For | B2B | B2C | Luxury |

---

## 🛠️ Customization Examples

### Add Video Section

```tsx
{/* After hero image */}
{product.videos && product.videos.length > 0 && (
  <div style={{ marginTop: '24px' }}>
    <video
      src={product.videos[0].url}
      controls
      style={{
        width: '100%',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
      }}
    />
  </div>
)}
```

### Change Aspect Ratio to Square

```tsx
// In hero image div:
aspectRatio: '1' // instead of '4/5'
```

### Add Wishlist Button

```tsx
<button style={{
  width: '100%',
  padding: '16px',
  border: '2px solid var(--color-border)',
  borderRadius: '16px',
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  fontWeight: 600,
  cursor: 'pointer',
}}>
  <Heart className="w-5 h-5" />
  Add to Wishlist
</button>
```

---

## ✅ Testing Checklist

### Visual Tests

- [ ] Hero image displays at 4:5 aspect ratio
- [ ] Premium gold badge visible (if discount)
- [ ] Quality badge in top-right
- [ ] Thumbnails display (4 max)
- [ ] Radio button variants styled correctly
- [ ] Checkmark shows when selected
- [ ] Price display with gradient background
- [ ] Sidebar is sticky on desktop
- [ ] Premium CTA button has gradient + shadow
- [ ] 3 feature cards styled correctly
- [ ] Tabs switch smoothly

### Functional Tests

- [ ] Variant radio buttons select correctly
- [ ] Selected variant shows checkmark
- [ ] Price updates when variant changes
- [ ] Image updates when variant changes
- [ ] Stock info updates correctly
- [ ] Quantity stepper works
- [ ] Add to cart adds correct product
- [ ] Sticky sidebar stays in viewport
- [ ] Hover animations smooth
- [ ] Tab content switches correctly

### Responsive Tests

- [ ] Desktop (>1024px): 60/40 layout
- [ ] Tablet (768-1024px): Stacked, full width
- [ ] Mobile (<768px): Stacked, square image
- [ ] All text readable on all sizes
- [ ] Buttons accessible on touch devices
- [ ] No horizontal scroll

---

## 🚀 Deployment

**Enable Template 3:**

1. Go to: `/admin/globals/settings`
2. Tab: **E-commerce**
3. Field: **Standaard Product Template**
4. Select: **Template 3 - Luxury**
5. Save

**All products will now use the Luxury template!**

---

## 🎓 Training Guide

### For Content Managers

**"When should I use Template 3?"**

✅ **Use for:**
- Premium products (€500+)
- Luxury brands
- Products with beautiful photography
- Story-driven products
- Aspirational items

❌ **Don't use for:**
- Budget products
- B2B bulk ordering
- Quick reorder items
- Simple utility products

**Result:**
- Elegant, premium product page
- Large hero images
- Luxury feel
- Story-focused presentation
- High-end customer experience

---

## 🔮 Future Enhancements

### Planned Features

- [ ] Image zoom on hover
- [ ] Video autoplay in hero
- [ ] Image carousel/slideshow
- [ ] 360° product viewer
- [ ] AR preview (try on)
- [ ] Size guide modal
- [ ] Gift wrapping option
- [ ] Personalization options
- [ ] Concierge service CTA

---

## 📖 Related Documentation

1. **This Guide:** `docs/PRODUCT_TEMPLATE_3.md`
2. **Template 1 Guide:** `docs/PRODUCT_TEMPLATE_1.md`
3. **Template 2 Guide:** `docs/PRODUCT_TEMPLATE_2.md`
4. **Deployment:** `SERVER_DEPLOYMENT.md`
5. **Code:** `src/app/(app)/shop/[slug]/ProductTemplate3.tsx`

---

## 🎉 Summary

**Template 3 is:**
- ✨ Luxury & Premium
- 📸 Visually Stunning
- 📖 Story-Driven
- 🎨 Elegantly Designed
- 💎 High-End Focused

**Perfect for:**
- Luxury brands
- Premium products
- High-margin items
- Aspirational shopping
- Brand experience

**vs Template 1 & 2:**
- More premium than both
- Larger imagery than both
- Story-focused approach
- Sticky sidebar unique
- Gold accents unique
- 60/40 layout unique

**Choose Template 3 when prestige matters!**

---

**Built with ✨ for Luxury E-commerce**
