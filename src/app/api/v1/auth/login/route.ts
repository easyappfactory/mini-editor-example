import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_BASE_URL, AUTH_COOKIE, extractBearerToken } from '@/shared/utils/authServer';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7일

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${AUTH_BASE_URL}/api/v1/auth/members/email-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Client-Type': 'web',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (res.ok) {
    const token = extractBearerToken(res);
    if (token) {
      const cookieStore = await cookies();
      cookieStore.set(AUTH_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: COOKIE_MAX_AGE,
      });
    }
  }

  return NextResponse.json(data, { status: res.status });
}
