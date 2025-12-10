import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database.js'
import User from '@/lib/models/User.js'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email.js'

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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
    
    // Find user by email
    const user = await User.findOne({ where: { email } })
    
    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json(
        { message: 'If an account with that email exists, a reset link has been sent' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update user with reset token
    await user.update({
      resetToken,
      resetTokenExpiry
    })

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

    // Send email
    await sendEmail({
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    })

    return NextResponse.json(
      { message: 'If an account with that email exists, a reset link has been sent' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}