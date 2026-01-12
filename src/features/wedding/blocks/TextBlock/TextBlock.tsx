// features/wedding/blocks/TextBlock/TextBlock.tsx
import { Block } from "@/shared/types/block";
import { useTextBlock } from "./useTextBlock";

interface Props {
  block: Block;
}

export default function TextBlock({ block }: Props) {
  // Headless Hook: 로직과 UI 분리
  const { content, styles } = useTextBlock(block);

  return (
    <div 
      className="w-full p-4"
      style={styles}
    >
      {content}
    </div>
  );
}

