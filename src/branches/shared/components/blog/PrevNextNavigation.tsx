'use client'
import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { BlogPost, BlogCategory } from '@/payload-types'

interface PrevNextNavigationProps {
  prevPost?: BlogPost | null
  nextPost?: BlogPost | null
  category: BlogCategory
  className?: string
}

export const PrevNextNavigation: React.FC<PrevNextNavigationProps> = ({
  prevPost,
  nextPost,
  category,
  className = '',
}) => {
  if (!prevPost && !nextPost) {
    return null
  }

  return (
    <nav
      className={`mt-12 pt-8 border-t border-grey-light grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}
      aria-label="Blog post navigation"
    >
      {/* Previous Post */}
      {prevPost ? (
        <Link
          href={`/blog/${category.slug}/${prevPost.slug}`}
          className="group flex items-start gap-4 p-6 rounded-2xl border border-grey-light hover:border-[var(--color-primary)] hover:shadow-lg transition-all duration-300 bg-white"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-grey-light group-hover:bg-[var(--color-primary-glow)] flex items-center justify-center transition-colors">
            <ChevronLeft className="w-5 h-5 text-grey-dark group-hover:text-[var(--color-primary)] transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-grey-mid uppercase tracking-wide mb-1">
              Vorig artikel
            </div>
            <div className="text-base font-bold text-navy group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
              {prevPost.title}
            </div>
            {prevPost.excerpt && (
              <p className="text-sm text-grey-dark mt-2 line-clamp-2">{prevPost.excerpt}</p>
            )}
          </div>
        </Link>
      ) : (
        <div className="hidden md:block" />
      )}

      {/* Next Post */}
      {nextPost ? (
        <Link
          href={`/blog/${category.slug}/${nextPost.slug}`}
          className="group flex items-start gap-4 p-6 rounded-2xl border border-grey-light hover:border-[var(--color-primary)] hover:shadow-lg transition-all duration-300 bg-white md:text-right"
        >
          <div className="flex-1 min-w-0 md:order-1">
            <div className="text-xs font-semibold text-grey-mid uppercase tracking-wide mb-1">
              Volgend artikel
            </div>
            <div className="text-base font-bold text-navy group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
              {nextPost.title}
            </div>
            {nextPost.excerpt && (
              <p className="text-sm text-grey-dark mt-2 line-clamp-2">{nextPost.excerpt}</p>
            )}
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-grey-light group-hover:bg-[var(--color-primary-glow)] flex items-center justify-center transition-colors md:order-2">
            <ChevronRight className="w-5 h-5 text-grey-dark group-hover:text-[var(--color-primary)] transition-colors" />
          </div>
        </Link>
      ) : (
        <div className="hidden md:block" />
      )}
    </nav>
  )
}
