# Phase 2: AI Content Generator Implementation Plan

## Overview
The AI Content Generator is an intelligent assistant integrated into the Payload CMS admin panel that helps users create professional website content, including text, images, and complete page layouts.

## Architecture

### 1. API Integration Layer
**Location**: `/src/lib/ai/`

#### Components:
- **OpenAI Client** (`/src/lib/ai/openai.ts`)
  - Text generation (GPT-4 for content)
  - Image generation (DALL-E 3 for visuals)
  - Error handling and rate limiting
  - Token usage tracking

- **Prompt Engineering** (`/src/lib/ai/prompts.ts`)
  - Content generation prompts
  - Image generation prompts
  - SEO optimization prompts
  - Brand voice consistency

#### Environment Variables:
```env
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4-turbo-preview
AI_IMAGE_MODEL=dall-e-3
```

### 2. Payload Admin UI Integration
**Location**: `/src/components/AI/`

#### Components:
- **AIContentGenerator** (`AIContentGenerator.tsx`)
  - Main UI component in admin panel
  - Context-aware suggestions
  - Preview and edit interface

- **AIBlockBuilder** (`AIBlockBuilder.tsx`)
  - Intelligent block recommendations
  - Auto-populate block fields
  - Block type selection

- **AIImageGenerator** (`AIImageGenerator.tsx`)
  - Generate featured images
  - Create gallery images
  - Hero backgrounds

- **AIContentOptimizer** (`AIContentOptimizer.tsx`)
  - SEO suggestions
  - Readability improvements
  - Tone adjustments

### 3. API Routes
**Location**: `/src/app/api/ai/`

#### Endpoints:
```
POST /api/ai/generate-content
POST /api/ai/generate-image
POST /api/ai/suggest-blocks
POST /api/ai/optimize-seo
POST /api/ai/complete-page
```

### 4. Custom Payload Fields
**Location**: `/src/fields/`

#### AI-Enhanced Fields:
- **AITextField** - Text generation button
- **AITextareaField** - Longer content with AI assist
- **AIRichTextField** - Lexical editor with AI toolbar
- **AIImageField** - Generate images from descriptions

## Features

### 2.1 Content Generation
**User Story**: As a content creator, I want to generate professional text content based on brief descriptions.

**Features**:
- Generate page titles and descriptions
- Create hero section copy
- Write service descriptions
- Generate FAQ items
- Create testimonial content
- Blog post generation

**Implementation**:
```typescript
// Example usage in admin panel
const generateContent = async (prompt: string, context: ContentContext) => {
  const response = await fetch('/api/ai/generate-content', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      context,
      tone: 'professional',
      language: 'nl',
    }),
  })
  return response.json()
}
```

### 2.2 Image Generation
**User Story**: As a designer, I want to generate custom images that match my brand.

**Features**:
- Generate featured images
- Create hero backgrounds
- Generate icon illustrations
- Create gallery images
- Logo variations

**Implementation**:
- DALL-E 3 integration
- Brand color palette awareness
- Style consistency
- Automatic upload to Media collection

### 2.3 Block Intelligence
**User Story**: As a page builder, I want smart suggestions for which blocks to add next.

**Features**:
- Analyze existing page content
- Suggest complementary blocks
- Auto-populate block fields
- Maintain content flow
- SEO-aware block ordering

**Algorithm**:
```typescript
// Analyze page and suggest next blocks
const suggestBlocks = (currentLayout: Block[]) => {
  // Analyze existing blocks
  const hasHero = currentLayout.some(b => b.blockType === 'hero')
  const hasServices = currentLayout.some(b => b.blockType === 'services')
  const hasCTA = currentLayout.some(b => b.blockType === 'cta')

  // Suggest missing essential blocks
  const suggestions = []
  if (!hasHero) suggestions.push({ type: 'hero', priority: 'high' })
  if (!hasServices) suggestions.push({ type: 'services', priority: 'medium' })
  if (!hasCTA) suggestions.push({ type: 'cta', priority: 'high' })

  return suggestions
}
```

### 2.4 Complete Page Generation
**User Story**: As a business owner, I want to generate a complete website page from a simple description.

**Features**:
- Analyze business information
- Generate appropriate page structure
- Create all content (text + images)
- Apply SEO best practices
- Brand voice consistency

**Workflow**:
1. User provides: business info, page type, target audience
2. AI generates: page structure, block selection, content
3. User reviews and edits
4. One-click publish or save as draft

### 2.5 SEO Optimization
**User Story**: As a marketer, I want AI to help me optimize content for search engines.

