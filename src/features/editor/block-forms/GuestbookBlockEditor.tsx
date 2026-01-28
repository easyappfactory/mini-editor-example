'use client';

export default function GuestbookBlockEditor() {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-foreground">
        방명록은 방문자가 작성하는 영역이에요.
      </div>
      <div className="text-xs text-muted-foreground">
        미리보기/공유 페이지에서 실제 방명록 UI가 표시됩니다.
      </div>
    </div>
  );
}
