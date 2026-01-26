// features/wedding/blocks/ImageBlock/ImageBlock.tsx
'use client';

import { Block } from "@/shared/types/block";
import { useImageBlock } from "./useImageBlock";
import Image from "next/image";
import { useLightbox } from "@/features/wedding/components/LightboxProvider";

interface Props {
  block: Block;
}

export default function ImageBlock({ block }: Props) {
  const { imageUrl } = useImageBlock(block.content);
  const lightbox = useLightbox();

  const handleClick = () => {
    if (lightbox?.openLightbox) {
      lightbox.openLightbox(imageUrl);
    }
  };

  return (
    <div 
      className={`w-full ${lightbox ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <Image
        src={imageUrl} 
        alt="Wedding Image" 
        width={800}
        height={600}
        className={`w-full h-auto object-cover ${lightbox ? 'hover:opacity-90' : ''} transition-opacity`}
      />
    </div>
  );
}
