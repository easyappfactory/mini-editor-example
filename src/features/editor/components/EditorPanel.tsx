// features/editor/components/EditorPanel.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBlockStore } from '@/store/useBlockStore';
import SortableItem from './SortableItem';
import { updateProject, createProject } from '@/shared/utils/apiClient';
import ShareModal from '@/features/share/components/ShareModal';
import TemplateSelector from './TemplateSelector';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useBlockManagement } from '../hooks/useBlockManagement';
import { CoupleInfo, WeddingDate, MapInfo, AccountInfo, DDayContent, BlockType, type ImageGridContent } from '@/shared/types/block';
import MapBlockEditor from '../block-forms/MapBlockEditor';
import TextBlockEditor from '../block-forms/TextBlockEditor';
import ImageBlockEditor from '../block-forms/ImageBlockEditor';
import ImageGridBlockEditor from '../block-forms/ImageGridBlockEditor';
import CoupleInfoBlockEditor from '../block-forms/CoupleInfoBlockEditor';
import DateBlockEditor from '../block-forms/DateBlockEditor';
import AccountBlockEditor from '../block-forms/AccountBlockEditor';
import GuestbookBlockEditor from '../block-forms/GuestbookBlockEditor';
import DDayBlockEditor from '../block-forms/DDayBlockEditor';
import { createDefaultBlockContent, BLOCK_TYPE_NAMES } from '@/features/wedding/templates/presets';
import GridEditorModal from './GridEditorModal';
import { GRID_TEMPLATES } from '@/features/wedding/templates/gridTemplates';
import PremiumModal from '@/features/premium/components/PremiumModal';
import { isPremiumProject, setPremiumProject } from '@/shared/utils/premiumStorage';

interface EditorPanelProps {
  projectId?: string;
}

