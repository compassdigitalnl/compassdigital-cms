# Sprint 7 Implementation Plan

**Date:** February 24, 2026
**Sprint:** 7 of 10
**Status:** 🚀 Ready to Start
**Blocks:** 3 (B16, B25, B31)
**Category:** Forms & Communication

---

## 📋 Executive Summary

Sprint 7 implements **3 forms & communication blocks** to enable contact information display, contact forms, and newsletter signups. This sprint involves both creating new blocks (Contact, Newsletter) and replacing an existing minimal ContactForm block with a comprehensive version.

### Blocks in Scope

1. **B16 - Contact** - Contact information with address, phone, email, opening hours, and optional map
2. **B25 - ContactForm** - Full-featured contact form with configurable fields and sidebar
3. **B31 - Newsletter** - Email newsletter signup with success states and privacy text

---

## 🎯 Sprint Objectives

### Phase 1: Backend Configuration (CMS)
- Create folder-based block structure for all 3 blocks
- Replace existing `ContactFormBlock.ts` with new folder structure
- Implement comprehensive Payload configs with all required fields
- Define TypeScript interfaces for type safety

### Phase 2: Frontend Components (React)
- Implement full React components for all 3 blocks
- Add form handling with validation and error states
- Integrate with existing form submission API
- Responsive designs (mobile/tablet/desktop)
- Accessibility compliance

---

## 📦 Block Specifications

### B16 - Contact Block

**Purpose:** Display comprehensive contact information with optional map integration

**Fields:**
- Header
  - `title` (text, required) - "Neem contact op"
  - `subtitle` (text) - "Wij staan altijd voor je klaar"
- Address Group
  - `address.street` (text) - "Keizersgracht 123"
  - `address.postalCode` (text) - "1015 DJ"
  - `address.city` (text) - "Amsterdam"
- Contact Details
  - `phone` (text) - "020 - 123 45 67"
  - `email` (email) - "info@company.com"
- Opening Hours (array)
  - `openingHours[].day` (text, required) - "Maandag - Vrijdag"
  - `openingHours[].hours` (text, required) - "09:00 - 17:00"
- Map Settings
  - `showMap` (checkbox, default: true)
  - `mapUrl` (text, conditional) - Google Maps embed URL

**Features:**
- 2-column layout (info left, map right)
- Lucide icons for each contact method
- Clickable phone/email links (tel:, mailto:)
- Opening hours with day/time separator lines
- Optional Google Maps iframe integration
- Responsive: stacks on mobile

**Database Tables:**
- `pages_blocks_contact`
- `pages_blocks_contact_opening_hours`

---

### B25 - ContactForm Block

**Purpose:** Full-featured contact form with configurable fields and contact info sidebar

**Status:** Replaces existing minimal `ContactFormBlock.ts`

**Fields:**
- Header
  - `title` (text, default: "Neem contact op")
  - `description` (textarea) - "Vul het formulier in..."
- Form Configuration
  - `showPhone` (checkbox, default: true) - Show phone field
  - `showSubject` (checkbox, default: true) - Show subject field
  - `submitTo` (email, required) - Recipient email
- Contact Info Sidebar (group)
  - `contactInfo.phone` (text) - "020 - 123 45 67"
  - `contactInfo.email` (email) - "info@company.com"
  - `contactInfo.address` (textarea) - Multi-line address
  - `contactInfo.hours` (text) - "Ma-Vr: 09:00-17:00"
- Messages
  - `successMessage` (text, default: "Bedankt! We nemen contact op.")
  - `errorMessage` (text, default: "Er ging iets mis...")

**Features:**
- 2-column layout (form left, info sidebar right)
- Configurable fields (name, email, phone, subject, message)
- Client-side validation (required fields, email format)
- Form submission via `/api/contact` endpoint
- Success/error states with messages
- Loading state during submission
- Responsive: stacks on mobile

**Database Tables:**
- `pages_blocks_contactform` (replaces existing table structure)

---

### B31 - Newsletter Block

**Purpose:** Email newsletter signup with success states and privacy messaging

**Fields:**
- Header
  - `title` (text, required, default: "Blijf op de hoogte")
  - `description` (textarea) - Optional description
- Form Configuration
  - `buttonLabel` (text, default: "Inschrijven")
  - `placeholder` (text, default: "Je email adres...")
  - `backgroundColor` (select) - white, grey, teal, navy
- Messages
  - `privacyText` (text, default: "We respecteren je privacy. Geen spam.")
  - `successMessage` (text, default: "Bedankt! Check je inbox.")
  - `errorMessage` (text, default: "Er ging iets mis...")

