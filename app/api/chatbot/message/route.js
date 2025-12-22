import { getDatabase } from '@/lib/database.js';
import getPsychiatrist from '@/lib/models/Psychiatrist.js';
import getResource from '@/lib/models/Resource.js';
import getEmergencyAlert from '@/lib/models/EmergencyAlert.js';
import getRisk from '@/lib/models/Risk.js';
import { formatCrisisResourcesText, getCrisisResources } from '@/lib/crisis-resources.js';
import { formatEmergencyTeamContact, getActiveEmergencyTeam } from '@/lib/emergency-team.js';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/auto';
const CLINIC_NAME = process.env.NEXT_PUBLIC_CLINIC_NAME || 'MindCare';
const DEFAULT_REGION = process.env.CHATBOT_REGION || 'BD';
let riskSchemaReady = false;
const CHATBOT_TEMPERATURE = Number.parseFloat(process.env.CHATBOT_TEMPERATURE || '0.7');
const CHATBOT_TOP_P = Number.parseFloat(process.env.CHATBOT_TOP_P || '0.9');
const CHATBOT_MAX_TOKENS = Number.parseInt(process.env.CHATBOT_MAX_TOKENS || '550', 10);

function getAuthenticatedUserId(request) {
  const userId = request.headers.get('x-user-id');
  return userId ? parseInt(userId) : null;
}

function clampNumber(value, { min, max, fallback }) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function normalizeOpenRouterModel(model) {
  const raw = (model || '').trim();
  if (!raw) return 'openrouter/auto';

  // Support common OpenRouter naming patterns like: "OpenAI: gpt-oss-120b" -> "openai/gpt-oss-120b"
  const vendorStyle = raw.match(/^([A-Za-z0-9_-]+)\s*:\s*([A-Za-z0-9_.-]+)$/);
  if (vendorStyle) {
    const vendor = vendorStyle[1].toLowerCase();
    const name = vendorStyle[2];
    return `${vendor}/${name}`;
  }

  return raw;
}

function buildCrisisResponse({ emergencyTeam } = {}) {
  const resources = getCrisisResources(DEFAULT_REGION);
  const lines = [
    "I'm really sorry you are feeling this way. Your safety matters.",
    'Are you in immediate danger right now?',
  ];

  if (resources.regionName && resources.emergency) {
    lines.push(`If you are in ${resources.regionName}, call ${resources.emergency} or go to the nearest hospital emergency department.`);
  } else {
    lines.push('If you are in immediate danger, call your local emergency number or go to the nearest hospital emergency department.');
  }

  lines.push('If you can, reach out to someone you trust and stay with them.');

  if (resources.crisisLink) {
    lines.push(`More crisis resources: ${resources.crisisLink}`);
  }

  const emergencyTeamLine = formatEmergencyTeamContact(emergencyTeam);
  if (emergencyTeamLine) {
    lines.push(emergencyTeamLine);
  }

  lines.push('If you want, you can tell me what is happening right now.');

  return lines.join('\n\n');
}

