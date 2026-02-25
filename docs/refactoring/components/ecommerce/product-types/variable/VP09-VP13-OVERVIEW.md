# Variable Product Multi-Select Components (VP09-VP13)

**Status:** 🚧 Quick Reference Guide
**Completion:** VP09-VP11 need full extraction | VP12-VP13 are CSS patterns only

---

## VP09: VariantRowCompact

**Purpose:** Horizontal list row alternative to VP08 grid card
**File:** `vp09-variant-row-compact.html` (to be created)
**Size:** ~900 lines estimated

**Layout:** 6-column grid
```css
grid-template-columns: 24px 80px 1fr auto auto 110px;
/*                     ↑    ↑    ↑    ↑    ↑    ↑
                       |    |    |    |    |    Reserved
                       |    |    |    |    Qty stepper
                       |    |    |    Price
                       |    |    Info (name, desc, stock)
                       |    Image (optional, often hidden)
                       Checkbox (24×24px)
*/
```

**Key Differences from VP08:**
- Horizontal layout (not vertical stack)
- Larger checkbox (24×24px vs 18×18px)
- Optional image thumbnail column (80×80px)
- Info section combines name + description + stock
- Price shown twice: unit price in info, total price at end
- More compact vertical padding (10px vs 12px)

**Content Structure:**
1. **Column 1:** Checkbox (24×24px, static position)
2. **Column 2:** Image thumbnail (optional, can be hidden with CSS)
3. **Column 3:** Variant info
   - Name (16px, 800 weight, navy)
   - Full name (13px, grey-dark)
   - Stock badge (inline, 10px)
   - Unit price (14px mono, navy, right-aligned)
4. **Column 4:** Quantity stepper (inline variant)
5. **Column 5:** Total price (calculated: qty × unit price)
6. **Column 6:** Reserved (110px, for future actions like favorite/compare)

**Mobile Responsive:**
```css
@media (max-width: 768px) {
  .variant-row-compact {
    grid-template-columns: 24px 1fr;
    /* All other elements wrap to column 2 */
  }
}
```

**States:**
- Default: White bg, grey border
- Hover: Teal border, subtle shadow
- Selected: Teal border + light teal bg (rgba(0,137,123,0.02))

**Implementation Priority:** HIGH (core component for list view)

---

## VP10: VariantSelectionSidebar

**Purpose:** Sticky sidebar showing selected variants + price summary
**File:** `vp10-variant-selection-sidebar.html` (to be created)
**Size:** ~800 lines estimated

**Dimensions:**
- Width: 340px (desktop), full-width (mobile)
- Position: `position: sticky; top: 24px;`
- Max-height: calc(100vh - 48px) with scrollable content

**Structure:**
```html
<aside class="variant-sidebar">
  <!-- Header -->
  <div class="sidebar-header">
    <i data-lucide="shopping-cart"></i>
    <h3>Geselecteerd (3 items)</h3>
    <button class="clear-all">Wis alles</button>
  </div>

  <!-- Selected Items List (scrollable) -->
  <div class="sidebar-items">
    <div class="sidebar-item">
      <div class="item-info">
        <span class="item-name">60x90</span>
        <span class="item-qty">2× €24,95</span>
      </div>
      <button class="item-remove">×</button>
    </div>
    <!-- ...more items -->
  </div>

  <!-- Price Summary -->
  <div class="sidebar-summary">
    <div class="summary-row">
      <span>Subtotaal</span>
      <span>€149,85</span>
    </div>
    <div class="summary-row discount">
      <span>Staffelkorting (−15%)</span>
      <span class="green">−€22,48</span>
    </div>
    <div class="summary-total">
      <span>Totaal</span>
      <span>€127,37</span>
    </div>
  </div>

  <!-- CTA Button -->
  <button class="add-to-cart-btn">
    <i data-lucide="shopping-cart"></i>
    3 items toevoegen
  </button>

  <!-- Trust Signals (optional) -->
  <div class="trust-signals">
    <div class="trust-item">
      <i data-lucide="truck"></i>
      <span>Gratis verzending vanaf €60</span>
    </div>
  </div>
</aside>
```

**Key Features:**
- Live updates when variants selected/deselected
- Scrollable items list (max-height: 400px)
- Remove buttons per item (X icon)
- "Wis alles" clears all selections
- Automatic staffel discount calculation
- Total updates in real-time
- Sticky positioning keeps it visible
- Empty state when no items selected

**Implementation Priority:** HIGH (essential for multi-select UX)

---

## VP11: VariantToolbar

