// store/useBlockStore.ts
import { create } from 'zustand';
import { Block, CoupleInfo, WeddingDate, VenueInfo, GlobalTheme } from '@/shared/types/block';

// 초기 데이터 (빈 placeholder로 시작)
const INITIAL_BLOCKS: Block[] = [
  { id: 'b1', type: 'image', content: '' },
  { 
    id: 'b2', 
    type: 'couple_info', 
    content: {
      groomName: '',
      groomFather: '',
      groomMother: '',
      brideName: '',
      brideFather: '',
      brideMother: ''
    } as CoupleInfo
  },
  { 
    id: 'b3', 
    type: 'date', 
    content: {
      year: '',
      month: '',
      day: '',
      time: ''
    } as WeddingDate
  },
  {
    id: 'b4',
    type: 'venue',
    content: {
      name: '',
      hall: '',
      address: ''
    } as VenueInfo
  },
];

interface BlockState {
  blocks: Block[];
  theme: GlobalTheme;
  updateBlockContent: (id: string, newContent: string | CoupleInfo | WeddingDate | VenueInfo) => void;
  setBlocks: (newBlocks: Block[]) => void; // 순서 변경용
  setTheme: (newTheme: GlobalTheme) => void; // 테마 변경용
}

// 기본 테마
const DEFAULT_THEME: GlobalTheme = {
  backgroundColor: '#ffffff',
  fontFamily: 'system-ui, sans-serif',
  primaryColor: '#6366f1',
};

export const useBlockStore = create<BlockState>((set) => ({
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
}));