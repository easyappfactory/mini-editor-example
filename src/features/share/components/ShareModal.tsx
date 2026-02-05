// features/share/components/ShareModal.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Block, ImageGridContent } from '@/shared/types/block';
import { extractKakaoShareData, shareToKakaoTalk, KakaoShareData } from '../utils/kakaoShare';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  blocks: Block[];
  isPremium: boolean;
  onOpenPremiumModal?: () => void;
}

export default function ShareModal({ isOpen, onClose, url, blocks, isPremium, onOpenPremiumModal }: Props) {
  const [copied, setCopied] = useState(false);
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [metadata, setMetadata] = useState<KakaoShareData | null>(null);

  const availableImages = useMemo(() => {
    const images: string[] = [];
    blocks.forEach(block => {
      if (block.type === 'image' && typeof block.content === 'string') {
        images.push(block.content);
      } else if (block.type === 'image_grid' && typeof block.content === 'object' && block.content !== null) {
        const gridContent = block.content as ImageGridContent;
        if (gridContent.type === 'grid' && gridContent.slots) {
          gridContent.slots.forEach(slot => {
            if (slot.imageSrc) {
              images.push(slot.imageSrc);
            }
          });
        }
      }
    });
    return images;
  }, [blocks]);

  useEffect(() => {
    if (isOpen && blocks.length > 0) {
      const extractedData = extractKakaoShareData(blocks, url);
      setMetadata(extractedData);
      setIsEditingMetadata(false);
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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

  const handleKakaoShare = async () => {
    try {
      if (!metadata) return;
      await shareToKakaoTalk(metadata);
    } catch (err) {
      console.error('카카오톡 공유 실패:', err);
      alert('카카오톡 공유에 실패했습니다. 카카오 SDK가 제대로 로드되었는지 확인해주세요.');
    }
  };

  const handleMetadataChange = (field: keyof KakaoShareData, value: string) => {
    if (!metadata) return;
    setMetadata({ ...metadata, [field]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold mb-4 text-gray-800 pr-8">🎉 저장 완료!</h2>
        
        {!isPremium && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800 font-medium mb-2">
              ⚠️ 데모 버전에서는 워터마크가 표시됩니다.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenPremiumModal?.();
              }}
              className="w-full py-2 px-3 bg-yellow-600 text-white rounded font-medium hover:bg-yellow-700 transition-colors text-sm"
            >
              프리미엄 코드 입력하기
            </button>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">
          청첩장이 저장되었습니다. 아래 주소를 공유해보세요.
        </p>

        <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4">
          <p className="text-sm text-gray-700 break-all">
            {url}
          </p>
        </div>

        {isPremium && metadata && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">공유 메타데이터</h3>
              <button
                onClick={() => setIsEditingMetadata(!isEditingMetadata)}
                className="text-xs text-primary hover:underline"
              >
                {isEditingMetadata ? '완료' : '수정'}
              </button>
            </div>
            
            {isEditingMetadata ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">제목</label>
                  <input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => handleMetadataChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">설명</label>
                  <input
                    type="text"
                    value={metadata.description}
                    onChange={(e) => handleMetadataChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">대표 이미지</label>
                  {availableImages.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleMetadataChange('imageUrl', imgUrl)}
                          className={`relative aspect-square rounded border-2 overflow-hidden transition-all ${
                            metadata.imageUrl === imgUrl
                              ? 'border-primary ring-2 ring-primary ring-offset-1'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`이미지 ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 py-2">업로드된 이미지가 없습니다</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-2">
                <div>
                  <p className="text-xs text-gray-500">제목</p>
                  <p className="text-sm text-gray-800">{metadata.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">설명</p>
                  <p className="text-sm text-gray-800">{metadata.description}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">대표 이미지</p>
                  {metadata.imageUrl && (
                    <img
                      src={metadata.imageUrl}
                      alt="대표 이미지"
                      className="w-full h-32 object-cover rounded border border-gray-200"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={handleKakaoShare}
            className="w-full py-3 px-4 rounded font-semibold transition-colors bg-yellow-300 text-gray-800 hover:bg-yellow-400 flex items-center justify-center gap-2"
          >
            <span className="text-lg">💬</span>
            카카오톡으로 공유하기
          </button>

          <button
            onClick={handleCopy}
            className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {copied ? '✓ 복사됨!' : '주소 복사'}
          </button>
        </div>
      </div>
    </div>
  );
}

