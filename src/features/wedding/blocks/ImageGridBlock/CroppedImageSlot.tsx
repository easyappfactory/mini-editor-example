// src/features/wedding/blocks/ImageGridBlock/CroppedImageSlot.tsx
'use client';

import { useEffect, useState } from 'react';
import { type GridSlotData } from '@/shared/types/block';
import { getCroppedImg } from '@/shared/utils/canvasUtils';

interface Props {
  slotData: GridSlotData;
  gridArea: string;
  aspectRatio: number; // 슬롯의 비율 (예: 16/9)
  onClick: () => void;
}

export function CroppedImageSlot({ slotData, gridArea, aspectRatio, onClick }: Props) {
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateCroppedImage = async () => {
      if (slotData.imageSrc && slotData.croppedAreaPixels) {
        try {
          const croppedUrl = await getCroppedImg(slotData.imageSrc, slotData.croppedAreaPixels);
          setCroppedImageUrl(croppedUrl);
        } catch (error) {
          console.error('크롭 이미지 생성 실패:', error);
          setCroppedImageUrl(null);
        }
      } else {
        setCroppedImageUrl(null);
      }
    };

    generateCroppedImage();
  }, [slotData.imageSrc, slotData.croppedAreaPixels]);

  if (!slotData.imageSrc) {
    return (
      <div
        className="bg-gray-200 rounded-lg min-h-[150px]"
        style={{ gridArea, aspectRatio }}
      />
    );
  }

  if (!croppedImageUrl) {
    // 로딩 중이거나 크롭 정보가 없을 때
    return (
      <div
        className="relative overflow-hidden rounded-lg min-h-[150px]"
        style={{ gridArea, aspectRatio }}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${slotData.imageSrc})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity min-h-[150px]"
      style={{ gridArea, aspectRatio }}
      onClick={onClick}
    >
      <img
        src={croppedImageUrl}
        alt="Cropped slot"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
