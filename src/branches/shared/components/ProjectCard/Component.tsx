import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ProjectCardProps } from './types'

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant = 'default',
  showTestimonial = false,
  className = '',
}) => {
  const {
    title,
    slug,
    branch,
    shortDescription,
    client,
    industry,
    location,
    year,
    duration,
    resultHighlight,
    featuredImage,
    beforeAfter,
    testimonial,
    status,
    badges,
  } = project as any

  if (status !== 'published') return null

  const imageData = typeof featuredImage === 'object' && featuredImage !== null ? featuredImage : null
  const hasBefore = beforeAfter?.before && typeof beforeAfter.before === 'object'
  const hasAfter = beforeAfter?.after && typeof beforeAfter.after === 'object'

  // Branch-specific meta items
  const metaItems: { icon: string; text: string }[] = []
  if (client) metaItems.push({ icon: 'user', text: client })
  if (location) metaItems.push({ icon: 'pin', text: location })
  if (industry) metaItems.push({ icon: 'briefcase', text: industry })
  if (year) metaItems.push({ icon: 'calendar', text: String(year) })
  if (duration) metaItems.push({ icon: 'clock', text: duration })

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-grey bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      <Link href={`/projects/${slug}`} className="flex h-full flex-col text-inherit no-underline">
        {/* Image */}
        {imageData?.url && (
          <div className={`relative w-full overflow-hidden bg-grey-light ${variant === 'detailed' ? 'aspect-video' : 'aspect-[3/2]'}`}>
            <Image
              src={imageData.url}
              alt={imageData.alt || title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Badges */}
            {badges && badges.length > 0 && (
              <div className="absolute left-3 top-3 z-[2] flex flex-wrap gap-1.5">
                {badges.slice(0, 2).map((b: any, i: number) => (
                  <span key={i} className="rounded-md bg-navy/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {b.badge}
                  </span>
                ))}
              </div>
            )}

            {/* Result highlight */}
            {resultHighlight && (
              <div className="absolute bottom-3 right-3 z-[2] rounded-md bg-teal/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                {resultHighlight}
              </div>
            )}

            {/* Before/After indicator */}
            {hasBefore && hasAfter && (
              <div className="absolute right-3 top-3 z-[2] flex items-center gap-1.5 rounded-md bg-orange-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                Voor/Na
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`flex flex-1 flex-col ${variant === 'detailed' ? 'p-6 md:p-7' : variant === 'compact' ? 'p-4' : 'p-5'}`}>
          <h3 className={`font-display leading-tight text-navy ${variant === 'compact' ? 'mb-2 text-lg' : 'mb-3 text-lg md:text-xl'}`}>
            {title}
          </h3>

          {/* Meta */}
          {metaItems.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-3">
              {metaItems.slice(0, 3).map((item, idx) => (
                <span key={idx} className="flex items-center gap-1.5 text-xs text-grey-dark">
                  <MetaIcon type={item.icon} />
                  {item.text}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {shortDescription && variant !== 'compact' && (
            <p className="mb-4 text-sm leading-relaxed text-grey-dark line-clamp-2">
              {shortDescription}
            </p>
          )}

          {/* Testimonial preview */}
          {showTestimonial && testimonial?.quote && (
            <div className="mb-4 rounded-lg border-l-2 border-teal bg-teal/5 px-4 py-3">
              <p className="text-xs italic text-grey-dark line-clamp-2">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              {testimonial.clientName && (
                <p className="mt-1 text-xs font-semibold text-navy">— {testimonial.clientName}</p>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition-all group-hover:gap-2.5">
            Bekijk project
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  )
}

function MetaIcon({ type }: { type: string }) {
  const paths: Record<string, string> = {
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    pin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    briefcase: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2',
    calendar: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18',
    clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2',
  }
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-grey-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[type] || paths.briefcase} />
    </svg>
  )
}

export default ProjectCard
