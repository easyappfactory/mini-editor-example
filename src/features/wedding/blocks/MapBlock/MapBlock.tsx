// features/wedding/blocks/MapBlock/MapBlock.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Block, MapInfo } from "@/shared/types/block";
import { useMapBlock } from "./useMapBlock";
import type { KakaoMapsAPI, KakaoMap, KakaoMapOptions, KakaoLatLng, GeocoderResult, PlaceSearchResult, KakaoMarkerOptions, KakaoMarker } from "./types";

// 카카오맵 API 타입 선언
declare global {
  interface Window {
    kakao: {
      maps: KakaoMapsAPI;
    };
  }
}

interface Props {
  block: Block;
}

export default function MapBlock({ block }: Props) {
  const mapInfo = block.content as MapInfo;
  const { placeName, address, detailAddress, latitude, longitude, directionsUrl } = useMapBlock(mapInfo);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // 카카오맵 API 로드 확인
  useEffect(() => {
    const checkKakaoMapAPI = () => {
      if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
        setIsMapLoaded(true);
        return true;
      }
      return false;
    };

    // 이미 로드되어 있으면 바로 사용
    if (checkKakaoMapAPI()) {
      return;
    }

    // 카카오맵 API 스크립트 로드
    const script = document.createElement('script');
    const appKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '';
    
    if (!appKey) {
      // 비동기로 에러 상태 설정하여 cascading renders 방지
      setTimeout(() => {
        setMapError('카카오맵 API 키가 설정되지 않았습니다.');
      }, 0);
      return;
    }

    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setIsMapLoaded(true);
        });
      }
    };
    
    script.onerror = () => {
      setMapError('카카오맵 API를 로드할 수 없습니다.');
    };

    document.head.appendChild(script);

    return () => {
      // 정리 작업
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // 지도 업데이트 함수
  const updateMap = (coords: KakaoLatLng, kakaoMap: KakaoMap) => {
    // 지도 중심 이동
    kakaoMap.setCenter(coords);
    
    // 기존 마커 제거
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
    
    // 새 마커 생성
    const markerOptions: KakaoMarkerOptions = {
      position: coords,
    };
    const marker = new window.kakao.maps.Marker(markerOptions);
    marker.setMap(kakaoMap);
    markerRef.current = marker;
  };

  // 지도 초기화 및 마커 표시
  useEffect(() => {
    if (!isMapLoaded || !mapContainer.current) return;

    // 좌표가 있으면 바로 지도 표시
    if (latitude && longitude) {
      const container = mapContainer.current;
      if (!container) return;

      const center = new window.kakao.maps.LatLng(latitude, longitude);

      // 지도가 이미 있으면 업데이트, 없으면 생성
      if (map) {
        updateMap(center, map);
        return;
      }

      const options: KakaoMapOptions = {
        center,
        level: 3,
      };

      const kakaoMap = new window.kakao.maps.Map(container, options);
      setMap(kakaoMap);

      // 마커 표시
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
      const markerOptions: KakaoMarkerOptions = {
        position: markerPosition,
      };
      const marker = new window.kakao.maps.Marker(markerOptions);
      marker.setMap(kakaoMap);
      markerRef.current = marker;
      return;
    }

    // 좌표가 없으면 주소나 장소명으로 검색
    if (address || placeName) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const places = new window.kakao.maps.services.Places();
      const searchQuery = address || placeName;

      // 주소로 검색 시도
      if (address) {
        geocoder.addressSearch(searchQuery, (result: GeocoderResult[], status: string) => {
          if (status === 'OK' || status === window.kakao.maps.services.Status?.OK) {
            if (result.length === 0) {
              setMapError('주소를 찾을 수 없습니다.');
              return;
            }

            const firstResult = result[0];
            const coords = new window.kakao.maps.LatLng(
              parseFloat(firstResult.y),
              parseFloat(firstResult.x)
            );

            const container = mapContainer.current;
            if (!container) return;

            // 지도가 이미 있으면 업데이트, 없으면 생성
            if (map) {
              updateMap(coords, map);
              return;
            }

            const options: KakaoMapOptions = {
              center: coords,
              level: 3,
            };

            const kakaoMap = new window.kakao.maps.Map(container, options);
            setMap(kakaoMap);

            // 마커 표시
            const markerOptions: KakaoMarkerOptions = {
              position: coords,
            };
            const marker = new window.kakao.maps.Marker(markerOptions);
            marker.setMap(kakaoMap);
            markerRef.current = marker;
          } else {
            // 주소 검색 실패 시 장소명으로 검색
            places.keywordSearch(placeName, (data: PlaceSearchResult, status: string) => {
              if ((status === 'OK' || status === window.kakao.maps.services.Status?.OK) && data.places && data.places.length > 0) {
                const place = data.places[0];
                const coords = new window.kakao.maps.LatLng(
                  parseFloat(place.y),
                  parseFloat(place.x)
                );

                const container = mapContainer.current;
                if (!container) return;

                // 지도가 이미 있으면 업데이트, 없으면 생성
                if (map) {
                  updateMap(coords, map);
                  return;
                }

                const options: KakaoMapOptions = {
                  center: coords,
                  level: 3,
                };

                const kakaoMap = new window.kakao.maps.Map(container, options);
                setMap(kakaoMap);

                const markerOptions: KakaoMarkerOptions = {
                  position: coords,
                };
                const marker = new window.kakao.maps.Marker(markerOptions);
                marker.setMap(kakaoMap);
                markerRef.current = marker;
              } else {
                setMapError('장소를 찾을 수 없습니다.');
              }
            });
          }
        });
      } else if (placeName) {
        // 장소명으로만 검색
        places.keywordSearch(placeName, (data: PlaceSearchResult, status: string) => {
          if ((status === 'OK' || status === window.kakao.maps.services.Status?.OK) && data.places && data.places.length > 0) {
            const place = data.places[0];
            const coords = new window.kakao.maps.LatLng(
              parseFloat(place.y),
              parseFloat(place.x)
            );

            const container = mapContainer.current;
            if (!container) return;

            const options: KakaoMapOptions = {
              center: coords,
              level: 3,
            };

            const kakaoMap = new window.kakao.maps.Map(container, options);
            setMap(kakaoMap);

            const markerOptions: KakaoMarkerOptions = {
              position: coords,
            };
            const marker = new window.kakao.maps.Marker(markerOptions);
            marker.setMap(kakaoMap);
          } else {
            setMapError('장소를 찾을 수 없습니다.');
          }
        });
      }
    }
  }, [isMapLoaded, latitude, longitude, address, placeName, map]);

  return (
    <div className="w-full p-6">
      <div className="max-w-sm mx-auto">
        <p className="text-sm text-gray-500 mb-3 text-center">예식장</p>
        
        {placeName && (
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
            {placeName}
          </h3>
        )}
        
        {address && (
          <p className="text-sm text-gray-600 mb-2 text-center leading-relaxed">
            {address}
          </p>
        )}
        
        {detailAddress && (
          <p className="text-md text-gray-600 mb-4 text-center">
            {detailAddress}
          </p>
        )}

        {/* 지도 컨테이너 */}
        <div className="relative w-full mb-4">
          <div 
            ref={mapContainer}
            className="w-full h-64 rounded-lg overflow-hidden border border-gray-300"
            style={{ minHeight: '256px' }}
          />
          
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-500">{mapError}</p>
            </div>
          )}
          
          {!isMapLoaded && !mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-500">지도를 불러오는 중...</p>
            </div>
          )}
        </div>

        {/* 길찾기 버튼 */}
        {directionsUrl && (
          <div className="text-center">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-semibold text-sm transition-colors shadow-sm"
            >
              <img 
                src="/kakaomap_logo.png" 
                alt="카카오맵" 
                className="h-6 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
