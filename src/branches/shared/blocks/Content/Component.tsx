import React from 'react'
import type { ContentBlock } from '@/payload-types'
import { serializeLexical } from '@/utilities/serializeLexical'

/**
 * B05 - Content Block Component
 *
 * Rich text content area with full Lexical editor support.
 *
 * FEATURES:
 * - 3 width variants (narrow 640px, wide 900px, full 100%)
 * - Full Lexical support (headings, lists, links, code, blockquotes)
 * - Prose styling with Tailwind Typography
 * - Optimal reading width (narrow)
 *
 * @see docs/refactoring/sprint-9/shared/b05-content.html
 */

export const ContentBlockComponent: React.FC<ContentBlock> = ({
  content,
  maxWidth = 'narrow',
}) => {
  const maxWidthClasses = {
    narrow: 'max-w-2xl', // 640px - optimal reading width
    wide: 'max-w-4xl', // 900px
    full: 'max-w-full', // 100%
  }

  return (
    <section className="content-block py-12 md:py-16 bg-white">
      <div className={`mx-auto px-6 ${maxWidthClasses[maxWidth as keyof typeof maxWidthClasses]}`}>
        <div className="prose prose-navy max-w-none">
          {serializeLexical({ nodes: content })}
        </div>
      </div>
    </section>
  )
}

export default ContentBlockComponent
