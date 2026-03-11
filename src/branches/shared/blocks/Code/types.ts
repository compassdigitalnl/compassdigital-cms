import type { BlockAnimationProps } from '../_shared/types'

export interface CodeBlockProps extends BlockAnimationProps {
  blockType: 'code'
  code: string
  language?:
    | 'javascript'
    | 'typescript'
    | 'html'
    | 'css'
    | 'php'
    | 'python'
    | 'bash'
    | 'json'
    | 'sql'
    | null
  filename?: string | null
  showLineNumbers?: boolean | null
  showCopyButton?: boolean | null
}
