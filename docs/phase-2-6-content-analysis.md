# Phase 2.6: Content Analysis & Improvement

**Status:** ✅ COMPLETED
**Date:** February 9, 2026

## Overview

Phase 2.6 adds **comprehensive AI-powered content analysis** with multi-dimensional quality scoring, detailed feedback, and actionable improvement suggestions. Analyze readability, tone, grammar, structure, and sentiment - all in one comprehensive report.

## Features

### 1. Complete Content Analysis
Single API call for comprehensive analysis across all dimensions:
- **Readability Analysis** - Score 0-100, reading level, sentence/word metrics
- **Tone Analysis** - Detect tone, consistency, formality level
- **Grammar Check** - Spelling, grammar, style issues with corrections
- **Structure Analysis** - Heading hierarchy, paragraph balance, flow
- **Sentiment Analysis** - Emotional tone, subjectivity, intensity
- **Improvement Suggestions** - Prioritized, actionable recommendations

### 2. Individual Analysis Types
Focused analysis for specific aspects:
- Analyze only readability for quick checks
- Check grammar without full analysis
- Get tone analysis for brand consistency
- Structural review for organization
- Sentiment check for emotional impact

### 3. Visual Analytics Component
Full-featured modal with tabbed interface:
- Overall quality score with visual gauge
- Tabbed navigation between analysis types
- Color-coded severity indicators
- Before/after examples for improvements
- Progress bars for metrics
- Badge system for categorization

## What's Been Built

### 1. Content Analyzer Service
**File:** `src/lib/ai/services/contentAnalyzer.ts` (~750 lines)

#### Core Methods

##### `analyzeContent(content, options)`
Complete multi-dimensional content analysis.

**Parameters:**
```typescript
{
  content: string           // Content to analyze (min 50 chars)
  options?: {
    language?: string       // 'nl' or 'en' (default: 'nl')
    focusAreas?: string[]   // Focus areas for improvements
    includeGrammarCheck?: boolean  // Include grammar (default: true)
  }
}
```

**Returns:**
```typescript
{
  overallScore: number      // 0-100 combined quality score
  readability: ReadabilityAnalysis
  tone: ToneAnalysis
  grammar?: GrammarCheckResult
  structure: ContentStructureAnalysis
  sentiment: SentimentAnalysis
  improvements: ImprovementSuggestion[]
  summary: string          // Human-readable summary
}
```

##### `analyzeReadability(content)`
Analyze text readability with detailed metrics.

**Returns:**
```typescript
{
  score: number           // 0-100 readability score
  level: string          // 'zeer-makkelijk' to 'zeer-moeilijk'
  metrics: {
    averageSentenceLength: number
    averageWordLength: number
    longSentencesPercentage: number    // % sentences >25 words
    difficultWordsPercentage: number   // % words >3 syllables
  }
  issues: Array<{
    type: string
    count: number
    description: string
  }>
  suggestions: string[]
}
```

##### `analyzeTone(content)`
Detect and analyze content tone.

**Returns:**
```typescript
{
  primaryTone: string           // 'professional', 'casual', 'friendly', etc.
  toneStrength: number          // 0-100 consistency
  emotionalUndertone: string    // 'confident', 'enthusiastic', etc.
  formalityLevel: string        // 'zeer-formeel' to 'zeer-informeel'
  characteristics: string[]     // Specific tone characteristics
  consistency: {
    score: number
    issues: string[]
  }
  suggestions: string[]
}
```

##### `checkGrammar(content, language)`
Check grammar, spelling, and style.

**Returns:**
```typescript
{
  totalIssues: number
  issuesBySeverity: {
    critical: number    // Obvious errors
    warning: number     // Style improvements
    suggestion: number  // Optional refinements
  }
  issues: GrammarIssue[]
  overallScore: number  // 0-100
  summary: string
}

// GrammarIssue structure
{
  type: 'spelling' | 'grammar' | 'style' | 'punctuation' | 'word-choice'
  severity: 'critical' | 'warning' | 'suggestion'
  text: string              // Current text
  suggestion: string        // Suggested correction
  explanation: string       // Why this is an issue
  position?: {              // Position in text
    start: number
    end: number
  }
}
```

