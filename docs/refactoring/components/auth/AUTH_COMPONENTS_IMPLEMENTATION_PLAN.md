# AUTH COMPONENTS IMPLEMENTATION PLAN
**Authentication & User Management Components**

**Document Created:** 25 February 2026
**Status:** 📋 READY FOR IMPLEMENTATION
**Total Components:** 12 auth components
**Source:** HTML prototypes in `docs/refactoring/components/auth/`

---

## 📋 EXECUTIVE SUMMARY

This document outlines the implementation of **12 authentication components** for login, registration, and guest checkout flows. All components follow the established theme system and are fully responsive.

**Component Categories:**
- **Layout Components** (2): AuthLayout, AuthBrandingPanel
- **Navigation Components** (1): AuthTabSwitcher
- **Form Components** (4): LoginForm, RegisterForm, GuestCheckoutForm, FormInput
- **Enhancement Components** (3): OAuthButtons, PasswordStrengthMeter, TrustBadges
- **Information Components** (2): B2BNotice, GuestInfoBox

**Goals:**
- 100% theme variable compliant (NO hardcoded colors)
- Responsive design (mobile-first, 900px breakpoint)
- Accessibility (WCAG 2.1 AA)
- Type-safe (full TypeScript)
- Integration with Payload CMS auth system

---

## 🏗️ COMPONENT SPECIFICATIONS

### **Category 1: Layout Components (2 components)**

#### **1. AuthLayout** (auth01)

**Location:** `src/branches/shared/components/auth/AuthLayout/`

**Purpose:** Master 2-column layout container for all auth pages (login, register, guest checkout)

**Features:**
- ✅ 2-column grid layout: `1fr 1fr` (50/50 split)
- ✅ Left panel: Branding content (AuthBrandingPanel)
- ✅ Right panel: Form content (440px max-width wrapper)
- ✅ Min-height: `calc(100vh - 140px)` to account for header/footer
- ✅ Responsive: 1-column layout below 900px (branding panel hidden)
- ✅ Theme variables only

**Props:**
```typescript
interface AuthLayoutProps {
  children: React.ReactNode // Form content (right panel)
  brandingContent?: React.ReactNode // Custom branding (optional)
  hideBranding?: boolean // Force hide branding panel
}
```

**Structure:**
```tsx
<div className="auth-layout">
  {/* LEFT: Branding Panel (hidden on mobile) */}
  <AuthBrandingPanel />

  {/* RIGHT: Form Panel */}
  <div className="auth-form-panel">
    <div className="auth-form-wrapper">
      {children}
    </div>
  </div>
</div>
```

**Responsive Breakpoints:**
- Desktop (>900px): 2-column grid
- Tablet/Mobile (≤900px): 1-column, branding hidden, reduced padding

**Theme Variables:**
- `--bg` (background color)
- `--radius` (border radius)

---

#### **2. AuthBrandingPanel** (auth02)

**Location:** `src/branches/shared/components/auth/AuthBrandingPanel/`

**Purpose:** Left-side branding panel with gradient background, company messaging, and feature highlights

**Features:**
- ✅ Navy gradient background: `linear-gradient(160deg, var(--navy) 0%, var(--navy-deep) 50%, #041526 100%)`
- ✅ Decorative gradient orbs (teal + coral, pseudo-elements)
- ✅ Company badge with pulsing dot animation
- ✅ Large title with accent color (DM Serif Display font)
- ✅ Description text with opacity
- ✅ 4 feature cards with icons (emoji or Lucide icons)
- ✅ Auto-hidden on mobile (<900px)

**Props:**
```typescript
interface AuthBrandingPanelProps {
  badge?: string // Company tagline (default: "Uw medische partner sinds 1994")
  title: string | React.ReactNode // Main title (can include <span> for accent)
  description: string // Subtitle text
  features: Array<{
    icon: string // Lucide icon name or emoji
    title: string // Feature title (bold)
    description: string // Feature description
  }>
}
```

