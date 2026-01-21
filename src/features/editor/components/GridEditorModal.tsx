// src/features/editor/components/GridEditorModal.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { GridSlotPreview } from './GridSlotPreview';
import Cropper, { type Area } from 'react-easy-crop';
import { type ImageGridContent, type GridSlotData } from '@/shared/types/block';
import { GRID_TEMPLATES, type GridTemplate } from '@/features/wedding/templates/gridTemplates';

interface GridEditorModalProps {
  initialData?: ImageGridContent;
  onSave: (data: ImageGridContent) => void;
  onClose: () => void;
}

type EditorMode = 'template-select' | 'grid-edit' | 'slot-edit';

interface SlotEditState {
  slotIndex: number;
  imageSrc: string | null;
  crop: { x: number; y: number };
  zoom: number;
  croppedArea: Area | null;
  croppedAreaPixels: Area | null;
}

export default function GridEditorModal({ initialData, onSave, onClose }: GridEditorModalProps) {
  const [mode, setMode] = useState<EditorMode>(
    initialData ? 'grid-edit' : 'template-select'
  );
  const [selectedTemplate, setSelectedTemplate] = useState<GridTemplate | null>(
    initialData 
      ? GRID_TEMPLATES.find(t => t.id === initialData.templateId) || null
      : null
  );
  const [slotsData, setSlotsData] = useState<GridSlotData[]>(
    initialData?.slots || []
  );
  const [editingSlot, setEditingSlot] = useState<SlotEditState | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');

  // 템플릿 선택
  const handleTemplateSelect = (template: GridTemplate) => {
    // 이미 업로드된 이미지가 있는지 확인
    const hasImages = slotsData.some(slot => slot.imageSrc);
    
    // 같은 템플릿을 다시 선택한 경우 확인 없이 진행
    if (selectedTemplate && selectedTemplate.id === template.id) {
      return;
    }
    
    // 이미지가 있고 다른 템플릿을 선택하려는 경우 확인
    if (hasImages && selectedTemplate) {
      const confirmed = window.confirm(
        '다른 레이아웃으로 변경하면 일부 이미지가 손실될 수 있습니다.\n계속하시겠습니까?'
      );
      if (!confirmed) {
        return;
      }
    }

    setSelectedTemplate(template);
    // 기존 데이터가 있으면 슬롯 개수에 맞게 조정, 없으면 빈 슬롯 생성
    const existingSlots = slotsData.length > 0 ? slotsData : [];
    setSlotsData(
      template.slots.map((slot, index) => {
        // 기존 슬롯이 있으면 유지
        if (existingSlots[index] && existingSlots[index].imageSrc) {
          return {
            ...existingSlots[index],
            id: slot.id,
          };
        }
        // 없으면 빈 슬롯
        return {
          id: slot.id,
          imageSrc: '',
          crop: { x: 0, y: 0 },
          zoom: 1,
        };
      })
    );
    setMode('grid-edit');
  };

  // 슬롯 클릭 (편집 시작)
  const handleSlotClick = (index: number) => {
    const slot = slotsData[index];
    setEditingSlot({
      slotIndex: index,
      imageSrc: slot.imageSrc || null,
      crop: slot.crop,
      zoom: slot.zoom,
      croppedArea: slot.croppedArea || null,
      croppedAreaPixels: slot.croppedAreaPixels || null,
    });
    setTempImageUrl(slot.imageSrc || '');
    setMode('slot-edit');
  };

  // URL 적용 (새 이미지 로드)
  const handleApplyImageUrl = (url: string) => {
    if (editingSlot && url.trim()) {
      setEditingSlot({
        ...editingSlot,
        imageSrc: url.trim(),
        crop: { x: 0, y: 0 },
        zoom: 1,
        croppedArea: null,
        croppedAreaPixels: null,
      });
      setTempImageUrl(url.trim());
    }
  };

  // 파일 업로드
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '이미지 업로드에 실패했습니다.');
      }

      const data = await response.json();
      
      if (editingSlot) {
        setEditingSlot({
          ...editingSlot,
          imageSrc: data.url,
          crop: { x: 0, y: 0 },
          zoom: 1,
          croppedArea: null,
          croppedAreaPixels: null,
        });
        setTempImageUrl(data.url);
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 파일 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // 크롭 완료
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    if (editingSlot) {
      setEditingSlot({
        ...editingSlot,
        croppedArea,
        croppedAreaPixels,
      });
    }
  }, [editingSlot]);

  // 슬롯 저장
  const handleSlotSave = () => {
    if (!editingSlot || !editingSlot.imageSrc || !editingSlot.croppedArea) {
      return;
    }

    const newSlotsData = [...slotsData];
    newSlotsData[editingSlot.slotIndex] = {
      ...newSlotsData[editingSlot.slotIndex],
      imageSrc: editingSlot.imageSrc,
      crop: editingSlot.crop,
      zoom: editingSlot.zoom,
      croppedArea: editingSlot.croppedArea,
      croppedAreaPixels: editingSlot.croppedAreaPixels || undefined,
    };
    setSlotsData(newSlotsData);
    setEditingSlot(null);
    setMode('grid-edit');
  };

  // 슬롯 편집 취소
  const handleSlotCancel = () => {
    setEditingSlot(null);
    setTempImageUrl('');
    setMode('grid-edit');
  };

  // 최종 저장
  const handleFinalSave = () => {
    if (!selectedTemplate) return;

    const allSlotsFilled = slotsData.every((slot) => slot.imageSrc);
    if (!allSlotsFilled) {
      alert('모든 슬롯에 이미지를 추가해주세요.');
      return;
    }

    const gridContent: ImageGridContent = {
      type: 'grid',
      templateId: selectedTemplate.id,
      slots: slotsData,
    };

    onSave(gridContent);
    onClose();
  };

  const allSlotsFilled = slotsData.every((slot) => slot.imageSrc);

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {mode === 'template-select' && '그리드 레이아웃 선택'}
            {mode === 'grid-edit' && selectedTemplate?.name}
            {mode === 'slot-edit' && '이미지 편집'}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* 템플릿 선택 모드 */}
        {mode === 'template-select' && (
          <div className="p-6">
            <p className="text-gray-600 mb-6">원하는 레이아웃을 선택하세요</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {GRID_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="bg-white border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-400 hover:shadow-lg transition-all"
                >
                  <div
                    className="w-full h-32 mb-3"
                    style={{
                      display: 'grid',
                      gridTemplateAreas: template.cssGridTemplate,
                      gridTemplateColumns: template.cssGridColumns,
                      gridTemplateRows: template.cssGridRows,
                      gap: '4px',
                    }}
                  >
                    {template.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="bg-gray-200 rounded"
                        style={{ gridArea: slot.gridArea }}
                      />
                    ))}
                  </div>
                  <p className="text-center font-semibold text-gray-700">{template.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 그리드 편집 모드 */}
        {mode === 'grid-edit' && selectedTemplate && (
          <div className="p-6">
            <p className="text-gray-600 mb-6">각 칸을 클릭하여 이미지를 추가하세요</p>
            <div
              className="w-full max-w-2xl mx-auto mb-6"
              style={{
                display: 'grid',
                gridTemplateAreas: selectedTemplate.cssGridTemplate,
                gridTemplateColumns: selectedTemplate.cssGridColumns,
                gridTemplateRows: selectedTemplate.cssGridRows,
                gap: '12px',
                alignItems: 'start', // 비율 유지를 위해 필수
              }}
            >
              {selectedTemplate.slots.map((slotConfig, index) => {
                const slotData = slotsData[index];
                return (
                  <GridSlotPreview
                    key={slotConfig.id}
                    slotData={slotData}
                    gridArea={slotConfig.gridArea}
                    aspectRatio={slotConfig.ratio}
                    onClick={() => handleSlotClick(index)}
                    showEditOverlay={true}
                  />
                );
              })}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setMode('template-select')}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                템플릿 변경
              </button>
              <button
                onClick={handleFinalSave}
                disabled={!allSlotsFilled}
                className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                저장
              </button>
            </div>
          </div>
        )}

        {/* 슬롯 편집 모드 */}
        {mode === 'slot-edit' && editingSlot && selectedTemplate && (
          <div className="flex flex-col h-[calc(90vh-80px)]">
            {!editingSlot.imageSrc && (
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md space-y-4">
                  <p className="text-gray-700 font-semibold text-center mb-4">이미지를 추가하세요</p>
                  
                  {/* URL 입력 */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      이미지 URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempImageUrl}
                        onChange={(e) => setTempImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyImageUrl(tempImageUrl);
                          }
                        }}
                        className="flex-1 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        onClick={() => handleApplyImageUrl(tempImageUrl)}
                        disabled={!tempImageUrl.trim()}
                        className="px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        적용
                      </button>
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="text-xs text-gray-500">또는</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* 파일 업로드 */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      로컬 이미지 업로드
                    </label>
                    <label 
                      className={`flex items-center justify-center gap-3 w-full border-2 border-dashed rounded-lg p-4 transition-colors ${
                        isUploading 
                          ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                          : 'border-blue-300 hover:bg-blue-50 cursor-pointer'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <span className="text-2xl animate-spin">⏳</span>
                          <span className="text-sm font-medium text-gray-600">
                            업로드 중...
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl">📁</span>
                          <span className="text-sm font-medium text-blue-600">
                            이미지 파일 선택
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {editingSlot.imageSrc && (
              <>
                <div className="relative flex-1 bg-gray-900">
                  <Cropper
                    image={editingSlot.imageSrc}
                    crop={editingSlot.crop}
                    zoom={editingSlot.zoom}
                    aspect={selectedTemplate.slots[editingSlot.slotIndex].ratio}
                    onCropChange={(crop) =>
                      setEditingSlot({ ...editingSlot, crop })
                    }
                    onZoomChange={(zoom) =>
                      setEditingSlot({ ...editingSlot, zoom })
                    }
                    onCropComplete={onCropComplete}
                    style={{
                      containerStyle: { background: '#222' },
                      cropAreaStyle: { border: '2px solid #fff' },
                    }}
                  />
                </div>

                <div className="bg-gray-50 p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-700 min-w-[60px]">Zoom</span>
                    <input
                      type="range"
                      value={editingSlot.zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      onChange={(e) =>
                        setEditingSlot({
                          ...editingSlot,
                          zoom: Number(e.target.value),
                        })
                      }
                      className="flex-1"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs font-semibold text-gray-600 mb-3">이미지 변경</p>
                    
                    {/* URL 입력 */}
                    <div className="mb-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tempImageUrl}
                          onChange={(e) => setTempImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyImageUrl(tempImageUrl);
                            }
                          }}
                          className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="이미지 URL 입력"
                        />
                        <button
                          onClick={() => handleApplyImageUrl(tempImageUrl)}
                          disabled={!tempImageUrl.trim() || tempImageUrl === editingSlot.imageSrc}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
                        >
                          적용
                        </button>
                      </div>
                    </div>

                    {/* 구분선 */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="text-xs text-gray-500">또는</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* 파일 선택 */}
                    <label 
                      className={`flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg p-2 text-sm transition-colors ${
                        isUploading 
                          ? 'bg-gray-200 cursor-not-allowed' 
                          : 'bg-white hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          <span className="font-medium text-gray-600">업로드 중...</span>
                        </>
                      ) : (
                        <>
                          <span>📁</span>
                          <span className="font-medium text-gray-700">파일 선택</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="border-t p-6 flex gap-3">
              <button
                onClick={handleSlotCancel}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleSlotSave}
                disabled={!editingSlot.imageSrc || !editingSlot.croppedArea}
                className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                저장
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
