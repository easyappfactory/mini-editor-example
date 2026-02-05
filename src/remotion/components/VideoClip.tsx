import React from 'react';
import { AbsoluteFill, Video } from 'remotion';

interface VideoClipProps {
  src: string;
  duration: number;
  isMuted?: boolean;
  volume?: number;
  subtitle?: string;
  subtitleStyle?: 'simple' | 'cinematic' | 'broadcast';
  subtitleBottom?: number; // % from bottom
  fontFamily?: string;
}

export const VideoClip: React.FC<VideoClipProps> = ({ 
  src, 
  isMuted, 
  volume, 
  subtitle, 
  subtitleStyle = 'simple',
  subtitleBottom,
  fontFamily 
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Video 
        src={src} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        muted={isMuted}
        volume={volume}
      />
      
      {subtitle && (
        <AbsoluteFill style={{ 
            justifyContent: 'flex-end', 
            alignItems: 'center', 
            paddingBottom: subtitleBottom !== undefined ? `${subtitleBottom}%` : 80 
        }}>
            {subtitleStyle === 'cinematic' && (
                <div style={{
                    fontFamily: fontFamily || 'serif',
                    fontSize: 40,
                    color: 'rgba(255, 255, 255, 0.9)',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    textAlign: 'center',
                    maxWidth: '80%',
                    letterSpacing: 1
                }}>
                    {subtitle}
                </div>
            )}
            
            {subtitleStyle === 'simple' && (
                <div style={{
                    fontFamily: fontFamily || 'sans-serif',
                    fontSize: 36,
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    padding: '10px 20px',
                    borderRadius: 8,
                    textAlign: 'center'
                }}>
                    {subtitle}
                </div>
            )}

            {subtitleStyle === 'broadcast' && (
                <div style={{
                    fontFamily: fontFamily || 'sans-serif',
                    fontSize: 50,
                    color: '#fff',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                    textAlign: 'center',
                    transform: 'skewX(-10deg)'
                }}>
                    {subtitle}
                </div>
            )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
