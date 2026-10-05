import {
  PrismaGlucoseRepository,
  PrismaBloodPressureRepository,
  PrismaWeightRepository,
  PrismaHeightRepository,
} from '@/repositories/PrismaHealthRepository';
import { HealthMetricUseCases } from '@/src/use-cases/HealthMetricUseCases';

export function getHealthServices() {
  const glucoseRepo = new PrismaGlucoseRepository();
  const bpRepo = new PrismaBloodPressureRepository();
  const weightRepo = new PrismaWeightRepository();
  const heightRepo = new PrismaHeightRepository();

  return new HealthMetricUseCases(glucoseRepo, bpRepo, weightRepo, heightRepo);
}
