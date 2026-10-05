import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Limpa registros anteriores para permitir re-seed seguro
  await prisma.glucoseLog.deleteMany();
  await prisma.bloodPressureLog.deleteMany();
  await prisma.weightLog.deleteMany();
  await prisma.heightLog.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('123456', 10);

  const demoUser = await prisma.user.create({
    data: {
      email: 'usuario@saude.com',
      name: 'Carlos Silva (Demonstração)',
      passwordHash,
      birthDate: new Date('1982-06-15'),
      gender: 'MALE',
    },
  });

  console.log(`Usuário demo criado com ID: ${demoUser.id}`);

  // Altura cadastrada (175 cm)
  await prisma.heightLog.create({
    data: {
      userId: demoUser.id,
      heightCm: 175,
      notes: 'Medição inicial em consulta de rotina',
      measuredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Histórico de peso (evolução nos últimos 30 dias)
  const weightEntries = [
    { daysAgo: 30, weightKg: 81.2, notes: 'Início do acompanhamento nutricional' },
    { daysAgo: 22, weightKg: 80.5, notes: 'Pesagem matinal em jejum' },
    { daysAgo: 15, weightKg: 79.8, notes: 'Pesagem pós-treino' },
    { daysAgo: 8,  weightKg: 79.0, notes: 'Redução consistente' },
    { daysAgo: 1,  weightKg: 78.4, notes: 'Meta intermediária alcançada' },
  ];

  for (const entry of weightEntries) {
    await prisma.weightLog.create({
      data: {
        userId: demoUser.id,
        weightKg: entry.weightKg,
        notes: entry.notes,
        measuredAt: new Date(Date.now() - entry.daysAgo * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Histórico de Pressão Arterial (SBC/AHA)
  const bpEntries = [
    { daysAgo: 28, systolic: 138, diastolic: 88, pulse: 76, notes: 'Pré-hipertensão leve matinal' },
    { daysAgo: 21, systolic: 132, diastolic: 84, pulse: 72, notes: 'Após caminhada leve' },
    { daysAgo: 14, systolic: 126, diastolic: 82, pulse: 70, notes: 'Pressão normal' },
    { daysAgo: 7,  systolic: 122, diastolic: 80, pulse: 68, notes: 'Excelente resposta à dieta' },
    { daysAgo: 3,  systolic: 118, diastolic: 76, pulse: 66, notes: 'Pressão ótima (SBC)' },
    { daysAgo: 0,  systolic: 116, diastolic: 74, pulse: 65, notes: 'Medição de hoje' },
  ];

  for (const entry of bpEntries) {
    await prisma.bloodPressureLog.create({
      data: {
        userId: demoUser.id,
        systolic: entry.systolic,
        diastolic: entry.diastolic,
        pulse: entry.pulse,
        notes: entry.notes,
        measuredAt: new Date(Date.now() - entry.daysAgo * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Histórico de Glicemia (SBD/ADA)
  const glucoseEntries = [
    { daysAgo: 25, value: 112, context: 'FASTING', notes: 'Glicemia de jejum ligeiramente elevada' },
    { daysAgo: 20, value: 145, context: 'POST_MEAL', notes: '2h após almoço de domingo' },
    { daysAgo: 15, value: 98,  context: 'FASTING', notes: 'Glicemia normal em jejum' },
    { daysAgo: 10, value: 130, context: 'POST_MEAL', notes: 'Após almoço equilibrado' },
    { daysAgo: 5,  value: 92,  context: 'FASTING', notes: 'Excelente controle glicêmico' },
    { daysAgo: 2,  value: 104, context: 'PRE_MEAL', notes: 'Antes do jantar' },
    { daysAgo: 0,  value: 90,  context: 'FASTING', notes: 'Medição matinal de hoje' },
  ];

  for (const entry of glucoseEntries) {
    await prisma.glucoseLog.create({
      data: {
        userId: demoUser.id,
        value: entry.value,
        context: entry.context,
        notes: entry.notes,
        measuredAt: new Date(Date.now() - entry.daysAgo * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
