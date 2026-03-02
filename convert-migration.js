import fs from 'fs';

// Read the SQLite migration
const sqliteContent = fs.readFileSync('src/migrations/old/20260302_162512_sqlite_WRONG.ts', 'utf8');

let stats = {
  createTable: 0,
  createType: 0,
  createIndex: 0,
  foreignKeys: 0,
  alterTable: 0,
};

// Step 1: Replace imports
let converted = sqliteContent.replace(
  `import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'`,
  `import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'`
);

// Step 2: Replace db.run with db.execute
converted = converted.replace(/await db\.run\(/g, 'await db.execute(');

// Step 3: Replace escaped backticks with double quotes in SQL
// The backticks are escaped with backslashes: \`
converted = converted.replace(/\\`/g, '"');

// Step 4: Convert SQLite-specific syntax to PostgreSQL
converted = converted.replace(/sql`([^`]+)`/gs, (match, sqlContent) => {
  let sql = sqlContent;

  // Count CREATE TABLE statements
  if (sql.includes('CREATE TABLE')) stats.createTable++;
  if (sql.includes('CREATE INDEX')) stats.createIndex++;
  if (sql.includes('FOREIGN KEY')) stats.foreignKeys++;

  // Replace SQLite's strftime with PostgreSQL's NOW()
  sql = sql.replace(/DEFAULT \(strftime\('%Y-%m-%dT%H:%M:%fZ', 'now'\)\)/g, 'DEFAULT NOW()');

  // Make CREATE TABLE idempotent
  sql = sql.replace(/CREATE TABLE "([^"]+)"/g, 'CREATE TABLE IF NOT EXISTS "$1"');

  // Make CREATE INDEX idempotent
  sql = sql.replace(/CREATE (UNIQUE )?INDEX "([^"]+)"/g, 'CREATE $1INDEX IF NOT EXISTS "$2"');

  return `sql\`${sql}\``;
});

// Step 5: Wrap CREATE TYPE statements in DO blocks for idempotency
converted = converted.replace(
  /await db\.execute\(sql`CREATE TYPE "([^"]+)" AS ENUM \(([^)]+)\)`\);/g,
  (match, typeName, values) => {
    stats.createType++;
    return `await db.execute(sql\`DO $$ BEGIN
    CREATE TYPE "${typeName}" AS ENUM (${values});
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;\`);`;
  }
);

// Step 6: Wrap ALTER TABLE ADD CONSTRAINT in DO blocks
converted = converted.replace(
  /await db\.execute\(sql`ALTER TABLE "[^"]+" ADD CONSTRAINT "[^"]+"[^`]+`\);/g,
  (match) => {
    const constraintMatch = match.match(/ADD CONSTRAINT "([^"]+)"/);
    if (constraintMatch) {
      return match.replace(
        /sql`(ALTER TABLE "[^"]+" ADD CONSTRAINT "[^"]+"[^`]+)`/,
        `sql\`DO $$ BEGIN
    $1;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;\``
      );
    }
    return match;
  }
);

// Write the converted migration
const newFilename = 'src/migrations/20260302_170000_complete_schema.ts';
fs.writeFileSync(newFilename, converted, 'utf8');

console.log('Migration conversion complete!');
console.log('Stats:');
console.log(`- CREATE TABLE statements: ${stats.createTable}`);
console.log(`- CREATE TYPE statements: ${stats.createType}`);
console.log(`- CREATE INDEX statements: ${stats.createIndex}`);
console.log(`- Foreign key constraints: ${stats.foreignKeys}`);
console.log(`\nSaved to: ${newFilename}`);

// Check for critical tables
const criticalTables = [
  'products',
  '_products_v',
  'footer',
  'footer_social_links',
  'footer_trust_badges',
  'footer_legal_links',
  'pages_blocks_video',
  'settings_shop_filter_order',
  'theme'
];

console.log('\nChecking for critical tables:');
criticalTables.forEach(table => {
  const found = converted.includes(`CREATE TABLE IF NOT EXISTS "${table}"`);
  console.log(`- ${table}: ${found ? '✓' : '✗'}`);
});

// Check for _status column in products
const hasProductsStatus = converted.match(/CREATE TABLE IF NOT EXISTS "products"[^;]+_status/s);
console.log(`- products._status column: ${hasProductsStatus ? '✓' : '✗'}`);

// Check for video_file_id
const hasVideoFileId = converted.includes('video_file_id');
console.log(`- pages_blocks_video.video_file_id: ${hasVideoFileId ? '✓' : '✗'}`);
