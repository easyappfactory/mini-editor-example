'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BlockRenderer from "@/shared/components/BlockRenderer";
import EditorPanel from "@/features/editor/components/EditorPanel";
import { useBlockStore } from "@/store/useBlockStore";
import { loadProject, ProjectAccessError } from '@/shared/utils/apiClient';
import { LightboxProvider } from '@/features/wedding/components/LightboxProvider';

type AccessState = 'loading' | 'ok' | 'forbidden' | 'not_found';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const { blocks, theme, setBlocks, setTheme, setTitle, reset } = useBlockStore();
  const [accessState, setAccessState] = useState<AccessState>('loading');

  useEffect(() => {
    async function fetchProject() {
      setAccessState('loading');
      try {
        if (projectId && projectId !== 'new') {
          const projectData = await loadProject(projectId);
          if (projectData) {
            setBlocks(projectData.blocks);
            setTheme(projectData.theme);
            if (projectData.title) setTitle(projectData.title);
          }
          setAccessState('ok');
        } else {
          reset();
          setAccessState('ok');
        }
      } catch (error) {
        if (error instanceof ProjectAccessError) {
          if (error.status === 401) {
            router.replace(`/login?redirect=/${projectId}/edit`);
            return;
          }
          if (error.status === 403) {
            setAccessState('forbidden');
            return;
          }
          setAccessState('not_found');
        } else {
          console.error('프로젝트 로드 실패:', error);
          setAccessState('not_found');
        }
      }
    }
    fetchProject();
  }, [projectId, setBlocks, setTheme, setTitle, reset, router]);

  if (accessState === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">청첩장 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (accessState === 'forbidden') {
    return (
      <div className="h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-6">🔒</p>
          <h2 className="font-serif text-2xl text-foreground mb-3">접근할 수 없는 청첩장입니다</h2>
          <p className="text-muted-foreground text-base mb-8">
            이 청첩장은 다른 계정으로 만들어졌습니다.<br />본인의 청첩장을 편집하려면 대시보드로 이동하세요.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 rounded-full font-medium text-base transition-all duration-200"
            style={{ backgroundColor: '#cfc4b4', color: '#1c1917' }}
          >
            내 청첩장 보기
          </Link>
        </div>
      </div>
    );
  }

  if (accessState === 'not_found') {
    return (
      <div className="h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-6">🔍</p>
          <h2 className="font-serif text-2xl text-foreground mb-3">청첩장을 찾을 수 없습니다</h2>
          <p className="text-muted-foreground text-base mb-8">
            삭제되었거나 잘못된 링크일 수 있습니다.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 rounded-full font-medium text-base transition-all duration-200"
            style={{ backgroundColor: '#cfc4b4', color: '#1c1917' }}
          >
            대시보드로 이동
          </Link>
        </div>
      </div>
    );
  }

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
            {/* LightboxProvider로 감싸서 모든 이미지를 통합 관리 */}
            <LightboxProvider blocks={blocks}>
              {blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} projectId={projectId} />
              ))}
            </LightboxProvider>
            
            {/* 하단 여백 */}
            <div className="h-20 shrink-0"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
