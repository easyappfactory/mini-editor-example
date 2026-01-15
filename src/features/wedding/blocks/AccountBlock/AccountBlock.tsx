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
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');

  const handleKakaoPayTransfer = (account: string | undefined, label: string) => {
    if (!account) return;
    // 카카오페이 코드송금 API가 현재 중단되어 있어 alert만 표시
    alert(`일시적으로 카카오페이 코드송금 API 제휴가 중단되었습니다.\n\n${label} 계좌번호: ${account}\n\n시스템 개선 작업 완료 후 제휴가 재개될 예정입니다.`);
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
                  <div className="flex items-center justify-between">
                    <span className="text-base font-mono text-gray-900">
                      {item.account}
                    </span>
                    <button
                      onClick={() => item.account && handleKakaoPayTransfer(item.account, item.label)}
                      className="ml-3 px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg text-xs transition-colors shadow-sm whitespace-nowrap"
                    >
                      카카오페이 송금
                    </button>
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
                  <div className="flex items-center justify-between">
                    <span className="text-base font-mono text-gray-900">
                      {item.account}
                    </span>
                    <button
                      onClick={() => item.account && handleKakaoPayTransfer(item.account, item.label)}
                      className="ml-3 px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg text-xs transition-colors shadow-sm whitespace-nowrap"
                    >
                      카카오페이 송금
                    </button>
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
