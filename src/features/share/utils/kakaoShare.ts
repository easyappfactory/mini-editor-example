// features/share/utils/kakaoShare.ts
import { Block, CoupleInfo, WeddingDate } from '@/shared/types/block';

// 카카오톡 공유에 필요한 데이터 추출
export interface KakaoShareData {
  title: string; // 신랑신부 이름
  description: string; // 날짜 정보
  imageUrl: string; // 이미지 URL
  linkUrl: string; // 공유할 링크
}

/**
 * 블록 배열에서 카카오톡 공유에 필요한 데이터를 추출합니다.
 */
export function extractKakaoShareData(blocks: Block[], shareUrl: string): KakaoShareData {
  let coupleInfo: CoupleInfo | null = null;
  let weddingDate: WeddingDate | null = null;
  let imageUrl = '';

  // 블록에서 필요한 정보 추출
  for (const block of blocks) {
    if (block.type === 'couple_info' && !coupleInfo) {
      coupleInfo = block.content as CoupleInfo;
    }
    if (block.type === 'date' && !weddingDate) {
      weddingDate = block.content as WeddingDate;
    }
    if (block.type === 'image' && !imageUrl && typeof block.content === 'string') {
      imageUrl = block.content;
    }
  }

  // 제목: 신랑신부 이름
  const title = coupleInfo 
    ? `${coupleInfo.groomName} ❤️ ${coupleInfo.brideName}`
    : '청첩장';

  // 설명: 날짜 정보
  let description = '결혼식에 초대합니다';
  if (weddingDate) {
    const { year, month, day, time } = weddingDate;
    if (year && month && day) {
      description = `${year}년 ${month}월 ${day}일`;
      if (time) {
        description += ` ${time}`;
      }
    }
  }

  // 이미지가 없으면 기본 이미지 사용
  if (!imageUrl) {
    imageUrl = '/vercel.svg'; // 기본 이미지
  }

  // 이미지 URL 처리
  let finalImageUrl = imageUrl;
  if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
    // 상대 경로인 경우 절대 경로로 변환
    finalImageUrl = `${window.location.origin}${imageUrl}`;
  }

  return {
    title,
    description,
    imageUrl: finalImageUrl,
    linkUrl: shareUrl,
  };
}

/**
 * 카카오톡 공유를 실행합니다.
 */
export function shareToKakaoTalk(data: KakaoShareData) {
  // 카카오 SDK가 로드되었는지 확인
  if (typeof window === 'undefined' || !window.Kakao) {
    alert('카카오 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
    return;
  }

  // 카카오 SDK 초기화 확인
  if (!window.Kakao.isInitialized()) {
    alert('카카오 SDK가 초기화되지 않았습니다.\n환경 변수 NEXT_PUBLIC_KAKAO_JS_KEY가 설정되어 있는지 확인해주세요.');
    return;
  }

  // Feed 템플릿으로 공유
  try {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        link: {
          mobileWebUrl: data.linkUrl,
          webUrl: data.linkUrl,
        },
      },
    });
  } catch (error) {
    console.error('카카오톡 공유 오류:', error);
    alert('카카오톡 공유 중 오류가 발생했습니다.\nKAKAO_SETUP.md 파일을 참고하여 설정을 확인해주세요.');
  }
}
