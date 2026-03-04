export interface Certification {
  name: string
  icon?: string | null
}

export interface BrandCertificationsProps {
  certifications: Certification[]
  className?: string
}
