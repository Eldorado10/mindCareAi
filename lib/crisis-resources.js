const DEFAULT_REGION = (process.env.CHATBOT_REGION || 'BD').toUpperCase();

const CRISIS_RESOURCES = {
  BD: {
    regionName: 'Bangladesh',
    emergency: '999',
    crisisLink: 'https://www.iasp.info/resources/Crisis_Centres/',
    guidance: [
      'If you are in immediate danger, call 999 or go to the nearest hospital emergency department.',
      'If you can, ask a trusted person to stay with you.',
    ],
  },
};

const FALLBACK_RESOURCES = {
  regionName: 'your area',
  emergency: null,
  crisisLink: 'https://www.iasp.info/resources/Crisis_Centres/',
  guidance: [
    'If you are in immediate danger, call your local emergency number or go to the nearest hospital emergency department.',
    'If you can, ask a trusted person to stay with you.',
  ],
};

export function getCrisisResources(region = DEFAULT_REGION) {
  const normalized = (region || '').toUpperCase();
  return CRISIS_RESOURCES[normalized] || FALLBACK_RESOURCES;
}

export function formatCrisisResourcesText(resources = getCrisisResources()) {
  const lines = [];

  if (resources.regionName && resources.emergency) {
    lines.push(`- If you are in ${resources.regionName}, call ${resources.emergency} or go to the nearest hospital emergency department.`);
  } else {
    lines.push('- If you are in immediate danger, call your local emergency number or go to the nearest hospital emergency department.');
  }

  if (Array.isArray(resources.guidance)) {
    resources.guidance.forEach((line) => {
      if (line && !line.includes('emergency department')) {
        lines.push(`- ${line}`);
      }
    });
  }

  if (resources.crisisLink) {
    lines.push(`- More crisis resources: ${resources.crisisLink}`);
  }

  return lines.join('\n');
}
