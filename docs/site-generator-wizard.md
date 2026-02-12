# Site Generator Wizard - Implementation Plan

## 🎯 Goal
A 5-step wizard that generates a complete, production-ready website in 5 minutes based on user input.

---

## 📋 Wizard Flow

### Step 1: Company Information
**Input Fields:**
- Company Name (required)
- Business Type (B2B, B2C, Non-profit, E-commerce)
- Industry (Tech, Healthcare, Education, etc.)
- Target Audience (description)
- Core Values (3-5 keywords)
- Unique Selling Points (3-5 bullet points)

### Step 2: Design Preferences
**Input Fields:**
- Color Scheme (primary, secondary, accent colors)
- Design Style (Modern, Classic, Minimalist, Bold)
- Logo Upload (optional)
- Font Preferences (Serif, Sans-serif, Monospace)

### Step 3: Content Settings
**Input Fields:**
- Language (NL, EN, DE, FR, ES, IT, PT)
- Tone of Voice (Professional, Casual, Friendly, Authoritative)
- Pages to Generate:
  - ✅ Home (required)
  - ☐ About Us
  - ☐ Services
  - ☐ Portfolio
  - ☐ Testimonials
  - ☐ Blog
  - ☐ Contact

### Step 4: Features
**Input Fields:**
- ☐ Contact Form
- ☐ Newsletter Signup
- ☐ Testimonials Section
- ☐ FAQ Section
- ☐ Social Media Links
- ☐ Google Maps Integration
- ☐ Call-to-Action Buttons

### Step 5: Generate!
**Process:**
1. Show real-time progress
2. Generate all content in background
3. Create Payload CMS entries
4. Optimize SEO
5. Show preview link

---

## 🏗️ Technical Architecture

### 1. Wizard UI Component
**Location:** `/src/components/SiteGenerator/Wizard.tsx`

**Sub-components:**
- `WizardStep1Company.tsx` - Company info form
- `WizardStep2Design.tsx` - Design preferences
- `WizardStep3Content.tsx` - Content settings
- `WizardStep4Features.tsx` - Feature selection
- `WizardStep5Generate.tsx` - Generation progress

**State Management:**
```typescript
interface WizardState {
  currentStep: 1 | 2 | 3 | 4 | 5
  companyInfo: {
    name: string
    businessType: string
    industry: string
    targetAudience: string
    coreValues: string[]
    usps: string[]
  }
  design: {
    colorScheme: {
      primary: string
      secondary: string
      accent: string
    }
    style: string
    logo?: File
    fontPreference: string
  }
  content: {
    language: string
    tone: string
    pages: string[]
  }
  features: {
    contactForm: boolean
    newsletter: boolean
    testimonials: boolean
    faq: boolean
    socialMedia: boolean
    maps: boolean
    cta: boolean
  }
}
```

### 2. Site Generator Service
**Location:** `/src/lib/siteGenerator/SiteGeneratorService.ts`

**Responsibilities:**
- Orchestrate entire site generation process
- Call AI services in correct order
- Handle errors and retries
- Track progress
- Write to Payload CMS

**Core Methods:**
```typescript
class SiteGeneratorService {
  async generateSite(wizardData: WizardState): Promise<GeneratedSite>

  private async generateHomePage(data: WizardState): Promise<Page>
  private async generateAboutPage(data: WizardState): Promise<Page>
  private async generateServicesPage(data: WizardState): Promise<Page>
  private async generateContactPage(data: WizardState): Promise<Page>

  private async generateBlocks(pageType: string, data: WizardState): Promise<Block[]>
  private async optimizeSEO(page: Page, data: WizardState): Promise<SEOData>

  private async saveToPayload(site: GeneratedSite): Promise<void>

  private async sendProgress(jobId: string, progress: number, message: string): Promise<void>
}
```

### 3. API Endpoints

#### POST `/api/wizard/generate-site`
**Request:**
```json
{
  "wizardData": { ...WizardState },
  "sseConnectionId": "optional-for-progress"
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "site-gen-123456",
  "message": "Site generation started",
  "estimatedTime": "3-5 minutes",
  "sseUrl": "/api/ai/stream/connection-id"
}
```

#### GET `/api/wizard/status/:jobId`
**Response:**
```json
{
  "jobId": "site-gen-123456",
  "status": "processing" | "completed" | "failed",
  "progress": 65,
  "currentStep": "Generating About page",
  "result": { ...GeneratedSite } // when completed
}
```

### 4. Background Worker
**Location:** `/src/lib/queue/workers/siteGeneratorWorker.ts`

**Process:**
```
1. Receive job with wizard data
2. Generate business context (AI summary)
3. For each page:
   - Generate page structure
   - Generate blocks (Hero, Features, CTA, etc.)
   - Generate content for each block
   - Optimize images
   - Generate SEO metadata
4. Create Payload entries:
   - Create Media entries (images)
   - Create Block entries
   - Create Page entries
   - Create Site Settings entry
5. Send completion notification
```

