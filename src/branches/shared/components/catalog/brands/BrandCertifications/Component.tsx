import React from 'react'
import { ShieldCheck, CheckCircle } from 'lucide-react'
import type { BrandCertificationsProps } from './types'

export const BrandCertifications: React.FC<BrandCertificationsProps> = ({
  certifications,
  className = '',
}) => {
  if (certifications.length === 0) return null

  return (
    <section className={`${className}`} aria-labelledby="brand-certifications-title">
      <h2
        id="brand-certifications-title"
        className="mb-3.5 flex items-center gap-2 font-heading text-xl font-extrabold text-theme-navy"
      >
        <ShieldCheck className="h-5 w-5 text-theme-teal" />
        Certificeringen
      </h2>

      <div className="flex flex-wrap gap-3">
        {certifications.map((cert) => (
          <div
            key={cert.name}
            className="flex items-center gap-1.5 rounded-[10px] border border-[var(--grey,#E8ECF1)] bg-white px-3.5 py-2 text-[13px] font-semibold text-theme-navy"
          >
            <CheckCircle className="h-4 w-4 text-green" />
            {cert.name}
          </div>
        ))}
      </div>
    </section>
  )
}
