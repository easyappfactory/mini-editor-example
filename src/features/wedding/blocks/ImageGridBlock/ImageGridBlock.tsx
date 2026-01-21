// features/wedding/blocks/ImageGridBlock/ImageGridBlock.tsx
'use client';

import { Block, type ImageGridContent } from "@/shared/types/block";
import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { GRID_TEMPLATES } from "@/features/wedding/templates/gridTemplates";
import { CroppedImageSlot } from "./CroppedImageSlot";
import { getCroppedImg } from "@/shared/utils/canvasUtils";

interface Props {
  block: Block;
}

// 타입 가드 함수
function isImageGridContent(content: unknown): content is ImageGridContent {
  return (
    typeof content === 'object' &&
    content !== null &&
    'type' in content &&
    content.type === 'grid'
  );
}

export default function ImageGridBlock({ block }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [croppedImageUrls, setCroppedImageUrls] = useState<string[]>([]);

  // 그리드 콘텐츠 확인
  const isValidGrid = isImageGridContent(block.content);
  const gridContent = isValidGrid ? (block.content as ImageGridContent) : null;
  const template = gridContent ? GRID_TEMPLATES.find(t => t.id === gridContent.templateId) : null;

  // Lightbox용 크롭된 이미지 생성
  useEffect(() => {
    if (!gridContent || !template) return;

    const generateCroppedImages = async () => {
      const urls = await Promise.all(
        gridContent.slots.map(async (slot) => {
          if (slot.imageSrc && slot.croppedAreaPixels) {
            try {
              return await getCroppedImg(slot.imageSrc, slot.croppedAreaPixels);
            } catch (error) {
              console.error('크롭 이미지 생성 실패:', error);
              return slot.imageSrc; // 실패 시 원본 사용
            }
          }
          return null;
        })
      );
      setCroppedImageUrls(urls.filter(url => url !== null) as string[]);
    };

    generateCroppedImages();
  }, [gridContent, template]);

  // 조건부 렌더링은 모든 Hook 이후에
  if (!isValidGrid || !gridContent) {
    return <div className="text-gray-500 text-center py-8">그리드 레이아웃을 선택해주세요</div>;
  }

  if (!template) {
    return <div className="text-red-500">템플릿을 찾을 수 없습니다.</div>;
  }

  // Lightbox용 슬라이드 생성 (크롭된 이미지 사용)
  const slides = croppedImageUrls.map(url => ({ src: url }));

  const handleImageClick = (index: number) => {
    // 클릭한 슬롯의 크롭된 이미지 인덱스 찾기
    let croppedIndex = 0;
    for (let i = 0; i < index; i++) {
      if (gridContent.slots[i]?.imageSrc) {
        croppedIndex++;
      }
    }
    setLightboxIndex(croppedIndex);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="w-full">
        <div
          className="grid gap-2"
          style={{
            gridTemplateAreas: template.cssGridTemplate,
            gridTemplateColumns: template.cssGridColumns,
            gridTemplateRows: template.cssGridRows,
          }}
        >
          {template.slots.map((slotConfig, index) => (
            <CroppedImageSlot
              key={slotConfig.id}
              slotData={gridContent.slots[index]}
              gridArea={slotConfig.gridArea}
              aspectRatio={slotConfig.ratio}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />
    </>
  );
}
