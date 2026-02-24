import React from 'react'

export const ServicesBlockComponent: React.FC<any> = ({ block }) => {
  return (
    <section className="services-block">
      <div className="container">
        <p>Services Block - Component coming in Sprint 5 Phase 2</p>
        <pre>{JSON.stringify(block, null, 2)}</pre>
      </div>
    </section>
  )
}
