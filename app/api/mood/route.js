import { getDatabase } from '@/lib/database.js';
import MoodEntry from '@/lib/models/MoodEntry.js';

// Helper function to validate authentication
function getAuthenticatedUserId(request) {
  const authHeader = request.headers.get('authorization');
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
    const limit = parseInt(searchParams.get('limit')) || 30;

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

    const moodEntries = await MoodEntry.findAll({
      where: { userId: parseInt(userId) },
      order: [['date', 'DESC']],
      limit,
    });

    return Response.json(moodEntries, { status: 200 });
  } catch (error) {
    console.error('[API] Get mood entries error:', error);
    return Response.json(
      { error: error.message, debug: error.toString() },
      { status: 500 }
    );
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
    const { userId, moodLevel, moodLabel, problem, improvement, notes } = body;

    if (!userId || !moodLevel || !moodLabel) {
      return Response.json(
        { error: 'userId, moodLevel, and moodLabel are required' },
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

    const moodEntry = await MoodEntry.create({
      userId: parseInt(userId),
      moodLevel: parseInt(moodLevel),
      moodLabel,
      problem,
      improvement,
      notes,
      date: new Date(),
    });

    return Response.json(moodEntry, { status: 201 });
  } catch (error) {
    console.error('[API] Create mood entry error:', error);
    return Response.json(
      { error: error.message, debug: error.toString() },
      { status: 500 }
    );
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

    const moodEntry = await MoodEntry.findByPk(parseInt(id));
    if (!moodEntry) {
      return Response.json({ error: 'Mood entry not found' }, { status: 404 });
    }

    // Validate that user can only update their own entries
    if (moodEntry.userId !== parseInt(authenticatedUserId)) {
      return Response.json(
        { error: 'Unauthorized: Cannot update other users\' entries' },
        { status: 403 }
      );
    }

    await moodEntry.update(body);
    return Response.json(moodEntry, { status: 200 });
  } catch (error) {
    console.error('[API] Update mood entry error:', error);
    return Response.json(
      { error: error.message, debug: error.toString() },
      { status: 500 }
    );
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

    const moodEntry = await MoodEntry.findByPk(parseInt(id));
    if (!moodEntry) {
      return Response.json({ error: 'Mood entry not found' }, { status: 404 });
    }

    // Validate that user can only delete their own entries
    if (moodEntry.userId !== parseInt(authenticatedUserId)) {
      return Response.json(
        { error: 'Unauthorized: Cannot delete other users\' entries' },
        { status: 403 }
      );
    }

    await moodEntry.destroy();
    return Response.json({ message: 'Mood entry deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('[API] Delete mood entry error:', error);
    return Response.json(
      { error: error.message, debug: error.toString() },
      { status: 500 }
    );
  }
}
