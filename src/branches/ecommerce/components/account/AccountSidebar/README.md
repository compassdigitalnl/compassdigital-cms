# AccountSidebar (c24)

Vertical navigation sidebar for user account pages. Includes user profile card with avatar, navigation links with icons and notification badges, and logout button.

## Features

- ✅ **User profile card:** Avatar (64×64px), name, company, "Lid sinds" timestamp
- ✅ **Gradient avatar:** Teal gradient background with white initials
- ✅ **Avatar image support:** Optional URL for custom profile pictures
- ✅ **Navigation links:** Icons (18×18px Lucide), labels, optional badges
- ✅ **Active state:** Teal background + 3px left border accent
- ✅ **Notification badges:** Coral background, counts for new items
- ✅ **Logout button:** Coral text, coral-light hover background
- ✅ **Hover effects:** Subtle shadows on user card, background on links
- ✅ **Responsive:** Max-width 280px (desktop), 100% width (mobile)
- ✅ **Accessible:** ARIA labels, semantic HTML, keyboard navigation
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { AccountSidebar } from '@/branches/ecommerce/components/account/AccountSidebar'

<AccountSidebar
  user={{
    name: 'Jan de Vries',
    company: 'Huisartsenpraktijk De Vries',
    memberSince: '2024-01-15T10:00:00Z',
  }}
  navigationLinks={[
    { label: 'Mijn account', href: '/account', icon: 'user', isActive: true },
    { label: 'Bestellingen', href: '/account/orders', icon: 'package', badge: 2 },
    { label: 'Favorieten', href: '/account/favorites', icon: 'heart' },
    { label: 'Adressen', href: '/account/addresses', icon: 'map-pin' },
    { label: 'Instellingen', href: '/account/settings', icon: 'settings' },
  ]}
  onLogout={async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }}
/>
```

### With Avatar Image

```tsx
<AccountSidebar
  user={{
    name: 'Jan de Vries',
    company: 'Huisartsenpraktijk De Vries',
    avatarUrl: 'https://example.com/avatar.jpg',
    memberSince: '2024-01-15T10:00:00Z',
  }}
  navigationLinks={[...]}
  onLogout={handleLogout}
/>
```

### With Custom Initials

```tsx
<AccountSidebar
  user={{
    name: 'Jan de Vries',
    initials: 'JDV', // Custom initials (overrides auto-generation)
    memberSince: '2024-01-15T10:00:00Z',
  }}
  navigationLinks={[...]}
/>
```

### With Next.js App Router

```tsx
'use client'

import { AccountSidebar } from '@/branches/ecommerce/components/account/AccountSidebar'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export function MyAccountLayout({ children, user }) {
  const pathname = usePathname()

  const navigationLinks = [
    { label: 'Overzicht', href: '/account', icon: 'layout-dashboard', isActive: pathname === '/account' },
    { label: 'Bestellingen', href: '/account/orders', icon: 'package', isActive: pathname.startsWith('/account/orders') },
    { label: 'Favorieten', href: '/account/favorites', icon: 'heart', isActive: pathname === '/account/favorites' },
    { label: 'Adressen', href: '/account/addresses', icon: 'map-pin', isActive: pathname === '/account/addresses' },
    { label: 'Instellingen', href: '/account/settings', icon: 'settings', isActive: pathname === '/account/settings' },
  ]

  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      <AccountSidebar
        user={user}
        navigationLinks={navigationLinks}
        onLogout={() => signOut({ callbackUrl: '/login' })}
      />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  )
}
```

### With Badge Counts from API

```tsx
'use client'

import { AccountSidebar } from '@/branches/ecommerce/components/account/AccountSidebar'
import useSWR from 'swr'

