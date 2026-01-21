// src/features/editor/components/GridSlotPreview.tsx
'use client';

import { useEffect, useState } from 'react';
import { type GridSlotData } from '@/shared/types/block';
import { getCroppedImg } from '@/shared/utils/canvasUtils';

interface Props {
  slotData: GridSlotData;
  gridArea: string;
  aspectRatio: number;
  onClick?: () => void;
  showEditOverlay?: boolean;
}

export function GridSlotPreview({ slotData, gridArea, aspectRatio, onClick, showEditOverlay = false }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const generatePreview = async () => {
      // 이미지가 없으면 리턴
      if (!slotData.imageSrc) {
        if (isMounted) setPreviewUrl(null);
        return;
      }

      // 크롭 데이터가 있으면 크롭된 이미지 생성
      if (slotData.croppedAreaPixels) {
        try {
          const croppedUrl = await getCroppedImg(slotData.imageSrc, slotData.croppedAreaPixels);
          if (isMounted) setPreviewUrl(croppedUrl);
        } catch (e) {
          console.error('Preview generation failed', e);
          // 실패 시 원본 사용
          if (isMounted) setPreviewUrl(slotData.imageSrc);
        }
      } else {
        // 크롭 데이터가 없으면 원본 사용
        if (isMounted) setPreviewUrl(slotData.imageSrc);
      }
    };

    generatePreview();

    return () => {
      isMounted = false;
    };
  }, [slotData.imageSrc, slotData.croppedAreaPixels]);

  if (!slotData.imageSrc) {
    return (
      <div
        onClick={onClick}
        className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-all"
        style={{ gridArea, aspectRatio }}
      >
        <span className="text-2xl font-light mb-1">+</span>
        <span className="text-xs font-medium">사진 추가</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-100"
      style={{ gridArea, aspectRatio }}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Slot preview"
          className="w-full h-full object-cover"
        />
      ) : (
        // 로딩 중이거나 생성 전일 때 스켈레톤
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      )}
      
      {showEditOverlay && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <span className="text-white font-semibold text-sm bg-black/30 px-3 py-1.5 rounded-md backdrop-blur-sm">
            편집
          </span>
        </div>
      )}
    </div>
  );
}
