// features/wedding/blocks/ImageBlock/useImageBlock.ts
/**
 * Headless UI Hook: 이미지 블록 로직
 */

export function useImageBlock(content: string | unknown) {
  // 데이터가 비어있으면 예시 이미지 표시
  const imageUrl = (typeof content === 'string' && content) 
    ? content 
    : 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&w=800&q=80';
  
  const hasImage = typeof content === 'string' && content.length > 0;
  
  return {
    imageUrl,
    hasImage,
  };
}

