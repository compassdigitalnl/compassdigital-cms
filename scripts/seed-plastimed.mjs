import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: 'postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/client_plastimed01' });

const now = new Date().toISOString();
const brandIds = { hartmann: 1, '3m': 2, 'bsn-medical': 3, ansell: 4, medline: 5, molnlycke: 6, curetape: 7 };

const products = [
  { title: 'Omron M3 Comfort Bloeddrukmeter', slug: 'omron-m3-comfort-bloeddrukmeter', price: 79.99, sale_price: null, stock: 22, sku: 'OMR-M3C', brand: null, short_desc: 'Automatische bloeddrukmeter met Intelli Wrap manchet. Klinisch gevalideerd.', category: 44, material: 'Kunststof', badge: 'popular' },
  { title: 'Riester Ri-former Otoscoop Set', slug: 'riester-ri-former-otoscoop-set', price: 189.00, sale_price: null, stock: 5, sku: 'RIE-OTO-SET', brand: null, short_desc: 'Complete diagnostische set met otoscoop en oftalmoscoop in luxe etui.', category: 44, material: 'Aluminium', badge: 'none' },
  { title: 'Hartmann EHBO-koffer DIN 13157', slug: 'hartmann-ehbo-koffer-din-13157', price: 49.95, sale_price: null, stock: 30, sku: 'HTM-EHBO-157', brand: 'hartmann', short_desc: 'Complete verbanddoos volgens DIN 13157 norm. Geschikt voor bedrijven tot 50 werknemers.', category: 45, material: 'Kunststof', badge: 'none' },
  { title: 'BSN Leukoplast Professional', slug: 'bsn-leukoplast-professional', price: 6.95, sale_price: null, stock: 120, sku: 'BSN-LP-PRO', brand: 'bsn-medical', short_desc: 'Hypoallergene wondpleister. Extra sterke kleefkracht. Waterbestendig.', category: 45, material: 'Textiel', badge: 'none' },
  { title: 'Ansell Micro-Touch Nitriel Handschoenen M', slug: 'ansell-micro-touch-nitriel-handschoenen-m', price: 12.50, sale_price: null, stock: 500, sku: 'ANS-MT-NIT-M', brand: 'ansell', short_desc: 'Poedervrije nitrilhandschoenen. Uitstekende pasvorm en tastgevoel. 100 stuks per doos.', category: 50, material: 'Nitril', badge: 'none' },
  { title: 'Ansell Micro-Touch Nitriel Handschoenen L', slug: 'ansell-micro-touch-nitriel-handschoenen-l', price: 12.50, sale_price: null, stock: 350, sku: 'ANS-MT-NIT-L', brand: 'ansell', short_desc: 'Poedervrije nitrilhandschoenen maat L. 100 stuks per doos.', category: 50, material: 'Nitril', badge: 'none' },
  { title: '3M Aura 9320+ FFP2 Mondmasker (20st)', slug: '3m-aura-9320-ffp2-mondmasker', price: 24.95, sale_price: 19.95, stock: 200, sku: '3M-9320-20', brand: '3m', short_desc: 'FFP2 adembeschermingsmasker. 3-paneel design voor optimaal comfort.', category: 50, material: 'Polypropyleen', badge: 'sale' },
  { title: 'Medline Onderzoekshandschoenen Latex M', slug: 'medline-onderzoekshandschoenen-latex-m', price: 8.95, sale_price: null, stock: 400, sku: 'MDL-LAT-M', brand: 'medline', short_desc: 'Gepoederde latex onderzoekshandschoenen. 100 stuks per doos.', category: 50, material: 'Latex', badge: 'none' },
  { title: 'Medline Onderzoekshandschoenen Latex S', slug: 'medline-onderzoekshandschoenen-latex-s', price: 8.95, sale_price: null, stock: 0, sku: 'MDL-LAT-S', brand: 'medline', short_desc: 'Gepoederde latex onderzoekshandschoenen maat S. 100 stuks per doos.', category: 50, material: 'Latex', badge: 'sold-out' },
  { title: 'BD Discardit II Spuit 5ml (100st)', slug: 'bd-discardit-ii-spuit-5ml', price: 14.50, sale_price: null, stock: 80, sku: 'BD-DIS-5ML', brand: null, short_desc: 'Luer-slip spuiten met duidelijke schaalverdeling. 100 stuks per doos.', category: 46, material: 'Polypropyleen', badge: 'none' },
  { title: 'BD Microlance Naald 21G (100st)', slug: 'bd-microlance-naald-21g', price: 9.75, sale_price: null, stock: 150, sku: 'BD-ML-21G', brand: null, short_desc: 'Drievlaks slijping voor minimale pijnbeleving. 100 stuks.', category: 46, material: 'RVS', badge: 'none' },
  { title: 'Mölnlycke Mepilex Border Foam 10x10cm', slug: 'molnlycke-mepilex-border-foam-10x10cm', price: 32.50, sale_price: null, stock: 45, sku: 'MOL-MPX-10', brand: 'molnlycke', short_desc: 'Zelfklevend schuimverband met Safetac technologie. 5 stuks per verpakking.', category: 51, material: 'Polyurethaan schuim', badge: 'popular' },
  { title: 'Mölnlycke Mepitel One 10x18cm', slug: 'molnlycke-mepitel-one-10x18cm', price: 28.95, sale_price: null, stock: 35, sku: 'MOL-MT1-1018', brand: 'molnlycke', short_desc: 'Transparant wondcontactlaag. Voorkomt vasthechting aan de wond.', category: 51, material: 'Silicone', badge: 'none' },
  { title: '3M Tegaderm Transparant Filmverband 10x12cm', slug: '3m-tegaderm-transparant-filmverband', price: 18.75, sale_price: null, stock: 60, sku: '3M-TGD-1012', brand: '3m', short_desc: 'Waterbestendig transparant wondverband. Comfortabel en ademend.', category: 51, material: 'Polyurethaan film', badge: 'none' },
  { title: 'BSN Elastomull Fixatiezwachtel 6cm x 4m', slug: 'bsn-elastomull-fixatiezwachtel-6cm', price: 3.25, sale_price: null, stock: 200, sku: 'BSN-EL-6CM', brand: 'bsn-medical', short_desc: 'Elastische fixatiezwachtel. Hoge rekbaarheid, goede fixatie.', category: 1, material: 'Katoen/Polyamide', badge: 'none' },
  { title: 'Hartmann Peha-haft Cohesief Verband 8cm x 4m', slug: 'hartmann-peha-haft-cohesief-verband-8cm', price: 4.50, sale_price: null, stock: 150, sku: 'HTM-PH-8CM', brand: 'hartmann', short_desc: 'Zelfklevend cohesief fixatieverband. Hecht alleen aan zichzelf.', category: 1, material: 'Viscose/Polyamide', badge: 'none' },
  { title: 'Chirurgische Schaar Mayo 14cm', slug: 'chirurgische-schaar-mayo-14cm', price: 22.50, sale_price: null, stock: 18, sku: 'INS-SCH-M14', brand: null, short_desc: 'Mayo chirurgische schaar, gebogen. Roestvrij staal, autoclaveerbaar.', category: 47, material: 'RVS', badge: 'none' },
  { title: 'Anatomisch Pincet Standaard 14cm', slug: 'anatomisch-pincet-standaard-14cm', price: 8.95, sale_price: null, stock: 25, sku: 'INS-PIN-A14', brand: null, short_desc: 'Anatomisch pincet zonder tanden. Roestvrij staal, autoclaveerbaar.', category: 47, material: 'RVS', badge: 'none' },
];

