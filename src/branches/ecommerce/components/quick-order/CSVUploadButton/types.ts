export type CSVUploadState = 'idle' | 'loading' | 'success' | 'error'

export interface CSVUploadButtonProps {
  label?: string
  accept?: string
  maxSize?: number // In bytes, default 5MB
  onFileSelect?: (file: File) => void | Promise<void>
  onUploadComplete?: (data: any) => void
  onUploadError?: (error: Error) => void
  disabled?: boolean
  className?: string
}
