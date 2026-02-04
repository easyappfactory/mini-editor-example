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
  const { variant = 'full', padding: customPadding, className } = block.styles || {};

  // Variant Config
  const variantConfig: Record<string, { 
    container: string; 
    image: string;
    defaultPadding: string;
  }> = {
    'rounded': {
      container: 'overflow-hidden rounded-2xl shadow-sm',
      image: 'rounded-2xl',
      defaultPadding: 'px-6 py-8'
    },
    'card': {
      container: 'bg-white p-3 shadow-md rounded-xl',
      image: 'rounded-lg',
      defaultPadding: 'px-8 pb-8'
    },
    'full': {
      container: '',
      image: '',
      defaultPadding: 'pb-0' // Default no padding or minimal
    },
    // Special case for Minimal theme main image
    'minimal-full': {
      container: '',
      image: '',
      defaultPadding: 'pb-12'
    }
  };

  const currentVariant = variantConfig[variant] || variantConfig.full;
  const finalPadding = customPadding !== undefined ? customPadding : currentVariant.defaultPadding;

  const handleClick = () => {
    if (lightbox?.openLightbox) {
      lightbox.openLightbox(imageUrl);
    }
  };

  const getContainerStyle = () => {
    const baseStyle = `w-full ${lightbox ? 'cursor-pointer' : ''} ${className || ''}`;
    return `${baseStyle} ${currentVariant.container}`;
  };

  const getImageStyle = () => {
    const baseStyle = `w-full h-auto object-cover ${lightbox ? 'hover:opacity-90' : ''} transition-opacity`;
    return `${baseStyle} ${currentVariant.image}`;
  };

  return (
    <div className={`w-full ${finalPadding}`}>
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
