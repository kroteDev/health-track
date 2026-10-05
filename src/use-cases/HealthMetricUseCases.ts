/**
 * 2. CAMADA DE CASOS DE USO — Orquestração de Métricas de Saúde e Indicadores
 */

import {
  IGlucoseRepository,
  IBloodPressureRepository,
  IWeightRepository,
  IHeightRepository,
  DateRangeFilter,
} from '../domain/repositories/interfaces';
import {
  GlucoseLog,
  BloodPressureLog,
  WeightLog,
  HeightLog,
  GlucoseContext,
  BMICalculation,
  ClinicalClassification,
} from '../domain/entities';
import { HealthClassificationService } from '../domain/services/HealthClassificationService';

export interface DashboardSummary {
  latestGlucose?: {
    log: GlucoseLog;
    classification: ClinicalClassification;
  } | null;
  latestBloodPressure?: {
    log: BloodPressureLog;
    classification: ClinicalClassification;
  } | null;
  latestWeight?: WeightLog | null;
  latestHeight?: HeightLog | null;
  bmiCalculation?: BMICalculation | null;
  averages: {
    fastingGlucoseAvg?: number | null;
    postMealGlucoseAvg?: number | null;
    overallGlucoseAvg?: number | null;
    systolicAvg?: number | null;
    diastolicAvg?: number | null;
    pulseAvg?: number | null;
    weightAvg?: number | null;
  };
  counts: {
    glucoseCount: number;
    bpCount: number;
    weightCount: number;
  };
}

export class HealthMetricUseCases {
  constructor(
    private glucoseRepo: IGlucoseRepository,
    private bpRepo: IBloodPressureRepository,
    private weightRepo: IWeightRepository,
    private heightRepo: IHeightRepository
  ) {}

  // GLICOSE
  async logGlucose(userId: string, data: { value: number; context: GlucoseContext; notes?: string; measuredAt?: Date }): Promise<GlucoseLog> {
    // Valida regra clínica
    HealthClassificationService.classifyGlucose(data.value, data.context);
    return await this.glucoseRepo.create({
      userId,
      value: data.value,
      context: data.context,
      notes: data.notes || null,
      measuredAt: data.measuredAt || new Date(),
    });
  }

  async getGlucoseLogs(userId: string, filter?: DateRangeFilter): Promise<Array<GlucoseLog & { classification: ClinicalClassification }>> {
    const logs = await this.glucoseRepo.findByUserId(userId, filter);
    return logs.map((log) => ({
      ...log,
      classification: HealthClassificationService.classifyGlucose(log.value, log.context),
    }));
  }

  async deleteGlucoseLog(id: string): Promise<void> {
    await this.glucoseRepo.delete(id);
  }

  // PRESSÃO ARTERIAL
  async logBloodPressure(
    userId: string,
    data: { systolic: number; diastolic: number; pulse?: number; notes?: string; measuredAt?: Date }
  ): Promise<BloodPressureLog> {
    // Valida inversão pressórica fisiológica (PAS <= PAD)
    HealthClassificationService.validateBloodPressure(data.systolic, data.diastolic);
    return await this.bpRepo.create({
      userId,
      systolic: Math.round(data.systolic),
      diastolic: Math.round(data.diastolic),
      pulse: data.pulse ? Math.round(data.pulse) : null,
      notes: data.notes || null,
      measuredAt: data.measuredAt || new Date(),
    });
  }

  async getBloodPressureLogs(
    userId: string,
    filter?: DateRangeFilter
  ): Promise<Array<BloodPressureLog & { classification: ClinicalClassification }>> {
    const logs = await this.bpRepo.findByUserId(userId, filter);
    return logs.map((log) => ({
      ...log,
      classification: HealthClassificationService.classifyBloodPressure(log.systolic, log.diastolic),
    }));
  }

  async deleteBloodPressureLog(id: string): Promise<void> {
    await this.bpRepo.delete(id);
  }

  // PESO E ALTURA
  async logWeight(userId: string, data: { weightKg: number; notes?: string; measuredAt?: Date }): Promise<WeightLog> {
    if (data.weightKg <= 0 || data.weightKg > 500) {
      throw new Error('Valor de peso inválido.');
    }
    return await this.weightRepo.create({
      userId,
      weightKg: Math.round(data.weightKg * 10) / 10,
      notes: data.notes || null,
      measuredAt: data.measuredAt || new Date(),
    });
  }

