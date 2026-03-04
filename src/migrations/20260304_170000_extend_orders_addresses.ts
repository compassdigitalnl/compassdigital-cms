import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Shipping address: rename name → first_name, add last_name, addition, phone
  await db.execute(sql`
    ALTER TABLE orders RENAME COLUMN shipping_address_name TO shipping_address_first_name;
  `)
  await db.execute(sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_last_name varchar;
  `)
  await db.execute(sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_addition varchar;
  `)
  await db.execute(sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_phone varchar;
  `)

  // Billing address: add first_name, last_name, addition, phone, kvk, vat_number
  await db.execute(sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address_first_name varchar;
  `)
  await db.execute(sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address_last_name varchar;
  `)
  await db.execute(sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address_addition varchar;
  `)
  await db.execute(sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address_phone varchar;
  `)
  await db.execute(sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address_kvk varchar;
  `)
  await db.execute(sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address_vat_number varchar;
  `)

  // Customer email for notifications (works for both guest and logged-in)
  await db.execute(sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE orders DROP COLUMN IF EXISTS customer_email;`)
  await db.execute(sql`ALTER TABLE orders DROP COLUMN IF EXISTS billing_address_vat_number;`)
  await db.execute(sql`ALTER TABLE orders DROP COLUMN IF EXISTS billing_address_kvk;`)
  await db.execute(sql`ALTER TABLE orders DROP COLUMN IF EXISTS billing_address_phone;`)
  await db.execute(sql`ALTER TABLE orders DROP COLUMN IF EXISTS billing_address_addition;`)
  await db.execute(sql`ALTER TABLE orders DROP COLUMN IF EXISTS billing_address_last_name;`)
  await db.execute(sql`ALTER TABLE orders DROP COLUMN IF EXISTS billing_address_first_name;`)
  await db.execute(sql`ALTER TABLE orders DROP COLUMN IF EXISTS shipping_address_phone;`)
  await db.execute(sql`ALTER TABLE orders DROP COLUMN IF EXISTS shipping_address_addition;`)
  await db.execute(sql`ALTER TABLE orders DROP COLUMN IF EXISTS shipping_address_last_name;`)
  await db.execute(sql`ALTER TABLE orders RENAME COLUMN shipping_address_first_name TO shipping_address_name;`)
}