### 5. Progress Updates (SSE)
**Real-time messages:**
```
0%   - Starting site generation...
10%  - Analyzing business requirements...
20%  - Generating home page structure...
30%  - Creating home page content...
40%  - Generating about page...
50%  - Creating service descriptions...
60%  - Generating contact page...
70%  - Optimizing images...
80%  - Creating SEO metadata...
90%  - Saving to database...
100% - Site generation complete!
```

---

## 🎨 Page Templates

### Home Page Structure
```
Hero Block
  - Headline (AI generated)
  - Subheadline (AI generated)
  - CTA Button
  - Hero Image (AI generated)

Features Block (3 columns)
  - Feature 1 (icon, title, description)
  - Feature 2 (icon, title, description)
  - Feature 3 (icon, title, description)

About Preview Block
  - Company intro (AI generated)
  - Core values
  - CTA to full about page

Testimonials Block (if enabled)
  - 3 placeholder testimonials

CTA Block
  - Action-oriented headline
  - Contact button
```

### About Page Structure
```
Hero Block
  - Page title
  - Tagline

Story Block
  - Company story (AI generated)
  - Mission statement

Values Block
  - Core values with descriptions

Team Block (optional)
  - Placeholder for team members

CTA Block
```

### Services Page Structure
```
Hero Block
  - Page title
  - Services overview

Service Cards (3-6 services)
  - Service icon
  - Service name (AI generated)
  - Description (AI generated)
  - CTA button

Why Choose Us Block
  - Competitive advantages

CTA Block
```

### Contact Page Structure
```
Hero Block
  - Page title

Contact Info Block
  - Address (from wizard)
  - Phone (from wizard)
  - Email (from wizard)

Contact Form Block (if enabled)
  - Name field
  - Email field
  - Message field
  - Submit button

Map Block (if enabled)
  - Google Maps embed
```

---

## 📊 Data Flow

```
User completes wizard
    ↓
POST /api/wizard/generate-site
    ↓
Validate wizard data
    ↓
Create BullMQ job
    ↓
Return job ID (instant response)
    ↓
Background Worker starts
    ↓
├─ Generate business context
│  └─ AI analyzes company info
│
├─ For each selected page:
│  ├─ Generate page structure
│  ├─ Generate blocks
│  │  ├─ Block 1: Generate content
│  │  ├─ Block 2: Generate content
│  │  └─ Block 3: Generate content
│  ├─ Generate SEO metadata
│  └─ Generate images (if needed)
│
├─ Create Payload entries
│  ├─ Upload images to Media
│  ├─ Create Block documents
│  ├─ Create Page documents
│  └─ Create/Update Site Settings
│
└─ Send completion notification
    ↓
User gets preview link
```

---

## 🚀 Implementation Steps

### Phase 1: Core Wizard UI (Week 1)
- [ ] Create wizard layout component
- [ ] Build step 1: Company info form
- [ ] Build step 2: Design preferences
- [ ] Build step 3: Content settings
- [ ] Build step 4: Features selection
- [ ] Build step 5: Progress display
- [ ] Add form validation
- [ ] Add step navigation

### Phase 2: Site Generator Service (Week 2)
- [ ] Create SiteGeneratorService class
- [ ] Implement page generation methods
- [ ] Implement block generation methods
- [ ] Add Payload CMS integration
- [ ] Add error handling
- [ ] Add progress tracking

### Phase 3: Background Processing (Week 2)
- [ ] Create site generator worker
- [ ] Add job queue integration
- [ ] Implement SSE progress updates
- [ ] Add job status endpoint
- [ ] Test full generation flow

### Phase 4: Polish & Testing (Week 3)
- [ ] Add loading states
- [ ] Add error states
- [ ] Add success states with preview
- [ ] Test with various inputs
- [ ] Optimize generation speed
- [ ] Add cancellation support
- [ ] Documentation

---

## 🎯 Success Criteria

✅ User can complete wizard in < 5 minutes
✅ Site generation completes in < 5 minutes
✅ Generated site is immediately viewable
✅ All content is high-quality and relevant
✅ SEO is optimized automatically
✅ Images are appropriate and optimized
✅ User can edit generated content in Payload CMS
✅ Real-time progress updates work smoothly

---

## 🔮 Future Enhancements

- Import existing content (from old website)
- Multiple design template options
- Industry-specific templates
- AI-generated logo option
- Multilingual site generation
- A/B testing content variations
- Analytics integration
- Custom domain setup wizard
- One-click deployment to Vercel/Netlify

---

## 📝 Notes

- Leverage existing AI services (already built!)
- Use BullMQ for background processing (already set up!)
- Use SSE for real-time updates (infrastructure ready!)
- Cache generated content (Redis ready!)
- Start simple, iterate based on feedback
- Focus on quality over quantity of pages
