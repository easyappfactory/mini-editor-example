// app/page.tsx
'use client';

import BlockRenderer from "@/shared/components/BlockRenderer";
import EditorPanel from "@/features/editor/components/EditorPanel";
import { useBlockStore } from "@/store/useBlockStore";

export default function Home() {
  // Zustand에서 실시간 데이터를 가져옴 (입력하면 바로 반영됨)
  const { blocks, theme } = useBlockStore();

  return (
    <main className="h-screen flex overflow-hidden">
      
      {/* 왼쪽: 에디터 패널 */}
      <div className="border-r border-gray-300 bg-white">
        <EditorPanel />
      </div>

      {/* 오른쪽: 미리보기 (핸드폰 모양) */}
      <div className="w-1/2 overflow-y-auto p-8">
        <div className="w-[375px] mx-auto shadow-2xl rounded-3xl overflow-hidden">
          <div className="h-6 bg-gray-800 w-full"></div>
          
          <div 
            className="flex flex-col pb-10"
            style={{ 
              backgroundColor: theme.backgroundColor,
              fontFamily: theme.fontFamily 
            }}
          >
            {/* 구체적인 컴포넌트를 적지 않고, 배열을 도는 반복문을 둠.
            blocks 배열이 바뀌면 알아서 다시 map을 돌려서 그림 */}
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>

        </div>
      </div>

    </main>
  );
}