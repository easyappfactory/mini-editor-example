import { NextResponse } from 'next/server';
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

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
      return NextResponse.json({ success: false, code: 'AUTH_401' }, { status: 401 });
    }

    // auth-BE는 refresh 시 쿠키의 refreshToken만 사용 (Authorization 아님)
    const res = await fetch(`${AUTH_BASE_URL}/api/v1/auth/members/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `${REFRESH_TOKEN_COOKIE}=${refreshToken}`,
        Accept: 'application/json',
        'X-Client-Type': 'web',
      },
    });

    // auth-BE가 HTML/텍스트로 에러 반환 시 JSON 파싱 실패 방지
    let data: Record<string, unknown> = {};
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      try {
        data = (await res.json()) as Record<string, unknown>;
      } catch {
        data = { message: 'Invalid JSON response' };
      }
    }

    // auth-BE가 4xx/5xx 반환 시 로그 (원인 파악용)
    if (!res.ok) {
      console.error('[refresh] auth-BE 응답:', res.status, JSON.stringify(data));
    }

    if (res.ok) {
      const newToken = extractBearerToken(res);
      const newRefreshToken = extractRefreshTokenFromResponse(res);
      if (newToken) {
        cookieStore.set(AUTH_COOKIE, newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: COOKIE_MAX_AGE,
        });
        if (newRefreshToken) {
          cookieStore.set(REFRESH_TOKEN_COOKIE, newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: COOKIE_MAX_AGE,
          });
        }

        let expiresAt: number | null = null;
        try {
          expiresAt = getTokenExpiration(newToken);
        } catch {
          // JWT 파싱 실패 시 무시
        }

        return NextResponse.json(
          { ...data, expiresAt },
          { status: res.status }
        );
      }
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('[refresh]', error);
    return NextResponse.json(
      { success: false, code: 'INTERNAL_ERROR', message: '토큰 갱신 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
