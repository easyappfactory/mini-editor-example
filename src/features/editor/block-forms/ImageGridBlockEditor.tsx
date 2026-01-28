'use client';

import { ImageGridContent } from '@/shared/types/block';
import { GRID_TEMPLATES } from '@/features/wedding/templates/gridTemplates';
import { GridSlotPreview } from '../components/GridSlotPreview';

interface ImageGridBlockEditorProps {
  content: ImageGridContent | null;
  onUpdate: (content: ImageGridContent) => void;
  onEditGrid: () => void;
}

export default function ImageGridBlockEditor({ content: gridContent, onUpdate, onEditGrid }: ImageGridBlockEditorProps) {
  
  const handleTemplateSelect = (template: typeof GRID_TEMPLATES[0]) => {
    // 이미 이미지가 있는지 확인
    const hasImages = gridContent?.slots?.some(slot => slot.imageSrc);
    
    // 같은 템플릿을 다시 선택한 경우
    if (gridContent?.templateId === template.id) {
      return;
    }
    
    // 이미지가 있고 다른 템플릿을 선택하려는 경우 확인
    if (hasImages) {
      const confirmed = window.confirm(
        '다른 레이아웃으로 변경하면 일부 이미지가 손실될 수 있습니다.\n계속하시겠습니까?'
      );
      if (!confirmed) {
        return;
      }
    }

    // 기존 슬롯 데이터 가져오기
    const currentSlots = gridContent?.slots || [];

    const initialGridContent: ImageGridContent = {
      type: 'grid',
      templateId: template.id,
      slots: template.slots.map((newSlot, index) => {
        const oldSlot = currentSlots[index];
        // 기존 슬롯에 이미지가 있으면 유지 (ID는 새 템플릿 것으로 교체)
        if (oldSlot && oldSlot.imageSrc) {
          return {
            ...oldSlot,
            id: newSlot.id
          };
        }
        // 없으면 빈 슬롯 생성
        return {
          id: newSlot.id,
          imageSrc: '',
          crop: { x: 0, y: 0 },
          zoom: 1,
        };
      }),
    };
    onUpdate(initialGridContent);
  };

  return (
    <div className="flex flex-col gap-2">
      
      {!gridContent ? (
        <>
          <p className="text-sm text-muted-foreground mb-3">그리드 레이아웃을 선택하세요</p>
          <div className="grid grid-cols-2 gap-3">
            {GRID_TEMPLATES.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="bg-background border-2 border-border rounded-lg p-3 cursor-pointer hover:border-primary hover:shadow-md transition-all"
              >
                <div
                  className="w-full h-20 mb-2"
                  style={{
                    display: 'grid',
                    gridTemplateAreas: template.cssGridTemplate,
                    gridTemplateColumns: template.cssGridColumns,
                    gridTemplateRows: template.cssGridRows,
                    gap: '2px',
                  }}
                >
                  {template.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="bg-muted rounded"
                      style={{ gridArea: slot.gridArea }}
                    />
                  ))}
                </div>
                <p className="text-center text-xs font-semibold text-foreground">{template.name}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-green-600 font-semibold">
              ✓ {GRID_TEMPLATES.find(t => t.id === gridContent.templateId)?.name} 선택됨
            </p>
            <button
              onClick={onEditGrid}
              className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold hover:bg-primary/90"
            >
              이미지 편집
            </button>
          </div>

          {/* 미리보기 */}
          {(() => {
            const currentTemplate = GRID_TEMPLATES.find(t => t.id === gridContent.templateId);
            return currentTemplate && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">미리보기:</p>
                <div
                  className="w-full"
                  style={{
                    display: 'grid',
                    gridTemplateAreas: currentTemplate.cssGridTemplate,
                    gridTemplateColumns: currentTemplate.cssGridColumns,
                    gridTemplateRows: currentTemplate.cssGridRows,
                    gap: '4px',
                    alignItems: 'start', // 비율 유지를 위해 필수
                  }}
                >
                  {currentTemplate.slots.map((slotConfig, idx) => {
                    const slotData = gridContent.slots[idx];
                    return (
                      <GridSlotPreview
                        key={slotConfig.id}
                        slotData={slotData}
                        gridArea={slotConfig.gridArea}
                        aspectRatio={slotConfig.ratio}
                        onClick={onEditGrid} // 클릭 시 편집 모달 열기
                      />
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* 템플릿 변경 */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">레이아웃 변경:</p>
            <div className="grid grid-cols-2 gap-2">
              {GRID_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`bg-background border-2 rounded-lg p-2 cursor-pointer transition-all ${
                    gridContent.templateId === template.id
                      ? 'border-primary shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div
                    className="w-full h-16 mb-1"
                    style={{
                      display: 'grid',
                      gridTemplateAreas: template.cssGridTemplate,
                      gridTemplateColumns: template.cssGridColumns,
                      gridTemplateRows: template.cssGridRows,
                      gap: '2px',
                    }}
                  >
                    {template.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="bg-muted rounded"
                        style={{ gridArea: slot.gridArea }}
                      />
                    ))}
                  </div>
                  <p className="text-center text-xs font-semibold text-foreground">{template.name}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
