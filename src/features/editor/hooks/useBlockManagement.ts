// features/editor/hooks/useBlockManagement.ts
/**
 * Core Editor의 블록 관리 로직
 * - 블록 추가, 삭제, 이동, 업데이트 등의 CRUD 작업
 * - 청첩장뿐만 아니라 다른 서비스(뉴스레터, 랜딩페이지 등)에서도 재사용 가능
 */

import { useBlockStore } from '@/store/useBlockStore';
import { Block } from '@/shared/types/block';

export function useBlockManagement() {
  const { blocks, setBlocks, updateBlockContent } = useBlockStore();

  /**
   * 블록 추가 (미래 기능)
   */
  const addBlock = (block: Block, position?: number) => {
    const newBlocks = position !== undefined
      ? [...blocks.slice(0, position), block, ...blocks.slice(position)]
      : [...blocks, block];
    setBlocks(newBlocks);
  };

  /**
   * 블록 삭제 (미래 기능)
   */
  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  /**
   * 블록 이동 (드래그 앤 드롭)
   */
  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, removed);
    setBlocks(newBlocks);
  };

  /**
   * 블록 내용 업데이트
   */
  const updateBlock = (id: string, content: Block['content']) => {
    updateBlockContent(id, content);
  };

  return {
    blocks,
    addBlock,
    deleteBlock,
    moveBlock,
    updateBlock,
  };
}

