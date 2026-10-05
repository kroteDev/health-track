import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getHealthServices } from '@/lib/services';

export async function GET(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const daysParam = searchParams.get('days');

  let filter = undefined;
  if (daysParam && daysParam !== 'all') {
    const days = parseInt(daysParam, 10);
    if (!isNaN(days) && days > 0) {
      filter = {
        startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      };
    }
  }

  try {
    const services = getHealthServices();
    const summary = await services.getDashboardSummary(session.userId, filter);
    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Erro ao carregar resumo.' }, { status: 500 });
  }
}
