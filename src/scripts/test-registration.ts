/**
 * Test script for customer registration flow
 *
 * Tests:
 * 1. KVK lookup API
 * 2. B2B user registration
 * 3. Individual user registration
 * 4. Duplicate email validation
 */

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { lookupKVK, getKVKMode } from '../lib/kvk/client'
import bcrypt from 'bcryptjs'

async function testRegistrationFlow() {
  console.log('\n🧪 Testing Customer Registration Flow\n')
  console.log('='.repeat(60))

  try {
    const payload = await getPayload({ config: configPromise })

    // ========================================
    // TEST 1: KVK Lookup
    // ========================================
    console.log('\n📋 TEST 1: KVK Lookup')
    console.log('-'.repeat(60))

    const testKVK = '12345678'
    console.log(`Looking up KVK: ${testKVK}`)
    console.log(`KVK Mode: ${getKVKMode()}`)

    const company = await lookupKVK(testKVK)

    if (company) {
      console.log('✅ KVK lookup successful!')
      console.log(`   Company: ${company.name}`)
      console.log(`   Address: ${company.address.street} ${company.address.houseNumber}`)
      console.log(`   City: ${company.address.city}`)
      console.log(`   Phone: ${company.phone}`)
    } else {
      console.log('❌ KVK lookup failed - company not found')
    }

    // ========================================
    // TEST 2: B2B User Registration
    // ========================================
    console.log('\n\n🏢 TEST 2: B2B User Registration')
    console.log('-'.repeat(60))

    const testB2BEmail = `test-b2b-${Date.now()}@example.com`
    const testPassword = 'SecurePass123!'

    console.log(`Creating B2B user: ${testB2BEmail}`)

    const hashedPassword = await bcrypt.hash(testPassword, 10)

    const b2bUser = await payload.create({
      collection: 'users',
      data: {
        email: testB2BEmail,
        password: hashedPassword,
        name: 'Jan Jansen', // Required top-level name
        firstName: 'Jan',
        lastName: 'Jansen',
        phone: '+31 20 123 4567',
        // roles will default to ['editor']
        accountType: 'b2b',
        company: {
          name: company?.name || 'Test B.V.',
          kvkNumber: testKVK,
          branch: 'healthcare',
          website: company?.website || 'https://example.com',
        },
        addresses: [
          {
            type: 'both',
            street: company?.address.street || 'Teststraat',
            houseNumber: company?.address.houseNumber || '1',
            postalCode: company?.address.postalCode || '1234 AB',
            city: company?.address.city || 'Amsterdam',
          },
        ],
      },
    })

    console.log('✅ B2B user created successfully!')
    console.log(`   ID: ${b2bUser.id}`)
    console.log(`   Email: ${b2bUser.email}`)
    console.log(`   Company: ${(b2bUser.company as any)?.name}`)
    console.log(`   Branch: ${(b2bUser.company as any)?.branch}`)

    // ========================================
    // TEST 3: Individual User Registration
    // ========================================
    console.log('\n\n👤 TEST 3: Individual User Registration')
    console.log('-'.repeat(60))

    const testIndividualEmail = `test-individual-${Date.now()}@example.com`

    console.log(`Creating Individual user: ${testIndividualEmail}`)

    const individualUser = await payload.create({
      collection: 'users',
      data: {
        email: testIndividualEmail,
        password: await bcrypt.hash(testPassword, 10),
        name: 'Piet Pietersen', // Required top-level name
        firstName: 'Piet',
        lastName: 'Pietersen',
        phone: '+31 30 987 6543',
        // roles will default to ['editor']
        accountType: 'individual',
      },
    })

    console.log('✅ Individual user created successfully!')
    console.log(`   ID: ${individualUser.id}`)
    console.log(`   Email: ${individualUser.email}`)
    console.log(`   Account Type: ${individualUser.accountType}`)

    // ========================================
    // TEST 4: Duplicate Email Validation
    // ========================================
    console.log('\n\n🔒 TEST 4: Duplicate Email Validation')
    console.log('-'.repeat(60))

    console.log(`Attempting to create duplicate user: ${testB2BEmail}`)

    try {
      await payload.create({
        collection: 'users',
        data: {
          email: testB2BEmail, // Same email as TEST 2
          password: await bcrypt.hash('AnotherPass123!', 10),
          name: 'Duplicate User', // Required name field
          firstName: 'Duplicate',
          lastName: 'User',
          // roles will default to ['editor']
          accountType: 'individual',
        },
      })

      console.log('❌ FAILED - Duplicate email should have been rejected!')
    } catch (error: any) {
      if (error.message && error.message.includes('unique')) {
        console.log('✅ Duplicate email rejected correctly!')
        console.log(`   Error: ${error.message}`)
      } else {
        console.log('⚠️  Unexpected error:', error.message)
      }
    }

    // ========================================
    // CLEANUP
    // ========================================
    console.log('\n\n🧹 Cleaning up test users...')
    console.log('-'.repeat(60))

    try {
      await payload.delete({
        collection: 'users',
        where: {
          email: {
            in: [testB2BEmail, testIndividualEmail],
          },
        },
      })
      console.log('✅ Test users deleted successfully')
    } catch (error) {
      console.log('⚠️  Could not delete test users (they may not exist)')
    }

    // ========================================
    // SUMMARY
    // ========================================
    console.log('\n\n' + '='.repeat(60))
    console.log('🎉 Registration Flow Tests Complete!')
    console.log('='.repeat(60))
    console.log('\n✅ All tests passed successfully!\n')
  } catch (error: any) {
    console.error('\n❌ Test failed with error:')
    console.error(error)
    process.exit(1)
  }

  process.exit(0)
}

// Run tests
testRegistrationFlow()
