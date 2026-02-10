'use client';

import { useState, useMemo } from 'react';
import { Player } from '@remotion/player';
import { Slideshow } from '@/remotion/Slideshow';
import { compileTemplate } from '@/remotion/lib/template-engine';
import { ThemeSchema } from '@/remotion/lib/schema';

// Templates
import { WeddingSampleTemplate } from '@/remotion/templates/wedding-sample';
import { SpringLovelyTemplate } from '@/remotion/templates/spring-lovely';
import { FilmClassicTemplate } from '@/remotion/templates/film-classic';
import { ModernCityTemplate } from '@/remotion/templates/modern-city';
import { OttStyleTemplate } from '@/remotion/templates/ott-style';
import { SunsetGlowTemplate } from '@/remotion/templates/sunset-glow';
import { SummerBeachTemplate } from '@/remotion/templates/summer-beach';
import { KitschRetroTemplate } from '@/remotion/templates/kitsch-retro';

const templates = [
  { id: 'Wedding-Default', name: '기본 웨딩', description: '클래식하고 우아한 기본 템플릿', emoji: '💍', template: WeddingSampleTemplate },
  { id: 'Wedding-Spring', name: '봄날 러블리', description: '핑크빛 로맨틱한 봄 분위기', emoji: '🌸', template: SpringLovelyTemplate },
  { id: 'Wedding-Film', name: '필름 클래식', description: '흑백 영화 같은 감성', emoji: '🎬', template: FilmClassicTemplate },
  { id: 'Wedding-Modern', name: '모던 시티', description: '깔끔하고 세련된 도시 스타일', emoji: '🏙️', template: ModernCityTemplate },
  { id: 'Wedding-OTT', name: 'OTT 스타일', description: '넷플릭스 같은 현대적 느낌', emoji: '📺', template: OttStyleTemplate },
  { id: 'Wedding-Sunset', name: '노을 감성', description: '따뜻한 노을빛 분위기', emoji: '🌅', template: SunsetGlowTemplate },
  { id: 'Wedding-Summer', name: '썸머 비치', description: '시원한 여름 바다 느낌', emoji: '🏖️', template: SummerBeachTemplate },
  { id: 'Wedding-Kitsch', name: '키치 레트로', description: '톡톡 튀는 레트로 감성', emoji: '🎨', template: KitschRetroTemplate },
];

// Mock user assets (기본 미리보기용 - 충분한 이미지 제공)
const mockUserAssets = {
  images: {
    "image_1": "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Wedding couple
    "image_2": "https://plus.unsplash.com/premium_photo-1682097672061-69f2942c3255?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0", // Flowers
    "image_3": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Rings
    "image_4": "https://images.unsplash.com/photo-1504642635227-12ab2b71b540?q=80&w=776&auto=format&fit=crop&ixlib=rb-4.1.0", // Groom
    "image_5": "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Bride
    "image_6": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Happy couple
    "image_7": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Ceremony
    "image_8": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Bouquet
    "image_9": "https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Reception
    "image_10": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Couple walking
    "image_11": "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Romantic
    "image_12": "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Venue
    "image_13": "https://images.unsplash.com/photo-1525258831537-5a2d4ea10ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Decoration
    "image_14": "https://images.unsplash.com/photo-1591604466107-ec97de577aff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Couple portrait
    "image_15": "https://images.unsplash.com/photo-1529634597217-42e3c5c2d1d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Celebration
  },
  texts: {
    "intro_message": "저희의 새로운 시작을 함께해주세요",
  }
};

interface DraggableItem {
  left: number;
  top: number;
  width: number;
  height: number;
  isDragging: boolean;
}

