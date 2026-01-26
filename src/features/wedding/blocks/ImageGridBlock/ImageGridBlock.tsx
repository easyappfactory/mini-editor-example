// features/wedding/blocks/ImageGridBlock/ImageGridBlock.tsx
'use client';

import { Block, type ImageGridContent } from "@/shared/types/block";
import { GRID_TEMPLATES } from "@/features/wedding/templates/gridTemplates";
import { CroppedImageSlot } from "./CroppedImageSlot";
import { useLightbox } from "@/features/wedding/components/LightboxProvider";

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
  const lightbox = useLightbox();

  // 그리드 콘텐츠 확인
  const isValidGrid = isImageGridContent(block.content);
  const gridContent = isValidGrid ? (block.content as ImageGridContent) : null;
  const template = gridContent ? GRID_TEMPLATES.find(t => t.id === gridContent.templateId) : null;

  // 조건부 렌더링
  if (!isValidGrid || !gridContent) {
    return <div className="text-gray-500 text-center py-8">그리드 레이아웃을 선택해주세요</div>;
  }

  if (!template) {
    return <div className="text-red-500">템플릿을 찾을 수 없습니다.</div>;
  }

  const handleImageClick = (index: number) => {
    if (lightbox?.openLightbox) {
      const slot = gridContent.slots[index];
      if (slot?.imageSrc) {
        lightbox.openLightbox(slot.imageSrc);
      }
    }
  };

  return (
    <div className="w-full">
      <div
        className="grid gap-2"
        style={{
          gridTemplateAreas: template.cssGridTemplate,
          gridTemplateColumns: template.cssGridColumns,
          gridTemplateRows: template.cssGridRows,
          alignItems: 'start', // 비율 유지를 위해 필수
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
  );
}
