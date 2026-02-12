# Phase 2.3: Block Intelligence - Complete Guide

**Status:** ✅ COMPLETED
**Date:** February 9, 2026

## Overview

Phase 2.3 introduces AI-powered block generation capabilities that allow content creators to generate complete, structured block content with a single click. This dramatically speeds up page creation and ensures consistent, high-quality content across your site.

## What is Block Intelligence?

Block Intelligence is the ability to generate complete block content (hero sections, services, FAQs, testimonials, etc.) using AI based on:
- Block type (hero, services, faq, etc.)
- Business context (name, industry, target audience)
- Custom instructions
- Generation mode (full, structure, smart)

Instead of manually filling in every field, you can now:
1. Click "Generate with AI"
2. Optionally provide context
3. Get a complete, ready-to-use block
4. Edit if needed
5. Accept and use

---

## What We Built

### 1. Block Generator Service
**Location:** `src/lib/ai/services/blockGenerator.ts`

A comprehensive AI service that:
- ✅ Generates 8 different block types
- ✅ Smart prompting for each block type
- ✅ Business context integration
- ✅ Multiple generation modes
- ✅ Batch block generation
- ✅ Smart block suggestions

**Supported Block Types:**
1. **Hero** - Main page headers with titles and CTAs
2. **Services** - Service/product listings
3. **FAQ** - Frequently asked questions
4. **Testimonials** - Customer reviews
5. **CTA** - Call-to-action sections
6. **Content** - Rich text content blocks
7. **Pricing** - Pricing tables with plans
8. **Team** - Team member profiles

**Generation Modes:**
- **Full**: Complete, realistic content
- **Structure**: Basic structure with placeholders
- **Smart**: Context-aware, intelligent content

### 2. AIBlockGenerator Component
**Location:** `src/components/AI/AIBlockGenerator.tsx`

A full-featured modal component for block generation:
- ✅ Generation mode selection
- ✅ Business context display
- ✅ Custom instructions input
- ✅ Real-time preview
- ✅ Regenerate functionality
- ✅ JSON preview
- ✅ Accept and use

### 3. API Endpoints

#### POST /api/ai/generate-block
Generate a single block with full customization.

**Request:**
```json
{
  "blockType": "hero",
  "mode": "smart",
  "customPrompt": "Focus on sustainability",
  "businessInfo": {
    "name": "EcoTech Solutions",
    "industry": "Green Technology",
    "targetAudience": "Environmentally conscious businesses"
  },
  "language": "nl"
}
```

**Response:**
```json
{
  "success": true,
  "blockData": {
    "title": "Duurzame Technologie voor een Betere Toekomst",
    "subtitle": "EcoTech Solutions helpt bedrijven hun CO2-voetafdruk te verminderen met innovatieve groene technologie.",
    "primaryCTA": {
      "text": "Start Groen",
      "link": "/contact"
    },
    "secondaryCTA": {
      "text": "Onze Impact",
      "link": "/impact"
    }
  },
  "tokensUsed": 245,
  "model": "gpt-4-turbo-preview"
}
```

#### POST /api/ai/suggest-blocks
Get AI suggestions for which blocks to use.

**Request:**
```json
{
  "pagePurpose": "Landing page for SaaS product targeting small businesses",
  "businessInfo": {
    "industry": "Software"
  }
}
```

**Response:**
```json
{
  "success": true,
  "blocks": ["hero", "services", "pricing", "testimonials", "faq", "cta"]
}
```

#### POST /api/ai/generate-multiple-blocks
Generate multiple blocks at once.

**Request:**
```json
{
  "blockTypes": ["hero", "services", "cta"],
  "businessInfo": {
    "name": "WebDesign Pro",
    "industry": "Web Design"
  }
}
```

**Response:**
```json
{
  "success": true,
  "blocks": {
    "hero": { /* hero data */ },
    "services": { /* services data */ },
    "cta": { /* cta data */ }
  }
}
```

---

## Usage Examples

### Example 1: Basic Block Generation

```tsx
import { AIBlockGenerator } from '@/components/AI'

export const MyPage = () => {
  const handleBlockGenerated = (blockData: any) => {
    console.log('Generated block:', blockData)
    // Add block to page...
  }

  return (
    <AIBlockGenerator
      blockType="hero"
      blockLabel="Hero Section"
      onGenerate={handleBlockGenerated}
    />
  )
}
```

### Example 2: With Business Context

```tsx
import { AIBlockGenerator } from '@/components/AI'

const businessInfo = {
  name: 'TechStart',
  industry: 'Software Development',
  targetAudience: 'Startups and SMBs',
}

export const PageBuilder = () => {
  return (
    <div>
      <h2>Add Block</h2>
      <AIBlockGenerator
        blockType="services"
        blockLabel="Services"
        onGenerate={handleGenerate}
        businessInfo={businessInfo}
        variant="default"
        size="lg"
        buttonText="Generate Services Block"
      />
    </div>
  )
}
```

### Example 3: Direct API Usage

