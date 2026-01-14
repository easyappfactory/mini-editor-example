// features/wedding/blocks/MapBlock/useMapBlock.ts
/**
 * Headless UI Hook: 지도 정보 로직
 */

import { MapInfo } from '@/shared/types/block';

export function useMapBlock(content: MapInfo) {
  // 데이터가 비어있으면 예시 데이터 표시
  const placeName = content.placeName || '그랜드 웨딩홀';
  const address = content.address || '';
  const detailAddress = content.detailAddress || '';
  const latitude = content.latitude;
  const longitude = content.longitude;
  
  // 좌표가 있으면 길찾기 URL 생성
  const getDirectionsUrl = (): string | null => {
    if (latitude && longitude) {
      return `https://map.kakao.com/link/to/${encodeURIComponent(placeName)},${latitude},${longitude}`;
    }
    if (placeName) {
      // 좌표가 없어도 장소 이름으로 길찾기 가능
      return `https://map.kakao.com/link/search/${encodeURIComponent(placeName)}`;
    }
    return null;
  };
  
  return {
    placeName,
    address,
    detailAddress,
    latitude,
    longitude,
    directionsUrl: getDirectionsUrl(),
    hasCoordinates: !!(latitude && longitude),
  };
}
