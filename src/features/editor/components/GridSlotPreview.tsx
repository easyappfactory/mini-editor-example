// src/features/editor/components/GridSlotPreview.tsx
'use client';

import { type GridSlotData } from '@/shared/types/block';

interface Props {
  slotData: GridSlotData;
  gridArea: string;
  aspectRatio: number;
  onClick?: () => void;
  showEditOverlay?: boolean;
}

export function GridSlotPreview({ slotData, gridArea, aspectRatio, onClick, showEditOverlay = false }: Props) {
  // 공통 컨테이너 스타일 (비율 강제)
  const containerStyle: React.CSSProperties = {
    gridArea,
    aspectRatio: `${aspectRatio}`, // 비율 강제
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '0.5rem', // rounded-lg
  };

  if (!slotData.imageSrc) {
    return (
      <div
        onClick={onClick}
        className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 text-gray-400 cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-all"
        style={containerStyle}
      >
        <span className="text-2xl font-light mb-1">+</span>
        <span className="text-xs font-medium">사진 추가</span>
      </div>
    );
  }

  const { croppedArea } = slotData;

  // 크롭된 영역이 있을 때 CSS 렌더링 스타일 계산
  const imageStyle: React.CSSProperties = croppedArea
    ? {
        position: 'absolute',
        top: `${-croppedArea.y / croppedArea.height * 100}%`,
        left: `${-croppedArea.x / croppedArea.width * 100}%`,
        width: `${100 / croppedArea.width * 100}%`,
        height: `${100 / croppedArea.height * 100}%`,
        maxWidth: 'none',
        maxHeight: 'none',
        // objectFit 제거 (기본값 fill이어도 수학적으로 비율 유지됨)
      }
    : {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer group bg-gray-100"
      style={containerStyle}
    >
      <img
        src={slotData.imageSrc}
        alt="Slot preview"
        style={imageStyle}
      />
      
      {showEditOverlay && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10">
          <span className="text-white font-semibold text-sm bg-black/30 px-3 py-1.5 rounded-md backdrop-blur-sm">
            편집
          </span>
        </div>
      )}
    </div>
  );
}
