import React from 'react'
import type { ImageGalleryBlock } from '@/payload-types'

export const ImageGalleryBlockComponent: React.FC<ImageGalleryBlock> = ({ heading, images, layout, columns }) => {
  return (
    <section className="image-gallery py-16 px-4">
      <div className="container mx-auto">
        {heading && <h2 className="text-3xl font-bold mb-12 text-center">{heading}</h2>}
        <div className={`grid gap-4 ${columns === '4' ? 'md:grid-cols-4' : columns === '2' ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {images?.map((img, index) => (
            <div key={index} className="gallery-item">
              <div className="aspect-square bg-gray-200 rounded"></div>
              {img.caption && <p className="mt-2 text-sm text-gray-600">{img.caption}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