// Simple fallback response if OpenRouter is unavailable
const generateFallbackResponse = (userMessage, moodLevel, riskLevel) => {
  if (riskLevel === 'high' || riskLevel === 'critical') {
    return buildCrisisResponse();
  }
  const lower = (userMessage || '').toLowerCase();
  const moodResponses = {
    1: "I'm so sorry you're feeling this way. What you're going through sounds incredibly difficult. Let's talk about what's bothering you the most.",
    2: "That sounds really tough. It's okay to not be okay sometimes. I'm here to listen and help you work through this.",
    3: "I can sense you're struggling with some challenging feelings. Tell me more about what's been happening.",
    4: "It sounds like you're having a rough time. Many people feel this way, and it's important to acknowledge these feelings.",
    5: "Thank you for sharing how you're feeling. It's a neutral moment - let's explore what might help improve your mood.",
    6: "That's good to hear! It sounds like things are looking a bit better. What's been helping?",
    7: "It's wonderful that you're feeling good! Let's talk about what's contributing to your positive mood.",
    8: "You seem to be in a great place right now! This is excellent progress. Keep doing what's working for you.",
    9: "That's fantastic! You're feeling excellent. This is a great opportunity to reflect on what brought you here.",
    10: "Wow, you're feeling amazing! That's wonderful to hear. Let's talk about what's making you feel so great."
  };
  const baseResponse = moodResponses[Math.round(moodLevel)] || 'Thank you for sharing with me.';

  const suggestions = [];
  if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes("can't sleep")) {
    suggestions.push('Try a simple wind-down: dim lights + no phone for 20 minutes.');
    suggestions.push('If thoughts keep looping, write them down and tell yourself you can revisit them tomorrow.');
  } else if (lower.includes('panic') || lower.includes('anxious') || lower.includes('anxiety')) {
    suggestions.push('Try grounding: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.');
    suggestions.push('Try breathing: inhale 4, hold 4, exhale 6 (repeat 5 times).');
  } else if (lower.includes('stress') || lower.includes('overwhelmed')) {
    suggestions.push('Pick one small task for the next 10 minutes (something you can finish).');
    suggestions.push('Do a quick reset: drink water + stretch your shoulders/neck for 1 minute.');
  } else if (lower.includes('sad') || lower.includes('depressed') || lower.includes('down')) {
    suggestions.push('If you can, do one small “activation” step: a short walk, shower, or tidy one corner.');
    suggestions.push('Consider texting one person you trust: “I’m not feeling great today, can we talk?”');
  }

  const followUp =
    lower.includes('why') || lower.includes('because')
      ? 'What part of this feels the hardest right now?'
      : 'What happened today that brought these feelings up?';

  if (moodLevel <= 4) {
    const defaultSuggestions = [
      'Breathing: 4-7-8 technique',
      'Movement: a short walk or gentle stretching',
      'Connection: message someone you trust',
      'Self-care: something small and soothing',
      'Professional support: a therapist/psychiatrist can help',
    ];
    const list = (suggestions.length ? suggestions : defaultSuggestions)
      .slice(0, 3)
      .map((s) => `- ${s}`)
      .join('\n');

    return `${baseResponse}\n\nA couple of small things to try right now:\n${list}\n\n${followUp}`;
  }
  if (moodLevel >= 7) {
    return `${baseResponse}\n\nKeep investing in what's working for you. ${followUp}`;
  }
  return `${baseResponse}\n\n${followUp}`;
};

async function buildClinicContext(queryText = '') {
  try {
    const Psychiatrist = getPsychiatrist();
    const Resource = getResource();

    if (!Psychiatrist && !Resource) return '';

    const [psychiatrists, resources] = await Promise.all([
      Psychiatrist
        ? Psychiatrist.findAll({
            attributes: ['name', 'specialization', 'experience', 'consultationFee', 'bio'],
            limit: 25,
          })
        : Promise.resolve([]),
      Resource
        ? Resource.findAll({
            attributes: ['title', 'description', 'category'],
            limit: 25,
          })
        : Promise.resolve([]),
    ]);

    const extractKeywords = (text) => {
      const raw = (text || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);

      const stop = new Set([
        'i','me','my','mine','we','our','you','your','yours',
        'a','an','the','and','or','but','if','then','so','to','of','in','on','for','with','at','from',
        'is','are','was','were','be','been','being',
        'it','this','that','these','those',
        'help','please','need','want','feel','feeling','today',
      ]);

      const keywords = [];
      for (const w of raw) {
        if (w.length < 3) continue;
        if (stop.has(w)) continue;
        if (!keywords.includes(w)) keywords.push(w);
        if (keywords.length >= 10) break;
      }
      return keywords;
    };

    const scoreByKeywords = (text, keywords) => {
      if (!keywords.length) return 0;
      const hay = (text || '').toLowerCase();
      let score = 0;
      for (const k of keywords) {
        if (hay.includes(k)) score += 1;
      }
      return score;
    };

    const keywords = extractKeywords(queryText);

    const topPsychiatrists = psychiatrists
      .map((p) => ({
        p,
        score: scoreByKeywords(`${p.name} ${p.specialization} ${p.bio || ''}`, keywords),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ p }) => p);

    const topResources = resources
      .map((r) => ({
        r,
        score: scoreByKeywords(`${r.title} ${r.category} ${r.description || ''}`, keywords),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ r }) => r);

    const lines = [];

    if (topPsychiatrists.length) {
      lines.push('Psychiatrists:');
      topPsychiatrists.forEach((p) => {
        const parts = [p.name, p.specialization].filter(Boolean).join(' - ');
        const extra = [];
        if (typeof p.experience === 'number' && p.experience > 0) {
          extra.push(`${p.experience} yrs exp`);
        }
        if (p.consultationFee) {
          extra.push(`fee ${p.consultationFee}`);
        }
        const suffix = extra.length ? ` (${extra.join(', ')})` : '';
        lines.push(`- ${parts}${suffix}`);
      });
    }

    if (topResources.length) {
      lines.push('Resources:');
      topResources.forEach((r) => {
        const desc = r.description ? `: ${r.description}` : '';
        const cat = r.category ? ` (${r.category})` : '';
        lines.push(`- ${r.title}${cat}${desc}`);
      });
    }

    return lines.join('\n');
  } catch (error) {
    console.error('[CHATBOT_CONTEXT]', error);
    return '';
  }
}

