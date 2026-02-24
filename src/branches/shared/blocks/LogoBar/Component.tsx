import React from 'react'

export const LogoBarBlockComponent: React.FC<any> = ({ block }) => {
  return (
    <section className="logobar-block">
      <div className="container">
        <p>LogoBar Block - Component coming in Sprint 5 Phase 2</p>
        <pre>{JSON.stringify(block, null, 2)}</pre>
      </div>
    </section>
  )
}