**Features**:
- Meta title/description suggestions
- Keyword optimization
- Content structure analysis
- Readability scoring
- Internal linking suggestions

## Technical Implementation

### Phase 2.1: Setup & Infrastructure (Week 1)
- [ ] Install OpenAI SDK
- [ ] Create AI service layer
- [ ] Set up environment variables
- [ ] Create base API routes
- [ ] Error handling and logging

### Phase 2.2: Content Generation (Week 2)
- [ ] Implement text generation API
- [ ] Create AITextField component
- [ ] Create AITextareaField component
- [ ] Integrate with Pages collection
- [ ] Add to Blog Posts collection
- [ ] Prompt engineering and testing

### Phase 2.3: Image Generation (Week 3)
- [ ] Implement DALL-E 3 integration
- [ ] Create AIImageGenerator component
- [ ] Automatic upload to Media collection
- [ ] Image optimization
- [ ] Brand style consistency

### Phase 2.4: Block Intelligence (Week 4)
- [ ] Build block suggestion algorithm
- [ ] Create AIBlockBuilder component
- [ ] Integrate with Layout Builder
- [ ] Auto-populate block fields
- [ ] Context-aware suggestions

### Phase 2.5: Complete Page Generation (Week 5)
- [ ] Build page generation API
- [ ] Create wizard interface
- [ ] Integrate all AI features
- [ ] Preview system
- [ ] Testing and refinement

### Phase 2.6: SEO Optimization (Week 6)
- [ ] SEO analysis API
- [ ] Integration with SEO plugin
- [ ] Content scoring
- [ ] Optimization suggestions
- [ ] Testing and documentation

## UI/UX Design

### Admin Panel Integration Points

1. **Page Editor**
   - Floating AI assistant button
   - Inline content generation
   - Block suggestions sidebar

2. **Field Level**
   - AI icon button next to text fields
   - Quick generation tooltip
   - Context menu with AI options

3. **New Page Wizard**
   - "Generate with AI" option
   - Step-by-step wizard
   - Business info form
   - Preview and customize

4. **Media Library**
   - "Generate Image" button
   - Prompt input
   - Style selector
   - Preview gallery

## Data Flow

```
User Input (Description/Prompt)
    ↓
Admin UI Component
    ↓
API Route (/api/ai/*)
    ↓
AI Service Layer
    ↓
OpenAI API (GPT-4 / DALL-E)
    ↓
Response Processing
    ↓
Payload Database (if saved)
    ↓
Admin UI Update
```

## Security & Rate Limiting

### API Key Security
- Store in environment variables
- Never expose to client
- Server-side only

### Rate Limiting
```typescript
// Rate limit per user
const rateLimit = {
  maxRequests: 50,
  windowMs: 60 * 60 * 1000, // 1 hour
  keyGenerator: (req) => req.user.id,
}
```

### Cost Management
- Token usage tracking
- Monthly budget limits
- User quotas
- Admin monitoring dashboard

## Testing Strategy

### Unit Tests
- AI service layer functions
- Prompt generation
- Response parsing
- Error handling

### Integration Tests
- API routes
- Payload integration
- Database operations
- File uploads

### E2E Tests
- Complete page generation flow
- Image generation and upload
- Content editing workflow
- SEO optimization

## Success Metrics

- **Generation Success Rate**: > 95%
- **User Satisfaction**: > 4.5/5
- **Time Saved**: 70% reduction in content creation time
- **Content Quality**: Professional grade (human reviewed)
- **Error Rate**: < 2%

## Future Enhancements (Post-Phase 2)

1. **Multi-language Support**
   - Automatic translation
   - Language-specific optimization

2. **A/B Testing**
   - Generate variations
   - Performance tracking

3. **Voice & Video**
   - Text-to-speech
   - Video script generation

4. **Advanced Personalization**
   - Target audience segments
   - Dynamic content

5. **Learning System**
   - Learn from user edits
   - Improve over time
   - Custom brand models

## Dependencies

- `openai` - ^4.0.0
- `@payloadcms/ui` - ^3.75.0
- `react-hook-form` - ^7.0.0
- `zod` - ^3.0.0 (validation)

## Estimated Timeline

**Total Duration**: 6 weeks

- Week 1: Infrastructure
- Week 2: Content Generation
- Week 3: Image Generation
- Week 4: Block Intelligence
- Week 5: Complete Page Generation
- Week 6: SEO Optimization & Polish

## Next Steps

1. Review and approve this plan
2. Set up OpenAI account and API keys
3. Begin Phase 2.1 implementation
4. Schedule weekly progress reviews
