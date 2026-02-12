# 🤖 AI Wizard Integration Guide

**Status:** ✅ AI Service 100% Complete | ⚠️ Needs 30 minutes to connect

---

## 📊 Current Status

**What's Ready:**
- ✅ SiteGeneratorService.ts (1029 lines, fully implemented!)
- ✅ PayloadService.ts (complete)
- ✅ All AI prompts (hero, features, testimonials, portfolio, pricing, FAQ, etc.)
- ✅ OpenAI GPT-4 integration
- ✅ Progress reporting via SSE
- ✅ Wizard UI (100% complete)

**What's Currently Active:**
- ⚠️ Simplified version (basic templates, no AI)
- Located in: `src/app/api/wizard/generate-site/route.ts`

**To Get Full AI:**
- 🔧 Replace simplified endpoint with SiteGeneratorService
- **Time:** 30 minutes
- **Difficulty:** Easy

---

## 🚀 How to Enable Full AI Generation

### Option 1: Quick Integration (30 minutes)

**Step 1: Update the API Route**

Replace `src/app/api/wizard/generate-site/route.ts` with:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { sendProgress } from '@/app/api/ai/stream/[connectionId]/route'
import { WizardState } from '@/lib/siteGenerator/types'
import { SiteGeneratorService } from '@/lib/siteGenerator/SiteGeneratorService'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes for AI processing

interface GenerateSiteRequest {
  wizardData: WizardState
  sseConnectionId: string
}

async function generateSiteWithAI(wizardData: WizardState, sseConnectionId: string) {
  try {
    // Create progress callback
    const onProgress = async (progress: number, message: string) => {
      await sendProgress(sseConnectionId, {
        type: 'progress',
        progress,
        message,
      })
    }

    // Initialize AI service
    const generator = new SiteGeneratorService(onProgress)

    // Generate complete site with AI
    const result = await generator.generateSite(wizardData)

    // Send completion
    await sendProgress(sseConnectionId, {
      type: 'complete',
      data: {
        previewUrl: result.previewUrl || '/',
        pages: result.pages.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
        })),
      },
    })

    return result
  } catch (error: any) {
    console.error('[AI Wizard] Error:', error)
    await sendProgress(sseConnectionId, {
      type: 'error',
      error: error.message || 'AI generation failed',
    })
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateSiteRequest = await request.json()
    const { wizardData, sseConnectionId } = body

    // Validate input
    if (!wizardData || !sseConnectionId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Generate unique job ID
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Start AI generation in background
    generateSiteWithAI(wizardData, sseConnectionId).catch((error) => {
      console.error('[AI Wizard] Background generation failed:', error)
    })

    // Return immediately with job ID
    return NextResponse.json({
      success: true,
      jobId,
      message: 'AI site generation started',
    })
  } catch (error: any) {
    console.error('[AI Wizard] API error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 },
    )
  }
}
```

**Step 2: Test It**

```bash
# 1. Start dev server
npm run dev

# 2. Go to wizard
http://localhost:3020/site-generator

# 3. Fill in wizard and click "Generate"
# AI will now create professional content!
```

---

## 🎨 What AI Generates

### Page Content (GPT-4)

**Homepage:**
- Hero section (headline, subheadline, CTA)
- Features section (3-6 features with icons)
- About preview
- Testimonials carousel
- Call-to-action

**Services Page:**
- Professional service descriptions
- Benefits and value propositions
- SEO-optimized copy

**About Page:**
- Company story (engaging narrative)
- Core values in action
- Team highlights
- Future vision

**Contact Page:**
- Contact information formatted
- Form copy
- Location details
- Social media links

**Portfolio Page:**
- Case studies with:
  - Project descriptions
  - Challenges
  - Solutions
  - Results with metrics

**Pricing Page:**
- Pricing tiers (3 packages)
- Feature comparisons
- Value-based pricing
- CTAs per tier

**FAQ Page:**
- 6-8 questions
- Detailed answers (60-100 words each)
- Addresses objections
- SEO-optimized

### SEO Elements (Auto-Generated)

**For Every Page:**
- Meta title (50-60 chars, keyword-rich)
- Meta description (150-160 chars, compelling)
- Keywords (5-8 relevant)
- JSON-LD schemas
- OG tags
- Alt text for images

### Content Quality

**AI Uses:**
- GPT-4 Turbo (latest model)
- Temperature: 0.7-0.8 (creative but controlled)
- Custom prompts per block type
- Industry-specific terminology
- Tone matching (professional, casual, friendly, authoritative)
- Language support (NL, EN, DE, FR, ES, IT, PT)

**Example AI Prompt (Hero Block):**
```
Create a compelling, conversion-focused hero section for the homepage.

Company: Acme Industrial Solutions
Industry: Manufacturing
Tone: Professional
Language: NL

Generate:
1. Headline (5-10 words, benefit-driven, emotionally engaging)
2. Subheadline (15-25 words, clarify value proposition with specificity)
3. Primary CTA (2-4 words, action-oriented, specific)
4. Secondary CTA (2-4 words, lower-commitment alternative)
```

**Result:**
```json
{
  "headline": "Transformeer Uw Productie met Slimme Automatisering",
  "subheadline": "Verhoog productiviteit met 40% en verlaag kosten door onze bewezen industriële automatiseringsoplossingen",
  "primaryCTA": "Plan Gratis Analyse",
  "secondaryCTA": "Bekijk Cases"
}
```

---

## 📊 AI Generation Process

### Step-by-Step Flow:

```
User completes wizard (5 min)
    ↓
