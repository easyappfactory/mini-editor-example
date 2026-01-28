'use client';

import { AccountInfo } from '@/shared/types/block';

interface AccountBlockEditorProps {
  content: AccountInfo;
  onUpdate: (content: AccountInfo) => void;
}

export default function AccountBlockEditor({ content, onUpdate }: AccountBlockEditorProps) {
  const accountInfo = content;

  const handleAccountChange = (field: keyof AccountInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    onUpdate({
      ...accountInfo,
      [field]: value,
    });
  };

  const commonInputClass = "w-full border border-border rounded p-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:opacity-50 disabled:bg-muted";

  return (
    <div className="space-y-4">
      {/* 신랑측 계좌번호 */}
      <div className="border border-border rounded-lg p-3 bg-muted/50 dark:bg-stone-800/50">
        <h4 className="text-sm font-semibold text-foreground mb-3">신랑측</h4>
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={accountInfo.groomAccountVisible ?? true}
                onChange={handleAccountChange('groomAccountVisible')}
                className="w-4 h-4 rounded border-border"
              />
              <label className="text-xs font-medium text-muted-foreground">신랑</label>
            </div>
            <input
              type="text"
              value={accountInfo.groomAccount || ''}
              onChange={handleAccountChange('groomAccount')}
              className={commonInputClass}
              placeholder="계좌번호 입력"
              disabled={!accountInfo.groomAccountVisible}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={accountInfo.groomFatherAccountVisible ?? true}
                onChange={handleAccountChange('groomFatherAccountVisible')}
                className="w-4 h-4 rounded border-border"
              />
              <label className="text-xs font-medium text-muted-foreground">신랑 아버지</label>
            </div>
            <input
              type="text"
              value={accountInfo.groomFatherAccount || ''}
              onChange={handleAccountChange('groomFatherAccount')}
              className={commonInputClass}
              placeholder="계좌번호 입력"
              disabled={!accountInfo.groomFatherAccountVisible}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={accountInfo.groomMotherAccountVisible ?? true}
                onChange={handleAccountChange('groomMotherAccountVisible')}
                className="w-4 h-4 rounded border-border"
              />
              <label className="text-xs font-medium text-muted-foreground">신랑 어머니</label>
            </div>
            <input
              type="text"
              value={accountInfo.groomMotherAccount || ''}
              onChange={handleAccountChange('groomMotherAccount')}
              className={commonInputClass}
              placeholder="계좌번호 입력"
              disabled={!accountInfo.groomMotherAccountVisible}
            />
          </div>
        </div>
      </div>

      {/* 신부측 계좌번호 */}
      <div className="border border-border rounded-lg p-3 bg-muted/50 dark:bg-stone-800/50">
        <h4 className="text-sm font-semibold text-foreground mb-3">신부측</h4>
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={accountInfo.brideAccountVisible ?? true}
                onChange={handleAccountChange('brideAccountVisible')}
                className="w-4 h-4 rounded border-border"
              />
              <label className="text-xs font-medium text-muted-foreground">신부</label>
            </div>
            <input
              type="text"
              value={accountInfo.brideAccount || ''}
              onChange={handleAccountChange('brideAccount')}
              className={commonInputClass}
              placeholder="계좌번호 입력"
              disabled={!accountInfo.brideAccountVisible}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={accountInfo.brideFatherAccountVisible ?? true}
                onChange={handleAccountChange('brideFatherAccountVisible')}
                className="w-4 h-4 rounded border-border"
              />
              <label className="text-xs font-medium text-muted-foreground">신부 아버지</label>
            </div>
            <input
              type="text"
              value={accountInfo.brideFatherAccount || ''}
              onChange={handleAccountChange('brideFatherAccount')}
              className={commonInputClass}
              placeholder="계좌번호 입력"
              disabled={!accountInfo.brideFatherAccountVisible}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={accountInfo.brideMotherAccountVisible ?? true}
                onChange={handleAccountChange('brideMotherAccountVisible')}
                className="w-4 h-4 rounded border-border"
              />
              <label className="text-xs font-medium text-muted-foreground">신부 어머니</label>
            </div>
            <input
              type="text"
              value={accountInfo.brideMotherAccount || ''}
              onChange={handleAccountChange('brideMotherAccount')}
              className={commonInputClass}
              placeholder="계좌번호 입력"
              disabled={!accountInfo.brideMotherAccountVisible}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
