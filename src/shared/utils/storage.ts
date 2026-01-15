import { Block, GlobalTheme } from "@/shared/types/block";

export interface ProjectData {
  title?: string; // 프로젝트 제목 (옵션)
  blocks: Block[];
  theme: GlobalTheme;
}

export interface ProjectListItem {
  id: string;
  title: string;
  created_at: string;
  blocks: Block[];
  theme: GlobalTheme;
}

// Storage 인터페이스 (나중에 DB로 교체 가능)
export interface ProjectStorage {
  create(blocks: Block[], theme: GlobalTheme, title?: string): Promise<string> | string;
  update(id: string, blocks: Block[], theme: GlobalTheme, title?: string): Promise<boolean> | Promise<void> | void;
  load(id: string): Promise<ProjectData | null> | ProjectData | null;
  exists(id: string): Promise<boolean> | boolean;
  list(): Promise<ProjectListItem[]> | ProjectListItem[];
}

// 로컬스토리지 구현
class LocalStorageProjectStorage implements ProjectStorage {
  private getKey(id: string): string {
    return `wedding_${id}`;
  }

  create(blocks: Block[], theme: GlobalTheme, title?: string): string {
    const id = Math.random().toString(36).substr(2, 9);
    this.update(id, blocks, theme, title);
    return id;
  }

  update(id: string, blocks: Block[], theme: GlobalTheme, title?: string): void {
    const projectData: ProjectData = {
      title,
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

  list(): ProjectListItem[] {
    // 로컬스토리지 구현에서는 모든 키를 순회하여 프로젝트 목록을 반환
    const projects: ProjectListItem[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wedding_')) {
        const id = key.replace('wedding_', '');
        const data = this.load(id);
        if (data) {
          // 제목 추출 로직 (저장된 제목이 없으면 블록에서 추출)
          const title = data.title || extractTitleFromBlocks(data.blocks);
          projects.push({
            id,
            title,
            created_at: new Date().toISOString(), // 로컬스토리지에는 날짜가 없으므로 현재 시간
            blocks: data.blocks,
            theme: data.theme
          });
        }
      }
    }
    return projects;
  }
}

// 제목 추출 헬퍼 함수
function extractTitleFromBlocks(blocks: Block[]): string {
  // CoupleInfoBlock에서 신랑, 신부 이름 찾기
  const coupleBlock = blocks.find(b => b.type === 'couple_info');
  if (coupleBlock && typeof coupleBlock.content === 'object' && coupleBlock.content !== null && 'groomName' in coupleBlock.content) {
    const groom = coupleBlock.content.groomName || '';
    const bride = coupleBlock.content.brideName || '';
    if (groom || bride) {
      return `${groom} & ${bride}의 청첩장`;
    }
  }

  // TextBlock에서 첫 번째 텍스트 찾기
  const textBlock = blocks.find(b => b.type === 'text');
  if (textBlock && typeof textBlock.content === 'string') {
    return textBlock.content.substring(0, 20);
  }

  return '제목 없는 청첩장';
}

// 싱글톤 인스턴스 (나중에 DB 구현으로 교체 가능)
export const projectStorage: ProjectStorage = new LocalStorageProjectStorage();

// 편의 함수들 (기존 API 호환성 유지)
// 주의: 이 함수들은 localStorage를 사용합니다. 서버 저장을 원하면 apiClient를 사용하세요.
export const createProject = (blocks: Block[], theme: GlobalTheme, title?: string): string => {
  const result = projectStorage.create(blocks, theme, title);
  // LocalStorageProjectStorage는 동기 함수를 반환하므로 타입 단언
  return typeof result === 'string' ? result : result as unknown as string;
};

export const updateProject = (id: string, blocks: Block[], theme: GlobalTheme, title?: string): void => {
  const result = projectStorage.update(id, blocks, theme, title);
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
