import type { BlockAnimationProps } from '../_shared/types'
import type { Media } from '@/payload-types'

export interface TeamMemberLink {
  platform: 'linkedin' | 'twitter' | 'email'
  url: string
  id?: string | null
}

export interface TeamMember {
  name: string
  role?: string | null
  bio?: string | null
  photo?: Media | string | null
  links?: TeamMemberLink[] | null
  id?: string | null
}

export interface TeamBlockProps extends BlockAnimationProps {
  blockType: 'team'
  title?: string | null
  subtitle?: string | null
  members?: TeamMember[] | null
  layout?: 'grid' | 'list' | null
  columns?: '2' | '3' | '4' | null
}
