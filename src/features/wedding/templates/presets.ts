// features/wedding/templates/presets.ts
import { Block, CoupleInfo, WeddingDate, MapInfo, AccountInfo, DDayContent, GlobalTheme } from "@/shared/types/block";

// 테마 정의
export const THEME_SIMPLE: GlobalTheme = {
  backgroundColor: '#fafaf9', // Stone 50
  fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
  primaryColor: '#576b53', // Sage Green
};

export const THEME_PHOTO: GlobalTheme = {
  backgroundColor: '#ffffff',
  fontFamily: 'var(--font-playfair), Georgia, serif',
  primaryColor: '#a16207', // Yellow 700 (Gold-ish)
};

export const THEME_CLASSIC: GlobalTheme = {
  backgroundColor: '#f5f5f4', // Stone 100
  fontFamily: 'var(--font-playfair), Georgia, serif',
  primaryColor: '#1c1917', // Stone 900
};

export const THEME_MINIMAL: GlobalTheme = {
  backgroundColor: '#ffffff',
  fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
  primaryColor: '#000000',
};

// 1. 모던 심플 (텍스트 위주, 깔끔한 느낌)
export const PRESET_SIMPLE: Block[] = [
  { 
    id: 'simple-1', 
    type: 'text', 
    content: 'THE WEDDING OF', 
    styles: { variant: 'simple-intro' }
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
    } as CoupleInfo,
    styles: { variant: 'default' }
  },
  { 
    id: 'simple-3', 
    type: 'image', 
    content: '',
    styles: { variant: 'full' }
  },
  { 
    id: 'simple-7', 
    type: 'text', 
    content: '서로가 마주보며 다져온 사랑을\n이제 함께 한 곳을 바라보며\n걸어갈 수 있는 큰 사랑으로 키우고자 합니다.\n저희 두 사람이 사랑의 이름으로\n지켜나갈 수 있게 앞날을 축복해 주시면\n그 마음 평생 잊지 않겠습니다.', 
    styles: { variant: 'simple-body' }
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
    id: 'simple-dday',
    type: 'dday',
    content: { 
      weddingDateTime: '', 
      title: '결혼식까지' 
    } as DDayContent
  },
  { 
    id: 'simple-6', 
    type: 'map', 
    content: { 
      placeName: '', 
      address: '', 
      latitude: undefined, 
      longitude: undefined 
    } as MapInfo
  },
  { 
    id: 'simple-5', 
    type: 'account', 
    content: {
      groomAccount: '',
      groomAccountVisible: true,
      groomFatherAccount: '',
      groomFatherAccountVisible: true,
      groomMotherAccount: '',
      groomMotherAccountVisible: true,
      brideAccount: '',
      brideAccountVisible: true,
      brideFatherAccount: '',
      brideFatherAccountVisible: true,
      brideMotherAccount: '',
      brideMotherAccountVisible: true,
    } as AccountInfo
  },
  {
    id: 'simple-guestbook',
    type: 'guestbook',
    content: {},
    styles: { variant: 'simple' }
  },
  {
    id: 'simple-rsvp',
    type: 'rsvp',
    content: { message: '참석 여부를 알려주시면\n감사하겠습니다.', buttonText: '참석 의사 전달하기' },
    styles: { variant: 'simple' }
  },
];

