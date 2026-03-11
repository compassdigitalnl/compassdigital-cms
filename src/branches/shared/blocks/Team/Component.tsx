import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { TeamBlockProps, TeamMember, TeamMemberLink } from './types'
import type { Media } from '@/payload-types'

/**
 * B-10 - Team Block Component
 *
 * Team member display with two layout variants:
 * - grid: card layout with configurable columns, circular avatars
 * - list: horizontal cards with photo left, info right
 *
 * Social links rendered as icons per platform.
 */

const columnClasses: Record<string, string> = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export const TeamBlockComponent: React.FC<TeamBlockProps> = ({
  title,
  subtitle,
  members,
  layout = 'grid',
  columns = '3',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  if (!members || members.length === 0) return null

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
    >
      <section className="py-12 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {(title || subtitle) && (
            <div className="mb-10 text-center md:mb-14">
              {title && (
                <h2 className="font-display text-2xl text-navy md:text-3xl lg:text-4xl">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-3 text-base text-gray-500 md:text-lg">{subtitle}</p>
              )}
            </div>
          )}

          {layout === 'grid' ? (
            <GridLayout members={members} columns={columns || '3'} />
          ) : (
            <ListLayout members={members} />
          )}
        </div>
      </section>
    </AnimationWrapper>
  )
}

/** Grid layout — card-based with circular avatars */
const GridLayout: React.FC<{
  members: NonNullable<TeamBlockProps['members']>
  columns: string
}> = ({ members, columns }) => (
  <div className={`grid gap-8 ${columnClasses[columns] || columnClasses['3']}`}>
    {members.map((member, index) => (
      <MemberCard key={member.id || index} member={member} />
    ))}
  </div>
)

/** List layout — horizontal cards */
const ListLayout: React.FC<{
  members: NonNullable<TeamBlockProps['members']>
}> = ({ members }) => (
  <div className="space-y-6">
    {members.map((member, index) => (
      <MemberRow key={member.id || index} member={member} />
    ))}
  </div>
)

/** Card for grid layout */
const MemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const photoUrl = getPhotoUrl(member.photo)

  return (
    <div className="text-center">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={member.name}
          className="mx-auto h-28 w-28 rounded-full object-cover md:h-36 md:w-36"
          loading="lazy"
        />
      ) : (
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 text-2xl font-bold text-gray-400 md:h-36 md:w-36">
          {getInitials(member.name)}
        </div>
      )}
      <h3 className="mt-4 text-lg font-semibold text-navy">{member.name}</h3>
      {member.role && (
        <p className="mt-1 text-sm font-medium text-teal">{member.role}</p>
      )}
      {member.bio && (
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
          {member.bio}
        </p>
      )}
      {member.links && member.links.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          {member.links.map((link, i) => (
            <SocialLink key={link.id || i} link={link} />
          ))}
        </div>
      )}
    </div>
  )
}

/** Row for list layout */
const MemberRow: React.FC<{ member: TeamMember }> = ({ member }) => {
  const photoUrl = getPhotoUrl(member.photo)

  return (
    <div className="flex items-start gap-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={member.name}
          className="h-20 w-20 flex-shrink-0 rounded-full object-cover md:h-24 md:w-24"
          loading="lazy"
        />
      ) : (
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-400 md:h-24 md:w-24">
          {getInitials(member.name)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold text-navy">{member.name}</h3>
        {member.role && (
          <p className="mt-0.5 text-sm font-medium text-teal">{member.role}</p>
        )}
        {member.bio && (
          <p className="mt-2 text-sm leading-relaxed text-gray-500">{member.bio}</p>
        )}
        {member.links && member.links.length > 0 && (
          <div className="mt-3 flex items-center gap-3">
            {member.links.map((link, i) => (
              <SocialLink key={link.id || i} link={link} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/** Social link icon */
const SocialLink: React.FC<{ link: TeamMemberLink }> = ({ link }) => {
  const href = link.platform === 'email' ? `mailto:${link.url}` : link.url

  return (
    <a
      href={href}
      target={link.platform === 'email' ? undefined : '_blank'}
      rel={link.platform === 'email' ? undefined : 'noopener noreferrer'}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-teal hover:text-white"
      aria-label={link.platform}
    >
      {link.platform === 'linkedin' && (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )}
      {link.platform === 'twitter' && (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )}
      {link.platform === 'email' && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )}
    </a>
  )
}

/** Extract photo URL from Media object or string */
function getPhotoUrl(photo: TeamMember['photo']): string | null {
  if (!photo) return null
  if (typeof photo === 'string') return photo
  return (photo as Media).url || null
}

/** Get initials from name */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default TeamBlockComponent
