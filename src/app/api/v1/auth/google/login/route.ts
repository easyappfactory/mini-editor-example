import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  AUTH_BASE_URL,
  AUTH_COOKIE,
  applyAuthResponseRelay,
  extractBearerToken,
  getTokenExpiration,
} from '@/shared/utils/authServer';
import { createSuccessResponse } from '@/shared/types/apiResponse';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: NextRequest) {
  const body = await request.json(); // { authCode, codeVerifier, redirectUri }

  const res = await fetch(`${AUTH_BASE_URL}/api/v1/auth/google/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Client-Type': 'web',
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as { success: boolean; code: string; message: string; data?: unknown };

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

      const expiresAt = getTokenExpiration(token);

      try {
        const userInfoRes = await fetch(`${AUTH_BASE_URL}/api/v1/auth/members/user-info`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'X-Client-Type': 'web',
          },
        });

        if (userInfoRes.ok) {
          const userInfo = (await userInfoRes.json()) as { success: boolean; data?: { userId?: number; id?: string; email?: string; nickname?: string } };
          const userData = userInfo.data ?? {};
          const user = { id: String(userData.userId ?? userData.id ?? ''), email: userData.email, nickname: userData.nickname };
          const nextRes = NextResponse.json(createSuccessResponse({ user, expiresAt }, '로그인에 성공했습니다.'));
          applyAuthResponseRelay(res, nextRes);
          return nextRes;
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    }
  }

  return NextResponse.json(data, { status: res.status });
}
