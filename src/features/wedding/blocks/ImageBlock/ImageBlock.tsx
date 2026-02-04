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
  const { variant = 'full', padding, className } = block.styles || {};

  const handleClick = () => {
    if (lightbox?.openLightbox) {
      lightbox.openLightbox(imageUrl);
    }
  };

  const getContainerStyle = () => {
    const baseStyle = `w-full ${lightbox ? 'cursor-pointer' : ''} ${className || ''}`;
    
    switch (variant) {
      case 'rounded':
        return `${baseStyle} overflow-hidden rounded-2xl shadow-sm`;
      case 'card':
        return `${baseStyle} bg-white p-3 shadow-md rounded-xl`;
      case 'full':
      default:
        return baseStyle;
    }
  };

  const getImageStyle = () => {
    const baseStyle = `w-full h-auto object-cover ${lightbox ? 'hover:opacity-90' : ''} transition-opacity`;
    
    switch (variant) {
      case 'rounded':
        return `${baseStyle} rounded-2xl`;
      case 'card':
        return `${baseStyle} rounded-lg`;
      case 'full':
      default:
        return baseStyle;
    }
  };

  return (
    <div className={`w-full ${padding || ''}`}>
      <div 
        className={getContainerStyle()}
        onClick={handleClick}
      >
        <Image
          src={imageUrl} 
          alt="Wedding Image" 
          width={800}
          height={600}
          className={getImageStyle()}
        />
      </div>
    </div>
  );
}