```typescript
// Generate a hero block
const response = await fetch('/api/ai/generate-block', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    blockType: 'hero',
    mode: 'smart',
    customPrompt: 'Focus on innovation and speed',
    businessInfo: {
      name: 'FastTrack',
      industry: 'Logistics',
      targetAudience: 'E-commerce businesses',
    },
  }),
})

const { blockData } = await response.json()
console.log(blockData)
```

### Example 4: Get Block Suggestions

```typescript
// Ask AI which blocks to use
const response = await fetch('/api/ai/suggest-blocks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pagePurpose: 'Product landing page for project management software',
    businessInfo: {
      industry: 'SaaS',
    },
  }),
})

const { blocks } = await response.json()
// blocks = ["hero", "services", "pricing", "testimonials", "cta"]
```

### Example 5: Generate Multiple Blocks

```typescript
// Generate a complete page structure
const response = await fetch('/api/ai/generate-multiple-blocks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    blockTypes: ['hero', 'services', 'pricing', 'faq', 'cta'],
    businessInfo: {
      name: 'CloudSync',
      industry: 'Cloud Storage',
      targetAudience: 'Remote teams',
    },
  }),
})

const { blocks } = await response.json()
// blocks = { hero: {...}, services: {...}, pricing: {...}, faq: {...}, cta: {...} }
```

---

## Block Type Details

### Hero Block
Generates compelling hero sections with:
- Attention-grabbing title (max 60 chars)
- Value proposition subtitle (max 160 chars)
- Primary and secondary CTAs

**Example Output:**
```json
{
  "title": "Transformeer Je Bedrijf met Cloud Technologie",
  "subtitle": "CloudSync maakt samenwerken eenvoudig met veilige cloud opslag en real-time sync voor je hele team.",
  "primaryCTA": {
    "text": "Start Gratis Trial",
    "link": "/trial"
  },
  "secondaryCTA": {
    "text": "Bekijk Demo",
    "link": "/demo"
  }
}
```

### Services Block
Generates service listings with:
- Section heading
- Introduction text
- 4-6 services with names, descriptions, and links

**Example Output:**
```json
{
  "heading": "Onze Diensten",
  "intro": "Wij bieden complete cloud oplossingen voor moderne teams.",
  "services": [
    {
      "name": "Cloud Opslag",
      "description": "Veilige en schaalbare opslag met 99.99% uptime garantie.",
      "link": "/diensten/cloud-opslag"
    }
  ],
  "layout": "grid-3"
}
```

### FAQ Block
Generates FAQ sections with:
- Section heading
- 6-8 relevant questions with detailed answers

**Example Output:**
```json
{
  "heading": "Veelgestelde Vragen",
  "items": [
    {
      "question": "Hoe veilig is mijn data?",
      "answer": "Al je data wordt versleuteld opgeslagen met AES-256 encryptie..."
    }
  ],
  "generateSchema": true
}
```

### Testimonials Block
Generates customer reviews with:
- Section heading
- 4-5 authentic-sounding testimonials with names, roles, and ratings

### Pricing Block
Generates pricing tables with:
- 3 pricing tiers (Basic, Pro, Enterprise)
- Realistic pricing
- Feature lists
- CTAs

### CTA Block
Generates persuasive call-to-action sections

### Content Block
Generates rich text content with headings and paragraphs

### Team Block
Generates team member profiles with bios

---

## Integration Patterns

### Pattern 1: Add to Page Builder

```tsx
// In your page builder component
import { AIBlockGenerator } from '@/components/AI'
import { useState } from 'react'

export const PageBuilder = () => {
  const [blocks, setBlocks] = useState([])

  const handleAddBlock = (blockType: string, blockData: any) => {
    setBlocks([...blocks, { type: blockType, data: blockData }])
  }

  return (
    <div>
      <div className="block-selector">
        <AIBlockGenerator
          blockType="hero"
          blockLabel="Hero"
          onGenerate={(data) => handleAddBlock('hero', data)}
        />
        <AIBlockGenerator
          blockType="services"
          blockLabel="Services"
          onGenerate={(data) => handleAddBlock('services', data)}
        />
        {/* More block generators... */}
      </div>

      <div className="blocks-preview">
        {blocks.map((block, i) => (
          <BlockPreview key={i} type={block.type} data={block.data} />
        ))}
      </div>
    </div>
  )
}
```

### Pattern 2: Smart Page Wizard

