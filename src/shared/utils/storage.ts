import { Block, GlobalTheme } from "@/shared/types/block";

interface ProjectData {
  blocks: Block[];
  theme: GlobalTheme;
}

// 프로젝트 저장하기 (Create)
export const saveProject = (blocks: Block[], theme: GlobalTheme): string => {
  const id = Math.random().toString(36).substr(2, 9); // 랜덤 ID 생성 (예: 'x7z1a9')
  
  const projectData: ProjectData = {
    blocks,
    theme
  };
  
  // DB(로컬스토리지)에 저장: 키는 ID, 값은 프로젝트 데이터(JSON)
  localStorage.setItem(`wedding_${id}`, JSON.stringify(projectData));
  
  return id; // 생성된 ID 반환
};

// 프로젝트 불러오기 (Read)
export const loadProject = (id: string): ProjectData | null => {
  const data = localStorage.getItem(`wedding_${id}`);
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
};