// features/wedding/components/TemplateSelector.tsx
'use client';

import { useState } from 'react';
import { useBlockStore } from "@/store/useBlockStore";
import { TEMPLATES } from "@/features/wedding/templates/presets";
import { Block, GlobalTheme } from '@/shared/types/block';

export default function TemplateSelector() {
  const { setBlocks, setTheme } = useBlockStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTemplate = (templateData: Block[], templateTheme: GlobalTheme) => {
    if (confirm("현재 작성 중인 내용이 사라지고 선택한 템플릿으로 변경됩니다. 계속하시겠습니까?")) {
      const newBlocks = JSON.parse(JSON.stringify(templateData));
      setBlocks(newBlocks);
      setTheme(templateTheme);
      setIsOpen(false);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">🎨</span>
          <span>템플릿 선택하기</span>
        </span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
            원하시는 스타일을 선택해주세요
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template.data, template.theme)}
                className="px-4 py-4 text-left bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="text-base font-semibold text-gray-800 group-hover:text-blue-600 mb-1">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {template.description}
                    </div>
                  </div>
                  <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    {template.data.length}개 블록
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

