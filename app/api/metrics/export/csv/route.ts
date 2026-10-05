import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import {
  PrismaUserRepository,
  PrismaGlucoseRepository,
  PrismaBloodPressureRepository,
  PrismaWeightRepository,
  PrismaHeightRepository,
} from '@/repositories/PrismaHealthRepository';
import { ReportExportService } from '@/use-cases/ReportExportService';

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  const userRepo = new PrismaUserRepository();
  const glucoseRepo = new PrismaGlucoseRepository();
  const bpRepo = new PrismaBloodPressureRepository();
  const weightRepo = new PrismaWeightRepository();
  const heightRepo = new PrismaHeightRepository();

  const [user, glucoseLogs, bpLogs, weightLogs, latestHeight] = await Promise.all([
    userRepo.findById(session.userId),
    glucoseRepo.findByUserId(session.userId),
    bpRepo.findByUserId(session.userId),
    weightRepo.findByUserId(session.userId),
    heightRepo.getLatestByUserId(session.userId),
  ]);

  if (!user) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });

  const csvContent = ReportExportService.generateCsvExport({
    user: { name: user.name, email: user.email },
    glucoseLogs,
    bpLogs,
    weightLogs,
    height: latestHeight,
  });

  const filename = `healthtrack_relatorio_${new Date().toISOString().split('T')[0]}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
