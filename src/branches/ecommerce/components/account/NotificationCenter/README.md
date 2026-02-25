# NotificationCenter (c11)

Notification center dropdown from header bell icon. Shows order updates, stock alerts, invoices, and system messages. Keeps users informed of important account events with real-time updates.

## Features

- ✅ **Bell trigger button:** 44×44px with coral unread badge
- ✅ **Dropdown panel:** 400px width, max-height 380px with overflow scroll
- ✅ **4 tabs:** Alles, Bestellingen, Voorraad, Systeem (with dynamic count badges)
- ✅ **Color-coded icons:** Green (orders), Teal (stock), Blue (invoices), Amber (system)
- ✅ **Unread indicator:** Teal dot + light teal background (rgba(0, 137, 123, 0.03))
- ✅ **Notification details:** Title, description, relative timestamp (Clock icon)
- ✅ **Mark all as read:** Header button (only shows when unread count > 0)
- ✅ **Footer link:** "Alle meldingen bekijken" with ArrowRight icon
- ✅ **Click outside to close:** useEffect with mousedown listener
- ✅ **Tab filtering:** useMemo for performance
- ✅ **Keyboard accessible:** ARIA labels, roles, and focus management
- ✅ **Responsive:** Mobile width calc(100vw - 40px)
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { NotificationCenter } from '@/branches/ecommerce/components/account/NotificationCenter'

<NotificationCenter
  notifications={[
    {
      id: 'n1',
      type: 'order',
      icon: 'truck',
      iconColor: 'green',
      title: 'Bestelling #PM-2026-1847 is verzonden',
      text: 'Uw pakket is onderweg via PostNL. Track & trace: 3SPOST1234567',
      timestamp: '2026-02-25T10:00:00Z',
      read: false,
      link: '/account/orders/1847',
    },
    {
      id: 'n2',
      type: 'stock',
      icon: 'package',
      iconColor: 'teal',
      title: 'Weer op voorraad: Leukoplast Professional 5m',
      text: 'Een product van uw favorieten is weer leverbaar.',
      timestamp: '2026-02-25T08:00:00Z',
      read: false,
      link: '/products/leukoplast-professional-5m',
    },
  ]}
  unreadCount={2}
  onMarkAllRead={async () => {
    await fetch('/api/notifications/mark-all-read', { method: 'POST' })
  }}
  onNotificationClick={async (notification) => {
    if (!notification.read) {
      await fetch(`/api/notifications/${notification.id}/read`, { method: 'POST' })
    }
    router.push(notification.link || '/account/notifications')
  }}
  onViewAll={() => router.push('/account/notifications')}
/>
```

### With SWR (Recommended)

```tsx
'use client'

import { NotificationCenter } from '@/branches/ecommerce/components/account/NotificationCenter'
import useSWR from 'swr'

export function HeaderNotifications() {
  const { data: notifications, mutate } = useSWR('/api/notifications', fetcher, {
    refreshInterval: 30000, // Poll every 30 seconds
  })

  const handleMarkAllRead = async () => {
    await fetch('/api/notifications/mark-all-read', { method: 'POST' })
    mutate() // Revalidate
  }

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await fetch(`/api/notifications/${notification.id}/read`, { method: 'POST' })
      mutate() // Revalidate
    }
    router.push(notification.link || '/account/notifications')
  }

  return (
    <NotificationCenter
      notifications={notifications || []}
      onMarkAllRead={handleMarkAllRead}
      onNotificationClick={handleNotificationClick}
    />
  )
}
```

### With WebSocket (Real-time)

```tsx
'use client'

import { useState, useEffect } from 'react'
import { NotificationCenter } from '@/branches/ecommerce/components/account/NotificationCenter'
import { useWebSocket } from '@/hooks/useWebSocket'