**Purpose:** Toolbar with grid/list view toggle + bulk actions
**File:** `vp11-variant-toolbar.html` (to be created)
**Size:** ~600 lines estimated

**Layout:**
```html
<div class="variant-toolbar">
  <!-- Left: Count -->
  <div class="toolbar-count">
    <span class="count-number">24</span> varianten beschikbaar
  </div>

  <!-- Right: Actions -->
  <div class="toolbar-actions">
    <!-- View Toggle -->
    <div class="view-toggle">
      <button class="view-btn active" data-view="grid">
        <i data-lucide="grid"></i>
        Grid
      </button>
      <button class="view-btn" data-view="list">
        <i data-lucide="list"></i>
        Lijst
      </button>
    </div>

    <!-- Bulk Actions -->
    <button class="bulk-btn" id="selectAll">
      <i data-lucide="check-square"></i>
      Selecteer alle
    </button>
    <button class="bulk-btn" id="deselectAll">
      <i data-lucide="square"></i>
      Deselecteer alle
    </button>
  </div>
</div>
```

**Styling:**
- Flex row, space-between, align center
- Height: 44px
- Border-bottom: 1.5px solid grey
- Padding: 12px 0

**View Toggle:**
- 2-button group in pill shape
- Active: teal bg + white icon
- Inactive: white bg + grey icon
- Border-radius: 6px container, 4px buttons
- 3px padding around buttons

**Bulk Actions:**
- Only show when applicable:
  - "Selecteer alle" when <100% selected
  - "Deselecteer alle" when >0% selected
- Outline buttons (grey border, hover teal)
- Icon + text layout

**JavaScript Interaction:**
```javascript
// Toggle view
viewBtn.addEventListener('click', () => {
  if (view === 'grid') {
    gridContainer.classList.remove('hidden');
    listContainer.classList.add('hidden');
  } else {
    gridContainer.classList.add('hidden');
    listContainer.classList.remove('hidden');
  }
});

// Bulk select
selectAllBtn.addEventListener('click', () => {
  document.querySelectorAll('.variant-card, .variant-row').forEach(card => {
    card.classList.add('selected');
    card.querySelector('.qty-input').value = 1;
  });
});
```

**Implementation Priority:** MEDIUM (nice-to-have UX enhancement)

---

## VP12: VariantGridContainer

**Type:** CSS Pattern (not full component)
**Purpose:** 6-column responsive grid wrapper

**CSS Implementation:**
```css
.variant-grid-compact {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

/* Force 6 columns on desktop */
@media (min-width: 1024px) {
  .variant-grid-compact {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* 4 columns on tablet */
@media (max-width: 1023px) and (min-width: 768px) {
  .variant-grid-compact {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 3 columns on small tablet */
@media (max-width: 767px) and (min-width: 640px) {
  .variant-grid-compact {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 2 columns on mobile */
@media (max-width: 639px) {
  .variant-grid-compact {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

**Usage:**
```html
<div class="variant-grid-compact">
  <vp08-card />
  <vp08-card />
  <vp08-card />
  <!-- ...up to 24+ cards -->
</div>
```

**Implementation:** Document in README.md, not separate file

---

## VP13: VariantListContainer

**Type:** CSS Pattern (not full component)
**Purpose:** Vertical stack for list rows

**CSS Implementation:**
```css
.variant-list-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Optional: Striped rows */
.variant-list-compact .variant-row-compact:nth-child(even) {
  background: var(--grey-light);
}
```

**Usage:**
```html
<div class="variant-list-compact">
  <vp09-row />
  <vp09-row />
  <vp09-row />
  <!-- ...up to 24+ rows -->
</div>
```

**Implementation:** Document in README.md, not separate file

---

## Summary

**Full Components to Extract:**
- ✅ VP08: VariantCardCompact (DONE - 1,020 lines)
- ⏳ VP09: VariantRowCompact (900 lines est.)
- ⏳ VP10: VariantSelectionSidebar (800 lines est.)
- ⏳ VP11: VariantToolbar (600 lines est.)

**CSS Patterns (README only):**
- ⏳ VP12: VariantGridContainer (CSS + usage example)
- ⏳ VP13: VariantListContainer (CSS + usage example)

**Total Lines:** ~3,320 lines for VP09-VP11 full components

**Next Steps:**
1. Create VP09-variant-row-compact.html (full 8-step protocol)
2. Create VP10-variant-selection-sidebar.html (full 8-step protocol)
3. Create VP11-variant-toolbar.html (full 8-step protocol)
4. Document VP12/VP13 in variable/README.md
5. Update PRODUCT_TYPES_PROTOCOL.md with completion

