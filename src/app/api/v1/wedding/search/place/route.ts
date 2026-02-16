// app/api/search/place/route.ts
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/shared/utils/apiResponse';

// 카카오 로컬 API - 키워드로 장소 검색
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return errorResponse('검색어가 필요합니다.', 400, 'PLACE_SEARCH_001');
    }

    const restApiKey = process.env.KAKAO_REST_API_KEY;
    
    if (!restApiKey) {
      return errorResponse('카카오 REST API 키가 설정되지 않았습니다.', 500, 'PLACE_SEARCH_002');
    }

    // 카카오 로컬 API 호출
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=15`,
      {
        headers: {
          'Authorization': `KakaoAK ${restApiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('카카오 API 오류:', errorData);
      return errorResponse('장소 검색에 실패했습니다.', response.status, 'PLACE_SEARCH_003');
    }

    const data = await response.json();
    
    // 필요한 정보만 추출하여 반환
    interface KakaoPlaceDocument {
      id: string;
      place_name: string;
      address_name: string;
      road_address_name: string;
      phone: string;
      category_name: string;
      x: string;
      y: string;
      place_url: string;
    }

    const places = data.documents.map((doc: KakaoPlaceDocument) => ({
      id: doc.id,
      placeName: doc.place_name,
      address: doc.address_name,
      roadAddress: doc.road_address_name,
      phone: doc.phone,
      categoryName: doc.category_name,
      x: doc.x, // 경도
      y: doc.y, // 위도
      placeUrl: doc.place_url,
    }));

    return successResponse(
      {
        places,
        meta: data.meta,
      },
      '장소 검색이 성공적으로 완료되었습니다.'
    );
  } catch (error) {
    console.error('장소 검색 오류:', error);
    return errorResponse('장소 검색 중 오류가 발생했습니다.', 500, 'PLACE_SEARCH_004');
  }
}