let count = 0;
for (const p of products) {
  const brandId = p.brand ? (brandIds[p.brand] || null) : null;
  const stockStatus = p.stock > 0 ? 'in-stock' : 'out-of-stock';

  const res = await pool.query(
    `INSERT INTO products (title, slug, price, sale_price, stock, sku, brand_id, status, short_description, badge,
      product_type, tax_class, includes_tax, track_stock, stock_status, condition, template, weight_unit,
      free_shipping, customizable, quotation_required, contract_pricing, is_subscription, updated_at, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $24)
     ON CONFLICT DO NOTHING RETURNING id`,
    [p.title, p.slug, p.price, p.sale_price, p.stock, p.sku, brandId, 'published', p.short_desc, p.badge,
     'simple', 'standard', false, true, stockStatus, 'new', 'template1', 'kg',
     false, false, false, false, false, now]
  );

  if (!res.rows[0]) { console.log('SKIP (exists):', p.title); continue; }
  const productId = res.rows[0].id;
  count++;

  // Category rel
  await pool.query(`INSERT INTO products_rels ("order", parent_id, path, product_categories_id) VALUES (1, $1, $2, $3)`, [productId, 'categories', p.category]);

  // Specifications
  const specId = 'spec_' + productId + '_1';
  await pool.query(`INSERT INTO products_specifications (_order, _parent_id, id, "group") VALUES (1, $1, $2, $3)`, [productId, specId, 'Algemeen']);

  if (p.material) {
    await pool.query(`INSERT INTO products_specifications_attributes (_order, _parent_id, id, name, value, unit) VALUES (1, $1, $2, $3, $4, $5)`, [specId, 'attr_' + productId + '_mat', 'Materiaal', p.material, null]);
  }

  console.log(count + '. ' + p.title + ' (cat:' + p.category + ' brand:' + (p.brand || 'none') + ')');
}

// Category links for existing Curetape products (4, 5, 6)
for (const pid of [4, 5, 6]) {
  const existing = await pool.query('SELECT id FROM products_rels WHERE parent_id = $1 AND path = $2', [pid, 'categories']);
  if (existing.rows.length === 0) {
    await pool.query(`INSERT INTO products_rels ("order", parent_id, path, product_categories_id) VALUES (1, $1, $2, 3)`, [pid, 'categories']);
    console.log('Linked product ' + pid + ' to Kinesiotape category');
  }
}

const total = await pool.query("SELECT count(*) FROM products WHERE status = $1", ['published']);
console.log('\nDone! Added ' + count + ' new products. Total published: ' + total.rows[0].count);
pool.end();
