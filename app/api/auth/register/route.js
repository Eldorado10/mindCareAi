import { getDatabase } from '@/lib/database.js';
import getUser from '@/lib/models/User.js';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }

    await sequelize.authenticate();

    const { firstName, lastName, email, password, role = 'patient', phone } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return Response.json(
        { error: 'First name, last name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get User model
    const User = getUser();

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return Response.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (immediately active, no email verification needed)
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phone,
      isActive: true, // User is immediately active
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    return Response.json(
      { 
        ...userWithoutPassword, 
        message: 'Registration successful! You can now log in.' 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Register Error:', error);
    return Response.json(
      { error: error.message, debug: error.toString() },
      { status: 500 }
    );
  }
}
