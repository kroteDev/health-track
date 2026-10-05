/**
 * 1. CAMADA DE DOMÍNIO — Serviço de Regras Clínicas (SBC, SBD, OMS)
 * Validações fisiológicas e classificações médicas estritas.
 */

import { ClinicalClassification, BMICalculation, GlucoseContext } from '../entities';

export class HealthClassificationService {
  /**
   * Validação Fisiológica de Pressão Arterial
   * A pressão sistólica (PAS) deve ser estritamente maior que a diastólica (PAD).
   */
  public static validateBloodPressure(systolic: number, diastolic: number): void {
    if (systolic <= 0 || diastolic <= 0) {
      throw new Error('Os valores de pressão arterial devem ser positivos.');
    }
    if (systolic <= diastolic) {
      throw new Error(
        `Inversão pressórica fisiológica: A Pressão Sistólica (${systolic} mmHg) deve ser estritamente maior que a Diastólica (${diastolic} mmHg).`
      );
    }
    if (systolic > 300 || diastolic > 200) {
      throw new Error('Valores de pressão arterial fora dos limites biológicos plausíveis.');
    }
  }

  /**
   * Classificação da Pressão Arterial conforme Diretrizes da SBC e AHA
   */
  public static classifyBloodPressure(systolic: number, diastolic: number): ClinicalClassification {
    this.validateBloodPressure(systolic, diastolic);

    // Crise Hipertensiva (Emergência/Urgência): PAS >= 180 e/ou PAD >= 110
    if (systolic >= 180 || diastolic >= 110) {
      return {
        category: 'Crise Hipertensiva',
        severity: 'critical',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-500',
        description: 'PAS ≥ 180 mmHg ou PAD ≥ 110 mmHg. Risco agudo cardiovascular.',
        recommendation: 'Procure assistência médica imediata ou pronto-socorro.',
      };
    }

    // Hipertensão Estágio 2: PAS 160–179 e/ou PAD 100–109
    if (systolic >= 160 || diastolic >= 100) {
      return {
        category: 'Hipertensão Estágio 2',
        severity: 'danger',
        color: 'text-rose-700',
        bgColor: 'bg-rose-100',
        borderColor: 'border-rose-400',
        description: 'PAS 160–179 mmHg ou PAD 100–109 mmHg.',
        recommendation: 'Necessário acompanhamento médico contínuo e ajuste terapêutico.',
      };
    }

    // Hipertensão Estágio 1: PAS 140–159 e/ou PAD 90–99
    if (systolic >= 140 || diastolic >= 90) {
      return {
        category: 'Hipertensão Estágio 1',
        severity: 'warning',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
        borderColor: 'border-amber-400',
        description: 'PAS 140–159 mmHg ou PAD 90–99 mmHg.',
        recommendation: 'Agende consulta com cardiologista ou clínico geral.',
      };
    }

    // Pré-hipertensão: PAS 130–139 e/ou PAD 85–89
    if (systolic >= 130 || diastolic >= 85) {
      return {
        category: 'Pré-hipertensão',
        severity: 'warning',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-400',
        description: 'PAS 130–139 mmHg ou PAD 85–89 mmHg.',
        recommendation: 'Monitore regularmente e adote hábitos alimentares com menos sódio.',
      };
    }

    // Normal: PAS 120–129 e/ou PAD 80–84
    if (systolic >= 120 || diastolic >= 80) {
      return {
        category: 'Pressão Normal',
        severity: 'normal',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-400',
        description: 'PAS 120–129 mmHg e/ou PAD 80–84 mmHg.',
        recommendation: 'Mantenha estilo de vida ativo e hábitos saudáveis.',
      };
    }

    // Ótima: PAS < 120 e PAD < 80
    return {
      category: 'Pressão Ótima',
      severity: 'optimal',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-100',
      borderColor: 'border-emerald-400',
      description: 'PAS < 120 mmHg e PAD < 80 mmHg.',
      recommendation: 'Excelente padrão hemodinâmico. Continue assim!',
    };
  }

