// shared/utils/apiClient.ts
import { Block, GlobalTheme } from '@/shared/types/block';
import { ProjectData } from './storage';
import { ApiResponse } from '@/shared/types/apiResponse';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1/wedding-editor';

// API 클라이언트 함수들 (클라이언트 사이드에서 사용)
export async function createProject(blocks: Block[], theme: GlobalTheme, title?: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ blocks, theme, title }),
  });

  if (!response.ok) {
    const errorResult: ApiResponse = await response.json();
    throw new Error(errorResult.message || '프로젝트 생성에 실패했습니다.');
  }

  const result: ApiResponse<{ id: string }> = await response.json();
  return result.data!.id;
}

export async function updateProject(
  id: string,
  blocks: Block[],
  theme: GlobalTheme,
  title?: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blocks, theme, title }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return false; // 프로젝트가 존재하지 않음
      }
      const errorResult: ApiResponse = await response.json().catch(() => ({ success: false, code: 'UNKNOWN', message: '알 수 없는 오류' }));
      throw new Error(`프로젝트 업데이트에 실패했습니다: ${errorResult.message}`);
    }
    
    return true; // 업데이트 성공
  } catch (error) {
    // 네트워크 에러 등
    if (error instanceof Error && error.message.includes('404')) {
      return false;
    }
    throw error;
  }
}

export class ProjectAccessError extends Error {
  constructor(public readonly status: 401 | 403 | 404) {
    super(status === 403 ? '접근 권한이 없습니다.' : status === 401 ? '로그인이 필요합니다.' : '프로젝트를 찾을 수 없습니다.');
    this.name = 'ProjectAccessError';
  }
}

export async function loadProject(id: string): Promise<ProjectData | null> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      throw new ProjectAccessError(response.status);
    }
    throw new Error('프로젝트 조회에 실패했습니다.');
  }

  const result: ApiResponse<ProjectData> = await response.json();
  return result.data || null;
}

export async function projectExists(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'HEAD',
      cache: 'no-store',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
