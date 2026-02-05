import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface ImageClipProps {
  src: string;          // 이미지 주소
  duration: number;     // 보여줄 시간 (프레임)
  fadeDuration?: number; // 페이드 효과 시간 (선택 사항, 기본값 0)
  effect?: 'none' | 'zoom-in' | 'pan-left' | 'pan-right'; // 움직임 효과
  overlayText?: string; // 이미지 위에 얹을 텍스트
}

/**
 * 기본 이미지 클립 컴포넌트
 * 이미지를 하나 보여주고, 앞뒤로 부드럽게 페이드 인/아웃 효과를 줍니다.
 */
export const ImageClip: React.FC<ImageClipProps> = ({ 
  src, 
  duration, 
  fadeDuration = 0, 
  effect = 'none',
  overlayText 
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  // 1. 페이드 효과 (Opacity)
  const opacity = interpolate(
    frame,
    [0, fadeDuration, duration - fadeDuration, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 2. 움직임 효과 (Transform)
  let scale = 1;
  let translateX = 0;
  const translateY = 0;

  switch (effect) {
    case 'zoom-in':
      // 1.0 -> 1.1 로 살짝 확대
      scale = interpolate(frame, [0, duration], [1, 1.1], { extrapolateRight: 'clamp' });
      break;
    case 'pan-left':
      // 이미지를 약간 오른쪽에서 시작해서 왼쪽으로 이동
      // 그러려면 이미지가 화면보다 커야 함. 기본 스케일을 1.1로 잡음
      scale = 1.1;
      translateX = interpolate(frame, [0, duration], [0, -width * 0.05], { extrapolateRight: 'clamp' });
      break;
    case 'pan-right':
      scale = 1.1;
      translateX = interpolate(frame, [0, duration], [0, width * 0.05], { extrapolateRight: 'clamp' });
      break;
    default:
      scale = 1;
      break;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <AbsoluteFill style={{ 
        opacity, 
        transform: `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`,
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <Img 
          src={src} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' // contain 대신 cover로 꽉 차게 (무빙 효과를 위해)
          }} 
        />
      </AbsoluteFill>
      
      {/* 오버레이 텍스트 */}
      {overlayText && (
        <AbsoluteFill style={{ 
            justifyContent: 'center', 
            alignItems: 'center', 
            opacity 
        }}>
            <h2 style={{
                color: 'white',
                fontSize: 60,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                textAlign: 'center',
                whiteSpace: 'pre-line'
            }}>
                {overlayText}
            </h2>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
