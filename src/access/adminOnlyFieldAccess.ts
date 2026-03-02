import type { FieldAccess } from 'payload'

import { isAdmin } from '@/access/utilities'

export const adminOnlyFieldAccess: FieldAccess = ({ req: { user } }) => isAdmin(user)
