import React from 'react';
import { AbsoluteFill, Img, Sequence, useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface GridClipProps {
  images: string[]; // 보여줄 4개의 이미지 URL 목록
  interval: number; // 각 이미지가 나타나는 시간 간격 (프레임 단위)
  duration: number; // 전체 클립 지속 시간
}

/**
 * 그리드 형태로 이미지를 보여주는 컴포넌트입니다.
 * 4개의 이미지를 받아 2x2 격자로 배치하고, 순차적으로 나타나게 합니다.
 */
export const GridClip: React.FC<GridClipProps> = ({ images, interval, duration }) => {


  // 화면을 4분할하는 스타일을 계산하는 함수
  // index 0: 왼쪽 위, 1: 오른쪽 위, 2: 왼쪽 아래, 3: 오른쪽 아래
  const getStyle = (index: number): React.CSSProperties => {
    const isTop = index < 2;
    const isLeft = index % 2 === 0;
    return {
      position: 'absolute',
      top: isTop ? 0 : '50%',
      left: isLeft ? 0 : '50%',
      width: '50%',
      height: '50%',
      overflow: 'hidden', // 이미지가 영역을 벗어나지 않도록 자름
    };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      {images.map((src, index) => {
        // 이 이미지가 등장해야 할 시간 (프레임) 계산
        // 예: interval이 15라면 0, 15, 30, 45 프레임에 등장
        const startFrame = index * interval;
        
        return (
            // Sequence를 사용하여 각 이미지를 정해진 시간에 등장시킵니다.
            <Sequence key={index} from={startFrame} durationInFrames={duration - startFrame}>
                {/* 실제 이미지를 보여주는 부분 (애니메이션 포함) */}
                <PopInImage src={src} style={getStyle(index)} />
            </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * 띠용~ 하고 튀어나오는(Pop-in) 효과를 주는 내부 컴포넌트
 */
const PopInImage: React.FC<{ src: string; style: React.CSSProperties }> = ({ src, style }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // spring 함수: 물리 기반 애니메이션 (스프링 효과)
    // 시간이 지날수록 0에서 1로 띠용~ 하며 커집니다.
    const scale = spring({
        frame,
        fps,
        config: { damping: 12 }, // damping이 낮으면 더 많이 출렁거립니다.
    });

    return (
        // scale 값을 transform에 적용하여 크기가 커지는 효과 연출
        <div style={{ ...style, transform: `scale(${scale})` }}>
            <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
    );
}