**Default Features:**
```typescript
[
  {
    icon: '💰', // or 'coins'
    title: 'Persoonlijke staffelprijzen',
    description: 'Afgestemd op uw bestelvolume'
  },
  {
    icon: '🔄', // or 'refresh-cw'
    title: 'Quick-order & nabestellen',
    description: 'Herbestel in 2 klikken vanuit uw historie'
  },
  // ... 2 more features
]
```

**Animations:**
- Pulsing dot: `@keyframes pulse-dot` (2s infinite)
- Gradient orbs: Static pseudo-elements with blur effect

**Theme Variables:**
- `--navy`, `--navy-deep` (gradient background)
- `--teal`, `--teal-light` (accent colors, badge)
- `--font`, `--font-display` (typography)

---

### **Category 2: Navigation Components (1 component)**

#### **3. AuthTabSwitcher** (auth03)

**Location:** `src/branches/shared/components/auth/AuthTabSwitcher/`

**Purpose:** Tab navigation for switching between Login, Register, and Guest Checkout

**Features:**
- ✅ 3 tabs: Inloggen, Registreren, Gast bestellen
- ✅ Active state: Navy background + white text + shadow
- ✅ Inactive state: Transparent background + grey text
- ✅ Hover state: Light grey background (non-active tabs)
- ✅ Smooth transitions: `0.25s ease`
- ✅ Fade-slide animation for panel content: `0.35s ease`
- ✅ Keyboard navigation support (Tab, Enter, Arrow keys)

**Props:**
```typescript
interface AuthTabSwitcherProps {
  tabs: Array<{
    id: string // 'login' | 'register' | 'guest'
    label: string // Tab label text
  }>
  activeTab: string // Currently active tab ID
  onTabChange: (tabId: string) => void // Tab change callback
  className?: string
}
```

**State Management:**
```typescript
const [activeTab, setActiveTab] = useState<string>('login')
```

**Animations:**
```css
@keyframes fadeSlide {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Theme Variables:**
- `--navy` (active tab background)
- `--white` (active tab text, background)
- `--grey`, `--grey-mid`, `--grey-light` (borders, inactive states)
- `--r-sm`, `--r-md` (border radius)

---

### **Category 3: Form Components (4 components)**

#### **4. LoginForm** (auth04)

**Location:** `src/branches/shared/components/auth/LoginForm/`

**Purpose:** Login form with email/password + OAuth options

**Features:**
- ✅ Form title: "Welkom terug" (DM Serif Display, 28px)
- ✅ Form subtitle: "Log in met uw account om verder te gaan." (14px, grey)
- ✅ OAuth buttons at top (optional, via OAuthButtons component)
- ✅ Divider: "of met e-mail" (horizontal line + text)
- ✅ Email input (FormInput component)
- ✅ Password input with show/hide toggle (FormInput with type="password")
- ✅ "Wachtwoord vergeten?" link (right-aligned, teal color)
- ✅ Remember me checkbox (optional)
- ✅ Submit button: Teal gradient, white text, full-width
- ✅ Loading state: Spinner on button
- ✅ Error messages: Red text below inputs
- ✅ TrustBadges at bottom (optional)

**Props:**
```typescript
interface LoginFormProps {
  onSubmit: (data: { email: string; password: string; rememberMe?: boolean }) => Promise<void>
  showOAuth?: boolean // Default: true
  showRememberMe?: boolean // Default: true
  showTrustBadges?: boolean // Default: true
  isLoading?: boolean
  error?: string
}
```

**Validation:**
- Email: Required, valid email format
- Password: Required, min 8 characters

**Submit Flow:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  try {
    await onSubmit({ email, password, rememberMe })
  } catch (err) {
    setError(err.message)
  } finally {
    setIsLoading(false)
  }
}
```

---

#### **5. RegisterForm** (auth05)

**Location:** `src/branches/shared/components/auth/RegisterForm/`

**Purpose:** Registration form with company info + password strength validation

