// features/premium/components/PremiumModal.tsx
'use client';

import { useState } from 'react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: string) => void | Promise<void>;
  projectId?: string;
}

export default function PremiumModal({ isOpen, onClose, onSuccess, projectId }: PremiumModalProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/coupons/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: code.trim().toUpperCase(),
          projectId 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '코드 인증에 실패했습니다.');
        return;
      }

      // 성공
      await onSuccess(data.code);
      setCode('');
    } catch (err) {
      console.error('코드 인증 오류:', err);
      setError('서버와의 통신에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎁</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            프리미엄 기능 해제
          </h2>
          <p className="text-sm text-gray-600">
            구매하신 코드를 입력하여 프리미엄 기능을 해제하세요
          </p>
        </div>

        {/* 코드 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              인증 코드
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="예: A3F9-K2P1"
              className="w-full border-2 border-gray-300 rounded-lg p-3 text-center text-lg font-mono uppercase focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              maxLength={9}
              disabled={isLoading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span>
                <span>{error}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!code.trim() || isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                <span>확인 중...</span>
              </span>
            ) : (
              '코드 인증하기'
            )}
          </button>
        </form>

        {/* 구매 안내 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            아직 코드가 없으신가요?
          </p>
          <a
            href="https://smartstore.naver.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
          >
            네이버 스토어에서 구매하기 →
          </a>
        </div>

        {/* 도움말 */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 leading-relaxed">
            💡 <strong>프리미엄 기능:</strong> 워터마크 제거, 저장 및 공유 기능 무제한 사용
          </p>
        </div>
      </div>
    </div>
  );
}
