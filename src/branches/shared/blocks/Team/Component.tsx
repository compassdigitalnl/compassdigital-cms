import React from 'react'
import type { TeamBlock } from '@/payload-types'
import Image from 'next/image'

export const TeamBlockComponent: React.FC<TeamBlock> = ({ heading, intro, members, layout }) => {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Function to generate a color based on name
  const getColorFromName = (name: string) => {
    const colors = [
      'var(--color-primary, #3b82f6)',
      'var(--color-secondary, #8b5cf6)',
      'var(--color-accent, #ec4899)',
      '#10b981', // green
      '#f59e0b', // orange
      '#ef4444', // red
    ]
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <section className="team py-16 px-4">
      <div className="container mx-auto">
        {heading && <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>}
        {intro && <p className="text-center mb-12 max-w-2xl mx-auto text-gray-600">{intro}</p>}
        <div
          className={`grid gap-8 ${
            layout === 'grid-4'
              ? 'md:grid-cols-4'
              : layout === 'grid-2'
                ? 'md:grid-cols-2'
                : 'md:grid-cols-3'
          }`}
        >
          {members?.map((member, index) => {
            // Get photo URL (priority: uploaded photo > placeholder photoUrl > initials)
            const photoUrl =
              typeof member.photo === 'object' && member.photo !== null
                ? member.photo.url
                : member.photoUrl || null

            return (
              <div key={index} className="team-member text-center">
                <div className="mb-4 w-32 h-32 mx-auto rounded-full overflow-hidden relative">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white text-3xl font-bold"
                      style={{ backgroundColor: getColorFromName(member.name) }}
                    >
                      {getInitials(member.name)}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--color-primary, #3b82f6)' }}>
                  {member.role}
                </p>
                {member.bio && <p className="mt-2 text-sm text-gray-600 line-clamp-3">{member.bio}</p>}
                {(member.email || member.linkedin) && (
                  <div className="mt-3 flex gap-3 justify-center">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-sm hover:underline"
                        style={{ color: 'var(--color-secondary, #8b5cf6)' }}
                      >
                        Email
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                        style={{ color: 'var(--color-secondary, #8b5cf6)' }}
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