function buildSystemPrompt({ clinicContext, crisisText }) {
  const lines = [
    `You are Aura, a supportive mental health assistant for ${CLINIC_NAME}.`,
    'Safety rules:',
    '- You are not a clinician and do not diagnose, prescribe, or provide medical advice.',
    '- If asked for diagnosis or medication guidance, explain your limits and suggest professional care.',
    '- If the user shows self-harm or suicide risk, respond with empathy, ask if they are in immediate danger, encourage contacting local emergency services or a crisis hotline, and suggest reaching out to a trusted person.',
    '- Keep crisis responses short, direct, and action focused.',
    'Style:',
    '- Validate feelings and be non-judgmental.',
    '- Ask one gentle follow-up question.',
    '- Offer 1 to 3 low-risk, general wellbeing suggestions when appropriate (breathing, grounding, sleep, hydration, light movement).',
    '- Keep physical exercise suggestions gentle and safe. Avoid medical claims.',
    '- Encourage booking with a psychiatrist when the user requests professional support or ongoing care.',
    '- Do not repeat long disclaimers in every message. Only mention limitations when needed, and keep it to one short sentence.',
    '- Avoid repetitive phrasing. Be specific to the user’s situation and reference their exact words.',
    '- If you already suggested something similar earlier, suggest a different option or ask a new question.',
    'Local crisis resources:',
    crisisText,
  ];

  if (clinicContext) {
    lines.push('Clinic information (use only if relevant, do not invent details):');
    lines.push(clinicContext);
  }

  return lines.join('\n');
}

