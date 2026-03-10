import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Breadcrumb } from '@/globals/site/breadcrumbs/components/Breadcrumb/Component'
import { ExperienceGallery } from '@/branches/experiences/components/detail/ExperienceGallery'
import { ExperienceInfo } from '@/branches/experiences/components/detail/ExperienceInfo'
import { BookingSidebar } from '@/branches/experiences/components/booking/BookingSidebar'
import { ExperienceTabs } from '@/branches/experiences/components/detail/ExperienceTabs'
import { RelatedExperiences } from '@/branches/experiences/components/detail/RelatedExperiences'
import { ReviewSummary } from '@/branches/experiences/components/detail/ReviewSummary'
import { ContactWidget } from '@/branches/experiences/components/detail/ContactWidget'

interface ExperienceDetailTemplateProps {
  experience: any
}

export async function ExperienceDetailTemplate({ experience }: ExperienceDetailTemplateProps) {
  const payload = await getPayload({ config })

  // Resolve category
  const category = typeof experience.category === 'object' ? experience.category : null

  // Fetch reviews for this experience
  let reviews: any[] = []
  try {
    const reviewsResult = await payload.find({
      collection: 'experience-reviews',
      where: {
        and: [
          { experience: { equals: experience.id } },
          { status: { equals: 'published' } },
        ],
      },
      limit: 20,
      sort: '-createdAt',
    })
    reviews = reviewsResult.docs
  } catch (e) {
    // fail silently
  }

  // Calculate rating summary
  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? reviews.reduce((sum: number, r: any) => sum + (r.overallRating || 0), 0) / totalReviews
    : 0

  // Build gallery images
  const galleryImages = []
  if (experience.featuredImage && typeof experience.featuredImage === 'object') {
    galleryImages.push({
      url: experience.featuredImage.url,
      alt: experience.featuredImage.alt || experience.title,
    })
  }
  if (experience.gallery) {
    experience.gallery.forEach((item: any) => {
      const img = typeof item.image === 'object' ? item.image : null
      if (img?.url) {
        galleryImages.push({
          url: img.url,
          alt: item.caption || img.alt || '',
          isVideo: item.isVideo,
        })
      }
    })
  }

  // Fetch related experiences (same category, exclude current)
  let relatedExperiences: any[] = []
  if (category) {
    try {
      const relatedResult = await payload.find({
        collection: 'experiences',
        where: {
          and: [
            { status: { equals: 'published' } },
            { category: { equals: category.id } },
            { id: { not_equals: experience.id } },
          ],
        },
        limit: 3,
        sort: '-createdAt',
        depth: 2,
      })
      relatedExperiences = relatedResult.docs.map((exp: any) => ({
        title: exp.title,
        slug: exp.slug,
        category: typeof exp.category === 'object' ? exp.category?.name : undefined,
        thumbnail: typeof exp.featuredImage === 'object' ? exp.featuredImage?.url : undefined,
        duration: exp.duration,
        personRange: exp.minPersons && exp.maxPersons
          ? `${exp.minPersons}-${exp.maxPersons} pers.`
          : undefined,
        rating: 0,
        pricePerPerson: exp.pricePerPerson || 0,
      }))
    } catch (e) {
      // fail silently
    }
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Ervaringen', href: '/ervaringen' },
  ]
  if (category) {
    breadcrumbItems.push({
      label: category.name,
      href: `/ervaringen/categorie/${category.slug}`,
    })
  }
  breadcrumbItems.push({ label: experience.title })

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg, #f9fafb)' }}>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <div className="container mx-auto px-4 mb-8">
          <ExperienceGallery
            images={galleryImages}
            badge={experience.popular ? 'Populair' : undefined}
          />
        </div>
      )}

      {/* Two-column layout */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Experience Info */}
            <ExperienceInfo
              title={experience.title}
              category={category?.name}
              duration={experience.duration}
              minPersons={experience.minPersons}
              maxPersons={experience.maxPersons}
              location={experience.location}
              rating={avgRating}
              reviewCount={totalReviews}
              highlights={experience.highlights || []}
              included={experience.included || []}
              description={experience.description}
            />

            {/* Review Summary */}
            {totalReviews > 0 && (
              <div className="mt-8">
                <ReviewSummary
                  averageRating={avgRating}
                  totalReviews={totalReviews}
                  reviews={reviews.slice(0, 3).map((r: any) => ({
                    author: r.reviewerName || 'Anoniem',
                    rating: r.overallRating || 0,
                    text: r.reviewText || '',
                    date: r.createdAt,
                  }))}
                />
              </div>
            )}

            {/* Tabs (reviews, FAQ, location) */}
            <div className="mt-8">
              <ExperienceTabs
                reviews={reviews.map((r: any) => ({
                  author: r.reviewerName || 'Anoniem',
                  rating: r.overallRating || 0,
                  text: r.reviewText || '',
                  date: r.createdAt,
                  ratings: r.ratings,
                }))}
                locationDetails={experience.locationDetails}
                location={experience.location}
              />
            </div>

            {/* Related Experiences */}
            {relatedExperiences.length > 0 && (
              <div className="mt-12">
                <RelatedExperiences experiences={relatedExperiences} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-[360px] flex-shrink-0">
            <div className="sticky top-20 space-y-6">
              <BookingSidebar
                price={experience.pricePerPerson || 0}
                priceType={experience.priceType}
                priceNote={experience.priceNote}
              />
              <ContactWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExperienceDetailTemplate
