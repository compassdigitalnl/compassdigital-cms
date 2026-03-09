import { sql } from 'drizzle-orm'

/**
 * Activeer ingeplande promoties waarvan de startdatum is bereikt
 */
export async function activateScheduledPromotions(drizzle: any): Promise<number> {
  const result = await drizzle.execute(
    sql.raw(`
      UPDATE "promotions"
      SET "status" = 'active', "updated_at" = NOW()
      WHERE "status" = 'draft'
        AND "start_date" IS NOT NULL
        AND "start_date" <= NOW()
    `),
  )

  return result?.rowCount ?? 0
}

/**
 * Deactiveer verlopen promoties waarvan de einddatum is verstreken
 */
export async function deactivateExpiredPromotions(drizzle: any): Promise<number> {
  const result = await drizzle.execute(
    sql.raw(`
      UPDATE "promotions"
      SET "status" = 'expired', "updated_at" = NOW()
      WHERE "status" = 'active'
        AND "end_date" IS NOT NULL
        AND "end_date" < NOW()
    `),
  )

  return result?.rowCount ?? 0
}
