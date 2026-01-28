'use client';

import { memo } from 'react';
import { CountdownTime } from '../hooks/useCountdown';

interface CountdownTimerProps {
  timeLeft: CountdownTime;
}

export const CountdownTimer = memo(({ timeLeft }: CountdownTimerProps) => {
  if (timeLeft.isExpired) {
    return (
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">
          결혼식 당일입니다! 🎉
        </p>
      </div>
    );
  }

  const totalDays = timeLeft.days;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-3 justify-center">
        <TimeUnit value={timeLeft.days} label="DAYS" />
        <TimeUnit value={timeLeft.hours} label="HOURS" />
        <TimeUnit value={timeLeft.minutes} label="MINUTES" />
        <TimeUnit value={timeLeft.seconds} label="SECONDS" />
      </div>
      <p className="text-sm text-gray-600 font-medium">
        결혼식이 <span className="text-gray-800 font-semibold">{totalDays}일</span> 남았습니다.
      </p>
    </div>
  );
});

CountdownTimer.displayName = 'CountdownTimer';

interface TimeUnitProps {
  value: number;
  label: string;
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-white rounded-xl shadow-md px-4 py-3 min-w-16">
        <span className="text-2xl font-bold text-gray-900 tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs font-medium text-gray-400 tracking-wide">{label}</span>
    </div>
  );
}
