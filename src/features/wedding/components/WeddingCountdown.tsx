'use client';

import { useCountdown } from '../hooks/useCountdown';
import { CountdownTimer } from './CountdownTimer';

interface WeddingCountdownProps {
  weddingDate: string;
  color?: string;
  variant?: string;
}

export function WeddingCountdown({ weddingDate, color, variant }: WeddingCountdownProps) {
  const timeLeft = useCountdown(weddingDate);

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <CountdownTimer timeLeft={timeLeft} color={color} variant={variant} />
    </div>
  );
}
