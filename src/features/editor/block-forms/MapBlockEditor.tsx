// features/editor/components/MapBlockEditor.tsx
'use client';

import { useState } from 'react';
import { MapInfo } from '@/shared/types/block';
import DaumPostcode, { Address } from 'react-daum-postcode';

interface MapBlockEditorProps {
  mapInfo: MapInfo;
  onUpdate: (info: MapInfo) => void;
}

interface PlaceResult {
  id: string;
  placeName: string;
  address: string;
  roadAddress: string;
  phone: string;
  categoryName: string;
  x: string;
  y: string;
  placeUrl: string;
}

export default function MapBlockEditor({ mapInfo, onUpdate }: MapBlockEditorProps) {
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 우편번호 서비스 완료 핸들러
  const handleAddressComplete = async (data: Address) => {
    // 도로명 주소 또는 지번 주소
    const mainAddress = data.roadAddress || data.jibunAddress || data.address;
    
    // 건물명 추출 (장소명으로 사용)
    const buildingName = data.buildingName || '';
    
    // 주소로 좌표 변환 (카카오 로컬 API 사용)
    try {
      const response = await fetch(`/api/search/address?query=${encodeURIComponent(mainAddress)}`);
      if (response.ok) {
        const coordData = await response.json();
        if (coordData.documents && coordData.documents.length > 0) {
          const firstDoc = coordData.documents[0];
          // 카카오 로컬 API 응답 형식: y는 위도, x는 경도
          // 좌표와 함께 업데이트
          onUpdate({
            ...mapInfo,
            placeName: buildingName,
            address: mainAddress,
            latitude: parseFloat(firstDoc.y), // 위도
            longitude: parseFloat(firstDoc.x), // 경도
          });
          setShowAddressPopup(false);
          return;
        }
      }
    } catch (error) {
      console.error('좌표 변환 오류:', error);
    }
    
    // 좌표 변환 실패 시 주소만 업데이트 (MapBlock에서 geocoder로 변환)
    onUpdate({
      ...mapInfo,
      placeName: buildingName,
      address: mainAddress,
    });

    setShowAddressPopup(false);
  };

  // Kakao 로컬 API 키워드 검색
  const handleKeywordSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search/place?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('검색에 실패했습니다.');
      }
      const data = await response.json();
      setSearchResults(data.places || []);
      setShowResults(true);
    } catch (error) {
      console.error('장소 검색 오류:', error);
      alert('장소 검색에 실패했습니다. 다시 시도해주세요.');
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Kakao 로컬 API 검색 결과 선택 핸들러
  const handleSelectPlace = (place: PlaceResult) => {
    onUpdate({
      placeName: place.placeName,
      address: place.roadAddress || place.address,
      detailAddress: mapInfo.detailAddress || '', // 기존 detailAddress 유지
      latitude: parseFloat(place.y), // 위도
      longitude: parseFloat(place.x), // 경도
    });
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 검색 방식 선택 */}
      <div className="flex flex-col gap-3">
        <label className="block text-xs font-bold text-muted-foreground mb-1">
          방법 1: 우편번호로 주소 찾기 (건물명 검색 불가)
        </label>
        
        {/* 방법 1: 우편번호 서비스 */}
        <div className="flex flex-col">
          <button
            onClick={() => setShowAddressPopup(true)}
            className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span> 우편번호로 주소 찾기</span>
          </button>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-border"></div>
          <span className="text-xs text-muted-foreground">또는</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        {/* 방법 2: Kakao 로컬 API 키워드 검색 */}
        <div className="flex flex-col relative">
          <label className="block text-xs font-bold text-muted-foreground mb-2">
            방법 2: 건물명으로 검색 (UI 커스텀 디자인 필요)
          </label>
          
          {/* 검색 입력창 + 검색 버튼 */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleKeywordSearch();
                }
              }}
              className="flex-1 border border-border rounded p-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="예: 그랜드 웨딩홀, 당산동 그랜드 컨벤션 센타"
            />
            <button
              onClick={handleKeywordSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center transition-colors shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed min-w-[44px]"
              title="검색"
            >
              {isSearching ? (
                <span className="animate-spin text-sm">⏳</span>
              ) : (
                <span className="text-lg">🔍</span>
              )}
            </button>
          </div>
          
          {/* 검색 결과 */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-10 bg-white dark:bg-stone-800 border border-border rounded shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((place) => (
                <button
                  key={place.id}
                  onClick={() => handleSelectPlace(place)}
                  className="w-full text-left p-3 hover:bg-stone-50 dark:hover:bg-stone-700 border-b border-border last:border-b-0 transition-colors"
                >
                  <div className="font-semibold text-sm text-foreground">
                    {place.placeName}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {place.roadAddress || place.address}
                  </div>
                  {place.categoryName && (
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {place.categoryName}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
          
          {showResults && searchResults.length === 0 && !isSearching && (
            <div className="absolute top-full left-0 right-0 mt-2 z-10 text-xs text-muted-foreground p-2 border border-border rounded bg-background shadow-lg">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 구분선 */}
      <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-border"></div>
      </div>

       {/* 주소 입력 */}
       <div className="flex flex-col">
        <label className="block text-xs font-semibold text-muted-foreground mb-1">
          주소 * (검색 결과가 자동 입력됩니다)
        </label>
        <input
          type="text"
          value={mapInfo.address || ''}
          onChange={(e) => onUpdate({
            ...mapInfo,
            address: e.target.value,
          })}
          className="w-full border border-border rounded p-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          placeholder="예: 서울 영등포구 양평로 58"
        />
        <p className="text-xs text-muted-foreground mt-1">
          * 검색 결과가 자동 입력되며 수정 가능합니다
        </p>
      </div>

      {/* 장소명 입력 */}
      <div className="flex flex-col">
        <label className="block text-xs font-semibold text-muted-foreground mb-1">
          장소명 수정 * (검색 결과가 자동 입력됩니다)
        </label>
        <input
          type="text"
          value={mapInfo.placeName || ''}
          onChange={(e) => onUpdate({
            ...mapInfo,
            placeName: e.target.value,
          })}
          className="w-full border border-border rounded p-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          placeholder="예: 당산동 그랜드 컨벤션 센타"
        />
        <p className="text-xs text-muted-foreground mt-1">
          * 주소 검색 시 건물명이 자동 입력됩니다 (수정 가능)
        </p>
      </div>

      {/* 상세 주소 입력 필드 */}
      <div className="flex flex-col">
        <label className="block text-xs font-semibold text-muted-foreground mb-1">
          상세 주소 (선택)
        </label>
        <input
          type="text"
          value={mapInfo.detailAddress || ''}
          onChange={(e) => onUpdate({
            ...mapInfo,
            detailAddress: e.target.value,
          })}
          className="w-full border border-border rounded p-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          placeholder="예: 3층 그랜드홀"
        />
      </div>

      {/* 다음 우편번호 서비스 팝업 */}
      {showAddressPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">주소 검색</h3>
              <button
                onClick={() => setShowAddressPopup(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <DaumPostcode 
                onComplete={handleAddressComplete}
                style={{ height: '450px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
