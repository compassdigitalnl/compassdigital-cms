# AI Content Generator - Setup Guide

## Phase 2.1: Infrastructure Setup - COMPLETED ✅

### What's Been Installed

1. **Dependencies**
   - `openai` - OpenAI SDK for GPT-4 and DALL-E 3
   - `zod` - Runtime validation for API requests

2. **File Structure**
   ```
   src/lib/ai/
   ├── types.ts              # TypeScript types
   ├── client.ts             # OpenAI client singleton
   ├── prompts.ts            # Prompt engineering
   ├── logger.ts             # Logging utility
   ├── errors.ts             # Custom error classes
   ├── index.ts              # Main exports
   └── services/
       ├── contentGenerator.ts
       └── imageGenerator.ts

   src/app/api/ai/
   ├── generate-content/route.ts
   ├── generate-image/route.ts
   └── status/route.ts
   ```

3. **Environment Variables**
   Added to `.env`:
   ```env
   OPENAI_API_KEY=
   AI_MODEL=gpt-4-turbo-preview
   AI_IMAGE_MODEL=dall-e-3
   ```

## Quick Start

### 1. Get OpenAI API Key

1. Visit: https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

### 2. Add API Key to .env

Edit `/Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app/.env`:

```env
OPENAI_API_KEY=sk-your-actual-key-here
```

### 3. Test the Setup

```bash
# Check AI service status
curl http://localhost:3015/api/ai/status

# Expected response:
{
  "available": true,
  "model": "gpt-4-turbo-preview",
  "imageModel": "dall-e-3",
  "configured": true
}
```

### 4. Test Content Generation

```bash
curl -X POST http://localhost:3015/api/ai/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a hero title for a web development company",
    "tone": "professional",
    "language": "nl"
  }'
```

### 5. Test Image Generation

```bash
curl -X POST http://localhost:3015/api/ai/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Modern professional hero background for tech company website",
    "size": "1792x1024",
    "quality": "hd"
  }'
```

## API Endpoints

### POST /api/ai/generate-content

Generate text content using GPT-4.

**Request Body:**
```typescript
{
  prompt: string              // What to generate
  context?: string            // Additional context (JSON string)
  tone?: string              // professional, casual, friendly, etc.
  language?: string          // nl, en, de, fr, es
  maxTokens?: number         // Max tokens (default: 1000)
  temperature?: number       // Creativity 0-2 (default: 0.7)
}
```

**Response:**
```typescript
{
  success: boolean
  content: string
  tokensUsed: number
  model: string
}
```

### POST /api/ai/generate-image

Generate images using DALL-E 3.

**Request Body:**
```typescript
{
  prompt: string                              // Image description
  size?: '1024x1024' | '1792x1024' | '1024x1792'
  quality?: 'standard' | 'hd'
  style?: 'vivid' | 'natural'
}
```

**Response:**
```typescript
{
  success: boolean
  image: {
    url: string
    revisedPrompt?: string
  }
  model: string
}
```

### GET /api/ai/status

Check AI service availability.

**Response:**
```typescript
{
  available: boolean
  model: string
  imageModel: string
  configured: boolean
}
```

## Usage Examples

### In TypeScript/JavaScript

```typescript
import { contentGenerator, imageGenerator } from '@/lib/ai'

// Generate content
const result = await contentGenerator.generateContent({
  prompt: 'Write a professional company description',
  tone: 'professional',
  language: 'nl',
})

if (result.success) {
  console.log(result.data)
}

// Generate image
const imageResult = await imageGenerator.generateHeroImage(
  'Modern web development company',
  ['#3B82F6', '#10B981'] // brand colors
)

if (imageResult.success) {
  console.log('Image URL:', imageResult.data.url)
}
```

### From API

```javascript
// Generate content
const response = await fetch('/api/ai/generate-content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Write a compelling CTA text',
    tone: 'persuasive',
    language: 'nl'
  })
})

const data = await response.json()
console.log(data.content)
```

## Service Methods

### ContentGeneratorService

- `generateContent(options)` - General content generation
- `generateTitle(description)` - Page titles
- `generateMetaDescription(content)` - SEO meta descriptions
- `generateHeroContent(businessInfo)` - Hero section content
- `generateServiceDescription(name, context)` - Service descriptions
- `improveContent(existing, improvements)` - Enhance existing text