export function RealtimeNotifications() {
  const [notifications, setNotifications] = useState([])
  const { lastMessage } = useWebSocket('wss://yourapi.com/notifications')

  useEffect(() => {
    if (lastMessage) {
      const newNotification = JSON.parse(lastMessage.data)
      setNotifications((prev) => [newNotification, ...prev])
    }
  }, [lastMessage])

  return (
    <NotificationCenter
      notifications={notifications}
      onNotificationClick={(notification) => {
        // Mark as read and navigate
        fetch(`/api/notifications/${notification.id}/read`, { method: 'POST' })
        router.push(notification.link)
      }}
    />
  )
}
```

## Props

| Prop                   | Type                                 | Required | Default                                             | Description                                     |
| ---------------------- | ------------------------------------ | -------- | --------------------------------------------------- | ----------------------------------------------- |
| `notifications`        | `Notification[]`                     | ✅       | -                                                   | Array of notification objects                   |
| `unreadCount`          | `number`                             |          | Auto-calculated from `notifications`                | Badge count (overrides auto-calculation)        |
| `onMarkAllRead`        | `() => void \| Promise<void>`        |          | -                                                   | Handler for "Alles gelezen" button              |
| `onNotificationClick`  | `(notification) => void \| Promise<void>` |          | -                                                   | Handler for notification click                  |
| `onViewAll`            | `() => void`                         |          | -                                                   | Handler for "Alle meldingen bekijken" link      |
| `tabs`                 | `NotificationTab[]`                  |          | `['Alles', 'Bestellingen', 'Voorraad', 'Systeem']` | Tab labels                                      |
| `maxItems`             | `number`                             |          | `10`                                                | Max notifications to show in dropdown           |
| `className`            | `string`                             |          | `''`                                                | Additional CSS classes                          |

### Notification Type

```typescript
interface Notification {
  id: string // Unique identifier
  type: 'order' | 'stock' | 'invoice' | 'system'
  icon: string // Lucide icon name (e.g., 'truck', 'package')
  iconColor: 'green' | 'teal' | 'blue' | 'amber' | 'coral'
  title: string // Bold notification title
  text: string // Secondary description text
  timestamp: string // ISO 8601 format (e.g., '2026-02-25T10:00:00Z')
  read: boolean // Read/unread state
  link?: string // Optional navigation link
}
```

### NotificationTab Type

```typescript
type NotificationTab = 'Alles' | 'Bestellingen' | 'Voorraad' | 'Systeem'
```

## Icon & Color Combinations

| Type      | Icon Examples                | Icon Color | Background Color        |
| --------- | ---------------------------- | ---------- | ----------------------- |
| Order     | `truck`, `package`, `check-circle` | Green      | `var(--green-light)`    |
| Stock     | `package`, `alert-circle`    | Teal       | `var(--teal-glow)`      |
| Invoice   | `file-text`, `receipt`       | Blue       | `var(--blue-light)`     |
| System    | `repeat`, `bell`, `settings` | Amber      | `var(--amber-light)`    |

## API Integration

### Payload CMS Collection

```typescript
// src/branches/shared/collections/Notifications.ts
import { CollectionConfig } from 'payload/types'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'read', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return { user: { equals: user.id } }
      return false
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'type',
      type: 'select',
      options: ['order', 'stock', 'invoice', 'system'],
      required: true,
      index: true,
    },
    {
      name: 'icon',
      type: 'text',
      defaultValue: 'bell',
    },
    {
      name: 'iconColor',
      type: 'select',
      options: ['green', 'teal', 'blue', 'amber', 'coral'],
      defaultValue: 'teal',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'text',
      type: 'textarea',
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'link',
      type: 'text',
    },
  ],
  timestamps: true,
}
```

### API Routes

```typescript
// src/app/api/notifications/route.ts
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@/payload.config'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const payload = await getPayloadHMR({ config })
  const user = req.headers.get('x-user-id') // Or use session

  const notifications = await payload.find({
    collection: 'notifications',
    where: { user: { equals: user } },
    sort: '-createdAt',
    limit: 50,
  })

  return NextResponse.json(notifications.docs)
}

// src/app/api/notifications/mark-all-read/route.ts
export async function POST(req: Request) {
  const payload = await getPayloadHMR({ config })
  const user = req.headers.get('x-user-id')

  await payload.update({
    collection: 'notifications',
    where: { user: { equals: user }, read: { equals: false } },
    data: { read: true },
  })

  return NextResponse.json({ success: true })
}

