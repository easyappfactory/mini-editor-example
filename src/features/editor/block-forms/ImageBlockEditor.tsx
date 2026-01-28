'use client';

import { useState } from 'react';

interface ImageBlockEditorProps {
  content: string;
  onUpdate: (url: string) => void;
}

export default function ImageBlockEditor({ content, onUpdate }: ImageBlockEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const imageUrl = content;

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '이미지 업로드에 실패했습니다.');
      }

      const data = await response.json();
      onUpdate(data.url);
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">
          이미지 URL
        </label>
        <input
          type="text"
          value={imageUrl}
          onChange={handleImageUrlChange}
          className="w-full border border-border rounded p-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 border-t border-border"></div>
        <span className="text-xs text-muted-foreground">또는</span>
        <div className="flex-1 border-t border-border"></div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">
          로컬 이미지 업로드
        </label>
        <label 
          className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded p-3 transition-colors ${
            isUploading 
              ? 'border-border bg-muted cursor-not-allowed' 
              : 'border-primary/50 hover:bg-primary/5 cursor-pointer bg-background'
          }`}
        >
          {isUploading ? (
            <>
              <span className="text-2xl animate-spin">⏳</span>
              <span className="text-sm font-medium text-muted-foreground">
                업로드 중...
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl">📁</span>
              <span className="text-sm font-medium text-primary">
                이미지 파일 선택
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
      {imageUrl && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">미리보기:</p>
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="w-full h-20 object-cover rounded border border-border"
          />
        </div>
      )}
    </div>
  );
}
