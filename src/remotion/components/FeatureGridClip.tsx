import React from 'react';
import { AbsoluteFill, Img, Sequence } from 'remotion';

interface FeatureGridClipProps {
  layout: 'grid-left' | 'grid-right';
  images: string[];
  text: string;
  subText?: string;
  backgroundColor?: string;
  duration: number;
}

export const FeatureGridClip: React.FC<FeatureGridClipProps> = ({
  layout,
  images,
  text,
  subText,
  backgroundColor,
  duration
}) => {
  // Use first 4 images
  const gridImages = images.slice(0, 4);
  const isGridLeft = layout === 'grid-left';

  return (
    <AbsoluteFill style={{ 
      flexDirection: isGridLeft ? 'row' : 'row-reverse',
      backgroundColor 
    }}>
      {/* Grid Side (2/3 width) */}
      <div style={{ flex: 2, height: '100%', position: 'relative' }}>
        <MiniGrid images={gridImages} duration={duration} />
      </div>

      {/* Text Side (1/3 width) */}
      <div style={{ 
        flex: 1, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        // backgroundColor: 'rgba(0,0,0,0.02)' <-- 제거
      }}>
         <h2 style={{ 
            fontSize: 40, 
            marginBottom: 20, 
            textAlign: 'center',
            // color: '#333' <-- 제거
          }}>
            {text}
          </h2>
          {subText && (
            <p style={{ 
              fontSize: 20, 
              opacity: 0.7, // color: '#666' 대신
              textAlign: 'center' 
            }}>
              {subText}
            </p>
          )}
      </div>
    </AbsoluteFill>
  );
};

// Simplified 2x2 Grid for the feature component
const MiniGrid: React.FC<{ images: string[], duration: number }> = ({ images, duration }) => {
    return (
        <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexWrap: 'wrap' 
        }}>
            {images.map((src, i) => (
                <div key={i} style={{ 
                    width: '50%', 
                    height: '50%', 
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <Sequence from={i * 5} durationInFrames={duration - (i * 5)}>
                        <Img 
                            src={src} 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                            }} 
                        />
                    </Sequence>
                </div>
            ))}
        </div>
    )
}
