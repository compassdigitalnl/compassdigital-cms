import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import { serializeLexical } from '@/utilities/serializeLexical'
import type { ContentBlockProps, ContentWidth } from './types'

/**
 * B-07 Content Block Component (Server)
 *
 * Rich text content area with full Lexical editor support.
 *
 * Width options:
 * - narrow: max-w-2xl (640px, optimal reading width)
 * - wide: max-w-5xl (1024px)
 * - full: max-w-full (100%)
 *
 * Uses Tailwind prose classes for typography styling.
 */

const widthClasses: Record<ContentWidth, string> = {
  narrow: 'max-w-2xl',
  wide: 'max-w-5xl',
  full: 'max-w-full',
}

export const ContentBlockComponent: React.FC<ContentBlockProps> = ({
  content,
  width = 'narrow',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentWidth = (width || 'narrow') as ContentWidth

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="content-block py-12 md:py-16 bg-white"
    >
      <div className={`mx-auto px-6 ${widthClasses[currentWidth]}`}>
        <div className="prose prose-navy max-w-none prose-headings:font-display prose-headings:text-navy prose-p:text-grey-dark prose-a:text-teal prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-teal prose-blockquote:text-grey-mid prose-li:text-grey-dark">
          {serializeLexical({ nodes: content })}
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default ContentBlockComponent
