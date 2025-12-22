import { Op } from 'sequelize';
import { getDatabase } from '@/lib/database.js';
import getEmergencyTeam from '@/lib/models/EmergencyTeam.js';
import { getActiveEmergencyTeam, toEmergencyTeamResponse } from '@/lib/emergency-team.js';

function verifyAdminRole(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = cookieHeader.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value ? decodeURIComponent(value) : '';
      return acc;
    }, {});

    if (!cookies['user-data']) return false;
    const userData = JSON.parse(cookies['user-data']);
    return userData.role === 'admin';
  } catch (error) {
    console.error('[API] Error verifying admin role:', error.message);
    return false;
  }
}

const normalizeTeamPayload = (payload = {}) => {
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';
  const region = typeof payload.region === 'string' ? payload.region.trim() : 'Bangladesh';
  const isActive = payload.isActive !== false;

  return { name, email, phone, region, isActive };
};

export async function GET(request) {
  try {
    if (!verifyAdminRole(request)) {
      return Response.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const sequelize = getDatabase();
    if (!sequelize) return Response.json({ error: 'Database not initialized' }, { status: 503 });
    await sequelize.authenticate();

    const team = await getActiveEmergencyTeam();
    return Response.json({ team: toEmergencyTeamResponse(team) }, { status: 200 });
  } catch (error) {
    console.error('[EMERGENCY_TEAM_GET]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!verifyAdminRole(request)) {
      return Response.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const sequelize = getDatabase();
    if (!sequelize) return Response.json({ error: 'Database not initialized' }, { status: 503 });
    await sequelize.authenticate();

    const EmergencyTeam = getEmergencyTeam();
    if (!EmergencyTeam) return Response.json({ error: 'EmergencyTeam model unavailable' }, { status: 503 });
    await EmergencyTeam.sync();

    const body = await request.json();
    const { id } = body || {};
    const normalized = normalizeTeamPayload(body);

    if (!normalized.name || !normalized.email || !normalized.phone) {
      return Response.json(
        { error: 'Missing required fields', required: ['name', 'email', 'phone'] },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized.email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }

    let team = null;
    if (id) {
      team = await EmergencyTeam.findByPk(id);
      if (!team) return Response.json({ error: 'Emergency team not found' }, { status: 404 });
      await team.update(normalized);
    } else {
      team = await EmergencyTeam.create(normalized);
    }

    if (normalized.isActive) {
      await EmergencyTeam.update(
        { isActive: false },
        { where: { id: { [Op.ne]: team.id } } }
      );
      team.isActive = true;
      await team.save();
    }

    return Response.json({ team: toEmergencyTeamResponse(team) }, { status: 200 });
  } catch (error) {
    console.error('[EMERGENCY_TEAM_PUT]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
