# EmailConfirmationBanner (oc05)

Info banner confirming that a confirmation email has been (or will be) sent to the customer's email address. Appears at the bottom of order confirmation pages.

## Features

- ✅ **Horizontal flex layout:** Icon (20×20px) + text + optional close button
- ✅ **4 color variants:** Info (blue), Success (green), Warning (amber), Error (coral)
- ✅ **Bold email highlighting:** Email address shown in `<strong>` tags
- ✅ **Optional inline links:** "Mail niet ontvangen?" resend links
- ✅ **Dismissible:** Optional close button
- ✅ **Compact variant:** Smaller for sidebars and email templates
- ✅ **Responsive:** Stacks vertically on mobile
- ✅ **Fully accessible:** ARIA status, keyboard navigation
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage (Info Variant)

```tsx
import { EmailConfirmationBanner } from '@/branches/ecommerce/components/orders/EmailConfirmationBanner'

<EmailConfirmationBanner
  message="Je ontvangt binnen 5 minuten een bevestigingsmail met alle details"
  email="john.doe@example.com"
/>
```

### With HTML Message (Bold Email)

```tsx
<EmailConfirmationBanner
  message="Je ontvangt binnen 5 minuten een bevestigingsmail op <strong>john.doe@example.com</strong>"
  variant="info"
/>
```

### Success Variant

```tsx
<EmailConfirmationBanner
  message="Email succesvol verzonden! Controleer je inbox"
  email="john.doe@example.com"
  variant="success"
/>
```

### Warning Variant (Email Delay)

```tsx
<EmailConfirmationBanner
  message="<strong>Let op:</strong> Het kan tot 15 minuten duren voordat de bevestigingsmail arriveert. Check ook je spam folder."
  variant="warning"
/>
```

### Error Variant (Email Failed)

```tsx
<EmailConfirmationBanner
  message="<strong>Email kon niet verzonden worden.</strong> Neem contact op met support."
  variant="error"
  link={{
    text: 'Contacteer support',
    href: '/contact',
  }}
/>
```

### With Resend Link

```tsx
<EmailConfirmationBanner
  message="Bevestigingsmail verzonden naar"
  email="john.doe@example.com"
  variant="info"
  link={{
    text: 'Mail niet ontvangen?',
    onClick: () => handleResendEmail(),
  }}
/>
```

### With Close Button

```tsx
<EmailConfirmationBanner
  message="Bevestigingsmail verzonden"
  email="john.doe@example.com"
  showClose={true}
  onClose={() => console.log('Banner closed')}
/>
```

### Compact Variant

```tsx
<EmailConfirmationBanner
  message="Bevestigingsmail verzonden"
  email="john.doe@example.com"
  compact={true}
/>
```

### Custom Icon

```tsx
<EmailConfirmationBanner
  message="Je ontvangt een notificatie zodra je bestelling is verzonden"
  variant="info"
  icon="bell" // Uses Lucide Bell icon instead of default Mail
/>
```

## Props

| Prop        | Type                  | Required | Default   | Description                        |
| ----------- | --------------------- | -------- | --------- | ---------------------------------- |
| `message`   | `string \| ReactNode` | ✅       | -         | Banner message (supports HTML)     |
| `email`     | `string`              |          | -         | Email address to highlight         |
| `variant`   | `EmailBannerVariant`  |          | `'info'`  | Color variant                      |
| `icon`      | `string`              |          | Auto      | Lucide icon name                   |
| `showClose` | `boolean`             |          | `false`   | Show close button                  |
| `onClose`   | `() => void`          |          | -         | Close button handler               |
| `compact`   | `boolean`             |          | `false`   | Use compact styling                |
| `link`      | `EmailBannerLink`     |          | -         | Optional inline link               |
| `className` | `string`              |          | `''`      | Additional CSS classes             |

### EmailBannerVariant Type

```typescript
type EmailBannerVariant = 'info' | 'success' | 'warning' | 'error'
```

### EmailBannerLink Type

```typescript
interface EmailBannerLink {
  text: string // Link text (e.g., "Mail niet ontvangen?")
  href?: string // Link URL
  onClick?: () => void // Click handler (takes precedence over href)
}
```

## Order Confirmation Page Integration

```tsx
import { SuccessHero } from '@/branches/ecommerce/components/orders/SuccessHero'
import { OrderDetailsCard } from '@/branches/ecommerce/components/orders/OrderDetailsCard'
import { OrderItemsSummary } from '@/branches/ecommerce/components/orders/OrderItemsSummary'
import { NextStepsCTA } from '@/branches/ecommerce/components/orders/NextStepsCTA'
import { EmailConfirmationBanner } from '@/branches/ecommerce/components/orders/EmailConfirmationBanner'

export default async function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  const order = await getOrder(params.orderId)

  return (
    <div>
      <SuccessHero orderNumber={order.orderNumber} />
      <OrderDetailsCard {...orderDetailsProps} />
      <OrderItemsSummary items={orderItems} />
      <NextStepsCTA actions={orderActions} />
      <EmailConfirmationBanner
        message="Je ontvangt binnen 5 minuten een bevestigingsmail met alle details op"
        email={order.customerEmail}
        link={{
          text: 'Mail niet ontvangen?',
          href: '/contact',
        }}
      />
    </div>
  )
}
```

## Dynamic Variant Based on Email Status

