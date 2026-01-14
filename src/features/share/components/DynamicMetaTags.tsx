// features/share/components/DynamicMetaTags.tsx
'use client';

import { useEffect } from 'react';
import { Block } from '@/shared/types/block';
import { extractMetadataFromBlocks } from '../utils/metadata';

interface Props {
  blocks: Block[];
}

/**
 * 클라이언트에서 동적으로 메타 태그 업데이트
 * (임시 방편 - 카카오톡 등은 서버에서 렌더링된 메타태그만 읽음)
 */
export default function DynamicMetaTags({ blocks }: Props) {
  useEffect(() => {
    if (blocks && blocks.length > 0 && typeof window !== 'undefined') {
      // 클라이언트 사이드에서는 window.location.origin 사용
      const baseUrl = window.location.origin;
      const metadata = extractMetadataFromBlocks(blocks, baseUrl);

      // document title 변경
      document.title = metadata.title;

      // 기존 메타 태그 업데이트 또는 생성
      updateMetaTag('og:title', metadata.title);
      updateMetaTag('og:description', metadata.description);
      updateMetaTag('og:image', metadata.imageUrl);
      updateMetaTag('og:type', 'website');
      
      // Twitter Card
      updateMetaTag('twitter:card', 'summary_large_image', 'name');
      updateMetaTag('twitter:title', metadata.title, 'name');
      updateMetaTag('twitter:description', metadata.description, 'name');
      updateMetaTag('twitter:image', metadata.imageUrl, 'name');
    }
  }, [blocks]);

  return null; // UI를 렌더링하지 않음
}

function updateMetaTag(property: string, content: string, attr: 'property' | 'name' = 'property') {
  let element = document.querySelector(`meta[${attr}="${property}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, property);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