function analyzeRiskAndMood(text) {
  const lower = (text || '').toLowerCase();
  let moodLevel = 5;
  let riskLevel = 'low';
  let riskScore = 2;
  let riskType = 'other';

  const moodKeywords = {
    terrible: 1, awful: 1, horrible: 1, depressed: 2,
    sad: 3, anxious: 3, stressed: 3, worried: 3, overwhelmed: 3,
    okay: 5, neutral: 5, fine: 5,
    good: 7, happy: 7, content: 7,
    great: 9, excellent: 9, amazing: 9, wonderful: 9
  };
  for (const [w,l] of Object.entries(moodKeywords)) {
    if (lower.includes(w)) { moodLevel = l; break; }
  }

  const suicidePhrases = [
    'suicide', 'kill myself', 'end my life', 'no reason to live', 'want to die',
    'wish i was dead', 'take my life', 'end it all'
  ];
  const selfHarmPhrases = [
    'self-harm', 'self harm', 'hurt myself', 'harm myself', 'cut myself', 'overdose'
  ];
  const planSignals = [
    'plan', 'planning', 'means', 'method', 'tonight', 'today', 'right now', 'immediate'
  ];
  const hasSuicidePhrase = suicidePhrases.some(k => lower.includes(k));
  const hasSelfHarmPhrase = selfHarmPhrases.some(k => lower.includes(k));
  const hasPlanSignal = planSignals.some(k => lower.includes(k));

  if (hasSuicidePhrase && hasPlanSignal) {
    riskLevel = 'critical';
  } else if (hasSuicidePhrase || hasSelfHarmPhrase) {
    riskLevel = 'high';
  } else if (lower.includes('hopeless') || lower.includes('worthless') || lower.includes('despair')) {
    riskLevel = 'medium';
  }

  const heavySignals = [
    'panic attack', 'abuse', 'violence', 'assault', 'i can\'t cope', 'i can\'t go on',
    'domestic violence', 'sexual assault'
  ];
  const isHeavy = heavySignals.some(k => lower.includes(k)) || riskLevel !== 'low';

  const substanceSignals = ['alcohol', 'drug', 'substance', 'addiction', 'overdose'];
  const hasSubstanceSignal = substanceSignals.some(k => lower.includes(k));

  if (hasSuicidePhrase) {
    riskType = 'suicidal-ideation';
  } else if (hasSelfHarmPhrase) {
    riskType = 'self-harm';
  } else if (hasSubstanceSignal) {
    riskType = 'substance-abuse';
  } else if (isHeavy) {
    riskType = 'crisis';
  }

  if (hasSuicidePhrase) {
    riskScore = 10;
  } else if (riskLevel === 'critical') {
    riskScore = 10;
  } else if (riskLevel === 'high') {
    riskScore = 8;
  } else if (riskLevel === 'medium') {
    riskScore = isHeavy ? 6 : 5;
  }

  return { moodLevel, riskLevel, riskScore, riskType, isHeavy };
}

async function recordEmergencyAlert({ userId, riskLevel, isHeavy, message }) {
  try {
    const EmergencyAlert = getEmergencyAlert();
    if (!EmergencyAlert) return;

    await EmergencyAlert.sync();
    await EmergencyAlert.create({
      userId,
      riskLevel,
      isHeavy: !!isHeavy,
      excerpt: message.slice(0, 240),
      fullText: message,
      status: 'new',
    });
  } catch (error) {
    console.error('[EMERGENCY_ALERT_FAILED]', error);
  }
}

async function ensureRiskSchema(Risk) {
  if (riskSchemaReady) return;
  try {
    await Risk.sync();
    const columns = await Risk.describe();
    if (!columns.riskScore) {
      await Risk.sync({ alter: true });
    }
    riskSchemaReady = true;
  } catch (error) {
    console.error('[RISK_SCHEMA]', error);
  }
}

async function recordRiskEntry({ userId, riskLevel, riskScore, riskType, indicator, actionTaken }) {
  try {
    const Risk = getRisk();
    if (!Risk) return;

    await ensureRiskSchema(Risk);
    await Risk.create({
      userId,
      riskLevel,
      riskScore,
      riskType,
      indicator,
      actionTaken,
      detectedAt: new Date(),
    });
  } catch (error) {
    console.error('[RISK_ENTRY_FAILED]', error);
  }
}

async function callOpenRouter(messages) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Assistant',
  };

  const temperature = clampNumber(CHATBOT_TEMPERATURE, { min: 0, max: 1.5, fallback: 0.7 });
  const topP = clampNumber(CHATBOT_TOP_P, { min: 0.1, max: 1, fallback: 0.9 });
  const maxTokens = clampNumber(CHATBOT_MAX_TOKENS, { min: 128, max: 1200, fallback: 550 });

  const primaryModel = normalizeOpenRouterModel(OPENROUTER_MODEL);
  const endpoint = 'https://openrouter.ai/api/v1/chat/completions';

  const makeBody = (model) => ({
    model,
    messages,
    temperature,
    top_p: topP,
    max_tokens: maxTokens,
  });

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(makeBody(primaryModel)),
  });
  if (!res.ok) {
    const text = await res.text();

    const shouldRetry =
      primaryModel !== 'openrouter/auto' &&
      (res.status === 400 || res.status === 404) &&
      /model|not found|unknown/i.test(text);

    if (shouldRetry) {
      const retryRes = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(makeBody('openrouter/auto')),
      });
      if (!retryRes.ok) {
        const retryText = await retryRes.text();
        throw new Error(`OpenRouter error ${retryRes.status}: ${retryText}`);
      }
      const retryData = await retryRes.json();
      const retryContent = retryData?.choices?.[0]?.message?.content || '';
      return { content: retryContent, model: 'openrouter/auto' };
    }

    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || '';
  return { content, model: primaryModel };
}

