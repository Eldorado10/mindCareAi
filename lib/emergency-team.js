import getEmergencyTeam from './models/EmergencyTeam.js';

const DEFAULT_TEAM = {
  name: (process.env.EMERGENCY_TEAM_NAME || 'MindCare Emergency Team').trim(),
  email: (process.env.EMERGENCY_TEAM_EMAIL || 'support@mindcare.ai').trim(),
  phone: (process.env.EMERGENCY_TEAM_PHONE || process.env.EMERGENCY_TEAM_CONTACT || '+8801871535267').trim(),
  region: (process.env.EMERGENCY_TEAM_REGION || 'Bangladesh').trim(),
};

const normalizeTeam = (team) => {
  if (!team) return null;
  const name = (team.name || '').trim();
  const email = (team.email || '').trim();
  const phone = (team.phone || team.contact || team.contactNumber || '').trim();
  const region = (team.region || '').trim();
  if (!name || !email || !phone) return null;
  return {
    name,
    email,
    phone,
    region: region || 'Bangladesh',
  };
};

const buildSeedPayload = () => {
  const payload = normalizeTeam(DEFAULT_TEAM);
  if (!payload) return null;
  return { ...payload, isActive: true };
};

export const formatEmergencyTeamContact = (team) => {
  if (!team) return '';
  const raw = team.get ? team.get({ plain: true }) : team;
  const normalized = normalizeTeam(raw);
  if (!normalized) return '';
  const regionLabel = normalized.region || 'Bangladesh';
  const details = [normalized.name, normalized.phone, normalized.email].join(' | ');
  return `Emergency team (${regionLabel}): ${details}`;
};

export const toEmergencyTeamResponse = (team) => {
  if (!team) return null;
  const raw = team.get ? team.get({ plain: true }) : team;
  const normalized = normalizeTeam(raw);
  if (!normalized) return null;
  return { ...normalized, id: raw.id };
};

export const getActiveEmergencyTeam = async () => {
  const EmergencyTeam = getEmergencyTeam();
  if (!EmergencyTeam) return null;

  await EmergencyTeam.sync();

  let team = await EmergencyTeam.findOne({
    where: { isActive: true },
    order: [['id', 'DESC']],
  });

  if (!team) {
    const payload = buildSeedPayload();
    if (payload) {
      team = await EmergencyTeam.create(payload);
    }
  }

  return team || null;
};
