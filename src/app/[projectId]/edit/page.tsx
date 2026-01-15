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
    <main className="h-screen flex overflow-hidden">
      {/* 왼쪽: 에디터 패널 */}
      <div className="border-r border-gray-300 bg-white flex-shrink-0 overflow-hidden">
        <EditorPanel projectId={projectId} />
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
