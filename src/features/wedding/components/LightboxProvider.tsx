// features/wedding/components/LightboxProvider.tsx
'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Block, ImageGridContent } from '@/shared/types/block';

interface LightboxContextType {
  openLightbox: (imageSrc: string) => void;
}

const LightboxContext = createContext<LightboxContextType | null>(null);

export type { LightboxContextType };

export function useLightbox() {
  const context = useContext(LightboxContext);
  return context;
}

interface LightboxProviderProps {
  blocks: Block[];
  children: ReactNode;
}

export function LightboxProvider({ blocks, children }: LightboxProviderProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // blocks에서 모든 이미지 추출 (블록 순서대로)
  const allImages = useMemo(() => {
    const images: { src: string }[] = [];
    
    blocks.forEach((block) => {
      if (block.type === 'image' && typeof block.content === 'string') {
        // 빈 문자열이 아닌 경우에만 추가
        if (block.content && block.content.trim() !== '') {
          images.push({ src: block.content });
        }
      } else if (block.type === 'image_grid') {
        const gridContent = block.content as ImageGridContent;
        // slots가 존재하고 배열인지 안전하게 확인
        if (gridContent?.slots && Array.isArray(gridContent.slots)) {
          gridContent.slots
            .filter(slot => slot?.imageSrc && slot.imageSrc.trim() !== '')
            .forEach(slot => images.push({ src: slot.imageSrc }));
        }
      }
    });
    
    return images;
  }, [blocks]);

  const openLightbox = (imageSrc: string) => {
    const idx = allImages.findIndex(img => img.src === imageSrc);
    if (idx !== -1) {
      setIndex(idx);
      setOpen(true);
    }
  };

  return (
    <LightboxContext.Provider value={{ openLightbox }}>
      {children}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={allImages}
        index={index}
      />
    </LightboxContext.Provider>
  );
}
