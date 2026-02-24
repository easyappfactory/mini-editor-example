// shared/utils/authServer.ts
// 서버 사이드 전용 auth 유틸 (Next.js API route, Server Component, middleware에서 사용)
import { jwtDecode } from 'jwt-decode';

export const AUTH_COOKIE = 'auth_token';
export const AUTH_BASE_URL =
  process.env.AUTH_API_BASE_URL ?? 'https://api.easyappfactory.com';

interface JwtPayload {
  sub?: string;
  userId?: string;
  exp?: number;
}

/** JWT에서 user_id 추출 (sub 필드 기준, 없으면 userId 필드) */
export function getUserIdFromToken(token: string): string | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    return payload.sub ?? payload.userId ?? null;
  } catch {
    return null;
  }
}

/** JWT 만료 여부 확인 */
export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (!exp) return false;
    return Date.now() > exp * 1000;
  } catch {
    return true;
  }
}

/** JWT 만료 시간 추출 (밀리초) */
export function getTokenExpiration(token: string): number | null {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return exp ? exp * 1000 : null;
  } catch {
    return null;
  }
}

/** auth-BE Authorization 응답 헤더에서 Bearer 토큰 추출 */
export function extractBearerToken(res: Response): string | null {
  const header = res.headers.get('Authorization') ?? res.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7);
}
