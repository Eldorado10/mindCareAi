import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUsers, addUser, findUserByEmail, getNextUserId } from '../users'

export async function POST(request) {
  try {
    const { name, email, password, age } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    if (findUserByEmail(email)) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user object
    const user = {
      id: getNextUserId(),
      name,
      email,
      password: hashedPassword,
      age: age || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Store user (in production, save to database)
    addUser(user)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}