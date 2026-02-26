# QuickAddToCart Component

A smart, expandable add-to-cart button with inline quantity controls for fast product ordering.

## Features

✨ **Smart Expansion** - Compact button expands to show quantity controls
🎯 **Quantity Controls** - +/- buttons and direct number input
✅ **Success Feedback** - Visual confirmation when item is added
📱 **Mobile Optimized** - Touch-friendly controls
♿ **Accessible** - Full keyboard navigation and ARIA labels
🎨 **Smooth Animations** - Polished transitions and micro-interactions
📊 **Stock Validation** - Respects min/max quantity limits

## Usage

### Basic Usage

```tsx
import { QuickAddToCart } from '@/branches/ecommerce/components/products/QuickAddToCart'

function ProductGrid() {
  const handleAddToCart = (productId: string, quantity: number) => {
    // Add to cart logic
    console.log(`Adding ${quantity}x product ${productId}`)
  }

  return (
    <QuickAddToCart
      productId="prod_123"
      productName="Nitril Handschoenen"
      stock={250}
      stockStatus="in-stock"
      onAddToCart={handleAddToCart}
    />
  )
}
```

### Compact Mode (Icon Only)

```tsx
<QuickAddToCart
  productId="prod_123"
  productName="Nitril Handschoenen"
  stock={250}
  stockStatus="in-stock"
  onAddToCart={handleAddToCart}
  compact={true} // Icon only, no text
/>
```

### With Min/Max Quantity

```tsx
<QuickAddToCart
  productId="prod_123"
  productName="Nitril Handschoenen"
  stock={250}
  stockStatus="in-stock"
  minQty={10} // Minimum order: 10 units
  maxQty={100} // Maximum order: 100 units
  onAddToCart={handleAddToCart}
/>
```

### Stock Validation

```tsx
// Low stock
<QuickAddToCart
  productId="prod_123"
  productName="Nitril Handschoenen"
  stock={5}
  stockStatus="low" // Yellow indicator
  onAddToCart={handleAddToCart}
/>

// Out of stock
<QuickAddToCart
  productId="prod_123"
  productName="Nitril Handschoenen"
  stock={0}
  stockStatus="out" // Disabled button
  onAddToCart={handleAddToCart}
/>
```

## Integration with ShopArchiveTemplate1

The component is designed to work seamlessly with product cards:

```tsx
<div className="product-grid-item">
  <ProductCard {...productProps} />

  {/* Quick Add overlayed on hover (desktop) */}
  <div className="product-quick-add">
    <QuickAddToCart
      productId={product.id}
      productName={product.title}
      stock={product.stock}
      stockStatus={stockStatus}
      onAddToCart={handleAddToCart}
      compact={viewMode === 'grid'}
    />
  </div>
</div>
```

## Component States

### 1. Collapsed (Default)

- Shows compact "Snelbestellen" button
- Icon + text (or icon only in compact mode)
- Teal background with hover effects

### 2. Expanded

- Shows quantity controls (+/- buttons + input)
- Shows add-to-cart action button
- Smooth slide-in animation

### 3. Adding

- Disabled during API call
- Shows loading spinner
- Prevents duplicate submissions

### 4. Success

- Green background with checkmark
- "Toegevoegd!" text
- Auto-resets after 2 seconds

### 5. Disabled (Out of Stock)

- Grey/disabled appearance
- Not clickable
- Clear visual feedback

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `productId` | `string` | ✅ Yes | - | Unique product identifier |
| `productName` | `string` | ✅ Yes | - | Product name for ARIA labels |
| `stock` | `number` | ✅ Yes | - | Available stock quantity |
| `stockStatus` | `'in-stock' \| 'low' \| 'out'` | ✅ Yes | - | Current stock status |
| `onAddToCart` | `(productId: string, quantity: number) => void \| Promise<void>` | ✅ Yes | - | Callback when adding to cart |
| `minQty` | `number` | ❌ No | `1` | Minimum order quantity |
| `maxQty` | `number` | ❌ No | `stock` | Maximum order quantity |
| `compact` | `boolean` | ❌ No | `false` | Icon-only mode (no text) |
| `className` | `string` | ❌ No | `''` | Additional CSS classes |

