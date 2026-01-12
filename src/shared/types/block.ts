// 1. 우리가 지원할 블록의 종류
export type BlockType = 'text' | 'image' | 'couple_info' | 'date' | 'venue';

// 1-1. 글로벌 테마 타입
export interface GlobalTheme {
  backgroundColor: string;
  fontFamily: string;
  primaryColor: string;
}

// 2. 신랑신부 정보 데이터 구조
export interface CoupleInfo {
  groomName: string;
  groomFather: string;
  groomMother: string;
  brideName: string;
  brideFather: string;
  brideMother: string;
}

// 3. 예식 날짜 데이터 구조
export interface WeddingDate {
  year: string;
  month: string;
  day: string;
  time?: string; // 예: "오후 1시"
}

// 4. 예식장 정보 데이터 구조
export interface VenueInfo {
  name: string;
  address: string;
  hall?: string; // 예: "3층 그랜드홀"
}

// 5. 블록 하나가 가져야 할 정보
export interface Block {
  id: string;        // 고유 ID (순서 바꿀 때 필수)
  type: BlockType;   // 텍스트, 이미지 등 블록의 종류 
  content: string | CoupleInfo | WeddingDate | VenueInfo;   // 내용 (타입에 따라 다름)
  
  // 6. 스타일 옵션 (선택 사항)
  styles?: {
    color?: string;
    backgroundColor?: string;
    align?: 'left' | 'center' | 'right';
    fontSize?: string; // '14px', '20px' 등
  };
}