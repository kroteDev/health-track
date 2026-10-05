/**
 * 1. CAMADA DE DOMÍNIO — Contratos (Portas) de Repositório
 */

import { User, GlucoseLog, BloodPressureLog, WeightLog, HeightLog } from '../entities';

export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
}

export interface IGlucoseRepository {
  create(data: Omit<GlucoseLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<GlucoseLog>;
  findById(id: string): Promise<GlucoseLog | null>;
  findByUserId(userId: string, filter?: DateRangeFilter): Promise<GlucoseLog[]>;
  update(id: string, data: Partial<Omit<GlucoseLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<GlucoseLog>;
  delete(id: string): Promise<void>;
}

export interface IBloodPressureRepository {
  create(data: Omit<BloodPressureLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<BloodPressureLog>;
  findById(id: string): Promise<BloodPressureLog | null>;
  findByUserId(userId: string, filter?: DateRangeFilter): Promise<BloodPressureLog[]>;
  update(id: string, data: Partial<Omit<BloodPressureLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<BloodPressureLog>;
  delete(id: string): Promise<void>;
}

export interface IWeightRepository {
  create(data: Omit<WeightLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<WeightLog>;
  findById(id: string): Promise<WeightLog | null>;
  findByUserId(userId: string, filter?: DateRangeFilter): Promise<WeightLog[]>;
  getLatestByUserId(userId: string): Promise<WeightLog | null>;
  update(id: string, data: Partial<Omit<WeightLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<WeightLog>;
  delete(id: string): Promise<void>;
}

export interface IHeightRepository {
  create(data: Omit<HeightLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeightLog>;
  findById(id: string): Promise<HeightLog | null>;
  findByUserId(userId: string): Promise<HeightLog[]>;
  getLatestByUserId(userId: string): Promise<HeightLog | null>;
  update(id: string, data: Partial<Omit<HeightLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<HeightLog>;
  delete(id: string): Promise<void>;
}