**Features:**
- ✅ Form title: "Account aanmaken" (DM Serif Display, 28px)
- ✅ Form subtitle: "Maak een zakelijk account aan voor persoonlijke prijzen."
- ✅ B2BNotice at top: "Uw aanvraag wordt binnen 1 werkdag beoordeeld."
- ✅ OAuth buttons (optional)
- ✅ Divider: "of met e-mail"
- ✅ 2-column grid layout for fields (responsive to 1-col on mobile)
- ✅ Fields:
  - Voornaam + Achternaam (side-by-side)
  - E-mailadres (full-width)
  - Bedrijfsnaam + KVK-nummer (side-by-side)
  - Telefoonnummer (full-width)
  - Wachtwoord with PasswordStrengthMeter (full-width)
  - Wachtwoord bevestigen (full-width)
- ✅ Terms & conditions checkbox: Required
- ✅ Newsletter opt-in checkbox: Optional
- ✅ Submit button: Teal gradient, "Account aanmaken"
- ✅ Loading state + validation errors

**Props:**
```typescript
interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>
  showOAuth?: boolean // Default: true
  showB2BNotice?: boolean // Default: true
  isLoading?: boolean
  error?: string
}

interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  companyName: string
  kvkNumber: string // KVK-nummer (8 digits)
  phone: string
  password: string
  passwordConfirm: string
  acceptTerms: boolean
  subscribeNewsletter: boolean
}
```

**Validation:**
- All fields except newsletter: Required
- Email: Valid email format
- KVK: 8 digits, Dutch format
- Phone: Dutch phone number format
- Password: Min 8 chars, 1 uppercase, 1 number, 1 special char
- Password confirm: Must match password
- Terms: Must be checked

**Password Strength Integration:**
```tsx
<FormInput
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
<PasswordStrengthMeter password={password} />
```

---

#### **6. GuestCheckoutForm** (auth06)

**Location:** `src/branches/shared/components/auth/GuestCheckoutForm/`

**Purpose:** Simplified checkout form for guest users (no account creation)

**Features:**
- ✅ Form title: "Bestellen als gast"
- ✅ Form subtitle: "Geen account nodig — vul uw gegevens in en bestel direct."
- ✅ GuestInfoBox at top: Shows benefits of creating account
- ✅ Fields (all required):
  - Voornaam + Achternaam
  - E-mailadres
  - Telefoonnummer
- ✅ Email opt-in: "E-mail mij wanneer de bestelling verzonden is" (checked by default)
- ✅ Account creation opt-in: "Maak direct een account aan (aanbevolen)" (optional)
- ✅ If account opt-in checked: Show password field
- ✅ Submit button: "Doorgaan naar verzending"
- ✅ Link to register: "Of maak eerst een account aan →"

**Props:**
```typescript
interface GuestCheckoutFormProps {
  onSubmit: (data: GuestCheckoutData) => Promise<void>
  showInfoBox?: boolean // Default: true
  isLoading?: boolean
  error?: string
}

interface GuestCheckoutData {
  firstName: string
  lastName: string
  email: string
  phone: string
  emailUpdates: boolean
  createAccount: boolean
  password?: string // Only if createAccount = true
}
```

**Conditional Logic:**
```typescript
const [createAccount, setCreateAccount] = useState(false)

// Show password field only if createAccount is checked
{createAccount && (
  <FormInput
    type="password"
    label="Wachtwoord"
    required
    minLength={8}
  />
)}
```

---

#### **7. FormInput** (auth07)

**Location:** `src/branches/shared/components/auth/FormInput/`

**Purpose:** Reusable form input component with consistent styling and validation

**Features:**
- ✅ Label with optional asterisk for required fields
- ✅ Input field with focus state (teal border + glow)
- ✅ Placeholder text with grey color
- ✅ Error state: Red border + error message below
- ✅ Success state: Green border (optional)
- ✅ Helper text below input (grey, 12px)
- ✅ Icon support: Left icon (e.g., envelope, lock)
- ✅ Show/hide password toggle (for type="password")
- ✅ Disabled state: Grey background, not-allowed cursor

**Props:**
```typescript
interface FormInputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  label?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  icon?: string // Lucide icon name
  showPasswordToggle?: boolean // Auto-enabled for type="password"
  autoComplete?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  className?: string
}
```