export default function EditorPanel({ projectId: propProjectId }: EditorPanelProps = {}) {
  // URL에서 직접 projectId를 읽어옴 (prop보다 우선)
  const params = useParams();
  const urlProjectId = params.projectId as string | undefined;
  
  const getProjectIdFromUrl = () => {
    if (typeof window === 'undefined') return urlProjectId || propProjectId;
    const pathMatch = window.location.pathname.match(/^\/([^\/]+)\/edit$/);
    return pathMatch ? pathMatch[1] : (urlProjectId || propProjectId);
  };
  
  const projectId = getProjectIdFromUrl();
  const { theme, title, setTitle } = useBlockStore();
  const { blocks, updateBlock, addBlock, deleteBlock } = useBlockManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showAddBlockMenu, setShowAddBlockMenu] = useState(false);
  const [editingGridBlockId, setEditingGridBlockId] = useState<string | null>(null);
  
  // 프리미엄 상태 관리
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // 프리미엄 상태 확인
  useEffect(() => {
    async function checkPremium() {
      if (projectId && projectId !== 'new') {
        const premium = await isPremiumProject(projectId);
        setIsPremium(premium);
      }
    }
    checkPremium();
  }, [projectId]);

  // Drag and Drop 로직 (Hook으로 분리)
  const { handleDragEnd } = useDragAndDrop(blocks, useBlockStore.getState().setBlocks);

  // 블록 추가 핸들러
  const handleAddBlock = (type: BlockType) => {
    const newBlock = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: createDefaultBlockContent(type),
    };
    addBlock(newBlock);
    setShowAddBlockMenu(false);
  };

  // 블록 삭제 핸들러
  const handleDeleteBlock = (id: string) => {
    if (confirm('이 블록을 삭제하시겠습니까?')) {
      deleteBlock(id);
    }
  };

  // 프리미엄 인증 성공 핸들러
  const handlePremiumSuccess = async (code: string) => {
    if (projectId && projectId !== 'new') {
      const success = await setPremiumProject(projectId, code);
      if (success) {
        setIsPremium(true);
        setShowPremiumModal(false);
        alert('🎉 프리미엄 기능이 활성화되었습니다!');
      } else {
        alert('⚠️ 프리미엄 설정에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      alert('⚠️ 먼저 프로젝트를 저장해주세요.');
      setShowPremiumModal(false);
    }
  };

  // 저장 버튼 클릭 시
  const handleSave = async () => {
    if (isSaving) return; // 이미 저장 중이면 무시

    // 프리미엄이 아니면 안내 모달 표시
    if (!isPremium && projectId && projectId !== 'new') {
      const confirmed = window.confirm(
        '데모 버전에서는 워터마크가 표시됩니다.\n\n프리미엄 코드를 입력하시겠습니까?'
      );
      if (confirmed) {
        setShowPremiumModal(true);
        return;
      }
    }
    
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
          // title도 함께 전달
          const updateSuccess = await updateProject(currentProjectId, blocks, theme, title);
          
          if (!updateSuccess) {
            // 업데이트 실패 (404) - 프로젝트가 존재하지 않음, 새로 생성
            isNewProject = true;
            currentProjectId = await createProject(blocks, theme, title);
          }
        } catch (error) {
          // 업데이트 중 에러 발생 (404가 아닌 다른 에러)
          throw error; // 에러를 다시 던져서 상위 catch에서 처리
        }
      } else {
        // projectId가 없거나 'new'인 경우 - 새 프로젝트 생성
        isNewProject = true;
        currentProjectId = await createProject(blocks, theme, title);
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
        
        // 프리미엄 상태 다시 확인 (새 프로젝트 ID로)
        const premium = await isPremiumProject(currentProjectId);
        setIsPremium(premium);
      }
    } catch (error) {
      console.error('저장 오류:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClassName = "w-full border border-border rounded-lg p-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all";
  const labelClassName = "block text-sm font-semibold text-foreground mb-2";

  return (
    <div className="w-full min-h-full bg-background p-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">청첩장 편집</h2>
      </div>

      {/* 프로젝트 제목 입력 */}
      <div className="mb-6">
        <label className={labelClassName}>
          프로젝트 이름
        </label>
        <input
          type="text"
          value={title || ''}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 우리 결혼합니다 (미입력 시 자동 생성)"
          className={inputClassName}
        />
        <p className="text-xs text-muted-foreground mt-1">
          * 프로젝트 이름은 나중에 목록에서 청첩장을 구별하는 데 사용됩니다.
        </p>
      </div>
      
      {/* 템플릿 선택기 */}
      <TemplateSelector />
      
      {/* 프리미엄 상태 표시 */}
      {projectId && projectId !== 'new' && (
        <div className="mb-6">
          {isPremium ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-800">
                  프리미엄 활성화됨
                </p>
                <p className="text-xs text-green-600">
                  워터마크 없이 저장 및 공유 가능합니다
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔒</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-800">
                    데모 버전
                  </p>
                  <p className="text-xs text-yellow-600">
                    워터마크가 표시됩니다
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all text-sm"
              >
                프리미엄 코드 입력하기
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* 저장 버튼 */}
      <div className="mb-6">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary/90 font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      {/* 블록 추가 버튼 */}
      <div className="mb-4 relative">
        <button
          onClick={() => setShowAddBlockMenu(!showAddBlockMenu)}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-semibold shadow-md transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span> + </span>
          <span>요소 추가</span>
        </button>
        
        {/* 블록 타입 선택 메뉴 */}
        {showAddBlockMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowAddBlockMenu(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
              {(Object.keys(BLOCK_TYPE_NAMES) as BlockType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleAddBlock(type)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors text-gray-700"
                >
                  <span className="text-sm font-medium">
                    {BLOCK_TYPE_NAMES[type]}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* DndContext 및 나머지 컴포넌트들... (기존 코드 유지) */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => {
            const commonWrapper = (children: React.ReactNode) => (
              <SortableItem key={block.id} id={block.id} onDelete={() => handleDeleteBlock(block.id)}>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase">{block.type} BLOCK</span>
                  {children}
                </div>
              </SortableItem>
            );

            // TEXT BLOCK
            if (block.type === 'text') {
              return commonWrapper(
                <TextBlockEditor
                  content={typeof block.content === 'string' ? block.content : ''}
                  onUpdate={(content) => updateBlock(block.id, content)}
                />
              );
            }

            // IMAGE BLOCK
            if (block.type === 'image') {
              return commonWrapper(
                <ImageBlockEditor
                  content={typeof block.content === 'string' ? block.content : ''}
                  onUpdate={(url) => updateBlock(block.id, url)}
                />
              );
            }

            // IMAGE_GRID BLOCK
            if (block.type === 'image_grid') {
              const gridContent = typeof block.content === 'object' && block.content !== null && 'type' in block.content && block.content.type === 'grid'
                ? block.content as ImageGridContent
                : null;
              
              return commonWrapper(
                <ImageGridBlockEditor
                  content={gridContent}
                  onUpdate={(content) => updateBlock(block.id, content)}
                  onEditGrid={() => setEditingGridBlockId(block.id)}
                />
              );
            }

            // COUPLE_INFO BLOCK
            if (block.type === 'couple_info') {
              const coupleInfo = typeof block.content !== 'string' && 'groomName' in block.content
                ? block.content as CoupleInfo
                : { groomName: '', groomFather: '', groomMother: '', brideName: '', brideFather: '', brideMother: '' };

              return commonWrapper(
                <CoupleInfoBlockEditor
                  content={coupleInfo}
                  onUpdate={(content) => updateBlock(block.id, content)}
                />
              );
            }

            // DATE BLOCK
            if (block.type === 'date') {
              const dateInfo = typeof block.content !== 'string' && 'year' in block.content
                ? block.content as WeddingDate
                : { year: '', month: '', day: '', time: '' };

              return commonWrapper(
                <DateBlockEditor
                  content={dateInfo}
                  onUpdate={(content) => updateBlock(block.id, content)}
                />
              );
            }

            // MAP BLOCK
            if (block.type === 'map') {
              const mapInfo = typeof block.content !== 'string' && 'placeName' in block.content
                ? block.content as MapInfo
                : { placeName: '', address: '', latitude: undefined, longitude: undefined };

              return commonWrapper(
                <MapBlockEditor
                  mapInfo={mapInfo}
                  onUpdate={(info) => updateBlock(block.id, info)}
                />
              );
            }

            // ACCOUNT BLOCK
            if (block.type === 'account') {
              const accountInfo = typeof block.content !== 'string' && 'groomAccount' in (block.content || {})
                ? block.content as AccountInfo
                : {
                    groomAccount: '',
                    groomAccountVisible: true,
                    groomFatherAccount: '',
                    groomFatherAccountVisible: true,
                    groomMotherAccount: '',
                    groomMotherAccountVisible: true,
                    brideAccount: '',
                    brideAccountVisible: true,
                    brideFatherAccount: '',
                    brideFatherAccountVisible: true,
                    brideMotherAccount: '',
                    brideMotherAccountVisible: true,
                  };

              return commonWrapper(
                <AccountBlockEditor
                  content={accountInfo}
                  onUpdate={(content) => updateBlock(block.id, content)}
                />
              );
            }

            // GUESTBOOK BLOCK
            if (block.type === 'guestbook') {
              return commonWrapper(<GuestbookBlockEditor />);
            }

            // DDAY BLOCK
            if (block.type === 'dday') {
              const ddayInfo = typeof block.content !== 'string' && 'weddingDateTime' in block.content
                ? block.content as DDayContent
                : { weddingDateTime: '', title: '결혼식까지' };

              return commonWrapper(
                <DDayBlockEditor
                  content={ddayInfo}
                  onUpdate={(content) => updateBlock(block.id, content)}
                />
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

      {/* 그리드 에디터 모달 */}
      {editingGridBlockId && (
        <GridEditorModal
          initialData={
            blocks.find(b => b.id === editingGridBlockId)?.content &&
            typeof blocks.find(b => b.id === editingGridBlockId)?.content === 'object' &&
            blocks.find(b => b.id === editingGridBlockId)?.content !== null &&
            'type' in (blocks.find(b => b.id === editingGridBlockId)?.content as object) &&
            (blocks.find(b => b.id === editingGridBlockId)?.content as ImageGridContent).type === 'grid'
              ? (blocks.find(b => b.id === editingGridBlockId)?.content as ImageGridContent)
              : undefined
          }
          onSave={(gridContent) => {
            if (editingGridBlockId) {
              updateBlock(editingGridBlockId, gridContent);
              setEditingGridBlockId(null);
            }
          }}
          onClose={() => setEditingGridBlockId(null)}
        />
      )}

      {/* 프리미엄 모달 */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSuccess={handlePremiumSuccess}
        projectId={projectId}
      />
    </div>
  );
}
