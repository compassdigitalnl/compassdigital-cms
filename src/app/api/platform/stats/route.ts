/**
 * Platform Stats API
 * GET /api/platform/stats - Get platform-wide statistics
 */

import { GET_PlatformStats } from '@/branches/platform/api/clients'

export async function GET(request: Request) {
  return GET_PlatformStats()
}
