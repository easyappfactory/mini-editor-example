// features/wedding/templates/presets.ts
import { Block, CoupleInfo, WeddingDate, VenueInfo, GlobalTheme } from "@/shared/types/block";

// 테마 정의
export const THEME_SIMPLE: GlobalTheme = {
  backgroundColor: '#ffffff',
  fontFamily: 'system-ui, sans-serif',
  primaryColor: '#6366f1', // 보라색
};

export const THEME_PHOTO: GlobalTheme = {
  backgroundColor: '#fef3f2',
  fontFamily: 'Georgia, serif',
  primaryColor: '#f43f5e', // 핑크
};

export const THEME_CLASSIC: GlobalTheme = {
  backgroundColor: '#fafaf9',
  fontFamily: 'Georgia, serif',
  primaryColor: '#78716c', // 갈색
};

export const THEME_MINIMAL: GlobalTheme = {
  backgroundColor: '#ffffff',
  fontFamily: 'system-ui, sans-serif',
  primaryColor: '#171717', // 검정
};

// 1. 모던 심플 (텍스트 위주, 깔끔한 느낌)
export const PRESET_SIMPLE: Block[] = [
  { 
    id: 'simple-1', 
    type: 'text', 
    content: 'The Wedding Of', 
    styles: { align: 'center', fontSize: '14px', color: '#999' } 
  },
  { 
    id: 'simple-2', 
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
    id: 'simple-3', 
    type: 'image', 
    content: '' 
  },
  { 
    id: 'simple-4', 
    type: 'date', 
    content: { 
      year: '', 
      month: '', 
      day: '', 
      time: '' 
    } as WeddingDate
  },
  { 
    id: 'simple-5', 
    type: 'venue', 
    content: { 
      name: '', 
      hall: '', 
      address: '' 
    } as VenueInfo
  },
  { 
    id: 'simple-6', 
    type: 'text', 
    content: '소중한 날에 초대합니다', 
    styles: { align: 'center', fontSize: '16px', color: '#666' } 
  },
];

// 2. 포토 에세이 (이미지 위주)
export const PRESET_PHOTO: Block[] = [
  { 
    id: 'photo-1', 
    type: 'image', 
    content: '' 
  },
  { 
    id: 'photo-2', 
    type: 'text', 
    content: '우리 결혼합니다 💒', 
    styles: { align: 'center', fontSize: '24px', color: '#333' } 
  },
  { 
    id: 'photo-3', 
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
    id: 'photo-4', 
    type: 'date', 
    content: { 
      year: '', 
      month: '', 
      day: '', 
      time: '' 
    } as WeddingDate
  },
  { 
    id: 'photo-5', 
    type: 'venue', 
    content: { 
      name: '', 
      hall: '', 
      address: '' 
    } as VenueInfo
  },
];

// 3. 클래식 전통 (정중한 느낌)
export const PRESET_CLASSIC: Block[] = [
  { 
    id: 'classic-1', 
    type: 'text', 
    content: '결혼합니다', 
    styles: { align: 'center', fontSize: '28px', color: '#2d2d2d' } 
  },
  { 
    id: 'classic-2', 
    type: 'text', 
    content: '두 사람이 사랑으로 하나되는 날\n함께 자리하시어 축복해 주시면 감사하겠습니다', 
    styles: { align: 'center', fontSize: '14px', color: '#666' } 
  },
  { 
    id: 'classic-3', 
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
    id: 'classic-4', 
    type: 'date', 
    content: { 
      year: '', 
      month: '', 
      day: '', 
      time: '' 
    } as WeddingDate
  },
  { 
    id: 'classic-5', 
    type: 'venue', 
    content: { 
      name: '', 
      hall: '', 
      address: '' 
    } as VenueInfo
  },
  { 
    id: 'classic-6', 
    type: 'image', 
    content: '' 
  },
];

// 4. 미니멀 (간결함의 극치)
export const PRESET_MINIMAL: Block[] = [
  { 
    id: 'minimal-1', 
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
    id: 'minimal-2', 
    type: 'date', 
    content: { 
      year: '', 
      month: '', 
      day: '', 
      time: '' 
    } as WeddingDate
  },
  { 
    id: 'minimal-3', 
    type: 'venue', 
    content: { 
      name: '', 
      hall: '', 
      address: '' 
    } as VenueInfo
  },
];

// 5. 템플릿 목록 (UI에서 map 돌리기 용)
export const TEMPLATES = [
  { id: 'simple', name: ' 모던', description: '깔끔하고 현대적인 디자인', data: PRESET_SIMPLE, theme: THEME_SIMPLE },
  { id: 'photo', name: '포토북', description: '사진을 강조한 스타일', data: PRESET_PHOTO, theme: THEME_PHOTO },
  { id: 'classic', name: '클래식', description: '정중하고 격식있는 느낌', data: PRESET_CLASSIC, theme: THEME_CLASSIC },
  { id: 'minimal', name: '미니멀', description: '꼭 필요한 것만 담은 간결함', data: PRESET_MINIMAL, theme: THEME_MINIMAL },
];

