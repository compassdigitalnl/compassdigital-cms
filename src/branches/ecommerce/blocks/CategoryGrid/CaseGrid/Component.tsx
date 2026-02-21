import React from 'react'
import type { CaseGridBlock, Case } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'

export const CaseGridBlockComponent: React.FC<CaseGridBlock> = ({ heading, intro, cases, layout }) => {
  // Handle cases - it can be an array of Case objects or IDs
  const casesList = cases as Case[] | undefined

  if (!casesList || casesList.length === 0) {
    return null
  }

  return (
    <section className="case-grid py-16 px-4">
      <div className="container mx-auto">
        {heading && <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>}
        {intro && <p className="text-center mb-12 max-w-2xl mx-auto text-gray-600">{intro}</p>}

        <div
          className={`grid gap-8 ${
            layout === 'grid-2'
              ? 'md:grid-cols-2'
              : layout === 'masonry'
                ? 'md:grid-cols-3'
                : 'md:grid-cols-3'
          }`}
        >
          {casesList.map((caseItem) => {
            const imageUrl =
              typeof caseItem.featuredImage === 'object' && caseItem.featuredImage !== null
                ? caseItem.featuredImage.url
                : null

            return (
              <Link
                key={caseItem.id}
                href={`/cases/${caseItem.slug}`}
                className="case-card group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                {imageUrl && (
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={caseItem.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {caseItem.title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--color-primary, #3b82f6)' }}>
                    {caseItem.client}
                  </p>
                  <p className="text-gray-700 mb-4 line-clamp-3">{caseItem.excerpt}</p>

                  {caseItem.services && caseItem.services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {caseItem.services.slice(0, 3).map((serviceItem, index) => (
                        <span
                          key={index}
                          className="text-xs px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-accent, #ec4899)',
                            color: 'white',
                          }}
                        >
                          {serviceItem.service}
                        </span>
                      ))}
                      {caseItem.services.length > 3 && (
                        <span className="text-xs px-3 py-1 rounded-full bg-gray-200 text-gray-700">
                          +{caseItem.services.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
