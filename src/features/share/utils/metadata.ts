// features/share/utils/metadata.ts
import { Block, CoupleInfo, WeddingDate } from '@/shared/types/block';

/**
 * 블록 데이터에서 메타데이터 정보 추출
 */
export function extractMetadataFromBlocks(blocks: Block[]) {
  let title = '모바일 청첩장';
  let description = '소중한 날에 초대합니다.';
  let imageUrl = '';

  // 각 블록에서 정보 추출
  blocks.forEach((block) => {
    if (block.type === 'couple_info' && typeof block.content !== 'string') {
      const info = block.content as CoupleInfo;
      if (info.groomName && info.brideName) {
        title = `${info.groomName} ❤️ ${info.brideName}의 결혼식`;
      }
    }
    
    if (block.type === 'date' && typeof block.content !== 'string') {
      const date = block.content as WeddingDate;
      if (date.year && date.month && date.day) {
        description = `${date.year}년 ${date.month}월 ${date.day}일 ${date.time || ''} - 소중한 날에 초대합니다.`;
      }
    }
    
    if (block.type === 'image' && typeof block.content === 'string' && block.content) {
      // 첫 번째 이미지를 썸네일로 사용
      if (!imageUrl) {
        imageUrl = block.content;
      }
    }
  });

  return {
    title,
    description,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&w=800&q=80',
  };
}

