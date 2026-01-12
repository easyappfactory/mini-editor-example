// features/wedding/blocks/VenueBlock/useVenueBlock.ts
/**
 * Headless UI Hook: 예식장 정보 로직
 */

import { VenueInfo } from '@/shared/types/block';

export function useVenueBlock(content: VenueInfo) {
  // 데이터가 비어있으면 예시 데이터 표시
  const name = content.name || '그랜드 웨딩홀';
  const hall = content.hall || '3층 그랜드홀';
  const address = content.address || '서울특별시 강남구 테헤란로 123';
  
  return {
    name,
    hall,
    address,
    hasHall: !!hall,
  };
}

