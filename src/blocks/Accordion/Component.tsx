import React from 'react'
import type { AccordionBlock } from '@/payload-types'

export const AccordionBlockComponent: React.FC<AccordionBlock> = ({ heading, items }) => {
  return (
    <section className="accordion py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        {heading && <h2 className="text-3xl font-bold mb-8 text-center">{heading}</h2>}
        <div className="space-y-4">
          {items?.map((item, index) => (
            <details key={index} className="border rounded-lg p-6">
              <summary className="font-semibold text-lg cursor-pointer">
                {item.title}
              </summary>
              <div className="mt-4 text-gray-700">
                <p>Content...</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
