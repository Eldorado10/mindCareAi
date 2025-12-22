import { getDatabase } from '@/lib/database.js';
import getUser from '@/lib/models/User.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

const DISALLOWED_ROLE = 'psychiatrist';

const normalizeRole = (role) =>
  (typeof role === 'string' ? role.trim().toLowerCase() : role);

const isPsychiatristRole = (role) => role === DISALLOWED_ROLE;

let userSchemaReady = false;

async function ensureUserSchema(User, sequelize) {
  if (userSchemaReady) return;
  await User.sync();

  const queryInterface = sequelize.getQueryInterface();
  const table = await queryInterface.describeTable('users');
  const columnsToEnsure = ['specialization', 'bio'];

  for (const column of columnsToEnsure) {
    if (!table[column] && User.rawAttributes[column]) {
      await queryInterface.addColumn('users', column, User.rawAttributes[column]);
    }
  }

  userSchemaReady = true;
}

// Verify admin role from cookie
function verifyAdminRole(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = cookieHeader.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value ? decodeURIComponent(value) : '';
      return acc;
    }, {});

    if (!cookies['user-data']) {
      console.log('[API] No user-data cookie found');
      return false;
    }

    const userData = JSON.parse(cookies['user-data']);
    const isAdmin = userData.role === 'admin';
    
    if (!isAdmin) {
      console.log('[API] User role is not admin:', userData.role);
    }
    
    return isAdmin;
  } catch (error) {
    console.error('[API] Error verifying admin role:', error.message);
    return false;
  }
}

