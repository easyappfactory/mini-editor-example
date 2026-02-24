import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_BASE_URL, AUTH_COOKIE, extractBearerToken, getTokenExpiration } from '@/shared/utils/authServer';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ success: false, code: 'AUTH_401' }, { status: 401 });
  }

  const res = await fetch(`${AUTH_BASE_URL}/api/v1/auth/members/refresh`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'X-Client-Type': 'web',
    },
  });

  const data = await res.json();

  if (res.ok) {
    const newToken = extractBearerToken(res);
    if (newToken) {
      cookieStore.set(AUTH_COOKIE, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: COOKIE_MAX_AGE,
      });

      // 토큰 만료 시간 추출
      const expiresAt = getTokenExpiration(newToken);
      
      // 응답에 expiresAt 추가
      return NextResponse.json({
        ...data,
        expiresAt,
      }, { status: res.status });
    }
  }

  return NextResponse.json(data, { status: res.status });
}
