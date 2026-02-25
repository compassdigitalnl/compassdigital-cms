export interface UploadedFile {
  id: string
  name: string
  size: number // in bytes
  type: string // MIME type
  progress?: number // 0-100
  status: 'uploading' | 'success' | 'error'
  error?: string
}

export interface FileUploadDropzoneProps {
  files?: UploadedFile[]
  onFilesAdded?: (files: File[]) => void
  onFileRemove?: (id: string) => void
  maxFileSize?: number // in bytes (default: 10MB = 10485760)
  acceptedTypes?: string // MIME types or extensions (default: .pdf,.doc,.docx,.xls,.xlsx,.dwg,.png,.jpg,.jpeg)
  maxFiles?: number // Maximum number of files (default: undefined = unlimited)
  className?: string
}