export async function GET(request) {
  try {
    console.log('[API] Admin Users GET - Verifying access...');
    
    if (!verifyAdminRole(request)) {
      console.log('[API] Admin verification failed');
      return Response.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const sequelize = getDatabase();
    if (!sequelize) {
      console.error('[API] Database not initialized');
      return Response.json(
        { error: 'Database not initialized' },
        { status: 503 }
      );
    }

    // Authenticate database connection
    await sequelize.authenticate();
    console.log('[API] Database authenticated successfully');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const role = searchParams.get('role');

    let where = {};
    if (id) {
      where.id = parseInt(id, 10);
    }
    if (role) {
      const normalizedRole = normalizeRole(role);
      if (isPsychiatristRole(normalizedRole)) {
        return Response.json(
          { error: 'Psychiatrists are managed via the psychiatrists table.' },
          { status: 400 }
        );
      }
      where.role = normalizedRole;
    } else {
      where.role = { [Op.ne]: DISALLOWED_ROLE };
    }

    console.log('[API] Fetching users with filter:', where);

    const User = getUser();
    if (!User) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }

    await ensureUserSchema(User, sequelize);
    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    console.log(`[API] Found ${users.length} users`);
    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error('[API] Admin Users GET Error:', error);
    return Response.json(
      {
        error: error.message,
        debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log('[API] Admin Users POST - Verifying access...');
    
    if (!verifyAdminRole(request)) {
      console.log('[API] Admin verification failed');
      return Response.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const sequelize = getDatabase();
    if (!sequelize) {
      console.error('[API] Database not initialized');
      return Response.json(
        { error: 'Database not initialized' },
        { status: 503 }
      );
    }

    // Authenticate database connection
    await sequelize.authenticate();
    console.log('[API] Database authenticated successfully');

    const body = await request.json();
    const { firstName, lastName, email, password, role, phone, specialization, bio } = body;
    const normalizedRole = normalizeRole(role);

    // Validation
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim() || !normalizedRole) {
      return Response.json(
        {
          error: 'Missing required fields',
          required: ['firstName', 'lastName', 'email', 'password', 'role'],
        },
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

    // Validate role
    if (isPsychiatristRole(normalizedRole)) {
      return Response.json(
        { error: 'Psychiatrists must be created via the psychiatrists table.' },
        { status: 400 }
      );
    }

    console.log(`[API] Creating user: ${email} with role: ${normalizedRole}`);

    // Check if user exists
    const User = getUser();
    if (!User) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }

    await ensureUserSchema(User, sequelize);
    const existingUser = await User.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    
    if (existingUser) {
      console.log('[API] User already exists:', email);
      return Response.json(
        { error: 'Email already exists in the system' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: normalizedRole,
      phone: phone?.trim() || null,
      specialization: specialization?.trim() || null,
      bio: bio?.trim() || null,
      isActive: true,
    });

    console.log('[API] User created successfully with ID:', newUser.id);

    // Return user without password
    const userResponse = newUser.toJSON();
    delete userResponse.password;
    
    return Response.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('[API] Admin Users POST Error:', error);
    return Response.json(
      {
        error: error.message,
        debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    console.log('[API] Admin Users PUT - Verifying access...');
    
    if (!verifyAdminRole(request)) {
      console.log('[API] Admin verification failed');
      return Response.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const sequelize = getDatabase();
    if (!sequelize) {
      console.error('[API] Database not initialized');
      return Response.json(
        { error: 'Database not initialized' },
        { status: 503 }
      );
    }

    // Authenticate database connection
    await sequelize.authenticate();
    console.log('[API] Database authenticated successfully');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return Response.json(
        { error: 'User ID is required in query parameters' },
        { status: 400 }
      );
    }

    console.log(`[API] Updating user ID: ${id}`);

    const User = getUser();
    if (!User) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }

    await ensureUserSchema(User, sequelize);
    const user = await User.findByPk(parseInt(id, 10));
    if (!user) {
      console.log('[API] User not found:', id);
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If updating email, check for duplicates
    if (body.email && body.email !== user.email) {
      const existingUser = await User.findOne({
        where: { email: body.email.toLowerCase().trim() },
      });
      if (existingUser) {
        console.log('[API] Email already exists:', body.email);
        return Response.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData = { ...body };
    if (updateData.role) {
      updateData.role = normalizeRole(updateData.role);
      if (isPsychiatristRole(updateData.role)) {
        return Response.json(
          { error: 'Psychiatrists must be updated via the psychiatrists table.' },
          { status: 400 }
        );
      }
    }

    // Hash password if provided
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
      console.log('[API] Password updated');
    }

    // Normalize email if provided
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase().trim();
    }

    if (typeof updateData.firstName === 'string') {
      updateData.firstName = updateData.firstName.trim();
    }
    if (typeof updateData.lastName === 'string') {
      updateData.lastName = updateData.lastName.trim();
    }
    if (typeof updateData.phone === 'string') {
      updateData.phone = updateData.phone.trim() || null;
    }
    if (typeof updateData.specialization === 'string') {
      updateData.specialization = updateData.specialization.trim() || null;
    }
    if (typeof updateData.bio === 'string') {
      updateData.bio = updateData.bio.trim() || null;
    }

    const allowedFields = [
      'firstName',
      'lastName',
      'email',
      'password',
      'role',
      'phone',
      'specialization',
      'bio',
      'isActive',
    ];
    const sanitizedUpdate = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
    );

    // Update user
    await user.update(sanitizedUpdate);

    console.log('[API] User updated successfully');

    // Return user without password
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    return Response.json(userResponse, { status: 200 });
  } catch (error) {
    console.error('[API] Admin Users PUT Error:', error);
    return Response.json(
      {
        error: error.message,
        debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    console.log('[API] Admin Users DELETE - Verifying access...');
    
    if (!verifyAdminRole(request)) {
      console.log('[API] Admin verification failed');
      return Response.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const sequelize = getDatabase();
    if (!sequelize) {
      console.error('[API] Database not initialized');
      return Response.json(
        { error: 'Database not initialized' },
        { status: 503 }
      );
    }

    // Authenticate database connection
    await sequelize.authenticate();
    console.log('[API] Database authenticated successfully');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { error: 'User ID is required in query parameters' },
        { status: 400 }
      );
    }

    console.log(`[API] Deleting user ID: ${id}`);

    const User = getUser();
    if (!User) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }

    await ensureUserSchema(User, sequelize);
    const user = await User.findByPk(parseInt(id, 10));
    if (!user) {
      console.log('[API] User not found:', id);
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await user.destroy();

    console.log('[API] User deleted');

    return Response.json(
      { message: 'User deleted successfully', userId: user.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Admin Users DELETE Error:', error);
    return Response.json(
      {
        error: error.message,
        debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined,
      },
      { status: 500 }
    );
  }
}
