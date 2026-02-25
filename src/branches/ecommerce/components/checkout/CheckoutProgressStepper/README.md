# CheckoutProgressStepper (ec13)

4-step horizontal progress indicator specifically designed for the checkout flow. Shows user's current position in the checkout process (Gegevens → Verzending → Betaling → Bevestiging) with clear visual states for completed, active, and pending steps.

## Features

- ✅ **4 checkout steps:** Gegevens, Verzending, Betaling, Bevestiging
- ✅ **3 distinct states:** Completed (green ✓), Active (teal number), Pending (grey number)
- ✅ **Visual progress tracking:** Connection line fills left-to-right
- ✅ **Green checkmark:** For completed steps (success feedback)
- ✅ **Stronger shadow:** On active step (visual emphasis)
- ✅ **Smooth transitions:** Between states
- ✅ **Clickable steps:** Optional navigation to completed steps
- ✅ **Keyboard accessible:** Full ARIA support
- ✅ **Theme variables only:** NO hardcoded colors!
- ✅ **Responsive:** Hides labels on mobile (<480px)

## Usage

### Basic Usage

```tsx
import { CheckoutProgressStepper } from '@/branches/ecommerce/components/checkout/CheckoutProgressStepper'

<CheckoutProgressStepper currentStep={2} />
```

### With Click Handler (Navigation)

```tsx
const [currentStep, setCurrentStep] = useState(2)

<CheckoutProgressStepper
  currentStep={currentStep}
  onStepClick={(step) => {
    // Only completed steps are clickable
    if (step < currentStep) {
      setCurrentStep(step)
    }
  }}
/>
```

### Custom Step Labels

```tsx
<CheckoutProgressStepper
  currentStep={3}
  steps={[
    { id: 1, label: 'Plan' },
    { id: 2, label: 'Account' },
    { id: 3, label: 'Betaling' },
    { id: 4, label: 'Bevestiging' },
  ]}
/>
```

### Full Checkout Integration

```tsx
'use client'

import { useState } from 'react'
import { CheckoutProgressStepper } from '@/branches/ecommerce/components/checkout/CheckoutProgressStepper'
import { AddressForm } from '@/branches/ecommerce/components/checkout/AddressForm'
import { ShippingMethodCard } from '@/branches/ecommerce/components/checkout/ShippingMethodCard'
import { PaymentMethodCard } from '@/branches/ecommerce/components/checkout/PaymentMethodCard'

export function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="checkout-container">
      {/* Progress Stepper */}
      <CheckoutProgressStepper
        currentStep={currentStep}
        onStepClick={setCurrentStep} // Allow navigation to completed steps
      />

      {/* Step Content */}
      {currentStep === 1 && <AddressForm onNext={handleNext} />}
      {currentStep === 2 && <ShippingSelection onNext={handleNext} onBack={handleBack} />}
      {currentStep === 3 && <PaymentSelection onNext={handleNext} onBack={handleBack} />}
      {currentStep === 4 && <OrderReview onBack={handleBack} />}
    </div>
  )
}
```

## Props

| Prop          | Type                         | Required | Default                                                 | Description                          |
| ------------- | ---------------------------- | -------- | ------------------------------------------------------- | ------------------------------------ |
| `currentStep` | `1 \| 2 \| 3 \| 4`           | ✓        | -                                                       | Current active step                  |
| `steps`       | `CheckoutStep[]`             |          | Gegevens, Verzending, Betaling, Bevestiging             | Step labels (optional override)      |
| `onStepClick` | `(step: number) => void`     |          | -                                                       | Click handler (enables navigation)   |
| `className`   | `string`                     |          | `''`                                                    | Additional CSS classes               |

## Types

```typescript
interface CheckoutStep {
  id: number // Step ID (1-4)
  label: string // Step label (e.g., "Gegevens")
}

type StepState = 'completed' | 'active' | 'pending'

interface CheckoutProgressStepperProps {
  currentStep: 1 | 2 | 3 | 4
  steps?: CheckoutStep[]
  onStepClick?: (step: number) => void
  className?: string
}
```

## Default Steps

1. **Gegevens** (Information/Details) - Personal info + delivery address
2. **Verzending** (Shipping) - Shipping method selection
3. **Betaling** (Payment) - Payment method selection
4. **Bevestiging** (Confirmation) - Order review + T&C acceptance

## Step States

| Condition              | State       | Circle Content        | Circle Color | Label Color  |
| ---------------------- | ----------- | --------------------- | ------------ | ------------ |
| `step < currentStep`   | `completed` | Green checkmark (✓)   | Green        | Green        |
| `step === currentStep` | `active`    | White step number     | Teal         | Teal         |
| `step > currentStep`   | `pending`   | Grey step number      | Grey-light   | Grey-mid     |

## Progress Line Calculation

```typescript
const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100

// Examples:
// Step 1: (1-1) / (4-1) = 0%     (no progress yet)
// Step 2: (2-1) / (4-1) = 33.33% (1 step completed)
// Step 3: (3-1) / (4-1) = 66.67% (2 steps completed)
// Step 4: (4-1) / (4-1) = 100%   (all completed)
```

## URL-based Step Tracking

```tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStep = parseInt(searchParams.get('step') || '1') as 1 | 2 | 3 | 4

  const goToStep = (step: number) => {
    router.push(`/checkout?step=${step}`)
  }

  return (
    <CheckoutProgressStepper
      currentStep={currentStep}
      onStepClick={goToStep}
    />
  )
}
```

## Payload CMS Integration

