import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { VideoBlockProps } from './types'

/**
 * B-12 - Video Block Component
 *
 * Embeds YouTube or Vimeo videos with:
 * - URL parsing to generate proper embed URLs
 * - Responsive 16:9 aspect ratio container
 * - Configurable max-width (narrow/wide/full)
 * - Optional title above and caption below
 * - Autoplay support
 */

const sizeClasses: Record<string, string> = {
  narrow: 'max-w-xl',
  wide: 'max-w-4xl',
  full: 'max-w-6xl',
}

export const VideoBlockComponent: React.FC<VideoBlockProps> = ({
  videoUrl,
  title,
  caption,
  size = 'wide',
  autoplay = false,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  if (!videoUrl) return null

  const embedUrl = getEmbedUrl(videoUrl, autoplay)

  if (!embedUrl) {
    return null
  }

  const maxWidth = sizeClasses[size || 'wide'] || sizeClasses.wide

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
    >
      <section className="py-8 md:py-14">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidth}`}>
          {title && (
            <h2 className="mb-6 text-center font-display text-2xl text-navy md:text-3xl">
              {title}
            </h2>
          )}

          {/* 16:9 responsive container */}
          <div className="relative w-full overflow-hidden rounded-xl bg-gray-900 shadow-lg" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={embedUrl}
              title={title || 'Video'}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>

          {caption && (
            <p className="mt-4 text-center text-sm text-gray-500">{caption}</p>
          )}
        </div>
      </section>
    </AnimationWrapper>
  )
}

/**
 * Parse a YouTube or Vimeo URL and return the proper embed URL.
 * Returns null if the URL is not recognized.
 */
function getEmbedUrl(url: string, autoplay?: boolean | null): string | null {
  const autoplayParam = autoplay ? '1' : '0'

  // YouTube: multiple URL formats
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID
  const youtubeRegex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    const videoId = youtubeMatch[1]
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplayParam}&rel=0`
  }

  // Vimeo: multiple URL formats
  // https://vimeo.com/VIDEO_ID
  // https://player.vimeo.com/video/VIDEO_ID
  const vimeoRegex = /(?:vimeo\.com\/(?:video\/)?)(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    const videoId = vimeoMatch[1]
    return `https://player.vimeo.com/video/${videoId}?autoplay=${autoplayParam}&dnt=1`
  }

  return null
}

export default VideoBlockComponent
