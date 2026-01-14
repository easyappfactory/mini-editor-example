// features/share/utils/metadata.ts
import { Block, CoupleInfo, WeddingDate } from '@/shared/types/block';

/**
 * 이미지 URL을 절대 URL로 변환합니다.
 * @param imageUrl 원본 이미지 URL (상대 경로 또는 절대 경로)
 * @param baseUrl 기본 URL (예: https://example.com)
 * @returns 절대 URL
 */
export function toAbsoluteImageUrl(imageUrl: string, baseUrl: string): string {
  // 이미 절대 URL인 경우 그대로 반환
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // data URL인 경우 그대로 반환
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // 상대 경로인 경우 baseUrl과 결합
  // baseUrl 끝에 /가 없으면 추가
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  // imageUrl 앞에 /가 없으면 추가
  const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${base}${path}`;
}

/**
 * 블록 데이터에서 메타데이터 정보 추출
 * @param blocks 블록 배열
 * @param baseUrl 기본 URL (이미지 URL을 절대 경로로 변환하기 위해 필요)
 */
export function extractMetadataFromBlocks(blocks: Block[], baseUrl?: string) {
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

  // 기본 이미지 설정
  const defaultImageUrl = 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&w=800&q=80';
  const finalImageUrl = imageUrl || defaultImageUrl;

  // baseUrl이 제공된 경우 이미지 URL을 절대 URL로 변환
  const absoluteImageUrl = baseUrl 
    ? toAbsoluteImageUrl(finalImageUrl, baseUrl)
    : finalImageUrl;

  return {
    title,
    description,
    imageUrl: absoluteImageUrl,
  };
}

