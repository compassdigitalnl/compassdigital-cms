import Link from 'next/link'
import type { TopBarSettings } from 'src/payload-types'

type Props = {
  settings: TopBarSettings
}

export function PlastimedTopBar({ settings }: Props) {
  const bgColor = settings.backgroundColor || '#0A1628'
  const textColor = settings.textColor || '#FFFFFF'

  return (
    <div
      className="text-[13px] py-2"
      style={{
        backgroundColor: bgColor,
        color: `${textColor}B3`, // 70% opacity
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Left messages */}
        <div className="flex gap-6">
          {settings.leftMessages?.map((message, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              {message.icon && <span className="text-teal-400">{message.icon}</span>}
              {message.link ? (
                <Link
                  href={message.link}
                  className="hover:text-teal-400 transition-colors"
                  style={{ color: textColor }}
                >
                  {message.text}
                </Link>
              ) : (
                <span>{message.text}</span>
              )}
            </span>
          ))}
        </div>

        {/* Right links */}
        <div className="flex gap-5">
          {settings.rightLinks?.map((link, idx) => (
            <Link
              key={idx}
              href={link.link}
              className="hover:text-teal-400 transition-colors"
              style={{ color: `${textColor}B3` }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
