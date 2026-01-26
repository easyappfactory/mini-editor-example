// src/features/wedding/blocks/ImageGridBlock/CroppedImageSlot.tsx
'use client';

import { type GridSlotData } from '@/shared/types/block';

interface Props {
  slotData: GridSlotData;
  gridArea: string;
  aspectRatio: number; // 슬롯의 비율 (예: 16/9)
  onClick: () => void;
}

export function CroppedImageSlot({ slotData, gridArea, aspectRatio, onClick }: Props) {
  if (!slotData.imageSrc) {
    return (
      <div
        className="bg-gray-200 min-h-[150px]"
        style={{ gridArea, aspectRatio }}
      />
    );
  }

  const { croppedArea } = slotData;

  // 크롭된 영역이 있을 때 CSS 렌더링 스타일 계산
  // 프로토타입(mobile-card-cropper)의 ResultGrid와 동일한 로직
  const imageStyle: React.CSSProperties = croppedArea
    ? {
        position: 'absolute',
        top: `${-croppedArea.y / croppedArea.height * 100}%`,
        left: `${-croppedArea.x / croppedArea.width * 100}%`,
        width: `${100 / croppedArea.width * 100}%`,
        height: `${100 / croppedArea.height * 100}%`,
        maxWidth: 'none',
        maxHeight: 'none',
        // objectFit 제거
      }
    : {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      };

  return (
    <div
      className="relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity min-h-[150px]"
      style={{ gridArea, aspectRatio }}
      onClick={onClick}
    >
      <img
        src={slotData.imageSrc}
        alt="Cropped slot"
        className="block" // 기본값
        style={imageStyle}
      />
    </div>
  );
}
