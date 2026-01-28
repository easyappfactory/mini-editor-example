import { DDayContent } from '@/shared/types/block';

export function useDDayBlock(content: DDayContent) {
  const weddingDateTime = content.weddingDateTime || '2026-06-15 14:00:00';
  const title = content.title || '결혼식까지';

  return {
    weddingDateTime,
    title,
  };
}
