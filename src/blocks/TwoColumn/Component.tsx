import React from 'react'
import type { TwoColumnBlock } from '@/payload-types'

export const TwoColumnBlockComponent: React.FC<TwoColumnBlock> = ({ leftColumn, rightColumn, ratio }) => {
  return (
    <section className="two-column py-16 px-4">
      <div className="container mx-auto">
        <div className={`grid md:grid-cols-2 gap-12`} data-ratio={ratio}>
          <div className="left-col">{/* Rich text render */}<p>Left column content...</p></div>
          <div className="right-col">{/* Rich text render */}<p>Right column content...</p></div>
        </div>
      </div>
    </section>
  )
}
