// features/wedding/components/TemplateSelector.tsx
'use client';

import { useState } from 'react';
import { useBlockStore } from "@/store/useBlockStore";
import { TEMPLATES } from "@/features/wedding/templates/presets";
import { Block, GlobalTheme } from '@/shared/types/block';
import { BlockSchema } from '@/shared/types/schema';
import { z } from 'zod';

export default function TemplateSelector() {
  const { blocks, setBlocks, setTheme } = useBlockStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTemplate = (templateData: Block[], templateTheme: GlobalTheme) => {
    // 1. 현재 데이터에서 유지할 중요 정보 추출
    const currentData = {
      couple_info: blocks.find(b => b.type === 'couple_info')?.content,
      date: blocks.find(b => b.type === 'date')?.content,
      map: blocks.find(b => b.type === 'map')?.content,
      account: blocks.find(b => b.type === 'account')?.content,
      dday: blocks.find(b => b.type === 'dday')?.content,
      // 첫 번째 이미지 블록을 대표 이미지로 간주
      mainImage: blocks.find(b => b.type === 'image' && typeof b.content === 'string' && b.content.length > 0)?.content,
    };

    if (confirm("템플릿을 변경하시겠습니까?\n(입력된 주요 데이터는 유지됩니다)")) {
      try {
        // 2. 새 템플릿 복사
        const newBlocks = JSON.parse(JSON.stringify(templateData));
        
        // 3. 데이터 주입 (Smart Merge)
        let imageInjected = false;

        const mergedBlocks = newBlocks.map((block: Block) => {
          // 각 타입별로 기존 데이터가 있으면 덮어씌움
          if (block.type === 'couple_info' && currentData.couple_info) {
            return { ...block, content: currentData.couple_info };
          }
          if (block.type === 'date' && currentData.date) {
            return { ...block, content: currentData.date };
          }
          if (block.type === 'map' && currentData.map) {
            return { ...block, content: currentData.map };
          }
          if (block.type === 'account' && currentData.account) {
            return { ...block, content: currentData.account };
          }
          if (block.type === 'dday' && currentData.dday) {
            return { ...block, content: currentData.dday };
          }
          // 이미지는 첫 번째 이미지 블록에만 기존 대표 이미지를 적용
          if (block.type === 'image' && currentData.mainImage && !imageInjected) {
            imageInjected = true;
            return { ...block, content: currentData.mainImage };
          }
          return block;
        });

        // 4. Zod를 이용한 데이터 무결성 검증
        const validationResult = z.array(BlockSchema).safeParse(mergedBlocks);
        
        if (!validationResult.success) {
          console.error("템플릿 데이터 검증 실패:", validationResult.error);
          alert("데이터 변환 중 오류가 발생했습니다. 개발자에게 문의해주세요.");
          return;
        }

        // 5. 검증된 데이터 적용
        setBlocks(mergedBlocks);
        setTheme(templateTheme);
        setIsOpen(false);

      } catch (error) {
        console.error("템플릿 변경 오류:", error);
        alert("템플릿 변경 중 오류가 발생했습니다.");
      }
    }
  };

  const handleSelectStyleOnly = (templateData: Block[], templateTheme: GlobalTheme) => {
    // 1. 타겟 템플릿의 블록 타입별 대표 스타일 추출
    const styleMap = new Map<string, Block['styles']>();
    
    for (const templateBlock of templateData) {
      // 각 타입별로 첫 번째로 발견되는 블록의 스타일을 '대표 스타일'로 간주
      if (!styleMap.has(templateBlock.type) && templateBlock.styles) {
        styleMap.set(templateBlock.type, templateBlock.styles);
      }
    }

    // 2. 현재 블록들에 스타일 적용
    const newBlocks = blocks.map(block => {
      // 텍스트 블록은 제목/본문 등 역할이 다양하므로 스타일을 함부로 덮어쓰지 않음
      if (block.type === 'text') {
        return block;
      }

      // 나머지 컴포넌트형 블록(이미지, 정보, 날짜 등)은 템플릿의 대표 스타일을 적용
      const templateStyle = styleMap.get(block.type);
      if (templateStyle) {
        return {
          ...block,
          styles: {
            ...templateStyle
          }
        };
      }
      
      // 템플릿에 해당 블록 타입이 없으면 기존 스타일 유지
      return block;
    });

    setBlocks(newBlocks);
    setTheme(templateTheme);
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group"
      >
        <span className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-lg">
            🎨
          </span>
          <span className="text-base">템플릿 변경하기</span>
        </span>
        <span className={`text-gray-400 group-hover:text-primary transition-colors transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 p-2 bg-white rounded-xl shadow-lg border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-2 py-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">
              스타일 선택
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-gray-700">
                        {template.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {template.description}
                    </div>
                  </div>
                  <div className="shrink-0 text-[10px] font-medium bg-white text-gray-500 px-2 py-1 rounded-full border border-gray-100">
                    {template.data.length} blocks
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectStyleOnly(template.data, template.theme)}
                    className="flex-1 px-3 py-2 text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
                  >
                    🎨 스타일만 적용
                  </button>
                  <button
                    onClick={() => handleSelectTemplate(template.data, template.theme)}
                    className="flex-1 px-3 py-2 text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
                  >
                    📄 전체 변경
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
