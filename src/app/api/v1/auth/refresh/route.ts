import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  AUTH_BASE_URL,
  AUTH_COOKIE,
  REFRESH_TOKEN_COOKIE,
  applyAuthResponseRelay,
  extractBearerToken,
  getTokenExpiration,
} from '@/shared/utils/authServer';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/shared/types/apiResponse';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.AUTH_UNAUTHORIZED, '인증이 필요합니다.'),
        { status: 401 }
      );
    }

    const res = await fetch(`${AUTH_BASE_URL}/api/v1/auth/members/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `${REFRESH_TOKEN_COOKIE}=${refreshToken}`,
        Accept: 'application/json',
        'X-Client-Type': 'web',
      },
    });

    let data: Record<string, unknown> = {};
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      try {
        data = (await res.json()) as Record<string, unknown>;
      } catch {
        data = { message: 'Invalid JSON response' };
      }
    }

    if (!res.ok) {
      console.error('[refresh] auth-BE 응답:', res.status, JSON.stringify(data));
    }

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

        let expiresAt: number | null = null;
        try {
          expiresAt = getTokenExpiration(newToken);
        } catch {
          // JWT 파싱 실패 시 무시
        }

        const nextRes = NextResponse.json(createSuccessResponse({ expiresAt }, '토큰이 갱신되었습니다.'));
        applyAuthResponseRelay(res, nextRes);
        return nextRes;
      }
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('[refresh]', error);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.COMMON_INTERNAL_ERROR, '토큰 갱신 중 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}
