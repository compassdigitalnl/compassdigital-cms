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
      className={`mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}
      aria-label="Blog post navigation"
    >
      {/* Previous Post */}
      {prevPost ? (
        <Link
          href={`/blog/${category.slug}/${prevPost.slug}`}
          className="group flex items-start gap-4 p-6 rounded-2xl border border-gray-200 hover:border-teal-500 hover:shadow-lg transition-all duration-300 bg-white"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 group-hover:bg-teal-50 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Vorig artikel
            </div>
            <div className="text-base font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">
              {prevPost.title}
            </div>
            {prevPost.excerpt && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{prevPost.excerpt}</p>
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
          className="group flex items-start gap-4 p-6 rounded-2xl border border-gray-200 hover:border-teal-500 hover:shadow-lg transition-all duration-300 bg-white md:text-right"
        >
          <div className="flex-1 min-w-0 md:order-1">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Volgend artikel
            </div>
            <div className="text-base font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">
              {nextPost.title}
            </div>
            {nextPost.excerpt && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{nextPost.excerpt}</p>
            )}
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 group-hover:bg-teal-50 flex items-center justify-center transition-colors md:order-2">
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
          </div>
        </Link>
      ) : (
        <div className="hidden md:block" />
      )}
    </nav>
  )
}
