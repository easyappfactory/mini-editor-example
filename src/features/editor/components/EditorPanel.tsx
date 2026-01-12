// features/editor/components/EditorPanel.tsx
'use client';

import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBlockStore } from '@/store/useBlockStore';
import SortableItem from './SortableItem';
import { saveProject } from '@/shared/utils/storage';
import ShareModal from '@/features/share/components/ShareModal';
import TemplateSelector from '@/features/wedding/components/TemplateSelector';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useBlockOperations } from '../hooks/useBlockOperations';

export default function EditorPanel() {
  const { theme } = useBlockStore();
  const { blocks, updateBlock } = useBlockOperations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Drag and Drop 로직 (Hook으로 분리)
  const { handleDragEnd } = useDragAndDrop(blocks, useBlockStore.getState().setBlocks);

  // 저장 버튼 클릭 시
  const handleSave = () => {
    const id = saveProject(blocks, theme);
    const url = `${window.location.origin}/view/${id}`;
    
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
            
            {blocks.map((block) => (
              // 3. 아까 만든 움직이는 껍데기
              <SortableItem key={block.id} id={block.id}>
              
              {/* 블록 타입에 따라 다른 입력창 보여주기 */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase">{block.type} BLOCK</span>
                
                {block.type === 'text' ? (
                  <textarea
                    className="w-full border rounded p-2 text-sm"
                    rows={3}
                    value={typeof block.content === 'string' ? block.content : ''}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                  />
                ) : block.type === 'image' ? (
                  <div className="flex flex-col gap-3">
                    {/* URL 입력 */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        이미지 URL
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded p-2 text-sm"
                        value={typeof block.content === 'string' ? block.content : ''}
                        placeholder="https://example.com/image.jpg"
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                      />
                    </div>

                    {/* 구분선 */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="text-xs text-gray-500">또는</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* 파일 업로드 버튼 */}
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
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updateBlock(block.id, reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* 현재 이미지 미리보기 */}
                    {typeof block.content === 'string' && block.content && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">미리보기:</p>
                        <img 
                          src={block.content} 
                          alt="Preview" 
                          className="w-full h-20 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                ) : block.type === 'couple_info' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="border rounded p-2 text-sm"
                      placeholder="신랑 이름"
                      value={typeof block.content !== 'string' && 'groomName' in block.content ? block.content.groomName : ''}
                      onChange={(e) => {
                        const content = typeof block.content !== 'string' ? block.content : { groomName: '', groomFather: '', groomMother: '', brideName: '', brideFather: '', brideMother: '' };
                        updateBlock(block.id, { ...content, groomName: e.target.value });
                      }}
                    />
                    <input
                      className="border rounded p-2 text-sm"
                      placeholder="신부 이름"
                      value={typeof block.content !== 'string' && 'brideName' in block.content ? block.content.brideName : ''}
                      onChange={(e) => {
                        const content = typeof block.content !== 'string' ? block.content : { groomName: '', groomFather: '', groomMother: '', brideName: '', brideFather: '', brideMother: '' };
                        updateBlock(block.id, { ...content, brideName: e.target.value });
                      }}
                    />
                    <input
                      className="border rounded p-2 text-sm col-span-2"
                      placeholder="신랑 아버지"
                      value={typeof block.content !== 'string' && 'groomFather' in block.content ? block.content.groomFather : ''}
                      onChange={(e) => {
                        const content = typeof block.content !== 'string' ? block.content : { groomName: '', groomFather: '', groomMother: '', brideName: '', brideFather: '', brideMother: '' };
                        updateBlock(block.id, { ...content, groomFather: e.target.value });
                      }}
                    />
                    <input
                      className="border rounded p-2 text-sm col-span-2"
                      placeholder="신랑 어머니"
                      value={typeof block.content !== 'string' && 'groomMother' in block.content ? block.content.groomMother : ''}
                      onChange={(e) => {
                        const content = typeof block.content !== 'string' ? block.content : { groomName: '', groomFather: '', groomMother: '', brideName: '', brideFather: '', brideMother: '' };
                        updateBlock(block.id, { ...content, groomMother: e.target.value });
                      }}
                    />
                    <input
                      className="border rounded p-2 text-sm col-span-2"
                      placeholder="신부 아버지"
                      value={typeof block.content !== 'string' && 'brideFather' in block.content ? block.content.brideFather : ''}
                      onChange={(e) => {
                        const content = typeof block.content !== 'string' ? block.content : { groomName: '', groomFather: '', groomMother: '', brideName: '', brideFather: '', brideMother: '' };
                        updateBlock(block.id, { ...content, brideFather: e.target.value });
                      }}
                    />
                    <input
                      className="border rounded p-2 text-sm col-span-2"
                      placeholder="신부 어머니"
                      value={typeof block.content !== 'string' && 'brideMother' in block.content ? block.content.brideMother : ''}
                      onChange={(e) => {
                        const content = typeof block.content !== 'string' ? block.content : { groomName: '', groomFather: '', groomMother: '', brideName: '', brideFather: '', brideMother: '' };
                        updateBlock(block.id, { ...content, brideMother: e.target.value });
                      }}
                    />
                  </div>
                ) : block.type === 'date' ? (
                  <div className="flex gap-2">
                    <input
                      className="border rounded p-2 text-sm w-20"
                      placeholder="2026"
                      value={typeof block.content !== 'string' && 'year' in block.content ? block.content.year : ''}
                      onChange={(e) => {
                        const content = typeof block.content !== 'string' && 'year' in block.content ? block.content : { year: '', month: '', day: '' };
                        updateBlock(block.id, { ...content, year: e.target.value });
                      }}
                    />
                    <input
                      className="border rounded p-2 text-sm w-16"
                      placeholder="1"
                      value={typeof block.content !== 'string' && 'month' in block.content ? block.content.month : ''}
                      onChange={(e) => {
                        const content = typeof block.content !== 'string' && 'year' in block.content ? block.content : { year: '', month: '', day: '' };
                        updateBlock(block.id, { ...content, month: e.target.value });
                      }}
                    />
                    <input
                      className="border rounded p-2 text-sm w-16"
                      placeholder="7"
                      value={typeof block.content !== 'string' && 'day' in block.content ? block.content.day : ''}
                      onChange={(e) => {
                        const content = typeof block.content !== 'string' && 'year' in block.content ? block.content : { year: '', month: '', day: '' };
                        updateBlock(block.id, { ...content, day: e.target.value });
                      }}
                    />
                    <input
                      className="border rounded p-2 text-sm flex-1"
                      placeholder="오후 1시 (선택)"
                      value={typeof block.content !== 'string' && 'time' in block.content ? block.content.time || '' : ''}
                      onChange={(e) => {
                        const content = typeof block.content !== 'string' && 'year' in block.content ? block.content : { year: '', month: '', day: '' };
                        updateBlock(block.id, { ...content, time: e.target.value });
                      }}
                    />
                  </div>
                ) : block.type === 'venue' ? (
                  <div className="flex flex-col gap-2">
                    <input
                      className="border rounded p-2 text-sm"
                      placeholder="예식장 이름"
                      value={typeof block.content !== 'string' && 'name' in block.content ? block.content.name : ''}
                      onChange={(e) => {
                        const content = typeof block.content !== 'string' && 'name' in block.content ? block.content : { name: '', address: '' };
                        updateBlock(block.id, { ...content, name: e.target.value });
                      }}
                    />
                    <input
                      className="border rounded p-2 text-sm"
                      placeholder="홀 이름 (선택)"
                      value={typeof block.content !== 'string' && 'hall' in block.content ? block.content.hall || '' : ''}
                      onChange={(e) => {
                        const content = typeof block.content !== 'string' && 'name' in block.content ? block.content : { name: '', address: '' };
                        updateBlock(block.id, { ...content, hall: e.target.value });
                      }}
                    />
                    <textarea
                      className="border rounded p-2 text-sm"
                      rows={2}
                      placeholder="주소"
                      value={typeof block.content !== 'string' && 'address' in block.content ? block.content.address : ''}
                      onChange={(e) => {
                        const content = typeof block.content !== 'string' && 'name' in block.content ? block.content : { name: '', address: '' };
                        updateBlock(block.id, { ...content, address: e.target.value });
                      }}
                    />
                  </div>
                ) : null}
              </div>

            </SortableItem>
          ))}
          
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