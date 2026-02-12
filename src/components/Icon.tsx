import React from 'react'
import * as LucideIcons from 'lucide-react'
import { LucideProps } from 'lucide-react'

interface IconProps extends Partial<LucideProps> {
  name: string
  size?: number
  className?: string
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className = '', ...props }) => {
  // Get the icon component from Lucide
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.FC<LucideProps>

  // Fallback to a default icon if not found
  if (!IconComponent || name === 'createLucideIcon') {
    const FallbackIcon = LucideIcons.HelpCircle
    return <FallbackIcon size={size} className={className} {...props} />
  }

  return <IconComponent size={size} className={className} {...props} />
}
