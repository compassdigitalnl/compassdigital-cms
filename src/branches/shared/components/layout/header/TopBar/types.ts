import type { Header, Theme1 } from '@/payload-types'

export type TopBarData = {
  enabled?: boolean | null
  backgroundColor?: string | null
  textColor?: string | null
  leftMessages?: any[]
  rightLinks?: any[]
}

export type TopBarProps = {
  topBar: TopBarData
  theme: Theme1 | null
  header?: Header
}
