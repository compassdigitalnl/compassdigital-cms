import React from 'react'
import type { MapBlock } from '@/payload-types'

export const MapBlockComponent: React.FC<MapBlock> = ({ heading, address, height }) => {
  return (
    <section className="map py-16 px-4">
      <div className="container mx-auto">
        {heading && <h2 className="text-3xl font-bold mb-8 text-center">{heading}</h2>}
        <div className={`map-container bg-gray-200 rounded-lg flex items-center justify-center ${height === 'large' ? 'h-[600px]' : height === 'small' ? 'h-[300px]' : 'h-[450px]'}`}>
          <p className="text-gray-600">Map: {address}</p>
        </div>
      </div>
    </section>
  )
}
