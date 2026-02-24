import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  AUTH_BASE_URL,
  AUTH_COOKIE,
  REFRESH_TOKEN_COOKIE,
  extractBearerToken,
  extractRefreshTokenFromResponse,
  getTokenExpiration,
} from '@/shared/utils/authServer';

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

  const data = await res.json();

  if (res.ok) {
    const token = extractBearerToken(res);
    const refreshToken = extractRefreshTokenFromResponse(res);
    if (token) {
      const cookieStore = await cookies();
      cookieStore.set(AUTH_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: COOKIE_MAX_AGE,
      });
      if (refreshToken) {
        cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: COOKIE_MAX_AGE,
        });
      }

      // 토큰 만료 시간 추출
      const expiresAt = getTokenExpiration(token);

      // 로그인 성공 후 즉시 사용자 정보 조회하여 응답에 포함
      try {
        const userInfoRes = await fetch(`${AUTH_BASE_URL}/api/v1/auth/members/user-info`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'X-Client-Type': 'web',
          },
        });
        
        if (userInfoRes.ok) {
          const userInfo = await userInfoRes.json();
          return NextResponse.json({
            ...data,
            userInfo: userInfo.data,
            expiresAt,
          }, { status: res.status });
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    }
  }

  return NextResponse.json(data, { status: res.status });
}
