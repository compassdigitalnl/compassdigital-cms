import type { Access } from 'payload'

import { isAdmin } from '@/access/utilities'

export const adminOnly: Access = ({ req: { user } }) => isAdmin(user)