**States:**
```typescript
const [showPassword, setShowPassword] = useState(false)
const [isFocused, setIsFocused] = useState(false)
```

**Styling:**
```css
.form-input {
  border: 1.5px solid var(--grey);
  transition: all 0.2s;
}

.form-input:focus {
  border-color: var(--teal);
  box-shadow: 0 0 0 3px rgba(0, 137, 123, 0.1);
}

.form-input.error {
  border-color: var(--coral);
}
```

**Theme Variables:**
- `--navy` (label color)
- `--teal` (focus state)
- `--coral` (error state)
- `--grey`, `--grey-mid` (borders, placeholders)
- `--white` (input background)
- `--r-sm` (border radius)

---

### **Category 4: Enhancement Components (3 components)**

#### **8. OAuthButtons** (auth08)

**Location:** `src/branches/shared/components/auth/OAuthButtons/`

**Purpose:** Social login buttons (Google, Facebook, Apple, Microsoft)

**Features:**
- ✅ Multiple OAuth providers support
- ✅ Google button with official logo (SVG inline)
- ✅ Facebook, Apple, Microsoft (optional)
- ✅ Hover effect: Subtle elevation + border color change
- ✅ Loading state: Spinner on clicked button
- ✅ Divider below: "of met e-mail" (horizontal line + text)

**Props:**
```typescript
interface OAuthButtonsProps {
  providers?: Array<'google' | 'facebook' | 'apple' | 'microsoft'> // Default: ['google']
  onProviderClick: (provider: string) => Promise<void>
  isLoading?: boolean
  activeProvider?: string // Which provider is currently loading
  showDivider?: boolean // Default: true
}
```

**Button Styling:**
```css
.oauth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px 16px;
  background: var(--white);
  border: 1.5px solid var(--grey);
  transition: all 0.2s;
}

.oauth-btn:hover {
  border-color: var(--grey-mid);
  box-shadow: 0 1px 3px rgba(10, 22, 40, 0.06);
  transform: translateY(-1px);
}
```

**Provider Logos:**
- Google: Official SVG logo (4-color)
- Facebook: Blue `#1877F2` background
- Apple: Black background with white apple icon
- Microsoft: Windows logo (4 squares)

---

#### **9. PasswordStrengthMeter** (auth09)

**Location:** `src/branches/shared/components/auth/PasswordStrengthMeter/`

**Purpose:** Real-time password strength indicator with visual feedback

**Features:**
- ✅ Horizontal progress bar with 3 strength levels
- ✅ Strength levels:
  - **Weak** (coral): 0-33%, <8 chars or missing requirements
  - **Medium** (amber): 34-66%, 8+ chars, 2/3 requirements met
  - **Strong** (teal): 67-100%, 8+ chars, all requirements met
- ✅ Label text: "Zwak", "Gemiddeld", "Sterk"
- ✅ Animated bar fill: `0.3s ease`
- ✅ Requirements checklist (optional):
  - ✓ Minimaal 8 tekens
  - ✓ Minimaal 1 hoofdletter
  - ✓ Minimaal 1 cijfer
  - ✓ Minimaal 1 speciaal teken

**Props:**
```typescript
interface PasswordStrengthMeterProps {
  password: string
  showRequirements?: boolean // Default: false
  minLength?: number // Default: 8
}
```

**Strength Calculation:**
```typescript
const calculateStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak'

  let score = 0
  if (/[a-z]/.test(password)) score++ // lowercase
  if (/[A-Z]/.test(password)) score++ // uppercase
  if (/[0-9]/.test(password)) score++ // number
  if (/[^a-zA-Z0-9]/.test(password)) score++ // special char

  if (score <= 2) return 'weak'
  if (score === 3) return 'medium'
  return 'strong'
}
```

**Visual:**
```css
.pw-bar {
  height: 4px;
  background: var(--grey);
  border-radius: 2px;
}

.pw-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.pw-fill.weak {
  width: 33%;
  background: var(--coral);
}

.pw-fill.medium {
  width: 66%;
  background: var(--amber);
}

.pw-fill.strong {
  width: 100%;
  background: var(--teal);
}
```

