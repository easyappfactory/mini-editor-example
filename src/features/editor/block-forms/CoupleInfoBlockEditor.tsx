'use client';

import { CoupleInfo } from '@/shared/types/block';

interface CoupleInfoBlockEditorProps {
  content: CoupleInfo;
  onUpdate: (content: CoupleInfo) => void;
}

export default function CoupleInfoBlockEditor({ content, onUpdate }: CoupleInfoBlockEditorProps) {
  const coupleInfo = content;

  const handleCoupleInfoChange = (field: keyof CoupleInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate({
      ...coupleInfo,
      [field]: e.target.value,
    });
  };

  const commonInputClass = "border border-border rounded p-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none";

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col">
        <input
          value={coupleInfo.groomName}
          onChange={handleCoupleInfoChange('groomName')}
          className={commonInputClass}
          placeholder="신랑 이름"
        />
      </div>
      <div className="flex flex-col">
        <input
          value={coupleInfo.brideName}
          onChange={handleCoupleInfoChange('brideName')}
          className={commonInputClass}
          placeholder="신부 이름"
        />
      </div>
      <input
        value={coupleInfo.groomFather}
        onChange={handleCoupleInfoChange('groomFather')}
        className={`${commonInputClass} col-span-2`}
        placeholder="신랑 아버지"
      />
      <input
        value={coupleInfo.groomMother}
        onChange={handleCoupleInfoChange('groomMother')}
        className={`${commonInputClass} col-span-2`}
        placeholder="신랑 어머니"
      />
      <input
        value={coupleInfo.brideFather}
        onChange={handleCoupleInfoChange('brideFather')}
        className={`${commonInputClass} col-span-2`}
        placeholder="신부 아버지"
      />
      <input
        value={coupleInfo.brideMother}
        onChange={handleCoupleInfoChange('brideMother')}
        className={`${commonInputClass} col-span-2`}
        placeholder="신부 어머니"
      />
    </div>
  );
}
