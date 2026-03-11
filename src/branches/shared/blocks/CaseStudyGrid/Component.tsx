import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { CaseStudyGridBlockProps, CaseStudyLayout, CaseStudyItem, ResultMetric } from './types'
import type { Media } from '@/payload-types'

/**
 * B-43 CaseStudyGrid Block Component (Server)
 *
 * Case study cards with client name, results metrics, image, link.
 * Grid layout or featured layout (first case large).
 */

function CaseCard({ caseStudy, large = false }: { caseStudy: CaseStudyItem; large?: boolean }) {
  const imageData = typeof caseStudy.image === 'object' ? (caseStudy.image as Media) : null
  const results = (caseStudy.results || []) as ResultMetric[]

  const content = (
    <div
      className={`group overflow-hidden rounded-xl border border-grey bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
        large ? '' : ''
      }`}
    >
      {/* Image */}
      {imageData?.url && (
        <div className={`relative overflow-hidden bg-grey-light ${large ? 'h-56 md:h-72' : 'h-44'}`}>
          <Image
            src={imageData.url}
            alt={imageData.alt || caseStudy.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={large ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
          />
          {/* Client badge */}
          {caseStudy.client && (
            <div className="absolute bottom-3 left-3 rounded-md bg-navy/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {caseStudy.client}
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className={`p-5 ${large ? 'md:p-7' : ''}`}>
        {/* Client (if no image) */}
        {!imageData?.url && caseStudy.client && (
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-teal">
            {caseStudy.client}
          </div>
        )}

        <h3 className={`font-display text-navy ${large ? 'mb-3 text-xl md:text-2xl' : 'mb-2 text-lg'}`}>
          {caseStudy.title}
        </h3>

        {caseStudy.description && (
          <p className={`text-grey-dark leading-relaxed ${large ? 'mb-4 text-base line-clamp-3' : 'mb-3 text-sm line-clamp-2'}`}>
            {caseStudy.description}
          </p>
        )}

        {/* Results metrics */}
        {results.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            {results.map((result, idx) => (
              <div
                key={result.id || idx}
                className="rounded-lg bg-teal/5 px-3 py-1.5"
              >
                {result.value && (
                  <span className="text-sm font-bold text-teal">{result.value}</span>
                )}
                {result.metric && (
                  <span className="ml-1 text-xs text-grey-dark">{result.metric}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Link arrow */}
        {caseStudy.link && (
          <div className="flex items-center gap-1 text-sm font-semibold text-teal transition-all group-hover:gap-2">
            Bekijk case
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )

  if (caseStudy.link) {
    return <Link href={caseStudy.link} className="block">{content}</Link>
  }

  return content
}

export const CaseStudyGridBlockComponent: React.FC<CaseStudyGridBlockProps> = ({
  title,
  subtitle,
  cases,
  layout = 'grid',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const validCases = (cases || []) as CaseStudyItem[]
  if (validCases.length === 0) return null

  const currentLayout = (layout || 'grid') as CaseStudyLayout

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="case-study-grid-block bg-white py-12 md:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        {(title || subtitle) && (
          <div className="mb-8 text-center md:mb-12">
            {title && (
              <h2 className="mb-3 font-display text-2xl text-navy md:text-3xl lg:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mx-auto max-w-2xl text-sm text-grey-dark md:text-base">{subtitle}</p>
            )}
          </div>
        )}

        {/* Grid layout */}
        {currentLayout === 'grid' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {validCases.map((caseStudy, index) => (
              <CaseCard key={caseStudy.id || index} caseStudy={caseStudy} />
            ))}
          </div>
        )}

        {/* Featured layout */}
        {currentLayout === 'featured' && validCases.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* First case large */}
            <div className="lg:col-span-2">
              <CaseCard caseStudy={validCases[0]} large />
            </div>

            {/* Remaining cases stacked */}
            {validCases.length > 1 && (
              <div className="flex flex-col gap-6">
                {validCases.slice(1).map((caseStudy, index) => (
                  <CaseCard key={caseStudy.id || index} caseStudy={caseStudy} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default CaseStudyGridBlockComponent