  /**
   * Classificação da Glicemia conforme Diretrizes da SBD e ADA
   */
  public static classifyGlucose(value: number, context: GlucoseContext = 'FASTING'): ClinicalClassification {
    if (value <= 0) {
      throw new Error('O valor de glicemia deve ser maior que zero.');
    }
    if (value > 800) {
      throw new Error('Valor de glicose fora dos limites biológicos plausíveis.');
    }

    // Alerta de Hipoglicemia (< 70 mg/dL)
    if (value < 70) {
      return {
        category: 'Hipoglicemia',
        severity: 'critical',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-400',
        description: '< 70 mg/dL. Risco de sintomas neuroglicopênicos.',
        recommendation: 'Consuma 15g de carboidratos rápidos (regra dos 15) e reavalie em 15 min.',
      };
    }

    // Avaliação em Jejum (FASTING)
    if (context === 'FASTING') {
      if (value < 100) {
        return {
          category: 'Glicemia Normal (Jejum)',
          severity: 'optimal',
          color: 'text-emerald-700',
          bgColor: 'bg-emerald-100',
          borderColor: 'border-emerald-400',
          description: '70–99 mg/dL em jejum.',
          recommendation: 'Padrão glicêmico basal ideal.',
        };
      }
      if (value <= 125) {
        return {
          category: 'Pré-diabetes / Jejum Alterado',
          severity: 'warning',
          color: 'text-amber-700',
          bgColor: 'bg-amber-100',
          borderColor: 'border-amber-400',
          description: '100–125 mg/dL em jejum.',
          recommendation: 'Sinal de resistência à insulina. Avalie com exame de Hemoglobina Glicada (HbA1c).',
        };
      }
      return {
        category: 'Diabetes Provável',
        severity: 'danger',
        color: 'text-rose-700',
        bgColor: 'bg-rose-100',
        borderColor: 'border-rose-400',
        description: '≥ 126 mg/dL em jejum.',
        recommendation: 'Necessária confirmação com teste laboratorial e avaliação médica.',
      };
    }

    // Avaliação Pós-refeição (POST_MEAL) - até 2h após a refeição
    if (context === 'POST_MEAL') {
      if (value < 140) {
        return {
          category: 'Glicemia Normal (Pós-prandial)',
          severity: 'optimal',
          color: 'text-emerald-700',
          bgColor: 'bg-emerald-100',
          borderColor: 'border-emerald-400',
          description: '< 140 mg/dL pós-refeição.',
          recommendation: 'Excelente resposta à absorção de carboidratos.',
        };
      }
      if (value <= 199) {
        return {
          category: 'Glicemia Elevada (Pós-prandial)',
          severity: 'warning',
          color: 'text-amber-700',
          bgColor: 'bg-amber-100',
          borderColor: 'border-amber-400',
          description: '140–199 mg/dL pós-refeição.',
          recommendation: 'Indica tolerância diminuída à glicose.',
        };
      }
      return {
        category: 'Diabetes Provável',
        severity: 'danger',
        color: 'text-rose-700',
        bgColor: 'bg-rose-100',
        borderColor: 'border-rose-400',
        description: '≥ 200 mg/dL pós-refeição.',
        recommendation: 'Pico glicêmico acentuado. Consulte seu endocrinologista.',
      };
    }

    // Outros contextos (Pré-refeição, Bedtime, Casual)
    if (value < 140) {
      return {
        category: 'Glicemia Normal',
        severity: 'optimal',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-100',
        borderColor: 'border-emerald-400',
        description: '70–139 mg/dL.',
        recommendation: 'Dentro dos parâmetros de normalidade.',
      };
    }
    if (value <= 199) {
      return {
        category: 'Glicemia Limítrofe',
        severity: 'warning',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
        borderColor: 'border-amber-400',
        description: '140–199 mg/dL.',
        recommendation: 'Monitore a ingestão de açúcares simples.',
      };
    }
    return {
      category: 'Hiperglicemia Acentuada',
      severity: 'danger',
      color: 'text-rose-700',
      bgColor: 'bg-rose-100',
      borderColor: 'border-rose-400',
      description: '≥ 200 mg/dL.',
      recommendation: 'Acompanhamento médico prioritário.',
    };
  }

  /**
   * Cálculo e Classificação de IMC (Índice de Massa Corporal - OMS)
   */
  public static calculateBMI(weightKg: number, heightCm: number): BMICalculation {
    if (weightKg <= 0 || heightCm <= 0) {
      throw new Error('Peso e altura devem ser valores estritamente positivos.');
    }
    if (heightCm > 260 || heightCm < 50) {
      throw new Error('Altura fora dos limites anatômicos humanos aceitáveis.');
    }
    if (weightKg > 500 || weightKg < 20) {
      throw new Error('Peso fora dos limites biológicos aceitáveis.');
    }

    const heightM = heightCm / 100;
    const rawBmi = weightKg / (heightM * heightM);
    const bmi = Math.round(rawBmi * 10) / 10;

    let classification: ClinicalClassification;

    if (bmi < 18.5) {
      classification = {
        category: 'Abaixo do Peso',
        severity: 'warning',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
        borderColor: 'border-amber-400',
        description: 'IMC < 18.5 kg/m².',
        recommendation: 'Avaliação nutricional para ganho de massa magra.',
      };
    } else if (bmi <= 24.9) {
      classification = {
        category: 'Peso Normal (Eutrófico)',
        severity: 'optimal',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-100',
        borderColor: 'border-emerald-400',
        description: 'IMC 18.5–24.9 kg/m².',
        recommendation: 'Peso ideal para a estatura. Mantenha os hábitos saudáveis.',
      };
    } else if (bmi <= 29.9) {
      classification = {
        category: 'Sobrepeso (Pré-obesidade)',
        severity: 'warning',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-400',
        description: 'IMC 25.0–29.9 kg/m².',
        recommendation: 'Recomenda-se atividade física regular e reeducação alimentar.',
      };
    } else if (bmi <= 34.9) {
      classification = {
        category: 'Obesidade Grau I',
        severity: 'danger',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100',
        borderColor: 'border-orange-400',
        description: 'IMC 30.0–34.9 kg/m².',
        recommendation: 'Acompanhamento multiprofissional com médico e nutricionista.',
      };
    } else if (bmi <= 39.9) {
      classification = {
        category: 'Obesidade Grau II (Severa)',
        severity: 'danger',
        color: 'text-rose-700',
        bgColor: 'bg-rose-100',
        borderColor: 'border-rose-400',
        description: 'IMC 35.0–39.9 kg/m².',
        recommendation: 'Risco cardiovascular aumentado. Intervenção clínica especializada.',
      };
    } else {
      classification = {
        category: 'Obesidade Grau III (Mórbida)',
        severity: 'critical',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-500',
        description: 'IMC ≥ 40.0 kg/m².',
        recommendation: 'Prioridade clínica médica e metabólica.',
      };
    }

    return { bmi, classification };
  }
}
