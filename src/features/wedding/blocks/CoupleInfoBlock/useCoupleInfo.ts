// features/wedding/blocks/CoupleInfoBlock/useCoupleInfo.ts
/**
 * Headless UI Hook: 신랑신부 정보 로직
 * UI와 로직을 분리하여 재사용성 향상
 */

import { CoupleInfo } from '@/shared/types/block';

export function useCoupleInfo(content: CoupleInfo) {
  // 데이터가 비어있으면 예시 데이터 표시
  const groomName = content.groomName || '김철수';
  const groomFather = content.groomFather || '김00';
  const groomMother = content.groomMother || '박00';
  const brideName = content.brideName || '이영희';
  const brideFather = content.brideFather || '이00';
  const brideMother = content.brideMother || '최00';

  return {
    groom: {
      name: groomName,
      father: groomFather,
      mother: groomMother,
    },
    bride: {
      name: brideName,
      father: brideFather,
      mother: brideMother,
    },
  };
}

