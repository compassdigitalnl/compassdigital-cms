import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * Seed Themes Script
 *
 * Populates the Themes collection with 10 default industry vertical themes.
 * Each theme includes color overrides, typography settings, and metadata.
 *
 * Usage:
 *   npx ts-node src/scripts/seedThemes.ts
 *
 * Note: Script is idempotent - only creates themes that don't already exist.
 */

const defaultThemes = [
  // ═══════════════════════════════════════════════════════════
  // 1. MEDISCH B2B (Default Theme)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Medisch B2B',
    slug: 'medisch',
    icon: '🩺',
    isDefault: true,
    description: 'Medical B2B e-commerce platform',
    primaryColor: '#00897B',
    primaryColorLight: '#26A69A',
    primaryColorDark: '#00695C',
    darkSurface: '#0A1628',
    darkSurfaceLight: '#121F33',
    bodyFont: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
    templateCount: 48,
    uniqueComponentCount: 0,
    status: 'active' as const,
  },

  // ═══════════════════════════════════════════════════════════
  // 2. BEAUTY / SALON
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Beauty / Salon',
    slug: 'beauty',
    icon: '✨',
    isDefault: false,
    description: 'Beauty salon and spa services',
    primaryColor: '#E91E63',
    primaryColorLight: '#F06292',
    primaryColorDark: '#C2185B',
    darkSurface: '#1a1a2e',
    darkSurfaceLight: '#252542',
    bodyFont: "'DM Sans', system-ui, sans-serif",
    customColors: [
      { tokenName: 'pink', tokenValue: '#EC4899' },
      { tokenName: 'pink-light', tokenValue: '#FCE7F3' },
    ],
    primaryGradient: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
    templateCount: 5,
    uniqueComponentCount: 4,
    status: 'active' as const,
  },

  // ═══════════════════════════════════════════════════════════
  // 3. BOUW
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Bouw',
    slug: 'bouw',
    icon: '🏗️',
    isDefault: false,
    description: 'Construction and building services',
    primaryColor: '#2196F3',
    primaryColorLight: '#42A5F5',
    primaryColorDark: '#1976D2',
    darkSurface: '#1B2631',
    darkSurfaceLight: '#273746',
    bodyFont: "'DM Sans', system-ui, sans-serif",
    primaryGradient: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
    templateCount: 5,
    uniqueComponentCount: 4,
    status: 'active' as const,
  },

  // ═══════════════════════════════════════════════════════════
  // 4. HORECA
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Horeca',
    slug: 'horeca',
    icon: '🍽️',
    isDefault: false,
    description: 'Restaurant and hospitality services',
    primaryColor: '#C9A84C',
    primaryColorLight: '#D4B869',
    primaryColorDark: '#B89738',
    darkSurface: '#2C1810',
    darkSurfaceLight: '#3D2419',
    bodyFont: "'DM Sans', system-ui, sans-serif",
    customColors: [
      { tokenName: 'gold', tokenValue: '#C9A84C' },
      { tokenName: 'gold-light', tokenValue: 'rgba(201,168,76,.12)' },
      { tokenName: 'cream', tokenValue: '#FDF8F0' },
    ],
    primaryGradient: 'linear-gradient(135deg, #C9A84C 0%, #D4B869 100%)',
    templateCount: 5,
    uniqueComponentCount: 4,
    status: 'active' as const,
  },

  // ═══════════════════════════════════════════════════════════
  // 5. ZORG / FYSIO
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Zorg / Fysio',
    slug: 'zorg',
    icon: '💚',
    isDefault: false,
    description: 'Healthcare and physiotherapy',
    primaryColor: '#4CAF50',
    primaryColorLight: '#66BB6A',
    primaryColorDark: '#388E3C',
    darkSurface: '#0F2027',
    darkSurfaceLight: '#1A2F38',
    bodyFont: "'DM Sans', system-ui, sans-serif",
    primaryGradient: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
    templateCount: 5,
    uniqueComponentCount: 4,
    status: 'active' as const,
  },

  // ═══════════════════════════════════════════════════════════
  // 6. EVENTS
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Events',
    slug: 'events',
    icon: '🎫',
    isDefault: false,
    description: 'Event management and ticketing',
    primaryColor: '#7C3AED',
    primaryColorLight: '#8B5CF6',
    primaryColorDark: '#6D28D9',
    darkSurface: '#1a1033',
    darkSurfaceLight: '#251A3D',
    bodyFont: "'DM Sans', system-ui, sans-serif",
    primaryGradient: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
    templateCount: 3,
    uniqueComponentCount: 4,
    status: 'active' as const,
  },

  // ═══════════════════════════════════════════════════════════
  // 7. ACCOMMODATIE
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Accommodatie',
    slug: 'accommodatie',
    icon: '🏨',
    isDefault: false,
    description: 'Hotel and accommodation booking',
    primaryColor: '#00BCD4',
    primaryColorLight: '#26C6DA',
    primaryColorDark: '#0097A7',
    darkSurface: '#0a2e36',
    darkSurfaceLight: '#154248',
    bodyFont: "'DM Sans', system-ui, sans-serif",
    primaryGradient: 'linear-gradient(135deg, #00BCD4 0%, #26C6DA 100%)',
    templateCount: 3,
    uniqueComponentCount: 4,
    status: 'active' as const,
  },

  // ═══════════════════════════════════════════════════════════
  // 8. MAKELAAR (In Development)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Makelaar',
    slug: 'makelaar',
    icon: '🏠',
    isDefault: false,
    description: 'Real estate and property services',
    primaryColor: '#3F51B5',
    primaryColorLight: '#5C6BC0',
    primaryColorDark: '#303F9F',
    darkSurface: '#1a1f3d',
    darkSurfaceLight: '#252A4E',
    bodyFont: "'DM Sans', system-ui, sans-serif",
    primaryGradient: 'linear-gradient(135deg, #3F51B5 0%, #5C6BC0 100%)',
    templateCount: 0,
    uniqueComponentCount: 6,
    status: 'development' as const,
  },

  // ═══════════════════════════════════════════════════════════
  // 9. AUTOMOTIVE (In Development)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Automotive',
    slug: 'automotive',
    icon: '🚗',
    isDefault: false,
    description: 'Automotive sales and services',
    primaryColor: '#FF5722',
    primaryColorLight: '#FF7043',
    primaryColorDark: '#E64A19',
    darkSurface: '#1a1a1a',
    darkSurfaceLight: '#262626',
    bodyFont: "'DM Sans', system-ui, sans-serif",
    primaryGradient: 'linear-gradient(135deg, #FF5722 0%, #FF7043 100%)',
    templateCount: 0,
    uniqueComponentCount: 5,
    status: 'development' as const,
  },

  // ═══════════════════════════════════════════════════════════
  // 10. PROFESSIONAL SERVICES (In Development)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Professional Services',
    slug: 'professional',
    icon: '💼',
    isDefault: false,
    description: 'Legal, consulting, and professional services',
    primaryColor: '#607D8B',
    primaryColorLight: '#78909C',
    primaryColorDark: '#455A64',
    darkSurface: '#1a2030',
    darkSurfaceLight: '#252B3D',
    bodyFont: "'DM Sans', system-ui, sans-serif",
    primaryGradient: 'linear-gradient(135deg, #607D8B 0%, #78909C 100%)',
    templateCount: 0,
    uniqueComponentCount: 5,
    status: 'development' as const,
  },
]