// 2. 포토 에세이 (이미지 위주, 부드러운 느낌)
export const PRESET_PHOTO: Block[] = [
  { 
    id: 'photo-1', 
    type: 'image', 
    content: '',
    styles: { variant: 'rounded' } 
  },
  { 
    id: 'photo-2', 
    type: 'text', 
    content: 'Wedding Day', 
    styles: { variant: 'photo-label' }
  },
  { 
    id: 'photo-2-1', 
    type: 'text', 
    content: '우리, 사랑으로 물들다', 
    styles: { variant: 'photo-title' }
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
    } as CoupleInfo,
    styles: { variant: 'modern' }
  },
  { 
    id: 'photo-8', 
    type: 'image_grid', 
    content: '' 
  },
  { 
    id: 'photo-4', 
    type: 'date', 
    content: { 
      year: '', 
      month: '', 
      day: '', 
      time: '' 
    } as WeddingDate,
    styles: { variant: 'circle' }
  },
  { 
    id: 'photo-sub-img', 
    type: 'image', 
    content: '',
    styles: { variant: 'rounded' }
  },
  { 
    id: 'photo-6', 
    type: 'map', 
    content: { 
      placeName: '', 
      address: '', 
      latitude: undefined, 
      longitude: undefined 
    } as MapInfo,
    styles: { variant: 'rounded' }
  },
  { 
    id: 'photo-5', 
    type: 'account', 
    content: {
      groomAccount: '',
      groomAccountVisible: true,
      groomFatherAccount: '',
      groomFatherAccountVisible: true,
      groomMotherAccount: '',
      groomMotherAccountVisible: true,
      brideAccount: '',
      brideAccountVisible: true,
      brideFatherAccount: '',
      brideFatherAccountVisible: true,
      brideMotherAccount: '',
      brideMotherAccountVisible: true,
    } as AccountInfo
  },
  {
    id: 'photo-guestbook',
    type: 'guestbook',
    content: {},
    styles: { variant: 'card', color: '#a16207' }
  },
  {
    id: 'photo-rsvp',
    type: 'rsvp',
    content: { message: '소중한 발걸음\n기다리겠습니다.', buttonText: '참석 정보 등록' },
    styles: { variant: 'photo' }
  },
];

// 3. 클래식 전통 (정중한 느낌, 세로쓰기 등)
export const PRESET_CLASSIC: Block[] = [
  { 
    id: 'classic-1', 
    type: 'text', 
    content: '초 대 합 니 다', 
    styles: { variant: 'classic-intro' }
  },
  { 
    id: 'classic-main-img', 
    type: 'image', 
    content: '',
    styles: { variant: 'card' }
  },
  { 
    id: 'classic-2', 
    type: 'text', 
    content: '두 사람이 사랑으로 하나되는 날\n함께 자리하시어 축복해 주시면\n더없는 기쁨으로 간직하겠습니다.', 
    styles: { variant: 'classic-body' }
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
    } as CoupleInfo,
    styles: { variant: 'vertical' }
  },
  { 
    id: 'classic-4', 
    type: 'date', 
    content: { 
      year: '', 
      month: '', 
      day: '', 
      time: '' 
    } as WeddingDate,
    styles: { variant: 'classic' }
  },
  { 
    id: 'classic-6', 
    type: 'map', 
    content: { 
      placeName: '', 
      address: '', 
      latitude: undefined, 
      longitude: undefined 
    } as MapInfo
  },
  { 
    id: 'classic-5', 
    type: 'account', 
    content: {
      groomAccount: '',
      groomAccountVisible: true,
      groomFatherAccount: '',
      groomFatherAccountVisible: true,
      groomMotherAccount: '',
      groomMotherAccountVisible: true,
      brideAccount: '',
      brideAccountVisible: true,
      brideFatherAccount: '',
      brideFatherAccountVisible: true,
      brideMotherAccount: '',
      brideMotherAccountVisible: true,
    } as AccountInfo
  },
  {
    id: 'classic-guestbook', // Add guestbook to classic (was missing?) Wait, let me check if it was missing.
    type: 'guestbook',
    content: {},
    styles: { variant: 'classic' }
  },
  {
    id: 'classic-rsvp',
    type: 'rsvp',
    content: { message: '참석하시어 자리를\n빛내주시면 감사하겠습니다.', buttonText: '참석 의사 전달하기' },
    styles: { variant: 'classic' }
  },
];

