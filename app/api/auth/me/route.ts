import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { PrismaUserRepository } from '@/repositories/PrismaHealthRepository';
import { AuthUseCases } from '@/use-cases/AuthUseCases';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const userRepo = new PrismaUserRepository();
    const authService = new AuthUseCases(userRepo);
    const user = await authService.getUserProfile(session.userId);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
