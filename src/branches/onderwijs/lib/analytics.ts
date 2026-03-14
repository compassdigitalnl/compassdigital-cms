/**
 * Onderwijs Analytics — GA4 Event Tracking
 *
 * Tracks education-specific events for Google Analytics 4.
 */

type EducationEventType =
  | 'course_view'
  | 'course_search'
  | 'enrollment_start'
  | 'enrollment_complete'
  | 'lesson_view'
  | 'review_submit'

interface EducationEventParams {
  courseId?: string | number
  courseTitle?: string
  category?: string
  instructor?: string
  price?: number
  level?: string
  duration?: number
  searchQuery?: string
  lessonTitle?: string
  lessonType?: string
  sectionNumber?: number
  rating?: number
  enrollmentNumber?: string
  paymentMethod?: string
  progress?: number
  [key: string]: unknown
}

/**
 * Track an education-specific GA4 event.
 *
 * @param eventType - The type of education event
 * @param params - Additional event parameters
 *
 * @example
 * trackEducationEvent('course_view', { courseId: 123, courseTitle: 'Python voor Beginners', price: 49.95 })
 * trackEducationEvent('enrollment_start', { courseId: 123, paymentMethod: 'ideal' })
 * trackEducationEvent('lesson_view', { courseId: 123, lessonTitle: 'Introductie', lessonType: 'video' })
 * trackEducationEvent('review_submit', { courseId: 123, rating: 5 })
 */
export function trackEducationEvent(eventType: EducationEventType, params: EducationEventParams = {}): void {
  if (typeof window === 'undefined') return

  const gtag = (window as any).gtag
  if (typeof gtag !== 'function') return

  gtag('event', eventType, {
    event_category: 'onderwijs',
    ...params,
  })
}
