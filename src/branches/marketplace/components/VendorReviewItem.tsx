import { Star } from 'lucide-react'

interface VendorReviewItemProps {
  review: {
    id: number | string
    authorName: string
    authorInitials?: string | null
    rating: number
    title?: string | null
    comment: string
    reviewDate?: string | null
    createdAt: string
  }
}

export function VendorReviewItem({ review }: VendorReviewItemProps) {
  const initials = review.authorInitials || review.authorName?.slice(0, 2)?.toUpperCase() || '??'
  const dateStr = new Date(review.reviewDate || review.createdAt).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="py-3.5 border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {initials}
          </div>
          <div className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {review.authorName}
          </div>
        </div>
        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {dateStr}
        </div>
      </div>
      <div className="flex items-center gap-0.5 mb-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : ''}`}
            style={{ color: 'var(--color-warning)' }}
          />
        ))}
      </div>
      {review.title && (
        <div className="text-sm font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          {review.title}
        </div>
      )}
      <div className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
        {review.comment}
      </div>
    </div>
  )
}
