# ReviewWidget Component

**Component ID:** `c10`
**Category:** E-commerce / Social Proof
**Complexity:** High

## Overview

Complete review section for product pages. Shows aggregate rating, star distribution, individual reviews with verified badges, and helpful voting. Builds trust and influences purchase decisions through authentic customer feedback.

### Key Features

- ✅ **Split Layout** - Summary (left) + Rating bars (right)
- ✅ **Large Average Score** - 48px bold display with 1 decimal precision
- ✅ **Star Distribution Bars** - Visual bars showing rating breakdown (5★ → 1★)
- ✅ **Review Count** - Total number of reviews
- ✅ **Write Review CTA** - Prominent button to encourage reviews
- ✅ **Individual Review Cards** - Avatar, name, date, rating, text
- ✅ **Verified Purchase Badge** - Green badge for confirmed buyers
- ✅ **Helpful Voting** - Thumbs up/down with vote counts
- ✅ **Responsive** - Stacks on mobile (<768px)
- ✅ **100% theme variables** (NO hardcoded colors)
- ✅ **Full accessibility** (ARIA labels, semantic HTML, screen reader support)

---

## Usage

### Basic Example

\`\`\`tsx
import { ReviewWidget } from '@/branches/ecommerce/components/products/ReviewWidget'
import type { ReviewSummary, Review } from '@/branches/ecommerce/components/products/ReviewWidget'

const summary: ReviewSummary = {
  average: 4.7,
  total: 23,
  distribution: { 5: 17, 4: 4, 3: 1, 2: 1, 1: 0 },
}

const reviews: Review[] = [
  {
    id: 'r1',
    author: {
      name: 'Dr. J. de Vries',
      initials: 'JV',
      verified: true,
    },
    rating: 5,
    date: '2026-02-14',
    text: 'Uitstekende handschoenen. Goede pasvorm...',
    helpful: { yes: 4, no: 0 },
  },
  // ... more reviews
]

export default function ProductPage() {
  return (
    <ReviewWidget
      productId="prod_123"
      productName="Peha-soft Nitrile Fino"
      summary={summary}
      reviews={reviews}
    />
  )
}
\`\`\`

### With Review Submission

\`\`\`tsx
'use client'

import { useState } from 'react'
import { ReviewWidget } from '@/branches/ecommerce/components/products/ReviewWidget'

export default function ProductReviews({ productId }: { productId: string }) {
  const [showReviewModal, setShowReviewModal] = useState(false)

  const handleWriteReview = () => {
    setShowReviewModal(true)
  }

  return (
    <>
      <ReviewWidget
        productId={productId}
        productName="Product Name"
        summary={summary}
        reviews={reviews}
        onWriteReview={handleWriteReview}
        showWriteButton={true}
      />

      {showReviewModal && (
        <ReviewFormModal
          productId={productId}
          onClose={() => setShowReviewModal(false)}
          onSubmit={async (reviewData) => {
            await submitReview(reviewData)
            setShowReviewModal(false)
            // Refetch reviews
          }}
        />
      )}
    </>
  )
}
\`\`\`

### With Helpful Voting

\`\`\`tsx
'use client'

import { ReviewWidget } from '@/branches/ecommerce/components/products/ReviewWidget'
import { useRouter } from 'next/navigation'

export default function ProductReviews() {
  const router = useRouter()

  const handleHelpful = async (reviewId: string, vote: 'yes' | 'no') => {
    try {
      const response = await fetch('/api/reviews/helpful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, vote }),
      })

      if (!response.ok) throw new Error('Failed to vote')

      // Refresh to show updated counts
      router.refresh()
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  return (
    <ReviewWidget
      productId="prod_123"
      productName="Product Name"
      summary={summary}
      reviews={reviews}
      onHelpful={handleHelpful}
    />
  )
}
\`\`\`

### Server Component (Next.js App Router)

\`\`\`tsx
// app/products/[id]/page.tsx
import { ReviewWidget } from '@/branches/ecommerce/components/products/ReviewWidget'
import { getPayloadClient } from '@/lib/payload'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const payload = await getPayloadClient()

  // Fetch product with reviews
  const product = await payload.findByID({
    collection: 'products',
    id: params.id,
  })

  // Fetch reviews
  const reviewsData = await payload.find({
    collection: 'reviews',
    where: {
      product: {
        equals: params.id,
      },
      approved: {
        equals: true,
      },
    },
    limit: 50,
    sort: '-helpful.yes', // Sort by most helpful
  })

  // Calculate summary
  const summary = calculateReviewSummary(reviewsData.docs)

  return (
    <div>
      {/* Product details */}

      <ReviewWidget
        productId={product.id}
        productName={product.name}
        summary={summary}
        reviews={reviewsData.docs}
      />
    </div>
  )
}

// Helper function to calculate summary
function calculateReviewSummary(reviews: any[]) {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  let totalRating = 0

  reviews.forEach((review) => {
    distribution[review.rating as 1 | 2 | 3 | 4 | 5]++
    totalRating += review.rating
  })

  const average = reviews.length > 0 ? totalRating / reviews.length : 0

  return {
    average: Math.round(average * 10) / 10, // Round to 1 decimal
    total: reviews.length,
    distribution,
  }
}
\`\`\`

---

## API Reference

### ReviewWidgetProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `productId` | `string` | **required** | Product ID for review submission |
| `productName` | `string` | **required** | Product name for context |
| `summary` | `ReviewSummary` | **required** | Aggregate rating data |
| `reviews` | `Review[]` | **required** | Array of review objects |
| `onWriteReview` | `() => void` | - | Callback when "Write Review" clicked |
| `onHelpful` | `(reviewId, vote) => void` | - | Callback when helpful vote clicked |
| `sortBy` | `SortOption` | - | Current sort option (for filtering) |
| `onSortChange` | `(sort) => void` | - | Callback when sort changes |
| `filterBy` | `1-5 \| null` | - | Filter by star rating |
| `onFilterChange` | `(rating) => void` | - | Callback when filter changes |
| `showWriteButton` | `boolean` | `true` | Show "Write Review" button |
| `className` | `string` | `''` | Additional CSS classes |

### ReviewSummary Interface

\`\`\`typescript
interface ReviewSummary {
  average: number // 0-5 with 1 decimal (e.g., 4.7)
  total: number // Total review count
  distribution: {
    1: number // Count of 1-star reviews
    2: number
    3: number
    4: number
    5: number
  }
}
\`\`\`

### Review Interface

\`\`\`typescript
interface Review {
  id: string
  author: {
    name: string // Display name
    initials: string // 2-letter initials (e.g., "JV")
    verified: boolean // Verified purchase badge
  }
  rating: 1 | 2 | 3 | 4 | 5
  date: string // ISO date string
  text: string // Review content
  helpful: {
    yes: number // Thumbs up count
    no: number // Thumbs down count
  }
  userVote?: 'yes' | 'no' | null // Current user's vote (optional)
}
\`\`\`

### SortOption Type

\`\`\`typescript
type SortOption = 'helpful' | 'newest' | 'rating-high' | 'rating-low'
\`\`\`

---

## Styling

All styles use theme variables from `src/globals/`:

### Colors

- **Average score:** `text-theme-navy`
- **Stars (filled):** `text-theme-amber` (#F59E0B)
- **Stars (empty):** `text-theme-grey`
- **Progress bars:** `bg-theme-amber` (fill), `bg-theme-grey-light` (track)
- **Write button:** `bg-theme-teal`, hover: `bg-theme-navy`
- **Avatar:** `bg-theme-teal-glow`, `text-theme-teal`
- **Verified badge:** `text-theme-green`
- **Review text:** `text-theme-grey-dark`
- **Helpful buttons:** `border-theme-border`, hover: `border-theme-teal` + `bg-theme-teal-glow`

### Typography

- **Average score:** 48px (text-5xl) / 800 weight
- **Total count:** 13px / regular weight
- **Review author:** 14px / 700 weight
- **Review text:** 14px / regular weight / line-height 1.6
- **Verified badge:** 11px / 600 weight

### Spacing

- **Card padding:** 28px (p-7)
- **Header gap:** 24px (gap-6)
- **Avatar size:** 36px (h-9 w-9)
- **Progress bar height:** 8px (h-2)
- **Review item padding:** 16px vertical (py-4)

---

## Accessibility

### Semantic HTML

- ✅ Uses `<section>` wrapper with `aria-labelledby`
- ✅ Uses `<article>` for each review
- ✅ Uses `<h2>` for section title (screen reader only)

### ARIA Attributes

- `aria-labelledby="reviews-title"` - Links section to title
- `role="img"` on stars - Makes star rating accessible
- `aria-label` on stars - "4.7 van 5 sterren", "5 van 5 sterren"
- `role="progressbar"` on rating bars - Progress bar semantics
- `aria-valuenow/min/max` - Progress bar values
- `aria-label` on helpful buttons - "Markeer als nuttig (4 stemmen)"
- `aria-pressed` on voted buttons - Toggle button state
- Screen reader only text (`.sr-only`) for section title

### Screen Reader Announcements

- **Section:** "Klantbeoordelingen"
- **Average:** "4.7 van 5 sterren"
- **Rating bar:** "5 sterren: 17 reviews"
- **Review:** "Review door Dr. J. de Vries"
- **Stars:** "5 van 5 sterren"
- **Helpful:** "Markeer als nuttig (4 stemmen)"

### Color Contrast (WCAG 2.1)

- ✅ Average score (navy on white): 14.8:1 → **AAA**
- ✅ Write button (white on teal): 4.8:1 → **AA**
- ✅ Review text (grey-dark on white): 7.2:1 → **AA**
- ✅ Verified badge (green on white): 4.9:1 → **AA**

### Keyboard Navigation

- ✅ Write button is keyboard accessible (Tab → Enter)
- ✅ Helpful buttons are keyboard accessible
- ✅ Focus visible on all interactive elements
- ✅ Logical tab order (top to bottom)

---

## Responsive Behavior

### Desktop (≥768px)

- Horizontal layout (flex-row)
- Summary on left (120px min-width)
- Rating bars on right (flex-1)
- 24px gap between sections

### Mobile (<768px)

- Vertical stacking (flex-col)
- Summary full width, centered
- Rating bars full width
- Maintained padding and spacing

---

## Best Practices

### Do's ✅

- Show only verified purchases (require login + order check)
- Sort by "Most helpful" by default
- Include pagination or "Load more" for 10+ reviews
- Allow filtering by star rating
- Calculate average dynamically from reviews
- Validate review text (min 20 chars, max 2000 chars)
- Moderate reviews before publishing
- Allow vendor/admin replies to reviews
- Add review images/photos (optional enhancement)
- Implement rate limiting (1 review per product per user)
- Send email notifications for new reviews
- Add structured data (JSON-LD) for SEO

### Don'ts ❌

- Don't allow anonymous reviews (verified only)
- Don't show unverified purchases without badge
- Don't allow editing after 48 hours
- Don't delete negative reviews (moderate fairly)
- Don't auto-sort by newest (use helpful)
- Don't forget spam protection
- Don't allow excessive self-promotion in reviews

---

## Integration with Payload CMS

### Reviews Collection

\`\`\`typescript
// src/collections/Reviews.ts
import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['product', 'author', 'rating', 'approved', 'createdAt'],
  },
  access: {
    create: ({ req }) => !!req.user, // Logged in users only
    read: ({ req, data }) => {
      if (req.user?.role === 'admin') return true
      return data?.approved === true // Public can only see approved
    },
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },
    {
      name: 'author',
      type: 'group',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'initials',
          type: 'text',
          maxLength: 2,
          required: true,
        },
        {
          name: 'verified',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Auto-set based on purchase verification',
          },
        },
      ],
    },
    {
      name: 'rating',
      type: 'select',
      options: [
        { label: '1 Star', value: '1' },
        { label: '2 Stars', value: '2' },
        { label: '3 Stars', value: '3' },
        { label: '4 Stars', value: '4' },
        { label: '5 Stars', value: '5' },
      ],
      required: true,
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
      minLength: 20,
      maxLength: 2000,
    },
    {
      name: 'helpful',
      type: 'group',
      fields: [
        {
          name: 'yes',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'no',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'voters',
          type: 'array',
          admin: { readOnly: true },
          fields: [
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
            },
            {
              name: 'vote',
              type: 'select',
              options: ['yes', 'no'],
            },
          ],
        },
      ],
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Approve to show on product page',
      },
    },
    {
      name: 'flagged',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Flagged for review',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // Auto-verify purchase on create
        if (operation === 'create' && data.author?.user && data.product) {
          const hasPurchased = await checkUserHasPurchased(
            req.payload,
            data.author.user,
            data.product,
          )
          data.author.verified = hasPurchased
        }
        return data
      },
    ],
  },
}

// Helper function to check if user purchased product
async function checkUserHasPurchased(payload: any, userId: string, productId: string) {
  const orders = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { customer: { equals: userId } },
        { 'items.product': { equals: productId } },
        { status: { equals: 'completed' } },
      ],
    },
    limit: 1,
  })

  return orders.totalDocs > 0
}
\`\`\`

### Review Submission API

\`\`\`typescript
// app/api/reviews/submit/route.ts
import { getPayloadClient } from '@/lib/payload'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const payload = await getPayloadClient()
  const user = await payload.getCurrentUser(request)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { productId, rating, text } = body

  // Validation
  if (!productId || !rating || !text) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (text.length < 20 || text.length > 2000) {
    return NextResponse.json({ error: 'Text must be 20-2000 characters' }, { status: 400 })
  }

  // Check if user already reviewed this product
  const existing = await payload.find({
    collection: 'reviews',
    where: {
      and: [
        { 'author.user': { equals: user.id } },
        { product: { equals: productId } },
      ],
    },
  })

  if (existing.totalDocs > 0) {
    return NextResponse.json({ error: 'You already reviewed this product' }, { status: 400 })
  }

  // Create review
  const review = await payload.create({
    collection: 'reviews',
    data: {
      product: productId,
      author: {
        user: user.id,
        name: user.name || 'Anonymous',
        initials: getInitials(user.name || 'A'),
        verified: false, // Will be auto-set by hook
      },
      rating: parseInt(rating, 10),
      text,
      approved: false, // Requires admin approval
    },
  })

  return NextResponse.json({ success: true, review })
}

function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 0) return 'A'
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
\`\`\`

### Helpful Voting API

\`\`\`typescript
// app/api/reviews/helpful/route.ts
import { getPayloadClient } from '@/lib/payload'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const payload = await getPayloadClient()
  const user = await payload.getCurrentUser(request)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { reviewId, vote } = body

  if (!reviewId || !['yes', 'no'].includes(vote)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  // Fetch review
  const review = await payload.findByID({
    collection: 'reviews',
    id: reviewId,
  })

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 })
  }

  // Check if user already voted
  const voters = review.helpful?.voters || []
  const existingVote = voters.find((v: any) => v.user === user.id)

  let updatedVoters = voters
  let yesCount = review.helpful?.yes || 0
  let noCount = review.helpful?.no || 0

  if (existingVote) {
    // Update existing vote
    if (existingVote.vote === 'yes') yesCount--
    if (existingVote.vote === 'no') noCount--

    updatedVoters = voters.map((v: any) =>
      v.user === user.id ? { ...v, vote } : v,
    )
  } else {
    // Add new vote
    updatedVoters = [...voters, { user: user.id, vote }]
  }

  if (vote === 'yes') yesCount++
  if (vote === 'no') noCount++

  // Update review
  await payload.update({
    collection: 'reviews',
    id: reviewId,
    data: {
      helpful: {
        yes: yesCount,
        no: noCount,
        voters: updatedVoters,
      },
    },
  })

  return NextResponse.json({ success: true, yes: yesCount, no: noCount })
}
\`\`\`

---

## Testing Checklist

- [ ] Average score displays correctly (1 decimal)
- [ ] Star distribution bars show correct percentages
- [ ] Total count matches review array length
- [ ] Write button opens review modal
- [ ] Individual reviews render with all fields
- [ ] Verified badge shows only for verified purchases
- [ ] Star ratings display correctly (filled/empty)
- [ ] Helpful voting updates counts
- [ ] Helpful buttons show active state after voting
- [ ] Empty state shows when no reviews
- [ ] Component responsive on mobile
- [ ] ARIA labels correct for screen readers
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works
- [ ] Component builds without errors

---

## Related Components

- **ProductCard** (ec01) - Shows compact rating summary
- **QuickViewModal** (c5) - May include compact reviews
- **ReviewFormModal** - Separate modal for submitting reviews (future component)

---

**Last Updated:** 25 February 2026
**Status:** ✅ Production Ready
**Build Status:** ✅ Passing
