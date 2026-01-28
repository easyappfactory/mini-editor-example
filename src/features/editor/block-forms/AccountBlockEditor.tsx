'use client';

import { AccountInfo } from '@/shared/types/block';

interface AccountBlockEditorProps {
  content: AccountInfo;
  onUpdate: (content: AccountInfo) => void;
}

interface AccountField {
  label: string;
  accountField: keyof AccountInfo;
  visibleField: keyof AccountInfo;
  kakaoPayLinkField: keyof AccountInfo;
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

  const groomFields: AccountField[] = [
    { label: '신랑', accountField: 'groomAccount', visibleField: 'groomAccountVisible', kakaoPayLinkField: 'groomKakaoPayLink' },
    { label: '신랑 아버지', accountField: 'groomFatherAccount', visibleField: 'groomFatherAccountVisible', kakaoPayLinkField: 'groomFatherKakaoPayLink' },
    { label: '신랑 어머니', accountField: 'groomMotherAccount', visibleField: 'groomMotherAccountVisible', kakaoPayLinkField: 'groomMotherKakaoPayLink' },
  ];

  const brideFields: AccountField[] = [
    { label: '신부', accountField: 'brideAccount', visibleField: 'brideAccountVisible', kakaoPayLinkField: 'brideKakaoPayLink' },
    { label: '신부 아버지', accountField: 'brideFatherAccount', visibleField: 'brideFatherAccountVisible', kakaoPayLinkField: 'brideFatherKakaoPayLink' },
    { label: '신부 어머니', accountField: 'brideMotherAccount', visibleField: 'brideMotherAccountVisible', kakaoPayLinkField: 'brideMotherKakaoPayLink' },
  ];

  const renderAccountFields = (fields: AccountField[]) => (
    <>
      {fields.map((field) => (
        <div key={field.accountField} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(accountInfo[field.visibleField] as boolean) ?? true}
              onChange={handleAccountChange(field.visibleField)}
              className="w-4 h-4 rounded border-border"
            />
            <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
          </div>
          <input
            type="text"
            value={(accountInfo[field.accountField] as string) || ''}
            onChange={handleAccountChange(field.accountField)}
            className={commonInputClass}
            placeholder="계좌번호 입력"
            disabled={!(accountInfo[field.visibleField] as boolean)}
          />
          <input
            type="text"
            value={(accountInfo[field.kakaoPayLinkField] as string) || ''}
            onChange={handleAccountChange(field.kakaoPayLinkField)}
            className={commonInputClass}
            placeholder="카카오페이 송금 링크 (선택사항)"
            disabled={!(accountInfo[field.visibleField] as boolean)}
          />
        </div>
      ))}
    </>
  );

  return (
    <div className="space-y-4">
      {/* 카카오페이 안내 */}
      <div className="border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
        <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">📱 카카오페이 송금 링크 안내</h4>
        <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
          <p className="font-medium">카카오페이 송금 코드 링크 발급 방법:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>카카오톡 더보기(...) → 상단(Pay) 아이콘 우측 송금 버튼 클릭</li>
            <li>하단 QR스캔 아이콘 클릭 → 하단 나의 송금코드 클릭</li>
            <li>하단 <strong>링크 복사</strong> 클릭</li>
            <li>복사한 링크(https://qr.kakaopay.com/...)를 아래 입력란에 붙여넣기</li>
          </ol>
          <p className="mt-2 text-yellow-600 dark:text-yellow-400">⚠️ 이 기능은 모바일 환경에서만 작동합니다.</p>
        </div>
      </div>

      {/* 신랑측 계좌번호 */}
      <div className="border border-border rounded-lg p-3 bg-muted/50 dark:bg-stone-800/50">
        <h4 className="text-sm font-semibold text-foreground mb-3">신랑측</h4>
        <div className="space-y-3">
          {renderAccountFields(groomFields)}
        </div>
      </div>

      {/* 신부측 계좌번호 */}
      <div className="border border-border rounded-lg p-3 bg-muted/50 dark:bg-stone-800/50">
        <h4 className="text-sm font-semibold text-foreground mb-3">신부측</h4>
        <div className="space-y-3">
          {renderAccountFields(brideFields)}
        </div>
      </div>
    </div>
  );
}
