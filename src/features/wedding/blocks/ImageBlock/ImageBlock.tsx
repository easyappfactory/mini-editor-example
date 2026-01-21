// features/wedding/blocks/ImageBlock/ImageBlock.tsx
'use client';

import { Block } from "@/shared/types/block";
import { useImageBlock } from "./useImageBlock";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Props {
  block: Block;
}

export default function ImageBlock({ block }: Props) {
  const { imageUrl } = useImageBlock(block.content);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div 
        className="w-full cursor-pointer"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={imageUrl} 
          alt="Wedding Image" 
          width={800}
          height={600}
          className="w-full h-auto object-cover hover:opacity-90 transition-opacity"
        />
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={[{ src: imageUrl }]}
      />
    </>
  );
}
