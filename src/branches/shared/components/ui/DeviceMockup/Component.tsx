import React from 'react'
import Image from 'next/image'
import type { DeviceMockupProps } from './types'

/**
 * DeviceMockup — Desktop & mobile screenshot display in device frames.
 *
 * Renders screenshots inside styled browser/phone chrome to give a realistic
 * preview of the delivered website. All colors use CSS theme variables.
 */

export const DeviceMockup: React.FC<DeviceMockupProps> = ({
  desktopUrl,
  mobileUrl,
  desktopAlt = 'Desktop screenshot',
  mobileAlt = 'Mobile screenshot',
  websiteUrl,
  className = '',
}) => {
  if (!desktopUrl && !mobileUrl) return null

  return (
    <div className={`relative ${className}`}>
      {/* Desktop frame */}
      {desktopUrl && (
        <div
          className="overflow-hidden border"
          style={{
            borderColor: 'var(--grey)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--sh-lg)',
            backgroundColor: 'var(--white)',
          }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-2 border-b px-4 py-2.5"
            style={{ borderColor: 'var(--grey)', backgroundColor: 'var(--bg)' }}
          >
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-coral" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            {websiteUrl && (
              <div
                className="ml-3 flex-1 truncate rounded-md px-3 py-1 text-xs"
                style={{ backgroundColor: 'var(--white)', color: 'var(--grey-mid)' }}
              >
                {websiteUrl.replace(/^https?:\/\//, '')}
              </div>
            )}
          </div>
          {/* Screenshot */}
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={desktopUrl}
              alt={desktopAlt}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>
        </div>
      )}

      {/* Mobile frame (overlaps desktop bottom-right) */}
      {mobileUrl && desktopUrl && (
        <div
          className="absolute -bottom-6 -right-4 w-[28%] min-w-[120px] overflow-hidden border-2 md:-right-8"
          style={{
            borderColor: 'var(--grey)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--sh-xl)',
            backgroundColor: 'var(--white)',
          }}
        >
          {/* Phone notch */}
          <div
            className="flex justify-center py-1.5"
            style={{ backgroundColor: 'var(--bg)' }}
          >
            <div
              className="h-1 w-8 rounded-full"
              style={{ backgroundColor: 'var(--grey)' }}
            />
          </div>
          <div className="relative aspect-[9/16] w-full">
            <Image
              src={mobileUrl}
              alt={mobileAlt}
              fill
              className="object-cover object-top"
              sizes="25vw"
            />
          </div>
        </div>
      )}

      {/* Mobile only (no desktop) */}
      {mobileUrl && !desktopUrl && (
        <div
          className="mx-auto max-w-[280px] overflow-hidden border-2"
          style={{
            borderColor: 'var(--grey)',
            borderRadius: 'var(--r-xl)',
            boxShadow: 'var(--sh-lg)',
            backgroundColor: 'var(--white)',
          }}
        >
          <div
            className="flex justify-center py-2"
            style={{ backgroundColor: 'var(--bg)' }}
          >
            <div
              className="h-1.5 w-10 rounded-full"
              style={{ backgroundColor: 'var(--grey)' }}
            />
          </div>
          <div className="relative aspect-[9/16] w-full">
            <Image
              src={mobileUrl}
              alt={mobileAlt}
              fill
              className="object-cover object-top"
              sizes="280px"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DeviceMockup
