/**
 * Platform Clients API
 * GET /api/platform/clients - List all clients
 * POST /api/platform/clients - Create new client
 */

import { GET_Clients, POST_Clients } from '@/platform/api/clients'

export async function GET(request: Request) {
  return GET_Clients(request as any)
}

export async function POST(request: Request) {
  return POST_Clients(request as any)
}
