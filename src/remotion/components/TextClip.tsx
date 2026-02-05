import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Img } from 'remotion';

interface TextClipProps {
  text: string;
  subText?: string;
  backgroundSrc?: string; // 배경 이미지가 있으면 사용
  duration: number;
}

export const TextClip: React.FC<TextClipProps> = ({ text, subText, backgroundSrc, duration }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15, duration - 15, duration], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* 배경 이미지 (옵션) */}
      {backgroundSrc && (
        <AbsoluteFill>
            <Img 
                src={backgroundSrc} 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    opacity: 0.6 // 텍스트가 잘 보이도록 어둡게 처리
                }} 
            />
        </AbsoluteFill>
      )}

      {/* 텍스트 컨텐츠 */}
      <AbsoluteFill style={{ 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        opacity
      }}>
        <h2 style={{ 
          color: 'white', 
          fontSize: 60, 
          textAlign: 'center',
          maxWidth: '80%',
          lineHeight: 1.4,
          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          "{text}"
        </h2>
        {subText && (
          <p style={{ 
            color: '#ddd', 
            fontSize: 30, 
            marginTop: 30,
          }}>
            {subText}
          </p>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
