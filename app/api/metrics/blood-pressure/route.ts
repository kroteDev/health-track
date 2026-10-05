import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getHealthServices } from '@/lib/services';

export async function GET(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = searchParams.get('days');
  let filter = undefined;
  if (days && days !== 'all') {
    const num = parseInt(days, 10);
    if (!isNaN(num)) filter = { startDate: new Date(Date.now() - num * 24 * 60 * 60 * 1000) };
  }

  const services = getHealthServices();
  const logs = await services.getBloodPressureLogs(session.userId, filter);
  return NextResponse.json({ logs });
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  try {
    const body = await req.json();
    const services = getHealthServices();
    const log = await services.logBloodPressure(session.userId, {
      systolic: parseInt(body.systolic, 10),
      diastolic: parseInt(body.diastolic, 10),
      pulse: body.pulse ? parseInt(body.pulse, 10) : undefined,
      notes: body.notes,
      measuredAt: body.measuredAt ? new Date(body.measuredAt) : new Date(),
    });
    return NextResponse.json({ log, success: true }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Falha ao registrar pressão arterial.' }, { status: 400 });
  }
}
