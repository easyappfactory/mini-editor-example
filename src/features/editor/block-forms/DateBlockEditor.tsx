'use client';

import { WeddingDate } from '@/shared/types/block';

interface DateBlockEditorProps {
  content: WeddingDate;
  onUpdate: (content: WeddingDate) => void;
}

export default function DateBlockEditor({ content, onUpdate }: DateBlockEditorProps) {
  const dateInfo = content;

  const handleDateChange = (field: keyof WeddingDate) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate({
      ...dateInfo,
      [field]: e.target.value,
    });
  };

  const commonInputClass = "border-b border-gray-300 px-1 py-1 text-center bg-transparent focus:border-primary outline-none transition-colors";

  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex items-end flex-wrap gap-2 text-sm text-gray-700">
        <div className="flex items-center">
          <input
            value={dateInfo.year}
            onChange={handleDateChange('year')}
            className={`${commonInputClass} w-14`}
            placeholder="2026"
          />
          <span className="ml-1 font-medium">년</span>
        </div>
        
        <div className="flex items-center">
          <input
            value={dateInfo.month}
            onChange={handleDateChange('month')}
            className={`${commonInputClass} w-10`}
            placeholder="6"
          />
          <span className="ml-1 font-medium">월</span>
        </div>
        
        <div className="flex items-center">
          <input
            value={dateInfo.day}
            onChange={handleDateChange('day')}
            className={`${commonInputClass} w-10`}
            placeholder="15"
          />
          <span className="ml-1 font-medium">일</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span className="font-medium text-gray-500 w-10">시간</span>
        <input
          value={dateInfo.time || ''}
          onChange={handleDateChange('time')}
          className={`${commonInputClass} flex-1 text-left`}
          placeholder="예) 오후 1시"
        />
      </div>
    </div>
  );
}
