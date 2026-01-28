// app/[projectId]/view/ViewerContent.tsx
// 서버 컴포넌트로 변경: SSR을 통해 서버에서 완전한 HTML 렌더링

import { Block, GlobalTheme } from '@/shared/types/block';
import BlockRenderer from '@/shared/components/BlockRenderer';
import { LightboxProvider } from '@/features/wedding/components/LightboxProvider';
import WatermarkWrapper from '@/features/premium/components/WatermarkWrapper';

interface ViewerContentProps {
  blocks: Block[];
  theme: GlobalTheme;
  projectId: string;
}

export default function ViewerContent({ blocks, theme, projectId }: ViewerContentProps) {
  return (
    <main className="min-h-screen flex justify-center bg-gray-100/50">
      <div 
        className="w-full max-w-[480px] min-h-screen shadow-sm mx-auto"
        style={{ 
          backgroundColor: theme.backgroundColor,
          fontFamily: theme.fontFamily 
        }}
      >
        {/* LightboxProvider로 감싸서 모든 이미지를 통합 관리 */}
        <LightboxProvider blocks={blocks}>
          {blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} projectId={projectId} />
          ))}
        </LightboxProvider>

        {/* 하단 여백 */}
        <div className="h-20 shrink-0"></div>
      </div>

      {/* 워터마크 (프리미엄이 아닌 경우 표시) */}
      <WatermarkWrapper projectId={projectId} />
    </main>
  );
}
