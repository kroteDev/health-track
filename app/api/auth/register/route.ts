import { NextRequest, NextResponse } from 'next/server';
import { AuthUseCases } from '@/use-cases/AuthUseCases';
import { PrismaUserRepository } from '@/repositories/PrismaHealthRepository';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, birthDate, gender } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Nome, e-mail e senha são obrigatórios.' }, { status: 400 });
    }

    const userRepo = new PrismaUserRepository();
    const authService = new AuthUseCases(userRepo);

    const { user, token } = await authService.register({
      email,
      password,
      name,
      birthDate: birthDate ? new Date(birthDate) : null,
      gender,
    });

    const res = NextResponse.json({ user, success: true });

    res.cookies.set({
      name: 'healthtrack_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Falha ao registrar conta.' }, { status: 400 });
  }
}