### ImageGeneratorService

- `generateImage(options)` - General image generation
- `generateHeroImage(description, colors)` - Hero backgrounds
- `generateFeaturedImage(title, description)` - Blog/case images
- `generateServiceIcon(name, style)` - Service icons
- `generateTeamPhoto(description)` - Team member photos

## Error Handling

All services return a result object:

```typescript
interface AIGenerationResult<T> {
  success: boolean
  data?: T
  error?: string
  tokensUsed?: number
  model?: string
}
```

Always check `success` before using `data`:

```typescript
const result = await contentGenerator.generateContent(options)

if (!result.success) {
  console.error('AI Error:', result.error)
  return
}

// Safe to use result.data
console.log(result.data)
```

## Logging

The AI logger tracks all operations:

```typescript
import { aiLogger } from '@/lib/ai/logger'

// View recent logs
const logs = aiLogger.getLogs(50)

// View errors only
const errors = aiLogger.getLogsByLevel('error')

// View specific service logs
const contentLogs = aiLogger.getLogsByService('ContentGenerator')
```

## Cost Management

- GPT-4 Turbo: ~$0.01-0.03 per 1000 tokens
- DALL-E 3 HD: ~$0.080 per image
- DALL-E 3 Standard: ~$0.040 per image

**Tips:**
- Use `maxTokens` to limit costs
- Use `gpt-3.5-turbo` for simple tasks
- Cache generated content
- Implement rate limiting per user

## Phase 2.2: Content Generation UI Components - COMPLETED ✅

### What's Been Built

1. **Advanced AI Components**
   ```
   src/components/AI/
   ├── AIButton.tsx                    # Basic AI button
   ├── AIGenerationModal.tsx          # Modal for generation
   ├── AIFieldWrapper.tsx             # Field wrapper
   ├── AIContentGenerator.tsx         # ⭐ Advanced content generator
   ├── AITextButton.tsx               # ⭐ Inline generation buttons
   ├── AIImageGenerator.tsx           # ⭐ Image generation
   └── index.ts                       # Exports
   ```

2. **Custom Field Components**
   ```
   src/components/fields/
   ├── AITextField.tsx                # AI-enhanced text field
   ├── AITextareaField.tsx           # AI-enhanced textarea
   └── index.ts                       # Exports
   ```

3. **Component Features**

   **AIContentGenerator:**
   - Full modal interface with options
   - Tone selection (professional, casual, friendly, etc.)
   - Language selection (NL, EN, DE, FR, ES)
   - Length control (500-4000 tokens)
   - Creativity control (temperature)
   - Content history (last 10 generations)
   - Live editing before acceptance
   - Regenerate functionality

   **AITextButton:**
   - Lightweight inline generation
   - Quick AI suggestions
   - Specialized variants:
     - `AIImproveButton` - Improve existing content
     - `AITranslateButton` - Translate content
   - Error handling with toast notifications

   **AIImageGenerator:**
   - DALL-E 3 integration
   - Multiple size options (square, landscape, portrait)
   - Quality control (standard, HD)
   - Style options (vivid, natural)
   - Image preview and history
   - Download functionality
   - Cost warnings

4. **Documentation**
   - [Integration Examples Guide](./ai-integration-examples.md) - Complete integration guide
   - Field component examples
   - Page builder block examples
   - Best practices

### Usage Examples

**Basic Text Field:**
```typescript
import { AITextField } from '@/components/fields'

{
  name: 'title',
  type: 'text',
  admin: {
    components: {
      Field: AITextField
    }
  }
}
```

**Advanced Textarea:**
```typescript
import { AITextareaField } from '@/components/fields'

{
  name: 'excerpt',
  type: 'textarea',
  admin: {
    components: {
      Field: AITextareaField
    }
  }
}
```

**Custom Integration:**
```tsx
import { AIContentGenerator, AIImproveButton } from '@/components/AI'

<AIContentGenerator
  fieldName="description"
  fieldLabel="Beschrijving"
  value={description}
  onAccept={setDescription}
  defaultTone="professional"
  context={{ title, category }}
/>
```

### Testing the Components

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Payload Admin:**
   ```
   http://localhost:3015/admin
   ```

3. **Test in Collections:**
   - Go to Blog Posts or any collection
   - Look for AI generation buttons
   - Test content generation
   - Try image generation

