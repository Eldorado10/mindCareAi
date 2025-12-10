import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database.js'
import User from '@/lib/models/User.js'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    const sequelize = getDatabase()
    if (!sequelize) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      )
    }

    await sequelize.authenticate()
    
    // Find user by verification token
    const user = await User.findOne({
      where: {
        verificationToken: token
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Verify email and clear verification token
    await user.update({
      emailVerified: new Date(),
      verificationToken: null,
      isActive: true
    })

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}