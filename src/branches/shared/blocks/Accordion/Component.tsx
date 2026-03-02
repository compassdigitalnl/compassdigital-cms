/**
 * Accordion Component - 100% Theme Variable Compliant
 *
 * Already compliant - uses neutral colors only, no hardcoded theme colors.
 */
import React from 'react'
import type { AccordionBlock } from '@/payload-types'

export const AccordionBlockComponent: React.FC<AccordionBlock> = ({ title, items }) => {
  return (
    <section className="accordion py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        {title && <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>}
        <div className="space-y-4">
          {items?.map((item, index) => (
            <details key={index} className="border rounded-lg p-6">
              <summary className="font-semibold text-lg cursor-pointer">
                {item.title}
              </summary>
              <div className="mt-4 text-grey-dark">
                <p>Content...</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
