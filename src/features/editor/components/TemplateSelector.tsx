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
          <div className="grid grid-cols-1 gap-1">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template.data, template.theme)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-all duration-200 group border border-transparent hover:border-gray-100"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors truncate">
                        {template.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 truncate group-hover:text-gray-600">
                      {template.description}
                    </div>
                  </div>
                  <div className="shrink-0 text-[10px] font-medium bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary px-2 py-1 rounded-full transition-colors">
                    {template.data.length} blocks
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
