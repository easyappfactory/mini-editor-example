// shared/utils/premiumStorage.ts
// 프리미엄 상태를 DB에서 조회하는 유틸리티 (localStorage는 캐시용으로만 사용)
import { ApiResponse } from '@/shared/types/apiResponse';

const PREMIUM_STORAGE_KEY = 'wedding_premium_projects';

interface PremiumProject {
  projectId: string;
  code: string;
  unlockedAt: string; // ISO 8601 timestamp
}

interface PremiumStorage {
  [projectId: string]: {
    code: string;
    unlockedAt: string;
  };
}

/**
 * 특정 프로젝트가 프리미엄인지 확인 (DB 우선, localStorage는 캐시)
 */
export async function isPremiumProject(projectId: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!projectId || projectId === 'new') return false;
  
  try {
    // 1. localStorage 캐시 확인 (빠른 응답)
    const cachedPremium = isPremiumProjectCached(projectId);
    
    // 2. DB에서 실제 프리미엄 상태 확인 (신뢰할 수 있는 소스)
    const response = await fetch(`/api/v1/wedding-editor/${projectId}`);
    if (!response.ok) return cachedPremium; // API 실패시 캐시 사용
    
    const result: ApiResponse<{ is_premium?: boolean; premium_code?: string }> = await response.json();
    const data = result.data || {};
    const isPremium = data.is_premium || false;
    
    // 3. DB 상태와 캐시가 다르면 캐시 업데이트
    if (isPremium && !cachedPremium && data.premium_code) {
      setPremiumProjectCache(projectId, data.premium_code);
    } else if (!isPremium && cachedPremium) {
      removePremiumProjectCache(projectId);
    }
    
    return isPremium;
  } catch (error) {
    console.error('프리미엄 상태 확인 오류:', error);
    // 에러 시 캐시 사용
    return isPremiumProjectCached(projectId);
  }
}

/**
 * localStorage에서 프리미엄 상태 확인 (캐시 - 빠르지만 신뢰도 낮음)
 */
function isPremiumProjectCached(projectId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const storage = localStorage.getItem(PREMIUM_STORAGE_KEY);
    if (!storage) return false;
    
    const premiumProjects: PremiumStorage = JSON.parse(storage);
    return !!premiumProjects[projectId];
  } catch (error) {
    console.error('캐시 확인 오류:', error);
    return false;
  }
}

/**
 * 프로젝트를 프리미엄으로 등록 (DB에 저장, localStorage는 캐시)
 */
export async function setPremiumProject(projectId: string, code: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    // 1. DB에 프리미엄 상태 저장 (신뢰할 수 있는 소스)
    const response = await fetch(`/api/v1/wedding-editor/${projectId}/premium`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) {
      const errorResult: ApiResponse = await response.json().catch(() => ({ success: false, code: 'UNKNOWN', message: 'DB 저장 실패' }));
      console.error('DB 저장 실패:', errorResult.message);
      return false;
    }
    
    // 2. localStorage 캐시 업데이트 (빠른 접근용)
    setPremiumProjectCache(projectId, code);
    
    return true;
  } catch (error) {
    console.error('프리미엄 상태 저장 오류:', error);
    return false;
  }
}

/**
 * localStorage 캐시 업데이트 (내부 함수)
 */
function setPremiumProjectCache(projectId: string, code: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const storage = localStorage.getItem(PREMIUM_STORAGE_KEY);
    const premiumProjects: PremiumStorage = storage ? JSON.parse(storage) : {};
    
    premiumProjects[projectId] = {
      code,
      unlockedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(PREMIUM_STORAGE_KEY, JSON.stringify(premiumProjects));
  } catch (error) {
    console.error('캐시 저장 오류:', error);
  }
}

/**
 * 특정 프로젝트의 프리미엄 정보 조회
 */
export function getPremiumInfo(projectId: string): PremiumProject | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const storage = localStorage.getItem(PREMIUM_STORAGE_KEY);
    if (!storage) return null;
    
    const premiumProjects: PremiumStorage = JSON.parse(storage);
    const info = premiumProjects[projectId];
    
    if (!info) return null;
    
    return {
      projectId,
      code: info.code,
      unlockedAt: info.unlockedAt,
    };
  } catch (error) {
    console.error('프리미엄 정보 조회 오류:', error);
    return null;
  }
}

/**
 * 모든 프리미엄 프로젝트 목록 조회
 */
export function getAllPremiumProjects(): PremiumProject[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const storage = localStorage.getItem(PREMIUM_STORAGE_KEY);
    if (!storage) return [];
    
    const premiumProjects: PremiumStorage = JSON.parse(storage);
    
    return Object.entries(premiumProjects).map(([projectId, info]) => ({
      projectId,
      code: info.code,
      unlockedAt: info.unlockedAt,
    }));
  } catch (error) {
    console.error('프리미엄 프로젝트 목록 조회 오류:', error);
    return [];
  }
}

/**
 * localStorage 캐시 제거 (내부 함수)
 */
function removePremiumProjectCache(projectId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const storage = localStorage.getItem(PREMIUM_STORAGE_KEY);
    if (!storage) return;
    
    const premiumProjects: PremiumStorage = JSON.parse(storage);
    delete premiumProjects[projectId];
    
    localStorage.setItem(PREMIUM_STORAGE_KEY, JSON.stringify(premiumProjects));
  } catch (error) {
    console.error('캐시 제거 오류:', error);
  }
}

/**
 * 특정 프로젝트의 프리미엄 상태 제거 (테스트용 - DB에서도 제거)
 */
export async function removePremiumProject(projectId: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    // DB에서 제거
    const response = await fetch(`/api/v1/wedding-editor/${projectId}/premium`, {
      method: 'DELETE',
    });
    
    // 캐시도 제거
    removePremiumProjectCache(projectId);
    
    return response.ok;
  } catch (error) {
    console.error('프리미엄 상태 제거 오류:', error);
    return false;
  }
}
