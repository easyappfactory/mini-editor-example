// features/wedding/blocks/AccountBlock/useAccountBlock.ts
/**
 * Headless UI Hook: 계좌번호 블록 로직
 */

import { AccountInfo } from '@/shared/types/block';

export function useAccountBlock(content: AccountInfo) {
  // 기본값 설정
  const accountInfo: AccountInfo = {
    groomAccount: content.groomAccount || '',
    groomAccountVisible: content.groomAccountVisible ?? true,
    groomFatherAccount: content.groomFatherAccount || '',
    groomFatherAccountVisible: content.groomFatherAccountVisible ?? true,
    groomMotherAccount: content.groomMotherAccount || '',
    groomMotherAccountVisible: content.groomMotherAccountVisible ?? true,
    brideAccount: content.brideAccount || '',
    brideAccountVisible: content.brideAccountVisible ?? true,
    brideFatherAccount: content.brideFatherAccount || '',
    brideFatherAccountVisible: content.brideFatherAccountVisible ?? true,
    brideMotherAccount: content.brideMotherAccount || '',
    brideMotherAccountVisible: content.brideMotherAccountVisible ?? true,
  };

  // 신랑측에 표시할 계좌번호 목록
  const groomAccounts = [
    {
      label: '신랑',
      account: accountInfo.groomAccount,
      visible: accountInfo.groomAccountVisible,
    },
    {
      label: '신랑 아버지',
      account: accountInfo.groomFatherAccount,
      visible: accountInfo.groomFatherAccountVisible,
    },
    {
      label: '신랑 어머니',
      account: accountInfo.groomMotherAccount,
      visible: accountInfo.groomMotherAccountVisible,
    },
  ].filter(item => item.account && item.visible);

  // 신부측에 표시할 계좌번호 목록
  const brideAccounts = [
    {
      label: '신부',
      account: accountInfo.brideAccount,
      visible: accountInfo.brideAccountVisible,
    },
    {
      label: '신부 아버지',
      account: accountInfo.brideFatherAccount,
      visible: accountInfo.brideFatherAccountVisible,
    },
    {
      label: '신부 어머니',
      account: accountInfo.brideMotherAccount,
      visible: accountInfo.brideMotherAccountVisible,
    },
  ].filter(item => item.account && item.visible);

  return {
    accountInfo,
    groomAccounts,
    brideAccounts,
  };
}