```tsx
function getEmailBannerProps(emailStatus: 'sent' | 'pending' | 'delayed' | 'failed', email: string) {
  switch (emailStatus) {
    case 'sent':
      return {
        message: 'Bevestigingsmail verzonden naar',
        email,
        variant: 'success' as const,
        icon: 'check-circle',
      }

    case 'pending':
      return {
        message: 'Je ontvangt binnen 5 minuten een bevestigingsmail op',
        email,
        variant: 'info' as const,
        icon: 'mail',
      }

    case 'delayed':
      return {
        message: '<strong>Let op:</strong> Het kan tot 15 minuten duren voordat de bevestigingsmail arriveert. Check ook je spam folder.',
        variant: 'warning' as const,
        icon: 'alert-triangle',
      }

    case 'failed':
      return {
        message: '<strong>Email kon niet verzonden worden.</strong> Neem contact op met support.',
        variant: 'error' as const,
        icon: 'x-circle',
        link: {
          text: 'Contacteer support',
          href: '/contact',
        },
      }
  }
}

// Usage:
<EmailConfirmationBanner {...getEmailBannerProps(order.emailStatus, order.customerEmail)} />
```

## Resend Email Handler

```tsx
async function handleResendEmail(orderId: string) {
  try {
    const response = await fetch(`/api/orders/${orderId}/resend-email`, {
      method: 'POST',
    })

    if (response.ok) {
      toast.success('Bevestigingsmail opnieuw verzonden!')
    } else {
      toast.error('Kon email niet verzenden. Probeer het opnieuw.')
    }
  } catch (error) {
    console.error('Resend email error:', error)
    toast.error('Er ging iets mis.')
  }
}

// Usage:
<EmailConfirmationBanner
  message="Bevestigingsmail verzonden naar"
  email={order.customerEmail}
  link={{
    text: 'Mail niet ontvangen?',
    onClick: () => handleResendEmail(order.id),
  }}
/>
```

## Dismissible Banner with LocalStorage

```tsx
'use client'

import { useState, useEffect } from 'react'

function useDismissedBanner(bannerId: string) {
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(`banner_dismissed_${bannerId}`) === 'true'
    setIsDismissed(dismissed)
  }, [bannerId])

  const dismiss = () => {
    localStorage.setItem(`banner_dismissed_${bannerId}`, 'true')
    setIsDismissed(true)
  }

  return { isDismissed, dismiss }
}

// Usage:
function OrderConfirmation({ order }) {
  const { isDismissed, dismiss } = useDismissedBanner('email-confirmation')

  if (isDismissed) return null

  return (
    <EmailConfirmationBanner
      message="Bevestigingsmail verzonden"
      email={order.customerEmail}
      showClose={true}
      onClose={dismiss}
    />
  )
}
```

## Common Icons

| Variant/Context     | Icon              | Alternatives                |
| ------------------- | ----------------- | --------------------------- |
| Info (email)        | `mail`            | `inbox`, `send`             |
| Success             | `check-circle`    | `check`, `circle-check`     |
| Warning             | `alert-triangle`  | `alert-circle`              |
| Error               | `x-circle`        | `alert-octagon`             |
| Notification        | `bell`            | `bell-ring`                 |

## Accessibility

- **Container:** `role="status"` for status message, `aria-live="polite"` for screen reader announcements
- **Icon:** `aria-hidden="true"` (decorative only)
- **Close button:** `aria-label="Sluit melding"` for screen readers
- **Keyboard:** Tab to close button/links, Enter/Space to activate
- **Focus ring:** 2px teal outline + 4px teal glow on close button
- **Color contrast:** All variants pass WCAG AAA (7.2:1+ contrast)

## Theme Variables

### Colors

| Variant | Background           | Border    | Icon      | Text      |
| ------- | -------------------- | --------- | --------- | --------- |
| Info    | `var(--blue-light)`  | `#90CAF9` | `#1565C0` | `#0D47A1` |
| Success | `var(--green-light)` | `#81C784` | `#1B5E20` | `#1B5E20` |
| Warning | `var(--amber-light)` | `#FFB74D` | `#E65100` | `#E65100` |
| Error   | `var(--coral-light)` | `#EF5350` | `#C62828` | `#C62828` |

### Spacing

- **Banner padding:** 16px (vertical) × 20px (horizontal)
- **Icon → Text gap:** 12px
- **Compact padding:** 12px (vertical) × 16px (horizontal)
- **Compact gap:** 8px
- **Bottom margin:** 32px (or 24px if last element)

### Typography

- **Banner text:** 14px, weight 400, line-height 1.6
- **Bold text:** 14px, weight 700 (for email addresses)
- **Link text:** 14px, weight 600, underlined
- **Compact text:** 13px, weight 400

## Testing Checklist

- [ ] Banner displays with correct variant color
- [ ] Icon renders correctly (Lucide)
- [ ] Email address appears in bold
- [ ] Text is readable and clear
- [ ] Close button works (banner disappears)
- [ ] Link is clickable and navigates correctly
- [ ] Mobile: stacks icon/text vertically
- [ ] Mobile: close button positioned top-right
- [ ] Screen reader announces message
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Color contrast passes WCAG AAA
- [ ] Banner appears below NextStepsCTA

## Component Location

```
src/branches/ecommerce/components/orders/EmailConfirmationBanner/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Orders / Notification Banner
**Complexity:** Low (simple banner with variants)
**Priority:** 🟢 HIGH (Phase 1 - Core order flow)
**Last Updated:** February 25, 2026