async function seedThemes() {
  console.log('🌱 Starting theme seed script...\n')

  try {
    const payload = await getPayload({ config: configPromise })

    console.log('✅ Payload initialized successfully')
    console.log(`📊 Seeding ${defaultThemes.length} default themes...\n`)

    let created = 0
    let skipped = 0

    for (const theme of defaultThemes) {
      try {
        // Check if theme already exists
        const existing = await payload.find({
          collection: 'themes',
          where: { slug: { equals: theme.slug } },
        })

        if (existing.docs.length === 0) {
          await payload.create({
            collection: 'themes',
            data: theme as any,
          })
          console.log(`✅ Created theme: ${theme.name} (${theme.slug})`)
          created++
        } else {
          console.log(`⏭️  Skipped (already exists): ${theme.name} (${theme.slug})`)
          skipped++
        }
      } catch (error) {
        console.error(`❌ Failed to create theme ${theme.name}:`, error)
      }
    }

    console.log('\n✨ Theme seeding complete!')
    console.log(`📈 Summary: ${created} created, ${skipped} skipped`)
    console.log(`\n💡 Tip: Visit /admin/collections/themes to view all themes`)
  } catch (error) {
    console.error('❌ Fatal error during theme seeding:', error)
    process.exit(1)
  }
}

// Run the seed script
seedThemes()