export default function VideoEditorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('Wedding-Default');
  const [showTemplates, setShowTemplates] = useState(true);
  const [uploadedAssets, setUploadedAssets] = useState<Record<string, string>>({});
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  const [draggableItems, setDraggableItems] = useState<Record<string, DraggableItem>>({});

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setDraggableItems({}); // Reset positions on template change
  };

  const handleDragStart = (id: string) => {
    setDraggableItems(prev => {
      // If item doesn't exist, initialize it with default position
      if (!prev[id]) {
        // Extract index from id (e.g., "item-0-img-2" -> 2)
        const match = id.match(/-img-(\d+)$/);
        const index = match ? parseInt(match[1]) : 0;
        
        const isTop = index < 2;
        const isLeft = index % 2 === 0;
        
        return {
          ...prev,
          [id]: {
            left: isLeft ? 0 : 960,
            top: isTop ? 0 : 540,
            width: 960,
            height: 540,
            isDragging: true,
          }
        };
      }
      
      return {
        ...prev,
        [id]: {
          ...prev[id],
          isDragging: true,
        }
      };
    });
  };

  const handleDragMove = (id: string, left: number, top: number) => {
    setDraggableItems(prev => {
      const current = prev[id];
      if (!current) return prev;
      
      return {
        ...prev,
        [id]: {
          ...current,
          left,
          top,
        }
      };
    });
  };

  const handleDragEnd = (id: string) => {
    setDraggableItems(prev => {
      const draggedItem = prev[id];
      if (!draggedItem) return prev;

      // Define grid positions (a=top-left, b=top-right, c=bottom-left, d=bottom-right)
      const gridPositions = [
        { left: 0, top: 0 },       // a: top-left
        { left: 960, top: 0 },     // b: top-right
        { left: 0, top: 540 },     // c: bottom-left
        { left: 960, top: 540 },   // d: bottom-right
      ];

      // Find closest grid position
      const draggedCenterX = draggedItem.left + draggedItem.width / 2;
      const draggedCenterY = draggedItem.top + draggedItem.height / 2;

      let closestGridIndex = 0;
      let closestGridDistance = Infinity;

      gridPositions.forEach((pos, index) => {
        const gridCenterX = pos.left + 480; // 960 / 2
        const gridCenterY = pos.top + 270;  // 540 / 2
        
        const distance = Math.sqrt(
          Math.pow(draggedCenterX - gridCenterX, 2) + 
          Math.pow(draggedCenterY - gridCenterY, 2)
        );

        if (distance < closestGridDistance) {
          closestGridDistance = distance;
          closestGridIndex = index;
        }
      });

      const targetPosition = gridPositions[closestGridIndex];

      // Find if another item is already at this position
      const blockPrefix = id.substring(0, id.lastIndexOf('-'));
      const siblings = Object.entries(prev).filter(([key]) => 
        key.startsWith(blockPrefix) && key !== id
      );

      let swapTargetId: string | null = null;
      
      siblings.forEach(([siblingId, sibling]) => {
        // Check if sibling is at the target position
        if (Math.abs(sibling.left - targetPosition.left) < 50 && 
            Math.abs(sibling.top - targetPosition.top) < 50) {
          swapTargetId = siblingId;
        }
      });

      // Perform swap or snap
      if (swapTargetId) {
        // Swap positions
        const draggedOriginalPos = { left: draggedItem.left, top: draggedItem.top };
        
        return {
          ...prev,
          [id]: { 
            ...draggedItem, 
            left: targetPosition.left, 
            top: targetPosition.top,
            isDragging: false 
          },
          [swapTargetId]: { 
            ...prev[swapTargetId], 
            left: draggedOriginalPos.left, 
            top: draggedOriginalPos.top 
          },
        };
      } else {
        // Just snap to position
        return {
          ...prev,
          [id]: { 
            ...draggedItem, 
            left: targetPosition.left, 
            top: targetPosition.top,
            isDragging: false 
          },
        };
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newAssets: Record<string, string> = {};
    let filesProcessed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        // 현재 업로드된 asset 개수 계산
        const currentAssetCount = Object.keys(uploadedAssets).length + Object.keys(newAssets).length;
        
        // 업로드 순서대로 image_1, image_2, image_3... 으로 할당
        const assetKey = `image_${currentAssetCount + 1}`;
        
        newAssets[assetKey] = result;
        filesProcessed++;

        // 모든 파일 처리 완료 시 state 업데이트
        if (filesProcessed === files.length) {
          setUploadedAssets((prev) => ({
            ...prev,
            ...newAssets,
          }));
          // input 초기화하여 같은 파일도 다시 선택 가능하게
          event.target.value = '';
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteAsset = (assetKey: string) => {
    setUploadedAssets((prev) => {
      const newAssets = { ...prev };
      delete newAssets[assetKey];
      return newAssets;
    });
  };

  const handleAssetDragStart = (key: string) => {
    setDraggedKey(key);
  };

  const handleAssetDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAssetDrop = (targetKey: string) => {
    if (!draggedKey || draggedKey === targetKey) {
      setDraggedKey(null);
      return;
    }

    setUploadedAssets((prev) => {
      const entries = Object.entries(prev);
      const draggedIndex = entries.findIndex(([key]) => key === draggedKey);
      const targetIndex = entries.findIndex(([key]) => key === targetKey);

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      // Swap positions
      const newEntries = [...entries];
      const [draggedEntry] = newEntries.splice(draggedIndex, 1);
      newEntries.splice(targetIndex, 0, draggedEntry);

      // Reassign keys based on new order (image_1, image_2, image_3...)
      const reorderedAssets: Record<string, string> = {};
      newEntries.forEach(([, dataUrl], index) => {
        const newKey = `image_${index + 1}`;
        reorderedAssets[newKey] = dataUrl;
      });

      return reorderedAssets;
    });

    setDraggedKey(null);
  };

  // Count how many image slots the current template uses
  const templateImageSlotCount = useMemo(() => {
    const currentTemplate = templates.find(t => t.id === selectedTemplate);
    if (!currentTemplate) return 0;

    let count = 0;
    currentTemplate.template.items.forEach((item) => {
      if (item.type === 'image' && typeof item.src === 'object' && item.src !== null && '__type' in item.src) {
        count++;
      } else if (item.type === 'grid' && item.images) {
        item.images.forEach((img) => {
          if (typeof img === 'object' && img !== null && '__type' in img) {
            count++;
          }
        });
      } else if (item.type === 'split' && typeof item.src === 'object' && item.src !== null && '__type' in item.src) {
        count++;
      } else if (item.type === 'feature-grid' && item.images) {
        item.images.forEach((img) => {
          if (typeof img === 'object' && img !== null && '__type' in img) {
            count++;
          }
        });
      }
    });
    return count;
  }, [selectedTemplate]);

  // Compile template with user assets
  const compositionData = useMemo(() => {
    const currentTemplate = templates.find(t => t.id === selectedTemplate);
    if (!currentTemplate) return null;

    // 사용자가 업로드한 이미지가 있으면 사용, 없으면 기본 mock 이미지 사용
    const hasUploadedImages = Object.keys(uploadedAssets).length > 0;
    
    const userAssets = {
      images: hasUploadedImages ? uploadedAssets : mockUserAssets.images,
      texts: mockUserAssets.texts,
    };

    const compiledItems = compileTemplate(currentTemplate.template, userAssets);
    const totalDuration = compiledItems.reduce((acc, item) => acc + item.duration, 0);
    const theme = currentTemplate.template.theme ? ThemeSchema.parse(currentTemplate.template.theme) : undefined;

    return {
      items: compiledItems,
      theme,
      duration: totalDuration,
      fps: selectedTemplate === 'Wedding-Film' ? 24 : 30,
    };
  }, [selectedTemplate, uploadedAssets]);

  return (
    <div className="h-[calc(100vh-73px)] w-full flex bg-background">
      {/* Left Sidebar - Template Gallery */}
      <div className={`${showTemplates ? 'w-80' : 'w-16'} border-r border-border bg-background transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-border flex-shrink-0">
          {showTemplates ? (
            <>
              <h2 className="text-lg font-semibold text-foreground mb-1">템플릿 선택</h2>
              <p className="text-sm text-muted-foreground">원하시는 스타일을 골라주세요</p>
            </>
          ) : (
            <button
              onClick={() => setShowTemplates(true)}
              className="w-full p-2 hover:bg-muted rounded-lg transition-colors"
              title="템플릿 보기"
            >
              <svg className="w-6 h-6 mx-auto text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Scrollable Content Area */}
        {showTemplates && (
          <div className="flex-1 overflow-y-auto">
            {/* Template List */}
            <div className="p-4 space-y-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                  selectedTemplate === template.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{template.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                  </div>
                </div>
              </button>
            ))}
            </div>

            {/* Asset Upload Section */}
            <div className="p-4 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">사진 & 영상 추가</h3>
            <label className="block">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                <svg className="w-8 h-8 mx-auto mb-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm text-foreground font-medium">파일 업로드</p>
                <p className="text-xs text-muted-foreground mt-1">사진이나 영상을 선택하세요</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*,video/*" 
                multiple 
                onChange={handleFileUpload}
              />
            </label>
            
            {/* Uploaded Assets List */}
            {Object.keys(uploadedAssets).length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-foreground mb-1">업로드된 파일 ({Object.keys(uploadedAssets).length}개)</p>
                <p className="text-[10px] text-muted-foreground mb-2">드래그하여 순서 변경 • 템플릿의 모든 이미지에 순서대로 적용됩니다</p>
                {Object.keys(uploadedAssets).length > templateImageSlotCount && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-2">
                    <p className="text-[10px] text-amber-800">
                      ⚠️ 현재 템플릿은 {templateImageSlotCount}장의 이미지를 사용합니다. 처음 {templateImageSlotCount}장만 영상에 표시됩니다.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(uploadedAssets).map(([key, dataUrl]) => (
                    <div 
                      key={key} 
                      draggable
                      onDragStart={() => handleAssetDragStart(key)}
                      onDragOver={handleAssetDragOver}
                      onDrop={() => handleAssetDrop(key)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 group cursor-move transition-all ${
                        draggedKey === key 
                          ? 'border-primary opacity-50 scale-95' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img 
                        src={dataUrl} 
                        alt={key}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-1 py-0.5 text-center">
                        {key}
                      </div>
                      <button
                        onClick={() => handleDeleteAsset(key)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                        title="삭제"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {/* Drag handle indicator */}
                      <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Video Player */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {templates.find(t => t.id === selectedTemplate)?.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {templates.find(t => t.id === selectedTemplate)?.description}
              </p>
            </div>
            <button 
              onClick={() => alert('아직 미완성된 기능입니다')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              영상 내보내기
            </button>
          </div>
        </div>

        {/* Player Area */}
        <div className="flex-1 flex items-center justify-center bg-muted/30 p-8">
          <div className="w-full max-w-5xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden">
            {compositionData ? (
              <Player
                component={Slideshow}
                inputProps={{
                  items: compositionData.items,
                  theme: compositionData.theme,
                  draggableItems: draggableItems,
                  onDragStart: handleDragStart,
                  onDragMove: handleDragMove,
                  onDragEnd: handleDragEnd,
                }}
                durationInFrames={compositionData.duration}
                fps={compositionData.fps}
                compositionWidth={1920}
                compositionHeight={1080}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                controls
                clickToPlay
                doubleClickToFullscreen
                spaceKeyToPlayOrPause
                moveToBeginningWhenEnded
                showVolumeControls
                allowFullscreen
                renderLoading={() => (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <p className="text-white">로딩 중...</p>
                  </div>
                )}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white">Loading...</p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex items-center justify-center gap-4">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
