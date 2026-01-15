// store/useBlockStore.ts
import { create } from 'zustand';
import { Block, GlobalTheme } from '@/shared/types/block';
import { PRESET_SIMPLE, THEME_SIMPLE } from '@/features/wedding/templates/presets';

// 초기 데이터: 모던 심플 템플릿 사용
const INITIAL_BLOCKS: Block[] = JSON.parse(JSON.stringify(PRESET_SIMPLE));

interface BlockState {
  title: string;
  blocks: Block[];
  theme: GlobalTheme;
  updateBlockContent: (id: string, newContent: Block['content']) => void;
  setBlocks: (newBlocks: Block[]) => void; // 순서 변경용
  setTheme: (newTheme: GlobalTheme) => void; // 테마 변경용
  setTitle: (newTitle: string) => void; // 제목 변경용
  reset: () => void; // 초기 상태로 리셋
}

// 기본 테마: 모던 심플 테마 사용
const DEFAULT_THEME: GlobalTheme = THEME_SIMPLE;

export const useBlockStore = create<BlockState>((set) => ({
  title: '', // 초기 제목 없음
  blocks: INITIAL_BLOCKS, // 실제(초기) 데이터
  theme: DEFAULT_THEME, // 기본 테마

  // 1. 내용 수정하기 (불변성 유지)
  updateBlockContent: (id, newContent) => 
    set((state) => ({
        // 배열을 돌면서 ID가 같은 놈을 찾아서 content만 갈아끼움 (불변성 유지)
      blocks: state.blocks.map((block) => 
        block.id === id ? { ...block, content: newContent } : block
      ),
    })),

  // 2. 블록 통째로 교체하기 (드래그 앤 드롭 후 순서 바뀐 배열 저장)
  setBlocks: (newBlocks) => set({ blocks: newBlocks }),

  // 3. 테마 변경하기
  setTheme: (newTheme) => set({ theme: newTheme }),

  // 4. 제목 변경하기
  setTitle: (newTitle) => set({ title: newTitle }),

  // 5. 초기 상태로 리셋하기
  reset: () => set({ 
    title: '',
    blocks: JSON.parse(JSON.stringify(PRESET_SIMPLE)), 
    theme: THEME_SIMPLE 
  }),
}));