4. **API Testing:**
   ```bash
   # Test content generation
   curl -X POST http://localhost:3015/api/ai/generate-content \
     -H "Content-Type: application/json" \
     -d '{
       "prompt": "Write a hero title for a web development company",
       "tone": "professional",
       "language": "nl"
     }'
   ```

## Phase 2.3: Block Intelligence - COMPLETED ✅

### What's Been Built

1. **Block Generator Service**
   ```
   src/lib/ai/services/blockGenerator.ts
   ```
   - Generates 8 different block types (hero, services, faq, testimonials, cta, content, pricing, team)
   - Smart prompting for each block type
   - Business context integration
   - Multiple generation modes (full, structure, smart)
   - Batch block generation
   - Smart block suggestions

2. **AIBlockGenerator Component**
   ```
   src/components/AI/AIBlockGenerator.tsx
   ```
   - Full-featured modal for block generation
   - Mode selection (full/structure/smart)
   - Business context display
   - Custom instructions input
   - Real-time preview
   - Regenerate functionality

3. **API Endpoints**
   - `POST /api/ai/generate-block` - Generate single block
   - `POST /api/ai/suggest-blocks` - Get block suggestions for page purpose
   - `POST /api/ai/generate-multiple-blocks` - Generate multiple blocks at once

4. **Documentation**
   - [Complete Block Intelligence Guide](./phase-2-3-block-intelligence.md) - Full documentation with examples

### Usage Example

```tsx
import { AIBlockGenerator } from '@/components/AI'

<AIBlockGenerator
  blockType="hero"
  blockLabel="Hero Section"
  onGenerate={(blockData) => {
    console.log('Generated:', blockData)
  }}
  businessInfo={{
    name: 'My Company',
    industry: 'Technology',
    targetAudience: 'Small businesses'
  }}
/>
```

### Testing

```bash
# Test block generation
curl -X POST http://localhost:3015/api/ai/generate-block \
  -H "Content-Type: application/json" \
  -d '{
    "blockType": "hero",
    "mode": "smart",
    "businessInfo": {
      "name": "Test Co",
      "industry": "Tech"
    }
  }'

# Test block suggestions
curl -X POST http://localhost:3015/api/ai/suggest-blocks \
  -H "Content-Type: application/json" \
  -d '{"pagePurpose": "SaaS landing page"}'
```

## Phase 2.4: Complete Page Generation - COMPLETED ✅

### What's Been Built

1. **Page Generator Service**
   ```
   src/lib/ai/services/pageGenerator.ts
   ```
   - Generates complete pages with multiple blocks
   - 5 predefined templates (landing, about, services, contact, blog)
   - Smart block selection based on page purpose
   - Automatic metadata generation (title, slug, description)
   - Page optimization capabilities
   - Multiple variation generation

2. **AIPageGenerator Component**
   ```
   src/components/AI/AIPageGenerator.tsx
   ```
   - Full-featured modal for page creation
   - Page type selector
   - Purpose description input
   - Advanced preferences (toggle blocks, set limits)
   - Two-step workflow (input → preview)
   - Regenerate functionality

3. **API Endpoints**
   - `POST /api/ai/generate-page` - Generate complete page
   - `POST /api/ai/generate-page-from-template` - Quick template-based generation
   - `GET /api/ai/page-templates` - Get available templates
   - `POST /api/ai/optimize-page` - Optimize existing page

4. **Documentation**
   - [Complete Page Generation Guide](./phase-2-4-complete-page-generation.md)
   - [Phase 2.4 Summary](./phase-2-4-summary.md)

### Usage Example

```tsx
import { AIPageGenerator } from '@/components/AI'

<AIPageGenerator
  onGenerate={(pageStructure) => {
    console.log('Generated page:', pageStructure)
    createPage(pageStructure)
  }}
  businessInfo={{
    name: 'MyCompany',
    industry: 'Technology',
    targetAudience: 'Small businesses'
  }}
/>
```

### Testing

```bash
# Test page generation
curl -X POST http://localhost:3015/api/ai/generate-page \
  -H "Content-Type: application/json" \
  -d '{
    "pagePurpose": "Landing page for SaaS product",
    "pageType": "landing"
  }'

# Test template generation
curl -X POST http://localhost:3015/api/ai/generate-page-from-template \
  -H "Content-Type: application/json" \
  -d '{
    "template": "about",
    "pagePurpose": "Company about page"
  }'

# Get available templates
curl http://localhost:3015/api/ai/page-templates
```

