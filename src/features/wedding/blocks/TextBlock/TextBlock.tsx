// features/wedding/blocks/TextBlock/TextBlock.tsx
import { Block } from "@/shared/types/block";
import { useTextBlock } from "./useTextBlock";

interface Props {
  block: Block;
}

export default function TextBlock({ block }: Props) {
  // Headless Hook: 로직과 UI 분리
  const { content, styles } = useTextBlock(block);
  const { variant = 'simple-body', className, padding: customPadding, fontSize: customFontSize, color: customColor, align: customAlign } = block.styles || {};

  // Variant Config: 각 텍스트 스타일의 기본값 정의
  const variantConfig: Record<string, { 
    base: string; 
    defaultPadding: string;
    defaultFontSize: string;
    defaultColor: string;
    defaultAlign: 'left' | 'center' | 'right';
  }> = {
    // Simple Theme
    'simple-intro': {
      base: 'font-sans tracking-[0.2em] uppercase',
      defaultPadding: 'pt-12 pb-4',
      defaultFontSize: '12px',
      defaultColor: '#a8a29e',
      defaultAlign: 'center'
    },
    'simple-body': {
      base: 'font-sans leading-relaxed',
      defaultPadding: 'py-12 px-6',
      defaultFontSize: '15px',
      defaultColor: '#44403c',
      defaultAlign: 'center'
    },
    
    // Photo Theme
    'photo-label': {
      base: 'font-serif tracking-wide',
      defaultPadding: 'pt-4 pb-2',
      defaultFontSize: '16px',
      defaultColor: '#a16207',
      defaultAlign: 'center'
    },
    'photo-title': {
      base: 'font-serif',
      defaultPadding: 'pb-8',
      defaultFontSize: '24px',
      defaultColor: '#292524',
      defaultAlign: 'center'
    },

    // Classic Theme
    'classic-intro': {
      base: 'font-sans tracking-[0.2em] uppercase',
      defaultPadding: 'pt-16 pb-8',
      defaultFontSize: '14px',
      defaultColor: '#57534e',
      defaultAlign: 'center'
    },
    'classic-body': {
      base: 'font-serif leading-loose',
      defaultPadding: 'py-8',
      defaultFontSize: '16px',
      defaultColor: '#292524',
      defaultAlign: 'center'
    },

    // Minimal Theme
    'minimal-label': {
      base: 'font-sans tracking-[0.2em] uppercase',
      defaultPadding: 'pt-20 pb-4',
      defaultFontSize: '14px',
      defaultColor: '#000000',
      defaultAlign: 'center'
    },
    'minimal-title': {
      base: 'font-sans font-bold tracking-tighter',
      defaultPadding: 'pb-12',
      defaultFontSize: '32px',
      defaultColor: '#000000',
      defaultAlign: 'center'
    },

    // Fallbacks (Legacy support)
    'serif': { base: 'font-serif', defaultPadding: 'p-4', defaultFontSize: '16px', defaultColor: 'inherit', defaultAlign: 'center' },
    'sans': { base: 'font-sans', defaultPadding: 'p-4', defaultFontSize: '16px', defaultColor: 'inherit', defaultAlign: 'center' },
    'spaced': { base: 'tracking-[0.2em] uppercase', defaultPadding: 'p-4', defaultFontSize: '14px', defaultColor: 'inherit', defaultAlign: 'center' },
    'vertical': { base: '[writing-mode:vertical-rl] min-h-[200px] flex items-center justify-center py-10', defaultPadding: 'py-10', defaultFontSize: '16px', defaultColor: 'inherit', defaultAlign: 'center' },
  };

  const currentVariant = variantConfig[variant] || variantConfig['simple-body'];
  
  // Custom overrides take precedence over defaults
  const finalPadding = customPadding || currentVariant.defaultPadding;
  const finalFontSize = customFontSize || currentVariant.defaultFontSize;
  const finalColor = customColor || currentVariant.defaultColor;
  const finalAlign = customAlign || currentVariant.defaultAlign;

  return (
    <div 
      className={`w-full ${currentVariant.base} ${finalPadding} ${className || ''}`}
      style={{
        ...styles,
        fontSize: finalFontSize,
        color: finalColor,
        textAlign: finalAlign,
      }}
    >
      {content}
    </div>
  );
}