---

#### **10. TrustBadges** (auth10)

**Location:** `src/branches/shared/components/auth/TrustBadges/`

**Purpose:** Trust signals displayed at bottom of auth forms (SSL, GDPR, ISO certifications)

**Features:**
- ✅ Horizontal row of 3 trust items
- ✅ Each item: Icon + text label
- ✅ Default badges:
  - 🔒 SSL beveiligd
  - 🛡️ AVG compliant
  - ✓ ISO gecertificeerd
- ✅ Responsive: Stacks vertically on mobile (<640px)
- ✅ Grey text, small font (11px)

**Props:**
```typescript
interface TrustBadgesProps {
  badges?: Array<{
    icon: string // Lucide icon name or emoji
    label: string
  }>
  variant?: 'horizontal' | 'vertical' // Default: 'horizontal'
}
```

**Default Badges:**
```typescript
[
  { icon: '🔒', label: 'SSL beveiligd' },
  { icon: '🛡️', label: 'AVG compliant' },
  { icon: '✓', label: 'ISO gecertificeerd' }
]
```

**Styling:**
```css
.trust-bar {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--grey);
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--grey-mid);
  font-weight: 600;
}
```

---

### **Category 5: Information Components (2 components)**

#### **11. B2BNotice** (auth11)

**Location:** `src/branches/shared/components/auth/B2BNotice/`

**Purpose:** Informational banner about B2B account approval process

**Features:**
- ✅ Horizontal flex layout: Icon + text
- ✅ Light grey background with subtle border
- ✅ 3 variants:
  - **Pending**: "Uw aanvraag wordt binnen 1 werkdag beoordeeld."
  - **Approved**: "Zakelijk account goedgekeurd! U heeft nu toegang tot persoonlijke staffelprijzen."
  - **Info**: Custom message
- ✅ Icon changes based on variant: 🏥 (pending), ✓ (approved)
- ✅ Displayed at top of RegisterForm

**Props:**
```typescript
interface B2BNoticeProps {
  variant?: 'pending' | 'approved' | 'info' // Default: 'pending'
  message?: string // Custom message (overrides default)
  icon?: string // Custom icon (overrides default)
}
```

**Default Messages:**
```typescript
const messages = {
  pending: 'B2B registratie — Uw aanvraag wordt binnen 1 werkdag beoordeeld. Na goedkeuring ontvangt u uw persoonlijke prijsafspraken.',
  approved: 'Zakelijk account goedgekeurd! — U heeft nu toegang tot persoonlijke staffelprijzen en B2B-voordelen.',
  info: 'Registreer een zakelijk account voor exclusieve voordelen.'
}
```

**Styling:**
```css
.b2b-notice {
  background: rgba(10, 38, 71, 0.03);
  border: 1px solid rgba(10, 38, 71, 0.08);
  padding: 14px 16px;
  display: flex;
  gap: 10px;
  font-size: 13px;
  color: var(--grey-dark);
}

.b2b-notice strong {
  color: var(--navy);
}
```

---

#### **12. GuestInfoBox** (auth12)

**Location:** `src/branches/shared/components/auth/GuestInfoBox/`

**Purpose:** Information box explaining benefits of creating an account (shown in guest checkout)

**Features:**
- ✅ Teal gradient background: `linear-gradient(135deg, rgba(0,137,123,0.04), rgba(10,38,71,0.02))`
- ✅ Teal border: `1px solid rgba(0,137,123,0.12)`
- ✅ Title: "Goed om te weten" with info icon
- ✅ Description text
- ✅ 2-column grid of benefits (4 items):
  - ✓ Persoonlijke staffelprijzen
  - ✓ Bestelhistorie inzien
  - ✓ Snelle nabestellingen
  - ✓ Bestellijsten opslaan
- ✅ Responsive: 1-column grid on mobile (<480px)

