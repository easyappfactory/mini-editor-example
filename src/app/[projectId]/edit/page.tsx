// app/[projectId]/edit/page.tsx
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import BlockRenderer from "@/shared/components/BlockRenderer";
import EditorPanel from "@/features/editor/components/EditorPanel";
import { useBlockStore } from "@/store/useBlockStore";
import { loadProject } from '@/shared/utils/apiClient';

export default function EditorPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { blocks, theme, setBlocks, setTheme, setTitle } = useBlockStore();

  // 프로젝트 ID가 있고 'new'가 아니면 기존 프로젝트 로드
  useEffect(() => {
    async function fetchProject() {
      if (projectId && projectId !== 'new') {
        const projectData = await loadProject(projectId);
        if (projectData) {
          setBlocks(projectData.blocks);
          setTheme(projectData.theme);
          if (projectData.title) {
            setTitle(projectData.title);
          }
        }
      }
      // 'new'인 경우는 store의 초기 상태를 그대로 사용 (리셋된 상태)
    }
    fetchProject();
  }, [projectId, setBlocks, setTheme, setTitle]);

  return (
    <main className="h-screen flex flex-col md:flex-row bg-background">
      {/* 왼쪽(또는 상단): 에디터 패널 */}
      <div className="flex-shrink-0 w-full md:w-[450px] lg:w-[520px] xl:w-[600px] h-[50vh] md:h-full overflow-y-auto border-b md:border-b-0 md:border-r border-border bg-background order-2 md:order-1">
        <EditorPanel projectId={projectId} />
      </div>

      {/* 오른쪽(또는 하단): 미리보기 (핸드폰 모양) */}
      <div className="flex-1 h-[50vh] md:h-full overflow-y-auto p-6 md:p-10 bg-muted/20 flex flex-col items-center order-1 md:order-2">
        <div className="w-[375px] min-h-[812px] h-auto shadow-2xl rounded-[3rem] overflow-hidden border-[8px] border-white ring-1 ring-black/5 flex flex-col bg-white shrink-0 my-auto scale-75 md:scale-100 origin-center transition-transform duration-300">
          {/* 상태바 예시 */}
          <div className="h-12 bg-white flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
            <span className="text-xs font-semibold">9:41</span>
            <div className="flex gap-1.5">
              <div className="w-4 h-2.5 bg-black rounded-[1px]"></div>
              <div className="w-0.5 h-1 bg-black"></div>
            </div>
          </div>
          
          <div 
            className="flex-1 flex flex-col"
            style={{ 
              backgroundColor: theme.backgroundColor,
              fontFamily: theme.fontFamily 
            }}
          >
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
            
            {/* 하단 여백 */}
            <div className="h-20 shrink-0"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
