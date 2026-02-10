import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { DraggableImage } from './DraggableImage';

interface DraggableItem {
  left: number;
  top: number;
  width: number;
  height: number;
  isDragging: boolean;
}

interface SplitClipProps {
  layout: 'image-left' | 'image-right';
  text: string;
  subText?: string;
  src: string;
  backgroundColor?: string;
  textColor?: string;
  duration: number;
  blockId?: string;
  draggableItems?: Record<string, DraggableItem>;
  onDragStart?: (id: string) => void;
  onDragMove?: (id: string, left: number, top: number) => void;
  onDragEnd?: (id: string) => void;
}

export const SplitClip: React.FC<SplitClipProps> = ({ 
  layout, 
  text, 
  subText, 
  src, 
  backgroundColor, 
  textColor,
  duration,
  blockId = 'split',
  draggableItems = {},
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(
    frame, 
    [0, 15, duration - 15, duration], 
    [0, 1, 1, 0], 
    { extrapolateRight: 'clamp' }
  );

  // Image and Text are now draggable elements with 2 positions: left (0) and right (960)
  const imageId = `${blockId}-image`;
  const textId = `${blockId}-text`;

  // Initial positions based on layout
  const imageInitialPos = {
    left: layout === 'image-left' ? 0 : 960,
    top: 0,
    width: 960,
    height: 1080,
  };

  const textInitialPos = {
    left: layout === 'image-left' ? 960 : 0,
    top: 0,
    width: 960,
    height: 1080,
  };

  const imageItem = draggableItems[imageId] || { ...imageInitialPos, isDragging: false };
  const textItem = draggableItems[textId] || { ...textInitialPos, isDragging: false };

  return (
    <AbsoluteFill>
      {/* Draggable Image */}
      <DraggableImage
        id={imageId}
        src={src}
        left={imageItem.left}
        top={imageItem.top}
        width={imageItem.width}
        height={imageItem.height}
        isDragging={imageItem.isDragging}
        zIndex={imageItem.isDragging ? 1000 : 0}
        onDragStart={onDragStart || (() => {})}
        onDragMove={onDragMove || (() => {})}
        onDragEnd={onDragEnd || (() => {})}
      />

      {/* Draggable Text */}
      <DraggableTextBox
        id={textId}
        text={text}
        subText={subText}
        backgroundColor={backgroundColor}
        textColor={textColor}
        left={textItem.left}
        top={textItem.top}
        width={textItem.width}
        height={textItem.height}
        isDragging={textItem.isDragging}
        opacity={opacity}
        onDragStart={onDragStart || (() => {})}
        onDragMove={onDragMove || (() => {})}
        onDragEnd={onDragEnd || (() => {})}
      />
    </AbsoluteFill>
  );
};

// Draggable Text Box Component
interface DraggableTextBoxProps {
  id: string;
  text: string;
  subText?: string;
  backgroundColor?: string;
  textColor?: string;
  left: number;
  top: number;
  width: number;
  height: number;
  isDragging: boolean;
  opacity: number;
  onDragStart: (id: string) => void;
  onDragMove: (id: string, left: number, top: number) => void;
  onDragEnd: (id: string) => void;
}

const DraggableTextBox: React.FC<DraggableTextBoxProps> = ({
  id,
  text,
  subText,
  backgroundColor,
  textColor,
  left,
  top,
  width,
  height,
  isDragging,
  opacity,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    
    setDragOffset({
      x: e.clientX - left,
      y: e.clientY - top,
    });
    
    onDragStart(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const newLeft = e.clientX - dragOffset.x;
    const newTop = e.clientY - dragOffset.y;
    
    onDragMove(id, newLeft, newTop);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    onDragEnd(id);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        zIndex: isDragging ? 1001 : 1,
        border: isDragging ? '3px solid #3b82f6' : '2px dashed rgba(59, 130, 246, 0.5)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div style={{ opacity }}>
        <h2 style={{ 
          color: textColor, 
          fontSize: 50, 
          marginBottom: 20,
          whiteSpace: 'pre-line',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          {text}
        </h2>
        {subText && (
          <p style={{ 
            color: textColor, 
            fontSize: 24, 
            opacity: 0.8,
            textAlign: 'center',
            pointerEvents: 'none',
          }}>
            {subText}
          </p>
        )}
      </div>
    </div>
  );
};