**Features:**
- Horizontal inline form (email input + button)
- 4 background color variants
- Email validation
- Success state with checkmark icon
- Privacy reassurance text
- Responsive: button goes full-width on mobile

**Database Tables:**
- `pages_blocks_newsletter`

---

## 📁 File Structure

```
src/branches/shared/blocks/
├── Contact/                          # NEW
│   ├── config.ts                     # Payload configuration
│   └── Component.tsx                 # React component
├── ContactFormBlock/                 # REPLACE
│   ├── config.ts                     # NEW comprehensive config
│   └── Component.tsx                 # REPLACE with full form
├── Newsletter/                       # NEW
│   ├── config.ts                     # Payload configuration
│   └── Component.tsx                 # React component
└── ContactFormBlock.ts               # DELETE (old single-file)
```

---

## ⚙️ Implementation Steps

### Step 1: Create B16 Contact Block

**File:** `src/branches/shared/blocks/Contact/config.ts`
- Define Payload block configuration
- Fields: title, subtitle, address group, phone, email, openingHours array, showMap, mapUrl
- Opening hours: array field with day/hours row

**File:** `src/branches/shared/blocks/Contact/Component.tsx`
- Server component (no state needed)
- 2-column grid layout
- Lucide icons: MapPin, Phone, Mail, Clock, Map
- Conditional map rendering (iframe or placeholder)
- Opening hours rendering with separator lines
- Clickable links for phone/email

### Step 2: Replace B25 ContactForm Block

**Delete:** `src/branches/shared/blocks/ContactFormBlock.ts`

**File:** `src/branches/shared/blocks/ContactFormBlock/config.ts` (NEW)
- Comprehensive Payload configuration
- Fields: title, description, showPhone, showSubject, submitTo, contactInfo group, messages
- Conditional fields for sidebar contact info

**File:** `src/branches/shared/blocks/ContactFormBlock/Component.tsx` (REPLACE)
- Client component (form state, submission)
- useState for form data, loading, success, error states
- Form validation (required fields, email format)
- Submit to `/api/contact` endpoint
- 2-column layout: form + sidebar
- Success/error message display
- Loading spinner during submission

### Step 3: Create B31 Newsletter Block

**File:** `src/branches/shared/blocks/Newsletter/config.ts`
- Define Payload block configuration
- Fields: title, description, buttonLabel, placeholder, backgroundColor, privacyText, successMessage, errorMessage
- Background color select: white, grey, teal, navy

**File:** `src/branches/shared/blocks/Newsletter/Component.tsx`
- Client component (form state)
- useState for email, loading, success, error
- Email validation
- Submit to `/api/newsletter` endpoint (or existing endpoint)
- Horizontal inline form layout
- 4 background variants with conditional styling
- Success state with CheckCircle icon
- Privacy text below form

### Step 4: Integration

**File:** `src/branches/shared/collections/Pages/index.ts`
- Import all 3 block configs
- Add to blocks array in appropriate sections:
  - Contact → "Forms & Communication"
  - ContactFormBlock → "Forms & Communication"
  - Newsletter → "Forms & Communication"

**File:** `src/branches/shared/blocks/RenderBlocks.tsx`
- Import all 3 components
- Add to `blockComponents` mapping:
  - `contact`: ContactBlockComponent
  - `contactForm`: ContactFormBlockComponent
  - `newsletter`: NewsletterBlockComponent

### Step 5: Build & Test

**Commands:**
```bash
# Test TypeScript compilation
npx tsc --noEmit

# Test build
npm run build

# Check for errors
npm run lint
```

**Verification:**
- Build passes without errors
- All 3 blocks visible in Payload admin
- Components render correctly
- Forms validate properly

---

## 🔧 Technical Requirements

### Dependencies (Existing)
- ✅ `lucide-react` - Icons
- ✅ `next/link` - Navigation
- ✅ `react` - Components
- ✅ TypeScript types from `@/payload-types`

### New API Endpoints (Optional)
- `/api/contact` - Already exists for contact form submissions
- `/api/newsletter` - May need to create or reuse contact endpoint with type parameter

### Component Types
- **Server Components:** Contact (no form state)
- **Client Components:** ContactFormBlock, Newsletter (form state, validation, submission)

---

## 📊 Success Criteria

### Phase 1: Backend (CMS Configuration)
- [ ] B16 Contact config created with all fields
- [ ] B25 ContactForm old .ts file deleted
- [ ] B25 ContactForm comprehensive config created
- [ ] B31 Newsletter config created
- [ ] All blocks integrated in Pages collection
- [ ] RenderBlocks updated with mappings
- [ ] Build passes (`npm run build`)

