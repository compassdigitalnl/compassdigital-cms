/**
 * seed-forms.mjs — Create default forms in a client database based on feature flags.
 *
 * Usage:
 *   node scripts/seed-forms.mjs <DATABASE_URL>
 *
 * Example:
 *   node scripts/seed-forms.mjs postgresql://postgres:pass@host:5432/client_plastimed01
 */

import pg from 'pg';
const { Pool } = pg;

const databaseUrl = process.argv[2] || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('Usage: node scripts/seed-forms.mjs <DATABASE_URL>');
  console.error('   or: DATABASE_URL=... node scripts/seed-forms.mjs');
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });
const now = new Date().toISOString();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Generate a random 24-char hex id (same format Payload uses for block rows). */
function randomId() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Build a Lexical JSON confirmation message from a plain text string. */
function lexicalMessage(text) {
  return JSON.stringify({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          children: [{ text, type: 'text', version: 1 }],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
    },
  });
}

// ---------------------------------------------------------------------------
// Field-block insert helpers
// ---------------------------------------------------------------------------

async function insertTextBlock(formId, order, { name, label, required = true, defaultValue = null }) {
  await pool.query(
    `INSERT INTO forms_blocks_text (_order, _parent_id, _path, id, name, label, width, default_value, required, block_name)
     VALUES ($1, $2, 'fields', $3, $4, $5, NULL, $6, $7, NULL)`,
    [order, formId, randomId(), name, label, defaultValue, required ? 1 : 0],
  );
}

async function insertEmailBlock(formId, order, { name, label, required = true }) {
  await pool.query(
    `INSERT INTO forms_blocks_email (_order, _parent_id, _path, id, name, label, width, required, block_name)
     VALUES ($1, $2, 'fields', $3, $4, $5, NULL, $6, NULL)`,
    [order, formId, randomId(), name, label, required ? 1 : 0],
  );
}

async function insertTextareaBlock(formId, order, { name, label, required = true, defaultValue = null }) {
  await pool.query(
    `INSERT INTO forms_blocks_textarea (_order, _parent_id, _path, id, name, label, width, default_value, required, block_name)
     VALUES ($1, $2, 'fields', $3, $4, $5, NULL, $6, $7, NULL)`,
    [order, formId, randomId(), name, label, defaultValue, required ? 1 : 0],
  );
}

async function insertCheckboxBlock(formId, order, { name, label, required = true, defaultValue = null }) {
  await pool.query(
    `INSERT INTO forms_blocks_checkbox (_order, _parent_id, _path, id, name, label, width, required, default_value, block_name)
     VALUES ($1, $2, 'fields', $3, $4, $5, NULL, $6, $7, NULL)`,
    [order, formId, randomId(), name, label, required ? 1 : 0, defaultValue != null ? (defaultValue ? 1 : 0) : null],
  );
}

async function insertNumberBlock(formId, order, { name, label, required = true, defaultValue = null }) {
  await pool.query(
    `INSERT INTO forms_blocks_number (_order, _parent_id, _path, id, name, label, width, default_value, required, block_name)
     VALUES ($1, $2, 'fields', $3, $4, $5, NULL, $6, $7, NULL)`,
    [order, formId, randomId(), name, label, defaultValue, required ? 1 : 0],
  );
}

async function insertSelectBlock(formId, order, { name, label, required = true, options, defaultValue = null, placeholder = null }) {
  const blockId = randomId();
  await pool.query(
    `INSERT INTO forms_blocks_select (_order, _parent_id, _path, id, name, label, width, default_value, placeholder, required, block_name)
     VALUES ($1, $2, 'fields', $3, $4, $5, NULL, $6, $7, $8, NULL)`,
    [order, formId, blockId, name, label, defaultValue, placeholder, required ? 1 : 0],
  );
  // Insert select options
  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    await pool.query(
      `INSERT INTO forms_blocks_select_options (_order, _parent_id, id, label, value)
       VALUES ($1, $2, $3, $4, $5)`,
      [i + 1, blockId, randomId(), opt.label, opt.value],
    );
  }
}

// ---------------------------------------------------------------------------
// Form creation helper
// ---------------------------------------------------------------------------

