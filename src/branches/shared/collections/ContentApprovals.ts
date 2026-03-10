import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

/**
 * ContentApprovals Collection (Feature #28 - Content Goedkeuringsworkflows)
 *
 * Tracks approval requests for content items (pages, blog posts, products).
 * Editors submit content for approval, admins approve/reject.
 *
 * Features:
 * - Multi-collection support (pages, blog-posts, products)
 * - Approval status tracking (pending/approved/rejected/revision-requested)
 * - Reviewer assignment and notes
 * - Automatic timestamps
 * - Audit trail via history
 */
export const ContentApprovals: CollectionConfig = {
  slug: 'content-approvals',
  labels: {
    singular: 'Goedkeuringsverzoek',
    plural: 'Goedkeuringsworkflow',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Systeem',
    defaultColumns: ['title', 'contentType', 'status', 'submittedBy', 'reviewer', 'createdAt'],
    description: 'Goedkeuringsworkflow voor content (pagina\'s, blogposts, producten)',
  },
  access: {
    // Editors can see their own submissions, admins can see all
    read: ({ req: { user } }) => {
      if (checkRole(['admin'], user)) return true
      if (checkRole(['editor'], user) && user) {
        return {
          or: [
            { submittedBy: { equals: user.id } },
            { reviewer: { equals: user.id } },
          ],
        }
      }
      return false
    },
    // Editors and admins can create approval requests
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    // Admins can approve/reject; editors can only update their pending submissions
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    // Only admins can delete
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // === Content Reference ===
    {
      name: 'contentType',
      type: 'select',
      label: 'Content Type',
      required: true,
      options: [
        { label: 'Pagina', value: 'pages' },
        { label: 'Blogpost', value: 'blog-posts' },
        { label: 'Product', value: 'products' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'contentId',
      type: 'number',
      label: 'Content ID',
      required: true,
      admin: {
        description: 'ID van het content item',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Titel',
      required: true,
      admin: {
        description: 'Titel van het content item (voor overzicht)',
      },
    },
    {
      name: 'contentSlug',
      type: 'text',
      label: 'Slug',
      admin: {
        description: 'URL slug van het content item',
      },
    },

    // === Approval Status ===
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: 'In afwachting', value: 'pending' },
        { label: 'Goedgekeurd', value: 'approved' },
        { label: 'Afgewezen', value: 'rejected' },
        { label: 'Revisie gevraagd', value: 'revision-requested' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Prioriteit',
      defaultValue: 'normal',
      options: [
        { label: 'Laag', value: 'low' },
        { label: 'Normaal', value: 'normal' },
        { label: 'Hoog', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // === People ===
    {
      name: 'submittedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Ingediend door',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'reviewer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Reviewer',
      admin: {
        position: 'sidebar',
        description: 'Admin die het verzoek beoordeelt',
      },
    },

    // === Notes ===
    {
      name: 'submissionNote',
      type: 'textarea',
      label: 'Toelichting indiener',
      admin: {
        description: 'Wat is er gewijzigd en waarom?',
        rows: 4,
      },
    },
    {
      name: 'reviewNote',
      type: 'textarea',
      label: 'Feedback reviewer',
      admin: {
        description: 'Toelichting bij goedkeuring/afwijzing',
        rows: 4,
      },
    },

    // === Timestamps ===
    {
      name: 'submittedAt',
      type: 'date',
      label: 'Ingediend op',
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'reviewedAt',
      type: 'date',
      label: 'Beoordeeld op',
    },

    // === Audit Trail ===
    {
      name: 'history',
      type: 'json',
      label: 'Geschiedenis',
      admin: {
        description: 'Audit trail van statuswijzigingen',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      // Track status changes in history
      async ({ data, originalDoc, operation }) => {
        if (operation === 'update' && data?.status && originalDoc?.status !== data.status) {
          const history = Array.isArray(originalDoc?.history) ? [...originalDoc.history] : []
          history.push({
            from: originalDoc?.status,
            to: data.status,
            timestamp: new Date().toISOString(),
            note: data.reviewNote || undefined,
          })
          return {
            ...data,
            history,
            reviewedAt: ['approved', 'rejected', 'revision-requested'].includes(data.status)
              ? new Date().toISOString()
              : data.reviewedAt,
          }
        }
        return data
      },
    ],
    afterChange: [
      // When approved, publish the content item
      async ({ doc, operation, req }) => {
        if (operation === 'update' && doc.status === 'approved' && doc.contentType && doc.contentId) {
          try {
            await req.payload.update({
              collection: doc.contentType,
              id: doc.contentId,
              data: {
                _status: 'published',
              },
            })
            console.log(`[ContentApprovals] Published ${doc.contentType}/${doc.contentId}`)
          } catch (error) {
            console.error('[ContentApprovals] Failed to publish content:', error)
          }
        }
      },
    ],
  },
}

export default ContentApprovals