### Performance
- Generation time: 15-30 seconds per page
- Cost: €0.03-0.08 per page (depending on complexity)
- 5 templates available

## Phase 2.5: SEO Optimization - COMPLETED ✅

### What's Been Built

1. **SEO Optimizer Service**
   ```
   src/lib/ai/services/seoOptimizer.ts
   ```
   - Comprehensive SEO analysis with 0-100 scoring
   - Meta tag generation (title, description, OG tags, Twitter cards)
   - Keyword research (primary, long-tail, questions)
   - Content optimization for target keywords
   - Schema.org markup generation (Article, Product, FAQ, etc.)
   - SEO-friendly URL slug generation

   **Methods:**
   - `analyzeContent()` - Complete SEO analysis with score, issues, keywords, readability
   - `generateMetaTags()` - Generate optimized meta tags for any page type
   - `researchKeywords()` - Research keywords for topic with difficulty/intent
   - `optimizeContent()` - Optimize content for target keywords
   - `generateSchemaMarkup()` - Generate schema.org JSON-LD markup
   - `generateSlug()` - Generate SEO-friendly URL slugs

2. **AISEOOptimizer Component**
   ```
   src/components/AI/AISEOOptimizer.tsx
   ```
   - Full-featured SEO analysis modal
   - Visual score gauge (0-100) with color coding
   - Quick stats (word count, readability, keywords)
   - Issue list by severity (critical/warning/info)
   - Keyword analysis with density
   - Readability metrics
   - Metadata validation
   - Actionable suggestions

3. **API Endpoints**
   - `POST /api/ai/analyze-seo` - Analyze content for SEO
   - `POST /api/ai/generate-meta-tags` - Generate optimized meta tags
   - `POST /api/ai/research-keywords` - Research keywords for topic
   - `POST /api/ai/optimize-content-seo` - Optimize content for keywords
   - `POST /api/ai/generate-schema-markup` - Generate schema.org markup

4. **Documentation**
   - [Complete SEO Optimization Guide](./phase-2-5-seo-optimization.md)
   - [Phase 2.5 Summary](./phase-2-5-summary.md)

### Usage Example

```tsx
import { AISEOOptimizer } from '@/components/AI'

<AISEOOptimizer
  content={articleContent}
  title={articleTitle}
  metaDescription={articleDescription}
  targetKeywords={['ai', 'seo', 'optimization']}
  onOptimize={(analysis) => {
    console.log('SEO Score:', analysis.score)
    applySuggestions(analysis.suggestions)
  }}
/>
```

### Testing

```bash
# Test SEO analysis
curl -X POST http://localhost:3015/api/ai/analyze-seo \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your content here...",
    "title": "Page Title",
    "targetKeywords": ["seo", "optimization"]
  }'

# Test keyword research
curl -X POST http://localhost:3015/api/ai/research-keywords \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "sustainable technology",
    "industry": "Green Tech",
    "includeQuestions": true
  }'

# Test meta tag generation
curl -X POST http://localhost:3015/api/ai/generate-meta-tags \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your page content...",
    "pageType": "landing",
    "targetKeywords": ["project management"]
  }'

# Test schema markup
curl -X POST http://localhost:3015/api/ai/generate-schema-markup \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Article",
    "data": {
      "headline": "Article Title",
      "author": "Author Name"
    }
  }'
```

### SEO Score Interpretation

| Score | Rating | Action |
|-------|--------|--------|
| 80-100 | Excellent ✅ | Ready to publish |
| 60-79 | Good ⚠️ | Minor tweaks recommended |
| 40-59 | Fair ⚠️ | Needs optimization |
| 0-39 | Poor ❌ | Major fixes required |

### Performance
- Analysis time: 5-8 seconds
- Meta tag generation: 3-5 seconds
- Keyword research: 5-10 seconds
- Content optimization: 8-12 seconds
- Cost: €0.01-0.02 per analysis

## Phase 2.6: Content Analysis & Improvement - COMPLETED ✅

### What's Been Built

