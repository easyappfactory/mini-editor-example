// shared/utils/apiClient.ts (기존)
// 프로젝트 관련 API는 그대로 유지하고, 인증 체크만 추가

import { useAuthStore } from '@/stores/authStore';

export class ProjectAccessError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ProjectAccessError';
  }
}

/**
 * 인증이 필요한 API 요청 전 토큰 체크 (401 에러 시 자동 갱신)
 */
async function checkAndRefreshTokenIfNeeded(url: string): Promise<void> {
  // 토큰 갱신 체크를 건너뛸 API들
  const skipTokenCheckEndpoints = [
    '/api/v1/auth/email/request',
    '/api/v1/auth/email/verify',
    '/api/v1/auth/login',
    '/api/v1/auth/google/login',
    '/api/v1/auth/kakao/login',
    '/api/v1/auth/naver/login',
    '/api/v1/auth/refresh', // 무한 루프 방지
    '/api/v1/auth/logout',
  ];

  const shouldSkip = skipTokenCheckEndpoints.some((endpoint) => url.includes(endpoint));
  if (shouldSkip) return;

  // 인증이 필요한 API면 아무것도 안 함 (401 에러 후처리로 갱신)
  // 자동 갱신 제거: HttpOnly 쿠키라 만료시간 확인 불가
}

/**
 * fetch wrapper - 401 에러 시 자동 갱신 재시도
 */
export async function authFetch(url: string, options?: RequestInit): Promise<Response> {
  await checkAndRefreshTokenIfNeeded(url);
  
  let res = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  // 401 에러 시 토큰 갱신 후 재시도
  if (res.status === 401 && !url.includes('/refresh')) {
    const { refreshToken } = useAuthStore.getState();
    const refreshed = await refreshToken();
    
    if (refreshed) {
      // 갱신 성공 시 원래 요청 재시도
      res = await fetch(url, {
        ...options,
        credentials: 'include',
      });
    }
  }

  return res;
}

// 기존 프로젝트 API 함수들
export async function loadProject(projectId: string) {
  const res = await authFetch(`/api/v1/wedding-editor/${projectId}`);

  if (res.status === 401) {
    throw new ProjectAccessError('로그인이 필요합니다', 401);
  }
  if (res.status === 403) {
    throw new ProjectAccessError('접근 권한이 없습니다', 403);
  }
  if (!res.ok) {
    throw new ProjectAccessError('프로젝트를 찾을 수 없습니다', 404);
  }

  return res.json();
}

export async function saveProject(projectId: string, data: unknown) {
  const res = await authFetch(`/api/v1/wedding-editor/${projectId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '저장에 실패했습니다');
  }

  return res.json();
}
