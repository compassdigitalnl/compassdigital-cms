import React from 'react'
import type { VideoBlock } from '@/payload-types'

export const VideoBlockComponent: React.FC<VideoBlock> = ({ heading, videoUrl, aspectRatio }) => {
  return (
    <section className="video py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {heading && <h2 className="text-3xl font-bold mb-8 text-center">{heading}</h2>}
        <div className={`video-container aspect-video bg-gray-900 rounded-lg flex items-center justify-center`}>
          <p className="text-white">Video: {videoUrl}</p>
        </div>
      </div>
    </section>
  )
}
