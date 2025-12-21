import { getDatabase } from '@/lib/database.js';
import getResource from '@/lib/models/Resource.js';

export async function GET(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    
    await sequelize.authenticate();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const Resource = getResource();
    if (!Resource) {
      return Response.json({ error: 'Resource model unavailable' }, { status: 503 });
    }

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
    console.error('[API] Resources GET Error:', error);
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
    
    await sequelize.authenticate();
    
    const Resource = getResource();
    if (!Resource) {
      return Response.json({ error: 'Resource model unavailable' }, { status: 503 });
    }

    const data = await request.json();
    const resource = await Resource.create(data);
    return Response.json(resource, { status: 201 });
  } catch (error) {
    console.error('[API] Resources POST Error:', error);
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
    
    await sequelize.authenticate();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json({ error: 'Resource ID is required' }, { status: 400 });
    }

    const Resource = getResource();
    if (!Resource) {
      return Response.json({ error: 'Resource model unavailable' }, { status: 503 });
    }

    const data = await request.json();
    const resource = await Resource.findByPk(id);
    if (!resource) {
      return Response.json({ error: 'Resource not found' }, { status: 404 });
    }

    await resource.update(data);
    return Response.json(resource);
  } catch (error) {
    console.error('[API] Resources PUT Error:', error);
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
    
    await sequelize.authenticate();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Resource ID is required' }, { status: 400 });
    }

    const Resource = getResource();
    if (!Resource) {
      return Response.json({ error: 'Resource model unavailable' }, { status: 503 });
    }

    const resource = await Resource.findByPk(id);
    if (!resource) {
      return Response.json({ error: 'Resource not found' }, { status: 404 });
    }

    await resource.destroy();
    return Response.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('[API] Resources DELETE Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });  }
}