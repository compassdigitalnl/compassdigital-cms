'use client'
import React from 'react'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { JSXConvertersFunction, RichText } from '@payloadcms/richtext-lexical/react'
import { InfoBoxComponent } from '@/blocks/InfoBox/Component'
import { ProductEmbedComponent } from '@/branches/ecommerce/blocks/ProductEmbed/Component'
import { ComparisonTableComponent } from '@/branches/ecommerce/blocks/ComparisonTable/Component'
import { FAQBlockComponent } from '@/blocks/FAQ/Component'

interface RenderBlogContentProps {
  content: SerializedEditorState
  className?: string
}

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    infobox: ({ node }: any) => {
      return <InfoBoxComponent {...node.fields} />
    },
    productembed: ({ node }: any) => {
      return <ProductEmbedComponent {...node.fields} />
    },
    comparisontable: ({ node }: any) => {
      return <ComparisonTableComponent {...node.fields} />
    },
    faq: ({ node }: any) => {
      return <FAQBlockComponent {...node.fields} />
    },
  },
})

export const RenderBlogContent: React.FC<RenderBlogContentProps> = ({ content, className = '' }) => {
  return (
    <div className={`article-content ${className}`}>
      <RichText converters={jsxConverters} data={content} />
    </div>
  )
}