##### `analyzeStructure(content)`
Analyze content organization and flow.

**Returns:**
```typescript
{
  headingStructure: {
    h1: number
    h2: number
    h3: number
    h4?: number
    optimal: boolean
    issues: string[]
  }
  paragraphs: {
    count: number
    averageLength: number
    tooLong: number         // Paragraphs >200 words
    tooShort: number        // Paragraphs <30 words
    optimal: boolean
  }
  lists: {
    count: number
    types: string[]         // 'bulleted', 'numbered'
    suggestions: string[]
  }
  flow: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  density: {
    score: number
    level: 'sparse' | 'balanced' | 'dense'
    suggestions: string[]
  }
  overallScore: number
  improvements: string[]
}
```

##### `analyzeSentiment(content)`
Analyze emotional tone and sentiment.

**Returns:**
```typescript
{
  overall: 'positive' | 'negative' | 'neutral' | 'mixed'
  score: number               // -100 (negative) to +100 (positive)
  confidence: number          // 0-100 how sure AI is
  emotionalTone: string       // 'enthusiastic', 'calm', 'concerned'
  subjectivity: number        // 0-100 (objective to subjective)
  intensity: number           // 0-100 emotional intensity
  emotions: Array<{
    emotion: string
    strength: number
  }>
  keyPhrases: Array<{
    phrase: string
    sentiment: 'positive' | 'negative' | 'neutral'
  }>
  suggestions: string[]
}
```

##### `getImprovementSuggestions(content, focusAreas?)`
Get prioritized improvement recommendations.

**Parameters:**
```typescript
{
  content: string
  focusAreas?: string[]  // ['clarity', 'engagement', 'seo', etc.]
}
```

**Returns:**
```typescript
ImprovementSuggestion[] = Array<{
  category: 'clarity' | 'engagement' | 'conciseness' | 'structure' | 'tone' | 'seo'
  priority: 'high' | 'medium' | 'low'
  issue: string                    // What the problem is
  suggestion: string               // How to fix it
  example?: {
    before: string                 // Current version
    after: string                  // Improved version
  }
  impact: string                   // Expected outcome
}>
```

### 2. AIContentAnalyzer Component
**File:** `src/components/AI/AIContentAnalyzer.tsx` (~700 lines)

Full-featured modal component with tabbed interface for comprehensive content analysis.

**Features:**
- Overall quality score with visual gauge
- 6 analysis tabs (Improvements, Readability, Tone, Grammar, Structure, Sentiment)
- Color-coded severity indicators
- Progress bars for metrics
- Before/after examples
- Badge system for categorization
- Optional callback for applying improvements

**Props:**
```typescript
{
  content: string                    // Content to analyze
  language?: string                  // 'nl' or 'en' (default: 'nl')
  onApplyImprovement?: (improvement: ImprovementSuggestion) => void
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  buttonText?: string
}
```

### 3. API Endpoints

#### Main Endpoint
**POST /api/ai/analyze-content**
Complete content analysis with all aspects.

**Request:**
```json
{
  "content": "Your content here...",
  "language": "nl",
  "focusAreas": ["clarity", "engagement"],
  "includeGrammarCheck": true
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "overallScore": 78,
    "readability": { ... },
    "tone": { ... },
    "grammar": { ... },
    "structure": { ... },
    "sentiment": { ... },
    "improvements": [ ... ],
    "summary": "Goede content kwaliteit met ruimte voor verbetering..."
  },
  "tokensUsed": 5420
}
```

#### Individual Analysis Endpoints

**POST /api/ai/analyze-readability**
```json
{ "content": "..." }
```

**POST /api/ai/analyze-tone**
```json
{ "content": "..." }
```

**POST /api/ai/check-grammar**
```json
{
  "content": "...",
  "language": "nl"
}
```