**Props:**
```typescript
interface GuestInfoBoxProps {
  title?: string // Default: "Goed om te weten"
  description?: string
  benefits?: string[] // Array of benefit texts
  showIcon?: boolean // Default: true (ℹ️ icon)
}
```

**Default Benefits:**
```typescript
[
  'Persoonlijke staffelprijzen',
  'Bestelhistorie inzien',
  'Snelle nabestellingen',
  'Bestellijsten opslaan'
]
```

**Styling:**
```css
.guest-info-box {
  background: linear-gradient(135deg, rgba(0,137,123,0.04), rgba(10,38,71,0.02));
  border: 1px solid rgba(0,137,123,0.12);
  border-radius: var(--r-md);
  padding: 20px;
}

.guest-benefits {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.check {
  color: var(--teal);
  font-weight: 700;
}
```

---

## 🗂️ IMPLEMENTATION ORDER

### **Batch 11: Auth Components (Phase 1 - 12 components)**

**Estimated Time:** 6-8 hours

**Implementation Order:**

1. **FormInput** (auth07) - Foundation component (30 min)
   - Base form input with all states
   - Password toggle functionality
   - Icon support

2. **TrustBadges** (auth10) - Simple component (20 min)
   - Horizontal badge row
   - Responsive layout

3. **B2BNotice** (auth11) - Simple banner (20 min)
   - 3 variants
   - Icon + text layout

4. **GuestInfoBox** (auth12) - Info panel (30 min)
   - Gradient background
   - Benefits grid

5. **PasswordStrengthMeter** (auth09) - Validation component (45 min)
   - Strength calculation logic
   - Animated progress bar
   - Requirements checklist

6. **OAuthButtons** (auth08) - Social login (45 min)
   - Provider buttons with SVG logos
   - Loading states
   - Divider

7. **AuthBrandingPanel** (auth02) - Branding panel (1 hour)
   - Gradient background with orbs
   - Feature cards
   - Animations

8. **AuthLayout** (auth01) - Master layout (45 min)
   - 2-column grid
   - Responsive logic
   - Integration with branding panel

9. **AuthTabSwitcher** (auth03) - Tab navigation (45 min)
   - Tab state management
   - Fade-slide animations
   - Keyboard navigation

10. **LoginForm** (auth04) - Login form (1 hour)
    - Form validation
    - OAuth integration
    - Submit logic

11. **RegisterForm** (auth05) - Registration form (1.5 hours)
    - Multi-field form
    - Password strength integration
    - KVK validation
    - Terms & conditions

12. **GuestCheckoutForm** (auth06) - Guest form (1 hour)
    - Conditional account creation
    - Info box integration
    - Simplified validation

**Total Estimated Time:** 6-8 hours

---

## 🔗 DEPENDENCIES & INTEGRATIONS

### **External Libraries:**
- **Lucide React** - Icons (already installed)
- **Next.js** - Routing, Link components
- **React Hook Form** (optional) - Form validation
- **Zod** (optional) - Schema validation

### **Internal Dependencies:**
- **Theme System** - All color/spacing variables from `src/globals/`
- **Payload Auth API** - `/api/users/login`, `/api/users/create`
- **OAuth Providers** - Google OAuth setup (NextAuth or Payload OAuth)

### **Collections Needed:**
- **Users** collection (already exists in Payload)
- Optional: **OAuth Providers** collection for storing connected accounts

### **API Routes:**
```typescript
// Login
POST /api/users/login
{
  email: string
  password: string
}

// Register
POST /api/users/create
{
  firstName: string
  lastName: string
  email: string
  companyName: string
  kvkNumber: string
  phone: string
  password: string
  role: 'customer' | 'b2b-customer'
}

// Guest checkout (no user creation)
// Store guest info in session/cookie

// OAuth callback
GET /api/auth/oauth/callback?provider=google&code=...
```

---

## 📋 TESTING CHECKLIST

### **Unit Tests:**
- [ ] FormInput: All input types, validation states
- [ ] PasswordStrengthMeter: Strength calculation accuracy
- [ ] AuthTabSwitcher: Tab switching, keyboard navigation
- [ ] Form validation: LoginForm, RegisterForm, GuestCheckoutForm

