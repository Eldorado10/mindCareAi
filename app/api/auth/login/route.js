import { getDatabase } from '@/lib/database.js';
import User from '@/lib/models/User.js';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }

    await sequelize.authenticate();

    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return Response.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('[API] Login Error:', error);
    return Response.json(
      { error: error.message, debug: error.toString() },
      { status: 500 }
    );
  }
}
