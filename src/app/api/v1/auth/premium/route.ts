// app/api/v1/auth/premium/route.ts — 사용자 프리미엄 상태 조회
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, getUserIdFromToken } from '@/shared/utils/authServer';
import { isUserPremium } from '@/shared/utils/userPremiumStorage';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ success: false, isPremium: false }, { status: 401 });
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return NextResponse.json({ success: false, isPremium: false }, { status: 401 });
  }

  const isPremium = await isUserPremium(userId);
  return NextResponse.json({ success: true, isPremium });
}
