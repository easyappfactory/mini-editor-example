// shared/utils/jwtUtils.ts
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number;
  sub?: string;
  userId?: string;
}

/**
 * JWT에서 만료 시간 추출 (밀리초 단위)
 */
export function getExpirationFromJWT(token: string): number | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return null;
    return decoded.exp * 1000; // 초 → 밀리초
  } catch (error) {
    console.error('JWT 파싱 실패:', error);
    return null;
  }
}

/**
 * JWT 만료까지 남은 시간 (분 단위)
 */
export function getTimeUntilExpiryFromJWT(token: string): number | null {
  const expireTime = getExpirationFromJWT(token);
  if (!expireTime) return null;

  const now = Date.now();
  const remainingMs = expireTime - now;

  if (remainingMs <= 0) return 0;
  return Math.floor(remainingMs / (60 * 1000)); // 밀리초 → 분
}

/**
 * JWT가 만료되었는지 확인
 */
export function isJWTExpired(token: string): boolean {
  const expireTime = getExpirationFromJWT(token);
  if (!expireTime) return true;
  return Date.now() >= expireTime;
}
