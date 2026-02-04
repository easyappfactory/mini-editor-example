// features/wedding/blocks/TextBlock/TextBlock.tsx
import { Block } from "@/shared/types/block";
import { useTextBlock } from "./useTextBlock";

interface Props {
  block: Block;
}

export default function TextBlock({ block }: Props) {
  // Headless Hook: 로직과 UI 분리
  const { content, styles } = useTextBlock(block);
  const { variant, className, padding } = block.styles || {};

  const getVariantClasses = () => {
    const baseClasses = `w-full ${padding || 'p-4'}`;
    
    switch (variant) {
      case 'serif':
        return `${baseClasses} font-serif`;
      case 'sans':
        return `${baseClasses} font-sans`;
      case 'script':
        return `${baseClasses} font-serif italic`;
      case 'vertical':
        return `${baseClasses} [writing-mode:vertical-rl] min-h-[200px] flex items-center justify-center py-10`;
      case 'spaced':
        return `${baseClasses} tracking-[0.2em] uppercase`;
      default:
        return baseClasses;
    }
  };

  return (
    <div 
      className={`${getVariantClasses()} ${className || ''}`}
      style={styles}
    >
      {content}
    </div>
  );
}

