# AI Components Integration Guide

This guide shows how to integrate AI components with Payload CMS fields.

## Table of Contents

1. [Basic Integration](#basic-integration)
2. [Text Fields](#text-fields)
3. [Textarea Fields](#textarea-fields)
4. [Rich Text Fields](#rich-text-fields)
5. [Upload Fields](#upload-fields)
6. [Custom Field Components](#custom-field-components)
7. [Page Builder Blocks](#page-builder-blocks)
8. [Best Practices](#best-practices)

---

## Basic Integration

### 1. Import AI Components

```typescript
import {
  AIContentGenerator,
  AITextButton,
  AIImproveButton,
  AITranslateButton,
  AIImageGenerator,
  AIImageButton,
} from '@/components/AI'
```

### 2. Use in Custom Field Components

Payload CMS allows you to create custom field components that wrap existing fields with additional functionality.

---

## Text Fields

### Example: AI-Enhanced Title Field

Create a custom field component for titles with AI generation:

**File: `src/components/fields/AITitleField.tsx`**

```tsx
'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import { AIContentGenerator, AIImproveButton } from '@/components/AI'

export const AITitleField: React.FC<{ path: string }> = ({ path }) => {
  const { value, setValue } = useField<string>({ path })

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Titel</label>
        <div className="flex gap-2">
          <AIContentGenerator
            fieldName={path}
            fieldLabel="Titel"
            value={value}
            onAccept={setValue}
            defaultTone="professional"
            promptPlaceholder="Beschrijf waar de titel over moet gaan..."
            variant="secondary"
            size="sm"
          />
          {value && (
            <AIImproveButton
              currentContent={value}
              onImprove={setValue}
              improvementType="clarity"
              variant="ghost"
              size="sm"
            />
          )}
        </div>
      </div>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-2 border rounded-md"
        placeholder="Voer een titel in..."
      />
    </div>
  )
}
```

**Use in Collection:**

```typescript
// src/collections/BlogPosts.ts
import { AITitleField } from '@/components/fields/AITitleField'

export const BlogPosts: CollectionConfig = {
  // ...
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        components: {
          Field: AITitleField,
        },
      },
    },
    // ...
  ],
}
```

---

## Textarea Fields

### Example: AI-Enhanced Excerpt Field

**File: `src/components/fields/AIExcerptField.tsx`**

```tsx
'use client'

import React from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import { AIContentGenerator, AIImproveButton } from '@/components/AI'

export const AIExcerptField: React.FC<{ path: string }> = ({ path }) => {
  const { value, setValue } = useField<string>({ path })

  // Get other field values for context
  const title = useFormFields(([fields]) => fields.title?.value as string)
  const content = useFormFields(([fields]) => fields.content?.value as string)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Excerpt</label>
        <div className="flex gap-2">
          <AIContentGenerator
            fieldName={path}
            fieldLabel="Excerpt"
            value={value}
            onAccept={setValue}
            defaultTone="professional"
            promptPlaceholder="Genereer een korte samenvatting..."
            context={{ title, content }}
            variant="secondary"
            size="sm"
          />
          {value && (
            <>
              <AIImproveButton
                currentContent={value}
                onImprove={setValue}
                improvementType="brevity"
                variant="ghost"
                size="sm"
              />
              <AIImproveButton
                currentContent={value}
                onImprove={setValue}
                improvementType="seo"
                variant="ghost"
                size="sm"
              />
            </>
          )}
        </div>
      </div>
      <textarea
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-2 border rounded-md min-h-[100px]"
        placeholder="Voer een excerpt in..."
        maxLength={160}
      />
      <p className="text-xs text-gray-500">{(value || '').length}/160 tekens</p>
    </div>
  )
}
```

---

## Rich Text Fields

### Example: AI-Enhanced Rich Text

For rich text fields, you can add AI buttons to the toolbar:

**File: `src/components/fields/AIRichTextField.tsx`**

```tsx
'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import { AIContentGenerator, AIImproveButton, AITranslateButton } from '@/components/AI'

export const AIRichTextField: React.FC<{ path: string }> = ({ path }) => {
  const { value, setValue } = useField<any>({ path })

  // Extract plain text from rich text for improvement
  const getPlainText = (richText: any): string => {
    // Implement based on your rich text format (Lexical, Slate, etc.)
    return JSON.stringify(richText)
  }

  const updateRichText = (newText: string) => {
    // Convert plain text back to rich text format
    // This depends on your rich text editor
    setValue(newText)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Content</label>
        <div className="flex gap-2">
          <AIContentGenerator
            fieldName={path}
            fieldLabel="Content"
            value={getPlainText(value)}
            onAccept={updateRichText}
            defaultTone="professional"
            promptPlaceholder="Beschrijf de content die je wilt genereren..."
            variant="secondary"
            size="sm"
            buttonText="Genereer Content"
          />
          {value && (
            <>
              <AIImproveButton
                currentContent={getPlainText(value)}
                onImprove={updateRichText}
                improvementType="engagement"
                variant="ghost"
                size="sm"
              />
              <AITranslateButton
                currentContent={getPlainText(value)}
                targetLanguage="en"
                onTranslate={updateRichText}
                variant="ghost"
                size="sm"
              />
            </>
          )}
        </div>
      </div>
      {/* Your rich text editor component here */}
    </div>
  )
}
```

---

## Upload Fields

### Example: AI Image Generation for Upload Fields

**File: `src/components/fields/AIImageField.tsx`**

```tsx
'use client'

import React from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import { AIImageGenerator } from '@/components/AI'

export const AIImageField: React.FC<{ path: string }> = ({ path }) => {
  const { value, setValue } = useField<any>({ path })

  // Get context from other fields
  const title = useFormFields(([fields]) => fields.title?.value as string)
  const excerpt = useFormFields(([fields]) => fields.excerpt?.value as string)

  const handleImageGenerated = async (imageUrl: string, revisedPrompt?: string) => {
    // Upload the generated image to Payload Media
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      const formData = new FormData()
      formData.append('file', blob, `ai-generated-${Date.now()}.png`)
      if (revisedPrompt) {
        formData.append('alt', revisedPrompt)
      }

      const uploadResponse = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      const uploadedImage = await uploadResponse.json()

      if (uploadedImage.doc) {
        setValue(uploadedImage.doc.id)
      }
    } catch (error) {
      console.error('Failed to upload AI generated image:', error)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Afbeelding</label>
        <AIImageGenerator
          fieldName={path}
          fieldLabel="Hoofdafbeelding"
          onAccept={handleImageGenerated}
          promptPlaceholder={
            title
              ? `Genereer een afbeelding voor: ${title}`
              : 'Beschrijf de afbeelding...'
          }
          defaultSize="1792x1024"
          defaultQuality="hd"
          variant="secondary"
          size="sm"
        />
      </div>
      {/* Your upload field component here */}
    </div>
  )
}
```

---

## Custom Field Components

### Complete Example: Smart Blog Post Fields

Create a comprehensive custom field setup for blog posts:

**File: `src/components/fields/SmartBlogFields.tsx`**

```tsx
'use client'

import React from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import {
  AIContentGenerator,
  AIImproveButton,
  AITextButton,
  AIImageGenerator,
} from '@/components/AI'

export const SmartTitleField: React.FC<{ path: string }> = ({ path }) => {
  const { value, setValue } = useField<string>({ path })
  const topic = useFormFields(([fields]) => fields.topic?.value as string)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Titel</label>
        <div className="flex gap-2">
          {topic && (
            <AITextButton
              prompt={`Schrijf een pakkende blog titel over: ${topic}`}
              onGenerate={setValue}
              tone="engaging"
              variant="ghost"
              size="sm"
            >
              Genereer Titel
            </AITextButton>
          )}
          <AIContentGenerator
            fieldName={path}
            fieldLabel="Titel"
            value={value}
            onAccept={setValue}
            context={{ topic }}
          />
        </div>
      </div>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
    </div>
  )
}

export const SmartExcerptField: React.FC<{ path: string }> = ({ path }) => {
  const { value, setValue } = useField<string>({ path })
  const title = useFormFields(([fields]) => fields.title?.value as string)
  const content = useFormFields(([fields]) => fields.content?.value as string)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Excerpt</label>
        <div className="flex gap-2">
          {content && (
            <AITextButton
              prompt={`Schrijf een korte samenvatting (max 160 tekens) van deze blog post:\n\nTitel: ${title}\n\nContent: ${content}`}
              onGenerate={setValue}
              tone="professional"
              variant="ghost"
              size="sm"
            >
              Auto-Genereer
            </AITextButton>
          )}
          <AIContentGenerator
            fieldName={path}
            fieldLabel="Excerpt"
            value={value}
            onAccept={setValue}
            context={{ title, content }}
          />
        </div>
      </div>
      <textarea
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-2 border rounded-md min-h-[80px]"
        maxLength={160}
      />
      <p className="text-xs text-gray-500">{(value || '').length}/160</p>
    </div>
  )
}
```

---

## Page Builder Blocks

### Example: AI-Enhanced Hero Block

**File: `src/blocks/HeroBlock.ts`**

```typescript
import type { Block } from 'payload'
import { AIHeroFields } from '@/components/fields/AIHeroFields'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        components: {
          Field: AIHeroFields.HeadingField,
        },
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      admin: {
        components: {
          Field: AIHeroFields.SubheadingField,
        },
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        components: {
          Field: AIHeroFields.BackgroundImageField,
        },
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      admin: {
        components: {
          Field: AIHeroFields.CTATextField,
        },
      },
    },
  ],
}
```

**File: `src/components/fields/AIHeroFields.tsx`**

```tsx
'use client'

import React from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import { AIContentGenerator, AITextButton, AIImageGenerator } from '@/components/AI'

export const AIHeroFields = {
  HeadingField: ({ path }: { path: string }) => {
    const { value, setValue } = useField<string>({ path })
    const companyName = 'Jouw Bedrijf' // Could come from site settings

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Hero Heading</label>
          <AITextButton
            prompt={`Schrijf een krachtige hero heading voor ${companyName}, die direct de aandacht trekt`}
            onGenerate={setValue}
            tone="enthusiastic"
            variant="ghost"
            size="sm"
          >
            Genereer Heading
          </AITextButton>
        </div>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
    )
  },

  SubheadingField: ({ path }: { path: string }) => {
    const { value, setValue } = useField<string>({ path })
    const heading = useFormFields(([fields]) => fields.heading?.value as string)

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Subheading</label>
          {heading && (
            <AITextButton
              prompt={`Schrijf een korte, overtuigende subheading die deze hero heading aanvult: "${heading}"`}
              onGenerate={setValue}
              tone="professional"
              variant="ghost"
              size="sm"
            >
              Genereer Subheading
            </AITextButton>
          )}
        </div>
        <textarea
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 border rounded-md min-h-[60px]"
        />
      </div>
    )
  },

  BackgroundImageField: ({ path }: { path: string }) => {
    const { value, setValue } = useField<any>({ path })
    const heading = useFormFields(([fields]) => fields.heading?.value as string)

    const handleImageGenerated = async (imageUrl: string) => {
      // Upload to Payload Media (implementation from previous example)
      // ...
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Achtergrond Afbeelding</label>
          <AIImageGenerator
            fieldName={path}
            fieldLabel="Hero Achtergrond"
            onAccept={handleImageGenerated}
            promptPlaceholder={
              heading
                ? `Modern hero background image for: ${heading}`
                : 'Beschrijf de hero achtergrond...'
            }
            defaultSize="1792x1024"
            defaultQuality="hd"
            defaultStyle="vivid"
            variant="secondary"
            size="sm"
          />
        </div>
        {/* Upload field component */}
      </div>
    )
  },

  CTATextField: ({ path }: { path: string }) => {
    const { value, setValue } = useField<string>({ path })

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">CTA Tekst</label>
          <AITextButton
            prompt="Schrijf een korte, krachtige call-to-action tekst (max 3 woorden)"
            onGenerate={setValue}
            tone="persuasive"
            variant="ghost"
            size="sm"
          >
            Genereer CTA
          </AITextButton>
        </div>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
    )
  },
}
```

---

## Best Practices

### 1. Context is King

Always provide relevant context to AI generation:

```tsx
<AIContentGenerator
  fieldName="excerpt"
  fieldLabel="Excerpt"
  value={excerpt}
  onAccept={setExcerpt}
  context={{
    title,
    content,
    category,
    targetAudience: 'professionals',
  }}
/>
```

### 2. Smart Defaults

Set appropriate defaults based on the field purpose:

```tsx
// For professional content
<AIContentGenerator
  defaultTone="professional"
  defaultLanguage="nl"
  // ...
/>

// For marketing content
<AIContentGenerator
  defaultTone="persuasive"
  defaultLanguage="nl"
  // ...
/>
```

### 3. Progressive Enhancement

Start with simple AI buttons and add more advanced features as needed:

```tsx
// Level 1: Basic generation
<AITextButton prompt="..." onGenerate={setValue} />

// Level 2: Add improvement options
<AIImproveButton currentContent={value} onImprove={setValue} />

// Level 3: Full featured generator
<AIContentGenerator /* ... */ />
```

### 4. Error Handling

Always handle errors gracefully:

```tsx
const handleGenerate = async (content: string) => {
  try {
    setValue(content)
    showSuccessToast('Content gegenereerd!')
  } catch (error) {
    showErrorToast('Generatie mislukt, probeer het opnieuw')
  }
}
```

### 5. Performance

Use `AITextButton` for quick, inline generations and `AIContentGenerator` for complex, interactive generation:

```tsx
// Quick inline generation
<AITextButton prompt={simplePrompt} onGenerate={setValue} />

// Complex generation with options
<AIContentGenerator fieldName="..." fieldLabel="..." /* ... */ />
```

---

## Next Steps

1. Test the integration examples in your collections
2. Customize prompts for your specific use cases
3. Add AI generation to your most used fields
4. Monitor usage and costs in OpenAI dashboard
5. Consider caching frequently generated content

For more information, see:
- [AI Setup Guide](./ai-setup-guide.md)
- [Payload CMS Custom Components](https://payloadcms.com/docs/admin/components)
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)
