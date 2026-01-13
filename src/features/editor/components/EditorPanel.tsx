// features/editor/components/EditorPanel.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBlockStore } from '@/store/useBlockStore';
import SortableItem from './SortableItem';
import { updateProject, createProject, projectExists } from '@/shared/utils/storage';
import ShareModal from '@/features/share/components/ShareModal';
import TemplateSelector from '@/features/wedding/components/TemplateSelector';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useBlockManagement } from '../hooks/useBlockManagement';
import { CoupleInfo, WeddingDate, VenueInfo } from '@/shared/types/block';

interface EditorPanelProps {
  projectId?: string;
}

export default function EditorPanel({ projectId }: EditorPanelProps = {}) {
  const router = useRouter();
  const { theme } = useBlockStore();
  const { blocks, updateBlock } = useBlockManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Drag and Drop 로직 (Hook으로 분리)
  const { handleDragEnd } = useDragAndDrop(blocks, useBlockStore.getState().setBlocks);

  // 저장 버튼 클릭 시
  const handleSave = () => {
    let currentProjectId = projectId;
    
    // 프로젝트 ID가 없거나 존재하지 않으면 새로 생성
    if (!currentProjectId || !projectExists(currentProjectId)) {
      currentProjectId = createProject(blocks, theme);
      // 새 프로젝트 생성 시 편집 페이지로 리다이렉트
      router.push(`/${currentProjectId}/edit`);
    } else {
      // 기존 프로젝트 업데이트
      updateProject(currentProjectId, blocks, theme);
    }
    
    // Phase 2 요구사항: /[projectId]/view 라우팅 사용
    const url = `${window.location.origin}/${currentProjectId}/view`;
    
    setShareUrl(url);
    setIsModalOpen(true);
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
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          💾 저장 & 공유하기
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
                const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                  updateBlock(block.id, e.target.value);
                };
                const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      updateBlock(block.id, reader.result as string);
                    };
                    reader.readAsDataURL(file);
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
                          <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-blue-300 rounded p-3 cursor-pointer hover:bg-blue-50 transition-colors">
                            <span className="text-2xl">📁</span>
                            <span className="text-sm font-medium text-blue-600">
                              이미지 파일 선택
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
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