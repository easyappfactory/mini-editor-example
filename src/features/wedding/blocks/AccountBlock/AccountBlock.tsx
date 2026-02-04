// features/wedding/blocks/AccountBlock/AccountBlock.tsx
'use client';

import { useState } from 'react';
import { Block, AccountInfo } from "@/shared/types/block";
import { useAccountBlock } from "./useAccountBlock";

interface Props {
  block: Block;
}

export default function AccountBlock({ block }: Props) {
  const accountInfo = (typeof block.content !== 'string' && 'groomAccount' in (block.content || {}))
    ? block.content as AccountInfo
    : {} as AccountInfo;
  const { groomAccounts, brideAccounts } = useAccountBlock(accountInfo);
  const { variant = 'default', color: customColor, className, padding: customPadding } = block.styles || {};
  
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Variant Config
  const variantConfig: Record<string, {
    defaultColor: string;
    defaultPadding: string;
  }> = {
    modern: {
      defaultColor: 'inherit',
      defaultPadding: 'py-12 px-6',
    },
    default: {
      defaultColor: 'inherit',
      defaultPadding: 'p-6',
    },
  };

  const currentVariant = variantConfig[variant] || variantConfig.default;
  const color = customColor || currentVariant.defaultColor;
  const padding = customPadding || currentVariant.defaultPadding;

  const handleCopyAccount = async (account: string) => {
    try {
      await navigator.clipboard.writeText(account);
      setCopiedAccount(account);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch {
      alert('계좌번호 복사에 실패했습니다.');
    }
  };

  const handleKakaoPayTransfer = (kakaoPayLink: string | undefined, account: string | undefined, label: string) => {
    if (!account) return;
    
    if (kakaoPayLink) {
      window.location.assign(kakaoPayLink);
    } else {
      alert(`카카오페이 송금 링크가 등록되지 않았습니다.\n\n${label} 계좌번호: ${account}\n\n계좌번호를 복사하여 직접 송금해주세요.`);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          마음 전하실 곳
        </h3>

        {/* 신랑측/신부측 토글 */}
        <div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('groom')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'groom'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            신랑측
          </button>
          <button
            onClick={() => setActiveTab('bride')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'bride'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            신부측
          </button>
        </div>

        {/* 신랑측 계좌번호 */}
        {activeTab === 'groom' && (
          <div className="space-y-4">
            {groomAccounts.length > 0 ? (
              groomAccounts.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyAccount(item.account || '')}
                      className="flex items-center gap-2 text-base font-mono text-gray-900 hover:text-blue-600 transition-colors cursor-pointer group"
                      title="클릭하여 복사"
                    >
                      <span>{item.account}</span>
                      {copiedAccount === item.account ? (
                        <span className="text-xs text-green-600 font-sans">✓ 복사됨</span>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                    {item.kakaoPayLink && (
                      <button
                        onClick={() => handleKakaoPayTransfer(item.kakaoPayLink, item.account, item.label)}
                        className="ml-3 px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg text-xs transition-colors shadow-sm whitespace-nowrap"
                      >
                        카카오페이 송금
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                등록된 계좌번호가 없습니다.
              </div>
            )}
          </div>
        )}

        {/* 신부측 계좌번호 */}
        {activeTab === 'bride' && (
          <div className="space-y-4">
            {brideAccounts.length > 0 ? (
              brideAccounts.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyAccount(item.account || '')}
                      className="flex items-center gap-2 text-base font-mono text-gray-900 hover:text-blue-600 transition-colors cursor-pointer group"
                      title="클릭하여 복사"
                    >
                      <span>{item.account}</span>
                      {copiedAccount === item.account ? (
                        <span className="text-xs text-green-600 font-sans">✓ 복사됨</span>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                    {item.kakaoPayLink && (
                      <button
                        onClick={() => handleKakaoPayTransfer(item.kakaoPayLink, item.account, item.label)}
                        className="ml-3 px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg text-xs transition-colors shadow-sm whitespace-nowrap"
                      >
                        카카오페이 송금
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                등록된 계좌번호가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
