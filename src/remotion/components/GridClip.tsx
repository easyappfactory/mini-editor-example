import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { DraggableImage } from './DraggableImage';

interface DraggableItem {
  left: number;
  top: number;
  width: number;
  height: number;
  isDragging: boolean;
}

interface GridClipProps {
  images: string[];
  interval: number;
  duration: number;
  blockId?: string;
  draggableItems?: Record<string, DraggableItem>;
  onDragStart?: (id: string) => void;
  onDragMove?: (id: string, left: number, top: number) => void;
  onDragEnd?: (id: string) => void;
}

export const GridClip: React.FC<GridClipProps> = ({ 
  images, 
  interval, 
  duration,
  blockId = 'grid',
  draggableItems = {},
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {


  // Calculate initial positions for 2x2 grid
  const getInitialPosition = (index: number) => {
    const isTop = index < 2;
    const isLeft = index % 2 === 0;
    return {
      left: isLeft ? 0 : 960, // 1920 / 2 = 960
      top: isTop ? 0 : 540,   // 1080 / 2 = 540
      width: 960,
      height: 540,
    };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      {images.map((src, index) => {
        const elementId = `${blockId}-img-${index}`;
        
        // Get position from state or use initial position
        const initialPos = getInitialPosition(index);
        const item = draggableItems[elementId] || {
          ...initialPos,
          isDragging: false,
        };
        
        return (
          <DraggableImage
            key={elementId}
            id={elementId}
            src={src}
            left={item.left}
            top={item.top}
            width={item.width}
            height={item.height}
            isDragging={item.isDragging}
            zIndex={item.isDragging ? 1000 : index}
            onDragStart={onDragStart || (() => {})}
            onDragMove={onDragMove || (() => {})}
            onDragEnd={onDragEnd || (() => {})}
          />
        );
      })}
    </AbsoluteFill>
  );
};
