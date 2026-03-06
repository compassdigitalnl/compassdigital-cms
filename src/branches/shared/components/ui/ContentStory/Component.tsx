import React from 'react'
import { BookOpen } from 'lucide-react'
import { RichText } from '@/branches/shared/components/common/RichText'
import type { ContentStoryProps } from './types'

export const ContentStory: React.FC<ContentStoryProps> = ({
  description,
  title = 'Beschrijving',
  className = '',
}) => {
  if (!description) return null

  return (
    <section className={`${className}`} aria-labelledby="content-story-title">
      <h2
        id="content-story-title"
        className="mb-3.5 flex items-center gap-2 font-heading text-xl font-extrabold text-theme-navy"
      >
        <BookOpen className="h-5 w-5 text-theme-teal" />
        {title}
      </h2>

      <div className="rounded-2xl border border-[var(--grey,#E8ECF1)] bg-white p-7">
        <div className="text-[15px] leading-[1.7] text-theme-grey-dark [&_p]:mb-2.5 [&_p:last-child]:mb-0">
          <RichText data={description as any} />
        </div>
      </div>
    </section>
  )
}