export async function POST(request) {
  try {
    const authenticatedUserId = getAuthenticatedUserId(request);
    if (!authenticatedUserId) {
      return Response.json({ error: 'Authentication required. Please include x-user-id header.' }, { status: 401 });
    }

    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    await sequelize.authenticate();

    const body = await request.json();
    const { userId, message, conversationHistory = [] } = body;

    if (parseInt(userId) !== authenticatedUserId) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }
    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'message is required' }, { status: 400 });
    }

    // Analyze content for mood/risk and heaviness
    const { moodLevel, riskLevel, riskScore, riskType, isHeavy } = analyzeRiskAndMood(message);
    const isCrisis = riskLevel === 'high' || riskLevel === 'critical';

    let emergencyTeam = null;
    try {
      emergencyTeam = await getActiveEmergencyTeam();
    } catch (error) {
      console.error('[EMERGENCY_TEAM]', error);
    }

    // Build messages for OpenRouter
    const clinicContext = await buildClinicContext(message);
    const crisisText = formatCrisisResourcesText(getCrisisResources(DEFAULT_REGION), emergencyTeam);
    const systemPrompt = {
      role: 'system',
      content: buildSystemPrompt({ clinicContext, crisisText }),
    };
    const runtimeContext = {
      role: 'system',
      content: `Runtime context (do not reveal): region=${DEFAULT_REGION}; moodLevel=${moodLevel}; riskLevel=${riskLevel}; riskScore=${riskScore}; riskType=${riskType}.`,
    };

    const safeHistory = Array.isArray(conversationHistory)
      ? conversationHistory
          .filter((m) => m && typeof m.content === 'string' && typeof m.role === 'string')
          .map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          }))
          .slice(-12)
      : [];

    const chatMessages = [systemPrompt, runtimeContext]
      .concat(safeHistory)
      .concat([{ role: 'user', content: message }]);

    let aiMessage = '';
    let responseMeta = { provider: 'fallback', model: null };
    if (isCrisis) {
      aiMessage = buildCrisisResponse({ emergencyTeam });
      responseMeta = { provider: 'crisis', model: null };
    } else if (OPENROUTER_API_KEY) {
      try {
        const result = await callOpenRouter(chatMessages);
        aiMessage = result.content;
        responseMeta = { provider: 'openrouter', model: result.model };
      } catch (e) {
        console.error('[OpenRouter]', e);
        aiMessage = generateFallbackResponse(message, moodLevel, riskLevel);
        responseMeta = { provider: 'fallback', model: null };
      }
    } else {
      aiMessage = generateFallbackResponse(message, moodLevel, riskLevel);
      responseMeta = { provider: 'fallback', model: null };
    }

    // Emergency notification payload (server-side hook)
    if (riskLevel !== 'low' || isHeavy) {
      await recordEmergencyAlert({
        userId: authenticatedUserId,
        riskLevel,
        isHeavy,
        message,
      });
    }
    if (riskLevel !== 'low' || isHeavy) {
      await recordRiskEntry({
        userId: authenticatedUserId,
        riskLevel,
        riskScore,
        riskType,
        indicator: message.slice(0, 240),
        actionTaken: isCrisis ? 'Crisis guidance provided' : 'Supportive guidance provided',
      });
    }

    return Response.json({
      message: aiMessage,
      analysis: { moodLevel, riskLevel, riskScore, riskType, isHeavy },
      meta: responseMeta,
      actions: {
        shouldUpgradeDashboardRisk: riskLevel !== 'low',
        suggestBooking: moodLevel <= 4 || isHeavy || riskLevel !== 'low',
      },
    }, { status: 200 });
  } catch (error) {
    console.error('[API] Chatbot message error:', error);
    return Response.json({ 
      error: error.message,
      message: "I'm having trouble right now, but I'm here to support you. Please try again in a moment.",
    }, { status: 500 });
  }
}
