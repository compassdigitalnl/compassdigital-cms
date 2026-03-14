import type { CollectionAfterChangeHook } from 'payload'

/**
 * Enrollment Status Hook (Onderwijs Branch)
 *
 * Payload CMS afterChange hook on Enrollments collection.
 * Detects status changes and logs actions + updates course studentCount.
 *
 * Trigger map:
 *   pending   -> active    : Log "Inschrijving actief", update course studentCount +1
 *   active    -> completed : Log "Cursus afgerond"
 *   active    -> refunded  : Log "Inschrijving terugbetaald", update course studentCount -1
 *   pending   -> expired   : Log "Inschrijving verlopen"
 */

function getCourseName(doc: any): string {
  if (typeof doc.course === 'object' && doc.course?.title) return doc.course.title
  return `cursus ${doc.course || 'onbekend'}`
}

function getCourseId(doc: any): number | null {
  if (typeof doc.course === 'object' && doc.course?.id) return doc.course.id
  if (typeof doc.course === 'number') return doc.course
  return null
}

export const enrollmentHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Only trigger on update (not create — creates are handled by the API endpoint)
  if (operation !== 'update') return doc

  const newStatus = doc.enrollmentStatus
  const oldStatus = previousDoc?.enrollmentStatus

  // No status change -> no action
  if (!newStatus || newStatus === oldStatus) return doc

  const enrollmentNumber = doc.enrollmentNumber || `ID:${doc.id}`
  const courseName = getCourseName(doc)
  const courseId = getCourseId(doc)

  // Handle status transitions
  if (oldStatus === 'pending' && newStatus === 'active') {
    console.log(
      `[enrollmentHook] Inschrijving actief: ${enrollmentNumber} voor ${courseName}`,
    )

    // Update course studentCount +1
    if (courseId && req.payload) {
      try {
        const course = await req.payload.findByID({
          collection: 'courses',
          id: courseId,
        })
        await req.payload.update({
          collection: 'courses',
          id: courseId,
          data: {
            studentCount: (course.studentCount || 0) + 1,
          },
        })
      } catch (e) {
        console.error(`[enrollmentHook] Fout bij updaten studentCount +1 voor cursus ${courseId}:`, e)
      }
    }
  } else if (oldStatus === 'active' && newStatus === 'completed') {
    console.log(
      `[enrollmentHook] Cursus afgerond: ${enrollmentNumber}`,
    )
  } else if (oldStatus === 'active' && newStatus === 'refunded') {
    console.log(
      `[enrollmentHook] Inschrijving terugbetaald: ${enrollmentNumber}`,
    )

    // Update course studentCount -1
    if (courseId && req.payload) {
      try {
        const course = await req.payload.findByID({
          collection: 'courses',
          id: courseId,
        })
        await req.payload.update({
          collection: 'courses',
          id: courseId,
          data: {
            studentCount: Math.max(0, (course.studentCount || 0) - 1),
          },
        })
      } catch (e) {
        console.error(`[enrollmentHook] Fout bij updaten studentCount -1 voor cursus ${courseId}:`, e)
      }
    }
  } else if (oldStatus === 'pending' && newStatus === 'expired') {
    console.log(
      `[enrollmentHook] Inschrijving verlopen: ${enrollmentNumber}`,
    )
  }

  return doc
}
