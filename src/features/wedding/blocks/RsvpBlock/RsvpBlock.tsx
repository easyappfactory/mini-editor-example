'use client';

import { useState } from 'react';
import { Block, RsvpContent } from '@/shared/types/block';
import RsvpModal from './RsvpModal';

interface Props {
  block: Block;
  projectId?: string;
}

export default function RsvpBlock({ block, projectId }: Props) {
  const content = block.content as RsvpContent;
  const { color: customColor, padding: customPadding, variant = 'simple' } = block.styles || {};
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Variant별 기본 스타일 정의 (Centralized Config)
  const variantConfig = {
    photo: {
      defaultColor: '#a16207',
      defaultPadding: 'py-12', // 3rem
      container: 'rounded-xl border border-stone-200',
      button: 'rounded-full px-8 py-3 font-serif',
      message: 'font-serif tracking-wide mb-8',
      buttonShadow: '0 4px 20px -2px rgba(161, 98, 7, 0.25)'
    },
    classic: {
      defaultColor: '#1c1917',
      defaultPadding: 'py-16', // 4rem
      container: 'border-y border-stone-200',
      button: 'rounded-sm px-10 py-3 font-serif uppercase tracking-widest text-xs border border-stone-800',
      message: 'font-serif mb-8 text-base',
      buttonShadow: 'none'
    },
    minimal: {
      defaultColor: '#000000',
      defaultPadding: 'py-20', // 5rem
      container: 'py-8',
      button: 'border border-current px-12 py-4 text-xs font-medium tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-300',
      message: 'font-sans font-light text-3xl mb-10 tracking-widest uppercase',
      buttonShadow: 'none'
    },
    simple: {
      defaultColor: '#576b53',
      defaultPadding: 'py-12',
      container: 'rounded-2xl border border-stone-100 bg-stone-50/50 p-8',
      button: 'w-full rounded-xl py-4 font-semibold shadow-sm hover:opacity-90 transition-opacity',
      message: 'mb-8 text-base leading-relaxed text-stone-600',
      buttonShadow: 'none'
    }
  };

  const currentVariant = variantConfig[variant as keyof typeof variantConfig] || variantConfig.simple;
  const color = customColor || currentVariant.defaultColor;
  const paddingClass = customPadding || currentVariant.defaultPadding;

  const handleOpenModal = () => {
    if (!projectId) {
      alert('편집 화면에서는 동작하지 않습니다.');
      return;
    }
    setIsModalOpen(true);
  };

  // 버튼 스타일 계산
  const getButtonStyles = () => {
    switch (variant) {
      case 'photo':
        return {
          backgroundColor: color,
          color: '#fff',
          boxShadow: currentVariant.buttonShadow
        };
      case 'classic':
        return {
          backgroundColor: 'transparent',
          color: color,
          borderColor: color
        };
      case 'minimal':
        return {
          backgroundColor: 'transparent',
          color: color,
          borderRadius: 0,
          borderColor: color
        };
      case 'simple':
      default:
        return {
          backgroundColor: color,
          color: '#fff',
        };
    }
  };

  return (
    <>
      <div 
        className={`w-full ${currentVariant.container} ${paddingClass}`}
        style={{ 
          backgroundColor: block.styles?.backgroundColor || 'transparent', 
        }}
      >
        <div className="max-w-md mx-auto text-center">
          <p 
            className={`whitespace-pre-wrap ${currentVariant.message}`}
            style={{ color: variant === 'simple' ? undefined : color }}
          >
            {content.message || '참석 여부를 알려주시면\n감사하겠습니다.'}
          </p>
          
          <button
            onClick={handleOpenModal}
            className={`transition-all ${currentVariant.button}`}
            style={getButtonStyles()}
          >
            {content.buttonText || '참석 의사 전달하기'}
          </button>
        </div>
      </div>

      {projectId && (
        <RsvpModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          projectId={projectId} 
        />
      )}
    </>
  );
}
