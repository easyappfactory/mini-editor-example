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
    groomKakaoPayLink: content.groomKakaoPayLink || '',
    groomFatherAccount: content.groomFatherAccount || '',
    groomFatherAccountVisible: content.groomFatherAccountVisible ?? true,
    groomFatherKakaoPayLink: content.groomFatherKakaoPayLink || '',
    groomMotherAccount: content.groomMotherAccount || '',
    groomMotherAccountVisible: content.groomMotherAccountVisible ?? true,
    groomMotherKakaoPayLink: content.groomMotherKakaoPayLink || '',
    brideAccount: content.brideAccount || '',
    brideAccountVisible: content.brideAccountVisible ?? true,
    brideKakaoPayLink: content.brideKakaoPayLink || '',
    brideFatherAccount: content.brideFatherAccount || '',
    brideFatherAccountVisible: content.brideFatherAccountVisible ?? true,
    brideFatherKakaoPayLink: content.brideFatherKakaoPayLink || '',
    brideMotherAccount: content.brideMotherAccount || '',
    brideMotherAccountVisible: content.brideMotherAccountVisible ?? true,
    brideMotherKakaoPayLink: content.brideMotherKakaoPayLink || '',
  };

  // 신랑측에 표시할 계좌번호 목록
  const groomAccounts = [
    {
      label: '신랑',
      account: accountInfo.groomAccount,
      visible: accountInfo.groomAccountVisible,
      kakaoPayLink: accountInfo.groomKakaoPayLink,
    },
    {
      label: '신랑 아버지',
      account: accountInfo.groomFatherAccount,
      visible: accountInfo.groomFatherAccountVisible,
      kakaoPayLink: accountInfo.groomFatherKakaoPayLink,
    },
    {
      label: '신랑 어머니',
      account: accountInfo.groomMotherAccount,
      visible: accountInfo.groomMotherAccountVisible,
      kakaoPayLink: accountInfo.groomMotherKakaoPayLink,
    },
  ].filter(item => item.account && item.visible);

  // 신부측에 표시할 계좌번호 목록
  const brideAccounts = [
    {
      label: '신부',
      account: accountInfo.brideAccount,
      visible: accountInfo.brideAccountVisible,
      kakaoPayLink: accountInfo.brideKakaoPayLink,
    },
    {
      label: '신부 아버지',
      account: accountInfo.brideFatherAccount,
      visible: accountInfo.brideFatherAccountVisible,
      kakaoPayLink: accountInfo.brideFatherKakaoPayLink,
    },
    {
      label: '신부 어머니',
      account: accountInfo.brideMotherAccount,
      visible: accountInfo.brideMotherAccountVisible,
      kakaoPayLink: accountInfo.brideMotherKakaoPayLink,
    },
  ].filter(item => item.account && item.visible);

  return {
    accountInfo,
    groomAccounts,
    brideAccounts,
  };
}
