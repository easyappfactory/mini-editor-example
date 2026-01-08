// components/editor/SortableItem.tsx
'use client'; // dnd-kit은 브라우저 API를 쓰므로 필수

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  id: string;
  children: React.ReactNode;
}

export default function SortableItem({ id, children }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging // 드래그 중인지 여부 (스타일링용)
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // 드래그 중이면 반투명하게
    marginBottom: '10px',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center gap-3">
        
        {/* 드래그 핸들 (이 부분을 잡아야 움직임) */}
        <div {...listeners} className="cursor-move text-gray-400 hover:text-gray-600">
          ☰
        </div>

        {/* 실제 내용 (Input 등) */}
        <div className="flex-1">
          {children}
        </div>
        
      </div>
    </div>
  );
}