1. **Content Analyzer Service**
   ```
   src/lib/ai/services/contentAnalyzer.ts
   ```
   - Multi-dimensional content quality analysis
   - Readability scoring with detailed metrics
   - Tone analysis and consistency checking
   - Grammar and style checking
   - Content structure analysis
   - Sentiment analysis
   - Prioritized improvement suggestions

   **Methods:**
   - `analyzeContent()` - Complete analysis with overall score 0-100
   - `analyzeReadability()` - Readability score and metrics
   - `analyzeTone()` - Tone detection and formality level
   - `checkGrammar()` - Grammar, spelling, style issues
   - `analyzeStructure()` - Heading hierarchy, paragraph balance, flow
   - `analyzeSentiment()` - Emotional tone, sentiment score -100 to +100
   - `getImprovementSuggestions()` - Actionable improvements with examples

2. **AIContentAnalyzer Component**
   ```
   src/components/AI/AIContentAnalyzer.tsx
   ```
   - Full-featured analysis modal
   - Overall quality score with visual gauge
   - 6 analysis tabs (Improvements, Readability, Tone, Grammar, Structure, Sentiment)
   - Color-coded severity indicators
   - Before/after examples for improvements
   - Progress bars for metrics
   - Optional improvement callback

3. **API Endpoints**
   - `POST /api/ai/analyze-content` - Complete content analysis
   - `POST /api/ai/analyze-readability` - Readability analysis
   - `POST /api/ai/analyze-tone` - Tone analysis
   - `POST /api/ai/check-grammar` - Grammar checking
   - `POST /api/ai/analyze-structure` - Structure analysis
   - `POST /api/ai/analyze-sentiment` - Sentiment analysis
   - `POST /api/ai/get-improvements` - Get improvement suggestions

4. **Documentation**
   - [Complete Content Analysis Guide](./phase-2-6-content-analysis.md)
   - [Phase 2.6 Summary](./phase-2-6-summary.md)

### Usage Example

```tsx
import { AIContentAnalyzer } from '@/components/AI'

<AIContentAnalyzer
  content={articleContent}
  language="nl"
  onApplyImprovement={(improvement) => {
    console.log('Applying:', improvement.suggestion)
    applyImprovement(improvement)
  }}
/>
```

### Testing

```bash
# Test complete analysis
curl -X POST http://localhost:3015/api/ai/analyze-content \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Een test artikel met meerdere zinnen. Het bevat verschillende paragrafen. We testen de leesbaarheid, toon, en structuur. Het artikel moet voldoende lang zijn voor een goede analyse.",
    "language": "nl",
    "includeGrammarCheck": true
  }'

# Test readability only
curl -X POST http://localhost:3015/api/ai/analyze-readability \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test content voor leesbaarheidsanalyse..."
  }'

# Test grammar check
curl -X POST http://localhost:3015/api/ai/check-grammar \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test content met mogelijke grammatica fouten...",
    "language": "nl"
  }'
```

### Score Interpretation

**Overall Quality Score:**
| Score | Rating | Action |
|-------|--------|--------|
| 85-100 | Uitstekend ✅ | Ready to publish |
| 70-84 | Goed ⚠️ | Minor tweaks recommended |
| 50-69 | Redelijk ⚠️ | Optimization needed |
| 0-49 | Moet verbeteren ❌ | Major revisions required |

**Readability Levels:**
| Score | Level | Target Audience |
|-------|-------|-----------------|
| 80-100 | Zeer Makkelijk | General public |
| 60-79 | Makkelijk | Most adults |
| 40-59 | Gemiddeld | Educated adults |
| 20-39 | Moeilijk | Specialists |

### Performance
- Complete analysis: 15-25 seconds
- Individual analysis: 3-8 seconds
- Grammar check: 5-8 seconds
- Cost: €0.03-0.05 per complete analysis

## Phase 2.7: Multi-language Support - COMPLETED ✅

### What's Been Built

1. **Translation Service**
   ```
   src/lib/ai/services/translationService.ts
   ```
   - Translate content to 7 languages (NL, EN, DE, FR, ES, IT, PT)
   - Auto language detection
   - Native content generation (write originally in target language)
   - Cultural localization for regions
   - Batch translation to multiple languages
   - Translation quality comparison

   **Methods:**
   - `translate()` - Translate to single language with tone/formality control
   - `translateMultiple()` - Batch translate to multiple languages
   - `detectLanguage()` - Auto-detect language with confidence score
   - `generateInLanguage()` - Generate native content in target language
   - `localize()` - Localize for specific region with cultural adaptation
   - `compareTranslations()` - Compare translation quality

