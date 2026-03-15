# ToastSystem Component

Non-intrusive notification system with 4 semantic variants: success, error, warning, and info.

## Overview

The ToastSystem provides temporary notifications that appear in the top-right corner of the screen. Toasts automatically dismiss after a configurable duration (default 5 seconds) and can be manually closed by users.

## Features

- ✅ **4 semantic variants**: success (green), info (blue), warning (amber), error (coral)
- ✅ **Auto-dismiss**: Configurable timeout with animated progress bar
- ✅ **Manual close**: X button for immediate dismissal
- ✅ **Stack management**: Multiple toasts stack vertically with 8px gap
- ✅ **Slide-in animation**: Smooth entrance from right side
- ✅ **Action links**: Optional CTA buttons within toasts
- ✅ **Responsive**: Adapts width on mobile (<640px)
- ✅ **Accessible**: ARIA labels, screen reader support, keyboard navigation
- ✅ **Theme variables**: Uses CMS-driven design tokens (no hardcoded colors!)

## Installation

The ToastSystem is already exported from the shared UI components:

```tsx
import { ToastSystemProvider, useToast } from '@/branches/shared/components/ui'
```

## Basic Usage

### 1. Wrap your app with ToastSystemProvider

```tsx
// app/layout.tsx or _app.tsx
import { ToastSystemProvider } from '@/branches/shared/components/ui'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastSystemProvider maxToasts={3}>
          {children}
        </ToastSystemProvider>
      </body>
    </html>
  )
}
```

### 2. Use the `useToast` hook in your components

```tsx
'use client'

import { useToast } from '@/branches/shared/components/ui'

export function MyComponent() {
  const { showToast } = useToast()

  const handleSuccess = () => {
    showToast({
      type: 'success',
      title: 'Product toegevoegd',
      message: 'Peha-soft Nitrile Fino (5×) is toegevoegd aan uw winkelwagen.',
      action: {
        label: 'Bekijk winkelwagen',
        onClick: () => router.push('/cart')
      }
    })
  }

  return <button onClick={handleSuccess}>Add to Cart</button>
}
```

## Convenience Hooks

For simpler usage, use the type-specific hooks:

```tsx
import {
  useSuccessToast,
  useErrorToast,
  useWarningToast,
  useInfoToast
} from '@/branches/shared/components/ui'

export function MyComponent() {
  const showSuccess = useSuccessToast()
  const showError = useErrorToast()
  const showWarning = useWarningToast()
  const showInfo = useInfoToast()

  return (
    <>
      <button onClick={() => showSuccess('Saved!', 'Your changes have been saved.')}>
        Save
      </button>

      <button onClick={() => showError('Failed', 'Could not save changes. Try again.')}>
        Fail
      </button>

      <button onClick={() => showWarning('Low stock', 'Only 3 items remaining.')}>
        Warn
      </button>

      <button onClick={() => showInfo('New feature', 'Check out our new dashboard!')}>
        Info
      </button>
    </>
  )
}
```

## API Reference

### ToastSystemProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | App content |
| `maxToasts` | `number` | `3` | Maximum number of visible toasts |

### useToast() Hook

Returns an object with:

```tsx
{
  showToast: (config: ToastConfig) => void
  removeToast: (id: string) => void
  toasts: Toast[]
}
```

### ToastConfig Interface

```tsx
interface ToastConfig {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number  // in milliseconds, default 5000
}
```

## Examples

### Success Toast (Add to Cart)

```tsx
showToast({
  type: 'success',
  title: 'Product toegevoegd',
  message: 'Welch Allyn DuraShock DS45 (2×) is toegevoegd aan uw winkelwagen.',
  action: {
    label: 'Bekijk winkelwagen',
    onClick: () => router.push('/cart')
  }
})
```

### Error Toast (Payment Failed)

```tsx
showToast({
  type: 'error',
  title: 'Betaling mislukt',
  message: 'Uw iDEAL betaling kon niet worden verwerkt. Probeer opnieuw.',
  action: {
    label: 'Opnieuw proberen',
    onClick: () => retryPayment()
  }
})
```

### Warning Toast (Low Stock)

```tsx
showToast({
  type: 'warning',
  title: 'Voorraad bijna op',
  message: 'Peha-soft Nitrile Fino (M) — nog maar 12 dozen beschikbaar.',
  // No action link
})
```

### Info Toast (Subscription Reminder)

