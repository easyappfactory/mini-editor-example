// components/editor/SortableItem.tsx
'use client'; // dnd-kit은 브라우저 API를 쓰므로 필수

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  id: string;
  children: React.ReactNode;
  onDelete?: () => void;
}

export default function SortableItem({ id, children, onDelete }: Props) {
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
    <div ref={setNodeRef} style={style} {...attributes} suppressHydrationWarning>
      <div className="bg-white dark:bg-stone-900 p-3 sm:p-4 rounded-lg shadow border border-border flex items-center gap-2 sm:gap-3 transition-colors duration-200">
        
        {/* 드래그 핸들: 전체 높이 스트립으로 터치 영역 확대 (최소 56px, 모바일 터치 타깃) */}
        <div
          {...listeners}
          className="cursor-move text-muted-foreground hover:text-foreground shrink-0 transition-colors touch-none self-stretch flex items-center justify-center min-w-[56px] -ml-1 mr-1 sm:-ml-2 sm:mr-0"
        >
          ☰
        </div>

        {/* 실제 내용 (Input 등) - 여기는 편집/복사용이라 listeners 제외 */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* 삭제 버튼 */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 sm:p-2 rounded transition-colors shrink-0"
            title="블록 삭제"
          >
            🗑️
          </button>
        )}
        
      </div>
    </div>
  );
}
