import type { Access } from 'payload'

import { isAdmin } from '@/access/utilities'

export const adminOrPublishedStatus: Access = ({ req: { user } }) => {
  if (isAdmin(user)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
