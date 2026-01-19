// app/[projectId]/view/ViewerContent.tsx
// 서버 컴포넌트로 변경: SSR을 통해 서버에서 완전한 HTML 렌더링

import { Block, GlobalTheme } from '@/shared/types/block';
import BlockRenderer from '@/shared/components/BlockRenderer';

interface ViewerContentProps {
  blocks: Block[];
  theme: GlobalTheme;
}

export default function ViewerContent({ blocks, theme }: ViewerContentProps) {
  return (
    <main className="min-h-screen flex justify-center bg-gray-100/50">
      <div 
        className="w-full max-w-[480px] min-h-screen shadow-sm mx-auto"
        style={{ 
          backgroundColor: theme.backgroundColor,
          fontFamily: theme.fontFamily 
        }}
      >
        {/* 핵심: 에디터에서 썼던 그 BlockRenderer를 그대로 재사용! 
           하지만 드래그 기능도, 편집 기능도 없는 '순수 뷰어' 상태임.
           Read-only Component 재사용 ✅
        */}
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}

        {/* 하단 여백 */}
        <div className="h-20 shrink-0"></div>
      </div>
    </main>
  );
}
