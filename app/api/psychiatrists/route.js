import { getDatabase } from '@/lib/database.js';
import getPsychiatrist from '@/lib/models/Psychiatrist.js';

export async function GET(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const Psychiatrist = getPsychiatrist();
    if (!Psychiatrist) {
      return Response.json({ error: 'Psychiatrist model unavailable' }, { status: 503 });
    }

    await Psychiatrist.sync();
    

    if (id) {
      const psychiatrist = await Psychiatrist.findByPk(id);
      if (!psychiatrist) {
        return Response.json({ error: 'Psychiatrist not found' }, { status: 404 });
      }
      return Response.json(psychiatrist);
    }

    const psychiatrists = await Psychiatrist.findAll();
    return Response.json(psychiatrists);
  } catch (error) {
    console.error('[API] Psychiatrists GET Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    

    const Psychiatrist = getPsychiatrist();
    if (!Psychiatrist) {
      return Response.json({ error: 'Psychiatrist model unavailable' }, { status: 503 });
    }

    await Psychiatrist.sync();
    const data = await request.json();
    const psychiatrist = await Psychiatrist.create(data);
    return Response.json(psychiatrist, { status: 201 });
  } catch (error) {
    console.error('[API] Psychiatrists POST Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Psychiatrist ID is required' }, { status: 400 });
    }

    const Psychiatrist = getPsychiatrist();
    if (!Psychiatrist) {
      return Response.json({ error: 'Psychiatrist model unavailable' }, { status: 503 });
    }

    await Psychiatrist.sync();
    const data = await request.json();
    const psychiatrist = await Psychiatrist.findByPk(id);
    if (!psychiatrist) {
      return Response.json({ error: 'Psychiatrist not found' }, { status: 404 });
    }

    await psychiatrist.update(data);
    return Response.json(psychiatrist);
  } catch (error) {
    console.error('[API] Psychiatrists PUT Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Psychiatrist ID is required' }, { status: 400 });
    }

    const Psychiatrist = getPsychiatrist();
    if (!Psychiatrist) {
      return Response.json({ error: 'Psychiatrist model unavailable' }, { status: 503 });
    }

    await Psychiatrist.sync();
    const psychiatrist = await Psychiatrist.findByPk(id);
    if (!psychiatrist) {
      return Response.json({ error: 'Psychiatrist not found' }, { status: 404 });
    }

    await psychiatrist.destroy();
    return Response.json({ message: 'Psychiatrist deleted successfully' });
  } catch (error) {
    console.error('[API] Psychiatrists DELETE Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}
