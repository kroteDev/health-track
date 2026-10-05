/**
 * 2. CAMADA DE CASOS DE USO — Serviço de Exportação de Dados e Laudo
 * Suporte a CSV com UTF-8 BOM (\uFEFF) e separador ponto-e-vírgula (;) para Excel em Português.
 */

import { GlucoseLog, BloodPressureLog, WeightLog, HeightLog, User } from '../domain/entities';
import { HealthClassificationService } from '../domain/services/HealthClassificationService';

export class ReportExportService {
  /**
   * Gera uma planilha Excel compatível (.csv com UTF-8 BOM e ponto-e-vírgula)
   */
  public static generateCsvExport(params: {
    user: Pick<User, 'name' | 'email'>;
    glucoseLogs: GlucoseLog[];
    bpLogs: BloodPressureLog[];
    weightLogs: WeightLog[];
    height?: HeightLog | null;
  }): string {
    const BOM = '\uFEFF';
    const lines: string[] = [];

    // Cabeçalho do Laudo
    lines.push(`HEALTHTRACK - RELATÓRIO CLÍNICO DE SAÚDE`);
    lines.push(`Paciente;${params.user.name}`);
    lines.push(`E-mail;${params.user.email}`);
    lines.push(`Data da Emissão;${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`);
    if (params.height) {
      lines.push(`Estatura Cadastrada;${params.height.heightCm} cm`);
    }
    lines.push(''); // Linha vazia

    // 1. SEÇÃO DE GLICEMIA
    lines.push('--- REGISTROS DE GLICEMIA (SBD / ADA) ---');
    lines.push('Data/Hora;Valor (mg/dL);Momento Clínico;Classificação;Observações');
    params.glucoseLogs.forEach((g) => {
      const classification = HealthClassificationService.classifyGlucose(g.value, g.context);
      const dateStr = new Date(g.measuredAt).toLocaleString('pt-BR');
      const contextLabel =
        g.context === 'FASTING'
          ? 'Jejum'
          : g.context === 'POST_MEAL'
          ? 'Pós-refeição'
          : g.context === 'PRE_MEAL'
          ? 'Pré-refeição'
          : g.context === 'BEDTIME'
          ? 'Ao deitar'
          : 'Casual';
      const notes = (g.notes || '').replace(/;/g, ',');
      lines.push(`${dateStr};${g.value};${contextLabel};${classification.category};${notes}`);
    });
    lines.push('');

    // 2. SEÇÃO DE PRESSÃO ARTERIAL
    lines.push('--- REGISTROS DE PRESSÃO ARTERIAL (SBC / AHA) ---');
    lines.push('Data/Hora;Sistólica (PAS mmHg);Diastólica (PAD mmHg);Pulso (bpm);Classificação;Observações');
    params.bpLogs.forEach((b) => {
      const classification = HealthClassificationService.classifyBloodPressure(b.systolic, b.diastolic);
      const dateStr = new Date(b.measuredAt).toLocaleString('pt-BR');
      const pulseStr = b.pulse ? `${b.pulse}` : '-';
      const notes = (b.notes || '').replace(/;/g, ',');
      lines.push(`${dateStr};${b.systolic};${b.diastolic};${pulseStr};${classification.category};${notes}`);
    });
    lines.push('');

    // 3. SEÇÃO DE PESO E IMC
    lines.push('--- REGISTROS DE PESO E IMC (OMS) ---');
    lines.push('Data/Hora;Peso (kg);Estatura (cm);IMC (kg/m²);Classificação OMS;Observações');
    params.weightLogs.forEach((w) => {
      const dateStr = new Date(w.measuredAt).toLocaleString('pt-BR');
      let bmiStr = '-';
      let bmiClassStr = '-';
      if (params.height) {
        try {
          const calc = HealthClassificationService.calculateBMI(w.weightKg, params.height.heightCm);
          bmiStr = calc.bmi.toFixed(1).replace('.', ',');
          bmiClassStr = calc.classification.category;
        } catch {
          // ignora
        }
      }
      const notes = (w.notes || '').replace(/;/g, ',');
      lines.push(`${dateStr};${w.weightKg.toFixed(1).replace('.', ',')};${params.height?.heightCm || '-'};${bmiStr};${bmiClassStr};${notes}`);
    });

    return BOM + lines.join('\r\n');
  }
}
