// features/wedding/blocks/DateBlock/useDateBlock.ts
/**
 * Headless UI Hook: 예식 날짜 로직
 */

import { WeddingDate } from '@/shared/types/block';

export function useDateBlock(content: WeddingDate) {
  // 데이터가 비어있으면 예시 데이터 표시
  const year = content.year || '2026';
  const month = content.month || '1';
  const day = content.day || '7';
  const time = content.time || '오후 1시';
  
  // 날짜 포맷팅
  const formattedDate = `${year}년 ${month}월 ${day}일`;
  
  return {
    formattedDate,
    time,
    raw: { year, month, day },
  };
}

