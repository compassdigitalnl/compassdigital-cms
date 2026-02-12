/**
 * Seed Demo Shop Data
 * Creates demo products, categories, customer groups for testing the shop modules
 */

import { getPayload } from 'payload'
import config from '@payload-config'

async function seedShopDemo() {
  console.log('🌱 Seeding shop demo data...\n')

  try {
    const payload = await getPayload({ config })

    // 0. Clean existing demo data
    console.log('🧹 Cleaning existing demo data...')
    try {
      const existingProducts = await payload.find({ collection: 'products', limit: 1000 })
      for (const product of existingProducts.docs) {
        await payload.delete({ collection: 'products', id: product.id })
      }

      const existingCategories = await payload.find({ collection: 'product-categories', limit: 1000 })
      for (const cat of existingCategories.docs) {
        await payload.delete({ collection: 'product-categories', id: cat.id })
      }

      const existingGroups = await payload.find({ collection: 'customer-groups', limit: 1000 })
      for (const group of existingGroups.docs) {
        await payload.delete({ collection: 'customer-groups', id: group.id })
      }
      console.log('✅ Cleaned existing data\n')
    } catch (e) {
      console.log('ℹ️  No existing data to clean\n')
    }

    // 1. Create Customer Groups (B2B pricing tiers)
    console.log('📊 Creating customer groups...')

    const hospitalGroup = await payload.create({
      collection: 'customer-groups',
      data: {
        name: 'Hospital',
        slug: 'hospital',
        description: 'Large healthcare institutions',
        type: 'b2b',
        discount: 15,
        priority: 1,
        isDefault: false,
        minOrderAmount: 1000,
        canViewCatalog: true,
        canPlaceOrders: true,
        canRequestQuotes: true,
        canDownloadInvoices: true,
        canViewOrderHistory: true,
      },
    })
    console.log('✅ Created: Hospital group (15% discount)')

    const clinicGroup = await payload.create({
      collection: 'customer-groups',
      data: {
        name: 'Clinic',
        slug: 'clinic',
        description: 'Small to medium healthcare facilities',
        type: 'b2b',
        discount: 10,
        priority: 2,
        isDefault: false,
        minOrderAmount: 500,
        canViewCatalog: true,
        canPlaceOrders: true,
        canRequestQuotes: true,
        canDownloadInvoices: true,
        canViewOrderHistory: true,
      },
    })
    console.log('✅ Created: Clinic group (10% discount)')

    const retailGroup = await payload.create({
      collection: 'customer-groups',
      data: {
        name: 'Retail Customer',
        slug: 'retail',
        description: 'Individual consumers',
        type: 'b2c',
        discount: 0,
        priority: 50,
        isDefault: true,
        canViewCatalog: true,
        canPlaceOrders: true,
        canRequestQuotes: false,
        canDownloadInvoices: true,
        canViewOrderHistory: true,
      },
    })
    console.log('✅ Created: Retail group (default)\n')

    // 2. Create Product Categories
    console.log('📁 Creating product categories...')

    const medicalDevicesCategory = await payload.create({
      collection: 'product-categories',
      data: {
        name: 'Medical Devices',
        slug: 'medical-devices',
        description: 'Professional medical equipment and devices',
        level: 0,
        order: 1,
        visible: true,
      },
    })
    console.log('✅ Created: Medical Devices category')

    const diagnosticsCategory = await payload.create({
      collection: 'product-categories',
      data: {
        name: 'Diagnostics',
        slug: 'diagnostics',
        description: 'Diagnostic equipment and tools',
        level: 0,
        order: 2,
        visible: true,
      },
    })
    console.log('✅ Created: Diagnostics category\n')

    // 3. Create Demo Products (matching app schema)
    console.log('🛍️  Creating demo products...\n')

    const product1 = await payload.create({
      collection: 'products',
      data: {
        title: 'Medical Monitor XR-2000',
        slug: 'medical-monitor-xr-2000',
        sku: 'MED-MON-2000',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'The Medical Monitor XR-2000 is a state-of-the-art patient monitoring system designed for hospitals and clinics. Features real-time vital signs monitoring, alarm systems, and cloud connectivity.',
                  },
                ],
              },
            ],
          },
        },
        price: 1000,
        compareAtPrice: 1200,
        stock: 50,
        status: 'published',
        featured: true,
        meta: {
          title: 'Medical Monitor XR-2000 | Professional Patient Monitoring',
          description: 'Professional patient monitoring system with advanced vital signs tracking. CE certified, 2 years warranty. Order now!',
        },
      },
    })
    console.log('✅ Created: Medical Monitor XR-2000 (€1000, MSRP: €1200)')

    const product2 = await payload.create({
      collection: 'products',
      data: {
        title: 'Digital Stethoscope DS-100',
        slug: 'digital-stethoscope-ds-100',
        sku: 'MED-STET-100',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'The Digital Stethoscope DS-100 offers crystal-clear sound quality with digital enhancement. Features Bluetooth connectivity for recording and analysis.',
                  },
                ],
              },
            ],
          },
        },
        price: 250,
        compareAtPrice: 300,
        stock: 150,
        status: 'published',
        featured: true,
        meta: {
          title: 'Digital Stethoscope DS-100 | Bluetooth Enabled',
          description: 'Advanced digital stethoscope with Bluetooth. Perfect for modern healthcare professionals.',
        },
      },
    })
    console.log('✅ Created: Digital Stethoscope DS-100 (€250, MSRP: €300)')

    console.log('\n🎉 Shop demo data seeded successfully!\n')
    console.log('📊 Summary:')
    console.log('  - 3 Customer Groups (Hospital, Clinic, Retail)')
    console.log('  - 2 Product Categories (Medical Devices, Diagnostics)')
    console.log('  - 2 Demo Products with stock and pricing')
    console.log('')
    console.log('🌐 Access the admin panel at: http://localhost:3016/admin')
    console.log('📦 View products: http://localhost:3016/admin/collections/products')
    console.log('👥 View customer groups: http://localhost:3016/admin/collections/customer-groups')
    console.log('📁 View categories: http://localhost:3016/admin/collections/product-categories\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding shop demo:', error)
    process.exit(1)
  }
}

seedShopDemo()
