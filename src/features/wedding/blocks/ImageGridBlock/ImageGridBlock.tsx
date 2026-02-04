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

  // 조건부 렌더링: 유효한 그리드 데이터가 없을 경우 플레이스홀더(기본 4분할) 표시
  if (!isValidGrid || !gridContent || !template) {
    const placeholderTemplate = GRID_TEMPLATES.find(t => t.id === 'layout-4') || GRID_TEMPLATES[0];
    
    return (
      <div className="w-full relative group cursor-help">
        <div
          className="grid gap-1 opacity-50"
          style={{
            gridTemplateAreas: placeholderTemplate.cssGridTemplate,
            gridTemplateColumns: placeholderTemplate.cssGridColumns,
            gridTemplateRows: placeholderTemplate.cssGridRows,
          }}
        >
          {placeholderTemplate.slots.map((slot) => (
            <div
              key={slot.id}
              className="bg-gray-200 w-full rounded-sm flex items-center justify-center"
              style={{ 
                gridArea: slot.gridArea,
                aspectRatio: slot.ratio,
                minHeight: '100px'
              }}
            >
              <span className="text-2xl opacity-20">📷</span>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 px-3 py-1.5 rounded-full shadow-sm text-xs font-medium text-gray-500 border border-gray-100">
            그리드 레이아웃을 설정해주세요
          </div>
        </div>
      </div>
    );
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
