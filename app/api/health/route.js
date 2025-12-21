import { getDatabase } from '@/lib/database.js';
import getHealthData from '@/lib/models/HealthData.js';

// Helper function to validate authentication
function getAuthenticatedUserId(request) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return null;
  }
  
  return userId;
}

export async function GET(request) {
  try {
    // Authenticate request
    const authenticatedUserId = getAuthenticatedUserId(request);
    if (!authenticatedUserId) {
      return Response.json(
        { error: 'Authentication required. Please include x-user-id header.' },
        { status: 401 }
      );
    }

    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }

    await sequelize.authenticate();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');

    const HealthData = getHealthData();
    if (!HealthData) {
      return Response.json({ error: 'HealthData model unavailable' }, { status: 503 });
    }

    if (id) {
      const healthData = await HealthData.findByPk(parseInt(id));
      if (!healthData) {
        return Response.json({ error: 'Health data not found' }, { status: 404 });
      }

      // Validate that user can only access their own data
      if (healthData.userId !== parseInt(authenticatedUserId)) {
        return Response.json(
          { error: 'Unauthorized: Cannot access other users\' data' },
          { status: 403 }
        );
      }

      return Response.json(healthData, { status: 200 });
    }

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    // Validate that user can only access their own data
    if (parseInt(userId) !== parseInt(authenticatedUserId)) {
      return Response.json(
        { error: 'Unauthorized: Cannot access other users\' data' },
        { status: 403 }
      );
    }

    const healthData = await HealthData.findAll({
      where: { userId: parseInt(userId) },
      order: [['lastUpdated', 'DESC']],
    });
    return Response.json(healthData, { status: 200 });
  } catch (error) {
    console.error('[API] Health GET Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Authenticate request
    const authenticatedUserId = getAuthenticatedUserId(request);
    if (!authenticatedUserId) {
      return Response.json(
        { error: 'Authentication required. Please include x-user-id header.' },
        { status: 401 }
      );
    }

    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }

    await sequelize.authenticate();

    const body = await request.json();
    const { userId, condition, severity, description, treatmentStartDate, status } = body;

    if (!userId || !condition) {
      return Response.json(
        { error: 'userId and condition are required' },
        { status: 400 }
      );
    }

    // Validate that user can only create entries for themselves
    if (parseInt(userId) !== parseInt(authenticatedUserId)) {
      return Response.json(
        { error: 'Unauthorized: Cannot create entries for other users' },
        { status: 403 }
      );
    }

    const HealthData = getHealthData();
    if (!HealthData) {
      return Response.json({ error: 'HealthData model unavailable' }, { status: 503 });
    }

    const healthData = await HealthData.create({
      userId: parseInt(userId),
      condition,
      severity: severity || 'mild',
      description,
      treatmentStartDate,
      status: status || 'active',
      lastUpdated: new Date(),
    });

    return Response.json(healthData, { status: 201 });
  } catch (error) {
    console.error('[API] Health POST Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // Authenticate request
    const authenticatedUserId = getAuthenticatedUserId(request);
    if (!authenticatedUserId) {
      return Response.json(
        { error: 'Authentication required. Please include x-user-id header.' },
        { status: 401 }
      );
    }

    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }

    await sequelize.authenticate();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    const HealthData = getHealthData();
    if (!HealthData) {
      return Response.json({ error: 'HealthData model unavailable' }, { status: 503 });
    }

    const healthData = await HealthData.findByPk(parseInt(id));
    if (!healthData) {
      return Response.json({ error: 'Health data not found' }, { status: 404 });
    }

    // Validate that user can only update their own entries
    if (healthData.userId !== parseInt(authenticatedUserId)) {
      return Response.json(
        { error: 'Unauthorized: Cannot update other users\' entries' },
        { status: 403 }
      );
    }

    body.lastUpdated = new Date();
    await healthData.update(body);
    return Response.json(healthData, { status: 200 });
  } catch (error) {
    console.error('[API] Health PUT Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    // Authenticate request
    const authenticatedUserId = getAuthenticatedUserId(request);
    if (!authenticatedUserId) {
      return Response.json(
        { error: 'Authentication required. Please include x-user-id header.' },
        { status: 401 }
      );
    }

    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }

    await sequelize.authenticate();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    const HealthData = getHealthData();
    if (!HealthData) {
      return Response.json({ error: 'HealthData model unavailable' }, { status: 503 });
    }

    const healthData = await HealthData.findByPk(parseInt(id));
    if (!healthData) {
      return Response.json({ error: 'Health data not found' }, { status: 404 });
    }

    // Validate that user can only delete their own entries
    if (healthData.userId !== parseInt(authenticatedUserId)) {
      return Response.json(
        { error: 'Unauthorized: Cannot delete other users\' entries' },
        { status: 403 }
      );
    }

    await healthData.destroy();
    return Response.json({ message: 'Health data deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('[API] Health DELETE Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}