```typescript
// Store checkout progress in Order collection
{
  name: 'checkoutStep',
  type: 'select',
  options: [
    { label: 'Gegevens', value: '1' },
    { label: 'Verzending', value: '2' },
    { label: 'Betaling', value: '3' },
    { label: 'Bevestiging', value: '4' },
  ],
  defaultValue: '1',
  admin: {
    description: 'Current step in checkout flow (for abandoned cart recovery)',
  },
}

// Track where users drop off
{
  name: 'abandonedAt',
  type: 'select',
  options: [
    { label: 'Step 1: Gegevens', value: '1' },
    { label: 'Step 2: Verzending', value: '2' },
    { label: 'Step 3: Betaling', value: '3' },
    { label: 'Completed', value: 'completed' },
  ],
}
```

## Accessibility

### ARIA Attributes

```tsx
<nav aria-label="Checkout progress">
  <div className="step completed" aria-current={false}>
    <div className="step-circle" aria-label="Step 1: Gegevens, completed">
      <Check size={20} />
    </div>
    <div className="step-label">Gegevens</div>
  </div>

  <div className="step active" aria-current="step">
    <div className="step-circle" aria-label="Step 2: Verzending, current step">
      2
    </div>
    <div className="step-label">Verzending</div>
  </div>
</nav>
```

### Screen Reader Announcements

- "Checkout progress, navigation"
- "Step 1, Gegevens, completed"
- "Step 2, Verzending, current step"
- "Step 3, Betaling, pending"

### Keyboard Navigation (when clickable)

- **Tab:** Focus clickable steps
- **Enter/Space:** Navigate to focused completed step
- **Arrow keys:** Not implemented (steps are independent)

## Theme Variables Used

### Colors

- **Green:** `var(--green)` — #00C853 (completed circle, progress fill, label)
- **Teal:** `var(--teal)` — #00897B (active circle, label)
- **Grey:** `var(--grey)` — #E8ECF1 (progress line background)
- **Grey Light:** `var(--grey-light)` — #F1F4F8 (pending circle background)
- **Grey Mid:** `var(--grey-mid)` — #94A3B8 (pending text)
- **White:** `white` — Circle border, completed/active text

### Shadows

- **Completed:** `0 2px 8px rgba(0, 200, 83, 0.3)` (green glow)
- **Active:** `0 4px 12px rgba(0, 137, 123, 0.4)` (teal glow - stronger)
- **Pending:** `0 2px 8px rgba(0, 0, 0, 0.05)` (subtle grey)

## Styling Details

### Container

- **Max-width:** 600px (optimal for 4 steps)
- **Margin:** 0 auto (centered)
- **Display:** flex, justify-content: space-between
- **Position:** relative (for absolute line positioning)
- **Padding:** 0 8px

### Progress Line

- **Position:** absolute, top: 20px (centers with 40px circles)
- **Left/Right:** 50px offset
- **Height:** 2px
- **Z-index:** 0 (behind circles)
- **Fill transition:** width 0.5s cubic-bezier

### Step Circle

- **Size:** 40×40px (36px on mobile)
- **Border:** 3px solid white
- **Border-radius:** 50%
- **Font:** 18px, 700 weight (16px on mobile)
- **Margin-bottom:** 8px

### Step Label

- **Font:** 12px, 600 weight (10px on mobile <640px)
- **Text-align:** center
- **Max-width (mobile):** 60px, ellipsis overflow

## Responsive Behavior

### Desktop (>640px)

- **Circle:** 40×40px
- **Label:** 12px, visible
- **Line offset:** 50px

### Mobile (481-640px)

- **Circle:** 36×36px
- **Label:** 10px, truncated
- **Line offset:** 40px

### Small Mobile (<480px)

- **Circle:** 36×36px
- **Label:** hidden
- **Line offset:** 32px
- **Circle margin-bottom:** 0 (no label gap)

## Best Practices

### Auto-Advance on Form Completion

```typescript
const handleFormSubmit = async (data) => {
  await saveFormData(data)
  // Auto-advance to next step
  if (currentStep < 4) {
    setCurrentStep(currentStep + 1)
  }
}
```

### Prevent Skipping Steps

```typescript
const goToStep = (step: number) => {
  // Only allow going back or to the current step
  if (step <= currentStep) {
    setCurrentStep(step)
  }
}
```

### Persist Progress

```typescript
// Save to localStorage
useEffect(() => {
  localStorage.setItem('checkoutStep', currentStep.toString())
}, [currentStep])

// Restore on mount
useEffect(() => {
  const saved = localStorage.getItem('checkoutStep')
  if (saved) {
    setCurrentStep(parseInt(saved) as 1 | 2 | 3 | 4)
  }
}, [])
```

## Integration with Other Components

- **EC11: ShippingMethodCard** - Step 2 (Verzending)
- **EC12: PaymentMethodCard** - Step 3 (Betaling)
- **EC14: AddressForm** - Step 1 (Gegevens)
- **EC07: OrderSummary** - Displays throughout checkout
- **C25: ProgressSteps** - Generic reusable pattern

## Testing Checklist

- [ ] Progress line fills correctly (0%, 33%, 67%, 100%)
- [ ] Completed steps show green checkmark (not number)
- [ ] Active step has stronger shadow than others
- [ ] Pending steps are grey and not clickable
- [ ] Transitions smooth between states
- [ ] Circles have 3px white border
- [ ] Labels match step states (green/teal/grey)
- [ ] Mobile: labels hidden on <480px screens
- [ ] Screen reader announces current step
- [ ] `aria-current="step"` on active step
- [ ] If clickable: completed steps navigate back
- [ ] If clickable: pending steps don't respond to clicks

## Component Location

```
src/branches/ecommerce/components/checkout/CheckoutProgressStepper/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Checkout
**Complexity:** Medium (state management, responsive, progress calculation)
**Priority:** 🔴 CRITICAL (Phase 1 - Checkout Flow)
**Last Updated:** February 25, 2026
