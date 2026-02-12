import React from 'react'
import type { StatsBlock } from '@/payload-types'

export const StatsBlockComponent: React.FC<StatsBlock> = ({ heading, stats, layout }) => {
  return (
    <section className="stats py-16 px-4 bg-blue-600 text-white">
      <div className="container mx-auto">
        {heading && <h2 className="text-3xl font-bold mb-12 text-center">{heading}</h2>}
        <div className={`grid gap-8 ${layout === 'grid-4' ? 'md:grid-cols-4' : layout === 'grid-2' ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {stats?.map((stat, index) => (
            <div key={index} className="stat-item text-center">
              <p className="text-5xl font-bold mb-2">{stat.number}{stat.suffix}</p>
              <p className="text-lg opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
