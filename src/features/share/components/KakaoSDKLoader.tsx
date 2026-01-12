// features/share/components/KakaoSDKLoader.tsx
'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

// 카카오 JavaScript SDK 타입 정의
interface KakaoShareContent {
  title: string;
  description: string;
  imageUrl: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

interface KakaoShareOptions {
  objectType: 'feed';
  content: KakaoShareContent;
}

interface KakaoShare {
  sendDefault: (options: KakaoShareOptions) => void;
}

interface KakaoSDK {
  init: (jsKey: string) => void;
  isInitialized: () => boolean;
  Share: KakaoShare;
}

// 카카오 JavaScript SDK 타입 선언
declare global {
  interface Window {
    Kakao: KakaoSDK;
  }
}

interface Props {
  jsKey: string; // 카카오 JavaScript 키
  onReady?: () => void;
}

export default function KakaoSDKLoader({ jsKey, onReady }: Props) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // SDK가 로드되고 초기화되었는지 확인
    if (isReady && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(jsKey);
      onReady?.();
    }
  }, [isReady, jsKey, onReady]);

  return (
    <Script
      src="https://developers.kakao.com/sdk/js/kakao.js"
      strategy="lazyOnload"
      onLoad={() => {
        setIsReady(true);
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(jsKey);
          onReady?.();
        }
      }}
    />
  );
}
