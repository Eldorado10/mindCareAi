import { getDatabase } from '@/lib/database.js';
import { getActiveEmergencyTeam, toEmergencyTeamResponse } from '@/lib/emergency-team.js';

export async function GET() {
  try {
    const sequelize = getDatabase();
    if (!sequelize) return Response.json({ error: 'DB not ready' }, { status: 503 });
    await sequelize.authenticate();

    const team = await getActiveEmergencyTeam();
    return Response.json({ team: toEmergencyTeamResponse(team) }, { status: 200 });
  } catch (error) {
    console.error('[EMERGENCY_TEAM_GET]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