**POST /api/ai/analyze-structure**
```json
{ "content": "..." }
```

**POST /api/ai/analyze-sentiment**
```json
{ "content": "..." }
```

**POST /api/ai/get-improvements**
```json
{
  "content": "...",
  "focusAreas": ["clarity", "seo"]
}
```

## Usage Examples

### Example 1: Component Integration
```tsx
import { AIContentAnalyzer } from '@/components/AI'

function ArticleEditor() {
  const [content, setContent] = useState('')

  const handleApplyImprovement = (improvement) => {
    // Apply the suggested improvement
    console.log('Applying:', improvement.suggestion)
  }

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <AIContentAnalyzer
        content={content}
        language="nl"
        onApplyImprovement={handleApplyImprovement}
        buttonText="Analyseer Artikel"
      />
    </div>
  )
}
```

### Example 2: API Usage - Complete Analysis
```typescript
const response = await fetch('/api/ai/analyze-content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: articleContent,
    language: 'nl',
    includeGrammarCheck: true,
    focusAreas: ['clarity', 'engagement']
  })
})

const { analysis } = await response.json()

console.log('Overall Score:', analysis.overallScore)
console.log('Readability:', analysis.readability.score)
console.log('Grammar Issues:', analysis.grammar.totalIssues)
console.log('Top Improvement:', analysis.improvements[0])
```

### Example 3: API Usage - Readability Only
```typescript
const response = await fetch('/api/ai/analyze-readability', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: articleContent })
})

const { analysis } = await response.json()

if (analysis.score < 60) {
  console.warn('Content is difficult to read')
  console.log('Suggestions:', analysis.suggestions)
}
```

### Example 4: API Usage - Grammar Check
```typescript
const response = await fetch('/api/ai/check-grammar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: articleContent,
    language: 'nl'
  })
})

const { analysis } = await response.json()

// Show critical issues
const criticalIssues = analysis.issues.filter(i => i.severity === 'critical')
criticalIssues.forEach(issue => {
  console.log(`${issue.type}: ${issue.text} → ${issue.suggestion}`)
  console.log(`Reason: ${issue.explanation}`)
})
```

### Example 5: Service Usage (Server-Side)
```typescript
import { contentAnalyzer } from '@/lib/ai'

export async function analyzeArticle(content: string) {
  const result = await contentAnalyzer.analyzeContent(content, {
    language: 'nl',
    includeGrammarCheck: true,
    focusAreas: ['clarity', 'engagement', 'seo']
  })

  if (result.success) {
    const { data } = result

    // Store analysis results
    await db.contentAnalysis.create({
      content: content,
      score: data.overallScore,
      readabilityScore: data.readability.score,
      grammarScore: data.grammar?.overallScore,
      toneConsistency: data.tone.consistency.score,
      sentiment: data.sentiment.overall
    })

    return data
  }

  throw new Error(result.error)
}
```

## Score Interpretation

### Overall Quality Score
| Score | Rating | Meaning | Action |
|-------|--------|---------|--------|
| 85-100 | Uitstekend | Professional quality | Ready to publish |
| 70-84 | Goed | Good quality with minor issues | Minor tweaks recommended |
| 50-69 | Redelijk | Acceptable with improvements needed | Optimization recommended |
| 0-49 | Moet verbeteren | Significant issues | Major revisions required |

### Readability Score
| Score | Level | Target Audience |
|-------|-------|-----------------|
| 80-100 | Zeer Makkelijk | General public, children |
| 60-79 | Makkelijk | Most adults |
| 40-59 | Gemiddeld | Educated adults |
| 20-39 | Moeilijk | Specialists |
| 0-19 | Zeer Moeilijk | Experts only |

### Grammar Score
| Issues | Assessment |
|--------|------------|
| 0 | Perfect |
| 1-3 | Excellent |
| 4-8 | Good |
| 9-15 | Needs improvement |
| 16+ | Significant issues |

## Performance & Costs