```tsx
showToast({
  type: 'info',
  title: 'Herhaalbestelling herinnering',
  message: 'Uw maandelijkse praktijkvoorraad wordt morgen verwerkt.',
  action: {
    label: 'Bekijk details',
    onClick: () => router.push('/subscriptions')
  }
})
```

### Custom Duration

```tsx
showToast({
  type: 'success',
  title: 'Quick notification',
  message: 'This will disappear in 2 seconds',
  duration: 2000  // 2 seconds
})
```

## Design Tokens

The ToastSystem uses the following theme variables (from `THEME_VARIABLES_REFERENCE.md`):

### Colors

| Variant | Background | Icon/Progress Color |
|---------|-----------|---------------------|
| Success | `var(--green-light)` | `var(--green)` |
| Error | `var(--coral-light)` | `var(--coral)` |
| Warning | `var(--amber-light)` | `var(--amber)` |
| Info | `var(--blue-light)` | `var(--blue)` |

### Other Variables

- Background: `var(--white)`
- Border: `var(--grey)`
- Title text: `var(--navy)`
- Message text: `var(--grey-mid)`
- Action link: `var(--teal)`
- Z-index: `var(--z-toast)` (400)

## Accessibility

### Screen Reader Support

- Toasts use `role="alert"` for immediate announcement
- Error/Warning toasts use `aria-live="assertive"` (interrupts)
- Success/Info toasts use `aria-live="polite"` (waits)
- `aria-atomic="true"` ensures entire message is read

### Keyboard Support

- Close button is focusable (Tab key)
- Enter/Space to close
- Action links are keyboard accessible
- Optional: ESC to dismiss all toasts

### Color Contrast

All color combinations meet WCAG AA standards:
- Title text: 15.8:1 (AAA)
- Body text: 4.6:1 (AA)
- Action links: 4.5:1 (AA)

## Best Practices

### When to Use

✅ Confirming successful actions (product added, order placed)
✅ Providing informational updates (shipping status, reminders)
✅ Warning about important conditions (low stock, session expiring)
✅ Alerting to errors (payment failed, validation errors)
✅ Non-blocking feedback (user can continue working)

### When NOT to Use

❌ Critical information requiring acknowledgment (use Modal)
❌ User must make a decision to proceed (use Confirmation Dialog)
❌ Content is lengthy or requires reading time (use Alert Banner)
❌ Permanent status indicators (use Status Badge)
❌ Multiple rapid messages (consolidate or use Notification Center)

### Tips

- Keep messages concise (1-2 sentences)
- Use action links sparingly (only when truly needed)
- Don't spam multiple toasts rapidly (merge similar messages)
- Respect the max toast limit (default 3)
- Test on mobile devices (toasts adapt to screen width)

## Technical Notes

### Animation Details

- **Slide-in**: 400ms cubic-bezier(0.4, 0, 0.2, 1)
- **Slide-out**: 400ms cubic-bezier(0.4, 0, 0.2, 1)
- **Progress bar**: Linear animation over duration (default 5s)
- **Auto-dismiss**: duration + 500ms buffer

### Responsive Breakpoints

- Desktop (>640px): 380px fixed width
- Mobile (<640px): calc(100vw - 32px) with 16px margins

### Stack Behavior

- New toasts append to bottom of stack
- Oldest toasts auto-dismiss first
- Manual close removes immediately
- Max 3 toasts visible (configurable)

## Related Components

- **C3-AddToCartToast**: Specialized toast with product image
- **C11-NotificationCenter**: Persistent notification history
- **C7-CookieBanner**: Persistent banner (not temporary)
- **C8-BackInStock**: Notification bar (similar styling)

## Troubleshooting

### Toasts not appearing

1. Ensure `ToastSystemProvider` wraps your app
2. Check that you're calling `showToast` from a client component
3. Verify the toast isn't being immediately dismissed

### Styling issues

1. Confirm theme variables are loaded in globals.css
2. Check that `toast-progress` animation is defined
3. Verify no CSS conflicts with z-index

### TypeScript errors

```tsx
// Import types explicitly
import type { ToastConfig } from '@/branches/shared/components/ui'

const config: ToastConfig = {
  type: 'success',
  title: 'Title',
  message: 'Message'
}
```

## Source Files

- `Component.tsx` - Main provider and container
- `Toast.tsx` - Individual toast component
- `types.ts` - TypeScript interfaces
- `index.ts` - Exports
- `globals.css` - Animation keyframes

---

**Last Updated**: February 25, 2026
**Component**: C17-ToastSystem
**Design Spec**: `/docs/refactoring/components/ui/c17-toast-system.html`
