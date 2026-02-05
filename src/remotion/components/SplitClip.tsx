import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';

interface SplitClipProps {
  layout: 'image-left' | 'image-right';
  text: string;
  subText?: string;
  src: string;
  backgroundColor?: string;
  textColor?: string;
  duration: number;
}

export const SplitClip: React.FC<SplitClipProps> = ({ 
  layout, 
  text, 
  subText, 
  src, 
  backgroundColor, 
  textColor,
  duration 
}) => {
  const frame = useCurrentFrame();

  // Entrance animation (Slide in from side based on layout)
  // Image Left: Text slides in from right
  // Image Right: Text slides in from left
  const isImageLeft = layout === 'image-left';
  
  const opacity = interpolate(
    frame, 
    [0, 15, duration - 15, duration], 
    [0, 1, 1, 0], 
    { extrapolateRight: 'clamp' }
  );
  
  const slideOffset = interpolate(
    frame, 
    [0, 20], 
    [isImageLeft ? 50 : -50, 0], 
    { extrapolateRight: 'clamp' }
  );
  const textContainerStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
    height: '100%',
  };

  const imageContainerStyle: React.CSSProperties = {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <AbsoluteFill style={{ 
      flexDirection: isImageLeft ? 'row' : 'row-reverse',
      // backgroundColor: 'white' // default base <-- 제거 (상위에서 결정)
    }}>
      {/* Image Side */}
      <div style={imageContainerStyle}>
        <Img 
          src={src} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            opacity 
          }} 
        />
      </div>

      {/* Text Side */}
      <div style={textContainerStyle}>
        <div style={{ opacity, transform: `translateY(${slideOffset}px)` }}>
          <h2 style={{ 
            color: textColor, 
            fontSize: 50, 
            marginBottom: 20,
            whiteSpace: 'pre-line',
            textAlign: 'center'
          }}>
            {text}
          </h2>
          {subText && (
            <p style={{ 
              color: textColor, 
              fontSize: 24, 
              opacity: 0.8,
              textAlign: 'center'
            }}>
              {subText}
            </p>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
