import React from 'react'

export const StatsBlockComponent: React.FC<any> = ({ block }) => {
  return (
    <section className="stats-block">
      <div className="container">
        <p>Stats Block - Component coming in Sprint 5 Phase 2</p>
        <pre>{JSON.stringify(block, null, 2)}</pre>
      </div>
    </section>
  )
}
