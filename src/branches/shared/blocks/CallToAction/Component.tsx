import React from 'react'
import Link from 'next/link'
import type { CallToActionBlock } from '@/payload-types'

const bgClasses: Record<string, string> = {
  white: 'bg-white text-gray-900',
  grey: 'bg-gray-100 text-gray-900',
  teal: 'bg-teal text-white',
}

export const CallToActionComponent: React.FC<CallToActionBlock> = ({
  title,
  description,
  buttonLabel,
  buttonLink,
  backgroundColor = 'grey',
}) => {
  const bg = bgClasses[backgroundColor || 'grey'] || bgClasses.grey

  return (
    <div className={`${bg} rounded-lg px-6 py-8 text-center my-6`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-sm opacity-80 mb-4">{description}</p>}
      {buttonLabel && buttonLink && (
        <Link
          href={buttonLink}
          className={`inline-block rounded-md px-6 py-2.5 text-sm font-medium transition-colors ${
            backgroundColor === 'teal'
              ? 'bg-white text-teal hover:bg-gray-100'
              : 'bg-teal text-white hover:bg-teal-dark'
          }`}
        >
          {buttonLabel}
        </Link>
      )}
    </div>
  )
}

export default CallToActionComponent
