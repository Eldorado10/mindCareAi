import { NextRequest, NextResponse } from 'next/server';
import getRisk from '@/lib/models/Risk';

let riskSchemaReady = false;

async function ensureRiskSchema(Risk) {
  if (riskSchemaReady) return;
  await Risk.sync();
  const columns = await Risk.describe();
  if (!columns.riskScore) {
    await Risk.sync({ alter: true });
  }
  riskSchemaReady = true;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId'));
    const limit = parseInt(searchParams.get('limit')) || 10;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const Risk = getRisk();
    if (!Risk) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    await ensureRiskSchema(Risk);

    const risks = await Risk.findAll({
      where: { userId },
      order: [['detectedAt', 'DESC']],
      limit,
    });

    return NextResponse.json(risks);
  } catch (error) {
    console.error('Error fetching risk data:', error);
    return NextResponse.json({ error: 'Failed to fetch risk data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, riskLevel, riskType, indicator, actionTaken, riskScore } = body;

    if (!userId || !riskLevel || !riskType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const Risk = getRisk();
    if (!Risk) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    await ensureRiskSchema(Risk);

    const risk = await Risk.create({
      userId,
      riskLevel,
      riskScore: typeof riskScore === 'number' ? riskScore : 1,
      riskType,
      indicator,
      actionTaken,
      detectedAt: new Date(),
    });

    return NextResponse.json(risk, { status: 201 });
  } catch (error) {
    console.error('Error creating risk entry:', error);
    return NextResponse.json({ error: 'Failed to create risk entry' }, { status: 500 });
  }
}
