import type React from 'react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type Props = {
  data: SerializedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>
