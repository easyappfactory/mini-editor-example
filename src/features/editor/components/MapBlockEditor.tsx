// features/editor/components/MapBlockEditor.tsx
'use client';

import { useState } from 'react';
import { MapInfo } from '@/shared/types/block';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
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

  const handleSelectPlace = (place: PlaceResult) => {
    onUpdate({
      placeName: place.placeName,
      address: place.roadAddress || place.address,
      detailAddress: mapInfo.detailAddress || '', // 기존 detailAddress 유지
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x),
    });
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleClear = () => {
    onUpdate({
      placeName: '',
      address: '',
      detailAddress: '',
      latitude: undefined,
      longitude: undefined,
    });
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 장소 검색 */}
      <div className="flex flex-col relative">
        <label className="block text-xs font-semibold text-muted-foreground mb-1">
          장소 검색 *
        </label>
        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="flex-1 border border-border rounded p-2 text-sm min-w-0 bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            placeholder="예: 그랜드 웨딩홀, 서울특별시 강남구..."
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-3 py-2 bg-stone-600 dark:bg-stone-700 text-white rounded text-sm font-semibold hover:bg-stone-700 dark:hover:bg-stone-600 disabled:bg-stone-400 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap transition-colors"
          >
            {isSearching ? (
              <>
                <span className="animate-spin">⏳</span>
                <span className="hidden sm:inline">검색 중...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span className="hidden sm:inline">검색</span>
              </>
            )}
          </button>
        </div>
        
        {/* 검색 결과 - absolute positioning으로 레이아웃에 영향 없도록 */}
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

      {/* 선택된 장소 정보 표시 */}
      {mapInfo.placeName && (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
          <div className="text-sm font-semibold text-foreground mb-1">
            선택된 장소: {mapInfo.placeName}
          </div>
          {mapInfo.address && (
            <div className="text-xs text-muted-foreground">
              {mapInfo.address}
            </div>
          )}
          <button
            onClick={handleClear}
            className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
          >
            선택 취소
          </button>
        </div>
      )}

      {/* 상세 주소 입력 필드 */}
      <div className="mt-2">
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
    </div>
  );
}