## Styling

### CSS Variables Used

```css
--teal           /* Primary button background */
--teal-dark      /* Hover state */
--teal-glow      /* Focus ring and success background */
--white          /* Button text and control backgrounds */
--navy           /* Input text color */
--grey           /* Borders */
--grey-mid       /* Disabled state */
--bg             /* Input background */
--green          /* Success state */
```

### Customization Example

```tsx
<QuickAddToCart
  {...props}
  className="my-custom-quick-add"
/>

<style jsx>{`
  .my-custom-quick-add :global(.quick-add__button) {
    background: var(--custom-color);
    border-radius: 20px;
  }
`}</style>
```

## Accessibility

✅ **Keyboard Navigation**
- Tab: Focus button
- Enter/Space: Expand/collapse or add to cart
- Arrow keys: Adjust quantity (when focused on input)

✅ **Screen Readers**
- Descriptive ARIA labels for all controls
- Live region for quantity changes
- Clear disabled state announcements

✅ **Focus Management**
- Visible focus rings
- Logical tab order
- Focus trapped in expanded state

## Animation Details

- **Expand**: 200ms cubic-bezier ease
- **Button hover**: 300ms ease
- **Success state**: 2000ms duration
- **Spinner**: 600ms linear infinite rotation

## Performance

- Lightweight: ~3KB gzipped
- No external dependencies
- CSS-in-JS with scoped styles
- Optimized re-renders with React hooks

## Best Practices

### ✅ Do

- Use compact mode in grid views to save space
- Provide meaningful product names for accessibility
- Handle async add-to-cart operations gracefully
- Show clear stock status indicators

### ❌ Don't

- Don't render without stock information
- Don't use without onAddToCart handler
- Don't override disabled state on out-of-stock items
- Don't forget to validate quantity server-side

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ iOS Safari 14+
- ✅ Chrome Android 90+

## Related Components

- **ProductCard** - Main product display component
- **ShopArchiveTemplate1** - Shop page template using QuickAdd
- **MiniCartFlyout** - Cart preview after adding items
- **AddToCartToast** - Success toast notification

## Examples

### E-commerce Product Grid

```tsx
{products.map((product) => (
  <div key={product.id} className="product-card">
    <ProductImage {...product} />
    <ProductDetails {...product} />

    {/* Quick Add on hover */}
    <QuickAddToCart
      productId={product.id}
      productName={product.title}
      stock={product.stock}
      stockStatus={product.stockStatus}
      onAddToCart={addToCart}
      compact={true}
    />
  </div>
))}
```

### B2B Bulk Ordering

```tsx
<QuickAddToCart
  productId={product.id}
  productName={product.title}
  stock={10000}
  stockStatus="in-stock"
  minQty={50} // B2B minimum
  maxQty={500} // Order limit
  onAddToCart={async (id, qty) => {
    await addToCart(id, qty)
    await requestQuote(id, qty) // Auto-quote for bulk
  }}
/>
```

### Product List (Always Expanded)

```tsx
<div className="product-list-item">
  <ProductInfo {...product} />

  {/* Always show controls in list view */}
  <QuickAddToCart
    productId={product.id}
    productName={product.title}
    stock={product.stock}
    stockStatus={product.stockStatus}
    onAddToCart={addToCart}
    compact={false} // Full button with text
  />
</div>
```

## Changelog

### v1.0.0 (2026-02-26)
- ✨ Initial release
- 🎯 Smart expand/collapse functionality
- 📱 Mobile-optimized controls
- ♿ Full accessibility support
- 🎨 Smooth animations and transitions
