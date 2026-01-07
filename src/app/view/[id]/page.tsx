'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // URL의 id를 가져오는 훅
import { loadProject } from '@/utils/storage';
import { Block, GlobalTheme } from '@/types/block';
import BlockRenderer from '@/components/BlockRenderer';
import DynamicMetaTags from '@/components/DynamicMetaTags';

export default function ViewerPage() {
  const params = useParams();
  const id = params.id as string; // URL에서 [id] 부분 가져옴
  
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [theme, setTheme] = useState<GlobalTheme>({
    backgroundColor: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    primaryColor: '#6366f1'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 화면이 켜지면 가짜 DB에서 데이터를 가져옴
    if (id) {
      const projectData = loadProject(id);
      if (projectData) {
        setBlocks(projectData.blocks);
        setTheme(projectData.theme);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="text-center p-10">로딩 중...</div>;
  if (!blocks) return <div className="text-center p-10">청첩장을 찾을 수 없습니다. 😢</div>;

  return (
    <>
      {/* 동적 메타 태그 (클라이언트에서 업데이트 - 제한적) */}
      <DynamicMetaTags blocks={blocks} />
      
      <main className="min-h-screen bg-gray-100 flex justify-center py-8 px-4">
        {/* 핸드폰 모양 프레임 (편집 기능 없음!) */}
        <div className="w-[375px] h-fit shadow-2xl rounded-3xl overflow-hidden border-3 border-gray-800">
          <div className="h-6 bg-gray-800 w-full"></div>
          
          <div 
            className="flex flex-col"
            style={{ 
              backgroundColor: theme.backgroundColor,
              fontFamily: theme.fontFamily 
            }}
          >
            {/* 핵심: 에디터에서 썼던 그 BlockRenderer를 그대로 재사용! 
               하지만 드래그 기능도, 편집 기능도 없는 '순수 뷰어' 상태임.
            */}
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}