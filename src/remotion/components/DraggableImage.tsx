import React, { useState, useCallback } from 'react';
import { Img, useCurrentScale } from 'remotion';

interface DraggableImageProps {
  id: string;
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  isDragging: boolean;
  zIndex?: number;
  onDragStart: (id: string) => void;
  onDragMove: (id: string, left: number, top: number) => void;
  onDragEnd: (id: string) => void;
}

export const DraggableImage: React.FC<DraggableImageProps> = ({
  id,
  src,
  left,
  top,
  width,
  height,
  isDragging,
  zIndex = 0,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const scale = useCurrentScale();

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    
    // Calculate offset from current position, not from bounding rect
    setDragOffset({
      x: e.clientX / scale - left,
      y: e.clientY / scale - top,
    });
    
    onDragStart(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [id, onDragStart, scale, left, top]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;

    const newLeft = e.clientX / scale - dragOffset.x;
    const newTop = e.clientY / scale - dragOffset.y;
    
    onDragMove(id, newLeft, newTop);
  }, [isDragging, id, onDragMove, scale, dragOffset]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    onDragEnd(id);
  }, [id, onDragEnd]);

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        zIndex,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Img 
        src={src} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          pointerEvents: 'none',
        }} 
      />
      {/* Border overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: isDragging ? '3px solid #3b82f6' : '2px dashed rgba(59, 130, 246, 0.5)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );
};
