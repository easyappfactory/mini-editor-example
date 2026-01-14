// features/editor/components/EditorPanel.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBlockStore } from '@/store/useBlockStore';
import SortableItem from './SortableItem';
import { updateProject, createProject } from '@/shared/utils/apiClient';
import ShareModal from '@/features/share/components/ShareModal';
import TemplateSelector from '@/features/wedding/components/TemplateSelector';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useBlockManagement } from '../hooks/useBlockManagement';
import { CoupleInfo, WeddingDate, VenueInfo, MapInfo } from '@/shared/types/block';
import MapBlockEditor from './MapBlockEditor';

interface EditorPanelProps {
  projectId?: string;
}

export default function EditorPanel({ projectId: propProjectId }: EditorPanelProps = {}) {
  // URL에서 직접 projectId를 읽어옴 (prop보다 우선)
  // useParams()는 history.replaceState()로 URL이 변경되어도 업데이트되지 않을 수 있으므로
  // window.location.pathname에서 직접 파싱
  const params = useParams();
  const urlProjectId = params.projectId as string | undefined;
  
  // window.location.pathname에서 직접 파싱 (더 신뢰할 수 있음)
  const getProjectIdFromUrl = () => {
    if (typeof window === 'undefined') return urlProjectId || propProjectId;
    const pathMatch = window.location.pathname.match(/^\/([^\/]+)\/edit$/);
    return pathMatch ? pathMatch[1] : (urlProjectId || propProjectId);
  };
  
  const projectId = getProjectIdFromUrl();
  const { theme } = useBlockStore();
  const { blocks, updateBlock } = useBlockManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Drag and Drop 로직 (Hook으로 분리)
  const { handleDragEnd } = useDragAndDrop(blocks, useBlockStore.getState().setBlocks);

  // 저장 버튼 클릭 시
  const handleSave = async () => {
    if (isSaving) return; // 이미 저장 중이면 무시
    
    setIsSaving(true);
    try {
      // 저장 시점에 URL에서 직접 projectId를 읽어옴 (가장 최신 값 보장)
      const pathMatch = typeof window !== 'undefined' 
        ? window.location.pathname.match(/^\/([^\/]+)\/edit$/)
        : null;
      let currentProjectId: string = pathMatch ? pathMatch[1] : (projectId || '');
      let isNewProject = false;
      
      // projectId가 있고 'new'가 아니면 업데이트 시도
      if (currentProjectId && currentProjectId !== 'new') {
        try {
          const updateSuccess = await updateProject(currentProjectId, blocks, theme);
          
          if (!updateSuccess) {
            // 업데이트 실패 (404) - 프로젝트가 존재하지 않음, 새로 생성
            isNewProject = true;
            currentProjectId = await createProject(blocks, theme);
          }
        } catch (error) {
          // 업데이트 중 에러 발생 (404가 아닌 다른 에러)
          throw error; // 에러를 다시 던져서 상위 catch에서 처리
        }
      } else {
        // projectId가 없거나 'new'인 경우 - 새 프로젝트 생성
        isNewProject = true;
        currentProjectId = await createProject(blocks, theme);
      }
      
      // Phase 2 요구사항: /[projectId]/view 라우팅 사용
      const url = `${window.location.origin}/${currentProjectId}/view`;
      
      // 모달 먼저 표시 (리다이렉트 전에)
      setShareUrl(url);
      setIsModalOpen(true);
      
      // 새 프로젝트인 경우 URL만 업데이트 (페이지 리로드 없이)
      if (isNewProject) {
        // URL만 변경하고 페이지 리로드는 하지 않음 (모달이 닫히지 않도록)
        window.history.replaceState(null, '', `/${currentProjectId}/edit`);
      }
    } catch (error) {
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">청첩장 편집</h2>
      
      {/* 👇 템플릿 선택기 추가 */}
      <TemplateSelector />
      
      {/* 저장 버튼 */}
      <div className="mb-6">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>저장 중...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>저장 & 공유하기</span>
            </>
          )}
        </button>
      </div>
      {/* 1. DnD 컨텍스트 시작 : 이 태그 안은 물리법칙(드래그)가 적용됨 */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          
          {/* 2. 정렬 가능한 영역 설정 (vertical 리스트) : 이 태그 안은 드래그 가능한 리스트들*/}
          <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
            
            {blocks.map((block) => {
              // TEXT BLOCK
              if (block.type === 'text') {
                const textContent = typeof block.content === 'string' ? block.content : '';
                return (
                  <SortableItem key={block.id} id={block.id}>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">{block.type} BLOCK</span>
                      <textarea
                        value={textContent}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        className="w-full border rounded p-2 text-sm"
                        rows={3}
                      />
                    </div>
                  </SortableItem>
                );
              }

              // IMAGE BLOCK
              if (block.type === 'image') {
                const imageUrl = typeof block.content === 'string' ? block.content : '';
                const isUploading = uploadingImages.has(block.id);
                const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                  updateBlock(block.id, e.target.value);
                };
                const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  // 업로드 시작
                  setUploadingImages((prev) => new Set(prev).add(block.id));

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
                    updateBlock(block.id, data.url);
                  } catch (error) {
                    console.error('이미지 업로드 오류:', error);
                    alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
                  } finally {
                    // 업로드 완료
                    setUploadingImages((prev) => {
                      const next = new Set(prev);
                      next.delete(block.id);
                      return next;
                    });
                  }
                };
                return (
                  <SortableItem key={block.id} id={block.id}>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">{block.type} BLOCK</span>
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            이미지 URL
                          </label>
                          <input
                            type="text"
                            value={imageUrl}
                            onChange={handleImageUrlChange}
                            className="w-full border rounded p-2 text-sm"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 border-t border-gray-300"></div>
                          <span className="text-xs text-gray-500">또는</span>
                          <div className="flex-1 border-t border-gray-300"></div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            로컬 이미지 업로드
                          </label>
                          <label 
                            className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded p-3 transition-colors ${
                              isUploading 
                                ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
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
                              className="hidden"
                              onChange={handleFileChange}
                              disabled={isUploading}
                            />
                          </label>
                        </div>
                        {imageUrl && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">미리보기:</p>
                            <img 
                              src={imageUrl} 
                              alt="Preview" 
                              className="w-full h-20 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </SortableItem>
                );
              }

              // COUPLE_INFO BLOCK
              if (block.type === 'couple_info') {
                const coupleInfo = typeof block.content !== 'string' && 'groomName' in block.content
                  ? block.content as CoupleInfo
                  : { groomName: '', groomFather: '', groomMother: '', brideName: '', brideFather: '', brideMother: '' };
                
                const handleCoupleInfoChange = (field: keyof CoupleInfo) => (
                  e: React.ChangeEvent<HTMLInputElement>
                ) => {
                  updateBlock(block.id, {
                    ...coupleInfo,
                    [field]: e.target.value,
                  });
                };

                return (
                  <SortableItem key={block.id} id={block.id}>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">{block.type} BLOCK</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <input
                            value={coupleInfo.groomName}
                            onChange={handleCoupleInfoChange('groomName')}
                            className="border rounded p-2 text-sm"
                            placeholder="신랑 이름"
                          />
                        </div>
                        <div className="flex flex-col">
                          <input
                            value={coupleInfo.brideName}
                            onChange={handleCoupleInfoChange('brideName')}
                            className="border rounded p-2 text-sm"
                            placeholder="신부 이름"
                          />
                        </div>
                        <input
                          value={coupleInfo.groomFather}
                          onChange={handleCoupleInfoChange('groomFather')}
                          className="border rounded p-2 text-sm col-span-2"
                          placeholder="신랑 아버지"
                        />
                        <input
                          value={coupleInfo.groomMother}
                          onChange={handleCoupleInfoChange('groomMother')}
                          className="border rounded p-2 text-sm col-span-2"
                          placeholder="신랑 어머니"
                        />
                        <input
                          value={coupleInfo.brideFather}
                          onChange={handleCoupleInfoChange('brideFather')}
                          className="border rounded p-2 text-sm col-span-2"
                          placeholder="신부 아버지"
                        />
                        <input
                          value={coupleInfo.brideMother}
                          onChange={handleCoupleInfoChange('brideMother')}
                          className="border rounded p-2 text-sm col-span-2"
                          placeholder="신부 어머니"
                        />
                      </div>
                    </div>
                  </SortableItem>
                );
              }

              // DATE BLOCK
              if (block.type === 'date') {
                const dateInfo = typeof block.content !== 'string' && 'year' in block.content
                  ? block.content as WeddingDate
                  : { year: '', month: '', day: '', time: '' };
                
                const handleDateChange = (field: keyof WeddingDate) => (
                  e: React.ChangeEvent<HTMLInputElement>
                ) => {
                  updateBlock(block.id, {
                    ...dateInfo,
                    [field]: e.target.value,
                  });
                };

                return (
                  <SortableItem key={block.id} id={block.id}>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">{block.type} BLOCK</span>
                      <div className="flex gap-2">
                        <div className="flex flex-col w-20">
                          <input
                            value={dateInfo.year}
                            onChange={handleDateChange('year')}
                            className="border rounded p-2 text-sm"
                            placeholder="2026"
                          />
                        </div>
                        <div className="flex flex-col w-16">
                          <input
                            value={dateInfo.month}
                            onChange={handleDateChange('month')}
                            className="border rounded p-2 text-sm"
                            placeholder="1"
                          />
                        </div>
                        <div className="flex flex-col w-16">
                          <input
                            value={dateInfo.day}
                            onChange={handleDateChange('day')}
                            className="border rounded p-2 text-sm"
                            placeholder="7"
                          />
                        </div>
                        <input
                          value={dateInfo.time || ''}
                          onChange={handleDateChange('time')}
                          className="border rounded p-2 text-sm flex-1"
                          placeholder="오후 1시 (선택)"
                        />
                      </div>
                    </div>
                  </SortableItem>
                );
              }

              // VENUE BLOCK
              if (block.type === 'venue') {
                const venueInfo = typeof block.content !== 'string' && 'name' in block.content
                  ? block.content as VenueInfo
                  : { name: '', address: '', hall: '' };
                
                const handleVenueChange = (field: keyof VenueInfo) => (
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  updateBlock(block.id, {
                    ...venueInfo,
                    [field]: e.target.value,
                  });
                };

                return (
                  <SortableItem key={block.id} id={block.id}>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">{block.type} BLOCK</span>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                          <input
                            value={venueInfo.name}
                            onChange={handleVenueChange('name')}
                            className="border rounded p-2 text-sm"
                            placeholder="예식장 이름"
                          />
                        </div>
                        <input
                          value={venueInfo.hall || ''}
                          onChange={handleVenueChange('hall')}
                          className="border rounded p-2 text-sm"
                          placeholder="홀 이름 (선택)"
                        />
                        <div className="flex flex-col">
                          <textarea
                            value={venueInfo.address}
                            onChange={handleVenueChange('address')}
                            className="border rounded p-2 text-sm"
                            rows={2}
                            placeholder="주소"
                          />
                        </div>
                      </div>
                    </div>
                  </SortableItem>
                );
              }

              // MAP BLOCK
              if (block.type === 'map') {
                const mapInfo = typeof block.content !== 'string' && 'placeName' in block.content
                  ? block.content as MapInfo
                  : { placeName: '', address: '', latitude: undefined, longitude: undefined };

                return (
                  <SortableItem key={block.id} id={block.id}>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">{block.type} BLOCK</span>
                      <MapBlockEditor
                        mapInfo={mapInfo}
                        onUpdate={(info) => updateBlock(block.id, info)}
                      />
                    </div>
                  </SortableItem>
                );
              }

              return null;
            })}
          
        </SortableContext>
      </DndContext>

      {/* 공유 모달 */}
      <ShareModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        url={shareUrl}
        blocks={blocks}
      />
    </div>
  );
}