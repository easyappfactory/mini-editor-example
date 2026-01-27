// features/premium/components/WatermarkWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import { isPremiumProject } from '@/shared/utils/premiumStorage';
import Watermark from './Watermark';

interface WatermarkWrapperProps {
  projectId: string;
}

/**
 * 서버 컴포넌트에서 사용할 수 있는 워터마크 래퍼
 * 클라이언트 사이드에서 프리미엄 상태를 확인합니다.
 */
export default function WatermarkWrapper({ projectId }: WatermarkWrapperProps) {
  const [isPremium, setIsPremium] = useState(true); // 초기값 true로 깜빡임 방지
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    const checkPremium = async () => {
      const premium = await isPremiumProject(projectId);
      setIsPremium(premium);
      setIsLoaded(true);
    };

    checkPremium();
  }, [projectId]);

  // 로드되기 전에는 아무것도 표시하지 않음 (깜빡임 방지)
  if (!isLoaded) {
    return null;
  }

  return <Watermark show={!isPremium} />;
}