### Analysis Times
| Type | Time | Cost (estimate) |
|------|------|-----------------|
| Complete Analysis | 15-25s | €0.03-0.05 |
| Readability Only | 3-5s | €0.006-0.01 |
| Tone Analysis | 3-5s | €0.006-0.01 |
| Grammar Check | 5-8s | €0.01-0.015 |
| Structure Analysis | 3-5s | €0.006-0.01 |
| Sentiment Analysis | 3-5s | €0.006-0.01 |
| Improvements | 5-8s | €0.01-0.015 |

### Token Usage
- **Complete Analysis:** ~4,000-6,000 tokens (all analyses in parallel)
- **Individual Analysis:** ~800-1,200 tokens each
- **Grammar Check:** ~1,200-1,800 tokens (more detailed)

### Cost Optimization Tips
1. **Use Individual Endpoints** - Only analyze what you need
2. **Cache Results** - Store analyses for reuse
3. **Batch Processing** - Analyze multiple pieces in one session
4. **Skip Grammar for Drafts** - Only check grammar on near-final content
5. **Focus Areas** - Limit improvement suggestions to specific categories

## Best Practices

### 1. When to Use Complete Analysis
✅ **Use for:**
- Final content review before publishing
- Quality audits of existing content
- Comprehensive content strategy reports
- High-value content (landing pages, key articles)

❌ **Avoid for:**
- Draft content (use individual checks)
- Very short content (<100 words)
- Real-time as-you-type analysis
- Low-priority content

### 2. Readability Targets
- **Marketing content:** 70-85 (easy to makkelijk)
- **Blog posts:** 60-75 (makkelijk to gemiddeld)
- **Technical docs:** 40-60 (gemiddeld to moeilijk)
- **Academic content:** 20-40 (moeilijk)

### 3. Grammar Check Strategy
```typescript
// For drafts - skip grammar
const draftAnalysis = await contentAnalyzer.analyzeContent(content, {
  includeGrammarCheck: false
})

// For final review - include grammar
const finalAnalysis = await contentAnalyzer.analyzeContent(content, {
  includeGrammarCheck: true
})
```

### 4. Prioritizing Improvements
```typescript
const { improvements } = await contentAnalyzer.getImprovementSuggestions(
  content,
  ['clarity', 'engagement'] // Focus on specific areas
)

// Apply high priority improvements first
const highPriority = improvements.filter(i => i.priority === 'high')
const criticalImprovements = highPriority.filter(i =>
  i.category === 'clarity' || i.category === 'structure'
)
```

### 5. Tone Consistency
```typescript
// Check all pages for brand consistency
const pages = await getWebsitePages()

for (const page of pages) {
  const { tone } = await contentAnalyzer.analyzeTone(page.content)

  if (tone.primaryTone !== 'professional' || tone.consistency.score < 80) {
    console.warn(`Page "${page.title}" has inconsistent tone`)
    console.log('Issues:', tone.consistency.issues)
  }
}
```

## Integration Patterns

### Pattern 1: Content Quality Dashboard
```tsx
function ContentQualityDashboard({ articles }) {
  const [analyses, setAnalyses] = useState([])

  useEffect(() => {
    async function analyzeAll() {
      const results = await Promise.all(
        articles.map(article =>
          fetch('/api/ai/analyze-content', {
            method: 'POST',
            body: JSON.stringify({ content: article.content })
          }).then(r => r.json())
        )
      )
      setAnalyses(results)
    }
    analyzeAll()
  }, [articles])

  return (
    <div>
      {analyses.map((analysis, i) => (
        <QualityCard
          key={i}
          title={articles[i].title}
          score={analysis.analysis.overallScore}
          issues={analysis.analysis.improvements.filter(
            i => i.priority === 'high'
          )}
        />
      ))}
    </div>
  )
}
```

