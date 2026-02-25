# FormInput Component

Reusable form input component with consistent styling, validation states, and accessibility features.

## Features

- ✅ Label with optional required asterisk
- ✅ Focus state (teal border + glow)
- ✅ Error state (red border + error message)
- ✅ Helper text support
- ✅ Left icon support (Lucide icons)
- ✅ Password show/hide toggle
- ✅ Disabled state
- ✅ Full accessibility (ARIA labels, roles)
- ✅ Theme variables only (NO hardcoded colors)

## Usage

```tsx
import { FormInput } from '@/branches/shared/components/auth/FormInput'

// Basic text input
<FormInput
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="uw@email.nl"
  required
/>

// Password input with toggle
<FormInput
  label="Wachtwoord"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>

// Input with error
<FormInput
  label="Telefoonnummer"
  type="tel"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  error="Ongeldig telefoonnummer"
  required
/>

// Input with icon and helper text
<FormInput
  label="E-mailadres"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  icon="mail"
  helperText="We sturen nooit spam"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'text' \| 'email' \| 'password' \| 'tel' \| 'number'` | `'text'` | Input type |
| `label` | `string` | - | Label text |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Input value (controlled) |
| `onChange` | `(e: ChangeEvent) => void` | - | Change handler |
| `onBlur` | `(e: FocusEvent) => void` | - | Blur handler |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text below input |
| `required` | `boolean` | `false` | Required field |
| `disabled` | `boolean` | `false` | Disabled state |
| `icon` | `string` | - | Lucide icon name (e.g., "mail") |
| `showPasswordToggle` | `boolean` | `true` for password | Enable password toggle |
| `autoComplete` | `string` | - | Autocomplete attribute |
| `minLength` | `number` | - | Minimum length |
| `maxLength` | `number` | - | Maximum length |
| `pattern` | `string` | - | Validation pattern |
| `className` | `string` | - | Additional CSS classes |

## States

**Normal:**
- Grey border
- White background

**Focus:**
- Teal border
- Teal glow (box-shadow)
- Icon turns teal

**Error:**
- Coral border
- Coral glow on focus
- Error message displayed below

**Disabled:**
- Light grey background
- Grey text
- Not-allowed cursor

## Accessibility

- Full keyboard navigation
- ARIA labels for screen readers
- Error announcements with `role="alert"`
- Descriptive labels and helper text
- Password toggle with aria-label

## Theme Variables

```css
--navy        /* Label color */
--teal        /* Focus border */
--coral       /* Error color, required asterisk */
--grey        /* Default border */
--grey-mid    /* Placeholder, icons, helper text */
--grey-light  /* Disabled background */
--white       /* Input background */
--radius-sm   /* Border radius */
```

## Examples

See `auth04-login-form.tsx`, `auth05-register-form.tsx`, and `auth06-guest-checkout-form.tsx` for usage examples.
