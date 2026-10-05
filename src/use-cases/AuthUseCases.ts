/**
 * 2. CAMADA DE CASOS DE USO — Autenticação e Registro
 */

import { IUserRepository } from '../domain/repositories/interfaces';
import { User } from '../domain/entities';
import { comparePassword, hashPassword, signToken, TokenPayload } from '../lib/auth';

export class AuthUseCases {
  constructor(private userRepo: IUserRepository) {}

  async login(email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const user = await this.userRepo.findByEmail(email.toLowerCase().trim());
    if (!user) {
      throw new Error('E-mail ou senha incorretos.');
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('E-mail ou senha incorretos.');
    }

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    const token = signToken(payload);
    const { passwordHash: _, ...safeUser } = user;

    return { user: safeUser, token };
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    birthDate?: Date | null;
    gender?: string;
  }): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const existing = await this.userRepo.findByEmail(data.email.toLowerCase().trim());
    if (existing) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    if (data.password.length < 6) {
      throw new Error('A senha deve conter no mínimo 6 caracteres.');
    }

    const passwordHash = await hashPassword(data.password);
    const user = await this.userRepo.create({
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      passwordHash,
      birthDate: data.birthDate || null,
      gender: data.gender || 'OTHER',
    });

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    const token = signToken(payload);
    const { passwordHash: _, ...safeUser } = user;

    return { user: safeUser, token };
  }

  async getUserProfile(userId: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userRepo.findById(userId);
    if (!user) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}
