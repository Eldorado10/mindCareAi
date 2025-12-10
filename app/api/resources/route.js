import { getDatabase } from '@/lib/database.js';
import Resource from '@/lib/models/Resource.js';

export async function GET(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    
    await sequelize.authenticate();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const resource = await Resource.findByPk(id);
      if (!resource) {
        return Response.json({ error: 'Resource not found' }, { status: 404 });
      }
      return Response.json(resource);
    }

    const resources = await Resource.findAll();
    return Response.json(resources);
  } catch (error) {
    console.error('GET Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
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
    const resource = await Resource.create(data);
    return Response.json(resource, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
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

    const resource = await Resource.findByPk(id);
    if (!resource) {
      return Response.json({ error: 'Resource not found' }, { status: 404 });
    }

    await resource.update(data);
    return Response.json(resource);
  } catch (error) {
    console.error('PUT Error:', error);
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

    const resource = await Resource.findByPk(id);
    if (!resource) {
      return Response.json({ error: 'Resource not found' }, { status: 404 });
    }

    await resource.destroy();
    return Response.json({ message: 'Resource deleted' });
  } catch (error) {
    console.error('DELETE Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