// src/app/api/notifications/[id]/read/route.ts
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const payload = await getPayloadHMR({ config })

  await payload.update({
    collection: 'notifications',
    id: params.id,
    data: { read: true },
  })

  return NextResponse.json({ success: true })
}
```

## Notification Triggers

### Order Shipped

```typescript
// When order status changes to 'shipped'
await payload.create({
  collection: 'notifications',
  data: {
    user: order.customerId,
    type: 'order',
    icon: 'truck',
    iconColor: 'green',
    title: `Bestelling #${order.orderNumber} is verzonden`,
    text: `Uw pakket is onderweg via ${order.shippingCarrier}. Track & trace: ${order.trackingNumber}`,
    link: `/account/orders/${order.id}`,
    read: false,
  },
})
```

### Stock Alert

```typescript
// When out-of-stock product is back in stock
await payload.create({
  collection: 'notifications',
  data: {
    user: userId,
    type: 'stock',
    icon: 'package',
    iconColor: 'teal',
    title: `Weer op voorraad: ${product.name}`,
    text: 'Een product van uw favorieten is weer leverbaar.',
    link: `/products/${product.slug}`,
    read: false,
  },
})
```

### Invoice Available

```typescript
// When invoice is generated
await payload.create({
  collection: 'notifications',
  data: {
    user: order.customerId,
    type: 'invoice',
    icon: 'file-text',
    iconColor: 'blue',
    title: `Factuur ${invoice.number} beschikbaar`,
    text: `De factuur voor bestelling #${order.orderNumber} staat klaar voor download.`,
    link: `/account/invoices/${invoice.id}`,
    read: false,
  },
})
```

## Accessibility

- **Button:** `aria-label="Notificaties"`, `aria-expanded`, `aria-haspopup="true"`
- **Badge:** `aria-label="X ongelezen meldingen"` (screen reader only)
- **Dropdown:** `role="dialog"`, `aria-labelledby="notif-title"`
- **Tabs:** `role="tablist"`, `role="tab"`, `aria-selected`
- **Tab Panel:** `role="tabpanel"`
- **Notification links:** `aria-label` with full context (title + timestamp)
- **Keyboard:**
  - Tab to navigate between trigger, tabs, notifications, and footer link
  - Enter/Space to activate buttons/links
  - Click outside to close
- **Focus management:** Auto-close on notification click (setIsOpen false)
- **Screen reader:** All interactive elements announced correctly

## Theme Variables

### Colors

| Element         | Color                  | Usage                                  |
| --------------- | ---------------------- | -------------------------------------- |
| Trigger border  | `var(--grey)`          | Default border                         |
| Trigger hover   | `var(--teal-glow)`     | Hover background                       |
| Badge           | `var(--coral)`         | Unread count badge                     |
| Unread dot      | `var(--teal)`          | 6px circle on unread items             |
| Unread bg       | `rgba(0, 137, 123, 0.03)` | Unread item background              |
| Icon backgrounds| `var(--green-light)`, `var(--teal-glow)`, `var(--blue-light)`, `var(--amber-light)` | Color-coded by type |

### Spacing

- **Trigger:** 44×44px, 10px border-radius
- **Badge:** 18px min-width/height, -4px offset (top-right)
- **Dropdown:** 400px width, max-height 380px (list section)
- **Header padding:** 16px (vertical) × 20px (horizontal)
- **Item padding:** 14px (vertical) × 20px (horizontal)
- **Icon:** 38×38px, 10px border-radius
- **Gap:** 12px between icon and text

### Typography

- **Header title:** 15px, weight 800, `var(--font-display)`
- **Tab label:** 13px, weight 600
- **Notification title:** 13px, weight 700
- **Notification text:** 12px, `var(--grey-mid)`
- **Timestamp:** 11px, `var(--grey-mid)`
- **Footer link:** 13px, weight 600

## Testing Checklist

- [ ] Bell icon renders correctly
- [ ] Badge shows correct unread count
- [ ] Badge hides when unread count = 0
- [ ] Dropdown opens on trigger click
- [ ] Dropdown closes on click outside
- [ ] Dropdown closes on notification click
- [ ] Tabs filter notifications correctly
- [ ] Tab badges show correct counts
- [ ] Active tab has teal underline
- [ ] Unread items have teal dot + light background
- [ ] Read items have no dot or background
- [ ] "Alles gelezen" button works
- [ ] "Alles gelezen" button hides when no unread
- [ ] Footer link navigates correctly
- [ ] Relative time formats correctly
- [ ] Icons render with correct colors
- [ ] Icon backgrounds match notification type
- [ ] Mobile: dropdown width adjusted
- [ ] Screen reader: all elements announced
- [ ] Keyboard: Tab navigation works
- [ ] Keyboard: ESC closes dropdown (if implemented)

## Component Location

```
src/branches/ecommerce/components/account/NotificationCenter/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Account / Communication
**Complexity:** High (dropdown, tabs, filtering, real-time updates)
**Priority:** 🟢 HIGH (improves engagement, reduces support requests)
**Last Updated:** February 25, 2026
