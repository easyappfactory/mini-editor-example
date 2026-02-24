import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_BASE_URL, AUTH_COOKIE, getTokenExpiration } from '@/shared/utils/authServer';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, code: 'AUTH_401', message: '인증이 필요합니다.' },
      { status: 401 }
    );
  }

  const res = await fetch(`${AUTH_BASE_URL}/api/v1/auth/members/user-info`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'X-Client-Type': 'web',
    },
  });

  const data = await res.json();
  
  // 만료 시간 추가
  if (res.ok) {
    const expiresAt = getTokenExpiration(token);
    return NextResponse.json({
      ...data,
      expiresAt,
    }, { status: res.status });
  }

  return NextResponse.json(data, { status: res.status });
}