  async getWeightLogs(userId: string, filter?: DateRangeFilter): Promise<WeightLog[]> {
    return await this.weightRepo.findByUserId(userId, filter);
  }

  async deleteWeightLog(id: string): Promise<void> {
    await this.weightRepo.delete(id);
  }

  async logHeight(userId: string, data: { heightCm: number; notes?: string; measuredAt?: Date }): Promise<HeightLog> {
    if (data.heightCm < 50 || data.heightCm > 260) {
      throw new Error('Valor de altura fora dos limites aceitáveis (50 a 260 cm).');
    }
    return await this.heightRepo.create({
      userId,
      heightCm: Math.round(data.heightCm * 10) / 10,
      notes: data.notes || null,
      measuredAt: data.measuredAt || new Date(),
    });
  }

  async getHeightLogs(userId: string): Promise<HeightLog[]> {
    return await this.heightRepo.findByUserId(userId);
  }

  // DASHBOARD AGGREGADO
  async getDashboardSummary(userId: string, filter?: DateRangeFilter): Promise<DashboardSummary> {
    const [glucoseLogs, bpLogs, weightLogs, latestHeight, latestWeight] = await Promise.all([
      this.glucoseRepo.findByUserId(userId, filter),
      this.bpRepo.findByUserId(userId, filter),
      this.weightRepo.findByUserId(userId, filter),
      this.heightRepo.getLatestByUserId(userId),
      this.weightRepo.getLatestByUserId(userId),
    ]);

    // Últimos registros absolutos
    const latestGlucoseLog = glucoseLogs[0] || null;
    const latestBpLog = bpLogs[0] || null;

    let latestGlucose = null;
    if (latestGlucoseLog) {
      latestGlucose = {
        log: latestGlucoseLog,
        classification: HealthClassificationService.classifyGlucose(latestGlucoseLog.value, latestGlucoseLog.context),
      };
    }

    let latestBloodPressure = null;
    if (latestBpLog) {
      latestBloodPressure = {
        log: latestBpLog,
        classification: HealthClassificationService.classifyBloodPressure(latestBpLog.systolic, latestBpLog.diastolic),
      };
    }

    // Cálculo do IMC atual
    let bmiCalculation: BMICalculation | null = null;
    if (latestWeight && latestHeight) {
      try {
        bmiCalculation = HealthClassificationService.calculateBMI(latestWeight.weightKg, latestHeight.heightCm);
      } catch {
        bmiCalculation = null;
      }
    }

    // Médias no período
    let fastingSum = 0;
    let fastingCount = 0;
    let postMealSum = 0;
    let postMealCount = 0;
    let totalGlucoseSum = 0;

    glucoseLogs.forEach((g) => {
      totalGlucoseSum += g.value;
      if (g.context === 'FASTING') {
        fastingSum += g.value;
        fastingCount++;
      } else if (g.context === 'POST_MEAL') {
        postMealSum += g.value;
        postMealCount++;
      }
    });

    let systolicSum = 0;
    let diastolicSum = 0;
    let pulseSum = 0;
    let pulseCount = 0;

    bpLogs.forEach((b) => {
      systolicSum += b.systolic;
      diastolicSum += b.diastolic;
      if (b.pulse) {
        pulseSum += b.pulse;
        pulseCount++;
      }
    });

    let weightSum = 0;
    weightLogs.forEach((w) => {
      weightSum += w.weightKg;
    });

    return {
      latestGlucose,
      latestBloodPressure,
      latestWeight,
      latestHeight,
      bmiCalculation,
      averages: {
        fastingGlucoseAvg: fastingCount > 0 ? Math.round(fastingSum / fastingCount) : null,
        postMealGlucoseAvg: postMealCount > 0 ? Math.round(postMealSum / postMealCount) : null,
        overallGlucoseAvg: glucoseLogs.length > 0 ? Math.round(totalGlucoseSum / glucoseLogs.length) : null,
        systolicAvg: bpLogs.length > 0 ? Math.round(systolicSum / bpLogs.length) : null,
        diastolicAvg: bpLogs.length > 0 ? Math.round(diastolicSum / bpLogs.length) : null,
        pulseAvg: pulseCount > 0 ? Math.round(pulseSum / pulseCount) : null,
        weightAvg: weightLogs.length > 0 ? Math.round((weightSum / weightLogs.length) * 10) / 10 : null,
      },
      counts: {
        glucoseCount: glucoseLogs.length,
        bpCount: bpLogs.length,
        weightCount: weightLogs.length,
      },
    };
  }
}