### Pattern 2: Auto-Improve Content
```typescript
async function autoImproveContent(content: string) {
  // Get improvement suggestions
  const { suggestions } = await fetch('/api/ai/get-improvements', {
    method: 'POST',
    body: JSON.stringify({
      content,
      focusAreas: ['clarity', 'conciseness']
    })
  }).then(r => r.json())

  // Apply high-priority improvements automatically
  let improved = content

  suggestions
    .filter(s => s.priority === 'high' && s.example)
    .forEach(s => {
      improved = improved.replace(s.example.before, s.example.after)
    })

  return improved
}
```

### Pattern 3: Quality Gate
```typescript
async function canPublish(content: string): Promise<boolean> {
  const { analysis } = await fetch('/api/ai/analyze-content', {
    method: 'POST',
    body: JSON.stringify({ content })
  }).then(r => r.json())

  // Quality requirements
  const requirements = {
    overallScore: 70,
    readabilityScore: 60,
    maxCriticalGrammarIssues: 0,
    minToneConsistency: 75
  }

  return (
    analysis.overallScore >= requirements.overallScore &&
    analysis.readability.score >= requirements.readabilityScore &&
    (analysis.grammar?.issuesBySeverity.critical || 0) <= requirements.maxCriticalGrammarIssues &&
    analysis.tone.consistency.score >= requirements.minToneConsistency
  )
}
```

## Testing

### Test Complete Analysis
```bash
curl -X POST http://localhost:3015/api/ai/analyze-content \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Dit is een test artikel. Het bevat meerdere zinnen. Sommige zijn lang en andere kort. We testen de leesbaarheid, toon, en structuur. Het artikel moet voldoende lang zijn voor een goede analyse. Daarom voegen we nog meer tekst toe. Dit helpt de AI om betere suggesties te geven. De grammatica moet ook correct zijn. En de structuur logisch. Zo krijgen we een complete analyse van de content kwaliteit.",
    "language": "nl",
    "includeGrammarCheck": true
  }'
```

### Test Readability
```bash
curl -X POST http://localhost:3015/api/ai/analyze-readability \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Een korte, duidelijke zin. Gevolgd door een langere zin met meer woorden en complexere structuur. En weer een korte."
  }'
```

### Test Grammar
```bash
curl -X POST http://localhost:3015/api/ai/check-grammar \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Dit is een test met mogelijke fouten. Het bevat mogelijk spelfouten of grammatica problemen.",
    "language": "nl"
  }'
```

## Troubleshooting

### Issue: "Content too short" Error
**Solution:** Ensure content is at least 50 characters for most analyses, 20 for sentiment.

### Issue: Analysis Takes Too Long
**Solution:** Use individual endpoints instead of complete analysis, or reduce content length.

### Issue: Grammar Check Shows No Issues But Text Has Problems
**Solution:** Grammar check is AI-powered and may miss subtle issues. Consider human review for critical content.

### Issue: Inconsistent Tone Detection
**Solution:** Provide more context (minimum 200 words) for accurate tone analysis.

## Future Enhancements

- **Real-time Analysis** - As-you-type analysis for instant feedback
- **Plagiarism Detection** - Check for duplicate content
- **SEO Integration** - Combine with SEO analyzer for complete optimization
- **Multi-language Support** - Full support for EN, DE, FR, ES
- **Custom Scoring Rules** - Define your own quality criteria
- **Historical Tracking** - Track content quality over time
- **Automated Fixes** - Auto-apply safe improvements
- **Team Benchmarks** - Compare content quality across team members

## Summary

Phase 2.6 provides a comprehensive content quality analysis system that goes far beyond simple readability scores. With 6 different analysis types, detailed feedback, and actionable suggestions, you can ensure every piece of content meets professional quality standards.

**Key Benefits:**
- ✅ Multi-dimensional quality scoring
- ✅ Detailed, actionable feedback
- ✅ Professional grammar checking
- ✅ Tone and sentiment analysis
- ✅ Structure optimization
- ✅ Cost-effective (<€0.05 per complete analysis)
- ✅ Flexible API for custom workflows

---

**Next:** Phase 2.7 - Multi-language Support & Translation
