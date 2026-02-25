# Variant Multi-Select Components (VP08-VP13)

**Status:** ✅ VP08 Complete | ⏳ VP09-VP13 In Progress
**Source:** `/Users/markkokkelkoren/Projects/payload-design/designs/variant-multi-select-compact.html`
**Protocol Version:** 1.5

---

## 📦 COMPONENT OVERVIEW

These 6 components enable multi-variant selection for variable products (e.g., selecting multiple sizes/colors of the same product simultaneously).

### ✅ VP08: VariantCardCompact
**File:** `vp08-variant-card-compact.html` (1,020 lines)
**Status:** COMPLETE
**Purpose:** Compact grid card with checkbox, variant name, price, stock indicator, quantity stepper
**Key Features:**
- 18×18px checkbox (top-left)
- Variant name (18px, 800 weight)
- Price display (16px mono)
- Stock indicator (3 states: in-stock/low-stock/pre-order)
- Standard quantity stepper (40×44px buttons, 60px input)
- Hover: teal border + shadow + translateY(-2px)
- Selected: teal border + light teal bg

---

### ⏳ VP09: VariantRowCompact
**File:** `vp09-variant-row-compact.html` (planned)
**Status:** TODO
**Purpose:** Horizontal list row variant (alternative to grid view)
**Layout:** 5-column grid: `24px 80px 1fr auto auto 110px`
- Column 1: Checkbox (24×24px)
- Column 2: Variant image thumbnail (80×80px, optional)
- Column 3: Variant info (name, description, stock, price)
- Column 4: Quantity stepper (inline, compact)
- Column 5: Total price (aligned right)

**Key Differences from VP08:**
- Horizontal layout (not vertical stacking)
- Larger checkbox (24px vs 18px)
- Image thumbnail added
- Price shown twice (unit price + total)
- More compact padding (8px vs 12px)

---

### ⏳ VP10: VariantSelectionSidebar
**File:** `vp10-variant-selection-sidebar.html` (planned)
**Status:** TODO
**Purpose:** Sticky sidebar showing selected variants summary with totals
**Width:** 340px (desktop), full-width (mobile)
**Position:** `position: sticky; top: 24px;`

**Content Structure:**
1. **Header:**
   - Icon (shopping-cart, 20px teal)
   - "Geselecteerd (X items)" title
   - "Wis alles" link (grey, hover teal)

2. **Selected Items List:**
   - Scrollable container (max-height: 400px)
   - Per item row:
     - Variant name (14px, 700)
     - Quantity × Unit price
     - Remove button (X icon, 14px)

3. **Price Summary:**
   - Subtotal
   - Discount (if applicable, green)
   - **Total** (20px, 800 weight)

4. **CTA Button:**
   - "X items toevoegen" (teal bg, full-width)

---

### ⏳ VP11: VariantToolbar
**File:** `vp11-variant-toolbar.html` (planned)
**Status:** TODO
**Purpose:** Toolbar with view toggle (grid/list) + bulk actions

**Layout:** Flex row, space-between
- Left: "X varianten beschikbaar" (15px, 700)
- Right: View toggle + bulk actions

**Components:**
1. **View Toggle:**
   - 2-button group (grid icon / list icon)
   - Active: teal bg + white icon
   - Inactive: white bg + grey icon
   - Border radius: 6px, 3px padding

2. **Bulk Actions:**
   - "Selecteer alle" button (outline)
   - "Deselecteer alle" button (outline)
   - Only show when applicable

---

### ⏳ VP12: VariantGridContainer
**File:** Part of VP11 toolbar + grid layout
**Status:** TODO (CSS only, not full component)
**Purpose:** Responsive 6-column grid wrapper

```css
.variant-grid-compact {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

@media (min-width: 1024px) {
  .variant-grid-compact {
    grid-template-columns: repeat(6, 1fr);
  }
}
```

---

### ⏳ VP13: VariantListContainer
**File:** Part of VP09 list rows
**Status:** TODO (CSS only, not full component)
**Purpose:** Table-style list container

```css
.variant-list-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

---

## 🔄 USAGE FLOW

```
1. Product page loads
2. VP11 Toolbar shows view toggle (grid/list) + bulk actions
3. Customer chooses view:
   - Grid view: VP12 container + VP08 cards
   - List view: VP13 container + VP09 rows
4. Customer selects variants (checkbox or qty change)
5. VP10 Sidebar updates with selected items + total
6. Customer clicks "X items toevoegen"
7. All variants added to cart
8. C3 AddToCartToast appears (success)
```

---

## 🎯 NEXT STEPS

1. ✅ Complete VP08 (DONE)
2. Extract VP09 (list row)
3. Extract VP10 (sidebar)
4. Extract VP11 (toolbar)
5. Document VP12/VP13 (CSS patterns only)
6. Update PRODUCT_TYPES_PROTOCOL.md
