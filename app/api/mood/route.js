import { getDatabase } from '@/lib/database.js';
import getMoodEntry from '@/lib/models/MoodEntry.js';

const ALLOWED_MOOD_LABELS = ['terrible', 'bad', 'poor', 'okay', 'good', 'great', 'excellent'];

const normalizeMoodLevel = (value) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) return null;
  return Math.min(10, Math.max(1, parsed));
};

const isValidLabel = (label) => ALLOWED_MOOD_LABELS.includes(label);

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
    const userId = parseInt(searchParams.get('userId'), 10);
    const limit = parseInt(searchParams.get('limit'), 10) || 30;

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    // Validate that user can only access their own data
    if (userId !== parseInt(authenticatedUserId, 10)) {
      return Response.json(
        { error: 'Unauthorized: Cannot access other users\' data' },
        { status: 403 }
      );
    }

    // Get fresh model instance
    const MoodEntry = getMoodEntry();
    if (!MoodEntry) {
      return Response.json({ error: 'MoodEntry model unavailable' }, { status: 503 });
    }
    await MoodEntry.sync();

    const moodEntries = await MoodEntry.findAll({
      where: { userId },
      order: [['date', 'DESC']],
      limit,
    });

    return Response.json(moodEntries, { status: 200 });
  } catch (error) {
    console.error('[API] Mood GET Error:', error);
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
    const { userId, moodLevel, moodLabel, problem, improvement, notes } = body;

    const parsedUserId = parseInt(userId, 10);
    const normalizedMoodLevel = normalizeMoodLevel(moodLevel);

    if (!parsedUserId || !normalizedMoodLevel || !moodLabel) {
      return Response.json(
        { error: 'userId, moodLevel, and moodLabel are required' },
        { status: 400 }
      );
    }

    if (!isValidLabel(moodLabel)) {
      return Response.json(
        { error: `moodLabel must be one of: ${ALLOWED_MOOD_LABELS.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate that user can only create entries for themselves
    if (parsedUserId !== parseInt(authenticatedUserId, 10)) {
      return Response.json(
        { error: 'Unauthorized: Cannot create entries for other users' },
        { status: 403 }
      );
    }

    // Get fresh model instance
    const MoodEntry = getMoodEntry();
    if (!MoodEntry) {
      return Response.json({ error: 'MoodEntry model unavailable' }, { status: 503 });
    }
    await MoodEntry.sync();

    const moodEntry = await MoodEntry.create({
      userId: parsedUserId,
      moodLevel: normalizedMoodLevel,
      moodLabel,
      problem,
      improvement,
      notes,
      date: new Date(),
    });

    return Response.json(moodEntry, { status: 201 });
  } catch (error) {
    console.error('[API] Mood POST Error:', error);
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
    const id = parseInt(searchParams.get('id'), 10);
    const body = await request.json();

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    // Get fresh model instance
    const MoodEntry = getMoodEntry();
    if (!MoodEntry) {
      return Response.json({ error: 'MoodEntry model unavailable' }, { status: 503 });
    }
    await MoodEntry.sync();

    const moodEntry = await MoodEntry.findByPk(id);
    if (!moodEntry) {
      return Response.json({ error: 'Mood entry not found' }, { status: 404 });
    }

    // Validate that user can only update their own entries
    if (moodEntry.userId !== parseInt(authenticatedUserId, 10)) {
      return Response.json(
        { error: 'Unauthorized: Cannot update other users\' entries' },
        { status: 403 }
      );
    }

    const updateData = {};
    if (body.moodLevel !== undefined) {
      const normalized = normalizeMoodLevel(body.moodLevel);
      if (!normalized) {
        return Response.json(
          { error: 'moodLevel must be a number between 1 and 10' },
          { status: 400 }
        );
      }
      updateData.moodLevel = normalized;
    }
    if (body.moodLabel !== undefined) {
      if (!isValidLabel(body.moodLabel)) {
        return Response.json(
          { error: `moodLabel must be one of: ${ALLOWED_MOOD_LABELS.join(', ')}` },
          { status: 400 }
        );
      }
      updateData.moodLabel = body.moodLabel;
    }

    ['problem', 'improvement', 'notes', 'date'].forEach((field) => {
      if (body[field] !== undefined) updateData[field] = body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: 'No valid fields provided' }, { status: 400 });
    }

    await moodEntry.update(updateData);
    return Response.json(moodEntry, { status: 200 });
  } catch (error) {
    console.error('[API] Mood PUT Error:', error);
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
    const id = parseInt(searchParams.get('id'), 10);

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    // Get fresh model instance
    const MoodEntry = getMoodEntry();
    if (!MoodEntry) {
      return Response.json({ error: 'MoodEntry model unavailable' }, { status: 503 });
    }
    await MoodEntry.sync();

    const moodEntry = await MoodEntry.findByPk(id);
    if (!moodEntry) {
      return Response.json({ error: 'Mood entry not found' }, { status: 404 });
    }

    // Validate that user can only delete their own entries
    if (moodEntry.userId !== parseInt(authenticatedUserId, 10)) {
      return Response.json(
        { error: 'Unauthorized: Cannot delete other users\' entries' },
        { status: 403 }
      );
    }

    await moodEntry.destroy();
    return Response.json({ message: 'Mood entry deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('[API] Mood DELETE Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}
