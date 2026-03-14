export interface GalleryImage {
  url: string
  alt?: string
  width?: number
  height?: number
}

export interface VehicleGalleryProps {
  images: GalleryImage[]
  videoUrl?: string | null
  className?: string
}