### Phase 2: Frontend (React Components)
- [ ] B16 Contact component implemented
  - [ ] 2-column responsive layout
  - [ ] All icons display correctly
  - [ ] Clickable phone/email links work
  - [ ] Opening hours render correctly
  - [ ] Map iframe loads (when URL provided)
- [ ] B25 ContactForm component implemented
  - [ ] Form validation works
  - [ ] Submission to `/api/contact` works
  - [ ] Success/error states display
  - [ ] Sidebar renders contact info
  - [ ] Responsive layout stacks correctly
- [ ] B31 Newsletter component implemented
  - [ ] Email validation works
  - [ ] Background color variants work
  - [ ] Success state shows checkmark
  - [ ] Privacy text displays
  - [ ] Responsive button full-width on mobile
- [ ] Build passes without errors
- [ ] All TypeScript types correct

---

## 🗄️ Database Migration

**Tables to Create:**
1. `pages_blocks_contact` (main table)
2. `pages_blocks_contact_opening_hours` (array table)
3. `pages_blocks_contactform` (replaces existing)
4. `pages_blocks_newsletter` (main table)

**Migration Command:**
```bash
npx payload migrate:create sprint7_forms_communication
```

**Expected Changes:**
- CREATE TABLE `pages_blocks_contact`
- CREATE TABLE `pages_blocks_contact_opening_hours`
- ALTER/DROP/CREATE TABLE `pages_blocks_contactform` (replacement)
- CREATE TABLE `pages_blocks_newsletter`

---

## 📝 Documentation

### Files to Create
1. `docs/refactoring/SPRINT_7_IMPLEMENTATION_PLAN.md` (this file)
2. `docs/refactoring/SPRINT_7_PROGRESS.md` (after completion)

### Existing HTML Specs
1. `docs/refactoring/sprint-7/b16-contact.html` (complete visual spec)
2. `docs/refactoring/sprint-7/b25-contactform.html` (complete visual spec)
3. `docs/refactoring/sprint-7/b31-newsletter.html` (complete visual spec)

---

## 🚨 Known Challenges

### 1. ContactForm Replacement
**Challenge:** Existing `ContactFormBlock.ts` has data in database. Replacing may require migration.

**Solution:**
- Check if any pages use the old ContactFormBlock
- If yes, migration must preserve data
- If no, safe to replace

### 2. API Endpoints
**Challenge:** Newsletter block needs `/api/newsletter` endpoint.

**Solutions:**
- Option A: Create new `/api/newsletter` endpoint
- Option B: Reuse `/api/contact` endpoint with `type: 'newsletter'` parameter
- Option C: Frontend-only (POST to external service like Mailchimp)

**Recommendation:** Option B - reuse existing contact API with type parameter for simplicity.

### 3. Google Maps Embed
**Challenge:** Google Maps requires API key and iframe embedding.

**Solution:**
- Use iframe embed URL (no API key needed for basic embedding)
- User provides full embed URL from Google Maps "Share" → "Embed"
- Component renders iframe if URL provided, placeholder otherwise

---

## ⏱️ Estimated Time

- **Phase 1 (Backend):** ~1.5 hours
  - B16 Contact config: 30 min
  - B25 ContactForm replacement: 30 min
  - B31 Newsletter config: 20 min
  - Integration: 10 min

- **Phase 2 (Frontend):** ~3 hours
  - B16 Contact component: 45 min
  - B25 ContactForm component: 90 min (forms complex)
  - B31 Newsletter component: 45 min

- **Testing & Documentation:** ~30 min

**Total:** ~5 hours

---

## 🎯 Sprint 7 Deliverables

### Code Deliverables
1. ✅ 3 complete block configurations (Contact, ContactForm, Newsletter)
2. ✅ 3 full React components with form handling
3. ✅ Integration in Pages collection
4. ✅ RenderBlocks mapping
5. ✅ Database migration file (pending manual run)

### Documentation Deliverables
1. ✅ Sprint 7 Implementation Plan (this document)
2. ✅ Sprint 7 Progress Report (after completion)
3. ✅ Code comments and JSDoc headers
4. ✅ Usage examples in config files

### Quality Deliverables
1. ✅ Type-safe TypeScript throughout
2. ✅ Responsive designs
3. ✅ Accessibility compliance
4. ✅ Form validation
5. ✅ Error handling
6. ✅ Build passes

---

## 📚 References

- **HTML Specs:** `docs/refactoring/sprint-7/*.html`
- **Sprint 6 (reference):** `docs/refactoring/SPRINT_6_PROGRESS.md`
- **Contact API:** `src/app/api/contact/route.ts`
- **Payload Docs:** https://payloadcms.com/docs

---

**Created:** February 24, 2026
**Status:** 📋 Planning Complete - Ready for Implementation
**Next Step:** Begin Phase 1 - Backend Configuration