export function MyAccountSidebar({ user }) {
  const { data: counts } = useSWR('/api/account/counts', fetcher)

  const navigationLinks = [
    { label: 'Overzicht', href: '/account', icon: 'layout-dashboard' },
    { label: 'Bestellingen', href: '/account/orders', icon: 'package', badge: counts?.newOrders },
    { label: 'Meldingen', href: '/account/notifications', icon: 'bell', badge: counts?.unreadNotifications },
    { label: 'Berichten', href: '/account/messages', icon: 'mail', badge: counts?.unreadMessages },
  ]

  return <AccountSidebar user={user} navigationLinks={navigationLinks} />
}
```

## Props

| Prop              | Type                         | Required | Default | Description                        |
| ----------------- | ---------------------------- | -------- | ------- | ---------------------------------- |
| `user`            | `UserProfile`                | ✅       | -       | User profile data                  |
| `navigationLinks` | `NavigationLink[]`           | ✅       | -       | Array of navigation links          |
| `onLogout`        | `() => void \| Promise<void>` |          | -       | Handler for logout button          |
| `className`       | `string`                     |          | `''`    | Additional CSS classes             |

### UserProfile Type

```typescript
interface UserProfile {
  name: string
  company?: string
  avatarUrl?: string
  initials?: string // e.g., "JD" for "John Doe" (auto-generated if not provided)
  memberSince: string // ISO 8601 timestamp
}
```

### NavigationLink Type

```typescript
interface NavigationLink {
  label: string
  href: string
  icon: string // Lucide icon name (e.g., "user", "package", "heart")
  badge?: number // Notification count
  isActive?: boolean
}
```

## Initials Generation

If `user.initials` is not provided, initials are automatically generated from `user.name`:

- **Single name:** First 2 characters (e.g., "Jan" → "JA")
- **Multiple names:** First letter of first + last name (e.g., "Jan de Vries" → "JV")

## Member Since Formatting

The `memberSince` timestamp is formatted as "maand jaar" in Dutch locale:
- `2024-01-15T10:00:00Z` → "januari 2024"
- `2025-12-20T10:00:00Z` → "december 2025"

## Icons

All navigation link icons use Lucide React. Common icon names:
- `user` - Profile icon
- `package` - Orders icon
- `heart` - Favorites icon
- `map-pin` - Addresses icon
- `settings` - Settings icon
- `bell` - Notifications icon
- `mail` - Messages icon
- `layout-dashboard` - Dashboard icon
- `credit-card` - Payment methods icon
- `shield` - Security/privacy icon

## Accessibility

- **Container:** `<aside>` with `role="navigation"` and `aria-label="Account navigatie"`
- **Active link:** `aria-current="page"` attribute
- **Badge:** `aria-label` for screen readers (e.g., "2 nieuwe items")
- **Icons:** `aria-hidden="true"` (decorative)
- **Logout confirmation:** Native `confirm()` dialog before logout
- **Keyboard navigation:** All links and buttons are keyboard accessible
- **Focus styles:** Default browser focus rings retained

## Theme Variables

### Colors

| Element           | Color                | Usage                    |
| ----------------- | -------------------- | ------------------------ |
| Card background   | `white`              | User card, nav, logout   |
| Card border       | `var(--grey)`        | Default                  |
| Card hover border | `var(--grey-mid)`    | User card hover          |
| Avatar gradient   | `var(--teal)` → `var(--teal-dark)` | Background |
| User name         | `var(--navy)`        | Primary text             |
| User company      | `var(--grey-mid)`    | Secondary text           |
| Link default      | `var(--navy)`        | Text color               |
| Link active bg    | `var(--teal-glow)`   | Active/hover background  |
| Link active text  | `var(--teal-dark)`   | Active/hover text        |
| Active accent     | `var(--teal)`        | 3px left border          |
| Icon default      | `var(--grey-mid)`    | Default icon color       |
| Icon active       | `var(--teal)`        | Active/hover icon        |
| Badge background  | `var(--coral)`       | Notification count       |
| Logout text       | `var(--coral)`       | Button text              |
| Logout hover bg   | `var(--coral-light)` | Hover background         |

### Spacing

- **User card padding:** 16px
- **Avatar size:** 64×64px
- **Avatar margin-bottom:** 12px
- **Nav link padding:** 12px (vertical), 14px (horizontal)
- **Nav link gap:** 10px
- **Active border width:** 3px (left)
- **Badge padding:** 2px (vertical), 7px (horizontal)
- **Sidebar max-width:** 280px

### Typography

- **User name:** 16px, weight 800, `var(--font-display)`
- **User company:** 13px, weight 600
- **User since:** 12px
- **Nav links:** 14px, weight 600
- **Logout button:** 14px, weight 600
- **Badge:** 11px, weight 700

## Testing Checklist

- [ ] User card displays name, company, member since correctly
- [ ] Avatar shows initials if no avatarUrl provided
- [ ] Avatar shows image if avatarUrl provided
- [ ] Custom initials override auto-generation
- [ ] Member since formatted correctly (Dutch locale)
- [ ] Navigation links render with correct icons
- [ ] Active link shows teal background + left border
- [ ] Badge appears when count > 0
- [ ] Badge hidden when count is 0 or undefined
- [ ] Logout button shows confirmation dialog
- [ ] Logout handler called after confirmation
- [ ] Hover effects work on user card and nav links
- [ ] Mobile: sidebar takes 100% width
- [ ] Screen reader: all elements announced correctly
- [ ] Keyboard: Tab navigation works through all links
- [ ] Keyboard: Enter/Space activates links and logout button

## Component Location

```
src/branches/ecommerce/components/account/AccountSidebar/
├── Component.tsx
├── types.ts
├── index.ts
└── README.md
```

---

**Category:** E-commerce / Account / Navigation
**Complexity:** Medium (avatar logic, active states, badges)
**Priority:** 🟢 HIGH (essential for account pages)
**Last Updated:** February 25, 2026
