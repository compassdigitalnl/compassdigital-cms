import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import bcrypt from 'bcryptjs'

/**
 * POST /api/auth/register
 *
 * Customer registration endpoint
 * Handles both B2B and Individual account registration
 *
 * Request body:
 * {
 *   accountType: 'b2b' | 'individual',
 *   firstName: string,
 *   lastName: string,
 *   email: string,
 *   phone: string,
 *   password: string,
 *   // B2B only:
 *   kvkNumber?: string,
 *   companyName?: string,
 *   branch?: string,
 *   street?: string,
 *   houseNumber?: string,
 *   postalCode?: string,
 *   city?: string,
 *   website?: string,
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await request.json()

    // Extract fields
    const {
      accountType,
      firstName,
      lastName,
      email,
      phone,
      password,
      // B2B fields
      kvkNumber,
      companyName,
      branch,
      street,
      houseNumber,
      postalCode,
      city,
      website,
    } = body

    // ========================================
    // 1. VALIDATION
    // ========================================

    // Basic required fields
    if (!accountType || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'Account type, firstName, lastName, email, and password are required',
        },
        { status: 400 },
      )
    }

    // Validate account type
    if (!['b2b', 'individual'].includes(accountType)) {
      return NextResponse.json(
        {
          error: 'Invalid account type',
          message: 'Account type must be either "b2b" or "individual"',
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: 'Invalid email format',
          message: 'Please provide a valid email address',
        },
        { status: 400 },
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        {
          error: 'Weak password',
          message: 'Password must be at least 8 characters long',
        },
        { status: 400 },
      )
    }

    // B2B specific validation
    if (accountType === 'b2b') {
      if (!kvkNumber || !companyName || !branch) {
        return NextResponse.json(
          {
            error: 'Missing B2B fields',
            message: 'KVK number, company name, and branch are required for B2B accounts',
          },
          { status: 400 },
        )
      }

      // Validate KVK format (8 digits)
      const cleanKVK = kvkNumber.replace(/[\s-]/g, '')
      if (!/^\d{8}$/.test(cleanKVK)) {
        return NextResponse.json(
          {
            error: 'Invalid KVK number',
            message: 'KVK number must be 8 digits',
          },
          { status: 400 },
        )
      }
    }

    // ========================================
    // 2. CHECK IF USER ALREADY EXISTS
    // ========================================

    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
      limit: 1,
    })

    if (existingUser.docs.length > 0) {
      return NextResponse.json(
        {
          error: 'User already exists',
          message: 'Een account met dit e-mailadres bestaat al',
        },
        { status: 409 }, // 409 Conflict
      )
    }

    // ========================================
    // 3. HASH PASSWORD
    // ========================================

    const hashedPassword = await bcrypt.hash(password, 10)

    // ========================================
    // 4. CREATE USER
    // ========================================

    const userData: any = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name: `${firstName} ${lastName}`, // Required top-level name field
      firstName,
      lastName,
      phone,
      // roles will default to ['editor'] - customers are differentiated by accountType
      accountType,
    }

    // Add B2B specific fields (nested in company group)
    if (accountType === 'b2b') {
      userData.company = {
        name: companyName,
        kvkNumber,
        branch,
        website,
      }

      // Add address to addresses array
      userData.addresses = [
        {
          type: 'both',
          street,
          houseNumber,
          postalCode,
          city,
        },
      ]
    }

    const newUser = await payload.create({
      collection: 'users',
      data: userData,
    })

    // ========================================
    // 5. RETURN SUCCESS (WITHOUT PASSWORD!)
    // ========================================

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    console.log('✅ New user registered:', {
      id: newUser.id,
      email: newUser.email,
      accountType: newUser.accountType,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Account succesvol aangemaakt',
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('❌ Registration error:', error)

    // Handle specific Payload errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          error: 'Validation error',
          message: 'De ingevulde gegevens zijn niet correct',
          details: error.data || error.message,
        },
        { status: 400 },
      )
    }

    // Generic error
    return NextResponse.json(
      {
        error: 'Registration failed',
        message: 'Er is een fout opgetreden bij het aanmaken van je account',
      },
      { status: 500 },
    )
  }
}
