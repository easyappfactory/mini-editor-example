// features/wedding/blocks/TextBlock/useTextBlock.ts
/**
 * Headless UI Hook: 텍스트 블록 로직
 */

import { Block } from '@/shared/types/block';

export function useTextBlock(block: Block) {
  // 스타일이 없으면 기본값 적용
  const { align = 'center', color = '#000', fontSize = '16px' } = block.styles || {};
  
  // 텍스트 내용 (string만 처리)
  const content = typeof block.content === 'string' ? block.content : '';
  
  const styles = {
    textAlign: align as 'left' | 'center' | 'right',
    color: color,
    fontSize: fontSize,
    whiteSpace: 'pre-wrap' as const, // 줄바꿈 적용
  };
  
  return {
    content,
    styles,
  };
}

