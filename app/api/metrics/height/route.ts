import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getHealthServices } from '@/lib/services';

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  const services = getHealthServices();
  const logs = await services.getHeightLogs(session.userId);
  return NextResponse.json({ logs });
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  try {
    const body = await req.json();
    const services = getHealthServices();
    const log = await services.logHeight(session.userId, {
      heightCm: parseFloat(body.heightCm),
      notes: body.notes,
      measuredAt: body.measuredAt ? new Date(body.measuredAt) : new Date(),
    });
    return NextResponse.json({ log, success: true }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Falha ao registrar estatura.' }, { status: 400 });
  }
}
