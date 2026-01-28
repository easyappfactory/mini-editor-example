'use client';

import { DDayContent } from '@/shared/types/block';

interface DDayBlockEditorProps {
  content: DDayContent;
  onUpdate: (content: DDayContent) => void;
}

export default function DDayBlockEditor({ content, onUpdate }: DDayBlockEditorProps) {
  const ddayInfo = content;

  const handleChange = (field: keyof DDayContent) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate({
      ...ddayInfo,
      [field]: e.target.value,
    });
  };

  const commonInputClass = "border border-border rounded p-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">결혼식 날짜 및 시간</label>
        <input
          type="text"
          value={ddayInfo.weddingDateTime || ''}
          onChange={handleChange('weddingDateTime')}
          className={commonInputClass}
          placeholder="2026-06-15 14:00:00"
        />
        <p className="text-xs text-muted-foreground">
          형식: YYYY-MM-DD HH:mm:ss (예: 2026-06-15 14:00:00)
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">제목 (선택)</label>
        <input
          type="text"
          value={ddayInfo.title || ''}
          onChange={handleChange('title')}
          className={commonInputClass}
          placeholder="결혼식까지"
        />
      </div>
    </div>
  );
}
