/**
 * 5. TESTES UNITÁRIOS — Regras Clínicas de Domínio (SBC, SBD, OMS)
 */

import { HealthClassificationService } from '../domain/services/HealthClassificationService';

export interface TestCaseResult {
  suite: string;
  name: string;
  passed: boolean;
  message?: string;
  durationMs: number;
}

export function runDomainUnitTests(): { total: number; passed: number; failed: number; results: TestCaseResult[] } {
  const results: TestCaseResult[] = [];

  function test(suite: string, name: string, fn: () => void) {
    const start = performance.now();
    try {
      fn();
      results.push({
        suite,
        name,
        passed: true,
        durationMs: Math.round(performance.now() - start),
      });
    } catch (err: any) {
      results.push({
        suite,
        name,
        passed: false,
        message: err?.message || String(err),
        durationMs: Math.round(performance.now() - start),
      });
    }
  }

  function assert(condition: boolean, msg: string) {
    if (!condition) throw new Error(msg);
  }

  // --- SUÍTE 1: PRESSÃO ARTERIAL (SBC / AHA) ---
  test('Pressão Arterial', 'Classificação de Pressão Ótima (<120 e <80)', () => {
    const res = HealthClassificationService.classifyBloodPressure(115, 75);
    assert(res.category === 'Pressão Ótima', `Esperado "Pressão Ótima", obteve "${res.category}"`);
    assert(res.severity === 'optimal', 'Severidade deve ser "optimal"');
  });

  test('Pressão Arterial', 'Classificação de Pressão Normal (120-129 e/ou 80-84)', () => {
    const res = HealthClassificationService.classifyBloodPressure(125, 82);
    assert(res.category === 'Pressão Normal', `Esperado "Pressão Normal", obteve "${res.category}"`);
  });

  test('Pressão Arterial', 'Classificação de Pré-hipertensão (130-139 e/ou 85-89)', () => {
    const res = HealthClassificationService.classifyBloodPressure(135, 88);
    assert(res.category === 'Pré-hipertensão', `Esperado "Pré-hipertensão", obteve "${res.category}"`);
  });

  test('Pressão Arterial', 'Classificação de Hipertensão Estágio 1 (140-159 e/ou 90-99)', () => {
    const res = HealthClassificationService.classifyBloodPressure(145, 95);
    assert(res.category === 'Hipertensão Estágio 1', `Esperado "Hipertensão Estágio 1", obteve "${res.category}"`);
  });

  test('Pressão Arterial', 'Classificação de Hipertensão Estágio 2 (160-179 e/ou 100-109)', () => {
    const res = HealthClassificationService.classifyBloodPressure(165, 105);
    assert(res.category === 'Hipertensão Estágio 2', `Esperado "Hipertensão Estágio 2", obteve "${res.category}"`);
  });

  test('Pressão Arterial', 'Classificação de Crise Hipertensiva (≥180 e/ou ≥110)', () => {
    const res = HealthClassificationService.classifyBloodPressure(190, 115);
    assert(res.category === 'Crise Hipertensiva', `Esperado "Crise Hipertensiva", obteve "${res.category}"`);
    assert(res.severity === 'critical', 'Severidade deve ser crítica');
  });

  test('Pressão Arterial', 'Bloqueio Fisiológico de Inversão Pressórica (PAS <= PAD)', () => {
    let threw = false;
    try {
      HealthClassificationService.classifyBloodPressure(80, 120);
    } catch (e: any) {
      threw = true;
      assert(e.message.includes('Inversão pressórica'), 'Mensagem de erro deve detalhar inversão pressórica');
    }
    assert(threw, 'Deveria lançar erro ao passar PAS <= PAD');

    let threwEqual = false;
    try {
      HealthClassificationService.classifyBloodPressure(110, 110);
    } catch {
      threwEqual = true;
    }
    assert(threwEqual, 'Deveria lançar erro com PAS igual a PAD');
  });

  // --- SUÍTE 2: GLICEMIA (SBD / ADA) ---
  test('Glicemia', 'Detecção de Hipoglicemia (<70 mg/dL)', () => {
    const res = HealthClassificationService.classifyGlucose(62, 'FASTING');
    assert(res.category === 'Hipoglicemia', `Esperado "Hipoglicemia", obteve "${res.category}"`);
    assert(res.severity === 'critical', 'Severidade de hipoglicemia deve ser crítica');
  });

  test('Glicemia', 'Jejum Normal (70 a 99 mg/dL)', () => {
    const res = HealthClassificationService.classifyGlucose(85, 'FASTING');
    assert(res.category === 'Glicemia Normal (Jejum)', `Obteve "${res.category}"`);
  });

  test('Glicemia', 'Jejum Pré-diabetes (100 a 125 mg/dL)', () => {
    const res = HealthClassificationService.classifyGlucose(115, 'FASTING');
    assert(res.category.includes('Pré-diabetes'), `Obteve "${res.category}"`);
  });

  test('Glicemia', 'Jejum Diabetes Provável (≥126 mg/dL)', () => {
    const res = HealthClassificationService.classifyGlucose(130, 'FASTING');
    assert(res.category === 'Diabetes Provável', `Obteve "${res.category}"`);
  });

  test('Glicemia', 'Pós-refeição Normal (<140 mg/dL)', () => {
    const res = HealthClassificationService.classifyGlucose(128, 'POST_MEAL');
    assert(res.category === 'Glicemia Normal (Pós-prandial)', `Obteve "${res.category}"`);
  });

  test('Glicemia', 'Pós-refeição Elevada (140 a 199 mg/dL)', () => {
    const res = HealthClassificationService.classifyGlucose(165, 'POST_MEAL');
    assert(res.category === 'Glicemia Elevada (Pós-prandial)', `Obteve "${res.category}"`);
  });

  test('Glicemia', 'Pós-refeição Diabetes Provável (≥200 mg/dL)', () => {
    const res = HealthClassificationService.classifyGlucose(215, 'POST_MEAL');
    assert(res.category === 'Diabetes Provável', `Obteve "${res.category}"`);
  });

  // --- SUÍTE 3: ÍNDICE DE MASSA CORPORAL (OMS) ---
  test('IMC', 'Cálculo e Classificação Eutrófico (Normal)', () => {
    // 70 kg, 175 cm -> 70 / (1.75 * 1.75) = 22.86 -> 22.9
    const res = HealthClassificationService.calculateBMI(70, 175);
    assert(res.bmi === 22.9, `Esperado 22.9, obteve ${res.bmi}`);
    assert(res.classification.category.includes('Peso Normal'), `Obteve "${res.classification.category}"`);
  });

  test('IMC', 'Classificação Sobrepeso (25.0 - 29.9)', () => {
    // 82 kg, 175 cm -> 26.8
    const res = HealthClassificationService.calculateBMI(82, 175);
    assert(res.bmi === 26.8, `Esperado 26.8, obteve ${res.bmi}`);
    assert(res.classification.category.includes('Sobrepeso'), `Obteve "${res.classification.category}"`);
  });

  test('IMC', 'Classificação Obesidade Grau I (30.0 - 34.9)', () => {
    // 95 kg, 175 cm -> 31.0
    const res = HealthClassificationService.calculateBMI(95, 175);
    assert(res.bmi === 31.0, `Esperado 31.0, obteve ${res.bmi}`);
    assert(res.classification.category === 'Obesidade Grau I', `Obteve "${res.classification.category}"`);
  });

  test('IMC', 'Validação de parâmetros absurdos', () => {
    let threw = false;
    try {
      HealthClassificationService.calculateBMI(-10, 175);
    } catch {
      threw = true;
    }
    assert(threw, 'Peso negativo deve lançar erro');
  });

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  return { total: results.length, passed, failed, results };
}
