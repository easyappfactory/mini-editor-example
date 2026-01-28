// 1. 우리가 지원할 블록의 종류
export type BlockType = 'text' | 'image' | 'image_grid' | 'couple_info' | 'date' | 'map' | 'account' | 'guestbook' | 'dday';

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

// 4-1. 지도 정보 데이터 구조
export interface MapInfo {
  placeName: string; // 장소 이름 (예: "그랜드 웨딩홀")
  address?: string; // 주소 (선택)
  detailAddress?: string; // 상세 주소 (예: "3층 그랜드홀") - VenueBlock의 hall 대체
  latitude?: number; // 위도
  longitude?: number; // 경도
}

// 4-2. 계좌번호 정보 데이터 구조
export interface AccountInfo {
  groomAccount?: string; // 신랑 계좌번호
  groomAccountVisible?: boolean; // 신랑 계좌번호 표시 여부
  groomKakaoPayLink?: string; // 신랑 카카오페이 송금 링크
  groomFatherAccount?: string; // 신랑 아버지 계좌번호
  groomFatherAccountVisible?: boolean; // 신랑 아버지 계좌번호 표시 여부
  groomFatherKakaoPayLink?: string; // 신랑 아버지 카카오페이 송금 링크
  groomMotherAccount?: string; // 신랑 어머니 계좌번호
  groomMotherAccountVisible?: boolean; // 신랑 어머니 계좌번호 표시 여부
  groomMotherKakaoPayLink?: string; // 신랑 어머니 카카오페이 송금 링크
  brideAccount?: string; // 신부 계좌번호
  brideAccountVisible?: boolean; // 신부 계좌번호 표시 여부
  brideKakaoPayLink?: string; // 신부 카카오페이 송금 링크
  brideFatherAccount?: string; // 신부 아버지 계좌번호
  brideFatherAccountVisible?: boolean; // 신부 아버지 계좌번호 표시 여부
  brideFatherKakaoPayLink?: string; // 신부 아버지 카카오페이 송금 링크
  brideMotherAccount?: string; // 신부 어머니 계좌번호
  brideMotherAccountVisible?: boolean; // 신부 어머니 계좌번호 표시 여부
  brideMotherKakaoPayLink?: string; // 신부 어머니 카카오페이 송금 링크
}

// 4-3. 그리드 이미지 데이터 구조
export interface GridSlotData {
  id: string;
  imageSrc: string;
  crop: { x: number; y: number };
  zoom: number;
  croppedArea?: { x: number; y: number; width: number; height: number }; // 백분율 단위
  croppedAreaPixels?: { x: number; y: number; width: number; height: number }; // 픽셀 단위
}

export interface ImageGridContent {
  type: 'grid';
  templateId: string;
  slots: GridSlotData[];
}

// 4-4. D-Day 카운트다운 데이터 구조
export interface DDayContent {
  weddingDateTime: string; // YYYY-MM-DD HH:mm:ss 형태
  title?: string; // 커스텀 제목 (기본: "결혼식까지")
}

// 5. 블록 하나가 가져야 할 정보
export interface Block {
  id: string;        // 고유 ID (순서 바꿀 때 필수)
  type: BlockType;   // 텍스트, 이미지 등 블록의 종류 
  content: string | CoupleInfo | WeddingDate | MapInfo | AccountInfo | ImageGridContent | DDayContent | Record<string, never>;   // 내용 (타입에 따라 다름)
  
  // 6. 스타일 옵션 (선택 사항)
  styles?: {
    color?: string;
    backgroundColor?: string;
    align?: 'left' | 'center' | 'right';
    fontSize?: string; // '14px', '20px' 등
  };
}