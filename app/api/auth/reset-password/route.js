import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database.js'
import getUser from '@/lib/models/User.js'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { token, password } = await request.json()
    
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
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
    
    // Find user by reset token
    const User = getUser()
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          [Symbol.for('gt')]: new Date()
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password and clear reset token
    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    })

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}