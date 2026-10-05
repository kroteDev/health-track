/**
 * 1. CAMADA DE DOMÍNIO — Entidades Puras (TypeScript puro, sem frameworks)
 */

export type GlucoseContext = 'FASTING' | 'PRE_MEAL' | 'POST_MEAL' | 'BEDTIME' | 'RANDOM';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  birthDate?: Date | null;
  gender: Gender | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GlucoseLog {
  id: string;
  userId: string;
  value: number; // mg/dL
  context: GlucoseContext;
  notes?: string | null;
  measuredAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BloodPressureLog {
  id: string;
  userId: string;
  systolic: number; // PAS (mmHg)
  diastolic: number; // PAD (mmHg)
  pulse?: number | null; // bpm
  notes?: string | null;
  measuredAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WeightLog {
  id: string;
  userId: string;
  weightKg: number;
  notes?: string | null;
  measuredAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HeightLog {
  id: string;
  userId: string;
  heightCm: number;
  notes?: string | null;
  measuredAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClinicalClassification {
  category: string;
  severity: 'optimal' | 'normal' | 'warning' | 'danger' | 'critical';
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  recommendation: string;
}

export interface BMICalculation {
  bmi: number;
  classification: ClinicalClassification;
}
