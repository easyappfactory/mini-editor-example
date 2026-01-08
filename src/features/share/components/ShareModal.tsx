// features/share/components/ShareModal.tsx
'use client';

import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function ShareModal({ isOpen, onClose, url }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // 2초 후 "복사됨" 상태 해제
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('복사 실패:', err);
      alert('주소 복사에 실패했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">🎉 저장 완료!</h2>
        
        <p className="text-sm text-gray-600 mb-4">
          청첩장이 저장되었습니다. 아래 주소를 공유해보세요.
        </p>

        <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4">
          <p className="text-sm text-gray-700 break-all">
            {url}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex-1 py-2 px-4 rounded font-semibold transition-colors ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? '✓ 복사됨!' : '주소 복사'}
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

