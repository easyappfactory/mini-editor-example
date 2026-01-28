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

  const commonInputClass = "border border-border rounded p-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none";

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex flex-col w-20">
        <input
          value={dateInfo.year}
          onChange={handleDateChange('year')}
          className={commonInputClass}
          placeholder="2026"
        />
      </div>
      <div className="flex flex-col w-16">
        <input
          value={dateInfo.month}
          onChange={handleDateChange('month')}
          className={commonInputClass}
          placeholder="1"
        />
      </div>
      <div className="flex flex-col w-16">
        <input
          value={dateInfo.day}
          onChange={handleDateChange('day')}
          className={commonInputClass}
          placeholder="7"
        />
      </div>
      <input
        value={dateInfo.time || ''}
        onChange={handleDateChange('time')}
        className={`${commonInputClass} flex-1 min-w-[120px]`}
        placeholder="오후 1시 (선택)"
      />
    </div>
  );
}
