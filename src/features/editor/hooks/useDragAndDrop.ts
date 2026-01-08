// features/editor/hooks/useDragAndDrop.ts
/**
 * 드래그 앤 드롭 로직을 분리한 Hook
 * dnd-kit 라이브러리 의존성을 캡슐화
 */

import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Block } from '@/shared/types/block';

export function useDragAndDrop(blocks: Block[], onReorder: (newBlocks: Block[]) => void) {
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      
      // 배열 순서 바꾸기
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      onReorder(newBlocks);
    }
  };

  return {
    handleDragEnd,
  };
}

