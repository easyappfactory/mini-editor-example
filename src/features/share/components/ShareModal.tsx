// features/share/components/ShareModal.tsx
'use client';

import { useState } from 'react';
import { Block } from '@/shared/types/block';
import { extractKakaoShareData, shareToKakaoTalk } from '../utils/kakaoShare';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  blocks: Block[];
}

export default function ShareModal({ isOpen, onClose, url, blocks }: Props) {
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

  const handleKakaoShare = () => {
    try {
      const shareData = extractKakaoShareData(blocks, url);
      shareToKakaoTalk(shareData);
    } catch (err) {
      console.error('카카오톡 공유 실패:', err);
      alert('카카오톡 공유에 실패했습니다. 카카오 SDK가 제대로 로드되었는지 확인해주세요.');
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

        <div className="flex flex-col gap-2">
          {/* 카카오톡 공유 버튼 */}
          <button
            onClick={handleKakaoShare}
            className="w-full py-3 px-4 rounded font-semibold transition-colors bg-yellow-300 text-gray-800 hover:bg-yellow-400 flex items-center justify-center gap-2"
          >
            <span className="text-lg">💬</span>
            카카오톡으로 공유하기
          </button>

          {/* 주소 복사 버튼 */}
          <button
            onClick={handleCopy}
            className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? '✓ 복사됨!' : '주소 복사'}
          </button>
          
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="w-full py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

