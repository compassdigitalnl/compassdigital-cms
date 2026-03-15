export type Props = {
  className?: string
  message?: string
  onParams?: (paramValues: ((null | string | undefined) | string[])[]) => void
  params?: string[]
}
