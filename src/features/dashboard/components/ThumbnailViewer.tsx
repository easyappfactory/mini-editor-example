'use client';

import { Block, GlobalTheme } from '@/shared/types/block';
import BlockRenderer from '@/shared/components/BlockRenderer';

interface ThumbnailViewerProps {
  blocks: Block[];
  theme: GlobalTheme;
  scale?: number;
}

export default function ThumbnailViewer({ blocks, theme, scale = 0.25 }: ThumbnailViewerProps) {
  // 1. 성능을 위해 3개만 렌더링
  const previewBlocks = blocks.slice(0, 4);

  return (
    <div 
      className="relative overflow-hidden bg-white group"
      style={{
        width: '100%',
        height: '150px', // 2. 적당한 고정 높이 설정 (너무 길지 않게)
      }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: `${100 / scale}%`,
          transform: `scale(${scale})`,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div 
          className="flex flex-col items-center py-8 px-4"
          style={{ 
            backgroundColor: theme.backgroundColor,
            fontFamily: theme.fontFamily,
            height: 'fit-content' // 데이터만큼만 배경 그림
          }}
        >
          {/* 핸드폰 프레임 컨테이너 */}
          <div className="w-[375px] bg-white shadow-xl overflow-hidden flex flex-col">
            <div 
              className="flex flex-col flex-1"
              style={{ 
                backgroundColor: theme.backgroundColor,
                fontFamily: theme.fontFamily 
              }}
            >
              {previewBlocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 하단 화이트 그라데이션 */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white via-white/70 to-transparent z-10" />
      
      {/* 호버 시 전체 오버레이 */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-20" />
    </div>
  );
}
