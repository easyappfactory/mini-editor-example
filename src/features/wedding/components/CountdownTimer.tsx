'use client';

import { memo } from 'react';
import { CountdownTime } from '../hooks/useCountdown';

interface CountdownTimerProps {
  timeLeft: CountdownTime;
  color?: string;
  variant?: string;
}

export const CountdownTimer = memo(({ timeLeft, color, variant }: CountdownTimerProps) => {
  if (timeLeft.isExpired) {
    return (
      <div className="text-center">
        <p className="text-lg font-medium" style={{ color: color || '#374151' }}>
          결혼식 당일입니다! 🎉
        </p>
      </div>
    );
  }

  const totalDays = timeLeft.days;

  if (variant === 'circle') {
    return (
      <div className="flex flex-col items-center gap-8">
        <div className="flex gap-4 justify-center flex-wrap">
          <TimeUnitCircle value={timeLeft.days} label="DAYS" color={color} />
          <TimeUnitCircle value={timeLeft.hours} label="HOURS" color={color} />
          <TimeUnitCircle value={timeLeft.minutes} label="MINS" color={color} />
          <TimeUnitCircle value={timeLeft.seconds} label="SECS" color={color} />
        </div>
        <p className="text-sm font-medium opacity-80" style={{ color: color }}>
          결혼식이 <span className="font-bold">{totalDays}일</span> 남았습니다.
        </p>
      </div>
    );
  }

  if (variant === 'classic') {
    return (
      <div className="flex flex-col items-center gap-6 font-serif">
        <div className="flex gap-8 justify-center items-end">
          <TimeUnitClassic value={timeLeft.days} label="Days" color={color} />
          <span className="text-2xl pb-4 opacity-30">:</span>
          <TimeUnitClassic value={timeLeft.hours} label="Hours" color={color} />
          <span className="text-2xl pb-4 opacity-30">:</span>
          <TimeUnitClassic value={timeLeft.minutes} label="Mins" color={color} />
          <span className="text-2xl pb-4 opacity-30">:</span>
          <TimeUnitClassic value={timeLeft.seconds} label="Secs" color={color} />
        </div>
        <p className="text-base italic opacity-80" style={{ color: color }}>
          Together in {totalDays} days
        </p>
      </div>
    );
  }

  // Default / Modern
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-3 justify-center">
        <TimeUnit value={timeLeft.days} label="DAYS" color={color} />
        <TimeUnit value={timeLeft.hours} label="HOURS" color={color} />
        <TimeUnit value={timeLeft.minutes} label="MINUTES" color={color} />
        <TimeUnit value={timeLeft.seconds} label="SECONDS" color={color} />
      </div>
      <p className="text-sm font-medium opacity-70" style={{ color: color || '#4b5563' }}>
        결혼식이 <span className="font-semibold" style={{ color: color || '#1f2937' }}>{totalDays}일</span> 남았습니다.
      </p>
    </div>
  );
});

CountdownTimer.displayName = 'CountdownTimer';

interface TimeUnitProps {
  value: number;
  label: string;
  color?: string;
}

function TimeUnit({ value, label, color }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-white rounded-xl shadow-sm px-4 py-3 min-w-16 border border-gray-100">
        <span className="text-2xl font-bold tabular-nums" style={{ color: color || '#111827' }}>
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] font-medium tracking-widest opacity-60" style={{ color: color || '#9ca3af' }}>{label}</span>
    </div>
  );
}

function TimeUnitCircle({ value, label, color }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center border border-current bg-white/50 backdrop-blur-sm"
        style={{ color: color || '#111827' }}
      >
        <span className="text-xl font-bold tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] tracking-widest opacity-60" style={{ color: color }}>{label}</span>
    </div>
  );
}

function TimeUnitClassic({ value, label, color }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-medium tabular-nums" style={{ color: color || '#111827' }}>
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs italic opacity-60" style={{ color: color }}>{label}</span>
    </div>
  );
}