1. Analyze Business Context (10%) - AI creates company summary
    ↓
2. Generate Pages (10-70%)
   For each page:
   - Generate metadata (SEO)
   - Generate blocks (hero, features, etc.)
   - Use user data if provided (services, testimonials)
   - AI creates professional copy if not provided
    ↓
3. Optimize SEO (70-85%)
   - Generate JSON-LD schemas
   - Create OG tags
   - Optimize keywords
    ↓
4. Save to Payload (85-100%)
   - Create pages in CMS
   - Publish content
   - Generate preview URL
    ↓
✅ Complete! (Total: 3-5 minutes)
```

### Progress Updates (SSE):

```javascript
// User sees real-time progress:
10% - Analyzing business context...
20% - Generating homepage...
30% - Creating services page...
40% - Building about page...
50% - Generating portfolio...
60% - Creating contact page...
70% - Optimizing SEO...
85% - Saving to database...
100% - Website ready! 🎉
```

---

## 🎯 User Data vs AI Generation

**How It Works:**

1. **User Provides Data:**
   - Services → AI uses exact names/descriptions
   - Testimonials → AI uses exact quotes
   - Portfolio → AI uses exact case details
   - Contact → AI uses exact info

2. **User Doesn't Provide:**
   - AI generates professional placeholders
   - Based on industry + business type
   - Realistic and industry-specific

**Example:**

```typescript
// User provides services:
services: [
  { name: "Industrial Automation", description: "Complete automation solutions" }
]

// AI expands:
"Industrial Automation: Transform uw productieproces met onze complete
automatiseringsoplossingen. Van engineering tot implementatie, wij realiseren
op maat gemaakte systemen die uw productiviteit verhogen en kosten verlagen."
```

---

## 🔧 Configuration Options

### AI Model Settings

Located in: `.env.local`

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4-turbo-preview  # Model to use
AI_IMAGE_MODEL=dall-e-3       # Image generation (not yet implemented)

# AI Parameters
OPENAI_MAX_TOKENS=4000        # Max response length
OPENAI_TEMPERATURE=0.7        # Creativity (0.0-1.0)
OPENAI_TIMEOUT=60000          # Timeout (ms)
```

### Customizing AI Prompts

**Location:** `src/lib/siteGenerator/SiteGeneratorService.ts`

**Find the `getBlockPrompt()` method (line 318)**

**Example - Customize Hero Prompt:**

```typescript
hero: `
${baseInfo}

Create a compelling hero section.

CUSTOM GUIDELINES:
- Use industry buzzwords
- Include specific metrics
- Create urgency
- Add social proof

Generate:
1. Headline (focus on transformation)
2. Subheadline (include proof point)
3. CTA (specific action)
`
```

---

## 🧪 Testing AI Generation

### Test Locally:

```bash
# 1. Ensure OpenAI API key is set
echo $OPENAI_API_KEY

# 2. Start server
npm run dev

# 3. Open wizard
http://localhost:3020/site-generator

# 4. Fill in wizard:
Company: "Test Company"
Industry: "Software Development"
Business Type: "B2B"
Pages: Home, About, Services, Contact

# 5. Click "Generate Site"

# 6. Watch progress (should take 3-5 min)

# 7. Check results:
# - Go to /admin
# - Check "Pages" collection
# - View generated pages
```

### Verify AI Quality:

```bash
# Check generated content:
1. Meta tags (SEO-optimized?)
2. Headlines (compelling?)
3. Copy (professional?)
4. CTAs (clear?)
5. Keywords (relevant?)
```

---

## ⚠️ Important Notes

### API Costs:

**GPT-4 Turbo Pricing:**
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens

**Estimated Cost Per Site:**
- 5 pages × ~2000 tokens = ~10K tokens
- Cost: ~$0.20-0.50 per site
- Very affordable!

### Rate Limits:

**OpenAI Limits:**
- Tier 1: 500 RPM, 30K TPM
- Tier 2: 5000 RPM, 450K TPM

**Platform handles:**
- Sequential generation (not parallel)
- Automatic retries
- Error handling

### Caching:

**Not Yet Implemented:**
- AI responses not cached
- Each generation is fresh
- Future: Cache common prompts

---

## 🎓 Advanced Features

### Custom Block Types

**Add your own AI-generated blocks:**

```typescript
// In SiteGeneratorService.ts

// 1. Add to getBlockPrompt():
'custom-block': `
${baseInfo}

Generate custom content for...

Respond in JSON:
{
  "field1": "...",
  "field2": "..."
}
`

// 2. Add to getPageStructure():
home: ['hero', 'features', 'custom-block', 'cta']
```

### Multi-Language Support

**Already Built In:**

```typescript
// Wizard supports:
languages: ['nl', 'en', 'de', 'fr', 'es', 'it', 'pt']

// AI generates in selected language:
content: {
  language: 'nl',  // Dutch
  tone: 'professional'
}

// Output: "Welkom bij Acme Corp..."
```

### Custom Tones

**Available:**
- Professional
- Casual
- Friendly
- Authoritative

**AI adapts writing style automatically!**

---

## 🚀 Next Steps

**To Activate AI:**
1. Replace API route (code above)
2. Test in development
3. Deploy to production
4. Monitor API costs
5. Enjoy AI-powered sites! 🎉

**Estimated Time:** 30 minutes

**Difficulty:** Easy (copy-paste code)

---

**Last Updated:** February 12, 2026
**AI Service Status:** ✅ 100% Complete
**Integration Status:** ⚠️ 30 min to activate
