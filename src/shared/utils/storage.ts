import { Block, GlobalTheme } from "@/shared/types/block";

export interface ProjectData {
  blocks: Block[];
  theme: GlobalTheme;
}

// Storage 인터페이스 (나중에 DB로 교체 가능)
export interface ProjectStorage {
  create(blocks: Block[], theme: GlobalTheme): Promise<string> | string;
  update(id: string, blocks: Block[], theme: GlobalTheme): Promise<boolean> | Promise<void> | void;
  load(id: string): Promise<ProjectData | null> | ProjectData | null;
  exists(id: string): Promise<boolean> | boolean;
}

// 로컬스토리지 구현
class LocalStorageProjectStorage implements ProjectStorage {
  private getKey(id: string): string {
    return `wedding_${id}`;
  }

  create(blocks: Block[], theme: GlobalTheme): string {
    const id = Math.random().toString(36).substr(2, 9);
    this.update(id, blocks, theme);
    return id;
  }

  update(id: string, blocks: Block[], theme: GlobalTheme): void {
    const projectData: ProjectData = {
      blocks,
      theme
    };
    localStorage.setItem(this.getKey(id), JSON.stringify(projectData));
  }

  load(id: string): ProjectData | null {
    const data = localStorage.getItem(this.getKey(id));
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    
    // 하위 호환성: 이전에 블록만 저장한 경우
    if (Array.isArray(parsed)) {
      return {
        blocks: parsed,
        theme: {
          backgroundColor: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          primaryColor: '#6366f1'
        }
      };
    }
    
    return parsed as ProjectData;
  }

  exists(id: string): boolean {
    return localStorage.getItem(this.getKey(id)) !== null;
  }
}

// 싱글톤 인스턴스 (나중에 DB 구현으로 교체 가능)
export const projectStorage: ProjectStorage = new LocalStorageProjectStorage();

// 편의 함수들 (기존 API 호환성 유지)
// 주의: 이 함수들은 localStorage를 사용합니다. 서버 저장을 원하면 apiClient를 사용하세요.
export const createProject = (blocks: Block[], theme: GlobalTheme): string => {
  const result = projectStorage.create(blocks, theme);
  // LocalStorageProjectStorage는 동기 함수를 반환하므로 타입 단언
  return typeof result === 'string' ? result : result as unknown as string;
};

export const updateProject = (id: string, blocks: Block[], theme: GlobalTheme): void => {
  const result = projectStorage.update(id, blocks, theme);
  // LocalStorageProjectStorage는 동기 함수를 반환하므로 void
  if (result instanceof Promise) {
    throw new Error('updateProject는 동기 함수여야 합니다. apiClient.updateProject를 사용하세요.');
  }
};

export const loadProject = (id: string): ProjectData | null => {
  const result = projectStorage.load(id);
  // LocalStorageProjectStorage는 동기 함수를 반환하므로 타입 단언
  return result instanceof Promise ? null : result;
};

export const projectExists = (id: string): boolean => {
  const result = projectStorage.exists(id);
  // LocalStorageProjectStorage는 동기 함수를 반환하므로 타입 단언
  return result instanceof Promise ? false : result;
};

// 하위 호환성을 위한 함수 (deprecated)
export const saveProject = (blocks: Block[], theme: GlobalTheme): string => {
  return createProject(blocks, theme);
};
