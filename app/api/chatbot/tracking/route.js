import { getDatabase } from '@/lib/database.js';
import getEmergencyAlert from '@/lib/models/EmergencyAlert.js';

export async function POST(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) return Response.json({ error: 'DB not ready' }, { status: 503 });
    await sequelize.authenticate();

    const EmergencyAlert = getEmergencyAlert();
    if (!EmergencyAlert) {
      return Response.json({ error: 'EmergencyAlert model unavailable' }, { status: 503 });
    }
    await EmergencyAlert.sync();

    const body = await request.json();
    // Support both legacy tracking payload and new alert payload
    const {
      userId,
      riskLevel,
      isHeavy = false,
      excerpt,
      fullText,
      // legacy fields
      userMessage,
      moodLevel,
      hasGrowth,
    } = body;

    if (!userId) return Response.json({ error: 'Missing userId' }, { status: 400 });

    // Derive values if legacy payload used
    const resolvedFullText = fullText || userMessage || '';
    const resolvedExcerpt = excerpt || resolvedFullText.slice(0, 240);
    const resolvedRisk = riskLevel || 'low';

    const rec = await EmergencyAlert.create({
      userId,
      riskLevel: resolvedRisk,
      isHeavy: !!isHeavy || (resolvedRisk !== 'low'),
      excerpt: resolvedExcerpt,
      fullText: resolvedFullText,
      status: 'new',
    });

    return Response.json({ ok: true, id: rec.id }, { status: 201 });
  } catch (e) {
    console.error('[EMERGENCY_TRACKING_POST]', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sequelize = getDatabase();
    if (!sequelize) return Response.json({ error: 'DB not ready' }, { status: 503 });
    await sequelize.authenticate();

    const EmergencyAlert = getEmergencyAlert();
    if (!EmergencyAlert) {
      return Response.json({ error: 'EmergencyAlert model unavailable' }, { status: 503 });
    }
    await EmergencyAlert.sync();

    const rows = await EmergencyAlert.findAll({ order: [['createdAt', 'DESC']], limit: 200 });
    return Response.json({ alerts: rows }, { status: 200 });
  } catch (e) {
    console.error('[EMERGENCY_TRACKING_GET]', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) return Response.json({ error: 'DB not ready' }, { status: 503 });
    await sequelize.authenticate();

    const EmergencyAlert = getEmergencyAlert();
    if (!EmergencyAlert) {
      return Response.json({ error: 'EmergencyAlert model unavailable' }, { status: 503 });
    }
    await EmergencyAlert.sync();

    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) return Response.json({ error: 'Missing id or status' }, { status: 400 });

    const rec = await EmergencyAlert.findByPk(id);
    if (!rec) return Response.json({ error: 'Not found' }, { status: 404 });

    rec.status = status;
    await rec.save();

    return Response.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error('[EMERGENCY_TRACKING_PATCH]', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
