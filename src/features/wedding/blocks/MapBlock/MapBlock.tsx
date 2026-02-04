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
  const { variant = 'default', color, className } = block.styles || {};
  
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

    if (checkKakaoMapAPI()) return;

    const script = document.createElement('script');
    const appKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '';
    
    if (!appKey) {
      setTimeout(() => setMapError('카카오맵 API 키가 설정되지 않았습니다.'), 0);
      return;
    }

    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => setIsMapLoaded(true));
      }
    };
    
    script.onerror = () => setMapError('카카오맵 API를 로드할 수 없습니다.');

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  // 지도 업데이트 함수
  const updateMap = (coords: KakaoLatLng, kakaoMap: KakaoMap) => {
    kakaoMap.setCenter(coords);
    
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
    
    const markerOptions: KakaoMarkerOptions = { position: coords };
    const marker = new window.kakao.maps.Marker(markerOptions);
    marker.setMap(kakaoMap);
    markerRef.current = marker;
  };

  // 지도 초기화 및 마커 표시
  useEffect(() => {
    if (!isMapLoaded || !mapContainer.current) return;

    if (latitude && longitude) {
      const container = mapContainer.current;
      const center = new window.kakao.maps.LatLng(latitude, longitude);

      if (map) {
        updateMap(center, map);
        return;
      }

      const options: KakaoMapOptions = { center, level: 3 };
      const kakaoMap = new window.kakao.maps.Map(container, options);
      setMap(kakaoMap);

      const markerOptions: KakaoMarkerOptions = { position: center };
      const marker = new window.kakao.maps.Marker(markerOptions);
      marker.setMap(kakaoMap);
      markerRef.current = marker;
      return;
    }

    if (address || placeName) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const places = new window.kakao.maps.services.Places();
      const searchQuery = address || placeName;

      if (address) {
        geocoder.addressSearch(searchQuery, (result: GeocoderResult[], status: string) => {
          if (status === 'OK' || status === window.kakao.maps.services.Status?.OK) {
            if (result.length === 0) {
              setMapError('주소를 찾을 수 없습니다.');
              return;
            }

            const firstResult = result[0];
            const coords = new window.kakao.maps.LatLng(parseFloat(firstResult.y), parseFloat(firstResult.x));
            const container = mapContainer.current;
            if (!container) return;

            if (map) {
              updateMap(coords, map);
              return;
            }

            const options: KakaoMapOptions = { center: coords, level: 3 };
            const kakaoMap = new window.kakao.maps.Map(container, options);
            setMap(kakaoMap);

            const markerOptions: KakaoMarkerOptions = { position: coords };
            const marker = new window.kakao.maps.Marker(markerOptions);
            marker.setMap(kakaoMap);
            markerRef.current = marker;
          } else {
            places.keywordSearch(placeName, (data: PlaceSearchResult, status: string) => {
              if ((status === 'OK' || status === window.kakao.maps.services.Status?.OK) && data.places && data.places.length > 0) {
                const place = data.places[0];
                const coords = new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
                const container = mapContainer.current;
                if (!container) return;

                if (map) {
                  updateMap(coords, map);
                  return;
                }

                const options: KakaoMapOptions = { center: coords, level: 3 };
                const kakaoMap = new window.kakao.maps.Map(container, options);
                setMap(kakaoMap);

                const markerOptions: KakaoMarkerOptions = { position: coords };
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
        places.keywordSearch(placeName, (data: PlaceSearchResult, status: string) => {
          if ((status === 'OK' || status === window.kakao.maps.services.Status?.OK) && data.places && data.places.length > 0) {
            const place = data.places[0];
            const coords = new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
            const container = mapContainer.current;
            if (!container) return;

            const options: KakaoMapOptions = { center: coords, level: 3 };
            const kakaoMap = new window.kakao.maps.Map(container, options);
            setMap(kakaoMap);

            const markerOptions: KakaoMarkerOptions = { position: coords };
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
    <div className={`w-full p-6 ${className || ''}`} style={{ color }}>
      <div className="max-w-sm mx-auto">
        {variant !== 'minimal' && (
          <p className="text-sm opacity-60 mb-3 text-center">예식장</p>
        )}
        
        {placeName && (
          <h3 className="text-xl font-bold mb-2 text-center">
            {placeName}
          </h3>
        )}
        
        {address && (
          <p className="text-sm opacity-80 mb-2 text-center leading-relaxed">
            {address}
          </p>
        )}
        
        {detailAddress && (
          <p className="text-md opacity-80 mb-4 text-center">
            {detailAddress}
          </p>
        )}

        {/* 지도 컨테이너 */}
        <div className="relative w-full mb-4">
          <div 
            ref={mapContainer}
            className={`w-full h-64 overflow-hidden border border-gray-300 ${variant === 'rounded' ? 'rounded-2xl' : 'rounded-lg'}`}
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAE100] hover:bg-[#FADB00] text-[#3C1E1E] rounded-lg font-semibold text-sm transition-colors shadow-sm"
            >
              <img 
                src="https://t1.daumcdn.net/localimg/localimages/07/2018/pc/common/logo_kakaomap.png" 
                alt="카카오맵" 
                className="h-4 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span>길찾기</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