```tsx
// Wizard that suggests and generates blocks
export const SmartPageWizard = () => {
  const [purpose, setPurpose] = useState('')
  const [suggestedBlocks, setSuggestedBlocks] = useState([])
  const [generatedBlocks, setGeneratedBlocks] = useState({})

  const handleGetSuggestions = async () => {
    const res = await fetch('/api/ai/suggest-blocks', {
      method: 'POST',
      body: JSON.stringify({ pagePurpose: purpose }),
    })
    const { blocks } = await res.json()
    setSuggestedBlocks(blocks)
  }

  const handleGenerateAll = async () => {
    const res = await fetch('/api/ai/generate-multiple-blocks', {
      method: 'POST',
      body: JSON.stringify({ blockTypes: suggestedBlocks }),
    })
    const { blocks } = await res.json()
    setGeneratedBlocks(blocks)
  }

  return (
    <div>
      <h2>What type of page do you want to create?</h2>
      <input
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        placeholder="E.g., Landing page for a SaaS product"
      />
      <button onClick={handleGetSuggestions}>Get Suggestions</button>

      {suggestedBlocks.length > 0 && (
        <div>
          <h3>Suggested Blocks:</h3>
          <ul>
            {suggestedBlocks.map((block) => (
              <li key={block}>{block}</li>
            ))}
          </ul>
          <button onClick={handleGenerateAll}>Generate All Blocks</button>
        </div>
      )}

      {/* Preview generated blocks... */}
    </div>
  )
}
```

### Pattern 3: Context-Aware Generation

```tsx
// Use form data as context
export const ContextAwareBlockGen = () => {
  const businessInfo = useBusinessInfo() // From form/settings

  return (
    <AIBlockGenerator
      blockType="testimonials"
      blockLabel="Testimonials"
      businessInfo={businessInfo}
      onGenerate={handleGenerate}
    />
  )
}
```

---

## Best Practices

### 1. Provide Rich Context
The more context you provide, the better the results:

```typescript
// Good ✅
{
  businessInfo: {
    name: 'EcoClean',
    industry: 'Green Cleaning Services',
    targetAudience: 'Environmentally conscious homeowners',
    tone: 'friendly'
  },
  customPrompt: 'Emphasize eco-friendly products and local service'
}

// Basic ❌
{
  businessInfo: {
    name: 'EcoClean'
  }
}
```

### 2. Use the Right Mode

- **Structure**: For quick prototyping
- **Smart**: For production-ready content (recommended)
- **Full**: For maximum detail and realism

### 3. Review and Edit

Always review AI-generated content:
1. Check for accuracy
2. Verify links and references
3. Adjust tone if needed
4. Ensure brand consistency

### 4. Batch Generation

For new pages, generate multiple blocks at once:

```typescript
// Efficient ✅
await fetch('/api/ai/generate-multiple-blocks', {
  body: JSON.stringify({
    blockTypes: ['hero', 'services', 'faq', 'cta'],
  }),
})

// Less efficient ❌
for (const type of ['hero', 'services', 'faq', 'cta']) {
  await fetch('/api/ai/generate-block', { body: JSON.stringify({ blockType: type }) })
}
```

### 5. Cache Business Info

Store business information to reuse across generations:

```typescript
// Store in context/state
const businessInfo = useMemo(
  () => ({
    name: siteName,
    industry: siteIndustry,
    targetAudience: siteAudience,
  }),
  [siteName, siteIndustry, siteAudience],
)

// Use in all block generations
<AIBlockGenerator businessInfo={businessInfo} {...props} />
```

---

## Cost Considerations

**Estimated Costs:**
- Hero block: ~250 tokens = €0.003
- Services block: ~500 tokens = €0.006
- FAQ block: ~800 tokens = €0.010
- Pricing block: ~600 tokens = €0.008

**Cost Optimization:**
- Use 'structure' mode for prototyping (cheaper)
- Batch generate blocks when possible
- Cache generated content
- Consider implementing rate limiting

---

## API Response Times

**Average Generation Times:**
- Simple blocks (Hero, CTA): 2-4 seconds
- Medium blocks (Services, Team): 4-6 seconds
- Complex blocks (FAQ, Pricing): 6-10 seconds
- Multiple blocks: 10-20 seconds

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here",
  "details": { /* Optional error details */ }
}
```

**Common Errors:**
- `Invalid request data` - Check your request schema
- `Unknown block type` - Use a supported block type
- `OpenAI client not configured` - Check OPENAI_API_KEY
- `Rate limit exceeded` - Wait and retry

---

## Testing

### Test Block Generation

```bash
# Test hero block
curl -X POST http://localhost:3015/api/ai/generate-block \
  -H "Content-Type: application/json" \
  -d '{
    "blockType": "hero",
    "mode": "smart",
    "businessInfo": {
      "name": "Test Company",
      "industry": "Technology"
    }
  }'
```

### Test Block Suggestions

```bash
curl -X POST http://localhost:3015/api/ai/suggest-blocks \
  -H "Content-Type: application/json" \
  -d '{
    "pagePurpose": "Landing page for a SaaS product"
  }'
```

---

## Next Steps

Phase 2.3 is complete! You can now:

1. **Use AIBlockGenerator** in your page builder
2. **Test block generation** with different types
3. **Integrate suggestions** into your workflow
4. **Build custom wizards** using the APIs

**Coming in Phase 2.4:**
- Complete page generation from a single prompt
- Page templates with AI
- Smart layout suggestions
- Multi-language support

---

## Resources

- [AI Setup Guide](./ai-setup-guide.md)
- [Block Structure Docs](../BLOCKS_README.md)
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)

## Support

For issues or questions:
1. Check API response for error details
2. Verify OPENAI_API_KEY is set
3. Review block type spelling
4. Check request schema matches documentation
