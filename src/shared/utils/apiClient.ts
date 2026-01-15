// shared/utils/apiClient.ts
import { Block, GlobalTheme } from '@/shared/types/block';
import { ProjectData } from './storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

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
    throw new Error('프로젝트 생성에 실패했습니다.');
  }

  const data = await response.json();
  return data.id;
}

export async function updateProject(
  id: string,
  blocks: Block[],
  theme: GlobalTheme,
  title?: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
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
      const errorData = await response.json().catch(() => ({ error: '알 수 없는 오류' }));
      throw new Error(`프로젝트 업데이트에 실패했습니다: ${errorData.error || response.statusText}`);
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

export async function loadProject(id: string): Promise<ProjectData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      cache: 'no-store', // 항상 최신 데이터 가져오기
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('프로젝트 조회에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function projectExists(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'HEAD',
      cache: 'no-store',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