async function createForm(title, submitButtonLabel, confirmationText, fieldsCallback) {
  // Check if form already exists
  const existing = await pool.query('SELECT id FROM forms WHERE title = $1', [title]);
  if (existing.rows.length > 0) {
    return { created: false, title };
  }

  // Insert form
  const res = await pool.query(
    `INSERT INTO forms (title, submit_button_label, confirmation_type, confirmation_message, updated_at, created_at)
     VALUES ($1, $2, 'message', $3::jsonb, $4, $4) RETURNING id`,
    [title, submitButtonLabel, lexicalMessage(confirmationText), now],
  );
  const formId = res.rows[0].id;

  // Insert field blocks
  await fieldsCallback(formId);

  return { created: true, title, id: formId };
}

// ---------------------------------------------------------------------------
// Form definitions
// ---------------------------------------------------------------------------

async function seedContactformulier() {
  return createForm(
    'Contactformulier',
    'Versturen',
    'Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.',
    async (formId) => {
      await insertTextBlock(formId, 1, { name: 'naam', label: 'Naam', required: true });
      await insertEmailBlock(formId, 2, { name: 'email', label: 'E-mailadres', required: true });
      await insertTextBlock(formId, 3, { name: 'telefoon', label: 'Telefoonnummer', required: false });
      await insertTextareaBlock(formId, 4, { name: 'bericht', label: 'Uw bericht', required: true });
      await insertCheckboxBlock(formId, 5, { name: 'privacy', label: 'Ik ga akkoord met het privacybeleid', required: true });
    },
  );
}

async function seedNieuwsbrief() {
  return createForm(
    'Nieuwsbrief',
    'Aanmelden',
    'U bent succesvol aangemeld voor onze nieuwsbrief!',
    async (formId) => {
      await insertTextBlock(formId, 1, { name: 'naam', label: 'Naam', required: false });
      await insertEmailBlock(formId, 2, { name: 'email', label: 'E-mailadres', required: true });
    },
  );
}

async function seedFeedbackFormulier() {
  return createForm(
    'Feedback formulier',
    'Versturen',
    'Bedankt voor uw feedback!',
    async (formId) => {
      await insertTextBlock(formId, 1, { name: 'naam', label: 'Naam', required: false });
      await insertEmailBlock(formId, 2, { name: 'email', label: 'E-mailadres', required: false });
      await insertSelectBlock(formId, 3, {
        name: 'beoordeling',
        label: 'Beoordeling',
        required: true,
        options: [
          { label: 'Uitstekend', value: 'uitstekend' },
          { label: 'Goed', value: 'goed' },
          { label: 'Gemiddeld', value: 'gemiddeld' },
          { label: 'Slecht', value: 'slecht' },
        ],
      });
      await insertTextareaBlock(formId, 4, { name: 'bericht', label: 'Uw feedback', required: true });
    },
  );
}

async function seedOfferteAanvragen() {
  return createForm(
    'Offerte aanvragen',
    'Offerte aanvragen',
    'Bedankt voor uw aanvraag! We sturen u binnen 2 werkdagen een offerte.',
    async (formId) => {
      await insertTextBlock(formId, 1, { name: 'bedrijfsnaam', label: 'Bedrijfsnaam', required: true });
      await insertTextBlock(formId, 2, { name: 'contactpersoon', label: 'Contactpersoon', required: true });
      await insertEmailBlock(formId, 3, { name: 'email', label: 'E-mailadres', required: true });
      await insertTextBlock(formId, 4, { name: 'telefoon', label: 'Telefoonnummer', required: true });
      await insertTextareaBlock(formId, 5, { name: 'omschrijving', label: 'Omschrijving van uw aanvraag', required: true });
      await insertCheckboxBlock(formId, 6, { name: 'privacy', label: 'Ik ga akkoord met het privacybeleid', required: true });
    },
  );
}

async function seedWorkshopRegistratie() {
  return createForm(
    'Workshop registratie',
    'Registreren',
    'U bent succesvol geregistreerd! U ontvangt een bevestiging per e-mail.',
    async (formId) => {
      await insertTextBlock(formId, 1, { name: 'naam', label: 'Naam', required: true });
      await insertEmailBlock(formId, 2, { name: 'email', label: 'E-mailadres', required: true });
      await insertTextBlock(formId, 3, { name: 'telefoon', label: 'Telefoonnummer', required: true });
      await insertNumberBlock(formId, 4, { name: 'aantal_personen', label: 'Aantal personen', required: true });
      await insertTextareaBlock(formId, 5, { name: 'opmerkingen', label: 'Opmerkingen', required: false });
    },
  );
}

