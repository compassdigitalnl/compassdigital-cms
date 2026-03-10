export interface GalleryImage {
  url: string
  alt?: string
  isVideo?: boolean
}

export interface ExperienceGalleryProps {
  images: GalleryImage[]
  badge?: string
  className?: string
}