### **Integration Tests:**
- [ ] Full login flow: OAuth + email/password
- [ ] Full registration flow: B2B account creation
- [ ] Guest checkout flow: Form submission
- [ ] Password reset flow (if implemented)

### **Visual Tests:**
- [ ] Responsive layouts: 900px, 640px, 480px breakpoints
- [ ] Theme compliance: All components use theme variables
- [ ] Animations: Smooth transitions, no jank
- [ ] Accessibility: Keyboard navigation, screen reader support

### **Browser Tests:**
- [ ] Chrome, Firefox, Safari (desktop)
- [ ] iOS Safari, Chrome (mobile)
- [ ] Edge (Windows)

---

## 🎨 DESIGN TOKENS

### **Typography:**
- **Form titles:** DM Serif Display, 28px, --navy
- **Form subtitles:** Plus Jakarta Sans, 14px, --grey-mid
- **Labels:** Plus Jakarta Sans, 13px, 600 weight, --navy
- **Input text:** Plus Jakarta Sans, 14px, --navy
- **Helper text:** Plus Jakarta Sans, 12px, --grey-mid

### **Colors:**
- **Primary action:** --teal gradient
- **Error state:** --coral
- **Success state:** --green
- **Warning state:** --amber
- **Neutral:** --grey, --grey-mid, --grey-dark

### **Spacing:**
- **Form spacing:** 18px between fields
- **Section spacing:** 28px between sections
- **Panel padding:** 60px (desktop), 40px (tablet), 24px (mobile)

### **Border Radius:**
- **Inputs:** --r-sm (8px)
- **Panels:** --r-md (12px)
- **Buttons:** --r-sm (8px)

---

## 🚀 DEPLOYMENT NOTES

### **Environment Variables:**
```bash
# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Email Service (for verification emails)
RESEND_API_KEY=your-resend-key

# Session Secret
PAYLOAD_SECRET=your-secret-key
```

### **Payload Config:**
```typescript
// payload.config.ts
export default buildConfig({
  collections: [
    Users, // Already exists
  ],
  admin: {
    user: Users.slug,
  },
  // OAuth setup (optional)
  oauth: {
    providers: [
      {
        provider: 'google',
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/oauth/callback`,
      },
    ],
  },
})
```

### **Next.js Pages:**
```typescript
// app/login/page.tsx
import { AuthLayout, LoginForm } from '@/branches/shared/components/auth'

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm onSubmit={handleLogin} />
    </AuthLayout>
  )
}

// app/register/page.tsx
import { AuthLayout, RegisterForm } from '@/branches/shared/components/auth'

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm onSubmit={handleRegister} />
    </AuthLayout>
  )
}

// app/checkout/guest/page.tsx
import { AuthLayout, GuestCheckoutForm } from '@/branches/shared/components/auth'

export default function GuestCheckoutPage() {
  return (
    <AuthLayout hideBranding>
      <GuestCheckoutForm onSubmit={handleGuestCheckout} />
    </AuthLayout>
  )
}
```

---

## 📊 SUCCESS CRITERIA

### **Functional Requirements:**
- [x] All 12 components implemented
- [ ] Login flow works (email + OAuth)
- [ ] Registration flow works (B2B account creation)
- [ ] Guest checkout flow works (no account)
- [ ] Password strength validation accurate
- [ ] Form validation on all fields
- [ ] Error messages user-friendly

### **Non-Functional Requirements:**
- [ ] 100% theme variable compliance (NO hardcoded colors)
- [ ] Responsive on all screen sizes (900px, 640px, 480px)
- [ ] Accessibility: WCAG 2.1 AA compliant
- [ ] TypeScript: No `any` types
- [ ] Performance: <100ms render time
- [ ] Build: No warnings or errors

---

**Document Status:** ✅ READY FOR IMPLEMENTATION
**Last Updated:** 25 February 2026
**Next Step:** Begin implementation with FormInput component (auth07)