async function seedReservering() {
  return createForm(
    'Reservering',
    'Reserveren',
    'Bedankt voor uw reservering! We bevestigen deze zo snel mogelijk.',
    async (formId) => {
      await insertTextBlock(formId, 1, { name: 'naam', label: 'Naam', required: true });
      await insertEmailBlock(formId, 2, { name: 'email', label: 'E-mailadres', required: true });
      await insertTextBlock(formId, 3, { name: 'telefoon', label: 'Telefoonnummer', required: true });
      await insertTextBlock(formId, 4, { name: 'datum', label: 'Gewenste datum', required: true });
      await insertTextBlock(formId, 5, { name: 'tijd', label: 'Gewenste tijd', required: true });
      await insertNumberBlock(formId, 6, { name: 'aantal_gasten', label: 'Aantal gasten', required: true });
      await insertTextareaBlock(formId, 7, { name: 'opmerkingen', label: 'Bijzonderheden (allergieen, dieetwensen, etc.)', required: false });
    },
  );
}

async function seedRetourAanvraag() {
  return createForm(
    'Retour aanvraag',
    'Retour aanvragen',
    'Uw retour aanvraag is ontvangen. U ontvangt instructies per e-mail.',
    async (formId) => {
      await insertTextBlock(formId, 1, { name: 'ordernummer', label: 'Ordernummer', required: true });
      await insertTextBlock(formId, 2, { name: 'naam', label: 'Naam', required: true });
      await insertEmailBlock(formId, 3, { name: 'email', label: 'E-mailadres', required: true });
      await insertSelectBlock(formId, 4, {
        name: 'reden',
        label: 'Reden van retour',
        required: true,
        options: [
          { label: 'Beschadigd', value: 'beschadigd' },
          { label: 'Verkeerd product', value: 'verkeerd-product' },
          { label: 'Niet tevreden', value: 'niet-tevreden' },
          { label: 'Anders', value: 'anders' },
        ],
      });
      await insertTextareaBlock(formId, 5, { name: 'toelichting', label: 'Toelichting', required: true });
    },
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('seed-forms: connecting to database...');

  // Read feature flags (gracefully handle missing table/rows)
  let flags = {
    feature_toggles_enable_quotes: false,
    feature_toggles_enable_workshops: false,
    feature_toggles_enable_horeca: false,
    feature_toggles_enable_returns: false,
  };

  try {
    const res = await pool.query(`
      SELECT feature_toggles_enable_quotes,
             feature_toggles_enable_workshops,
             feature_toggles_enable_horeca,
             feature_toggles_enable_returns
      FROM e_commerce_settings
      LIMIT 1
    `);
    if (res.rows.length > 0) {
      flags = res.rows[0];
    }
  } catch (err) {
    console.log('seed-forms: e_commerce_settings table not found or not accessible — using defaults (all feature flags off)');
  }

  console.log('seed-forms: feature flags:', {
    quotes: !!flags.feature_toggles_enable_quotes,
    workshops: !!flags.feature_toggles_enable_workshops,
    horeca: !!flags.feature_toggles_enable_horeca,
    returns: !!flags.feature_toggles_enable_returns,
  });

  const results = [];

  // --- Universal forms (always created) ---
  results.push(await seedContactformulier());
  results.push(await seedNieuwsbrief());
  results.push(await seedFeedbackFormulier());

  // --- Conditional forms based on feature flags ---
  if (flags.feature_toggles_enable_quotes) {
    results.push(await seedOfferteAanvragen());
  }
  if (flags.feature_toggles_enable_workshops) {
    results.push(await seedWorkshopRegistratie());
  }
  if (flags.feature_toggles_enable_horeca) {
    results.push(await seedReservering());
  }
  if (flags.feature_toggles_enable_returns) {
    results.push(await seedRetourAanvraag());
  }

  // --- Summary ---
  const created = results.filter((r) => r.created);
  const skipped = results.filter((r) => !r.created);

  console.log('');
  for (const r of created) {
    console.log(`  + Created: "${r.title}" (ID ${r.id})`);
  }
  for (const r of skipped) {
    console.log(`  - Skipped: "${r.title}" (already exists)`);
  }

  console.log(`\nSeeded ${created.length} forms (${skipped.length} skipped as already existing)`);

  await pool.end();
}

main().catch((err) => {
  console.error('seed-forms: fatal error:', err.message);
  pool.end();
  process.exit(1);
});
