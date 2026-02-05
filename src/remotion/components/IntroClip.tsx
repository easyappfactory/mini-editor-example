import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

interface IntroClipProps {
  title: string;
  subtitle: string;
  duration: number;
}

export const IntroClip: React.FC<IntroClipProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 텍스트 등장 효과 (Opacity & TranslateY)
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  const moveUp = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  
  const translateY = interpolate(moveUp, [0, 1], [50, 0]);

  return (
    <AbsoluteFill style={{ 
      // backgroundColor: 'white',  <-- 제거: 상위 테마 배경색 상속
      justifyContent: 'center', 
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <div style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: 80, 
          marginBottom: 20,
          // color: '#333' <-- 제거: 상위 텍스트 컬러 상속
        }}>
          {title}
        </h1>
        <p style={{
          fontSize: 30,
          opacity: 0.8, // color: '#666' 대신 투명도로 조정
          letterSpacing: 4
        }}>
          {subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
};
