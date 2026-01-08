// features/wedding/blocks/ImageBlock/ImageBlock.tsx
import { Block } from "@/shared/types/block";
import { useImageBlock } from "./useImageBlock";

interface Props {
  block: Block;
}

export default function ImageBlock({ block }: Props) {
  // Headless Hook: 로직과 UI 분리
  const { imageUrl } = useImageBlock(block.content);
  
  return (
    <div className="w-full">
      <img 
        src={imageUrl} 
        alt="Wedding Image" 
        className="w-full h-auto object-cover"
      />
    </div>
  );
}