// 4. 미니멀 (간결함의 극치, 큰 텍스트)
export const PRESET_MINIMAL: Block[] = [
  { 
    id: 'minimal-date-top', 
    type: 'text', 
    content: '2024 . 12 . 25', 
    styles: { variant: 'minimal-label' }
  },
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
    } as CoupleInfo,
    styles: { variant: 'modern' }
  },
  { 
    id: 'minimal-main-img', 
    type: 'image', 
    content: '',
    styles: { variant: 'minimal-full' }
  },
  { 
    id: 'minimal-2', 
    type: 'text', 
    content: 'We are getting married.', 
    styles: { variant: 'minimal-title' }
  },
  { 
    id: 'minimal-4', 
    type: 'map', 
    content: { 
      placeName: '', 
      address: '', 
      latitude: undefined, 
      longitude: undefined 
    } as MapInfo,
    styles: { variant: 'minimal' }
  },
  { 
    id: 'minimal-3', 
    type: 'account', 
    content: {
      groomAccount: '',
      groomAccountVisible: true,
      groomFatherAccount: '',
      groomFatherAccountVisible: true,
      groomMotherAccount: '',
      groomMotherAccountVisible: true,
      brideAccount: '',
      brideAccountVisible: true,
      brideFatherAccount: '',
      brideFatherAccountVisible: true,
      brideMotherAccount: '',
      brideMotherAccountVisible: true,
    } as AccountInfo
  },
  {
    id: 'minimal-guestbook',
    type: 'guestbook',
    content: {},
    styles: { variant: 'minimal' }
  },
  {
    id: 'minimal-dday',
    type: 'dday',
    content: { 
      weddingDateTime: '', 
      title: '결혼식까지' 
    } as DDayContent,
    styles: { variant: 'modern' }
  },
  {
    id: 'minimal-rsvp',
    type: 'rsvp',
    content: { message: '소중한 발걸음\n기다리겠습니다.', buttonText: '참석 여부 전달' },
    styles: { variant: 'minimal' }
  },
];

// 5. 템플릿 목록
export const TEMPLATES = [
  { id: 'simple', name: '모던 베이직', description: '가장 기본적인 깔끔한 디자인', data: PRESET_SIMPLE, theme: THEME_SIMPLE },
  { id: 'photo', name: '로맨틱 포토', description: '사진이 돋보이는 감성 디자인', data: PRESET_PHOTO, theme: THEME_PHOTO },
  { id: 'classic', name: '노블 클래식', description: '격식 있고 우아한 전통 스타일', data: PRESET_CLASSIC, theme: THEME_CLASSIC },
  { id: 'minimal', name: '어반 미니멀', description: '군더더기 없는 세련된 스타일', data: PRESET_MINIMAL, theme: THEME_MINIMAL },
];

// 6. 블록 타입별 기본 content 생성 헬퍼 함수
import { BlockType } from '@/shared/types/block';

export function createDefaultBlockContent(type: BlockType): Block['content'] {
  switch (type) {
    case 'text': return '';
    case 'image': return '';
    case 'image_grid': return '';
    case 'couple_info':
      return {
        groomName: '', groomFather: '', groomMother: '',
        brideName: '', brideFather: '', brideMother: ''
      } as CoupleInfo;
    case 'date':
      return { year: '', month: '', day: '', time: '' } as WeddingDate;
    case 'map':
      return {
        placeName: '', address: '', detailAddress: '',
        latitude: undefined, longitude: undefined
      } as MapInfo;
    case 'account':
      return {
        groomAccount: '', groomAccountVisible: true,
        groomFatherAccount: '', groomFatherAccountVisible: true,
        groomMotherAccount: '', groomMotherAccountVisible: true,
        brideAccount: '', brideAccountVisible: true,
        brideFatherAccount: '', brideFatherAccountVisible: true,
        brideMotherAccount: '', brideMotherAccountVisible: true,
      } as AccountInfo;
    case 'guestbook': return {} as Record<string, never>;
    case 'dday':
      return { weddingDateTime: '', title: '결혼식까지' } as DDayContent;
    case 'rsvp':
      return { message: '', buttonText: '' };
    default: return '';
  }
}

// 블록 타입별 한글 이름
export const BLOCK_TYPE_NAMES: Record<BlockType, string> = {
  text: '텍스트',
  image: '이미지',
  image_grid: '그리드 이미지',
  couple_info: '신랑신부 정보',
  date: '날짜',
  map: '지도',
  account: '계좌번호',
  guestbook: '방명록',
  dday: 'D-Day',
  rsvp: '참석 의사 전달',
};