2. **AITranslator Component**
   ```
   src/components/AI/AITranslator.tsx
   ```
   - Full-featured translation modal
   - Language selector (7 languages with flags)
   - Tone and formality control
   - Side-by-side comparison
   - Confidence score display
   - Translation notes
   - Quick translate button variant

3. **AIMultiLanguage Component**
   ```
   src/components/AI/AIMultiLanguage.tsx
   ```
   - Batch translation to multiple languages
   - Multi-select language picker
   - Individual confidence scores
   - Accept all translations at once

4. **API Endpoints**
   - `POST /api/ai/translate` - Translate to single language
   - `POST /api/ai/translate-multiple` - Batch translate
   - `POST /api/ai/detect-language` - Auto-detect language
   - `POST /api/ai/generate-in-language` - Generate native content
   - `POST /api/ai/localize` - Localize for region/culture

5. **Documentation**
   - [Phase 2.7 Summary](./phase-2-7-summary.md)

### Usage Examples

**Single Translation:**
```tsx
import { AITranslator } from '@/components/AI'

<AITranslator
  content={articleContent}
  sourceLanguage="nl"
  onAccept={(translation, targetLang) => {
    saveTranslation(targetLang, translation.translatedText)
  }}
/>
```

**Multi-language:**
```tsx
import { AIMultiLanguage } from '@/components/AI'

<AIMultiLanguage
  content={articleContent}
  preselectedLanguages={['en', 'de', 'fr']}
  onAccept={(multiLangContent) => {
    Object.entries(multiLangContent.translations).forEach(([lang, trans]) => {
      saveTranslation(lang, trans.text)
    })
  }}
/>
```

### Testing

```bash
# Test translation
curl -X POST http://localhost:3015/api/ai/translate \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Welkom op onze website!",
    "targetLanguage": "en",
    "tone": "professional"
  }'

# Test multi-language
curl -X POST http://localhost:3015/api/ai/translate-multiple \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Neem contact op",
    "targetLanguages": ["en", "de", "fr"]
  }'

# Test language detection
curl -X POST http://localhost:3015/api/ai/detect-language \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Bonjour, comment allez-vous?"
  }'

# Test native generation
curl -X POST http://localhost:3015/api/ai/generate-in-language \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Schrijf een professionele welkomst",
    "targetLanguage": "de",
    "tone": "professional"
  }'
```

### Supported Languages
- 🇳🇱 Nederlands (nl)
- 🇬🇧 English (en)
- 🇩🇪 Deutsch (de)
- 🇫🇷 Français (fr)
- 🇪🇸 Español (es)
- 🇮🇹 Italiano (it)
- 🇵🇹 Português (pt)

### Performance
- Single translation: 3-6 seconds
- Multi-language (3 langs): 10-15 seconds
- Language detection: 1-2 seconds
- Native generation: 4-8 seconds
- Cost: €0.008-0.012 per translation

## Next Steps

Now that Phase 2.7 is complete, the core AI content system is fully functional! Optional enhancements:

- **Phase 2.8**: Performance Optimization (Caching, batch processing, streaming responses)
- **Phase 2.9**: A/B Testing (Generate and test content variations)
- **Phase 2.10**: Content Scheduling (Auto-publish at optimal times)

## Troubleshooting

### "AI service not available"
- Check that `OPENAI_API_KEY` is set in `.env`
- Verify the key starts with `sk-`
- Restart the dev server after adding the key

### "Rate limit exceeded"
- OpenAI has rate limits on API calls
- Wait a few minutes and try again
- Consider upgrading your OpenAI plan

### "Insufficient quota"
- Your OpenAI account has reached its limit
- Add credits at https://platform.openai.com/account/billing

### API returns empty content
- Check the prompt is clear and specific
- Try adjusting `temperature` (0.7 is balanced)
- Increase `maxTokens` if content is cut off

## Support

- OpenAI Documentation: https://platform.openai.com/docs
- API Status: https://status.openai.com
- Rate Limits: https://platform.openai.com/account/rate-limits
