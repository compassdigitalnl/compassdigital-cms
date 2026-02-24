import React from 'react'

export const TeamBlockComponent: React.FC<any> = ({ block }) => {
  return (
    <section className="team-block">
      <div className="container">
        <p>Team Block - Component coming in Sprint 5 Phase 2</p>
        <pre>{JSON.stringify(block, null, 2)}</pre>
      </div>
    </section>
  )
}
