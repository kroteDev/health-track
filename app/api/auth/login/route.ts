import { NextRequest, NextResponse } from 'next/server';
import { AuthUseCases } from '@/use-cases/AuthUseCases';
import { PrismaUserRepository } from '@/repositories/PrismaHealthRepository';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    const userRepo = new PrismaUserRepository();
    const authService = new AuthUseCases(userRepo);

    const { user, token } = await authService.login(email, password);

    const res = NextResponse.json({ user, success: true });

    // Set secure HTTP-only cookie
    res.cookies.set({
      name: 'healthtrack_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Falha ao autenticar usuário.' }, { status: 401 });
  }
}
