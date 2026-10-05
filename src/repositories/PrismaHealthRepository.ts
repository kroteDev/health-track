/**
 * 3. CAMADA DE REPOSITÓRIO — Adaptador de Persistência Prisma (PostgreSQL / SQLite)
 */

import { prisma } from '../lib/prisma';
import {
  IUserRepository,
  IGlucoseRepository,
  IBloodPressureRepository,
  IWeightRepository,
  IHeightRepository,
  DateRangeFilter,
} from '../domain/repositories/interfaces';
import { User, GlucoseLog, BloodPressureLog, WeightLog, HeightLog, GlucoseContext } from '../domain/entities';

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return {
      ...user,
      birthDate: user.birthDate,
      gender: user.gender,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return {
      ...user,
      birthDate: user.birthDate,
      gender: user.gender,
    };
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        birthDate: data.birthDate,
        gender: data.gender,
      },
    });
    return {
      ...user,
      birthDate: user.birthDate,
      gender: user.gender,
    };
  }
}

export class PrismaGlucoseRepository implements IGlucoseRepository {
  async create(data: Omit<GlucoseLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<GlucoseLog> {
    const item = await prisma.glucoseLog.create({
      data: {
        userId: data.userId,
        value: data.value,
        context: data.context,
        notes: data.notes,
        measuredAt: data.measuredAt,
      },
    });
    return {
      ...item,
      context: item.context as GlucoseContext,
    };
  }

  async findById(id: string): Promise<GlucoseLog | null> {
    const item = await prisma.glucoseLog.findUnique({ where: { id } });
    if (!item) return null;
    return {
      ...item,
      context: item.context as GlucoseContext,
    };
  }

  async findByUserId(userId: string, filter?: DateRangeFilter): Promise<GlucoseLog[]> {
    const where: any = { userId };
    if (filter?.startDate || filter?.endDate) {
      where.measuredAt = {};
      if (filter.startDate) where.measuredAt.gte = filter.startDate;
      if (filter.endDate) where.measuredAt.lte = filter.endDate;
    }

    const items = await prisma.glucoseLog.findMany({
      where,
      orderBy: { measuredAt: 'desc' },
    });

    return items.map((item) => ({
      ...item,
      context: item.context as GlucoseContext,
    }));
  }

  async update(id: string, data: Partial<Omit<GlucoseLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<GlucoseLog> {
    const item = await prisma.glucoseLog.update({
      where: { id },
      data,
    });
    return {
      ...item,
      context: item.context as GlucoseContext,
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.glucoseLog.delete({ where: { id } });
  }
}

export class PrismaBloodPressureRepository implements IBloodPressureRepository {
  async create(data: Omit<BloodPressureLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<BloodPressureLog> {
    const item = await prisma.bloodPressureLog.create({
      data: {
        userId: data.userId,
        systolic: data.systolic,
        diastolic: data.diastolic,
        pulse: data.pulse,
        notes: data.notes,
        measuredAt: data.measuredAt,
      },
    });
    return item;
  }

  async findById(id: string): Promise<BloodPressureLog | null> {
    const item = await prisma.bloodPressureLog.findUnique({ where: { id } });
    return item;
  }

  async findByUserId(userId: string, filter?: DateRangeFilter): Promise<BloodPressureLog[]> {
    const where: any = { userId };
    if (filter?.startDate || filter?.endDate) {
      where.measuredAt = {};
      if (filter.startDate) where.measuredAt.gte = filter.startDate;
      if (filter.endDate) where.measuredAt.lte = filter.endDate;
    }

    return await prisma.bloodPressureLog.findMany({
      where,
      orderBy: { measuredAt: 'desc' },
    });
  }

  async update(id: string, data: Partial<Omit<BloodPressureLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<BloodPressureLog> {
    return await prisma.bloodPressureLog.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.bloodPressureLog.delete({ where: { id } });
  }
}

export class PrismaWeightRepository implements IWeightRepository {
  async create(data: Omit<WeightLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<WeightLog> {
    return await prisma.weightLog.create({
      data: {
        userId: data.userId,
        weightKg: data.weightKg,
        notes: data.notes,
        measuredAt: data.measuredAt,
      },
    });
  }

  async findById(id: string): Promise<WeightLog | null> {
    return await prisma.weightLog.findUnique({ where: { id } });
  }

  async findByUserId(userId: string, filter?: DateRangeFilter): Promise<WeightLog[]> {
    const where: any = { userId };
    if (filter?.startDate || filter?.endDate) {
      where.measuredAt = {};
      if (filter.startDate) where.measuredAt.gte = filter.startDate;
      if (filter.endDate) where.measuredAt.lte = filter.endDate;
    }

    return await prisma.weightLog.findMany({
      where,
      orderBy: { measuredAt: 'desc' },
    });
  }

  async getLatestByUserId(userId: string): Promise<WeightLog | null> {
    return await prisma.weightLog.findFirst({
      where: { userId },
      orderBy: { measuredAt: 'desc' },
    });
  }

  async update(id: string, data: Partial<Omit<WeightLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<WeightLog> {
    return await prisma.weightLog.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.weightLog.delete({ where: { id } });
  }
}

export class PrismaHeightRepository implements IHeightRepository {
  async create(data: Omit<HeightLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeightLog> {
    return await prisma.heightLog.create({
      data: {
        userId: data.userId,
        heightCm: data.heightCm,
        notes: data.notes,
        measuredAt: data.measuredAt,
      },
    });
  }

  async findById(id: string): Promise<HeightLog | null> {
    return await prisma.heightLog.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<HeightLog[]> {
    return await prisma.heightLog.findMany({
      where: { userId },
      orderBy: { measuredAt: 'desc' },
    });
  }

  async getLatestByUserId(userId: string): Promise<HeightLog | null> {
    return await prisma.heightLog.findFirst({
      where: { userId },
      orderBy: { measuredAt: 'desc' },
    });
  }

  async update(id: string, data: Partial<Omit<HeightLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<HeightLog> {
    return await prisma.heightLog.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.heightLog.delete({ where: { id } });
  }
}
