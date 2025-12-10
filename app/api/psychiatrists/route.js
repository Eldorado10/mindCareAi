import { getDatabase } from '@/lib/database.js';
import Psychiatrist from '@/lib/models/Psychiatrist.js';

export async function GET(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      console.error('[API] getDatabase() returned null');
      return Response.json({ error: 'Database not initialized', debug: 'getDatabase() returned null' }, { status: 503 });
    }
    
    await sequelize.authenticate();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

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
    console.error('[API] GET Error:', error);
    return Response.json({ error: error.message, debug: error.toString() }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    
    await sequelize.authenticate();
    
    const data = await request.json();
    const psychiatrist = await Psychiatrist.create(data);
    return Response.json(psychiatrist, { status: 201 });
  } catch (error) {
    console.error('[API] POST Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    
    await sequelize.authenticate();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();

    const psychiatrist = await Psychiatrist.findByPk(id);
    if (!psychiatrist) {
      return Response.json({ error: 'Psychiatrist not found' }, { status: 404 });
    }

    await psychiatrist.update(data);
    return Response.json(psychiatrist);
  } catch (error) {
    console.error('[API] PUT Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    
    await sequelize.authenticate();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const psychiatrist = await Psychiatrist.findByPk(id);
    if (!psychiatrist) {
      return Response.json({ error: 'Psychiatrist not found' }, { status: 404 });
    }

    await psychiatrist.destroy();
    return Response.json({ message: 'Psychiatrist deleted' });
  } catch (error) {
    console.error('[API] DELETE Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
